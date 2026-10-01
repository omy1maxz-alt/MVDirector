import JSZip from 'jszip';
import React, { useState, useRef } from 'react';
import { Upload, FileVideo, Cpu, Play, Images, Maximize2, X, Download, Grid, Youtube } from 'lucide-react';
import { analyzeFramesWithGemini, analyzeVideoAgentic } from '@/services/gemini';

interface KeyframeAnalyzerProps {
    apiKeys: { google: string };
    apiKeySource: 'env' | 'custom';
}

export function KeyframeAnalyzer({ apiKeys, apiKeySource }: KeyframeAnalyzerProps) {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isExtracting, setIsExtracting] = useState(false);
    const [fps, setFps] = useState<number>(30);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [frames, setFrames] = useState<{ time: number; dataUrl: string }[]>([]);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
    const [youtubeUrlInput, setYoutubeUrlInput] = useState('');
    const [isAnalyzingYoutube, setIsAnalyzingYoutube] = useState(false);

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('video/')) {
            setVideoFile(file);
            setVideoUrl(URL.createObjectURL(file));
            setFrames([]);
            setAnalysisResult(null);
        }
    };

    const [isZipping, setIsZipping] = useState(false);
    const [isGeneratingGrid, setIsGeneratingGrid] = useState(false);

    const downloadAsGrid = async () => {
        if (frames.length === 0 || !videoRef.current) return;
        setIsGeneratingGrid(true);
        try {
            // Dynamic grid calculation (e.g. nearest square)
            const columns = Math.ceil(Math.sqrt(frames.length));
            const rows = Math.ceil(frames.length / columns);
            
            const frameWidth = videoRef.current.videoWidth;
            const frameHeight = videoRef.current.videoHeight;
            
            const gridCanvas = document.createElement('canvas');
            gridCanvas.width = columns * frameWidth;
            gridCanvas.height = rows * frameHeight;
            const ctx = gridCanvas.getContext('2d');
            
            if (!ctx) throw new Error("Could not get canvas context");
            
            // Fill background with black
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, gridCanvas.width, gridCanvas.height);
            
            const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            });
            
            for (let i = 0; i < frames.length; i++) {
                const img = await loadImage(frames[i].dataUrl);
                const col = i % columns;
                const row = Math.floor(i / columns);
                ctx.drawImage(img, col * frameWidth, row * frameHeight, frameWidth, frameHeight);
            }
            
            const blob = await new Promise<Blob | null>(resolve => gridCanvas.toBlob(resolve, 'image/jpeg', 0.95));
            if (blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `frames_grid_${columns}x${rows}.jpg`;
                a.click();
                URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error("Failed to generate grid", error);
        } finally {
            setIsGeneratingGrid(false);
        }
    };

    const downloadAllFramesAsZip = async () => {
        if (frames.length === 0) return;
        setIsZipping(true);
        try {
            const zip = new JSZip();
            frames.forEach((frame, idx) => {
                const base64Data = frame.dataUrl.split(',')[1];
                const frameNumber = String(idx + 1).padStart(3, '0');
                zip.file(`frame_${frameNumber}.jpg`, base64Data, { base64: true });
            });
            
            const content = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(content);
            const a = document.createElement("a");
            a.href = url;
            a.download = "extracted_frames.zip";
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to generate zip", error);
        } finally {
            setIsZipping(false);
        }
    };

    const extractFrames = async () => {
        if (!videoFile || !videoRef.current || !canvasRef.current) return;
        
        setIsExtracting(true);
        setFrames([]);
        
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
            setIsExtracting(false);
            return;
        }

        const duration = video.duration;
        const targetFrames = Math.floor(duration * fps) || 1;
        const interval = 1 / fps;
        
        const extractedFrames: { time: number; dataUrl: string }[] = [];
        
        // Match the video dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        for (let i = 0; i < targetFrames; i++) {
            const time = i * interval;
            video.currentTime = time;
            
            // Wait for video to seek
            await new Promise<void>((resolve) => {
                video.onseeked = () => resolve();
            });
            
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            // Use high quality JPEG
            const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
            extractedFrames.push({ time, dataUrl });
            
            // Show progress
            setFrames([...extractedFrames]);
        }
        
        setIsExtracting(false);
    };

    const analyzeFrames = async () => {
        if (frames.length === 0) return;
        setIsAnalyzing(true);
        
        try {
            const apiKey = apiKeySource === 'custom' ? apiKeys.google : undefined;
            const prompt = `I am providing you with multiple sequential frames extracted from a video. 
            Please analyze the sequence and describe the motion, identify any duplicate/still frames, 
            and tell me which frames are the most important "keyframes" that capture the major action.`;
            
            const base64Images = frames.map(f => f.dataUrl.split(',')[1]);
            
            const response = await analyzeFramesWithGemini(base64Images, apiKey);
            setAnalysisResult(response.text);
        } catch (err: any) {
            setAnalysisResult(`Error analyzing frames: ${err.message}`);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const analyzeYoutubeUrl = async () => {
        if (!youtubeUrlInput) return;
        setIsAnalyzingYoutube(true);
        setAnalysisResult(null);
        try {
            const apiKey = apiKeySource === 'custom' ? apiKeys.google : undefined;
            const response = await analyzeVideoAgentic(youtubeUrlInput, apiKey);
            setAnalysisResult(response.text);
        } catch (err: any) {
            setAnalysisResult(`Error analyzing YouTube video: ${err.message}`);
        } finally {
            setIsAnalyzingYoutube(false);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header Section */}
                <div className="bg-gradient-to-br from-indigo-900/40 to-black/60 border border-indigo-500/20 p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    <div className="relative z-10 flex items-start gap-4">
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center shrink-0">
                            <Images className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white mb-2">Keyframe Analyzer</h2>
                            <p className="text-white/70 text-sm leading-relaxed max-w-2xl">
                                Upload a video to dynamically extract all frames based on your chosen FPS. Use Gemini 1.5 Pro to analyze the exact motion sequence, identify keyframes, and examine your footage frame-by-frame without losing resolution.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Upload & Video */}
                    <div className="space-y-6">
                        <div className="bg-[#111] p-6 rounded-2xl border border-white/5 space-y-4">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <FileVideo className="w-4 h-4 text-indigo-400" />
                                Video Source
                            </h3>
                            
                            {!videoFile ? (
                                <div className="space-y-4">
                                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:bg-white/5 hover:border-indigo-500/50 transition-all">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                            <Upload className="w-8 h-8 text-white/40 mb-3" />
                                            <p className="text-sm font-bold text-white/70">Click to upload video</p>
                                            <p className="text-xs text-white/40 mt-1">MP4, WebM (Max ~10 seconds recommended)</p>
                                        </div>
                                        <input type="file" className="hidden" accept="video/*" onChange={handleVideoUpload} />
                                    </label>
                                    
                                    <div className="flex items-center gap-2 px-2">
                                        <div className="flex-1 h-px bg-white/10"></div>
                                        <span className="text-[10px] text-white/30 uppercase font-bold tracking-wider">OR AGENTIC MODE</span>
                                        <div className="flex-1 h-px bg-white/10"></div>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Youtube className="w-4 h-4 text-red-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input 
                                                type="text" 
                                                placeholder="Paste YouTube URL here..." 
                                                value={youtubeUrlInput}
                                                onChange={(e) => setYoutubeUrlInput(e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                        <button
                                            onClick={analyzeYoutubeUrl}
                                            disabled={!youtubeUrlInput || isAnalyzingYoutube}
                                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg text-sm flex items-center justify-center transition-all disabled:opacity-50"
                                        >
                                            {isAnalyzingYoutube ? (
                                                <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> ...</>
                                            ) : 'Analyze'}
                                        </button>
                                    </div>
                                    {isAnalyzingYoutube && (
                                        <p className="text-xs text-indigo-400 text-center animate-pulse">Running Agentic Video Analysis...</p>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                                        <video 
                                            ref={videoRef}
                                            src={videoUrl || undefined}
                                            className="w-full h-full object-contain"
                                            controls
                                        />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center justify-between text-sm text-white/70">
                                            <label className="font-bold flex items-center gap-2">Target FPS:</label>
                                            <select 
                                                value={fps} 
                                                onChange={(e) => setFps(Number(e.target.value))}
                                                className="bg-black border border-white/20 rounded px-2 py-1 text-white focus:outline-none focus:border-indigo-500"
                                            >
                                                <option value={8}>8 FPS (Anime Style)</option>
                                                <option value={12}>12 FPS (Stop Motion)</option>
                                                <option value={15}>15 FPS (Cinematic)</option>
                                                <option value={24}>24 FPS (Standard Film)</option>
                                                <option value={30}>30 FPS (Full Video)</option>
                                            </select>
                                        </div>
                                        <div className="flex gap-2">
                                        <button 
                                            onClick={extractFrames}
                                            disabled={isExtracting}
                                            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isExtracting ? (
                                                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Extracting...</>
                                            ) : (
                                                <><Images className="w-4 h-4" /> Extract All Frames</>
                                            )}
                                        </button>
                                        <button 
                                            onClick={() => setVideoFile(null)}
                                            className="p-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                                            title="Remove Video"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Analysis Section */}
                        {(frames.length > 0 || analysisResult || isAnalyzingYoutube) && (
                            <div className="bg-[#111] p-6 rounded-2xl border border-white/5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-white flex items-center gap-2">
                                        <Cpu className="w-4 h-4 text-emerald-400" />
                                        AI Analysis
                                    </h3>
                                    {frames.length > 0 && (
                                        <button 
                                            onClick={analyzeFrames}
                                            disabled={isAnalyzing || frames.length === 0}
                                            className="bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 font-bold py-1.5 px-3 rounded text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
                                        >
                                            {isAnalyzing ? 'Analyzing...' : 'Analyze Sequence'}
                                        </button>
                                    )}
                                </div>
                                
                                {analysisResult && (
                                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                        <p className="text-sm text-emerald-100 whitespace-pre-wrap leading-relaxed">
                                            {analysisResult}
                                        </p>
                                    </div>
                                )}
                                {!analysisResult && !isAnalyzing && !isAnalyzingYoutube && frames.length > 0 && (
                                    <div className="text-center p-6 border border-dashed border-white/10 rounded-xl">
                                        <p className="text-sm text-white/40">Extract frames and click analyze to have Gemini inspect the motion sequence.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Frames Grid */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <Maximize2 className="w-4 h-4 text-white/50" />
                                Extracted Frames {frames.length > 0 && `(${frames.length})`}
                            </h3>
                            {frames.length > 0 && (
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded hidden sm:inline-block">Click to view full res</span>
                                    <button 
                                        onClick={downloadAsGrid}
                                        disabled={isGeneratingGrid}
                                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1 px-3 rounded text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
                                    >
                                        <Grid className="w-3 h-3" />
                                        {isGeneratingGrid ? 'Building...' : 'Export Grid'}
                                    </button>
                                    <button 
                                        onClick={downloadAllFramesAsZip}
                                        disabled={isZipping}
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1 px-3 rounded text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
                                    >
                                        <Download className="w-3 h-3" />
                                        {isZipping ? 'Zipping...' : 'Download All (ZIP)'}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="bg-[#111] p-6 rounded-2xl border border-white/5 min-h-[400px]">
                            {frames.length === 0 ? (
                                <div className="w-full h-full flex flex-col items-center justify-center text-white/30">
                                    <Images className="w-12 h-12 mb-2 opacity-50" />
                                    <p>No frames extracted yet.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                    {frames.map((frame, idx) => (
                                        <div 
                                            key={idx} 
                                            className="group relative aspect-video bg-black rounded-lg overflow-hidden border border-white/10 cursor-pointer hover:border-indigo-500 transition-colors"
                                            onClick={() => setFullScreenImage(frame.dataUrl)}
                                        >
                                            <img src={frame.dataUrl} alt={`Frame ${idx + 1}`} className="w-full h-full object-cover" />
                                            <div className="absolute top-1 left-1 bg-black/80 backdrop-blur-sm text-[10px] font-mono text-white px-1.5 rounded">
                                                {String(idx + 1).padStart(2, '0')}
                                            </div>
                                            <div className="absolute bottom-1 right-1 bg-black/80 backdrop-blur-sm text-[10px] font-mono text-white/70 px-1.5 rounded">
                                                {frame.time.toFixed(2)}s
                                            </div>
                                            <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/20 transition-colors flex items-center justify-center">
                                                <Maximize2 className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Hidden Canvas for Extraction */}
                <canvas ref={canvasRef} className="hidden" />

                {/* Full Screen Image Modal */}
                {fullScreenImage && (
                    <div 
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setFullScreenImage(null)}
                    >
                        <button 
                            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                            onClick={() => setFullScreenImage(null)}
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <img 
                            src={fullScreenImage} 
                            alt="Full Resolution Frame" 
                            className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <a 
                            href={fullScreenImage}
                            download="extracted_frame.jpg"
                            className="absolute bottom-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-full text-sm flex items-center gap-2 shadow-xl transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Download className="w-4 h-4" /> Save High-Res Frame
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
