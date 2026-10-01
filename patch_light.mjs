import fs from 'fs';
let code = fs.readFileSync('src/components/SubtitleTimelineEditor.tsx', 'utf8');

const oldStr = `<Player
                                ref={mediaRef as any}
                                url={youtubeUrl}
                                width="100%"
                                height="100%"
                                playing={isPlaying}`;

const newStr = `<Player
                                ref={mediaRef as any}
                                url={youtubeUrl}
                                width="100%"
                                height="100%"
                                playing={isPlaying}
                                controls={false}
                                config={{ youtube: { playerVars: { origin: window.location.origin } } }}`;

code = code.replace(oldStr, newStr);
fs.writeFileSync('src/components/SubtitleTimelineEditor.tsx', code);
