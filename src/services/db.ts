import { get, set, del, clear } from 'idb-keyval';
import { ProjectData, DirectorPlan } from '@/types';
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import firebaseConfig from '../../firebase-applet-config.json';

const PROJECT_KEY = 'mv-director-project';
const PROJECT_FILES_KEY = 'mv-director-project-files';
const PLAN_KEY = 'mv-director-plan';

let lastSavedFiles: File[] | undefined = undefined;

export const saveProjectToDB = async (project: ProjectData): Promise<void> => {
  try {
    const { localFiles, ...projectWithoutFiles } = project;
    
    // Attempt Firestore sync if authenticated
    let firestoreSuccess = false;
    try {
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
      const auth = getAuth(app);
      if (auth.currentUser) {
        const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
        await setDoc(doc(db, 'users', auth.currentUser.uid, 'projects', 'default'), projectWithoutFiles);
        firestoreSuccess = true;
      }
    } catch (e) {
      console.warn('Failed to sync to Firestore, falling back to local only:', e);
    }

    // Always save to IDB as fallback/offline
    await set(PROJECT_KEY, projectWithoutFiles);
    
    if (localFiles !== lastSavedFiles) {
      if (localFiles && localFiles.length > 0) {
        // Filter out plain objects (e.g. from JSON imports) that are missing the arrayBuffer method
        const validFiles = localFiles.filter((file: any) => file && typeof file.arrayBuffer === 'function');
        
        if (validFiles.length > 0) {
          // IndexedDB natively supports storing File objects. Converting large video files to ArrayBuffer crashes the browser with OOM.
          await set(PROJECT_FILES_KEY, validFiles);
        } else {
          await del(PROJECT_FILES_KEY);
        }
      } else {
        await del(PROJECT_FILES_KEY);
      }
      lastSavedFiles = localFiles;
    }
  } catch (error: any) {
    if (error?.message && error.message.includes('Database is closing/hidden')) {
      console.warn('Firebase IDB connection interrupted during save. This is a known mobile issue.');
      return;
    }
    console.warn('Failed to save project:', error);
  }
};

export const loadProjectFromDB = async (): Promise<ProjectData | null> => {
  try {
    let project: ProjectData | null = null;
    
    // Try Firestore first
    try {
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
      const auth = getAuth(app);
      if (auth.currentUser) {
        const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
        const docRef = doc(db, 'users', auth.currentUser.uid, 'projects', 'default');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          project = docSnap.data() as ProjectData;
          // Sync it back down to local
          await set(PROJECT_KEY, project);
        }
      }
    } catch (e) {
      console.warn('Failed to load from Firestore, trying local:', e);
    }

    // Fallback to local
    if (!project) {
        project = await get<ProjectData>(PROJECT_KEY) || null;
    }

    if (!project) return null;
    
    // Load local files (always from IDB because they are large/binary)
    try {
      const fileDataArray = await get<any[]>(PROJECT_FILES_KEY);
      if (fileDataArray && fileDataArray.length > 0) {
        const files = fileDataArray.map(fd => {
          if (fd instanceof File || fd instanceof Blob) {
            return fd; // It's natively stored
          }
          if (fd.data) {
             return new File([fd.data], fd.name, { type: fd.type });
          }
          return fd;
        });
        project.localFiles = files;
        lastSavedFiles = files;
      } else {
        project.localFiles = undefined;
        lastSavedFiles = undefined;
      }
    } catch (e) {
      console.warn("Could not load local files from IDB", e);
      project.localFiles = undefined;
      lastSavedFiles = undefined;
    }
    
    return project;
  } catch (error: any) {
    if (error?.message && error.message.includes('Database is closing/hidden')) {
      console.warn('Firebase IDB connection interrupted. This is a known mobile issue.');
      return null;
    }
    console.warn('Failed to load project from DB:', error);
    return null;
  }
};

export const savePlanToDB = async (plan: DirectorPlan): Promise<void> => {
  try {
    // Attempt Firestore sync if authenticated
    try {
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
      const auth = getAuth(app);
      if (auth.currentUser) {
        const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
        await setDoc(doc(db, 'users', auth.currentUser.uid, 'plans', 'default'), plan);
      }
    } catch (e) {
      console.warn('Failed to sync plan to Firestore:', e);
    }

    // Local fallback
    await set(PLAN_KEY, plan);
  } catch (error: any) {
    if (error?.message && error.message.includes('Database is closing/hidden')) {
      console.warn('Firebase IDB connection interrupted. This is a known mobile issue.');
      return;
    }
    console.warn('Failed to save plan:', error);
  }
};

