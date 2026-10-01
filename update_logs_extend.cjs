const fs = require('fs');

let changelog = fs.readFileSync('CHANGELOG.md', 'utf-8');
const clEntry = `## [1.1.11] - 2026-07-18
### Added
- **Image Extension (Outpainting) via Lab Tab:** Added a new "Extend Image" tab in the Lab that allows users to upload an image and outpaint it into a new aspect ratio (16:9, 9:16, 1:1) while preserving the original subject matter, using Gemini 3.1 Flash Image's capabilities.

`;
changelog = changelog.replace(/^# Changelog\n\n/, "# Changelog\n\n" + clEntry);
fs.writeFileSync('CHANGELOG.md', changelog);

let devjournal = fs.readFileSync('DEV_JOURNAL.md', 'utf-8');
const djEntry = `## 2026-07-18: Extended Image / Outpainting in Lab
- **Feature:** Added "Extend Image" tool in the Lab tab to allow changing the aspect ratio of uploaded images.
- **Implementation:** Added \`generateExtendedImage\` in \`src/services/gemini.ts\` using \`gemini-3.1-flash-image\`. Updated \`PromptGenerator.tsx\` to include the new tab UI, state for \`extendImageSource\`, \`extendImageAspect\`, and \`generatedExtendImage\`.
- **Why:** The user requested "Add on lab extended image. so it'll adjust the ratio while preserve the original uploaded image", allowing them to easily adjust image dimensions for outpainting tasks directly within the MV Director.
`;
devjournal = devjournal + "\n" + djEntry;
fs.writeFileSync('DEV_JOURNAL.md', devjournal);

console.log("Logs updated for Extend Image");
