import React, { useState, useEffect } from 'react';
import { X, Bug, Copy, Check, Trash2, ChevronDown, ChevronUp, AlertTriangle, Terminal } from 'lucide-react';
import {
  CrashLogEntry,
  getRecentCrashLogs,
  clearAllCrashLogs,
  formatCrashReportForAI,
} from '@/services/crashLogger';

interface CrashLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCaptureLogs?: () => void;
}

export const CrashLogsModal: React.FC<CrashLogsModalProps> = ({ isOpen, onClose, onOpenCaptureLogs }) => {
  const [logs, setLogs] = useState<CrashLogEntry[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLogs(getRecentCrashLogs());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (log: CrashLogEntry) => {
    const text = formatCrashReportForAI(log);
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(log.id);
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  const handleClear = () => {
    clearAllCrashLogs();
    setLogs([]);
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121217] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <Bug className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Crash Diagnostic Logs</h3>
              <p className="text-[11px] text-white/50">Automatic interceptor for uncaught exceptions & promise rejections</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onOpenCaptureLogs && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCaptureLogs();
                }}
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg border border-amber-500/20 transition-colors"
                title="Open live console & diagnostic logs"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Live Logs</span>
              </button>
            )}
            {logs.length > 0 && (
              <button
                onClick={handleClear}
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-red-400/80 hover:text-red-300 hover:bg-red-500/10 rounded-lg border border-red-500/20 transition-colors"
                title="Clear all recorded crash logs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Logs</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 custom-scrollbar">
          {logs.length === 0 ? (
            <div className="text-center py-12 text-white/40 flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
                <Check className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-xs font-medium text-white/70">No Crashes Recorded</p>
              <p className="text-[11px] text-white/40 mt-1 max-w-xs leading-relaxed">
                All runtime exceptions and unhandled promise rejections are automatically captured here.
              </p>
            </div>
          ) : (
            logs.map((log) => {
              const isExpanded = expandedId === log.id;
              const isCopied = copiedId === log.id;

              return (
                <div
                  key={log.id}
                  className="bg-black/60 border border-white/5 rounded-xl p-3.5 transition-all hover:border-white/10"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 font-mono uppercase font-bold">
                        {log.type}
                      </span>
                      <span className="text-[10px] text-white/40 font-mono">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(log)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg text-[10px] font-medium border border-white/10 transition-colors"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-white/60" />
                          <span>Copy Report</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="font-mono text-xs text-red-300/90 break-all select-text mb-2">
                    {log.message}
                  </p>

                  {(log.stack || log.componentStack) && (
                    <div>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : log.id)}
                        className="flex items-center gap-1 text-[10px] text-white/40 hover:text-white/70 transition-colors"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-3 h-3" /> Hide Stack Trace
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3 h-3" /> View Stack Trace
                          </>
                        )}
                      </button>

                      {isExpanded && (
                        <pre className="mt-2 p-2.5 bg-black/90 rounded-lg text-[10px] font-mono text-white/60 overflow-x-auto max-h-48 leading-tight whitespace-pre-wrap break-all select-text border border-white/5">
                          {log.stack}
                          {log.componentStack && `\n\nComponent Stack:\n${log.componentStack}`}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
