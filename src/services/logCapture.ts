/**
 * MV Director - Comprehensive Android & WebView Diagnostic Log Capture
 * Intercepts console logs, warnings, errors, network fetch calls, and unhandled exceptions.
 * Captures WebView/Capacitor environment specs for easy copying to AI chat.
 */

import { APP_ENV } from './environment';

export type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'network' | 'crash';

export interface CapturedLogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  category?: string;
  message: string;
  data?: any;
  stack?: string;
}

export interface EnvironmentDiagnostics {
  runtime: {
    environmentLabel: string;
    environmentName: string;
    isStandalone: boolean;
    isInsideGoogleStudio: boolean;
    isInsideIframe: boolean;
    isAndroidApk: boolean;
    storageDescription: string;
  };
  userAgent: string;
  href: string;
  origin: string;
  protocol: string;
  isCapacitor: boolean;
  capacitorPlatform?: string;
  screen: {
    width: number;
    height: number;
    availWidth: number;
    availHeight: number;
    innerWidth: number;
    innerHeight: number;
    devicePixelRatio: number;
  };
  hardware: {
    concurrency?: number;
    deviceMemory?: number;
    maxTouchPoints: number;
    onLine: boolean;
  };
  audio: {
    supported: boolean;
    state?: string;
    sampleRate?: number;
  };
  storageQuota?: {
    usage?: number;
    quota?: number;
    percent?: string;
  };
}

const STORAGE_KEY = 'mv_captured_logs_v1';
const MAX_LOGS = 300;

let memoryLogs: CapturedLogEntry[] = [];
let listeners: Array<(logs: CapturedLogEntry[]) => void> = [];
let isInitialized = false;

// Original native references
let origConsoleLog: typeof console.log;
let origConsoleInfo: typeof console.info;
let origConsoleWarn: typeof console.warn;
let origConsoleError: typeof console.error;
let origFetch: typeof window.fetch;

function safeStringify(obj: any): string {
  if (obj === undefined) return 'undefined';
  if (obj === null) return 'null';
  if (typeof obj === 'string') return obj;
  if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);
  if (obj instanceof Error) return `${obj.name}: ${obj.message}\n${obj.stack || ''}`;
  
  try {
    const seen = new WeakSet();
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) return '[Circular]';
        seen.add(value);
      }
      return value;
    }, 2);
  } catch {
    return String(obj);
  }
}

function notifyListeners(): void {
  const current = [...memoryLogs];
  listeners.forEach(fn => {
    try {
      fn(current);
    } catch (_) {}
  });
}

export function addCapturedLog(entry: {
  level: LogLevel;
  category?: string;
  message: string;
  data?: any;
  stack?: string;
}): void {
  const newEntry: CapturedLogEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    level: entry.level,
    category: entry.category,
    message: String(entry.message || ''),
    data: entry.data,
    stack: entry.stack,
  };

  memoryLogs = [newEntry, ...memoryLogs.slice(0, MAX_LOGS - 1)];

  // Persist recent high-priority logs (warn, error, crash) to sessionStorage
  if (entry.level === 'error' || entry.level === 'crash' || entry.level === 'warn') {
    try {
      const persisted = memoryLogs.filter(l => l.level === 'error' || l.level === 'crash' || l.level === 'warn').slice(0, 50);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch (_) {}
  }

  notifyListeners();
}

export function getCapturedLogs(): CapturedLogEntry[] {
  return [...memoryLogs];
}

export function clearCapturedLogs(): void {
  memoryLogs = [];
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (_) {}
  notifyListeners();
}

export function subscribeToCapturedLogs(listener: (logs: CapturedLogEntry[]) => void): () => void {
  listeners.push(listener);
  listener([...memoryLogs]);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}

