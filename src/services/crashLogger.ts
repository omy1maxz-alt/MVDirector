export interface CrashLogEntry {
  id: string;
  timestamp: string;
  type: 'uncaught_exception' | 'unhandled_rejection' | 'react_error_boundary' | 'boot_error';
  message: string;
  stack?: string;
  componentStack?: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  url: string;
  userAgent: string;
  dismissed?: boolean;
}

const STORAGE_KEY_LOGS = 'mv_crash_logs_v1';
const STORAGE_KEY_LAST = 'mv_last_crash_log_v1';
const MAX_LOGS = 15;

// In-memory fallback if localStorage is blocked or unavailable
let memoryLogs: CrashLogEntry[] = [];
let memoryLastLog: CrashLogEntry | null = null;
let isInitialized = false;

// Benign strings that should not be flagged as app crashes
const BENIGN_PATTERNS = [
  'ResizeObserver loop',
  'Script error.',
  'The play() request was interrupted',
  "play() failed because the user didn't interact",
  'AudioContext was not allowed to start',
  'popup-closed-by-user',
  'AbortError',
  'IndexedDB is closing',
  'indexedDB',
  'cross-origin',
  'chrome-extension',
  'Cannot set property fetch',
  'only a getter',
  'Illegal constructor',
  'ServiceWorkerRegistration.showNotification',
  'ERR_NETWORK_CHANGED',
  'ERR_CONNECTION_ABORTED',
  'alkalimakersuite',
];

function isBenignMessage(msg: string): boolean {
  if (!msg) return false;
  return BENIGN_PATTERNS.some(p => msg.includes(p));
}

function safeGetStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage quota or access errors
  }
}

export function getRecentCrashLogs(): CrashLogEntry[] {
  try {
    const raw = safeGetStorage(STORAGE_KEY_LOGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Fall back to memory
  }
  return memoryLogs;
}

export function getLastCrashLog(): CrashLogEntry | null {
  try {
    const raw = safeGetStorage(STORAGE_KEY_LAST);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.id) return parsed;
    }
  } catch {
    // Fall back to memory
  }
  return memoryLastLog;
}

export function recordCrash(entryData: {
  type: CrashLogEntry['type'];
  message: string;
  stack?: string;
  componentStack?: string;
  filename?: string;
  lineno?: number;
  colno?: number;
}): CrashLogEntry | null {
  if (!entryData.message || isBenignMessage(entryData.message)) {
    return null;
  }

  const newEntry: CrashLogEntry = {
    id: `crash_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    type: entryData.type,
    message: String(entryData.message).slice(0, 1000),
    stack: entryData.stack ? String(entryData.stack).slice(0, 4000) : undefined,
    componentStack: entryData.componentStack ? String(entryData.componentStack).slice(0, 3000) : undefined,
    filename: entryData.filename,
    lineno: entryData.lineno,
    colno: entryData.colno,
    url: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    dismissed: false,
  };

  // Update memory
  memoryLastLog = newEntry;
  memoryLogs = [newEntry, ...memoryLogs.slice(0, MAX_LOGS - 1)];

  // Update localStorage
  safeSetStorage(STORAGE_KEY_LAST, JSON.stringify(newEntry));
  safeSetStorage(STORAGE_KEY_LOGS, JSON.stringify(memoryLogs));

  // Dispatch custom window event so UI can react instantly if mounted
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mv:crash_recorded', { detail: newEntry }));
  }

  return newEntry;
}

export function dismissCrashLog(id: string): void {
  const currentLogs = getRecentCrashLogs();
  const updatedLogs = currentLogs.map(log => log.id === id ? { ...log, dismissed: true } : log);
  memoryLogs = updatedLogs;
  safeSetStorage(STORAGE_KEY_LOGS, JSON.stringify(updatedLogs));

  const lastLog = getLastCrashLog();
  if (lastLog && lastLog.id === id) {
    const updatedLast = { ...lastLog, dismissed: true };
    memoryLastLog = updatedLast;
    safeSetStorage(STORAGE_KEY_LAST, JSON.stringify(updatedLast));
  }
}

export function clearAllCrashLogs(): void {
  memoryLogs = [];
  memoryLastLog = null;
  try {
    localStorage.removeItem(STORAGE_KEY_LOGS);
    localStorage.removeItem(STORAGE_KEY_LAST);
  } catch {
    // Ignore
  }
}

export function formatCrashReportForAI(entry: CrashLogEntry): string {
  const lines: string[] = [
    `### ⚠️ Crash Diagnostic Report`,
    `- **Type**: \`${entry.type}\``,
    `- **Timestamp**: ${entry.timestamp}`,
    `- **Message**: \`${entry.message}\``,
  ];

  if (entry.filename) {
    lines.push(`- **Location**: \`${entry.filename}:${entry.lineno || 0}:${entry.colno || 0}\``);
  }

  if (entry.stack) {
    lines.push(`\n**Stack Trace:**\n\`\`\`text\n${entry.stack}\n\`\`\``);
  }

  if (entry.componentStack) {
    lines.push(`\n**React Component Tree:**\n\`\`\`text\n${entry.componentStack}\n\`\`\``);
  }

  return lines.join('\n');
}

/**
 * Initializes global interceptors for uncaught exceptions & unhandled promise rejections.
 * Safe to call multiple times.
 */
export function initGlobalCrashLogger(): void {
  if (isInitialized || typeof window === 'undefined') return;
  isInitialized = true;

  // Intercept uncaught window errors
  window.addEventListener('error', (event) => {
    const msg = event?.message || (event?.error?.message ?? String(event || ''));
    if (isBenignMessage(msg)) return;

    recordCrash({
      type: 'uncaught_exception',
      message: msg,
      stack: event?.error?.stack,
      filename: event?.filename,
      lineno: event?.lineno,
      colno: event?.colno,
    });
  });

  // Intercept unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = reason?.message || (typeof reason === 'string' ? reason : String(reason || 'Unhandled Promise Rejection'));
    if (isBenignMessage(msg)) return;

    recordCrash({
      type: 'unhandled_rejection',
      message: msg,
      stack: reason?.stack || (reason instanceof Error ? reason.stack : undefined),
    });
  });
}
