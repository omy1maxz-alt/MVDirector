import fs from 'fs';
let code = fs.readFileSync('src/components/SubtitleTimelineEditor.tsx', 'utf8');

const startStr = "{audioFile ? (";
const endStr = "Upload media in the generator first to sync playback\n                    </div>\n                )}";

const startIndex = code.indexOf(startStr);
const endIndex = code.indexOf(endStr) + endStr.length;

if (startIndex !== -1 && endIndex !== -1) {
    const oldBlock = code.substring(startIndex, endIndex);
    
    const newBlock = `{youtubeUrl ? (
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
                ) : audioFile ? (
                    audioFile.type.includes('video') ? (
                        <>
                        <video 
                            ref={mediaRef as React.RefObject<HTMLVideoElement>} 
                            src={mediaUrl || undefined} 
                            className="w-full h-full object-contain"
                            onLoadedMetadata={handleMediaLoadedMetadata}
                            onClick={togglePlay}
                            onPause={() => setIsPlaying(false)}
                            onPlay={() => setIsPlaying(true)}
                                onEnded={() => setIsPlaying(false)}
                        />
                        </>
                    ) : (
                        <>
                            <audio 
                                ref={mediaRef as React.RefObject<HTMLAudioElement>} 
                                src={mediaUrl || undefined} 
                                onLoadedMetadata={handleMediaLoadedMetadata}
                                onPause={() => setIsPlaying(false)}
                                onPlay={() => setIsPlaying(true)}
                                onEnded={() => setIsPlaying(false)}
                            />
                            <div className="text-white/20 flex flex-col items-center">
                                <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
                                    <div className="w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
                                </div>
                                <p className="font-medium text-sm tracking-widest uppercase">Audio Track</p>
                            </div>
                        </>
                    )
                ) : (
                    <div className="text-white/20 text-sm font-medium border-2 border-dashed border-white/10 p-12 rounded-2xl text-center mx-4">
                        Upload media or paste YouTube link first to sync playback
                    </div>
                )}`;
                
    code = code.replace(oldBlock, newBlock);
    fs.writeFileSync('src/components/SubtitleTimelineEditor.tsx', code);
    console.log("Success");
} else {
    console.log("Not found.");
}
