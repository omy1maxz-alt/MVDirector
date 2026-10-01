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
}
