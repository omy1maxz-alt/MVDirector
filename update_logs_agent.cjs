const fs = require('fs');

let changelog = fs.readFileSync('CHANGELOG.md', 'utf-8');
const clEntry = `## [1.1.10] - 2026-07-17
### Added
- **AI Agent Autonomy Expansion:** The AI Director in the Studio Chat can now fully see and edit your project data. It reads your current Director Plan, allows you to add characters directly via chat, and can edit image prompts for specific storyboard scenes.

`;
changelog = changelog.replace(/^# Changelog\n\n/, "# Changelog\n\n" + clEntry);
fs.writeFileSync('CHANGELOG.md', changelog);

let devjournal = fs.readFileSync('DEV_JOURNAL.md', 'utf-8');
const djEntry = `## 2026-07-17: AI Agent Autonomy Expansion
- **Feature:** Expanded the Studio Chat AI's capabilities to view the ` + "`directorPlan`" + ` and edit it.
- **Resolution:** Added ` + "`addCharacterTool`" + ` and ` + "`updateSceneImagePromptTool`" + ` to ` + "`src/services/gemini.ts`" + `. Passed ` + "`directorPlan`" + ` context directly to ` + "`sendStudioChatMessage`" + `. Handled these function calls inside ` + "`StudioChat.tsx`" + ` by exposing ` + "`directorPlan`" + ` and ` + "`setDirectorPlan`" + ` as props.
- **Why:** To fulfill the user's request: "make yourself can see and edit what, on the app, because if you became the very part of the app it'll will enhance the app capability." This creates a more dynamic agent capable of performing deep surgery on the user's project state directly through natural conversation.
`;
devjournal = devjournal + "\n" + djEntry;
fs.writeFileSync('DEV_JOURNAL.md', devjournal);

console.log("Logs updated");
