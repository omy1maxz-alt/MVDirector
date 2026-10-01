import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  signOut, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { APP_ENV } from './environment';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('openid');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');

let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const listenAuthState = (
  onUserChanged: (user: User | null, accessToken: string | null) => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        onUserChanged(user, cachedAccessToken);
      } else {
        // User is logged in, attempt to refresh token if needed or notify
        onUserChanged(user, cachedAccessToken);
      }
    } else {
      cachedAccessToken = null;
      onUserChanged(null, null);
    }
  });
};

export const isNativeEnvironment = (): boolean => {
  return APP_ENV.isAndroidApk;
};

export const isStandaloneEnvironment = (): boolean => {
  return APP_ENV.isStandalone;
};

export const signInWithGoogle = async (): Promise<{ user: User; accessToken: string | null }> => {
  if (isNativeEnvironment()) {
    const nativeErr = new Error(
      "Google Sign-In via Web Popup is disabled inside the Android APK WebView because Android WebViews block popup window communication ('window.opener') with Firebase Auth, and 'localhost' is not an authorized domain. All Director, Suno Music, Subtitles, and Storyboard features are 100% accessible via the Custom API Keys below without signing in!"
    );
    (nativeErr as any).code = 'auth/native-webview-unsupported';
    throw nativeErr;
  }

  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    cachedAccessToken = credential?.accessToken || null;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    if (error?.code === 'auth/popup-closed-by-user') {
      console.warn('Sign-in popup closed by user');
    } else if (error?.code === 'auth/unauthorized-domain') {
      const customErr = new Error("Firebase Domain Unauthorized: 'localhost' is not in the Firebase Authorized Domains list. On Android APK, please add 'localhost' in Firebase Console (Authentication -> Settings -> Authorized Domains). You can also use all Director & Music features with your custom API keys without signing in.");
      (customErr as any).code = 'auth/unauthorized-domain';
      console.warn('Google Sign-in unauthorized domain:', customErr.message);
      throw customErr;
    } else {
      console.error('Google Sign-in error:', error);
    }
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const signOutGoogle = async (): Promise<void> => {
  await signOut(auth);
  cachedAccessToken = null;
};

export const getCachedAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const getCurrentAuthUser = (): User | null => {
  return auth.currentUser;
};
