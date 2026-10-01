const fs = require('fs');
let content = fs.readFileSync('src/components/SubtitleTimelineEditor.tsx', 'utf-8');

const oldBlock = `            {/* CapCut Style Controls */}
            <div className="h-auto min-h-[56px] py-2 bg-[#111] border-t border-white/10 flex flex-wrap items-center justify-between px-2 sm:px-6 shrink-0 relative z-20 gap-y-2">`;

const newBlock = `            {/* Global Video Scrubber & Playback Controls */}
            <div className="flex flex-col bg-[#111] border-t border-white/10 shrink-0 relative z-20">
                {/* Global Scrubber */}
                <div className="w-full px-2 sm:px-6 pt-3 flex items-center group cursor-pointer relative">
                    <input 
                        type="range" 
                        min={0} 
                        max={Math.max(duration, blocksDuration, 100)} 
                        value={currentTime} 
                        onChange={(e) => seekTo(Number(e.target.value))}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500 hover:[&::-webkit-slider-thumb]:w-4 hover:[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:transition-all"
                        style={{
                           background: \`linear-gradient(to right, #6366f1 \${(currentTime / Math.max(duration, blocksDuration, 1)) * 100}%, rgba(255,255,255,0.2) \${(currentTime / Math.max(duration, blocksDuration, 1)) * 100}%)\`
                        }}
                    />
                </div>
                {/* CapCut Style Controls */}
                <div className="h-auto min-h-[48px] py-2 flex flex-wrap items-center justify-between px-2 sm:px-6 gap-y-2">`;

content = content.replace(oldBlock, newBlock);
fs.writeFileSync('src/components/SubtitleTimelineEditor.tsx', content);
