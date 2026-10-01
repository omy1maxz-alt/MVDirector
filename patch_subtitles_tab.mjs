import fs from 'fs';
let code = fs.readFileSync('src/components/SubtitlesTab.tsx', 'utf8');

// Remove youtubeUrl state
code = code.replace(/const \[youtubeUrl, setYoutubeUrl\] = useState<string>\(''\);\n?/, '');

// Remove the OR divider and input block
const blockToRemove = `                                    <div className="flex items-center gap-4">
                                        <div className="h-px bg-white/10 flex-1"></div>
                                        <span className="text-white/40 text-sm font-medium">OR</span>
                                        <div className="h-px bg-white/10 flex-1"></div>
                                    </div>
                                    <div className="relative">
                                        <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                                        <input
                                            type="text"
                                            placeholder="Paste YouTube Link for Playback (No AI Generation)"
                                            value={youtubeUrl}
                                            onChange={(e) => {
                                                let val = e.target.value;
                                                if ((val.includes('youtube.com') || val.includes('youtu.be')) && !val.startsWith('http')) {
                                                    val = 'https://' + val;
                                                }
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
                                        )}
                                    </div>`;

code = code.replace(blockToRemove, '');

code = code.replace('youtubeUrl={youtubeUrl} ', '');

fs.writeFileSync('src/components/SubtitlesTab.tsx', code);
