import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './components/App';
import { PasswordGate } from './components/PasswordGate';
import { ErrorBoundary } from './components/ErrorBoundary';
import { KieChatStandalone } from './components/KieChatStandalone';
import { CrashLogger } from './components/CrashLogger';
import { initGlobalCrashLogger, recordCrash } from './services/crashLogger';
import { initGlobalLogCapture } from './services/logCapture';

// Initialize global diagnostic log capture and crash interceptors
initGlobalLogCapture();
initGlobalCrashLogger();

// Ensure window.fetch has both getter and setter so third-party/iframe shims do not throw
if (typeof window !== 'undefined') {
  try {
    const _nativeFetch = window.fetch ? window.fetch.bind(window) : null;
    let _currentFetch = _nativeFetch;
    const desc = {
      get() {
        return _currentFetch || (window.fetch !== _currentFetch ? window.fetch : _nativeFetch);
      },
      set(fn: any) {
        _currentFetch = fn;
      },
      configurable: true,
      enumerable: true,
    };
    try {
      Object.defineProperty(window, 'fetch', desc);
    } catch (_) {}
    try {
      if (typeof Window !== 'undefined' && Window.prototype) {
        Object.defineProperty(Window.prototype, 'fetch', desc);
      }
    } catch (_) {}
  } catch (_) {}
}

// Check if running in standalone popout window mode
const urlParams = new URLSearchParams(window.location.search);
const isKieChatMode = urlParams.get('mode') === 'kie_chat';

// Define window.bootLog for TypeScript
declare global {
  interface Window {
    bootLog: (msg: string, isError?: boolean) => void;
    process?: { env: any };
  }
}

// Global safety net for unhandled errors and cross-origin Script errors
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    const msg = event?.message || String(event || '');
    if (
      msg === 'Script error.' ||
      msg.includes('Script error') ||
      msg.includes('ResizeObserver loop') ||
      msg.includes('The play() request was interrupted') ||
      msg.includes('AudioContext') ||
      msg.includes('indexedDB') ||
      msg.includes('Cannot set property fetch') ||
      msg.includes('only a getter')
    ) {
      // Prevent cross-origin / benign media noise / window property override errors from crashing container
      event.preventDefault();
      console.warn('[Suppressed Global Script Error]:', msg);
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = reason?.message || String(reason || '');
    if (
      reason?.name === 'AbortError' ||
      reason?.name === 'NotAllowedError' ||
      reason?.name === 'NotSupportedError' ||
      msg === 'Script error.' ||
      msg.includes('Script error') ||
      msg.includes('ServiceWorker') ||
      msg.includes('dev-sw.js') ||
      msg.includes('sw.js') ||
      msg.includes('Database is closing/hidden') ||
      msg.includes('The play() request was interrupted') ||
      msg.includes("play() failed because the user didn't interact") ||
      msg.includes('AudioContext was not allowed to start') ||
      msg.includes('popup-closed-by-user') ||
      msg.includes('Could not save project') ||
      msg.includes('Could not save director plan') ||
      msg.includes('Cannot set property fetch') ||
      msg.includes('only a getter')
    ) {
      event.preventDefault();
      console.warn('[Suppressed Unhandled Rejection]:', reason);
    }
  });
}

// Robust polyfill for HTMLMediaElement.play() to prevent uncaught media exceptions from crashing preview
const originalPlay = HTMLMediaElement.prototype.play;
HTMLMediaElement.prototype.play = function() {
  try {
    const promise = originalPlay.apply(this, arguments as any);
    if (promise && typeof promise.catch === 'function') {
      return promise.catch((error: any) => {
        if (
          error?.name === 'AbortError' ||
          error?.name === 'NotAllowedError' ||
          error?.name === 'NotSupportedError' ||
          (typeof error?.message === 'string' && error.message.includes('play()'))
        ) {
          return;
        }
        console.warn('[Media] play() interrupted or unhandled:', error);
      });
    }
    return promise;
  } catch (syncError) {
    console.warn('[Media] Synchronous play() error:', syncError);
    return Promise.resolve();
  }
};

// Virtual Keyboard & Visual Viewport Handler for Android APK & Mobile Viewports
if (typeof window !== 'undefined') {
  const updateViewportMetrics = () => {
    const vvh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    document.documentElement.style.setProperty('--vvh', `${vvh}px`);
    
    // Check if on-screen keyboard is open (visual height significantly less than innerHeight)
    const isKeyboardActive = window.visualViewport
      ? window.visualViewport.height < window.innerHeight - 60
      : false;
      
    if (isKeyboardActive) {
      document.body.classList.add('keyboard-open');
    } else {
      document.body.classList.remove('keyboard-open');
    }
  };

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', updateViewportMetrics);
    window.visualViewport.addEventListener('scroll', updateViewportMetrics);
  }
  window.addEventListener('resize', updateViewportMetrics);
  updateViewportMetrics();

  // Ensure active focused text inputs & textareas scroll into the clear visible region above the virtual keyboard
  document.addEventListener('focusin', (e) => {
    const target = e.target as HTMLElement;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      }, 150);
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      }, 350);
    }
  });
}

// Polyfill for process
if (typeof window !== 'undefined' && !window.process) {
  // @ts-ignore
  window.process = { env: {} };
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.warn("❌ MV Director: Root element not found.");
} else {
  try {
    window.bootLog(`Mounting React v${React.version}...`);
    const root = ReactDOM.createRoot(rootElement);
    
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          {isKieChatMode ? (
            <KieChatStandalone />
          ) : (
            <PasswordGate>
              <App />
            </PasswordGate>
          )}
          <CrashLogger />
        </ErrorBoundary>
      </React.StrictMode>
    );
    
    // UI Feedback for successful mount
    setTimeout(() => {
        window.bootLog("Director UI Active.", false);
    }, 500);

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    window.bootLog(`BOOT_CRASH: ${msg}`, true);
    console.warn('[Boot Failure]:', err);
    recordCrash({
      type: 'boot_error',
      message: msg,
      stack: err instanceof Error ? err.stack : undefined,
    });
    
    // Fallback UI if React completely fails to mount
    rootElement.innerHTML = `
      <div style="color: #ef4444; padding: 40px; text-align: center; font-family: sans-serif; background: #000; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <h1 style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">Startup Failure</h1>
        <p style="opacity: 0.6; font-size: 12px; max-width: 400px; line-height: 1.5;">${msg}</p>
        <button onclick="window.location.reload()" style="margin-top: 20px; background: #222; color: white; border: 1px solid #333; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Retry</button>
      </div>
    `;
  }
}