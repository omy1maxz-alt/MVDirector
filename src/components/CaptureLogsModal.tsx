import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, Terminal, Copy, Check, Trash2, Download, Search, 
  AlertTriangle, Bug, Wifi, Info, Smartphone, RefreshCw, ChevronDown, ChevronUp, Filter
} from 'lucide-react';
import { 
  CapturedLogEntry, 
  LogLevel, 
  subscribeToCapturedLogs, 
  clearCapturedLogs, 
  getEnvironmentDiagnostics, 
  formatFullDiagnosticReportForAI,
  EnvironmentDiagnostics
} from '@/services/logCapture';

interface CaptureLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CaptureLogsModal: React.FC<CaptureLogsModalProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<CapturedLogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'errors' | 'network' | 'warn' | 'env'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [envDiag, setEnvDiag] = useState<EnvironmentDiagnostics | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Load environment diagnostics
    getEnvironmentDiagnostics().then(setEnvDiag);

    // Subscribe to live log stream
    const unsubscribe = subscribeToCapturedLogs((updatedLogs) => {
      setLogs(updatedLogs);
    });

    return () => {
      unsubscribe();
    };
  }, [isOpen]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Tab filter
      if (activeTab === 'errors' && log.level !== 'error' && log.level !== 'crash') return false;
      if (activeTab === 'network' && log.level !== 'network') return false;
      if (activeTab === 'warn' && log.level !== 'warn') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesMsg = log.message.toLowerCase().includes(q);
        const matchesCat = log.category?.toLowerCase().includes(q) || false;
        const matchesStack = log.stack?.toLowerCase().includes(q) || false;
        return matchesMsg || matchesCat || matchesStack;
      }
      return true;
    });
  }, [logs, activeTab, searchQuery]);

  const errorCount = useMemo(() => {
    return logs.filter(l => l.level === 'error' || l.level === 'crash').length;
  }, [logs]);

  const networkCount = useMemo(() => {
    return logs.filter(l => l.level === 'network').length;
  }, [logs]);

  const handleCopyForAI = async () => {
    try {
      const report = await formatFullDiagnosticReportForAI(activeTab === 'all' ? undefined : (activeTab === 'errors' ? 'error' : activeTab as LogLevel));
      await navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (_) {
      // Fallback copy using textarea
      const report = await formatFullDiagnosticReportForAI();
      const ta = document.createElement('textarea');
      ta.value = report;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } finally {
        document.body.removeChild(ta);
      }
    }
  };

  const handleExportText = async () => {
    const report = await formatFullDiagnosticReportForAI();
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mv_director_android_log_${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefreshEnv = async () => {
    setIsRefreshing(true);
    const diag = await getEnvironmentDiagnostics();
    setEnvDiag(diag);
    setTimeout(() => setIsRefreshing(false), 400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="bg-[#121217] border border-white/10 rounded-2xl w-full max-w-3xl h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-wide">Capture Log & Diagnostics</h3>
                {envDiag?.isCapacitor && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    APK WebView
                  </span>
                )}
              </div>
              <p className="text-[11px] text-white/50">Live console, network errors & WebView device telemetry</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleCopyForAI}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-600/20 transition-all"
              title="Copy formatted diagnostic report to paste in chat"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied For AI!' : 'Copy For AI'}</span>
            </button>

            <button
              onClick={handleExportText}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-white/80 rounded-xl text-xs font-medium border border-white/10 transition-colors"
              title="Download raw .txt log file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            <button
              onClick={clearCapturedLogs}
              className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-xl border border-white/5 transition-colors"
              title="Clear all logs"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-white/40 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Bar & Search */}
        <div className="px-3 sm:px-4 py-2 border-b border-white/5 bg-black/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'all' ? 'bg-white/15 text-white shadow' : 'text-white/50 hover:text-white'
              }`}
            >
              <span>All Logs</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10">{logs.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('errors')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'errors' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'text-white/50 hover:text-red-300'
              }`}
            >
              <Bug className="w-3 h-3 text-red-400" />
              <span>Errors</span>
              {errorCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-red-500/30 text-red-200 font-mono">
                  {errorCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('network')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'network' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'text-white/50 hover:text-blue-300'
              }`}
            >
              <Wifi className="w-3 h-3 text-blue-400" />
              <span>Network</span>
              {networkCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-500/30 text-blue-200 font-mono">
                  {networkCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('warn')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'warn' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-white/50 hover:text-amber-300'
              }`}
            >
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span>Warn</span>
            </button>

            <button
              onClick={() => setActiveTab('env')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'env' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-white/50 hover:text-emerald-300'
              }`}
            >
              <Smartphone className="w-3 h-3 text-emerald-400" />
              <span>Device Info</span>
            </button>
          </div>

          {activeTab !== 'env' && (
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter logs..."
                className="w-full sm:w-44 bg-black/60 border border-white/10 text-white rounded-xl pl-8 pr-3 py-1 text-xs outline-none focus:border-amber-500 placeholder:text-white/30"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 text-white/40 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 custom-scrollbar bg-black/20 font-mono text-xs">
          {activeTab === 'env' ? (
            /* Device & Environment Tab */
            <div className="space-y-4 font-sans text-xs">
              <div className="flex items-center justify-between bg-white/[0.03] p-3 rounded-xl border border-white/10">
                <div>
                  <h4 className="font-bold text-white text-sm">Android & WebView Environment Diagnostics</h4>
                  <p className="text-[11px] text-white/50 mt-0.5">Specifications of the active phone webview runtime</p>
                </div>
                <button
                  onClick={handleRefreshEnv}
                  disabled={isRefreshing}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
                  title="Refresh specs"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {envDiag && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-black/60 border border-white/5 p-3.5 rounded-xl space-y-2">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">App Origin & Runtime</span>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-white/40">Platform:</span>
                        <span className="font-bold text-emerald-400 truncate max-w-[200px]">{envDiag.runtime?.environmentLabel || 'Standalone'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-white/40">Sandbox Status:</span>
                        <span className="font-bold text-teal-300">
                          {envDiag.runtime?.isStandalone ? '✅ Outside Studio Sandbox' : 'Inside Studio Sandbox'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-white/40">Origin:</span>
                        <span className="font-mono text-white/90 truncate max-w-[200px]">{envDiag.origin}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-white/40">Storage Architecture:</span>
                        <span className="font-mono text-white/80 truncate max-w-[200px]">{envDiag.runtime?.storageDescription || 'IndexedDB'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-white/40">Protocol:</span>
                        <span className="font-mono text-emerald-400">{envDiag.protocol}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-white/40">Capacitor APK:</span>
                        <span className={`font-bold ${envDiag.isCapacitor ? 'text-emerald-400' : 'text-white/60'}`}>
                          {envDiag.isCapacitor ? `Yes (${envDiag.capacitorPlatform})` : 'No (Browser)'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-white/40">Online:</span>
                        <span className={envDiag.hardware.onLine ? 'text-emerald-400' : 'text-red-400'}>
                          {envDiag.hardware.onLine ? 'Connected' : 'Offline'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/60 border border-white/5 p-3.5 rounded-xl space-y-2">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Screen & Viewport</span>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-white/40">Viewport:</span>
                        <span className="font-mono text-white/90">{envDiag.screen.innerWidth} x {envDiag.screen.innerHeight} px</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-white/40">Physical Screen:</span>
                        <span className="font-mono text-white/90">{envDiag.screen.width} x {envDiag.screen.height} px</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-white/40">Device Pixel Ratio:</span>
                        <span className="font-mono text-white/90">{envDiag.screen.devicePixelRatio}x</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-white/40">Touch Points:</span>
                        <span className="font-mono text-white/90">{envDiag.hardware.maxTouchPoints}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/60 border border-white/5 p-3.5 rounded-xl space-y-2">
                    <span className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-wider">Audio & Hardware</span>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-white/40">Web Audio API:</span>
                        <span className={envDiag.audio.supported ? 'text-emerald-400 font-bold' : 'text-red-400'}>
                          {envDiag.audio.supported ? 'Supported' : 'Not Supported'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-white/40">Audio State / Rate:</span>
                        <span className="font-mono text-white/90">{envDiag.audio.state} ({envDiag.audio.sampleRate || 'N/A'}Hz)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-white/40">CPU Cores:</span>
                        <span className="font-mono text-white/90">{envDiag.hardware.concurrency ?? 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-white/40">Device Memory:</span>
                        <span className="font-mono text-white/90">~{envDiag.hardware.deviceMemory ? `${envDiag.hardware.deviceMemory} GB` : 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/60 border border-white/5 p-3.5 rounded-xl space-y-2">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Storage Quota</span>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-white/40">Used Storage:</span>
                        <span className="font-mono text-white/90">{envDiag.storageQuota?.usage ?? 0} MB</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-white/40">Estimated Quota:</span>
                        <span className="font-mono text-white/90">{envDiag.storageQuota?.quota ?? 'Unknown'} MB</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-white/40">Usage Percentage:</span>
                        <span className="font-mono text-cyan-400">{envDiag.storageQuota?.percent ?? 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 bg-black/60 border border-white/5 p-3.5 rounded-xl space-y-2">
                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">User Agent String</span>
                    <p className="font-mono text-[11px] text-white/70 break-all leading-relaxed bg-black/40 p-2 rounded-lg border border-white/5">
                      {envDiag.userAgent}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-16 text-white/40 flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
                <Check className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-xs font-medium text-white/70 font-sans">No Logs in this Category</p>
              <p className="text-[11px] text-white/40 mt-1 max-w-xs leading-relaxed font-sans">
                {searchQuery ? 'No log entries match your search query.' : 'Console outputs and network calls will be logged here in real-time.'}
              </p>
            </div>
          ) : (
            filteredLogs.map((log) => {
              const isExpanded = expandedId === log.id;
              const isError = log.level === 'error' || log.level === 'crash';
              const isWarn = log.level === 'warn';
              const isNetwork = log.level === 'network';

              return (
                <div
                  key={log.id}
                  className={`rounded-xl p-2.5 transition-all border ${
                    isError
                      ? 'bg-red-500/10 border-red-500/30 text-red-200'
                      : isWarn
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-200'
                      : isNetwork
                      ? 'bg-blue-500/10 border-blue-500/20 text-blue-200'
                      : 'bg-black/50 border-white/5 text-white/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                      <span className="text-[10px] text-white/40 font-mono">
                        {log.timestamp.slice(11, 19)}
                      </span>

                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          isError
                            ? 'bg-red-500/30 text-red-200'
                            : isWarn
                            ? 'bg-amber-500/30 text-amber-200'
                            : isNetwork
                            ? 'bg-blue-500/30 text-blue-200'
                            : 'bg-white/10 text-white/60'
                        }`}
                      >
                        {log.level}
                      </span>

                      {log.category && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-white/50 border border-white/5">
                          {log.category}
                        </span>
                      )}
                    </div>

                    {(log.stack || log.data) && (
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : log.id)}
                        className="text-[10px] text-white/50 hover:text-white flex items-center gap-0.5 transition-colors shrink-0"
                      >
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        <span>{isExpanded ? 'Hide' : 'Details'}</span>
                      </button>
                    )}
                  </div>

                  <p className="mt-1 text-[11px] leading-relaxed break-all select-text font-mono">
                    {log.message}
                  </p>

                  {isExpanded && (
                    <div className="mt-2 pt-2 border-t border-white/10 space-y-2">
                      {log.data !== undefined && (
                        <div>
                          <span className="text-[9px] text-white/40 uppercase tracking-wider block mb-1">Payload / Details:</span>
                          <pre className="p-2 bg-black/80 rounded-lg text-[10px] text-white/70 overflow-x-auto whitespace-pre-wrap break-all border border-white/5">
                            {typeof log.data === 'object' ? JSON.stringify(log.data, null, 2) : String(log.data)}
                          </pre>
                        </div>
                      )}

                      {log.stack && (
                        <div>
                          <span className="text-[9px] text-white/40 uppercase tracking-wider block mb-1">Stack Trace:</span>
                          <pre className="p-2 bg-black/80 rounded-lg text-[10px] text-red-300/80 overflow-x-auto whitespace-pre-wrap break-all border border-white/5">
                            {log.stack}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={logEndRef} />
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-xs text-white/50 shrink-0">
          <span>{filteredLogs.length} entries shown</span>
          <button
            onClick={handleCopyForAI}
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Full Report For AI</span>
          </button>
        </div>

      </div>
    </div>
  );
};
