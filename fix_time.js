const fs = require('fs');
let code = fs.readFileSync('src/components/SubtitlesTab.tsx', 'utf8');

const oldCode = `                        const [h, m, s] = resumeTime.split(':').map(Number);
                        const resumeTimeMs = ((h || 0) * 3600 + (m || 0) * 60 + (s || 0)) * 1000;`;

const newCode = `                        const parts = resumeTime.split(':').map(Number);
                        let h = 0, m = 0, s = 0;
                        if (parts.length === 3) {
                            [h, m, s] = parts;
                        } else if (parts.length === 2) {
                            [m, s] = parts;
                        } else {
                            s = parts[0] || 0;
                        }
                        const resumeTimeMs = (h * 3600 + m * 60 + s) * 1000;`;

code = code.replace(oldCode, newCode);
fs.writeFileSync('src/components/SubtitlesTab.tsx', code);
