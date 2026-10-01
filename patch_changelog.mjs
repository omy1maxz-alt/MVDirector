import fs from 'fs';

let changelog = fs.readFileSync('CHANGELOG.md', 'utf8');

const change = `### Fixed
- **Second Brain Note Button Nesting:** Resolved a React DOM nesting warning (\`validateDOMNesting: <button> cannot appear as a descendant of <button>\`) by refactoring the note item container in the Second Brain sidebar to an accessible \`div\` element.
- **Second Brain Mobile Layout:** Fixed broken responsive layout on mobile screens. The Second Brain now uses a sleek Master/Detail view pattern on mobile, allowing users to toggle seamlessly between the note list and the full-screen editor.`;

changelog = changelog.replace(/### Fixed\n- \*\*Second Brain Note Button Nesting:\*\* Resolved a React DOM nesting warning \(\`validateDOMNesting: <button> cannot appear as a descendant of <button>\`\) by refactoring the note item container in the Second Brain sidebar to an accessible \`div\` element./, change);

fs.writeFileSync('CHANGELOG.md', changelog);
