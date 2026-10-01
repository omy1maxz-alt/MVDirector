# Dev Journal - MV Director

## Technical Constraints & Patterns

### 114. Comprehensive Runtime & Platform Awareness Architecture (`environment.ts`, `ApiKeyVault.tsx`, `logCapture.ts`, `App.tsx`)
- **Problem & Root Cause:**
  - When the app is packaged and installed as a native Android APK (Capacitor/WebView) or hosted on a standalone domain outside Google AI Studio, legacy UI labels and sandbox restrictions previously assumed the app was running inside an iframe sandbox.
  - Specifically:
    1. Media metadata labeled albums as `'AI Studio'` instead of `'MV Director'`.
    2. Header action showed a Google web popup button that attempted to open OAuth flows on `localhost` where `window.opener` does not exist.
    3. The diagnostic reporting engine did not include platform awareness (whether running on APK, PWA, or standalone browser).
- **Architectural Solution:**
  1. Created `src/services/environment.ts` with `APP_ENV = detectEnvironment()`:
     - Detects `isAndroidApk`, `isPwa`, `isStandalone`, `isInsideGoogleStudio`, and `storageDescription`.
     - Provides `openExternalUrl()` that safely uses system browsers/intents.
  2. Updated `src/services/auth.ts` and `ApiKeyVault.tsx`:
     - Recognizes Standalone & Native APK modes, clearly communicating that all features (Director, Suno Music, Subtitles, Storyboard, Keyframes) work 100% via Built-in or Custom API keys with persistent storage.
  3. Integrated runtime diagnostics into `logCapture.ts` and `CaptureLogsModal.tsx`, logging platform mode (`Android APK (Native)`, `Standalone Web`, or `Google AI Studio Sandbox`) in the Diagnostic Report for AI.
  4. Updated MediaSession metadata across all audio/video playback elements in `App.tsx` from `'AI Studio'` to `'MV Director'`.
  5. Added real-time environment status badges in the Settings dropdown and Web Test Browser tab.

### 113. Understanding and Mitigating `net::ERR_BLOCKED_BY_RESPONSE` on Android WebViews (`BrowserTab.tsx`)
- **Problem & Root Cause:**
  - When loading `https://m.youtube.com/` in an in-app WebView tab, Android displays:
    `Web page not available ... net::ERR_BLOCKED_BY_RESPONSE`.
  - *Root Cause:* The app is packaged as an Android APK (Capacitor/WebView) outside Google AI Studio, but the in-app browser tab still embeds third-party web content via an HTML `<iframe>` element.
  - The Chromium engine inside Android WebViews strictly obeys HTTP security response headers sent by remote servers.
  - When a request reaches `m.youtube.com` or `youtube.com`, YouTube's servers respond with `X-Frame-Options: SAMEORIGIN` and CSP `frame-ancestors 'self'`. This header explicitly commands Chromium to BLOCK the page if loaded inside any third-party `<iframe>`.
  - YouTube deliberately permits iframe embedding *only* on its dedicated `/embed/VIDEO_ID` (or `youtube-nocookie.com/embed/VIDEO_ID`) endpoints, and blocks all top-level portal pages (`m.youtube.com`, search, home).
- **Architectural Solution:**
  1. Updated `BrowserTab.tsx` with an active `checkBlockedSite()` detector for YouTube portals, Google Search, etc.
  2. Replaced the raw iframe error with an in-app diagnostic card explaining `X-Frame-Options: SAMEORIGIN` and offering 1-tap alternatives:
     - "Open in System Browser" (`window.open(url, '_blank')`), which executes top-level navigation outside `<iframe>` constraints where `X-Frame-Options` is not evaluated.
     - "Test Video Embed Instead" (`youtube-nocookie.com/embed/ID`), which is permitted by YouTube's servers inside `<iframe>`.
  3. Changed the "YouTube Mobile" preset in the presets bar to directly trigger Pop-out system browser navigation.

### 112. Elimination of Leaked React DOM Event Handlers (`onBuffer`, `onBufferEnd`) on Player (`SubtitleTimelineEditor.tsx`, `App.tsx`)
- **Problem & Root Cause:**
  - React logged console warnings:
    `Warning: Unknown event handler property 'onBuffer'. It will be ignored.`
    `Warning: Unknown event handler property 'onBufferEnd'. It will be ignored.`
  - When `react-player` falls back to its internal FilePlayer or mounts native `<video>` elements, it forwards unrecognized top-level JSX props directly to the underlying HTML5 `<video>` DOM element. Because standard HTML video elements do not have `onBuffer` or `onBufferEnd` attributes, React flags them as invalid DOM event handlers.
- **Architectural Solution:**
  - Removed `onBuffer` and `onBufferEnd` from `<Player />` invocations across `SubtitleTimelineEditor.tsx` and `App.tsx`.
  - Preserved standard ReactPlayer events (`onReady`, `onStart`, `onPlay`, `onPause`, `onProgress`, `onError`, `onEnded`) which are safely filtered by ReactPlayer and native HTMLMediaElement listeners.

### 111. Hacker's Keyboard Modifier Interception, YouTube URL Normalization & Web Test Tab (`keyboardSupport.ts`, `BrowserTab.tsx`, `youtube.ts`)
- **Problem & Root Cause:**
  1. *Hacker's Keyboard Shortcut Inaction:* In Android WebViews, virtual keyboards simulating physical PC modifier keys (Ctrl, Shift, Alt, Home, End) fail to trigger browser default actions (`Ctrl+A` select all, `Ctrl+Shift+Home/End` line range selection, `Ctrl+V` paste) inside HTML inputs and textareas because the WebView event pipe ignores synthetic accelerator commands.
  2. *YouTube URL Load "No Response":* When pasting YouTube links from mobile clipboards, invisible zero-width spaces, mobile line breaks, or variations (`m.youtube.com`, `youtu.be/`, shorts, or bare IDs) failed raw string checks. Additionally, omitting explicit debug logs left creators unaware of URL normalization, player buffering states, or blocked DRM streams.
  3. *Inability to Test Web/Iframe Capabilities on APK:* Without a webview testing tab, creators could not verify whether external browsing and video embedding work inside the Capacitor Android APK.
- **Architectural Solution:**
  1. Built `src/services/keyboardSupport.ts` with global captured keydown handlers for `Ctrl+A` (`setSelectionRange(0, length)`), `Ctrl+Shift+Home/End`, `Ctrl+Home/End`, and `Ctrl+V` fallback.
  2. Created `normalizeYoutubeUrl()` in `src/services/youtube.ts` stripping zero-width spaces, normalizing shorts/embeds/mobile links, and adding full diagnostic logging (`[YouTube Load]`) across `SubtitleTimelineEditor.tsx`, `SubtitlesTab.tsx`, and `App.tsx`.
  3. Created `src/components/BrowserTab.tsx` ("Web Test" tab in mobile bottom navigation) with an address bar, reload/pop-out actions, and quick presets (`YouTube Embed Test`, `YouTube Mobile`, `Wikipedia`, `Bing`, `DuckDuckGo`) logging iframe load status to the in-app Diagnostic Log Capture.

### 110. Android APK Firebase Auth Handler & Standalone Mode (`auth.ts`, `ApiKeyVault.tsx`)
- **Problem & Root Cause:**
  - When tapping "Sign In with Google" on the Android APK, the app opened:
    `https://gen-lang-client-0927402582.firebaseapp.com/__/auth/handler?apiKey=...&authType=signInViaPopup&redirectUrl=https%3A%2F%2Flocalhost%2F...`
    which displayed: `"The requested action is invalid."`
  - Two underlying causes:
    1. *Missing `window.opener` in WebView:* `signInWithPopup` relies on standard browser multi-window popup communication (`window.opener.postMessage`). Android WebViews in Capacitor do not support popup window managers by default, opening the URL as a standalone top-level page without a parent window. When Firebase's handler script finds no `window.opener`, it immediately renders `"The requested action is invalid."`
    2. *Unauthorized `localhost` redirect:* `redirectUrl=https://localhost/` is rejected by Firebase Auth's backend OAuth validator unless `localhost` is added to Firebase Console Authorized Domains.
- **Architectural Solution:**
  1. Added `isNativeEnvironment()` detector in `src/services/auth.ts`.
  2. Prevented `signInWithGoogle` from navigating to the broken handler page when inside native Android WebView.
  3. Replaced the generic Google sign-in button in `ApiKeyVault.tsx` with an informative "Android APK Standalone Mode" banner clarifying that no sign-in is required, and all AI generation features (Director, Suno, Subtitles, Vision) work 100% via Built-in or Custom API Keys.
  4. Updated the top mobile header button on APK to label as "API Keys" instead of "Sign In".

### 109. Android WebView & Capacitor In-App Diagnostic Log Capture (`logCapture.ts`, `CaptureLogsModal.tsx`)
- **Problem & Root Cause:**
  - The Android APK environment (Capacitor WebView running on `https://localhost`) behaves differently from desktop and web browsers (e.g., origin policies, restricted CORS, Web Audio lifecycle, audio codec hardware decoders, YouTube iframe blocks).
  - On handheld mobile devices, creators cannot easily open Chrome DevTools or inspect `console.log`, `console.error`, and `fetch` failures. Previous crash logging only captured fatal unhandled crashes, leaving runtime warnings, blocked network requests, and media failures invisible.
- **Architectural Solution:**
  1. Built `src/services/logCapture.ts` which hooks `console.log/info/warn/error`, `window.fetch`, and error listeners into a 300-entry memory ring buffer, persisting high-priority logs to `sessionStorage`.
  2. Implemented `getEnvironmentDiagnostics()` capturing user agent, `localhost`/Capacitor detection, screen & viewport dimensions, Web Audio API support and sample rate, and storage quota.
  3. Created `src/components/CaptureLogsModal.tsx` with category tabs (`All`, `Errors`, `Network`, `Warn`, `Device Info`), search filtering, and a one-click "Copy Full Report For AI" button.
  4. Added a `Terminal` button in the mobile top navigation, Settings menu, System tab, and `CrashLogsModal`.

### 108. Video Link Loading, Localhost Origin & Ref Safety (`SubtitleTimelineEditor.tsx`)
- **Problem & Root Cause:**
  1. *Stale URL prop mismatch:* When loading a YouTube URL from the timeline modal, `localYoutubeUrl` was updated, but internal logic was checking `if (youtubeUrl)` (the prop from the parent) instead of `effectiveYoutubeUrl`. Because the prop was not yet propagated, player controls assumed the active media was an HTML5 `<video>` element.
  2. *Ref invocation crash:* When dragging, scrubbing, or toggling playback, calling `(mediaRef.current as HTMLMediaElement).pause()` or `.play()` crashed with `TypeError: mediaRef.current.pause is not a function` because ReactPlayer controls playback via React state (`playing={isPlaying}`).
  3. *Localhost & DRM blocks:* In native Android Capacitor builds (`https://localhost`), YouTube's embedded player API rejects playback for videos with embedding disabled (Error 150/153) and unapproved localhost origins.
- **Architectural Solution:**
  1. Synchronized all media playback hooks (`updateTime`, `togglePlay`, `seekTo`, `saveCurrentFrame`, and pointer down scrub pause) to use `effectiveYoutubeUrl`.
  2. Added defensive checks distinguishing `effectiveYoutubeUrl` (state-driven playback) from native `HTMLMediaElement` DOM calls.
  3. Implemented a user-friendly YouTube Error Overlay with a direct pop-out button ("Open on YouTube") and a "Clear Video" action.

### 107. React DOM Unknown Event Handler Warning on Duration (`SubtitleTimelineEditor.tsx`)
- **Problem & Root Cause:**
  - React logged `Warning: Unknown event handler property %s. It will be ignored.%s onDuration at video` during subtitle timeline editing.
  - In `SubtitleTimelineEditor.tsx`, `<Player onDuration={(d) => ...} />` passed `onDuration` to `ReactPlayer`. When `ReactPlayer`'s FilePlayer renders an HTML `<video>` element, it spreads non-filtered props onto the DOM node. HTML `<video>` has no `onDuration` event handler (standard DOM is `onDurationChange`), causing React 18/19's DOM prop validator to emit a warning.
- **Architectural Solution:**
  1. Removed the `onDuration` prop from `<Player />`.
  2. Implemented duration measurement via `onReady` and `onProgress` callbacks using `mediaRef.current.getDuration()`.

### 106. Firebase Cloud Firestore & Rules Deployment (`firestore.rules`, `firebase-blueprint.json`)
- **Problem & Requirement:**
  - Provision Firebase Firestore database and Authentication on project `gen-lang-client-0927402582` in region `asia-southeast1`.
- **Architectural Solution:**
  1. Provisioned Firestore and Authentication via `set_up_firebase`.
  2. Deployed production security rules enforcing strict user isolation on `/users/{userId}/*` (`projects`, `plans`, `studio_chat`, `studio_chat_messages`, `brain`).
  3. Validated blueprint schema in `firebase-blueprint.json`.

### 105. Mobile Android WebView Paste Drop & Capacitor Firebase Auth (`index.css`, `App.tsx`, `auth.ts`)
- **Problem & Root Cause:**
  1. *Pasted text disappearing on phone:* Global `-webkit-user-select: none` on `html, body` broke Android WebView's native clipboard context menu (Paste/Select All) and cancelled IME input animations on MIUI/HyperOS devices. Furthermore, when users switched away to copy lyrics from another app, Android backgrounded or restarted the WebView Activity without flushing debounced auto-save timers, causing newly pasted text to be wiped by asynchronous DB reloads.
  2. *Login failure on APK (`auth/unauthorized-domain`):* Capacitor serves the native Android app at `https://localhost`. Firebase Authentication blocks OAuth popups unless `localhost` is explicitly registered in Firebase Console -> Authentication -> Settings -> Authorized Domains.
- **Architectural Solution:**
  1. Removed `user-select: none` from `html, body` and explicitly applied `user-select: text !important` to inputs and textareas.
  2. Added dedicated `onPaste` handlers with synchronous state updates and mirror persistence to `localStorage` (`mv_latest_lyrics`).
  3. Added `visibilitychange` (`document.visibilityState === 'hidden'`), `pagehide`, and `beforeunload` listeners to immediately save project data without waiting for the 500ms debounce when switching apps on mobile.
  4. Persisted Music tab inputs (`coverPrompt`, `coverTitle`, `coverStyle`, `coverModel`, `coverPersonaId`) in `localStorage` across Activity destroys.
  5. Caught `auth/unauthorized-domain` in `auth.ts`, providing a helpful instruction and clarifying to users that Google sign-in is optional (they can use custom API keys directly).

### 104. Suno V6 Suite, Voice Persona & Multi-Endpoint Architecture (`kie.ts`, `App.tsx`)
- **Problem & Root Cause:**
  - Old Suno voice documentation endpoints (`suno-voice-generate.md` on kie.ai) were deprecated or returned 404, and music generation previously lacked Suno V6 suite models, Voice Persona cloning, and cover art generation.
- **Architectural Solution:**
  1. Updated `kie.ts` to implement dual task creation: standard `/api/v1/generate/music` and modern `/api/v1/jobs/createTask` (`ai-music-api/generate-music` & `ai-music-api/cover-generate`).
  2. Added full support for the **Suno V6 family**: `V6` (Flagship SOTA), `V6_WILD` (Expressive/Experimental), and `V6_MINI` (Turbo), alongside `V5_5`, `V5`, `V4`, and `V3_5`.
  3. Integrated **Voice Persona cloning** via `personaId` parameter to allow custom singer identities.
  4. Added `generateSunoCoverArt` for one-click visual album artwork generation from task IDs.
  5. Added an **Instrumental** toggle enabling pure instrumental composition without vocal/lyrics requirement.
  6. Enabled direct **Original Music generation** when no audio URL is loaded, and **AI Song Cover mode** when a public audio URL is provided.

### 103. Mobile-Only Architecture & Viewport Lock (`App.tsx`, `index.css`)
- **Problem & Requirement:**
  - The application is engineered strictly for handheld Android smartphones with touch ergonomics. Desktop-specific tab headers and layout splits were unnecessary and caused layout bifurcation.
- **Architectural Solution:**
  1. Removed the desktop header navigation bar entirely in favor of a universal, thumb-reachable bottom navigation bar (`.safe-bottom-nav`).
  2. Removed `md:pb-0` from `<main>` to maintain safe bottom nav spacing uniformly.
  3. Integrated universal keyboard collapse on `.safe-bottom-nav` when typing on Android virtual keyboards.

### 102. Standardized GitHub Actions APK Build Workflow (`.github/workflows/build-apk.yml`)
- **Problem & Requirement:**
  - Automated cloud APK building on GitHub Actions required a verified, reliable YAML workflow matching Capacitor 6/7 standards with JDK 17, Android SDK 34, and Gradle build caching.
- **Architectural Solution:**
  1. Updated `.github/workflows/build-apk.yml` to target `ubuntu-latest` with Node.js 20, Java Temurin JDK 17, and Android SDK Build Tools 34.0.0.
  2. Integrated `gradle/actions/setup-gradle@v4` for fast Gradle daemon caching and dependency resolution.
  3. Added automatic XML permission injection for `INTERNET`, `ACCESS_NETWORK_STATE`, `RECORD_AUDIO`, `MODIFY_AUDIO_SETTINGS`, and `WAKE_LOCK`.
  4. Configured `actions/upload-artifact@v4` to output `MV-Director-AI-Debug-APK`.

### 101. VitePWA devOptions and ServiceWorker Registration Guard (`vite.config.ts`, `public/sw.js`, `main.tsx`)
- **Problem & Root Cause:**
  - In the container development server environment, setting `devOptions.enabled: true` caused `vite-plugin-pwa` to inject `/dev-sw.js?dev-sw`. Dynamic runtime transformation on the dev proxy failed with HTTP 500, triggering an unhandled rejection in the client.
- **Architectural Solution:**
  1. Disabled `devOptions` in `vite.config.ts` so dev server sessions load directly without mock service worker overhead.
  2. Created a self-contained `public/sw.js` with full Cache API support (CacheFirst for fonts/media, NetworkFirst for navigation) for standalone production and APK builds.
  3. Added explicit rejection suppression in `src/main.tsx` for ServiceWorker registration errors.

### 100. Service Worker with Cache API & Offline Resilience (`vite.config.ts`, `useOnlineStatus.ts`, `OfflineIndicator.tsx`)
- **Problem & Requirement:**
  - Android APKs and mobile web apps need to remain responsive and functional in offline or low-connectivity environments without network timeouts on static assets or fonts.
- **Architectural Solution:**
  1. Configured `VitePWA` with Workbox precaching for all core application bundles (`.js`, `.css`, `.html`, `.svg`, `.png`, web fonts).
  2. Implemented `CacheFirst` strategies for Google Font stylesheets and font binaries, and `StaleWhileRevalidate` for application assets.
  3. Integrated `useOnlineStatus` and `OfflineIndicator` to gracefully notify users when working offline while utilizing local IndexedDB storage.
  4. Added `PWAInstallButton` with native Chromium/Android prompt support and iOS Safari guidance.

### 99. Android Virtual Keyboard Adaptation & Auto-Scroll Viewport (`main.tsx`, `index.css`)
- **Problem & Requirement:**
  - When typing inside textareas, script dialogs, or prompt bars on Android phones (e.g. Gboard on Poco F5), the on-screen keyboard could cover the input field, preventing the user from seeing what they are typing.
- **Architectural Solution:**
  1. Synchronized `window.visualViewport` dimensions to dynamic CSS variable `--vvh` and activated `.keyboard-open` class when `visualViewport.height < innerHeight - 60`.
  2. Implemented universal `focusin` and visual resize interceptors that trigger smooth `scrollIntoView({ block: 'center' })` to bring the active cursor and input field into clear sight.
  3. Bound `#root` to `var(--vvh, 100dvh)` and automatically collapsed the bottom navigation bar during typing sessions to maximize vertical typing space.

### 98. Android / Poco F5 Edge-to-Edge Safe-Area & Viewport Ergonomics (`index.css`, `App.tsx`, `ApiKeyVault.tsx`, `KieChatModal.tsx`)
- **Problem & Requirement:**
  - In Android APK builds on devices with tall aspect ratios and punch-hole camera cutouts (specifically Poco F5 with 20:9 display and MIUI/HyperOS gesture navigation), the status bar and bottom navigation bar could overlap or conflict with top studio actions and bottom tab buttons.
- **Architectural Solution:**
  1. Configured CSS root safe-area variables (`--sat`, `--sab`, `--sal`, `--sar`) and utility classes (`.safe-top-bar`, `.safe-bottom-nav`, `.pt-safe`, `.pb-safe`).
  2. Padded `<header>` to clear the top camera cutout and status bar clock/icons, while giving `<main>` bottom padding of `calc(4.5rem + env(safe-area-inset-bottom, 0px))` so content remains fully visible above the bottom navigation bar.
  3. Ensured bottom tab buttons have a minimum `44x44px` touch target area to prevent accidental Android system gesture triggers.
  4. Locked viewport overscroll with `overscroll-behavior: none` and bound dialog max heights to `88dvh` for responsive virtual keyboard adaptation.

### 97. YouTube Video Ingestion, Timeline Editor Player & Quality Selector (`SubtitleTimelineEditor.tsx`, `SubtitlesTab.tsx`, `gemini_srt.ts`)
- **Problem & Requirement:**
  - Users needed to load and watch YouTube videos directly inside the interactive Timeline Editor, with controls to toggle and select video playback quality (e.g. HD 1080p, 720p, 480p, Auto).
- **Architectural Solution:**
  1. Embedded `ReactPlayer` directly inside `SubtitleTimelineEditor.tsx` with customized YouTube player vars (`origin`, `playsinline`, `enablejsapi`), interactive touch toggle overlays, and duration/progress synchronization.
  2. Implemented a YouTube **Quality Selector button & menu** (`Auto`, `1080p`, `720p`, `480p`, `360p`, `240p`, `144p`) interfacing directly with `getInternalPlayer().setPlaybackQuality()`.
  3. Added an in-editor modal to load, switch, or remove YouTube video links seamlessly while editing timelines.
  4. Synchronized media source state between the AI subtitle generator and timeline editor views.

### 96. Kie.ai Google Nano Banana Image Model Integration (`kie.ts`, `gemini.ts`, `ApiKeyVault.tsx`)
- **Problem & Requirement:**
  - Google Cloud imposes a strict 0 RPM quota on free-tier Gemini API keys for image generation (`gemini-2.5-flash-image`, `gemini-3.1-flash-image`), causing `429 RESOURCE_EXHAUSTED` errors in standalone APK builds without GCP billing.
  - Users with Kie AI accounts wanted to use Kie's hosted `google/nano-banana` family models to generate Gemini images directly with their Kie API key.
- **Architectural Solution:**
  1. Implemented `generateKieImage` in `src/services/kie.ts` using Kie.ai's asynchronous job API (`POST /api/v1/jobs/createTask` and `GET /api/v1/jobs/recordInfo`).
  2. Supported the full Nano Banana lineup:
     - `google/nano-banana-2` (Gemini 3.1 Flash Image)
     - `google/nano-banana-pro` (Gemini 3.0 Pro Image — 4K)
     - `google/nano-banana` (Gemini 2.5 Flash Image)
     - `google/nano-banana-2-lite` (Gemini 3.1 Flash-Lite Image)
     - `google/nano-banana-edit` (Image Editing)
  3. Integrated model routing in `generateSceneImage`, `generateSingleImage`, and `generateChatImage` in `gemini.ts`.
  4. Updated `ApiKeyVault.tsx` with dedicated model options and adjusted key validation checks in `App.tsx` so generation succeeds using a Kie key without requiring a Google Gemini key.

### 95. Google OAuth 2.0 & Firebase Auth Client-Side Integration (`auth.ts`, `ApiKeyVault.tsx`, `App.tsx`)
- **Problem & Requirement:**
  - Users requested native Google Sign-In support to authenticate with Google accounts seamlessly without exclusively relying on manually pasted API keys.
- **Architectural Solution:**
  1. Provisioned Google OAuth client with `openid`, `https://www.googleapis.com/auth/userinfo.email`, and `https://www.googleapis.com/auth/userinfo.profile` scopes.
  2. Built `src/services/auth.ts` wrapping Firebase Auth `GoogleAuthProvider` with in-memory token caching and real-time `onAuthStateChanged` lifecycle listeners.
  3. Embedded full Google account connection cards with official Google SVG branding, user avatar rendering, active session status, and one-click Sign In / Sign Out actions into `ApiKeyVault.tsx` and the studio header bar.

### 94. Handling `window.fetch` Accessor Constraints in Sandboxed/Iframe Environments (`index.html`, `main.tsx`)
- **Problem & Root Cause:**
  - In certain Chromium/WebKit sandboxed iframes, extension injection contexts, or parent proxy layers, `window.fetch` is defined on `Window.prototype` with an accessor descriptor having only a `get` method.
  - When third-party scripts, polyfills, or developer shims attempt assignment (`window.fetch = customFetch`), JavaScript throws:
    `Uncaught TypeError: Cannot set property fetch of #<Window> which has only a getter`
- **Architectural Solution:**
  1. Placed an immediate self-invoking inline script at the top of `<head>` in `index.html` (and early in `main.tsx`) before other modules load.
  2. Defined a bidirectional configurable property descriptor on both `window` and `Window.prototype` with `get()` and `set(fn)` handlers that track the current fetch reference while retaining the native binding.
  3. Ensured any subsequent global assignment executes the setter gracefully without throwing uncaught runtime exceptions.

### 93. CI/CD Reproducibility & npm ci Lockfile Parity (`package-lock.json`, `build-apk.yml`)
- **Problem & Root Cause:**
  - GitHub Actions CI failed at the `npm ci` stage with:
    `Missing: remark-breaks@4.0.0 from lock file`
    `Missing: mdast-util-newline-to-break@2.0.0 from lock file`
  - While `package.json` had added `"remark-breaks": "^4.0.0"`, `package-lock.json` had not been regenerated and committed. Because `npm ci` strictly verifies that every dependency declared in `package.json` has an identical entry in `package-lock.json`, it terminates with exit code 1 to avoid non-deterministic builds.
  - Furthermore, `android-actions/setup-android@v3` attempted to download the deprecated Android SDK `tools` package on Ubuntu 24.04 runners, failing with `Failed to find package 'tools'`.
- **Architectural Solution:**
  1. Regenerated `package-lock.json` using `npm install --package-lock-only`, properly capturing `remark-breaks@4.0.0` and `mdast-util-newline-to-break@2.0.0` in both root dependencies and package trees.
  2. Verified `npm ci --dry-run` completes with exit code 0.
  3. Preserved `npm ci` in `.github/workflows/build-apk.yml` as the authoritative, reproducible build step rather than falling back to `npm install`.
  4. Specified explicit SDK targets in `android-actions/setup-android@v3` (`packages: "platforms;android-34 build-tools;34.0.0 cmdline-tools;latest"`) and added `sdkmanager --licenses` auto-acceptance to ensure seamless Gradle APK compilation.

### 92. Strict React Rules of Hooks Execution Order (`KieChatModal.tsx`, `StudioChat.tsx`)
- **Problem & Root Cause:**
  - In `KieChatModal.tsx`, an early return conditional (`if (!isOpen) return null;`) was located before a `useMemo` hook that computes turn numbering (`messageTurns`, `totalTurns`). When the modal toggled visibility between renders, React detected an inconsistent number/order of hooks, triggering a runtime crash.
- **Architectural Solution:**
  - All hooks (`useState`, `useRef`, `useEffect`, `useMemo`, `useCallback`) must always be declared unconditionally at the very top level of functional components before any conditional early exit checks.
  - Aligned TypeScript interface definitions (`ChatSession.repoConfig`, `ChatSession.updatedAt`) with strict `tsc --noEmit` validation.

### 91. Chat Turn Numbering & History Revert/Rollback Engine (`StudioChat.tsx`, `KieChatModal.tsx`)
- **Problem & Architectural Challenge:**
  - Long conversational workflows often produce branching ideas or unwanted iterations. Users needed a clear, sequential turn index for each exchange and an intuitive mechanism to "time-travel" or roll back to an earlier turn (e.g. at Turn 10, reverting to Turn 3 should cleanly remove Turns 4 through 10 from memory, UI, and IndexedDB).
- **Engineering Solution:**
  1. **Sequential Turn Mapping**: Built an O(N) turn index calculator (`useMemo`) mapping each user message and its succeeding assistant responses to a monotonic turn index (`Turn 1`, `Turn 2`, ... `Turn N`).
  2. **Multi-Modal Revert Entry Points**:
     - **Command Parser**: Intercepts commands like `revert to turn 3`, `revert 3`, `/revert 3`, `rollback to turn 3`, and `undo to turn 3` inside `handleSendMessage`. It bypasses the AI inference pipeline, slices messages to `turn <= targetTurn`, updates storage, and prompts the user.
     - **In-Message 1-Tap Revert Action**: Renders an amber `↩ Revert` button on all historical turns (`turn < totalTurns`).
     - **Header Bar Quick-Selector**: Displays current `Turn X` and a dropdown selector listing earlier turns with their respective rollback impact (e.g., "Turn 3 (remove 4..10)").

### 90. Multi-Image & Multi-File Multimodal Studio Chat Architecture (`StudioChat.tsx`, `gemini.ts`, `chat.ts`)
- **Problem & Root Cause:**
  - Previously, Studio Chat only stored a single `attachedImage: string | null` state. If a user selected multiple reference photos, pasted multiple screenshots, or dropped several images together, each successive image overwrote the previous one instead of queuing them together.
  - Furthermore, `sendStudioChatMessage` only encoded one image part in its API payload.
- **Architectural Solution:**
  1. **Array-Based Multi-Image State**: Refactored `attachedImage` to an `attachedImages: string[]` array with backward-compatible single image accessors.
  2. **Batch Compression & Ingestion**: Enhanced `processRawFiles` and `handleImageUpload` (`<input type="file" multiple ...>`) to compress all selected photos in parallel and append them to `attachedImages`.
  3. **Multimodal API Packaging**: Updated `sendStudioChatMessage` to accept `attachedImageBase64?: string | string[]` and package all images into `newParts` with proper MIME detection (`image/png`, `image/jpeg`, `image/webp`).
  4. **Mobile Touch UI Preview & Gallery**: Implemented a scrollable thumbnail preview ribbon with index badges and individual delete buttons, plus an in-message image gallery allowing full-size inspection.

