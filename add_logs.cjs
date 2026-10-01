const fs = require('fs');
let content = fs.readFileSync('src/components/SubtitleTimelineEditor.tsx', 'utf-8');

// Replace seekTo
const oldSeekTo = `    const seekTo = (ms: number) => {
        if (mediaRef.current) {
            mediaRef.current.currentTime = ms / 1000;
            setCurrentTime(ms);
        }
    };`;
const newSeekTo = `    const seekTo = (ms: number) => {
        if (mediaRef.current) {
            console.log(\`[Timeline] seekTo \${ms}ms. Previous: \${mediaRef.current.currentTime * 1000}ms\`);
            mediaRef.current.currentTime = ms / 1000;
            setCurrentTime(ms);
        }
    };`;
content = content.replace(oldSeekTo, newSeekTo);

// Replace togglePlay
const oldTogglePlay = `    const togglePlay = () => {
        if (mediaRef.current) {
            if (mediaRef.current.paused) {
                const playPromise = mediaRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        if (error.name !== 'AbortError') {
                            console.error('Playback error:', error);
                        }
                    });
                }
            } else {
                mediaRef.current.pause();
            }
        }
    };`;
const newTogglePlay = `    const togglePlay = () => {
        if (mediaRef.current) {
            console.log(\`[Timeline] togglePlay. Currently paused? \${mediaRef.current.paused}\`);
            if (mediaRef.current.paused) {
                const playPromise = mediaRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log(\`[Timeline] togglePlay successful\`);
                    }).catch(error => {
                        console.error('[Timeline] Playback error:', error);
                    });
                }
            } else {
                mediaRef.current.pause();
            }
        } else {
             console.error('[Timeline] togglePlay called but mediaRef.current is null');
        }
    };`;
content = content.replace(oldTogglePlay, newTogglePlay);

// Replace handlePointerUp for jump logic
const oldUp = `        // If they clicked a subtitle box without dragging, jump the playhead to its start time
        if (type && id && (type === 'move' || type === 'sync_move')) {
            const deltaX = Math.abs(e.clientX - startX);
            if (deltaX < 3) {
                const block = initialBlocks.find(b => b.id === id);
                if (block) {
                    seekTo(block.start);
                }
            }
        }`;
const newUp = `        // If they clicked a subtitle box without dragging, jump the playhead to its start time
        if (type && id && (type === 'move' || type === 'sync_move')) {
            const deltaX = Math.abs(e.clientX - startX);
            if (deltaX < 3) {
                const block = initialBlocks.find(b => b.id === id);
                if (block) {
                    console.log(\`[Timeline] Clicked block \${block.id}. Jumping to \${block.start}ms\`);
                    seekTo(block.start);
                }
            }
        }`;
content = content.replace(oldUp, newUp);

// Also look at the toolbar UI spacing
// Change the right side of the toolbar:
const oldToolbarRight = `<div className="flex justify-end items-center gap-1 sm:gap-2 w-auto relative">`;
const newToolbarRight = `<div className="flex justify-end items-center gap-1 sm:gap-1.5 w-auto relative flex-wrap shrink-0">`;
content = content.replace(oldToolbarRight, newToolbarRight);

const oldToolbarLeft = `<div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">`;
const newToolbarLeft = `<div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">`;
content = content.replace(oldToolbarLeft, newToolbarLeft);

// Center controls wrapping
const oldToolbarCenter = `<div className="flex items-center justify-center gap-4 sm:gap-6 flex-1 min-w-[120px]">`;
const newToolbarCenter = `<div className="flex items-center justify-center gap-2 sm:gap-6 flex-1 min-w-[120px]">`;
content = content.replace(oldToolbarCenter, newToolbarCenter);

fs.writeFileSync('src/components/SubtitleTimelineEditor.tsx', content);
console.log("Logs and UI tweaks added.");
