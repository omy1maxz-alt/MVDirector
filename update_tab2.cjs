const fs = require('fs');
let content = fs.readFileSync('src/components/SubtitlesTab.tsx', 'utf-8');

const startIdx = content.indexOf('const reader = new FileReader();');
const tryStart = content.lastIndexOf('try {', startIdx);
const catchEnd = content.indexOf('setIsGenerating(false);\n        }', startIdx);

if (tryStart !== -1 && catchEnd !== -1) {
    const endIdx = catchEnd + 'setIsGenerating(false);\n        }'.length;
    
    const newBlock = `try {
            const mode = subtitleType === 'standard' ? 'ori' : subtitleType === 'bilingual' ? 'dual' : subtitleType === 'triple' ? 'triple' : 'quad';
            const apiKey = apiKeySource === 'custom' ? apiKeys?.google : (localStorage.getItem('gemini_api_key') || undefined);
            
            const srt = await generateSRT(
                audioFile, 
                mode as any, 
                targetLanguage, 
                apiKey,
                (p) => setProgress(Math.max(10, p))
            );
            
            const endTime = Date.now();
            setGenerationTime(endTime - startTime);
            
            setProgress(90);
            if (srt) {
                setSrtContent(srt);
                setActiveView('editor');
            } else {
                setError('Failed to generate subtitles.');
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setProgress(100);
            setTimeout(() => setIsGenerating(false), 500);
        }`;
    
    const newContent = content.substring(0, tryStart) + newBlock + content.substring(endIdx);
    fs.writeFileSync('src/components/SubtitlesTab.tsx', newContent);
    console.log("Replaced successfully!");
} else {
    console.log("Could not find block boundaries.", tryStart, catchEnd);
}
