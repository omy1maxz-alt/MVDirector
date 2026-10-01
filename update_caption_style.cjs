const fs = require('fs');
let content = fs.readFileSync('src/components/SubtitleTimelineEditor.tsx', 'utf8');

// 1. Update lucide imports
content = content.replace("GripHorizontal, Camera } from 'lucide-react'", "GripHorizontal, Camera, Settings } from 'lucide-react'");

// 2. Add states
const stateInsertPos = content.indexOf('    const [containerWidth, setContainerWidth] = useState(0);');
const statesToAdd = `    const [previewSize, setPreviewSize] = useState(24);
    const [previewPosition, setPreviewPosition] = useState(10);
    const [showPreviewSettings, setShowPreviewSettings] = useState(false);\n`;
content = content.substring(0, stateInsertPos) + statesToAdd + content.substring(stateInsertPos);

// 3. Update overlay div
const overlayTarget = `                                <div className="absolute bottom-[10%] w-[90%] md:w-[70%] text-center z-10 pointer-events-none flex flex-col gap-2">
                    {activeBlocks.map(block => (
                         <p 
                             key={block.id} 
                             className="text-white font-bold px-4 py-1 text-xl sm:text-2xl md:text-3xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mx-auto leading-snug whitespace-pre-wrap"
                             style={{ 
                                 textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 2px 0 #000, 2px 0 0 #000, 0 -2px 0 #000, -2px 0 0 #000',
                             }}
                        >
                            {block.text}
                        </p>
                    ))}
                </div>`;

const overlayReplace = `                                <div 
                    className="absolute w-[90%] md:w-[70%] text-center z-10 pointer-events-none flex flex-col gap-2 transition-all duration-200"
                    style={{ bottom: \`\${previewPosition}%\` }}
                >
                    {activeBlocks.map(block => (
                         <p 
                             key={block.id} 
                             className="text-white font-bold px-4 py-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mx-auto leading-snug whitespace-pre-wrap transition-all duration-200"
                             style={{ 
                                 fontSize: \`\${previewSize}px\`,
                                 textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 2px 0 #000, 2px 0 0 #000, 0 -2px 0 #000, -2px 0 0 #000',
                             }}
                        >
                            {block.text}
                        </p>
                    ))}
                </div>`;
content = content.replace(overlayTarget, overlayReplace);

// 4. Update the save frame button and wrap it in a div
const buttonTarget = `<button 
                            onClick={(e) => { e.stopPropagation(); saveCurrentFrame(); }}
                            className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white font-bold py-1.5 px-3 rounded-lg text-xs flex items-center gap-2 border border-white/10 transition-all shadow-xl z-40"
                            title="Save current frame"
                        >
                            <Camera className="w-4 h-4" />
                            <span className="hidden sm:inline">Save Frame</span>
                        </button>`;

const buttonReplace = `<div className="absolute top-4 right-4 flex flex-col gap-2 items-end z-40">
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setShowPreviewSettings(!showPreviewSettings); }}
                                    className="bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white font-bold py-1.5 px-3 rounded-lg text-xs flex items-center gap-2 border border-white/10 transition-all shadow-xl"
                                    title="Caption Settings"
                                >
                                    <Settings className="w-4 h-4" />
                                    <span className="hidden sm:inline">Caption Style</span>
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); saveCurrentFrame(); }}
                                    className="bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white font-bold py-1.5 px-3 rounded-lg text-xs flex items-center gap-2 border border-white/10 transition-all shadow-xl"
                                    title="Save current frame"
                                >
                                    <Camera className="w-4 h-4" />
                                    <span className="hidden sm:inline">Save Frame</span>
                                </button>
                            </div>
                            
                            {showPreviewSettings && (
                                <div 
                                    className="bg-[#1a1a1a] border border-white/20 p-4 rounded-xl shadow-2xl flex flex-col gap-4 min-w-[200px]"
                                    onClick={e => e.stopPropagation()}
                                >
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-bold text-white/70 uppercase tracking-wider">Caption Style</h4>
                                        <button onClick={() => setShowPreviewSettings(false)} className="text-white/40 hover:text-white"><X className="w-4 h-4" /></button>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs text-white/50">
                                                <span>Size</span>
                                                <span>{previewSize}px</span>
                                            </div>
                                            <input 
                                                type="range" 
                                                min="12" max="72" step="2"
                                                value={previewSize}
                                                onChange={(e) => setPreviewSize(Number(e.target.value))}
                                                className="w-full accent-indigo-500 cursor-pointer"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs text-white/50">
                                                <span>Position (Y)</span>
                                                <span>{previewPosition}%</span>
                                            </div>
                                            <input 
                                                type="range" 
                                                min="0" max="90" step="1"
                                                value={previewPosition}
                                                onChange={(e) => setPreviewPosition(Number(e.target.value))}
                                                className="w-full accent-indigo-500 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>`;
content = content.replace(buttonTarget, buttonReplace);

fs.writeFileSync('src/components/SubtitleTimelineEditor.tsx', content);
console.log("Patched SubtitleTimelineEditor.tsx");
