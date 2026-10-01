const fs = require('fs');

let changelog = fs.readFileSync('CHANGELOG.md', 'utf-8');
const clEntry = `- **Enhanced Swap Char:** Added an aspect ratio selector to the Swap Char tool. Fixed an issue where the swapped character's head proportions or lighting would become unnatural by refining the backend prompt to strictly preserve the body proportions, head size, and lighting of the original Frame Reference.
`;
changelog = changelog.replace("### Added\n", "### Added\n" + clEntry);
fs.writeFileSync('CHANGELOG.md', changelog);

let devjournal = fs.readFileSync('DEV_JOURNAL.md', 'utf-8');
const djEntry = `- **Swap Char Aspect Ratio & Proportions:** Updated \`LabState\` and \`PromptGenerator.tsx\` to support \`multiSwapAspect\`. Passed this aspect ratio to \`generateMultiSwapImage\` in \`src/services/gemini.ts\`. Updated the critical prompt instructions inside \`generateMultiSwapImage\` to forcefully tell the model to "strictly preserve the head size, body proportions, and lighting of the original Frame Reference" to prevent the model from skewing anatomical proportions during the identity swap.
`;
devjournal = devjournal + djEntry;
fs.writeFileSync('DEV_JOURNAL.md', devjournal);

console.log("Logs updated for Aspect Ratio and Proportions");
