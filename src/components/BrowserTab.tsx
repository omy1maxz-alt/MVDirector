import React, { useState, useRef } from 'react';
import { 
  Globe, ArrowRight, RotateCw, ExternalLink, X, Terminal, 
  Search, ShieldAlert, Check, Play, Tv, AlertTriangle, Info,
  Compass, Layers, ShieldCheck, MonitorPlay, Sparkles, Smartphone
} from 'lucide-react';
import { normalizeYoutubeUrl } from '@/services/youtube';
import { APP_ENV, openAppBrowser } from '@/services/environment';

interface BrowserTabProps {
  onOpenCaptureLogs?: () => void;
}

export type BrowserMode = 'embedded' | 'app_browser';

interface PresetItem {
  name: string;
  url: string;
  icon: React.ReactNode;
  category: 'youtube_portal' | 'youtube_embed' | 'search' | 'website';
  expectedIframe: 'blocked' | 'allowed' | 'conditional';
  notes: string;
}

export const BrowserTab: React.FC<BrowserTabProps> = ({ onOpenCaptureLogs }) => {
  const [browserMode, setBrowserMode] = useState<BrowserMode>('embedded');
  const [inputUrl, setInputUrl] = useState('https://www.youtube-nocookie.com/embed/jfKfPfyJRdk?autoplay=1');
  const [activeUrl, setActiveUrl] = useState('https://www.youtube-nocookie.com/embed/jfKfPfyJRdk?autoplay=1');
  const [isLoading, setIsLoading] = useState(false);
  const [iframeKey, setIframeKey] = useState(1);
  const [lastBrowserLaunchResult, setLastBrowserLaunchResult] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const presets: PresetItem[] = [
    { 
      name: 'YouTube Embed (Allowed)', 
      url: 'https://www.youtube-nocookie.com/embed/jfKfPfyJRdk?autoplay=1',
      icon: <Tv className="w-3.5 h-3.5 text-red-400" />,
      category: 'youtube_embed',
      expectedIframe: 'allowed',
      notes: 'Iframe: Supported | Browser: Supported'
    },
    { 
      name: 'm.youtube.com (Portal)', 
      url: 'https://m.youtube.com',
      icon: <Play className="w-3.5 h-3.5 text-red-500" />,
      category: 'youtube_portal',
      expectedIframe: 'blocked',
      notes: 'Iframe: BLOCKED (SAMEORIGIN) | App Browser: Supported'
    },
    { 
      name: 'www.youtube.com', 
      url: 'https://www.youtube.com',
      icon: <MonitorPlay className="w-3.5 h-3.5 text-red-600" />,
      category: 'youtube_portal',
      expectedIframe: 'blocked',
      notes: 'Iframe: BLOCKED (SAMEORIGIN) | App Browser: Supported'
    },
    { 
      name: 'Wikipedia Mobile', 
      url: 'https://en.m.wikipedia.org',
      icon: <Globe className="w-3.5 h-3.5 text-blue-400" />,
      category: 'website',
      expectedIframe: 'allowed',
      notes: 'Iframe: Supported | App Browser: Supported'
    },
    { 
      name: 'DuckDuckGo Search', 
      url: 'https://duckduckgo.com',
      icon: <Search className="w-3.5 h-3.5 text-amber-400" />,
      category: 'search',
      expectedIframe: 'allowed',
      notes: 'Iframe: Supported | App Browser: Supported'
    },
    { 
      name: 'Google Search', 
      url: 'https://www.google.com',
      icon: <Search className="w-3.5 h-3.5 text-emerald-400" />,
      category: 'search',
      expectedIframe: 'blocked',
      notes: 'Iframe: BLOCKED (SAMEORIGIN) | App Browser: Supported'
    },
  ];

  // Detailed security analysis of URL
  const analyzeTargetUrl = (url: string) => {
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      const host = parsed.hostname.toLowerCase();
      const isYtPortal = (host.includes('youtube.com') || host.includes('youtu.be')) && !parsed.pathname.startsWith('/embed/');
      const isGoogleSearch = host.includes('google.com') && !host.includes('drive.google.com') && !host.includes('docs.google.com');

      if (isYtPortal) {
        return {
          isBlockedInIframe: true,
          headerReason: 'X-Frame-Options: SAMEORIGIN & CSP frame-ancestors',
          explanation: 'YouTube strictly forbids embedding its main website portal (m.youtube.com) inside <iframe> elements to protect against clickjacking. The Android Chromium engine obeys this header and displays net::ERR_BLOCKED_BY_RESPONSE.',
          recommendation: 'Use "App Browser" mode to open YouTube as a top-level page with full audio, video, and touch navigation.'
        };
      }
      if (isGoogleSearch) {
        return {
          isBlockedInIframe: true,
          headerReason: 'X-Frame-Options: SAMEORIGIN',
          explanation: 'Google Search sends X-Frame-Options: SAMEORIGIN to prevent third-party framing.',
          recommendation: 'Use "App Browser" mode for Google Search, or use DuckDuckGo in "Embedded" mode.'
        };
      }
      return {
        isBlockedInIframe: false,
        headerReason: 'Standard Embedding Allowed',
        explanation: 'This endpoint does not send restrictive X-Frame-Options headers and can render inside an in-app iframe.',
        recommendation: 'Works in both Embedded Test mode and App Browser mode.'
      };
    } catch {
      return {
        isBlockedInIframe: false,
        headerReason: 'Unknown',
        explanation: 'Invalid or custom URL.',
        recommendation: 'Verify URL format.'
      };
    }
  };

  const currentAnalysis = analyzeTargetUrl(activeUrl);

  const handleNavigate = async (targetUrl: string, forceMode?: BrowserMode) => {
    let clean = targetUrl.trim();
    if (!clean) return;

    if (!/^https?:\/\//i.test(clean)) {
      clean = 'https://' + clean;
    }

    const effectiveMode = forceMode || browserMode;
    setInputUrl(clean);
    setActiveUrl(clean);

    if (effectiveMode === 'app_browser') {
      setIsLoading(true);
      const res = await openAppBrowser(clean);
      setLastBrowserLaunchResult(res.mechanism);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      setIframeKey(k => k + 1);
    }
  };

  const handleReload = () => {
    setIsLoading(true);
    setIframeKey(k => k + 1);
  };

  const handleLaunchAppBrowser = async (urlOverride?: string) => {
    const urlToOpen = urlOverride || activeUrl;
    setIsLoading(true);
    const res = await openAppBrowser(urlToOpen);
    setLastBrowserLaunchResult(res.mechanism);
    setIsLoading(false);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#0a0a0a] text-white overflow-hidden">
      
      {/* Mode Selector & Header Banner */}
      <div className="p-2 sm:p-3 bg-[#141418] border-b border-white/10 shrink-0 space-y-2.5">
        
        {/* Mode Switcher */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex bg-black/60 p-1 rounded-xl border border-white/15 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={() => {
                setBrowserMode('embedded');
                handleNavigate(activeUrl, 'embedded');
              }}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                browserMode === 'embedded' 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Embedded Test (Iframe)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setBrowserMode('app_browser');
                handleNavigate(activeUrl, 'app_browser');
              }}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                browserMode === 'app_browser' 
                  ? 'bg-emerald-600 text-white shadow-lg' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>App Browser (Top-Level)</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-white/50">
            <span className="font-semibold text-white/70">Mechanism:</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-white font-mono text-[10px]">
              {browserMode === 'embedded' 
                ? 'HTML <iframe>' 
                : (APP_ENV.isAndroidApk ? 'Android Custom Tab (Chrome)' : 'Top-Level Browser Window')}
            </span>
          </div>
        </div>

        {/* Address & Navigation Bar */}
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
              placeholder="Enter URL (e.g. https://m.youtube.com, https://en.wikipedia.org)"
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
            <span>{browserMode === 'app_browser' ? 'Open' : 'Go'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {browserMode === 'embedded' && (
            <button
              type="button"
              onClick={handleReload}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition-colors shrink-0"
              title="Reload frame"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          )}

          <button
            type="button"
            onClick={() => handleLaunchAppBrowser()}
            className="p-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
            title="Open in App Browser (Top-Level)"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Launch App Browser</span>
          </button>
        </div>

        {/* Quick Presets Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold mr-1 shrink-0">Presets:</span>
          {presets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (preset.expectedIframe === 'blocked' && browserMode === 'embedded') {
                  setInputUrl(preset.url);
                  setActiveUrl(preset.url);
                  setIframeKey(k => k + 1);
                } else {
                  handleNavigate(preset.url);
                }
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 shrink-0 transition-all ${
                activeUrl === preset.url
                  ? 'bg-white/20 border-white/40 text-white shadow'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/70 hover:text-white'
              }`}
            >
              {preset.icon}
              <span>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 flex flex-col relative bg-[#0e0e12]">
        
        {browserMode === 'app_browser' ? (
          /* Real App Browser Mode UI */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-5 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Compass className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-bold text-white">Top-Level App Browser Mode</h2>
              <p className="text-xs text-white/70 leading-relaxed">
                Opens web pages in a real top-level browsing context via <strong className="text-emerald-300">{APP_ENV.isAndroidApk ? 'Android Custom Tabs' : 'System Browser Window'}</strong>. 
                Websites that reject iframes (including <code className="text-red-300">m.youtube.com</code> and Google Search) load with full JavaScript, cookies, accounts, and audio/video playback.
              </p>
            </div>

            <div className="p-3 bg-black/50 border border-white/10 rounded-xl w-full text-left space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between text-white/40">
                <span>Target URL:</span>
                <span className="text-emerald-400 truncate max-w-[240px]">{activeUrl}</span>
              </div>
              <div className="flex justify-between text-white/40">
                <span>Active Engine:</span>
                <span className="text-white">{APP_ENV.isAndroidApk ? 'Capacitor Chrome Custom Tab' : 'Top-Level Browser'}</span>
              </div>
              {lastBrowserLaunchResult && (
                <div className="flex justify-between text-white/40">
                  <span>Last Result:</span>
                  <span className="text-emerald-300">{lastBrowserLaunchResult}</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleLaunchAppBrowser()}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Launch "{activeUrl}" in App Browser</span>
            </button>
          </div>
        ) : (
          /* Embedded Iframe Test Mode UI */
          <div className="flex-1 flex flex-col min-h-0 relative">
            
            {/* Iframe Diagnostic Header Strip */}
            <div className={`p-2.5 text-xs flex items-center justify-between border-b ${
              currentAnalysis.isBlockedInIframe 
                ? 'bg-amber-950/40 border-amber-500/30 text-amber-200' 
                : 'bg-emerald-950/30 border-emerald-500/20 text-emerald-200'
            }`}>
              <div className="flex items-center gap-2 truncate">
                {currentAnalysis.isBlockedInIframe ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                <span className="font-semibold truncate">
                  {currentAnalysis.isBlockedInIframe 
                    ? `Iframe Block Warning: ${currentAnalysis.headerReason}` 
                    : 'Iframe Embedding Allowed'}
                </span>
              </div>

              {currentAnalysis.isBlockedInIframe && (
                <button
                  type="button"
                  onClick={() => {
                    setBrowserMode('app_browser');
                    handleLaunchAppBrowser();
                  }}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-[11px] font-bold shrink-0 transition-colors shadow"
                >
                  Switch to App Browser
                </button>
              )}
            </div>

            {/* In-Frame View */}
            <div className="flex-1 min-h-0 relative bg-white">
              {currentAnalysis.isBlockedInIframe && (
                <div className="absolute inset-0 z-10 bg-black/90 p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5 max-w-md">
                    <h3 className="text-sm font-bold text-white">Iframe Embedding Restricted by Remote Server</h3>
                    <p className="text-xs text-white/70 leading-relaxed font-sans">
                      {currentAnalysis.explanation}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleLaunchAppBrowser()}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open in App Browser (Top-Level)</span>
                    </button>
                    {activeUrl.includes('youtube.com') && (
                      <button
                        type="button"
                        onClick={() => handleNavigate('https://www.youtube-nocookie.com/embed/jfKfPfyJRdk?autoplay=1')}
                        className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all"
                      >
                        Test Video Embed Instead
                      </button>
                    )}
                  </div>
                </div>
              )}

              <iframe
                key={iframeKey}
                ref={iframeRef}
                src={activeUrl}
                title="MVDirector Web Test Inspector"
                className="w-full h-full border-0 bg-white"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                onLoad={() => setIsLoading(false)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Diagnostic Footer Bar */}
      <div className="p-2 sm:p-2.5 bg-[#141418] border-t border-white/10 flex items-center justify-between text-[11px] text-white/50 shrink-0">
        <div className="flex items-center gap-2 truncate">
          <span className="font-semibold text-white/70">Runtime:</span>
          <span>{APP_ENV.environmentLabel}</span>
        </div>
        {onOpenCaptureLogs && (
          <button
            type="button"
            onClick={onOpenCaptureLogs}
            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-md text-[10px] font-bold transition-colors flex items-center gap-1 shrink-0"
          >
            <Terminal className="w-3 h-3 text-indigo-400" />
            <span>Diagnostics</span>
          </button>
        )}
      </div>
    </div>
  );
};
