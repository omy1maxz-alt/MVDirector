import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/youtube.readonly');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Firebase Auth');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    if (error?.code === 'auth/popup-closed-by-user') {
      console.warn('Sign in cancelled by user');
    } else if (error?.code === 'auth/unauthorized-domain') {
      const customErr = new Error("Firebase Domain Unauthorized: 'localhost' is not in the Firebase Authorized Domains list. Please add 'localhost' in Firebase Console (Authentication -> Settings -> Authorized Domains).");
      (customErr as any).code = 'auth/unauthorized-domain';
      console.warn('YouTube Sign-in unauthorized domain:', customErr.message);
      throw customErr;
    } else if (error?.message && error.message.includes('Database is closing/hidden')) {
      console.warn('Firebase IDB connection interrupted. This is a known Safari/mobile issue during popups. Please try again.');
    } else {
      console.warn('Sign in error:', error);
    }
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

export const fetchYouTubePlaylists = async (accessToken: string) => {
  const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true&maxResults=50&key=${firebaseConfig.apiKey}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error('YouTube API Error (Playlists):', errorText);
    throw new Error(`Failed to fetch playlists: ${res.statusText}`);
  }
  return res.json();
};

export const fetchYouTubePlaylistItems = async (accessToken: string, playlistId: string) => {
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=50&key=${firebaseConfig.apiKey}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error('YouTube API Error (Playlist Items):', errorText);
    throw new Error(`Failed to fetch playlist items: ${res.statusText}`);
  }
  return res.json();
};

export const searchYouTube = async (accessToken: string, query: string) => {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=25&key=${firebaseConfig.apiKey}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error('YouTube API Error (Search):', errorText);
      throw new Error(`Failed to search youtube: ${res.statusText}`);
    }
    return res.json();
};

/**
 * Normalizes YouTube URLs from various formats (short links, mobile, embed, raw ID, etc.)
 * Strips invisible control characters, mobile line breaks, and excess query parameters.
 */
export function normalizeYoutubeUrl(rawUrl: string): { url: string; videoId: string | null; isValid: boolean } {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { url: '', videoId: null, isValid: false };
  }

  // Strip non-printable characters, zero-width spaces, and whitespace
  let clean = rawUrl.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();

  // If user pasted bare 11-char video ID (e.g. jfKfPfyJRdk)
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
    return {
      url: `https://www.youtube.com/watch?v=${clean}`,
      videoId: clean,
      isValid: true,
    };
  }

  // Auto-prepend https:// if missing
  if (!/^https?:\/\//i.test(clean)) {
    clean = 'https://' + clean;
  }

  try {
    const parsed = new URL(clean);
    let videoId: string | null = null;

    if (parsed.hostname.includes('youtu.be')) {
      // youtu.be/VIDEO_ID
      videoId = parsed.pathname.slice(1).split(/[?#&/]/)[0];
    } else if (parsed.hostname.includes('youtube.com')) {
      if (parsed.pathname === '/watch') {
        videoId = parsed.searchParams.get('v');
      } else if (parsed.pathname.startsWith('/embed/')) {
        videoId = parsed.pathname.split('/embed/')[1]?.split(/[?#&/]/)[0];
      } else if (parsed.pathname.startsWith('/shorts/')) {
        videoId = parsed.pathname.split('/shorts/')[1]?.split(/[?#&/]/)[0];
      } else if (parsed.pathname.startsWith('/v/')) {
        videoId = parsed.pathname.split('/v/')[1]?.split(/[?#&/]/)[0];
      }
    }

    if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return {
        url: `https://www.youtube.com/watch?v=${videoId}`,
        videoId,
        isValid: true,
      };
    }

    // Fallback: If URL contains a 11-char pattern like v=...
    const vMatch = clean.match(/(?:v=|\/embed\/|\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (vMatch && vMatch[1]) {
      return {
        url: `https://www.youtube.com/watch?v=${vMatch[1]}`,
        videoId: vMatch[1],
        isValid: true,
      };
    }

    return {
      url: clean,
      videoId: null,
      isValid: true,
    };
  } catch {
    return { url: clean, videoId: null, isValid: false };
  }
}
