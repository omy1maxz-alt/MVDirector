import fs from 'fs';
let code = fs.readFileSync('src/components/SubtitleTimelineEditor.tsx', 'utf8');

const oldTogglePlay = `    const togglePlay = () => {
        if (mediaRef.current) {
            console.log(\`[Timeline] togglePlay. Currently paused? \${mediaRef.current.paused}\`);
            if (mediaRef.current.paused) {
                const playPromise = mediaRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log(\`[Timeline] togglePlay successful\`);
                    }).catch(error => {
                        if (error.name !== 'AbortError') {
                            console.error('[Timeline] Playback error:', error);
                        }
                    });
                }
            } else {
                mediaRef.current.pause();
            }
        } else {
             console.error('[Timeline] togglePlay called but mediaRef.current is null');
        }
    };`;

const newTogglePlay = `    const togglePlay = () => {
        if (youtubeUrl) {
            setIsPlaying(prev => !prev);
            return;
        }
        if (mediaRef.current) {
            if ((mediaRef.current as HTMLMediaElement).paused) {
                const playPromise = (mediaRef.current as HTMLMediaElement).play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        if (error.name !== 'AbortError') {
                            console.error('[Timeline] Playback error:', error);
                        }
                    });
                }
            } else {
                (mediaRef.current as HTMLMediaElement).pause();
            }
        }
    };`;

code = code.replace(oldTogglePlay, newTogglePlay);

// Replace mediaRef.current.currentTime = ms / 1000;
code = code.replace("mediaRef.current.currentTime = ms / 1000;", `if (youtubeUrl) {
                    (mediaRef.current as any).seekTo(ms / 1000, 'seconds');
                } else {
                    (mediaRef.current as HTMLMediaElement).currentTime = ms / 1000;
                }`);

// Replace mediaRef.current.pause() in pointer events
code = code.replace(/if \(mediaRef\.current && !mediaRef\.current\.paused\) {\n\s*mediaRef\.current\.pause\(\);\n\s*}/g, `if (youtubeUrl) { setIsPlaying(false); } else if (mediaRef.current && !(mediaRef.current as HTMLMediaElement).paused) { (mediaRef.current as HTMLMediaElement).pause(); }`);

// Check updateTime
const oldUpdateTime = `    const updateTime = () => {
        if (mediaRef.current) {
            setCurrentTime(mediaRef.current.currentTime * 1000);
            if (mediaRef.current.paused) {
                cancelAnimationFrame(animationRef.current!);
            } else {
                animationRef.current = requestAnimationFrame(updateTime);
            }
        }
    };`;
const newUpdateTime = `    const updateTime = () => {
        if (mediaRef.current) {
            const time = youtubeUrl ? (mediaRef.current as any).getCurrentTime() : (mediaRef.current as HTMLMediaElement).currentTime;
            setCurrentTime(time * 1000);
            const isPaused = youtubeUrl ? !isPlaying : (mediaRef.current as HTMLMediaElement).paused;
            if (isPaused) {
                cancelAnimationFrame(animationRef.current!);
            } else {
                animationRef.current = requestAnimationFrame(updateTime);
            }
        }
    };`;
code = code.replace(oldUpdateTime, newUpdateTime);

const oldMetadata = `    const handleMediaLoadedMetadata = () => {
        if (!mediaRef.current || !audioFile || !audioFile.type.includes('video')) return;
        setDuration(mediaRef.current.duration * 1000);
        
        // Setup a small hidden canvas to extract video frame
        const canvas = document.createElement('canvas');`;
const newMetadata = `    const handleMediaLoadedMetadata = () => {
        if (!mediaRef.current || !audioFile || !audioFile.type.includes('video')) return;
        setDuration((mediaRef.current as HTMLMediaElement).duration * 1000);
        
        // Setup a small hidden canvas to extract video frame
        const canvas = document.createElement('canvas');`;
code = code.replace(oldMetadata, newMetadata);

fs.writeFileSync('src/components/SubtitleTimelineEditor.tsx', code);
