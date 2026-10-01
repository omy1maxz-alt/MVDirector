import React, { useState, useRef } from 'react';
import { 
  Globe, ArrowRight, RotateCw, ExternalLink, X, Terminal, 
  Search, ShieldAlert, Check, Play, Tv, AlertTriangle, Info
} from 'lucide-react';
import { normalizeYoutubeUrl } from '@/services/youtube';
import { APP_ENV } from '@/services/environment';

interface BrowserTabProps {
  onOpenCaptureLogs?: () => void;
}

export const BrowserTab: React.FC<BrowserTabProps> = ({ onOpenCaptureLogs }) => {
  const [inputUrl, setInputUrl] = useState('https://www.youtube-nocookie.com/embed/jfKfPfyJRdk?autoplay=1');
  const [activeUrl, setActiveUrl] = useState('https://www.youtube-nocookie.com/embed/jfKfPfyJRdk?autoplay=1');
  const [isLoading, setIsLoading] = useState(false);
  const [iframeKey, setIframeKey] = useState(1);
  const [showExplanation, setShowExplanation] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const presets = [
    { 
      name: 'YouTube Embed Test', 
      url: 'https://www.youtube-nocookie.com/embed/jfKfPfyJRdk?autoplay=1',
      icon: <Tv className="w-3.5 h-3.5 text-red-400" />,
      type: 'embed'
    },
    { 
      name: 'YouTube Mobile (Pop-out)', 
      url: 'https://m.youtube.com',
      icon: <Play className="w-3.5 h-3.5 text-red-500" />,
      type: 'popout'
    },
    { 
      name: 'Wikipedia', 
      url: 'https://en.m.wikipedia.org',
      icon: <Globe className="w-3.5 h-3.5 text-blue-400" />,
      type: 'embed'
    },
    { 
      name: 'Bing', 
      url: 'https://www.bing.com',
      icon: <Search className="w-3.5 h-3.5 text-emerald-400" />,
      type: 'embed'
    },
    { 
      name: 'DuckDuckGo', 
      url: 'https://duckduckgo.com',
      icon: <Search className="w-3.5 h-3.5 text-amber-400" />,
      type: 'embed'
    },
  ];

  // Detect whether target site actively blocks iframe embedding via X-Frame-Options: SAMEORIGIN
  const checkBlockedSite = (url: string) => {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.toLowerCase();
      if ((host.includes('youtube.com') || host.includes('youtu.be')) && !parsed.pathname.startsWith('/embed/')) {
        return {
          isBlocked: true,
          title: 'YouTube Blocks Iframe Embedding',
          reason: 'YouTube sends the HTTP header "X-Frame-Options: SAMEORIGIN" on m.youtube.com and youtube.com. The Chromium engine inside Android WebViews strictly blocks these responses inside <iframe> tags (net::ERR_BLOCKED_BY_RESPONSE).',
          solution: 'YouTube ONLY allows individual videos to be embedded via /embed/VIDEO_ID. To browse full YouTube, open it in your system browser.'
        };
      }
      if (host.includes('google.com') && !host.includes('drive.google.com')) {
        return {
          isBlocked: true,
          title: 'Google Search Blocks Iframes',
          reason: 'Google Search sends "X-Frame-Options: SAMEORIGIN". The browser engine refuses to render it inside an <iframe>.',
          solution: 'Use Bing or DuckDuckGo for in-app search, or pop out Google to your system browser.'
        };
      }
    } catch {
      return { isBlocked: false, title: '', reason: '', solution: '' };
    }
    return { isBlocked: false, title: '', reason: '', solution: '' };
  };

  const blockedInfo = checkBlockedSite(activeUrl);

  const handleNavigate = (targetUrl: string) => {
    let clean = targetUrl.trim();
    if (!clean) return;

    // Check if YouTube URL and convert to embed for reliable iframe playback
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

  const handlePopOut = (urlOverride?: string) => {
    const urlToOpen = urlOverride || activeUrl;
    console.info(`[BrowserTab] Opening in external browser: ${urlToOpen}`);
    window.open(urlToOpen, '_blank', 'noopener,noreferrer');
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
              placeholder="Enter web URL (e.g. https://... or YouTube video link)"
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
            onClick={() => handlePopOut()}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition-colors shrink-0"
            title="Open in system browser (Chrome/Brave)"
          >
            <ExternalLink className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowExplanation(s => !s)}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-amber-400 transition-colors shrink-0"
            title="Why ERR_BLOCKED_BY_RESPONSE?"
          >
            <Info className="w-4 h-4" />
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

        {/* Quick Presets Bar & Environment Pill */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto custom-scrollbar pb-0.5">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] text-white/40 uppercase tracking-wider shrink-0 font-bold mr-1">
              Presets:
            </span>
            {presets.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => {
                  if (preset.type === 'popout') {
                    handlePopOut(preset.url);
                  } else {
                    handleNavigate(preset.url);
                  }
                }}
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

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-300 font-semibold shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{APP_ENV.environmentLabel}</span>
          </div>
        </div>
      </div>

      {/* Explanatory Overlay Banner if toggled */}
      {showExplanation && (
        <div className="bg-[#181822] border-b border-white/10 p-4 text-xs space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Environment Status: {APP_ENV.environmentLabel}
            </span>
            <button onClick={() => setShowExplanation(false)} className="text-white/40 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-white/70 leading-relaxed">
            The app is operating in <strong>Standalone Mode</strong> outside the Google AI Studio preview sandbox.
          </p>
          <p className="text-white/70 leading-relaxed">
            Why does <code className="text-amber-300">m.youtube.com</code> show <code className="text-red-300">net::ERR_BLOCKED_BY_RESPONSE</code>? YouTube's web server deliberately responds with <code className="text-amber-300">X-Frame-Options: SAMEORIGIN</code> to prevent third-party apps from embedding the mobile portal inside an <code className="text-pink-300">&lt;iframe&gt;</code>.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-emerald-400 font-semibold">Native Capability:</span>
            <span className="text-white/80">Because you are outside the sandbox, you can tap <strong>Pop out</strong> to launch full YouTube in your phone's browser or native YouTube app with zero restrictions.</span>
          </div>
        </div>
      )}

      {/* Main WebView Frame */}
      <div className="flex-1 min-h-0 relative bg-black flex flex-col">
        {isLoading && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-indigo-500/20 overflow-hidden z-10">
            <div className="h-full bg-indigo-500 w-1/3 animate-[pulse_1s_infinite]" />
          </div>
        )}

        {/* If the active site is known to block iframes via X-Frame-Options, display a friendly overlay */}
        {blockedInfo.isBlocked ? (
          <div className="absolute inset-0 bg-[#0c0c11] flex flex-col items-center justify-center p-6 text-center z-10 space-y-4">
            <div className="p-3 bg-red-500/10 text-red-400 rounded-2xl border border-red-500/20 shadow-xl">
              <ShieldAlert className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-sm">
              <h3 className="text-sm font-bold text-white">{blockedInfo.title}</h3>
              <div className="p-2.5 bg-black/60 rounded-xl border border-white/5 font-mono text-[11px] text-red-300">
                net::ERR_BLOCKED_BY_RESPONSE
              </div>
              <p className="text-xs text-white/60 leading-relaxed text-left">
                {blockedInfo.reason}
              </p>
              <p className="text-xs text-emerald-400/90 leading-relaxed text-left font-medium">
                {blockedInfo.solution}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 w-full max-w-xs">
              <button
                type="button"
                onClick={() => handlePopOut()}
                className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open in System Browser</span>
              </button>
              
              <button
                type="button"
                onClick={() => handleNavigate('https://www.youtube-nocookie.com/embed/jfKfPfyJRdk?autoplay=1')}
                className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/15 text-white text-xs font-medium rounded-xl border border-white/10 flex items-center justify-center gap-2 transition-colors"
              >
                <Tv className="w-4 h-4 text-red-400" />
                <span>Test Video Embed Instead</span>
              </button>
            </div>
          </div>
        ) : (
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
        )}

        {/* Floating Bottom Info Bar */}
        <div className="bg-[#121217] border-t border-white/10 px-3 py-1.5 flex items-center justify-between text-[11px] text-white/60 shrink-0">
          <div className="flex items-center gap-2 truncate">
            <span className={`w-2 h-2 rounded-full shrink-0 ${blockedInfo.isBlocked ? 'bg-red-400 animate-pulse' : 'bg-emerald-400'}`} />
            <span className="truncate font-mono">{activeUrl}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handlePopOut()}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
            >
              <span>Pop out</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
