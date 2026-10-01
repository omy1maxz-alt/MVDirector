# Builder Second Brain - Index & Guide

Welcome to the Builder's Second Brain. This directory (`.builder_brain/`) is a structured knowledge base designed to persist context, architectural decisions, and hard-learned lessons across session wipes.

## Core Philosophy
- **AGENTS.md** is for auto-injected *behavioral instructions* and the *manifesto*.
- **DEV_JOURNAL.md** is for a *chronological timeline* of actions.
- **.builder_brain/** is for *deep, categorized reference knowledge*.

## Table of Contents
1. `01_architecture.md`: The structural makeup of the application, state management, and core libraries.
2. `02_constraints.md`: Hard API limits, quirks, browser security rules, and boundaries we must not cross.
3. `03_failed_experiments.md`: Things we tried that broke the app, so we never try them again.
4. `04_external_second_brain.md`: Workflow for using external models (GPT on KIE.ai) as an architectural Second Brain.

## Instructions for the AI Builder
When starting a complex task, bug fix, or architectural change:
1. Identify the domain (e.g., Audio, Gemini, State).
2. Check `AGENTS.md` to see if a relevant constraint is listed.
3. If deep context is needed, use `view_file` to read the relevant `.builder_brain/` document before writing code.
