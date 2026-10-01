import React, { useState, useEffect } from 'react';
import { AlertCircle, Copy, Check, X, ChevronDown, ChevronUp, Bug } from 'lucide-react';
import {
  CrashLogEntry,
  getLastCrashLog,
  dismissCrashLog,
  formatCrashReportForAI,
  initGlobalCrashLogger,
} from '@/services/crashLogger';

// Ensure global interceptors are running as early as possible
if (typeof window !== 'undefined') {
  initGlobalCrashLogger();
}

export const CrashLogger: React.FC = () => {
  const [activeCrash, setActiveCrash] = useState<CrashLogEntry | null>(null);
  const [copied, setCopied] = useState(false);
  const [showFullTrace, setShowFullTrace] = useState(false);

  useEffect(() => {
    // Check for previous session crash on mount
    const last = getLastCrashLog();
    if (last && !last.dismissed) {
      setActiveCrash(last);
    }

    // Listen for newly intercepted runtime crashes
    const handleNewCrash = (e: Event) => {
      const customEvent = e as CustomEvent<CrashLogEntry>;
      if (customEvent.detail && !customEvent.detail.dismissed) {
        setActiveCrash(customEvent.detail);
      }
    };

    window.addEventListener('mv:crash_recorded', handleNewCrash);
    return () => {
      window.removeEventListener('mv:crash_recorded', handleNewCrash);
    };
  }, []);

  if (!activeCrash) return null;

  const handleCopy = () => {
    const report = formatCrashReportForAI(activeCrash);
    navigator.clipboard.writeText(report).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }).catch(() => {
      const textarea = document.createElement('textarea');
      textarea.value = report;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } finally {
        document.body.removeChild(textarea);
      }
    });
  };

  const handleDismiss = () => {
    if (activeCrash) {
      dismissCrashLog(activeCrash.id);
    }
    setActiveCrash(null);
    setShowFullTrace(false);
  };

  const isPreviousSession = () => {
    if (!activeCrash) return false;
    const crashTime = new Date(activeCrash.timestamp).getTime();
    return Date.now() - crashTime > 15000; // Logged >15s ago, e.g. before reload
  };

  return (
    <aside
      aria-label="Crash Diagnostic Reporter"
      className="fixed bottom-4 right-4 z-[9999] max-w-md w-[calc(100vw-2rem)] bg-[#121217]/95 border border-red-500/30 rounded-2xl shadow-2xl backdrop-blur-xl p-4 text-white font-sans animate-in fade-in slide-in-from-bottom-4 duration-300 select-none"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
            <Bug className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-bold text-red-400">
                {isPreviousSession() ? 'Previous Crash Detected' : 'Runtime Error Intercepted'}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/50 font-mono">
                {activeCrash.type}
              </span>
            </div>

            <p className="text-[11px] text-white/70 font-mono break-all line-clamp-2 leading-relaxed select-text">
              {activeCrash.message}
            </p>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors shrink-0"
          title="Dismiss notice"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {showFullTrace && (activeCrash.stack || activeCrash.componentStack) && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="text-[10px] font-mono text-white/50 mb-1 flex justify-between">
            <span>Stack Trace:</span>
            {activeCrash.filename && <span>{activeCrash.filename}:{activeCrash.lineno}</span>}
          </div>
          <pre className="p-2.5 bg-black/80 rounded-xl text-[10px] font-mono text-red-200/80 overflow-x-auto max-h-36 leading-tight whitespace-pre-wrap break-all select-text border border-white/5">
            {activeCrash.stack || activeCrash.componentStack}
          </pre>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
        {(activeCrash.stack || activeCrash.componentStack) ? (
          <button
            onClick={() => setShowFullTrace(!showFullTrace)}
            className="text-[11px] text-white/60 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
          >
            {showFullTrace ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Hide Trace</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>View Trace</span>
              </>
            )}
          </button>
        ) : <div />}

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-semibold border border-red-500/30 transition-all shadow-sm active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Report for AI</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};
