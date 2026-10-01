import React, { useState, useEffect, useRef } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  FileCode, 
  FolderGit2, 
  Layers, 
  FileText,
  ChevronDown,
  ChevronUp,
  Check,
  Search,
  X
} from 'lucide-react';
import { RepoFreshnessStatus, RepoIndexSummary } from '../types/githubRepo';
import { checkRepoFreshness, fetchAndIndexRepo } from '../services/githubRepoContext';
import { fetchGitHubBranches } from '../services/githubService';

interface RepoStatusBarProps {
  owner: string;
  repo: string;
  branch: string;
  onBranchChange?: (newBranch: string) => void;
  onRefreshStart?: () => void;
  onRefreshComplete?: (index: RepoIndexSummary) => void;
  onGenerateJulesTask?: () => void;
  onOpenRepoBrowser?: () => void;
  onClose?: () => void;
}

export const RepoStatusBar: React.FC<RepoStatusBarProps> = ({
  owner,
  repo,
  branch,
  onBranchChange,
  onRefreshStart,
  onRefreshComplete,
  onGenerateJulesTask,
  onOpenRepoBrowser,
  onClose,
}) => {
  const [freshness, setFreshness] = useState<RepoFreshnessStatus>('checking');
  const [currentSha, setCurrentSha] = useState<string>('');
  const [indexedSha, setIndexedSha] = useState<string>('');
  const [androidFileCount, setAndroidFileCount] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [latestCommitMsg, setLatestCommitMsg] = useState<string>('');
  const [isBranchMenuOpen, setIsBranchMenuOpen] = useState<boolean>(false);
  const [availableBranches, setAvailableBranches] = useState<string[]>([]);
  const [isLoadingBranches, setIsLoadingBranches] = useState<boolean>(false);
  const [branchSearch, setBranchSearch] = useState<string>('');
  const branchMenuRef = useRef<HTMLDivElement>(null);
  
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('mv_repo_status_bar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleCollapsed = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('mv_repo_status_bar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  const handleOpenBranchMenu = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsBranchMenuOpen(prev => !prev);
    if (!isBranchMenuOpen && availableBranches.length === 0) {
      setIsLoadingBranches(true);
      try {
        const branches = await fetchGitHubBranches(owner, repo);
        setAvailableBranches(branches);
      } catch (err) {
        console.warn('Failed to load branches:', err);
      } finally {
        setIsLoadingBranches(false);
      }
    }
  };

  const handleSelectBranch = (newBranch: string) => {
    const trimmed = newBranch.trim();
    if (!trimmed) return;
    setIsBranchMenuOpen(false);
    setBranchSearch('');
    if (onBranchChange && trimmed !== branch) {
      onBranchChange(trimmed);
    }
  };

  // Close branch menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (branchMenuRef.current && !branchMenuRef.current.contains(e.target as Node)) {
        setIsBranchMenuOpen(false);
      }
    };
    if (isBranchMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isBranchMenuOpen]);

  const runFreshnessCheck = async () => {
    setIsRefreshing(true);
    setFreshness('checking');
    if (onRefreshStart) onRefreshStart();

    try {
      const result = await checkRepoFreshness(owner, repo, branch);
      setCurrentSha(result.currentSha);
      setIndexedSha(result.indexedSha || '');
      setFreshness(result.status);
      if (result.latestCommit) {
        setLatestCommitMsg(result.latestCommit.message.split('\n')[0]);
      }

      // If stale or unindexed, trigger full index sync
      if (result.status === 'stale' || !result.indexedSha) {
        try {
          const freshIndex = await fetchAndIndexRepo(owner, repo, branch, true);
          setAndroidFileCount(freshIndex.androidSourceFiles);
          setIndexedSha(freshIndex.commitSha);
          setFreshness('updated');
          if (onRefreshComplete) onRefreshComplete(freshIndex);
        } catch (fetchErr) {
          console.warn('[RepoStatusBar] Full index fetch failed, using cached index if available');
          const cachedIndex = await fetchAndIndexRepo(owner, repo, branch, false).catch(() => null);
          if (cachedIndex) {
            setAndroidFileCount(cachedIndex.androidSourceFiles);
            if (onRefreshComplete) onRefreshComplete(cachedIndex);
          }
        }
      } else {
        const cachedIndex = await fetchAndIndexRepo(owner, repo, branch, false).catch(() => null);
        if (cachedIndex) {
          setAndroidFileCount(cachedIndex.androidSourceFiles);
          if (onRefreshComplete) onRefreshComplete(cachedIndex);
        }
      }
    } catch (e) {
      console.warn('[RepoStatusBar] Error checking freshness (network/rate-limit):', e);
      setFreshness('error');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (owner && repo) {
      runFreshnessCheck();
    }
  }, [owner, repo, branch]);

  // Combined branch list with common presets
  const commonPresets = ['main', 'master', 'dev', 'develop', 'release', 'staging'];
  const allKnownBranches = Array.from(new Set([
    branch,
    ...availableBranches,
    ...commonPresets
  ]));

  const filteredBranches = branchSearch.trim()
    ? allKnownBranches.filter(b => b.toLowerCase().includes(branchSearch.toLowerCase().trim()))
    : allKnownBranches;

  // Collapsed Micro View (only ~22px height)
  if (isCollapsed) {
    return (
      <div className="bg-neutral-900/95 border-b border-neutral-800 text-[10px] px-2.5 py-1 flex items-center justify-between gap-2 backdrop-blur-md shrink-0 select-none relative z-30">
        <div className="flex items-center gap-1.5 min-w-0 truncate">
          <FolderGit2 className="w-3 h-3 text-blue-400 shrink-0" />
          <span className="font-semibold text-blue-300 truncate max-w-[130px] sm:max-w-[200px]">
            {owner}/{repo}
          </span>

          {/* Collapsed Branch Chip */}
          <button
            type="button"
            onClick={handleOpenBranchMenu}
            title={`Current branch: ${branch}. Click to switch branch.`}
            className="text-emerald-300 hover:text-white bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700 px-1.5 py-0.2 rounded font-mono text-[9px] shrink-0 flex items-center gap-1 transition-colors"
          >
            <GitBranch className="w-2.5 h-2.5 text-emerald-400" />
            <span>{branch}</span>
            <ChevronDown className="w-2.5 h-2.5 text-neutral-400" />
          </button>

          {freshness === 'updated' && (
            <span className="inline-flex items-center gap-0.5 text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-1 py-0.2 rounded text-[9px]">
              <CheckCircle2 className="w-2.5 h-2.5" /> Updated
            </span>
          )}
          {freshness === 'stale' && (
            <span className="inline-flex items-center gap-0.5 text-amber-400 bg-amber-950/50 border border-amber-800/40 px-1 py-0.2 rounded text-[9px] animate-pulse">
              <AlertTriangle className="w-2.5 h-2.5" /> Stale
            </span>
          )}
          {freshness === 'checking' && (
            <span className="inline-flex items-center gap-0.5 text-blue-400 bg-blue-950/50 border border-blue-800/40 px-1 py-0.2 rounded text-[9px]">
              <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Verifying
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={toggleCollapsed}
            title="Expand GitHub Repo Status Bar"
            className="p-0.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors flex items-center gap-0.5 text-[10px]"
          >
            <span>Expand</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              title="Close GitHub status bar"
              className="p-0.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Branch Menu in collapsed mode */}
        {isBranchMenuOpen && (
          <div 
            ref={branchMenuRef}
            className="absolute left-2 top-7 z-50 bg-[#16161c] border border-neutral-700 rounded-xl shadow-2xl p-2 w-64 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-neutral-800 text-[11px] text-neutral-400">
              <span className="font-semibold text-white flex items-center gap-1">
                <GitBranch className="w-3 h-3 text-emerald-400" /> Switch Branch
              </span>
              <button 
                type="button" 
                onClick={() => setIsBranchMenuOpen(false)}
                className="text-neutral-500 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="pt-2">
              <div className="relative mb-2">
                <input
                  type="text"
                  value={branchSearch}
                  onChange={(e) => setBranchSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && branchSearch.trim()) {
                      handleSelectBranch(branchSearch.trim());
                    }
                  }}
                  placeholder="Find or type branch..."
                  className="w-full bg-black/60 border border-neutral-700 rounded-lg px-2.5 py-1 text-xs text-white placeholder-neutral-500 outline-none focus:border-emerald-500"
                />
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1 custom-scrollbar">
                {filteredBranches.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => handleSelectBranch(b)}
                    className={`w-full text-left px-2 py-1 rounded-md text-xs flex items-center justify-between transition-colors ${
                      b === branch 
                        ? 'bg-emerald-600/20 text-emerald-300 font-semibold border border-emerald-500/30' 
                        : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{b}</span>
                    {b === branch && <Check className="w-3 h-3 text-emerald-400 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Expanded Compact View (single row with horizontal scrolling on ultra-small screens)
  return (
    <div className="bg-neutral-900/95 border-b border-neutral-800 text-[11px] px-2.5 py-1 flex items-center justify-between gap-2 backdrop-blur-md shrink-0 max-w-full overflow-x-auto no-scrollbar sm:custom-scrollbar relative z-30">
      {/* Left: Identity Chips */}
      <div className="flex items-center gap-1.5 text-neutral-300 shrink-0">
        <div className="flex items-center gap-1 font-medium text-white bg-neutral-800/80 px-1.5 py-0.5 rounded border border-neutral-700/60">
          <FolderGit2 className="w-3 h-3 text-blue-400 shrink-0" />
          <span className="text-neutral-400 hidden xs:inline">{owner}/</span>
          <span className="font-semibold text-blue-300 truncate max-w-[110px] sm:max-w-[160px]">{repo}</span>
        </div>

        {/* Interactive Branch Switcher Badge */}
        <div className="relative" ref={branchMenuRef}>
          <button
            type="button"
            onClick={handleOpenBranchMenu}
            title={`Active Branch: ${branch}. Click to switch branch for this window.`}
            className="flex items-center gap-1 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700/80 hover:border-emerald-500/50 px-1.5 py-0.5 rounded text-neutral-200 text-[10px] transition-all cursor-pointer shadow-sm group"
          >
            <GitBranch className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="font-semibold text-emerald-300 truncate max-w-[85px] sm:max-w-[120px]">{branch}</span>
            <ChevronDown className="w-2.5 h-2.5 text-neutral-400 group-hover:text-white transition-transform" />
          </button>

          {/* Branch Dropdown Popover */}
          {isBranchMenuOpen && (
            <div className="absolute left-0 top-7 z-50 bg-[#16161c] border border-neutral-700 rounded-xl shadow-2xl p-2.5 w-64 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-1.5 border-b border-neutral-800 text-[11px] text-neutral-400">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-emerald-400" /> Switch Branch
                </span>
                <button 
                  type="button" 
                  onClick={() => setIsBranchMenuOpen(false)}
                  className="text-neutral-500 hover:text-white p-0.5 rounded hover:bg-white/5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              <div className="pt-2">
                <div className="relative mb-2">
                  <input
                    type="text"
                    value={branchSearch}
                    onChange={(e) => setBranchSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && branchSearch.trim()) {
                        handleSelectBranch(branchSearch.trim());
                      }
                    }}
                    placeholder="Find or type branch..."
                    className="w-full bg-black/60 border border-neutral-700 rounded-lg px-2.5 py-1 text-xs text-white placeholder-neutral-500 outline-none focus:border-emerald-500"
                    autoFocus
                  />
                  {branchSearch.trim() && !filteredBranches.includes(branchSearch.trim()) && (
                    <button
                      type="button"
                      onClick={() => handleSelectBranch(branchSearch.trim())}
                      className="mt-1 w-full text-left px-2 py-1 rounded bg-emerald-600/30 text-emerald-300 text-[10px] font-semibold flex items-center justify-between"
                    >
                      <span>Switch to custom branch "{branchSearch.trim()}"</span>
                      <Check className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-1 px-1 flex items-center justify-between">
                  <span>Available Branches</span>
                  {isLoadingBranches && <RefreshCw className="w-2.5 h-2.5 animate-spin text-emerald-400" />}
                </div>

                <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
                  {filteredBranches.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => handleSelectBranch(b)}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        b === branch 
                          ? 'bg-emerald-600/20 text-emerald-300 font-semibold border border-emerald-500/30' 
                          : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{b}</span>
                      {b === branch && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Commit Hash */}
        <div className="hidden sm:flex items-center gap-1 bg-neutral-800/50 px-1.5 py-0.5 rounded text-neutral-400 font-mono text-[10px]">
          <GitCommit className="w-3 h-3 text-purple-400 shrink-0" />
          <span>{currentSha ? currentSha.slice(0, 7) : '...'}</span>
        </div>

        {/* Freshness Badge */}
        {freshness === 'updated' && (
          <div className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-1.5 py-0.5 rounded text-[10px]">
            <CheckCircle2 className="w-2.5 h-2.5" />
            <span>Updated</span>
          </div>
        )}
        {freshness === 'stale' && (
          <div className="flex items-center gap-1 text-amber-400 bg-amber-950/40 border border-amber-800/50 px-1.5 py-0.5 rounded text-[10px] animate-pulse">
            <AlertTriangle className="w-2.5 h-2.5" />
            <span>Stale</span>
          </div>
        )}
        {freshness === 'checking' && (
          <div className="flex items-center gap-1 text-blue-400 bg-blue-950/40 border border-blue-800/50 px-1.5 py-0.5 rounded text-[10px]">
            <RefreshCw className="w-2.5 h-2.5 animate-spin" />
            <span>Verifying...</span>
          </div>
        )}
        {freshness === 'error' && (
          <div className="flex items-center gap-1 text-amber-300 bg-amber-950/40 border border-amber-800/50 px-1.5 py-0.5 rounded text-[10px]" title="Remote check failed. Using cached index.">
            <AlertTriangle className="w-2.5 h-2.5 text-amber-400" />
            <span>Offline</span>
          </div>
        )}

        {/* Indexed Android File Count */}
        {androidFileCount > 0 && (
          <div className="hidden md:flex items-center gap-1 text-neutral-400 text-[10px]">
            <FileCode className="w-3 h-3 text-orange-400 shrink-0" />
            <span>{androidFileCount} files</span>
          </div>
        )}
      </div>

      {/* Right: Action Buttons & Collapse/Close */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Jules Task Generator Trigger */}
        {onGenerateJulesTask && (
          <button
            type="button"
            onClick={onGenerateJulesTask}
            title="Generate structured Jules-Ready Task for AndroidIDE"
            className="flex items-center gap-1 bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-500 hover:to-indigo-500 text-white px-2 py-0.5 rounded border border-blue-500/30 transition text-[10px] font-medium"
          >
            <FileText className="w-3 h-3" />
            <span className="hidden xs:inline">Jules</span>
          </button>
        )}

        {/* Refresh Index Button */}
        <button
          type="button"
          onClick={runFreshnessCheck}
          disabled={isRefreshing}
          title="Refresh Git tree and verify remote commit freshness"
          className="flex items-center gap-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-1.5 py-0.5 rounded border border-neutral-700 transition disabled:opacity-50 text-[10px]"
        >
          <RefreshCw className={`w-2.5 h-2.5 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
          <span className="hidden sm:inline">Sync</span>
        </button>

        {/* Browse Files Modal Link */}
        {onOpenRepoBrowser && (
          <button
            type="button"
            onClick={onOpenRepoBrowser}
            title="Browse repository files"
            className="flex items-center gap-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-1.5 py-0.5 rounded border border-neutral-700 transition text-[10px]"
          >
            <Layers className="w-2.5 h-2.5" />
            <span className="hidden sm:inline">Files</span>
          </button>
        )}

        {/* Collapse Button */}
        <button
          type="button"
          onClick={toggleCollapsed}
          title="Collapse to mini bar"
          className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors"
        >
          <ChevronUp className="w-3 h-3" />
        </button>

        {/* Close / Dismiss Bar */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            title="Hide GitHub status bar"
            className="p-1 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded transition-colors ml-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
