import fs from 'fs';
let code = fs.readFileSync('src/components/SubtitleTimelineEditor.tsx', 'utf8');

const importRegex = /import \{([^}]+)\} from 'lucide-react';/;
code = code.replace(importRegex, (match, p1) => {
    if (!p1.includes('Youtube')) {
        return `import {${p1}, Youtube} from 'lucide-react';`;
    }
    return match;
});
fs.writeFileSync('src/components/SubtitleTimelineEditor.tsx', code);
