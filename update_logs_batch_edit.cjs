const fs = require('fs');
let changelog = fs.readFileSync('CHANGELOG.md', 'utf-8');
const clEntry = `- **Batch Edit Tool:** Added a new "Batch Edit" tool in the Lab tab. You can now import multiple local images (drag & drop or via file picker) and apply a single text instruction to automatically edit all of them in bulk using Gemini 3.1 Flash Image.\n`;
changelog = changelog.replace("### Added\n", "### Added\n" + clEntry);
fs.writeFileSync('CHANGELOG.md', changelog);

let devjournal = fs.readFileSync('DEV_JOURNAL.md', 'utf-8');
const djEntry = `## 2026-08-09: Batch Edit Tool
- **Feature:** Added "Batch Edit" tool to the Lab tab, allowing users to upload multiple images and process them with a single text instruction.
- **Implementation:** 
  - Added \`batch_edit\` tab state to \`PromptGenerator.tsx\`.
  - Added \`batchEditImages\` array state to handle multiple image uploads via \`FileReader\`.
  - Implemented \`generateEditedImage\` in \`src/services/gemini.ts\` using Gemini 3.1 Flash Image's \`[Image to Edit]\` prompting capability.
  - Sequentially processed the uploaded images to prevent rate limiting, providing incremental UI updates by pushing to \`generatedBatchEditImages\` as each image completes.
- **Why:** The user requested the ability to import multiple local images and apply instructions to edit them in bulk.
`;
devjournal = devjournal + "\n" + djEntry;
fs.writeFileSync('DEV_JOURNAL.md', devjournal);
console.log("Logs updated for Batch Edit");
