import React, { useState } from 'react';
import { AspectRatio } from '@/types';
import { ChevronDown } from 'lucide-react';

const ASPECT_RATIOS = [
  { value: '16:9', desc: 'Landscape' },
  { value: '2.35:1', desc: 'Cinema' },
  { value: '14:9', desc: 'Widescreen' },
  { value: '4:3', desc: 'Retro' },
  { value: '1:1', desc: 'Square' },
  { value: '9:16', desc: 'Portrait' },
  { value: '8:15', desc: 'Vertical' },
  { value: '3:4', desc: 'Tall' },
];

interface AspectRatioDropdownProps {
  value: AspectRatio | string;
  onChange: (value: AspectRatio) => void;
  className?: string;
}

export const AspectRatioDropdown: React.FC<AspectRatioDropdownProps> = ({ value, onChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentRatio = value || '16:9';

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-black/40 hover:bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-indigo-500 text-white cursor-pointer transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <div 
            className="border-2 border-white/70 rounded-[2px] opacity-80"
            style={{
              aspectRatio: currentRatio.replace(':', '/'),
              width: parseFloat(currentRatio.split(':')[0]) >= parseFloat(currentRatio.split(':')[1]) ? '16px' : undefined,
              height: parseFloat(currentRatio.split(':')[0]) < parseFloat(currentRatio.split(':')[1]) ? '16px' : undefined,
            }}
          />
          <span className="font-semibold">{currentRatio}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-full mt-2 w-[220px] bg-[#151515] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-2.5 border-b border-white/5 bg-white/5">
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Aspect Ratio</p>
            </div>
            <div className="p-1.5 max-h-[280px] overflow-y-auto custom-scrollbar flex flex-col gap-0.5">
              {ASPECT_RATIOS.map((ratio) => {
                const numW = parseFloat(ratio.value.split(':')[0]);
                const numH = parseFloat(ratio.value.split(':')[1]);
                const isHorizontal = numW > numH;
                const isSquare = ratio.value === '1:1';
                const isSelected = currentRatio === ratio.value;

                return (
                  <button
                    key={ratio.value}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs transition-all ${
                      isSelected 
                        ? 'bg-indigo-500/15 text-indigo-300' 
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                    onClick={() => {
                      onChange(ratio.value as AspectRatio);
                      setIsOpen(false);
                    }}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-indigo-500/20' : 'bg-black/40 border border-white/5'}`}>
                      <div 
                        className={`${isSelected ? 'bg-indigo-400 border border-indigo-400' : 'border-2 border-white/40'} rounded-[2px] transition-colors`}
                        style={{
                          aspectRatio: ratio.value.replace(':', '/'),
                          width: isHorizontal || isSquare ? '16px' : undefined,
                          height: !isHorizontal && !isSquare ? '16px' : undefined,
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <span className={`block font-medium text-sm ${isSelected ? 'text-indigo-200' : 'text-white/90'}`}>{ratio.value}</span>
                      <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-indigo-400/70' : 'text-white/40'}`}>{ratio.desc}</span>
                    </div>
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0 mr-1 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
