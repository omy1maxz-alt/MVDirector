const fs = require('fs');

let changelog = fs.readFileSync('CHANGELOG.md', 'utf-8');
const clEntry = `- **UI Fix:** Fixed the Lab tabs layout on mobile screens by making them horizontally scrollable to prevent them from squishing together.
`;
// Let's just append this to the 1.1.11 section we added earlier, or we can just append it below the last entry.
changelog = changelog.replace("### Added\n- **Image Extension", "### Added\n" + clEntry + "- **Image Extension");
fs.writeFileSync('CHANGELOG.md', changelog);

let devjournal = fs.readFileSync('DEV_JOURNAL.md', 'utf-8');
const djEntry = `- **Bug Fix:** Adjusted the Lab tabs flex container with \`overflow-x-auto\` and added \`shrink-0\` to the buttons. This prevents the flex container from crushing the tabs when the screen is too small (e.g., on mobile).
`;
devjournal = devjournal + djEntry;
fs.writeFileSync('DEV_JOURNAL.md', devjournal);

console.log("Logs updated for Tab Fix");
