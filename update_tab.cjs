const fs = require('fs');
let content = fs.readFileSync('src/components/SubtitlesTab.tsx', 'utf-8');

const oldBlock = `        try {
            const reader = new FileReader();
            reader.readAsDataURL(audioFile);
            reader.onload = async () => {
                setProgress(30);
                const base64 = (reader.result as string).split(',')[1];
                const mode = subtitleType === 'standard' ? 'ori' : subtitleType === 'bilingual' ? 'dual' : subtitleType === 'triple' ? 'triple' : 'quad';
                
                try {
                    setProgress(50);
                    const apiKey = apiKeySource === 'custom' ? apiKeys?.google : (localStorage.getItem('gemini_api_key') || undefined);
                    const srt = await generateSRT(base64, audioFile.type, mode as any, targetLanguage, apiKey);
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
                }
            };
            reader.onerror = () => {
                setError("Failed to read file.");
                setIsGenerating(false);
            };
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
            setIsGenerating(false);
        }`;

const newBlock = `        try {
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

content = content.replace(oldBlock, newBlock);
fs.writeFileSync('src/components/SubtitlesTab.tsx', content);
