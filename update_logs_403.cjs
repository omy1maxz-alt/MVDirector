const fs = require('fs');
let changelog = fs.readFileSync('CHANGELOG.md', 'utf-8');
const clEntry = `- **API Reliability:** Added automatic retries for transient "Permission Denied (403)" errors when the app first loads, which prevents generation tasks from failing abruptly on their first attempt.\n`;
changelog = changelog.replace("### Added\n", "### Added\n" + clEntry);
fs.writeFileSync('CHANGELOG.md', changelog);

let devjournal = fs.readFileSync('DEV_JOURNAL.md', 'utf-8');
const djEntry = `- **Bug Fix (403 Errors):** Modified the \`withRetry\` wrapper in \`src/services/gemini.ts\` to treat 403 Permission Denied errors as retryable (up to \`maxRetries\`). This handles transient proxy/cold-start issues in the platform environment where the very first API call fails with a 403 but subsequent calls succeed.\n`;
devjournal = devjournal + djEntry;
fs.writeFileSync('DEV_JOURNAL.md', devjournal);
console.log("Logs updated for 403 fix");
