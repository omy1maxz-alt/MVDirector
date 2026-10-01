import fs from 'fs';
let code = fs.readFileSync('src/components/SubtitlesTab.tsx', 'utf8');

const oldChange = `onChange={(e) => {
                                                const val = e.target.value;
                                                setYoutubeUrl(val);
                                                if (val.includes('youtube.com') || val.includes('youtu.be')) {
                                                    setActiveView('editor');
                                                }
                                            }}`;

const newChange = `onChange={(e) => {
                                                let val = e.target.value;
                                                if ((val.includes('youtube.com') || val.includes('youtu.be')) && !val.startsWith('http')) {
                                                    val = 'https://' + val;
                                                }
                                                setYoutubeUrl(val);
                                                if (val.includes('youtube.com') || val.includes('youtu.be')) {
                                                    setActiveView('editor');
                                                }
                                            }}`;

code = code.replace(oldChange, newChange);
fs.writeFileSync('src/components/SubtitlesTab.tsx', code);
