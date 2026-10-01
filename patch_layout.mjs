import fs from 'fs';
let code = fs.readFileSync('src/components/SubtitleTimelineEditor.tsx', 'utf8');

const oldPlayer = `<div className="w-full h-full pointer-events-none">
                            <Player`;

const newPlayer = `<div className="absolute inset-0 w-full h-full pointer-events-none">
                            <Player`;

code = code.replace(oldPlayer, newPlayer);
fs.writeFileSync('src/components/SubtitleTimelineEditor.tsx', code);
