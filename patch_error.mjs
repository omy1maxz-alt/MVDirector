import fs from 'fs';
let code = fs.readFileSync('src/components/SubtitleTimelineEditor.tsx', 'utf8');

const oldPlayer = `<Player
                                ref={mediaRef as any}
                                url={youtubeUrl}
                                width="100%"
                                height="100%"
                                playing={isPlaying}
                                controls={false}
                                config={{ youtube: { playerVars: { origin: window.location.origin } } }}
                                onReady={() => {`;

const newPlayer = `<Player
                                ref={mediaRef as any}
                                url={youtubeUrl}
                                width="100%"
                                height="100%"
                                playing={isPlaying}
                                controls={false}
                                config={{ youtube: { playerVars: { origin: window.location.origin } } }}
                                onError={(e) => {
                                    console.warn('ReactPlayer Error (Likely embed blocked by YouTube)', e);
                                }}
                                onReady={() => {`;

code = code.replace(oldPlayer, newPlayer);

// Also add a nice full-screen fallback text in the background if it's completely black
const oldBg = `{youtubeUrl ? (
                    <>
                        <div className="absolute inset-0 z-10 cursor-pointer" onClick={togglePlay} />`;

const newBg = `{youtubeUrl ? (
                    <>
                        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center text-white/30 p-6 text-center">
                            <Youtube className="w-12 h-12 mb-3 text-white/20" />
                            <p className="font-medium">Video not showing?</p>
                            <p className="text-sm mt-1 max-w-xs">YouTube disables embedding for many official music videos. Use the 'Pop out' button above to watch it in a separate tab while editing.</p>
                        </div>
                        <div className="absolute inset-0 z-10 cursor-pointer" onClick={togglePlay} />`;

if (!code.includes('Video not showing?')) {
    code = code.replace(oldBg, newBg);
}

fs.writeFileSync('src/components/SubtitleTimelineEditor.tsx', code);
