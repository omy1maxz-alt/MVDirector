import { 
  GitHubCommitInfo, 
  IndexedRepoNode, 
  RepoIndexSummary, 
  RepoFileSnippet, 
  SearchCodeResultItem, 
  JulesTaskSpec, 
  RepoFreshnessStatus 
} from '../types/githubRepo';
import { 
  getCachedRepoIndex, 
  saveRepoIndex, 
  getCachedSnippet, 
  saveSnippet, 
  clearStaleRepoSnippets 
} from './githubContextCache';
import { getSavedGitHubToken } from './githubService';

const ANDROID_SOURCE_EXTENSIONS = new Set(['kt', 'java', 'xml', 'gradle', 'kts', 'properties', 'toml', 'json']);
const EXCLUDED_DIR_PREFIXES = ['build/', '.gradle/', '.git/', '.idea/', 'gradle/wrapper/'];

/**
 * Returns authorization headers if a token is present, else empty headers for public repo reads
 */
function getHeaders(customToken?: string): Record<string, string> {
  const token = customToken || getSavedGitHubToken();
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Fetches the latest commit SHA, commit message, author, and changed files/diff for a branch
 */
export async function getLatestCommit(
  owner: string, 
  repo: string, 
  branch = 'master', 
  token?: string
): Promise<GitHubCommitInfo> {
  const url = `https://api.github.com/repos/${owner}/${repo}/commits/${encodeURIComponent(branch)}`;
  const res = await fetch(url, { headers: getHeaders(token) });
  
  if (!res.ok) {
    throw new Error(`Failed to check latest commit (${res.status}): ${res.statusText}`);
  }
  
  const data = await res.json();
  const files = Array.isArray(data.files)
    ? data.files.map((f: any) => ({
        filename: f.filename,
        status: f.status,
        additions: f.additions || 0,
        deletions: f.deletions || 0,
        patch: f.patch,
      }))
    : undefined;

  return {
    sha: data.sha,
    message: data.commit?.message || '',
    authorName: data.commit?.author?.name || '',
    authorDate: data.commit?.author?.date || '',
    url: data.html_url || '',
    files,
  };
}

/**
 * Checks freshness of a repository branch index against GitHub remote
 */
export async function checkRepoFreshness(
  owner: string,
  repo: string,
  branch = 'master',
  token?: string
): Promise<{ status: RepoFreshnessStatus; currentSha: string; indexedSha?: string; latestCommit?: GitHubCommitInfo }> {
  try {
    const latest = await getLatestCommit(owner, repo, branch, token);
    const cached = await getCachedRepoIndex(owner, repo, branch);
    
    if (!cached) {
      return { status: 'stale', currentSha: latest.sha, latestCommit: latest };
    }
    
    if (cached.commitSha === latest.sha) {
      return { status: 'updated', currentSha: latest.sha, indexedSha: cached.commitSha, latestCommit: latest };
    }
    
    return { status: 'stale', currentSha: latest.sha, indexedSha: cached.commitSha, latestCommit: latest };
  } catch (err: any) {
    // Attempt fallback to cached index if offline or rate-limited
    try {
      const cached = await getCachedRepoIndex(owner, repo, branch);
      if (cached) {
        return { status: 'stale', currentSha: cached.commitSha, indexedSha: cached.commitSha };
      }
    } catch {
      // Ignore cache lookup error
    }
    console.warn('[GitHubRepoContext] Freshness check warning (offline or rate limit):', err?.message || 'Network error');
    return { status: 'error', currentSha: '', indexedSha: '' };
  }
}

/**
 * Fetches and builds the repository index (recursive Git tree)
 */
export async function fetchAndIndexRepo(
  owner: string,
  repo: string,
  branch = 'master',
  forceRefresh = false,
  token?: string
): Promise<RepoIndexSummary> {
  // Check cached index
  const cached = await getCachedRepoIndex(owner, repo, branch);
  const latestCommit = await getLatestCommit(owner, repo, branch, token);

  if (!forceRefresh && cached && cached.commitSha === latestCommit.sha) {
    return cached;
  }

  // Fetch full recursive git tree using the commit SHA
  const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${latestCommit.sha}?recursive=1`;
  const res = await fetch(treeUrl, { headers: getHeaders(token) });

  if (!res.ok) {
    throw new Error(`Failed to fetch repo tree from GitHub (${res.status}): ${res.statusText}`);
  }

  const data = await res.json();
  const rawTree: Array<{ path: string; mode: string; type: string; sha: string; size?: number; url: string }> = data.tree || [];

  const indexedFiles: IndexedRepoNode[] = [];
  const symbolMap: Record<string, string[]> = {};

  for (const node of rawTree) {
    if (node.type !== 'blob') continue;

    const path = node.path;
    // Skip build directories, Gradle caches, etc.
    if (EXCLUDED_DIR_PREFIXES.some(prefix => path.startsWith(prefix))) continue;

    const parts = path.split('.');
    const ext = parts.length > 1 ? parts.pop()!.toLowerCase() : '';

    const isAndroidSource = 
      ANDROID_SOURCE_EXTENSIONS.has(ext) || 
      path.endsWith('AndroidManifest.xml') || 
      path.endsWith('gradle.properties');

    indexedFiles.push({
      path,
      mode: node.mode,
      type: 'blob',
      sha: node.sha,
      size: node.size,
      url: node.url,
      extension: ext,
      isAndroidSource,
    });

    // Populate symbol index by class/file name
    const fileName = path.split('/').pop() || '';
    const baseName = fileName.replace(/\.[^.]+$/, '');
    if (baseName) {
      if (!symbolMap[baseName.toLowerCase()]) {
        symbolMap[baseName.toLowerCase()] = [];
      }
      symbolMap[baseName.toLowerCase()].push(path);
    }
  }

  // Clear stale cached snippets if commit changed
  if (cached && cached.commitSha !== latestCommit.sha) {
    await clearStaleRepoSnippets(owner, repo);
  }

  const summary: RepoIndexSummary = {
    owner,
    repo,
    branch,
    commitSha: latestCommit.sha,
    indexedAt: Date.now(),
    totalFiles: rawTree.length,
    androidSourceFiles: indexedFiles.filter(f => f.isAndroidSource).length,
    files: indexedFiles,
    symbolMap,
  };

  await saveRepoIndex(summary);
  return summary;
}

/**
 * Retrieves raw file content from GitHub with exact line range support and symbol targeting
 */
export async function readRepoFileSnippet(options: {
  owner: string;
  repo: string;
  commitSha: string;
  path: string;
  startLine?: number;
  endLine?: number;
  symbol?: string;
  token?: string;
}): Promise<RepoFileSnippet> {
  const { owner, repo, commitSha, path, startLine = 1, endLine, symbol, token } = options;

  // Check cache first for full file or exact range
  const cached = await getCachedSnippet(owner, repo, commitSha, path, startLine, endLine || 0);
  if (cached && !symbol) {
    return cached;
  }

  // Fetch file raw content using ref/commit SHA
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(commitSha)}`;
  const headers = getHeaders(token);
  headers['Accept'] = 'application/vnd.github.v3.raw';

  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`Failed to read file ${path} from ${commitSha.slice(0, 7)}: ${res.statusText}`);
  }

  const rawContent = await res.text();
  const allLines = rawContent.split('\n');
  const totalLines = allLines.length;

  let finalStart = Math.max(1, startLine);
  let finalEnd = endLine ? Math.min(totalLines, endLine) : totalLines;

  // If a specific symbol (function name or class name) is requested, locate its line range
  if (symbol && symbol.trim()) {
    const symTrim = symbol.trim();
    const symRegex = new RegExp(`\\b(fun|class|interface|object|val|var)\\s+${symTrim}\\b`, 'i');
    
    let foundLine = -1;
    for (let i = 0; i < allLines.length; i++) {
      if (symRegex.test(allLines[i]) || allLines[i].includes(symTrim)) {
        foundLine = i + 1; // 1-indexed
        break;
      }
    }

    if (foundLine !== -1) {
      // Extract generous surrounding context (e.g. 50 lines before/after or until closing brace)
      finalStart = Math.max(1, foundLine - 5);
      finalEnd = Math.min(totalLines, foundLine + 65);
    }
  }

  const selectedLines = allLines.slice(finalStart - 1, finalEnd).join('\n');
  const ext = path.split('.').pop()?.toLowerCase() || 'text';

  const snippet: RepoFileSnippet = {
    path,
    commitSha,
    startLine: finalStart,
    endLine: finalEnd,
    totalLines,
    content: selectedLines,
    language: ext === 'kt' ? 'kotlin' : ext === 'java' ? 'java' : ext === 'xml' ? 'xml' : ext,
  };

  await saveSnippet(owner, repo, commitSha, snippet);
  return snippet;
}

