import fs from 'fs';
let code = fs.readFileSync('src/components/SubtitleTimelineEditor.tsx', 'utf8');

const oldPlayer = `                            <Player
                                ref={mediaRef as any}
                                url={youtubeUrl}
                                width="100%"
                                height="100%"
                                playing={isPlaying}
                                onDuration={(d: number) => setDuration(d * 1000)}
                                onPause={() => setIsPlaying(false)}
                                onPlay={() => setIsPlaying(true)}
                                onEnded={() => setIsPlaying(false)}
                                progressInterval={100}
                                style={{ pointerEvents: 'none' }}
                            />`;

const newPlayer = `                            <Player
                                ref={mediaRef as any}
                                url={youtubeUrl}
                                width="100%"
                                height="100%"
                                playing={isPlaying}
                                onReady={() => {
                                    if (mediaRef.current) {
                                        const d = (mediaRef.current as any).getDuration();
                                        if (d) setDuration(d * 1000);
                                    }
                                }}
                                onPause={() => setIsPlaying(false)}
                                onPlay={() => setIsPlaying(true)}
                                onEnded={() => setIsPlaying(false)}
                                style={{ pointerEvents: 'none' }}
                            />`;

code = code.replace(oldPlayer, newPlayer);
fs.writeFileSync('src/components/SubtitleTimelineEditor.tsx', code);