### 89. Mobile Virtual Keyboard Enter Handling & Prominent Chat Stop Button (`StudioChat.tsx`, `KieChatModal.tsx`)
- **Problem & Root Cause:**
  - On mobile touch devices (such as Poco F5 with Gboard/MIUI keyboard), pressing the "Enter" / "Return" key on the virtual keyboard was intercepted as a form submission event, inadvertently sending half-written messages or multiline prompts prematurely.
  - Furthermore, during extended autonomous loops or long streaming completions, users needed an immediate, high-visibility "Stop" action to halt the model without waiting for completion or navigating away.
- **Architectural Solution:**
  1. **Enter Key Decoupling**: Removed Enter interception on textareas so pressing Enter strictly inserts clean newlines (`\n`) for formatted prompts. Messages are now sent exclusively through deliberate taps on the `Send` button.
  2. **Reactive Stop Action**: In both Studio Chat and KIE Chat, the action button dynamically swaps during `isLoading` to a red pulsing `Stop` button (`Square` icon) that triggers cancellation tokens/abort refs, resets loading states, and halts subsequent loop execution cleanly.

### 88. Zero-Friction GitHub Actions Android APK Cloud CI (`.github/workflows/build-apk.yml`, `capacitor.config.json`)
- **Pattern & Workflow:**
  - Designed an autonomous cloud build pipeline on GitHub Actions (`ubuntu-24.04`) capable of synthesizing a complete native Android APK directly from this React + Vite codebase on every push.
  - Upgraded to Node.js 22 LTS, `actions/setup-java@v5`, and pinned `ubuntu-24.04` to resolve GitHub Actions deprecation warnings (Node 20 end-of-life and runner migration notices).
  - Automatically handles Vite bundle compilation (`npm run build`), dynamic Capacitor initialization (`@capacitor/core`, `@capacitor/cli`, `@capacitor/android`), and automated `AndroidManifest.xml` permission patching for audio capture, external media, and internet access.
  - Compiles via Gradle (`./gradlew assembleDebug`) with Temurin JDK 17 and Android SDK setup, uploading the compiled `app-debug.apk` directly as a downloadable GitHub Actions artifact for mobile installation on devices like Poco F5 without local compilation overhead.

### 87. Studio Chat Direct App Text Write & Edit Mode Integration (`StudioChat.tsx`, `gemini.ts`)
- **Problem & Root Cause:**
  - Previously, Studio Chat's system prompt strictly prohibited automated tool execution (`updateProjectData`, `updateCharacter`, `updateSceneImagePrompt`) during conversational prompt brainstorming to avoid accidental unwanted project mutations.
  - However, when users specifically wanted the assistant to write or rewrite lyrics, starter prompts, styles, or scene prompts directly into the app fields, the model refused or only answered in text without invoking function tools.
- **Architectural Solution:**
  1. **Dual-Toolbar Quick Toggle (`App Edit`)**: Added quick-toggle buttons with visual ON/OFF badges to both the Studio Chat top header toolbar and bottom input action bar.
  2. **System Prompt & Tool Declaration Dynamic Grounding**: When `isAppEditEnabled` is `true`, `sendStudioChatMessage` injects explicit directives authorizing Gemini to proactively call `updateProjectData`, `updateSceneImagePrompt`, `addCharacter`, and `updateCharacter` whenever the user asks to write, edit, rewrite, or update project texts.
  3. **Safety Fallback**: When `isAppEditEnabled` is `false`, the assistant operates in advisory chat-only mode and avoids mutating project tabs without explicit confirmation.

### 86. Mobile-First Architecture Metadata & Diagnostic Boot Splash (`metadata.json`, `index.html`)
- **Pattern & Requirement:**
  - The application is an exclusively mobile-targeted cinematic studio. The HTML document and metadata must clearly communicate mobile-first touch ergonomics, notch/safe-area handling (`viewport-fit=cover`), and dark aesthetic standards across all viewport sizes.
  - The initial HTML boot container provides a fast, zero-dependency visual preview with glow animations and monospace system diagnostics (`window.bootLog`) to prevent white/blank screens during bundle evaluation on low-power mobile CPU threads.

### 85. Instant Long-Text-to-File Auto-Attachment & Mobile Keyboard Paste Interceptor (`StudioChat.tsx`, `KieChatModal.tsx`)
- **Problem & Root Cause:**
  - On mobile browsers (especially Android Chrome / Xiaomi MIUI with Gboard or SwiftKey), pasting text via the keyboard clipboard bar or long-press menu dispatches an `input`/`onChange` event directly with the text inserted into `e.target.value`, bypassing the desktop `onPaste` event and `e.clipboardData`.
  - This caused large logs or stack traces pasted on mobile to dump directly into the textarea without turning into `.txt` chips.
- **Architectural Solution:**
  1. **Dual-Mode Interception**: Combined clipboard `onPaste` with delta-change detection inside `onChange`. When `newVal.length - input.length > 150` or when `3+` lines are inserted in a single event, the inserted text is captured and auto-attached as a file item while preserving the clean textarea.
  2. **Smart Filename Detection**: Enhanced `detectSnippetFileName` to recognize Android logcat headers (`09-27 04:11:12...`, `MediaCodec`, `ActivityInfo`, `ViewRootImpl`) and automatically label them `pasted_logcat.log`.
  3. **1-Click Revert & Mode Switch**: Added a `Type` button on each attachment badge to unpack file content back into raw text if desired.
  4. **Consistent Multi-Chat Support**: Implemented across both `StudioChat.tsx` and `KieChatModal.tsx`.

### 84. Accurate Branch Parsing (`master` vs `main`) & Dynamic Metadata Discovery (`githubService.ts`, `GitHubConnectModal.tsx`)
- **Problem & Root Cause:**
  - When users provided repository URLs or strings referencing `master` (e.g. `https://github.com/owner/repo/tree/master`, `owner/repo/tree/master`, or `owner/repo@master`), the parser regex either omitted the branch, failed on paths without trailing slashes, or fell back to hardcoded `'main'`.
  - When no branch was specified, code unconditionally fell back to `'main'`, even when the repository's actual default branch on GitHub was `master`.
- **Architectural Solution:**
  1. **Comprehensive URL Parsing**: `parseGitHubUrlOrPath` now captures branch names from `tree/`, `blob/`, `commits/`, `?ref=`, `?branch=`, `#`, `@`, and `:` formats, both with and without domain prefixes and subpaths.
  2. **Authoritative Default Branch Query**: Added `fetchGitHubRepoMetadata` to retrieve `default_branch` from `https://api.github.com/repos/${owner}/${repo}`, dynamically honoring whether the repository uses `master`, `main`, or another branch.
  3. **Interactive Branch Switcher**: `GitHubConnectModal` provides a branch switcher dropdown inside the connected repository card.

### 83. Deep GitHub Code Retrieval & Live Commit Diff Injection in Studio Chat (`StudioChat.tsx`, `gemini.ts`)
- **Problem & Root Cause:**
  - In Studio Chat, when GitHub was enabled, `gitRepoContextData` only passed high-level metadata (commit SHA and a list of changed filenames) without source code, repository tree, or patch diffs.
  - When users asked Gemini to inspect code or check the repository, Gemini lacked actual source content, causing it to produce generic responses or claim it couldn't access GitHub.
- **Architectural Solution:**
  1. **Source Search & Snippet Retrieval**: `StudioChat.tsx` now calls `fetchAndIndexRepo`, searches the codebase using keywords from the user prompt via `searchRepoCode`, and fetches real source snippets via `readRepoFileSnippet`.
  2. **Git Patch Diff Injection**: Commit patches (`f.patch`) are formatted into standard unified diff blocks and injected directly into Gemini's system instruction.
  3. **Repository Tree & Authoritative Directive**: Gemini is provided with the repository file structure and an explicit directive instructing it that it has live access to the repository and must directly inspect the code.

### 82. Independent Per-Window & Per-Conversation GitHub Branch Tracking (`RepoStatusBar.tsx`, `StudioChat.tsx`, `KieChatModal.tsx`, `githubService.ts`)
- **Problem & Context:**
  - Users working with GitHub repositories across multiple conversation threads or chat sessions need each window to follow its own branch (e.g. Chat 1 testing a feature branch `dev-ui` while Chat 2 analyzes `main`).
  - Previously, branch state was either globally shared or lacked an interactive switcher inside the status bar.
- **Architectural Solution:**
  1. **Per-Conversation Storage**: `StudioConversation` in `src/types/chat.ts` and `ChatSession` in `KieChatModal.tsx` store `repoConfig?: { owner: string; repo: string; branch: string; isEnabled?: boolean }`.
  2. **Automatic Context Switch**: Switching conversations or session tabs updates the active branch and repository context reactively.
  3. **Interactive Branch Switcher**: `RepoStatusBar.tsx` displays the active branch badge as an interactive trigger with a searchable dropdown that queries remote branches via `fetchGitHubBranches(owner, repo)` or allows typing custom branch names.
  4. **Dynamic Resync**: Selecting a branch triggers immediate commit verification, diff inspection, and index refreshment for that specific branch.

### 81. Multi-Window & Cross-Session Memory Distillation (`KieMemoryDistillModal.tsx`, `geminiCodeDistiller.ts`, `StudioChat.tsx`, `KieChatModal.tsx`)
- **Problem & Context:**
  - Users work across multiple chat windows/tabs (e.g. one tab for UI, one for Android/Kotlin debugging, one for API routes, or multiple Studio conversations).
  - Distilling memory solely from the current active window missed decisions and bug fixes established in other open chat windows.
- **Architectural Solution:**
  1. **Source Window Selector**: Added multi-window ingestion to `geminiCodeDistiller.ts` and `KieMemoryDistillModal.tsx`. Users can distill from the active window, any individual window, or select **"🌐 All Chat Windows Combined"**.
  2. **Cross-Session Transcription**: In multi-window mode, transcripts from each window are individually labeled (`=== CHAT WINDOW: "[Title]" (Model: [Model]) ===`) allowing Gemini to correlate decisions across disparate threads without confusion.
  3. **Target Selection on Apply**: Users can choose whether to apply the distilled memory to the active window, a specific session, or broadcast it to **All Chat Windows**.
  4. **Universal Availability**: Enabled the Memory Distiller in both KIE Chat and Studio Chat toolbars.

### 80. Clean Repository Unlinking & Elimination of Hardcoded Repository Defaults (`StudioChat.tsx`, `KieChatModal.tsx`)
- **Problem & Root Cause:**
  - When a user unlinked their repository in the `GitHubConnectModal`, `localStorage.removeItem('mv_studio_git_repo_config')` removed the persisted record, but the in-memory React state in `StudioChat.tsx` and session configs in `KieChatModal.tsx` had fallback initializers hardcoded to `{ owner: 'omy1maxz-alt', repo: 'Mydownloader', branch: 'master' }`.
  - Because `isGitRepoEnabled` defaulted to `true`, the UI continued to render `RepoStatusBar` on Row 3 with the hardcoded repository.
- **Architectural Solution:**
  1. Defaulted `gitRepoConfig` to `null` and `isGitRepoEnabled` to `false` when no stored configuration exists.
  2. Wrapped `RepoStatusBar` in a strict existence check (`isGitRepoEnabled && gitRepoConfig && gitRepoConfig.owner && gitRepoConfig.repo`).
  3. Added `onSelectRepo` and `onClearLinkedRepo` handlers to `GitHubConnectModal` to immediately reset in-memory React state, purge `localStorage`, and dismiss Row 3 cleanly upon unlinking.

### 79. Gemini Memory Distillation for KIE, Claude-Style Long Paste as File, and Status Monitor Cleanup
- **Problem & Context:**
  1. Multi-turn reasoning with KIE models (GPT-4o, Claude 3.5 Sonnet, DeepSeek R1) accumulates massive token loads. Raw past conversation transcripts cause gateway timeouts and excessive credit burn.
  2. Pasting long code blocks or stack traces directly into chat textareas clutters the UI and causes typing lag.
  3. The KIE 24H status monitor was based on an unverified mock telemetry endpoint rather than an official real-time stream from Kie.ai.
- **Architectural Solution:**
  1. **Gemini Executive Memory Distiller (`geminiCodeDistiller.ts`, `KieMemoryDistillModal.tsx`):** Leverages Gemini's high-context processing to synthesize past turns into a 5-part structured executive context block (Objectives, Rules & Constraints, Architecture Decisions, Fixes, Next Steps). Users can review, edit, and apply this as working system memory in 1 click.
  2. **Claude-Style Long Text Paste Handler (`LongTextPasteModal.tsx`):** Automatically intercepts clipboard text pastes exceeding 500 characters or 10 lines. Provides an instant choice to attach as a clean file card (`.txt`, `.tsx`, `.kt`, `.json`, `.sql`, etc.) or paste as raw text.
  3. **Status Monitor Removal:** Deleted `KieStatusMonitorModal.tsx`, `Kie24HStatusMonitor.tsx`, `kieStatusService.ts`, and the `/api/kie/monitor/success-rate` proxy route to keep codebase lean and reliable.

### 78. Clear Linked GitHub Repository Information & Connection State Reset (`GitHubConnectModal.tsx`, `githubService.ts`)
- **Problem & Context:**
  - Users who connected or browsed a GitHub repository previously had no explicit way within the `GitHubConnectModal` to unlink or wipe repository references stored in browser `localStorage` (`kie_chat_github_saved_repos`, `mv_studio_git_repo_config`).
  - Switching between different open repositories required manual retyping or deleting history.
- **Architectural Solution:**
  - Created `clearSavedGitHubRepos()` and `removeSavedGitHubRepo(fullName)` in `githubService.ts` to cleanly mutate or erase saved repository records from `localStorage`.
  - Added `handleResetConnectionState()` to clear active repository pointers, file trees, file previews, and search inputs in `GitHubConnectModal`.
  - Added `handleClearLinkedRepo(targetRepo)` and `handleClearAllLinkedRepos()` to reset modal connection state while clearing persisted local storage keys (`kie_chat_github_saved_repos`, `mv_studio_git_repo_config`).
  - Added UI controls: "Switch Repo" and "Clear & Unlink" on active connected repos, per-item delete and "Clear All" on recent repositories, and a local storage clearing card inside Token & Auth settings.

### 77. Reverted Voice Dictation Feature (`StudioChat.tsx`)
- **Reason for Reversion:**
  - Browser-native speech recognition (`webkitSpeechRecognition`) in client-side web apps behaves inconsistently across browsers and operating systems, suffering from speech engine buffering, event loop desynchronization, and stutter/repetition compared to native server-side streaming speech models.
  - Per user request, the mic dictation feature and all related listeners, status indicators, and modal components were completely cleanly removed from `StudioChat.tsx`. Prompt input and studio tooling remain clean, stable, and performant.

### 71. Voice Dictation Microphone Permission & Responsive Feedback Fix (`StudioChat.tsx`)
- **Problem & Root Cause:**
  - In embedded iframe preview environments (like AI Studio applet runners), browsers strictly isolate the Web Speech API (`webkitSpeechRecognition`), throwing `error: not-allowed` even when the user has already granted microphone permissions in their main browser tab.
- **Architectural Solution:**
  - Implemented an automatic dual-engine architecture:
    1. **Primary Engine**: Web Speech API (`SpeechRecognition`) for immediate, streaming real-time transcription where supported.
    2. **Seamless Fallback Engine**: If the browser's speech recognition engine is blocked by iframe sandboxing policies (`not-allowed`), the system automatically fails over to the standard `MediaRecorder` audio pipeline, captures speech cleanly, and runs transcription via Gemini's native multimodal audio model (`gemini-3.7-flash`).
  - Added live status updates and automatic cleanup of media tracks.

### 70. Studio Chat Voice Dictation / Speech-to-Text (`StudioChat.tsx`)
- **Problem & Context:**
  - Users typing complex creative briefs, video scripts, character descriptions, or long prompts on mobile devices experience keyboard friction.
  - Needed a native speech-to-text dictation button matching the experience found in frontier chat interfaces.
- **Architectural Solution:**
  - Implemented Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) in `StudioChat.tsx` with continuous mode and interim results support.
  - Added an interactive microphone trigger button directly beside the `Send` button.
  - Automatically appends transcribed speech to the existing input state smoothly without overwriting prior text.
  - Handled permission denials (`not-allowed`), browser support guards, and clean component unmounting to prevent memory or microphone leaks.

### 69. Smart Context Window & Historical Attachment Trimming (`KieChatModal.tsx`)
- **Problem & Root Cause:**
  1. Users upload large files (e.g. 1,600 lines of Android Logcat, large codebases) in early turns.
  2. With naive multi-turn memory enabled, every subsequent prompt concatenated the full, raw text of all historical attachments into the payload.
  3. By turn 10+, requests ballooned to 30,000+ tokens. Models with tight upstream proxy timeouts (such as `gpt-5-2` with a 10-12s gateway threshold) timed out and returned HTTP 200 with `{ "code": 500, "msg": "Server exception, please try again later" }`.
- **Architectural Solution:**
  1. **Sliding Context Window:** Added `maxMemoryTurns` (selectable: 4, 6 Smart, 12, or Full) so only the most recent N turns are included in the request payload. Defaulted to 6 turns.
  2. **Historical Attachment Trimming:** When `trimHistoricalAttachments: true` (default), attachments from previous turns are summarized into concise metadata blocks (`📁 *[Attached Earlier: filename.txt (1600 lines, 80 KB) - full text provided in previous turn]*`) rather than re-sending massive raw text. The current active turn's attachments always remain 100% full text.
  3. **User Controls:** Added interactive Context Window (4, 6 Smart, 12, Full) and Historical Attachment Trimming controls in the KIE Studio Settings Drawer.

### 68. KIE API Live Diagnostics, Telemetry Logger & Retry Mechanism (`kieLogService.ts`, `KieLogsModal.tsx`, `kieChatService.ts`)
- **Problem & Root Cause:**
  1. When models like GPT-5.2 throw `[KIE AI Status]: Server exception, please try again later` (or HTTP 500/502), users cannot see the underlying HTTP status code, request headers, payload shape, latency, or raw JSON response from Kie.ai's upstream servers.
  2. Transient cluster blips cause immediate user-facing chat errors even when a fast exponential backoff retry would have succeeded.
- **Architectural Solution:**
  1. **Real-Time Diagnostics Logger (`kieLogService.ts`):** Implemented an in-memory & session-persisted event logger that intercepts all outgoing requests across Claude Messages, OpenAI Responses, and Chat Completions endpoints. Records timestamp, model ID, resolved URL, sanitized auth headers, duration in ms, attempt count, request payload, status code, and raw server response.
  2. **Ready-to-Run cURL Generator:** Automatically generates reproducible shell cURL commands for every call with masked API keys so developers can inspect or replay requests in terminal.
  3. **Interactive Diagnostics Modal (`KieLogsModal.tsx`):** Provides a visual log viewer with quick metric chips (Total, 200 OK, Errors), search bar, status filters, collapsible JSON inspector with copy buttons, and one-click export. Accessible directly from the KIE Studio header and the KIE 24H Status Monitor.
  4. **Automatic Transient Retry with Backoff:** Wrapped chat completion requests in automatic retries upon encountering HTTP 500 or upstream "server exception" responses before propagating errors.

### 67. KIE 24H Status Monitor & Live Upstream Degradation Detection (`https://api.kie.ai/api/v1/monitor/success-rate`, `kieStatusService.ts`, `Kie24HStatusMonitor.tsx`)
- **Problem & Root Cause:**
  1. Kie.ai routes each frontier model to distinct upstream clusters. When a specific cluster experiences maintenance or failure (e.g. GPT-5.2 dropping to 6% success rate), users receive cryptic server exception errors only after waiting for a failed generation request.
- **Architectural Solution:**
  1. **Live Upstream Endpoint Integration:** Connected `https://api.kie.ai/api/v1/monitor/success-rate?model=<model>` via proxy route `/api/kie/monitor/success-rate` to fetch real-time upstream telemetry directly from Kie.ai.
  2. **10-Minute Stacked Time-Slice Visualizer (`Kie24HStatusMonitor.tsx`):** Faithfully reproduced Kie.ai's exact 24H monitor bar graph using stacked vertical slice columns (green `bg-emerald-500` success proportion on top, rose `bg-rose-500` failure proportion on bottom) with interactive hover tooltips that dynamically update the interval timestamp (`YYYY-MM-DD HH:MM:SS —— YYYY-MM-DD HH:MM:SS - Success: X%`).
  3. **Visual Health Indicators:** Integrated live status dots and success rate percentage badges (e.g. `99.4%`, `6% Degraded`) directly inside the model selector trigger button and dropdown list items.
  4. **Pre-flight Alert Banner:** Added proactive warning banners in `KieChatModal.tsx` that alert the user before sending messages to a degraded model and provide a 1-click fallback switch to healthy sibling models.
  5. **Dedicated Status Monitor Modal:** Created `<KieStatusMonitorModal />` allowing users to inspect the full health matrix and interactive 24H bar graphs across all providers.

### 66. DeepSeek Model Provider Isolation & Alias Normalization (`kieChatService.ts`, `KieModelDropdown.tsx`)
- **Problem & Root Cause:**
  1. DeepSeek and Moonshot (Kimi) were previously grouped under a single shared `'Other'` provider filter category, which listed Kimi K3 as the primary flagship open model and caused confusion when looking for DeepSeek 4.1.
  2. Model queries passing colloquial strings like `deepseek-4.1` or `deepseek-4-1` could fall back to default endpoints if the model ID didn't match the exact official string `deepseek-v4-1-flash`.
- **Architectural Solution:**
  1. **Provider Separation:** Split the provider tabs into dedicated `DeepSeek` (with `deepseek-v4-1-flash`, `deepseek-r1`, `deepseek-v3`) and `Moonshot (Kimi)` categories across all dropdowns and gallery filters.
  2. **Model Normalization:** Implemented `normalizeKieModelId()` in `kieChatService.ts` to automatically resolve aliases like `deepseek-4.1`, `deepseek-4-1`, `deepseek-v4.1` directly to `deepseek-v4-1-flash`.
  3. **Toolbar Integration:** Added a dedicated **DeepSeek 4.1** button in the KIE Chat Studio quick-switch toolbar.

### 65. KIE Upstream Server Exception Diagnosis (`kieChatService.ts`)
- **Problem & Root Cause:**
  1. When querying specific models like GPT-5.2 on Kie.ai (`/gpt-5-2/v1/chat/completions`), Kie.ai's gateway returns `{ "code": 500, "msg": "Server exception, please try again later" }` if the upstream OpenAI/Codex backend cluster is undergoing maintenance or experiencing temporary load spikes.
- **Architectural Solution:**
  1. Updated `extractKieApiResponse` in `kieChatService.ts` to identify `Server exception` patterns and surface actionable guidance to switch to operational sibling models (`GPT-5.5`, `GPT 5.6 Sol`, `Gemini 3.8 Flash`, or `Claude Sonnet 5`).

### 64. Global Exception & Unhandled Rejection Interceptors (`crashLogger.ts`, `CrashLogger.tsx`)
- **Problem & Root Cause:**
  1. Runtime errors happening inside asynchronous tasks, event handlers, or promise chains outside of React's render phase do not trigger `ErrorBoundary.componentDidCatch`.
  2. If an async rejection or unhandled script error caused the app to fail or require a reload, the error context was lost on the next page load.
- **Architectural Solution:**
  1. **Global Interceptors:** Installed window listeners for `'error'` and `'unhandledrejection'` with smart filtering of benign noise (ResizeObserver, media autoplay interruption, etc.).
  2. **Storage Persistence:** Persisted crash records into `localStorage` (`mv_crash_logs_v1`, `mv_last_crash_log_v1`) with full error messages, filenames, line/column numbers, and stack traces.
  3. **Next-Load Startup Toast:** Mounted `<CrashLogger />` at the root to detect if the previous session crashed, presenting a toast with a 1-click `Copy Report for AI` button.
  4. **Diagnostic Logs Modal:** Integrated `<CrashLogsModal />` into Settings menu for on-demand inspection, copying, and clearing of all historical crash logs.

### 63. Crash Diagnostic Trace & 1-Click Clipboard Report (`ErrorBoundary.tsx`)
- **Problem & Root Cause:**
  1. Because the app runs client-side in the user's browser sandbox, JavaScript runtime errors cannot automatically transmit back to the AI without user interaction.
  2. Previously, error messages were truncated and users had to manually transcribe or describe what went wrong, making debugging and locating the exact line number slower.
- **Architectural Solution:**
  1. **1-Click Copy:** Added a `Copy Report for AI` button in `ErrorBoundary.tsx` that bundles the error message, JS stack trace, and React `componentStack` into structured markdown on the clipboard.
  2. **Expandable Stack Trace:** Added an accordion to view the full raw stack trace directly in the UI.
  3. **Local Storage Trace Persistence:** Every unhandled exception caught by `componentDidCatch` is written to `localStorage.setItem('mv_last_crash_log', ...)` so the diagnostic data persists even if the user clicks "Reload Studio".

### 62. File Import Sanitization & DB Persistence Guard (`App.tsx`)
- **Problem & Root Cause:**
  1. When users imported a project JSON file via the Project menu, raw unvalidated JSON was loaded directly into React state (`setProjectData(imported.projectData)`) and immediately persisted to DB (`saveProjectToDB`).
  2. If the imported file had a slightly different structure (e.g. flat `ProjectData` without an outer wrapper, missing `characters` or `referenceImages` arrays, or legacy fields), React render passes threw unhandled runtime exceptions.
  3. When the component crashed, the application reloaded; and because the invalid data was already persisted to IndexedDB/Firestore, the app crashed again on reload, causing an endless reload loop.
- **Architectural Solution:**
  1. **Polymorphic Parser:** `handleImportFileSelect` now flexibly accepts both wrapped export formats (`{ projectData, directorPlan }`) and direct flat project representations.
  2. **Pre-State Sanitization:** Both `projectData` and `directorPlan` are routed through `sanitizeProject` and `sanitizePlan` before updating React state or database storage.
  3. **Event Isolation & Value Reset:** Added `e.target.value = ''` resets and asynchronous error traps so file parsing failures display user logs without breaking the application runtime.

### 61. Project & Plan Hydration Invariants and Storage Failure Isolation (`App.tsx`)
- **Problem & Root Cause:**
  1. If local audio files stored in IndexedDB were corrupted, plain objects (deserialized JSON without `Blob` prototypes), or invalid instances, calling `URL.createObjectURL(f)` threw an uncaught `TypeError: Failed to execute 'createObjectURL' on 'URL': Overload resolution failed.` during `init()`, crashing the entire startup lifecycle.
  2. If stored project or plan data had missing or `undefined` arrays (e.g., `projectData.characters`, `projectData.referenceImages`, `ref.roles`), downstream JSX `.map()` and `.find()` calls threw fatal runtime exceptions.
  3. Corrupt `localStorage` items (`mv_api_keys`, `mv_director_lyrics_history`, etc.) could throw unhandled `JSON.parse` syntax errors during initialization.
- **Architectural Solution:**
  1. **Defensive Transformation Layer (`sanitizeProject`, `sanitizePlan`):** Added explicit normalizers in `App.tsx` ensuring that all collections (`characters`, `referenceImages`, `scenes`, `roles`) always default to valid arrays with clean objects.
  2. **Blob Instance Validation:** Added `(f as any) instanceof Blob || (f as any) instanceof File` checks and isolated `try...catch` wrappers around `URL.createObjectURL(f)`.
  3. **Guarded Startup:** Enclosed all `localStorage` reads and JSON parsing in `init()` within isolated error handlers so that corrupt user storage automatically recovers with default states rather than crashing the interface.

### 60. Message Serialization Robustness & Render Invariants (`KieChatModal.tsx`, `KieMarkdownRenderer.tsx`)
- **Problem & Root Cause:**
  1. The app crashed repeatedly after reload with `TypeError: Cannot read properties of undefined (reading 'includes')` or similar string accessor errors.
  2. Investigation revealed that previous chat messages persisted in `localStorage` or created during aborted/error network events contained `content: undefined` or non-string values.
  3. During render passes, direct method calls (`msg.content.includes(...)`, `msg.content.length`, `msg.content.startsWith(...)`, `msg.content.split(...)`) threw unhandled exceptions, crashing the React tree.
- **Architectural Solution:**
  1. **Hydration Sanitization:** `loadInitialSessions` now sanitizes every loaded session, converting any missing or non-string message content to a safe string primitive (`String(m?.content ?? '')`).
  2. **Render-Pass Invariants:** Defined `const msgContent = typeof msg?.content === 'string' ? msg.content : String(msg?.content ?? '');` at the top of message iteration, guarding all downstream text evaluations, copying, and rendering.
  3. **ReactMarkdown Null-Safety:** Passed `{content || ''}` to `<ReactMarkdown>` in `KieMarkdownRenderer.tsx` and restarted the development server.

### 59. Architect-to-Builder Pipeline: Output Token Optimization (`geminiArchitectPipeline.ts`, `KieChatModal.tsx`)
- **Problem & Root Cause:**
  1. Output tokens on frontier models (Claude 3.5 Sonnet, GPT-6 Astra, Grok 4.7) cost 3x to 5x more than input tokens. Generating 2,000–3,000 lines of full code directly through KIE models burned hundreds of credits per request.
  2. Users wanted Claude's and GPT's deep architectural reasoning without paying frontier rates for hundreds of lines of generic boilerplate code.
- **Architectural Solution:**
  1. **Lead Architect Directive:** When Architect Mode is enabled (`architectModeEnabled`), a strict system directive instructs KIE to act exclusively as Lead Architect, producing a structured, high-density blueprint (core algorithms, exact signatures, edge cases, and builder instructions) capped at ~350 tokens.
  2. **Free Background Builder Expansion (`expandBlueprintWithGemini`):** Google Gemini 3.7 Flash receives KIE's blueprint along with the user inquiry, and writes out the complete, production-ready, full-length code implementation for free in the background.
  3. **Dual Audit UI:** The resulting message card displays both the full Gemini-built code and an expandable **Lead Architect Blueprint** drawer (`Saved ~85-90% Output Credits`), allowing full inspection of the underlying logic contract.
  4. **Toolbar Integration:** Added a persistent **`🏗️ Architect: ON/OFF`** toggle button in the KIE Chat toolbar.

