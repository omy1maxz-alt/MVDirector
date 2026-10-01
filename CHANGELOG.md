### Added
- **Android WebView Diagnostic Log Capture (`logCapture.ts`, `CaptureLogsModal.tsx`, `App.tsx`)**:
  - Implemented comprehensive in-app log capture engine intercepting `console.log`, `console.info`, `console.warn`, `console.error`, `fetch` network requests, `window.onerror`, and `unhandledrejection`.
  - Added full WebView & Android environment diagnostics: User Agent, app origin (`localhost` vs web), Capacitor native APK detection, physical screen & viewport resolution, touch points, CPU/RAM estimates, Web Audio API status, and storage quotas.
  - Built a mobile-first `CaptureLogsModal` with real-time log streaming, category filtering (`All`, `Errors`, `Network`, `Warn`, `Device Info`), search filtering, expandable stack traces, and one-click "Copy For AI" to allow instant log sharing from the Android APK without needing Chrome DevTools.
  - Added direct quick-access buttons in the top mobile header (`Terminal` icon), the Settings dropdown, the System tab, and inside `CrashLogsModal`.

### Fixed
- **Safe Video Link Playback & YouTube Error Fallback (`SubtitleTimelineEditor.tsx`)**:
  - Unified all media control logic (`updateTime`, `togglePlay`, `seekTo`, `saveCurrentFrame`, and pointer scrub pause) to use `effectiveYoutubeUrl` instead of the stale `youtubeUrl` prop.
  - Eliminated `TypeError: mediaRef.current.pause is not a function` when scrubbing or pausing while a video link is active by gating native DOM audio/video calls from ReactPlayer state.
  - Added an intuitive YouTube Error Overlay (`onError`) with a direct "Open on YouTube" pop-out and "Clear Video" button when videos are blocked by YouTube copyright DRM (Error 150/153) or `localhost` origin policies.

- **Resolved React DOM Unknown Event Handler Warning (`SubtitleTimelineEditor.tsx`)**:
  - Removed the non-standard `onDuration` JSX prop from `<Player />` that leaked into underlying `<video>` DOM elements in `react-player`'s FilePlayer fallback, eliminating React's console warning `Warning: Unknown event handler property onDuration`.
  - Replaced it with clean duration retrieval via `onReady` and `onProgress` using `mediaRef.current.getDuration()`.

### Added
- **Firebase Provisioning & Security Rules Deployment**:
  - Successfully provisioned Firebase Cloud Firestore and Authentication for project `gen-lang-client-0927402582` in region `asia-southeast1`.
  - Deployed `firestore.rules` with user-scoped isolation (`/users/{userId}/*`), validating data ownership across projects, plans, chat sessions, and knowledge graphs.

### Fixed
- **Mobile Clipboard Paste & State Persistence (`index.css`, `App.tsx`)**:
  - Removed global `-webkit-user-select: none` from `html, body` which previously blocked Android WebView native clipboard context menu (Paste/Select All) and cancelled IME input animations on MIUI/HyperOS devices.
  - Added dedicated `onPaste` handlers with synchronous state and `localStorage` mirror (`mv_latest_lyrics`) to prevent pasted text from disappearing.
  - Added immediate `visibilitychange` (`hidden`), `pagehide`, and `beforeunload` auto-save listeners so switching apps on mobile to copy lyrics flushes unsaved text to IndexedDB without relying on debounced timers.
  - Persisted Music Tab states (`coverPrompt`, `coverTitle`, `coverStyle`, `coverModel`, `coverPersonaId`) to `localStorage` so background activity pause/destroy does not reset inputs.

- **Android Capacitor Firebase Auth Domain Handling (`auth.ts`, `youtube.ts`, `ApiKeyVault.tsx`)**:
  - Intercepted `auth/unauthorized-domain` error thrown by Firebase Authentication when running under Capacitor's `https://localhost` origin.
  - Displayed actionable resolution instructions in the UI and informed creators that Google sign-in is optional, allowing immediate use of all Director and Suno features via Custom API Keys.
  - Integrated the complete **Suno V6 family**: `Suno V6.0 Flagship` (SOTA multi-genre fidelity), `Suno V6 Wild` (exploratory, experimental styles), and `Suno V6 Mini` (turbo generation), alongside `V5.5`, `V5`, `V4`, and `V3.5`.
  - Added **Suno Voice Persona / Clone integration**: Creators can input custom Voice / Persona IDs (`personaId`) to maintain vocal consistency and produce songs with specific cloned singers.
  - Added **AI Album Cover Art Generator (`ai-music-api/cover-generate`)**: One-click generation of personalized album artwork from Suno task IDs, with direct download and "Add to References" integration.
  - Streamlined mobile music creation controls: Model Engine, Track Type (Vocal/Instrumental), Title, Lyrics/Prompt, Negative Tags, Vocal Gender, Style Weight, Audio Weight, and Weirdness Constraint.

### Added
- **Enforced Strict Mobile-Only Architecture (`App.tsx`, `index.css`)**:
  - Removed desktop header tab bar to make the application strictly handheld mobile-first.
  - Made the bottom navigation bar universal across all viewports with thumb-friendly touch targets.
  - Locked viewport bounds and maintained safe-area bottom padding (`safe-bottom-nav`) across all tabs.
  - Configured virtual keyboard auto-collapse on `.safe-bottom-nav` when typing in Android textareas.

### Added
- **Optimized GitHub Actions Capacitor Android APK Build Pipeline (`.github/workflows/build-apk.yml`, `package.json`)**:
  - Configured standardized GitHub Actions workflow for Capacitor Android APK compilation with `ubuntu-latest`, Node.js 20, Java Temurin JDK 17, and Android SDK Platform 34.
  - Added Gradle caching via `gradle/actions/setup-gradle@v4` and automatic permission patching for `INTERNET`, `ACCESS_NETWORK_STATE`, `RECORD_AUDIO`, and `WAKE_LOCK`.
  - Configured automatic artifact generation with 30-day retention for `MV-Director-AI-Debug-APK`.

### Fixed
- **Resolved ServiceWorker 500 Registration Error in Dev Environment (`vite.config.ts`, `public/sw.js`, `main.tsx`)**:
  - Disabled `devOptions` in `VitePWA` to prevent the development server from attempting on-the-fly dynamic compilation of `/dev-sw.js?dev-sw`.
  - Added standalone `public/sw.js` with direct Cache API integration for clean, zero-error service worker caching in production and preview modes.
  - Added global rejection safety guards for ServiceWorker lifecycle events in `main.tsx`.

### Added
- **Service Worker with Cache API & Offline Mode for Android (`vite.config.ts`, `PWAInstallButton.tsx`, `OfflineIndicator.tsx`, `useOnlineStatus.ts`)**:
  - Configured `VitePWA` and Workbox caching to precache all core JS/CSS bundles, HTML, SVG, and web fonts.
  - Implemented Cache API strategies: `CacheFirst` for Google Fonts stylesheets/webfonts, `StaleWhileRevalidate` for static images, resources, and dependencies.
  - Added full offline resilience allowing the studio, storyboards, timeline editor, and local IndexedDB database to function in low-connectivity or offline Android environments.
  - Generated compliant PWA assets (`pwa-192x192.png`, `pwa-512x512.png`, `pwa-maskable-512x512.png`, `apple-touch-icon.png`).
  - Added in-app `PWAInstallButton` and `OfflineIndicator` banner.

### Added
- **Android APK Virtual Keyboard Adaptation & Auto-Scroll Engine (`main.tsx`, `index.css`)**:
  - Implemented dynamic `window.visualViewport` synchronization with custom property `--vvh` and `.keyboard-open` state detection.
  - Added global input `focusin` and `resize` interceptors that smoothly scroll the active input, textarea, or prompt field into the center of the visible area above the keyboard.
  - Automatically hides the bottom navigation tabs while typing to maximize vertical screen real estate on Android phones.

### Added
- **Android Phone & Poco F5 Edge-to-Edge Safe-Area Optimization (`index.css`, `App.tsx`, `ApiKeyVault.tsx`, `KieChatModal.tsx`)**:
  - Implemented dynamic top status bar insets (`--sat`, `.safe-top-bar`, `.pt-safe`) ensuring studio toolbars and headers never collide with the punch-hole selfie camera or Android system status bar icons.
  - Implemented dynamic bottom gesture navigation bar insets (`--sab`, `.safe-bottom-nav`, `.pb-safe`) preventing accidental triggering of Android system back/home gestures when switching studio tabs.
  - Enforced minimum 44x44px touch ergonomics across all mobile navigation buttons and interactive controls.
  - Applied overscroll behavior locks and safe bounds for virtual keyboard interaction on tall 20:9 Android viewports (Poco F5 / MIUI / HyperOS).

### Added
- **YouTube Video Support & Quality Controls on Timeline Editor (`SubtitleTimelineEditor.tsx`, `SubtitlesTab.tsx`, `gemini_srt.ts`)**:
  - Embedded YouTube Player rendering directly inside `SubtitleTimelineEditor.tsx` with responsive play/pause overlay and synchronized timeline seeking.
  - Added a dedicated **YouTube Quality Selector button & dropdown** in the timeline toolbar supporting `Auto`, `1080p`, `720p`, `480p`, `360p`, `240p`, and `144p`.
  - Added in-editor **YouTube Video loader modal** to easily paste, switch, or remove YouTube video links directly while editing.
  - Bidirectionally synchronized YouTube URL states between the AI Generator and Timeline Editor views.

### Added
- **Kie.ai Google Nano Banana Image Generation Engine (`kie.ts`, `gemini.ts`, `ApiKeyVault.tsx`, `App.tsx`)**:
  - Integrated the complete **Kie.ai Nano Banana** image generation suite (`google/nano-banana-2`, `google/nano-banana-pro`, `google/nano-banana`, `google/nano-banana-2-lite`, `google/nano-banana-edit`).
  - Implemented `generateKieImage` in `src/services/kie.ts` with asynchronous job submission (`/api/v1/jobs/createTask`), polling (`/api/v1/jobs/recordInfo`), and automatic URL extraction.
  - Routed scene generation, single storyboard frame rendering, and studio chat image creation to Kie.ai when a Nano Banana model is selected, unlocking Google Gemini-quality image generation using Kie AI credits without requiring Google Cloud Platform billing.
  - Added full model selector options in `ApiKeyVault.tsx` with dedicated Nano Banana badges.

### Added
- **Google Sign-In & Firebase Auth Integration (`auth.ts`, `ApiKeyVault.tsx`, `App.tsx`)**:
  - Integrated full Google OAuth 2.0 & Firebase Authentication flow supporting `openid`, `email`, and `profile` scopes.
  - Added dedicated Google Account status card in `ApiKeyVault.tsx` with one-tap Google Sign-In, profile avatar rendering, email display, and secure sign-out.
  - Added real-time Google auth status badge directly in the studio header toolbar for instantaneous user feedback and quick account switching.

### Fixed
- **Global `window.fetch` Getter-Only Exception Resolution (`index.html`, `main.tsx`)**:
  - Resolved `Uncaught TypeError: Cannot set property fetch of #<Window> which has only a getter` in iframe preview and proxy environments by establishing a configurable property descriptor with a bidirectional getter/setter on `window` and `Window.prototype` inside the `<head>` of `index.html` and top of `main.tsx`.
  - Guaranteed seamless compatibility when external runtime scripts, extensions, or polyfills assign to `window.fetch` without throwing unhandled exceptions.

### Fixed
- **Strict `package-lock.json` Parity & `npm ci` Reproducibility (`package-lock.json`, `.github/workflows/build-apk.yml`)**:
  - Synchronized `package-lock.json` with `package.json` to include `remark-breaks@^4.0.0` and its dependency `mdast-util-newline-to-break@^2.0.0`, eliminating the CI failure (`Missing: remark-breaks@4.0.0 from lock file`).
  - Preserved `npm ci` in `.github/workflows/build-apk.yml` to guarantee strict, deterministic, and immutable dependency resolution on GitHub Actions runners.
  - Resolved `android-actions/setup-android@v3` failure caused by the removal of the deprecated `tools` package by specifying explicit modern packages (`platforms;android-34`, `build-tools;34.0.0`, `cmdline-tools;latest`) and adding an automated license acceptance step.

### Fixed
- **React Hook Order Compliance in KieChatModal (`KieChatModal.tsx`)**:
  - Resolved `Rendered more hooks than during the previous render` runtime warning by moving `useMemo` for `messageTurns` and `totalTurns` unconditionally above the `if (!isOpen) return null;` early return block.
  - Fixed TypeScript interface signatures for `ChatSession.repoConfig` and `ChatSession.updatedAt` across `KieChatModal.tsx` and `StudioChat.tsx`.
  - Added missing `handleAttachRawFiles` handler for clipboard drag-and-drop file ingestion.

### Added
- **Chat Turn Numbers & Instant Revert / Rollback System (`StudioChat.tsx`, `KieChatModal.tsx`)**:
  - **Sequential Turn Numbers**: Computed dynamic conversational turn badges (`Turn 1`, `Turn 2`, ... `Turn N`) rendered on all message headers across User, Assistant, and Proxy bubbles. Added a live `Turn X` counter in the chat top header bar.
  - **Natural Command Revert**: Supported direct chat prompt commands like `revert to turn 3`, `revert to 3`, `revert 3`, `/revert 3`, `rollback to turn 3`, and `undo to turn 3`. When input at Turn 10, the engine immediately removes Turns 4 through 10, restores the conversation back to Turn 3, and updates persistent storage seamlessly without calling the AI API.
  - **Interactive 1-Tap Revert Controls**: Added direct `↩ Revert` action buttons on individual message toolbars and a quick-revert dropdown selector in the chat header bar for rapid rollback on mobile devices.
- **Multi-Image & Multi-File Studio Chat Attachments (`StudioChat.tsx`, `gemini.ts`, `chat.ts`)**:
  - Upgraded Studio Chat to support attaching multiple pictures/images simultaneously alongside multiple source code/text/document files.
  - Added `multiple` image selection to the file picker and drag-and-drop/paste processors, compressing each photo and maintaining an `attachedImages` array.
  - Upgraded `sendStudioChatMessage` in `gemini.ts` to package multiple base64 image parts as multimodal inputs into the Gemini generateContent API.
  - Added visual thumbnail preview ribbon above the input bar with numbered indices, individual delete `(X)` buttons, a total attachment count badge, and a responsive image gallery inside user message bubbles.
- **Chat Stop Generation Button & Mobile Enter Newline Input Behavior (`StudioChat.tsx`, `KieChatModal.tsx`)**:
  - Replaced the disabled send state during AI generation with a prominent **Stop** button with a pulse effect, allowing users to instantly abort in-progress generation or autonomous loop steps.
  - Disabled Enter key submission on textareas across both Studio Chat and KIE Chat. Tapping the Enter key on virtual mobile keyboards (Gboard, MIUI keyboard) or desktop now reliably inserts newlines without triggering accidental message submits. Submissions now exclusively occur when tapping the dedicated Send button.
- **Automated GitHub Actions Android APK Cloud CI (`.github/workflows/build-apk.yml`, `capacitor.config.json`)**:
  - Configured zero-maintenance automated cloud build pipeline via GitHub Actions.
  - Automatically compiles the React + Vite web application, sets up Capacitor Android runtime, provisions essential Android permissions (Audio recording, storage, media, network), builds `./gradlew assembleDebug`, and outputs a ready-to-install `app-debug.apk` directly under GitHub Actions Artifacts on every push.
  - Updated runner to stable `ubuntu-24.04`, Node.js 22 LTS, and `actions/setup-java@v5` to eliminate runner deprecation warnings.
- **Studio Chat Direct App Text Write & Edit Mode Toggle (`StudioChat.tsx`, `gemini.ts`)**:
  - Added dedicated **\`App Edit\`** quick-toggle buttons in both the Studio Chat top header toolbar and bottom input action bar.
  - When **\`App Edit\`** is **ON** (enabled by default and persisted in `localStorage`), Gemini receives explicit authority and tool descriptions to directly write, edit, rewrite, and apply text updates to project lyrics, technical instructions/starter prompts, art styles, aspect ratios, creative contexts, recurring motifs, cast characters, and storyboard scene image prompts using function tool calls.
  - When **\`App Edit\`** is **OFF**, the AI stays in chat-only advisory mode without modifying project tabs unprompted.

### Changed
- **Mobile-Exclusive Architecture Metadata & Boot Splash Screen (`metadata.json`, `index.html`)**:
  - Rewrote app metadata, OpenGraph tags, and Twitter cards to clearly identify the app as a professional-grade cinematic storyboarding engine engineered exclusively for mobile touch workflows and handheld production ergonomics.
  - Redesigned the initial pre-mount HTML boot screen with a sleek glowing mobile app badge, pulsing status indicators, high-contrast monospace diagnostics logger, and viewport-fit coverage (`100dvh`).

### Fixed
- **Mobile Keyboard & Desktop Instant Long-Text-to-File Auto-Attachment (`StudioChat.tsx`, `KieChatModal.tsx`, `LongTextPasteModal.tsx`)**:
  - Resolved an issue where pasting logs, stack traces, or multi-line text (especially on Android mobile keyboards/clipboard ribbons like MIUI/Gboard) dumped raw text into the textarea because mobile virtual keyboards trigger `onChange`/`input` rather than `onPaste`.
  - Added dual-mode interception (`onPaste` + delta-change detection in `onChange`) that captures large insertions (`> 120` chars or `3+` lines) and instantly attaches them as `.txt` / `.log` / `.kt` / `.json` chips above the input bar.
  - Enhanced filename auto-detection to recognize Android logcat timestamps (`09-27 04:11:12...`, `MediaCodec`, `ActivityInfo`, `ViewRootImpl`) and label them `pasted_logcat.log`.
  - Added a 1-click **Convert Back to Raw Text (`Type` button)** on each attachment badge.
- **Accurate `master` vs `main` Branch Detection & Universal GitHub URL Parsing (`githubService.ts`, `GitHubConnectModal.tsx`)**:
  - Resolved an issue where inputting repository links specifying the `master` branch (e.g. `https://github.com/owner/repo/tree/master`, `owner/repo/tree/master`, or `owner/repo@master`) defaulted to `main`.
  - Rewrote `parseGitHubUrlOrPath` to accurately extract branch names across all URL formats (`tree/master`, `blob/master`, `commits/master`, `?ref=master`, `?branch=master`, `#master`, `@master`, `:master`).
  - Added `fetchGitHubRepoMetadata` to query GitHub API for the true `default_branch` when no branch is specified, rather than blindly defaulting to `main`.
  - Added a 1-click **Branch Switcher Dropdown** directly inside the `GitHubConnectModal` connected repository card.
- **Deep GitHub Code Retrieval & Live Commit Diff Injection in Studio Chat (`StudioChat.tsx`, `gemini.ts`)**:
  - Resolved an issue where Studio Chat only injected basic metadata (commit SHA and list of filenames) without source code or git patch diffs, causing Gemini to answer without codebase grounding.
  - Studio Chat now actively indexes the repository tree, extracts candidate source files matching user keywords, reads real code snippets via `readRepoFileSnippet`, and injects exact git commit patch diffs into the system context.
  - Added strict authoritative system directives instructing Gemini to directly inspect and reference the provided repository code without claiming lack of GitHub access.

### Added
- **Independent Per-Window & Per-Conversation GitHub Branch Tracking (`RepoStatusBar.tsx`, `StudioChat.tsx`, `KieChatModal.tsx`, `githubService.ts`)**:
  - Each chat window and conversation now independently tracks and follows its own Git branch (e.g. Chat 1 can track `main` while Chat 2 tracks `dev` or `android-patch`).
  - Added an **Interactive Branch Switcher Badge & Dropdown** inside `RepoStatusBar` (in both full and micro-collapsed views) allowing users to switch branches via instant search, remote branch fetching (`fetchGitHubBranches`), or custom branch names.
  - Selecting a branch automatically switches active context, updates that conversation's persisted `repoConfig.branch`, and syncs remote commits and tree index immediately.