/**
 * Searches repository files and content for classes, functions, string literals, and imports
 */
export async function searchRepoCode(options: {
  owner: string;
  repo: string;
  branch?: string;
  commitSha?: string;
  query: string;
  filePattern?: string;
  token?: string;
}): Promise<SearchCodeResultItem[]> {
  const { owner, repo, branch = 'master', query, filePattern, token } = options;
  if (!query || !query.trim()) return [];

  const index = await fetchAndIndexRepo(owner, repo, branch, false, token);
  const cleanQuery = query.trim().toLowerCase();

  const results: SearchCodeResultItem[] = [];

  // Filter candidates from indexed files
  const candidates = index.files.filter(f => {
    if (!f.isAndroidSource) return false;
    if (filePattern && !f.path.toLowerCase().includes(filePattern.toLowerCase())) {
      return false;
    }
    return true;
  });

  // 1. Direct path/file name matching
  for (const file of candidates) {
    const fileName = file.path.split('/').pop() || '';
    if (fileName.toLowerCase().includes(cleanQuery) || file.path.toLowerCase().includes(cleanQuery)) {
      results.push({
        path: file.path,
        sha: file.sha,
        matches: [{
          lineNumber: 1,
          lineContent: `[File match]: ${file.path}`,
          matchedTerm: query,
        }],
        symbolsFound: [fileName],
      });
    }
  }

  // 2. Prioritize key source files to scan contents for terms (like "m3u8", "isMediaUrl", "HlsDownloadHelper")
  // Limit deep content searches to top relevant candidates to avoid network floods
  const topFilesToInspect = candidates
    .filter(f => f.path.endsWith('.kt') || f.path.endsWith('.java') || f.path.endsWith('.xml'))
    .slice(0, 15);

  const searchPromises = topFilesToInspect.map(async file => {
    try {
      const snippet = await readRepoFileSnippet({
        owner,
        repo,
        commitSha: index.commitSha,
        path: file.path,
        token,
      });

      const lines = snippet.content.split('\n');
      const matchedLines: Array<{ lineNumber: number; lineContent: string; matchedTerm: string }> = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.toLowerCase().includes(cleanQuery)) {
          matchedLines.push({
            lineNumber: snippet.startLine + i,
            lineContent: line.trim(),
            matchedTerm: query,
          });
          if (matchedLines.length >= 8) break; // cap per file
        }
      }

      if (matchedLines.length > 0) {
        return {
          path: file.path,
          sha: file.sha,
          matches: matchedLines,
        };
      }
    } catch {
      // ignore individual read errors during bulk search
    }
    return null;
  });

  const contentResults = (await Promise.all(searchPromises)).filter(Boolean) as SearchCodeResultItem[];

  // Merge content matches with path matches without duplicates
  const seenPaths = new Set<string>();
  const finalResults: SearchCodeResultItem[] = [];

  for (const item of [...contentResults, ...results]) {
    if (!seenPaths.has(item.path)) {
      seenPaths.add(item.path);
      finalResults.push(item);
    }
  }

  return finalResults.slice(0, 20);
}

