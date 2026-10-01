const fs = require('fs');
let content = fs.readFileSync('src/components/SubtitleTimelineEditor.tsx', 'utf-8');

// 1. Add Clock to lucide-react imports
content = content.replace('Maximize } from \'lucide-react\';', 'Maximize, Clock } from \'lucide-react\';');

// 2. Add showSyncSettings and syncOffset state
const stateMarker = 'const [showPreviewSettings, setShowPreviewSettings] = useState(false);';
const newState = `const [showPreviewSettings, setShowPreviewSettings] = useState(false);
    const [showSyncSettings, setShowSyncSettings] = useState(false);
    const [syncOffset, setSyncOffset] = useState<number>(0);
    
    const shiftSubtitles = (offsetMs: number) => {
        updateBlocks(prev => prev.map(block => ({
            ...block,
            start: Math.max(0, block.start + offsetMs),
            end: Math.max(100, block.end + offsetMs)
        })));
    };`;
content = content.replace(stateMarker, newState);

// 3. Remove existing preview settings popover from toolbar and add Sync button
const toolbarButtonRegex = /<div className="relative">\s*<button onClick=\{\(\) => setShowPreviewSettings\(!showPreviewSettings\)\} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white\/5 hover:bg-white\/10 rounded-md text-white transition-colors" title="Caption Style">[\s\S]*?<div className="w-px h-4 bg-white\/10 mx-1 hidden sm:block"><\/div>/;

const newToolbarButtons = `<button onClick={() => setShowSyncSettings(true)} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-md text-white transition-colors" title="Sync Subtitles">
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button onClick={() => setShowPreviewSettings(true)} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-md text-white transition-colors" title="Caption Style">
                        <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button onClick={saveCurrentFrame} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-md text-white transition-colors" title="Save Frame">
                        <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button onClick={toggleFullscreen} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-md text-white transition-colors" title="Fullscreen">
                        <Maximize className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <div className="w-px h-4 bg-white/10 mx-1 hidden sm:block"></div>`;

content = content.replace(toolbarButtonRegex, newToolbarButtons);

// 4. Add the Overlay Modals just before the last closing div of the main container
const overlayHtml = `
            {/* Sync Settings Modal */}
            {showSyncSettings && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowSyncSettings(false)}>
                    <div className="bg-[#1a1a1a] border border-white/20 p-6 rounded-2xl shadow-2xl flex flex-col gap-6 min-w-[320px] max-w-[90%]" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-white/70 uppercase tracking-wider flex items-center gap-2">
                                <Clock className="w-4 h-4"/> Sync Subtitles
                            </h4>
                            <button onClick={() => setShowSyncSettings(false)} className="text-white/40 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-5 text-sm text-white/80">
                            <p>Shift all subtitles forward or backward in time.</p>
                            <div className="grid grid-cols-4 gap-2">
                                <button onClick={() => shiftSubtitles(-500)} className="py-2 bg-white/5 hover:bg-white/10 rounded-lg font-mono text-xs transition-colors">-0.5s</button>
                                <button onClick={() => shiftSubtitles(-100)} className="py-2 bg-white/5 hover:bg-white/10 rounded-lg font-mono text-xs transition-colors">-0.1s</button>
                                <button onClick={() => shiftSubtitles(100)} className="py-2 bg-white/5 hover:bg-white/10 rounded-lg font-mono text-xs transition-colors">+0.1s</button>
                                <button onClick={() => shiftSubtitles(500)} className="py-2 bg-white/5 hover:bg-white/10 rounded-lg font-mono text-xs transition-colors">+0.5s</button>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                               <input 
                                   type="number" 
                                   value={syncOffset || ''} 
                                   onChange={e => setSyncOffset(Number(e.target.value))} 
                                   className="w-full bg-black/50 border border-white/10 focus:border-indigo-500/50 outline-none rounded-lg p-2.5 text-white font-mono text-center transition-colors" 
                                   placeholder="Custom ms (e.g. 1500)"
                               />
                               <button onClick={() => { shiftSubtitles(syncOffset); setSyncOffset(0); }} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-colors">Apply</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Settings Modal */}
            {showPreviewSettings && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowPreviewSettings(false)}>
                    <div className="bg-[#1a1a1a] border border-white/20 p-6 rounded-2xl shadow-2xl flex flex-col gap-6 min-w-[320px] max-w-[90%]" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-white/70 uppercase tracking-wider flex items-center gap-2">
                                <Settings className="w-4 h-4"/> Caption Style
                            </h4>
                            <button onClick={() => setShowPreviewSettings(false)} className="text-white/40 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-white/60 font-medium">
                                    <span>Size</span>
                                    <span>{previewSize}px</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="12" max="72" step="2"
                                    value={previewSize}
                                    onChange={(e) => setPreviewSize(Number(e.target.value))}
                                    className="w-full accent-indigo-500 cursor-pointer h-2 bg-white/10 rounded-lg appearance-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-white/60 font-medium">
                                    <span>Position (Y)</span>
                                    <span>{previewPosition}%</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" max="90" step="1"
                                    value={previewPosition}
                                    onChange={(e) => setPreviewPosition(Number(e.target.value))}
                                    className="w-full accent-indigo-500 cursor-pointer h-2 bg-white/10 rounded-lg appearance-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
`;

content = content.replace('        </div>\n    );\n};\n', overlayHtml);

fs.writeFileSync('src/components/SubtitleTimelineEditor.tsx', content);
console.log("Updated SubtitleTimelineEditor.tsx successfully");
