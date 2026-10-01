import fs from 'fs';
let code = fs.readFileSync('src/components/SubtitleTimelineEditor.tsx', 'utf8');
code = code.replace(
  'const d = (mediaRef.current as any).getDuration();',
  "const d = typeof (mediaRef.current as any).getDuration === 'function' ? (mediaRef.current as any).getDuration() : 0;"
);
fs.writeFileSync('src/components/SubtitleTimelineEditor.tsx', code);
