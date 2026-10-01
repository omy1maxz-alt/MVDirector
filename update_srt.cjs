const fs = require('fs');
const content = fs.readFileSync('src/services/gemini_srt.ts', 'utf-8');

const newFunc = `async function uploadFileToGemini(file: File, apiKey: string, onProgress?: (p: number) => void): Promise<string> {
    const initRes = await fetch(\`https://generativelanguage.googleapis.com/upload/v1beta/files?key=\${apiKey}\`, {
        method: 'POST',
        headers: {
            'X-Goog-Upload-Protocol': 'resumable',
            'X-Goog-Upload-Command': 'start',
            'X-Goog-Upload-Header-Content-Length': file.size.toString(),
            'X-Goog-Upload-Header-Content-Type': file.type,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ file: { display_name: file.name || 'upload' } })
    });
    
    if (!initRes.ok) throw new Error(\`Upload init failed: \${await initRes.text()}\`);
    
    const uploadUri = initRes.headers.get('X-Goog-Upload-URL');
    if (!uploadUri) throw new Error('Missing upload URL from Gemini API');
    
    if (onProgress) onProgress(20);
    
    const uploadRes = await fetch(uploadUri, {
        method: 'POST',
        headers: {
            'X-Goog-Upload-Protocol': 'resumable',
            'X-Goog-Upload-Command': 'upload, finalize',
            'X-Goog-Upload-Offset': '0'
        },
        body: file
    });
    
    if (!uploadRes.ok) throw new Error(\`Upload failed: \${await uploadRes.text()}\`);
    if (onProgress) onProgress(50);
    
    const data = await uploadRes.json();
    const name = data.file.name.split('/files/')[1];
    const uri = data.file.uri;
    
    // Wait for processing
    let state = data.file.state;
    while (state === 'PROCESSING') {
        await new Promise(resolve => setTimeout(resolve, 3000));
        const res = await fetch(\`https://generativelanguage.googleapis.com/v1beta/files/\${name}?key=\${apiKey}\`);
        if (!res.ok) throw new Error(\`File status check failed\`);
        const statusData = await res.json();
        state = statusData.state;
        if (state === 'FAILED') throw new Error('File processing failed on server');
    }
    
    if (onProgress) onProgress(70);
    return uri;
}

export const generateSRT = async (
    audioFile: File,
    mode: 'ori' | 'dual' | 'triple' | 'quad',
    targetLang: string,
    apiKey?: string,
    onProgress?: (progress: number) => void
): Promise<string> => {
    // @ts-ignore
    const keyToUse = apiKey || process.env.GEMINI_API_KEY!;
    const genAI = getGenAI(keyToUse);
    let systemInstruction = \`You are a professional subtitler and linguist. Your task is to transcribe the provided audio and generate a valid SRT (SubRip Subtitle) file.
    
    Output ONLY the raw SRT format. No markdown formatting, no explanations, no wrapping in \\\`\\\`\\\`srt. Just the plain text.
    CRITICAL RULE 1: Timestamps MUST be in the exact format: 00:00:00,000 --> 00:00:00,000 (hours:minutes:seconds,milliseconds). Ensure milliseconds are always 3 digits and separated by a comma.
NEVER output MM:SS,mmm format. Always output HH:MM:SS,mmm, even when the hour is 00. Example: 00:01:09,500.
Do NOT confuse MM:SS with HH:MM! If the song is at 1 minute and 9 seconds, it is 00:01:09,000, NOT 01:09:00,000.
CRITICAL RULE 2: Chronological order. start < end. Do not output invalid seconds (like 60 or above).
CRITICAL RULE 3: Language and Translation quality. Do not blindly trust auto-transcribed lyrics; preserve the natural meaning.
If translating, use natural, idiomatic phrasing rather than literal word-for-word translation.
If romanizing, ensure correct Pinyin/Romaji spacing and capitalization.\`;

    if (mode === 'ori') {
        if (targetLang && !targetLang.toLowerCase().includes('original')) {
            systemInstruction += \`\\nTranslate the audio into \${targetLang}. Output ONLY the translated \${targetLang} subtitles on a single line per block.\`;
        } else {
            systemInstruction += \`\\nTranscribe the audio in its original language.\`;
        }
    } else if (mode === 'dual') {
        const lang = targetLang.includes('Original') ? 'English' : targetLang;
        systemInstruction += \`\\nGenerate multi-lingual subtitles. For each subtitle block, provide the original language transcription on the first line, and its natural, idiomatic translation(s) in \${lang} on the subsequent lines.\`;
    } else if (mode === 'triple') {
        const lang = targetLang.includes('Original') ? 'English' : targetLang;
        systemInstruction += \`\\nGenerate multi-layered subtitles. For each subtitle block, provide:
1st line: The original language transcription.
2nd line: A precise phonetic transliteration (e.g. Pinyin or Romaji) of the original language.
Subsequent lines: The natural, idiomatic translation(s) in \${lang}.\`;
    } else if (mode === 'quad') {
        const lang = targetLang.includes('Original') ? 'English' : targetLang;
        systemInstruction += \`\\nGenerate quad-layered subtitles (4 lines). For each subtitle block, provide exactly:
1st line: The original language transcription.
2nd line: A precise phonetic transliteration (e.g. Pinyin or Romaji) of the original language.
3rd line: A literal, word-for-word direct translation in English.
4th line: The natural, idiomatic translation in \${lang}.\`;
    }

    const config = {
        temperature: 0.1,
        systemInstruction,
    };
    
    let parts: any[] = [{ text: "Please generate the precise, correctly formatted SRT file for this audio." }];
    
    // File upload logic
    const MAX_INLINE_SIZE = 15 * 1024 * 1024;
    if (audioFile.size <= MAX_INLINE_SIZE) {
        if (onProgress) onProgress(20);
        const buffer = await audioFile.arrayBuffer();
        const base64 = btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
        parts.push({
            inlineData: {
                data: base64,
                mimeType: audioFile.type,
            }
        });
        if (onProgress) onProgress(50);
    } else {
        const fileUri = await uploadFileToGemini(audioFile, keyToUse, onProgress);
        parts.push({
            fileData: {
                fileUri: fileUri,
                mimeType: audioFile.type,
            }
        });
    }

    try {
        if (onProgress) onProgress(80);
        const response = await genAI.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: { parts },
            config
        });
        
        if (onProgress) onProgress(90);
        let text = response.text || "";
        
        if (text.startsWith('\`\`\`')) {
            text = text.replace(/^\`\`\`[a-z]*\\n/, '').replace(/\\n\`\`\`$/, '');
        }
        
        return validateAndFixSRT(text);
        
    } catch (e) {
        console.error("SRT generation failed", e);
        throw e;
    }
}`;

const splitPoint = content.indexOf('export const generateSRT = async (');
const newContent = content.substring(0, splitPoint) + newFunc;
fs.writeFileSync('src/services/gemini_srt.ts', newContent);
