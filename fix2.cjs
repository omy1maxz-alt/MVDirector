const fs = require('fs');
let content = fs.readFileSync('src/components/SubtitlesTab.tsx', 'utf8');

let startIndex = content.indexOf('<div className="flex flex-col h-full bg-black/95">');
let endIndex = content.indexOf('<div className="flex bg-black/40 p-1 rounded-lg w-fit border border-white/10 shrink-0">');

let newHeader = `<div className="flex flex-col h-full bg-black/95">
            <div className="p-4 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between shrink-0 bg-white/5 gap-4">
                <div className="flex items-center gap-2"> 
                    <Subtitles className="w-5 h-5 text-indigo-400" /> 
                    <span className="font-bold text-white">{activeView === 'generator' ? 'AI Subtitle Generator' : 'Timeline Editor'}</span>
                </div>
                
                `;

let newContent = content.substring(0, startIndex) + newHeader + content.substring(endIndex);
fs.writeFileSync('src/components/SubtitlesTab.tsx', newContent);
