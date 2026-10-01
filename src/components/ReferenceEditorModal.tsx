import React, { useState } from 'react';
import { ReferenceImage, CharacterProfile, ImageRole } from '@/types';
import { X, Save, Image as ImageIcon, Star, Trash2, Wand2, Loader2, PaintBucket, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { compressImage } from '@/utils/imageUtils';

interface ReferenceEditorModalProps {
  image: ReferenceImage;
  characters: CharacterProfile[];
  onClose: () => void;
  onSave: (ref: ReferenceImage) => void;
  onRemove: (id: string) => void;
  onAnalyze: (ref: ReferenceImage) => void;
  isAnalyzing?: boolean;
  onStopAnalysis?: () => void;
  onChangeBackground?: (base64: string) => Promise<string>;
}

const ROLES: ImageRole[] = ['Face', 'Body', 'Outfit', 'Environment', 'Style', 'Lighting', 'Composition', 'Frame', 'General', 'Character Sheet', 'Continuity'];
const FOCUS_TAGS = ['Subject', 'Background', 'Colors', 'Lighting', 'Pose', 'Expression', 'Framing', 'Atmosphere'];

export const ReferenceEditorModal: React.FC<ReferenceEditorModalProps> = ({
  image,
  characters,
  onClose,
  onSave,
  onRemove,
  onAnalyze,
  isAnalyzing,
  onStopAnalysis,
  onChangeBackground
}) => {
  const [editedRef, setEditedRef] = useState<ReferenceImage>({ ...image, focusTags: image.focusTags || [] });
  const [isChangingBg, setIsChangingBg] = useState(false);

  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleReplaceImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
        const compressed = await compressImage(file, 2048);
        setEditedRef(prev => ({ ...prev, data: compressed }));
    } catch (error: any) {
        console.error("Failed to replace image:", error);
    }
  };

  const handleBackgroundChange = async () => {
      if (!onChangeBackground) return;
      try {
          setIsChangingBg(true);
          const newBase64 = await onChangeBackground(editedRef.data);
          setEditedRef(prev => ({ ...prev, data: newBase64 }));
      } catch (error) {
          console.error("Failed to change background:", error);
      } finally {
          setIsChangingBg(false);
      }
  };


  const handleRoleToggle = (role: ImageRole) => {
    setEditedRef(prev => {
      const roles = prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role];
      return { ...prev, roles };
    });
  };

  const handleFocusTagToggle = (tag: string) => {
    setEditedRef(prev => {
      const focusTags = (prev.focusTags || []).includes(tag)
        ? (prev.focusTags || []).filter(t => t !== tag)
        : [...(prev.focusTags || []), tag];
      return { ...prev, focusTags };
    });
  };

  const handleSave = () => {
    onSave(editedRef);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row">
        
        <div className="w-full md:w-1/2 bg-black/50 p-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10 shrink-0">
            <div className="relative w-full max-h-[30vh] md:max-h-none aspect-square md:aspect-auto md:flex-1 rounded-xl overflow-hidden border border-white/10">
                <img src={editedRef.data} alt="Reference" className={`w-full h-full object-contain ${isAnalyzing ? 'opacity-50' : ''}`} />
                {isAnalyzing && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 pointer-events-auto">
                        <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                        <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest animate-pulse">Analyzing DNA...</span>
                        <button onClick={onStopAnalysis} className="mt-2 text-[10px] font-bold text-red-400 hover:text-red-300 bg-red-400/10 px-3 py-1 rounded-full transition-colors z-10 relative pointer-events-auto">Stop Analysis</button>
                    </div>
                )}
            </div>
            
            {!isAnalyzing ? (
                <>
                    <button 
                        onClick={() => onAnalyze(editedRef)}
                        className="mt-4 w-full py-2 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors shrink-0"
                    >
                        <Wand2 className="w-4 h-4" /> Extract DNA (Auto-Tag)
                    </button>
                    {onChangeBackground && (
                        <button 
                            onClick={handleBackgroundChange}
                            disabled={isChangingBg}
                            className="mt-2 w-full py-2 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 disabled:opacity-50 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors shrink-0"
                        >
                            {isChangingBg ? <Loader2 className="w-4 h-4 animate-spin" /> : <PaintBucket className="w-4 h-4" />}
                            {isChangingBg ? "Changing Background..." : "Solid Gray Background"}
                        </button>
                    )}
                </>
            ) : (
                <div className="mt-4 w-full py-2 bg-indigo-600/10 text-indigo-400/50 rounded-lg text-xs font-bold flex items-center justify-center gap-2 shrink-0">
                    <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                </div>
            )}
        </div>

        <div className="w-full md:w-1/2 flex flex-col min-h-0">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 shrink-0">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-400" /> Edit Reference
            </h2>
            <button onClick={onClose} className="p-1 text-white/40 hover:text-white transition-colors">
                <X className="w-5 h-5" />
            </button>
            </div>
            
            <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Description / Notes</label>
                <textarea
                value={editedRef.description}
                onChange={e => setEditedRef(prev => ({ ...prev, description: e.target.value }))}
                className="w-full h-20 bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-500 resize-none custom-scrollbar"
                placeholder="What is this image a reference for?"
                />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Assign to Character</label>
                <select
                value={editedRef.characterId || ''}
                onChange={e => setEditedRef(prev => ({ ...prev, characterId: e.target.value || undefined }))}
                className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-500 appearance-none"
                >
                <option value="" className="bg-[#1a1a1a] text-white">None (General Reference)</option>
                {characters.map(c => (
                    <option key={c.id} value={c.id} className="bg-[#1a1a1a] text-white">{c.name}</option>
                ))}
                </select>
            </div>

            {editedRef.characterId && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                        <input 
                            type="checkbox" 
                            id="isPrimary"
                            checked={editedRef.isPrimary || false}
                            onChange={e => setEditedRef(prev => ({ ...prev, isPrimary: e.target.checked }))}
                            className="w-4 h-4 rounded border-white/20 bg-black text-indigo-500 focus:ring-indigo-500 focus:ring-offset-black"
                        />
                        <label htmlFor="isPrimary" className="text-xs text-white/80 flex items-center gap-1.5 cursor-pointer">
                            <Star className="w-3.5 h-3.5 text-indigo-400" /> Set as Primary Face Reference
                        </label>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-pink-500/10 border border-pink-500/20 rounded-lg">
                        <input 
                            type="checkbox" 
                            id="isolateFace"
                            checked={editedRef.isolateFace || false}
                            onChange={e => setEditedRef(prev => ({ ...prev, isolateFace: e.target.checked }))}
                            className="w-4 h-4 rounded border-white/20 bg-black text-pink-500 focus:ring-pink-500 focus:ring-offset-black"
                        />
                        <label htmlFor="isolateFace" className="text-xs text-white/80 flex items-center gap-1.5 cursor-pointer">
                            <Wand2 className="w-3.5 h-3.5 text-pink-400" /> Isolate Face Only (Ignore Hair/Outfit)
                        </label>
                    </div>
                </div>
            )}
            
            
            <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex flex-col">
                    <label htmlFor="isEnabled" className="text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer">
                        {editedRef.enabled === false ? <EyeOff className="w-3.5 h-3.5 text-white/40" /> : <Eye className="w-3.5 h-3.5 text-green-400" />}
                        Enable Image Reference
                    </label>
                    <span className="text-[9px] text-white/40 mt-1">If disabled, this reference will be hidden from the AI generator.</span>
                </div>
                <input 
                    type="checkbox" 
                    id="isEnabled"
                    checked={editedRef.enabled !== false}
                    onChange={e => setEditedRef(prev => ({ ...prev, enabled: e.target.checked }))}
                    className="w-4 h-4 rounded border-white/20 bg-black text-green-500 focus:ring-green-500 focus:ring-offset-black"
                />
            </div>
