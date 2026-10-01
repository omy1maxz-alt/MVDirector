import fs from 'fs';
let code = fs.readFileSync('src/components/SubtitleTimelineEditor.tsx', 'utf8');
const oldUpdateTime = `    const updateTime = useCallback(() => {
        if (mediaRef.current) {
            if (youtubeUrl) {
                // For ReactPlayer
                if (typeof (mediaRef.current as any).getCurrentTime === 'function') {
                    setCurrentTime((mediaRef.current as any).getCurrentTime() * 1000);
                }
                if (!isPlaying) {
                    setIsPlaying(false);
                } else {
                    requestRef.current = requestAnimationFrame(updateTime);
                }
            } else {
                setCurrentTime((mediaRef.current as HTMLMediaElement).currentTime * 1000);
                if ((mediaRef.current as HTMLMediaElement).paused) {
                    setIsPlaying(false);
                } else {
                    requestRef.current = requestAnimationFrame(updateTime);
                }
            }
        }
    }, [youtubeUrl, isPlaying]);`;

const newUpdateTime = `    const updateTime = useCallback(() => {
        if (mediaRef.current) {
            if (youtubeUrl) {
                // For ReactPlayer
                if (typeof (mediaRef.current as any).getCurrentTime === 'function') {
                    setCurrentTime((mediaRef.current as any).getCurrentTime() * 1000);
                }
                requestRef.current = requestAnimationFrame(updateTime);
            } else {
                setCurrentTime((mediaRef.current as HTMLMediaElement).currentTime * 1000);
                if ((mediaRef.current as HTMLMediaElement).paused) {
                    setIsPlaying(false);
                } else {
                    requestRef.current = requestAnimationFrame(updateTime);
                }
            }
        }
    }, [youtubeUrl, isPlaying]);`;
    
code = code.replace(oldUpdateTime, newUpdateTime);
fs.writeFileSync('src/components/SubtitleTimelineEditor.tsx', code);
