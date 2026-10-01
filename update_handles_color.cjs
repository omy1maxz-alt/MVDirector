const fs = require('fs');
let content = fs.readFileSync('src/components/SubtitleTimelineEditor.tsx', 'utf-8');

const oldStartHandle = `className="absolute left-0 top-0 bottom-0 w-5 sm:w-4 bg-amber-400 cursor-ew-resize flex items-center justify-center z-10 touch-none shadow-[2px_0_4px_rgba(0,0,0,0.3)] rounded-l-md before:content-[''] before:absolute before:inset-y-0 before:-left-6 before:w-6 before:bg-transparent"`;
const newStartHandle = `className={\`absolute left-0 top-0 bottom-0 w-5 sm:w-4 \${isDragging ? 'bg-green-400' : 'bg-amber-400'} cursor-ew-resize flex items-center justify-center z-10 touch-none shadow-[2px_0_4px_rgba(0,0,0,0.3)] rounded-l-md before:content-[''] before:absolute before:inset-y-0 before:-left-6 before:w-6 before:bg-transparent\`}`;

const oldEndHandle = `className="absolute right-0 top-0 bottom-0 w-5 sm:w-4 bg-amber-400 cursor-ew-resize flex items-center justify-center z-10 touch-none shadow-[-2px_0_4px_rgba(0,0,0,0.3)] rounded-r-md before:content-[''] before:absolute before:inset-y-0 before:-right-6 before:w-6 before:bg-transparent"`;
const newEndHandle = `className={\`absolute right-0 top-0 bottom-0 w-5 sm:w-4 \${isDragging ? 'bg-green-400' : 'bg-amber-400'} cursor-ew-resize flex items-center justify-center z-10 touch-none shadow-[-2px_0_4px_rgba(0,0,0,0.3)] rounded-r-md before:content-[''] before:absolute before:inset-y-0 before:-right-6 before:w-6 before:bg-transparent\`}`;

content = content.replace(oldStartHandle, newStartHandle);
content = content.replace(oldEndHandle, newEndHandle);

fs.writeFileSync('src/components/SubtitleTimelineEditor.tsx', content);
console.log("Updated handle colors!");
