const fs = require('fs');
const data = JSON.parse(fs.readFileSync('agent_bridge.json', 'utf8'));

let lines = data.projectData.lyrics.split('\n');
let newLines = lines.filter(line => {
    // Keep structural lines
    if (line.startsWith('Character:')) return true;
    if (line.startsWith('Song title:')) return true;
    if (line.trim().startsWith('[')) return true;
    
    // Remove lines with English letters
    if (/[a-zA-Z]/.test(line)) return false;
    
    return true;
});

data.projectData.lyrics = newLines.join('\n');
data.updatedBy = 'agent';
data.timestamp = Date.now();

fs.writeFileSync('agent_bridge.json', JSON.stringify(data));
console.log("Updated agent_bridge.json");
