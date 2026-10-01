export interface GitHubCommitFileChange {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  patch?: string;
}

export interface GitHubCommitInfo {
  sha: string;
  message: string;
  authorName: string;
  authorDate: string;
  url: string;
  files?: GitHubCommitFileChange[];
}

export interface IndexedRepoNode {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
  url: string;
  extension: string;
  isAndroidSource: boolean; // .kt, .java, .xml, .gradle.kts, AndroidManifest.xml
}

export interface RepoIndexSummary {
  owner: string;
  repo: string;
  branch: string;
  commitSha: string;
  indexedAt: number;
  totalFiles: number;
  androidSourceFiles: number;
  files: IndexedRepoNode[];
  // Quick lookup cache of extracted symbols/classes to paths
  symbolMap?: Record<string, string[]>; 
}

export interface RepoFileSnippet {
  path: string;
  commitSha: string;
  startLine: number;
  endLine: number;
  totalLines: number;
  content: string;
  language: string;
}

export interface SearchCodeResultItem {
  path: string;
  sha: string;
  matches: Array<{
    lineNumber: number;
    lineContent: string;
    matchedTerm: string;
  }>;
  symbolsFound?: string[];
}

export interface JulesTaskSpec {
  title: string;
  repository: string;
  branch: string;
  baseCommitSha: string;
  targetEnvironment: string; // e.g. "AndroidIDE on Poco F5"
  problemStatement: string;
  findings: {
    confirmed: string[];
    likely: string[];
    hypotheses: string[];
  };
  targetFiles: Array<{
    path: string;
    classesOrFunctions: string[];
    description: string;
  }>;
  requirements: string[];
  constraints: string[];
  validationSteps: string[];
  testPlan: string[];
}

export type RepoFreshnessStatus = 'updated' | 'stale' | 'checking' | 'error' | 'disconnected';
