const fs = require('fs');

let appContent = fs.readFileSync('src/components/App.tsx', 'utf8');

const oldTechSpec = `  technicalInstructions: \`1. Wide shot of a neon-lit city at night.
2. Close-up of a character looking out a window.
3. Fast montage of abstract light trails.
4. The character walking down an empty street.\`,`;

const newTechSpec = `  technicalInstructions: \`**Emoji/Emote Generation Prompt:**
Close-up portrait of [INSERT CHARACTER NAME], chibi emoji style, transparent background.
1. Smiling happily, waving.
2. Crying with a broken heart.
3. Angry with a little vein popping out.
4. Sleeping with a cute snot bubble.\`,`;

appContent = appContent.replace(oldTechSpec, newTechSpec);
fs.writeFileSync('src/components/App.tsx', appContent);
console.log("Done");
