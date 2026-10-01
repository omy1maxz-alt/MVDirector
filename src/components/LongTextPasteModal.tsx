import React, { useState } from 'react';
import { FileText, FileCode, X, ArrowRight, Clipboard, Download, Check, AlertCircle } from 'lucide-react';
import { FileAttachmentItem } from './CollapsibleFileAttachment';

export interface LongTextPasteData {
  text: string;
  charCount: number;
  lineCount: number;
  sizeBytes: number;
  suggestedFileName: string;
}

interface LongTextPasteModalProps {
  isOpen: boolean;
  pasteData: LongTextPasteData | null;
  onPasteAsFile: (fileItem: FileAttachmentItem) => void;
  onPasteAsText: (rawText: string) => void;
  onCancel: () => void;
}

export function detectSnippetFileName(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      JSON.parse(trimmed);
      return 'pasted_data.json';
    } catch {}
  }
  // Android logcat or system logs (like 09-27 04:11:12.629 ... D VRI[...]: ...)
  if (
    /^\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}/m.test(trimmed) || 
    trimmed.includes('AndroidRuntime') || 
    trimmed.includes('FATAL EXCEPTION') || 
    trimmed.includes('MediaCodec') || 
    trimmed.includes('ViewRootImpl') || 
    trimmed.includes('ActivityInfo') ||
    /\b[VDIWEF]\s+[A-Za-z0-9_\-\.\[\]]+:/m.test(trimmed)
  ) {
    return 'pasted_logcat.log';
  }
  if (trimmed.includes('import React') || trimmed.includes('export const') || trimmed.includes('interface ') || trimmed.includes(': React.FC')) {
    return 'pasted_component.tsx';
  }
  if (trimmed.includes('package ') || trimmed.includes('fun ') || ((trimmed.includes('class ') || trimmed.includes('override fun')) && (trimmed.includes('val ') || trimmed.includes('var ')))) {
    return 'pasted_code.kt';
  }
  if (trimmed.includes('def ') || (trimmed.includes('import ') && trimmed.includes('print('))) {
    return 'pasted_script.py';
  }
  if (trimmed.includes('SELECT ') || trimmed.includes('CREATE TABLE ') || trimmed.includes('INSERT INTO ')) {
    return 'pasted_query.sql';
  }
  if (trimmed.includes('<!DOCTYPE html>') || trimmed.includes('<html') || (trimmed.includes('<div') && trimmed.includes('</div>'))) {
    return 'pasted_markup.html';
  }
  return 'pasted_text.txt';
}

export const LongTextPasteModal: React.FC<LongTextPasteModalProps> = ({
  isOpen,
  pasteData,
  onPasteAsFile,
  onPasteAsText,
  onCancel,
}) => {
  const [fileName, setFileName] = useState<string>(() => pasteData?.suggestedFileName || 'pasted_text.txt');

  if (!isOpen || !pasteData) return null;

  const lines = pasteData.text.split('\n');
  const previewLines = lines.slice(0, 10);
  const sizeKb = (pasteData.sizeBytes / 1024).toFixed(1);

  const handleConfirmAsFile = () => {
    const finalName = fileName.trim() || 'pasted_text.txt';
    const item: FileAttachmentItem = {
      name: finalName,
      path: finalName,
      content: pasteData.text,
      size: pasteData.sizeBytes,
      lineCount: pasteData.lineCount,
    };
    onPasteAsFile(item);
  };

  const handleConfirmAsText = () => {
    onPasteAsText(pasteData.text);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#131317] border border-white/15 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Long Text Detected
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                  {pasteData.lineCount} lines • {sizeKb} KB
                </span>
              </h3>
              <p className="text-[11px] text-white/50">
                Choose how you would like to include this pasted content.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3.5">
          {/* File Name Config for Attachment Option */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/70 flex items-center justify-between">
              <span>Attachment Filename</span>
              <span className="text-[10px] text-white/40 font-mono">Auto-detected</span>
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="e.g. pasted_snippet.ts"
              className="w-full px-3 py-1.5 bg-black/60 border border-white/15 focus:border-indigo-500 rounded-xl text-xs font-mono text-white placeholder:text-white/30 outline-none"
            />
          </div>

          {/* Snippet Preview */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
              <span>Snippet Preview (First {previewLines.length} of {pasteData.lineCount} lines)</span>
              <span>{pasteData.charCount.toLocaleString()} chars</span>
            </div>
            <div className="bg-black/60 border border-white/10 rounded-xl p-3 font-mono text-[11px] text-neutral-300 max-h-40 overflow-y-auto custom-scrollbar leading-relaxed">
              <pre className="whitespace-pre overflow-x-auto">
                {previewLines.join('\n')}
                {lines.length > 10 && `\n... [${lines.length - 10} more lines omitted]`}
              </pre>
            </div>
          </div>

          {/* Claude-style recommendation callout */}
          <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-200 text-[11px] flex items-start gap-2">
            <FileText className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Recommended: Attach as File</strong> keeps your prompt input clean, formats large snippets into expandable cards, and prevents UI stutter.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-3.5 bg-black/40 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-3 py-2 rounded-xl text-xs text-white/50 hover:text-white hover:bg-white/5 transition-colors order-3 sm:order-1 text-center"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
            <button
              type="button"
              onClick={handleConfirmAsText}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              title="Paste directly into the message text box"
            >
              <Clipboard className="w-3.5 h-3.5 text-white/60" />
              Paste as Raw Text
            </button>

            <button
              type="button"
              onClick={handleConfirmAsFile}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5"
              title="Convert into a structured file attachment"
            >
              <FileText className="w-3.5 h-3.5" />
              Attach as File
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
