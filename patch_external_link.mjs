import fs from 'fs';
let code = fs.readFileSync('src/components/SubtitleTimelineEditor.tsx', 'utf8');

const importRegex = /import \{([^}]+)\} from 'lucide-react';/;
code = code.replace(importRegex, (match, p1) => {
    if (!p1.includes('ExternalLink')) {
        return `import {${p1}, ExternalLink} from 'lucide-react';`;
    }
    return match;
});

const oldPlayer = `<div className="absolute inset-0 z-10 cursor-pointer" onClick={togglePlay} />
                        <div className="absolute inset-0 w-full h-full">`;

const newPlayer = `<div className="absolute inset-0 z-10 cursor-pointer" onClick={togglePlay} />
                        <button 
                            onClick={(e) => { e.stopPropagation(); window.open(youtubeUrl, '_blank'); }}
                            className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-black/80 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 backdrop-blur-sm transition-all border border-white/10 hover:border-white/30"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Pop out (Bypass Block)
                        </button>
                        <div className="absolute inset-0 w-full h-full">`;

code = code.replace(oldPlayer, newPlayer);

fs.writeFileSync('src/components/SubtitleTimelineEditor.tsx', code);
