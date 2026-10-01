/**
 * Central Environment Detection & Platform Awareness Service.
 * 
 * Provides runtime awareness whether the app is executing:
 * - Standalone outside Google AI Studio (Android APK / Capacitor / PWA / Standalone Web)
 * - Or inside the Google AI Studio developer preview sandbox iframe.
 */

export interface AppEnvironment {
  isInsideIframe: boolean;
  isInsideGoogleStudio: boolean;
  isAndroidApk: boolean;
  isPwa: boolean;
  isStandalone: boolean;
  canUsePopups: boolean;
  canUseFullscreen: boolean;
  canUsePersistentStorage: boolean;
  environmentName: 'android-apk' | 'pwa-standalone' | 'standalone-web' | 'studio-sandbox';
  environmentLabel: string;
  storageDescription: string;
}

export function detectEnvironment(): AppEnvironment {
  if (typeof window === 'undefined') {
    return {
      isInsideIframe: false,
      isInsideGoogleStudio: false,
      isAndroidApk: false,
      isPwa: false,
      isStandalone: true,
      canUsePopups: true,
      canUseFullscreen: true,
      canUsePersistentStorage: true,
      environmentName: 'standalone-web',
      environmentLabel: 'Standalone Web App',
      storageDescription: 'Standard Web Storage'
    };
  }

  // 1. Detect if inside an iframe
  let isInsideIframe = false;
  try {
    isInsideIframe = window.self !== window.top;
  } catch {
    isInsideIframe = true;
  }

  // 2. Detect Android APK (Capacitor, Android WebView, or localhost APK origin)
  const isCapacitor = !!(window as any).Capacitor;
  const isAndroidUA = /Android/i.test(navigator.userAgent);
  const isAndroidWv = isAndroidUA && (/wv/i.test(navigator.userAgent) || /Version\/[0-9.]+/i.test(navigator.userAgent));
  const isLocalhostHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isCapacitorProtocol = window.location.protocol === 'capacitor:' || window.location.protocol === 'file:';
  
  const isAndroidApk = isCapacitor || isCapacitorProtocol || (isLocalhostHost && isAndroidUA) || (isLocalhostHost && !isInsideIframe) || isAndroidWv;

  // 3. Detect PWA Standalone display mode
  const isPwa = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;

  // 4. Detect Google AI Studio preview sandbox iframe
  const isGoogleHost = window.location.hostname.includes('run.app') || window.location.hostname.includes('aistudio.google.com');
  const isGoogleReferrer = typeof document !== 'undefined' && (document.referrer.includes('aistudio') || document.referrer.includes('google.com'));
  const isInsideGoogleStudio = isInsideIframe && (isGoogleHost || isGoogleReferrer);

  // The app is Standalone whenever it is running as an Android APK, PWA, or directly on its own domain outside the AI Studio preview frame
  const isStandalone = !isInsideGoogleStudio;

  let environmentName: AppEnvironment['environmentName'] = 'standalone-web';
  let environmentLabel = 'Standalone Web App';

  if (isAndroidApk) {
    environmentName = 'android-apk';
    environmentLabel = 'Android APK (Native)';
  } else if (isPwa) {
    environmentName = 'pwa-standalone';
    environmentLabel = 'Installed PWA';
  } else if (isInsideGoogleStudio) {
    environmentName = 'studio-sandbox';
    environmentLabel = 'Google AI Studio Sandbox';
  } else {
    environmentName = 'standalone-web';
    environmentLabel = 'Standalone Web App';
  }

  return {
    isInsideIframe,
    isInsideGoogleStudio,
    isAndroidApk,
    isPwa,
    isStandalone,
    canUsePopups: isStandalone,
    canUseFullscreen: isStandalone,
    canUsePersistentStorage: true,
    environmentName,
    environmentLabel,
    storageDescription: isAndroidApk 
      ? 'Native SQLite / IndexedDB (Persistent)' 
      : isPwa 
        ? 'PWA IndexedDB (Persistent)' 
        : isInsideGoogleStudio 
          ? 'Studio Ephemeral IDB' 
          : 'Persistent Browser Storage'
  };
}

export const APP_ENV = detectEnvironment();

/**
 * Safely opens an external URL using the optimal platform handler:
 * - Outside Google Studio: Directly uses system browser / pop-out without sandbox restrictions
 */
export function openExternalUrl(url: string, target: string = '_blank'): void {
  if (typeof window === 'undefined') return;

  try {
    // When running inside Android Capacitor, Capacitor Browser can be used if registered
    if ((window as any).Capacitor?.Plugins?.Browser?.open) {
      (window as any).Capacitor.Plugins.Browser.open({ url });
      return;
    }

    const win = window.open(url, target, 'noopener,noreferrer');
    if (!win) {
      window.location.href = url;
    }
  } catch (err) {
    console.warn('[Environment] window.open failed, falling back to location.href:', err);
    window.location.href = url;
  }
}
