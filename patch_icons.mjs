import fs from 'fs';
let code = fs.readFileSync('src/components/SubtitleTimelineEditor.tsx', 'utf8');

const importRegex = /import \{([^}]+)\} from 'lucide-react';/;
code = code.replace(importRegex, (match, p1) => {
    let clean = p1.replace(/,\s*ExternalLink/g, '').replace(/ExternalLink\s*,?/g, '');
    clean = clean.replace(/,\s*Youtube/g, '').replace(/Youtube\s*,?/g, '');
    return `import {${clean}} from 'lucide-react';`;
});
fs.writeFileSync('src/components/SubtitleTimelineEditor.tsx', code);
