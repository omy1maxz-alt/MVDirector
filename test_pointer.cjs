const fs = require('fs');
let content = fs.readFileSync('src/components/SubtitleTimelineEditor.tsx', 'utf-8');
const match = content.match(/} else if \(type === 'select_scrub'\) \{[\s\S]*?\} else \{[\s\S]*?\}/);
console.log(match ? match[0] : 'not found');
