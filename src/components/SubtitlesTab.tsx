import React, { useState, useRef, useEffect } from 'react';
import { Subtitles, Youtube, ChevronDown, Sparkles, AlertCircle, FileText, Download, Play, Pause, Video, FileAudio, Upload, Layers, Globe, Languages, Link, Check, RefreshCw } from 'lucide-react';
import ReactPlayer from 'react-player';
const Player = ReactPlayer as any;
import { generateSRT } from '../services/gemini_srt';
import { parseSubtitles, generateSrt as generateSrtString } from '../utils/subtitleParser';
import { SubtitleTimelineEditor } from './SubtitleTimelineEditor';
import { ExportModal } from './ExportModal';
import { SubtitleFormatDropdown } from './SubtitleFormatDropdown';
import { SubtitleType } from '../types';
import { get, set } from 'idb-keyval';
import { normalizeYoutubeUrl } from '../services/youtube';

interface SubtitlesTabProps {
    file?: File | null;
    apiKeys?: any;
    apiKeySource?: string;
    onMediaSwap?: (file: File) => void;
}

export const SubtitlesTab: React.FC<SubtitlesTabProps> = ({ file, apiKeys, apiKeySource, onMediaSwap }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [generationTime, setGenerationTime] = useState<number | null>(() => {
        const saved = localStorage.getItem('mv_subtitles_gen_time');
        return saved ? parseInt(saved, 10) : null;
    });

    const safeGetItem = (key: string, defaultValue: string) => {
        try {
            const val = localStorage.getItem(key);
            return (val !== null && val !== 'null' && val !== 'undefined') ? val : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    };

    const safeSetItem = (key: string, value: string) => {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.warn('Could not save to localStorage:', e);
        }
    };

    const [mediaSourceType, setMediaSourceType] = useState<'upload' | 'youtube'>(() => 
        safeGetItem('mv_subtitles_source_type', 'upload') as 'upload' | 'youtube'
    );
    const [youtubeUrl, setYoutubeUrl] = useState<string>(() => safeGetItem('mv_subtitles_youtube_url', ''));
    const [youtubeInput, setYoutubeInput] = useState<string>(() => safeGetItem('mv_subtitles_youtube_url', ''));

    useEffect(() => {
        safeSetItem('mv_subtitles_source_type', mediaSourceType);
    }, [mediaSourceType]);

    useEffect(() => {
        safeSetItem('mv_subtitles_youtube_url', youtubeUrl);
    }, [youtubeUrl]);

    useEffect(() => {
        if (generationTime !== null) {
            localStorage.setItem('mv_subtitles_gen_time', generationTime.toString());
        } else {
            localStorage.removeItem('mv_subtitles_gen_time');
        }
    }, [generationTime]);

    // Initialize from localStorage
    const [srtContent, setSrtContent] = useState<string>(() => safeGetItem('mv_subtitles_srt', ''));
    
    const [activeView, setActiveView] = useState<'generator' | 'editor'>(() => 
        safeGetItem('mv_subtitles_view', 'generator') as 'generator' | 'editor'
    );
    
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Persist SRT content
    useEffect(() => {
        safeSetItem('mv_subtitles_srt', srtContent);
        // Auto-switch to editor if we just generated new content
        if (srtContent && activeView === 'generator' && progress === 100) {
            setActiveView('editor');
        }
    }, [srtContent]);

    // Persist View
    useEffect(() => {
        safeSetItem('mv_subtitles_view', activeView);
    }, [activeView]);

    // Load persisted audio file
    useEffect(() => {
        const loadMedia = async () => {
            try {
                const storedFile = await get('mv_subtitles_media');
                if (storedFile instanceof File) {
                    setAudioFile(storedFile);
                }
            } catch (err) {
                console.error('Failed to load persisted media', err);
            }
        };
        loadMedia();
    }, []);

    // Persist audio file when it changes
    const updateAudioFile = async (newFile: File | null) => {
        setAudioFile(newFile);
        if (newFile) {
            if (newFile.type.includes('audio')) {
                setProcessingMode('audio');
            } else if (newFile.type.includes('video')) {
                setProcessingMode('video_audio');
            }
        }
        try {
            if (newFile) {
                await set('mv_subtitles_media', newFile);
            }
        } catch (err) {
            console.error('Failed to persist media', err);
        }
    };
    
    // Generator Options
    const [subtitleType, setSubtitleType] = useState<'standard' | 'bilingual' | 'dual_trans' | 'triple' | 'quad'>(() => 
        safeGetItem('ai_sub_type', 'standard') as any
    );
    const [sourceLanguage, setSourceLanguage] = useState(() => 
        safeGetItem('ai_sub_src_lang', 'Auto-detect')
    );
    const [targetLanguage, setTargetLanguage] = useState(() => 
        safeGetItem('ai_sub_tgt_lang', 'English')
    );
    const [styling, setStyling] = useState<'none' | 'colors' | 'emojis'>(() => 
        safeGetItem('ai_sub_styling', 'none') as any
    );
    const [processingMode, setProcessingMode] = useState<'audio' | 'video_audio'>(() => 
        safeGetItem('ai_sub_proc_mode', 'video_audio') as any
    );
    const [resumeTime, setResumeTime] = useState('');
    const [contextInstruction, setContextInstruction] = useState(() => 
        safeGetItem('ai_sub_context', '')
    );

    // Persist settings
    useEffect(() => {
        safeSetItem('ai_sub_type', subtitleType);
        safeSetItem('ai_sub_src_lang', sourceLanguage);
        safeSetItem('ai_sub_tgt_lang', targetLanguage);
        safeSetItem('ai_sub_styling', styling);
        safeSetItem('ai_sub_proc_mode', processingMode);
        safeSetItem('ai_sub_context', contextInstruction);
    }, [subtitleType, sourceLanguage, targetLanguage, styling, processingMode, contextInstruction]);

    // Keep track of the audio file when the global file changes
    useEffect(() => {
        if (file && (file.type.includes('audio') || file.type.includes('video'))) {
            updateAudioFile(file);
        }
    }, [file]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type.includes('audio') || file.type.includes('video')) {
                updateAudioFile(file);
            } else {
                setError('Invalid file type. Please upload an audio or video file.');
            }
        }
    };

    const handleGenerate = async () => {
        if (mediaSourceType === 'youtube') {
            if (!youtubeUrl || !youtubeUrl.trim()) {
                setError('Please enter and apply a valid YouTube URL first.');
                return;
            }
        } else {
            if (!audioFile) {
                setError('Please upload an audio or video file first.');
                return;
            }
        }

        setIsGenerating(true);
        setError(null);
        setProgress(10);
        setGenerationTime(null);
        const startTime = Date.now();

        try {
            const mode = subtitleType === 'standard' ? 'ori' : subtitleType === 'bilingual' ? 'dual' : subtitleType === 'dual_trans' ? 'dual_trans' : subtitleType === 'triple' ? 'triple' : 'quad';
            const apiKey = (apiKeySource === 'custom' ? apiKeys?.google : undefined) || apiKeys?.google || (localStorage.getItem('gemini_api_key') || undefined);
            
            const srt = await generateSRT({
                audioFile: mediaSourceType === 'upload' ? audioFile : null,
                youtubeUrl: mediaSourceType === 'youtube' ? youtubeUrl.trim() : null,
                mode: mode as any, 
                targetLang: targetLanguage,
                sourceLang: sourceLanguage,
                apiKey,
                onProgress: (p) => setProgress(Math.max(10, p)),
                processingMode,
                resumeTime,
                contextInstruction
            });
            
            const endTime = Date.now();
            setGenerationTime(endTime - startTime);
            
            setProgress(90);
            if (srt) {
                let finalSrt = srt;
                if (resumeTime && resumeTime.trim() !== '' && srtContent && srtContent.trim() !== '') {
                    try {
                        const existingBlocks = parseSubtitles(srtContent);
                        const newBlocks = parseSubtitles(srt);
                        
                        const parts = resumeTime.replace(',', '.').split(':').map(Number);
                        let h = 0, m = 0, s = 0;
                        if (parts.length === 3) {
                            [h, m, s] = parts;
                        } else if (parts.length === 2) {
                            [m, s] = parts;
                        } else {
                            s = parts[0] || 0;
                        }
                        const resumeTimeMs = (h * 3600 + m * 60 + s) * 1000;
                        
                        const keptBlocks = existingBlocks.filter(b => b.start < resumeTimeMs);
                        
                        let adjustedNewBlocks = newBlocks;
                        if (newBlocks.length > 0 && resumeTimeMs > 10000 && newBlocks[0].start < resumeTimeMs * 0.5) {
                            adjustedNewBlocks = newBlocks.map(b => ({
                                ...b,
                                start: b.start + resumeTimeMs,
                                end: b.end + resumeTimeMs
                            }));
                        }
                        
                        const combined = [...keptBlocks, ...adjustedNewBlocks].sort((a, b) => a.start - b.start);
                        combined.forEach((b, idx) => b.id = (idx + 1).toString());
                        finalSrt = generateSrtString(combined);
                    } catch (e) {
                        console.error("Error merging SRTs:", e);
                    }
                }
                setSrtContent(finalSrt);
                setActiveView('editor');
            } else {
                setError('Failed to generate subtitles.');
            }
        } catch (err: any) {
            let msg = err?.message || 'An unexpected error occurred.';
            try {
                if (typeof msg === 'string' && (msg.startsWith('{') || msg.includes('{"error"'))) {
                    const jsonStart = msg.indexOf('{');
                    const jsonEnd = msg.lastIndexOf('}');
                    if (jsonStart !== -1 && jsonEnd !== -1) {
                        const parsed = JSON.parse(msg.slice(jsonStart, jsonEnd + 1));
                        if (parsed?.error?.message) {
                            msg = parsed.error.message;
                        }
                    }
                }
            } catch (_) {}

            if (msg.includes('403') || msg.includes('PERMISSION_DENIED') || msg.includes('does not have permission')) {
                msg = "Permission Denied (403): The active API key lacks permission for this model or file processing. Please open Settings -> API Settings Vault and verify your Gemini API key.";
            } else if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
                msg = "API Rate Limit / Quota Exceeded (429). Please wait a moment before trying again or check your Gemini API key in Settings.";
            }

            setError(msg);
        } finally {
            setProgress(100);
            setTimeout(() => setIsGenerating(false), 500);
        }
    };

    const executeDownload = (filename: string) => {
        if (!srtContent) return;
        const blob = new Blob([srtContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        setShowExportModal(false);
    };

    return (
        <div className="flex flex-col h-full bg-black/95">
            <div className="p-2 sm:p-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/5 gap-2">
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2"> 
                        <Subtitles className="w-5 h-5 text-indigo-400" /> 
                        <span className="font-bold text-white">{activeView === 'generator' ? 'AI Subtitle Generator' : 'Timeline Editor'}</span>
                    </div>
                    {generationTime !== null && srtContent && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[10px] sm:text-xs font-bold text-emerald-400 whitespace-nowrap">
                            <Sparkles className="w-3 h-3" />
                            Generated in {(generationTime / 1000).toFixed(1)}s
                        </div>
                    )}
                </div>
                
                <div className="flex bg-black/40 p-1 rounded-lg w-full sm:w-fit border border-white/10 shrink-0">
                    <button onClick={() => setActiveView('generator')} className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold transition-colors ${activeView === 'generator' ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/50 hover:text-white'}`}>AI Generator</button>
                    <button onClick={() => setActiveView('editor')} className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold transition-colors ${activeView === 'editor' ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/50 hover:text-white'}`}>Timeline Editor</button>
                </div>
            </div>

            <div className={`flex-1 flex flex-col ${activeView === 'editor' ? 'p-0 overflow-hidden min-h-0' : 'p-4 md:p-6 overflow-y-auto custom-scrollbar'}`}>
                <div className={`mx-auto w-full ${activeView === 'editor' ? 'max-w-none h-full min-h-0 flex flex-col overflow-hidden' : 'max-w-4xl space-y-8'}`}>
                    {activeView === 'generator' && (
                        <>
                            {/* About / Header Card */}
                            <div className="bg-gradient-to-br from-indigo-900/40 to-black/60 border border-indigo-500/20 p-6 rounded-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                                <div className="relative z-10 flex items-start gap-4">
                                    <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center shrink-0">
                                        <Subtitles className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white mb-2">SRT Subtitle Crafter</h2>
                                        <p className="text-white/70 text-sm leading-relaxed max-w-2xl">
                                            Generate original, dual, triple, or quad-layered subtitles directly from your audio or video files. 
                                            Powered by AI to automatically transcribe and sync precise timeline timestamps.
                                        </p>
                                    </div>
                                </div>
                            </div>
                    
                            {/* Media Source Selector */}
                            <div className="space-y-4">
                                <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 max-w-md">
                                    <button
                                        type="button"
                                        onClick={() => setMediaSourceType('upload')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${mediaSourceType === 'upload' ? 'bg-indigo-600 text-white shadow' : 'text-white/50 hover:text-white'}`}
                                    >
                                        <Upload className="w-3.5 h-3.5" />
                                        <span>Local Media File</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setMediaSourceType('youtube')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${mediaSourceType === 'youtube' ? 'bg-red-600 text-white shadow' : 'text-white/50 hover:text-white'}`}
                                    >
                                        <Youtube className="w-3.5 h-3.5 text-white" />
                                        <span>YouTube Video URL</span>
                                    </button>
                                </div>

                                {mediaSourceType === 'upload' ? (
                                    !audioFile ? (
                                        <div className="space-y-4">
                                            <label className="w-full h-44 border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 hover:border-indigo-500/50 transition-all group relative">
                                                <input type="file" ref={fileInputRef} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
                                                <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                    <Upload className="w-7 h-7 text-white/50 group-hover:text-indigo-400" />
                                                </div>
                                                <h3 className="text-white font-bold text-base mb-1">Upload Media File for AI</h3>
                                                <p className="text-white/40 text-xs">Click or drag & drop audio or video file</p>
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="bg-[#111] border border-white/10 p-4 rounded-xl flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-indigo-500/20 text-indigo-400">
                                                    {audioFile.type.includes('video') ? <Video className="w-6 h-6" /> : <FileAudio className="w-6 h-6" />}
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-medium max-w-[200px] sm:max-w-xs truncate">{audioFile.name}</h3>
                                                    <p className="text-white/40 text-xs">Ready for processing</p>
                                                </div>
                                            </div>
                                            <button onClick={() => updateAudioFile(null)} className="text-red-400 text-xs font-medium hover:underline px-2 py-1">
                                                Remove
                                            </button>
                                        </div>
                                    )
                                ) : (
                                    <div className="bg-[#111] border border-white/10 p-5 rounded-2xl space-y-4">
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <div className="relative flex-1">
                                                <Youtube className="w-4 h-4 text-red-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                                <input
                                                    type="text"
                                                    value={youtubeInput}
                                                    onChange={(e) => setYoutubeInput(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && youtubeInput.trim()) {
                                                            const raw = youtubeInput.trim();
                                                            console.info(`[SubtitlesTab] Enter pressed with: "${raw}"`);
                                                            const { url: clean, videoId, isValid } = normalizeYoutubeUrl(raw);
                                                            console.info(`[SubtitlesTab] Normalized -> "${clean}", ID: "${videoId}", valid: ${isValid}`);
                                                            if (isValid && clean) {
                                                                setYoutubeUrl(clean);
                                                                setYoutubeInput(clean);
                                                                setMediaSourceType('youtube');
                                                            }
                                                        }
                                                    }}
                                                    placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                                                    className="w-full bg-black/60 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 text-xs outline-none focus:border-red-500 placeholder:text-white/30 transition-colors"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const raw = youtubeInput.trim();
                                                    console.info(`[SubtitlesTab] Apply YouTube Video clicked with: "${raw}"`);
                                                    const { url: clean, videoId, isValid } = normalizeYoutubeUrl(raw);
                                                    console.info(`[SubtitlesTab] Normalized -> "${clean}", ID: "${videoId}", valid: ${isValid}`);
                                                    if (isValid && clean) {
                                                        setYoutubeUrl(clean);
                                                        setYoutubeInput(clean);
                                                        setMediaSourceType('youtube');
                                                    }
                                                }}
                                                disabled={!youtubeInput.trim()}
                                                className="px-5 py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-red-600/20"
                                            >
                                                <Check className="w-4 h-4" />
                                                <span>Apply YouTube Video</span>
                                            </button>
                                        </div>

                                        {youtubeUrl ? (
                                            <div className="space-y-3 pt-2">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                                        YouTube Video Linked & Ready
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setYoutubeUrl('');
                                                            setYoutubeInput('');
                                                        }}
                                                        className="text-red-400 hover:text-red-300 text-xs transition-colors"
                                                    >
                                                        Clear
                                                    </button>
                                                </div>
                                                <div className="rounded-xl overflow-hidden border border-white/10 bg-black aspect-video max-h-56 max-w-md mx-auto shadow-xl">
                                                    <Player
                                                        url={youtubeUrl}
                                                        width="100%"
                                                        height="100%"
                                                        controls={true}
                                                        pip={false}
                                                        onReady={() => console.info('[Subtitles Preview] Player ready for:', youtubeUrl)}
                                                        onError={(err: any) => console.error('[Subtitles Preview] Error loading video:', youtubeUrl, err)}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-[11px] text-white/40 leading-relaxed">
                                                Paste any public YouTube video link. Google Gemini AI will analyze the video and audio directly from YouTube to generate accurate, timestamps-aligned subtitles.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                    {/* Generator Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
                                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Style format</span>
                            </label>
                            <SubtitleFormatDropdown 
                                value={subtitleType} 
                                onChange={setSubtitleType} 
                            />
                            <p className="text-white/40 text-[11px] leading-relaxed pt-0.5">
                                {subtitleType === 'standard' && 'Clean, single-line subtitles (Native or Translated).'}
                                {subtitleType === 'bilingual' && 'Native language on top, Translated below.'}
                                {subtitleType === 'dual_trans' && 'English on top, Target Language below (No Native).'}
                                {subtitleType === 'triple' && 'Native + Romanized + Translated.'}
                                {subtitleType === 'quad' && 'Native + Romanized + English + Target.'}
                            </p>
                        </div>

                        <datalist id="language-suggestions">
                            <option value="Auto-detect" />
                            <option value="English" />
                            <option value="Spanish" />
                            <option value="French" />
                            <option value="German" />
                            <option value="Italian" />
                            <option value="Portuguese" />
                            <option value="Dutch" />
                            <option value="Russian" />
                            <option value="Japanese" />
                            <option value="Chinese (Mandarin)" />
                            <option value="Chinese (Cantonese)" />
                            <option value="Korean" />
                            <option value="Arabic" />
                            <option value="Hindi" />
                            <option value="Thai" />
                            <option value="Vietnamese" />
                            <option value="Indonesian" />
                            <option value="Turkish" />
                            <option value="Polish" />
                            <option value="Swedish" />
                            <option value="Tagalog" />
                        </datalist>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
                                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Source Language</span>
                            </label>
                            <input 
                                type="text"
                                list="language-suggestions"
                                value={sourceLanguage} 
                                onChange={(e) => setSourceLanguage(e.target.value)}
                                placeholder="e.g. Japanese, Auto-detect"
                                className="w-full bg-black/40 border border-white/10 text-white rounded-xl px-4 py-3 text-xs outline-none focus:border-indigo-500 placeholder:text-white/20 transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
                                <Languages className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Target Language</span>
                            </label>
                            <input 
                                type="text"
                                list="language-suggestions"
                                value={targetLanguage} 
                                onChange={(e) => setTargetLanguage(e.target.value)}
                                placeholder="e.g. English, Thai (Leave blank for Original)"
                                className="w-full bg-black/40 border border-white/10 text-white rounded-xl px-4 py-3 text-xs outline-none focus:border-indigo-500 placeholder:text-white/20 transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/70 uppercase tracking-wider">Visual Styling (Experimental)</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => setStyling('none')} className={`p-2.5 rounded-xl border text-center transition-all ${styling === 'none' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-black/40 border-white/10 hover:bg-white/10 text-white/70'}`}>
                                    <h4 className="font-bold text-xs">Plain Text</h4>
                                </button>
                                <button onClick={() => setStyling('colors')} className={`p-2.5 rounded-xl border text-center transition-all ${styling === 'colors' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-black/40 border-white/10 hover:bg-white/10 text-white/70'}`}>
                                    <h4 className="font-bold text-xs">Colored</h4>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mb-2 mt-4">
                        <button onClick={() => setProcessingMode('audio')} className={`flex-1 p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${processingMode === 'audio' ? 'bg-indigo-600/20 border-indigo-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                            <FileAudio className={`w-6 h-6 ${processingMode === 'audio' ? 'text-indigo-400' : 'text-white/50'}`} />
                            <span className="font-bold text-white text-sm">Listen Only (Audio)</span>
                            <span className="text-xs text-white/50 text-center">Process audio only. Faster, ignores video frames.</span>
                        </button>
                        <button onClick={() => setProcessingMode('video_audio')} disabled={audioFile && !audioFile.type.includes('video')} className={`flex-1 p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${processingMode === 'video_audio' ? 'bg-indigo-600/20 border-indigo-500' : 'bg-white/5 border-white/10 hover:bg-white/10'} ${audioFile && !audioFile.type.includes('video') ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <Video className={`w-6 h-6 ${processingMode === 'video_audio' ? 'text-indigo-400' : 'text-white/50'}`} />
                            <span className="font-bold text-white text-sm">Watch & Listen (Video)</span>
                            <span className="text-xs text-white/50 text-center">Read lips, action, and text for deeper context.</span>
                        </button>
                    </div>

                    <div className="space-y-3 mb-6">
                        <label className="text-sm font-bold text-white/70 uppercase tracking-wider flex items-center justify-between">
                            <span>Resume / Start From (Optional)</span>
                        </label>
                        <div className="flex items-center gap-2">
                            <input 
                                type="text"
                                value={resumeTime} 
                                onChange={(e) => setResumeTime(e.target.value)}
                                placeholder="e.g. 00:52:00 (Format: HH:MM:SS)"
                                className="flex-1 bg-[#111] border border-white/10 text-white rounded-xl p-3 outline-none focus:border-indigo-500 placeholder:text-white/20 font-mono text-sm"
                            />
                        </div>
                        <p className="text-xs text-white/40">If generation failed halfway, input the timestamp where it stopped. The AI will ignore everything before this time.</p>
                    </div>

                    <div className="space-y-3 mb-6">
                        <label className="text-sm font-bold text-white/70 uppercase tracking-wider flex items-center justify-between">
                            <span>Context / Instructions (Optional)</span>
                        </label>
                        <textarea 
                            value={contextInstruction}
                            onChange={(e) => setContextInstruction(e.target.value)}
                            placeholder="e.g. This is a scene from a sci-fi movie. The character's name is 'Kael'. Make sure to use casual tone."
                            className="w-full bg-[#111] border border-white/10 text-white rounded-xl p-3 outline-none focus:border-indigo-500 placeholder:text-white/20 text-sm resize-none h-24 custom-scrollbar"
                        />
                        <p className="text-xs text-white/40">Provide details about the video, character names, or specific instructions for the AI generator.</p>
                    </div>

                    <button 
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
                    </button>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <p className="text-red-200 text-sm">{error}</p>
                        </div>
                    )}
                    
                    {isGenerating && (
                        <div className="w-full bg-white/5 rounded-full h-2 mt-4 overflow-hidden">
                            <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                        </div>
                    )}
                    </>
                    )}
                    {/* Result Section */}
                    {srtContent && activeView === 'generator' && (
                        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 flex flex-col h-[500px]">
                            <div className="flex items-center justify-between mb-4 shrink-0">
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-indigo-400" />
                                    Generated Output
                                </h3>
                                <button onClick={() => setShowExportModal(true)} className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-md text-xs font-bold text-white transition-colors">
                                    <Download className="w-3 h-3" /> Download .SRT
                                </button>
                            </div>
                            <textarea 
                                value={srtContent}
                                onChange={(e) => setSrtContent(e.target.value)}
                                className="flex-1 w-full bg-black/50 border border-white/5 rounded-xl p-4 text-sm font-mono text-white/80 resize-none outline-none focus:border-indigo-500/50 custom-scrollbar"
                            />
                        </div>
                    )}
                    {activeView === 'editor' && (
                        <div className="bg-[#111] border-none sm:border-solid sm:border-white/10 rounded-none sm:rounded-2xl flex flex-col flex-1 h-full min-h-0 overflow-hidden w-full m-0">
                            <SubtitleTimelineEditor 
                                initialContent={srtContent} 
                                audioFile={mediaSourceType === 'upload' ? audioFile : null}
                                youtubeUrl={mediaSourceType === 'youtube' ? youtubeUrl : null}
                                onContentChange={setSrtContent}
                                onMediaSwap={(newFile) => {
                                    setMediaSourceType('upload');
                                    setAudioFile(newFile);
                                    if (onMediaSwap) onMediaSwap(newFile);
                                }}
                                onYoutubeUrlChange={(url) => {
                                    setYoutubeUrl(url);
                                    setYoutubeInput(url);
                                    if (url) {
                                        setMediaSourceType('youtube');
                                    }
                                }}
                                apiKey={apiKeySource === 'custom' ? apiKeys?.google : (localStorage.getItem('gemini_api_key') || undefined)}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
