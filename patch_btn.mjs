import fs from 'fs';
let code = fs.readFileSync('src/components/SubtitlesTab.tsx', 'utf8');

const oldBtn = `<button 
                        onClick={handleGenerate}
                        disabled={!audioFile || isGenerating}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/10 disabled:text-white/30 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl"
                    >
                        {isGenerating ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                Analyzing Audio & Timing...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                Generate SRT Subtitles
                            </>
                        )}
                    </button>`;

const newBtn = `<button 
                        onClick={handleGenerate}
                        disabled={!audioFile || isGenerating}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/10 disabled:text-white/30 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl"
                    >
                        {isGenerating ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                Analyzing Audio & Timing...
                            </>
                        ) : !audioFile ? (
                            <>
                                <FileAudio className="w-5 h-5" />
                                Upload Local File to Generate
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                Generate SRT Subtitles
                            </>
                        )}
                    </button>`;

code = code.replace(oldBtn, newBtn);
if(!code.includes('FileAudio')) {
    code = code.replace(/import \{ ([^}]+) \} from 'lucide-react';/, "import { $1, FileAudio } from 'lucide-react';");
}
fs.writeFileSync('src/components/SubtitlesTab.tsx', code);
