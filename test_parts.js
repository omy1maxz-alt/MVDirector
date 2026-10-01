const fs = require('fs');
let code = fs.readFileSync('src/services/gemini_srt.ts', 'utf8');

// We need to parse resumeTime into startOffsetSeconds in generateSRT
const injection = `
    let videoMetadata = undefined;
    if (resumeTime) {
        const parts = resumeTime.replace(',', '.').split(':').map(Number);
        let h = 0, m = 0, s = 0;
        if (parts.length === 3) {
            [h, m, s] = parts;
        } else if (parts.length === 2) {
            [m, s] = parts;
        } else {
            s = parts[0] || 0;
        }
        const startOffsetSeconds = h * 3600 + m * 60 + s;
        if (startOffsetSeconds > 0) {
            videoMetadata = { startOffset: \`\${startOffsetSeconds}s\` };
        }
    }
`;

// Insert the injection right before parts.push
code = code.replace(/const MAX_INLINE_SIZE = 15 \* 1024 \* 1024;/, injection + '\n    const MAX_INLINE_SIZE = 15 * 1024 * 1024;');

// Update inlineData push
code = code.replace(/parts\.push\(\{\n\s*inlineData: \{([\s\S]*?)\}\n\s*\}\);/, 'parts.push({\n            inlineData: {$1},\n            ...(videoMetadata ? { videoMetadata } : {})\n        });');

// Update fileData push
code = code.replace(/parts\.push\(\{\n\s*fileData: \{([\s\S]*?)\}\n\s*\}\);/, 'parts.push({\n            fileData: {$1},\n            ...(videoMetadata ? { videoMetadata } : {})\n        });');

fs.writeFileSync('src/services/gemini_srt.ts', code);
