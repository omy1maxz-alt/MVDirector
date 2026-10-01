const fs = require('fs');
const content = fs.readFileSync('src/components/SubtitlesTab.tsx', 'utf8');

const importStr = `import { parseSubtitles, generateSrt as generateSrtString } from '../utils/subtitleParser';\n`;
let newContent = content.replace(`import { generateSRT } from '../services/gemini_srt';`, `import { generateSRT } from '../services/gemini_srt';\n${importStr}`);

const replacement = `            if (srt) {
                let finalSrt = srt;
                if (resumeTime && resumeTime.trim() !== '' && srtContent && srtContent.trim() !== '') {
                    try {
                        const existingBlocks = parseSubtitles(srtContent);
                        const newBlocks = parseSubtitles(srt);
                        
                        const [h, m, s] = resumeTime.split(':').map(Number);
                        const resumeTimeMs = ((h || 0) * 3600 + (m || 0) * 60 + (s || 0)) * 1000;
                        
                        const keptBlocks = existingBlocks.filter(b => b.start < resumeTimeMs);
                        
                        const combined = [...keptBlocks, ...newBlocks];
                        finalSrt = generateSrtString(combined);
                    } catch (e) {
                        console.error("Error merging SRTs:", e);
                    }
                }
                setSrtContent(finalSrt);`;

newContent = newContent.replace(`            if (srt) {
                setSrtContent(srt);`, replacement);

fs.writeFileSync('src/components/SubtitlesTab.tsx', newContent);
