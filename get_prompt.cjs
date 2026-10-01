const fs = require('fs');
const data = JSON.parse(fs.readFileSync('agent_bridge.json', 'utf8'));
console.log("=== LYRICS ===");
console.log(data.projectData.lyrics.substring(0, 200));
console.log("=== STARTER PROMPT ===");
console.log(data.projectData.technicalInstructions.substring(0, 200));
