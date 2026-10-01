const fs = require('fs');
let content = fs.readFileSync('CHANGELOG.md', 'utf-8');

const newEntry = `## [1.1.9] - 2026-07-17
### Added
- **Master Art Style Selection:** Added a "Set as Master Art Style" checkbox on Visual References. When checked, the image generation engines will explicitly use that reference to completely override and guide the final image's aesthetic, rendering technique, color palette, and tone.
- Added a "MASTER ART" indicator to Visual Reference cards in the Project Dashboard.

`;

content = content.replace(/^# Changelog\n\n/, "# Changelog\n\n" + newEntry);

fs.writeFileSync('CHANGELOG.md', content);
console.log("Updated CHANGELOG.md");
