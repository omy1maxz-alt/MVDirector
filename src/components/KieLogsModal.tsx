import React, { useState, useEffect } from 'react';
import { 
  X, 
  Terminal, 
  Copy, 
  Check, 
  Trash2, 
  Filter, 
  ChevronRight, 
  ChevronDown, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Send, 
  Zap,
  ArrowDownRight,
  Search
} from 'lucide-react';
import { getKieLogs, clearKieLogs, subscribeKieLogs, KieApiLogItem } from '@/services/kieLogService';

interface KieLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KieLogsModal: React.FC<KieLogsModalProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<KieApiLogItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'errors' | 'success'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = subscribeKieLogs((updatedLogs) => {
      setLogs(updatedLogs);
      // Auto-expand first error if present
      if (!expandedLogId && updatedLogs.length > 0) {
        const firstError = updatedLogs.find(l => l.isError);
        if (firstError) {
          setExpandedLogId(firstError.id);
        } else {
          setExpandedLogId(updatedLogs[0].id);
        }
      }
    });
    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredLogs = logs.filter(log => {
    if (filter === 'errors' && !log.isError) return false;
    if (filter === 'success' && log.isError) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.model.toLowerCase().includes(q) ||
        log.url.toLowerCase().includes(q) ||
        String(log.status).includes(q) ||
        (log.errorMessage && log.errorMessage.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalRequests = logs.length;
  const errorCount = logs.filter(l => l.isError).length;
  const successCount = totalRequests - errorCount;

  const handleCopyCurl = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyJson = (data: any, id: string) => {
    const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAllLogs = () => {
    navigator.clipboard.writeText(JSON.stringify(logs, null, 2));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-5xl h-[90vh] bg-[#0c0d14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-white tracking-wide">KIE API Diagnostics & Live Logs</h2>
                <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-white/10 text-white/70">
                  {totalRequests} Events
                </span>
              </div>
              <p className="text-xs text-white/50">
                Inspect raw upstream payloads, HTTP status codes, latency, and cURL commands in real time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {logs.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={handleCopyAllLogs}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/80 border border-white/10 transition-colors"
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAll ? 'Copied' : 'Export Logs'}</span>
                </button>
                <button
                  type="button"
                  onClick={clearKieLogs}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-xs text-rose-300 border border-rose-500/20 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-toolbar: Stats & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 border-b border-white/5 bg-[#090a10]">
          {/* Quick Metrics */}
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 text-white/70 border border-white/5">
              <Zap className="w-3.5 h-3.5 text-blue-400" /> Total: <b className="text-white">{totalRequests}</b>
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> OK: <b className="text-emerald-200">{successCount}</b>
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20">
              <AlertCircle className="w-3.5 h-3.5" /> Errors: <b className="text-rose-200">{errorCount}</b>
            </span>
          </div>

          {/* Filters & Search */}
          <div className="flex items-center gap-2 flex-1 max-w-md justify-end">
            <div className="relative flex-1 max-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by model/path..."
                className="w-full pl-8 pr-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-white/30 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex rounded-lg bg-white/5 p-0.5 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded-md transition-all ${filter === 'all' ? 'bg-indigo-600 text-white font-medium shadow-sm' : 'text-white/60 hover:text-white'}`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilter('errors')}
                className={`px-2.5 py-1 rounded-md transition-all ${filter === 'errors' ? 'bg-rose-600 text-white font-medium shadow-sm' : 'text-white/60 hover:text-white'}`}
              >
                Errors
              </button>
              <button
                type="button"
                onClick={() => setFilter('success')}
                className={`px-2.5 py-1 rounded-md transition-all ${filter === 'success' ? 'bg-emerald-600 text-white font-medium shadow-sm' : 'text-white/60 hover:text-white'}`}
              >
                Success
              </button>
            </div>
          </div>
        </div>

        {/* Log List View */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 divide-y divide-white/5 custom-scrollbar">
          {filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Terminal className="w-12 h-12 text-white/20 mb-3" />
              <p className="text-sm text-white/60 font-medium">No KIE API Logs Recorded Yet</p>
              <p className="text-xs text-white/40 max-w-sm mt-1">
                Make a request or send a chat message with any KIE model to see live request headers, raw JSON bodies, and latency diagnostics.
              </p>
            </div>
          ) : (
            filteredLogs.map((log) => {
              const isExpanded = expandedLogId === log.id;
              const isSuccess = !log.isError && log.status >= 200 && log.status < 300;

              return (
                <div 
                  key={log.id} 
                  className={`pt-3 first:pt-0 rounded-xl transition-all ${
                    isExpanded 
                      ? 'bg-white/[0.03] border border-white/10 p-4' 
                      : 'hover:bg-white/[0.02] p-2'
                  }`}
                >
                  {/* Summary Bar */}
                  <div 
                    onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                    className="flex flex-wrap items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-white/40" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-white/40" />
                      )}

                      {/* Status Badge */}
                      <span className={`px-2 py-0.5 text-xs font-mono font-bold rounded-md flex items-center gap-1.5 ${
                        isSuccess
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {isSuccess ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {log.status === 0 ? 'FAIL' : log.status}
                      </span>

                      {/* Method & Model */}
                      <span className="px-1.5 py-0.5 rounded bg-white/10 text-[11px] font-mono font-bold text-white/80">
                        {log.method}
                      </span>
                      <span className="text-sm font-semibold text-white">
                        {log.model}
                      </span>

                      {/* URL Snippet */}
                      <span className="text-xs text-white/40 font-mono hidden md:inline truncate max-w-xs">
                        {log.url.replace('https://api.kie.ai', '')}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-white/50">
                      {log.attemptNumber && log.attemptNumber > 1 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Retry #{log.attemptNumber}
                        </span>
                      )}
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {log.durationMs}ms
                      </span>
                      <span className="font-mono text-white/30 text-[11px]">
                        {log.timeFormatted}
                      </span>
                    </div>
                  </div>

                  {/* Error Callout Banner if failed */}
                  {log.isError && (
                    <div className="mt-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-xs text-rose-200">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <b className="font-semibold text-rose-300">Upstream Error Message:</b>
                        <p className="mt-0.5 font-mono text-rose-200/90 break-words">{log.errorMessage}</p>
                      </div>
                    </div>
                  )}

                  {/* Expanded Diagnostics Drawer */}
                  {isExpanded && (
                    <div className="mt-4 space-y-4 pt-3 border-t border-white/5 animate-in fade-in duration-150">
                      {/* Full Endpoint Details & cURL Command */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-semibold text-white/60 tracking-wider uppercase">
                            Reproducible cURL Command
                          </label>
                          <button
                            type="button"
                            onClick={() => handleCopyCurl(log.curlCommand, `curl-${log.id}`)}
                            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                          >
                            {copiedId === `curl-${log.id}` ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400 font-medium">Copied cURL</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy cURL</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="p-3 bg-black/60 border border-white/10 rounded-lg font-mono text-[11px] text-emerald-300 overflow-x-auto whitespace-pre">
                          {log.curlCommand}
                        </div>
                      </div>

                      {/* Request and Response Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Request Body */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-semibold text-white/60 tracking-wider uppercase">
                              Request Payload
                            </label>
                            <button
                              type="button"
                              onClick={() => handleCopyJson(log.requestBody, `req-${log.id}`)}
                              className="flex items-center gap-1 text-[11px] text-white/50 hover:text-white transition-colors"
                            >
                              {copiedId === `req-${log.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>Copy JSON</span>
                            </button>
                          </div>
                          <pre className="p-3 bg-black/40 border border-white/10 rounded-lg font-mono text-[11px] text-blue-200 overflow-x-auto max-h-64 custom-scrollbar">
                            {JSON.stringify(log.requestBody, null, 2)}
                          </pre>
                        </div>

                        {/* Raw Upstream Response */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-semibold text-white/60 tracking-wider uppercase">
                              Raw Upstream Response
                            </label>
                            <button
                              type="button"
                              onClick={() => handleCopyJson(log.responseRaw, `res-${log.id}`)}
                              className="flex items-center gap-1 text-[11px] text-white/50 hover:text-white transition-colors"
                            >
                              {copiedId === `res-${log.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>Copy JSON</span>
                            </button>
                          </div>
                          <pre className={`p-3 bg-black/40 border rounded-lg font-mono text-[11px] overflow-x-auto max-h-64 custom-scrollbar ${
                            log.isError 
                              ? 'border-rose-500/30 text-rose-200' 
                              : 'border-white/10 text-emerald-200'
                          }`}>
                            {typeof log.responseRaw === 'string'
                              ? log.responseRaw
                              : JSON.stringify(log.responseRaw, null, 2)}
                          </pre>
                        </div>
                      </div>
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
