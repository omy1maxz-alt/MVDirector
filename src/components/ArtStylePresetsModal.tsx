import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Edit3, Palette } from 'lucide-react';
import { ArtStylePreset } from '@/types';

interface ArtStylePresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  presets: ArtStylePreset[];
  onSavePresets: (presets: ArtStylePreset[]) => void;
}

export const ArtStylePresetsModal: React.FC<ArtStylePresetsModalProps> = ({
  isOpen,
  onClose,
  presets,
  onSavePresets
}) => {
  const [localPresets, setLocalPresets] = useState<ArtStylePreset[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editPrompt, setEditPrompt] = useState('');

  useEffect(() => {
    if (isOpen) {
      setLocalPresets(presets);
      setEditingId(null);
    }
  }, [isOpen, presets]);

  if (!isOpen) return null;

  const handleAdd = () => {
    const newId = Date.now().toString();
    setEditingId(newId);
    setEditLabel('New Style');
    setEditPrompt('');
  };

  const handleEdit = (preset: ArtStylePreset) => {
    setEditingId(preset.id);
    setEditLabel(preset.label);
    setEditPrompt(preset.prompt);
  };

  const handleDelete = (id: string) => {
    setLocalPresets(prev => prev.filter(p => p.id !== id));
  };

  const handleSaveEdit = () => {
    if (!editLabel.trim() || !editPrompt.trim()) return;
    
    setLocalPresets(prev => {
      const exists = prev.find(p => p.id === editingId);
      if (exists) {
        return prev.map(p => p.id === editingId ? { ...p, label: editLabel, prompt: editPrompt } : p);
      } else {
        return [...prev, { id: editingId!, label: editLabel, prompt: editPrompt }];
      }
    });
    setEditingId(null);
  };

  const handleSaveAll = () => {
    onSavePresets(localPresets);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 shrink-0">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-400" /> Manage Art Styles
          </h2>
          <button onClick={onClose} className="p-1 text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
          {editingId ? (
            <div className="space-y-4 bg-black/50 p-4 rounded-xl border border-white/10">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Style Name</label>
                <input
                  type="text"
                  value={editLabel}
                  onChange={e => setEditLabel(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-purple-500"
                  placeholder="e.g., Cyberpunk / Blade Runner"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Style Prompt</label>
                <textarea
                  value={editPrompt}
                  onChange={e => setEditPrompt(e.target.value)}
                  className="w-full h-24 bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-purple-500 resize-none custom-scrollbar"
                  placeholder="Enter the cinematic tags, lighting, and mood..."
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setEditingId(null)} className="px-4 py-2 text-xs font-bold text-white/60 hover:text-white transition-colors">Cancel</button>
                <button onClick={handleSaveEdit} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition-colors">Save Style</button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-end">
                <button onClick={handleAdd} className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 rounded-lg text-xs font-bold transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add New Style
                </button>
              </div>
              {localPresets.length === 0 ? (
                <div className="text-center text-white/40 py-8 text-sm">No styles available. Add one to get started.</div>
              ) : (
                <div className="space-y-2">
                  {localPresets.map(preset => (
                    <div key={preset.id} className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-start justify-between gap-4 group">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-white mb-1">{preset.label}</h3>
                        <p className="text-xs text-white/60 line-clamp-2">{preset.prompt}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(preset)} className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-md transition-colors" title="Edit">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(preset.id)} className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="p-4 border-t border-white/10 bg-black/50 flex justify-end gap-2 shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-white/60 hover:text-white transition-colors">Cancel</button>
          <button onClick={handleSaveAll} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg flex items-center gap-2 transition-colors">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
