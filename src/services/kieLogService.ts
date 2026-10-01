/**
 * KIE.ai Real-Time Diagnostics & API Request/Response Logger
 * Captures live requests, raw payloads, status codes, latency, and full cURL commands.
 */

export interface KieApiLogItem {
  id: string;
  timestamp: string;
  timeFormatted: string;
  model: string;
  url: string;
  method: string;
  status: number;
  statusText: string;
  durationMs: number;
  requestHeaders: Record<string, string>;
  requestBody: any;
  responseRaw: any;
  isError: boolean;
  errorMessage?: string;
  curlCommand: string;
  attemptNumber?: number;
}

type LogListener = (logs: KieApiLogItem[]) => void;

const MAX_LOGS = 50;
let logsCache: KieApiLogItem[] = [];
const listeners = new Set<LogListener>();

// Try loading initial logs from sessionStorage if available
try {
  const saved = sessionStorage.getItem('kie_api_logs');
  if (saved) {
    logsCache = JSON.parse(saved);
  }
} catch {}

function notifyListeners() {
  try {
    sessionStorage.setItem('kie_api_logs', JSON.stringify(logsCache.slice(0, MAX_LOGS)));
  } catch {}
  listeners.forEach((listener) => listener([...logsCache]));
}

export function sanitizeAuthHeader(token: string): string {
  if (!token) return '';
  const clean = token.replace(/^Bearer\s+/i, '').trim();
  if (clean.length <= 8) return 'Bearer ***';
  return `Bearer ${clean.substring(0, 4)}...${clean.substring(clean.length - 4)}`;
}

export function generateCurlCommand(
  url: string,
  method: string,
  headers: Record<string, string>,
  body: any,
  rawToken?: string
): string {
  const tokenToUse = rawToken ? rawToken.replace(/^Bearer\s+/i, '').trim() : '<your-token>';
  const sanitizedHeaders: string[] = [];

  for (const [k, v] of Object.entries(headers)) {
    if (k.toLowerCase() === 'authorization') {
      sanitizedHeaders.push(`  --header "Authorization: Bearer ${tokenToUse}"`);
    } else {
      sanitizedHeaders.push(`  --header "${k}: ${v}"`);
    }
  }

  const jsonBody = typeof body === 'string' ? body : JSON.stringify(body, null, 2);
  const escapedBody = jsonBody.replace(/"/g, '\\"');

  return `curl --location --request ${method} "${url}" \\\n${sanitizedHeaders.join(' \\\n')} \\\n  --data "${escapedBody.replace(/\n/g, '')}"`;
}

export function logKieApiCall(item: Omit<KieApiLogItem, 'id' | 'timestamp' | 'timeFormatted'>): KieApiLogItem {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const timeFormatted = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}.${String(now.getMilliseconds()).padStart(3, '0')}`;

  const fullItem: KieApiLogItem = {
    ...item,
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: now.toISOString(),
    timeFormatted,
  };

  logsCache = [fullItem, ...logsCache].slice(0, MAX_LOGS);
  notifyListeners();
  
  // Also log cleanly to browser console for developers
  if (fullItem.isError) {
    console.group(`🚨 [KIE API Error] ${fullItem.model} -> ${fullItem.status} (${fullItem.durationMs}ms)`);
    console.log('URL:', fullItem.url);
    console.log('Request Payload:', fullItem.requestBody);
    console.log('Raw Response:', fullItem.responseRaw);
    console.log('cURL Command:\n' + fullItem.curlCommand);
    console.groupEnd();
  } else {
    console.groupCollapsed(`✅ [KIE API] ${fullItem.model} -> ${fullItem.status} (${fullItem.durationMs}ms)`);
    console.log('URL:', fullItem.url);
    console.log('Request Payload:', fullItem.requestBody);
    console.log('Raw Response:', fullItem.responseRaw);
    console.groupEnd();
  }

  return fullItem;
}

export function getKieLogs(): KieApiLogItem[] {
  return [...logsCache];
}

export function clearKieLogs(): void {
  logsCache = [];
  try {
    sessionStorage.removeItem('kie_api_logs');
  } catch {}
  notifyListeners();
}

export function subscribeKieLogs(listener: LogListener): () => void {
  listeners.add(listener);
  listener([...logsCache]);
  return () => {
    listeners.delete(listener);
  };
}