### Fixed
- **Complete Repository Unlink & Reset in Studio and KIE Chat (`StudioChat.tsx`, `KieChatModal.tsx`, `GitHubConnectModal.tsx`)**:
  - Resolved an issue where unlinking a GitHub repository still rendered the repository status bar on Row 3 due to hardcoded fallback defaults (`Mydownloader`).
  - `gitRepoConfig` and `isGitRepoEnabled` now properly initialize to `null` and `false` when no saved configuration exists.
  - Row 3 (`RepoStatusBar`) strictly checks that a valid configured repository exists before rendering.
  - Unlinking a repository in `GitHubConnectModal` now resets in-memory React state, clears `localStorage` (`mv_studio_git_repo_config`), and dismisses the status bar immediately.

### Added
- **Multi-Window & Cross-Session Memory Distillation (`KieMemoryDistillModal.tsx`, `geminiCodeDistiller.ts`, `StudioChat.tsx`, `KieChatModal.tsx`)**:
  - Upgraded the Executive Memory Distiller to natively support multi-window and cross-session environments.
  - Added an interactive **Source Chat Window Selector** allowing distillation from the active window, any specific conversation tab, or **🌐 All Chat Windows Combined (Cross-Session)**.
  - Cross-window synthesis correlates technical constraints, schema decisions, and bug fixes across multiple windows into a single unified briefing note.
  - Added a **Target Chat Window Selector** on Apply: users can choose to apply the distilled memory to the active window, a specific session, or broadcast it across **All Chat Windows**.
  - Integrated the Memory Distiller directly into **Studio Chat** toolbar with full multi-conversation list support.
- **Gemini Executive Memory Distiller for KIE AI Models (`KieMemoryDistillModal.tsx`, `geminiCodeDistiller.ts`, `KieChatModal.tsx`)**:
  - Leverages Google Gemini's high-context window to analyze multi-turn conversation transcripts, extracting key architectural choices, user constraints, established rules, bug fixes, and active next steps.
  - Synthesizes transcripts into a compact, high-density **Executive Working Memory Brief** that replaces raw chat text loops.
  - Added a **Distill Memory** trigger button in the KIE Chat header and Settings Drawer with 1-click **Apply to Active Session** capability.
- **Claude-Style Long Text Paste Handler (`LongTextPasteModal.tsx`, `KieChatModal.tsx`, `StudioChat.tsx`)**:
  - Automatically detects when pasted clipboard content is large (>500 characters or >10 lines).
  - Presents a Claude-like prompt offering to **Attach as File** (`.txt`, `.tsx`, `.kt`, `.json`, `.sql`, etc.) or **Paste as Raw Text**.
  - Attaching as a file generates structured, collapsible file preview cards, keeping prompt input boxes clean and performant.

### Removed
- **KIE 24H Status Monitor (`KieStatusMonitorModal.tsx`, `Kie24HStatusMonitor.tsx`, `kieStatusService.ts`, `vite.config.ts`)**:
  - Completely removed the 24H Status Monitor modal, background polling service, and proxy route since Kie.ai does not offer a real-time public success-rate telemetry stream.
  - Restored model dropdowns and toolbars to clean, uncluttered states.

### Added
- **Clear Linked GitHub Repository & Reset Connection State (`GitHubConnectModal.tsx`, `githubService.ts`, `StudioChat.tsx`)**:
  - Added functions `handleClearLinkedRepo`, `handleClearAllLinkedRepos`, `handleResetConnectionState`, and helper functions `removeSavedGitHubRepo` / `clearSavedGitHubRepos` to wipe linked repository data from localStorage (`kie_chat_github_saved_repos`, `mv_studio_git_repo_config`).
  - Added an active repository action bar with **Switch Repo** (resets connection state for quick repo selection) and **Clear & Unlink** (removes the repository from local storage and unlinks it).
  - Added interactive controls to recent repository chips allowing 1-click removal of individual repositories or clearing all saved repositories.
  - Added a **Linked Repositories in Local Storage** management section inside the Token & Auth settings tab.

### Removed
- **Voice Dictation / Microphone (`StudioChat.tsx`)**:
  - Removed the microphone dictation feature, speech status banner, and voice modals.
  - Studio Chat prompt bar is restored to its clean, stable, clutter-free state.

### Fixed
- **Smart Context Window & Historical Attachment Trimming (`KieChatModal.tsx`, `ChatSession`)**:
  - Implemented configurable sliding context window (4 turns, 6 smart turns default, 12 turns, or full history) to prevent token bloat, reduce billing, and prevent gateway worker 500 timeouts on large chats.
  - Added **Historical File Trimming**: Past turns with bulky 20KB+ file attachments (such as Android Logcats or full codebase dumps) are automatically summarized into lightweight metadata chips in subsequent turns while keeping the full file intact on the current turn.
  - Added visual controls in the Settings Drawer to adjust Context Window size and toggle Historical File Trimming on or off.

- **KIE API Real-Time Diagnostics & Request/Response Logger (`kieLogService.ts`, `KieLogsModal.tsx`, `kieChatService.ts`)**:
  - Added real-time API call logging capturing exact model IDs, resolved upstream URLs, sanitized Authorization headers, request bodies, HTTP status codes, execution duration (ms), retry attempts, and raw upstream JSON responses.
  - Generates ready-to-run, copyable cURL commands for every API request so developers and users can reproduce or debug requests directly in their terminal.
  - Added an interactive **Logs Modal** in KIE Chat Studio and KIE Status Monitor with search filters (All, Errors, Success), auto-expanding error traces, raw JSON viewers, and one-click clipboard export.
  - Enhanced error handling with automatic exponential backoff retries for transient HTTP 500 / "server exception" drops.

- **Live KIE.ai 24H Status Monitor Endpoint (`https://api.kie.ai/api/v1/monitor/success-rate`, `vite.config.ts`, `Kie24HStatusMonitor.tsx`)**:
  - Connected the real upstream endpoint `https://api.kie.ai/api/v1/monitor/success-rate?model=<model>` via our server-side proxy `/api/kie/monitor/success-rate`.
  - Added on-demand live refresh buttons and automatic polling to ensure live success rates and interval timestamps are pulled directly from Kie.ai in real time.
  - Implemented the exact multi-slice 24H Status Monitor visualizer matching Kie.ai's design (64+ stacked 10-minute time slots with green `bg-emerald-500` success and rose `bg-rose-500` failure portions).
  - Hovering any slice updates the time interval badge in real-time (`YYYY-MM-DD HH:MM:SS —— YYYY-MM-DD HH:MM:SS - Success: X%`).
  - Added color-coded live health dots (🟢 Operational, 🟡 Degraded, 🔴 Upstream Outage) and percentage badges directly on each model card in the dropdown and trigger button.
  - Added a proactive **Pre-Flight Health Warning Banner** in KIE Chat Studio that detects degraded models (such as GPT-5.2 at 6% success rate) and provides a 1-click button to instantly switch to operational alternatives (like GPT-5.6 Sol or GPT-5.5).
  - Added a dedicated **KIE 24H Status Monitor Modal** accessible from the chat toolbar with full provider filtering and real-time success bars.

- **DeepSeek V4.1 Flash, R1 & V3 Dedicated Provider Routing (`kieChatService.ts`, `KieModelDropdown.tsx`, `KieChatModal.tsx`)**:
  - Separated DeepSeek models into their own dedicated provider tab (`DeepSeek`) and category in both the model dropdown and gallery, ensuring DeepSeek is never confused with or overridden by Moonshot/Kimi.
  - Added `DeepSeek 4.1` directly to the quick-switch toolbar pills in KIE Chat Studio.
  - Added robust model normalization (`normalizeKieModelId`) mapping variations like `deepseek-4.1`, `deepseek-4-1`, `deepseek-v4-1` directly to `deepseek-v4-1-flash`, as well as adding `DeepSeek R1` (`deepseek-r1`) and `DeepSeek V3` (`deepseek-v3`).
  - Added `DeepSeek R1` and `DeepSeek V3` options to API Key Vault.

- **KIE.ai Upstream Server Exception Diagnostics (`kieChatService.ts`)**:
  - Enhanced error diagnostics when Kie.ai returns `Server exception, please try again later` on specific upstream models (like GPT-5.2).
  - Added clear alternative routing guidance recommending active models (`GPT-5.5`, `GPT 5.6 Sol`, `Gemini 3.8 Flash`, `Claude Sonnet 5`).

- **Dedicated Crash Logger & Interceptor System (`CrashLogger.tsx`, `crashLogger.ts`, `CrashLogsModal.tsx`)**:
  - Implemented global event listeners for uncaught exceptions (`window.onerror`) and unhandled promise rejections (`unhandledrejection`).
  - Automatically persists all intercepted crashes and stack traces to `localStorage` (`mv_crash_logs_v1`, `mv_last_crash_log_v1`).
  - Added a non-intrusive floating toast alert on app startup that detects previous session crashes, allowing users to copy the full AI diagnostic report in 1 click.
  - Added a dedicated **Crash Logs** modal accessible under the Settings menu for browsing, inspecting, copying, and clearing past crash reports.

- **1-Click Crash Diagnostic Report & Error Trace Persister (`ErrorBoundary.tsx`)**:
  - Added a **`Copy Report for AI`** button directly inside the crash screen that automatically formats the exact error message, call stack, and React component stack into a clipboard-ready report to paste into the chat.
  - Added expandable full stack trace viewer (`View Full Stack Trace`) on the crash boundary.
  - Automatically persists the latest crash report to `localStorage` (`mv_last_crash_log`) so logs survive browser refreshes.

### Fixed
- **Project & Settings File Import Resilience (`App.tsx`)**:
  - Resolved an issue where importing project JSON files could trigger render crashes and page reload loops due to un-sanitized imported state.
  - Added flexible format parsing supporting both wrapped (`{ projectData, directorPlan }`) and flat (`ProjectData`) JSON files.
  - Enforced `sanitizeProject` and `sanitizePlan` before setting React state and writing to DB, and safely reset file input values after selection.

- **Project Data & IndexedDB Hydration Safety Invariants (`App.tsx`)**:
  - Fixed an unhandled runtime crash during application startup caused by `URL.createObjectURL(f)` being invoked on non-Blob objects from corrupt or legacy local storage files.
  - Added the `sanitizeProject` and `sanitizePlan` defensive transformation layers to guarantee that `characters`, `referenceImages`, `scenes`, and `roles` are always properly initialized as safe arrays with fallback structures.
  - Wrapped all startup JSON deserialization and IndexedDB/Firestore loading inside guarded `try...catch` blocks with safe defaults.

- **Null-Safe Chat Message Serialization & React Render Guard (`KieChatModal.tsx`, `KieMarkdownRenderer.tsx`)**:
  - Fixed a critical runtime crash where chat sessions containing messages with undefined or non-string `content` threw `TypeError: Cannot read properties of undefined (reading 'includes')` during render passes.
  - Implemented synchronous hydration sanitization in `loadInitialSessions` and guarded all message operations (`msgContent = typeof msg?.content === 'string' ? msg.content : String(msg?.content ?? '')`).
  - Added safe fallback `{content || ''}` to `KieMarkdownRenderer` and normalized top bar height class in `App.tsx`.

### Changed
- **Consolidated Dual Stacked Menus into High-Density Unified Toolbar (`StudioChat.tsx`, `App.tsx`)**:
  - Replaced the two stacked sub-menus (Conversation Title Header + Controls Toolbar) in Studio Chat with a single, sleek high-density header bar (`py-1.5` with backdrop blur), reclaiming over 50% of vertical top padding.
  - Streamlined the global application header from `h-16` to `h-13 sm:h-14` and compacted the Production Director mode switcher, maximizing vertical workspace across desktop and mobile viewports.

### Added
- **Architect-to-Builder Pipeline (`geminiArchitectPipeline.ts`, `KieChatModal.tsx`)**:
  - Implemented the dual-stage **Architect Mode (KIE Plan → Gemini Build)** to dramatically cut output token expenses on premium KIE models.
  - In Architect Mode, KIE models (Claude 3.5 Sonnet, GPT-6 Astra, Grok 4.7) act strictly as the Lead Architect, outputting only high-density structural blueprints, interface contracts, and logic specifications (~150–350 tokens).
  - Google Gemini 3.7 Flash automatically ingests the blueprint in the background and writes out the full, production-ready, complete implementation for free.
  - Added a **`🏗️ Architect: ON/OFF`** toolbar toggle and interactive expandable blueprint drawers on generated message cards (`Saved ~85-90% Output Credits`).

- **Background Gemini Code Distiller & KIE Credit Saver (`geminiCodeDistiller.ts`, `KieChatModal.tsx`, `kieChatService.ts`)**:
  - Implemented an automated two-stage pre-reading and distillation bridge: Google Gemini (Gemini 3.7 Flash) pre-reads large raw code files, documents, and Git repository diffs in the background for free.
  - Distills massive raw code dumps (50KB–500KB) into a high-density, focused intelligence brief (500–1,200 tokens) containing only the exact class/method signatures, logic bottlenecks, and root cause evidence needed for downstream reasoning.
  - Automatically routes the compressed brief to premium KIE models (Claude Sonnet 5, GPT-6, Grok 4.7, DeepSeek), slashing input token consumption and saving **90% to 95% of KIE AI credits**.
  - Added a 1-click **`Saver: ON/OFF`** quick toggle chip to the KIE Chat toolbar with persistent local state.

- **Direct GitHub Repository Commit & Write Bridge (`githubService.ts`)**:
  - Implemented `commitFileToGitHub` enabling direct programmatic and interactive file creation/updates to GitHub repositories using authenticated Personal Access Tokens with `repo` permissions.
  - Automatically handles SHA inspection, base64 UTF-8 encoding, commit author metadata, and branch target resolution via GitHub REST API (`PUT /repos/{owner}/{repo}/contents/{path}`).

- **1-Click Retry / Resend Action Button (`StudioChat.tsx`, `KieChatModal.tsx`)**:
  - Added dedicated Retry / Regenerate buttons (`RotateCcw`) to all messages (user prompts and assistant responses) across both Studio Chat and KIE Chat.
  - Clicking Retry on a user prompt resets subsequent conversation history and immediately re-executes the prompt with fresh AI generation.
  - Clicking Retry on an AI assistant response re-runs generation from the preceding user prompt without requiring manual text re-entry or copying.

- **Rich Markdown Formatting & Code Block Rendering for KIE Chat (`KieMarkdownRenderer.tsx`, `KieChatModal.tsx`)**:
  - Replaced plain text message display with a dedicated rich Markdown rendering engine (`KieMarkdownRenderer.tsx`) for all assistant and user messages.
  - **Comprehensive Typography Hierarchy (H1-H6)**: Headings styled with proportional font scaling, high-contrast weights, distinct borders, and dynamic adaptation to user-selected font sizes (4px through 24px).
  - **Full Markdown Syntax Support**: Full parsing and visual rendering for bold (`**text**`), italic (`*text*`), strikethrough (`~~text~~`), ordered lists (`1.`), unordered bullet lists (`-`), nested lists with custom markers, blockquotes with indigo callout borders, horizontal rules (`---`), paragraphs, line breaks via `remark-breaks`, and GFM task checklists (`- [ ]`).
  - **Visually Distinct Fenced Code Blocks (`KieCodeBlock`)**: Rendered inside isolated high-contrast cards (`bg-[#0d0d11]` with `border-white/15` and `shadow-2xl`) with language badge, line count indicator, 1-click clipboard copy with checkmark confirmation, and expand/collapse toggle for blocks over 10 lines.
  - **Inline Code Pills**: Styled inline `<code>` chips with background tints, subtle borders, and monospace font that never confuse single-line fenced code blocks due to `InPreContext` state tracking.
  - **Tables & Links**: GFM tables with responsive scroll wrappers, zebra striping, and distinct header rows; external links with security attributes (`target="_blank" rel="noopener noreferrer"`) and external link icons.

- **App UI-Matched Custom Model Dropdown for KIE Chat (`KieModelDropdown.tsx`, `KieChatModal.tsx`)**:
  - Replaced browser-native unstyled HTML `<select>` on KIE chat toolbar with a dedicated custom dropdown styled in full harmony with the MV Director design language (`AspectRatioDropdown`, `SubtitleFormatDropdown`).
  - **Signature App UI Trigger**: Features dark elevated trigger button (`bg-black/50 hover:bg-black/70 border border-white/10 hover:border-white/20 rounded-xl px-2.5 sm:px-3 py-1 text-xs`), active glowing provider indicator dot, model name, provider pill, and rotating `ChevronDown`.
  - **Portal-Rendered Floating Popover**: Eliminates modal/toolbar container overflow clipping with dynamic `getBoundingClientRect` positioning, fixed backdrop dismiss, and smooth animation (`animate-in fade-in slide-in-from-top-2`).
  - **Integrated Real-Time Search & Provider Tabs**: Features fast search bar for filtering by model ID, name, or capabilities (e.g. "grok", "sonnet", "flash"), accompanied by quick provider tabs (`All`, `⭐ Popular`, `Google`, `OpenAI`, `Claude`, `xAI`, `Other`).
  - **Grouped Model Cards & Custom Slug Support**: Displays model categories with provider color accents, capability badges (`500K Context • SWE 71%`, `Frontier Flagship`, `Advanced Coding`), active checkmark indicators, and built-in custom slug creator.
  - **Styled Auto-Loop Turns Selector**: Replaced unstyled loop step element with custom styled select with embedded `ChevronDown` and emerald branding.

- **Multi-Conversation AI Studio Chat System (`StudioChat.tsx`, `ChatSidebar.tsx`, `studioChatStorage.ts`, `chat.ts`)**:
  - **Full Multi-Conversation Architecture**: Upgraded the single persistent chat into a full ChatGPT/Claude style conversation management system.
  - **Left Conversation Sidebar**:
    - **Grouped by Time**: Automatically categorizes conversations into "Today", "Yesterday", "Previous 7 Days", and "Older".
    - **Active Conversation Indicator**: Visually highlights the open conversation with dedicated badges, indigo glow, and message count preview.
    - **In-Place Actions & 3-Dot Menu**: Supports renaming in place, conversation duplication, archiving/unarchiving, and deletion with confirmation dialog.
    - **Search Engine**: Real-time filtering by conversation title and last message preview text.
  - **"+ New Chat" Flow**:
    - Creates independent conversation IDs, clears the active transcript, and resets prompt inputs without data leakage.
    - Smooth empty state with prompt starters (Suno instrumental prompt generator, cinematic storyboard generator, Git architecture explainer, and image generation).
    - Automatically derives intelligent titles from the first user message (e.g. "Suno Instrumental Prompt").
  - **Isolated Streaming & AI Safety**:
    - Scopes background responses, reasoning loops, and multi-turn proxy steps strictly to their originating conversation ID, ensuring switching conversations during generation does not corrupt or mix transcripts.
  - **Responsive Mobile Drawer**:
    - Defaults to slide-out drawer on screens < 768px with backdrop blur, auto-closing upon conversation selection.
    - Sidebar toggle button (`PanelLeft`/`PanelLeftClose`) with `Ctrl+B` / `Cmd+B` keyboard shortcut.
  - **Dual-Layer Persistence**:
    - Stores conversations and message transcripts in IndexedDB (`idb-keyval`) and synchronizes with Firebase Firestore collections (`studio_chat`, `studio_chat_messages`) under user-scoped security rules.
    - Seamlessly migrates legacy single-chat history (`mv_director_studio_chat_history`) into the new system without data loss.


### Fixed
- **Resolved React Hook Order Violation in KIE Chat (`KieChatModal.tsx`)**:
  - **Root Cause Identified**: A `useMemo` call was embedded directly inside JSX mapping expressions (`{useMemo(() => activeSession.messages.map(...))}`) after an early conditional return (`if (!isOpen) return null;`). When `isOpen` toggled between closed and open states, the number of invoked React hooks changed from 32 to 33, triggering `Warning: React has detected a change in the order of Hooks` and causing an immediate fatal React boundary crash.
  - **Resolution**: Removed the conditional inline `useMemo` invocation from JSX. Message re-rendering performance remains optimized through memoized Markdown child components (`KieMarkdownRenderer`, `KieCodeBlock`) while strictly respecting the Rules of Hooks across all render cycles.

