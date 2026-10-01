import React, { useState, useRef } from 'react';
import { 
  Globe, ArrowRight, RotateCw, ExternalLink, X, Terminal, 
  Search, ShieldAlert, Check, Play, Tv
} from 'lucide-react';
import { normalizeYoutubeUrl } from '@/services/youtube';

interface BrowserTabProps {
  onOpenCaptureLogs?: () => void;
}

export const BrowserTab: React.FC<BrowserTabProps> = ({ onOpenCaptureLogs }) => {
  const [inputUrl, setInputUrl] = useState('https://www.youtube-nocookie.com/embed/jfKfPfyJRdk?autoplay=1');
  const [activeUrl, setActiveUrl] = useState('https://www.youtube-nocookie.com/embed/jfKfPfyJRdk?autoplay=1');
  const [isLoading, setIsLoading] = useState(false);
  const [iframeKey, setIframeKey] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const presets = [
    { 
      name: 'YouTube Embed Test', 
      url: 'https://www.youtube-nocookie.com/embed/jfKfPfyJRdk?autoplay=1',
      icon: <Tv className="w-3.5 h-3.5 text-red-400" />
    },
    { 
      name: 'YouTube Mobile', 
      url: 'https://m.youtube.com',
      icon: <Play className="w-3.5 h-3.5 text-red-500" />
    },
    { 
      name: 'Wikipedia', 
      url: 'https://en.m.wikipedia.org',
      icon: <Globe className="w-3.5 h-3.5 text-blue-400" />
    },
    { 
      name: 'Bing', 
      url: 'https://www.bing.com',
      icon: <Search className="w-3.5 h-3.5 text-emerald-400" />
    },
    { 
      name: 'DuckDuckGo', 
      url: 'https://duckduckgo.com',
      icon: <Search className="w-3.5 h-3.5 text-amber-400" />
    },
  ];

  const handleNavigate = (targetUrl: string) => {
    let clean = targetUrl.trim();
    if (!clean) return;

    // Check if YouTube URL and convert to embed for reliable iframe testing
    const yt = normalizeYoutubeUrl(clean);
    if (yt.isValid && yt.videoId && !clean.includes('/embed/')) {
      clean = `https://www.youtube-nocookie.com/embed/${yt.videoId}?autoplay=1`;
      console.info(`[BrowserTab] Auto-converted YouTube URL to embed format: ${clean}`);
    } else if (!/^https?:\/\//i.test(clean)) {
      clean = 'https://' + clean;
    }

    console.info(`[BrowserTab] Navigating to: ${clean}`);
    setInputUrl(clean);
    setActiveUrl(clean);
    setIsLoading(true);
    setIframeKey(k => k + 1);
  };

  const handleReload = () => {
    console.info(`[BrowserTab] Reloading: ${activeUrl}`);
    setIsLoading(true);
    setIframeKey(k => k + 1);
  };

  const handlePopOut = () => {
    console.info(`[BrowserTab] Opening in external browser: ${activeUrl}`);
    window.open(activeUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#0a0a0a] text-white overflow-hidden">
      
      {/* Top Address & Control Bar */}
      <div className="p-2 sm:p-3 bg-[#141418] border-b border-white/10 shrink-0 space-y-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          <div className="relative flex-1 flex items-center">
            <Globe className="w-4 h-4 text-white/40 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleNavigate(inputUrl);
                }
              }}
              placeholder="Enter web URL (e.g. https://... or YouTube link)"
              className="w-full bg-black/60 border border-white/15 text-white rounded-xl pl-9 pr-8 py-2 text-xs outline-none focus:border-indigo-500 placeholder:text-white/30 transition-colors font-mono"
            />
            {inputUrl && (
              <button
                type="button"
                onClick={() => setInputUrl('')}
                className="absolute right-2.5 text-white/30 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleNavigate(inputUrl)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1 shrink-0"
          >
            <span>Go</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleReload}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition-colors shrink-0"
            title="Reload webview"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handlePopOut}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition-colors shrink-0"
            title="Open in system browser (Chrome/Safari)"
          >
            <ExternalLink className="w-4 h-4" />
          </button>

          {onOpenCaptureLogs && (
            <button
              type="button"
              onClick={onOpenCaptureLogs}
              className="p-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-xl transition-colors shrink-0"
              title="Open Diagnostic Log Capture"
            >
              <Terminal className="w-4 h-4" />
            </button>
          )}

        </div>

        {/* Quick Presets Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-0.5">
          <span className="text-[10px] text-white/40 uppercase tracking-wider shrink-0 font-bold mr-1">
            Presets:
          </span>
          {presets.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleNavigate(preset.url)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 shrink-0 border ${
                activeUrl === preset.url 
                  ? 'bg-white/15 text-white border-white/20' 
                  : 'bg-black/40 text-white/60 hover:text-white border-white/5 hover:border-white/10'
              }`}
            >
              {preset.icon}
              <span>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main WebView Frame */}
      <div className="flex-1 min-h-0 relative bg-black flex flex-col">
        {isLoading && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-indigo-500/20 overflow-hidden z-10">
            <div className="h-full bg-indigo-500 w-1/3 animate-[pulse_1s_infinite]" />
          </div>
        )}

        <iframe
          key={iframeKey}
          ref={iframeRef}
          src={activeUrl}
          title="WebView Browser Test"
          className="w-full h-full border-0 bg-white"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={() => {
            setIsLoading(false);
            console.info(`[BrowserTab] Iframe successfully loaded: ${activeUrl}`);
          }}
          onError={(e) => {
            setIsLoading(false);
            console.error(`[BrowserTab] Iframe failed to load: ${activeUrl}`, e);
          }}
        />

        {/* Floating Bottom Info Bar */}
        <div className="bg-[#121217] border-t border-white/10 px-3 py-1.5 flex items-center justify-between text-[11px] text-white/60 shrink-0">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="truncate font-mono">{activeUrl}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] text-white/40 hidden sm:inline">
              Note: Websites blocking iframes (X-Frame-Options) won't render inside iframes; use Pop out.
            </span>
            <button
              onClick={handlePopOut}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-bold"
            >
              Pop out
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