export async function getEnvironmentDiagnostics(): Promise<EnvironmentDiagnostics> {
  const isCap = typeof window !== 'undefined' && (
    !!(window as any).Capacitor || 
    window.location.href.includes('localhost') || 
    window.location.protocol === 'capacitor:'
  );
  const capPlatform = (window as any).Capacitor?.getPlatform ? (window as any).Capacitor.getPlatform() : (isCap ? 'android/native' : 'web');

  let audioState = 'unsupported';
  let sampleRate: number | undefined;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      const ctx = new AudioContextClass();
      audioState = ctx.state;
      sampleRate = ctx.sampleRate;
      ctx.close().catch(() => {});
    }
  } catch (e: any) {
    audioState = `error: ${e?.message || e}`;
  }

  let storageInfo: EnvironmentDiagnostics['storageQuota'] = undefined;
  if (navigator.storage && navigator.storage.estimate) {
    try {
      const est = await navigator.storage.estimate();
      const usage = est.usage ? Math.round(est.usage / (1024 * 1024)) : 0;
      const quota = est.quota ? Math.round(est.quota / (1024 * 1024)) : 0;
      const pct = quota > 0 ? `${((usage / quota) * 100).toFixed(1)}%` : 'unknown';
      storageInfo = { usage, quota, percent: pct };
    } catch (_) {}
  }

  return {
    runtime: {
      environmentLabel: APP_ENV.environmentLabel,
      environmentName: APP_ENV.environmentName,
      isStandalone: APP_ENV.isStandalone,
      isInsideGoogleStudio: APP_ENV.isInsideGoogleStudio,
      isInsideIframe: APP_ENV.isInsideIframe,
      isAndroidApk: APP_ENV.isAndroidApk,
      storageDescription: APP_ENV.storageDescription,
    },
    userAgent: navigator.userAgent,
    href: window.location.href,
    origin: window.location.origin,
    protocol: window.location.protocol,
    isCapacitor: isCap,
    capacitorPlatform: capPlatform,
    screen: {
      width: window.screen.width,
      height: window.screen.height,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio || 1,
    },
    hardware: {
      concurrency: navigator.hardwareConcurrency,
      deviceMemory: (navigator as any).deviceMemory,
      maxTouchPoints: navigator.maxTouchPoints || 0,
      onLine: navigator.onLine,
    },
    audio: {
      supported: !!(window.AudioContext || (window as any).webkitAudioContext),
      state: audioState,
      sampleRate,
    },
    storageQuota: storageInfo,
  };
}

export async function formatFullDiagnosticReportForAI(filterLevel?: LogLevel | 'all'): Promise<string> {
  const diag = await getEnvironmentDiagnostics();
  const logsToInclude = filterLevel && filterLevel !== 'all' 
    ? memoryLogs.filter(l => l.level === filterLevel)
    : memoryLogs;

  const lines: string[] = [
    `# 📱 MV Director - Environment & Diagnostic Report`,
    `Generated at: ${new Date().toISOString()}`,
    ``,
    `## ⚙️ Environment & Platform Awareness`,
    `- **Platform Mode:** \`${diag.runtime.environmentLabel}\` (${diag.runtime.isStandalone ? '✅ Standalone (Outside Google Studio Sandbox)' : 'Inside Studio Sandbox'})`,
    `- **Storage Mode:** ${diag.runtime.storageDescription}`,
    `- **Native Android APK:** ${diag.isCapacitor || diag.runtime.isAndroidApk ? `YES (Capacitor/Android WebView)` : 'NO (Web Browser)'}`,
    `- **User Agent:** \`${diag.userAgent}\``,
    `- **URL / Origin:** \`${diag.href}\` (\`${diag.origin}\`)`,
    `- **Screen / Viewport:** ${diag.screen.innerWidth}x${diag.screen.innerHeight} (Screen: ${diag.screen.width}x${diag.screen.height}, DPR: ${diag.screen.devicePixelRatio})`,
    `- **Touch Points:** ${diag.hardware.maxTouchPoints} | **Online:** ${diag.hardware.onLine}`,
    `- **Hardware:** CPU Cores: ${diag.hardware.concurrency ?? 'N/A'}, Device RAM: ~${diag.hardware.deviceMemory ? `${diag.hardware.deviceMemory}GB` : 'N/A'}`,
    `- **Web Audio API:** ${diag.audio.supported ? `Supported (State: ${diag.audio.state}, ${diag.audio.sampleRate}Hz)` : 'NOT SUPPORTED'}`,
    diag.storageQuota ? `- **Storage Usage:** ${diag.storageQuota.usage} MB / ${diag.storageQuota.quota} MB (${diag.storageQuota.percent})` : '',
    ``,
    `## 📋 Captured Logs (${logsToInclude.length} entries)`,
    `\`\`\`text`,
  ];

  if (logsToInclude.length === 0) {
    lines.push(`(No logs captured yet)`);
  } else {
    // Show chronological order (oldest to newest)
    const reversed = [...logsToInclude].reverse();
    reversed.forEach(entry => {
      const time = entry.timestamp.slice(11, 23);
      const lvl = entry.level.toUpperCase().padEnd(7);
      const cat = entry.category ? `[${entry.category}] ` : '';
      lines.push(`${time} | ${lvl} | ${cat}${entry.message}`);
      if (entry.data !== undefined) {
        lines.push(`  DATA: ${safeStringify(entry.data)}`);
      }
      if (entry.stack) {
        lines.push(`  STACK: ${entry.stack.split('\n').slice(0, 3).join(' ')}`);
      }
    });
  }

  lines.push(`\`\`\``);
  return lines.filter(Boolean).join('\n');
}

