import React, { useState } from 'react';
import { SubtitleType } from '@/types';
import { ChevronDown, Layers, Check } from 'lucide-react';

export interface SubtitleFormatOption {
    value: SubtitleType;
    label: string;
    badge: string;
    layers: string;
    linesCount: number;
    description: string;
}

export const SUBTITLE_FORMAT_OPTIONS: SubtitleFormatOption[] = [
    {
        value: 'standard',
        label: 'Standard (Single Line)',
        badge: '1 Line',
        layers: 'Native or Translated',
        linesCount: 1,
        description: 'Clean, single-line subtitles (Native or Translated).'
    },
    {
        value: 'bilingual',
        label: 'Bilingual (Dual-layered)',
        badge: '2 Lines',
        layers: 'Native + Target',
        linesCount: 2,
        description: 'Native language on top, Translated below.'
    },
    {
        value: 'dual_trans',
        label: 'Dual Translated',
        badge: '2 Lines',
        layers: 'English + Target',
        linesCount: 2,
        description: 'English on top, Target Language below (No Native).'
    },
    {
        value: 'triple',
        label: 'Triple-layered',
        badge: '3 Lines',
        layers: 'Native + Romaji + Target',
        linesCount: 3,
        description: 'Native + Romanized + Translated.'
    },
    {
        value: 'quad',
        label: 'Quad-layered',
        badge: '4 Lines',
        layers: 'Native + Romaji + EN + Target',
        linesCount: 4,
        description: 'Native + Romanized + English + Target.'
    }
];

interface SubtitleFormatDropdownProps {
    value: SubtitleType;
    onChange: (value: SubtitleType) => void;
    className?: string;
}

export const SubtitleFormatDropdown: React.FC<SubtitleFormatDropdownProps> = ({
    value,
    onChange,
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = SUBTITLE_FORMAT_OPTIONS.find(opt => opt.value === value) || SUBTITLE_FORMAT_OPTIONS[0];

    return (
        <div className={`relative w-full ${className}`}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-black/40 hover:bg-black/60 border border-white/10 rounded-xl px-3.5 sm:px-4 py-3 text-xs outline-none focus:border-indigo-500 text-white cursor-pointer transition-all flex items-center justify-between group shadow-sm"
            >
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold border border-indigo-500/30 flex items-center gap-1 shrink-0">
                        <Layers className="w-3 h-3 text-indigo-400" />
                        <span>{selectedOption.badge}</span>
                    </div>
                    <span className="font-semibold text-xs sm:text-sm text-white group-hover:text-indigo-100 transition-colors truncate">
                        {selectedOption.label}
                    </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-white/40 group-hover:text-white transition-transform duration-200 shrink-0 ml-2 ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute left-0 top-full mt-2 w-full min-w-[280px] bg-[#151515] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-2.5 border-b border-white/5 bg-white/5 flex items-center justify-between">
                            <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider flex items-center gap-1.5">
                                <Layers className="w-3 h-3 text-indigo-400" /> Subtitle Layer Format
                            </p>
                            <span className="text-[10px] font-mono text-indigo-400/80 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                                {selectedOption.badge}
                            </span>
                        </div>

                        <div className="p-1.5 max-h-[320px] overflow-y-auto custom-scrollbar flex flex-col gap-1">
                            {SUBTITLE_FORMAT_OPTIONS.map((opt) => {
                                const isSelected = opt.value === value;

                                return (
                                    <button
                                        type="button"
                                        key={opt.value}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                                            isSelected
                                                ? 'bg-indigo-500/15 border border-indigo-500/30 text-indigo-200'
                                                : 'text-white/70 hover:bg-white/10 hover:text-white border border-transparent'
                                        }`}
                                        onClick={() => {
                                            onChange(opt.value);
                                            setIsOpen(false);
                                        }}
                                    >
                                        {/* Visual layer representation */}
                                        <div
                                            className={`w-8 h-8 rounded-lg flex flex-col items-center justify-center gap-0.5 shrink-0 transition-colors ${
                                                isSelected
                                                    ? 'bg-indigo-500/25 border border-indigo-500/40 text-indigo-300'
                                                    : 'bg-black/50 border border-white/5 text-white/30'
                                            }`}
                                        >
                                            {Array.from({ length: opt.linesCount }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-0.5 rounded-full transition-colors ${
                                                        isSelected ? 'bg-indigo-300' : 'bg-white/40'
                                                    } ${i === 0 ? 'w-4' : i === 1 ? 'w-3.5' : 'w-3'}`}
                                                />
                                            ))}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className={`block font-semibold text-xs sm:text-sm truncate ${isSelected ? 'text-indigo-200' : 'text-white/90'}`}>
                                                    {opt.label}
                                                </span>
                                            </div>
                                            <span className={`text-[10px] block mt-0.5 truncate ${isSelected ? 'text-indigo-400/80' : 'text-white/40'}`}>
                                                {opt.description}
                                            </span>
                                        </div>

                                        {isSelected && (
                                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
