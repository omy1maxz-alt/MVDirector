import React from 'react';
import { X, History, Trash2 } from 'lucide-react';

export const PromptHistoryModal = ({ 
  isOpen, 
  onClose, 
  history, 
  onSelect, 
  onClear 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  history: string[], 
  onSelect: (prompt: string) => void, 
  onClear: () => void 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 shrink-0">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-400" /> History
          </h2>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button onClick={onClear} className="p-1.5 text-white/40 hover:text-red-400 transition-colors" title="Clear History">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button onClick={onClose} className="p-1 text-white/40 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
          {history.length === 0 ? (
            <div className="text-center text-white/40 py-8 text-sm">No history available.</div>
          ) : (
            <div className="space-y-2">
              {history.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => { onSelect(item); onClose(); }}
                  className="p-3 bg-black/50 border border-white/5 hover:border-indigo-500/50 rounded-lg cursor-pointer transition-colors group"
                >
                  <p className="text-xs text-white/70 group-hover:text-white line-clamp-3">{item}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