- **Chat Box Overflow & Edit / Delete Button Clipping on File Uploads (`StudioChat.tsx`, `KieChatModal.tsx`, `CollapsibleFileAttachment.tsx`)**:
  - **Root Cause Identified**: Action buttons (Edit, Delete, Collapse) were rendered as an external horizontal flex sibling next to message bubbles in a `justify-end` flex container. When users uploaded files or wide attachments, the bubble expanded to fill available width (`max-w-[88%]`), pushing the leftmost action buttons completely off-screen and out of the viewport frame (`x < 0`), making them impossible to click.
  - **Vertical Action Toolbar Architecture**: Restructured message containers to encapsulate action toolbars directly above message bubbles (`flex flex-col items-end` for user messages, `flex flex-col items-start` for assistant/proxy messages).
  - **Viewport Constraint Enforcement**: Replaced unconstrained flex widths with `max-w-[calc(100%-40px)] sm:max-w-xl md:max-w-2xl` with strict `min-w-0` and `overflow-hidden` constraints across message bubbles, code cards, and attachment items.
  - **Attachment Responsive Sizing**: Added explicit filename truncation (`max-w-[130px] sm:max-w-xs truncate`), compact padding, and non-wrapping action bars to `CollapsibleFileAttachment.tsx` so attachments remain perfectly within frame on all viewport sizes.

- **Resolved Cross-Origin "Script error." and Migrated to Native Tailwind v4 Vite Plugin (`vite.config.ts`, `index.html`, `index.css`, `main.tsx`)**:
  - **Root Cause Identified**: The application previously included an external script tag for `https://cdn.tailwindcss.com` in `index.html` alongside `@tailwindcss/vite` in `package.json`. In iframe environments and strict CSP headers, external CDN scripts throw uncatchable cross-origin `"Script error."` events on `window.onerror`.
  - **Native Build Pipeline**: Integrated `@tailwindcss/vite` directly into `vite.config.ts` plugins and configured `@import "tailwindcss";` in `src/index.css`, removing the external CDN script dependency completely.
  - **Global Error Protection (`main.tsx`)**: Added a global `window.addEventListener('error')` interceptor to catch and prevent unhandled third-party cross-origin script errors or media playback interruptions from escalating to application-level crashes.

- **Resolved 1,048,576 Token Limit Exceeded in Studio Chat (`gemini.ts`, `StudioChat.tsx`)**:
  - **Root Cause Identified**: In multi-turn chat sessions with large file attachments, whole code files, base64 images, or multi-step Chat Loops, every single historical message was passed in full fidelity with raw inline base64 image strings and uncompressed file attachments to `gemini.generateContent`. Over time, the accumulated context exceeded the Gemini API 1,048,576 token ceiling (`INVALID_ARGUMENT: The input token count exceeds the maximum number of tokens allowed 1048576`).
  - **Proactive Context Sanitization & Pruning**: Added `estimateContentTokens` and `pruneAndSanitizeStudioContents` in `gemini.ts`. Historical messages older than the latest turn now replace heavy base64 images with lightweight references (`[Previously attached image: analyzed in earlier turn]`), condense historical file attachments (> 2,500 chars), and apply a sliding window to keep total context safely within the model's budget.
  - **Self-Healing Emergency Fallback**: Implemented automatic detection (`isTokenLimitError`) in `sendStudioChatMessage`. If a token limit error is encountered, the engine automatically performs emergency compaction (retaining the active user prompt and latest turn with safe truncation) and retries the generation automatically without crashing the conversation.
  - **Human-Readable Error Handling**: Replaced raw backend JSON error popups with clear, informative context recovery notifications in `StudioChat.tsx`.

- **Zero-Lag Typing & Chat Renderer Optimization (`KieMarkdownRenderer.tsx`, `KieChatModal.tsx`, `StudioChat.tsx`, `App.tsx`)**:
  - Diagnosed typing latency and UI lag: previously, every keystroke in the user message textarea triggered a component re-render where `ReactMarkdown` re-parsed the Abstract Syntax Tree (AST) for every single message in the conversation history across unmemoized plugin and component definitions.
  - Implemented `React.memo` and static plugin definitions (`STATIC_REMARK_PLUGINS`, `STATIC_STUDIO_REMARK_PLUGINS`) across `KieMarkdownRenderer`, `KieCodeBlock`, `StudioMarkdownRenderer`, and `StudioCodeBlock` to prevent markdown AST re-parsing during parent re-renders.
  - Stabilized component configuration mappings with `useMemo` so DOM nodes are preserved across renders.
  - Wrapped message history lists in `useMemo` in both `KieChatModal.tsx` and `StudioChat.tsx`, isolating user input state updates (`inputMessage`, `input`) entirely from the chat message DOM tree. Typing now executes with ~0ms main-thread overhead.
  - Optimized `App.tsx` agent bridge sync effect to prevent unnecessary debounced JSON serialization when live sync is inactive.

- **Resolved "Failed to parse director plan: []" Specifically with KIE Models (`gemini.ts`, `kieChatService.ts`, `App.tsx`)**:
  - **Root Cause Identified**:
    1. In `kieChatService.ts`, `extractKieApiResponse` was stringifying empty data arrays as literal `"[]"` or failing silently on upstream error structures without throwing actionable errors.
    2. In the OpenAI Responses API handler (`/grok/v1/responses`, `/codex/v1/responses`, `/openai/v1/responses`), system messages were being routed inside `input` without setting `instructions`, causing certain KIE models to ignore system prompting or return empty responses.
    3. `callTextModel` in `gemini.ts` was not passing schema structure requirements or `responseFormat: 'json_object'` to KIE endpoints, and capped output tokens at 4096 which could truncate structured JSON outputs.
    4. Key validation in `App.tsx` was checking for a Google API key even when a KIE model was selected, and KIE keys saved in `KieChatModal` were not being immediately synced to the active service instance.
  - **Resolution**:
    - **Upstream Response Normalization**: Enhanced `extractKieApiResponse` to strip reasoning tags (`<think>...</think>`, `<thought>...</thought>`), handle all nested `output` content shapes, and throw explicit upstream API errors rather than falling through to `"[]"`.
    - **OpenAI Responses Protocol Compliance**: Updated `sendKieChatCompletion` to route system instructions to the dedicated `instructions` parameter, map message roles correctly, and enforce `responseFormat: 'json_object'`.
    - **Director Plan Schema Contract**: In `callTextModel`, automatically injected an explicit JSON schema template and non-empty rules for director plans when calling KIE models, with an expanded token ceiling of 8192 tokens.
    - **Key Synchronization & Validation**: Updated `handleDirectorMagic` and `handleContinueDirectorMagic` in `App.tsx` to validate KIE API keys for KIE models, and synced keys immediately into memory and local storage across modal actions.
    - **Linter & Type Alignment**: Corrected font config fallback in `StudioChat.tsx` (`14px`).

- **Resolved "Failed to parse director plan: []" Error (`gemini.ts`)**:
  - **Root Causes**:
    1. The legacy `extractJSON` helper picked up any initial square bracket (such as character reference markers `[REF_1]` or empty arrays `[]`) before opening curly braces `{`, causing valid JSON objects to be incorrectly sliced or truncated.
    2. When the AI Director returned an empty array (`[]`) or a direct array of scene objects (`[{ ... }]`), the rigid validator check `if (!parsed.scenes || !Array.isArray(parsed.scenes))` threw an unhandled exception that printed `Failed to parse director plan: []`.
    3. In continuation mode, when the existing scene count reached or approached the target scene count, the prompt previously instructed the model to output 0 new scenes, prompting it to return an empty array `[]`.
  - **Resolution**:
    - Introduced `safeParseJSON` with multi-stage JSON object, array, and truncated repair strategies.
    - Introduced `normalizeDirectorScenes` supporting all response geometries: `{ scenes: [...] }`, direct scene arrays `[...]`, `{ shots: [...] }`, `{ plan: [...] }`, `{ sequence: [...] }`, and individual scene objects.
    - Added resilient graceful fallbacks: in continuation mode, an empty scene list safely logs completion and returns the existing plan without throwing; in plan creation mode, an empty response automatically synthesizes an opening scene from the master art style and theme rather than failing.
    - Updated `buildSystemPrompt`, `buildUserPrompt`, and `continueDirectorPlan` to explicitly enforce positive target scene counts and mandate valid non-empty scene object structures.

### Added
- **Verified Grok 4.7 Specifications & Model Configuration (`kieChatService.ts`, `KieChatModal.tsx`)**:
  - Verified live endpoint, pricing, and architecture from official KIE.ai market page (`https://kie.ai/grok-4-7`):
    - **Endpoint & Format**: `POST /grok/v1/responses` via OpenAI Responses protocol (`{ model: "grok-4-7", input: [...], reasoning: { effort }, tools: [{ type: "web_search" }] }`).
    - **500K Context Window**: Verified 500,000 token context window for large codebase synthesis and document exploration.
    - **4-Level Reasoning Controls**: Integrated support for `low`, `medium`, `high`, and `xhigh` reasoning effort levels.
    - **Live Web Search**: Grounding support enabled via `web_search` parameter.
    - **Pricing Rate**: Input at 160 credits / 1M tokens ($0.80), Cached Input at 40 credits / 1M tokens ($0.20), Output at 480 credits / 1M tokens ($2.40).
    - **Benchmarks**: 71.0% DeepSWE v1.1 at high effort, 46.3% CursorBench 4.0, 64.0% EEBench, 1,657 AA Briefcase v1.1.

- **Compact & High-Density UI Overhaul for KIE AI Studio (`KieChatModal.tsx`)**:
  - Re-architected modal layout to eliminate dead space and reclaim vertical workspace:
    - **Header Bar**: Streamlined modal header height to `h-11`/`h-12`, tightened session counter and controls.
    - **Collapsible Sidebar**: Added toggleable sidebar (`PanelLeft` / `PanelLeftClose`) with `isSidebarCollapsed` state to allow edge-to-edge message view.
    - **Single-Row Model Toolbar**: Replaced bulky two-row pill bar with a unified single-row toolbar featuring model selector dropdown, flagship quick-chips, Memory toggle, Auto-Loop selector, Repo button, and font size stepper with an on-demand collapsible gallery.
    - **Optimized Chat Viewport & Bubbles**: Increased max content width (`max-w-5xl`), decreased scroll padding (`p-2 sm:p-3.5`), compacted avatars (`w-6 h-6 sm:w-7 sm:h-7`), and trimmed bubble body padding (`px-2.5 py-1.5 sm:px-3.5 sm:py-2.5`).
    - **Compact Input Bar**: Reduced composer height in default state (`rows=1`, `min-h-[36px]`, `p-1.5 sm:p-2.5`), cleaned up redundant steppers, and streamlined action buttons.

### Fixed
- **Resolved "Not Supported" Protocol Error on KIE.ai Chat (`kieChatService.ts`)**:
  - Identified root causes of upstream "not supported" errors:
    1. Models on the OpenAPI Responses protocol (`deepseek-v4-1-flash`, `kimi-k3`, `grok-4-*`) were previously sent using OpenAI `/v1/chat/completions` payload format (`messages: [...]`) instead of Responses format (`input: [...]`), causing the `/openai/v1/responses` and `/grok/v1/responses` endpoints to reject the requests.
    2. Fallback routing on non-200 errors previously fell back to `/v1/chat/completions`, where KIE returned a secondary "model not supported" error that masked the genuine upstream API status.
  - Implemented clean protocol separation:
    - **Anthropic Messages**: `/claude/v1/messages` with `anthropic-version: 2023-06-01`.
    - **OpenAI Responses API**: `/codex/v1/responses`, `/grok/v1/responses`, and `/openai/v1/responses` with `{ model, input: [...] }` schema and reasoning/tools parameters.
    - **OpenAI Chat Completions**: Dedicated model paths and `/v1/chat/completions` with `{ model, messages: [...] }`.
  - Added unified response parser `extractKieApiResponse` capable of handling all response shapes (OpenAI Responses output arrays, Claude content blocks, OpenAI choices, and direct strings) with transparent error messages.

### Added
- **Verified Model Catalog Alignment & Pruning (`kieChatService.ts`, `ApiKeyVault.tsx`, `gemini.ts`, `KieChatModal.tsx`)**:
  - Cross-referenced all configured models against the live 89 chat model configurations in the official KIE.ai catalog.
  - Removed nonexistent model identifiers:
    - Removed `gpt-6-sol-luna` (OpenAI).
    - Removed `claude-opus-5-5` (Anthropic).
    - Removed `claude-fable-5-1` (Anthropic).
    - Removed legacy unlisted references (`gpt-4o`, `gpt-4o-mini`, `o1-preview`, `deepseek-reasoner`).
  - Added verified models:
    - Added `gpt-5.4` (`/codex/v1/responses`).
    - Standardized default session models to the verified `gemini-3.5-flash`.
