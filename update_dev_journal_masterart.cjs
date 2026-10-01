const fs = require('fs');
let content = fs.readFileSync('DEV_JOURNAL.md', 'utf-8');

const newEntry = `## 2026-07-17: Master Art Style Directives
- **Feature:** Added a "Set as Master Art Style" checkbox (` + "`isMasterArt`" + ` property) to Visual References in ` + "`ReferenceEditorModal`" + `.
- **Resolution:** Modified ` + "`generateSceneImage`" + `, ` + "`generateSingleImage`" + `, ` + "`generateChatImage`" + `, and ` + "`generateMultiSwapImage`" + ` in ` + "`src/services/gemini.ts`" + ` to explicitly filter and include references marked as master art.
- **Prompt Injection:** These master art references inject a powerful, un-ignorable instruction: \`[Image X - EXACT Master Art Style Reference]: You MUST strictly copy the visual aesthetic, rendering technique, color palette, line work, tone, and texture of this image over the entire generated scene. Ignore any conflicting style words in the text prompt.\` This overrides the model's tendency to blend the prompt's style descriptions with the reference, forcing a total aesthetic takeover.
`;

content = content + "\n" + newEntry;

fs.writeFileSync('DEV_JOURNAL.md', content);
console.log("Updated DEV_JOURNAL.md");
