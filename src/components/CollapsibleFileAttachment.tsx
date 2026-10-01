import React, { useState } from 'react';
import { FileCode, ChevronDown, ChevronUp, Copy, Check, ExternalLink, X } from 'lucide-react';

export interface FileAttachmentItem {
  name: string;
  path?: string;
  repo?: string;
  owner?: string;
  branch?: string;
  url?: string;
  content: string;
  size?: number;
  lineCount?: number;
  range?: { start: number; end: number };
}

interface CollapsibleFileAttachmentProps {
  file: FileAttachmentItem;
  onRemove?: () => void;
  className?: string;
}

export const CollapsibleFileAttachment: React.FC<CollapsibleFileAttachmentProps> = ({
  file,
  onRemove,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const lines = file.lineCount || (file.content ? file.content.split('\n').length : 0);
  const sizeKb = file.size ? (file.size / 1024).toFixed(1) : (file.content ? (file.content.length / 1024).toFixed(1) : '0');

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(file.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`my-2 rounded-xl border border-white/15 bg-[#121217] overflow-hidden transition-all shadow-md w-full max-w-full min-w-0 ${className}`}>
      {/* Header / Collapsed Summary Bar */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between p-2 sm:p-2.5 bg-white/[0.03] hover:bg-white/[0.06] cursor-pointer transition-colors select-none gap-1.5 sm:gap-2 min-w-0"
      >
        <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
          <div className="p-1 sm:p-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/25 text-indigo-400 shrink-0">
            <FileCode className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              <span className="text-xs font-mono font-semibold text-indigo-200 truncate max-w-[130px] sm:max-w-xs" title={file.name}>
                {file.name}
              </span>
              {file.range && (
                <span className="text-[9px] sm:text-[10px] px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono shrink-0">
                  L{file.range.start} - L{file.range.end}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-white/50 font-mono truncate">
              {file.repo && <span className="truncate max-w-[80px] sm:max-w-[120px]">{file.repo}</span>}
              {file.path && file.repo && <span>•</span>}
              <span className="shrink-0">{lines} lines</span>
              <span>•</span>
              <span className="shrink-0">{sizeKb} KB</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {file.url && (
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1 sm:p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              title="Open file on GitHub"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 sm:p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            title="Copy file content"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-[10px] sm:text-[11px] transition-colors"
          >
            <span>{isExpanded ? 'Hide' : 'View'}</span>
            {isExpanded ? <ChevronUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
          </button>

          {onRemove && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="p-1 sm:p-1.5 rounded-lg text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Remove attachment"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Expanded Code View (Max-height capped to prevent huge screen-filling blocks) */}
      {isExpanded && (
        <div className="border-t border-white/10 bg-[#0a0a0e] p-3">
          <div className="flex items-center justify-between text-[11px] text-white/40 font-mono mb-2 pb-1.5 border-b border-white/5">
            <span>{file.path || file.name}</span>
            <span>{lines} total lines</span>
          </div>
          <pre className="max-h-72 overflow-y-auto overflow-x-auto text-[11px] font-mono leading-relaxed text-neutral-300 p-2 rounded-lg bg-black/50 border border-white/5 custom-scrollbar select-text whitespace-pre">
            <code>{file.content}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
