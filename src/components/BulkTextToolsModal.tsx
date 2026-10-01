import React, { useState } from 'react';
import { X, FileText, RefreshCw, ClipboardPaste } from 'lucide-react';
import { SubtitleBlock } from './SubtitleTimelineEditor';

interface BulkTextToolsModalProps {
    blocks: SubtitleBlock[];
    onApply: (newBlocks: SubtitleBlock[] | ((prev: SubtitleBlock[]) => SubtitleBlock[])) => void;
    onClose: () => void;
    apiKey?: string;
}

import { GoogleGenAI, Type } from '@google/genai';
import { getCurrentTextModel, callTextModel, withRetry } from '../services/gemini';

export function BulkTextToolsModal({ blocks, onApply, onClose, apiKey }: BulkTextToolsModalProps) {
    const [activeTab, setActiveTab] = useState<'clean' | 'overwrite' | 'replace' | 'translate'>('clean');
    
    // Translate state
    const [targetLang, setTargetLang] = useState('Indonesian');
    const [translateLine, setTranslateLine] = useState<'all' | 'line1' | 'line2'>('line2');
    const [isTranslating, setIsTranslating] = useState(false);
    const [translateProgress, setTranslateProgress] = useState(0);
    const [pastedText, setPastedText] = useState('');
    const [overwriteMode, setOverwriteMode] = useState<'all' | 'line1' | 'line2'>('all');
    
    // Replace text state
    const [findText, setFindText] = useState('');
    const [replaceText, setReplaceText] = useState('');

    const handleKeepLine = (lineIndex: number) => {
        onApply(prev => prev.map(b => {
            const lines = b.text.split('\n');
            if (lines.length > lineIndex) {
                return { ...b, text: lines[lineIndex].trim() };
            }
            return b;
        }));
        onClose();
    };

    const handleSwapLines = () => {
        onApply(prev => prev.map(b => {
            const lines = b.text.split('\n');
            if (lines.length >= 2) {
                const swapped = [lines[1].trim(), lines[0].trim(), ...lines.slice(2)].join('\n');
                return { ...b, text: swapped };
            }
            return b;
        }));
        onClose();
    };

    const handleOverwrite = () => {
        const lines = pastedText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            
        onApply(prev => prev.map((b, i) => {
            if (i >= lines.length) return b;
                
            const pLine = lines[i];
            const existingLines = b.text.split('\n');
                
            if (overwriteMode === 'all') {
                return { ...b, text: pLine };
            } else if (overwriteMode === 'line1') {
                if (existingLines.length > 0) {
                    existingLines[0] = pLine;
                    return { ...b, text: existingLines.join('\n') };
                } else {
                    return { ...b, text: pLine };
                }
            } else if (overwriteMode === 'line2') {
                if (existingLines.length >= 1) {
                    existingLines[1] = pLine;
                    return { ...b, text: existingLines.join('\n') };
                } else {
                    return { ...b, text: existingLines[0] + '\n' + pLine };
                }
            }
            return b;
        }));
        onClose();
    };

    const handleAiTranslate = async () => {
        if (!apiKey) {
            alert('Please add a Gemini API key in the settings first.');
            return;
        }
        
        setIsTranslating(true);
        setTranslateProgress(0);
        
        try {
            const ai = new GoogleGenAI({ apiKey });
            
            // To avoid token limits and structure breaking, we translate in chunks of 50 blocks
            const chunkSize = 50;
            const chunks = [];
            for (let i = 0; i < blocks.length; i += chunkSize) {
                chunks.push(blocks.slice(i, i + chunkSize));
            }
            
            let allTranslatedBlocks = [];
            
            for (let i = 0; i < chunks.length; i++) {
                const chunk = chunks[i];
                
                // Extract the specific lines we want to translate
                const payload = chunk.map(b => {
                    const lines = b.text.split('\n');
                    let textToTranslate = b.text;
                    if (translateLine === 'line1' && lines.length > 0) {
                        textToTranslate = lines[0];
                    } else if (translateLine === 'line2') {
                        // Always use Line 1 (Native) as the source of truth for the translation
                        textToTranslate = lines[0] || b.text;
                    }
                    return { id: b.id, original: textToTranslate };
                });
                
                const prompt = `Translate the following subtitle strings into ${targetLang}.
Return a JSON array of objects with the exact same 'id' and the translated string in a 'translated' field.
DO NOT combine lines. DO NOT drop ids.

Input JSON:
${JSON.stringify(payload, null, 2)}`;

                const response = await withRetry(() => callTextModel(ai, {
                    model: getCurrentTextModel() || 'gemini-3.7-flash',
                    contents: { parts: [{ text: prompt }] },
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    translated: { type: Type.STRING }
                                },
                                required: ["id", "translated"]
                            }
                        }
                    }
                }));
                
                const text = response.text;
                if (!text) throw new Error("Empty response from AI");
                
                const results = JSON.parse(text);
                
                // Merge back into chunk
                const updatedChunk = chunk.map(b => {
                    const transObj = results.find((r: any) => r.id === b.id);
                    if (!transObj) return b;
                    
                    const translatedText = transObj.translated.trim();
                    const existingLines = b.text.split('\n');
                    
                    if (translateLine === 'all') {
                        return { ...b, text: translatedText };
                    } else if (translateLine === 'line1') {
                        if (existingLines.length > 0) {
                            existingLines[0] = translatedText;
                            return { ...b, text: existingLines.join('\n') };
                        } else {
                            return { ...b, text: translatedText };
                        }
                    } else if (translateLine === 'line2') {
                        if (existingLines.length > 1) {
                            // The user requested to "ignore translit" for Line 2 translations. 
                            // This means "Line 2" conceptually targets the final translation layer, skipping middle translit lines.
                            existingLines[existingLines.length - 1] = translatedText;
                            return { ...b, text: existingLines.join('\n') };
                        } else {
                            return { ...b, text: existingLines[0] + '\n' + translatedText };
                        }
                    }
                    return b;
                });
                
                allTranslatedBlocks = [...allTranslatedBlocks, ...updatedChunk];
                setTranslateProgress(Math.round(((i + 1) / chunks.length) * 100));
            }
            
            onApply(allTranslatedBlocks);
            onClose();
        } catch (e: any) {
            console.error("AI Translate error", e);
            alert("Translation failed: " + e.message);
        } finally {
            setIsTranslating(false);
        }
    };

    const handleReplace = () => {
        if (!findText) return;
        onApply(prev => prev.map(b => {
            return { ...b, text: b.text.split(findText).join(replaceText) };
        }));
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-white/5 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Bulk Text Tools</h3>
                            <p className="text-xs text-white/50">Clean, swap, or overwrite subtitles</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex border-b border-white/10 shrink-0">
                    <button 
                        onClick={() => setActiveTab('clean')}
                        className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'clean' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-white/50 hover:text-white/80'}`}
                    >
                        Clean & Swap Lines
                    </button>
                    <button 
                        onClick={() => setActiveTab('overwrite')}
                        className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'overwrite' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-white/50 hover:text-white/80'}`}
                    >
                        Overwrite
                    </button>
                    <button 
                        onClick={() => setActiveTab('replace')}
                        className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'replace' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-white/50 hover:text-white/80'}`}
                    >
                        Find & Replace
                    </button>
                    <button 
                        onClick={() => setActiveTab('translate')}
                        className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'translate' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-white/50 hover:text-white/80'}`}
                    >
                        AI Translate
                    </button>
                </div>

                <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1">
                    {activeTab === 'clean' && (
                        <div className="space-y-4">
                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
                                <h4 className="text-sm font-bold text-white">Remove a Language</h4>
                                <p className="text-xs text-white/50 mb-3">If you have dual-layer subtitles, you can quickly remove one of the lines across all blocks.</p>
                                <div className="flex gap-2">
                                    <button onClick={() => handleKeepLine(0)} className="flex-1 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm font-semibold transition-colors border border-red-500/30">
                                        Keep ONLY Line 1
                                    </button>
                                    <button onClick={() => handleKeepLine(1)} className="flex-1 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 rounded-lg text-sm font-semibold transition-colors border border-orange-500/30">
                                        Keep ONLY Line 2
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
                                <h4 className="text-sm font-bold text-white">Swap Line Order</h4>
                                <p className="text-xs text-white/50 mb-3">Instantly flip the positions of Line 1 and Line 2 for all bilingual subtitles.</p>
                                <button onClick={handleSwapLines} className="w-full py-3 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded-lg text-sm font-semibold transition-colors border border-indigo-500/30 flex items-center justify-center gap-2">
                                    <RefreshCw className="w-4 h-4" /> Swap Line 1 and Line 2
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'translate' && (
                        <div className="space-y-4 flex flex-col h-full">
                            <div>
                                <h4 className="text-sm font-bold text-white flex items-center gap-2">AI Translate <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[10px]">Gemini 3.1 Flash</span></h4>
                                <p className="text-xs text-white/50 mb-2">Translate a specific line across all subtitles using AI. Great for bilingual switching (e.g. KR-ENG to KR-IND).</p>
                            </div>
                            
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs font-bold text-white/70 mb-1 block">Target Language</label>
                                    <input 
                                        type="text"
                                        value={targetLang}
                                        onChange={(e) => setTargetLang(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 text-white rounded-xl p-3 text-sm focus:border-indigo-500 outline-none"
                                        placeholder="E.g., Indonesian, Spanish, French"
                                    />
                                </div>
                                
                                <div>
                                    <label className="text-xs font-bold text-white/70 mb-1 block">Line to Translate</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <button 
                                            onClick={() => setTranslateLine('all')} 
                                            className={`py-2 text-xs font-bold rounded-lg border transition-all ${translateLine === 'all' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'}`}
                                        >
                                            Entire Block
                                        </button>
                                        <button 
                                            onClick={() => setTranslateLine('line1')} 
                                            className={`py-2 text-xs font-bold rounded-lg border transition-all ${translateLine === 'line1' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'}`}
                                        >
                                            Line 1
                                        </button>
                                        <button 
                                            onClick={() => setTranslateLine('line2')} 
                                            className={`py-2 text-xs font-bold rounded-lg border transition-all ${translateLine === 'line2' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'}`}
                                        >
                                            Line 2
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleAiTranslate}
                                disabled={!targetLang || isTranslating}
                                className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/10 disabled:text-white/30 text-white rounded-xl text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                {isTranslating ? (
                                    <span>Translating... {translateProgress}%</span>
                                ) : (
                                    <>
                                        <RefreshCw className="w-4 h-4" /> Start AI Translation
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {activeTab === 'replace' && (
                        <div className="space-y-4 flex flex-col h-full">
                            <div>
                                <h4 className="text-sm font-bold text-white">Find & Replace</h4>
                                <p className="text-xs text-white/50 mb-2">Search for specific words or characters and replace them across all subtitles.</p>
                            </div>
                            
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs font-bold text-white/70 mb-1 block">Find</label>
                                    <input 
                                        type="text"
                                        value={findText}
                                        onChange={(e) => setFindText(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 text-white rounded-xl p-3 text-sm focus:border-indigo-500 outline-none"
                                        placeholder="Text to find..."
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-white/70 mb-1 block">Replace with</label>
                                    <input 
                                        type="text"
                                        value={replaceText}
                                        onChange={(e) => setReplaceText(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 text-white rounded-xl p-3 text-sm focus:border-indigo-500 outline-none"
                                        placeholder="Replacement text (leave empty to delete)"
                                    />
                                </div>
                            </div>

                            <button 
                                onClick={handleReplace}
                                disabled={!findText}
                                className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/10 disabled:text-white/30 text-white rounded-xl text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" /> Replace All
                            </button>
                        </div>
                    )}

                    {activeTab === 'overwrite' && (
                        <div className="space-y-4 flex flex-col h-full">
                            <div>
                                <h4 className="text-sm font-bold text-white">Paste Translated Text</h4>
                                <p className="text-xs text-white/50 mb-2">Paste a list of sentences (one per line). They will be mapped chronologically to your current subtitle blocks.</p>
                            </div>
                            
                            <textarea 
                                value={pastedText}
                                onChange={(e) => setPastedText(e.target.value)}
                                className="w-full h-48 bg-black/50 border border-white/10 text-white rounded-xl p-3 text-sm focus:border-indigo-500 outline-none custom-scrollbar resize-none"
                                placeholder={`Pasted line 1...\nPasted line 2...\n...`}
                            />

                            <div className="grid grid-cols-3 gap-2 mt-4">
                                <button 
                                    onClick={() => setOverwriteMode('all')} 
                                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${overwriteMode === 'all' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'}`}
                                >
                                    Replace Entire Block
                                </button>
                                <button 
                                    onClick={() => setOverwriteMode('line1')} 
                                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${overwriteMode === 'line1' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'}`}
                                >
                                    Replace Line 1 Only
                                </button>
                                <button 
                                    onClick={() => setOverwriteMode('line2')} 
                                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${overwriteMode === 'line2' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'}`}
                                >
                                    Replace Line 2 Only
                                </button>
                            </div>

                            <button 
                                onClick={handleOverwrite}
                                disabled={!pastedText.trim()}
                                className="w-full py-3 mt-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-white/10 disabled:text-white/30 text-white rounded-xl text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                <ClipboardPaste className="w-4 h-4" /> Apply Overwrite
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
