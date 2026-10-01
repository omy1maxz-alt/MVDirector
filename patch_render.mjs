import fs from 'fs';
let code = fs.readFileSync('src/components/SubtitleTimelineEditor.tsx', 'utf8');

const oldRender = `{youtubeUrl ? (
                    <>
                        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center text-white/30 p-6 text-center">
                            <Youtube className="w-12 h-12 mb-3 text-white/20" />
                            <p className="font-medium">Video not showing?</p>
                            <p className="text-sm mt-1 max-w-xs">YouTube disables embedding for many official music videos. Use the 'Pop out' button above to watch it in a separate tab while editing.</p>
                        </div>
                        <div className="absolute inset-0 z-10 cursor-pointer" onClick={togglePlay} />
                        <button 
                            onClick={(e) => { e.stopPropagation(); window.open(youtubeUrl, '_blank'); }}
                            className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-black/80 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 backdrop-blur-sm transition-all border border-white/10 hover:border-white/30"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Pop out (Bypass Block)
                        </button>
                        <div className="absolute inset-0 w-full h-full">
                            <Player
                                ref={mediaRef as any}
                                url={youtubeUrl}
                                width="100%"
                                height="100%"
                                playing={isPlaying}
                                controls={false}
                                config={{ youtube: { playerVars: { origin: window.location.origin } } }}
                                onError={(e) => {
                                    console.warn('ReactPlayer Error (Likely embed blocked by YouTube)', e);
                                }}
                                onReady={() => {
                                    if (mediaRef.current) {
                                        const d = typeof (mediaRef.current as any).getDuration === 'function' ? (mediaRef.current as any).getDuration() : 0;
                                        if (d) setDuration(d * 1000);
                                    }
                                }}
                                onPause={() => setIsPlaying(false)}
                                onPlay={() => setIsPlaying(true)}
                                onEnded={() => setIsPlaying(false)}
                            />
                        </div>
                    </>
                ) : audioFile ? (`;

const newRender = `{audioFile ? (`;

code = code.replace(oldRender, newRender);
fs.writeFileSync('src/components/SubtitleTimelineEditor.tsx', code);
