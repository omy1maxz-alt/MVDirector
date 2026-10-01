const fs = require('fs');

let changelog = fs.readFileSync('CHANGELOG.md', 'utf-8');
const clEntry = `- **UI Fix:** Adjusted "Swap Char" tool in Lab to allow swapping without a prompt (description), particularly when there is only one character being swapped, defaulting to swapping the main subject.
`;
changelog = changelog.replace("### Added\n- **Image Extension", "### Added\n" + clEntry + "- **Image Extension");
fs.writeFileSync('CHANGELOG.md', changelog);

let devjournal = fs.readFileSync('DEV_JOURNAL.md', 'utf-8');
const djEntry = `- **Bug Fix:** Modified \`handleGenerateMultiSwap\` in \`PromptGenerator.tsx\` to allow character mappings with empty descriptions. If a single character is mapped without a description, it automatically defaults to "The main subject in the image". This fixes an issue where the user was forced to provide a description even for obvious single-person swaps.
`;
devjournal = devjournal + djEntry;
fs.writeFileSync('DEV_JOURNAL.md', devjournal);

console.log("Logs updated for Swap Char Fix");
