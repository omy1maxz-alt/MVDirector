export interface GitHubRepoItem {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: 'file' | 'dir';
}

export interface GitHubRepoFile {
  name: string;
  path: string;
  content: string;
  encoding?: string;
  size: number;
  html_url: string;
}

export interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  name?: string;
  public_repos: number;
  tokenType?: 'classic' | 'fine_grained';
  rateLimitRemaining?: number;
  rateLimitTotal?: number;
}

const GITHUB_TOKEN_KEY_PRIMARY = 'kie_chat_github_token';
const GITHUB_TOKEN_KEY_SECONDARY = 'github_personal_access_token';
const GITHUB_SAVED_REPOS_KEY = 'kie_chat_github_saved_repos';

/**
 * Clean token string: strips whitespace, surrounding quotes, or accidental "Bearer "/"token " prefix
 */
export function cleanGitHubToken(rawToken: string): string {
  if (!rawToken) return '';
  return rawToken
    .trim()
    .replace(/^["']|["']$/g, '')
    .replace(/^bearer\s+/i, '')
    .replace(/^token\s+/i, '')
    .trim();
}

/**
 * Retrieves the saved GitHub token from localStorage, checking both primary and secondary keys
 */
export function getSavedGitHubToken(): string {
  try {
    const t = 
      localStorage.getItem(GITHUB_TOKEN_KEY_PRIMARY) ||
      localStorage.getItem(GITHUB_TOKEN_KEY_SECONDARY) ||
      localStorage.getItem('github_pat') ||
      localStorage.getItem('github_token') ||
      '';
    return cleanGitHubToken(t);
  } catch {
    return '';
  }
}

/**
 * Persists the GitHub token across both storage keys
 */
export function saveGitHubToken(token: string): void {
  const cleaned = cleanGitHubToken(token);
  try {
    if (cleaned) {
      localStorage.setItem(GITHUB_TOKEN_KEY_PRIMARY, cleaned);
      localStorage.setItem(GITHUB_TOKEN_KEY_SECONDARY, cleaned);
    } else {
      localStorage.removeItem(GITHUB_TOKEN_KEY_PRIMARY);
      localStorage.removeItem(GITHUB_TOKEN_KEY_SECONDARY);
    }
  } catch (e) {
    console.error('Failed to save GitHub token:', e);
  }
}

export function getSavedGitHubRepos(): string[] {
  try {
    const raw = localStorage.getItem(GITHUB_SAVED_REPOS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveGitHubRepo(repoFullName: string): void {
  try {
    const existing = getSavedGitHubRepos();
    const cleaned = repoFullName.trim();
    if (!cleaned) return;
    const updated = [cleaned, ...existing.filter(r => r.toLowerCase() !== cleaned.toLowerCase())].slice(0, 10);
    localStorage.setItem(GITHUB_SAVED_REPOS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save repo:', e);
  }
}

export function removeSavedGitHubRepo(repoFullName: string): string[] {
  try {
    const existing = getSavedGitHubRepos();
    const cleaned = repoFullName.trim().toLowerCase();
    const updated = existing.filter(r => r.toLowerCase() !== cleaned);
    localStorage.setItem(GITHUB_SAVED_REPOS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to remove saved repo:', e);
    return [];
  }
}

export function clearSavedGitHubRepos(): void {
  try {
    localStorage.removeItem(GITHUB_SAVED_REPOS_KEY);
    localStorage.removeItem('mv_studio_git_repo_config');
  } catch (e) {
    console.error('Failed to clear saved repos:', e);
  }
}

/**
 * Formats proper Authorization header for GitHub API
 * Classic tokens (ghp_) work best with 'token <PAT>' or 'Bearer <PAT>'
 * Fine-grained tokens (github_pat_) require 'Bearer <PAT>'
 */
export function getGitHubAuthHeaders(token?: string): Record<string, string> {
  const activeToken = cleanGitHubToken(token || getSavedGitHubToken());
  if (!activeToken) {
    return {};
  }
  const authVal = activeToken.startsWith('github_pat_')
    ? `Bearer ${activeToken}`
    : activeToken.startsWith('ghp_')
      ? `token ${activeToken}`
      : `Bearer ${activeToken}`;

  return {
    'Authorization': authVal,
  };
}

/**
 * Universal token verification supporting both Classic PATs (ghp_) and Fine-Grained PATs (github_pat_)
 * Note: Fine-Grained tokens with repository-only scopes return 403 on /user, but succeed on /rate_limit.
 */
export async function fetchGitHubUser(token: string): Promise<GitHubUser> {
  const cleaned = cleanGitHubToken(token);
  if (!cleaned) {
    throw new Error('Please enter a GitHub Personal Access Token');
  }

  const isFineGrained = cleaned.startsWith('github_pat_');
  const authHeaders = getGitHubAuthHeaders(cleaned);

  // 1. Try /user endpoint
  let userRes: Response | null = null;
  try {
    userRes = await fetch('https://api.github.com/user', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        ...authHeaders,
      },
    });
  } catch (e: any) {
    throw new Error(`Network error connecting to GitHub API: ${e.message}`);
  }

  // If /user succeeds (Classic PAT with read:user, or fine-grained with user profile permission)
  if (userRes && userRes.ok) {
    const userData = await userRes.json();
    let rateRemaining: number | undefined = undefined;
    let rateLimit: number | undefined = undefined;

    // Fetch rate limit details
    try {
      const rlRes = await fetch('https://api.github.com/rate_limit', {
        headers: { 'Accept': 'application/vnd.github.v3+json', ...authHeaders },
      });
      if (rlRes.ok) {
        const rlData = await rlRes.json();
        rateRemaining = rlData.resources?.core?.remaining ?? rlData.rate?.remaining;
        rateLimit = rlData.resources?.core?.limit ?? rlData.rate?.limit;
      }
    } catch {
      // Non-blocking
    }

    return {
      login: userData.login || 'GitHub User',
      avatar_url: userData.avatar_url || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
      html_url: userData.html_url || `https://github.com/${userData.login || ''}`,
      name: userData.name || userData.login,
      public_repos: userData.public_repos ?? 0,
      tokenType: isFineGrained ? 'fine_grained' : 'classic',
      rateLimitRemaining: rateRemaining,
      rateLimitTotal: rateLimit,
    };
  }

  // 2. If /user returned 403 (Standard behavior for Fine-Grained PATs without user-info permission):
  // Verify token validity via /rate_limit
  try {
    const rlRes = await fetch('https://api.github.com/rate_limit', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        ...authHeaders,
      },
    });

    if (rlRes.ok) {
      const rlData = await rlRes.json();
      const remaining = rlData.resources?.core?.remaining ?? rlData.rate?.remaining ?? 5000;
      const limit = rlData.resources?.core?.limit ?? rlData.rate?.limit ?? 5000;

      return {
        login: isFineGrained ? 'Fine-Grained Token' : 'Authenticated PAT',
        avatar_url: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
        html_url: 'https://github.com',
        name: isFineGrained ? 'Fine-Grained PAT (Repository Scoped)' : 'GitHub Classic PAT',
        public_repos: 0,
        tokenType: isFineGrained ? 'fine_grained' : 'classic',
        rateLimitRemaining: remaining,
        rateLimitTotal: limit,
      };
    }

    if (rlRes.status === 401) {
      throw new Error('Invalid GitHub token (401 Bad credentials). Please check that your token is correct and not expired.');
    }
  } catch (err: any) {
    if (err.message && err.message.includes('401')) {
      throw err;
    }
  }

  if (userRes && userRes.status === 401) {
    throw new Error('Invalid GitHub token (401 Bad credentials). Please check that your token is correct and has not expired.');
  }

  if (userRes) {
    const errorBody = await userRes.text().catch(() => '');
    throw new Error(`GitHub Authentication failed (${userRes.status}): ${userRes.statusText || errorBody}`);
  }

  throw new Error('Failed to verify GitHub token. Please check your internet connection.');
}

/**
 * Parses repository input into owner, repo, branch, and file/folder path.
 * Supports:
 * - https://github.com/owner/repo/blob/master/path/to/file.ts
 * - https://github.com/owner/repo/tree/master/path/to/dir
 * - https://github.com/owner/repo/tree/master
 * - https://github.com/owner/repo/commits/master
 * - https://github.com/owner/repo/raw/master/path/to/file.ts
 * - https://raw.githubusercontent.com/owner/repo/master/path/to/file.ts
 * - https://github.com/owner/repo?ref=master or ?branch=master
 * - https://github.com/owner/repo#master
 * - owner/repo/tree/master
 * - owner/repo/blob/master/path
 * - owner/repo/commits/master
 * - owner/repo@master or owner/repo#master or owner/repo:master
 * - owner/repo
 */
export function parseGitHubUrlOrPath(input: string): { owner: string; repo: string; branch?: string; path?: string } | null {
  let cleaned = input.trim().replace(/^git@github\.com:/i, 'https://github.com/');
  if (!cleaned) return null;

  // Check for query param branch/ref like ?ref=master or ?branch=master
  let explicitQueryBranch: string | undefined;
  if (cleaned.includes('?')) {
    const queryPart = cleaned.split('?')[1]?.split('#')[0] || '';
    const searchParams = new URLSearchParams(queryPart);
    const refParam = searchParams.get('ref') || searchParams.get('branch');
    if (refParam) {
      explicitQueryBranch = refParam.trim();
    }
  }

  // Check for hash-based branch like owner/repo#master (ignoring line markers like #L1-L20)
  let explicitHashBranch: string | undefined;
  if (cleaned.includes('#')) {
    const hashPart = cleaned.split('#')[1]?.trim() || '';
    if (hashPart && !/^L\d+/i.test(hashPart)) {
      explicitHashBranch = hashPart;
    }
  }

  // Strip query parameters and line hashes for path extraction
  const stripped = cleaned.split('#')[0].split('?')[0].replace(/\/+$/, '');

  // Pattern 1: raw.githubusercontent.com/owner/repo/branch/path...
  const rawMatch = stripped.match(/raw\.githubusercontent\.com\/([^\/]+)\/([^\/]+)\/([^\/]+)(?:\/(.*))?$/i);
  if (rawMatch) {
    return {
      owner: rawMatch[1],
      repo: rawMatch[2].replace(/\.git$/i, ''),
      branch: rawMatch[3],
      path: rawMatch[4] || '',
    };
  }

  // Pattern 2: github.com/owner/repo/(blob|raw|tree|commits)/branch(/path)?
  const subMatch = stripped.match(/github\.com\/([^\/]+)\/([^\/]+)\/(?:blob|raw|tree|commits)\/([^\/]+)(?:\/(.*))?$/i);
  if (subMatch) {
    return {
      owner: subMatch[1],
      repo: subMatch[2].replace(/\.git$/i, ''),
      branch: subMatch[3],
      path: subMatch[4] || '',
    };
  }

  // Pattern 3: github.com/owner/repo
  const repoUrlMatch = stripped.match(/github\.com\/([^\/]+)\/([^\/]+)$/i);
  if (repoUrlMatch) {
    return {
      owner: repoUrlMatch[1],
      repo: repoUrlMatch[2].replace(/\.git$/i, ''),
      branch: explicitQueryBranch || explicitHashBranch,
      path: '',
    };
  }

  // Pattern 4: owner/repo/(blob|raw|tree|commits)/branch(/path)? (without domain)
  const shortBlobMatch = stripped.match(/^([a-zA-Z0-9_\-\.]+)\/([a-zA-Z0-9_\-\.]+)\/(?:blob|raw|tree|commits)\/([^\/]+)(?:\/(.*))?$/i);
  if (shortBlobMatch) {
    return {
      owner: shortBlobMatch[1],
      repo: shortBlobMatch[2].replace(/\.git$/i, ''),
      branch: shortBlobMatch[3],
      path: shortBlobMatch[4] || '',
    };
  }

  // Pattern 5: owner/repo@branch or owner/repo#branch or owner/repo:branch
  const atMatch = stripped.match(/^([a-zA-Z0-9_\-\.]+)\/([a-zA-Z0-9_\-\.]+)[:@]([a-zA-Z0-9_\-\.\/]+)$/);
  if (atMatch) {
    return {
      owner: atMatch[1],
      repo: atMatch[2].replace(/\.git$/i, ''),
      branch: atMatch[3],
      path: '',
    };
  }

  // Pattern 6: owner/repo
  const simpleMatch = stripped.match(/^([a-zA-Z0-9_\-\.]+)\/([a-zA-Z0-9_\-\.]+)$/);
  if (simpleMatch) {
    return {
      owner: simpleMatch[1],
      repo: simpleMatch[2].replace(/\.git$/i, ''),
      branch: explicitQueryBranch || explicitHashBranch,
      path: '',
    };
  }

  return null;
}

/**
 * Fetches repository metadata from GitHub to obtain the authoritative default branch and repo info
 */
export async function fetchGitHubRepoMetadata(
  owner: string,
  repo: string,
  token?: string
): Promise<{ defaultBranch: string; description?: string; isPrivate?: boolean } | null> {
  const activeToken = cleanGitHubToken(token || getSavedGitHubToken());
  const url = `https://api.github.com/repos/${owner}/${repo}`;
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    ...getGitHubAuthHeaders(activeToken),
  };
  try {
    const res = await fetch(url, { headers });
    if (res.ok) {
      const data = await res.json();
      return {
        defaultBranch: data.default_branch || 'main',
        description: data.description,
        isPrivate: data.private,
      };
    }
  } catch (err) {
    console.warn('[GitHubService] Failed to fetch repo metadata:', err);
  }
  return null;
}

/**
 * List files and directories in a repository path with automatic token resolution and descriptive error guidance
 */
export async function fetchGitHubRepoContents(
  owner: string,
  repo: string,
  path: string = '',
  ref?: string,
  token?: string
): Promise<GitHubRepoItem[]> {
  const activeToken = cleanGitHubToken(token || getSavedGitHubToken());
  let url = `https://api.github.com/repos/${owner}/${repo}/contents/${path.replace(/^\//, '')}`;
  if (ref) {
    url += `?ref=${encodeURIComponent(ref)}`;
  }

  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    ...getGitHubAuthHeaders(activeToken),
  };

  const res = await fetch(url, { headers });
  if (!res.ok) {
    if (res.status === 404) {
      if (!activeToken) {
        throw new Error(
          `Repository "${owner}/${repo}" was not found or is private. If this is a private repo, please add your GitHub Personal Access Token in the Token & Auth tab.`
        );
      } else {
        throw new Error(
          `Repository or path "${owner}/${repo}${path ? '/' + path : ''}" could not be accessed (404 Not Found). Please verify: (1) Spelling is correct. (2) If it is a private repo, ensure your token has "repo" scope (Classic) or "Contents: Read" with access to this repository (Fine-grained). (3) For organization repos, check if SAML SSO authorization is required.`
        );
      }
    } else if (res.status === 403) {
      const errorMsg = await res.json().catch(() => ({}));
      if (errorMsg.message && errorMsg.message.toLowerCase().includes('rate limit')) {
        throw new Error('GitHub API rate limit exceeded (60 requests/hr for unauthenticated requests). Please save your GitHub Personal Access Token in Token & Auth to get 5,000 requests/hr.');
      }
      throw new Error(`GitHub API access forbidden (403): ${errorMsg.message || 'Check your token repository permissions.'}`);
    }
    throw new Error(`GitHub API error (${res.status}): ${res.statusText}`);
  }

  const data = await res.json();
  if (Array.isArray(data)) {
    return data;
  }
  // Single file returned
  return [data];
}

/**
 * Fetches file content from GitHub and decodes UTF-8 text safely.
 * Uses 'Accept: application/vnd.github.v3.raw' to fetch directly from authenticated API for all file sizes.
 */
export async function fetchGitHubFileContent(
  owner: string,
  repo: string,
  filePath: string,
  ref?: string,
  token?: string
): Promise<string> {
  const activeToken = cleanGitHubToken(token || getSavedGitHubToken());
  const cleanPath = filePath.replace(/^\//, '');

  let rawUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}`;
  if (ref) {
    rawUrl += `?ref=${encodeURIComponent(ref)}`;
  }

  const authHeaders = getGitHubAuthHeaders(activeToken);

  // Method 1: Fetch raw content directly from GitHub API with authentication headers
  try {
    const rawRes = await fetch(rawUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3.raw',
        ...authHeaders,
      },
    });

    if (rawRes.ok) {
      return await rawRes.text();
    }
  } catch {
    // Fall back to JSON metadata inspection
  }

  // Method 2: Standard JSON contents API with Base64 decode
  const metaRes = await fetch(rawUrl, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      ...authHeaders,
    },
  });

  if (!metaRes.ok) {
    if (metaRes.status === 404) {
      throw new Error(`File not found: "${cleanPath}" in repository ${owner}/${repo}`);
    }
    throw new Error(`Could not fetch file (${metaRes.status}): ${metaRes.statusText}`);
  }

  const data = await metaRes.json();
  if (data.type !== 'file') {
    throw new Error(`Target is not a file: ${filePath}`);
  }

  if (data.encoding === 'base64' && data.content) {
    const cleanB64 = data.content.replace(/\s+/g, '');
    const binary = atob(cleanB64);
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(bytes);
  }

  // Method 3: Download URL with authorization headers
  if (data.download_url) {
    const dlRes = await fetch(data.download_url, {
      headers: authHeaders,
    });
    if (dlRes.ok) {
      return await dlRes.text();
    }
  }

  return data.content || '';
}

export interface CommitFileOptions {
  owner: string;
  repo: string;
  filePath: string;
  content: string;
  commitMessage?: string;
  branch?: string;
  token?: string;
  authorName?: string;
  authorEmail?: string;
}

/**
 * Commits or creates a file directly in a GitHub repository using a PAT with repo permissions.
 */
export async function commitFileToGitHub(options: CommitFileOptions): Promise<{ commitSha: string; htmlUrl: string; isNew: boolean }> {
  const activeToken = cleanGitHubToken(options.token || getSavedGitHubToken());
  if (!activeToken) {
    throw new Error('A GitHub Personal Access Token with repo (write) permissions is required to commit files.');
  }

  const cleanPath = options.filePath.replace(/^\//, '');
  const branch = options.branch || 'main';
  const authHeaders = getGitHubAuthHeaders(activeToken);

  // 1. Check if the file already exists on target branch to obtain its current SHA
  let existingSha: string | undefined;
  try {
    const metaRes = await fetch(
      `https://api.github.com/repos/${options.owner}/${options.repo}/contents/${cleanPath}?ref=${encodeURIComponent(branch)}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          ...authHeaders,
        },
      }
    );
    if (metaRes.ok) {
      const data = await metaRes.json();
      existingSha = data.sha;
    }
  } catch {
    // If not found, it's a new file
  }

  // 2. Encode UTF-8 content to base64 safely
  const encoder = new TextEncoder();
  const bytes = encoder.encode(options.content);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64Content = btoa(binary);

  // 3. Construct payload for PUT /repos/{owner}/{repo}/contents/{path}
  const body: Record<string, any> = {
    message: options.commitMessage || `Update ${cleanPath} via MV Director AI`,
    content: base64Content,
    branch: branch,
  };

  if (existingSha) {
    body.sha = existingSha;
  }

  if (options.authorName && options.authorEmail) {
    body.author = {
      name: options.authorName,
      email: options.authorEmail,
    };
    body.committer = {
      name: options.authorName,
      email: options.authorEmail,
    };
  }

  // 4. Send PUT request
  const putRes = await fetch(`https://api.github.com/repos/${options.owner}/${options.repo}/contents/${cleanPath}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json',
      ...authHeaders,
    },
    body: JSON.stringify(body),
  });

  if (!putRes.ok) {
    let errorDetail = '';
    try {
      const errJson = await putRes.json();
      errorDetail = errJson.message || JSON.stringify(errJson);
    } catch {
      errorDetail = await putRes.text();
    }
    throw new Error(`GitHub Commit failed (${putRes.status}): ${errorDetail}`);
  }

  const result = await putRes.json();
  return {
    commitSha: result.commit?.sha || '',
    htmlUrl: result.content?.html_url || `https://github.com/${options.owner}/${options.repo}/blob/${branch}/${cleanPath}`,
    isNew: !existingSha,
  };
}

/**
 * Fetches available branch names for a repository
 */
export async function fetchGitHubBranches(
  owner: string,
  repo: string,
  token?: string
): Promise<string[]> {
  const activeToken = cleanGitHubToken(token || getSavedGitHubToken());
  const url = `https://api.github.com/repos/${owner}/${repo}/branches?per_page=50`;
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    ...getGitHubAuthHeaders(activeToken),
  };
  try {
    const res = await fetch(url, { headers });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data.map((b: any) => b.name).filter(Boolean);
      }
    }
  } catch (err) {
    console.warn('[GitHubService] Failed to fetch branches:', err);
  }
  return [];
}

