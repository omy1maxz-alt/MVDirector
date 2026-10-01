const fs = require('fs');

let changelog = fs.readFileSync('CHANGELOG.md', 'utf-8');
const clEntry = `- **Improved Swap Char Accuracy:** Fixed an issue where Character Swapping would fail or ignore the face, especially for single-person images without a prompt. The generator now correctly uses strict structural tags (Frame/Character references) required by the Gemini image model and avoids conflicting constraints.
`;
changelog = changelog.replace("### Added\n", "### Added\n" + clEntry);
fs.writeFileSync('CHANGELOG.md', changelog);
console.log("Logs updated for Swap Char Accuracy");