export function initGlobalLogCapture(): void {
  if (isInitialized || typeof window === 'undefined') return;
  isInitialized = true;

  // Restore any persisted crash/error logs from previous session
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        memoryLogs = parsed;
      }
    }
  } catch (_) {}

  // 1. Hook console methods
  origConsoleLog = console.log;
  origConsoleInfo = console.info;
  origConsoleWarn = console.warn;
  origConsoleError = console.error;

  console.log = function (...args: any[]) {
    origConsoleLog.apply(console, args);
    const msg = args.map(a => typeof a === 'object' ? safeStringify(a) : String(a)).join(' ');
    addCapturedLog({ level: 'log', message: msg });
  };

  console.info = function (...args: any[]) {
    origConsoleInfo.apply(console, args);
    const msg = args.map(a => typeof a === 'object' ? safeStringify(a) : String(a)).join(' ');
    addCapturedLog({ level: 'info', message: msg });
  };

  console.warn = function (...args: any[]) {
    origConsoleWarn.apply(console, args);
    const msg = args.map(a => typeof a === 'object' ? safeStringify(a) : String(a)).join(' ');
    addCapturedLog({ level: 'warn', message: msg });
  };

  console.error = function (...args: any[]) {
    origConsoleError.apply(console, args);
    const msg = args.map(a => typeof a === 'object' ? safeStringify(a) : String(a)).join(' ');
    let stack: string | undefined;
    const errArg = args.find(a => a instanceof Error);
    if (errArg) stack = errArg.stack;
    addCapturedLog({ level: 'error', message: msg, stack });
  };

  // 2. Hook window.fetch for network monitoring
  if (window.fetch) {
    origFetch = window.fetch.bind(window);
    window.fetch = async function (input: RequestInfo | URL, init?: RequestInit) {
      const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : String(input));
      const method = (init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();
      const startTime = performance.now();

      try {
        const response = await origFetch(input, init);
        const duration = Math.round(performance.now() - startTime);

        if (!response.ok) {
          addCapturedLog({
            level: 'network',
            category: 'Fetch',
            message: `❌ ${method} ${url} -> ${response.status} ${response.statusText} (${duration}ms)`,
            data: { status: response.status, method, url, duration },
          });
        } else if (url.includes('/api/') || url.includes('generativelanguage') || url.includes('suno') || url.includes('firestore')) {
          // Log important API endpoints even on success
          addCapturedLog({
            level: 'network',
            category: 'Fetch',
            message: `✅ ${method} ${url} -> ${response.status} (${duration}ms)`,
          });
        }

        return response;
      } catch (err: any) {
        const duration = Math.round(performance.now() - startTime);
        addCapturedLog({
          level: 'network',
          category: 'Fetch',
          message: `💥 Network Failed: ${method} ${url} (${duration}ms) - ${err?.message || err}`,
          stack: err?.stack,
        });
        throw err;
      }
    };
  }

  // 3. Hook window.addEventListener error & unhandledrejection
  window.addEventListener('error', (event) => {
    const msg = event?.message || (event?.error?.message ?? String(event || ''));
    addCapturedLog({
      level: 'crash',
      category: 'UncaughtException',
      message: msg,
      stack: event?.error?.stack,
      data: { filename: event?.filename, lineno: event?.lineno, colno: event?.colno },
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = reason?.message || (typeof reason === 'string' ? reason : String(reason || 'Unhandled Promise Rejection'));
    addCapturedLog({
      level: 'crash',
      category: 'UnhandledRejection',
      message: msg,
      stack: reason?.stack || (reason instanceof Error ? reason.stack : undefined),
    });
  });

  addCapturedLog({
    level: 'info',
    category: 'System',
    message: `Diagnostic Log Capture initialized (${window.location.origin}, Capacitor: ${typeof window !== 'undefined' && !!(window as any).Capacitor})`,
  });
}
