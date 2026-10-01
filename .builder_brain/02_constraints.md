# 02 Constraints & API Quirks

## Gemini API & Prompts
1. **Subject Replacement Bug (Imagen):** When using Character Reference images, DO NOT include detailed facial descriptions in the text prompt (e.g., "dark eyes, sharp nose"). Text overrides the image ref, resulting in a generic face. Only use the character's name, clothing, and pose.
2. **JSON Prompting:** The Gemini image model performs poorly with raw JSON strings. Always parse JSON into readable Markdown paragraphs ("Subject: ...\nEnvironment: ...") before sending it to the generation API.
3. **Reference Conflicts:** When using a Frame Reference AND a Character Reference, explicitly tag them in the prompt: `[Character Reference]` and `[Frame Reference]`. Avoid negative constraints ("do not copy background"), as they confuse the model.
4. **Pronoun Bleed:** If a project has *multiple* characters, using generic pronouns ("he", "she") in the prompt causes the reference matcher to blend characters together. Explicitly use the character's EXACT NAME in the prompt to trigger the correct reference image.

## Subtitle Generation (gemini_srt.ts)
1. **Sentence Chunking:** The AI naturally wants to stuff multiple sentences into a single subtitle block, creating walls of text (especially in quad-language mode). The prompt MUST strictly enforce chronological splitting: one sentence or short clause per subtitle block.
2. **Timing & Equal Distribution:** By default, LLMs tend to lazily distribute duration equally among words (`sentence duration / words`). The prompt MUST enforce strict "audio-first" timing, demanding exact vocal onsets/offsets, proper handling of humming/laughter, precise gaps for overlapping speech, and prolonged duration for held vocal notes.

## AI Studio Iframe Constraints
1. **Native Popups Blocked:** Native browser dialogs like `window.confirm()`, `window.alert()`, and `window.prompt()` are strictly blocked by the AI Studio iframe environment. Any destructive action requiring confirmation MUST use a custom-built React modal instead.

## Audio & YouTube
1. **YouTube Error 150/153:** YouTube strictly blocks iframe embedding for many official music videos. We cannot bypass this in the iframe. We provide a "Pop out player" feature (`window.open(url, '_blank')`) to play these in a new tab.

## Scene Limits
1. **Maximum Scenes:** Auto-calculated story scenes are capped at 15 to prevent the Gemini text model from timing out or hitting token limits.
