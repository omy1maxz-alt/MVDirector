# 04 Developer Second Brain Setup (External Architect Workflow)

This document provides the standard operating procedure for using an external model (such as GPT-4o / GPT-5 via KIE.ai, ChatGPT, or Claude) as the "Second Brain" architect while using AI Studio as the primary coding and execution engine.

---

## 1. System Roles

* **Second Brain (GPT on KIE.ai / External LLM):**
  * **Role:** Architectural Reviewer, Logic Designer, Edge-Case Finder, Prompt Engineer.
  * **Input:** System constraints (`.builder_brain/`), user intent, target code snippets.
  * **Output:** Precise specifications, structured logic changes, or verification checklists.

* **First Brain (AI Studio Agent / Primary Builder):**
  * **Role:** Hands-on Coder, Shell Executor, Linter & Compiler, Container Verifier.
  * **Action:** Reads the codebase, implements modifications, executes `lint_applet` and `compile_applet`, tests build errors, and updates `CHANGELOG.md` & `DEV_JOURNAL.md`.

---

## 2. The Four Heads Context Template for GPT

When consulting your Second Brain on KIE.ai, provide this standardized prompt template to ensure it respects our strict project architecture:

```markdown
You are acting as the SECOND BRAIN ARCHITECT for MV Director, a React + Vite + TypeScript web app.
Before proposing any code, evaluate the problem through the FOUR HEADS loop:
1. MEMORY: What constraints exist? (No DOM unmount for audio, strict iframe popups ban, anti-drift chunking for audio >12m, cue-ID translation).
2. CREATIVITY: What are the possible architectural approaches?
3. CRITIC: What breaks? (DOMExceptions, API rate limits, timecode hallucination, token context overflows).
4. HEAD: Synthesize the final decision into:
   - Real Problem
   - What We Know
   - Options Considered
   - Main Risks
   - Final Decision
   - Why
   - Exact Implementation Plan

Core constraints:
- React 18 functional components, Tailwind CSS.
- Audio persistence via IndexedDB (idb-keyval) with blob: URL regeneration.
- Subtitle generation enforces relative chunking and cue-ID translation (gemini_srt.ts).
- No native window.confirm/alert in iframe environment.
```

---

## 3. Recommended Workflow Step-by-Step

1. **Identify the Task or Bug:**
   - Clearly define what feature you want to add or what error needs solving.

2. **Send Prompt to KIE GPT:**
   - Copy the template above along with the specific code snippet or error message.
   - Let KIE GPT run the "Four Heads" analysis and produce the implementation plan.

3. **Feed the Plan into AI Studio:**
   - Paste KIE GPT's decision/plan directly into the chat here.
   - The AI Studio Builder will check existing files, apply targeted edits, run `lint_applet`, compile the applet, and verify in the live Cloud Run container.

4. **Persist the Outcome:**
   - Any lesson or architectural discovery from the process is documented in `DEV_JOURNAL.md` and `.builder_brain/` so future sessions remember it.
