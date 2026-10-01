import fs from 'fs';
let code = fs.readFileSync('src/components/SubtitleTimelineEditor.tsx', 'utf8');

const oldWrapper = \`<div className="w-full h-full pointer-events-none" onClick={togglePlay}>\`;
const newWrapper = \`<div className="absolute inset-0 w-full h-full z-10 cursor-pointer" onClick={togglePlay}></div>
                    <div className="w-full h-full pointer-events-none">\`;

code = code.replace(oldWrapper, newWrapper);
// Need to add closing div.
// Wait, safer to just replace the whole youtubeUrl block.

const blockOld = \`{youtubeUrl ? (
                    <div className="w-full h-full pointer-events-none" onClick={togglePlay}>
                        <Player
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
                        />
                    </div>
                )\`;
                
const blockNew = \`{youtubeUrl ? (
                    <>
                        <div className="absolute inset-0 z-10 cursor-pointer" onClick={togglePlay} />
                        <div className="w-full h-full pointer-events-none">
                            <Player
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
                            />
                        </div>
                    </>
                )\`;
                
code = code.replace(blockOld, blockNew);
fs.writeFileSync('src/components/SubtitleTimelineEditor.tsx', code);