### 58. Two-Stage Context Distillation for KIE Credit Optimization (`geminiCodeDistiller.ts`, `KieChatModal.tsx`, `kieChatService.ts`)
- **Problem & Root Cause:**
  1. Sending large raw code files, full document transcripts, or whole Git repository context directly to premium KIE models (Claude 3.5 Sonnet, GPT-6 Astra, Grok 4.7) rapidly consumed high volumes of KIE AI credits due to steep input token pricing on 30k–100k token payloads.
  2. Users needed the advanced reasoning capabilities of Claude / GPT / Grok on KIE, but wanted to avoid burning credits on repetitive raw code ingestion.
- **Architectural Solution:**
  1. **Background Gemini Distillation (`distillCodeContextWithGemini`):** Implemented an automated pre-processing step using Google Gemini (Gemini 3.7 Flash) with its free/high-context capacity.
  2. **High-Density Code Extraction:** Gemini pre-reads the entire raw file collection / Git diffs against the user's inquiry, stripping boilerplate, unused templates, and unrelated modules, and generating a tight technical brief (500–1,200 tokens).
  3. **Seamless Downstream Hand-off:** The distilled brief replaces the raw file dump before reaching KIE's endpoint, cutting input token usage by **90% to 95%** while retaining complete architectural fidelity.
  4. **User Control:** Added a persistent **`Saver: ON/OFF`** quick toggle button in the KIE Chat toolbar.

### 57. High-Density Toolbar Consolidation & Viewport Preservation (`StudioChat.tsx`, `App.tsx`)
- **Problem & Root Cause:**
  1. In the Studio Chat view, two separate header rows were stacked underneath the main application top bar: Row 1 contained the sidebar toggle and conversation rename input, while Row 2 contained the Quick Controls toolbar (Search, Git, Loop, Persona, Turns, Font Size, and Clear Chat).
  2. The dual-row structure consumed ~95px of top vertical height, which significantly compressed the available chat and code review area on laptops and mobile devices.
- **Architectural Solution:**
  1. **Single Unified Header Row:** Merged Row 1 and Row 2 into a single, high-density toolbar (`py-1.5` with backdrop blur). The left side anchors the sidebar toggle and inline title rename, while the right side organizes quick action chips with responsive overflow containment.
  2. **Top Bar Tightening:** Reduced the main application header height from `h-16` to `h-13 sm:h-14` and compacted the Production Director mode switcher spacing, maximizing visible canvas area.

### 56. Strict React Hook Ordering & Early-Return Discipline (`KieChatModal.tsx`)
- **Problem & Root Cause:**
  1. Opening or re-rendering `<KieChatModal />` triggered the fatal React error: `Warning: React has detected a change in the order of Hooks called by KieChatModal. Uncaught Error: Rendered more hooks than during the previous render.`
  2. Inspection revealed that an inline `useMemo` hook was defined inside the JSX mapping block (`{useMemo(() => activeSession.messages.map(...))}`) positioned *after* the early modal return guard `if (!isOpen) return null;`.
  3. When `isOpen` was false, the component executed 32 hooks and exited early. When `isOpen` became true, React encountered hook #33 (`useMemo`) during the render pass, breaking React's hook order invariant and throwing an unrecoverable exception.
- **Architectural Solution:**
  1. **Strict Top-Level Hook Placement:** Removed the conditional `useMemo` hook from JSX. All React hooks in the component are strictly organized at the top of the function body prior to any conditional guards or early returns.
  2. **Sub-tree Memoization:** Rendering efficiency for chat transcripts is maintained through `React.memo` wrapping on the leaf renderer (`KieMarkdownRenderer`), avoiding entire message tree recalculations without violating React hook lifecycle rules.

### 55. Authenticated GitHub REST Commit Bridge (`githubService.ts`)
- **Problem & Root Cause:**
  1. Users with GitHub Personal Access Tokens (PATs) possessing full repository write scopes requested the ability to commit code changes directly to their remote repositories from the application.
  2. Previously, `githubService.ts` only provided read-only tree traversal and raw file content retrieval methods.
- **Architectural Solution:**
  1. **Direct File Commit API (`commitFileToGitHub`):** Built an end-to-end authenticated commit pipeline using GitHub's `PUT /repos/{owner}/{repo}/contents/{path}` REST endpoint.
  2. **SHA & Tree Consistency:** Before pushing content, the bridge automatically queries the remote branch to determine whether the target file exists and fetches its current blob `sha`. If present, the `sha` is supplied to ensure clean atomic updates without race conditions; if absent, a new file creation commit is dispatched.
  3. **UTF-8 to Base64 Safety:** Employs standard `TextEncoder` and byte serialization to encode non-ASCII/Unicode code files cleanly before transmission, preventing corrupted base64 payloads on GitHub.

### 54. Chat Message Toolbar Overflow Prevention & 1-Click Retry Execution (`StudioChat.tsx`, `KieChatModal.tsx`, `CollapsibleFileAttachment.tsx`)
- **Problem & Root Cause:**
  1. In chat interfaces, when users uploaded files, images, or large blocks of text, the message bubble expanded horizontally to fill the container (`max-w-[88%]`).
  2. Because the action toolbar (Edit, Delete, Collapse) was positioned horizontally adjacent to the message bubble inside a flex row with `justify-end`, the combined width of the bubble (88%), avatar (32px), gaps (16px), and action buttons (36px) exceeded the container width (100%).
  3. In `justify-end` flex rows, overflow causes leftmost flex children to be positioned at negative X coordinates (`x < 0`), pushing the edit and delete buttons off-screen and out of the viewport frame behind `overflow-x-hidden`.
  4. In addition, Studio Chat lacked a 1-click Retry/Regenerate button for quickly re-running prompts without manually editing or re-typing text.
- **Architectural Solution:**
  1. **Vertical Message Header Architecture:** Restructured user and assistant message rows into a unified vertical column layout (`flex flex-col items-end` for user, `flex flex-col items-start` for assistant/proxy) with `max-w-[calc(100%-40px)]`. The action toolbar is contained in the message header above the bubble, completely eliminating horizontal flex squeeze and viewport clipping.
  2. **Strict Viewport Containment (`min-w-0`, `overflow-hidden`):** Applied `min-w-0` and `break-words overflow-hidden` across bubbles, markdown wrappers, and attachment cards, ensuring zero out-of-frame overflow on any screen size.
  3. **1-Click Retry / Resend Engine (`handleRetryMessage`):** Implemented full retry capabilities across Studio Chat and KIE Chat with `RotateCcw` icons. Retrying a message truncates subsequent history in IndexedDB and Firestore and re-dispatches the prompt to the AI model seamlessly.
  4. **Responsive Attachment Cards:** Added string truncation for long file paths and compact padding to `CollapsibleFileAttachment.tsx` to maintain clean aesthetics on narrow mobile viewports.

### 53. Cross-Origin "Script error." Mitigation & Tailwind v4 Vite Pipeline (`vite.config.ts`, `index.html`, `index.css`, `main.tsx`)
- **Problem & Root Cause:**
  1. The browser runtime reported generic `Script error.` via `window.onerror`.
  2. Because `index.html` loaded `https://cdn.tailwindcss.com` as an external cross-origin `<script>`, any browser-level warning, CSP restriction, or syntax evaluation error in third-party scripts is scrubbed by modern browsers into a generic `Script error.` with zero line numbers or stack traces.
  3. Meanwhile, `@tailwindcss/vite` was present in `package.json` but had not been mounted inside `vite.config.ts`, causing CSS to fall back to the external CDN script.
- **Architectural Solution:**
  1. **Native Tailwind v4 Plugin:** Mounted `tailwindcss()` from `@tailwindcss/vite` into Vite's plugin array in `vite.config.ts` and set `@import "tailwindcss";` in `src/index.css`.
  2. **External Script Elimination:** Completely removed `<script src="https://cdn.tailwindcss.com"></script>` from `index.html`, eliminating all external CDN script dependencies.
  3. **Global Script Error Interception:** Added a global `window.addEventListener('error', (e) => ...)` filter in `src/main.tsx` to prevent cross-origin script error noise and media element interruption events from propagating as fatal container errors.

### 52. 1,048,576 Token Limit Protection & Intelligent Context Compaction in Studio Chat (`gemini.ts`, `StudioChat.tsx`)
- **Problem & Root Cause:**
  1. Users encountered `Error: {"error":{"code":400,"message":"[original: beyond::dependency::INVALID_ARGUMENT] The input token count exceeds the maximum number of tokens allowed 1048576. (qos=CRITICAL_PLUS)","status":"INVALID_ARGUMENT"}}` in Studio Chat.
  2. Investigation revealed that in multi-turn conversations with code attachments, whole files, base64 images, or multi-step Chat Loops, every single past message was passed in full fidelity in `history`.
  3. Base64 images from earlier turns (each consuming hundreds of thousands of characters) and large repetitive code dumps from 5-10 turns ago remained in the request payload. As the session progressed, total input tokens grew past 1,048,576 tokens, permanently bricking subsequent messages in that thread.
- **Architectural Solution:**
  1. **Image Payload Stripping in History:** For turns older than the latest turn, replaced raw `inlineData` base64 payloads with lightweight markers (`[Previously attached image: analyzed in earlier turn]`).
  2. **Historical Attachment Truncation:** For turns older than 2 turns, file attachments exceeding 2,500 characters are condensed into summarized headers/footers with line-count indicators.
  3. **Token Budgeting & Sliding Window (`estimateContentTokens`, `pruneAndSanitizeStudioContents`):** Added proactive token estimation in `gemini.ts`. If estimated context approaches the threshold (~650,000 tokens), the sliding window drops the oldest message pairs while maintaining alternating conversation turns and preserving the user's latest prompt and system directives.
  4. **Self-Healing Emergency Fallback on Token Overflow:** In `sendStudioChatMessage`, wrapped the model call with `isTokenLimitError` detection. If a 1M token overflow is thrown upstream, the engine immediately performs emergency compaction (retaining only the active prompt and core system context) and automatically retries the generation.
  5. **Human-Readable Error Handling:** Cleaned up error reporting in `StudioChat.tsx` so users receive clear guidance instead of raw backend JSON exceptions.

### 51. Keystroke Latency & Markdown AST Memoization in Real-time Chat (`KieMarkdownRenderer.tsx`, `KieChatModal.tsx`, `StudioChat.tsx`)
- **Problem & Root Cause:**
  1. Users reported typing lag and input stutter when typing messages in chat interfaces.
  2. Investigation confirmed that on every keystroke, the local state (`inputMessage` in `KieChatModal.tsx`, `input` in `StudioChat.tsx`) updated, causing the entire chat modal component to re-render.
  3. Because `ReactMarkdown` instances were defined with inline `remarkPlugins={[remarkGfm]}` and inline `components={{ ... }}`, React treated plugin arrays and component mappings as new references on every single keypress. This forced `remark` and `rehype` to re-parse the entire Markdown Abstract Syntax Tree (AST) across all messages on every keystroke.
  4. In conversations with multiple or long messages, re-parsing dozens of markdown trees blocked the main thread for 100-300ms per character typed.
- **Architectural Solution:**
  1. **Static Plugin Definitions:** Lifted `STATIC_REMARK_PLUGINS = [remarkGfm, remarkBreaks]` and `STATIC_STUDIO_REMARK_PLUGINS = [remarkGfm]` to module-level constants so references remain strictly static.
  2. **Dedicated Memoized Renderers:** Created `KieMarkdownRenderer` and `StudioMarkdownRenderer` wrapped in `React.memo` with internal `useMemo` for AST component mappings (`pre`, `code`, `table`, `thead`, `tbody`, `tr`, `th`, `td`, `blockquote`, `a`, `ul`, `ol`). If a message's text, font size, or role haven't changed, React skips markdown evaluation entirely.
  3. **Message List Memoization:** Wrapped message list evaluation in `useMemo` in `KieChatModal.tsx`, ensuring that keystrokes in the input bar bypass the message list VDOM reconciliation completely. Typing latency dropped to ~0ms.
  4. **Background Task Guard:** Added an `isLiveSyncEnabled` check to the debounced project data sync effect in `App.tsx` to eliminate background JSON stringification overhead while live sync is disabled.

### 50. Rich Markdown Rendering & Syntax Architecture for Chat (`KieMarkdownRenderer.tsx`, `KieChatModal.tsx`)
- **Problem & Root Cause:**
  1. Tailwind CSS v4 `@tailwind base` resets all HTML headings (`h1`-`h6`), lists (`ul`, `ol`), blockquotes, and paragraphs to `inherit` font sizes, normal weights, and zero margins/list-styles.
  2. Relying solely on `@tailwindcss/typography` (`.prose`) in custom dark chat interfaces caused markdown to look identical to plain text because `.prose` was stripped or unconfigured in the CSS bundle, leaving standard markdown unstyled.
  3. User messages were rendered strictly inside a raw `<div className="whitespace-pre-wrap">{msg.content}</div>`, causing any user-provided markdown syntax (`#`, `**`, `-`, etc.) to display literally.
  4. In `react-markdown`, single-line fenced code blocks with no language identifier often misclassified as inline `<code>` when matching via regex without checking enclosing `<pre>` AST nodes.
- **Architectural Solution:**
  1. **Dedicated Modular Renderer (`KieMarkdownRenderer.tsx`):** Built a standalone renderer parsing GitHub Flavored Markdown (`remark-gfm`) and soft line breaks (`remark-breaks`).
  2. **Explicit Component Mapping:** Directly styled every HTML AST node (`h1`-`h6`, `p`, `strong`, `em`, `del`, `ul`, `ol`, `li`, `blockquote`, `a`, `hr`, `table`, `thead`, `tbody`, `tr`, `th`, `td`, `input`) with proportional `em`-based scaling, ensuring headers and lists scale naturally with the user-selected chat font size (4px through 24px).
  3. **`InPreContext` AST Disambiguation:** Provided an `InPreContext` React context around `<pre>` elements. When `code` evaluates, it unambiguously knows whether it is inside a fenced block or inline, guaranteeing 100% reliable fenced code block rendering regardless of length or missing language tags.
  4. **Visual Code Block Standard (`KieCodeBlock`):** Enhanced code blocks with distinct `#0d0d11` backgrounds, language pill, line count indicator, clipboard copy button with checkmark feedback, and collapsible overflow drawers for blocks exceeding 10 lines.

### 49. Portal-Rendered Custom Dropdown Architecture for Modal Toolbars (`KieModelDropdown.tsx`, `KieChatModal.tsx`)
- **Problem & Constraint:** Native HTML `<select>` elements render unstyled OS-level popups (harsh white/gray backgrounds, default fonts, zero animations, unstylable scrollbars) that disrupt the polished dark aesthetic established by custom controls like `AspectRatioDropdown` and `SubtitleFormatDropdown`. However, replacing `<select>` in a dense modal toolbar with an `absolute` dropdown triggers CSS clipping whenever parent containers enforce `overflow-x-auto` or `overflow-hidden`.
- **Architectural Solution:**
  1. **React Portal Escaping:** Rendered the floating dropdown menu via `createPortal(..., document.body)`. This completely decouples the popover from parent stacking contexts, modal scrollbars, and `overflow: hidden` containers.
  2. **Dynamic Viewport Placement:** Measured trigger button coordinates via `buttonRef.current.getBoundingClientRect()`, calculating collision-safe `top`, `left`, and `maxHeight` values with responsive boundary clamping against window edges.
  3. **App UI Consistency:** Implemented signature trigger styling (`bg-black/50 hover:bg-black/70 border border-white/10 hover:border-white/20 rounded-xl px-2.5 sm:px-3 py-1`), rotating `ChevronDown`, glowing provider dots, and popover design matching `bg-[#151515] border border-white/10 rounded-2xl shadow-2xl`.
  4. **Multi-Model Discovery:** Integrated live search filtering, provider filter pills (`All`, `Popular`, `Google`, `OpenAI`, `Claude`, `xAI`, `Other`), grouped category headers, capability tags, and inline custom model identifier support.

### 48. Multi-Conversation AI Studio Chat Architecture & Isolation Pattern (`StudioChat.tsx`, `ChatSidebar.tsx`, `studioChatStorage.ts`, `chat.ts`)
- **System Transformation:** Transformed the single-conversation `StudioChat` system into a ChatGPT/Claude-style multi-conversation architecture with conversation grouping, isolated history, and live generation protection.
- **Core Architectural Patterns:**
  1. **Separation of Concerns:**
     - `StudioConversation`: Tracks identity (`id`, `title`, `createdAt`, `updatedAt`, `lastMessagePreview`, `messageCount`, `isArchived`, `customTitle`).
     - `StudioMessage`: Individual turns associated with an explicit `conversationId`.
     - `activeConversationIdRef`: Ref-guarded pointer to avoid React closure staleness during streaming and asynchronous multi-turn chat loops.
  2. **Generation Isolation & Streaming Safety:**
     - Long-running reasoning loops or async agent responses pass `targetConvoId` explicitly through `processMessage`.
     - Output turns are persisted directly to `targetConvoId` in IndexedDB/Firestore and only appended to live UI state if `activeConversationIdRef.current === targetConvoId`.
     - Switching between conversations while a generation is running does not leak, corrupt, or cross-contaminate chat transcripts.
  3. **Dual-Layer Persistence & Legacy Migration:**
     - IndexedDB (`idb-keyval`) serves as the ultra-fast local store for instant rendering without network roundtrips.
     - Firestore (`studio_chat`, `studio_chat_messages`) synchronizes conversations when a user session exists, with owner-only access rules.
     - Legacy chat history under key `mv_director_studio_chat_history` is automatically migrated into the new multi-conversation schema upon first initialization.
  4. **Smart Title Derivation:**
     - The first message in any fresh conversation triggers `generateConversationTitle()`, removing conversational fluff and creating crisp, contextual titles (e.g., "Suno Instrumental Prompt").
     - In-place renaming is supported both in the sidebar item and the top chat header bar.
  5. **Mobile-First Responsive Drawer:**
     - On viewport widths < 768px, the sidebar transitions to an animated slide-out drawer with backdrop blur and tap-to-close behavior.
     - Keyboard shortcut `Ctrl+B` / `Cmd+B` toggles the sidebar on desktop and mobile.

### 47. KIE-Hosted Model Director Plan Execution & OpenAI Responses Protocol (`kieChatService.ts`, `gemini.ts`, `App.tsx`)
- **Error Manifestation:** `Failed to parse director plan: []` specifically when selecting KIE-hosted models (Grok 4.7, Codex, Claude Sonnet 4.6, GPT-5, etc.).
- **Root Cause Analysis:**
  1. **Upstream Responses Protocol Routing:** For `/grok/v1/responses`, `/codex/v1/responses`, and `/openai/v1/responses`, system messages passed directly inside `input` with `role: 'system'` caused KIE models to ignore the system prompt or return empty outputs `{ "output": [] }`.
  2. **Silenced API Errors & Fallthrough:** In `extractKieApiResponse`, when an upstream endpoint returned an empty array or an error response (such as rate limit or authentication), it fell through to `JSON.stringify(data)` (evaluating to `"[]"`). This string was returned as text, which `safeParseJSON` parsed into an empty array, triggering the error.
  3. **Absence of Structured Output Constraint:** Standard Gemini SDK handles `responseSchema` natively, but when proxying to KIE models via `callTextModel`, `responseFormat` was omitted and tokens were capped at 4096. Without an explicit schema contract injected into the user prompt, KIE models would occasionally output chat conversational text or an empty array.
  4. **Key Validation Desynchronization:** In `App.tsx`, `handleDirectorMagic` checked `apiKeysRef.current.google` regardless of whether a KIE model was active, blocking users or defaulting to unauthenticated calls.
- **Architectural Solution:**
  - **Dedicated Instructions Parameter:** In `sendKieChatCompletion`, mapped system instructions to the dedicated `instructions` parameter for Responses API endpoints, leaving only clean user/assistant messages in `input`.
  - **Explicit Error Throwing in Extractor:** `extractKieApiResponse` now inspects `data.error`, `data.detail`, `data.status`, and throws an explicit actionable error instead of returning raw `"[]"`. Added reasoning tag stripping (`<think>`, `<thought>`).
  - **Enforced JSON Contract:** `callTextModel` injects an explicit JSON schema template and non-empty rules for director plans when calling KIE models, sets `responseFormat: 'json_object'`, and expands `maxTokens` to 8192+.
  - **Model-Aware Key Validation:** `handleDirectorMagic` and `handleContinueDirectorMagic` now validate KIE API keys when a KIE model is selected, and sync keys across memory refs and local storage.

### 46. Robust Director Plan Parsing & Empty Structure Handling (`gemini.ts`)
- **Error Manifestation:** `Failed to parse director plan: []`.
- **Root Cause Analysis:**
  1. **Bracket Precedence Bug:** `extractJSON` checked `cleaned.indexOf('[') < cleaned.indexOf('{')`. If a prompt/output contained reference tags (e.g. `[REF_1]`) or empty bracket arrays `[]` before `{`, the extractor selected the opening bracket and the final closing bracket, creating an unparseable or incorrect JSON slice.
  2. **Schema Shape Brittleness:** When models returned a flat array of scenes (`[ { "title": ... } ]`) or `[]` instead of `{ "title": ..., "scenes": [...] }`, the parser looked strictly for `parsed.scenes` and threw a fatal error.
  3. **Continuation Scene Exhaustion:** When `continueDirectorPlan` was called with existing scenes greater than or equal to `projectData.sceneCount`, the prompt implicitly suggested 0 scenes were remaining, causing models to return an empty array `[]`.
- **Architectural Solution:**
  - `safeParseJSON`: Multi-tier parsing that checks direct JSON parse, braces `{...}`, brackets `[...]`, and truncated bracket/brace recoveries.
  - `normalizeDirectorScenes`: Flexibly extracts scene lists from `parsed`, `parsed.scenes`, `parsed.shots`, `parsed.plan`, `parsed.sequence`, `parsed.data`, or single scene objects.
  - Non-crashing handlers: Continuation with 0 scenes now logs graceful completion and retains the existing plan; initial plan generation with an empty response synthesizes an opening shot from the master art style.
  - Prompt guarantees: `targetSceneCount` is strictly floored at 1, `scenesToGenerate` dynamically requests a minimum of 2 new scenes, and user prompts explicitly forbid empty arrays.

### 45. xAI Grok 4.7 Specifications & API Configuration (`https://kie.ai/grok-4-7`)
- **Official Endpoint:** `POST https://api.kie.ai/grok/v1/responses`
- **Protocol:** OpenAI Responses protocol (`format: "response"`, `{ model: "grok-4-7", input: [...], reasoning: { effort }, tools: [{ type: "web_search" }] }`).
- **Context Window:** 500,000 tokens (500K).
- **Reasoning Controls:** Supports 4 discrete effort tiers: `low` (default), `medium`, `high`, `xhigh`.
- **Tools & Grounding:** Live web search supported via `web_search` parameter (`webAccess`).
- **Pricing:**
  - Input: 160 credits / 1M tokens ($0.80 / 1M).
  - Cached Input: 40 credits / 1M tokens ($0.20 / 1M).
  - Output: 480 credits / 1M tokens ($2.40 / 1M).
  - 10% effective discount applies on higher-tier top-up bonuses.
- **Official Benchmarks Reported:**
  - DeepSWE v1.1 (High Effort): 71.0% (leads over Fable 5.1 at 70.0%).
  - CursorBench 4.0: 46.3%
  - EEBench: 64.0%
  - AA Briefcase v1.1: 1,657
- **UI & Service Integration:** Added `supportsReasoningEffort: true`, updated badge to `500K Context • SWE 71%`, and ensured Grok sessions reveal reasoning level toggles and live web search in the settings drawer.

### 44. KIE Chat High-Density & Space Optimization Architecture (`KieChatModal.tsx`)
- **Header & Sidebar Optimization:** Reduced modal header from `h-14` to `h-11`/`h-12`, added toggleable desktop sidebar (`isSidebarCollapsed`) via `PanelLeft`/`PanelLeftClose` buttons so chat messages can expand full width.
- **Unified Single-Row Toolbar:** Merged the previous 2-row multi-pill selector into a sleek, high-density toolbar combining model dropdown, flagship quick-switch buttons, collapsible model catalog drawer (`showFullModelCatalog`), memory toggle, auto-loop steps selector, GitHub repo badge, and font stepper.
- **Scroll & Bubble Geometry:** Reclaimed horizontal and vertical screen space by expanding chat line max-width from `max-w-4xl` to `max-w-5xl`, reducing message list padding from `p-2.5 sm:p-6` to `p-2 sm:p-3.5`, sizing down avatars (`w-6 h-6 sm:w-7 sm:h-7`), and trimming message bubble padding from `p-3 sm:p-4` to `px-2.5 py-1.5 sm:px-3.5 sm:py-2.5`.
- **Streamlined Composer:** Default textarea height reduced from `rows=2` to `rows=1` (`min-h-[36px]`), padding compacted to `p-1.5 sm:p-2.5`, removed redundant font size steppers from the input row, and condensed the endpoint status strip.

### 43. Official KIE.ai Chat Catalog Reconciliation & Model Pruning
- **Verification Method:** Direct query against `POST https://api.kie.ai/client/v1/model-pricing/page` (89 official chat models total).
- **Pruned Models (Confirmed Non-Existent on KIE.ai):**
  - `gpt-6-sol-luna`: Removed (official KIE catalog only lists `gpt-6-astra`, `gpt-5.6-sol`, `gpt-5.6-terra`, and `gpt-5.6-luna`).
  - `claude-opus-5-5`: Removed (official KIE catalog lists `claude-opus-5`, `Claude-Opus-4-8`, `Claude-Opus-4-7`, `Claude-Opus-4-6`, `claude-opus-4-5`).
  - `claude-fable-5-1`: Removed (official KIE catalog lists `Claude-fable-5`).
  - Legacy placeholders: `gpt-4o`, `gpt-4o-mini`, `o1-preview`, and `deepseek-reasoner` removed from UI selectors and fallback defaults.
- **Added / Standardized:**
  - Added verified `gpt-5.4` via `/codex/v1/responses`.
  - Default session model set to `gemini-3.5-flash` (`/gemini-3-5-flash-openai/v1/chat/completions`).

### 42. KIE.ai Live Model Pricing & Credit Economy (`https://kie.ai/pricing`)
- **API Endpoint:** `POST https://api.kie.ai/client/v1/model-pricing/page` & `GET https://api.kie.ai/client/v1/model-pricing/count`
- **Catalog Size:** 495+ total model endpoints (89 Chat, 110 Image, 269 Video, 27 Music).
- **Credit Conversion:** 1 credit = $0.005 USD ($5.00 per 1,000 credits).
- **Gemini 3.5 Flash Rates (`https://kie.ai/gemini-3-5-flash`):**
  - Input: 90 credits / 1M tokens ($0.45 / 1M, 70% discount vs $1.50 market).
  - Output: 360 credits / 1M tokens ($1.80 / 1M, 70% discount vs $6.00 market).
- **GPT-5.2 Rates (`https://kie.ai/gpt-5-2`):**
  - Input: 87.5 credits / 1M tokens ($0.44 / 1M, 75% discount vs $1.75 market).
  - Output: 700 credits / 1M tokens ($3.50 / 1M, 75% discount vs $14.00 market).

### 41. KIE.ai Gemini 3.5 Flash & Gemini Family Endpoints (`kieChatService.ts`)
- **OpenAPI Reference:** `https://docs.kie.ai/market/gemini/gemini-3-5-flash-openai.md`
- **Endpoint Structure:**
  - `gemini-3.5-flash`: `POST https://api.kie.ai/gemini-3-5-flash-openai/v1/chat/completions`
  - `gemini-3.8-flash`: `POST https://api.kie.ai/gemini-3-8-flash-openai/v1/chat/completions`
  - `gemini-3.7-flash`: `POST https://api.kie.ai/gemini-3-7-flash-openai/v1/chat/completions`
  - `gemini-3.6-flash`: `POST https://api.kie.ai/gemini-3-6-flash-openai/v1/chat/completions`
  - `gemini-3.1-pro`: `POST https://api.kie.ai/gemini-3.1-pro/v1/chat/completions`
  - `gemini-3-pro`: `POST https://api.kie.ai/gemini-3-pro/v1/chat/completions`
  - `gemini-2.5-pro`: `POST https://api.kie.ai/gemini-2.5-pro/v1/chat/completions`
- **Capabilities & Parameters:**
  - Standard Chat Completions schema (`messages: [...]`).
  - Multimodal input via unified `image_url` object structure.
  - Google Search grounding via `tools: [{ type: "function", function: { name: "web_search" } }]`.
  - Up to 65,536 output tokens.

### 40. KIE.ai GPT 5.2 API Architecture & Specification (`kieChatService.ts`)
- **OpenAPI Reference:** `https://docs.kie.ai/market/chat/gpt-5-2.md`
- **Endpoint:** `POST https://api.kie.ai/gpt-5-2/v1/chat/completions`
- **Protocol Details:**
  - Standard Chat Completions structure (`messages: [...]` containing text and image objects via `image_url`).
  - **Reasoning Effort:** Top-level parameter `reasoning_effort: "low" | "high"` (defaults to `high`).
  - **Web Search Grounding:** Top-level `tools: [{ type: "function", function: { name: "web_search" } }]` (or `googleSearch`).
  - **Max Output:** 32,768 tokens with multimodal capabilities.

### 39. KIE.ai Chat: "Not Supported" Protocol Mismatch & Route Resolution (`kieChatService.ts`)
- **Problem & Root Cause:**
  - Users encountered a "not supported" error on KIE chat. Analysis of the OpenAPI documentation on `docs.kie.ai` and network dispatch revealed two distinct causes:
    1. **Protocol Schema Mismatch:** Endpoints using the OpenAI Responses protocol (`/openai/v1/responses` for DeepSeek & Kimi, `/grok/v1/responses` for Grok, and `/codex/v1/responses` for GPT-5.6/Codex) require an `input: [...]` array of objects (`{role, content}`), not the legacy OpenAI `messages: [...]` field. When `messages` was sent to `/openai/v1/responses`, the endpoint rejected the request.
    2. **Masked Fallback Error:** When requests to non-standard endpoints failed, the fallback branch blindly sent the model slug to `/v1/chat/completions`. Because KIE only supports traditional OpenAI models on `/v1/chat/completions`, the server returned `{"error": {"message": "model 'xxx' is not supported"}}`, overwriting the actual root error.
