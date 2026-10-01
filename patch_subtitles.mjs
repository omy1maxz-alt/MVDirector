import fs from 'fs';
let code = fs.readFileSync('src/components/SubtitlesTab.tsx', 'utf8');

const stateBlock = "const [audioFile, setAudioFile] = useState<File | null>(null);";
code = code.replace(stateBlock, stateBlock + "\n    const [youtubeUrl, setYoutubeUrl] = useState<string>('');");

const uploadBlock = `                            {!audioFile ? (
                                <label className="w-full h-48 border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 hover:border-indigo-500/50 transition-all group relative">
                                    <input type="file"  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Upload className="w-8 h-8 text-white/50 group-hover:text-indigo-400" />
                                    </div>
                                    <h3 className="text-white font-bold text-lg mb-1">Upload Media File</h3>
                                    <p className="text-white/40 text-sm">Click or drag & drop to upload your audio or video file</p>
                                </label>
                            ) : (`;
const newUploadBlock = `                            {!audioFile ? (
                                <div className="space-y-4">
                                    <label className="w-full h-48 border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 hover:border-indigo-500/50 transition-all group relative">
                                        <input type="file"  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
                                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Upload className="w-8 h-8 text-white/50 group-hover:text-indigo-400" />
                                        </div>
                                        <h3 className="text-white font-bold text-lg mb-1">Upload Media File for AI</h3>
                                        <p className="text-white/40 text-sm">Click or drag & drop to upload your audio or video file</p>
                                    </label>
                                    <div className="flex items-center gap-4">
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
                                            onChange={(e) => setYoutubeUrl(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-red-500 transition-colors placeholder:text-white/30"
                                        />
                                    </div>
                                </div>
                            ) : (`;
code = code.replace(uploadBlock, newUploadBlock);

const styleBlock = `<div className="grid grid-cols-1 gap-2">
                                <button onClick={() => setSubtitleType('standard')} className={\`p-3 rounded-xl border text-left transition-all \${subtitleType === 'standard' ? 'bg-indigo-600/20 border-indigo-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}\`}>
                                    <h4 className="text-white font-bold text-sm">Standard (Single)</h4>
                                    <p className="text-white/40 text-xs mt-1">Clean, single-line subtitles (Native or Translated).</p>
                                </button>
                                <button onClick={() => setSubtitleType('bilingual')} className={\`p-3 rounded-xl border text-left transition-all \${subtitleType === 'bilingual' ? 'bg-indigo-600/20 border-indigo-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}\`}>
                                    <h4 className="text-white font-bold text-sm">Bilingual (Native + Target)</h4>
                                    <p className="text-white/40 text-xs mt-1">Native language on top, Translated below.</p>
                                </button>
                                <button onClick={() => setSubtitleType('dual_trans')} className={\`p-3 rounded-xl border text-left transition-all \${subtitleType === 'dual_trans' ? 'bg-indigo-600/20 border-indigo-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}\`}>
                                    <h4 className="text-white font-bold text-sm">Dual Translated</h4>
                                    <p className="text-white/40 text-xs mt-1">English on top, Target Language below (No Native).</p>
                                </button>
                                <button onClick={() => setSubtitleType('triple')} className={\`p-3 rounded-xl border text-left transition-all \${subtitleType === 'triple' ? 'bg-indigo-600/20 border-indigo-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}\`}>
                                    <h4 className="text-white font-bold text-sm">Triple-layered</h4>
                                    <p className="text-white/40 text-xs mt-1">Native + Romanized + Translated.</p>
                                </button>
                                <button onClick={() => setSubtitleType('quad')} className={\`p-3 rounded-xl border text-left transition-all \${subtitleType === 'quad' ? 'bg-indigo-600/20 border-indigo-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}\`}>
                                    <h4 className="text-white font-bold text-sm">Quad-layered</h4>
                                    <p className="text-white/40 text-xs mt-1">Native + Romanized + English + Target.</p>
                                </button>
                            </div>`;

const newStyleBlock = `<div className="relative">
                                <select 
                                    value={subtitleType} 
                                    onChange={(e) => setSubtitleType(e.target.value as any)}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white font-medium appearance-none focus:outline-none focus:border-indigo-500 transition-colors"
                                >
                                    <option value="standard">Standard (Single Line)</option>
                                    <option value="bilingual">Bilingual (Native + Target)</option>
                                    <option value="dual_trans">Dual Translated (English + Target)</option>
                                    <option value="triple">Triple-layered (Native + Romaji + Target)</option>
                                    <option value="quad">Quad-layered (Native + Romaji + English + Target)</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
                            </div>
                            <p className="text-white/40 text-xs mt-2">
                                {subtitleType === 'standard' && 'Clean, single-line subtitles (Native or Translated).'}
                                {subtitleType === 'bilingual' && 'Native language on top, Translated below.'}
                                {subtitleType === 'dual_trans' && 'English on top, Target Language below (No Native).'}
                                {subtitleType === 'triple' && 'Native + Romanized + Translated.'}
                                {subtitleType === 'quad' && 'Native + Romanized + English + Target.'}
                            </p>`;

code = code.replace(styleBlock, newStyleBlock);

const editorCall = '<SubtitleTimelineEditor initialContent={srtContent} audioFile={audioFile} onContentChange={setSrtContent} />';
code = code.replace(editorCall, '<SubtitleTimelineEditor initialContent={srtContent} audioFile={audioFile} youtubeUrl={youtubeUrl} onContentChange={setSrtContent} />');

if(!code.includes('Youtube')) {
    code = code.replace(/import \{ ([^}]+) \} from 'lucide-react';/, "import { $1, Youtube, ChevronDown } from 'lucide-react';");
}

fs.writeFileSync('src/components/SubtitlesTab.tsx', code);
