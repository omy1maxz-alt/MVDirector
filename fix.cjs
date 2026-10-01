const fs = require('fs');
let content = fs.readFileSync('src/components/SubtitlesTab.tsx', 'utf8');

const replacement = `<div className="flex items-center gap-2"> 
                    <Subtitles className="w-5 h-5 text-indigo-400" /> 
                    <span className="font-bold text-white">{activeView === 'generator' ? 'AI Subtitle Generator' : 'Timeline Editor'}</span>
                </div>`;

content = content.replace(/<div className="flex items-center gap-2">[\s\S]*?\}\)/, replacement);
fs.writeFileSync('src/components/SubtitlesTab.tsx', content);