export const loadPlanFromDB = async (): Promise<DirectorPlan | null> => {
  try {
    let plan: DirectorPlan | null = null;
    
    // Try Firestore first
    try {
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
      const auth = getAuth(app);
      if (auth.currentUser) {
        const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
        const docRef = doc(db, 'users', auth.currentUser.uid, 'plans', 'default');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          plan = docSnap.data() as DirectorPlan;
          await set(PLAN_KEY, plan);
        }
      }
    } catch (e) {
      console.warn('Failed to load plan from Firestore:', e);
    }

    if (!plan) {
      plan = await get<DirectorPlan>(PLAN_KEY) || null;
    }

    return plan;
  } catch (error: any) {
    if (error?.message && error.message.includes('Database is closing/hidden')) {
      console.warn('Firebase IDB connection interrupted. This is a known mobile issue.');
      return null;
    }
    console.warn('Failed to load plan:', error);
    return null;
  }
};

export const clearDB = async (): Promise<void> => {
  try {
    try {
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
      const auth = getAuth(app);
      if (auth.currentUser) {
        const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
        await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'projects', 'default'));
        await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'plans', 'default'));
      }
    } catch (e) {
      console.warn('Failed to clear from Firestore:', e);
    }
    await clear();
  } catch (error: any) {
    if (error?.message && error.message.includes('Database is closing/hidden')) {
      console.warn('Firebase IDB connection interrupted. This is a known mobile issue.');
      return;
    }
    console.warn('Failed to clear database:', error);
  }
};

const BRAIN_NOTES_KEY = 'mv-director-brain-notes';

export const saveBrainNotesToDB = async (notes: import('@/types').BrainNote[]): Promise<void> => {
  try {
    try {
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
      const auth = getAuth(app);
      if (auth.currentUser) {
        const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
        await setDoc(doc(db, 'users', auth.currentUser.uid, 'brain', 'notes'), { notes });
      }
    } catch (e) {
      console.warn('Failed to sync brain notes to Firestore:', e);
    }
    await set(BRAIN_NOTES_KEY, notes);
  } catch (error: any) {
    if (error?.message && error.message.includes('Database is closing/hidden')) {
      console.warn('Firebase IDB connection interrupted. This is a known mobile issue.');
      return;
    }
    console.warn('Failed to save brain notes:', error);
  }
};


