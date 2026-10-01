import fs from 'fs';
let code = fs.readFileSync('src/components/SubtitleTimelineEditor.tsx', 'utf8');

const oldStr = `<div className="absolute inset-0 w-full h-full pointer-events-none">
                            <Player
                                ref={mediaRef as any}
                                url={youtubeUrl}
                                width="100%"
                                height="100%"
                                playing={isPlaying}
                                onReady={() => {
                                    if (mediaRef.current) {
                                        const d = typeof (mediaRef.current as any).getDuration === 'function' ? (mediaRef.current as any).getDuration() : 0;
                                        if (d) setDuration(d * 1000);
                                    }
                                }}
                                onPause={() => setIsPlaying(false)}
                                onPlay={() => setIsPlaying(true)}
                                onEnded={() => setIsPlaying(false)}
                                style={{ pointerEvents: 'none' }}
                            />
                        </div>`;

const newStr = `<div className="absolute inset-0 w-full h-full">
                            <Player
                                ref={mediaRef as any}
                                url={youtubeUrl}
                                width="100%"
                                height="100%"
                                playing={isPlaying}
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
                        </div>`;

code = code.replace(oldStr, newStr);
fs.writeFileSync('src/components/SubtitleTimelineEditor.tsx', code);
