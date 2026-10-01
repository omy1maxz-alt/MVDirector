import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Brain, X, Check, Copy, RefreshCw, Layers, ArrowRight, ShieldCheck, FileText, MessageSquare, LayoutGrid
} from 'lucide-react';
import { distillConversationMemoryWithGemini, DistillMemoryResult, ChatWindowSessionInput } from '@/services/geminiCodeDistiller';

export interface DistillSessionItem {
  id: string;
  title: string;
  messages: Array<{ role: string; content: string; name?: string; id?: string }>;
  model?: string;
  updatedAt?: number;
  customSystemPrompt?: string;
  systemPrompt?: string;
}

interface KieMemoryDistillModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions?: DistillSessionItem[];
  activeSessionId?: string;
  messages?: Array<{ role: string; content: string; name?: string; id?: string }>;
  maxTurns?: number;
  currentSystemPrompt?: string;
  onApplyExecutiveMemory: (distilledText: string, targetSessionId?: string | 'all') => void;
}

export const KieMemoryDistillModal: React.FC<KieMemoryDistillModalProps> = ({
  isOpen,
  onClose,
  sessions = [],
  activeSessionId = '',
  messages = [],
  maxTurns = 6,
  currentSystemPrompt = '',
  onApplyExecutiveMemory,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [distillResult, setDistillResult] = useState<DistillMemoryResult | null>(null);
  const [editableMemory, setEditableMemory] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedTurns, setSelectedTurns] = useState<number>(maxTurns || 6);
  
  // Multi-window Source and Target selections
  const [selectedSourceWindowId, setSelectedSourceWindowId] = useState<string>(() => {
    return activeSessionId || (sessions.length > 0 ? sessions[0].id : 'current');
  });
  const [targetApplyWindowId, setTargetApplyWindowId] = useState<string>(() => {
    return activeSessionId || (sessions.length > 0 ? sessions[0].id : 'current');
  });

  const availableSessions: ChatWindowSessionInput[] = sessions.length > 0 
    ? sessions.map(s => ({
        id: s.id,
        title: s.title || 'Untitled Chat',
        messages: s.messages || [],
        model: s.model,
        systemPrompt: s.customSystemPrompt || s.systemPrompt,
      }))
    : [{
        id: 'current',
        title: 'Current Chat Window',
        messages: messages,
        systemPrompt: currentSystemPrompt,
      }];

  const runDistillation = async (sourceWindowId: string, turnsCount: number) => {
    setIsLoading(true);
    try {
      const activeWindowObj = availableSessions.find(s => s.id === sourceWindowId);
      const promptToUse = activeWindowObj?.systemPrompt || currentSystemPrompt;

      const res = await distillConversationMemoryWithGemini({
        sessions: availableSessions,
        selectedSessionId: sourceWindowId,
        maxTurns: turnsCount === 0 ? undefined : turnsCount,
        currentSystemPrompt: promptToUse,
      });
      setDistillResult(res);
      setEditableMemory(res.executiveMemory);
    } catch (err) {
      console.error('Failed to distill memory with Gemini:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const initialSource = activeSessionId || (availableSessions[0]?.id || 'current');
      setSelectedSourceWindowId(initialSource);
      setTargetApplyWindowId(initialSource);
      runDistillation(initialSource, selectedTurns);
    } else {
      setDistillResult(null);
      setEditableMemory('');
      setCopied(false);
    }
  }, [isOpen, activeSessionId]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(editableMemory);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    if (editableMemory.trim()) {
      onApplyExecutiveMemory(editableMemory.trim(), targetApplyWindowId);
      onClose();
    }
  };

  const totalAllMessages = availableSessions.reduce((acc, s) => acc + (s.messages?.length || 0), 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#121216] border border-white/15 rounded-2xl w-full max-w-2xl max-h-[92dvh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-white/10 bg-white/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Executive Memory Distiller
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono border border-purple-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-400" /> Powered by Gemini
                </span>
              </h3>
              <p className="text-[11px] text-white/50">
                Synthesize decisions, constraints & code facts across multiple chat windows into high-density memory.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Source Chat Window Selector Bar */}
        {availableSessions.length > 1 && (
          <div className="px-4 py-2 border-b border-white/10 bg-purple-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shrink-0">
            <div className="flex items-center gap-2 text-white/70 text-[11px] min-w-0">
              <MessageSquare className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="font-semibold text-white/90 shrink-0">Source Window:</span>
              <select
                value={selectedSourceWindowId}
                onChange={(e) => {
                  const newSource = e.target.value;
                  setSelectedSourceWindowId(newSource);
                  runDistillation(newSource, selectedTurns);
                }}
                disabled={isLoading}
                aria-label="Select source chat window to distill"
                className="bg-black/60 border border-purple-500/30 rounded-lg px-2.5 py-1 text-xs text-purple-200 outline-none focus:border-purple-400 truncate max-w-[220px] sm:max-w-[260px] cursor-pointer"
              >
                <option value="all" className="bg-[#121216] text-purple-300 font-semibold">
                  🌐 All {availableSessions.length} Chat Windows Combined ({totalAllMessages} msgs)
                </option>
                {availableSessions.map((sess, idx) => (
                  <option key={sess.id} value={sess.id} className="bg-[#121216] text-white">
                    {sess.id === activeSessionId ? '⭐ ' : ''}[{idx + 1}] {sess.title} ({sess.messages.length} msgs{sess.model ? ` • ${sess.model}` : ''})
                  </option>
                ))}
              </select>
            </div>

            <div className="text-[10px] text-purple-300/80 font-mono hidden sm:block">
              {selectedSourceWindowId === 'all' 
                ? `Cross-distilling ${availableSessions.length} windows` 
                : `${availableSessions.find(s => s.id === selectedSourceWindowId)?.messages.length || 0} messages loaded`}
            </div>
          </div>
        )}

        {/* Turn Selector Bar */}
        <div className="px-4 py-2 border-b border-white/5 bg-black/30 flex items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-1.5 text-white/60 text-[11px]">
            <span>Turns to Synthesize:</span>
            <div className="flex items-center gap-1">
              {[
                { val: 4, label: '4 Turns' },
                { val: 6, label: '6 Turns' },
                { val: 12, label: '12 Turns' },
                { val: 0, label: 'Full History' },
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => {
                    setSelectedTurns(opt.val);
                    runDistillation(selectedSourceWindowId, opt.val);
                  }}
                  disabled={isLoading}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors ${
                    selectedTurns === opt.val
                      ? 'bg-purple-600 text-white shadow'
                      : 'bg-white/5 hover:bg-white/10 text-white/60'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => runDistillation(selectedSourceWindowId, selectedTurns)}
            disabled={isLoading}
            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-colors border border-white/10"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin text-purple-400' : ''}`} />
            <span>Re-distill</span>
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar min-h-[220px]">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 animate-pulse">
                <Brain className="w-8 h-8 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">Gemini is Distilling Memory...</h4>
                <p className="text-[11px] text-white/40 max-w-sm">
                  {selectedSourceWindowId === 'all'
                    ? `Correlating cross-window requirements, architecture, and pending tasks across ${availableSessions.length} chat windows.`
                    : `Analyzing architectural decisions, user rules, code constraints, and pending tasks.`}
                </p>
              </div>
            </div>
          ) : (
            <>
              {distillResult && (
                <div className="flex items-center justify-between text-[11px] bg-purple-950/20 border border-purple-500/20 p-2.5 rounded-xl text-purple-200">
                  <div className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Memory Compressed ~{distillResult.savedPercent}%</span>
                    <span className="text-[10px] text-purple-300/60 font-normal">
                      ({distillResult.sourceWindowsCount} window{distillResult.sourceWindowsCount > 1 ? 's' : ''})
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-white/50">
                    {(distillResult.originalChars / 1024).toFixed(1)} KB → {(distillResult.distilledChars / 1024).toFixed(1)} KB ({distillResult.originalTurnsCount} turns)
                  </div>
                </div>
              )}

              <div className="space-y-1.5 flex-1 flex flex-col">
                <label className="text-xs font-semibold text-white/70 flex items-center justify-between">
                  <span>Synthesized Executive Working Memory</span>
                  <span className="text-[10px] text-white/40 font-mono">Editable Markdown</span>
                </label>
                <textarea
                  value={editableMemory}
                  onChange={(e) => setEditableMemory(e.target.value)}
                  rows={10}
                  placeholder="Distilled memory will appear here..."
                  className="w-full bg-black/60 border border-white/15 focus:border-purple-500 rounded-xl p-3 text-xs text-white/90 placeholder:text-white/30 font-mono resize-y custom-scrollbar leading-relaxed outline-none"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-white/60">
                <strong className="text-white/80">Cross-Window Continuity:</strong> Distilled memory acts as an authoritative briefing note. Applying it gives the target chat window 100% awareness of past decisions without token limits or gateway timeouts.
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-black/40 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl text-xs text-white/50 hover:text-white hover:bg-white/5 transition-colors text-center"
          >
            Cancel
          </button>

          <div className="flex flex-wrap items-center justify-end gap-2">
            {/* Target Window Selector if multiple sessions */}
            {availableSessions.length > 1 && (
              <div className="flex items-center gap-1.5 text-xs bg-black/60 border border-white/10 rounded-xl px-2 py-1">
                <span className="text-[10px] text-white/50">Apply to:</span>
                <select
                  value={targetApplyWindowId}
                  onChange={(e) => setTargetApplyWindowId(e.target.value)}
                  disabled={isLoading || !editableMemory.trim()}
                  aria-label="Select target chat window to apply memory to"
                  className="bg-transparent text-xs text-white outline-none cursor-pointer max-w-[140px] truncate"
                >
                  <option value="all" className="bg-[#121216] text-purple-300 font-semibold">
                    🌐 All Chat Windows
                  </option>
                  {availableSessions.map((sess, idx) => (
                    <option key={sess.id} value={sess.id} className="bg-[#121216] text-white">
                      {sess.id === activeSessionId ? '⭐ ' : ''}[{idx + 1}] {sess.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="button"
              onClick={handleCopy}
              disabled={isLoading || !editableMemory.trim()}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={handleApply}
              disabled={isLoading || !editableMemory.trim()}
              className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors shadow-lg shadow-purple-600/30 flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Memory</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