/**
 * Fetches recent commits from Jules / repository
 */
export async function getRecentCommits(
  owner: string,
  repo: string,
  branch = 'master',
  limit = 10,
  token?: string
): Promise<GitHubCommitInfo[]> {
  const url = `https://api.github.com/repos/${owner}/${repo}/commits?sha=${encodeURIComponent(branch)}&per_page=${limit}`;
  const res = await fetch(url, { headers: getHeaders(token) });
  if (!res.ok) {
    throw new Error(`Failed to fetch commits (${res.status}): ${res.statusText}`);
  }

  const data = await res.json();
  return (data || []).map((c: any) => ({
    sha: c.sha,
    message: c.commit?.message || '',
    authorName: c.commit?.author?.name || '',
    authorDate: c.commit?.author?.date || '',
    url: c.html_url || '',
  }));
}

/**
 * Compares two commits/refs for regression analysis
 */
export async function getCommitDiff(
  owner: string,
  repo: string,
  base: string,
  head: string,
  token?: string
): Promise<{ status: string; aheadBy: number; behindBy: number; files: Array<{ filename: string; status: string; additions: number; deletions: number; patch?: string }> }> {
  const url = `https://api.github.com/repos/${owner}/${repo}/compare/${encodeURIComponent(base)}...${encodeURIComponent(head)}`;
  const res = await fetch(url, { headers: getHeaders(token) });
  if (!res.ok) {
    throw new Error(`Failed to compare commits ${base}...${head} (${res.status}): ${res.statusText}`);
  }

  const data = await res.json();
  return {
    status: data.status,
    aheadBy: data.ahead_by || 0,
    behindBy: data.behind_by || 0,
    files: (data.files || []).map((f: any) => ({
      filename: f.filename,
      status: f.status,
      additions: f.additions,
      deletions: f.deletions,
      patch: f.patch,
    })),
  };
}