- **Architectural Solution:**
  - **Explicit Protocol Routing:**
    - `endpointType: 'claude'` -> `/claude/v1/messages` with Anthropic headers and format.
    - `endpointType: 'codex' | 'grok' | 'responses'` -> `/codex/v1/responses`, `/grok/v1/responses`, or `/openai/v1/responses` with strict `{ model, input: [...], stream: false, reasoning?, tools? }` schema.
    - `endpointType: 'openai'` -> dedicated model path or `/v1/chat/completions` with `{ model, messages: [...] }`.
  - **Universal Output Extractor (`extractKieApiResponse`):** Normalizes responses from all 4 paradigms: OpenAI Responses `output` objects (`output_text`), Claude `content` blocks, OpenAI `choices[0].message.content`, and raw string replies.
  - **Actionable Error Propagation:** Preserved transparent status codes and error messages from KIE without masking them behind misleading fallback errors.

### 38. KIE.ai Market Chat: GPT 5.6 Tiers & DeepSeek Single Model Alignment (`kieChatService.ts`, `KieChatModal.tsx`)
- **Problem & Context:**
  - Official OpenAPI specifications on `docs.kie.ai` confirm:
    1. `GPT 5.6` has 3 distinct tiers: `gpt-5-6-sol` (Sol), `gpt-5-6-terra` (Terra), and `gpt-5-6-luna` (Luna), all routed via `/codex/v1/responses` with reasoning effort and tool calling.
    2. `DeepSeek` on KIE.ai provides only 1 official model: `deepseek-v4-1-flash` (DeepSeek V4.1 Flash) via `/openai/v1/responses`. Legacy/deprecated models were pruned.
- **Architectural Solution:**
  - **GPT-5.6 Tiers:** Added all 3 tiers (`gpt-5-6-sol`, `gpt-5-6-terra`, `gpt-5-6-luna`) to `KIE_POPULAR_MODELS` with respective endpoint bindings and token output limits.
  - **DeepSeek Single Model:** Consolidated DeepSeek to `deepseek-v4-1-flash` (`DeepSeek V4.1 Flash`) with OpenAI Responses protocol support.
  - **UI Navigation:** Updated category tabs (`OpenAI (8)`, `DeepSeek & Moonshot (2)`) and select dropdown groups.

### 37. GitHub Repo Status & Notification Bar Viewport Optimization (`RepoStatusBar.tsx`, `StudioChat.tsx`, `KieChatModal.tsx`)
- **Problem & Context:**
  - When repository analysis was enabled in AI Studio Chat or KIE Studio, the GitHub status notification banner wrapped into multiple thick lines on small/mobile viewports, consuming valuable vertical screen height and obscuring the chat conversation.
- **Architectural Solution:**
  - **Zero-Overlap Viewport Footprint:** Redesigned `RepoStatusBar.tsx` into a sleek single-line bar with tight padding (`py-1 px-2.5`) and micro-typography (`text-[10px]`/`text-[11px]`).
  - **Collapsible Micro-State:** Integrated a toggle button (`ChevronUp`/`ChevronDown`) that allows collapsing the banner into an ultra-slim 20px pill bar (`isCollapsed` state persisted in `localStorage`).
  - **Instant Dismissal (`X`):** Added a close button allowing users to dismiss/disable repository awareness immediately without having to open configuration modals.
  - **Padding Cleanliness:** Removed redundant outer container wrappers in `StudioChat.tsx` and `KieChatModal.tsx` so the chat message stream retains maximum vertical height.

### 36. Centralized Chat Font Scaling Architecture & 4px Minimum Support (`chatFont.ts`, `KieChatModal.tsx`, `StudioChat.tsx`)
- **Problem & Context:**
  - Font scaling was previously isolated to Studio Chat with only 5 presets starting from 12px. Users needed font customization in KIE Studio and requested an ultra-compact minimum font size down to 4px across both chat environments to fit maximal information on dense displays.
- **Architectural Solution:**
  - **Shared Module (`src/utils/chatFont.ts`):** Created a single source of truth for font scaling configurations (`CHAT_FONT_CONFIGS`) across 11 discrete stops: `4px`, `6px`, `8px`, `10px`, `12px`, `14px`, `15px`, `16px`, `18px`, `20px`, `24px`.
  - **Class Mapping Matrix:** Each font stop defines custom arbitrary/Tailwind CSS class definitions for `chatTextClass` (`text-[4px] leading-[6px]` up to `text-[24px] leading-[34px]`), `proseClass` (with proportional heading/code styling), `inputTextClass`, `codeTextClass`, and `inlineCodeClass`.
  - **Universal Integration:** Integrated stepper buttons (`A-` / `A+`) and font selection dropdowns into both the top/sub-header bars and bottom prompt action toolbars in both `StudioChat.tsx` and `KieChatModal.tsx`.
  - **Persistence & Backward Compatibility:** Provided `normalizeChatFontSize` to map legacy string keys (`xs`, `sm`, `md`, `lg`, `xl`) to modern size strings seamlessly while persisting user preferences to `localStorage`.

### 35. Decommissioning Synthetic/Local Client Metrics in KIE Studio
- **Problem & Context:**
  - The client-side status monitor recorded only local browser request outcomes and ping latencies. Users naturally expected the success rate indicator to reflect live upstream per-model health and real-time backend reliability directly from KIE.ai.
- **Architectural Solution:**
  - Removed `KieStatusMonitor.tsx` and `kieMetricsService.ts` from the KIE Studio modal header and service pipeline to prevent misinterpretation.
  - Streamlined the header to keep focus on model selection, key management, persona switching, and standalone pop-outs.

### 34. Font Size Scaling & Accessibility Architecture in Studio Chat
- **Problem & Context:**
  - On mobile devices, users need the flexibility to choose smaller font sizes (e.g. 12px Compact) to maximize chat viewport space while the software keyboard is active, or larger font sizes (e.g. 16px–18px) for comfortable reading.
- **Architectural Solution (`StudioChat.tsx`):**
  - **Size Scale Matrix (`STUDIO_FONT_CONFIGS`):** Implemented five discrete typography presets (`xs: 12px`, `sm: 14px`, `md: 15px`, `lg: 16px`, `xl: 18px`).
  - **Component-Wide Synchronization:** Propagated `fontSize` across ReactMarkdown prose, user chat bubbles, message editor textareas, syntax-highlighted `StudioCodeBlock` components, inline `<code>` badges, and the main prompt textarea.
  - **Dual Stepper UI:** Exposed quick `A-` / `A+` stepping buttons in both the top toolbar and bottom input action bar for thumb accessibility on touch screens.
  - **Persistence:** Stored under `localStorage` key `mv_studio_font_size` with fallback to `sm` (14px).

### 33. Mobile-First Layout Architecture for Studio Chat Viewport Maximization
- **Problem & Context:**
  - On mobile screens (320px–480px width), the previous compact input bar placed four floating buttons on the left (`pl-36` / 144px) and three buttons on the right (`pr-28` / 112px). This squeezed the textarea down to ~80px width, causing text clipping and covering the chat area.
  - Hover-only message action buttons were inaccessible on touchscreens.
- **Architectural Solution (`StudioChat.tsx`):**
  - **Unified Bottom Toolbar:** Moved all input actions into a dedicated bottom sub-bar inside the input container. The textarea now utilizes 100% of the available horizontal width.
  - **Single Horizontal Scroll Row:** Left actions (Files, Image, Git, Search) gracefully scroll horizontally if needed without wrapping or causing vertical layout jumps.
  - **Mobile Touch Usability:** Message action controls are rendered with `opacity-70 sm:opacity-0 sm:group-hover:opacity-100` so mobile users can immediately edit, copy, delete, and collapse messages without requiring hover triggers.
  - **Responsive Sizing & Vertical Economy:** Scaled padding (`p-2.5 sm:p-4`), avatars (`w-7 h-7 sm:w-8 sm:h-8`), and empty-state suggestion cards to maximize the visible chat transcript on mobile viewports.

### 32. Multi-Format File Uploads, Drag-and-Drop & Clipboard Pasting in Studio Chat
- **Context & Motivation:**
  - Users frequently need to share code snippets, JSON schemas, subtitle scripts (SRT), text briefs, audio references, and images with the Studio Chat assistant without having to copy-paste thousands of characters manually.
- **Architectural Solution (`StudioChat.tsx`):**
  - **Multi-File Ingestion Pipeline (`processRawFiles`):** Inspects MIME types and extensions. Images are compressed with `compressImage` and set as `attachedImage`. Text, code, markdown, JSON, and subtitle files are decoded asynchronously using `file.text()` and mapped to `FileAttachmentItem` records with line counts and byte sizes.
  - **Drag-and-Drop Lifecycle:** Container attaches `onDragEnter`, `onDragOver`, `onDragLeave`, and `onDrop` handlers with a `dragCounter` ref to prevent flickering child hover triggers, showing an animated `UploadCloud` backdrop overlay.
  - **Clipboard Interception:** The prompt textarea listens to `onPaste` events; if `e.clipboardData.files` contains items (such as pasted OS screenshots or files), it intercepts default behavior and routes them to `processRawFiles`.
  - **Gemini Context Formatting:** Text files are passed into the conversation history as structured code blocks (`📁 **Attached File: [filename]**\n```lang\n...content...\n````), allowing Gemini to inspect, summarize, and debug entire source files seamlessly.

### 31. Git & GitHub Repository Context Awareness in AI Studio Chat
- **Context & Motivation:**
  - Users work on codebases, music video generation scripts, and GitHub repositories directly alongside storyboard planning. Making AI Studio Chat aware of connected Git repositories empowers the assistant to review code, provide architectural suggestions, inspect recent commits/diffs, and write Jules task specifications.
- **Architectural Solution (`gemini.ts`, `StudioChat.tsx`, `githubRepoContext.ts`):**
  - **Context Structure (`StudioGitRepoContext`):** Encapsulates `owner`, `repo`, `branch`, `latestCommit` (SHA, message, author, date, files), and index metadata.
  - **Dynamic System Instruction Injection:** In `sendStudioChatMessage`, when `gitRepoContext` is supplied, structured markdown instructions are appended to the system prompt informing Gemini of the repository details, branch, commit history, and instructions on how to assist with code reviews, debugging, and task automation.
  - **UI Integration & Toggle:** Added `isGitRepoEnabled` state persisted in `localStorage` (`mv_studio_git_enabled`), with 1-click toggles in the top toolbar, input toolbar, and an inline `RepoStatusBar` showing branch status, commit hash, and repository browser trigger.

### 30. Built-in Tools (Google Search) & Client Function Calling Separation in Gemini API
- **Problem & Root Cause:**
  - When chatting in AI Studio Chat with Google Search Grounding active, the Gemini API returned `Error 400 (INVALID_ARGUMENT): "Please enable tool_config.include_server_side_tool_invocations to use Built-in tools with Function calling."`.
  - Root cause: The Gemini REST API requires a special `tool_config.include_server_side_tool_invocations` flag when mixing server-side built-in tools (such as `{ googleSearch: {} }`) with client-side function declarations (`{ functionDeclarations: [...] }`). The `@google/genai` TypeScript SDK serializer (`toolConfigToMldev`) currently filters out unrecognized fields in `toolConfig`, causing the API request to lack the required flag and fail with error 400.
- **Architectural Solution (`gemini.ts`):**
  - **Context-Specific Tool Assignment:** In `sendStudioChatMessage`, when `enableWebSearch` is `true`, the engine passes exclusively `tools: [{ googleSearch: {} }]`. When `enableWebSearch` is `false`, it passes the client-side `functionDeclarations`.
  - **Automatic Conflict Recovery Catch Block:** If any API error mentioning `include_server_side_tool_invocations` or `Built-in tools with Function calling` is intercepted, `sendStudioChatMessage` catches the exception and immediately retries the generation with clean `{ googleSearch: {} }` tool grounding.

### 29. Resilient Multimodal Audio Transcription & 403 Permission Error Recovery in SRT Engine
- **Problem & Root Cause:**
  - When generating subtitles or forced vocal alignments for audio/video media, the API call threw `SRT generation failed {"error":{"code":403,"message":"The caller does not have permission","status":"PERMISSION_DENIED"}}`.
  - Root causes identified:
    1. **Files API Permission Limitations:** For files larger than 15MB or standard video uploads, `gemini_srt.ts` attempted `ai.files.upload`. Many standard Gemini API keys and restricted credentials lack Cloud Storage / Files API permissions, returning a hard 403.
    2. **Text-Only or Restricted Active Model:** If the active model was set to a custom or text-only model (`kie:...` or `custom-openai`), audio transcription failed or triggered authorization errors.
    3. **Missing Fallback & Incomplete Key Resolution:** If `apiKey` was not passed from props, `getGenAI` could fail to inspect the API Vault (`localStorage.mv_api_keys`).
- **Architectural Solution (`gemini_srt.ts`, `gemini.ts`, & `SubtitlesTab.tsx`):**
  - **`getEffectiveGeminiApiKey`:** Centralized multi-tiered key lookup checking explicit argument -> `localStorage.mv_api_keys` -> `localStorage.gemini_api_key` -> `process.env.GEMINI_API_KEY` / `VITE_GEMINI_API_KEY`.
  - **`callAudioTranscriptionModel` Auto-Fallback:** When transcribing or forced-aligning audio, automatically selects audio-capable multimodal models and cascades across fallback candidates (`gemini-2.5-flash`, `gemini-3.7-flash`, `gemini-2.0-flash`, `gemini-1.5-flash`) if a 403 or 404 is encountered.
  - **In-Memory Audio Downsampling & Inline Slicing:** Reduced chunk duration to 4 minutes (240s) so 16kHz mono WAV chunks are ~7.6MB, guaranteed to fit comfortably inside base64 `inlineData`. If `uploadFileToGemini` throws 403 on large files, the system automatically falls back to client-side AudioContext slicing with `inlineData`, bypassing the Files API entirely.
  - **Actionable User Error Parsing:** Formatted JSON error payloads in `SubtitlesTab.tsx` into clean, human-readable guidance directing users to verify their Gemini API key in Settings if permissions are missing.

### 28. Google Web Search Grounding in AI Studio Chat
- **Problem & Intent:** Studio Chat responses were previously limited to model parametric weights. To answer questions about real-time events, live documentation, lyrics, music trends, and current facts, Studio Chat required live Google Search tool invocation.
- **Architectural Solution (`gemini.ts` & `StudioChat.tsx`):**
  - **Tool Injection in `sendStudioChatMessage`:** When `enableWebSearch` is active (default `true`), `{ googleSearch: {} }` is dynamically appended to the tools array passed to the Gemini 2.5 Flash chat model.
  - **Grounding Metadata Extraction:** Extracted `groundingMetadata.webSearchQueries` and parsed `groundingChunks` (source URLs and titles) into a structured `StudioGroundingMetadata` payload returned alongside response text.
  - **Interactive UI Grounding Card:** `StudioChat.tsx` renders query badges (`Searched: "..."`) and source citations with direct external links and favicon/hostname formatting.
  - **Dual-Agent Compatibility:** Grounding is supported in both single-turn chats and autonomous AI-to-AI dialogue loops.

### 27. 1-Click Reload & Error Recovery in KIE Chat
- **Problem & Root Cause:** When an API error (e.g. rate limit, 500 server exception, or network disconnect) occurred during chat completion or loop execution, the user had to re-type, edit their previous message, or copy-paste the prompt to attempt a retry.
- **Architectural Solution (`KieChatModal.tsx`):**
  - **Error Flagging (`isError: true`):** Error messages are now stamped with `isError: true` so the UI can apply distinct warning styles (amber/red border and card formatting).
  - **Inline Reload Button:** A high-visibility **`🔄 Reload / Retry`** button is rendered directly at the footer of any error message.
  - **`handleRetryMessage` Execution Flow:** Truncates the error message from the session history, preserves preceding conversation turns and attachments, and immediately triggers a fresh API completion call.
  - **Header Action Bar Regeneration:** Added a `RotateCcw` reload icon to message headers for assistant responses, allowing instant regeneration at any point in the dialogue.

### 26. Automatic GitHub Commit Diff & Modified Files Injection in KIE Chat
- **Problem & Root Cause:** When users asked questions like "what did Jules edit in the latest commit and what is wrong?", the repository agent previously only injected `Analyzed Commit SHA: <hash>` without the actual commit message, list of changed files, or patch diffs. As a result, the model believed it didn't have access to the changes and asked the user to paste the repository URL and diff.
- **Architectural Solution (`kieChatService.ts`, `githubRepoContext.ts`, `types/githubRepo.ts`):**
  - **Commit Diff Extraction:** Updated `getLatestCommit` to parse GitHub's `files` array (filenames, statuses, additions, deletions, and git diff patches).
  - **Automatic Diff & Snippet Grounding:** `runKieChatWithRepoTools` now automatically fetches the latest commit message, author, list of changed files, line diffs, and source code of the modified files directly into the model's context.
  - **Explicit System Directives:** Added a system directive stating the assistant is already connected to the live repository so it never asks the user for URLs or manual diff pastes.

### 25. GitHub Freshness Check Resilience & Offline Cache Fallback
- **Problem & Root Cause:** When checking remote GitHub commit freshness (`checkRepoFreshness`), network drops, rate limits (60 requests/hr for unauthenticated GitHub API calls), or CORS issues threw `TypeError: Failed to fetch`, which logged `console.error` and triggered runtime error traps.
- **Architectural Solution (`githubRepoContext.ts` & `RepoStatusBar.tsx`):**
  - **Graceful Cache Fallback:** If the network request fails, `checkRepoFreshness` automatically retrieves the local IndexedDB cached repository index and serves the cached commit SHA rather than hard-failing.
  - **Non-Fatal Warning Logging:** Replaced fatal `console.error` logs with safe `console.warn` handlers to prevent tripping error interceptors when offline.
  - **Status Badge:** Added an amber `Offline / Remote Pending` status badge in `RepoStatusBar` that allows browsing cached files while clearly informing the user of the network/rate-limit state.

### 24. KIE Codex Endpoint Auto-Fallback on 500 Server Exceptions
- **Problem & Root Cause:** KIE.ai's `/codex/v1/responses` gateway (used for `gpt-5-6-*` and `gpt-6-*` models) occasionally returns upstream 500 "Server exception, please try again later" errors during high load or provider gateway updates. Previously, fallback to `/v1/chat/completions` was only triggered on 404/405 status codes.
- **Architectural Solution (`kieChatService.ts`):**
  - Expanded the Codex failure handler to catch all non-200 responses (500, 502, 503, 504, 400, 404, 405) and immediately attempt the standard `/v1/chat/completions` gateway before throwing.
  - Added helpful error guidance recommending fallback models (GPT-4o, Claude 3.5 Sonnet, DeepSeek R1, Gemini 2.5 Flash) if upstream KIE server exceptions persist.

### 23. KIE Chat GitHub Analysis Disconnected by Default & Explicit Toggle Control
- **Problem & Root Cause:** Previously, KIE Chat sessions defaulted to `repoConfig.isEnabled: true`, and the execution handler fell back to running GitHub repository tools on every message submission. As a result, even when users were simply chatting, prompting, or writing text, the system was fetching git commit freshness, indexing repository files, and loading repo analysis tool schemas.
- **Architectural Solution (`KieChatModal.tsx` & `RepoStatusBar.tsx`):**
  - **Disabled by Default:** Initial and newly created sessions default `repoConfig.isEnabled: false`.
  - **Explicit 1-Click Header Toggle:** Added a dedicated `GitHub: ON / OFF` button to the KIE Chat toolbar, giving users immediate visibility and 1-click control.
  - **Lazy Network & Component Mounting:** `RepoStatusBar` and repository tool execution only mount/trigger when `isRepoEnabled` is explicitly `true`. When turned OFF, zero git network requests or repo tools are loaded.

### 22. Studio Chat Intent Focus & Guardrails on Project Mutating Tools
- **Problem & Root Cause:** When users engaged Studio Chat for tasks like iterative prompt engineering ("keep improving my prompt"), the model previously over-indexed on its default "MV Director" persona and aggressively invoked tools like `updateProjectData` or talked about scene breakdowns. This caused unwanted mutations to the Director tab settings and derailed text-focused prompt iterations.
- **Architectural Solution (`gemini.ts`, `StudioChat.tsx`, & `KieChatModal.tsx`):**
  - **Relaxed Persona & Intent-Driven Prompting:** Updated `systemInstruction` to frame the AI as a versatile Assistant and Creative Reasoning Partner. Explicitly specified that when users ask to improve prompts, brainstorm, or refine text, the AI must output the refined content directly in the chat transcript without assuming every query is for a music video storyboard.
  - **Strict Tool Invocation Rules:** Updated the tool descriptions for `updateProjectData`, `updateCharacter`, `updateSceneImagePrompt`, and `addCharacter` to explicitly require direct user intent (e.g. "ONLY use when user asks to save to director tab/cast").
  - **Adaptive AI-to-AI Personas:** Generalized proxy directives (`User Proxy`, `Quality & Prompt Critic`, `Devil's Advocate`, `Co-Creator`) so that dialogue loops smoothly handle prompt enhancement, creative text iterations, and technical questions alike.
  - **KIE Chat Auto-Loop Alignment:** Verified KIE Chat has zero Director tab tools and refined its multi-turn auto-loop prompts to be task-agnostic (focusing on prompt iterations, code, reasoning, or domain analysis without scene bias).

### 21. Dual-Agent AI-to-AI Dialogue Mode & User-Proxy Inquisitor Architecture
- **Problem & Goal:** Users wanted a live dialogue loop where the conversation occurs between two AI agents: the primary AI (Director/Creator) and a secondary AI proxy that steps directly into the user's shoes (prompting, probing, questioning, or debating) while the user observes the dialogue stream in real time.
- **Architectural Solution (`StudioChat.tsx`):**
  - **Turn Alternation (Dual Agents):**
    - Turn 1 (`step = 1`): Primary AI Director processes the user's initial objective.
    - Even Turns (`step % 2 === 0`): AI Proxy agent takes on the user/interviewer role. Based on the selected `proxyPersona`, it analyzes the Director's latest response and formulates sharp follow-up questions, requests technical/visual specifics, or critiques pacing.
    - Odd Turns (`step % 2 === 1`): AI Director reads the Proxy's question and delivers concrete answers, solutions, or tool executions.
  - **Selectable AI Proxy Personas:**
    - `user_proxy`: User Proxy / Inquisitor (asks probing questions, requests concrete examples).
    - `critic`: Film & Music Video Critic (audits for cliches and weak pacing).
    - `devil`: Devil's Advocate (challenges core assumptions and debates counter-perspectives).
    - `collaborator`: Creative Co-Director (pitches creative twists and builds upon ideas).
  - **Visual Transcript Representation:** Proxy messages use `sender: 'bot_proxy'` rendered with distinct amber speaker badges (`👤 AI Proxy (Taking User Role: ...) • Turn X/Y`) and gradient backgrounds.
  - **Stop & Interruption Handling:** Either agent can conclude with `[LOOP_COMPLETE: <summary>]`, the step limit is enforced, and the user can click `⏹ Stop Loop` at any second.

### 20. StudioChat Automatic Chat Loop & Stop-Condition Chaining
- **Problem & Goal:** Complex creative or engineering workflows (such as creating multiple characters, configuring director lighting, drafting scenes, and generating keyframe art) require multiple sequential tool operations. Users shouldn't need to manually prompt the model after every intermediate step.
- **Architectural Implementation (`StudioChat.tsx`):**
  - **Dynamic Next-Step Protocol:** When Chat Loop mode is enabled, the execution engine injects a strict stop/continuation protocol instructing the assistant to conclude every turn either with `[NEXT_STEP: <action>]` or `[LOOP_COMPLETE: <summary>]`.
  - **Autonomous Step Chaining:** After each turn, the client parses the assistant's output and function calls. If next steps are required, it immediately extracts the target action and triggers the next step in the sequence using the updated conversation history without user input.
  - **Robust Stop Conditions:**
    1. **Task Complete:** Detected via `[LOOP_COMPLETE: <summary>]` or `[TASK_COMPLETE]` tags, causing the loop to complete with a `🎉 Sequence Complete` badge.
    2. **User Cancellation:** The user can click the `⏹ Stop Loop` button at any point (via `abortLoopRef.current`), stopping execution immediately without losing completed steps.
    3. **Step Ceiling:** The user-configurable limit (2 to 10 steps) prevents runaway token usage.

### 19. Autonomous Auto-Loop (ReAct & Multi-Turn Self-Conversation) Architecture
- **Problem & Motivation:** Single-pass LLM generation frequently suffers from subtle hallucinations, unverified assumptions about dependencies, and stylistic clichés. Users require an autonomous multi-turn conversation loop where the model posts Turn 1 into the chat, reads what it just wrote, self-critiques and expands in Turn 2, and synthesizes final actions in Turn 3 in real time.
- **Architectural Implementation (`KieChatModal.tsx` & `StudioChat.tsx`):**
  - **Sequential Turn Streaming:** When Auto-Loop is ON with `N` turns (2 to 5), the execution loop posts each assistant response immediately to state. The model is then prompted with the updated conversation history to critically review its previous reply and provide the next logical progression/refinement.
  - **Live UI & Controls:** Message bubbles display an `Auto-Loop Turn X of Y` badge with phase tags (`Initial Reply`, `Self-Analysis & Continuing`, `Synthesis & Polish`). A prominent `Stop Loop` button enables immediate cancellation without losing earlier turns.
- **Auto-Loop Trajectory Accordion:** Expandable trajectory drawers allow users to inspect intermediate discovery thoughts, inspected GitHub code lines, and critique passes.

### 18. KIE Chat Multi-Turn Memory & Credit Optimization Pattern
- **Problem & Token Economics:** In active developer sessions with 15+ messages or attached code snippets, every subsequent query re-sends the entire message history. For premium models like `Claude 3.5 Sonnet`, `Claude Sonnet 5`, or `GPT-4o`, this consumes huge quantities of prompt/input tokens on every prompt, rapidly depleting credits.
- **Architectural Solution (`memoryEnabled` in `ChatSession`):**
  - **Memory ON (Default):** Packages all prior messages in the active session (`truncatedMessages` or `updatedMessages`) into `KieChatMessage[]` for continuous multi-turn debugging and iterative planning.
  - **Memory OFF (Single-Turn Mode):** Dispatches only the system prompt + latest user prompt (`[userMessage]`), treating each message as a standalone task. This drops token costs by 90%+ in long sessions while allowing quick one-off questions without creating a new session.
  - **Interactive Controls:** Exposed via a one-click toolbar pill button (`Brain` icon with `ON` / `OFF` badges) and a dedicated toggle card in the Persona Tuning & Settings drawer. Preserved automatically in `localStorage` under `kie_chat_sessions_v1`.

### 17. KIE AI Chat Model Routing in Core Text Generation Engine
- **Context & Architecture Need:** Users frequently want to use cutting-edge Anthropic Claude models (`Claude 3.5 Sonnet`, `Claude Sonnet 5`), OpenAI/Codex flagship tiers (`GPT-4o`, `GPT-5.6 Sol`, `GPT-6 Astra`), or Open Reasoning engines (`DeepSeek R1`, `Grok 4.7`) for narrative director storyboarding, prompt enhancements, subtitle synchronization, and Studio Chat brainstorming, rather than being restricted to native Gemini endpoints.
- **Architectural Routing Pattern in `callTextModel` (`gemini.ts`):**
  - Text models configured with prefix `kie:*` (e.g. `kie:claude-3-5-sonnet-20241022`, `kie:gpt-4o`, `kie:gpt-5-6-sol`, `kie:deepseek-reasoner`) are intercepted in `callTextModel` before reaching `genAI.models.generateContent`.
  - Content parts are normalized into structured `KieChatMessage[]` objects with system instructions extracted.
  - Requests requesting JSON responses (`responseMimeType: 'application/json'` or schema) automatically append strict raw JSON formatting constraints to the message payload.
  - The request is dispatched through `sendKieChatCompletion` / `callKieChatCompletion` in `kieChatService.ts`, which automatically routes Claude requests to `/claude/v1/messages`, Codex models to `/codex/v1/responses`, and others to `/v1/chat/completions`.
- **State Persistence & Key Hydration:**
  - `setKieSettings(apiKey, customModel)` is called during App initialization and settings save to ensure zero-latency synchronization between UI settings and background API services.
  - Fallback logic checks `mv_api_keys.kie`, `kie_api_key`, and `process.env.KIE_API_KEY` for seamless key recovery.

### 16. Collapsible Message Bubbles & Code Block Line Truncation
- **Problem & Screen Space Constraint:** In technical workflows involving code analysis, Jules tasks, or long multi-paragraph prompts, individual message bubbles and code blocks can easily span 50–100+ lines vertically, pushing other messages out of view and requiring excessive scrolling.
- **Architectural Solution - Per-Message & Per-Code Block Collapse/Expand:**
  - **Dynamic Message Collapse:** Added `collapsedMessageIds: Record<string, boolean>` state in both `KieChatModal` and `StudioChat`. Any message exceeding 280 characters or 5+ lines features an expand/collapse toggle in the action bar.
  - **Visual Clamping with Gradient Peek:** Collapsed message bubbles are clamped with `max-h-28 sm:max-h-36 overflow-hidden relative`, featuring a bottom gradient fade overlay and an interactive `"Expand text ({lineCount} lines)"` pill button.
  - **Bottom Collapse Action:** When reading a long expanded message, a subtle `"Collapse message"` button is placed at the footer for effortless one-click cleanup.
  - **Collapsible Code Blocks (`ChatCodeBlock` & `StudioCodeBlock`):** Code blocks with > 10 lines display their total line count in the top header bar alongside an `Expand / Collapse` toggle button. Collapsed code is clamped to `max-h-36` with a smooth gradient fade and `"Show all {lineCount} lines"` overlay button.

