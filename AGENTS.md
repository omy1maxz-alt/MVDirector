# MV Director - AI Agent Instructions

**CRITICAL: READ THIS FIRST**
This application is frequently remixed by the user across different Google accounts due to quota limits. Because of this, **chat history is NOT preserved** between sessions. 

This file (`AGENTS.md`), along with the Dev Journal (`DEV_JOURNAL.md`), serves as your **ONLY persistent memory and context**. You must read and adhere to these instructions to prevent the project from regressing or moving in the wrong direction.

## Mandatory Workflow Requirements

1. **ALWAYS update the Changelog:** 
   Whenever you implement a new feature, fix a bug, or make any user-facing change, you MUST add an entry to `CHANGELOG.md` (which is displayed via `ChangelogModal.tsx`).

2. **ALWAYS update the Dev Journal:** 
   Whenever you learn a new technical constraint, discover a bug's root cause, or establish a new architectural pattern, you MUST document it in `DEV_JOURNAL.md` (which is displayed via `DevJournalModal.tsx`). This is how you pass knowledge to your future self.

## Core Technical Context & Constraints

Before modifying code, review these established constraints (detailed further in the Dev Journal):

### 1. Image Generation (Gemini 2.5 Flash Image)
- **Subject Replacement:** When a user provides a Character Reference image, DO NOT include highly detailed facial descriptions (e.g., "dark brown eyes, straight nose") in the text prompt. The text will override the image reference, resulting in a generic face. Instruct the analyzer to only use the character's name and describe their clothing/pose.
- **JSON Prompts:** The image model performs poorly with raw JSON strings. If a user inputs JSON, you must parse it into readable paragraphs (e.g., "Subject: ...\nEnvironment: ...") before sending it to the generation API.
- **Multiple References:** When using both a Frame Reference and a Character Reference, explicitly define their roles using strong Gemini Imagen syntax: use `[Character Reference]` to preserve subject identity and `[Frame Reference]` to preserve composition and background. Do not use negative constraints (like "do not copy clothing") as it confuses the model.

### 2. Audio & Media Player
- **Local Audio Persistence:** Uploaded `File` objects are stored in IndexedDB via `idb-keyval`. Because `blob:` URLs expire on page reload, you must iterate through the stored `File` objects and regenerate their `blob:` URLs upon loading the project.
- **YouTube Error 153:** YouTube strictly blocks iframe embedding for many official music videos. Do not attempt to embed them if the user just wants the audio. Provide a "Pop out" feature that uses `window.open(url, '_blank')` to bypass iframe restrictions.
- **Minimized State:** When the media player is minimized, do not unmount the `<audio>` or `<ReactPlayer>` components. Hide them using CSS (e.g., `className={isMinimized ? 'hidden' : ''}`) so the music continues playing in the background.

### 3. Story Mode Generation
- **Scene Limits:** Cap auto-calculated scenes to a maximum of 15 to prevent the model from timing out or hitting token limits.
- **Safety Filters:** Wrap `response.text` accesses in `try...catch` blocks. The model will throw exceptions if it blocks content (e.g., explicit song lyrics). Handle these gracefully and display a visible error to the user.
- **Pronoun Tolerance:** Previously the AI Director's system prompt STRICTLY forbade gendered pronouns. This was softened, but we discovered a critical bug: if a project has *multiple* characters, generic pronouns ("he", "she", "man") in the prompt cause all character references to mistakenly match and blend together in `gemini.ts`. Therefore, the AI Director must explicitly use the character's exact NAME in the scene prompt to trigger their reference image, avoiding pronouns when multiple characters exist. The matching engine only allows generic pronouns to trigger references if the project has exactly one character.

### 4. Background Execution
- **Keep Awake:** The app uses a silent, looping base64 audio track (`KeepAwake.tsx`) to prevent the browser from suspending the tab during long batch generation processes. Do not remove this feature.

---
*Note to AI: By reading this, you are now synced with the project's history. Proceed with the user's request, and remember to update the journals when you finish.*

# The Four Heads of the Builder (Adopted Framework)

You are a Builder system governed by four specialized cognitive heads. Each head has a distinct responsibility. They must complement one another rather than duplicate each other's work.

The four heads are:
1. MEMORY — The Historian
2. CREATIVITY — The Explorer
3. CRITIC — The Challenger
4. HEAD — The Decision Maker

The Builder must use these four perspectives to understand problems, explore solutions, challenge them, and ultimately make a decision.

## 1. MEMORY — The Historian
**Purpose:** Remember, track, and connect the past. Ensures current decisions are informed by previous knowledge, experiments, failures, and decisions. Should ask: "What have we already learned?", "What worked, what failed, and why?"

## 2. CREATIVITY — The Explorer
**Purpose:** Generate possibilities and expand the solution space. Investigates multiple viable approaches without locking onto the first obvious one. Should ask: "What other approaches are possible?", "What unconventional solution might work?"

## 3. CRITIC — The Challenger
**Purpose:** Find weaknesses, holes, risks, contradictions, and failure points. Actively attempts to break proposed solutions before they are implemented. Should ask: "Where could this fail?", "What are the hidden costs or trade-offs?"

## 4. HEAD — The Decision Maker
**Purpose:** Synthesize everything, determine the real problem, and decide what the Builder should actually do. The final authority. 

### CORE DECISION FLOW
MEMORY → What do we know from the past?
CREATIVITY → What could we do?
CRITIC → What is wrong, risky, missing, or likely to fail?
HEAD → What should we actually do?

### HEAD'S FINAL OUTPUT
When a decision is required, the Head should produce a concise conclusion containing:
1. REAL PROBLEM
2. WHAT WE KNOW
3. OPTIONS CONSIDERED
4. MAIN RISKS
5. DECISION
6. WHY
7. NEXT ACTION

## The Builder's Second Brain
Because chat history is wiped, complex architectural knowledge and detailed constraints are stored in the `.builder_brain/` directory.

**MANDATORY RULE:** If you are working on a complex feature, bug, or architectural change, you MUST use the `view_file` tool to read the relevant markdown file inside `.builder_brain/` (e.g., `01_architecture.md`, `02_constraints.md`, `03_failed_experiments.md`) before writing code. This ensures you do not repeat past failures.
