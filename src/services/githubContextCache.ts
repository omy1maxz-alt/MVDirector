import { get, set, del } from 'idb-keyval';
import { RepoIndexSummary, RepoFileSnippet } from '../types/githubRepo';

const IDB_INDEX_PREFIX = 'mv_repo_index_';
const IDB_SNIPPET_PREFIX = 'mv_repo_snippet_';

// In-memory fast caches
const memorySnippetCache = new Map<string, RepoFileSnippet>();
const memoryIndexCache = new Map<string, RepoIndexSummary>();

function makeIndexKey(owner: string, repo: string, branch: string): string {
  return `${owner.toLowerCase()}/${repo.toLowerCase()}:${branch}`;
}

function makeSnippetKey(owner: string, repo: string, commitSha: string, path: string, startLine: number, endLine: number): string {
  return `${owner.toLowerCase()}/${repo.toLowerCase()}@${commitSha}:${path}:${startLine}-${endLine}`;
}

/**
 * Saves repository tree index into both memory and IndexedDB
 */
export async function saveRepoIndex(index: RepoIndexSummary): Promise<void> {
  const key = makeIndexKey(index.owner, index.repo, index.branch);
  memoryIndexCache.set(key, index);
  try {
    await set(`${IDB_INDEX_PREFIX}${key}`, index);
  } catch (e) {
    console.warn('[GitHubCache] Failed to persist repo index to IndexedDB:', e);
  }
}

/**
 * Retrieves cached repository index
 */
export async function getCachedRepoIndex(owner: string, repo: string, branch: string): Promise<RepoIndexSummary | null> {
  const key = makeIndexKey(owner, repo, branch);
  if (memoryIndexCache.has(key)) {
    return memoryIndexCache.get(key)!;
  }
  try {
    const fromIdb = await get<RepoIndexSummary>(`${IDB_INDEX_PREFIX}${key}`);
    if (fromIdb) {
      memoryIndexCache.set(key, fromIdb);
      return fromIdb;
    }
  } catch (e) {
    console.warn('[GitHubCache] Error reading repo index from IndexedDB:', e);
  }
  return null;
}

/**
 * Saves exact retrieved source snippet
 */
export async function saveSnippet(
  owner: string,
  repo: string,
  commitSha: string,
  snippet: RepoFileSnippet
): Promise<void> {
  const key = makeSnippetKey(owner, repo, commitSha, snippet.path, snippet.startLine, snippet.endLine);
  memorySnippetCache.set(key, snippet);
  try {
    await set(`${IDB_SNIPPET_PREFIX}${key}`, snippet);
  } catch (e) {
    console.warn('[GitHubCache] Failed to persist snippet to IndexedDB:', e);
  }
}

/**
 * Retrieves exact cached snippet if available
 */
export async function getCachedSnippet(
  owner: string,
  repo: string,
  commitSha: string,
  path: string,
  startLine: number,
  endLine: number
): Promise<RepoFileSnippet | null> {
  const key = makeSnippetKey(owner, repo, commitSha, path, startLine, endLine);
  if (memorySnippetCache.has(key)) {
    return memorySnippetCache.get(key)!;
  }
  try {
    const fromIdb = await get<RepoFileSnippet>(`${IDB_SNIPPET_PREFIX}${key}`);
    if (fromIdb) {
      memorySnippetCache.set(key, fromIdb);
      return fromIdb;
    }
  } catch (e) {
    console.warn('[GitHubCache] Error reading snippet from IndexedDB:', e);
  }
  return null;
}

/**
 * Clears old snippets when a commit changes
 */
export async function clearStaleRepoSnippets(owner: string, repo: string): Promise<void> {
  const prefix = `${owner.toLowerCase()}/${repo.toLowerCase()}@`;
  for (const k of Array.from(memorySnippetCache.keys())) {
    if (k.startsWith(prefix)) {
      memorySnippetCache.delete(k);
    }
  }
}