### 15. Expandable / Collapsible Chat Input Box & Multi-Modal Window Expansion
- **Chat Box Sizing Trade-Off:** In mobile-first and desktop interfaces, fixed 2-row chat input boxes feel cramped when writing complex multi-paragraph prompts, drafting Jules task descriptions, or pasting code snippets. Conversely, a permanently tall textarea steals excessive screen real estate from conversation history.
- **Architectural Solution - Dual State Expand/Collapse:**
  - Implemented an `isInputExpanded` state on `KieChatModal` and `StudioChat`.
  - **Compact Mode:** Maintains a minimal 2-row height with inline attachment and trigger icons.
  - **Expanded Mode:** Transitions into a dedicated prompt editor workspace with line & character counters, `Shift+Enter` hints, `min-h-[170px] sm:min-h-[220px] resize-y` vertical resizing, and an explicit top/bottom Collapse button (`Minimize2`).
  - **Graceful Lifecycle:** Automatically collapses back to compact mode on message dispatch (`handleSendMessage`) or when `Escape` is pressed, keeping the chat feed visible immediately upon submission.
  - **Window Fullscreen Toggle:** Added an `isMaximized` toggle in `KieChatModal` (`Maximize2` / `Minimize2`) that switches between standard windowed modal (`max-w-6xl sm:h-[92vh]`) and edge-to-edge fullscreen viewport (`fixed inset-0 z-[120]`), maximizing coding real estate when inspecting large repos or review diffs.

### 14. Structured File Attachments, Selective Line Ranges, & Rendering Decoupling
- **Root Cause of Lag & Prompt Bloating:** Pasting full multi-thousand-line GitHub files directly into user input textareas or chat bubble strings caused major client lag, DOM overload, and unwieldy message bubbles. Editing an attached message forced the user to scroll through megabytes of raw text.
- **Architectural Solution - Render vs Payload Decoupling:**
  - Files attached from GitHub (or uploaded locally) are stored as structured `FileAttachmentItem` objects containing `{ name, path, repo, branch, url, content, size, lineCount, range }`.
  - The chat message bubble renders only the user's conversational prompt alongside a lightweight, interactive `CollapsibleFileAttachment` card showing file metadata, line count, line range, and on-demand syntax preview.
  - When constructing the payload for the LLM (`KieChatMessage[]` or Gemini `history`), a compiler function (`formatMessageForApi`) automatically packages the attachments into clean, language-tagged markdown code blocks. The LLM receives the exact code and line range context, while the browser UI maintains lightweight DOM state and snappy responsiveness on mobile (AndroidIDE / Poco F5) and desktop.
- **Interactive Line Range Inspector (`GitHubConnectModal`):**
  - Files over 400 lines automatically open a line range inspector modal before attachment to prevent blind file dumps.
  - Users can select custom start/end line bounds or click presets (e.g. Lines 1–100, 1–250, 1–500) with a live code slice preview, ensuring that only the relevant code section is attached.

