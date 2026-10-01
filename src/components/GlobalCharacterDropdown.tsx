import React, { useState, useRef, useEffect } from 'react';
import { CharacterProfile, Scene } from '@/types';
import { Users, Check } from 'lucide-react';

interface GlobalCharacterDropdownProps {
  characters: CharacterProfile[];
  scenes: Scene[];
  onUpdateScenes: (newScenes: Scene[]) => void;
}

export const GlobalCharacterDropdown: React.FC<GlobalCharacterDropdownProps> = ({ characters, scenes, onUpdateScenes }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!characters || characters.length === 0) return null;

  const handleToggleCharacter = (charId: string, currentState: boolean) => {
    const action = currentState ? 'disable' : 'enable';
    const newScenes = scenes.map(scene => {
      let currentDisabled = scene.disabledCharacterIds || [];
      if (action === 'enable') {
        currentDisabled = currentDisabled.filter(id => id !== charId);
      } else {
        if (!currentDisabled.includes(charId)) {
          currentDisabled = [...currentDisabled, charId];
        }
      }
      return { ...scene, disabledCharacterIds: currentDisabled };
    });
    onUpdateScenes(newScenes);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-white transition-colors border border-white/10"
      >
        <Users className="w-3.5 h-3.5 text-white/70" /> 
        <span className="hidden sm:inline">Global Characters</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-white/50 transition-transform ${isOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[240px] bg-[#151515] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="px-3 py-2 border-b border-white/5 bg-white/5">
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Apply to All Scenes</p>
          </div>
          <div className="p-2 max-h-[300px] overflow-y-auto custom-scrollbar flex flex-col gap-1">
            {characters.map(char => {
              const enabledCount = scenes.filter(s => !s.disabledCharacterIds?.includes(char.id)).length;
              const isEnabled = enabledCount > scenes.length / 2;

              return (
                <button 
                  key={char.id}
                  onClick={() => handleToggleCharacter(char.id, isEnabled)}
                  className={`w-full text-left p-2 px-3 rounded-lg border flex items-center justify-between transition-colors ${
                    isEnabled 
                      ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300' 
                      : 'bg-black/40 border-white/5 text-white/40 hover:bg-white/5 hover:text-white/60'
                  }`}
                >
                  <div className="text-xs font-bold truncate flex-1 pr-2">{char.name}</div>
                  {isEnabled && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
