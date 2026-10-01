const fs = require('fs');
console.log("Checking if syntax is valid...");
try {
  require('@babel/core').parseSync(fs.readFileSync('src/components/SubtitleTimelineEditor.tsx', 'utf-8'), {
    presets: ['@babel/preset-typescript', '@babel/preset-react'],
    filename: 'src/components/SubtitleTimelineEditor.tsx'
  });
  console.log("Syntax OK");
} catch(e) {
  console.error(e.message);
}