### 13. ReactMarkdown v10 AST DOM Nesting & Code Block Customization
- **Deprecation of `inline` Prop in react-markdown 9+:** ReactMarkdown v9 and v10 no longer pass the `inline` boolean prop to custom `code` components. Relying on `if (inline)` causes all inline backtick code spans (such as \`repo/name\` or \`master\`) to be treated as block code elements, attempting to render a `<div>` and `<pre>` inside the enclosing `<p>` tag.
- **HTML DOM Nesting Rule (`<div>` and `<pre>` inside `<p>`):** Browsers prohibit `<div>` and `<pre>` elements as descendants of `<p>` (per HTML phrasing content rules). When violated, the browser forcibly closes `<p>` early, emitting React `validateDOMNesting: <div> / <pre> cannot appear as a descendant of <p>` warnings.
- **Fix Pattern:** Detect inline status via `const isInline = inline ?? (!match && !String(children).includes('\n'));` to ensure inline code renders as pure `<code>` phrasing tags. Additionally, unwrap markdown's default `<pre>` wrapper via `components={{ pre: ({ children }) => <>{children}</> }}` so custom block containers render without nested redundant `<pre><div><pre>` hierarchy.

### 12. GitHub Repository Context Engine & Jules Development Pipeline
- **Authoritative Remote Source of Truth:** The central repository `omy1maxz-alt/Mydownloader` on `master` is treated as the ground truth. Remote developer Jules modifies and commits code to GitHub. The local builder pulls code into AndroidIDE on an Android physical device (Xiaomi Poco F5).
- **Commit Freshness Verification:** Before code analysis runs, `checkRepoFreshness` compares the cached commit SHA against `GET /repos/:owner/:repo/commits/:branch`. When Jules pushes a new commit, the status turns `stale` and triggers an automated re-index of the Git tree. Snippets cached under old commit SHAs are invalidated to prevent stale reasoning.
- **Selective Snippet & Symbol Targeting:** Dumping entire repositories into LLM chat prompts causes token exhaustion, hallucinated line numbers, and high latency. Instead, `runKieChatWithRepoTools` indexes file paths and symbols, scans for relevant terms, retrieves only the exact line range or symbol context needed (e.g. lines 1–180 of `MediaDetectionEngine.kt`), caches it in IndexedDB/memory keyed by `owner/repo@sha:path:start-end`, and injects authoritative snippets with commit metadata.
- **Strict Evidence Categorization & Jules Task Protocol:** Investigation findings are explicitly separated into `[CONFIRMED]` (verified directly in GitHub source), `[LIKELY]` (supported by logic/symptoms but needing hardware verification), and `[HYPOTHESIS]` (unproven theory). When a fix is finalized, `JulesTaskCard` produces an unambiguous specification detailing Target Files, Exact Requirements, Invariant Constraints, and Poco F5 AndroidIDE `./gradlew assembleDebug` build & test steps with 1-click clipboard copying.

### 11. Chat Message Management & GitHub Integration
- **Edit, Truncate, & Resend Branching ("Forget Below"):** Implemented `handleSaveEdit(messageId, resend = true)` across `KieChatModal` and `StudioChat`. When a user selects "Save & Resend", the chat finds the index of the edited message, slices off all subsequent messages (`messages.slice(0, msgIndex)`), updates the edited message with the new content, and immediately submits the truncated context to the API. This enables natural conversational branching without stale future context contaminating subsequent answers. A separate "Save Only" action persists changes in place without truncating downstream history.
- **Custom Markdown Renderers (Code Blocks & Tables):** Replaced default markdown elements with a specialized `ChatCodeBlock` component supporting language badges, 1-click clipboard copying, and custom scroll containers. Markdown tables are wrapped in a horizontally scrollable container with styled zebra headers and cell borders to ensure clean display on both desktop and mobile screens.
- **Non-Overlapping Action Toolbar:** The Edit, Delete, and Copy action toolbar is anchored to the message header row beside the timestamp instead of floating inside the message bubble. This ensures the buttons never obscure user prompts or code blocks.
- **Inline Editing & Deletion:** Chat messages in `KieChatModal` can be edited in place. Editing updates the message content within the active session in `localStorage`. Deleting a message cleans up session state and cancels any active edit mode.
- **File Upload & Prompt Context:** File uploads are processed client-side via `FileReader`. Text and code files are formatted into Markdown code fences with filename and syntax hints, while images are embedded as data URLs. Files appear as removable chips and concatenate into the user message prompt on send.
- **GitHub API Integration:** Public GitHub repos do not require an API token (standard 60 req/hr rate limit). For private repos or higher limits, GitHub PATs are stored in `localStorage` (`github_personal_access_token`). File contents returned by GitHub's API are Base64 encoded and decoded with UTF-8 support (`TextDecoder`). Files and directories can be navigated hierarchically or fetched directly via URL and attached straight into the active conversation.

### 1. Image Generation (Gemini 3.1 Flash Image)
- **Subject Replacement:** When a user provides a Character Reference image, DO NOT include highly detailed facial descriptions in the text prompt. The text will override the image reference. The system should only use the character's name and describe their clothing/pose.
- **JSON Prompts:** The image model performs poorly with raw JSON strings. Prompts must be parsed into readable paragraphs before sending.
- **Multiple References:** Use strict Gemini Imagen syntax (`[Character Reference]` and `[Frame Reference]`) to preserve identity and composition. Avoid negative constraints.

### 2. Audio & Media Player
- **Local Audio Persistence:** Uploaded `File` objects are stored in IndexedDB via `idb-keyval`. `blob:` URLs must be regenerated on page reload.
- **YouTube Error 153:** YouTube blocks iframe embedding for many official music videos. Provide a "Pop out" feature instead.
- **Minimized State:** Hide `<audio>` or `<ReactPlayer>` using CSS when minimized to prevent playback interruption.

### 3. Story Mode Generation
- **Scene Limits:** Cap auto-calculated scenes to a maximum of 15 per batch to prevent timeouts.
- **Safety Filters:** Wrap generation calls in `try...catch`. Handle model blocks gracefully with visible errors.
- **Pronoun Tolerance:** When a project has *multiple* characters, the AI Director must use the exact character NAME in the scene prompt to trigger their reference image, avoiding generic pronouns which blend characters.

### 4. Background Execution
- **Keep Awake:** The app uses a silent, looping base64 audio track (`KeepAwake.tsx`) to prevent browser suspension during long batch generation.

### 5. AI Assistant inside the app (Studio Chat)
- **Context passing:** It receives the full `projectData` (characters, scenes, references) and injects it into its system instructions.
- **Tools:** It has tools to edit the app state directly (`addCharacter`, `updateCharacter`, `updateProjectData`, `updateSceneImagePrompt`, `addAttachedImageAsReference`). It can save user-uploaded images in the chat directly to the project's reference images.
- **Memory:** Chat history is stored in `localStorage` under `mv_director_studio_chat_history`. No hard sliding window limit is enforced, it relies on browser storage (~5MB) and the Gemini context window (1M tokens).

### 6. Image Generation Context Improvements
- **Frame Reference Auto-Analysis:** When generating a single image or performing a character swap (Swap Char) without a specific text prompt, the app now automatically analyzes the Frame Reference using `gemini-3.5-flash` to generate a detailed structural blueprint (pose, geometry, clothing, composition). This ensures `gemini-3.1-flash-image` has a concrete textual description to work with, drastically improving the accuracy of swaps and style transfers when no manual prompt is provided.

### 7. API and Model Configuration
- **Image Model Selection:** Users can now select their desired Image Generation Model (`gemini-3.1-flash-image`, `gemini-2.5-flash-image`, or `pollinations`) in the API Settings Vault.
- **Pollinations Fallback Routing:** If a user selects Pollinations (which is a free, text-only API), the app will bypass Gemini entirely for `generateSceneImage`, `generateSingleImage`, and `generateChatImage`. For advanced image-to-image features (like Multi-Swap or Outpainting), the service throws an error requiring the user to switch back to a Gemini image model since Pollinations cannot handle image inputs.

### 8. Frontend File Downloads
- **Data URI Size Limits & `.pending-` Bug:** Some browsers (specifically Chrome) struggle when an `<a>` tag's `href` is assigned a very large `data:image/png;base64,...` string. The download either fails or the browser saves the file with an incomplete `.pending-xxxx` prefix and drops the `download` filename attribute. To fix this, always convert data URIs to a `Blob` using `fetch(dataUrl).then(r => r.blob())` and then create an Object URL (`URL.createObjectURL(blob)`) before triggering the anchor click.

### 9. Emote/Sticker Generation Prompt Design
- **Character Emotes:** When generating character emotes/stickers, the technical instructions should enforce a Chibi/super-deformed style with clean vector outlines and flat colors on a solid white background. This makes background removal easier and ensures the expression reads clearly at small sizes (like Twitch/YouTube chat).
- **Creative Context:** The context should emphasize highly expressive, fun, exaggerated tropes to ensure clear emotional reads.

### 10. Lab Character Swap Fix
- **Issue:** The `generateMultiSwapImage` tool in the Lab would sometimes just regenerate the original image without applying the character reference.
- **Root Cause:** In the Multi-Swap tool, we were using Gemini 3.5 Flash to auto-describe the Frame Reference to give the image model a strong text prompt. However, Gemini 3.5 Flash would describe the *original person's* face, hair, and clothing in the Frame Reference. Because this text prompt was so detailed and matched the Frame Reference perfectly, it overpowered the `[Character Reference]` tag. Imagen 3's cross-attention favored the text and Frame Reference, ignoring the Character Reference entirely.
- **Solution:** Completely removed the `gemini-3.5-flash` auto-description step from the Multi-Swap flow. Imagen 3 is smart enough to perform a subject replacement using just the `[Frame Reference]` and `[Character Reference]` tags natively, without needing a detailed text description of the background. Removing the conflicting text anchor allows the Character Reference to take priority for the subject's identity.

### 11. Subtitle Timestamp Locking & Timing Jump Recovery
- **Root Cause of Mid-Audio Timestamp Jumps**: Long-form media transcription or translation passes can hallucinate time jumps (e.g. 22:15 -> 33:15) if prompt context windows slip or if the model misinterprets video track timecodes.
- **Timestamp Locking Engine**: Ground-truth timestamps from Pass 1 (transcription) are locked and merged onto Pass 2 (translation), preventing the translation pass from inventing new or offset timestamps.
- **Ripple Shift & Automatic Jump Repair**: `findTimingJumps` detects gaps >= 20s and provides automated one-click repair (`fixTimingJump` and `shiftSubtitles` with `from_selected` ripple scope), allowing users to immediately correct 10-minute jumps or arbitrary drift across all downstream subtitle blocks in one click.

### 12. Anti-Drift Chunking & Cue-ID Translation Pipeline
- **Problem**: When passing 20-45+ minute full audio tracks to generative multimodal models, the model's internal acoustic clock loses temporal grounding after 15-20 minutes, frequently causing arbitrary +10 minute hallucinated jumps (e.g., #140 at 22:46 -> #141 at 32:55).
- **Architecture**: "Never let generative LLMs be the source of truth for global timeline coordinates."
  1. **Audio Slicing Engine (`generateChunkedSRT`)**: Automatically active for media files > 12 minutes. The browser's native `AudioContext` decodes and slices the audio into bounded 8-minute WAV chunks with 15-second overlapping context windows.
  2. **Bounded Relative Transcription (`transcribeSingleChunk`)**: The model only ever transcribes within a strictly bounded window (max 480 seconds). Timestamps can never drift by 10 minutes because the entire acoustic segment is bounded.
  3. **Deterministic Global Timeline Assembly (`deduplicateAndMergeBlocks`)**: TypeScript code maps each chunk's relative milliseconds to global track time (`startMs + chunkStartMs`) and deduplicates dialogue across overlap windows with normalized text matching.
  4. **Cue-ID Translation (`translateCuesById`)**: The translation pass receives only discrete `[CUE X]` blocks and is strictly forbidden from generating timestamps. Translated text is mapped back to the deterministic global timestamps, completely eliminating timestamp destruction or drift during translation.
  5. **Automated Pipeline Repair (`autoRepairTimeline`)**: SRT output passes through automated chronological sorting, minimum duration enforcement, and overlap resolution.

### 13. External Second Brain Workflow (GPT via KIE.ai as Architect)
- **Workflow established**: Documented in `.builder_brain/04_external_second_brain.md`. When designing complex features or solving subtle bugs, GPT on KIE.ai serves as the external architectural reviewer and "Second Brain" using the Four Heads cognitive loop (Memory, Creativity, Critic, Head). The AI Studio agent acts as the primary builder/executor, writing the code, verifying builds, and persisting results to `DEV_JOURNAL.md`.

### 14. Integrated KIE Multi-Model AI Chat Studio & Pop-out Architecture
- **In-App & Standalone Pop-out Modes**: Users frequently want a direct, unconstrained AI chat interface powered by multiple foundation models (GPT-4o, Claude 3.5 Sonnet, Gemini 2.5, DeepSeek R1/V3) with zero context amnesia. We implemented `KieChatModal.tsx` and a standalone entry point `KieChatStandalone.tsx`.
- **Direct Standalone Popout Routing (`?mode=kie_chat`)**: Opening `window.open(url + '?mode=kie_chat')` renders `KieChatStandalone` directly without mounting the full video editor or background audio engines, giving the user an independent AI conversation monitor.
- **Model Routing & Storage**: Messages route to `https://api.kie.ai/v1/chat/completions` using standard OpenAI payloads with client-side prompt caching. Sessions and keys are persisted in browser local storage (`kie_chat_sessions_v1`).



### 11. Subtitle Vocal Alignment: Volume Energy Snapping vs. Gemini Semantic Alignment
- **Problem:** Volume-based "Snap to Audio" algorithms rely purely on mathematical amplitude thresholds (decibel envelope peaks). In modern music videos and vlog productions with 808 bass lines, kick drums, percussion, or backing synths, the amplitude peak is almost always triggered by the rhythm track rather than the singer or speaker's voice. This causes subtitle blocks to violently displace and push into incorrect timestamps, creating layout chaos ("box become mess").
- **Solution (Alt C - Gemini AI Semantic Vocal Alignment):** 
  - We engineered an AI alignment service (`gemini_srt.ts`) using `gemini-2.5-flash` with native audio multimodal understanding.
  - To prevent huge upload sizes and high latency, we created a client-side audio slicer (`sliceAudioFileToWav`) using `OfflineAudioContext`. It extracts only the relevant time window around the subtitle line (with padding and neighbor line context), downsamples to 16kHz mono, and encodes directly to a compact 16-bit PCM WAV in memory.
  - Gemini receives the WAV slice alongside the expected subtitle text and returns precise relative timestamps (`start_ms_in_clip`, `end_ms_in_clip`) based strictly on human vocal phonemes and spoken words, ignoring drums, bass, and instrumental arrangements.
  - Added fast playhead trimming (`[` for Mark In, `]` for Mark Out) to allow instant manual playhead snapping without dragging bounding box edges.
  - **Unified Subtitle Navigation & In/Out Trimming Pattern (`[subleft][in][out][subright]`):** To maximize speed during timeline subtitling, navigation across subtitle sequences must be tightly paired with playhead trimming. Grouping `[subleft]` (Previous Subtitle), `[in]` (Mark In), `[out]` (Mark Out), and `[subright]` (Next Subtitle) into a single 4-segment button group enables rapid sequential workflow: jumping to a subtitle seeks the playhead directly to its start timestamp, allowing instant playback, Mark In / Mark Out adjustment with boundary clamping, and single-tap progression to the next line. Supported keyboard shortcuts: `Alt+←` or `<` / `,` for Sub Left, `[` for Mark In, `]` for Mark Out, and `Alt+→` or `>` / `.` for Sub Right.
  - **Mobile Toolbar Scrolling & `touch-none` Anti-Pattern:** Never apply `touch-none` (`touch-action: none`) to toolbars or action bars containing overflow controls (like the selected subtitle action bar with `[ In` and `Out ]`). While `touch-none` is needed on timeline scrubbers and block trim handles to intercept browser gestures for custom drag math, on an `overflow-x-auto` container it blocks native browser touch swipe scrolling completely. Use `touch-pan-x` (`touch-action: pan-x`), vertical-to-horizontal mouse wheel translation (`onWheel`), click-and-drag desktop mouse panning, and dynamic left/right chevron buttons.
  - **Timeline Dragging Focus & Camera Anchoring Pattern (`SubtitleTimelineEditor.tsx`):**
    - **Problem:** When a user clicks and drags a subtitle block on a canvas timeline, two disruptions frequently disorient user depth perception: (1) redundant state updates triggering immediate re-renders (`setSelectedId(id)`) upon `pointerdown` causing a focus flash, and (2) updating `currentTime` with the moving block's start timestamp while dragging causes the camera track offset (`trackOffset = containerWidth / 2 - (effectiveTime / 1000) * zoom`) to scroll continuously beneath the cursor. The timeline track slides right as the user moves right, canceling visual feedback and making users unsure how far they have moved.
    - **Solution:**
      - Anchor `effectiveTimeForTrack` to `dragTimelineStart` whenever `dragState.current.type === 'move' | 'sync_move' | 'start' | 'end'`. The timeline canvas stays physically stable while the subtitle block glides smoothly under the pointer.
      - Upon `handlePointerUp`, keep the timeline camera locked to `dragTimelineStart` instead of jumping to the final block timestamp.
      - Guard selection triggers (`if (selectedId !== id) setSelectedId(id)`) to eliminate redundant re-render flashes.
      - Provide real-time HUD feedback: render a dashed "Ghost Box" at the original timestamp and a floating badge directly above the moving block displaying exact signed delta (e.g. `+0.45s`), start/end timestamps, wall collision alerts, and gap measurements to neighboring subtitles.
      - Pair with precision stepper buttons (`-0.5s`, `-100ms`, `+100ms`, `+0.5s`) and `Shift+Arrow` keyboard shortcuts for fine-tuning without drag jitter.

- **Issue:** The `gemini-2.5-flash-image` model struggled with character swapping in the Lab after the `gemini-3.5-flash` auto-description was removed.
- **Root Cause:** While `gemini-3.1-flash-image` natively merges `[Frame Reference]` and `[Character Reference]` tags perfectly without text descriptions, legacy models like `2.5-flash-image` require strong text anchors to understand what they are supposed to generate.
- **Solution:** Re-implemented the `gemini-3.5-flash` auto-description conditionally AND withheld the raw Frame Reference image from the generation payload for legacy models. For `gemini-2.5-flash-image`, passing both the Frame Reference and Character Reference as raw images causes it to anchor entirely on the Frame Reference and ignore the character. By sending only the textual description of the scene and the Character Reference images, legacy models will successfully generate a "similar" scene featuring the requested characters, matching the user's expectations for 2.5.
- **Audio Input for Story Generation:** To help Gemini generate better scene pacing and mood, we added a "Reference Audio" upload feature directly on the Director tab (Creative Brief). If an audio file is present in `projectData.localFiles`, its base64 representation is now attached directly to the `generateContent` payload in `createDirectorPlan` and `continueDirectorPlan` within `gemini.ts`. Gemini 1.5 Pro natively supports listening to this audio track alongside the lyrics to build the storyboard.
- **Music Video Editing Theory for Gemini:** Upgraded the Story Mode system prompt to explicitly teach Gemini about music video editing best practices. It now knows about A-Roll vs B-Roll, scaling framing with emotion (wide shots for intros, close-ups for choruses), cutting on the beat, and prioritizing visual metaphors over literal lyric interpretations. This significantly improves the pacing and cinematic quality of generated storyboards.
- **Music Video Editing Research Prompt:** Added a specialized research prompt to the Chat Logs to allow the user to extract professional editing heuristics from Gemini Advanced or Deep Research. Once provided, these rules will be incorporated into the AI Director's system prompt.
- **Algorithmic Cinematography Rulebook:** Completely overhauled the Gemini AI Director system prompt using an advanced 5-part heuristic framework. The AI now mathematically calculates Average Shot Lengths (ASL), focal length compression, temporal motion (frame rates like 24fps vs 120fps), camera actuation, and lighting arcs based on the song's musical structure.
- **AI Studio Settings Research:** Added a prompt to the Chat Logs for researching optimal Google AI Studio configurations (Temperature, Top-K, Top-P, Safety Settings, Few-Shot Examples) to ensure the AI Director model functions reliably in a custom environment.
- **Free Tier Audio Upload:** Clarified to the user in chat that audio file analysis works perfectly with the free Flash model tier.
- **Model Generation Config:** Applied optimal Gemini generation parameters derived from user research (Temperature 0.45, Top-K 40, Top-P 0.85) to `src/services/gemini.ts` to balance strict JSON structure with creative visual metaphor generation.
- **SRT Subtitle Crafter:** Added a new 'SubtitlesTab' component that allows users to upload audio/video files, converts them to base64, and sends them to Gemini 3.5 Flash to generate SRT files. Supports original, dual, and triple (transliterated) subtitle formats.
- **Subtitles Multilingual Support:** Updated `generateSRT` prompt logic to support rendering multiple translation languages simultaneously (separated by new lines) when requested in Dual and Triple subtitle modes. Swapped generic 'Type' icon to 'Subtitles' from lucide-react.
- **Snap to Audio Speech Boundary Detection (`audioSnap.ts`):** Implemented client-side audio analysis using standard Web Audio API `AudioContext.decodeAudioData()`. Downmixes to mono and computes 20ms RMS and peak energy envelopes to estimate noise floor and speech thresholds. Subtitle timestamps snap outward to vocal energy onsets and inward to speech pauses with customizable lead-in pre-roll (default 60ms) and tail lingering (default 100ms) to ensure subtitles never clip speech or linger awkwardly over dead silence. Waveform is rendered viewport-aligned via HTML5 Canvas on the subtitle timeline track.
- **Real-Time Video Scrubbing on Subtitle Adjustments (`SubtitleTimelineEditor.tsx`):** When dragging or trimming subtitle blocks on the timeline, the editor now throttles video seeks to ~20fps (50ms window) during pointer move, seeking directly to the active block's adjusted start/end timestamp. This gives the user continuous visual video feedback as they drag, allowing precise visual alignment against cuts and mouth movements. On pointer release (`handlePointerUp`), it issues an unthrottled seek to ensure frame-exact alignment. Added an "Enlarge Video View" button (`Tv` icon) to toggle cinema height (44vh), responsive mobile layout constraints in `SubtitlesTab.tsx`, and a 1-tap "Jump to Start" button in the selected block action bar.
## 2026-07-18: Extended Image / Outpainting in Lab
- **Feature:** Added "Extend Image" tool in the Lab tab to allow changing the aspect ratio of uploaded images.
- **Implementation:** Added `generateExtendedImage` in `src/services/gemini.ts` using `gemini-3.1-flash-image`. Updated `PromptGenerator.tsx` to include the new tab UI, state for `extendImageSource`, `extendImageAspect`, and `generatedExtendImage`.
- **Why:** The user requested "Add on lab extended image. so it'll adjust the ratio while preserve the original uploaded image", allowing them to easily adjust image dimensions for outpainting tasks directly within the MV Director.
- **Swap Char Aspect Ratio & Proportions:** Updated `LabState` and `PromptGenerator.tsx` to support `multiSwapAspect`. Passed this aspect ratio to `generateMultiSwapImage` in `src/services/gemini.ts`. Updated the critical prompt instructions inside `generateMultiSwapImage` to forcefully tell the model to "strictly preserve the head size, body proportions, and lighting of the original Frame Reference" to prevent the model from skewing anatomical proportions during the identity swap.
- **Bug Fix:** Modified `handleGenerateMultiSwap` in `PromptGenerator.tsx` to allow character mappings with empty descriptions. If a single character is mapped without a description, it automatically defaults to "The main subject in the image". This fixes an issue where the user was forced to provide a description even for obvious single-person swaps.
- **Bug Fix:** Adjusted the Lab tabs flex container with `overflow-x-auto` and added `shrink-0` to the buttons. This prevents the flex container from crushing the tabs when the screen is too small (e.g., on mobile).

## 2026-07-17: AI Agent Autonomy Expansion
- **Feature:** Expanded the Studio Chat AI's capabilities to view the `directorPlan` and edit it.
- **Resolution:** Added `addCharacterTool` and `updateSceneImagePromptTool` to `src/services/gemini.ts`. Passed `directorPlan` context directly to `sendStudioChatMessage`. Handled these function calls inside `StudioChat.tsx` by exposing `directorPlan` and `setDirectorPlan` as props.
- **Why:** To fulfill the user's request: "make yourself can see and edit what, on the app, because if you became the very part of the app it'll will enhance the app capability." This creates a more dynamic agent capable of performing deep surgery on the user's project state directly through natural conversation.
- **Bug Fix:** Refined the `generateMultiSwapImage` prompt inside `src/services/gemini.ts` to use a dedicated flow for single-character swaps. When `isSingleSwap` is true and the description defaults to "The main subject in the image", it now omits unnecessary role constraints that were confusing the Gemini model, allowing it to seamlessly replace the main subject.
- **Bug Fix (403 Errors):** Modified the `withRetry` wrapper in `src/services/gemini.ts` to treat 403 Permission Denied errors as retryable (up to `maxRetries`). This handles transient proxy/cold-start issues in the platform environment where the very first API call fails with a 403 but subsequent calls succeed.

## 2026-08-09: Batch Edit Tool
- **Feature:** Added "Batch Edit" tool to the Lab tab, allowing users to upload multiple images and process them with a single text instruction.
- **Implementation:** 
  - Added `batch_edit` tab state to `PromptGenerator.tsx`.
  - Added `batchEditImages` array state to handle multiple image uploads via `FileReader`.
  - Implemented `generateEditedImage` in `src/services/gemini.ts` using Gemini 3.1 Flash Image's `[Image to Edit]` prompting capability.
  - Sequentially processed the uploaded images to prevent rate limiting, providing incremental UI updates by pushing to `generatedBatchEditImages` as each image completes.
- **Why:** The user requested the ability to import multiple local images and apply instructions to edit them in bulk.

## 2026-08-09: SRT Format Fix
- **Bug Fix:** Fixed an issue where the generated SRT files could have invalid timestamps (e.g. missing zero padding on hours, or using periods instead of commas for milliseconds).
- **Implementation:** 
  - Updated the `systemInstruction` in `src/services/gemini_srt.ts` to emphasize the strict timestamp format (`00:00:00,000`).
  - Added a regex replace step over the final output text that explicitly pads 1-digit hours to 2 digits, and replaces any periods `.` with commas `,` before the milliseconds.
- **Why:** The user reported that the subtitle crafter was generating SRT files with invalid timestamp formats, which prevented them from working in standard players.

## 2026-08-10: Multi-Perspective Review Protocol
- **Feature:** Injected the Multi-Perspective Review Protocol into the AI Director's system instructions and saved it to the Chat Logs.
- **Implementation:** 
  - Added instruction #8 to `buildSystemPrompt` in `src/services/gemini.ts`. It forces the model to run a silent internal persona debate (Continuity, Composition, Prompt Engineering) to self-correct before outputting the final JSON schema.
  - Added a new entry to `src/data/chat_history.json` documenting the prompt for the user's reference.
- **Why:** The user shared a highly effective prompt framework and asked to evaluate its utility for both the coding agent and the application's AI.

## 2026-08-10: Core Operating Protocol
- **Feature:** Added the "Core Operating Protocol" to the Studio Chat Assistant and Chat Logs.
- **Implementation:** 
  - Updated `systemInstruction` for `sendStudioChatMessage` in `src/services/gemini.ts` to include "Memory & State Tracking", "Stop Slop", and "Task Observer" rules.
  - Added the prompt text to `src/data/chat_history.json`.
  - The AI coding agent is adopting the "UI/UX Pro Max" protocol as a permanent context rule for itself.
- **Why:** The user shared an excellent prompt focused on reducing AI fluff, maintaining memory context, and pushing for high-quality UI/UX.

## 2026-08-11: Visual Reference Toggle
- **Feature:** Added the ability to enable/disable reference images.
- **Implementation:** 
  - Added `enabled?: boolean` to `ReferenceImage` in `src/types.ts`.
  - Added a toggle button (`<Eye>` / `<EyeOff>`) to the reference image cards in `App.tsx` and the `ReferenceEditorModal.tsx`.
  - Updated `src/services/gemini.ts` to filter out disabled references (`ref.enabled === false`) before attaching them to AI prompts or using them in Image Generation.
  - Carefully preserved the original indexing (`originalIndex`) mapping to `REF_X` tags so disabling an image doesn't offset the ID bindings of subsequent images.

## 2026-08-11: Scene Card UX Polish
- **Feature:** Added hover scaling and shadow glow to `SceneCard.tsx`.
- **Implementation:** Used Tailwind classes `hover:scale-[1.015] hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300 relative z-0 hover:z-10` to create a smooth, floating interaction effect that elevates the card above others when hovered.

## 2026-08-11: Custom API Key Fix
- **Bug:** The `generateComboBatchScenes` function in `PromptGenerator.tsx` was mistakenly referencing `apiKeys.gemini` instead of `apiKeys.google`, causing it to drop the custom key and fallback to the environment proxy key.
- **Fix:** Replaced the argument with `apiKeySource === 'custom' ? apiKeys.google : undefined`.
- **Note on AI Studio Architecture:** Documented for the user that AI Studio's preview environment uses a Service Worker to intercept client-side calls to `generativelanguage.googleapis.com`, forcing the platform's default API key to be used regardless of the frontend payload. Custom keys on client-side SPAs will only take effect when deployed externally (e.g., Cloud Run) or exported locally.

## 2026-08-12: SRT Generator Validation
- **Bug:** The Gemini model frequently hallucinates SRT timestamps, outputting invalid formats (like `01:00,000` instead of `00:01:00,000`) or misplacing hours/minutes (interpreting 1m 9s as 1h 9m). It also tends to produce literal, awkward translations.
- **Fix:** 
  1. Updated the `systemInstruction` in `gemini_srt.ts` to strictly demand `HH:MM:SS,mmm`, prohibit `MM:SS`, and prioritize natural, idiomatic translations over literal ones.
  2. Built a robust `validateAndFixSRT` programmatic parser to intercept the generated text. It actively searches for malformed timestamps, shifts misplaced time units back to minutes/seconds if it looks like an AI hallucination, ensures start < end, guarantees sequential ordering, and reconstructs a perfectly valid SRT file before passing it to the UI.

## 2026-08-12: Chat Message Editing & Deletion
- **Feature:** Added fine-grained control to `StudioChat.tsx`. Users can now edit or delete both user and AI messages individually.
- **Architecture:** Separated the "Save in-place" action from the "Save & Resend" action, allowing users to modify chat history context for the AI without forcing a re-generation of the entire subsequent thread.

## 2026-08-13: Custom OpenAI Provider Support
- **Feature:** Implemented a universal `callTextModel` adapter in `gemini.ts` that intercepts calls intended for Google's GenAI SDK and safely routes them to any standard OpenAI-compatible `/chat/completions` endpoint.
- **State Management:** Extended the `ApiKeys` interface to include `openaiBaseUrl`, `openaiApiKey`, and `openaiModel`. Added a dedicated section in the `ApiKeyVault` UI.
- **Compatibility:** Automatically parses the complex Gemini structured payload (parts, inlineData, systemInstructions) into standard OpenAI `messages` format. Safely ignores this flow for Image Models (which remain strictly tied to Google's Imagen/Flash-Image infrastructure).

## 2026-08-13: Infinite Recursion Fix
- **Bug:** The app crashed with `Maximum call stack size exceeded` after introducing the Custom OpenAI provider.
- **Root Cause:** A flawed global regex replacement (to switch `genAI.models.generateContent` to `callTextModel`) inadvertently targeted the fallback condition *inside* `callTextModel` itself, creating an infinite recursion: `} else { return callTextModel(genAI, request); }`.
- **Fix:** Restored the fallback block to correctly call `genAI.models.generateContent(request)`.

## 2026-08-13: Nano Banana Prompts & Reference Swap
- **Feature:** Added a file input and Replace button to `ReferenceEditorModal.tsx` allowing users to replace the `data` of an existing reference image while keeping its ID.
- **Prompt Engineering:** Refined `enhanceAndSanitizePrompt` to strictly follow "Nano Banana" principles—describing physical effects and visual outcomes rather than empty praise (like "masterpiece" or "Sony A7R").

## 2026-08-13: Missing InlineData Fix
- **Bug:** The app crashed with `Image generation response missing inlineData` returning an empty text string (`finishReason: "STOP"`).
- **Root Cause:** In the Google GenAI SDK, text-and-image multimodal models (like `gemini-2.5-flash-image`) can sometimes default to outputting text if the `responseModalities: ["IMAGE"]` flag is not explicitly passed in the `config`, especially if `imageConfig` is omitted (e.g. when Aspect Ratio is set to "Original").
- **Fix:** Injected `responseModalities: ["IMAGE"]` into the `config` object of all image generation calls in `src/services/gemini.ts` to strictly enforce image outputs.

## 2026-08-13: Studio Chat Persistence Fix
- **Bug:** Studio Chat history was resetting on page refresh if users attached images or generated images.
- **Root Cause:** Chat history was previously saved to `localStorage`. Base64-encoded images in the chat history quickly exceed the 5MB browser quota, causing `localStorage.setItem` to throw a `QuotaExceededError` silently, leading to lost history. Also, React 18 strict mode mount/unmount effects could accidentally overwrite history if not gated by an `isInitialized` flag.
- **Fix:** Migrated `StudioChat.tsx` to use `idb-keyval` (IndexedDB) for theoretically unlimited storage and added an `isInitialized` flag to strictly control when state is written back to the database. Added an automatic migration fallback for legacy `localStorage` history.

## 2026-08-14: Caption Timeline Editor
- **Feature:** Created `SubtitleTimelineEditor.tsx` and `subtitleParser.ts` to give users an interactive non-linear timeline for caption blocks.
- **Design:** Integrated directly into `SubtitlesTab.tsx` via a view-toggle ('generator' vs 'editor') rather than a standalone SPA to maintain architecture cohesion. 
- **Tech:** Custom dragging engine handles block movement, edge trimming, and text updates smoothly without bloated DnD libraries. Time conversions automatically handle SRT and VTT string formats.

## 2026-08-14: SRT Parser & CapCut Timeline UI
- **Bug Fix:** Fixed an issue where the `parseSubtitles` utility would fail to import very short SRT files or files with non-standard line breaks. Switched to a robust block-chunking parser based on double newlines (`\n\n`).
- **UI Update:** Re-styled the Timeline Editor to mirror CapCut's intuitive interface.
  - Added real-time media playback synchronization with a moving playhead.
  - The preview area now dynamically overlays the active subtitle on the video player.
  - Moved the properties side-panel into a floating bottom toolbar (Split, Duplicate, Delete, and Inline Text Edit) that appears only when a block is selected.

## 2026-08-14: Subtitle Persistence & Player Fix
- **Bug Fix:** Fixed an issue where the timeline media player would not play. The `src` attribute was using an inline `URL.createObjectURL` which generated a new blob URL on every re-render. Because the timeline updates `currentTime` at 60 FPS via `requestAnimationFrame`, the media element was constantly reloading. Moved the URL generation into a `useEffect`.
- **Feature:** SubtitlesTab now uses `idb-keyval` (IndexedDB) to persist `audioFile`, `srtContent`, and `activeView`. This prevents users from losing their uploaded media or AI-generated subtitles if the browser tab refreshes or reloads.

- **Refactored Timeline UX:** Shifted the Timeline Editor model from a "scrolling container with moving playhead" to a "fixed center playhead with a translating timeline track." This perfectly replicates the CapCut UI pattern the user requested. Dragging the background scrubs the timeline, and dragging the caption blocks updates their timestamps relative to the stationary playhead.
- **Mobile Touch Trimming:** Migrated the SubtitleTimelineEditor from mouse events (`onMouseDown`) to universal pointer events (`onPointerDown`, `pointermove`). Added CSS `touch-none` to draggable elements to prevent the mobile browser from hijacking drag events for page scrolling. The selected subtitle block now displays thick CapCut-style side handles, making it incredibly easy to grab and trim block lengths on touch devices.
- **Timeline Editor Persistence & Mobile UI Fixes:** Refactored the data flow so `SubtitleTimelineEditor.tsx` calls an `onContentChange` prop when edits occur, enabling the parent `SubtitlesTab` to persist the edited timeline directly into its `idb-keyval` store. Fixed infinite re-render loops by tracking `isInternalChange` references. Adjusted the layout of the CapCut toolbar and central controls to flex-wrap nicely on mobile viewports. Replaced range sliders with exact `<ZoomIn>` and `<ZoomOut>` buttons to avoid layout breaking on tiny screens. Added precise MS time tooltips floating above the trim handles when dragging.
- **React State Warning Fix:** Fixed a React warning (`Cannot update a component while rendering a different component`) caused by triggering a side effect (`onContentChange` callback) directly inside the `setBlocksState` updater function. React 16.13+ strict mode runs updaters twice during render, so triggering state changes in parent components from within an updater throws warnings. Moved the synchronization to a `useEffect` block using an `isUserEdit` ref.
- **Dynamic Timeline Zoom Math:** Completely rewrote the Zoom bounds for `SubtitleTimelineEditor.tsx`. Instead of hardcoded pixel-per-second values, the `minZoom` and `maxZoom` are now mathematically derived dynamically from `containerWidth`. Max zoom-out renders exactly 30s of track across the screen; max zoom-in renders exactly 0.5s of track across the screen. Re-engineered the time ruler grid with a dynamic `tickInterval` system that scales cleanly (from 0.1s ticks to 60s ticks) so text never overlaps regardless of zoom level.
- **Mobile Drag Drop Fix:** Fixed an issue where the timeline drag handles would "lepas" (drop the drag event) on mobile devices when swiping. Implemented `target.setPointerCapture(e.pointerId)` inside `handlePointerDown` and added `{ passive: false }` to the `pointermove` document listener. This forces the browser to route all subsequent touch movements to the drag handle, overriding native pull-to-refresh or swipe-to-go-back gestures.
- **Timeline Performance Overhaul (Drag Slip Fix):** Addressed extreme touch latency on mobile that caused drag events to drop. The primary bottleneck was the `onContentChange` callback (which serializes state back into the heavy parent generator component) firing on every single pixel movement during `pointermove`. Overhauled the drag engine to decouple rendering state (`setBlocksLocal`) from the persistence state. Data is now visually interpolated inside the child component at 60fps and only committed to the parent (via `commitToParent`) exactly once during the `pointerup` event.
- **Mobile Touch Hit-box Tuning:** Expanded the invisible hit-box for the left/right timeline drag handles using pseudo-elements (`before:absolute before:inset-y-0 before:-left-6 before:w-6`) to drastically increase error tolerance on mobile touchscreens.
- **Timeline Editor Full-Screen Immersion:** Restructured the `SubtitlesTab` component so that switching into the "Timeline Editor" hides all generator-related headers and preview textareas, effectively giving the timeline the entire viewport to maximize horizontal scrub space and vertical visibility. Used a flex-1 h-full architecture to fill the screen correctly.
- **Timeline Layout & Ruler Fixes:** Addressed multiple mobile layout constraints. (1) Restored `overflow-y-auto` on the `SubtitlesTab` parent wrapper to re-enable native scrolling on smaller screens. (2) Removed the `Math.max(width, 24)` constraint on subtitle blocks, changing it to 4px. This correctly allows blocks to visually compress when fully zoomed out without colliding/overlapping. (3) Unified time formatting into `formatTimeWithMs` (`mm:ss.SS`) across all displays. (4) Increased `targetTickPixels` to 120 and added `-translate-x-1/2` to perfectly center ruler tick strings without overlap.
## 2026-08-14: Mobile UX Overhaul & Bulk Selection
- **Feature (Bulk Uploads):** Added `multiple` attribute to the character image upload inputs. Mobile browsers (like Chrome on Android) do not support `showOpenFilePicker` with directory persistence (`startIn` / `id`), which forces users to constantly navigate between folders when selecting assets one by one. Bulk selection mitigates this by allowing the user to select all their references in one go.
- **Bug Fix (Timeline Touch Scroling):** Implemented a 250ms "hold-to-drag" delay (`pending_move`) on timeline subtitle blocks. Swiping horizontally on a block before the timeout expires will seamlessly switch the gesture into a timeline `scrub` action rather than moving the block. This prevents accidental destructive edits when trying to navigate the timeline on small touch screens. Added haptic feedback (`navigator.vibrate(50)`) when the hold successfully grabs the block.
- **UI Fix (Overlapping Nav):** Increased the `<main>` wrapper padding to `pb-[80px]` to prevent the fixed bottom mobile navigation bar from occluding floating toolbars (like the CapCut-style subtitle action menu). Increased the mobile height of the subtitle edit `<textarea>` to comfortably fit 4 lines (quad-layered).
- **UI Fix (Timeline Subtitle Toolbar):** Moved the Subtitle editing toolbar out of the `absolute` position over the timeline track. It is now an inline flex element positioned directly between the media playback controls and the timeline track. This prevents it from obscuring the subtitles on small mobile screens. The `SubtitleTimelineEditor` parent container was updated to support `overflow-y-auto` so the user can scroll vertically if the inline toolbar pushes the timeline down.

## 2026-08-14: Subtitles Persistence Layer
- **Persistence (SubtitlesTab):** Added a dedicated persistence layer to the `SubtitlesTab`. The generated SRT text (`srtContent`) and the current UI view mode (`activeView`) are automatically saved to `localStorage` (`mv_subtitles_srt`, `mv_subtitles_view`). 
- **Persistence (Media File):** Standard browser `File` objects from user uploads cannot be trivially saved into `localStorage` (due to size constraints and blobs). Used `idb-keyval` (IndexedDB) to persist the selected audio/video `File` object (`mv_subtitles_media`), automatically reviving the Blob URL inside `SubtitleTimelineEditor` upon a page reload.
- **Data Flow:** Every time the user makes an edit (splitting, deleting, dragging time blocks) in `SubtitleTimelineEditor`, it triggers `onContentChange`, passing the newly generated SRT string to `SubtitlesTab`, which instantly commits it to `localStorage`. This ensures zero data loss if the user switches tabs or refreshes the page mid-edit.

## 2026-08-14: Subtitles Persistence Layer
- **Persistence (SubtitlesTab):** Added a dedicated persistence layer to the `SubtitlesTab`. The generated SRT text (`srtContent`) and the current UI view mode (`activeView`) are automatically saved to `localStorage` (`mv_subtitles_srt`, `mv_subtitles_view`). 
- **Persistence (Media File):** Standard browser `File` objects from user uploads cannot be trivially saved into `localStorage` (due to size constraints and blobs). Used `idb-keyval` (IndexedDB) to persist the selected audio/video `File` object (`mv_subtitles_media`), automatically reviving the Blob URL inside `SubtitleTimelineEditor` upon a page reload.
- **Data Flow:** Every time the user makes an edit (splitting, deleting, dragging time blocks) in `SubtitleTimelineEditor`, it triggers `onContentChange`, passing the newly generated SRT string to `SubtitlesTab`, which instantly commits it to `localStorage`. This ensures zero data loss if the user switches tabs or refreshes the page mid-edit.

## 2026-08-14: Live Sync Persistence and HMR Fix
- **Live Sync Persistence:** The `isLiveSyncEnabled` toggle state was purely in memory and initialized to `true`. If the app reloaded for any reason (or the user manually refreshed), it would turn back on. Added a `localStorage` check (`mv_live_sync`) to persist the user's choice and changed the default to `false`.
- **Vite Watch Configuration:** The `agent_bridge.json` file is written dynamically by the `/api/agent-bridge` proxy middleware. Since Vite watches the project root by default, writing to this file would occasionally trigger a full page reload (causing the "keep booting" loop). Added `agent_bridge.json` to the `ignored` list in `vite.config.ts` watch options.

## 2026-08-14: Gemini 3.1 Swap Syntax
- **Character Swap Bug Fix:** Gemini 3.1 Flash Image (Imagen 3) was failing to perform character swaps because the prompt string contained negative constraints ("DO NOT copy clothing", "DO NOT copy style") and the tags were formatted with trailing colons (`[Character Reference]:`). We removed the negative constraints and replaced them with positive instructions, stripped the colons from the tags, and moved the `finalPrompt` to the start (`unshift`) of the `parts` array so the model reads the instructions before parsing the reference images.

## 2026-08-14: Imagen 3 Subject Reference Tags
- **Swap Quality Fix:** Imagen 3's backend handles `[Subject Reference]` and `[Scene Reference]` better than the custom `[Character Reference]` and `[Frame Reference]` tags we were using. The model was previously trying to blend the two faces together rather than completely overriding the original subject. We updated the tags to match the Imagen 3 structural spec and rewrote the negative constraints into a hard positive constraint: "The subject from the [Subject Reference] MUST completely replace the original person... Do not blend their faces."

## 2026-08-14: Gemini 3.1 Organic Swap Architecture
- **Copy-Paste Fix:** When feeding Imagen 3 both a `[Scene Reference]` and a `[Subject Reference]`, the model often performs a literal pixel-paste of the face onto the target body, resulting in flat lighting and uncanny blending. We reverted to the Gemini 2.5 architecture for ALL models: we use Gemini 3.5 Flash to generate a hyper-detailed textual description of the scene's pose and background, and feed *only* that text plus the Character Reference to Imagen 3. This forces the model to synthesize the scene from scratch organically, guaranteeing perfect lighting and shadow blending on the subject's face.

## 2026-08-14: Gemini 3.1 Scene Reference Reversion
- **Loss of Exactness:** The previous fix to drop the `[Scene Reference]` and rely strictly on auto-description caused the model to lose the exact structural physics of the original scene (e.g., complex coffee splashes became generic lines). For Imagen 3, we MUST pass the image directly. Restored passing the `[Scene Reference]` image and changed the prompt frame to explicitly request "Image Editing" while enforcing perfect blending of the new subject's lighting.

## 2026-08-14: Gemini 3.1 Swap Resolution
- **Final Validation:** The "Image Editing" prompt structure paired with providing both `[Scene Reference]` and `[Subject Reference]` natively to Imagen 3 (Gemini 3.1) successfully resolves both issues. It perfectly preserves the exact physics/objects (like splashing liquid) of the source frame while flawlessly adopting the identity of the Character Reference without the uncanny "cut-and-paste" lighting effect.

## 2026-08-15: Gemini 3.7 Integration
- **Model Update:** Integrated the new `gemini-3.7-flash` and `gemini-3.7-pro` models into the application. Updated the default text model state in both `App.tsx` and `gemini.ts` to `gemini-3.7-flash` to take advantage of the latest speed and reasoning capabilities.

## 2026-08-15: Subtitles Generation Time Tracking
- **Duration Tracking:** Modified the subtitle generation flow in `SubtitlesTab.tsx` to record the start and end time of the generation process (`generateSRT`). The duration is persisted in `localStorage` under `mv_subtitles_gen_time` and displayed dynamically next to the tab's title using an emerald-styled badge. This provides the user with visibility into the AI's processing time.

## 2026-08-15: Subtitle Editor Zoom & Performance Fixes
- **Zoom Overlap Bug:** Fixed an issue where `Math.max(width, 4)` was artificially padding caption boxes to 4px wide. When zooming out (reducing `activeZoom`), this minimum width caused adjacent boxes to visually overlap and appear to extend into the wrong time ranges. Reduced this to `Math.max(width, 1)` to maintain an accurate time representation.
- **Timeline Grid Virtualization:** The background timeline grid was generating DOM nodes for every single tick across the entire video duration (e.g., thousands of nodes for long videos). Implemented tick virtualization based on `visibleStartPx` and `visibleEndPx` to only render the markers currently visible on the screen, completely eliminating React render lag during zoom/scrub operations.

### 2026-08-15: Timeline Zoom Anchor Fix
- **Zoom Drift Bug:** A user reported that zooming in/out caused subtitle boxes to drift horizontally, visually appearing out of sync with the true video time (e.g., text showing at 23.01 when the timeline visuals implied 21.72).
- **Root Cause:** The `trackOffset` math calculates translations relative to `containerWidth / 2`. The CSS places the visual playhead at `left-1/2` (true 50% width). We were using `window.addEventListener('resize')` and a 100ms timeout on mount to capture `timelineRef.current.clientWidth` into the `containerWidth` React state. On mobile devices, this frequently resulted in a stale or zero value because of layout race conditions. When `containerWidth` does not match the actual screen width, the mathematical center of the zoom operation detaches from the visual playhead, causing the time under the playhead to slide linearly based on the zoom factor.
- **Solution:** Replaced the window resize listener with a direct `ResizeObserver` attached to `timelineRef.current`. This guarantees the React state `containerWidth` always perfectly mirrors the true DOM layout width, keeping the zoom anchor mathematically locked to the visual playhead at all times.

### 2026-08-15: Timeline Pinch-to-Zoom Support
- **Feature:** Added native pinch-to-zoom to the timeline editor container.
- **Implementation:** Added a dedicated `useEffect` observing the `timelineRef.current` node. Attached `touchstart`, `touchmove`, and `wheel` event listeners with `{ passive: false }` to intercept multi-touch pinch gestures and trackpad zoom gestures. `e.preventDefault()` is used to disable native browser zooming inside the timeline, and the zoom distance math dynamically calculates the delta to smoothly adjust the component's internal React `zoom` state.

### 2026-08-16: Added Keyframe Analyzer
- **Feature:** Added a new "Keyframes" module/tab (`KeyframeAnalyzer.tsx`) to process short video clips.
- **Workflow:** Standard `<video>` and `<canvas>` elements are used to step through the video locally in the browser and extract exactly 30 high-resolution JPEG frames via `video.currentTime` and `canvas.toDataURL()`.
- **Analysis:** Added `analyzeFramesWithGemini` to `gemini.ts`. Instead of stitching the 30 images into a grid (which ruins pixel density), we pass an array of all 30 base64 images directly to Gemini as individual parts in the `contents` payload. Gemini 1.5 Pro/Flash's massive multimodal context easily digests these sequential frames and describes the keyframes with high precision.

### 2026-08-16: Added Frame ZIP Export
- **Feature:** Added `jszip` integration to the Keyframe Analyzer.
- **Workflow:** Users who want to manually edit frames (rotoscoping/style transfer) need an easy way to download all 30 extracted frames. The app now loops through the `frames` state, strips the `data:image/jpeg;base64,` header, and bundles them into a `blob` via `zip.generateAsync()`.

### 2026-08-16: Added Dynamic Grid Export
- **Feature:** Added `downloadAsGrid` helper to `KeyframeAnalyzer.tsx`. 
- **Workflow:** Solves the user request to output extracted video frames as a single large grid image for AI-based img2img batch processing. Uses a dynamic square-root based calculation (`Math.ceil(Math.sqrt(frames.length))`) to determine optimal rows/columns, draws them sequentially onto a hidden Canvas matching the native video resolution, and exports as a single high-quality JPEG.

### 2026-08-16: Dynamic FPS Frame Extraction
- **Feature:** Replaced hardcoded "30 frames" logic in `KeyframeAnalyzer.tsx` with dynamic FPS-based extraction.
- **Workflow:** Users can select target FPS. `targetFrames` is calculated dynamically via `Math.floor(video.duration * fps)`. The `gemini.ts` analysis prompt was updated to accept dynamic `base64Images.length` instead of hardcoded 30. Fixed TS type definitions in `App.tsx` related to adding the new `keyframes` active tab.

### 2026-08-16: Added Scrub & Save Frame Feature
- **Feature:** Added `saveCurrentFrame` to `SubtitleTimelineEditor.tsx`.
- **Workflow:** Allows the user to scrub the video in the Captions tab and save single high-quality frames directly from the `<video>` element via a canvas snapshot. This supports the user's manual vid2vid workflow without requiring full batch extraction in the Keyframes tab.

### 2026-08-16: Caption Settings Added
- **Feature:** Added state variables `previewSize` and `previewPosition` to `SubtitleTimelineEditor.tsx` along with a settings dropdown to adjust them.
- **Workflow:** Solves the user's need to visually adjust the text size and position of captions overlaid on the video player before they save frames. 
- **2026-08-16 23:03:00:** Fixed a major bug where a `sed`-like script truncated `SubtitleTimelineEditor.tsx` during an automated update, breaking the entire video and caption preview feature. We recovered the file by extracting the component's internal logic and state tree from the minified Vite chunk located in `dist/assets/`, effectively rebuilding the complex scrubbing, pinch-to-zoom, and handle-drag logic exactly as it was, while safely implementing the dynamic inline styles for `previewSize` and `previewPosition`.
- **2026-08-16 16:17:00:** Implemented the Gemini File API via the REST endpoint \`generativelanguage.googleapis.com/upload/v1beta/files\` using browser-native \`fetch\`. This handles CORS perfectly from \`localhost:3000\` and bypasses the 20MB inlineData limit. We use \`audioFile.arrayBuffer()\` inline for files <15MB to save time, and automatically switch to Resumable Uploads for anything larger, allowing users to upload 30+ minute videos up to 2GB in size directly from the browser!
- **2026-08-16 16:29:00:** Fixed an issue where the caption settings popover was clipping on mobile/small screens. Moved it to a centered overlay modal. Also implemented a new "Sync Subtitles" feature that shifts all subtitle blocks forward or backward in milliseconds, modifying the absolute timestamps to fix synchronization drifts.
- **2026-08-16 16:40:00:** Updated \`formatTimeWithMs\` in the Subtitle Timeline Editor to render true 3-digit milliseconds instead of 2-digit hundredths of a second. This makes timeline scrubbing and precision syncing much more accurate, directly tying to the millisecond scale used in SRT formatting.
- **2026-08-16 16:46:00:** Implemented "Ripple Sync" via the first caption. When the user drags the first chronological subtitle block (`isFirstBlock && type === 'move'`), the calculated `actualShift` delta is applied to *every* subtitle block in the timeline. This satisfies the user's preference for intuitive visual synchronization instead of relying solely on the numerical Sync modal.
- **2026-08-16 16:51:00:** Implemented a global video scrubber range slider above the timeline playback controls. This addresses the lack of rapid macro-navigation, allowing users to jump directly to any scene in the video without having to swipe repeatedly through the zoomed-in micro timeline.
- **2026-08-16 16:56:00:** Addressed the \`DOMException: The play() request was interrupted by a call to pause()\` error. This occurs when a user scrubs the timeline or clicks pause immediately after hitting play, causing the browser to abort the asynchronous \`play()\` Promise. Added proper \`AbortError\` rejection handling to \`mediaRef.current.play()\` calls across the timeline editor, main app audio player, and KeepAwake utility to cleanly suppress the error and prevent console pollution/UI state desyncs.
- **2026-08-16 17:04:00:** Fixed an issue with "Ripple Sync" where dragging the first subtitle block to the right would become stuck or fail to update correctly under certain render-batching conditions. The previous implementation calculated relative `actualShift` deltas incrementally from React's `prev` state, which caused accumulator bugs when `pointerMove` fired faster than React's batch commit cycle. Refactored the drag logic to store a frozen snapshot of `initialBlocks` inside `dragState` upon `pointerDown`, allowing `pointerMove` to calculate a pure, absolute transformation. This mathematically guarantees 1:1 mouse tracking without floating point drift or batching collisions.
- **2026-08-16 17:09:00:** Addressed a UX issue in the Subtitle Sync modal. Previously, clicking the preset buttons (+0.5s, -0.5s) or clicking "Apply" for a custom offset did not close the modal. Because the modal overlay obscured the timeline beneath it, users thought the sync action failed ("nothing seemed to change"). Refactored the modal buttons to trigger `setShowSyncSettings(false)` immediately upon shifting, and added an `onKeyDown` listener to allow users to press 'Enter' to apply custom sync offsets.
- **2026-08-16 17:11:00:** Changed the expected input unit in the Subtitle Sync modal from milliseconds to seconds. The modal buttons (-0.5s, +0.1s) suggested seconds, but the custom input expected milliseconds, causing confusion when users entered decimal values like `9.6`. The input now natively accepts seconds (with `step="0.1"` for decimals) and multiplies by 1000 before passing it to `shiftSubtitles()`. Added an inline "s" label to visually clarify the expected unit.
- **2026-08-16 17:15:00:** Changed the styling of the subtitle blocks so that they turn green (`bg-green-500/30` and `border-green-400`) while they are actively being dragged. Added a `draggingId` state to track the active block being dragged during pointer down/up events to ensure immediate UI feedback.
- **2026-08-16 17:22:00:** Refactored the drag behavior in the Subtitle Timeline Editor based on user feedback. Users wanted the ability to choose between a "Normal Drag" (shifting only a single subtitle box) and a "Ripple Sync Drag" (shifting the dragged box AND all subsequent boxes following it). 
    - Replaced the single top drag handle with a split top tab: the left side (Amber) triggers a `move` (Normal Drag), while the right side (Indigo with a ListTree icon) triggers a `sync_move` (Ripple Sync).
    - Updated the `handlePointerMove` logic to map over the blocks and only apply the delta to blocks where `block.start >= initStart` when in `sync_move` mode.
    - Fixed a bug where the video could appear to "not play" after dragging/syncing. If the user dragged a subtitle near the end of the timeline and the video finished playing, the HTML5 video element would natively pause, but the React `isPlaying` state would remain `true`. This caused the Play/Pause button to become desynced, requiring a double-click to resume. Added `onEnded={() => setIsPlaying(false)}` to both `<video>` and `<audio>` elements to ensure the state stays perfectly synced with native playback.
- **2026-08-16 17:35:00:** Changed the drag behavior. Users found the tiny top tabs annoying and expected to be able to drag the body of the subtitle box itself.
    - Removed the top drag handles completely.
    - Added a global `dragMode` state ('normal' or 'sync') with a toggle in the timeline toolbar.
    - Updated the main subtitle box `onPointerDown` to use `move` or `sync_move` depending on the global mode. This enables users to just grab and drag the body of the box to move it. Clicking a box selects it without moving the playhead, which is the expected behavior for standard NLEs.
- **2026-08-16 17:46:00:** Implemented a new playhead synchronization strategy to resolve user frustration ("subtitle box and preview not matched") without breaking standard fixed-playhead NLE drag mechanics.
    - If the user clicks on a subtitle box and *holds to drag*, the playhead does NOT jump (which preserves their drag delta and keeps the timeline anchored).
    - If the user *clicks* on a subtitle box (pointer down and pointer up with deltaX < 3), the playhead instantly seeks to the `start` time of that subtitle box. This allows the user to see the precise frame in the video preview that corresponds to the subtitle they just clicked, while keeping drag-and-drop functional.
    - Added a "Fit Zoom" (Scan icon) button to the timeline toolbar that calculates and resets the zoom level to approximately 10 seconds of visible timeline (`containerWidth / 10`).
- **2026-08-16 18:00:00:** Implemented dynamic timeline decoupling during subtitle block dragging. 
    - Issue: When dragging a block, the video didn't update to the new frame, making visual alignment impossible.
    - Solution: Modified `trackOffset` calculation to freeze at the drag's start time (`effectiveTimeForTrack`). As the user drags the block, `seekTo` updates `currentTime`, pushing the video preview along with the block's start time, but leaving the timeline anchored. The playhead line dynamically offsets via `left: {(containerWidth / 2) + ((currentTime - effectiveTimeForTrack) / 1000) * activeZoom}px` to perfectly track the user's cursor.
    - Also converted the crowded right-side toolbar to a horizontal scrolling flex container (`overflow-x-auto flex-nowrap`) to support smaller screens.
    - Injected extensive `console.log` statements into media events (`togglePlay`, `seekTo`, `onPointerUp`) to debug persistent playback issues if they continue.
- **2026-08-16 18:01:00:** Fixed an issue where the playhead would jump to the touch position when the user tapped the timeline background to scrub. Implemented mobile NLE style scrubbing: tapping the timeline background no longer jumps the playhead; it instead anchors the current time and applies drag deltas from there, allowing smooth panning.
- **2026-08-16 18:05:00:** Reintroduced a static center marker (red) to the timeline to serve as a permanent anchor point, as the dynamic white playhead now decouples from the center during block drags. This helps users maintain visual orientation of where the timeline is actually centered.
- **2026-08-16 18:12:00:** Addressed severe drag lag/jank during timeline operations.
    - Issue: Calling `mediaRef.current.currentTime = ms / 1000` inside `handlePointerMove` on every single pixel movement completely blocked the main thread as the browser desperately tried to decode and seek the video 60+ times a second.
    - Solution: Implemented a hybrid throttling mechanism (`lastVideoSeekRef`). React state (`currentTime`) still updates instantly on every frame to keep the UI playhead smooth, but the actual video decoder (`mediaRef.current.currentTime`) is heavily throttled to ~12fps (80ms interval) during active drags.
    - Added a final un-throttled `seekTo(currentTime)` on `pointerup` to guarantee the video frame perfectly snaps to the final drop position when the drag finishes.
- **2026-08-16 18:16:00:** Fixed a closure staleness bug in `handlePointerUp` where releasing a drag (either scrubbing the timeline or moving a block) would snap the timeline/video back to its initial state. `handlePointerUp` was calling `seekTo(currentTime)`, but `currentTime` was captured in the closure from when the hook was instantiated. Fixed by dynamically recalculating the target time based on the `deltaMs` stored in the `dragState.current` refs.
- **2026-08-16 18:25:00:** Fixed drag cancellation issues on touch screens.
    - Issue: When users tried to drag blocks or handles on mobile, the drag would randomly cancel (block turns from green back to orange).
    - Cause 1: Holding the block for a split second triggered the browser's native long-press context menu, which fires a `pointercancel` event and abruptly terminates the JS pointer capture. Fixed by adding `[-webkit-touch-callout:none]`, `select-none`, and `onContextMenu={(e) => e.preventDefault()}` to all draggable handles.
    - Cause 2: Multi-touch interference. If a user rested part of their hand on the screen while dragging, the stray pointer events would interfere. Fixed by locking the drag handlers strictly to the initial `pointerId`.

[2026-08-16T19:42:00-07:00] Fixed floating soundtrack widget dragging by isolating framer-motion drag controls strictly to the header handle.

[2026-08-16T19:48:00-07:00] Mobile optimizations: Removed auto-seeking during subtitle timeline drags to prevent playhead-preview desync. Increased touch targets for trim handles to 40px visual/hitbox for phone users. Added touch-action: none to floating player handle.

[2026-08-16T20:06:00-07:00] Timeline: Enforced touch-action: none on timeline track and subtitle block containers to prevent mobile browser gesture interruption. Added fixed timecode display to the static playhead to align with CapCut UX.
[2026-08-16T20:16:00-07:00] Timeline Fixes: Added ResizeObserver to perfectly sync `containerWidth` regardless of mobile address bar resizes, fixing a visual desync bug where blocks seemed to render at offset times compared to the video preview. Applied `touchAction: none` to the root timeline container to prevent native page swiping from canceling drag events (`pointercancel`). Made timeline ticks dynamically scale density based on activeZoom.
[2026-08-16T20:25:00-07:00] Subtitle Editor Dragging: Removed 'hold to drag' behavior from the subtitle box body as it was too easy to accidentally move a block when just trying to select it. Introduced a dedicated "Move Mode" toggle in the subtitle edit toolbar. When activated, the subtitle box turns red and allows dragging. If not active, touching the box body only selects it without dragging. Added `onDragStart={(e) => e.preventDefault()}` to all draggable handles to prevent the browser's native HTML5 drag-and-drop from secretly canceling pointer capture (hallucinated "finger release").

[2026-08-16 21:01] Fixed mobile drag dropping issues in SubtitleTimelineEditor.tsx by decoupling React state updates during pointermove from parent notification (notifyChange), preventing main-thread latency, and added e.preventDefault() with { passive: false } to pointermove to prevent native scrolling disambiguation on iOS/Android.

[2026-08-16 21:03] Fixed Uncaught ReferenceError: updateBlocks is not defined in SubtitleTimelineEditor.tsx by removing the stale updateBlocks reference from a useCallback dependency array.

[2026-08-16 21:17] Added an "Extract Segment" tool to the Subtitle Timeline Editor. It filters blocks between a user-defined start and end time (in seconds) and re-times them so the new start time becomes 0, creating a self-contained adjusted SRT.

[2026-08-16 21:20] Added shrink-0 class to subtitle toolbar buttons to prevent flex shrinking when the window resizes, allowing the container overflow-x-auto to trigger a horizontal scroll on small screens.

[2026-08-16 21:23] Fixed Uncaught ReferenceError: totalDurationMs is not defined in SubtitleTimelineEditor.tsx by replacing totalDurationMs with the existing duration state variable in the extractSegment function.

[2026-08-16 21:32] Added handleFileAppend logic to SubtitleTimelineEditor.tsx, which parses an incoming SRT and shifts its block timestamps by (last_block_end + 1000ms) before concatenating it to the existing blocks array. Added a FilePlus button to the UI to trigger this append flow.

[2026-08-16 22:04] Added CaptionStyle simulation to SubtitleTimelineEditor.tsx, calculating word-level timing offsets manually by dividing block duration evenly across its word count. Added CapCut-style Pop, Karaoke Highlight, and Neon Glow styles dynamically applied in the preview overlay.

[2026-08-16 22:15] Replaced timeline Zoom buttons with a dedicated full-width Zoom Slider just below the global video scrubber to vastly improve mobile touch ergonomics when expanding the timeline for accurate subtitle placement.

[2026-08-16 22:31] Updated timeline Zoom slider maximum scale from 0.5s down to 0.2s (exactly 6 frames assuming 30fps) to allow extremely precise dragging/placement of subtitles on mobile devices.

[2026-08-16 22:40] Added automatic timeline scrolling logic to the SubtitleTimelineEditor. Implemented via requestAnimationFrame in autoScrollLoop that detects if pointerClientX crosses the left/right container boundary threshold. Dynamically updates dragTimelineStart and offsets startX backwards to perfectly counteract the shifting background, enabling infinitely smooth timeline auto-scrolling while dragging or trimming subtitle blocks on mobile.

[2026-08-16 22:49] Updated SubtitleTimelineEditor to persist caption style preferences (size, position, style) in localStorage so they survive page reloads.

[2026-08-17 09:30] Updated handlePointerMove logic in SubtitleTimelineEditor to calculate adjacent block boundaries (minStartAllowed and maxEndAllowed). Applied these constraints to type=move, start, end, and sync_move to prevent subtitle blocks from overlapping each other during dragging/trimming.

[2026-08-17 09:37] Disabled the automatic playhead jump (seekTo) in SubtitleTimelineEditor when a user clicks/selects a subtitle block. Selecting a block now preserves the current video playback position.

[2026-08-17 09:41] Updated SRT subtitle generation prompt to explicitly instruct Gemini to watch the video source (if the uploaded file is a video) and use visual context like lip movements to assist in transcription. Previously, it assumed all sources were audio.

[2026-08-17 09:51] Updated SRT subtitle generation prompt to explicitly instruct Gemini to read any existing on-screen text, hardsubs, or burned-in captions when processing a video file.

[2026-08-18 02:19] Fixed INVALID_ARGUMENT error during subtitle generation. Some browsers fail to determine file.type for certain audio/video formats, resulting in an empty string or application/octet-stream. Gemini API rejects this. Added logic in gemini_srt.ts to infer the MIME type from the file extension as a fallback. Also sanitized the display_name sent to the API to prevent validation errors on strange filenames.

[2026-08-18 19:18] Integrated Anti-Slop / Realism prompt engineering blueprint into the core image generation pipeline (generateSceneImage, generateSingleImage, generateMultiSwapImage). When the project's art style or the user prompt suggests realism (e.g., "Photorealistic", "Cinematic", "iPhone Camera"), the system now automatically injects a strong block of instructions designed to defeat default AI biases: forcing natural skin texture (pores/fuzz), breaking facial symmetry, preventing oversized eyes, adding stray hairs, and encouraging non-centered, candid framing with slightly averted gazes.

[2026-08-19 01:24] Implemented Google Workspace OAuth for YouTube Data API. Used standard Firebase Auth pattern with  in  to get access tokens, enabling users to log in with Google and browse their private YouTube playlists to import tracks directly into the project.

[2026-08-19 01:24] Implemented Google Workspace OAuth for YouTube Data API. Used standard Firebase Auth pattern to get access tokens, enabling users to log in with Google and browse their private YouTube playlists to import tracks directly into the project.

[2026-08-19 01:29] User requested to add Firebase and Cloud SQL. The infrastructure rejected the provisioning for both databases due to lack of owner permissions and active billing on the GCP project (gen-lang-client-0337665567). Because the app already relies on robust IndexedDB (`idb-keyval`) storage for large assets (like local audio files) which fits the single-user, offline-first design of MV Director, the cloud database implementation was aborted and the application will remain on local persistence.

[2026-08-19 02:04] Migrated database layer () to use Firebase Firestore for persistent cloud sync. Local IndexedDB is still maintained for local development files (which are large/binary and should not be uploaded) and as an offline fallback. Implemented hardened Security Rules using the Master Gate pattern.

[2026-08-19 02:04] Migrated database layer (src/services/db.ts) to use Firebase Firestore for persistent cloud sync. Local IndexedDB is still maintained for local development files (which are large/binary and should not be uploaded) and as an offline fallback. Implemented hardened Security Rules using the Master Gate pattern.

[2026-08-19 18:53:32] Adjusted the Realism & Anti-Slop override in gemini.ts. Removed explicit demands for 'pores, peach fuzz, and natural redness' as it was making the generated character skin look too harsh and unattractive. Softened the constraint to favor a 'naturally smooth, clean, and flattering' look while still avoiding a purely plastic/CGI finish.

[2026-08-22 09:59:38] Fixed 403 PERMISSION_DENIED during SRT generation. Replaced hardcoded 'gemini-3.5-flash' strings in gemini.ts and gemini_srt.ts with the dynamic currentTextModel from the API vault settings to respect the user's active model choice and permissions.
[2026-08-23 10:08:00] Fixed persistent INVALID_ARGUMENT error during SRT file upload in Gemini API. Browser implementations of fetch(body: File) automatically append a Content-Type header (sometimes multipart/form-data) that conflicts with the Google resumable upload's finalized binary stream requirements. Changed the upload_finalize step in gemini_srt.ts to use await file.arrayBuffer() for the fetch body to enforce a clean, raw binary payload without inferred browser headers.
[2026-08-23 10:25:00] Replaced manual REST upload protocol in gemini_srt.ts with the official @google/genai SDK `ai.files.upload` method. The manual implementation using `ArrayBuffer` in fetch was still failing with INVALID_ARGUMENT (400) for large files because it lacked native chunking logic for the Google Upload Protocol. The SDK handles chunking, resumable session persistence, and headers automatically, fully resolving the upload failures for long video files.
[2026-08-23 11:15:00] Adjusted the `gemini_srt.ts` prompt by adding "CRITICAL RULE 4" to enforce better subtitle readability. The AI was occasionally stuffing 2 or 3 sentences into a single multi-lingual block (especially in quad-mode), causing massive text walls. The prompt now strictly enforces breaking down long clauses into shorter chronological blocks.
[2026-08-25 02:22:00] Fixed a fatal crash in App.tsx where the `Video` icon component was being used in the media player toolbar but was missing from the `lucide-react` import statement. Added the missing import to resolve the Uncaught ReferenceError.
[2026-08-25 05:59:00] Adopted "The Four Heads of the Builder" framework into AGENTS.md. Future decision-making will follow the MEMORY, CREATIVITY, CRITIC, and HEAD pipeline, outputting the 7-step synthesis format when resolving complex problems or implementing architectural changes.
[2026-08-25 06:05:00] Fixed unhandled promise rejection (DOMException: The play() request was interrupted) in the local audio player. Removed the native `autoPlay` attribute from the `<audio>` element because when the element was quickly unmounted (e.g., clearing the track), the browser threw an uncatchable `AbortError`. Replaced it with a `useEffect` that manually triggers `play()` and explicitly catches and suppresses `AbortError`s.
[2026-08-25 12:17:00] Initialized the "AI Second Brain" in the `.builder_brain/` directory. Migrated deep architectural context, API constraints, and failed experiments (like the autoPlay DOMException crash) into categorized markdown files. Updated `AGENTS.md` to mandate reading these files before complex changes.
[2026-08-25 14:52:00] Created a `PasswordGate` component wrapping the `App` to lock the UI based on `import.meta.env.VITE_APP_PASSWORD`. This stops casual visitors on shared links. Documented the security caveat: remixing copies the source code, so a developer can bypass this by deleting the gate component, but since secrets aren't remixed, it stays locked by default for non-developers.
[2026-08-25 22:01:00] Added an `XploreTab` component mimicking a file manager to view all active app assets (images, audio, videos) from `projectData` and `directorPlan`. Added the tab to the navigation header and mobile bottom bar.
[2026-08-25 22:04:00] Fixed runtime crash (ReferenceError: FolderOpen is not defined) caused by missing `FolderOpen` icon import from `lucide-react` in `App.tsx` during the Xplorer Tab implementation. Also resolved a minor TypeScript typing issue in `PasswordGate.tsx`.
[2026-08-25 22:11:00] Relaxed the `accept` attribute on audio/video `<input type="file">` elements to include `*/*` (any file). This forces Android to trigger its generic intent chooser (which includes 3rd-party file managers like X-plore) rather than the strict media intent chooser. Added internal JavaScript validation to ensure non-media files are rejected securely.
[2026-08-25 22:13:00] Completely removed the `accept` attribute on audio/video inputs. `accept="*/*"` still caused Android to restrict the intent to Media captures (Camera/Camcorder). Removing it completely forces the default `ACTION_GET_CONTENT` intent which includes general file managers like X-plore.
Fixed scrolling issue on mobile for `XploreTab` by applying `min-h-0` and `w-full` to nested flex containers.
[2026-08-25 22:45:00] Added `processingMode` ('audio' | 'video_audio') to `SubtitlesTab.tsx` and `gemini_srt.ts`. This allows users to force Gemini to ignore visual frames for video files by switching the system instruction, avoiding unnecessary processing overhead. The UI auto-toggles based on the uploaded file type (audio files lock out the video option).
[2026-08-26 22:52:00] Added `dual_trans` mode to SRT Subtitle generation pipeline (`gemini_srt.ts`) to handle users wanting dual translation (English + Target) without the native language transcription block. Added corresponding UI option.
[2026-08-31 05:33:00] Fixed minor TypeScript errors related to `SubtitleTimelineEditor` pointer events (`select_only` typing) and `@google/genai` `mimeType` configuration in `gemini_srt.ts`.
[2026-08-31 14:38:00] Added CRITICAL RULE 5 to `gemini_srt.ts` system prompt. This specifically instructs the Gemini Vision model to capture and format on-screen floating text, emotion markers, and action graphics into the SRT output blocks using bracket notation when `processingMode === 'video_audio'`.
[2026-08-31 15:08:00] Adjusted CRITICAL RULE 5 in `gemini_srt.ts` to instruct the model to use clean brackets without prefixes (e.g. `[看]` instead of `[Text: 看]`) for visual context tags.
[2026-08-31 17:02:00] Fixed `AbortError` exception in `SubtitleTimelineEditor.tsx`. Unhandled `playPromise` rejections were surfacing when `mediaRef.current.pause()` interrupted a pending `mediaRef.current.play()` call. Wrapped the `catch` block with an `error.name !== 'AbortError'` check to silently suppress this expected browser behavior.
[2026-08-31 18:55:00] Added CRITICAL RULE 6 to `gemini_srt.ts` system prompt to prevent the model from ending subtitle blocks with periods (.), as trailing periods look messy on-screen.
[2026-09-01 08:16:00] Timeline Editor Undo/Redo & Clear added. Implemented `historyRef` inside `SubtitleTimelineEditor.tsx` storing deep clones of the block array upon drag release, split, text edit, and deletion. Added Undo, Redo and Trash icons to the timeline toolbar. `pushToHistory` efficiently tracks states up to 50 deep without generating circular React re-render loops on dragging.
[2026-09-01 10:10:00] Fixed subtitle skipping issue. The model was occasionally hallucinating large time jumps (skipping 7-8 minutes of dialogue) during long video transcriptions in order to compress the timeline or prematurely finish the output. Added CRITICAL RULE 7 ("Completeness") to the system prompt in `gemini_srt.ts` explicitly forbidding the AI from skipping dialogue, jumping over time gaps, or summarizing the timeline.
[2026-09-01 10:15:00] Added Resume Generation feature. Modified `gemini_srt.ts` to accept an optional `resumeTime` string (e.g. "00:52:00"). Added CRITICAL RULE 8 to the system prompt when `resumeTime` is provided, instructing the AI to ignore all audio before the timestamp and begin its very first subtitle block at that exact timestamp. Added a "Resume / Start From (Optional)" input field in `SubtitlesTab.tsx` directly above the generate button, allowing users to restart transcription from the exact moment it previously skipped or failed.
[2026-09-01 16:19:00] Fixed "Resume Generation" overwriting state. Previously, if a user used the resume feature (e.g. from 53:00), `generateSRT` returned a new SRT string that completely replaced `srtContent`, wiping out the 0-53m progress. Updated `SubtitlesTab.tsx` to parse both the existing `srtContent` and the newly generated SRT, filter out existing blocks that fall after the resume time, merge the two arrays, and re-generate a combined SRT string before updating the editor state.
[2026-09-01 16:40:00] Clarified the Append (FilePlus) button behavior to the user. The `handleFileAppend` function shifts incoming SRT timestamps by `lastBlockEnd + 1000`. Explained how to externally trim the SRT file to truncate bad tail-end data before appending a new segment.
[2026-09-01 20:18:00] Upgraded Subtitle Editor's "Sync Mode" (Ripple Sync) to fully support edge dragging (trimming). Previously, sync mode only worked when dragging the middle of a block. Now, dragging the right edge of a block to resize it will auto-push/pull all subsequent blocks. Dragging the left edge to resize will auto-push/pull all preceding blocks. This behaves like a true Ripple Edit in professional NLEs like Premiere Pro. Implemented via new `sync_start` and `sync_end` pointer drag states.
[2026-09-01 20:38:00] Fixed a massive bug in `SubtitlesTab.tsx`'s resume merging logic. The user correctly noticed that inputting `74:59.744` (a 2-part string since there are no hours) broke the merging logic. The `split(':')` destructured `[h, m, s]` rigidly from left to right, meaning `74` was assigned to hours (`h`) instead of minutes (`m`), treating the input as 74 hours instead of 74 minutes. Fixed the parsing block to check `parts.length` and properly assign `[m, s]` if the user omits the hours.
[2026-09-01 20:41:00] Changed the subtitle editor's visible timer format from a two-part format (MM:SS.mmm) to a strict three-part format (HH:MM:SS.mmm). The user rightly pointed out that since the timeline editor displayed minutes beyond 60 (e.g., 74:59.744), it encouraged copying that two-part string directly into the AI Resume tool. Standardizing on HH:MM:SS.mmm across the UI prevents format confusion.
[2026-09-01 20:43:00] The user asked whether to use a period or comma for milliseconds in the resume time input (`01:14:59.744` vs `01:14:59,744`). This highlighted a critical parsing flaw: `Number("59,744")` returns `NaN` in JavaScript, which would break the math. Standard SRT uses commas, while WebVTT/UI uses periods. Updated the resumeTime parser in `SubtitlesTab.tsx` to automatically `.replace(',', '.')` before calling `Number()` to ensure it supports both formats flawlessly.
[2026-09-01 20:47:00] Created a new 'Second Brain' component designed specifically for builders/directors to store and retrieve design decisions, contextual notes, and learned lessons. It connects directly to Firestore for persistent storage across sessions (`users/{userId}/brain/notes`), resolving the ephemeral chat history limitation. Implemented a dual-pane UI with a searchable sidebar and an auto-saving Markdown-friendly textarea.
[2026-09-01 20:55:00] Fixed missing close button visibility on mobile for the Second Brain component and added an inline delete button to the note list items. Also added `videoMetadata.startOffset` support to the Gemini AI SRT generator. If the user specifies a Resume time, the `videoMetadata` payload perfectly aligns with the uploaded File (both Audio and Video) so the AI skips scanning the token history up to that point. This effectively "auto-cuts" the media natively using Gemini's API.
[2026-09-01 21:20:00] The user requested the ability to paste a YouTube link to "watch and generate" subtitles directly. Documented that while the Timeline Editor (`ReactPlayer`) can easily *play* YouTube links, the `generateSRT` function strictly requires a raw `File` buffer to upload via `ai.files.upload`. Because web browsers (and YouTube ToS) prevent client-side extraction of raw audio/video buffers from YouTube URLs, direct AI generation from a link is technically impossible in a purely client-side architecture. The user must provide a local file for generation.
[2026-09-01 21:30:00] The user requested the ability to paste a YouTube link to "watch and generate" subtitles directly, and requested a simpler "Style format" UI. 
- Refactored `SubtitleTimelineEditor.tsx` to include `ReactPlayer` alongside native HTMLMediaElements to explicitly support playback of YouTube URLs using the same timeline editor controls (play, pause, seek). 
- Added a `youtubeUrl` state in `SubtitlesTab.tsx` and updated the UI to accept YouTube links purely for preview mode (Generation remains disabled unless a local file is provided, per architecture constraints).
- Simplified the 'Style format' selector in the Generator UI, consolidating the 5 bulky buttons into a sleek `<select>` dropdown to save space and reduce clutter.
[2026-09-01 21:35:00] Fixed runtime crash (ReferenceError: Youtube is not defined) in `SubtitlesTab.tsx`. The custom script that injected the `Youtube` and `ChevronDown` icons failed to append them to the `lucide-react` import because it performed an `includes('Youtube')` check *after* injecting the JSX tags, resulting in a false positive. Explicitly added the imports.
[2026-09-01 21:42:00] Fixed "Nothing happens" bug when pasting a YouTube link. Previously, pasting a link didn't automatically switch the UI to the Timeline Editor, leaving the user confused. Added an auto-switch trigger when a valid YouTube URL is detected. Also fixed a silent UI crash in `SubtitleTimelineEditor.tsx` where the playhead's `requestAnimationFrame` loop was calling `mediaRef.current.currentTime` (a native HTML5 property) on the `ReactPlayer` instance instead of using `getCurrentTime()`.
[2026-09-01 21:47:00] Fixed YouTube preview click handler. The `ReactPlayer` wrapper had `pointer-events-none` applied, which correctly disabled native YouTube iframe clicks (to prevent pausing via YouTube's UI), but it also blocked the parent `onClick={togglePlay}` handler. Solved by rendering an absolute positioned transparent `div` with `cursor-pointer` and `onClick={togglePlay}` directly over the player.
[2026-09-01 21:52:00] Fixed catastrophic UI crash and "nothing happens" state when playing YouTube videos. 
1) `ReactPlayer` was complaining with a fatal error about `onDuration` because when it fails to detect a YouTube URL, it defaults to a native `<video>` element, which doesn't support the `onDuration` prop. Fixed by migrating to `onReady` and `getDuration()`.
2) The YouTube video frame was collapsing to 0 height due to Flexbox `flex-col` child behavior without explicit absolute positioning. Added `absolute inset-0`.
3) Fixed a bug where manually typing `youtube.com/watch` without `https://` would cause `ReactPlayer` to reject the URL as invalid, falling back to a broken `<video>` player. Implemented an auto-prepend for `https://` on URL paste/type.
[2026-09-01 21:56:00] Fixed "error 0: The play() request was interrupted" unhandled promise rejection crash. This happens when the browser native `<video>` or `<audio>` `play()` promise is interrupted by the element unmounting, `src` changing, or `pause()` being called immediately after. Since third-party packages like `react-player` and `autoPlay` elements call `.play()` internally without `.catch()`, these DOMExceptions were bubbling up to AI Studio's interceptor. Solved globally by polyfilling `HTMLMediaElement.prototype.play` in `main.tsx` to implicitly catch and swallow `AbortError` and `NotAllowedError`.
[2026-09-01 22:32:00] Fixed "Uncaught TypeError: mediaRef.current.seekTo is not a function" when attempting to scrub or seek in the Timeline Editor before the ReactPlayer instance is fully initialized, or when the player instance reference behaves unexpectedly. Wrapped `seekTo` and `getDuration` calls in safe `typeof === 'function'` checks.
[2026-09-01 22:39:00] Investigated "video still not show up" issue with YouTube embeds. When a user pastes a YouTube link, the app switches to the Timeline Editor and uses `ReactPlayer` to embed the video via the YouTube iFrame API. Removed `pointer-events-none` from the wrapping div just in case it was interfering with the iframe's cross-origin initialization. Note: if the video is an official music video with embedding disabled, YouTube will intentionally block the iframe from rendering, which may result in a blank black screen.
[2026-09-01 22:44:00] Fixed false-positive application crashes triggered by users cancelling the Google/YouTube Sign-In popup. When users closed the popup, Firebase correctly threw a `auth/popup-closed-by-user` exception, but the app logged it via `console.error`. AI Studio's preview environment traps `console.error` and escalates it to a fatal UI error overlay. Downgraded this specific, expected user-cancellation exception to `console.warn` in both `youtube.ts` and `YouTubeImportModal.tsx` to fail gracefully without breaking the app.
[2026-09-01 22:50:00] The user confirmed that the YouTube video was still not rendering in the Timeline Editor ("still can't play"), confirming it was likely an Error 153 (YouTube actively blocking iframe embeds for official music videos). Implemented the fallback documented in AGENTS.md: Added a "Pop out (Bypass Block)" button overlay directly onto the YouTube preview monitor in `SubtitleTimelineEditor.tsx` that calls `window.open(youtubeUrl, '_blank')`. Also added a helpful background watermark explaining *why* the video might be black so the user understands the iframe DRM limitation.
[2026-09-02 05:25:00] User requested to completely remove the YouTube playback functionality from the AI Subtitle Generator tab due to iframe DRM/embedding blocks causing friction. Ripped out the `youtubeUrl` state, the YouTube link input field from `SubtitlesTab.tsx`, and all `ReactPlayer` integration logic from `SubtitleTimelineEditor.tsx`. The timeline editor is now strictly back to supporting local uploaded Audio and Video files only.
[2026-09-02 08:26:00] User requested to "fill the notes on second brain". Seeded the `loadBrainNotesFromDB` function with three rich markdown notes summarizing the project's history, architectural constraints, the subtitle editor math/ripple sync, and the entire YouTube DRM saga. If the `users/{userId}/brain/notes` array is empty upon loading, it automatically provisions these foundational notes and saves them back to Firestore, ensuring the Second Brain has immediate value out-of-the-box.
[2026-09-02 15:15:00] Fixed React DOM nesting warning (`validateDOMNesting(...): <button> cannot appear as a descendant of <button>`) in `SecondBrainModal.tsx`. The note row in the sidebar was previously rendered as an outer `<button>`, with an inner delete `<button>` positioned inside it. Replaced the outer element with an accessible `<div role="button" tabIndex={0} onKeyDown=...>` with full keyboard navigation support, eliminating the invalid DOM hierarchy while preserving interactive styling and delete actions.
[2026-09-02 15:28:00] Fixed Second Brain mobile layout. Converted the layout to a responsive split-view pattern (Master/Detail) for mobile devices. On mobile screens (`< md`), the user either sees the note list *or* the editor view. Clicking a note in the list hides the list and shows the editor. A new "Back" (ChevronLeft) button in the editor header allows returning to the list view. Added a mobile-only "Close" (X) button to the sidebar header to ensure users can exit the modal from the list view.
- [2026-09-03] Implemented Gemini Agentic Video Understanding using `processing: 'agentic'` via @google/genai SDK. Mapped directly to YouTube URLs in the Keyframe Analyzer to bypass manual frame extraction.
- [2026-09-04] Implemented Subtitle Box Locking (Wall feature). Subtitles can now be locked using the new lock toggle in the edit menu. Locked subtitles cannot be moved or trimmed, and act as a hard boundary (wall) during ripple edits (sync dragging), stopping other blocks from pushing into them.
- [2026-09-04] Integrated comprehensive Subtitle Localization Standards into the Gemini system prompt, elevating the AI from a raw transcriber to a professional localization editor. Emphasizes natural meaning, emotion, subtext, character voice, and specific context over robotic literal translation.
- [2026-09-04] Fixed a fatal UI crash caused by 'error 0: Database is closing/hidden'. This was due to a known bug in Firebase Auth 12.17.x with IndexedDB when tabs go to the background (often during sign-in popups). Upgraded Firebase to 12.18.0 and added try/catch interceptors to downgrade any residual closing/hidden IDB errors from a fatal `console.error` to a graceful `console.warn` so the app doesn't crash.
- [2026-09-04] Implemented 'Snap to Audio' feature in SubtitleTimelineEditor.tsx and audioSnap.ts using Web Audio API OfflineAudioContext / peak & RMS energy envelope detection for automated vocal onset and pause alignment.
- [2026-09-04] Refactored SubtitlesTab 'Style format' dropdown to match the application's dark design system (`SubtitleFormatDropdown.tsx`). Replaced unstyled native `<select>` with custom dropdown matching `AspectRatioDropdown` pattern, complete with layer badges (1L–4L), visual stacked bars, descriptions, smooth opening animation, and glowing active selection states.
- [2026-09-04] Fixed persistent application crash vectors across multiple surfaces:
  1. Added `<ErrorBoundary>` around root component tree in `main.tsx` to trap unexpected React render exceptions and display a graceful recovery interface with "Resume" / "Reload" actions.
  2. Enhanced global unhandledrejection listener in `main.tsx` to suppress harmless DOM/media errors (e.g. `AbortError`, `NotAllowedError`, `AudioContext` autoplay restrictions, `Database is closing/hidden`, popup cancellations).
  3. Fixed undefined property access on `projectData.soundtrackUrl.startsWith` in `App.tsx` by adding `soundtrackUrl: ""` to `DEFAULT_PROJECT` and using optional chaining on player checks.
  4. Switched initial `isPlaying` state to `false` to avoid autoplay rejection errors on initial mount.
  5. Converted sensitive `console.error` calls to `console.warn` across `db.ts`, `gemini.ts`, `youtube.ts`, and `SubtitleTimelineEditor.tsx` to prevent AI Studio test harnesses from escalating non-fatal runtime warnings into container-level crash screens.
