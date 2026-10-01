const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'agent_bridge.json');
const rawData = fs.readFileSync(filePath, 'utf-8');
const data = JSON.parse(rawData);

data.projectData.creativeContext = "A sophisticated, slow-burn visual poem celebrating the essence of quiet luxury. The narrative follows an intimate, voyeuristic exploration of a timeless muse—either Song Ann or Eve Laurentine—moving gracefully through architectural spaces, sunlit galleries, and minimal interiors. The pacing should feel like a high-end fashion editorial come to life, prioritizing mood, atmosphere, and the unspoken tension of a fleeting glance. It is an homage to museum-quality portraiture, capturing the melancholic beauty of 'the velvet hours'—that twilight moment where light softens and time stands still.";

data.projectData.recurringMotifs = "Soft morning light casting long shadows on concrete walls; whispering silk and cashmere textures; delicate, muted floral arrangements; the interplay of warm golden hour glow and cool concrete; slow-motion turning and looking away; hands resting in pockets or gently touching the face; architectural leading lines in empty hallways and galleries.";

data.updatedBy = 'agent';
data.timestamp = Date.now();

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log("Updated projectData successfully!");
