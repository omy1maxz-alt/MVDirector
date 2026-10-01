import fs from 'fs';
let code = fs.readFileSync('src/components/SubtitleTimelineEditor.tsx', 'utf8');

if (!code.includes("import ReactPlayer")) {
    code = "import ReactPlayer from 'react-player';\n" + code;
}
if (!code.includes("const Player = ReactPlayer as any;")) {
    code = code.replace("import ReactPlayer from 'react-player';", "import ReactPlayer from 'react-player';\nconst Player = ReactPlayer as any;");
}

code = code.replace("audioFile: File | null;", "audioFile: File | null;\n    youtubeUrl?: string | null;");
code = code.replace("audioFile, onContentChange", "audioFile, youtubeUrl, onContentChange");

// For media URL logic
const effectBlock = `    useEffect(() => {
        if (audioFile) {
            const url = URL.createObjectURL(audioFile);
            setMediaUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setMediaUrl(null);
        }
    }, [audioFile]);`;

const newEffectBlock = `    useEffect(() => {
        if (youtubeUrl) {
            setMediaUrl(youtubeUrl);
        } else if (audioFile) {
            const url = URL.createObjectURL(audioFile);
            setMediaUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setMediaUrl(null);
        }
    }, [audioFile, youtubeUrl]);`;

code = code.replace(effectBlock, newEffectBlock);

// Replace render logic
const renderBlock = `{audioFile ? (
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
                                className="hidden"
                            />
                            <div className="flex flex-col items-center justify-center gap-4 text-white/50 w-full h-full" onClick={togglePlay}>
                                <FileAudio className="w-16 h-16 opacity-50" />
                                <p className="text-sm font-medium">Audio Preview Mode</p>
                            </div>
                        </>
                    )
                ) : (
                    <div className="flex flex-col items-center justify-center gap-4 text-white/20">
                        <Video className="w-16 h-16 opacity-20" />
                        <p>Upload a video or audio file to preview captions</p>
                    </div>
                )}`;

const newRenderBlock = `{youtubeUrl ? (
                    <div className="w-full h-full pointer-events-none" onClick={togglePlay}>
                        <Player
                            ref={mediaRef as any}
                            url={youtubeUrl}
                            width="100%"
                            height="100%"
                            playing={isPlaying}
                            onDuration={(d: number) => setDuration(d)}
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
                                className="hidden"
                            />
                            <div className="flex flex-col items-center justify-center gap-4 text-white/50 w-full h-full" onClick={togglePlay}>
                                <FileAudio className="w-16 h-16 opacity-50" />
                                <p className="text-sm font-medium">Audio Preview Mode</p>
                            </div>
                        </>
                    )
                ) : (
                    <div className="flex flex-col items-center justify-center gap-4 text-white/20">
                        <Video className="w-16 h-16 opacity-20" />
                        <p>Upload a video/audio file or paste a YouTube link to preview captions</p>
                    </div>
                )}`;
code = code.replace(renderBlock, newRenderBlock);

fs.writeFileSync('src/components/SubtitleTimelineEditor.tsx', code);
