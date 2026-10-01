const fs = require('fs');
let content = fs.readFileSync('src/components/SubtitleTimelineEditor.tsx', 'utf-8');

const oldFunc = `const formatTimeWithMs = (ms: number): string => {
    const totalSeconds = Math.max(0, ms) / 1000;
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
    const fraction = Math.floor((totalSeconds % 1) * 100).toString().padStart(2, '0');
    return \`\${m}:\${s}.\${fraction}\`;
};`;

const newFunc = `const formatTimeWithMs = (ms: number): string => {
    const totalSeconds = Math.max(0, ms) / 1000;
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
    const fraction = Math.floor(Math.max(0, ms) % 1000).toString().padStart(3, '0');
    return \`\${m}:\${s}.\${fraction}\`;
};`;

content = content.replace(oldFunc, newFunc);
fs.writeFileSync('src/components/SubtitleTimelineEditor.tsx', content);
console.log("Updated timeline time format.");
