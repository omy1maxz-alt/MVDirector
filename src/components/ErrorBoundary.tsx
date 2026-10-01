import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, RotateCcw, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { recordCrash, formatCrashReportForAI } from '@/services/crashLogger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
  showFullDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    copied: false,
    showFullDetails: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('[ErrorBoundary] Caught component runtime exception:', error, errorInfo);
    this.setState({ error, errorInfo });
    
    // Store crash report in unified crash logger
    recordCrash({
      type: 'react_error_boundary',
      message: error?.message || 'Unknown React component crash',
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, copied: false, showFullDetails: false });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleCopyReport = () => {
    const errorMsg = this.state.error?.message || 'Unknown error';
    const errorStack = this.state.error?.stack || '';
    const compStack = this.state.errorInfo?.componentStack || '';
    
    const report = formatCrashReportForAI({
      id: 'error_boundary_active',
      timestamp: new Date().toISOString(),
      type: 'react_error_boundary',
      message: errorMsg,
      stack: errorStack,
      componentStack: compStack,
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    });

    navigator.clipboard.writeText(report).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 3000);
    }).catch(() => {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = report;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        this.setState({ copied: true });
        setTimeout(() => this.setState({ copied: false }), 3000);
      } finally {
        document.body.removeChild(textArea);
      }
    });
  };

  public render() {
    if (this.state.hasError) {
      const errorMsg = this.state.error?.message || 'An unexpected application error occurred.';
      const fullStack = this.state.error?.stack || '';
      const compStack = this.state.errorInfo?.componentStack || '';

      return (
        <div className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center p-4 sm:p-6 select-none font-sans">
          <div className="max-w-lg w-full bg-[#141419] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 shadow-lg shadow-amber-500/5">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h2 className="text-lg font-bold text-white tracking-wide mb-1">
              Studio Session Interrupted
            </h2>
            <p className="text-xs text-white/50 mb-4 leading-relaxed">
              A temporary runtime issue occurred. You can copy the diagnostic report below to paste directly into the chat for an instant fix.
            </p>

            <div className="w-full bg-black/60 border border-white/5 rounded-xl p-3.5 mb-4 text-left overflow-hidden">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/80">
                  Diagnostic Trace
                </span>
                <button
                  type="button"
                  onClick={this.handleCopyReport}
                  className="flex items-center gap-1.5 px-2 py-1 bg-white/5 hover:bg-white/10 active:bg-white/15 text-white/80 hover:text-white rounded-lg text-[10px] font-medium border border-white/10 transition-colors"
                >
                  {this.state.copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-white/70" />
                      <span>Copy Report for AI</span>
                    </>
                  )}
                </button>
              </div>
              <p className="font-mono text-xs text-red-300/90 break-all line-clamp-3 select-text">
                {errorMsg}
              </p>

              {(fullStack || compStack) && (
                <div className="mt-2 pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => this.setState(prev => ({ showFullDetails: !prev.showFullDetails }))}
                    className="flex items-center gap-1 text-[10px] text-white/40 hover:text-white/70 transition-colors"
                  >
                    {this.state.showFullDetails ? (
                      <>
                        <ChevronUp className="w-3 h-3" /> Hide Full Stack Trace
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3" /> View Full Stack Trace
                      </>
                    )}
                  </button>
                  {this.state.showFullDetails && (
                    <pre className="mt-2 p-2 bg-black/80 rounded-lg text-[9px] font-mono text-white/60 overflow-x-auto max-h-40 select-text leading-tight whitespace-pre-wrap break-all">
                      {fullStack}
                      {compStack && `\n\nComponent Stack:\n${compStack}`}
                    </pre>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2.5 w-full">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 active:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-white/10"
              >
                <RotateCcw className="w-3.5 h-3.5 text-white/70" />
                Resume
              </button>

              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-indigo-600/20"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reload Studio
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