\n            <div className="flex items-center gap-2 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <input 
                    type="checkbox" 
                    id="isMasterArt"
                    checked={editedRef.isMasterArt || false}
                    onChange={e => setEditedRef(prev => ({ ...prev, isMasterArt: e.target.checked }))}
                    className="w-4 h-4 rounded border-white/20 bg-black text-purple-500 focus:ring-purple-500 focus:ring-offset-black"
                />
                <label htmlFor="isMasterArt" className="text-xs text-white/80 flex items-center gap-1.5 cursor-pointer">
                    <Star className="w-3.5 h-3.5 text-purple-400" /> Set as Master Art Style
                </label>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Reference Roles</label>
                <div className="flex flex-wrap gap-2">
                    {ROLES.map(role => (
                        <button
                            key={role}
                            onClick={() => handleRoleToggle(role)}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-colors ${
                                editedRef.roles.includes(role)
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60'
                            }`}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                    <Star className="w-3 h-3" /> Focus Tags (Lock-on)
                </label>
                <p className="text-[9px] text-white/40 italic">Select parts of this image the AI should strictly follow.</p>
                <div className="flex flex-wrap gap-2">
                    {FOCUS_TAGS.map(tag => (
                        <button
                            key={tag}
                            onClick={() => handleFocusTagToggle(tag)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                                (editedRef.focusTags || []).includes(tag)
                                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                                    : 'bg-black border-white/5 text-white/30 hover:border-white/20 hover:text-white/50'
                            }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
            </div>
            
            <div className="p-4 border-t border-white/10 bg-black/50 flex items-center justify-between shrink-0">
            
            <div className="flex gap-2">
                <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleReplaceImage} 
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-400/10 rounded-lg transition-colors"
                    title="Replace Image"
                >
                    <RefreshCw className="w-5 h-5" />
                </button>
                <button
                    onClick={() => {
                        onRemove(image.id);
                        onClose();
                    }}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                    title="Delete Reference"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

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
    </div>
  );
};