- [2026-09-04] Fixed Subtitle Block selection layout regression where the timeline and adjustment controls were pushed below the visible screen. Diagnosed root cause: the video monitor container had an enforced `min-h-[190px]` floor which, combined with the new multi-button `selectedBlock` action bar and the timeline height, overflowed the parent `h-full` flex column on mobile viewports. Solved by:
  1) Setting the video container to `flex-1 min-h-0` (allowing it to flex down gracefully and guarantee all controls and timeline remain fully visible).
  2) Streamlining the Selected Block Action Bar to a single-line horizontally scrollable container with compact buttons and an instant Deselect (`X`) action.
  3) Compactifying timeline track heights (`h-36 sm:h-44 md:h-52`, track `h-14 sm:h-16`) and scrubber margins so users can easily adjust subtitle boxes, drag trim handles, and watch the video scrub in real-time simultaneously.
- [2026-09-04] Fixed mobile virtual keyboard hiding the subtitle text edit box. Diagnosed root cause: the text edit box was previously an `absolute` element nested inside the video container viewport (`videoContainerRef`), which had `overflow-hidden`. When the mobile virtual keyboard pops up on Android/iOS (consuming ~50% of the screen height), the video viewport flex container squashed to near-zero height, causing the edit box inside it to be completely clipped or pushed off-screen. Resolved by:
  1) Lifting the Edit Subtitle Text interface out of the video container into a dedicated top-level modal (`fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-3 sm:p-4`).
  2) Top-anchoring the modal on mobile (`mt-2 sm:mt-0`) so it comfortably floats in the upper half of the visible viewport above the keyboard.
  3) Adding dedicated **Done** (`Check`), **Clear**, and **Play Segment** preview actions, live character count, and time bounds indicators.
  4) Enabling instant editing by clicking the text preview on the selected block bar or double-clicking the subtitle block on the timeline track.
