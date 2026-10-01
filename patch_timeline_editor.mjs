import fs from 'fs';
let code = fs.readFileSync('src/components/SubtitleTimelineEditor.tsx', 'utf8');

// 1. Remove youtubeUrl from props type
code = code.replace(/    youtubeUrl\?: string \| null;\n?/, '');

// 2. Remove youtubeUrl from component params
code = code.replace(/youtubeUrl, /g, '');

// 3. Remove ReactPlayer import
code = code.replace(/import ReactPlayer from 'react-player';\n?/, '');
code = code.replace(/const Player = ReactPlayer as any;.*?\n?/, '');

// 4. Update the togglePlay logic
const togglePlayOld = `    const togglePlay = () => {
        if (!mediaUrl && !youtubeUrl) return;
        
        if (youtubeUrl) {
            setIsPlaying(!isPlaying);
        } else {
            if (mediaRef.current) {
                if (isPlaying) {
                    (mediaRef.current as HTMLMediaElement).pause();
                } else {
                    const playPromise = (mediaRef.current as HTMLMediaElement).play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.warn("Media playback interrupted or not allowed:", error);
                        });
                    }
                }
            }
        }
    };`;

const togglePlayNew = `    const togglePlay = () => {
        if (!mediaUrl) return;
        
        if (mediaRef.current) {
            if (isPlaying) {
                (mediaRef.current as HTMLMediaElement).pause();
            } else {
                const playPromise = (mediaRef.current as HTMLMediaElement).play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.warn("Media playback interrupted or not allowed:", error);
                    });
                }
            }
        }
    };`;
code = code.replace(togglePlayOld, togglePlayNew);

// 5. Update seekTo
const seekToOld = `    const seekTo = (ms: number, throttleVideo: boolean = false) => {
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
    
const seekToNew = `    const seekTo = (ms: number, throttleVideo: boolean = false) => {
        if (mediaRef.current) {
            const now = performance.now();
            if (!throttleVideo || now - lastVideoSeekRef.current > 80) { // Throttle video decoding to ~12fps during drags
                (mediaRef.current as HTMLMediaElement).currentTime = ms / 1000;
                lastVideoSeekRef.current = now;
            }
            setCurrentTime(ms); // Always update React state instantly for smooth UI
        }
    };`;
code = code.replace(seekToOld, seekToNew);

// 6. Fix useEffects
const useEffectMediaUrlOld = `    useEffect(() => {
        if (youtubeUrl) {
            setMediaUrl(youtubeUrl);
        } else if (audioFile) {
            const url = URL.createObjectURL(audioFile);
            setMediaUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [audioFile, youtubeUrl]);`;
const useEffectMediaUrlNew = `    useEffect(() => {
        if (audioFile) {
            const url = URL.createObjectURL(audioFile);
            setMediaUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [audioFile]);`;
code = code.replace(useEffectMediaUrlOld, useEffectMediaUrlNew);

// Remove the youtube playing state sync effect completely
const useEffectYoutubePlayingSync = /    useEffect\(\(\) => \{\n        if \(youtubeUrl\) \{\n            \/\/ ReactPlayer handles its own playing prop, but we need to ensure our timeline loop knows when it's paused\n            if \(!isPlaying\) \{\n                cancelAnimationFrame\(requestRef.current\);\n            \}\n        \}\n    \}, \[youtubeUrl, isPlaying\]\);\n?/;
code = code.replace(useEffectYoutubePlayingSync, '');

// 7. Fix the render block
// Let's grab the whole JSX for the player container.
