import fs from 'fs';
let code = fs.readFileSync('src/components/SubtitlesTab.tsx', 'utf8');

const oldInput = `<input
                                            type="text"
                                            placeholder="Paste YouTube Link for Playback (No AI Generation)"
                                            value={youtubeUrl}
                                            onChange={(e) => setYoutubeUrl(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-red-500 transition-colors placeholder:text-white/30"
                                        />`;

const newInput = `<input
                                            type="text"
                                            placeholder="Paste YouTube Link for Playback (No AI Generation)"
                                            value={youtubeUrl}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setYoutubeUrl(val);
                                                if (val.includes('youtube.com') || val.includes('youtu.be')) {
                                                    setActiveView('editor');
                                                }
                                            }}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-red-500 transition-colors placeholder:text-white/30"
                                        />
                                        {youtubeUrl && (
                                            <button onClick={() => setActiveView('editor')} className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-1.5 px-3 rounded-lg transition-colors">
                                                Watch
                                            </button>
                                        )}`;

code = code.replace(oldInput, newInput);
fs.writeFileSync('src/components/SubtitlesTab.tsx', code);
