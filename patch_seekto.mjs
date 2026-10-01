import fs from 'fs';
let code = fs.readFileSync('src/components/SubtitleTimelineEditor.tsx', 'utf8');

const oldSeekTo = `    const seekTo = (ms: number, throttleVideo: boolean = false) => {
        if (mediaRef.current) {
            const now = performance.now();
            if (!throttleVideo || now - lastVideoSeekRef.current > 80) { // Throttle video decoding to ~12fps during drags
                if (youtubeUrl) {
                    (mediaRef.current as any).seekTo(ms / 1000, 'seconds');
                } else {
                    (mediaRef.current as HTMLMediaElement).currentTime = ms / 1000;
                }
                lastVideoSeekRef.current = now;
            }
            setCurrentTime(ms); // Always update React state instantly for smooth UI
        }
    };`;

const newSeekTo = `    const seekTo = (ms: number, throttleVideo: boolean = false) => {
        if (mediaRef.current) {
            const now = performance.now();
            if (!throttleVideo || now - lastVideoSeekRef.current > 80) { // Throttle video decoding to ~12fps during drags
                if (youtubeUrl) {
                    if (typeof (mediaRef.current as any).seekTo === 'function') {
                        (mediaRef.current as any).seekTo(ms / 1000, 'seconds');
                    }
                } else {
                    (mediaRef.current as HTMLMediaElement).currentTime = ms / 1000;
                }
                lastVideoSeekRef.current = now;
            }
            setCurrentTime(ms); // Always update React state instantly for smooth UI
        }
    };`;

code = code.replace(oldSeekTo, newSeekTo);
fs.writeFileSync('src/components/SubtitleTimelineEditor.tsx', code);
