import React, { useState } from 'react';
import { CharacterProfile, ReferenceImage } from '@/types';
import { X, Save, User, Sparkles } from 'lucide-react';
import { generateCharacterDNAFromText, autoStyleCharacterDNA } from '@/services/gemini';

interface CharacterEditorModalProps {
  character: CharacterProfile;
  onClose: () => void;
  onSave: (character: CharacterProfile) => void;
  onRemove: (id: string) => void;
  apiKey?: string;
  referenceImages?: ReferenceImage[];
}

export const CharacterEditorModal: React.FC<CharacterEditorModalProps> = ({
  character,
  onClose,
  onSave,
  onRemove,
  apiKey,
  referenceImages = []
}) => {
  const initialDescription = character.description || (character as any).dna || {
    facialFeatures: '',
    hairStyle: '',
    bodyType: '',
    height: '',
    weight: '',
    clothingStyle: '',
    personality: '',
    keyExpressions: ''
  };
  const [editedChar, setEditedChar] = useState<CharacterProfile>({
    ...character,
    description: initialDescription
  });
  const [charPrompt, setCharPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAutoStyle = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const dna = await autoStyleCharacterDNA(editedChar.description, editedChar.name || "Unnamed Character", apiKey);
      setEditedChar(prev => ({
        ...prev,
        description: { ...prev.description, ...dna }
      }));
    } catch (e: any) {
      setError(`Auto-Styling failed: ${e.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = async () => {
    if (!charPrompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    try {
      const dna = await generateCharacterDNAFromText(charPrompt, apiKey);
      setEditedChar(prev => ({
        ...prev,
        description: { ...prev.description, ...dna }
      }));
      setCharPrompt('');
    } catch (e: any) {
      setError(`Generation failed: ${e.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'name') {
      setEditedChar(prev => ({ ...prev, name: value }));
    } else {
      setEditedChar(prev => ({
        ...prev,
        description: { ...prev.description, [name]: value }
      }));
    }
  };

  const handleSave = () => {
    onSave(editedChar);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 shrink-0">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" /> Edit Character
          </h2>
          <button onClick={onClose} className="p-1 text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
          <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Auto-Fill from Concept
              </label>
              <button
                onClick={handleAutoStyle}
                disabled={isGenerating}
                className="text-[10px] font-bold text-fuchsia-400 hover:text-fuchsia-300 uppercase tracking-widest flex items-center gap-1 transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3" /> Auto-Style
              </button>
            </div>
            <div className="flex gap-2">
              <input
                placeholder="e.g., A tall, muscular cyberpunk hacker with neon pink hair"
                value={charPrompt}
                onChange={e => setCharPrompt(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                className="flex-1 bg-black/50 border border-indigo-500/20 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !charPrompt.trim()}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap"
              >
                {isGenerating ? 'Generating...' : 'Auto-Fill'}
              </button>
            </div>
            {error && <p className="text-[10px] text-red-400">{error}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Name</label>
            <input
              name="name"
              value={editedChar.name}
              onChange={handleChange}
              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Facial Features (Reference)</label>
            <select
              name="facialFeatures"
              value={editedChar.description.facialFeatures.startsWith('REF_') ? editedChar.description.facialFeatures : 'text'}
              onChange={(e) => {
                if (e.target.value === 'text') {
                  setEditedChar(prev => ({ ...prev, description: { ...prev.description, facialFeatures: '' } }));
                } else {
                  handleChange(e);
                }
              }}
              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-500 appearance-none"
            >
              <option value="text" className="bg-[#1a1a1a] text-white">Manual Text Description</option>
              {referenceImages.map((ref, idx) => {
                  const linkedChar = ref.characterId ? (ref.characterId === character.id ? character : null) : null; // We only have the current character here, but we can just say it's linked
                  const label = ref.characterId ? (ref.characterId === character.id ? `Character: ${character.name}` : `Linked to another character`) : (ref.description || 'Unnamed Reference');
                  return (
                    <option key={ref.id} value={`REF_${idx + 1}`} className="bg-[#1a1a1a] text-white">
                      REF_{idx + 1} - {label}
                    </option>
                  );
              })}
            </select>
            {!editedChar.description.facialFeatures.startsWith('REF_') && (
              <input
                name="facialFeatures"
                value={editedChar.description.facialFeatures}
                onChange={handleChange}
                placeholder="Describe facial features manually..."
                className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-500 mt-2"
              />
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Hair Style</label>
            <input
              name="hairStyle"
              value={editedChar.description.hairStyle}
              onChange={handleChange}
              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Body Type & Build</label>
            <input
              name="bodyType"
              value={editedChar.description.bodyType}
              onChange={handleChange}
              placeholder="e.g., Athletic, slender, muscular..."
              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Height</label>
              <input
                name="height"
                value={editedChar.description.height || ''}
                onChange={handleChange}
                placeholder="e.g., 6'2&quot;, Tall, 160cm..."
                className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Weight</label>
              <input
                name="weight"
                value={editedChar.description.weight || ''}
                onChange={handleChange}
                placeholder="e.g., 180 lbs, slim, heavy set..."
                className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Clothing Style</label>
            <input
              name="clothingStyle"
              value={editedChar.description.clothingStyle || ''}
              onChange={handleChange}
              placeholder="e.g., Casual streetwear, formal suits, cyberpunk..."
              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Personality</label>
            <input
              name="personality"
              value={editedChar.description.personality}
              onChange={handleChange}
              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Key Expressions</label>
            <input
              name="keyExpressions"
              value={editedChar.description.keyExpressions}
              onChange={handleChange}
              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
            />
          </div>
        </div>
        
        <div className="p-4 border-t border-white/10 bg-black/50 flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              onRemove(character.id);
              onClose();
            }}
            className="px-4 py-2 text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
          >
            Remove
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-white/60 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" /> Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