/**
 * Formats a clean, structured Jules-Ready Task specification markdown
 */
export function formatJulesTaskMarkdown(spec: JulesTaskSpec): string {
  return `### 📋 JULES TASK: ${spec.title}
* **Repository**: \`${spec.repository}\`
* **Branch**: \`${spec.branch}\`
* **Base Commit Analyzed**: \`${spec.baseCommitSha}\`
* **Target Environment**: ${spec.targetEnvironment || 'AndroidIDE on Poco F5'}

---

#### 1. Problem Statement & Verified Symptoms
${spec.problemStatement}

#### 2. Evidence & Root Cause Analysis
* **[CONFIRMED]**:
${spec.findings.confirmed.map(c => `  - ${c}`).join('\n') || '  - None verified yet.'}

* **[LIKELY]**:
${spec.findings.likely.map(l => `  - ${l}`).join('\n') || '  - None.'}

* **[HYPOTHESES]**:
${spec.findings.hypotheses.map(h => `  - ${h}`).join('\n') || '  - None.'}

#### 3. Target Files & Key Functions
${spec.targetFiles.map(tf => `- \`${tf.path}\`
  - Targets: ${tf.classesOrFunctions.join(', ')}
  - Details: ${tf.description}`).join('\n\n')}

#### 4. Exact Implementation Requirements for Jules
${spec.requirements.map((r, i) => `${i + 1}. ${r}`).join('\n')}

#### 5. Constraints & Invariants (DO NOT BREAK)
${spec.constraints.map(c => `- ${c}`).join('\n')}

#### 6. AndroidIDE Build & Poco F5 Test Plan
* **Build Command**: \`./gradlew assembleDebug\` in AndroidIDE
* **Device Steps**:
${spec.testPlan.map(t => `- ${t}`).join('\n')}
`;
}
