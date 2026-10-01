#!/bin/bash
DATE=$(date "+[%Y-%m-%d %H:%M:%S]")

cat << INNER_EOF >> CHANGELOG.md
### Fixed
- **SRT Generation Permission Error:** Fixed a \`PERMISSION_DENIED (403)\` error when generating subtitles. The SRT generator and auto-captioner were previously hardcoded to use a specific model (Gemini 3.5 Flash) that may not be available to all API keys. They now correctly use whatever text model you currently have selected in your API Settings.
INNER_EOF

cat << INNER_EOF >> DEV_JOURNAL.md

$DATE Fixed 403 PERMISSION_DENIED during SRT generation. Replaced hardcoded 'gemini-3.5-flash' strings in gemini.ts and gemini_srt.ts with the dynamic currentTextModel from the API vault settings to respect the user's active model choice and permissions.
INNER_EOF