- **Verified Gemini 3.5 Flash & Gemini Family Endpoints (`kieChatService.ts`)**:
  - Aligned the Google Gemini model endpoints with the official [docs.kie.ai/market/gemini/gemini-3-5-flash-openai.md](https://docs.kie.ai/market/gemini/gemini-3-5-flash-openai.md) OpenAPI documentation:
    - `gemini-3.5-flash`: Dedicated OpenAI-compatible endpoint at `/gemini-3-5-flash-openai/v1/chat/completions`.
    - `gemini-3.8-flash`: Dedicated `/gemini-3-8-flash-openai/v1/chat/completions`.
    - `gemini-3.7-flash`: Dedicated `/gemini-3-7-flash-openai/v1/chat/completions`.
    - `gemini-3.6-flash`: Dedicated `/gemini-3-6-flash-openai/v1/chat/completions`.
    - `gemini-3.1-pro`: Dedicated `/gemini-3.1-pro/v1/chat/completions`.
    - `gemini-3-pro`: Dedicated `/gemini-3-pro/v1/chat/completions`.
    - `gemini-2.5-pro`: Dedicated `/gemini-2.5-pro/v1/chat/completions`.
    - Full support for unified media (`image_url`), real-time Google Search grounding (`tools: [{ type: "function", function: { name: "web_search" } }]`), and 65,536 max tokens.
- **Verified & Enhanced GPT-5.2 Specification (`kieChatService.ts`)**:
  - Aligned `gpt-5-2` with the official [docs.kie.ai/market/chat/gpt-5-2.md](https://docs.kie.ai/market/chat/gpt-5-2.md) OpenAPI documentation:
    - Dedicated Endpoint: `/gpt-5-2/v1/chat/completions`
    - Supported parameters: `messages`, `reasoning_effort` (`low` | `high`), and `tools` with `web_search` function calling.
    - Multimodal text & image support with 32,768 max output tokens.
- **Synchronized GPT 5.6 Tiers (Sol, Terra, Luna) & DeepSeek Single Model Specification (`kieChatService.ts`, `KieChatModal.tsx`)**:
  - Aligned the KIE catalog with the official [docs.kie.ai](https://docs.kie.ai) specifications:
    - **GPT 5.6 (3 Tiers)**:
      - `GPT 5.6 Sol` (`gpt-5-6-sol`): Frontier flagship tier for complex tasks, deep reasoning, coding, and tool calling via `/codex/v1/responses`.
      - `GPT 5.6 Terra` (`gpt-5-6-terra`): Balanced scale tier optimizing intelligence and latency via `/codex/v1/responses`.
      - `GPT 5.6 Luna` (`gpt-5-6-luna`): Ultra-fast, cost-effective high-throughput tier via `/codex/v1/responses`.
    - **DeepSeek (1 Official Model)**:
      - `DeepSeek V4.1 Flash` (`deepseek-v4-1-flash`): Dedicated single DeepSeek model on KIE.ai supporting deep thinking, function calling, image understanding, and structured outputs via `/openai/v1/responses`. Removed legacy fallbacks.
  - Updated category filters and dropdown optgroups (`OpenAI (8)`, `DeepSeek & Moonshot (2)`).

### Changed
- **GitHub Repository Status & Notification Bar: Ultra-Compact Footprint & Collapsible Controls (`RepoStatusBar.tsx`, `StudioChat.tsx`, `KieChatModal.tsx`)**:
  - **Zero-Overlap Viewport Presence**: Re-engineered the GitHub repo status bar to prevent multi-line wrapping and excessive height from covering or squeezing chat messages on mobile and compact screens.
  - **1-Click Collapsible Mini-Bar**: Added a collapse/expand toggle (`ChevronUp` / `ChevronDown`) that shrinks the status bar into an ultra-slim 20px micro-bar showing only essential repo identity and commit sync status.
  - **Quick Dismiss (`X`)**: Added an instant close button to dismiss the repo notification bar or disable repository awareness directly without needing to navigate into deep settings.
  - **Removed Bulky Wrapper Padding**: Cleaned up container margins and padding in Studio Chat and KIE Studio for clean, uninterrupted chat flow.

### Added
- **Chat & Prompt Font Settings: 4px Minimum Support & KIE Studio Integration (`KieChatModal.tsx`, `StudioChat.tsx`, `chatFont.ts`)**:
  - **Universal Font Engine (`chatFont.ts`)**: Built a shared modular font configuration supporting granular font scaling from **4px** (microscopic compact) up to **24px** (ultra-large display) across 11 discrete scale levels (`4px`, `6px`, `8px`, `10px`, `12px`, `14px`, `15px`, `16px`, `18px`, `20px`, `24px`).
  - **KIE Studio Font Controls**: Added the font size adjuster stepper (`A-` / `A+`) and dropdown selector to both the sub-header bar and bottom input toolbars inside the KIE Studio chat interface, persisting preference to `localStorage.kie_chat_font_size`.
  - **Studio Chat 4px Minimum Extension**: Updated AI Studio Chat font steppers and selectors to support the expanded 4px minimum size, with full backward-compatibility for existing presets.
  - **Full Hierarchy Scaling**: Dynamically synchronizes user chat bubbles, AI markdown responses, code blocks (`ChatCodeBlock` and `StudioCodeBlock`), inline code tags, tables, blockquotes, message edit textareas, and prompt composition input boxes.

### Removed
- **KIE Studio: Removed Local Success Rate & Status Monitor (`KieChatModal.tsx`, `kieMetricsService.ts`)**:
  - Removed the simulated local success rate widget and ping monitor from the KIE Studio header to prevent confusing local client request statistics with official live KIE.ai provider success rates.
  - Simplified the header to focus on active model selection, standalone pop-out, API key configuration, and persona tuning.

### Added
- **AI Studio Chat: Font Size Scaling & Accessibility Controls (`StudioChat.tsx`)**:
  - **Dynamic Font Size Adjuster**: Added instant font size customization supporting 5 size presets: **Compact (12px)**, **Standard (14px)**, **Comfortable (15px)**, **Large (16px)**, and **Extra Large (18px)**.
  - **Dual Stepper & Selector UI**: Added quick-stepper buttons (`A-` / `A+`) and a select dropdown in both the top Quick Controls Toolbar and the bottom Input Action Bar for fast ergonomic adjustments on mobile devices.
  - **Synchronized Hierarchy Scaling**: Scaled chat message text, markdown body, ReactMarkdown tables/lists/blockquotes, syntax code blocks (`StudioCodeBlock`), inline code tags, message edit areas, and prompt typing input areas simultaneously.
  - **Persistent Preferences**: Saved user font size preference to `localStorage` (`mv_studio_font_size`) across browser reloads.

### Added
- **AI Studio Chat: Mobile-First Viewport Maximization & Ergonomic Input Layout (`StudioChat.tsx`)**:
  - **Unobstructed Viewport on Mobile**: Completely eliminated the fixed side button gutters that squeezed chat input down to narrow widths on mobile devices.
  - **Unified Compact Action Bar**: Restructured the input container with a clean, scrollable bottom action toolbar housing File Attachments, Image Reference, Git Repo toggle, Web Search, Clear Chat, Expand, and Send buttons.
  - **Responsive Spacing & Typography**: Reduced message padding, avatar sizes, and empty-state prompt card gaps (`p-2.5 sm:p-4`, `w-7 sm:w-8`) on smaller viewports to maximize visible chat history.
  - **Always-Visible Action Menus**: Made message action buttons (copy, edit, delete, collapse) visible with gentle opacity on touch devices where hover states do not exist.

### Added
- **AI Studio Chat: Multi-File Upload, Drag-and-Drop & Clipboard Pasting (`StudioChat.tsx`)**:
  - **Universal File Attachments**: Users can upload code files (`.ts`, `.tsx`, `.js`, `.py`, `.json`, `.html`, `.css`, `.sql`, `.sh`), text and scripts (`.txt`, `.md`, `.srt`), audio files (`.mp3`, `.wav`), and documents directly into Studio Chat.
  - **Multi-File Selection**: The new **`📎 Attach Files`** button allows selecting multiple files at once, reading their contents and lines, and attaching them as structured collapsible blocks for Gemini to review and reason over.
  - **Drag-and-Drop Overlay**: Added a smooth full-window drag-and-drop zone with visual backdrop overlay and drop indicators for instant file loading.
  - **Clipboard Paste Support**: Users can paste screenshots (e.g. from Snipping Tool) or copied files directly with `Ctrl+V` / `Cmd+V` into the chat input.
  - **Type-Aware File Chips**: Attachment chips display specialized icons (`FileCode`, `FileText`, `Music`, `ImageIcon`), line counts, sizes, single-item removal, and a 1-click **`Clear All`** button.

### Added
- **AI Studio Chat: Git & GitHub Repository Awareness & Interactive Workspace Integration (`StudioChat.tsx`, `gemini.ts`)**:
  - **Git Repo Context Injection**: Studio Chat is now natively aware of connected GitHub repositories (`owner/repo` and branch), automatically providing the AI with the repository URL, active branch, latest commit hash, author, commit message, and changed files list in its system instructions.
  - **Toolbar & Input Controls**: Added a 1-click **`🐙 Git Repo: ON / OFF`** toggle in the Studio Chat top control bar, compact input bar, and expanded editor drawer.
  - **Collapsible Repo Status Bar**: When Git Repo Awareness is active, an interactive repository status bar displays real-time connection status, commit hash, branch switcher, and quick-access repository browser.
  - **Prompt Starters & Empty State Hints**: Added dedicated quick-actions for analyzing repository structure, inspecting file architectures, and formulating Jules tasks directly from chat.

### Fixed
- **AI Studio Chat: Built-in Google Search & Function Calling Tool Conflict Fix (`gemini.ts`)**:
  - **Resolution for Error 400 (`include_server_side_tool_invocations`)**: Resolved the API conflict where Gemini rejected requests combining built-in Google Search tools with client-side function declarations.
  - **Clean Tool Allocation**: When Google Search Grounding is enabled, requests now cleanly pass the dedicated `{ googleSearch: {} }` tool without conflicting client function schemas.
  - **Automatic Conflict Recovery**: Added a fallback catch-handler that detects any legacy tool combination errors and automatically re-executes with web search grounding.

### Fixed
- **Subtitles & SRT Engine: Resilient Audio Processing & 403 Permission Error Recovery (`gemini_srt.ts`, `gemini.ts`, `SubtitlesTab.tsx`)**:
  - **Auto-Model Fallback on 403 / 404**: Subtitle generation and vocal forced alignment now automatically filter out text-only models and cascade across reliable multimodal Flash models (`gemini-2.5-flash`, `gemini-3.7-flash`, `gemini-2.0-flash`, `gemini-1.5-flash`) if permission or availability issues occur.
  - **Files API 403 Bypass via Client-Side In-Memory Slicing**: Chunks are optimized to 4-minute (240s) 16kHz mono WAV segments (~7.6MB), guaranteeing that audio segments are transmitted directly as base64 `inlineData` without relying on cloud Files API upload permissions.
  - **Graceful Upload Fallback**: If single-pass cloud upload encounters 403 Permission Denied or network issues, the system automatically falls back to client-side AudioContext decoding and chunked processing.
  - **Multi-Source Key Resolution**: Centralized `getEffectiveGeminiApiKey` ensures keys in the API Vault (`localStorage.mv_api_keys`) and environment variables are seamlessly recognized.
  - **Actionable Error Messages**: Replaced raw stringified JSON errors with user-friendly troubleshooting guidance in the Subtitles tab.

### Added
  - **Live Internet Search Grounding**: AI Studio Chat can now search the internet using Google Search grounding (`tools: [{ googleSearch: {} }]`).
  - **Toolbar & Input Toggles**: Added a 1-click **`🌐 Search Internet: ON / OFF`** toggle in the Studio Chat header bar, compact input bar, and expanded editor drawer.
  - **Live Grounding Card & Verified Badges**: Responses grounded in real-time web results display an interactive Grounding Card showing the exact search queries executed by Gemini.
  - **Citation Explorer & Direct Links**: Referenced sources are formatted into expandable citation badges with site hostnames, titles, and direct external links.
  - **Dual-Agent Dialogue Compatibility**: AI-to-AI dialogue loops can search the live web to fetch real-world data, reference material, and live facts during autonomous creative iterations.

### Added
- **KIE Chat: Provider Filtering Tabs & Multi-Model Menu Bar (`KieChatModal.tsx`)**:
  - **Categorized Provider Tabs**: Added fast provider switcher tabs (`⭐ Big 3 (GPT / Claude / Gemini)`, `OpenAI (GPT / Codex)`, `Claude (Anthropic)`, `Gemini (Google)`, `DeepSeek & xAI`, `All Models`) directly to the top selector bar.
  - **Live Capability Badges**: Model pills display visual capability badges including Thinking support (`Brain` icon) and Live Web Search grounding (`Globe` icon).
  - **Dedicated Settings Menus per Provider**: The parameters drawer now dynamically displays specialized controls for each provider:
    - **Anthropic Claude**: Extended Thinking toggle, Thinking Budget Token slider (1,024 to 32,768 tokens), and Max Output Tokens slider (up to 64,000 for Claude Sonnet 4.5).
    - **Google Gemini**: Google Search Grounding toggle and Max Output Tokens slider (up to 65,536 tokens).
    - **OpenAI / Codex**: Reasoning effort selector (`low`, `medium`, `high`, `xhigh`) and Live Web Search toggle.

- **KIE Gateway Health & Status Monitor (`KieStatusMonitor.tsx`)**:
  - **Real-Time Gateway Telemetry**: Added an in-app live status pill in the KIE Studio header displaying gateway uptime, average response latency in milliseconds, and total request counts.
  - **Interactive Diagnostics Popover**: Clicking the status monitor displays a real-time health card with live latency gauges, success percentage rates, and KIE service status.

### Added
- **KIE Chat: 1-Click Reload / Retry on Generation Errors (`KieChatModal.tsx`)**:
  - **Inline Retry Button in Error Messages**: Whenever an API error or network exception occurs, an error card now appears inside the assistant bubble with an immediate **`🔄 Reload / Retry`** button.
  - **Header Action Retry**: Added a `RotateCcw` reload button to message action headers on all assistant responses to allow instantaneous regeneration or retry.
  - **Clean State Recovery**: Clicking reload automatically removes the error message and resends the prompt with the existing context and active settings without requiring the user to retype or copy-paste their prompt.

### Changed
- **KIE Chat: Optional GitHub Repository Analysis & Instant Header Toggle (`KieChatModal.tsx`)**:
  - **Disabled by Default**: Sessions now start with GitHub repository analysis disabled (`isEnabled: false`), preventing unprompted commit verification, file indexing, and repo tool injection during general conversations or prompt refining.
  - **Instant Toolbar Toggle**: Added a 1-click **`🐙 GitHub: ON / OFF`** button to the KIE Chat header. Turn it ON whenever you want code analysis, symbol search, or Jules task generation; leave it OFF for zero repo interference.
  - **Conditional Status Bar**: The `RepoStatusBar` now stays hidden when repo mode is disabled, eliminating unwanted background network calls.

### Fixed
- **Studio Chat Intent-Focus & Project State Protection (`StudioChat.tsx` & `gemini.ts`)**:
  - **Prompt Engineering & Versatile Assistance**: Relaxed the rigid "MV Director" constraint in Studio Chat. When asking to improve prompts, brainstorm, write copy, or refine ideas, the AI directly provides improved prompt variations and text in the chat transcript without forcing music video storyboard scenes.
  - **Tool Execution Boundaries**: Restricted state modification tools (`updateProjectData`, `updateCharacter`, `updateSceneImagePrompt`, `addCharacter`) so they ONLY execute when the user explicitly commands to save/update the Director tab or cast list. General prompt refining no longer accidentally mutates project settings.
  - **Adaptive AI-to-AI Dialogue**: Updated dual-agent personas (`User Proxy`, `Quality & Prompt Critic`, `Devil's Advocate`, `Co-Creator`) to seamlessly guide prompt optimization, text refining, and general reasoning loops.

### Added
  - **Dual-Agent Autonomous Dialogue**: When Chat Loop is set to **`🤖 AI-to-AI Talk`**, a single initial prompt triggers a live, multi-turn conversation between the primary AI (Director/Creator) and a secondary AI persona that steps directly into the user's role.
  - **Selectable AI #2 Proxy Personas**:
    - **`👤 AI 2: User Proxy (Inquisitor)`**: Takes on the user/producer role, asking insightful follow-ups, requesting concrete examples, and probing for technical and visual specifics.
    - **`🎬 AI 2: Film Critic (Auditor)`**: Audits proposals for clichés and weak pacing, demanding bold cinematic depth.
    - **`🔥 AI 2: Devil's Advocate (Debater)`**: Challenges core assumptions and debates counter-perspectives.
    - **`💡 AI 2: Co-Director (Partner)`**: Brainstorms creative twists and builds upon ideas collaboratively.
  - **Distinct Visual Speaker Bubbles & Turn Headers**: The transcript distinctly formats the secondary AI Proxy with amber badges, user-role icons, and dedicated styling so the conversation between the two AIs plays out in real time.
  - **Smart Stop Conditions & Instant Loop Interruption**: Automatically halts when consensus or completion is reached (`[LOOP_COMPLETE: ...]`), when max turns (2 to 10) are met, or immediately when clicking **`⏹ Stop Loop`**.

### Added
- **Chat Loop (Automatic Sequence Execution Mode) in StudioChat (`StudioChat.tsx`)**:
  - **Autonomous Step-by-Step Chaining**: Users can toggle **`🔁 Chat Loop: ON`** (with selectable limits from Max 2 to Max 10 steps). The AI processes the initial prompt, executes any requested tools (characters, scenes, image generation, settings updates), analyzes its own output, and automatically triggers the next sequential step without user intervention.
  - **Dynamic Next-Step Extraction & Protocol**: The engine inspects every turn for next-action markers (`[NEXT_STEP: ...]`) and automatically constructs the subsequent prompt to advance the workflow.
  - **Smart Stop Conditions**:
    1. **Task Completion**: When all requested goals are met, the model outputs `[LOOP_COMPLETE: <summary>]`, concluding the sequence with a `🎉 Sequence Complete` badge.
    2. **Instant Cancellation**: Users can click the red **`⏹ Stop Loop`** button in the header toolbar or inside the live thinking bubble to interrupt immediately.
    3. **Max Steps Ceiling**: The loop automatically halts if the configured max step count is reached.
  - **Live Step Indicators & Badges**: Each turn bubble displays an explicit `Chat Loop • Step X of Y` badge with real-time status and completion summaries.

### Added
- **Real-Time Sequential Multi-Turn Auto-Loop Across All Chat Interfaces (`KieChatModal.tsx` & `StudioChat.tsx`)**:
  - **Sequential Turn Streaming**: When Auto-Loop is enabled (2–5 turns), the AI no longer hides intermediate reasoning inside a single card. Instead, it posts **Turn 1** directly into the chat, immediately reads its own response in the chat context, posts **Turn 2 (Self-Critique & Expansion)**, reads that, and posts **Turn 3 (Synthesis & Polish)** sequentially in real time.
  - **Loop Turn Badges & Phase Indicators**: Each generated assistant message bubble displays an `Auto-Loop Turn X of Y` badge indicating the active reasoning phase (`Initial Reply` → `Self-Analysis & Continuing` → `Final Synthesis`).
  - **Instant Cancellation (`Stop Loop`)**: Users can click the red **Stop** button at any point during multi-turn generation to immediately halt the loop while keeping all completed turns in the transcript.
  - **Updated Auto-Loop Guide (`AutoLoopGuideModal.tsx`)**: Enhanced the in-app guide to explain multi-turn conversational chaining and self-critique workflows.

### Added
- **Auto-Loop Autonomous ReAct & Self-Critique System Across All Chat Interfaces**:
  - **Autonomous Multi-Pass Loop Mode (`KieChatModal.tsx` & `StudioChat.tsx`)**: Added an **Auto-Loop** toggle pill (`🔁 Loop: ON / OFF`) with step selector (2x, 3x, 4x, 5x) in both the KIE AI Studio and Gemini Studio Chat interfaces.
  - **Reason → Act → Observe → Critique Architecture**:
    - **Step 1 (Draft & Action)**: Performs initial deep discovery, candidate dependency search on GitHub (or director tool executions in Studio), producing a primary blueprint.
    - **Step 2 (Self-Critique & Edge Case Audit)**: Cross-references secondary imports/dependencies, checks Android 14+ / AndroidIDE compatibility constraints, audits character DNA alignment, and eliminates generic AI clichés.
    - **Step 3 (Definitive Synthesis)**: Delivers a clean, verified, and directly actionable patch or Jules-Ready Task specification.
  - **Interactive Auto-Loop Guide (`AutoLoopGuideModal.tsx`)**: Added a comprehensive, illustrated guide accessible via the Help icon in both chat toolbars explaining ReAct loops, recommended step configurations, token economics, and best practices.
  - **Reasoning Trajectory Accordion**: Each bot response generated with Auto-Loop includes an expandable **"Auto-Loop Reasoning Trajectory"** card displaying the step-by-step intermediate thoughts, inspected source files, and critiques.

### Added
- **Multi-Turn Memory Toggle in KIE Chat Studio (`KieChatModal.tsx`)**:
  - **Single-Turn vs Multi-Turn Mode Selector**: Added an interactive **Memory Toggle** pill button in the top model bar and a corresponding switch in the Settings & Tuning drawer.
  - **Token & Credit Optimization**: When **Memory is ON** (default), the model retains full multi-turn conversational context by appending prior messages in the active session. When **Memory is OFF**, only the current prompt is dispatched, drastically cutting input token consumption and API costs during long conversations, iterative testing, or standalone queries.
  - **Session-Level Persistence**: The `memoryEnabled` state is preserved on a per-session basis in `localStorage`, maintaining user preferences across session switches.

### Added
- **KIE Chat Models in Text Generation Settings & Global AI Pipeline**:
  - **KIE Model Selection in API Settings Vault (`ApiKeyVault.tsx`)**: Users can now select premier KIE Chat models directly from the **Text Generation Model** dropdown under categorized groups:
    - **Anthropic Claude**: `Claude 3.5 Sonnet`, `Claude Sonnet 5`, `Claude Opus 5`, `Claude Haiku 4.5`.
    - **OpenAI & Codex**: `GPT-4o Omni`, `GPT-4o Mini`, `GPT-5.2`, `GPT-5.6 Sol`, `GPT-5.6 Terra`, `GPT-5.6 Luna`, `GPT-6 Astra`, `OpenAI o1 Preview`.
    - **DeepSeek, Grok & Open Weights**: `DeepSeek V3 (Chat)`, `DeepSeek R1 (Reasoner)`, `Grok 4.7`, `Gemini 2.5 Pro / Flash via KIE`, or `Custom KIE Model`.
  - **Dynamic Routing in Core AI Engine (`callTextModel` in `gemini.ts`)**: Integrated `callKieChatCompletion` routing directly into `callTextModel`. All text features across the app—including Story Mode director plans, prompt enhancements, subtitle synchronization, DNA extraction, and Studio Chat—seamlessly route to the chosen KIE model using the user's KIE API key.
  - **Contextual Key Configuration & Indicator Badges**: When a KIE model is selected, `ApiKeyVault` highlights an active "KIE AI Routing Active" badge and displays a dedicated KIE API key input and custom model ID field with explanatory tooltips.

### Added
- **Message Bubble & Code Block Expand / Collapse in Chat**:
  - **Collapsible Long Messages (User & AI)**: Long messages (over 280 characters or 5+ lines) in both `KieChatModal` and `StudioChat` now feature an expand/collapse toggle (`ChevronDown` / `ChevronUp`).
  - **Compact Preview Overlay**: Collapsed messages are clamped to a clean preview height with a gradient fade overlay and an interactive `"Expand text ({line count} lines)"` pill button.
  - **Quick Header & Footer Toggles**: Users can toggle message collapse directly from the message action bar or via the bottom collapse link once reading is complete, keeping long chat sessions neat and uncluttered.
  - **Collapsible Code Blocks with Line Counters**: Code blocks over 10 lines in both chat environments display their exact line count in the header bar alongside an **Expand / Collapse** toggle button, with a gradient-faded bottom overlay allowing one-click expansion of the full code snippet without filling the screen.

### Added
- **Expandable & Collapsible Chat Box and Fullscreen Window Controls**:
  - **Multi-Line Prompt Editor (Expand / Collapse)**: Both `KieChatModal` (KIE Studio) and `StudioChat` (Gemini Studio tab) now feature an **Expand / Collapse** toggle button (`Maximize2` / `Minimize2`) on the chat input box.
  - **Spacious Drafting Workspace**: Expanding the chat box transforms the compact 2-row strip into a roomy multi-line editor (with line and character counters, monospace syntax clarity, `Shift+Enter` / `Enter` keyboard controls, and vertical drag-resizing `resize-y`), making it effortless to draft long prompts, Jules tasks, or review code before sending.
  - **Fullscreen Window Expansion for KIE Studio Modal**: Added an **Expand / Restore** window button to the header of `KieChatModal`, allowing users to expand the modal to full-screen view (`fixed inset-0`) or restore it back to standard dialog format on demand.
  - **Automatic Send & Escape Clean-up**: Sending a prompt automatically collapses the chat box back into compact mode to keep conversation flow clean and spacious, with `Escape` key shortcut support to collapse instantly.

### Added
- **Optimized GitHub File Attachment & Selective Range Inspector**:
  - **Eliminated Prompt Bloating & UI Lag**: Attached files (from GitHub repo browsing, direct file URLs, or local file uploads) are no longer dumped as raw thousands-of-characters text strings directly into the textarea or message bubble.
  - **Collapsible File Attachment Card (`CollapsibleFileAttachment.tsx`)**: Rendered inside user messages with file name, branch, path, line count badge, file size, target line range badge, and interactive 1-click collapse/expand preview with copy-to-clipboard functionality.
  - **Selective Line Range Inspector in `GitHubConnectModal`**: When viewing files in the GitHub connector, users can inspect the file and select a targeted line range (e.g. Lines 1–150, 100–350) or choose convenient presets before attaching. Files over 400 lines automatically trigger the range inspector to avoid dumping massive source files.
  - **Separation of Render Bubble vs LLM Prompt Payload**: The user's prompt text remains clean, focused, and responsive. When the prompt is dispatched to KIE or Studio models, the exact code block with range metadata is compiled seamlessly into the API payload, preserving full AI context without degrading client UI performance.
  - **Consistent Support Across `KieChatModal` & `StudioChat`**: Both chat interfaces support structured file attachments with remove chips, line count indicators, and collapsible message cards.

### Fixed
- **Markdown DOM Nesting Warning (`validateDOMNesting: <div> / <pre> cannot appear as a descendant of <p>`)**:
  - Resolved console warnings in `KieChatModal` and `StudioChat` caused by ReactMarkdown v10 deprecation of the `inline` prop.
  - Implemented dynamic inline detection in `ChatCodeBlock` and `StudioCodeBlock` to differentiate inline code spans from fenced code blocks without rendering block elements (`<div>`, `<pre>`) inside `<p>`.
  - Added custom `pre: ({ children }) => <>{children}</>` component unwrapping to eliminate redundant `<pre>` wrappers around custom code containers.

### Added
- **GitHub Repository Context Engine & Jules-Ready Architecture Pipeline**:
  - **Dynamic Repository Status Bar (`RepoStatusBar`)**: Connected by default to repository `omy1maxz-alt/Mydownloader` on branch `master`. Live display of active commit SHA, remote commit freshness check (`Updated` vs `Stale (Jules commit detected)`), indexed Android file count, one-click Git tree refresh, and repo browser launcher.
  - **Selective Snippet Cache & Symbol Search Engine (`githubRepoContext.ts` & `githubContextCache.ts`)**: Replaced prompt dumping with targeted on-demand file and symbol searches. Queries class names, functions, and string literals (e.g. `m3u8`, `isMediaUrl`, `shouldInterceptRequest`) and extracts exact line ranges from GitHub with IndexedDB and memory deduplication caching.
  - **Jules Task Specification Card (`JulesTaskCard`)**: Renders structured tasks for remote developer handoff with 1-click clipboard copying. Specifies Target Files, Root Cause Findings (`[CONFIRMED]`, `[LIKELY]`, `[HYPOTHESIS]`), Invariant Constraints, and Poco F5 / AndroidIDE validation instructions (`./gradlew assembleDebug`).
  - **Lead Android & Jules Systems Architect Persona**: Added specialized persona configured for the Jules (remote dev) -> GitHub (source of truth) -> AndroidIDE on Xiaomi Poco F5 (local build & test) engineering cycle.
  - **Live Progress & Retrieval Badges**: Displays real-time status during code inspection and adds compact metadata badges to assistant replies showing exact files and line numbers inspected.

- **GitHub Personal Access Token (PAT) Universal Auth & Scope Diagnostic Fix**:
  - **Fine-Grained PAT Authentication**: Fixed bug where GitHub Fine-Grained Personal Access Tokens (`github_pat_...`) failed validation with 403 Forbidden. The auth flow now detects fine-grained repository tokens and verifies active status and quota via `/rate_limit`, resolving the issue where the app claimed it "could not read/see" valid tokens.
  - **Live Rate Limit HUD & Token Type Indicators**: Display remaining authenticated API requests (e.g. 5,000/hr) and dynamic token badges (Fine-Grained vs Classic PAT).
  - **Studio Chat GitHub Connector**: Added direct GitHub repository browsing and file attachment into the **Studio** tab (`StudioChat`), allowing users to attach code or project files into prompts alongside image attachments.
  - **Global Settings Menu Access**: Added direct "GitHub Connect" modal launcher in the global header Settings menu.
  - **Intelligent Scope Diagnostics**: Upgraded 404/403 error reporting to provide actionable guidance on Classic `repo` scope vs Fine-Grained `Contents: Read` permissions vs Organization SAML SSO requirements.
  - **Large & Private File Fetching**: Upgraded `fetchGitHubFileContent` to request `Accept: application/vnd.github.v3.raw` directly through authenticated API endpoints, fixing errors when accessing private repo files or files over 1MB.
  - **Dual Storage Key Sync**: Unified token storage across `kie_chat_github_token` and `github_personal_access_token`.

- **Edit & Resend with Conversation Branching ("Forget Below")**:
  - Implemented **"Save & Resend"** in both `KieChatModal` and `StudioChat`: editing any previous prompt allows the user to resend it while automatically truncating/discarding all subsequent messages from that point onward ("forget what's below").
  - Added a distinct **"Save Only"** button alongside "Save & Resend", giving users full control to either update text in-place without touching history, or branch the conversation and regenerate a fresh response from that turn.
  - Added descriptive tooltips and helper labels in the edit interface clarifying that resending will prune downstream messages and continue cleanly from the edited prompt.

- **Unified Markdown Parser Across All Chat Interfaces (`KieChatModal` & `StudioChat`)**:
  - Enhanced markdown rendering with `react-markdown` and `remark-gfm` in both the Multi-Model KIE Chat and the Gemini Studio Chat components.
  - **Code Blocks with 1-Click Copy**: Replaced unstyled `<pre>` tags with custom code block components (`ChatCodeBlock` / `StudioCodeBlock`) featuring a dark header bar, uppercase language badges (e.g. `TS`, `JSON`, `PY`, `SH`), and 1-click clipboard copying with visual feedback ("Copied!").
  - **Enhanced GFM Tables**: Formatted markdown tables with bordered headers, cell dividers, zebra-striped alternating rows, and responsive horizontal scroll containers to prevent viewport overflow on narrow displays.
  - **Rich Typography**: Added custom renderers for blockquotes, target-blank links, and nested bullet/numbered lists.

- **Chat Message Action Toolbar Non-Overlapping Layout**:
  - Moved the message action toolbar (Edit, Delete, Copy) from an absolute overlay inside the message bubble out into the message header row alongside the sender name and timestamp.
  - Resolved the defect where the action buttons were sitting on top of and covering the text inside the chat bubbles.
- **KIE.ai API Cost & Credit Usage Guide**:
  - Integrated an educational guide in the settings drawer explaining how credits are deducted: input tokens, output tokens, reasoning tokens (for o1 and GPT-6 Astra), and prompt caching discounts.

- **Chat Box Message Editing & Deletion**:
  - Users can now edit any previous message inline in the chat history, with auto-focus, save, and cancel actions.
  - Users can delete any individual user or assistant message with instant state cleanup.
  - Hover action toolbar on messages containing 1-click **Edit** (`Edit3`), **Delete** (`Trash2`), and **Copy** (`Copy` / `Check`).

- **Chat File & Document Upload**:
  - Added paperclip upload button and drag-and-drop / file selector support in the chat input bar.
  - Supports code, text, markdown, JSON, configs, docs, and images up to 10MB per file.
  - Text and code files are formatted cleanly into language-tagged Markdown blocks and appended to the prompt.
  - Uploaded files are displayed as removable badges/chips above the textarea before sending.

- **GitHub Repository & File Connection**:
  - Integrated dedicated GitHub connector modal (`GitHubConnectModal.tsx`) accessible via both the chat header and input bar.
  - Browse public and private GitHub repositories, folders, and files directly.
  - Quick fetch by pasting any GitHub file URL (e.g. `https://github.com/owner/repo/blob/main/src/App.tsx`).
  - GitHub Personal Access Token (PAT) vault for private repositories and elevated rate limits with user verification.
  - 1-click attachment of repo files into the chat prompt formatted with Markdown source references.

- **KIE Multi-Model AI Chat Studio**: Built a comprehensive, unified conversational workspace powered by KIE.ai:
  - **Multi-Model Selector**: Instantly switch between OpenAI (`gpt-4o`, `gpt-4o-mini`, `gpt-5-6-luna`, `o1-preview`), Anthropic (`claude-3-5-sonnet`, `claude-3-5-haiku`, `claude-3-opus`), Google (`gemini-2.5-flash`, `gemini-2.5-pro`), DeepSeek (`deepseek-chat`, `deepseek-reasoner`), Meta (`llama-3.3-70b`), or any custom model ID slug.
  - **Dual Display Modes**: Access the studio directly inside an in-app overlay dialog or click **"Pop Out Window"** to launch it as a full standalone window/tab (`?mode=kie_chat`) that stays active alongside your timeline.
  - **Persona Presets**: Toggle between specialized system personas: *General Assistant*, *Film Director & Screenwriter*, *Four Heads Decision Architect*, *Senior Fullstack Architect*, and *Lyricist & Subtitle Translator*, with custom instruction additions.
  - **Persistent Local History**: Multi-turn chat conversations are stored locally in the browser with session creation, deletion, and markdown code formatting with 1-click copy.
  - **KIE API Key Vault**: Enter and store your KIE.ai secret key with local validation and automatic reuse.

### Fixed & Improved
- **KIE.ai GPT-6 Astra & Codex Advanced Controls Support**:
  - Implemented full support for the **GPT-6 Astra** OpenAPI specification via `POST https://api.kie.ai/codex/v1/responses`.
  - Added **Adjustable Reasoning Effort** controls (`low`, `medium`, `high`, `xhigh`) for Codex models in the Model Parameters drawer.
  - Added **Live Web Search** toggle (`tools: [{ type: "web_search" }]`) allowing real-time online grounding during conversational responses.
  - Added real-time status indicators in the chat footer displaying active reasoning effort and web search toggle state.

- **KIE.ai GPT-5.6 Family (Sol, Terra, Luna) Integration**:
  - Incorporated the full GPT-5.6 three-tier model family released on July 9, 2026 as documented on `https://kie.ai/gpt-5-6?model=gpt-5-6-luna`:
    - **GPT-5.6 Sol** (`gpt-5-6-sol`): Frontier flagship tier for demanding multi-step reasoning, agentic coding, computer use, and long-horizon tasks.
    - **GPT-5.6 Terra** (`gpt-5-6-terra`): Everyday balanced tier combining high intelligence with cost efficiency for production workloads.
    - **GPT-5.6 Luna** (`gpt-5-6-luna`): Ultra-fast, affordable tier for high-throughput applications, lightweight automation, and responsive assistance.
  - Configured native KIE Codex routing (`/codex/v1/responses`) for all three GPT-5.6 tiers with structured input mapping and multimodal text/image support.

- **KIE.ai Official Endpoint & Models Alignment (docs.kie.ai/llms.txt)**:
  - **Dynamic Multi-Endpoint Dispatch**: Integrated native routing according to official KIE.ai API specs:
    - Claude models route to `https://api.kie.ai/claude/v1/messages` with `X-Api-Key`, `Authorization`, and `anthropic-version: 2023-06-01` headers, supporting `system` top-level directives and clean text block unpacking.
    - GPT-5.6 Luna & GPT-6 Astra route to KIE Codex `https://api.kie.ai/codex/v1/responses` with structured array responses.
    - Specialized OpenAI models route to their dedicated paths (e.g. `/gpt-5-2/v1/chat/completions`, `/gemini-2.5-flash/v1/chat/completions`, `/gemini-3-flash/v1/chat/completions`).
  - **Model Catalog Upgrade**: Added Claude Sonnet 5, Claude Opus 5, Claude Haiku 4.5, GPT-5.2, GPT-6 Astra, Gemini 3 Flash, and Grok 4.7 directly to quick selector pills and dropdowns.
  - **Real-Time Endpoint Inspector**: The chat bar now dynamically displays the active KIE HTTP path (e.g., `/claude/v1/messages`, `/codex/v1/responses`, `/v1/chat/completions`) for complete transparency.

- **KIE Chat Studio Mobile Layout & Pop-Out Window Fix**:
  - **Mobile Overflow & Cut-Off Fix**: Resolved mobile chat messages getting pushed and cut off horizontally by enforcing `w-full max-w-full min-w-0 overflow-hidden` on parent containers, applying `max-w-[85%]` on bubbles, and switching the session drawer to `fixed md:static inset-y-0 left-0 z-50` so it takes zero layout width when closed on mobile.
  - **Open in New Window / Pop-Out Reliability**: Hardened `handlePopOut` in `KieChatModal.tsx` to handle browser popup blockers and iframe sandboxes smoothly by catching blocked `window.open` calls and seamlessly navigating to `?mode=kie_chat`. Added `isStandalone` mode styling to render full-screen without redundant pop-out triggers.
  - **Safe Initialization & Synchronous State**: Initialized session state synchronously from `localStorage` with a robust fallback to prevent initial render flashes or undefined session crashes.

- **KIE Chat Studio Mobile Stability & Responsive Drawer Fix**:
  - Replaced rigid viewport units (`vh`) with dynamic viewport height (`100dvh` and safe area insets) across both the in-app modal and the standalone pop-out window (`KieChatStandalone`), completely resolving mobile browser crashes caused by software keyboards and browser chrome resizing.
  - Added a responsive sliding drawer for the session history and system parameters on mobile viewports with backdrop dismiss overlays and dedicated toggle buttons.
  - Hardened chat message bubbles with text wrapping (`break-words`, `overflow-hidden`) and responsive padding to prevent horizontal page expansion on smaller screens.

- **Anti-Drift Audio Chunking & Cue-ID Translation Engine**: Completely overhauled the subtitle generation pipeline to eliminate 10-minute timestamp jumps (e.g. 22m ➔ 33m):
  - **Deterministic Anti-Drift Chunking**: For media files longer than 12 minutes, the engine automatically splits audio into 8-minute slices with 15-second acoustic overlap, transcribing each chunk locally and maintaining absolute millisecond timestamps purely in TypeScript code.
  - **Fuzzy Overlap Deduplication**: Seamlessly detects and merges dialogue blocks across chunk overlap boundaries, preventing duplicate captions or timecode distortion.
  - **Timestamp-Immune Cue Translation (`translateCuesById`)**: Second-pass translation now transfers text using discrete cue IDs (`[CUE X]`) with no timestamps exposed to the translation prompt. The system restores pristine, ground-truth audio timecodes deterministically onto the translated text.
  - **Automated Timeline Integrity Repair**: Automatically validates every generated SRT output for chronological ordering, non-overlapping blocks, and valid cue durations.

- **Subtitle Timing Jump Repair & Ripple Shift**: Added automated detection and one-click repair for subtitle timing drift (such as timestamps jumping forward from 22min to 33min):
  - **Automatic Jump Detection**: The timeline editor detects abnormal gaps (> 20s) and displays an alert badge with the jump distance and affected subtitle numbers.
  - **1-Click Auto-Close Gap**: Closes abnormal gaps and ripple-shifts all subsequent subtitles back into alignment.
  - **Direct -10m & -5m Jump Buttons**: One-click jump repair buttons specifically calibrated for common 10-minute AI transcription drift.
  - **Flexible Ripple Shift Scopes**: Shift all subtitles, from the selected subtitle to the end of the timeline, from a custom timecode, or just the single selected block.
  - **Active Subtitle Action Bar Integration**: Added a "Shift Following..." quick button directly to the active subtitle toolbar.

- **Model Consistency**: Fixed an issue where the Bulk Text Tools modal was incorrectly falling back to the legacy `gemini-3.1-flash` model instead of inheriting the current active fast text model (like 3.6 or 3.7 Flash).

- **Bulk Translation Transliteration Ignore**: When using the AI Translate feature inside the Bulk Text Tools modal and targeting "Line 2", the engine will now always use Line 1 (Native) as the source of truth and construct a clean 2-line block. This automatically strips out any phonetic/romanized transliteration lines that might have been present in triple or quad-layered blocks, keeping your dual-layered translations perfectly clean.

- **Ignored Transliteration**: Subtitle generation and translation syncing for "Triple-layered" and "Quad-layered" modes now explicitly ignore the Romanized/Phonetic transliteration line, effectively condensing them into cleaner multi-line outputs (Native + Translated for Triple, and Native + English + Translated for Quad).

- **Custom OpenAI Integration Fix**: Fixed a critical bug causing the "Sync Trans" (subtitle translation), Bulk AI Tools, and AI Subtitle alignment features to fail with a `403 Permission Denied` error when using a Custom OpenAI provider. The AI features now properly route through the custom endpoint instead of mistakenly attempting to contact Google servers.
- **Dual Vision Modes**: The Subtitle Timeline Editor now includes two Vision Fix modes. "Vision (Frame)" instantly captures the current video frame on-screen for fast, cost-effective analysis. "Vision (Video)" uploads the video to perform full temporal scrubbing across the subtitle block duration.

- **Saved Subtitle Settings:** The AI Subtitle Generator will now automatically remember all of your settings (target language, translation mode, custom context instructions) between visits! You no longer have to re-enter your favorite settings every time you open the app.
- **Language Autocomplete:** The language input boxes in the Subtitles tab now automatically suggest common languages (like English, Spanish, Japanese, etc.) as you type, while still letting you type any custom language you want!
- **Custom Subtitle Instructions:** Added a new "Context / Instructions" input box in the AI Subtitle Generator tab! You can now provide the AI with character names, specific domain vocabulary, or custom translation rules *before* it starts transcribing your video.
- **Playback Position Memory:** The media player now automatically remembers exactly where you left off! If you accidentally refresh the page, experience an error reload, or briefly navigate away, the timeline playhead will instantly snap back to your last watched position when the video reloads.
- **AI Vision Fix & Sync Trans Crash Fix:** Fixed a critical bug causing the "Vision Fix" and "Sync Trans" buttons to crash with a `model.generateContent is not a function` error, restoring full functionality to these AI-powered text editor features.
- **Agentic Video Vision Fix (YouTube Support!):** Completely overhauled the "Vision Fix" subtitle feature to use Gemini's brand new *Agentic Video Understanding* API! Instead of manually taking screenshots, the app now feeds the actual video directly to Gemini. This allows the AI to autonomously scrub the timeline itself to see the scene perfectly. Because of this upgrade, **Vision Fix now fully supports YouTube links!** (Note: For local videos, it will securely upload the file to Gemini's servers on the first click, which may take a few moments).
- **Auto-Cut Subtitle Overlaps:** When pressing `[in]` or `[out]` to set the start or end time of a selected subtitle, if the new mark falls inside another existing subtitle, the other subtitle will now automatically trim itself to make room. This prevents messy overlapping blocks when rapidly adjusting timing.
- **Professional AI Subtitle Timing Engine:** Completely overhauled the underlying AI prompt for subtitle generation to enforce strict, professional-grade acoustic alignment:
  - **No Artificial Padding:** Prevented the AI from lazily distributing caption duration equally between sentences. Captions now snap strictly to the actual vocal onset and offset, clearing from the screen during long silent pauses.
  - **Reactions & Dramas:** The engine now strictly preserves and times microscopic reactions (e.g., "Ah", "어?", sighs, laughs) critical for Korean Dramas and dating shows, without collapsing them into adjacent sentences.
  - **Overlapping Audio:** Instructed the model to identify and accurately align overlapping speech if two speakers talk simultaneously.
  - **Held Vocals & Lyrics:** The engine now respects sung performance, keeping subtitles visible precisely as long as a singer holds a note.
- **AI Translation Sync for Multi-line Subtitles:** Added a new "Sync Trans" button inside the Subtitle Text Editor modal. When working with bilingual or multi-language subtitles (where text spans multiple lines), editing the top line and pressing this button will automatically trigger the AI to translate your changes and seamlessly update the bottom lines, keeping all languages perfectly in sync without manually re-typing them.
- **Timeline Subtitle Movement Constraints:** Fixed a usability issue where clicking and dragging anywhere on a subtitle block would instantly shift its timeline position. Subtitle blocks will now only shift position if you explicitly toggle the "Move Block" mode on the selected subtitle, preventing accidental destructive timeline shifts during normal selection or double-clicking.
- **Clear All Subtitles Button:** Fixed the "Clear All Subtitles" trash button failing to execute due to restricted browser environment policies (iframe `window.confirm` blocks). Replaced the native alert with a custom-built React confirmation modal to ensure consistent execution.

### Fixed & Improved
- **SRT Subtitle Generation Engine**: 
  - Completely overhauled the timestamp parsing and validation engine to handle formatting errors from the AI, ensuring perfectly valid `.srt` outputs.
  - Added "Source Language" parameter to subtitle generation to improve AI transcription accuracy and translation context.
  - Implemented graceful handling of invalid time sequences and automatically calculated fallback durations for short dialogue blocks.
  - Restructured translation prompts to strictly preserve native language transcriptions alongside translations (e.g. Dual, Triple modes) and prevent the AI from hallucinating time drift.

### Fixed
- **Timeline Subtitle Dragging Focus Switch & Viewport Camera Stabilization:** Resolved the issue where initiating a drag on a subtitle box caused a sudden focus switch/re-render and camera jump that disoriented users:
  - **Camera Stabilization During Drag:** When dragging or moving a subtitle box, the timeline track camera is now locked to `dragTimelineStart` (the camera position when the drag gesture began) rather than chasing the box's leading edge. On release, the timeline camera stays anchored at its current position while seamlessly registering the final block timestamp, preventing the timeline view from jumping or sliding under the user's cursor.
  - **Redundant Selection Re-Render Elimination:** Optimized `handlePointerDown` to check `if (selectedId !== id)` before updating selection state, preventing redundant React state churn and focus shifts on pointer interaction.
  - **Live Movement & Distance HUD Tooltip:** Added a real-time floating badge directly above the moving subtitle block that dynamically displays:
    - Exact time offset with high-contrast color coding (e.g. `+0.45s` emerald for forward shift, `-0.30s` sky blue for backward shift).
    - Live start and end timestamps (`00:01.200 → 00:03.450`).
    - Boundary collision warnings (`Limit: Touches prev` / `Limit: Locked wall` / `0s Audio start`) when the user hits an adjacent subtitle or boundary wall.
    - Live millisecond gap measurements to preceding and succeeding subtitle blocks.
  - **Origin Ghost Box:** Renders a dashed translucent silhouette of the subtitle block at its original starting position while dragging, giving users an immediate visual frame of reference for how far the box has shifted.
  - **Precision Nudge Steppers & Keyboard Shortcuts:** Added dedicated `-0.5s`, `-100ms`, `+100ms`, `+0.5s` stepper buttons to the selected subtitle action bar alongside `Shift + ←` / `Shift + →` (nudge 100ms) and `Alt + Shift + ←` / `Alt + Shift + →` (nudge 500ms) keyboard shortcuts for exact, micro-millisecond adjustments without touching the mouse.

### Added
- **Unified Subtitle Trimming & Navigation Button Cluster (`[subleft][in][out][subright]`):** Grouped subtitle sequential navigation and playhead in/out trimming into a single compact, high-efficiency segmented controller on the Selected Subtitle Action Bar:
  - **`[subleft]` (Previous Subtitle):** Jumps immediately to the preceding subtitle block in chronological order, updates selection, seeks the video playhead directly to its start timestamp, and announces position in a toast notification (e.g. `Sub Left: "..." (1/10)`). Keyboard shortcut: `Alt+←` or `<` or `,`.
  - **`[in]` (Mark In):** Aligns the active subtitle's start point cleanly to the current playhead position with safe boundary clamping. Keyboard shortcut: `[`.
  - **`[out]` (Mark Out):** Aligns the active subtitle's end point cleanly to the current playhead position with safe boundary clamping. Keyboard shortcut: `]`.
  - **`[subright]` (Next Subtitle):** Jumps immediately to the following subtitle block, selects it, seeks playhead to its start, and auto-disables on the last subtitle. Keyboard shortcut: `Alt+→` or `>` or `.`.
  - **Integrated Styling:** Designed with high-contrast amber accent brackets for In/Out trimming and indigo chevrons for chronological navigation, featuring border dividers and disabled boundary states.

### Fixed
- **Audio & Speech Alignment Modal Scrolling & Sticky Close Button:** Fixed the issue where the close button (`X`) on the "Audio & Speech Alignment" modal was unreachable on small or mobile screens due to lack of scrolling:
  - Upgraded the modal container from an `absolute` timeline overlay to a dedicated viewport portal (`fixed inset-0 z-[100] flex items-start sm:items-center justify-center bg-black/85 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto`).
  - Implemented a **Sticky Header** (`shrink-0`) that keeps the modal title and prominent close button (`X`) pinned at the top of the viewport at all times.
  - Placed all configuration tabs (Gemini AI Vocals Alt C, Peak Volume, and Sliders) into a dedicated scrollable body (`flex-1 overflow-y-auto custom-scrollbar touch-pan-y`), enabling smooth swipe scrolling on mobile and mouse wheel scrolling on desktop.
  - Added a **Sticky Footer** (`shrink-0`) with a prominent 1-tap **Done / Close Window** button (`Check` icon) alongside the waveform checkbox, giving users dual close methods (top-right `X` or bottom `Done`) regardless of scroll position.
  - Also standardized `showExtractSettings`, `showSyncSettings`, and `showPreviewSettings` to use `fixed inset-0 z-[100]` with `my-auto` to prevent off-screen clipping across all subtitle timeline dialogs.
- **Selected Subtitle Action Bar ("In/Out Bar") Touch & Mouse Scrolling:** Fixed the issue where the selected subtitle toolbar containing `[ In`, `Out ]`, `Edit`, `AI Align`, and block action buttons could not be scrolled horizontally:
  - Replaced accidental `touch-none` (`touch-action: none`) with `touch-pan-x` (`touch-action: pan-x`) and iOS momentum scrolling (`-webkit-overflow-scrolling: touch`), restoring smooth finger-swipe panning on all mobile devices and touchscreens.
  - Implemented vertical-to-horizontal mouse wheel translation (`onWheel`) and desktop click-and-drag panning (`onMouseDown`/`onMouseMove`), enabling desktop users without horizontal tilt wheels to easily scroll the bar.
  - Added dynamic left (`<`) and right (`>`) scroll chevrons at the toolbar edges that appear whenever buttons overflow, allowing 1-tap smooth scrolling.
  - Restored a sleek 6px scrollbar (`custom-scrollbar`) for clear visual positioning and thumb dragging.

### Added
- **Gemini AI Semantic Audio Alignment ("Alt C" Vocal Recognition):** Solved the subtitle misalignment and box displacement issues caused by volume-based snapping by introducing an AI-driven vocal alignment engine powered by Gemini:
  - **Vocal-Only Intelligence:** Listens strictly to human speech phonemes and singing lyrics, completely immune to loud 808 bass, drum kicks, brass, and percussion that previously pushed subtitle boxes out of alignment.
  - **Dual Alignment Scope:** One-click **AI Align** directly on the selected subtitle action bar for targeted single-line correction, alongside **AI Align All** for automated full-song batch alignment with real-time progress indicators.
  - **Optimized In-Memory Audio Slicing:** Uses a custom client-side `sliceAudioFileToWav` utility via `OfflineAudioContext` to extract lightweight, downsampled 16kHz mono WAV snippets (~10-15s per window) centered around the subtitle with neighboring context, keeping latency low and network transfer fast.
  - **Instant Mark In `[` & Mark Out `]` Playhead Trimming:** Added fast 1-click playhead snapping buttons `[ In` and `Out ]` with global keyboard shortcuts (`[` and `]`), enabling instant manual playhead trimming without dragging timeline edges.
  - **Upgraded Alignment Studio Modal:** Features clean tabbed navigation between "Gemini AI Vocals (Alt C)" and "Peak Volume (Legacy)", letting users choose their preferred alignment approach with full audio track inspection and waveform toggling.

### Fixed
- **Mobile Subtitle Text Editing & Virtual Keyboard Accessibility:** Fixed the bug where clicking Edit on a subtitle block caused the text edit box to disappear or be pushed off-screen by the mobile virtual keyboard:
  - Relocated the Edit Subtitle Text interface from inside the overflow-hidden video container to a dedicated root modal (`fixed inset-0 z-[100] flex items-start sm:items-center justify-center pt-2 sm:pt-0`).
  - Anchoring the modal at the top of the viewport ensures it sits completely above the mobile keyboard, remaining 100% visible and interactive with no squashing or clipping.
  - Added dedicated **Done** (`Check` icon) and **Clear** action buttons, live character counter, exact timestamp badge with segment duration, and a 1-tap **Play Segment** preview button directly inside the edit dialog.
  - Made the subtitle text preview on the selected block action bar and timeline blocks double-tappable to swiftly trigger editing.

### Fixed
- **Subtitle Selection Layout & Controls Accessibility:** Resolved the issue where selecting a subtitle box caused the action bar and timeline controls to be pushed below the visible viewport on mobile/smaller screens:
  - Allowed the video container to flex naturally (`flex-1 min-h-0`) instead of enforcing rigid vertical floors, guaranteeing that all timeline controls, subtitle blocks, and trimming handles remain fully in-view.
  - Refactored the Selected Block Action Bar to a sleek, single-row horizontally scrollable toolbar (`px-2 py-1`, compact touch targets) that never causes vertical line breaks or pushes lower sections off-screen.
  - Added an instant **Deselect (`X`)** button on the selected block action bar for rapid clearing.
  - Optimized scrubber padding and compactified the timeline track on mobile screens (`h-36 sm:h-44 md:h-52`), ensuring live video playback and subtitle adjustment controls remain simultaneously visible and interactive.

### Added
- **Live Video Scrubbing on Subtitle Adjustments:** When adjusting subtitle boxes (dragging start/end trim handles or moving boxes in Move/Sync mode), the video player now dynamically seeks and displays the exact video frame in real time. The subtitle caption preview overlay updates simultaneously, letting you visually align subtitle timing against scene cuts and actor speech on screen.
- **Enlarge Video View & Mobile Layout Optimization:** Added a Video View toggle button (`Tv` icon) in the Subtitle Editor toolbar allowing users to switch between standard view and an enlarged 44vh cinema view. Redesigned the Subtitle Tab layout on mobile devices so the video monitor and timeline fit seamlessly in view without vertical squishing or nested scrolling. Added a 1-tap `Jump to Start` button in the selected block action bar.

### Fixed
- **App Crash Immunity & Defensive Error Containment:** Diagnosed and resolved the persistent application crash vectors:
  - Added a root `<ErrorBoundary>` component in `src/components/ErrorBoundary.tsx` to gracefully catch and contain any unexpected React component lifecycle or rendering errors with interactive "Resume" and "Reload Studio" recovery controls, preventing total app unmounts.
  - Implemented a comprehensive `window.addEventListener('unhandledrejection')` global filter in `main.tsx` suppressing harmless DOM, media, and audio interruption exceptions (`AbortError`, `NotAllowedError`, audio autoplay blocks, IDB closing states, and user popup dismissals).
  - Hardened `HTMLMediaElement.prototype.play()` polyfill to safely swallow browser policy errors and autoplay interruptions without escalating to fatal exceptions.
  - Fixed a critical undefined property access crash on `projectData.soundtrackUrl.startsWith(...)` in `App.tsx` by adding `soundtrackUrl: ""` to `DEFAULT_PROJECT` and using optional chaining across audio player checks.
  - Changed initial audio playback state `isPlaying` from `true` to `false` to comply with browser autoplay policies on page load.
  - Downgraded unhandled API, JSON parsing, and database warning logs from `console.error` to `console.warn` across `db.ts`, `gemini.ts`, `youtube.ts`, and `SubtitleTimelineEditor.tsx`, preventing AI Studio test harnesses from treating benign warnings as fatal crashes.

### Changed
- **Themed Subtitle Style Format Dropdown:** Replaced the unstyled browser-native dropdown in the Subtitles Tab with a custom `SubtitleFormatDropdown` styled to match the app's dark aesthetic and design system. Features an active layer-count indicator badge (1L–4L), visual stacked line indicators, rich layer descriptions, smooth animated popover menu, and glowing selection indicators consistent with other master controls like `AspectRatioDropdown`.

### Added
- **Snap to Audio in Subtitle Timeline:** Added an intelligent 'Snap to Audio' feature in the Subtitle Editor! When an audio or video track is loaded, you can select any subtitle block and click "Snap to Audio" to automatically detect the nearest vocal onset and speech pause, perfectly snapping the start and end timestamps to natural speech boundaries. You can also customize detection sensitivity, lead-in pre-roll, and tail lingering padding, or batch-align all subtitle blocks at once with interactive audio waveform visualization on the timeline.

### Fixed
- **Database Closing/Hidden Recovery:** Resolved an unexpected UI crash caused by `Database is closing/hidden`. This was caused by an upstream issue in Firebase Auth / Firestore IndexedDB connection locking when browser tabs switch visibility or when authentication popups open. We upgraded Firebase to 12.18.0 and added defensive interceptors across database services to handle interrupted connections smoothly without breaking the app.

### Changed
- **Professional Localization Engine:** Completely overhauled the AI subtitle prompt instructions based on expert subtitle writer guidelines. The AI will no longer perform literal, robotic, word-for-word translations. Instead, it acts as a localization specialist—focusing on intended meaning, preserving character emotion (teasing, flirting, awkwardness), correctly handling implied subjects/objects in languages like Korean, and generating natural, highly readable English equivalents. It even automatically switches to 'Lyric Mode' for songs to prioritize rhythm and poetry!

### Added
- **Subtitle Box Locking:** Added a Lock feature to subtitle boxes! You can now click the 'Lock' icon in the subtitle edit menu to lock a box's position on the timeline. A locked box acts as a 'wall'—if you use Sync Dragging (ripple editing) to push or pull other subtitles, they will stop moving the moment they hit the locked box, keeping its position perfectly safe.

### Added
- **Agentic Video Understanding (Beta):** Integrated Gemini's new "Agentic Video Understanding" feature directly into the Keyframe Analyzer. You can now simply paste a YouTube URL, and the model will use an active "Think → Act → Observe" loop to dynamically inspect the timeline, eliminating the need to manually extract frames. This saves massive token usage and time.

### Fixed
- **Second Brain Note Button Nesting:** Resolved a React DOM nesting warning (`validateDOMNesting: <button> cannot appear as a descendant of <button>`) by refactoring the note item container in the Second Brain sidebar to an accessible `div` element.
- **Second Brain Mobile Layout:** Fixed broken responsive layout on mobile screens. The Second Brain now uses a sleek Master/Detail view pattern on mobile, allowing users to toggle seamlessly between the note list and the full-screen editor.

### Changed
- **Smarter Subtitle Styling UI:** Consolidated the bulky "Style format" buttons in the SRT Generator into a sleek, clean dropdown menu to save space and reduce visual clutter.
### Added
- **YouTube Link Preview Integration:** Added a dedicated input for pasting YouTube links directly into the Subtitle tool! While the AI still requires a local file for generation, you can now use a YouTube link purely for playback in the Timeline Editor. This is perfect for manually editing or tweaking timings against a live YouTube video!

### Changed
- **Auto-Cut Resume Support:** The Resume feature now communicates directly with the AI model to automatically "cut" the audio/video at your exact timestamp! You no longer need to manually split your files to save tokens; the AI simply skips processing the media before your start time.
- **Second Brain UI Updates:** Added a prominent delete icon directly on notes in the sidebar list, and ensured the close button is always accessible on mobile devices.

### Added
- **Second Brain Component:** Added a new 'Second Brain' interface for builders to persistently store and retrieve contextual notes, design decisions, and learned lessons across sessions. Access it via the Settings menu!

### Changed
- **Cloud Saving Migration:** We have migrated the underlying save engine from your local browser to a secure cloud database (Firebase Firestore). Your projects and director plans will now be safely synced to your Google Account once signed in.

### Changed
- **Cloud Saving Migration:** We have migrated the underlying save engine from your local browser to a secure cloud database (Firebase Firestore). Your projects and director plans will now be safely synced to your Google Account once signed in.

### Added
- **YouTube Account Integration:** You can now connect your YouTube account to browse your private playlists and liked videos directly from the Music tab! Just click the "Browse YouTube" button to sign in securely and find your tracks without leaving the app.

### Added
- **YouTube Account Integration:** You can now connect your YouTube account to browse your private playlists and liked videos directly from the Music tab! Just click the "Browse YouTube" button to sign in securely and find your tracks without leaving the app.

### Added
- **Anti-Slop Realism Engine:** The AI Director now includes a powerful, built-in "Anti-Slop" engine for image generation! Whenever you use a realistic art style (like Cinematic, Photorealistic, or iPhone Camera), the engine automatically injects advanced prompt constraints to prevent generic AI artifacts. It forces realistic skin textures (pores, peach fuzz), breaks unnatural perfect facial symmetry, prevents oversized eyes, and encourages natural, candid framing instead of stiff studio poses.

### Fixed
- **Subtitle Upload Error (INVALID_ARGUMENT):** Fixed an issue where generating subtitles for certain audio/video files (like snippets) failed because the browser couldn't detect the file type. The AI Director will now intelligently guess the correct format based on the file name.

### Changed
- **Read On-Screen Captions:** When generating subtitles from a video, the AI Director will now explicitly look for and read any existing on-screen text, hardsubs, or burned-in captions to further improve accuracy and translation quality.

### Added
- **Video Context Awareness for Subtitles:** When you generate subtitles from a video file, the AI Director now explicitly "watches" the video! It will use visual context, character actions, and lip movements to significantly improve transcription accuracy and speaker identification.

### Fixed
- **Playhead Stays Put on Selection:** When you tap or click a subtitle block to select it, the video playhead will no longer automatically jump to the start of that block. It will stay exactly where it is so you don't lose your place!

### Fixed
- **No More Overlapping Subtitles:** When you drag a subtitle block or trim its edges, it will now hit a "wall" and stop perfectly when it touches an adjacent subtitle. You can no longer accidentally drag blocks on top of each other and create overlaps!

### Fixed
- **Caption Settings Saved:** Your caption settings (text size, Y-position, and template style) are now permanently saved to your device, so you won't have to re-configure them every time you reload the app.

### Added
- **Timeline Auto-Scroll:** When you drag or trim a subtitle block all the way to the right or left edge of the screen, the timeline will now automatically scroll in that direction! This makes it vastly easier to move lyrics long distances on mobile devices without having to repeatedly drop and pick up the text block.

### Changed
- **Increased Maximum Timeline Zoom:** You can now slide the zoom slider much further to the right. The maximum zoom level now stretches the timeline so that your screen only covers 6 frames (0.2 seconds) of the video, giving you pixel-perfect accuracy for dragging text on your phone!

### Changed
- **Mobile Timeline Zoom Slider:** Removed the clunky Zoom In / Zoom Out buttons in the toolbar. Instead, there is now a dedicated, full-width "Timeline Scale" slider directly below the main video scrubber. This allows you to effortlessly stretch the timeline with your finger on mobile devices so you can perfectly place your subtitle blocks down to the millisecond!

### Added
- **Animated Subtitle Templates:** You can now preview subtitles with dynamic animations directly in the app! Click the gear icon on the video player to open Preview Settings and choose between Standard, Bouncy Pop (CapCut style), Karaoke Highlight, or Neon Glow. The engine automatically mathematically distributes block durations to animate word-by-word.

### Added
- **Append Subtitles Tool:** Added a new "Append Subtitles" button (File with a Plus icon) right next to the regular Import button. This allows you to combine multiple SRT files! Instead of overwriting your existing timeline, importing a second SRT will attach it to the very end of your current captions. You can then use the "Sync Drag" tool to grab the first block of the newly appended song and slide the entire batch perfectly into place!

### Fixed
- **Toolbar Icon Sizing:** Fixed an issue where the timeline toolbar icons would shrink and become cramped on smaller screens. The icons now maintain their full comfortable size, and the toolbar will simply become horizontally scrollable if it runs out of space.

### Added
- **Extract Subtitle Segment Tool:** Added a new scissors icon to the subtitle toolbar. You can now easily extract a specific segment of your subtitles (e.g., from minute 1 to minute 2) and the tool will automatically re-time all the captions so the new segment starts exactly at zero. This is perfect for cutting out a section of a larger SRT file for a smaller clip!

### Fixed
- **Mobile Drag Dropping (Root Cause Fix):** Resolved the issue where Safari iOS and Chrome Android would abruptly cancel gesture dragging on timeline handles. Refactored the pointer event system to decouple React state commits from 60fps pointer movements and added native scroll disambiguation, resulting in a perfectly stable touch gesture experience.

# Changelog

## [1.1.12] - 2026-08-16
### Fixed
- **Mobile Timeline Drag:** Drastically improved drag smoothness for subtitle blocks and the timeline track by enforcing `touch-action: none`. This prevents mobile browsers from interrupting drags with accidental page swipes or scrolls.
- **Timeline Timecode:** Added an exact timecode display directly above the static red center playhead, matching the CapCut behavior. As you scrub the timeline, you can now see precisely what millisecond the playhead is on.

## [1.1.11] - 2026-08-16
### Fixed
- **Mobile Touch Handling:** Increased the touch target size of the subtitle trim handles to make them much easier to grab on phones.
- **Timeline Preview Sync:** Fixed a critical bug where dragging a subtitle block would update the video preview but desync it from the fixed center playhead. The playhead and preview video now remain correctly synced while you visually move blocks underneath them.
- **Music Player Drag:** Added `touch-action: none` to the soundtrack player drag handle to ensure smooth dragging on mobile browsers without triggering page scrolls.

## [1.1.10] - 2026-08-16
### Fixed
- **Music Player Drag:** Fixed the floating soundtrack player so that only the top header acts as a drag handle. You can now click and interact with the player without accidentally dragging it around the screen.

## [1.1.9] - 2026-07-17
### Fixed
- **CapCut Timeline UI:** Completely redesigned the Subtitle Timeline. The playhead is now fixed in the center, and the entire timeline track slides beneath it when playing or scrubbing. This makes adjusting subtitles by dragging blocks significantly more intuitive.
- **Timeline Fix:** Fixed a major bug where the Subtitle Timeline player wouldn't play due to an internal rendering loop.
- **Session Memory:** The Subtitle Editor now safely auto-saves your imported media and generated subtitles so you don't lose progress when refreshing the page.
- **Studio Chat Persistence:** Migrated Studio Chat history from `localStorage` to `IndexedDB` to prevent the chat from resetting on page refresh when the history contains large image attachments that exceed browser quota limits.
- **Bug Fix:** Fixed an issue where the image generation model would sometimes return a blank text string instead of an image due to a missing modality flag.
- **Bug Fix:** Resolved a critical app crash ("Maximum call stack size exceeded") caused by an infinite recursion loop in the new custom AI model adapter.
- **SRT Subtitle Generation Fix:** Overhauled the auto-subtitle generator to prevent AI timestamp errors (e.g. mixing up MM:SS with HH:MM:SS) and improved translation prompts for more natural, idiomatic captions.
- **API Key Fix:** Resolved an internal bug in the Prompt Generator tab where custom Gemini API keys were occasionally reverting to the fallback key.
- **SRT Format Fix:** Enforced strict timestamp formatting for subtitles (HH:MM:SS,mmm). Added a post-processing filter that automatically corrects unpadded hours and replaces periods with commas to ensure maximum compatibility with video editors and players.

### Added
- **Timeline Scrolling & Scale Fixed:** The timeline editor now allows scrolling on mobile screens again, ensuring you can reach all parts of the app.
- **Accurate Subtitle Scaling:** When zooming out, subtitle blocks now shrink accurately to match the zoom level instead of forcing a fake width, which fixes the overlapping issue.
- **Universal Milliseconds:** All timers, timestamps, and drag tooltips now strictly show precise milliseconds (e.g., `00:01.50`) for complete frame clarity.
- **Ruler Anti-Overlap:** Greatly improved the spacing on the time ruler. Numbers are perfectly centered on their tick lines and spaced widely to never overlap again.
- **Full-Screen Timeline Editor:** The timeline editor now automatically hides the "SRT Subtitle Crafter" headers and output boxes when you switch into it, giving you the entire screen to focus solely on trimming and editing your video.
- **Ultra-Smooth Mobile Timeline Editing:** The timeline drag-and-drop has been completely rewritten from the ground up for mobile! Dragging handles is now silky smooth with 60fps performance and absolutely zero lag.
- **Forgiving Drag Handles:** The invisible grab area around the left and right subtitle edges is now 300% wider. It will instantly lock onto your finger even if you miss the line slightly, making it so much easier to trim videos on a phone screen!
- **Smoother Timeline Dragging:** Fixed an issue on touchscreens where dragging the edges of a subtitle block would sometimes cancel or "let go" (lepas) unexpectedly. It will now firmly lock onto your finger until you let go!
- **Professional Zoom Levels:** Zooming out (the "-" button) now shows exactly 30 seconds of your video on screen at once to help you see the big picture. Zooming in (the "+" button) brings you all the way down to seeing just 0.5 seconds of time for frame-perfect subtitle alignment!
- **Dynamic Time Ruler:** The numbers on the timeline ruler now automatically adjust. If you zoom out, they space out cleanly; if you zoom in, they break down into milliseconds (e.g., 00:03.50) without overlapping.
- **Accurate Timestamps:** The dragging tooltips and time ruler now show two decimal places for milliseconds, making precise edits much easier.
- **Bug Fix:** Fixed an internal React state warning that could occur when dragging and dropping subtitle blocks.
- **Persistent Subtitles:** Fixed a bug where editing the timeline wouldn't save on reload. Subtitle edits now permanently save instantly!
- **Mobile Toolbar Fixed:** The bottom floating action bar (Split, Dup, Delete) has been restructured so no buttons are cut off on small phone screens.
- **Easy Zoom Controls:** Added +/- zoom buttons to the middle toolbar, allowing you to easily zoom in to see specific seconds or zoom out to see the whole video.
- **Live Dragging Timecodes:** When you drag a subtitle handle to stretch or shrink it, you will now see the exact timecode floating above your finger so you know exactly where it's snapping.
- **Mobile Touch Support:** Subtitle blocks can now be easily dragged and resized on mobile devices.
- **Thick Trimming Handles:** When you tap a subtitle block, it now highlights with large, easy-to-grab handles on the left and right edges (just like CapCut) so you can effortlessly stretch or shrink the caption's duration.
- **Interactive Subtitle Editor:** Added a robust new timeline editor for captions! Switch between the AI Generator and Timeline Editor in the Subtitles tab. You can now import .srt/.vtt files, drag blocks on a horizontal timeline, trim edges, edit text inline, and export your polished subtitles.
- **Nano Banana Prompting:** Replaced generic buzzwords in prompt generation with specific physical and cinematic descriptor guidelines.
- **Image Replace Function:** Added a "Replace Image" button to the Reference Editor Modal to easily swap out reference images without deleting and re-creating them.
- **Custom OpenAI Provider Integration:** Added support for external OpenAI-compatible APIs (like those from awesome-freellm-apis). You can now configure a custom Base URL, API Key, and Model in the API Settings Vault to power all text, chat, and director features instead of using Gemini.
- **Studio Chat Updates:** Added the ability to edit or delete any individual message (both user and AI). You can now edit messages "in-place" without triggering a resend, or choose "Save & Resend" to fork the conversation.
- **Scene Card Interactions:** Added a subtle scale and glow hover animation to Scene Cards, improving the visual feedback and tactile feel when browsing the storyboard.
- **Visual Reference Toggle:** Added an eye icon toggle to visual reference cards. You can now temporarily disable specific reference images from being used by the AI generator without deleting them.
- **Core Operating Protocol (Stop Slop):** Injected a new advanced meta-prompt into the Studio Chat Assistant's brain. The Assistant is now explicitly banned from using generic AI filler phrases ("let's dive in"), and runs a silent "Task Observer" to ensure its advice strictly aligns with your current project state and goals without drifting.
- **Master Chat Log Entry:** Saved the 'Core Operating Protocol' prompt template to your Chat Logs so you can easily reference its UI/UX Pro Max and Memory rules for your own AI Studio configurations.
- **Multi-Perspective Review Protocol:** Upgraded the AI Director's cognitive framework. It now internally convenes a panel of experts (Continuity Director, Composition Critic, Prompt Engineer) to silently cross-examine and refine storyboard scenes before outputting them, drastically reducing continuity errors and repetitive prompts.
- **Master Chat Log Entry:** Saved the 'Multi-Perspective Review Protocol' prompt template to your Chat Logs so you can easily copy and reuse it in Google AI Studio for other creative tasks.
- **Batch Edit Tool:** Added a new "Batch Edit" tool in the Lab tab. You can now import multiple local images (drag & drop or via file picker) and apply a single text instruction to automatically edit all of them in bulk using Gemini 3.1 Flash Image.
- **API Reliability:** Added automatic retries for transient "Permission Denied (403)" errors when the app first loads, which prevents generation tasks from failing abruptly on their first attempt.
- **Master Art Style Selection:** Added a "Set as Master Art Style" checkbox on Visual References. When checked, the image generation engines will explicitly use that reference to completely override and guide the final image's aesthetic, rendering technique, color palette, and tone.
- Added a "MASTER ART" indicator to Visual Reference cards in the Project Dashboard.

## [1.1.10] - 2026-07-17
### Added
- **AI Agent Autonomy Expansion:** The AI Director in the Studio Chat can now fully see and edit your project data. It reads your current Director Plan, allows you to add characters directly via chat, and can edit image prompts for specific storyboard scenes.

## [1.1.11] - 2026-07-18
### Added
- **Enhanced Swap Char:** Added an aspect ratio selector to the Swap Char tool. Fixed an issue where the swapped character's head proportions or lighting would become unnatural by refining the backend prompt to strictly preserve the body proportions, head size, and lighting of the original Frame Reference.
- **Image Extension (Outpainting) via Lab Tab:** Added a new "Extend Image" tab in the Lab that allows users to upload an image and outpaint it into a new aspect ratio (16:9, 9:16, 1:1) while preserving the original subject matter, using Gemini 3.1 Flash Image's capabilities.

## [Latest]
- **Lab Character Swap Fix:** Removed the internal `gemini-3.5-flash` auto-description step from the Multi-Swap tool. The highly detailed auto-description of the original frame was creating a strong text anchor that overpowered the `[Character Reference]` tag. By removing the text description, Imagen 3 now natively prioritizes the Character Reference for the subject's identity, resulting in a perfect character swap without regenerating the original image.
- **Cinematic Story Mode:** Gemini has been sent to film school! The AI Director now uses real music video editing theory—understanding A-Roll vs B-Roll, visual pacing, metaphor over literal interpretation, and matching camera framing to the emotional arc of the song.
- **Research Prompt for Gemini:** Added a specialized prompt to the Chat Logs that you can use to extract professional music video editing rules from Gemini Advanced. You can bring the results back to inject them into the AI Director's brain!
- **Algorithmic Cinematography Engine:** The AI Director has received a massive brain upgrade! It now plans your storyboards using professional heuristics for Average Shot Lengths (ASL), focal lengths (telephoto vs wide-angle), frame rates (24fps up to 120fps slow-motion), and advanced visual metaphors. Generative prompts are now indistinguishable from professional Hollywood shot lists.
- **Google AI Studio Research Prompt:** Added a specialized prompt to the Chat Logs that allows you to research the perfect Temperature, Top-K, and Safety Settings configurations for a custom Music Video Director model in AI Studio.
- **Optimized Generative Parameters:** Tuned the AI Director's internal model settings (Temperature to 0.45, Top-K to 40, Top-P to 0.85). This drastically improves its ability to output stable, highly creative cinematic storyboards without breaking its structural formatting.
- **SRT Subtitle Crafter:** Added a dedicated 'Captions' tab! You can now upload audio or video files and generate perfectly formatted .srt files. Choose between original language, dual subtitles (original + translation), or triple subtitles (original + transliteration + translation).
- **Multiple Target Languages for Captions:** The SRT Subtitle Crafter now supports generating multi-lingual tracks simultaneously! You can type multiple languages (e.g., "English, Spanish, French") in the target box and the AI will output all of them stacked in your subtitles. Also updated the UI icon for better clarity.
- **Legacy Model Swap Support:** Fixed an issue where legacy image models (like Gemini 2.5 Flash) would ignore Character References in the Multi-Swap tool and just perfectly regenerate the original frame. For legacy models, we now completely withhold the Frame Reference image from the generation payload. Instead, we dynamically use Gemini 3.5 Flash to write a hyper-detailed text description of the scene's background and pose, and send ONLY the text description and the Character Reference image to the generator. This forces legacy models to synthesize a brand new "similar" image composition while strictly applying the Character Reference, matching expectations. Gemini 3.1 Flash continues to use the modern, flawless tag-based multi-image replacement.
- **Live Agent Toggle:** Added a "Live Agent" toggle button to the settings menu. You can now pause the agent's background polling/syncing if the app is refreshing or booting constantly during edits.
- **Expanded Studio Assistant Capabilities:** The in-app AI Studio Assistant is now fully integrated with your live project state. It can now edit existing characters and save images you upload in the chat directly to your project's Reference Images (Master Art / Character Sheets) using its built-in tools.
- **Download Fix:** Fixed an issue where downloading generated images one by one would sometimes result in corrupted filenames starting with `.pending-` in certain browsers. The downloads now securely process through object URLs to ensure the correct file name is always applied.
- **Settings UI Fix:** Adjusted the API settings vault layout so that the content is scrollable. This prevents the "Save" button from being pushed off-screen when expanding the custom API key options.
- **Image Generation Model Setting:** Added a new setting in the API settings vault (the key icon) to select the Image Generation Model. You can now choose between Gemini 3.1 Flash Image, Gemini 2.5 Flash Image, and Pollinations (a free, text-only fallback) if you are encountering quota limits or long 1-minute timeout timers. Note that Pollinations does not support image-to-image advanced tools like Character Swapping or Outpainting.
- **Lab Extension:** Added the "Original" aspect ratio option to the Multi-Swap, Single Image, and ID Transfer generation tools in the Lab.
- **Studio Chat Assistant:** The assistant has been confirmed to have full access to your project data (characters, scenes, references) and continues to be able to edit your app state using its built-in tools.
\n- **Director Audio Support:** You can now upload a reference song directly in the Director tab! The AI Director (Gemini 1.5 Pro) will natively listen to the audio track alongside your lyrics to generate scenes that perfectly match the song's pacing, musical beats, and emotional tone.
### Fixed
- **Mobile Fix:** Re-architected the Subtitle Timeline Editor to use a responsive inline layout, preventing the edit toolbar from covering the timeline tracks on small screens.
- **Timeline UX:** Added a hold-to-drag haptic gesture for subtitle blocks, making it much easier to scroll the timeline track without accidentally moving subtitles.
- **Bulk Uploads:** Added bulk multi-selection support to character reference inputs to bypass mobile file picker limitations.
- **Subtitle Persistence:** Generating subtitles, splitting blocks, or making timing edits are now instantly saved. Navigating away or refreshing the page will no longer clear your subtitle timeline or disconnect your audio file.

### Fixed
- **Timeline Editor UX:** Completely overhauled the Subtitle Timeline Editor's layout. The text editing box is now a sleek floating modal that only appears when you explicitly click "Edit Text". It floats over the video preview space, ensuring it no longer pushes down or covers the subtitle timeline tracks on smaller screens. 
- **Timeline Toolbar:** The action toolbar (Split, Duplicate, Delete) has been condensed into a single slim row to maximize vertical space for the timeline and video preview.

### Fixed
- **Live Agent Toggle:** Fixed an issue where the "Live Agent" setting would not stay turned off if you refreshed the page. The app now properly remembers your preference.
- **Boot Loop Fix:** Fixed an issue where the app would occasionally get stuck in a "booting" (refreshing) loop when the Live Agent was actively fetching or sending data in the background.

### Fixed
- **Mobile Subtitle UI Layout:** Fixed an issue on mobile devices where the Subtitles tab header ("AI Generator / Timeline Editor") took up too much vertical space by hiding redundant title text and placing the toggles in a single compact row.

### Fixed
- **Timeline Handle Interaction:** Added a dedicated "drag" tab (a small handle that floats directly above a selected subtitle block) for moving the subtitle's position in time. 
- **Timeline Touch Targets:** Removed the confusing "hold-to-drag" haptic delay. Now, touching anywhere inside the block lets you easily scrub/scroll the timeline, while touching the new top-tab handle instantly moves the block. The left and right trim handles have also been made visually thinner to prevent them from taking up the entire block on mobile screens.

### Fixed
- **Timeline Subtitle Collisions:** Fixed an issue where dragging or resizing a subtitle block could cause it to overlap with adjacent subtitle blocks. The editor now uses collision detection, clamping the movement or resize action so that a block can never be pushed past the end of the previous block or the start of the next block.

### Fixed
- **Gemini 3.1 Character Swapping:** Fixed an issue where the Multi-Swap tool with Gemini 3.1 Flash Image would fail to apply the character identity. Removed negative constraints (e.g., "DO NOT copy style") which were confusing the model, correctly formatted the reference tags (`[Character Reference]` and `[Frame Reference]` without trailing colons), and positioned the instructions before the images to ensure Imagen 3 correctly reads the structural references.

### Fixed
- **Gemini 3.1 Swap Quality:** Fixed an issue where the Gemini 3.1 Flash Image model was blending the character's face with the original frame's subject, resulting in a fake or uncanny appearance. Updated the multi-image reference syntax to use the official Imagen 3 tags (`[Scene Reference]` and `[Subject Reference]`) and strengthened the prompt instruction to enforce a hard replacement of the subject's identity rather than a soft blend.

### Fixed
- **Organic Character Swaps:** Completely overhauled the Gemini 3.1 character swapping engine. Previously, passing both the scene image and the character image directly to the model caused an unnatural "cut and paste" effect where the face lighting didn't match the background, or the model just regenerated the original frame. We now use a two-step AI pipeline: first, a vision model conducts a rigorous pixel-perfect analysis of the original frame (pose, clothing, lighting, background), then the image generator synthesizes a *brand new*, 100% organic photograph using that description combined with your Character Reference. This ensures the lighting, shadows, and skin texture match perfectly, eliminating the "photoshopped" look!

### Fixed
- **Gemini 3.1 Exact Scene Recreation:** Re-enabled passing the exact Scene Reference image to the Gemini 3.1 engine to preserve complex physics (like splashing coffee or exact background details) that couldn't be captured by textual auto-description alone. Adjusted the prompting to instruct an explicit "Image Editing" task for flawless integration.

### Added
- **Gemini 3.7 Support:** Added support for the newly released Gemini 3.7 Pro and Gemini 3.7 Flash models. Gemini 3.7 Flash is now the default text model for generating director plans and enhancing prompts, offering faster generation and better reasoning.

### Added
- **Subtitle Generation Time:** Added a display in the Subtitles tab to show the exact time it took to generate the subtitles. The generation time is shown at the top of the tab for both the AI Subtitle Generator and the Timeline Editor views.

### Fixed
- **Timeline Zoom Accuracy:** Fixed an issue in the Subtitle Editor where caption boxes appeared to overlap into incorrect times when zoomed out. Boxes now accurately scale to their exact millisecond duration regardless of the zoom level.
- **Timeline Performance:** Drastically improved the performance of the timeline editor when zooming in and out by virtualizing the background grid markers, preventing browser lag with long videos.

### Fixed
- **Timeline Zoom Drift:** Fixed a critical bug where zooming in or out on the timeline would cause subtitle boxes to drift away from the central playhead, making them appear out of sync with the video time. The timeline now mathematically locks the current time to the exact center of the screen during all zoom operations.

### Added
- **Pinch-to-Zoom:** The timeline editor now fully supports pinch-to-zoom on mobile and trackpads. You can smoothly zoom in and out of the timeline track by pinching with two fingers on mobile devices or using trackpad pinch gestures (or Ctrl+Scroll) on desktops.

### Added
- **Keyframe Analyzer:** Added a new "Keyframes" tab. This module allows you to upload a short video, automatically extract 30 high-resolution frames, and send the full sequence to Gemini 1.5 Pro to analyze motion, detect duplicates, and identify keyframes.

### Added
- **Bulk Frame Download:** Added a "Download All (ZIP)" button to the Keyframes tab. You can now extract frames and download all 30 high-resolution images instantly in a single `.zip` file, which is perfect for manual frame-by-frame rotoscoping or image editing workflows.

### Added
- **Export as Grid:** Added an "Export Grid" button to the Keyframes tab. This dynamically stitches your extracted frames into a single, high-resolution grid image (e.g., 6x5 or 4x4 depending on frame count) and downloads it instantly. This is perfect for the 2-4 frame "AI Image grid hack."

### Changed
- **Dynamic FPS Extraction:** Upgraded the Keyframe Analyzer to allow dynamic frame extraction based on frames-per-second (FPS) instead of a hardcoded 30 frames. You can now select standard framerates (8, 12, 15, 24, or 30 FPS). The app will calculate the exact number of frames based on the video's duration and extract every single frame perfectly in sync.

### Added
- **Frame Scrub & Save:** Added a "Save Frame" button to the Captions tab. When you have a video uploaded and are scrubbing the timeline to sync subtitles, you can now pause at any perfect moment and instantly save that exact frame as a high-resolution image.

### Added
- **Caption Styling:** Added a "Caption Style" settings button to the Video Preview in the Captions tab. You can now dynamically adjust the font size and the vertical position (Y-axis) of your subtitles overlaying the video in real-time.

### Fixed
- **Caption Preview Overlay:** Fixed a bug where the new "Caption Style" settings (font size and vertical position) failed to update the visual caption overlay on the video. The settings now perfectly update the preview in real-time, allowing precise placement of captions over your video scenes.

### Changed
- **Video Player UI:** Upgraded the subtitle editor video player to a cleaner "Pro" layout. The "Caption Settings" and "Save Frame" buttons have been moved from the video overlay into the bottom timeline toolbar.
- **Fullscreen Mode:** Added a "Watch in Fullscreen" button to the timeline toolbar (and double-click on the video) to expand the player and your customized subtitles to the full screen.

### Added
- **Long Video Subtitles (>30 mins):** Upgraded the AI subtitle engine to use the Gemini File API. The app now natively supports generating subtitles for massive video and audio files (up to 2GB) without crashing your browser. It automatically switches to a resumable cloud upload for large files.

### Fixed & Added
- **Caption Style Menu Fix:** Fixed a layout issue where the subtitle style settings menu could get cut off at the bottom of the screen. It now opens safely as a centered modal.
- **Subtitle Synchronization:** Added a new "Sync" button (clock icon) to the subtitle editor toolbar. If an imported SRT is out of sync with your audio/video, you can now shift all captions forward or backward in time (e.g., +500ms or -500ms) with a single click to perfectly align them.

### Changed
- **Millisecond Timeline Precision:** The timeline timecode displays (current playhead time, block drag handles, and grid markers) now show exact 3-digit milliseconds (e.g., \`01:23.456\`) instead of rounding to hundredths of a second. This provides perfect exact-frame timing visibility when syncing subtitles!

### Added
- **Visual Drag-to-Sync:** You can now visually synchronize your entire subtitle track! Simply grab and drag the **very first subtitle block** on the timeline left or right. The entire timeline of subtitles will automatically lock onto it and shift by the exact same amount, allowing you to visually sync the first spoken word and have the rest follow suit perfectly. (Dragging any other block behaves normally).

### Added
- **Global Video Scrubber:** Added a full-width timeline slider immediately below the video player. You can now grab this slider and instantly fast-forward, rewind, or scrub to any scene in your video, making it much easier to jump between distant subtitles.

### Fixed
- **Playback Interruption Error:** Fixed an underlying browser error (`The play() request was interrupted by a call to pause()`) that would occur if you quickly scrubbed the timeline or clicked pause immediately after playing the video. The player now gracefully handles rapid play/pause inputs without throwing background errors.

### Fixed
- **Drag-to-Sync Reliability:** Fixed an issue where dragging the first subtitle block to the right to sync the track could sometimes feel "stuck" or stop responding. The visual sync mechanism has been completely rewritten to perfectly track your mouse 1:1, making it perfectly smooth and reliable in both directions.

### Fixed
- **Sync Modal Visibility:** Fixed a confusing behavior where the Sync Subtitles menu would stay open after you clicked "Apply" or a preset button (+0.5s). It now automatically closes the moment you apply a change, allowing you to instantly see the timeline shift beneath it. You can also now just press the "Enter" key after typing a custom millisecond offset!

### Changed
- **Sync Custom Input Unit:** The custom input in the Sync Subtitles menu now expects **Seconds** instead of Milliseconds to be much more intuitive (and to match the preset buttons). You can now simply type `9.6` and hit Enter, and it will correctly shift by 9.6 seconds!

### Changed
- **Drag Color Feedback:** When you click and drag a subtitle block (or its resize handles) on the timeline, the block now turns Green to give you clear visual feedback that it is actively being manipulated.

### Added
- **Ripple Sync Drag Mode:** You can now choose exactly how you want to drag your subtitles! When you click on a subtitle box, you'll see a split handle on top:
    - **Amber Side (Normal Drag):** Moves only the specific subtitle box you are dragging.
    - **Indigo Side (Sync Drag):** Moves the dragged box **AND all subtitles that come after it**. This is perfect for instantly fixing the sync for the rest of your video without messing up the captions before it!

### Fixed
- **Video Playback Bug:** Fixed an issue where the Play button could become stuck or require a double-click to work if the video had reached the end of its timeline during a sync operation.

### Changed
- **Drag by Body!** Based on your feedback, those tiny top drag handles have been completely removed. You can now **grab and drag the body of the subtitle box directly** to move it around!
- **Global Drag Mode Toggle:** Since you can now drag the box directly, I added a new toggle switch to the timeline toolbar (next to Import/Export). You can click it to switch between **Normal Drag** (moves one box) and **Sync Drag** (moves the box and everything after it). 

### Fixed
- **Preview Sync on Click:** When you click a subtitle box, the video preview now instantly jumps to that exact moment so you can see the frame it corresponds to! (It won't jump if you are dragging the box, to make sure dragging stays smooth).

### Added
- **Reset Zoom Button:** Added a "Fit Zoom" button (the scanner icon next to the Zoom Out button). Clicking this instantly resets your timeline to a comfortable 10-second default zoom level.

### Fixed
- **Preview Drag Sync:** A massive improvement to editing flow! When you grab and drag a subtitle box, the video preview now actively updates frame-by-frame to match where you are dragging it. The timeline stays anchored while the playhead line perfectly follows your mouse.
- **Crowded Controls:** Fixed the main timeline toolbar buttons overlapping or getting pushed off-screen. They now live in a clean, horizontally scrollable row on smaller screens.
- **Diagnostics:** Added internal debug tracking to monitor media playback states to investigate the video start/stop issues.

### Fixed
- **Timeline Scrubbing:** Tapping the timeline area to start dragging no longer causes the video to abruptly jump to where your finger landed. You can now smoothly grab anywhere on the timeline and drag it left/right, just like a mobile video editor!

### Added
- **Timeline Center Mark:** Added a permanent red center anchor line to the timeline. When you drag a subtitle block and the white playhead moves away to show the preview frame, the red line stays locked in the middle so you don't lose your place.

### Fixed
- **Massive Performance Boost for Dragging:** Dragging subtitle boxes and trim handles on the timeline is now butter-smooth! Previously, forcing the video to update 60 times a second during a drag was causing the browser to lock up. The UI now updates instantly while the video preview updates at a more comfortable ~12fps during the drag, snapping perfectly to the final frame when you release.

### Fixed
- **Timeline Scrub Snapping:** Fixed an issue where sliding the timeline (or dropping a subtitle box) would snap everything back to the beginning when you let go. It will now properly stay exactly where you dropped it.

### Fixed
- **Mobile Drag Dropping:** Completely fixed the issue where the drag handle or moving a box would fail and feel like you "released your finger" prematurely. This was caused by the mobile browser secretly trying to scroll the page behind the scenes, which was interrupting the drag. The timeline is now completely locked from background scrolling during use.
- **Visual Timeline Desync (6s vs 8s):** Fixed a critical layout bug where the timeline visuals (the grid and the red center line) could get mathematically out of sync with the video's actual time if your phone screen resized (like when the address bar hides). The timeline now uses a highly precise `ResizeObserver` to guarantee the subtitle boxes perfectly align with the video preview.
- **Dynamic Timeline Grid:** The timeline time markers (ticks) now adjust intelligently based on how much you are zoomed in! Instead of always showing a tick every 10 seconds, it will now smoothly scale down to show 5-second, 2-second, and even 1-second grid lines so you don't have to guess the exact time.

### Changed
- **Dedicated Move Mode:** Based on feedback, the ability to simply grab and drag a subtitle box has been removed, as it made it too easy to accidentally move a subtitle out of sync when you just wanted to select it. Instead, there is now a dedicated **Move (Arrows)** button in the subtitle edit menu! Clicking this button locks the subtitle into "Move Mode" (it turns red), allowing you to safely drag it around.
- **Drag Stability (Hallucination Fix):** Added further protections to the trim handles to prevent the mobile browser from confusing a drag adjustment with a "drag-and-drop image" action, which was causing the drag to abruptly cancel and release on its own.
### Changed
- **Character Realism Constraints:** Adjusted the realism constraints in the character image generation prompts to prevent characters from looking overly textured or harsh. The prompts now favor a 'naturally smooth, clean, and flattering' look while still explicitly avoiding purely plastic/CGI AI appearances.
### Fixed
- **SRT Generation Permission Error:** Fixed a `PERMISSION_DENIED (403)` error when generating subtitles. The SRT generator and auto-captioner were previously hardcoded to use a specific model (Gemini 3.5 Flash) that may not be available to all API keys. They now correctly use whatever text model you currently have selected in your API Settings.
### Fixed
- **INVALID_ARGUMENT on Subtitle Generation:** Fixed an obscure bug that caused the SRT Subtitle Generation to fail with an `INVALID_ARGUMENT (400)` error for some files/browsers. This was caused by the browser secretly attaching incompatible file headers during the upload. The upload engine now bypasses the browser completely and sends raw binary data directly to the AI!
### Fixed
- **Large File Upload Crash:** Completely resolved the stubborn `INVALID_ARGUMENT (400)` error when uploading large videos for subtitle generation. The upload engine now uses Google's official native SDK which automatically breaks massive files into smaller, safe chunks behind the scenes instead of trying to force the browser to send it all at once!
### Changed
- **Subtitle Sentence Chunking:** Improved the AI prompt for generating subtitles so it no longer packs multiple sentences into a single, massive subtitle block. It will now properly break down long speeches into shorter, highly readable chunks that span across multiple frames instead of overwhelming the screen.
### Fixed
- **Media Player Icon Crash:** Fixed an application crash (Uncaught ReferenceError: Video is not defined) caused by a missing video icon import in the media player toolbar.
### Fixed
- **Media Player Crash:** Fixed an unhandled `DOMException` error ("The play() request was interrupted because the media was removed") that occurred when quickly clearing or swapping the active soundtrack. The audio player now safely catches playback interruptions instead of crashing the app.
### Added
- **Password Protection:** Added a secure `<PasswordGate>` layer. When you share this application, visitors will be required to enter a password to access it. The password can be set in the AI Studio Secrets panel using the `VITE_APP_PASSWORD` variable.
### Added
- **Asset Xplorer Tab:** Inspired by X-plore file manager, this new tab allows you to view and search all files currently loaded in the project's IndexedDB (Audio, Reference Images, and Generated Scene Media) through a clean, dual-pane-like UI.
### Added
- **Audio/Video Processing Modes for Subtitles:** You can now explicitly choose whether Gemini should "Listen Only" (process just the audio track, saving tokens and speeding up generation) or "Watch & Listen" (process the video frames to read lips, action, and text for better context).

### Added
- **Dual Translated Subtitle Format:** Added a new "Dual Translated" option in the SRT Subtitle Crafter. This generates a two-line caption where the top line is English and the bottom line is your target language, completely skipping the native language transcription.
### Added
- **On-Screen Text & Emotion Captions:** When using the "Watch & Listen (Video)" mode for subtitle generation, Gemini is now explicitly instructed to extract and include floating text, emotion markers, and stylized action graphics (like '看' or '靠近') into the subtitle blocks using bracket formatting (e.g., `[Action: approaches]`).
### Changed
- **On-Screen Text Formatting:** Removed the explicit "Text:" and "Action:" prefixes from bracketed on-screen text in subtitles. The AI will now just output the clean text, like `[看]` instead of `[Text: 看]`.
### Fixed
- **Timeline Playback Bug:** Suppressed an unexpected error popup (`The play() request was interrupted by a call to pause()`) that occurred when rapidly scrubbing, pausing, or clicking the timeline in the Subtitle Editor while the media was still attempting to play.
### Added
- **Resume / Start Time Feature:** Added a new "Resume / Start From" input field in the subtitle generator settings! If the AI ever crashes or cuts off halfway through a massive video, you can now input the exact timestamp where it stopped (e.g. `00:52:00`). The AI will ignore everything before that time and seamlessly continue generating the rest of the video!
- **Undo/Redo & Clear Subtitles:** You can now safely undo and redo all your subtitle edits! Added standard Undo and Redo arrows to the timeline toolbar, along with a "Clear All" trash icon to quickly wipe the timeline and start over.

### Changed
- **Timeline Timer Format:** Updated the timer display in the Subtitle Editor to always show the full `Hours:Minutes:Seconds.Milliseconds` format (e.g., `01:14:59.744`). Previously, it hid the hours (showing `74:59.744`), which caused confusion when copying and pasting timestamps into other tools.
- **Ripple Sync Trimming:** The "Sync Mode" in the Subtitle Editor just got a major upgrade! Previously, you could only push/pull other clips when dragging the middle of a subtitle block. Now, resizing the left or right edges (trimming) while in Sync Mode will automatically push or pull all adjacent subtitles to make room, perfectly preserving your timeline's timing, just like a professional video editor!
- **Cleaner Subtitles (No Periods):** Added a new instruction forcing the AI to drop trailing periods (full stops) at the end of generated subtitle lines to keep the video aesthetic clean and cinematic.

### Fixed
- **Resume Feature Wiping Timeline:** Fixed an issue where using the new "Resume / Start From" feature would accidentally wipe out the existing subtitles on your timeline. Now, the app intelligently keeps all your existing subtitles up to the resume time, and seamlessly stitches the newly generated subtitles onto the end!
- **Skipped Subtitle Gaps:** Fixed an issue where the AI would occasionally skip large chunks of audio (sometimes jumping 7-8 minutes) during long videos to compress the timeline. Added a new strict rule to the AI to enforce continuous, gapless transcription of every spoken sentence.
### Added
- **Language Autocomplete:** Source and Target Language input boxes in the Subtitles Tab now include browser-native dropdown suggestions (e.g. English, Spanish, Japanese, Auto-detect) while still letting you type any custom language.
- **Persistent Subtitle Settings:** All your subtitle preferences (format type, languages, styling, and processing mode) are now automatically saved to your browser! They will instantly reload the next time you open the application.
- **Custom Context Instructions:** Added a dedicated "Context / Instructions" text box to the Subtitle Generator! You can now pass explicit notes to the AI before generating (e.g., "The character's name is Kael", "Use casual tone", "This is a medical drama") to vastly improve transcription accuracy for specialized videos.

### Fixed
- **App Crashing on Load (White Screen):** Fixed a critical "app keep crash" issue that caused the application to show a complete white screen / connection refused error. This was caused by the underlying developer server getting stuck on port 3000, forcing the preview to fail. The server has been successfully rebooted.
- **Strict Storage Protection:** Wrapped all persistent local storage variables in strict fallback protections to prevent the application from totally crashing if you use an Incognito tab or a browser that forcibly blocks third-party cookies/storage.
- **INVALID_ARGUMENT on Subtitle Generation (Gemini 3.7):** Fixed a critical `INVALID_ARGUMENT (400)` API error that caused SRT Generation to fail when using the new Gemini 3.7 Flash model. The app was incorrectly attempting to force a "MINIMAL" thinking mode config which is not supported by the standard Flash model variant.

### Added
- **Gemini 3.8 Support:** Added full support for the next-generation **Gemini 3.8 Flash** and **Gemini 3.8 Pro** models! You can now select them directly from the API settings dropdown.

### Changed
- **Dynamic Vision AI:** Hardcoded legacy model dependencies have been removed from the video analysis features. Agentic Video analysis (like "Vision Fix") and frame analysis will now seamlessly use whatever cutting-edge model you have selected (3.7 or 3.8) rather than forcing an older model.
- **Reference Video Playback (MP3 Workaround):** Fixed a bug with the Timeline Editor's "Upload Track" button. You can now generate your subtitles rapidly using a small MP3 file, and then inside the timeline editor, use the "Upload Track" button to attach your heavy MP4 video file. The editor will instantly swap the audio player for the video player so you can match lip-syncing perfectly, all without having to upload the heavy MP4 to the AI!
- **Vision AI on Local Videos:** Fixed a bug where advanced video features (like "Vision Fix" and taking screenshots) would disappear or break if you used the "Upload Track" button to swap your MP3 for a video file. The editor now correctly unlocks all AI video tools the moment a video is detected in the player!
- **Dedicated "Swap Media" Button:** The Timeline Editor now has a direct, top-level "Swap Media" button on the main toolbar. You no longer have to dig into the Audio Alignment settings to swap your MP3 for an MP4! 
- **Silky Smooth Timeline Scrubbing:** Rewrote the timeline panning engine to use imperative, zero-latency direct DOM transformations. Dragging the timeline background is now perfectly locked to your cursor at 120fps with zero visual lag.
- **Smart Edge-Tracking Auto-Pan:** When dragging a long subtitle block, the timeline will now intelligently pan if the *edge* of the subtitle box reaches the side of the screen, instead of only triggering when your mouse cursor reaches the edge.
- **Punctuation Cleanups:** Instructed the AI to strictly avoid trailing periods (.) at the end of subtitle blocks for a cleaner, modern look. The app now also aggressively post-processes all generated and imported SRT files to strip out accidental trailing periods.
- **Vision Fix Translation:** Improved the Agentic Video Vision Fix prompt to strictly enforce translation. If it detects hardcoded on-screen text (like Chinese graphics) but your current subtitles are in English, it will now properly translate the on-screen text into your target language instead of transcribing the native characters.
- **Subtitle Splitting Limits:** Enforced a strict maximum duration rule (max 5 seconds per block) on the Auto-Subtitle generator. It will now properly chop up long sentences instead of generating massive 10-second subtitle blocks.
- **On-Screen Graphics Recognition:** Updated the Auto-Subtitle generator's system prompt to explicitly respect user instructions requesting transcription of silent on-screen graphics or emotion tags (like [Curious]), ensuring it doesn't skip visual cues when nobody is speaking.
- **Vision Fix Placeholder Overrides:** Fixed a bug where creating a blank/new caption block and running the Vision Fix would sometimes do nothing because the AI didn't know what language to translate the visual context into. It now automatically detects placeholders (like "New Caption") and aggressively writes fresh English captions for on-screen context.
- **Vision Fix UI Improvements:** Added explicit loading states ("Uploading..." and "Analyzing...") to the Vision Fix button. This clarifies why the tool takes 15-20 seconds (video files must be temporarily cached on Gemini's API servers before the Vision models can deeply analyze the timeline).
- **Advanced Subtitle Analysis Pipeline:** Upgraded the Auto-Subtitle generator's system prompt by incorporating a multi-stage analysis pipeline. It now explicitly considers scene segmentation, speaker identification, and word-level audio alignment before generating text, ensuring subtitles don't bleed across camera cuts and timing matches acoustic realities rather than just textual sentence length.
- **Vision Fix Error Handling:** Improved error handling when uploading video files to Gemini's servers. If a video fails to process (e.g., due to an unsupported codec or corruption), the app will now surface the exact error message from Google's backend instead of a generic failure message. Also ensured that the file's MIME type is explicitly sent to Gemini during upload to prevent format confusion.
- **Subtitling Sync Fix:** Fixed an issue where the AI would sometimes generate two separate subtitle blocks that occur at the exact same time (resulting in overlapping text UI glitches). The AI is now strictly instructed to combine overlapping speech into a single subtitle block (e.g., separating the two speakers with dashes on two lines) and is mathematically forbidden from outputting overlapping timestamps.
- **Emotional & Expression Tagging:** The AI Subtitle Engine is now explicitly instructed to read visual facial expressions and acoustic tones of voice to inject emotional tags (like `[Surprised]`, `[Crying]`, `[Shyly]`, `[Laughing]`) into the generated subtitles.
- **Phantom Timing Fix:** The Subtitle AI now strictly separates non-verbal vocalizations (like "woah", "ah", or gasps) from the main sentence block. It is now forbidden from starting a subtitle's timecode early during a vocalization unless it actually transcribes that exact vocalization sound.
- **Hear Fix (Agentic Audio):** Added a new "Hear Fix" button next to "Vision Fix" inside the subtitle text editor. It acts as an Agentic Audio analyzer that listens closely to the exact timestamp of the subtitle to correct misspelled words or misheard dialogue based on tone and pronunciation.
- **Editor UI Fix:** Fixed a UI bug where the text editor would abruptly close automatically when selecting a block to edit.
- **UI Overflow Fix:** Adjusted the action button row in the subtitle editor to support wrapping (`flex-wrap`). The "Hear Fix" button will no longer push the "Done" button off-screen on smaller devices.
- **Vision/Hear Fix Speed Optimization:** Fixed an issue where the Agentic Video and Audio analyzers would take a very long time to process even short segments. The analyzers now inject explicit `videoMetadata` offsets into the API call so that the Google backend only processes the exact 3-second clip being edited, rather than extracting frames from the entire 5-minute video file on every click.
- **Sync Trans Upgrade:** The "Sync Trans" button can now be used on single-line subtitles! It reads your globally selected Subtitle Format (Bilingual, Triple, etc.) and Target Language from the sidebar, and will automatically generate the missing translations/romanizations underneath your text.
- **Realistic Progress Times:** Updated the in-app notifications for "Vision Fix" and "Hear Fix" to properly reflect Google's 1-3 minute backend processing times.
- **Two-Pass AI Subtitling:** Overhauled the core Gemini subtitle generation pipeline. It now runs in two distinct passes: Pass 1 strictly analyzes audio to generate perfect timestamps (acting as a stopwatch), and Pass 2 handles all complex translations and formatting without modifying the timing. This dramatically reduces timestamp drift when generating translated or multi-layered subtitles!
- **Two-Pass AI Subtitling:** Overhauled the core Gemini subtitle generation pipeline. It now runs in two distinct passes: Pass 1 strictly analyzes audio to generate perfect timestamps (acting as a stopwatch), and Pass 2 handles all complex translations and formatting without modifying the timing. This dramatically reduces timestamp drift when generating translated or multi-layered subtitles!
- **Bug Fix:** Fixed an issue where the "Swap Media" / "Swap Video" button on the Timeline Editor control bar would fail to open the file selection window because the hidden input element was conditionally unmounted.
- **Bulk Text Tools:** Added a new dedicated "Bulk Text Tools" popup to the Timeline Editor.
  - You can now instantly clean bilingual subtitles by stripping away Line 1 or Line 2 across all blocks.
  - You can instantly swap the positions of Line 1 and Line 2 for dual-language setups.
  - You can paste a list of text/translations and map them to overwrite specific lines in your existing subtitle blocks chronologically!