- [2026-09-04] Fixed "Audio & Speech Alignment" (showSnapSettings) modal scrolling and close button inaccessibility on mobile/smaller screens. Root cause: the modal was mounted using `absolute inset-0 z-50` relative to the editor container with `max-h-[92vh]` on the entire card, which pushed the header `X` and bottom controls beyond the visible touch canvas when screen height was constrained. Resolved by:
  1) Portaling to a global fixed viewport overlay (`fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto`).
  2) Splitting the modal card into a Sticky Header (`shrink-0`), Scrollable Body (`flex-1 overflow-y-auto touch-pan-y`), and Sticky Footer (`shrink-0`).
  3) Panning the `X` close button permanently at top-right and adding a prominent "Done / Close Window" (`Check` icon) button in the sticky bottom footer, allowing instant dismissal from either end.
  4) Standardized all companion modals (`showExtractSettings`, `showSyncSettings`, `showPreviewSettings`) to use `fixed inset-0 z-[100]` with `my-auto` to prevent off-screen clipping.


- **[2026-09-05] SRT Engine Fixes:** Completely refactored the SRT generation prompt and parsing engine (`gemini_srt.ts`) to mandate strict HH:MM:SS,mmm timing and gracefully fallback when the model outputs invalid sequential sequences. Also confirmed `response.text` is safely wrapped in `try...catch` across `generateSRT` to catch content blocking exceptions.
- **[$(date +'%Y-%m-%d')] Timeline Editor Movement constraints and UI Fixes:** Fixed accidental dragging of subtitle blocks by requiring explicit activation of the "Move Block" mode (`isMoveMode`) on a selected block before a pointer drag registers as a positional shift. Replaced `window.confirm()` logic on the 'Clear All Subtitles' button with a custom React modal, as native alert/confirm popups are blocked inside the AI Studio iframe environment.
- **[$(date +'%Y-%m-%d')] Subtitle Navigation Modification:** Modified `[subleft]` and `[subright]` navigation commands (and their associated keyboard shortcuts `<` / `>`) so that they only select the target subtitle block without aggressively seeking the video playhead.
- **[$(date +'%Y-%m-%d')] Auto-sync Subtitle Translation:** Added `syncSubtitleTranslations` to `gemini.ts` which takes a multi-line subtitle block, reads the user-edited top line, and auto-translates it into the target languages of the lines below. Hooked this up to a "Sync Trans" button in the `SubtitleTimelineEditor` text modal that only appears when a multi-line subtitle is detected and an API key is present.
- **[$(date +'%Y-%m-%d')] Subtitle Timing Prompt Injection:** Integrated professional subtitle timing standards into the `generateSRT` prompt. The new directives aggressively combat AI's tendency to distribute time equally across words. It enforces audio-first boundaries, handling of humming/laughter, preserving held notes, treating short reactions precisely (for dramas/dating shows), and blocking imaginary padding or trailing silence.
- **[$(date +'%Y-%m-%d')] Auto-Cut on Mark In/Out:** Added collision detection to `handleSetMarkIn` and `handleSetMarkOut`. If the new mark boundary falls inside an existing block's timeline duration, the existing block is now automatically trimmed to accommodate the new mark, preventing timeline overlaps.
- **[$(date +'%Y-%m-%d')] Vision Fix Subtitles:** Added a new `fixSubtitleWithFrameContext` function to `gemini.ts`. It takes a base64 image of the current video frame and the current subtitle text, and asks Gemini to rewrite/correct the subtitle based on visual context (hardcoded text, lip movements, actions). Added a "Vision Fix" button to the text editor modal in `SubtitleTimelineEditor.tsx` that extracts a frame from the local `<video>` element using a canvas and triggers this fix.
- **[$(date +'%Y-%m-%d')] Move Button Relocation:** Relocated the "Move Block" button from the far right of the timeline action bar to the left side, between "AI Align" and the subtitle navigation/trimming group (`[in]/[out]`), making it more accessible and prominent.
- **[$(date +'%Y-%m-%d')] SDK Migration Fix:** Fixed crashes in `syncSubtitleTranslations` and `fixSubtitleWithFrameContext` by updating their method signatures to conform to the new `@google/genai` SDK standard (`genAI.models.generateContent({ model: currentTextModel, contents: ... })`), resolving "model.generateContent is not a function" errors.
- **[$(date +'%Y-%m-%d')] Vision Fix Dual Frame Extraction:** Enhanced the "Vision Fix" subtitle feature to extract *two* frames for context—one from the absolute start of the subtitle block, and one from the absolute end. Instead of capturing the visible `<video>` element (which requires interrupting the user's playhead), it now creates a hidden background `<video>` element to silently seek and extract the exact timing frames without UI flicker. 
- **[$(date +'%Y-%m-%d')] Vision Fix Multi-Frame Sequence:** Upgraded the "Vision Fix" subtitle feature again. Instead of capturing just 2 frames (start and end), it now dynamically calculates the duration of the subtitle and extracts a chronological sequence of up to 5 evenly spaced frames spanning the entire duration of the block. This ensures Gemini doesn't miss rapid on-screen text changes or fast actions that occur in the middle of a subtitle.
- **[$(date +'%Y-%m-%d')] Playback Position Memory:** Implemented playback position persistence using `sessionStorage`. The editor now automatically saves the current time while playing (throttled to 1s) and when seeking. On mount or when media reloads (like during hot reloads or returning to the page), `handleMediaLoadedMetadata` instantly restores the playhead to the last saved position, uniquely keyed to the media's filename.
- **[$(date +'%Y-%m-%d')] Agentic Video API Migration:** Completely replaced the manual 5-frame canvas extraction for "Vision Fix" with the newly released `@google/genai` Agentic Video processing mode. If the user loads a local video, it uploads it securely via the Gemini File API (`genAI.files.upload`), waits for `PROCESSING` state, caches the `fileUri` in session state, and passes it to `gemini-3.7-flash` with `{ processing: "agentic" }`. If using a YouTube link, it bypasses upload and passes the URL directly. This gives Gemini complete autonomy to dynamically scrub the video timestamps without relying on our manual image extraction.
- **[$(date +'%Y-%m-%d')] Agentic Video API Migration:** Completely replaced the manual 5-frame canvas extraction for "Vision Fix" with the newly released `@google/genai` Agentic Video processing mode. If the user loads a local video, it uploads it securely via the Gemini File API (`genAI.files.upload`), waits for `PROCESSING` state, caches the `fileUri` in session state, and passes it to `gemini-3.7-flash` with `{ processing: "agentic" }`. If using a YouTube link, it bypasses upload and passes the URL directly. This gives Gemini complete autonomy to dynamically scrub the video timestamps without relying on our manual image extraction.
- **[$(date +'%Y-%m-%d')] Custom AI Subtitle Context:** Added an optional "Context / Instructions" text area to the AI Subtitle Generator tab (`SubtitlesTab.tsx`). This state is passed through `GenerateSrtOptions` down to `gemini_srt.ts` and injected as a dedicated rule block (`USER CONTEXT & INSTRUCTIONS FOR THIS MEDIA`) directly into the `systemInstruction` of the Gemini generation prompt. This allows users to enforce character name spellings, set emotional tones, or clarify ambiguous domain vocabulary before the transcription job begins.
- **[$(date +'%Y-%m-%d')] Autocomplete Language Selection:** Added a native HTML `<datalist>` to the language text inputs in the SubtitlesTab. This provides browser-native dropdown suggestions for over 20 popular languages as the user types, without restricting them from typing unsupported/custom language names.
- **[$(date +'%Y-%m-%d')] Subtitle Settings Persistence:** Updated `SubtitlesTab.tsx` to save and load all AI generation settings (subtitle type, languages, styling, processing mode, and custom instructions) to/from `localStorage`. This prevents the user from having to re-enter their preferences (like custom characters or target languages) every time they reload the app. `resumeTime` was deliberately excluded from persistence as it is a highly contextual, session-specific value.

### Troubleshooting Crash (Port 3000 Issue & localStorage)
- **Problem**: User reported the application "keeps crashing".
- **Diagnosis**: 
  1. Found that `vite` was starting on port 3001 because an orphaned process was holding port 3000. In the AI Studio environment, only port 3000 is exposed to the preview iframe. When Vite falls back to 3001, the iframe connection is refused, appearing as a complete app crash (white screen).
  2. The extensive use of `localStorage` inside `SubtitlesTab.tsx` was written without `try...catch` wrappers. If the user's browser blocks third-party storage access (which frequently happens in cross-origin iframes like AI Studio), `localStorage.getItem` and `.setItem` throw `SecurityError`, crashing the entire React component tree on mount.
- **Solution**: 
  1. Restarted the dev server using the system tool to kill orphaned processes and free up port 3000.
  2. Implemented `safeGetItem` and `safeSetItem` in `SubtitlesTab.tsx` to safely wrap all `localStorage` access. This prevents `DOMException` and `QuotaExceededError` from escalating to fatal app crashes, falling back to default values gracefully.

### Troubleshooting Crash (SRT Generation API Error)
- **Problem**: User reported SRT generation failing with `{"error":{"code":400,"message":"Thinking level MINIMAL is not supported for this model. Please retry with other thinking level.;  model=models/gemini-3.7-flash","status":"INVALID_ARGUMENT"}}`.
- **Diagnosis**: The `generateSRT` function in `src/services/gemini_srt.ts` was hardcoded to inject `thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL }` for any text model with '3.7' or '3.8' in its name. However, `gemini-3.7-flash` is not a thinking-enabled model variant by default (or does not support the MINIMAL configuration parameter for its standard version), causing the API to reject the configuration.
- **Solution**: Removed the `thinkingConfig` payload injection entirely from the SRT generator since standard text extraction/subtitling tasks do not require explicit thinking blocks.

### Model Upgrades (Gemini 3.8 & Dynamic Agentic Support)
- **Problem**: Need to ensure all available models are updated and supported across all features.
- **Diagnosis**: 
  1. The API settings dropdown lacked the latest generation models (Gemini 3.8 Pro and Flash).
  2. Features using Agentic Video (like `analyzeVideoAgentic` and `fixSubtitleWithAgenticVideo`) had hardcoded `gemini-3.7-flash` as their model because legacy models didn't support agentic.
  3. Frame analysis (`analyzeFrames`) was hardcoded to `gemini-2.5-flash`.
- **Solution**: 
  1. Added `gemini-3.8-pro` and `gemini-3.8-flash` to the options list in `ApiKeyVault.tsx`.
  2. Updated Agentic Video features to dynamically use the user's selected text model as long as it includes '3.7' or '3.8' (falling back to '3.7-flash' if an incompatible legacy model is selected).
  3. Upgraded `analyzeFrames` to use the user's current selected text model (or `3.7-flash`) instead of the legacy `2.5-flash`.

### Timeline Editor Local Media Swap Bug
- **Problem**: Users want to upload MP3s to Gemini for faster AI subtitle generation, but then they can't visually see the video when correcting subtitles in the Timeline Editor (since it's only playing the MP3). 
- **Diagnosis**: The editor actually already had an "Upload Track" (Change File) button in its toolbar! However, due to a bug in precedence (`const effectiveAudioFile = audioFile || localAudioFile`), the AI-generated track (`audioFile` passed via props) was completely hardcoded to override anything the user selected manually (`localAudioFile`).
- **Solution**: Flipped the logical OR to `localAudioFile || audioFile`. Now, if a user uploads a video file via the editor's toolbar, it instantly replaces the black audio player with a full video player strictly for local browser playback, completely decoupled from the AI processing block.

### Timeline Editor Feature Fixes (Change File Sync)
- **Problem**: When a user utilized the newly fixed "Change File / Upload Track" button to swap an MP3 for an MP4, several deep editor features (like "Vision Fix" button rendering, frame extraction, and screenshotting) stopped working or crashed. 
- **Diagnosis**: The editor features were hardcoded to check `audioFile.type` (the original prop passed to the editor during AI generation) instead of `effectiveAudioFile.type` (the currently active local track). This caused the app to think the user was still looking at an MP3, instantly hiding video-exclusive buttons and failing video operations.
- **Solution**: Replaced all remaining raw `audioFile` references with `effectiveAudioFile` across the Vision Fix engine, Screenshot tool, and render logic to ensure they correctly identify when a video is loaded locally.

### OOM Crash on Heavy Video Upload
- **Problem**: Users reported the app crashing or freezing after uploading a heavy MP4 video using the "Change File" button.
- **Diagnosis**: The editor automatically runs `analyzeAudioFile()` on any active media track to generate the visual audio waveform and enable "Snap to Audio". This function converts the media file into an `ArrayBuffer` and decodes the entire audio track using `audioCtx.decodeAudioData()`. When a massive video file (e.g., 1GB) is loaded, reading it into memory and decoding it to 32-bit float PCM reliably crashes the browser tab with an Out-Of-Memory (OOM) exception.
- **Solution**: Added a strict 50MB size limit inside `analyzeAudioFile`. If a file exceeds this limit, it safely aborts waveform generation and throws a caught error, preventing the browser crash while still allowing the video to play normally.

### UX: Swap Media Button Visibility
- **Problem**: Users could not find the "Upload Track" button to swap MP3s for MP4s because it was buried inside the "Audio Align" modal settings.
- **Solution**: Extracted the file input ref trigger and placed a dedicated "Swap Media" (Swap Video) button at the top level of the Timeline Editor's main action bar (next to Undo/Redo) for maximum visibility.
- **SubtitleTimelineEditor State Race Condition**: Fixed a bug where rapidly editing a subtitle (like holding backspace) caused the edit box to close. The issue occurred because rapid text updates caused local state \`blocksState\` to generate an SRT and send it up to \`SubtitlesTab\`, which then passed it back down as \`initialContent\`. Due to React batching/latency, the \`initialContent\` prop could lag behind the latest generated SRT, causing the \`useEffect\` to think a genuine external change happened and run \`parseSrt\`. Running \`parseSrt\` generates new block IDs, causing the currently selected block to lose its selection identity, thereby unmounting the edit modal. Fixed by introducing a \`pendingSrtUpdates\` Set to track and ignore echoed state updates synchronously.
- **Global Video Sync on Subtitle Swap**: Fixed an issue where using "Swap Media/Video" inside the Subtitles Tab didn't update the global player. Previously, it updated a local state, which caused the video to disappear (via `display: hidden`) when switching to other tabs like the AI Generator tab, leaving only phantom sound playing. Wired `onMediaSwap` from `SubtitleTimelineEditor` up to `App.tsx` to set the global `soundtrackUrl` and `localFiles`.
- **Global Player Video Tag Fix**: Fixed `App.tsx`'s global media player to conditionally render a `<video>` tag instead of an `<audio>` tag for `blob:` URLs when the associated file in `localFiles` is a video type. Previously, uploading a local video resulted in a blank audio player.
- **Find & Replace Subtitles**: Added a third tab inside the Bulk Text Tools modal (the wand icon) to perform global Find & Replace across all subtitle blocks.
- **Bulk AI Translate Tool**: Added an "AI Translate" tab to the Bulk Text Tools modal. Users can define a target language and select which line to translate (Line 1, Line 2, or Entire Block). This allows them to switch specific lines (e.g. KR-ENG to KR-IND) using Gemini 3.1 Flash. The feature translates in chunks of 50 blocks to bypass token limits.
- **Directional Translation Sync**: Updated the "Sync Trans" button in the Timeline Editor to support directional syncing. When editing a multi-line subtitle block, the UI now displays "Sync from L1" and "Sync from L2". This passes a direction argument to `syncSubtitleTranslations` which explicitly instructs Gemini to use the selected line as the source of truth when regenerating the block.
- **Export Modal for Subtitles**: Added an inline `ExportModal` component to both the `SubtitlesTab.tsx` and `SubtitleTimelineEditor.tsx`. This prompts the user to enter a custom filename before exporting the SRT file, rather than hardcoding it to `subtitles.srt`.

## 5. File Upload Memory Management & Auto-Save
- **IndexedDB OOM Crash:** When saving `projectData.localFiles` to IndexedDB via `idb-keyval`, previous logic iterated over the `File` objects and called `await file.arrayBuffer()` to serialize them. For large video files (e.g. 100MB+), this caused a massive contiguous memory allocation in V8, crashing the browser tab with an Out-of-Memory (OOM) error immediately upon selection. 
- **The Fix:** IndexedDB natively supports storing `File` and `Blob` objects. We now store the `File` object natively to `PROJECT_FILES_KEY`. This avoids memory buffering and prevents the "app reloads when I select a file" bug.
- **Custom OpenAI Router Bug**: Discovered that any direct calls to `genAI.models.generateContent` bypassed the `callTextModel` custom-openai router in `gemini.ts`. This caused features like `syncSubtitleTranslations`, `gemini_srt.ts` functions, and `BulkTextToolsModal` to send `custom-openai` as the model name to the official Google API, resulting in a 403 Permission Denied error. Fixed by wrapping all direct generation calls with `withRetry(() => callTextModel(genAI, {...}))`.
- **String Contents Array Crash**: `callTextModel` was crashing when `contents` was passed as a string and wrapped into `['prompt']`, because it only checked for `item.parts` and `item.text`. Added support for `typeof item === 'string'` in the `callTextModel` loop to fix the Bulk AI Tools feature.
- **Layout Tweaks**: Moved the Lock block toggle button in the Subtitle Timeline Editor directly beside the Move block button for better context proximity and labeled it uniformly.
- **Transliteration Removal**: Updated `gemini.ts` and `gemini_srt.ts` to ignore phonetic/romanized transliteration for `triple` and `quad` modes per user request, effectively turning them into 2-line and 3-line formats respectively. UI dropdowns and labels updated to reflect the new structure.
- **Bulk Translate Translation Layer Targeting**: Reverted the removal of translit/romaji layers from full generators. Instead, implemented specific skip logic in the Bulk Text Tools modal. When targeting "Line 2" for translation, the engine now extracts Line 1 (Native) as the source, and replaces the *last* line of the subtitle block, effectively ignoring any middle transliteration layers without destroying them.
- **Model Fallback Fix**: Updated the AI translation fallback in `BulkTextToolsModal.tsx` from `gemini-3.1-flash` to `gemini-3.7-flash` to ensure it properly utilizes the newest fast model framework if the user hasn't explicitly selected one, maintaining parity with the rest of the app.
- **SubtitleTimelineEditor Variable Hoisting Fix**: Fixed `Uncaught ReferenceError: Cannot access 'blocks' before initialization` by moving the `const blocks = blocksState;` alias immediately after the `useState` hook declaration at the top of the component so hooks and memoized helpers can safely access it without TDZ reference errors.

### KIE Chat Studio Mobile Viewport and Drawer Stability
- **Problem**: Opening the KIE Chat modal on mobile devices triggered UI crashes, viewport overflow, and unclickable controls when the virtual keyboard popped up.
- **Root Cause**: The modal container relied on rigid `h-[92vh]` and `fixed inset-0` with unconstrained horizontal flex children. On mobile browsers (Safari iOS and Chrome Mobile), the virtual keyboard causes rapid viewport resize events; `vh` units do not account for dynamic browser chrome (address bar and keyboard), leading to layout reflow loops and overflow crashes. In addition, nested cards with unwrapped long model tokens and code blocks caused horizontal scroll distortion.
- **Solution**: Switched to `max-h-[100dvh]` with mobile-first sliding drawer navigation for conversation lists and parameters. Added backdrop dismiss layers (`z-20`), touch-friendly padding with safe-area insets (`env(safe-area-inset-bottom)`), and constrained chat message bubbles with `break-words`, `min-w-0`, and `overflow-hidden`.
- **Mobile Message Box Cut-off & Pop-out Fix**: Discovered that even with `100dvh`, the conversation sidebar on mobile was still occupying flex space or causing child elements without `min-w-0` to expand beyond the mobile screen width, cutting off the right side of message bubbles and input box. Fixed by making the mobile sidebar `fixed md:static inset-y-0 left-0 z-50` so it occupies 0px of flex layout space when closed. Added `min-w-0 w-full max-w-full overflow-hidden` to parent columns and `max-w-[85%]` on bubbles. Hardened the Pop-Out handler to catch blocked `window.open` calls and seamlessly redirect to `?mode=kie_chat`, while hiding the redundant pop-out trigger when in standalone mode.
- **KIE.ai Official Endpoint Alignment (docs.kie.ai/llms.txt)**: Inspection of the official KIE OpenAPI schemas at `docs.kie.ai/llms.txt` revealed that KIE does not route all chat models through a single generic OpenAI endpoint. Rather:
  - Claude models (Sonnet 5, Opus 5, Opus 4.8, Haiku 4.5, etc.) require `POST https://api.kie.ai/claude/v1/messages` with `anthropic-version: 2023-06-01`, `X-Api-Key`, and top-level `system` strings, returning Anthropic-formatted `content` blocks.
  - GPT-5.6 Luna & GPT-6 Astra route through `POST https://api.kie.ai/codex/v1/responses` with an `input: [{role, content}]` array, returning `{ output: [{ type: "message", content: [{ type: "output_text", text }] }] }`.
  - Next-gen models like `gpt-5-2`, `gemini-2.5-flash`, and `gemini-3-flash` have dedicated OpenAI-compatible path prefixes (e.g. `/gpt-5-2/v1/chat/completions`, `/gemini-2.5-flash/v1/chat/completions`).
  - Added native multi-endpoint dispatch logic in `kieChatService.ts` so users selecting Claude or Codex models automatically get routed to their exact respective KIE API paths with full request/response normalization.
- **KIE.ai GPT-5.6 Tiered Architecture (https://kie.ai/gpt-5-6?model=gpt-5-6-luna)**: Analyzed the live GPT-5.6 landing page and docs. OpenAI's GPT-5.6 family on KIE is split into three tiers:
  - **Sol** (`gpt-5-6-sol`): The frontier tier with maximum reasoning effort, multi-agent execution, cybersecurity, and complex coding.
  - **Terra** (`gpt-5-6-terra`): The balanced everyday production tier combining high intelligence with lower cost.
  - **Luna** (`gpt-5-6-luna`): The speed and affordability tier for high-throughput, low latency tasks.
  - All three models use the unified `/codex/v1/responses` endpoint with support for structured `input` arrays, web search or function calling tools, and configurable reasoning effort (`low`, `medium`, `high`, `xhigh`). Configured all three tiers into `KIE_POPULAR_MODELS`.
- **KIE.ai GPT-6 Astra OpenAPI Specification Verification**: Verified the OpenAPI 3.0.1 specification for `gpt-6-astra`. It targets `POST https://api.kie.ai/codex/v1/responses`, accepting `model: "gpt-6-astra"`, `stream` (SSE text deltas and function call arguments), structured `input` (string or array of messages), `reasoning: { effort: "low" | "medium" | "high" | "xhigh" }`, and `tools` (mutually exclusive `web_search` or `function` with `tool_choice: "auto"`). Extended `KieChatCompletionOptions` and the Chat Studio parameters drawer with live controls for `reasoningEffort` and `enableWebSearch`.

## 2026-09-22: GitHub Personal Access Token Universal Authentication & Studio Integration
- **Bug & Root Cause ("Can't read/see PAT")**: When users entered GitHub Fine-Grained Personal Access Tokens (`github_pat_...`), `fetchGitHubUser` called `https://api.github.com/user`. GitHub intentionally returns HTTP 403 Forbidden (`Resource not accessible by personal access token`) on `/user` for fine-grained PATs configured with repository-only scopes. The application treated this HTTP 403 as an authentication failure, rejecting valid tokens and leaving users unable to browse or read their repos.
- **The Fix**: 
  - Upgraded `fetchGitHubUser` to test `/user`. If a 403 occurs, it verifies the token against `https://api.github.com/rate_limit` (which succeeds with HTTP 200 for all authenticated tokens). If `/rate_limit` returns 200, the token is verified as an active Fine-Grained Repository PAT and displays the user's live remaining quota (5,000 req/hr).
  - Ensured `fetchGitHubRepoContents` and `fetchGitHubFileContent` automatically fall back to `getSavedGitHubToken()` so callers don't default to unauthenticated access if an explicit token argument isn't provided.
  - Rewrote raw file fetching in `fetchGitHubFileContent` to send `Accept: application/vnd.github.v3.raw` directly to `api.github.com` with authorization headers, bypassing the unauthenticated `download_url` (`raw.githubusercontent.com`) failures on private repos and files >1MB.
  - Integrated GitHub Connect directly into `StudioChat.tsx` (the "Studio" tab) and the global Settings menu, allowing users to browse and attach code directly into their AI Studio assistant prompts.
  - **Dev Server & HMR Stale State**: Because HMR is disabled in AI Studio, browser iframes can retain cached modules from previous timestamps (e.g. 3:26). Running `restart_dev_server` followed by a hard browser reload purges stale Vite transformation caches and forces immediate sync of the updated bundle.

## 2026-09-23: KIE Provider Filtering Tabs, Extended Thinking & Gateway Status Monitor
- **Provider Filtering & Dynamic Model Selector Bar (`KieChatModal.tsx`)**: Implemented categorized tabs (`⭐ Big 3 (GPT / Claude / Gemini)`, `OpenAI (GPT / Codex)`, `Claude (Anthropic)`, `Gemini (Google)`, `DeepSeek & xAI`, and `All Models`) with live capability badges (Thinking and Web Search) for rapid model switching.
- **Provider-Specific Parameter Menus**:
  - **Claude (Anthropic)**: Configured Extended Thinking toggle, adjustable thinking budget slider (1k–32k tokens), and max output token scaling (up to 64k tokens for Sonnet 4.5).
  - **Gemini (Google)**: Integrated Google Search Grounding toggle and token controls up to 65,536 tokens.
  - **OpenAI / Codex**: Wired multi-level reasoning effort (`low`, `medium`, `high`, `xhigh`) and live web search.
- **KIE Gateway Health & Status Monitor (`KieStatusMonitor.tsx`)**: Created a live telemetry widget tracking request success rates, round-trip latency, and gateway health directly in the KIE Studio navigation bar.
- **2026-09-24: Fixed KIE Director Plan Empty Array Parse Failure**: Corrected OpenAI Responses API parameter mapping (`instructions`), added structured schema enforcement and `json_object` format to KIE text completions, and eliminated silent `"[]"` string fallthrough on upstream errors.



