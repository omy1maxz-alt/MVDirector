import fs from 'fs';
let code = fs.readFileSync('src/services/db.ts', 'utf8');

// I will just rewrite the initial notes array with proper escaping
const properNotes = `
const INITIAL_NOTES: import('@/types').BrainNote[] = [
  {
    id: "note_arch_constraints",
    title: "Project Core Architecture & AI Constraints",
    content: "# Core Technical Context & Constraints\\n\\n## 1. Image Generation (Gemini 2.5 Flash Image)\\n- **Subject Replacement:** When a user provides a Character Reference image, DO NOT include highly detailed facial descriptions (e.g., 'dark brown eyes, straight nose') in the text prompt. The text will override the image reference, resulting in a generic face. Instruct the analyzer to only use the character's name and describe their clothing/pose.\\n- **JSON Prompts:** The image model performs poorly with raw JSON strings. If a user inputs JSON, you must parse it into readable paragraphs (e.g., 'Subject: ...\\\\nEnvironment: ...') before sending it to the generation API.\\n- **Multiple References:** When using both a Frame Reference and a Character Reference, explicitly define their roles using strong Gemini Imagen syntax: use \`[Character Reference]\` to preserve subject identity and \`[Frame Reference]\` to preserve composition and background. Do not use negative constraints (like 'do not copy clothing') as it confuses the model.\\n\\n## 2. Audio & Media Player\\n- **Local Audio Persistence:** Uploaded \`File\` objects are stored in IndexedDB via \`idb-keyval\`. Because \`blob:\` URLs expire on page reload, you must iterate through the stored \`File\` objects and regenerate their \`blob:\` URLs upon loading the project.\\n- **Minimized State:** When the media player is minimized, do not unmount the \`<audio>\` or \`<ReactPlayer>\` components. Hide them using CSS (e.g., \`className={isMinimized ? 'hidden' : ''}\`) so the music continues playing in the background.\\n\\n## 3. Story Mode Generation\\n- **Scene Limits:** Cap auto-calculated scenes to a maximum of 15 to prevent the model from timing out or hitting token limits.\\n- **Safety Filters:** Wrap \`response.text\` accesses in \`try...catch\` blocks. The model will throw exceptions if it blocks content (e.g., explicit song lyrics). Handle these gracefully and display a visible error to the user.\\n- **Pronoun Tolerance:** If a project has *multiple* characters, generic pronouns ('he', 'she', 'man') in the prompt cause all character references to mistakenly match and blend together in \`gemini.ts\`. Therefore, the AI Director must explicitly use the character's exact NAME in the scene prompt to trigger their reference image.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "note_youtube_saga",
    title: "The YouTube Embed/DRM Saga",
    content: "# Why We Removed YouTube Playback\\n\\nInitially, we tried to let users paste a YouTube link to watch a video while syncing subtitles. However, this ran into a massive wall with YouTube's iframe DRM (Digital Rights Management).\\n\\n## The Journey:\\n1. **The Request:** Users wanted to paste a link and have it play alongside the timeline editor.\\n2. **The ReactPlayer Implementation:** Added ReactPlayer to embed YouTube via its iframe API.\\n3. **The Errors:** \\n   - Started getting weird crashes (Error 153). \\n   - \`onDuration\` wasn't supported natively without wrapping in try/catches.\\n   - Needed to auto-prepend \`https://\` if users didn't type it.\\n4. **The Big Blocker (DRM):** We realized YouTube actively blocks embedding for many official music videos (unchecking 'Allow Embedding'). YouTube servers detect the third-party domain and physically block the video stream.\\n5. **The Workaround:** Added a 'Pop out (Bypass Block)' button to open the video in a new tab (\`window.open\`), plus a watermark explaining the issue.\\n6. **The Final Call:** The user still felt it was clunky/weird. Decided to completely rip out the \`youtubeUrl\` state, the input field from \`SubtitlesTab.tsx\`, and all \`ReactPlayer\` logic from \`SubtitleTimelineEditor.tsx\`. \\n\\n**Conclusion:** The timeline editor is strictly back to local uploaded Audio and Video files. Client-side YouTube ripping/embedding is too unreliable due to strict corporate licensing limits.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "note_subtitle_editor",
    title: "Subtitle Editor: Ripple Sync & Timeline Math",
    content: "# Timeline Editor Upgrades\\n\\n## 1. True Ripple Edit Sync Mode\\nUpgraded the 'Sync Mode' to behave like a professional NLE (Premiere Pro). \\n- Previously, syncing only worked when dragging the middle of a block.\\n- **Now:** Dragging the right edge of a block to resize it will auto-push/pull all *subsequent* blocks. Dragging the left edge will auto-push/pull all *preceding* blocks.\\n- Implemented via new \`sync_start\` and \`sync_end\` pointer drag states.\\n\\n## 2. Timecode Formatting Constraints\\n- Switched visible timer format from two-part (\`MM:SS.mmm\`) to a strict three-part (\`HH:MM:SS.mmm\`).\\n- Why? Since the editor displayed minutes beyond 60 (e.g. 74:59.744), users copied the string directly into AI Resume. The parser blindly split by \`:\` and assigned 74 to *hours* instead of *minutes*, breaking math. \\n- **Decimal vs Comma parsing:** Standard SRT uses commas (\`59,744\`), while WebVTT/UI uses periods (\`59.744\`). \`Number('59,744')\` returns \`NaN\` in JavaScript. We must automatically \`.replace(',', '.')\` before calling \`Number()\` during resume imports.\\n\\n## 3. Popup Cancellation Trap\\nWhen users closed the Google/YouTube Sign-In popup, Firebase correctly threw \`auth/popup-closed-by-user\`. But because the app used \`console.error\`, AI Studio trapped it and escalated it to a fatal UI crash overlay. We downgraded this specific exception to \`console.warn\` to fail gracefully.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];
`;

const regex = /const INITIAL_NOTES[\s\S]*?\];/;
code = code.replace(regex, properNotes.trim());

fs.writeFileSync('src/services/db.ts', code);
