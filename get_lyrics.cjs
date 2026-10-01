const fs = require('fs');
const data = JSON.parse(fs.readFileSync('agent_bridge.json', 'utf8'));
fs.writeFileSync('temp_lyrics.txt', data.projectData.lyrics);
console.log(data.projectData.lyrics);