const INITIAL_NOTES: import('@/types').BrainNote[] = [
  {
    id: "note_arch_constraints",
    title: "Project Core Architecture & AI Constraints",
    content: "# Core Technical Context & Constraints\n\n## 1. Image Generation (Gemini 2.5 Flash Image)\n- **Subject Replacement:** When a user provides a Character Reference image, DO NOT include highly detailed facial descriptions (e.g., 'dark brown eyes, straight nose') in the text prompt. The text will override the image reference, resulting in a generic face. Instruct the analyzer to only use the character's name and describe their clothing/pose.\n- **JSON Prompts:** The image model performs poorly with raw JSON strings. If a user inputs JSON, you must parse it into readable paragraphs (e.g., 'Subject: ...\\nEnvironment: ...') before sending it to the generation API.\n- **Multiple References:** When using both a Frame Reference and a Character Reference, explicitly define their roles using strong Gemini Imagen syntax: use `[Character Reference]` to preserve subject identity and `[Frame Reference]` to preserve composition and background. Do not use negative constraints (like 'do not copy clothing') as it confuses the model.\n\n## 2. Audio & Media Player\n- **Local Audio Persistence:** Uploaded `File` objects are stored in IndexedDB via `idb-keyval`. Because `blob:` URLs expire on page reload, you must iterate through the stored `File` objects and regenerate their `blob:` URLs upon loading the project.\n- **Minimized State:** When the media player is minimized, do not unmount the `<audio>` or `<ReactPlayer>` components. Hide them using CSS (e.g., `className={isMinimized ? 'hidden' : ''}`) so the music continues playing in the background.\n\n## 3. Story Mode Generation\n- **Scene Limits:** Cap auto-calculated scenes to a maximum of 15 to prevent the model from timing out or hitting token limits.\n- **Safety Filters:** Wrap `response.text` accesses in `try...catch` blocks. The model will throw exceptions if it blocks content (e.g., explicit song lyrics). Handle these gracefully and display a visible error to the user.\n- **Pronoun Tolerance:** If a project has *multiple* characters, generic pronouns ('he', 'she', 'man') in the prompt cause all character references to mistakenly match and blend together in `gemini.ts`. Therefore, the AI Director must explicitly use the character's exact NAME in the scene prompt to trigger their reference image.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['architecture', 'constraints', 'gemini'],
  },
  {
    id: "note_youtube_saga",
    title: "The YouTube Embed/DRM Saga",
    content: "# Why We Removed YouTube Playback\n\nInitially, we tried to let users paste a YouTube link to watch a video while syncing subtitles. However, this ran into a massive wall with YouTube's iframe DRM (Digital Rights Management).\n\n## The Journey:\n1. **The Request:** Users wanted to paste a link and have it play alongside the timeline editor.\n2. **The ReactPlayer Implementation:** Added ReactPlayer to embed YouTube via its iframe API.\n3. **The Errors:** \n   - Started getting weird crashes (Error 153). \n   - `onDuration` wasn't supported natively without wrapping in try/catches.\n   - Needed to auto-prepend `https://` if users didn't type it.\n4. **The Big Blocker (DRM):** We realized YouTube actively blocks embedding for many official music videos (unchecking 'Allow Embedding'). YouTube servers detect the third-party domain and physically block the video stream.\n5. **The Workaround:** Added a 'Pop out (Bypass Block)' button to open the video in a new tab (`window.open`), plus a watermark explaining the issue.\n6. **The Final Call:** The user still felt it was clunky/weird. Decided to completely rip out the `youtubeUrl` state, the input field from `SubtitlesTab.tsx`, and all `ReactPlayer` logic from `SubtitleTimelineEditor.tsx`. \n\n**Conclusion:** The timeline editor is strictly back to local uploaded Audio and Video files. Client-side YouTube ripping/embedding is too unreliable due to strict corporate licensing limits.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['youtube', 'drm', 'subtitles'],
  },
  {
    id: "note_subtitle_editor",
    title: "Subtitle Editor: Ripple Sync & Timeline Math",
    content: "# Timeline Editor Upgrades\n\n## 1. True Ripple Edit Sync Mode\nUpgraded the 'Sync Mode' to behave like a professional NLE (Premiere Pro). \n- Previously, syncing only worked when dragging the middle of a block.\n- **Now:** Dragging the right edge of a block to resize it will auto-push/pull all *subsequent* blocks. Dragging the left edge will auto-push/pull all *preceding* blocks.\n- Implemented via new `sync_start` and `sync_end` pointer drag states.\n\n## 2. Timecode Formatting Constraints\n- Switched visible timer format from two-part (`MM:SS.mmm`) to a strict three-part (`HH:MM:SS.mmm`).\n- Why? Since the editor displayed minutes beyond 60 (e.g. 74:59.744), users copied the string directly into AI Resume. The parser blindly split by `:` and assigned 74 to *hours* instead of *minutes*, breaking math. \n- **Decimal vs Comma parsing:** Standard SRT uses commas (`59,744`), while WebVTT/UI uses periods (`59.744`). `Number('59,744')` returns `NaN` in JavaScript. We must automatically `.replace(',', '.')` before calling `Number()` during resume imports.\n\n## 3. Popup Cancellation Trap\nWhen users closed the Google/YouTube Sign-In popup, Firebase correctly threw `auth/popup-closed-by-user`. But because the app used `console.error`, AI Studio trapped it and escalated it to a fatal UI crash overlay. We downgraded this specific exception to `console.warn` to fail gracefully.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['subtitles', 'timeline', 'ripple-sync'],
  }
];
export const loadBrainNotesFromDB = async (): Promise<import('@/types').BrainNote[]> => {
  try {
    let notes: import('@/types').BrainNote[] | null = null;
    try {
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
      const auth = getAuth(app);
      if (auth.currentUser) {
        const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
        const docRef = doc(db, 'users', auth.currentUser.uid, 'brain', 'notes');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          notes = docSnap.data().notes || [];
          await set(BRAIN_NOTES_KEY, notes);
        }
      }
    } catch (e) {
      console.warn('Failed to load brain notes from Firestore:', e);
    }
    if (!notes) {
      notes = await get<import('@/types').BrainNote[]>(BRAIN_NOTES_KEY) || [];
    }
    
    // Seed initial notes if empty
    if (notes.length === 0) {
      notes = INITIAL_NOTES;
      // Background save to persist the seeded notes
      saveBrainNotesToDB(notes).catch(e => console.warn('Failed to save initial seeded notes:', e));
    }
    return notes;
  } catch (error: any) {
    if (error?.message && error.message.includes('Database is closing/hidden')) {
      console.warn('Firebase IDB connection interrupted. This is a known mobile issue.');
      return [];
    }
    console.warn('Failed to load brain notes:', error);
    return [];
  }
};
