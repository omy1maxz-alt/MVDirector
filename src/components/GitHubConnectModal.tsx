import React, { useState, useEffect } from 'react';
import { 
  X, Github, Key, FolderGit2, FileText, Folder, Check, 
  RefreshCw, ExternalLink, Download, Search, AlertCircle, ChevronRight, FileCode, Sliders,
  Trash2, Unlink, RotateCcw, GitBranch, ChevronDown
} from 'lucide-react';
import { 
  getSavedGitHubToken, 
  saveGitHubToken, 
  getSavedGitHubRepos, 
  saveGitHubRepo, 
  removeSavedGitHubRepo,
  clearSavedGitHubRepos,
  parseGitHubUrlOrPath, 
  fetchGitHubRepoContents, 
  fetchGitHubFileContent, 
  fetchGitHubUser,
  fetchGitHubRepoMetadata,
  fetchGitHubBranches,
  GitHubRepoItem,
  GitHubUser
} from '@/services/githubService';
import { FileAttachmentItem } from './CollapsibleFileAttachment';

export interface AttachContextMetadata {
  title: string;
  url?: string;
  filePayload?: FileAttachmentItem;
}

interface GitHubConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAttachContext?: (contextText: string, metadata: AttachContextMetadata) => void;
  onSelectRepo?: (repo: { owner: string; repo: string; branch: string }) => void;
  onClearLinkedRepo?: () => void;
}

interface PreviewFileState {
  name: string;
  path: string;
  owner: string;
  repo: string;
  branch: string;
  url?: string;
  content: string;
  lines: string[];
  totalLines: number;
  mode: 'full' | 'range';
  startLine: number;
  endLine: number;
}

