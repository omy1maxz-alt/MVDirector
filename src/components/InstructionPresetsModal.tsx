import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Edit3 } from 'lucide-react';
import { InstructionPreset } from '@/types';

interface InstructionPresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  presets: InstructionPreset[];
  onSavePresets: (presets: InstructionPreset[]) => void;
}

export const InstructionPresetsModal: React.FC<InstructionPresetsModalProps> = ({
  isOpen,
  onClose,
  presets,
  onSavePresets
}) => {
  const [localPresets, setLocalPresets] = useState<InstructionPreset[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editInstructions, setEditInstructions] = useState('');

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
    setEditLabel('New Preset');
    setEditInstructions('');
  };

  const handleEdit = (preset: InstructionPreset) => {
    setEditingId(preset.id);
    setEditLabel(preset.label);
    setEditInstructions(preset.instructions);
  };

  const handleDelete = (id: string) => {
    setLocalPresets(prev => prev.filter(p => p.id !== id));
  };

  const handleSaveEdit = () => {
    if (!editLabel.trim() || !editInstructions.trim()) return;
    
    setLocalPresets(prev => {
      const exists = prev.find(p => p.id === editingId);
      if (exists) {
        return prev.map(p => p.id === editingId ? { ...p, label: editLabel, instructions: editInstructions } : p);
      } else {
        return [...prev, { id: editingId!, label: editLabel, instructions: editInstructions }];
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
            <Edit3 className="w-4 h-4 text-indigo-400" /> Manage Instruction Presets
          </h2>
          <button onClick={onClose} className="p-1 text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
          {editingId ? (
            <div className="space-y-4 bg-black/50 p-4 rounded-xl border border-white/10">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Preset Label</label>
                <input
                  type="text"
                  value={editLabel}
                  onChange={e => setEditLabel(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
                  placeholder="e.g., Fast-paced Action"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Instructions</label>
                <textarea
                  value={editInstructions}
                  onChange={e => setEditInstructions(e.target.value)}
                  className="w-full h-32 bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-500 resize-none custom-scrollbar"
                  placeholder="Enter the detailed instructions here..."
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setEditingId(null)} className="px-4 py-2 text-xs font-bold text-white/60 hover:text-white transition-colors">Cancel</button>
                <button onClick={handleSaveEdit} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors">Save Preset</button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-end">
                <button onClick={handleAdd} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 rounded-lg text-xs font-bold transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add New Preset
                </button>
              </div>
              {localPresets.length === 0 ? (
                <div className="text-center text-white/40 py-8 text-sm">No presets available. Add one to get started.</div>
              ) : (
                <div className="space-y-2">
                  {localPresets.map(preset => (
                    <div key={preset.id} className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-start justify-between gap-4 group">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-white mb-1">{preset.label}</h3>
                        <p className="text-xs text-white/60 line-clamp-2">{preset.instructions}</p>
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
          <button onClick={handleSaveAll} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-2 transition-colors">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
