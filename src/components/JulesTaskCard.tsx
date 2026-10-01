import React, { useState } from 'react';
import { Copy, Check, Terminal, Smartphone, GitBranch, GitCommit, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface JulesTaskCardProps {
  content: string;
}

export const JulesTaskCard: React.FC<JulesTaskCardProps> = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 border border-indigo-900/60 bg-gradient-to-br from-neutral-950 via-neutral-900 to-indigo-950/30 rounded-xl p-4 shadow-xl text-neutral-200">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-indigo-900/40 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
              Jules-Ready Implementation Task
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30 font-mono">
                AndroidIDE / Poco F5
              </span>
            </h4>
            <p className="text-[11px] text-neutral-400">Authoritative task specification for remote handoff</p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition shadow-sm"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied to Clipboard!' : 'Copy for Jules'}
        </button>
      </div>

      {/* Task Content Body with custom tag styling */}
      <div className="text-xs leading-relaxed font-mono whitespace-pre-wrap overflow-x-auto bg-neutral-950/70 p-3 rounded-lg border border-neutral-800/80 text-neutral-300">
        {content}
      </div>

      {/* Footer Instructions */}
      <div className="mt-3 pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-400">
        <span className="flex items-center gap-1">
          <Terminal className="w-3 h-3 text-neutral-500" />
          Workflow: Copy task → Send to Jules → Pull to AndroidIDE → Build APK
        </span>
        <span className="text-neutral-500 font-mono text-[10px]">Verified against GitHub master</span>
      </div>
    </div>
  );
};
