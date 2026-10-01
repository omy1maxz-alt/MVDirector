# 01 Architecture & Tech Stack

## Core Stack
- **Frontend Framework:** React 18+ (Functional Components, Hooks)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (Utility-first)
- **Icons:** `lucide-react`
- **Animations:** `motion/react` (Framer Motion)

## State & Storage
- **Global/Complex State:** React state at the top level (`App.tsx`) passed down via props. 
- **Persistent Storage (Browser):**
  - Small text/preferences: `localStorage`
  - Large files/Blobs (Audio/Video uploads): `idb-keyval` (IndexedDB). Note: `blob:` URLs expire on page reload. The app iterates through stored `File` objects in IndexedDB and regenerates `blob:` URLs on mount.

## Media Handling
- **Media Player:** Uses `react-player` for external URLs (YouTube, etc.) and a native HTML5 `<audio>` / `<video>` element for local `blob:` URLs.
- **Background Execution:** To prevent the browser from throttling or sleeping the tab during long batch-generation tasks (like generating 15 scenes), a silent, looping base64 audio track (`KeepAwake.tsx`) runs in the background.

## UI/UX Philosophy
- Clean, dark-mode default interface.
- High density of controls without overwhelming the user.
- Responsive to both desktop and mobile, with modular collapsible panels (e.g., minimizing the media player without unmounting it).
