const fs = require('fs');

let changelog = fs.readFileSync('CHANGELOG.md', 'utf-8');
const clEntry = `- **Reference Image Background Control:** Added a "Solid Gray Background" button to the Reference Image Editor. This allows users to easily swap out cluttered or messy backgrounds with a clean, neutral gray backdrop, which dramatically improves face consistency during character generation and swapping.
`;
changelog = changelog.replace("### Added\n", "### Added\n" + clEntry);
fs.writeFileSync('CHANGELOG.md', changelog);

let devjournal = fs.readFileSync('DEV_JOURNAL.md', 'utf-8');
const djEntry = `- **Face Reference Consistency:** Implemented \`changeReferenceBackground\` in \`gemini.ts\` using Gemini 3.1 Flash Image. The function isolates the subject and replaces the background with solid gray (#808080). This helps prevent the model from inadvertently copying backgrounds from face references into new generations. Wired this into the \`ReferenceEditorModal\` UI.
`;
devjournal = devjournal + djEntry;
fs.writeFileSync('DEV_JOURNAL.md', devjournal);

console.log("Logs updated for Background Change");