export const GitHubConnectModal: React.FC<GitHubConnectModalProps> = ({
  isOpen,
  onClose,
  onAttachContext,
  onSelectRepo,
  onClearLinkedRepo,
}) => {
  const [token, setToken] = useState<string>('');
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repoInput, setRepoInput] = useState<string>('');
  const [currentRepo, setCurrentRepo] = useState<{ owner: string; repo: string; branch?: string } | null>(null);
  const [modalBranches, setModalBranches] = useState<string[]>([]);
  const [isLoadingModalBranches, setIsLoadingModalBranches] = useState<boolean>(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [items, setItems] = useState<GitHubRepoItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [recentRepos, setRecentRepos] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'browse' | 'quick_fetch' | 'settings'>('browse');

  // Interactive preview and line range selection state
  const [previewFile, setPreviewFile] = useState<PreviewFileState | null>(null);

  // Quick direct fetch state
  const [quickUrl, setQuickUrl] = useState<string>('');
  const [fetchingFile, setFetchingFile] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const savedToken = getSavedGitHubToken();
      setToken(savedToken);
      setRecentRepos(getSavedGitHubRepos());
      if (savedToken) {
        verifyToken(savedToken);
      }
    }
  }, [isOpen]);

  const verifyToken = async (tok: string) => {
    if (!tok.trim()) return;
    try {
      const u = await fetchGitHubUser(tok);
      setUser(u);
      setError(null);
    } catch {
      setUser(null);
    }
  };

  const handleSaveToken = async () => {
    saveGitHubToken(token);
    if (token.trim()) {
      setIsLoading(true);
      try {
        const u = await fetchGitHubUser(token);
        setUser(u);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Invalid GitHub token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      setUser(null);
      setError(null);
    }
  };

  const handleRemoveToken = () => {
    setToken('');
    saveGitHubToken('');
    setUser(null);
    setError(null);
  };

  /**
   * Resets active repository connection state in the modal,
   * allowing the user to select or search a new repository immediately.
   */
  const handleResetConnectionState = () => {
    setCurrentRepo(null);
    setCurrentPath('');
    setItems([]);
    setRepoInput('');
    setPreviewFile(null);
    setError(null);
    setIsLoading(false);
  };

  /**
   * Clears a linked repository from local storage (or the current active repository),
   * clears any persisted git config, resets the connection state, and updates the recent repos list.
   */
  const handleClearLinkedRepo = (repoToClear?: string) => {
    const targetRepo = repoToClear || (currentRepo ? `${currentRepo.owner}/${currentRepo.repo}` : undefined);
    
    if (targetRepo) {
      const updated = removeSavedGitHubRepo(targetRepo);
      setRecentRepos(updated);
    }
    
    // Clear active studio git repo configuration if it matches
    try {
      const activeStudioConfig = localStorage.getItem('mv_studio_git_repo_config');
      if (activeStudioConfig) {
        const parsed = JSON.parse(activeStudioConfig);
        if (!targetRepo || `${parsed.owner}/${parsed.repo}`.toLowerCase() === targetRepo.toLowerCase()) {
          localStorage.removeItem('mv_studio_git_repo_config');
        }
      }
    } catch {}

    // Reset component connection state
    handleResetConnectionState();

    if (onClearLinkedRepo) {
      onClearLinkedRepo();
    }
  };

  /**
   * Clears ALL linked repository entries from local storage and resets connection state.
   */
  const handleClearAllLinkedRepos = () => {
    clearSavedGitHubRepos();
    setRecentRepos([]);
    handleResetConnectionState();
    if (onClearLinkedRepo) {
      onClearLinkedRepo();
    }
  };

  const handleOpenRepo = async (targetRepoInput?: string) => {
    const inputToUse = targetRepoInput || repoInput;
    if (!inputToUse.trim()) return;
    setError(null);
    setIsLoading(true);

    const parsed = parseGitHubUrlOrPath(inputToUse);
    if (!parsed) {
      setError('Please provide a valid repository format (e.g. "facebook/react" or "https://github.com/facebook/react")');
      setIsLoading(false);
      return;
    }

    try {
      let branchToUse = parsed.branch;
      if (!branchToUse) {
        // Fetch metadata to check if default branch is master, main, or custom
        const meta = await fetchGitHubRepoMetadata(parsed.owner, parsed.repo, token).catch(() => null);
        if (meta?.defaultBranch) {
          branchToUse = meta.defaultBranch;
        } else {
          // If metadata query fails, try fetching available branches
          const branches = await fetchGitHubBranches(parsed.owner, parsed.repo, token).catch(() => []);
          branchToUse = branches.length > 0 ? branches[0] : 'master';
        }
      }

      const contents = await fetchGitHubRepoContents(parsed.owner, parsed.repo, parsed.path || '', branchToUse, token);
      const repoData = { owner: parsed.owner, repo: parsed.repo, branch: branchToUse };
      setCurrentRepo(repoData);
      setCurrentPath(parsed.path || '');
      setItems(contents);
      saveGitHubRepo(`${parsed.owner}/${parsed.repo}`);
      setRecentRepos(getSavedGitHubRepos());

      // Pre-load available branches for the repository in background
      fetchGitHubBranches(parsed.owner, parsed.repo, token).then(branches => {
        if (branches.length > 0) {
          setModalBranches(branches);
        }
      }).catch(() => {});

      if (onSelectRepo) {
        onSelectRepo(repoData);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load repository contents');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchBranch = async (newBranch: string) => {
    if (!currentRepo || !newBranch || newBranch === currentRepo.branch) return;
    setIsLoading(true);
    setError(null);
    setIsBranchDropdownOpen(false);
    try {
      const contents = await fetchGitHubRepoContents(currentRepo.owner, currentRepo.repo, currentPath || '', newBranch, token);
      const updated = { ...currentRepo, branch: newBranch };
      setCurrentRepo(updated);
      setItems(contents);
      if (onSelectRepo) {
        onSelectRepo(updated);
      }
    } catch (err: any) {
      setError(err.message || `Failed to switch to branch "${newBranch}"`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateFolder = async (folderPath: string) => {
    if (!currentRepo) return;
    setError(null);
    setIsLoading(true);
    try {
      const contents = await fetchGitHubRepoContents(currentRepo.owner, currentRepo.repo, folderPath, currentRepo.branch, token);
      setCurrentPath(folderPath);
      setItems(contents);
    } catch (err: any) {
      setError(err.message || 'Failed to navigate directory');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenFilePreview = async (item: GitHubRepoItem) => {
    if (!currentRepo) return;
    setIsLoading(true);
    setError(null);
    try {
      const content = await fetchGitHubFileContent(
        currentRepo.owner,
        currentRepo.repo,
        item.path,
        currentRepo.branch,
        token
      );
      const lines = content.split('\n');
      const totalLines = lines.length;
      const isLarge = totalLines > 300;
      setPreviewFile({
        name: item.name,
        path: item.path,
        owner: currentRepo.owner,
        repo: currentRepo.repo,
        branch: currentRepo.branch || 'master',
        url: item.html_url,
        content,
        lines,
        totalLines,
        mode: isLarge ? 'range' : 'full',
        startLine: 1,
        endLine: Math.min(totalLines, 150),
      });
    } catch (err: any) {
      setError(err.message || 'Failed to inspect file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmAttachPreview = () => {
    if (!previewFile) return;
    const { mode, startLine, endLine, lines, content, name, path, owner, repo, branch, url, totalLines } = previewFile;
    const isRange = mode === 'range' && !(startLine === 1 && endLine === totalLines);
    
    const selectedContent = isRange
      ? lines.slice(Math.max(0, startLine - 1), Math.min(lines.length, endLine)).join('\n')
      : content;
    const selectedLineCount = isRange ? Math.max(1, endLine - startLine + 1) : totalLines;
    const rangeInfo = isRange ? ` (Lines ${startLine}-${endLine})` : '';

    const formattedContext = `📁 **GitHub File: [${owner}/${repo}/${path}](${url || ''})${rangeInfo}**\n\`\`\`${name.split('.').pop() || ''}\n${selectedContent}\n\`\`\``;

    if (onAttachContext) {
      onAttachContext(formattedContext, {
        title: `${repo}/${name}${rangeInfo}`,
        url,
        filePayload: {
          name,
          path,
          repo: `${owner}/${repo}`,
          owner,
          branch,
          url,
          content: selectedContent,
          size: selectedContent.length,
          lineCount: selectedLineCount,
          range: isRange ? { start: startLine, end: endLine } : undefined,
        },
      });
    }
    setPreviewFile(null);
    onClose();
  };

  const handleAttachFile = async (item: GitHubRepoItem) => {
    if (!currentRepo) return;
    setIsLoading(true);
    setError(null);
    try {
      const content = await fetchGitHubFileContent(
        currentRepo.owner,
        currentRepo.repo,
        item.path,
        currentRepo.branch,
        token
      );
      const lines = content.split('\n');
      const totalLines = lines.length;

      // If file is large (> 400 lines), open range inspector instead of blindly dumping huge text
      if (totalLines > 400) {
        setPreviewFile({
          name: item.name,
          path: item.path,
          owner: currentRepo.owner,
          repo: currentRepo.repo,
          branch: currentRepo.branch || 'master',
          url: item.html_url,
          content,
          lines,
          totalLines,
          mode: 'range',
          startLine: 1,
          endLine: Math.min(totalLines, 200),
        });
        return;
      }

      const formattedContext = `📁 **GitHub File: [${currentRepo.owner}/${currentRepo.repo}/${item.path}](${item.html_url})**\n\`\`\`${item.name.split('.').pop() || ''}\n${content}\n\`\`\``;
      
      if (onAttachContext) {
        onAttachContext(formattedContext, {
          title: `${currentRepo.repo}/${item.name}`,
          url: item.html_url,
          filePayload: {
            name: item.name,
            path: item.path,
            repo: `${currentRepo.owner}/${currentRepo.repo}`,
            owner: currentRepo.owner,
            branch: currentRepo.branch || 'master',
            url: item.html_url,
            content,
            size: content.length,
            lineCount: totalLines,
          },
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to attach file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFetchUrl = async () => {
    if (!quickUrl.trim()) return;
    setError(null);
    setFetchingFile(true);

    const parsed = parseGitHubUrlOrPath(quickUrl);
    if (!parsed || !parsed.path) {
      setError('Please provide a direct file link (e.g. https://github.com/owner/repo/blob/main/src/index.ts)');
      setFetchingFile(false);
      return;
    }

    try {
      const content = await fetchGitHubFileContent(
        parsed.owner,
        parsed.repo,
        parsed.path,
        parsed.branch,
        token
      );

      const lines = content.split('\n');
      const totalLines = lines.length;
      const fileName = parsed.path.split('/').pop() || parsed.path;

      // If file is large (> 400 lines), open range inspector
      if (totalLines > 400) {
        setPreviewFile({
          name: fileName,
          path: parsed.path,
          owner: parsed.owner,
          repo: parsed.repo,
          branch: parsed.branch || 'master',
          url: quickUrl.trim(),
          content,
          lines,
          totalLines,
          mode: 'range',
          startLine: 1,
          endLine: Math.min(totalLines, 200),
        });
        setFetchingFile(false);
        return;
      }

      const formattedContext = `📁 **GitHub File: [${parsed.owner}/${parsed.repo}/${parsed.path}](${quickUrl.trim()})**\n\`\`\`${fileName.split('.').pop() || ''}\n${content}\n\`\`\``;

      if (onAttachContext) {
        onAttachContext(formattedContext, {
          title: `${parsed.repo}/${fileName}`,
          url: quickUrl.trim(),
          filePayload: {
            name: fileName,
            path: parsed.path,
            repo: `${parsed.owner}/${parsed.repo}`,
            owner: parsed.owner,
            branch: parsed.branch || 'master',
            url: quickUrl.trim(),
            content,
            size: content.length,
            lineCount: totalLines,
          },
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to fetch file content');
    } finally {
      setFetchingFile(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#121215] border border-white/15 rounded-2xl w-full max-w-2xl max-h-[90dvh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Interactive Preview & Line Range Overlay */}
        {previewFile && (
          <div className="absolute inset-0 z-30 bg-[#121215] flex flex-col p-4 animate-in fade-in">
            {/* Preview Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shrink-0">
                  <FileCode className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-white font-mono truncate">{previewFile.name}</h3>
                  <p className="text-[11px] text-white/50 font-mono">
                    {previewFile.totalLines} lines • {(previewFile.content.length / 1024).toFixed(1)} KB • {previewFile.repo}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setPreviewFile(null)}
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                title="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Large file advisory banner */}
            {previewFile.totalLines > 300 && (
              <div className="my-2.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs flex items-start gap-2 shrink-0">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Large file ({previewFile.totalLines} lines):</span> Selecting a targeted line range keeps AI context focused, prevents UI lag, and avoids prompt bloating.
                </div>
              </div>
            )}

            {/* Range Selection Mode Toggles */}
            <div className="my-2.5 p-3 rounded-xl bg-black/40 border border-white/10 space-y-2.5 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewFile(prev => prev ? { ...prev, mode: 'full' } : null)}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                    previewFile.mode === 'full' 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'bg-white/5 text-white/60 hover:text-white'
                  }`}
                >
                  Full File ({previewFile.totalLines} lines)
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewFile(prev => prev ? { ...prev, mode: 'range' } : null)}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                    previewFile.mode === 'range' 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'bg-white/5 text-white/60 hover:text-white'
                  }`}
                >
                  Targeted Line Range
                </button>
              </div>

              {previewFile.mode === 'range' && (
                <div className="space-y-2 pt-1 border-t border-white/5 animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 flex-1">
                      <span className="text-[11px] text-white/50">Start Line:</span>
                      <input
                        type="number"
                        min={1}
                        max={previewFile.totalLines}
                        value={previewFile.startLine}
                        onChange={(e) => {
                          const val = Math.max(1, Math.min(previewFile.totalLines, parseInt(e.target.value) || 1));
                          setPreviewFile(prev => prev ? { ...prev, startLine: val } : null);
                        }}
                        className="w-20 px-2.5 py-1 bg-black/60 border border-white/20 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 flex-1">
                      <span className="text-[11px] text-white/50">End Line:</span>
                      <input
                        type="number"
                        min={previewFile.startLine}
                        max={previewFile.totalLines}
                        value={previewFile.endLine}
                        onChange={(e) => {
                          const val = Math.max(previewFile.startLine, Math.min(previewFile.totalLines, parseInt(e.target.value) || previewFile.totalLines));
                          setPreviewFile(prev => prev ? { ...prev, endLine: val } : null);
                        }}
                        className="w-20 px-2.5 py-1 bg-black/60 border border-white/20 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                    <span className="text-white/40">Presets:</span>
                    <button
                      type="button"
                      onClick={() => setPreviewFile(prev => prev ? { ...prev, startLine: 1, endLine: Math.min(prev.totalLines, 100) } : null)}
                      className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white/70"
                    >
                      Lines 1-100
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewFile(prev => prev ? { ...prev, startLine: 1, endLine: Math.min(prev.totalLines, 250) } : null)}
                      className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white/70"
                    >
                      Lines 1-250
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewFile(prev => prev ? { ...prev, startLine: 1, endLine: Math.min(prev.totalLines, 500) } : null)}
                      className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white/70"
                    >
                      Lines 1-500
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Code Preview Slice */}
            <div className="flex-1 min-h-0 overflow-y-auto bg-black/60 border border-white/10 rounded-xl p-3 font-mono text-xs text-neutral-300 custom-scrollbar">
              <div className="text-[10px] text-white/40 font-mono mb-2 pb-1 border-b border-white/5 flex justify-between">
                <span>
                  {previewFile.mode === 'range' 
                    ? `Showing lines ${previewFile.startLine} to ${previewFile.endLine} (${previewFile.endLine - previewFile.startLine + 1} lines)`
                    : `Showing full file (${previewFile.totalLines} lines)`}
                </span>
                <span>Select & inspect</span>
              </div>
              <pre className="select-text whitespace-pre leading-relaxed text-[11px]">
                {previewFile.mode === 'range'
                  ? previewFile.lines.slice(Math.max(0, previewFile.startLine - 1), previewFile.endLine).join('\n')
                  : previewFile.content}
              </pre>
            </div>

            {/* Action Footer */}
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setPreviewFile(null)}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAttachPreview}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                Attach {previewFile.mode === 'range' ? `Lines ${previewFile.startLine}-${previewFile.endLine}` : 'Full File'} to Chat
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 border border-white/10 text-white">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                GitHub Repository Connect
                {user && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    @{user.login}
                  </span>
                )}
              </h2>
              <p className="text-xs text-white/50">
                Connect and attach code or documentation directly into your AI chat prompt.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-white/10 bg-black/20 px-4 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('browse')}
            className={`py-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'browse'
                ? 'border-indigo-500 text-indigo-300'
                : 'border-transparent text-white/50 hover:text-white/80'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            Browse Repository
          </button>
          <button
            onClick={() => setActiveTab('quick_fetch')}
            className={`py-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'quick_fetch'
                ? 'border-indigo-500 text-indigo-300'
                : 'border-transparent text-white/50 hover:text-white/80'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Direct File URL
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'border-indigo-500 text-indigo-300'
                : 'border-transparent text-white/50 hover:text-white/80'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            Token & Auth {user && '✓'}
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="m-3 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span className="flex-1 break-words">{error}</span>
          </div>
        )}

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">

          {/* TAB 1: BROWSE REPO */}
          {activeTab === 'browse' && (
            <div className="space-y-4">
              {/* Search / Enter Repo */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    value={repoInput}
                    onChange={(e) => setRepoInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleOpenRepo()}
                    placeholder="e.g. facebook/react or https://github.com/..."
                    className="w-full pl-9 pr-3 py-2 bg-black/50 border border-white/15 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <button
                  onClick={() => handleOpenRepo()}
                  disabled={isLoading || !repoInput.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shrink-0 transition-colors shadow-md"
                >
                  {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FolderGit2 className="w-3.5 h-3.5" />}
                  Open Repo
                </button>
              </div>

              {/* Recent Repos */}
              {recentRepos.length > 0 && !currentRepo && (
                <div className="space-y-2 p-3 rounded-xl bg-black/30 border border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                      <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
                      Recent Repositories ({recentRepos.length})
                    </div>
                    <button
                      type="button"
                      onClick={handleClearAllLinkedRepos}
                      className="text-[10px] text-red-400/80 hover:text-red-300 hover:underline flex items-center gap-1 transition-colors"
                      title="Clear all linked repositories from local storage"
                    >
                      <Trash2 className="w-3 h-3" />
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentRepos.map((r) => (
                      <div
                        key={r}
                        className="group flex items-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setRepoInput(r);
                            handleOpenRepo(r);
                          }}
                          className="px-2.5 py-1 text-xs text-white/80 hover:text-white flex items-center gap-1.5 font-mono"
                          title={`Open repository ${r}`}
                        >
                          <FolderGit2 className="w-3 h-3 text-indigo-400" />
                          <span>{r}</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClearLinkedRepo(r);
                          }}
                          className="px-1.5 py-1 text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors border-l border-white/5"
                          title={`Remove ${r} from local storage`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Repository Card & Reset Actions */}
              {currentRepo && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-black/40 border border-white/10">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0">
                      <FolderGit2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white font-mono truncate">
                          {currentRepo.owner}/{currentRepo.repo}
                        </span>
                        {currentRepo.branch && (
                          <div className="relative">
                            <button
                              type="button"
                              onClick={async () => {
                                setIsBranchDropdownOpen(!isBranchDropdownOpen);
                                if (!isBranchDropdownOpen && modalBranches.length === 0) {
                                  setIsLoadingModalBranches(true);
                                  try {
                                    const b = await fetchGitHubBranches(currentRepo.owner, currentRepo.repo, token);
                                    setModalBranches(b);
                                  } catch {}
                                  finally {
                                    setIsLoadingModalBranches(false);
                                  }
                                }
                              }}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 font-mono flex items-center gap-1 hover:bg-emerald-900/80 transition-colors cursor-pointer"
                              title={`Current branch: ${currentRepo.branch}. Click to switch between branches.`}
                            >
                              <GitBranch className="w-2.5 h-2.5 text-emerald-400" />
                              <span>{currentRepo.branch}</span>
                              <ChevronDown className="w-2.5 h-2.5 text-emerald-400" />
                            </button>

                            {isBranchDropdownOpen && (
                              <div className="absolute left-0 top-6 z-50 bg-[#16161c] border border-neutral-700 rounded-xl shadow-2xl p-2 w-48 animate-in fade-in zoom-in-95">
                                <div className="text-[10px] font-semibold text-neutral-400 mb-1 px-1 flex items-center justify-between">
                                  <span>Switch Branch</span>
                                  {isLoadingModalBranches && <RefreshCw className="w-2.5 h-2.5 animate-spin text-emerald-400" />}
                                </div>
                                <div className="max-h-40 overflow-y-auto space-y-0.5 custom-scrollbar">
                                  {Array.from(new Set([currentRepo.branch, 'master', 'main', ...modalBranches])).map((b) => (
                                    <button
                                      key={b}
                                      type="button"
                                      onClick={() => handleSwitchBranch(b)}
                                      className={`w-full text-left px-2 py-1 rounded text-[11px] font-mono flex items-center justify-between transition-colors ${
                                        b === currentRepo.branch
                                          ? 'bg-emerald-600/20 text-emerald-300 font-bold'
                                          : 'text-neutral-300 hover:bg-white/10 hover:text-white'
                                      }`}
                                    >
                                      <span>{b}</span>
                                      {b === currentRepo.branch && <Check className="w-3 h-3 text-emerald-400" />}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-400/90 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Connected
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={handleResetConnectionState}
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5"
                      title="Select or open a different repository"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-white/60" />
                      Switch Repo
                    </button>
                    <button
                      type="button"
                      onClick={() => handleClearLinkedRepo()}
                      className="px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 hover:text-red-200 text-xs font-medium transition-colors flex items-center gap-1.5"
                      title="Unlink and remove this repository from local storage"
                    >
                      <Unlink className="w-3.5 h-3.5" />
                      Clear & Unlink
                    </button>
                  </div>
                </div>
              )}

              {/* Breadcrumb Path */}
              {currentRepo && (
                <div className="flex items-center gap-1 text-xs text-white/60 bg-black/30 p-2.5 rounded-xl border border-white/10 overflow-x-auto">
                  <button
                    onClick={() => handleNavigateFolder('')}
                    className="hover:text-indigo-400 font-semibold text-white truncate shrink-0"
                  >
                    {currentRepo.owner}/{currentRepo.repo}
                  </button>
                  {currentPath.split('/').filter(Boolean).map((segment, idx, arr) => {
                    const subPath = arr.slice(0, idx + 1).join('/');
                    return (
                      <React.Fragment key={subPath}>
                        <ChevronRight className="w-3 h-3 text-white/30 shrink-0" />
                        <button
                          onClick={() => handleNavigateFolder(subPath)}
                          className="hover:text-indigo-400 text-white/80 shrink-0"
                        >
                          {segment}
                        </button>
                      </React.Fragment>
                    );
                  })}
                </div>
              )}

              {/* Items List */}
              {currentRepo && (
                <div className="border border-white/10 rounded-xl overflow-hidden divide-y divide-white/5 bg-black/40">
                  {items.length === 0 ? (
                    <div className="p-6 text-center text-xs text-white/40">This folder is empty.</div>
                  ) : (
                    items.map((item) => (
                      <div
                        key={item.sha || item.path}
                        className="p-2.5 px-3 flex items-center justify-between hover:bg-white/5 transition-colors text-xs"
                      >
                        <div 
                          onClick={() => {
                            if (item.type === 'dir') {
                              handleNavigateFolder(item.path);
                            } else {
                              handleOpenFilePreview(item);
                            }
                          }}
                          className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer text-white/80 hover:text-white group"
                        >
                          {item.type === 'dir' ? (
                            <Folder className="w-4 h-4 text-amber-400 shrink-0" />
                          ) : (
                            <FileText className="w-4 h-4 text-indigo-400 shrink-0 group-hover:text-indigo-300" />
                          )}
                          <span className="truncate font-mono">{item.name}</span>
                          {item.type === 'file' && item.size && (
                            <span className="text-[10px] text-white/30 shrink-0">
                              ({(item.size / 1024).toFixed(1)} KB)
                            </span>
                          )}
                        </div>

                        {item.type === 'file' && (
                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            <button
                              type="button"
                              onClick={() => handleOpenFilePreview(item)}
                              className="px-2 py-1 bg-white/5 hover:bg-white/15 text-white/70 hover:text-white text-[11px] font-semibold rounded-lg transition-colors flex items-center gap-1"
                              title="Inspect file and select line range"
                            >
                              <Sliders className="w-3 h-3 text-indigo-400" />
                              Range
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAttachFile(item)}
                              className="px-2 py-1 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white text-[11px] font-semibold rounded-lg transition-colors flex items-center gap-1"
                              title="Attach file to chat"
                            >
                              <Download className="w-3 h-3" />
                              Attach
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: QUICK FETCH DIRECT FILE */}
          {activeTab === 'quick_fetch' && (
            <div className="space-y-4">
              <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-xl text-xs text-indigo-300/80">
                Paste any GitHub file URL directly from your browser. We will download the raw content and attach it directly to your conversation.
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/70">GitHub File Link</label>
                <input
                  type="text"
                  value={quickUrl}
                  onChange={(e) => setQuickUrl(e.target.value)}
                  placeholder="https://github.com/owner/repo/blob/main/src/App.tsx"
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <button
                onClick={handleQuickFetchUrl}
                disabled={fetchingFile || !quickUrl.trim()}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                {fetchingFile ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Download & Attach to Chat
              </button>
            </div>
          )}

          {/* TAB 3: TOKEN SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70 space-y-2.5">
                <div className="font-semibold text-white flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-indigo-400" /> GitHub Personal Access Token (PAT)
                  </span>
                  <a
                    href="https://github.com/settings/tokens"
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 hover:underline inline-flex items-center gap-1 text-[11px]"
                  >
                    Generate on GitHub <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="space-y-1.5 text-[11px] text-white/60">
                  <p>
                    <strong className="text-white/90">Fine-Grained Token (recommended):</strong> Under <em>Repository access</em>, select your repo(s), and set <em>Permissions &gt; Repository permissions &gt; Contents</em> to <strong>Read-only</strong>.
                  </p>
                  <p>
                    <strong className="text-white/90">Classic Token:</strong> Check the <code className="text-indigo-300">repo</code> scope for private repos.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/70 flex items-center justify-between">
                  <span>Personal Access Token</span>
                  {user && (
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {user.tokenType === 'fine_grained' ? 'Fine-Grained PAT' : 'Classic PAT'}
                    </span>
                  )}
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="github_pat_... or ghp_..."
                    className="flex-1 px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                  <button
                    onClick={handleSaveToken}
                    disabled={isLoading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors shrink-0 flex items-center gap-1.5"
                  >
                    {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                    Save & Test
                  </button>
                  {token && (
                    <button
                      onClick={handleRemoveToken}
                      className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-xl transition-colors border border-red-500/30 shrink-0"
                      title="Remove Token"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {user && (
                <div className="p-3 bg-emerald-950/25 border border-emerald-500/30 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar_url} alt={user.login} className="w-9 h-9 rounded-full border border-white/10" />
                    <div className="text-xs">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{user.name || `@${user.login}`}</span>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div className="text-emerald-400/80 text-[11px]">
                        {user.public_repos > 0 ? `${user.public_repos} public repos • ` : ''}
                        Authenticated
                      </div>
                    </div>
                  </div>
                  {user.rateLimitRemaining !== undefined && (
                    <div className="text-right text-[11px] font-mono">
                      <div className="text-emerald-300 font-bold">{user.rateLimitRemaining.toLocaleString()}</div>
                      <div className="text-white/40 text-[10px]">requests / hr remaining</div>
                    </div>
                  )}
                </div>
              )}

              {/* Linked Repositories & Local Storage Management */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
                <div className="font-semibold text-white flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FolderGit2 className="w-4 h-4 text-indigo-400" /> Linked Repositories in Local Storage
                  </span>
                  <span className="text-[11px] text-white/50 font-mono">
                    {recentRepos.length} saved
                  </span>
                </div>
                <p className="text-[11px] text-white/60">
                  Manage saved repository history and connection preferences stored in your browser's local storage.
                </p>
                <div className="pt-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleClearAllLinkedRepos}
                    disabled={recentRepos.length === 0 && !currentRepo}
                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 disabled:opacity-40 text-red-400 border border-red-500/30 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear All Saved Repositories ({recentRepos.length})
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-black/40 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
          <span>Files are parsed into Markdown code blocks and included directly in your prompt.</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
