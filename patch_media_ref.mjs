import fs from 'fs';
let code = fs.readFileSync('src/components/SubtitleTimelineEditor.tsx', 'utf8');

// replace mediaRef.current.currentTime with a helper
// actually, let's just make helpers at the top of the component or use the ones available.

code = code.replace(/mediaRef\.current\.currentTime/g, "(youtubeUrl ? (mediaRef.current as any).getCurrentTime() : (mediaRef.current as HTMLMediaElement).currentTime)");
code = code.replace(/mediaRef\.current\.duration/g, "(youtubeUrl ? (mediaRef.current as any).getDuration() : (mediaRef.current as HTMLMediaElement).duration)");
code = code.replace(/mediaRef\.current\.paused/g, "(!isPlaying)");

// Handle mediaRef.current.play() and .pause()
code = code.replace(/const playPromise = mediaRef\.current\.play\(\);/g, `
                if (youtubeUrl) {
                    setIsPlaying(true);
                } else {
                    const playPromise = (mediaRef.current as HTMLMediaElement).play();
`);
// wait, if I do this, I need to match the exact block or it gets messy.

fs.writeFileSync('patch_media_ref_temp.ts', code);
