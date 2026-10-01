import { GoogleGenAI, HarmCategory, HarmBlockThreshold, GenerationConfig, Type } from "@google/genai";
import { ProjectData, DirectorPlan, AspectRatio, ReferenceImage } from '../types';
import { callKieChatCompletion, KieChatMessage } from './kieChatService';
import { generateKieImage } from './kie';

// --- Core Setup --- 

let currentTextModel = 'gemini-3.7-flash';
let currentImageModel = 'gemini-3.1-flash-image';

export const setTextModel = (model: string) => {
    currentTextModel = model;
};
export const getCurrentTextModel = () => currentTextModel;

export const setImageModel = (model: string) => {
    currentImageModel = model;
};

export let customOpenAIBaseUrl: string | undefined;
export let customOpenAIApiKey: string | undefined;
export let customOpenAIModel: string | undefined;

export const setCustomOpenAISettings = (baseUrl?: string, apiKey?: string, model?: string) => {
    customOpenAIBaseUrl = baseUrl;
    customOpenAIApiKey = apiKey;
    customOpenAIModel = model;
};

export let customKieApiKey: string | undefined;
export let customKieModel: string | undefined;

export const setKieSettings = (apiKey?: string, model?: string) => {
    customKieApiKey = apiKey;
    customKieModel = model;
};

export async function callTextModel(genAI: GoogleGenAI, request: any): Promise<any> {
    if (typeof request.model === 'string' && request.model.startsWith('kie:')) {
        const rawModel = request.model.replace(/^kie:/, '');
        const modelId = rawModel === 'custom' ? (customKieModel || 'gemini-3.5-flash') : rawModel;

        const keyToUse = customKieApiKey || (typeof window !== 'undefined' ? (() => {
            try {
                const stored = localStorage.getItem('mv_api_keys');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed.kie) return parsed.kie;
                }
                return localStorage.getItem('kie_api_key') || '';
            } catch {
                return '';
            }
        })() : '') || (process.env.KIE_API_KEY || '');

        if (!keyToUse) {
            throw new Error(`KIE Chat Model "${modelId}" is selected, but no KIE API Key was provided. Please open Settings -> API Settings and enter your Kie AI API Key.`);
        }

        const messages: KieChatMessage[] = [];
        
        // System instruction
        if (request.config?.systemInstruction) {
            const sysText = typeof request.config.systemInstruction === 'string' 
                ? request.config.systemInstruction 
                : request.config.systemInstruction.parts?.[0]?.text || "";
            if (sysText) {
                messages.push({ role: 'system', content: sysText });
            }
        }

        // Parse contents
        const contents = request.contents;
        let contentsArr = Array.isArray(contents) ? contents : [contents];
        
        for (const item of contentsArr) {
            if (typeof item === 'string') {
                messages.push({ role: 'user', content: item });
                continue;
            }
            
            const role: 'user' | 'assistant' = item.role === 'model' ? 'assistant' : 'user';
            
            if (item.parts) {
                let textAccumulator = '';
                for (const part of item.parts) {
                    if (part.text) {
                        textAccumulator += (textAccumulator ? '\n' : '') + part.text;
                    }
                }
                if (textAccumulator) {
                    messages.push({ role, content: textAccumulator });
                }
            } else if (item.text) {
                messages.push({ role, content: item.text });
            }
        }

        // Guarantee at least one user message
        if (!messages.some(m => m.role === 'user')) {
            messages.push({ role: 'user', content: 'Generate the requested production plan.' });
        }

        const isJsonMode = Boolean(request.config?.responseSchema || request.config?.responseMimeType === 'application/json');

        // Handle schema / JSON requests with explicit structural contract
        if (isJsonMode) {
            const lastMsg = messages[messages.length - 1];
            if (lastMsg) {
                const isDirectorPlan = Boolean(request.config?.responseSchema?.properties?.scenes || lastMsg.content.includes('scenes'));
                if (isDirectorPlan) {
                    lastMsg.content += `\n\nCRITICAL OUTPUT FORMAT REQUIREMENTS:
You MUST respond with a valid, parseable JSON object adhering to this schema:
{
  "title": "Music Video Title",
  "theme": "Visual style theme and mood",
  "scenes": [
    {
      "songSection": "Intro / Verse 1 / Chorus / Bridge / Outro",
      "emotionalTone": "Dominant emotional mood",
      "title": "Scene 1: Visual Scene Concept",
      "imagePrompt": "Detailed visual description of a static shot including master art style, character names, lighting, composition, camera angle, and atmosphere.",
      "videoMotionPrompt": "Concise camera motion description (e.g. Slow cinematic zoom in).",
      "isContinuation": false
    }
  ]
}
RULES:
1. Return ONLY the raw JSON object. Do NOT wrap output in markdown code blocks (\`\`\`json) or conversational commentary.
2. The "scenes" array MUST contain all requested scenes. NEVER return an empty array "[]" or empty scenes array.`;
                } else if (!lastMsg.content.toLowerCase().includes('raw json')) {
                    lastMsg.content += "\n\nCRITICAL: You must return valid raw JSON only. Do NOT wrap output in markdown tags or extra conversational commentary.";
                }
            }
        }

        const reply = await callKieChatCompletion({
            model: modelId,
            messages,
            apiKey: keyToUse,
            temperature: request.config?.temperature ?? 0.7,
            maxTokens: Math.max(request.config?.maxOutputTokens ?? 8192, 8192),
            responseFormat: isJsonMode ? 'json_object' : undefined,
        });

        return {
            text: reply || ""
        };
    }

    if (request.model === 'custom-openai') {
        if (!customOpenAIBaseUrl || !customOpenAIApiKey || !customOpenAIModel) {
            throw new Error("Custom OpenAI Provider is selected but keys/model are missing in API Settings Vault.");
        }

        const messages: any[] = [];
        
        // System instruction
        if (request.config?.systemInstruction) {
            messages.push({
                role: "system",
                content: typeof request.config.systemInstruction === 'string' 
                    ? request.config.systemInstruction 
                    : request.config.systemInstruction.parts?.[0]?.text || ""
            });
        }

        // Parse contents
        const contents = request.contents;
        let contentsArr = Array.isArray(contents) ? contents : [contents];
        
        for (const item of contentsArr) {
            if (typeof item === 'string') {
                messages.push({ role: 'user', content: item });
                continue;
            }
            
            const role = item.role === 'model' ? 'assistant' : 'user';
            
            if (item.parts) {
                const contentParts: any[] = [];
                for (const part of item.parts) {
                    if (part.text) {
                        contentParts.push({ type: "text", text: part.text });
                    }
                    if (part.inlineData) {
                        contentParts.push({
                            type: "image_url",
                            image_url: { url: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` }
                        });
                    }
                }
                
                // If only text, we can just pass string to be safe with older APIs
                if (contentParts.length === 1 && contentParts[0].type === 'text') {
                    messages.push({ role, content: contentParts[0].text });
                } else if (contentParts.length > 0) {
                    messages.push({ role, content: contentParts });
                }
            } else if (item.text) {
                messages.push({ role, content: item.text });
            }
        }

        const payload: any = {
            model: customOpenAIModel,
            messages: messages,
            temperature: request.config?.temperature ?? 0.7,
            max_tokens: request.config?.maxOutputTokens ?? 2048,
        };

        if (request.config?.responseSchema || request.config?.responseMimeType === 'application/json') {
            payload.response_format = { type: "json_object" };
        }

        let url = customOpenAIBaseUrl.replace(/\/$/, '') + '/chat/completions';

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${customOpenAIApiKey}`
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(`OpenAI API Error (${res.status}): ${err}`);
        }

        const data = await res.json();
        return {
            text: data.choices[0]?.message?.content || ""
        };
    } else {
        return genAI.models.generateContent(request);
    }
}


export const getEffectiveGeminiApiKey = (explicitKey?: string): string => {
    if (explicitKey && typeof explicitKey === 'string' && explicitKey.trim()) {
        return explicitKey.trim();
    }
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            const vaultKeys = localStorage.getItem('mv_api_keys');
            if (vaultKeys) {
                const parsed = JSON.parse(vaultKeys);
                if (parsed?.google && typeof parsed.google === 'string' && parsed.google.trim()) {
                    return parsed.google.trim();
                }
            }
            const directKey = localStorage.getItem('gemini_api_key');
            if (directKey && typeof directKey === 'string' && directKey.trim()) {
                return directKey.trim();
            }
        }
    } catch (_) {}
    // @ts-ignore
    return (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) || '';
};

export const getGenAI = (apiKey?: string) => {
  const keyToUse = getEffectiveGeminiApiKey(apiKey);
  return new GoogleGenAI({ apiKey: keyToUse });
};

export const withRetry = async <T>(operation: () => Promise<T>, maxRetries = 3, baseDelay = 2000): Promise<T> => {
    let retries = 0;
    while (true) {
        try {
            return await operation();
        } catch (error: any) {
            const errorMessage = error?.message || '';
            const isQuotaExceeded = errorMessage.includes('Quota exceeded') || errorMessage.includes('exceeded your current quota');
            
            if (isQuotaExceeded) {
                throw new Error("API Quota Exceeded. The API key has reached its limit. If you are using the built-in key, please open the Settings menu and enter your own Gemini API key. If you are already using your own key, you may need to wait for your quota to reset or enable billing in Google AI Studio.");
            }

            const isRateLimit = error?.status === 429 || errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED');
            const isPermissionDenied = error?.status === 403 || errorMessage.includes('403') || errorMessage.includes('PERMISSION_DENIED');
            
            if ((isRateLimit || isPermissionDenied) && retries < maxRetries) {
                retries++;
                const delay = baseDelay * Math.pow(2, retries - 1) + Math.random() * 1000;
                console.warn(`${isRateLimit ? 'Rate limit' : 'Permission Denied'} hit. Retrying in ${Math.round(delay)}ms... (Attempt ${retries} of ${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else if (isRateLimit) {
                throw new Error("API Rate Limit (429) hit too many times. Please wait a moment and try again, or check your API key quota.");
            } else if (isPermissionDenied) {
                throw new Error("Permission Denied (403). Your API key may be invalid, or it may not have access to the requested model. Image generation models often require setting up a paid tier in Google AI Studio.");
            } else {
                throw error;
            }
        }
    }
};

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

const generationConfig: GenerationConfig = {
  temperature: 0.45,
  topP: 0.85,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

// --- Helper Functions ---

const extractJSON = (text: string): string => {
    let cleanedText = text.replace(/```json\n?|```/g, '').trim();
    const firstBrace = cleanedText.indexOf('{');
    const firstBracket = cleanedText.indexOf('[');
    
    let isArray = false;
    if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
        isArray = true;
    }
    
    const startChar = isArray ? '[' : '{';
    const endChar = isArray ? ']' : '}';
    
    const startIdx = cleanedText.indexOf(startChar);
    const endIdx = cleanedText.lastIndexOf(endChar);
    
    if (startIdx !== -1 && endIdx !== -1 && endIdx >= startIdx) {
        return cleanedText.substring(startIdx, endIdx + 1);
    }
    return cleanedText;
};

export const safeParseJSON = (text: string): any => {
    if (!text || typeof text !== 'string') return null;
    let cleaned = text
        .replace(/<think>[\s\S]*?<\/think>/gi, '')
        .replace(/<thought>[\s\S]*?<\/thought>/gi, '')
        .replace(/```json\n?|```/g, '')
        .trim();
    
    // 1. Direct JSON parse
    try {
        return JSON.parse(cleaned);
    } catch (_) {}

    // 2. Try parsing object { ... }
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
        try {
            return JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
        } catch (_) {}
    }

    // 3. Try parsing array [ ... ]
    const firstBracket = cleaned.indexOf('[');
    const lastBracket = cleaned.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket > firstBracket) {
        try {
            return JSON.parse(cleaned.substring(firstBracket, lastBracket + 1));
        } catch (_) {}
    }

    // 4. Try truncated repairs for object
    if (firstBrace !== -1 && lastBrace !== -1) {
        const base = cleaned.substring(firstBrace, lastBrace + 1);
        try { return JSON.parse(base + ']}'); } catch (_) {}
        try { return JSON.parse(base + '}'); } catch (_) {}
    }

    // 5. Try truncated repair for array
    if (firstBracket !== -1 && lastBracket !== -1) {
        const base = cleaned.substring(firstBracket, lastBracket + 1);
        try { return JSON.parse(base + ']'); } catch (_) {}
    }

    // 6. Fallback to extractJSON
    try {
        return JSON.parse(extractJSON(cleaned));
    } catch (_) {
        return null;
    }
};

export const normalizeDirectorScenes = (parsed: any): any[] => {
    if (!parsed) return [];
    if (Array.isArray(parsed)) return parsed;

    // Check common container array keys
    const arrayKeys = ['scenes', 'shots', 'plan', 'sequence', 'storyboard', 'data', 'items', 'output', 'result'];
    for (const key of arrayKeys) {
        if (Array.isArray(parsed[key]) && parsed[key].length > 0) {
            return parsed[key];
        }
    }

    // Check if any other property is an array of scene-like objects
    if (typeof parsed === 'object') {
        for (const key of Object.keys(parsed)) {
            if (Array.isArray(parsed[key]) && parsed[key].length > 0) {
                const first = parsed[key][0];
                if (typeof first === 'object' && (first.imagePrompt || first.title || first.videoMotionPrompt || first.description)) {
                    return parsed[key];
                }
            }
        }
    }

    // If parsed is itself a single scene object
    if (typeof parsed === 'object' && (parsed.imagePrompt || (parsed.title && parsed.videoMotionPrompt) || parsed.concept)) {
        return [parsed];
    }

    // If parsed has an empty scenes array
    if (Array.isArray(parsed.scenes)) return parsed.scenes;

    return [];
};

export const analyzeFramesWithGemini = async (base64Images: string[], apiKey?: string) => {
    const keyToUse = apiKey;
    if (!keyToUse) {
        throw new Error('No API key available.');
    }
    
    const genAI = new GoogleGenAI({ apiKey: keyToUse });
    
    try {
        const parts = [
            { text: `I am providing you with ${base64Images.length} sequential frames extracted from a video. Please analyze the sequence and describe the motion, identify any duplicate/still frames, and tell me which frames are the most important "keyframes" that capture the major action.` }
        ];
        
        for (const base64 of base64Images) {
            parts.push({
                inlineData: {
                    data: base64,
                    mimeType: "image/jpeg"
                }
            } as any);
        }

        const response = await withRetry(() => callTextModel(genAI, {
            model: getCurrentTextModel() || 'gemini-3.7-flash',
            contents: parts
        }));
        
        return { text: response.text };
    } catch (error: any) {
        throw new Error(`Failed to analyze frames: ${error.message}`);
    }
};

export const analyzeVideoAgentic = async (youtubeUrl: string, apiKey?: string) => {
    const keyToUse = apiKey || import.meta.env.VITE_GEMINI_API_KEY;
    if (!keyToUse) {
        throw new Error('No API key available.');
    }
    
    const genAI = new GoogleGenAI({ apiKey: keyToUse });
    
    try {
        const parts = [
            { text: `I am providing you with a video. Please analyze it dynamically and describe the motion, identify any duplicate/still frames, and tell me which frames are the most important "keyframes" that capture the major action.` },
            { fileData: { fileUri: youtubeUrl } }
        ];
        
        const currentModel = getCurrentTextModel();
        const agenticModel = (currentModel.includes('3.7') || currentModel.includes('3.8')) ? currentModel : 'gemini-3.7-flash';

        const response = await withRetry(() => callTextModel(genAI, {
            model: agenticModel,
            contents: parts,
            config: { processing: "agentic" } as any
        }));
        
        return { text: response.text };
    } catch (error: any) {
        throw new Error(`Failed to analyze video: ${error.message}`);
    }
};

export const analyzeImageToJson = async (base64Image: string, apiKey?: string, subjectReplacement?: string, referenceImages?: any[]) => {
    const ai = getGenAI(apiKey);
    
    let prompt = `You are given a MAIN IMAGE to analyze, and optionally some REFERENCE IMAGES.
    
MAIN TASK:
Analyze the MAIN IMAGE (the first image provided) and extract its key visual features into a JSON object.
Provide an EXTREMELY detailed, microscopic analysis of the image. Capture the EXACT framing, composition, spatial layout, lighting nuances, and textures so it can be replicated perfectly.`;

    if (subjectReplacement) {
        prompt += `\n\nCRITICAL INSTRUCTION: Replace the original main subject(s) in the MAIN IMAGE with: "${subjectReplacement}". `;
        if (subjectReplacement.includes('REF_')) {
            prompt += `The replacement subject refers to one of the REFERENCE IMAGES provided at the end of this prompt. You MUST look at that specific reference image to understand who the subject is. However, DO NOT describe their facial features (eyes, nose, lips, skin texture) in the 'subject' field. Just use their name/tag and describe the HAIR STYLE, MAKEUP, CLOTHING, POSE, and ACTION exactly as they appear in the MAIN IMAGE. CRITICAL: The clothing, pose, framing, styling and hair MUST be extracted exclusively from the MAIN IMAGE. Do NOT extract clothing or posing from the REFERENCE IMAGE.`;
        } else {
            prompt += `DO NOT describe detailed facial features (eyes, nose, lips, skin texture) in the 'subject' field. Just use the name "${subjectReplacement}" and describe the HAIR STYLE, MAKEUP, CLOTHING, POSE, and ACTION exactly as they appear in the MAIN IMAGE. CRITICAL: The clothing, pose, framing, styling and hair MUST be extracted exclusively from the MAIN IMAGE.`;
        }
        prompt += `Keep all other aspects (framing, lighting, environment, style, pose, action) exactly as they appear in the MAIN IMAGE.`;
    }
    
    prompt += `\n\nCRITICAL: DO NOT describe facial features (eyes, nose, lips, facial geometry) anywhere in your response. You MUST describe the HAIR STYLE, hair color, makeup, composition, lighting, body posture, clothing, and the environment.`;

    prompt += `\n\nInclude the following keys in the JSON:
- subject: A description of the main subject(s) ${subjectReplacement ? '(using the replacement provided)' : ''}. Include hair style, makeup, clothing, expression, and exact pose. DO NOT include detailed facial features.
- style: The artistic style or medium (e.g., cinematic, oil painting, 35mm photography).
- masterArtStyle: A highly detailed, comprehensive prompt string designed to perfectly replicate the exact visual aesthetic, artistic style, medium, rendering techniques, camera specifics, and color grading of this image in an AI image generator. CRITICAL: This must be a UNIVERSAL style prompt. Do NOT include the specific subject, environment, props, or specific textures tied to objects in the image. Focus purely on the global stylistic elements: camera lens, lighting feel, color grading, illustration techniques, brushstroke style, rendering engine, or film medium.
- lighting: The exact lighting setup, including light sources, direction, shadows, and highlights.
- colors: The dominant color palette and specific color names.
- composition: The framing, camera angle, rule of thirds, and exact spatial arrangement of elements.
- mood: The overall emotional tone or atmosphere.
- environment: A highly detailed description of the background, setting, props, and weather/time of day.
- frame_reference: A specific description of the camera's perspective, focal length, and distance (e.g., "Extreme close-up, low angle, 35mm lens, shallow depth of field").
- optimizedPrompt: A complete, highly structured image generation prompt using the best practices for AI image generators. It MUST follow this structure: [Subject & Action] in [Environment & Context], [Lighting & Mood], [Camera Lens, Framing, & Composition], [Art Style, Medium, rendering details]. Combine the extracted elements into a single, highly descriptive and flowing paragraph.

Return ONLY a valid JSON object. Do not include markdown formatting or extra text.`;

    const imagePart = {
        inlineData: {
            data: base64Image.split(',')[1],
            mimeType: getMimeType(base64Image),
        }
    };

    const parts: any[] = [{ text: "--- MAIN IMAGE ---" }, imagePart, { text: prompt }];

    if (referenceImages && referenceImages.length > 0 && subjectReplacement && subjectReplacement.includes('REF_')) {
        parts.push({ text: "\n\n--- REFERENCE IMAGES ---\nHere are the reference images provided. If the replacement refers to REF_1, REF_2, etc., they correspond to these images in order:" });
        referenceImages.forEach((ref, index) => {
            parts.push({ text: `\n[REF_${index + 1}]: ${ref.description || 'No description'}` });
            parts.push({
                inlineData: {
                    data: ref.data.split(',')[1],
                    mimeType: getMimeType(ref.data),
                }
            });
        });
    }

    const response = await withRetry(() => callTextModel(ai, {
        model: currentTextModel,
        contents: { parts },
        config: {
            responseMimeType: 'application/json',
            temperature: 0.2,
            safetySettings,
        }
    }));

    const text = response.text?.trim() || "{}";
    try {
        return JSON.parse(extractJSON(text));
    } catch (e) {
        console.warn("Failed to parse JSON from Gemini:", text);
        return { error: "Failed to parse JSON", rawText: text };
    }
};

export const enhancePrompt = async (basePrompt: string, styleModifier: string, qualityModifier: string, apiKey?: string) => {
    const ai = getGenAI(apiKey);
    
    const prompt = `Take the original written prompt and transform it into a more detailed, vivid, and technically refined version.
    
Original Base Prompt: "${basePrompt}"
Style Modifier: "${styleModifier}"
Quality/Details: "${qualityModifier}"

Generate 4 distinct variations of this prompt. Each variation should be a single, highly descriptive paragraph suitable for a generative AI image model. 
Focus on composition, lighting, atmosphere, and specific details.

Return ONLY a valid JSON array of strings. Do not include markdown formatting or extra text.
Example: ["Variation 1...", "Variation 2...", "Variation 3...", "Variation 4..."]`;

    const response = await withRetry(() => callTextModel(ai, {
        model: currentTextModel,
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            temperature: 0.7,
            safetySettings,
        }
    }));

    const text = response.text?.trim() || "[]";
    try {
        return JSON.parse(extractJSON(text));
    } catch (e) {
        console.warn("Failed to parse JSON from Gemini:", text);
        return [
            `${basePrompt}, ${styleModifier}, high contrast, dramatic shadows, ${qualityModifier}`,
            `${basePrompt}, ${styleModifier}, vibrant colors, pop art, ${qualityModifier}`,
            `Close up shot of ${basePrompt}, ${styleModifier}, detailed face, ${qualityModifier}`,
            `Wide angle shot of ${basePrompt}, ${styleModifier}, vast landscape, ${qualityModifier}`
        ];
    }
};

const calculateEstimatedScenes = (totalDuration: string, segmentDuration: string): number => {
    let totalSeconds = 0;
    if (totalDuration.includes(':')) {
        const parts = totalDuration.split(':');
        const min = parseInt(parts[0]) || 0;
        const sec = parseInt(parts[1]) || 0;
        totalSeconds = (min * 60) + sec;
    } else {
        totalSeconds = parseInt(totalDuration) || 180;
    }
    const segmentSeconds = parseInt(segmentDuration.replace(/[^0-9]/g, '')) || 6;
    if (totalSeconds <= 0 || segmentSeconds <= 0) return 10;
    return Math.ceil(totalSeconds / segmentSeconds);
};

const buildSystemPrompt = (projectData: ProjectData): string => {
    const targetSceneCount = projectData.useAutoSceneCount 
        ? Math.max(1, calculateEstimatedScenes(projectData.totalDuration, "7s"))
        : Math.max(1, projectData.sceneCount || 4);

    let prompt = `You are a professional Music Video Director specializing in storyboarding and visual direction for AI-generated image-to-video pipelines. Your task is to create a detailed, scene-by-scene production plan for a ${projectData.projectType}.

**Primary Goal:** Translate the user's creative input into a structured, actionable plan. Each scene must have a unique title, a detailed visual description (imagePrompt), and a motion description (videoMotionPrompt). Each scene will be rendered into a 6-8 second video clip using an image-to-video model.

**Core Instructions:**
1.  **Adhere to Specifications:** Strictly follow all project specifications: ${projectData.useAutoSceneCount ? 'total duration, ' : ''}scene count, art style, and aspect ratio.
2.  **Scene Structure:** Generate exactly the number of scenes specified.
3.  **Image Prompt Generation:** The 'imagePrompt' for each scene is CRITICAL. It must be a detailed, single-paragraph description suitable for a generative AI imaging model.
    -   Incorporate the 'Master Art Style': ${projectData.artStyle}
    -   Include details from the creative brief, character descriptions, and recurring motifs.
    -   Mention characters strictly by their EXACT FULL NAME. CRITICAL: DO NOT use generic pronouns like "he", "she", "man", or "woman" when describing characters, as this causes the image generator to confuse their identities. Always use their exact name in every scene they appear in to guarantee the correct reference image is applied.
    -   **Cinematic Composition:** Explicitly define the shot type (e.g., Extreme Close-up, Wide Angle, Over-the-shoulder, Drone shot, low-angle) and framing context (e.g., Rule of Thirds, leading lines, symmetry).
    -   **Lighting & Atmosphere:** Specify the lighting conditions to set the mood (e.g., volumetric rays, neon glow, chiaroscuro shadows, rim lighting, softbox, cinematic rim light, golden hour, moody overcast).
    -   **Artistic Texture:** Add descriptors for texture and aesthetic quality (e.g., 35mm film grain, anamorphic lens flare, shallow depth of field, hyper-detailed, photorealistic aesthetics, 8k resolution, crisp focus).
    -   STATIC IMAGE MANDATE (CRITICAL): The 'imagePrompt' is used to generate a STATIC, frozen image. Focus purely on describing a single frozen moment in time. NEVER describe movement occurring over time (e.g., DO NOT use phrases like "slowly turns her head", "shifting to", "the camera pans", "starts to walk"). Instead, describe the frozen state or pose (e.g., use phrases like "seen from a low angle", "looking over her shoulder", "hand frozen mid-reach", "with a subtle nervous expression").
    -   ACTION & POSE MANDATE: NEVER generate a character just "standing still," "looking at the camera," or "posing." You MUST specify dynamic poses, clear cinematic micro-actions (e.g., reaching out, sprinting, leaning against a wall, adjusting a collar), subtle but distinct facial expressions (e.g., furrowed brow, soft smile, eyes widened in shock), and complex spatial interactions so the still image is inherently dramatic and active, captured in a single still frame.
    -   SUBJECT FACING & HEAD ANGLE: AI image generators frequently default to a "3/4 left profile" (looking left 45 degrees). You MUST actively override this by explicitly stating the character's facing direction and head angle in EVERY prompt to ensure cinematic variety. Use a mix of: "facing the camera directly," "profile view facing right," "looking off-screen to the right," "back to the camera looking over shoulder," "looking straight up," etc. Do NOT allow characters to repetitively face left 45 degrees.
    -   Every still must be composable as a single frozen frame that carries meaning without motion.
4.  **Video Motion Prompt Generation:** The 'videoMotionPrompt' should describe the camera movement or action within the scene in a concise phrase (e.g., "Slow zoom in," "Dynamic camera pan left," "Character looks up"). Motion prompts must describe only what can realistically occur in 6-8 seconds.
5.  **Continuity Logic (CRITICAL):**
    -   Decide if a scene is a CONTINUATION of the previous scene or a NEW SCENE.
    -   If CONTINUATION: Maintain the exact same setting, subject position, lighting, and style in the 'imagePrompt'. Advance only the action/motion in the 'videoMotionPrompt'.
    -   If NEW SCENE: Introduce a clear visual break. Justify the transition emotionally or narratively based on the ${projectData.generationMode === 'narrative' ? 'lyric shift' : 'instruction progression'}.
6.  **Character Consistency:** If characters are defined, ONLY incorporate them into a scene if they are explicitly mentioned or strictly logically required by the user's input (lyrics or technical instructions). DO NOT arbitrarily insert characters into the storyboard if they are not part of the starter prompt. For characters that *are* included: if a character's profile is missing details like hairstyle, outfit, makeup, or styling, you MUST invent highly detailed, fashionable, and cohesive options for them and include them directly in the 'imagePrompt' for each scene they appear in. CRITICAL: If a character's description includes a reference tag (e.g., "REF_1", "Based on REF_2"), DO NOT describe their facial features or identity in the prompt, and DO NOT write the REF tag in the prompt either. The image generation engine already knows which reference image belongs to which character. Describing their face or adding tags in text will cause the AI to generate a new, random character. Only describe their styling (hair, makeup, clothing), action, emotion, and the environment. ALWAYS use the character's full name in the prompt.
7.  **ANTI-REPETITION & UNLIMITED VARIATION (CRITICAL):** Do NOT fall into repetitive patterns. Unless explicitly requested to hold a scene, every new scene must introduce entirely new elements: a new location, setting, time of day, lighting condition, camera angle, wardrobe/styling, and distinct action/emotion. Ensure absolute and unlimited variation across the storyboard to prevent visual fatigue.
8.  **Multi-Perspective Review Protocol (Internal):** Before finalizing the scene array, you must internally convene a panel of expert personas (Continuity Director, Composition Critic, and Prompt Engineer). Have them silently review your draft scenes to catch continuity errors, repetitive camera angles, and weak prompt descriptions. Synthesize their feedback and output ONLY the final, flawless JSON storyboard.
9.  **Safety & Sanitization:** Ensure all generated prompts are safe and free of content that would violate typical AI safety policies. Rephrase any potentially problematic user input into a safe equivalent. If the user provides a creative context/manifesto, use it to understand their intent and avoid misinterpreting artistic expression as harmful content.

**Project Details:**
-   **Project Type:** ${projectData.projectType}
-   **Director Persona:** ${projectData.directorPersona}
-   **Master Art Style:** ${projectData.artStyle}
${projectData.useAutoSceneCount ? `-   **Total Duration:** ${projectData.totalDuration}\n` : ''}-   **Total Scenes:** ${targetSceneCount} (Generate exactly ${targetSceneCount} scenes; never return an empty scene array)
-   **Recurring Motifs:** ${projectData.recurringMotifs || 'None'}
-   **Creative Context/Manifesto:** ${projectData.creativeContext || 'None'}
`;

    if (projectData.generationMode === 'narrative') {
        prompt += `**Enhanced Creative Brief — Story Mode (Lyrics-Only) Specifics:**
Act as a world-class Music Video Director and Cinematographer. Analyze the complete song lyrics (and reference audio if provided) to extract the core storytelling structure and generate a cinematic music video storyboard.
Goal: Transform the lyrical narrative into a coherent, highly stylized sequence of expressive visual scenes that perfectly follow the song's musical and emotional progression.

**Algorithmic Cinematography Rulebook:**
You MUST strictly adhere to the following heuristic framework when generating scenes to ensure professional pacing, optics, and aesthetic evolution.

Directive 1: Global Pacing Constraint (ASL per section)
- Intro (Target ASL 4.0s-6.0s): Establish environment. Static, slow pedestal, or smooth tracking.
- Verse (Target ASL 2.5s-4.0s): Restrained narrative building. Dolly in, slow pan.
- Pre-Chorus (Target ASL 1.0s-2.5s): Accelerate cut frequency, build tension. Accelerating push-in.
- Chorus (Target ASL 0.5s-1.5s): Maximum kinetic cutting. Whip pans, rapid tracking, handheld.
- Bridge (Target ASL 5.0s-10.0s): Temporal disruption, long takes. High crane sweeps, dramatic contrast.

Directive 2: Optics and Composition Allocation
- Intimate/Vulnerable moments: Telephoto Lens (>85mm), Extreme Close-Up (ECU), Shallow Depth of Field.
- Kinetic Performance: Wide-Angle Lens (<35mm), Medium Wide Shot (MWS), Deep Focus, Exaggerated Z-Axis.
- Cinematic Climax: Anamorphic Lens (2x Squeeze), Wide Shot (WS), 2.39:1 Aspect Ratio, Oval Bokeh.

Directive 3: Temporal Motion (Frame Rate) Mapping
- Standard Sync: Simulate 24fps, 1/48s shutter, natural motion blur.
- Elevated Grace: Simulate 60fps conformed to 24fps, 1/120s shutter, smooth slow-motion.
- Temporal Suspension (Bridge/Climax): Simulate 120fps conformed to 24fps, 1/240s shutter, dramatic 5x slow-motion.
- Speed Ramp: Simulate 120fps dynamically remapped to 24fps.

Directive 4: Dynamic Camera Actuation & Metaphor
- Build Tension: Dolly In, Slow Tracking, Pedestal Up.
- Transition Energy: Whip Pan, Crash Zoom, Match Cut.
- Scale and Awe: Boom/Jib Up, Aerial Drone Overhead, Double Dolly.
- Psychological Shift: Dolly Zoom (Vertigo Effect), Dutch Angle Tilt, 360 Roll.
- Visual Metaphors: Use Spatial Isolation (vast empty spaces), Multiplicity (clones), Elemental Submersion (water/fire), Tiny Planet (360 VR), or Panoptic Gaze (overhead drone) instead of literal lyric interpretations.

Directive 5: Chromatic and Luminance Evolution
- 0% - 30% (Intro/Verse 1): Desaturated, Low-key Lighting, Chiaroscuro.
- 31% - 70% (Chorus 1/Verse 2): Saturated, High-Contrast, Figure-to-Ground Separation.
- 71% - 100% (Bridge/Final Chorus): Opposing Color Palette (e.g., Teal/Orange), Diagonal Light Beams, High-Key Strobe.

**Analysis Process:**
1. **Core Theme:** Identify the song's deeper emotional truth.
2. **Musical Structure Mapping:** Divide the lyrics into distinct musical sections (Intro, Verse, Pre-Chorus, Chorus, Bridge, Outro). Each section represents a narrative beat.
3. **Visual Scene Translation:** Convert each beat into a concise cinematic scene using the Directives above. Include setting, character actions, camera framing, lens choice, frame rate, and lighting.
4. **Scene Continuity and Flow:** Determine if a scene continues the previous setting (isContinuation: true) or cuts to a new location/metaphor (isContinuation: false). Interleave A-Roll (Performance) with B-Roll (Atmospheric/Narrative).
`;
    } else {
        prompt += `
**Tech Mode (Instructions-Only) Specifics:**
- **Instruction Execution:** Follow the provided technical instructions to generate the scenes.
- **Scene Distribution:** Distribute the narrative or action described in the instructions evenly across the total requested scene count.
- **Ignore Lyrics:** Do not attempt to find or use lyrics. Base the entire plan solely on the technical instructions.
`;
    }

    if (projectData.characters && projectData.characters.length > 0) {
        // Only include characters whose names are explicitly mentioned in the user's input
        const allText = `${projectData.lyrics || ''} ${projectData.technicalInstructions || ''} ${projectData.creativeContext || ''}`.toLowerCase();
        
        const mentionedCharacters = projectData.characters.filter(char => {
            const fullName = char.name.toLowerCase();
            const firstName = fullName.split(' ')[0];
            return allText.includes(fullName) || (firstName.length > 2 && allText.includes(firstName));
        });

        if (mentionedCharacters.length > 0) {
            prompt += "\n**Cast (ONLY these characters are available for this storyboard):**\n";
            mentionedCharacters.forEach(char => {
                let descToPass = { ...char.description };
                if (descToPass.facialFeatures && descToPass.facialFeatures.startsWith('REF_')) {
                    descToPass.facialFeatures = "[REDACTED - Face provided via image reference. Do not describe face or eyes.]";
                    // descToPass.hairStyle = "[REDACTED - Hair provided via image reference. Do not describe hair.]";
                    descToPass.bodyType = "[REDACTED - Body provided via image reference. Do not describe body shape.]";
                    descToPass.keyExpressions = "[REDACTED - Do not describe detailed facial features or micro-expressions in the prompt.]";
                }
                prompt += `- **${char.name}:** ${JSON.stringify(descToPass)}\n`;
            });
            prompt += "\nCRITICAL CHARACTER MANDATE: You MUST ONLY use the characters listed above. DO NOT invent new characters. DO NOT use characters from other projects. If the starter prompt specifies particular characters from this list, feature ONLY those requested.\n";
        }
    }

    return prompt;
};

const buildUserPrompt = (projectData: ProjectData): string => {
    const targetCount = projectData.useAutoSceneCount 
        ? Math.max(1, calculateEstimatedScenes(projectData.totalDuration, "7s"))
        : Math.max(1, projectData.sceneCount || 4);

    if (projectData.generationMode === 'narrative') {
        const lyrics = projectData.lyrics.trim() || "(No lyrics provided. Please generate a creative sequence based on the theme and style.)";
        return `Here are the lyrics. Create a complete director plan with exactly ${targetCount} scenes based strictly on them. IGNORE any technical instructions.\n\n---\n${lyrics}\n---\n\nYou MUST return a JSON object with "title" (string) and "scenes" (an array of exactly ${targetCount} scene objects). Each scene must contain "title", "imagePrompt", "videoMotionPrompt", and "isContinuation". Never return an empty array.`;
    } else {
        const instructions = projectData.technicalInstructions.trim() || "(No technical instructions provided. Please generate a creative sequence based on the theme and style.)";
        return `Here are the technical instructions. Create a plan with exactly ${targetCount} scenes based strictly on them. Generate exactly the number of scenes requested. IGNORE any lyrics.\n\n---\n${instructions}\n---\n\nYou MUST return a JSON object with "title" (string) and "scenes" (an array of exactly ${targetCount} scene objects). Each scene must contain "title", "imagePrompt", "videoMotionPrompt", and "isContinuation". Never return an empty array.`;
    }
};

// --- API-facing Functions ---

const directorPlanSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A creative and fitting title for the project." },
        scenes: {
            type: Type.ARRAY,
            description: "The array of scenes that make up the production plan.",
            items: {
                type: Type.OBJECT,
                properties: {
                    songSection: { type: Type.STRING, description: "The section of the song this scene aligns with (e.g., 'Verse 1', 'Chorus', 'Bridge'). Leave empty if not applicable." },
                    emotionalTone: { type: Type.STRING, description: "The dominant feeling conveyed in the lyrics during this moment." },
                    title: { type: Type.STRING, description: "Visual Scene Concept: A short, descriptive title for the scene (e.g., 'Neon Alley Chase')." },
                    imagePrompt: { type: Type.STRING, description: "A detailed, single-paragraph prompt for an AI image generator. This MUST include the master art style, character descriptions, camera angle, character pose, facial expression, lighting, setting, and mood. This is the most important field." },
                    videoMotionPrompt: { type: Type.STRING, description: "A brief description of the camera motion or action in the scene (e.g., 'Slow dolly in', 'Subject running towards camera'). CRITICAL: Because this will be used for Image-to-Video generation, do NOT include character names or physical descriptions (hair, skin, etc.) here, as it causes AI hallucination. Only describe action and cinematography." },
                    isContinuation: { type: Type.BOOLEAN, description: "Set to true ONLY if this scene is a direct visual continuation of the previous scene (same location, same characters, continuous action). Otherwise false." },
                },
                required: ["title", "imagePrompt", "videoMotionPrompt", "isContinuation"]
            }
        }
    },
    required: ["title", "scenes"]
};

export const continueDirectorPlan = async (projectData: ProjectData, existingPlan: DirectorPlan, apiKey: string | undefined, addLog: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void): Promise<DirectorPlan> => {
    addLog("Connecting to Gemini to continue plan...", 'info');
    const genAI = getGenAI(apiKey);

    const systemInstruction = buildSystemPrompt(projectData);
    const baseUserPrompt = buildUserPrompt(projectData);
    
    // We need to tell the AI what has already been generated so it continues from there.
    const existingScenesJson = JSON.stringify(existingPlan.scenes.map(s => ({
        title: s.title,
        songSection: s.songSection,
        emotionalTone: s.emotionalTone,
        imagePrompt: s.imagePrompt,
        videoMotionPrompt: s.videoMotionPrompt,
        isContinuation: s.isContinuation
    })), null, 2);

    const existingCount = existingPlan.scenes.length;
    const targetTotal = projectData.useAutoSceneCount 
        ? Math.max(1, calculateEstimatedScenes(projectData.totalDuration, "7s"))
        : Math.max(1, projectData.sceneCount || 4);
    const scenesToGenerate = Math.max(2, targetTotal > existingCount ? targetTotal - existingCount : 3);

    const continuePrompt = `${baseUserPrompt}\n\nIMPORTANT: The plan was partially generated (${existingCount} scenes already exist). Here are the scenes generated so far:\n\`\`\`json\n${existingScenesJson}\n\`\`\`\n\nPlease CONTINUE generating ${scenesToGenerate} NEW scenes starting from Scene ${existingCount + 1} where the last scene left off. DO NOT output the scenes that have already been generated. ONLY output the NEW scenes in a JSON object with a "scenes" array containing exactly ${scenesToGenerate} scene objects.\n\nCRITICAL ANTI-REPETITION MANDATE:\nYou MUST NOT repeat the locations, actions, specific wardrobe details, or exact framing used in the previously generated scenes (unless strictly logically required for continuity). Every new scene MUST introduce entirely new elements:\n- A new location or setting.\n- Different wardrobe or styling if time has passed.\n- A completely different activity or micro-action.\n- A different emotional nuance, lighting condition, or time of day.\n- A different camera angle and composition.\nEnsure unlimited variation and NEVER fall into a repetitive pattern from the previous batch!`;

    addLog("Building director prompts for continuation...", 'info');
    const parts: any[] = [{ text: continuePrompt }];
    
    if (projectData.localFiles && projectData.localFiles.length > 0) {
        addLog("Attaching reference audio soundtrack...", 'info');
        const file = projectData.localFiles[projectData.currentTrackIndex || 0] || projectData.localFiles[0];
        if (file && file.type.startsWith('audio/')) {
            try {
                const base64Audio = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = error => reject(error);
                });
                parts.push({ text: "\n\nHere is the reference audio track for the project. Please listen to it to understand the musical pacing, mood, and emotional tone, and synchronize the scene flow with its structure:\n" });
                parts.push({
                    inlineData: {
                        data: base64Audio.split(',')[1],
                        mimeType: file.type || 'audio/mpeg',
                    }
                });
                addLog("Audio attached successfully.", 'success');
            } catch (e) {
                addLog("Failed to attach audio file.", 'warning');
            }
        }
    }

    if (projectData.referenceImages && projectData.referenceImages.length > 0) {
        parts.push({ text: "\n\nHere are the reference images provided for this project. If the user refers to REF_1, REF_2, etc., they correspond to these images in order:" });
        projectData.referenceImages.forEach((ref, index) => {
            
            parts.push({ text: `\n[REF_${index + 1}]: ${ref.description || 'No description'}` });
            parts.push({
                inlineData: {
                    data: ref.data.split(',')[1],
                    mimeType: getMimeType(ref.data),
                }
            });
        });
    }

    const contents = { parts };

    const config = {
        ...generationConfig,
        responseSchema: directorPlanSchema,
        systemInstruction,
    };

    addLog("Generating next scenes... This may take a moment.", 'info');
    const response = await withRetry(() => callTextModel(genAI, { model: currentTextModel, contents, config }));
    
    addLog("Parsing response from AI Director...", 'info');
    let text = "{}";
    try {
        text = response.text?.trim() || "{}";
    } catch (e: any) {
        throw new Error(`AI refused to generate the plan (Safety or Policy violation). Reason: ${e.message}`);
    }
    
    const parsed = safeParseJSON(text);
    let rawScenes = normalizeDirectorScenes(parsed);

    if (rawScenes.length === 0) {
        addLog("AI Director determined all storyboard scenes are already complete.", 'info');
        return existingPlan;
    }
    
    try {
        const startIndex = existingPlan.scenes.length;
        
        const newScenes = rawScenes.map((scene: any, index: number) => {
            const sceneTitle = scene.title || `Scene ${startIndex + index + 1}`;
            let combinedPrompt = (scene.imagePrompt || scene.prompt || scene.description || "").trim();
            if (!combinedPrompt) {
                combinedPrompt = `Cinematic scene continuing the narrative in master art style: ${projectData.artStyle}.`;
            }

            // Auto-detect disabled characters based on presence in the prompt
            const disabledCharacterIds: string[] = [];
            if (projectData.characters && projectData.characters.length > 0) {
                const lowerPrompt = combinedPrompt.toLowerCase();
                projectData.characters.forEach(char => {
                    if (!lowerPrompt.includes(char.name.toLowerCase())) {
                        disabledCharacterIds.push(char.id);
                    }
                });
            }

            return {
                ...scene,
                title: sceneTitle,
                songSection: scene.songSection || "",
                emotionalTone: scene.emotionalTone || "",
                imagePrompt: combinedPrompt,
                videoMotionPrompt: scene.videoMotionPrompt || scene.motionPrompt || "Slow cinematic dolly in",
                isContinuation: Boolean(scene.isContinuation),
                timestamp: Date.now() + index,
                isGenerating: false,
                isGeneratingVideo: false,
                isEnhancing: false,
                isQueued: false,
                seed: Math.floor(Math.random() * 1000000),
                disabledCharacterIds,
            };
        });
        
        const plan: DirectorPlan = {
            ...existingPlan,
            scenes: [...existingPlan.scenes, ...newScenes]
        };
        return plan;
    } catch (e: any) {
        console.error("Failed to parse director plan:", text, e);
        throw new Error(e?.message && !e.message.includes("unexpected format") ? e.message : "The AI Director returned a plan in an unexpected format. Please try again.");
    }
};
export const createDirectorPlan = async (projectData: ProjectData, apiKey: string | undefined, addLog: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void): Promise<DirectorPlan> => {
    addLog("Connecting to Gemini...", 'info');
    const genAI = getGenAI(apiKey);

    const systemInstruction = buildSystemPrompt(projectData);
    const userPrompt = buildUserPrompt(projectData);

    addLog("Building director prompts...", 'info');
    const parts: any[] = [{ text: userPrompt }];
    
    if (projectData.localFiles && projectData.localFiles.length > 0) {
        addLog("Attaching reference audio soundtrack...", 'info');
        const file = projectData.localFiles[projectData.currentTrackIndex || 0] || projectData.localFiles[0];
        if (file && file.type.startsWith('audio/')) {
            try {
                const base64Audio = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = error => reject(error);
                });
                parts.push({ text: "\n\nHere is the reference audio track for the project. Please listen to it to understand the musical pacing, mood, and emotional tone, and synchronize the scene flow with its structure:\n" });
                parts.push({
                    inlineData: {
                        data: base64Audio.split(',')[1],
                        mimeType: file.type || 'audio/mpeg',
                    }
                });
                addLog("Audio attached successfully.", 'success');
            } catch (e) {
                addLog("Failed to attach audio file.", 'warning');
            }
        }
    }

    if (projectData.referenceImages && projectData.referenceImages.length > 0) {
        parts.push({ text: "\n\nHere are the reference images provided for this project. If the user refers to REF_1, REF_2, etc., they correspond to these images in order:" });
        projectData.referenceImages.forEach((ref, index) => {
            parts.push({ text: `\n[REF_${index + 1}]: ${ref.description || 'No description'}` });
            parts.push({
                inlineData: {
                    data: ref.data.split(',')[1],
                    mimeType: getMimeType(ref.data),
                }
            });
        });
    }

    const contents = { parts };

    const config = {
        ...generationConfig,
        responseSchema: directorPlanSchema,
        systemInstruction,
    };

    addLog("Generating creative plan... This may take a moment.", 'info');
    const response = await withRetry(() => callTextModel(genAI, { model: currentTextModel, contents, config }));
    
    addLog("Parsing response from AI Director...", 'info');
    let text = "{}";
    try {
        text = response.text?.trim() || "{}";
    } catch (e: any) {
        throw new Error(`AI refused to generate the plan (Safety or Policy violation). Reason: ${e.message}`);
    }
    
    const parsed = safeParseJSON(text);
    let rawScenes = normalizeDirectorScenes(parsed);

    if (rawScenes.length === 0) {
        addLog("AI Director returned an empty plan; synthesizing opening scene from theme.", 'warning');
        rawScenes = [{
            title: "Scene 1: Opening Shot",
            songSection: "Intro",
            emotionalTone: "Cinematic",
            imagePrompt: `Cinematic establishing shot in master art style: ${projectData.artStyle}. ${projectData.creativeContext || projectData.recurringMotifs || 'Atmospheric lighting, dramatic composition, cinematic lens depth.'}`,
            videoMotionPrompt: "Slow cinematic dolly in establishing the visual world.",
            isContinuation: false,
        }];
    }
    
    try {
        const plan: DirectorPlan = {
            title: (parsed && typeof parsed === 'object' && parsed.title) ? parsed.title : (projectData.projectType ? `${projectData.projectType} Production Plan` : "Music Video Production Plan"),
            theme: (parsed && typeof parsed === 'object' && parsed.theme) ? parsed.theme : (projectData.artStyle || "Default Theme"),
            colorPalette: (parsed && typeof parsed === 'object' && Array.isArray(parsed.colorPalette)) ? parsed.colorPalette : [],
            scenes: rawScenes.map((scene: any, index: number) => {
                const sceneTitle = scene.title || `Scene ${index + 1}`;
                let combinedPrompt = (scene.imagePrompt || scene.prompt || scene.description || "").trim();
                if (!combinedPrompt) {
                    combinedPrompt = `Cinematic scene in master art style: ${projectData.artStyle}.`;
                }

                // Auto-detect disabled characters based on presence in the prompt
                const disabledCharacterIds: string[] = [];
                if (projectData.characters && projectData.characters.length > 0) {
                    const lowerPrompt = combinedPrompt.toLowerCase();
                    projectData.characters.forEach(char => {
                        if (!lowerPrompt.includes(char.name.toLowerCase())) {
                            disabledCharacterIds.push(char.id);
                        }
                    });
                }

                return {
                    ...scene,
                    title: sceneTitle,
                    songSection: scene.songSection || "",
                    emotionalTone: scene.emotionalTone || "",
                    imagePrompt: combinedPrompt,
                    videoMotionPrompt: scene.videoMotionPrompt || scene.motionPrompt || "Slow cinematic dolly in",
                    isContinuation: Boolean(scene.isContinuation),
                    timestamp: Date.now() + index,
                    isGenerating: false,
                    isGeneratingVideo: false,
                    isEnhancing: false,
                    isQueued: false,
                    seed: Math.floor(Math.random() * 1000000),
                    disabledCharacterIds,
                };
            })
        };
        return plan;
    } catch (e: any) {
        console.error("Failed to parse director plan:", text, e);
        throw new Error(e?.message && !e.message.includes("unexpected format") ? e.message : "The AI Director returned a plan in an unexpected format. Please try again.");
    }
};

const getAspectRatio = (aspectRatio: AspectRatio): "1:1" | "16:9" | "9:16" | "4:3" | "3:4" => {
    if (aspectRatio === "16:9") return "16:9";
    if (aspectRatio === "9:16") return "9:16";
    if (aspectRatio === "1:1") return "1:1";
    if (aspectRatio === "4:3") return "4:3";
    if (aspectRatio === "3:4") return "3:4";
    if (aspectRatio === "8:15") return "9:16";
    return "16:9";
};

const getMimeType = (dataUrl: string) => {
    const match = dataUrl.match(/^data:([^;]+);base64,/);
    return match ? match[1] : 'image/jpeg';
};

const buildReferenceParts = (references: ReferenceImage[], projectData: ProjectData): { parts: any[], instructions: string[] } => {
    if (!references || references.length === 0) return { parts: [], instructions: [] };

    const parts: any[] = [];
    const instructions: string[] = [];
    
    // Note: If both a Frame Reference and a Character Reference were supplied, the caller should have 
    // intercepted the Frame Reference and transcribed it before calling this, so it won't actually hit this.
    // However, if it does, we provide a strong fallback instruction.
    const hasFrameRef = references.some(r => r.roles.includes('Frame') || r.roles.includes('Continuity'));
    const hasCharRef = references.some(r => r.roles.includes('Face') || r.roles.includes('Body') || r.characterId || projectData.characters.some(c => c.description.facialFeatures.includes(r.id.substring(0, 8)))); // Approximate char ref check
    
    if (hasFrameRef && hasCharRef) {
        instructions.push(`CRITICAL MULTI-IMAGE RULE: PERFECT SUBJECT REPLACEMENT. You are provided with TWO or more conflicting reference images.
Your task is to recreate the Composition/Frame Reference perfectly, but REPLACE the person's face and identity with the person from the Character Face Reference.
- CRITICAL: DO NOT copy the pose, clothing, background, artistic style, tone, or lighting from the Character Face Reference.
- Treat the images completely independently.
- DO NOT change the clothing, pose, background, or artistic style from the Frame Reference unless specified in the text prompt.
- Perform a perfect subject face/identity replacement while inheriting the visual tone and stylistic rendering of the Frame Reference.`);
    }

    // Sort references: Character/Face first, then Frame/Continuity, then others
    const sortedReferences = [...references].sort((a, b) => {
        const aIsChar = a.roles.includes('Face') || a.characterId || projectData.characters?.some(c => c.description.facialFeatures.includes(a.id.substring(0, 8)));
        const bIsChar = b.roles.includes('Face') || b.characterId || projectData.characters?.some(c => c.description.facialFeatures.includes(b.id.substring(0, 8)));
        const aIsFrame = a.roles.includes('Frame') || a.roles.includes('Continuity');
        const bIsFrame = b.roles.includes('Frame') || b.roles.includes('Continuity');
        
        if (aIsChar && !bIsChar) return -1;
        if (!aIsChar && bIsChar) return 1;
        if (aIsFrame && !bIsFrame) return -1;
        if (!aIsFrame && bIsFrame) return 1;
        return 0;
    });
    
    sortedReferences.forEach((ref, index) => {
        const originalIndex = projectData.referenceImages.findIndex(r => r.id === ref.id);
        const refId = originalIndex !== -1 ? `REF_${originalIndex + 1}` : null;
        
        const character = ref.characterId 
            ? projectData.characters.find(c => c.id === ref.characterId) 
            : (refId ? projectData.characters.find(c => c.description.facialFeatures === refId) : undefined);
            
        let refLabel = `[Image ${index + 1}]`;
        let instructionParts = [];
        
        if (ref.roles.includes('Continuity')) {
            refLabel = `[Frame Reference]`;
            instructionParts.push(`is the EXACT pose, clothing, and background. Maintain visual consistency from this previous frame. CRITICAL: Ignore the face/identity of any people shown in this frame, only use it for environmental consistency`);
        } else if (ref.roles.includes('Frame')) {
            refLabel = `[Frame Reference]`;
            instructionParts.push(`is the EXACT pose, clothing, and background. Use this strictly to establish the composition, camera angle, and scene setup`);
        } else if (character || ref.roles.includes('Face')) {
            refLabel = character ? `[Character Reference: ${character.name}]` : `[Character Reference]`;
            instructionParts.push(`is the EXACT face and identity of ${character ? character.name : 'the subject'}. You MUST perfectly clone this person's facial features and identity in your generated image. CRITICAL: DO NOT copy the artistic style, tone, or lighting of this reference image`);
            
            if (ref.isolateFace) {
                instructionParts.push(`CRITICAL: Ignore the hairstyle and clothing shown in this reference image. Adapt their hairstyle, clothing and pose strictly according to the text prompt`);
            } else {
                instructionParts.push(`Adapt their clothing and pose to match the text prompt`);
            }
        } else if (ref.roles.includes('Style') || ref.isMasterArt) {
            refLabel = ref.isMasterArt ? `[Master Art Style Reference]` : `[Style Reference]`;
            instructionParts.push(`is the EXACT and absolute master art style. You MUST strictly copy the visual aesthetic, rendering technique, color palette, line work, tone, and texture of this image over the entire generated scene. Ignore any conflicting style words in the text prompt`);
        } else {
            instructionParts.push(`use as a general visual reference`);
        }

        if (ref.focusTags && ref.focusTags.length > 0) {
            instructionParts.push(`PAY SPECIAL ATTENTION TO and strictly copy these specific elements: ${ref.focusTags.join(', ')}`);
        }
        
        if (ref.description) {
            instructionParts.push(`Additional context: "${ref.description}"`);
        }
        
        const instruction = `Image ${index + 1} (${refLabel}) ` + instructionParts.join('. ') + '.';
        instructions.push(instruction);

        parts.push({ text: refLabel + ":" });
        parts.push({
            inlineData: {
                data: ref.data.split(',')[1],
                mimeType: getMimeType(ref.data),
            }
        });
    });

    return { parts, instructions };
};

const fallbackToPollinations = async (prompt: string, aspectRatio: string, addLog?: (msg: string, type?: 'info'|'warning'|'error'|'success') => void): Promise<string> => {
    try {
        addLog?.("Gemini API image quota exceeded. Falling back to free public API...", 'warning');
        let width = 1280;
        let height = 720;
        if (aspectRatio === '16:9') { width = 1280; height = 720; }
        if (aspectRatio === '9:16') { width = 720; height = 1280; }
        if (aspectRatio === '1:1') { width = 1024; height = 1024; }
        if (aspectRatio === '4:3') { width = 1024; height = 768; }
        if (aspectRatio === '3:4') { width = 768; height = 1024; }
        if (aspectRatio === '8:15') { width = 720; height = 1350; }
        if (aspectRatio === '14:9') { width = 1120; height = 720; }
        if (aspectRatio === '2.35:1') { width = 1280; height = 540; }
        
        // Clean prompt for url
        const cleanPrompt = prompt.replace(/\r?\n|\r/g, " ").substring(0, 1000);
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=${width}&height=${height}&model=flux&nologo=true`;
        
        const res = await fetch(url);
        if (!res.ok) throw new Error("Free public API failed to generate the image.");
        const blob = await res.blob();
        
        const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
        
        addLog?.("Free generation successful.", 'success');
        return base64;
    } catch (e: any) {
        throw new Error(`Fallback failed: ${e.message}`);
    }
}

export const generateSceneImage = async (
    prompt: string,
    aspectRatio: AspectRatio,
    references: ReferenceImage[],
    projectData: ProjectData,
    apiKey: string | undefined,
    seed: number,
    addLog: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void,
    disabledCharacterIds?: string[]
): Promise<string> => {
    if (currentImageModel === 'pollinations') {
        return await fallbackToPollinations(prompt, aspectRatio, addLog);
    }
    
    addLog("Connecting to image generation service...", 'info');
    const genAI = getGenAI(apiKey);
    
    // Filter references to only include those relevant to the prompt
    const relevantReferences = references.filter((ref) => {
        if (ref.enabled === false) return false;
        // NEVER pass Character Sheets to the image generator visually, as the grid layout confuses it.
        if (ref.roles.includes('Character Sheet')) return false;

        if (ref.roles.includes('Continuity') || ref.roles.includes('Frame')) return true;
        
        const originalIndex = projectData.referenceImages.findIndex(r => r.id === ref.id);
        const refId = originalIndex !== -1 ? `REF_${originalIndex + 1}` : null;
        
        const character = ref.characterId 
            ? projectData.characters.find(c => c.id === ref.characterId) 
            : (refId ? projectData.characters.find(c => c.description.facialFeatures === refId) : undefined);
            
        if (character) {
            if (disabledCharacterIds?.includes(character.id)) return false;
            const trimmedName = character.name.trim();
            if (!trimmedName) return false;
            
            const escapedName = trimmedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            // Safely split and check firstName
            const firstNameParts = escapedName.split(/\s+/);
            const firstName = firstNameParts[0];
            
            if (!firstName) return false;

            // Only allow firstName matching if length > 2 to prevent accidental matching of generic/short pronouns like "A", "I", "He"
            let regexStr = `\\b(${escapedName})\\b`;
            if (firstName.length > 2) {
                 regexStr = `\\b(${escapedName}|${firstName})\\b`;
            }
            const nameRegex = new RegExp(regexStr, 'i');
            if (nameRegex.test(prompt)) return true;
            
            // If there's exactly 1 active character in the scene, assume they are the subject even if not explicitly named
            const activeCharactersCount = projectData.characters.filter(c => !disabledCharacterIds?.includes(c.id)).length;
            if (activeCharactersCount === 1) {
                return true; 
            }

            return false;
        }
        
        // If it's an untied reference, it should only be included globally if it is explicitly marked 
        // as a global environmental or stylistic reference.
        if (ref.isMasterArt) return true;

        // If it has 'Face', 'Body', 'Outfit', or 'General', it risks bleeding a character portrait into EVERY scene.
        const allowedGlobalRoles = ['Style', 'Frame', 'Continuity'];
        const hasGlobalRole = ref.roles.some(r => allowedGlobalRoles.includes(r));
        if (hasGlobalRole) {
            return true;
        }

        // Otherwise exclude it to prevent cross-contamination.
        return false;
    });

    const hasCharRef = relevantReferences.some(r => r.roles.includes('Face') || r.roles.includes('Body') || r.characterId || projectData.characters.some(c => c.description.facialFeatures.includes(r.id.substring(0, 8))));

    let fullPrompt = `Generate a highly detailed image of the following scene. Do not output any conversational text, only the image.\n`;
    if (hasCharRef) {
        fullPrompt += `\n[SUBJECT REFERENCE RULE]: You are provided with a [Character Reference] image. You MUST capture and perfectly preserve the EXACT facial identity, likeness, and features of the person in the [Character Reference] in your final image.\n- CRITICAL: DO NOT change their face.\n- CRITICAL: DO NOT copy the artistic style, tone, lighting, or overall aesthetic from the [Character Reference]. The style must come from the Frame Reference or the text prompt.\n- ALLOW their hair style, pose, and clothing to change exactly as described in the text prompt below.\n- IGNORE ANY TEXT in the prompt below that describes the character's face, skin color, or eyes.\n- STRICTLY OBEY any framing rules (e.g., Extreme Close-Up), camera positioning, or specific body postures detailed in the text prompt below. Do not default to zoomed-out portraits if tight framing is described.\n`;
    }
    fullPrompt += `\n${prompt}`;

    const isRealistic = (projectData.artStyle || '').toLowerCase().match(/(realistic|photo|cinematic|film|iphone|camera|live action|realism)/) || prompt.toLowerCase().match(/(realistic|photo|cinematic|film|iphone|camera|live action|realism)/);
    if (isRealistic) {
        fullPrompt += `\n\n**REALISM & ANTI-SLOP OVERRIDE:**
- **Skin & Texture:** Avoid an overly plastic CGI look, but keep the skin naturally smooth, clean, and flattering.
- **Lighting & Framing:** Use cinematic, flattering natural lighting.
- **Expression:** Avoid stiff, posed, direct-to-camera stares. Use slightly averted gazes and natural, subtle expressions.
- **Overall:** Prioritize a highly natural but aesthetically pleasing photographic style.`;
    }

    if (aspectRatio === '2.35:1') {
        fullPrompt += `\n\n**ASPECT RATIO INSTRUCTION:** The requested aspect ratio is 2.35:1 (Cinematic Widescreen). Please compose the image so that it can be cropped to 2.35:1 without losing important subjects. Keep the main action vertically centered.`;
    } else if (aspectRatio === '14:9') {
        fullPrompt += `\n\n**ASPECT RATIO INSTRUCTION:** The requested aspect ratio is 14:9. Please compose the image so that it can be cropped to 14:9 without losing important subjects. Keep the main action horizontally centered.`;
    } else if (aspectRatio === '8:15') {
        fullPrompt += `\n\n**ASPECT RATIO INSTRUCTION:** The requested aspect ratio is 8:15. Please compose the image so that it can be cropped to 8:15 without losing important subjects. Keep the main action vertically centered.`;
    }

    // Temporary workaround for reflection issues
    fullPrompt += `\n\n**AVOID REFLECTIONS:** Do NOT render any reflections. Avoid mirrors, water reflections, glossy floors, or glass reflections. Keep surfaces matte.`;

    const activeCharactersCount = projectData.characters?.filter(c => !disabledCharacterIds?.includes(c.id)).length || 0;

    const mentionedCharacters = projectData.characters?.filter(char => {
        if (disabledCharacterIds?.includes(char.id)) return false;
        // Match full name or just the first name
        const escapedName = char.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const firstName = escapedName.split(' ')[0];
        const nameRegex = new RegExp(`\\b(${escapedName}|${firstName})\\b`, 'i');
        if (nameRegex.test(prompt)) return true;
        
        // If there is strictly 1 active character, we just assume they are involved
        if (activeCharactersCount === 1) return true;

        return false;
    }) || [];

    if (mentionedCharacters.length > 0) {
        if (mentionedCharacters.length > 1) {
            fullPrompt += `\n\n**CRITICAL MULTI-CHARACTER RULE:** You are generating a scene with MULTIPLE CHARACTERS.
- DO NOT blend their faces, hairstyles, or clothing!
- Clearly separate their physical appearances in the image based on the spatial descriptions in the prompt.
- Ensure that each named character strictly matches their assigned [Character Reference] or text description below. Pay strict attention to their distinct clothing and gender descriptions to prevent the AI from confusing them.`;
        }
        
        fullPrompt += `\n\n**Characters in Scene:**\n`;
        mentionedCharacters.forEach(char => {
            fullPrompt += `- **${char.name}**:\n`;
            
            // Determine if there is an active reference image for this character
            const isUsingCharRef = relevantReferences.some(ref => {
                if (ref.characterId === char.id) return true;
                const originalIndex = projectData.referenceImages.findIndex(r => r.id === ref.id);
                const refId = originalIndex !== -1 ? `REF_${originalIndex + 1}` : null;
                return refId && char.description.facialFeatures === refId;
            });

            if (isUsingCharRef) {
                fullPrompt += `  - [SUBJECT REFERENCE RULE]: You MUST preserve the exact face and identity from the provided [Character Reference] image for ${char.name}. Do not use any text descriptions of their face, eyes, or skin. You may adapt their hair style if described below.\n`;
                fullPrompt += `  - Hair Style: ${char.description.hairStyle}\n`;
                fullPrompt += `  - Clothing: ${char.description.clothingStyle}\n`;
                // Intentionally omit facialFeatures, bodyType, and keyExpressions as they confuse the image model when using a face ref.
            } else {
                if (!char.description.facialFeatures.includes('REF_')) {
                    fullPrompt += `  - Facial Features: ${char.description.facialFeatures}\n`;
                }
                fullPrompt += `  - Hair Style: ${char.description.hairStyle}\n`;
                fullPrompt += `  - Body Type: ${char.description.bodyType}\n`;
                fullPrompt += `  - Clothing: ${char.description.clothingStyle}\n`;
                fullPrompt += `  - Personality/Expressions: ${char.description.personality}, ${char.description.keyExpressions}\n`;
            }
        });
    }

    let finalReferencesToPass = relevantReferences;
    const hasFrameRef = relevantReferences.some(r => r.roles.includes('Frame') || r.roles.includes('Continuity'));

    const { parts: referenceParts, instructions: referenceInstructions } = buildReferenceParts(finalReferencesToPass, projectData);
    
    if (referenceInstructions.length > 0) {
        fullPrompt += `\n\n**CRITICAL REFERENCE INSTRUCTIONS:**\nYou are provided with reference images above. You MUST follow these rules for using them:\n`;
        referenceInstructions.forEach(inst => {
            fullPrompt += `- ${inst}\n`;
        });
    }
    
    // Interleave the reference parts with the main prompt
    const parts: any[] = [...referenceParts, { text: fullPrompt }];

    const isKieImageModel = currentImageModel.startsWith('kie:') || currentImageModel.includes('nano-banana');
    if (isKieImageModel) {
        const keyToUse = customKieApiKey || (typeof window !== 'undefined' ? (() => {
            try {
                const stored = localStorage.getItem('mv_api_keys');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    return parsed.kie;
                }
            } catch {}
            return undefined;
        })() : undefined);

        if (!keyToUse) {
            throw new Error("Kie AI API Key is required for Nano Banana image generation. Please add your Kie AI API key in Settings -> API Settings.");
        }

        return await generateKieImage({
            prompt: fullPrompt,
            model: currentImageModel,
            aspectRatio: aspectRatio as string,
            apiKey: keyToUse,
            addLog
        });
    }

    const doGenerate = async (currentParts: any[]) => {
        addLog(`Sending request to ${currentImageModel}...`, 'info');
        const response = await withRetry(() => callTextModel(genAI, {
            model: currentImageModel,
            contents: { parts: currentParts },
            config: {
                responseModalities: ["IMAGE"],
                ...(aspectRatio !== 'Original' ? {
                    imageConfig: {
                        aspectRatio: getAspectRatio(aspectRatio as any),
                    }
                } : {}),
                safetySettings,
            },
        }));

        const candidate = response.candidates?.[0];
        
        if (candidate?.finishReason === 'SAFETY' || candidate?.finishReason === 'IMAGE_SAFETY') {
            throw new Error("Image generation was blocked by safety filters.");
        }
        if (candidate?.finishReason === 'RECITATION') {
            throw new Error("Image generation was blocked by recitation filters.");
        }
        if (candidate?.finishReason === 'OTHER') {
            throw new Error("Image generation was blocked for an unknown reason.");
        }
        if (candidate?.finishReason === 'IMAGE_OTHER') {
            throw new Error("IMAGE_OTHER");
        }

        const partsList = candidate?.content?.parts || [];
        for (const part of partsList) {
            if (part.inlineData) {
                const base64String = part.inlineData.data;
                return `data:image/png;base64,${base64String}`;
            }
        }

        console.error("Image generation response missing inlineData:", JSON.stringify(response, null, 2));
        throw new Error(`Image generation failed: No image data received. Response: ${JSON.stringify(response)}`);
    };

    try {
        addLog("Generating image... This may take some time.", 'info');
        return await doGenerate(parts);
    } catch (error: any) {
        const isQuotaOrAuth = error.message.includes('Quota') || error.message.includes('403') || error.message.includes('Permission Denied') || error.message.includes('429') || error.message.includes('limit');
        if (isQuotaOrAuth) {
            return await fallbackToPollinations(prompt, aspectRatio, addLog);
        }

        const isBlocked = error.message === "IMAGE_OTHER" || error.message.includes("safety") || error.message.includes("blocked") || error.message.includes("recitation");
        
        if (isBlocked) {
            addLog(`Image generation blocked (${error.message}). Retrying with a simplified prompt...`, 'warning');
            try {
                // Fallback 1: Base prompt + references (no complex instructions)
                const fallbackParts1 = [...referenceParts, { text: prompt }];
                return await doGenerate(fallbackParts1);
            } catch (fallbackError1: any) {
                const isBlocked1 = fallbackError1.message === "IMAGE_OTHER" || fallbackError1.message.includes("safety") || fallbackError1.message.includes("blocked") || fallbackError1.message.includes("recitation");
                
                if (isBlocked1 && referenceParts.length > 0) {
                    addLog("Still blocked. Retrying without reference images...", 'warning');
                    try {
                        // Fallback 2: Base prompt only (no references)
                        const fallbackParts2 = [{ text: prompt }];
                        return await doGenerate(fallbackParts2);
                    } catch (fallbackError2: any) {
                        const isBlocked2 = fallbackError2.message === "IMAGE_OTHER" || fallbackError2.message.includes("safety") || fallbackError2.message.includes("blocked") || fallbackError2.message.includes("recitation");
                        
                        if (isBlocked2) {
                            throw new Error("Image generation was completely blocked by safety policies. Please try rephrasing your prompt or using different reference images.");
                        }
                        throw fallbackError2;
                    }
                } else if (isBlocked1) {
                    throw new Error("Image generation was completely blocked by safety policies. Please try rephrasing your prompt.");
                }
                throw fallbackError1;
            }
        }
        throw error;
    }
};


export const generateSingleImage = async (
    prompt: string,
    aspectRatio: AspectRatio,
    referenceImage: ReferenceImage | null,
    frameReferenceBase64: string | null,
    projectData: ProjectData,
    apiKey: string | undefined,
    addLog: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void
): Promise<string> => {
    let activePrompt = prompt.trim();
    if (currentImageModel === 'pollinations') {
        if (referenceImage || frameReferenceBase64) {
            addLog("Pollinations API does not support reference images. Generating using text prompt only.", 'warning');
        }
        return await fallbackToPollinations(activePrompt || "A highly detailed cinematic scene", aspectRatio, addLog);
    }

    addLog("Connecting to image generation service...", 'info');
    const genAI = getGenAI(apiKey);

    // If the prompt is a JSON string (e.g. from analyzeImageToJson), format it into a cohesive paragraph
    try {
        if (activePrompt.startsWith('{') && activePrompt.endsWith('}')) {
            const parsed = JSON.parse(extractJSON(activePrompt));
            let formattedPrompt = "";
            if (parsed.subject) formattedPrompt += `Subject: ${parsed.subject}\n`;
            if (parsed.environment) formattedPrompt += `Environment: ${parsed.environment}\n`;
            if (parsed.lighting) formattedPrompt += `Lighting: ${parsed.lighting}\n`;
            if (parsed.composition) formattedPrompt += `Composition: ${parsed.composition}\n`;
            if (parsed.style) formattedPrompt += `Style: ${parsed.style}\n`;
            if (parsed.mood) formattedPrompt += `Mood: ${parsed.mood}\n`;
            if (parsed.colors) formattedPrompt += `Colors: ${parsed.colors}\n`;
            if (parsed.masterArtStyle) formattedPrompt += `Master Art Style: ${parsed.masterArtStyle}\n`;
            
            if (formattedPrompt.trim()) {
                activePrompt = formattedPrompt.trim();
            } else {
                // Not standard layout, flatten arbitrary JSON
                const flattenJson = (obj: any, indent = 0): string => {
                    let text = "";
                    for (const key in obj) {
                        if (typeof obj[key] === 'object' && obj[key] !== null) {
                            text += `${"  ".repeat(indent)}${key}:\n${flattenJson(obj[key], indent + 1)}`;
                        } else {
                            text += `${"  ".repeat(indent)}${key}: ${obj[key]}\n`;
                        }
                    }
                    return text;
                };
                activePrompt = flattenJson(parsed).trim();
            }
            
            // If the subject contains excessive facial details, we try to rely on the Character Reference image instead.
            addLog("Parsed JSON prompt into formatted text for better generation.", 'info');
        }
    } catch (e) {
        // Not JSON or invalid JSON, ignore and use as-is
    }
    
    if (!activePrompt && frameReferenceBase64) {
        // Auto-describe the frame if no prompt was provided.
        // This provides the image generation model with a concrete textual description of the scene.
        addLog("No prompt provided. Analyzing frame reference to generate a scene description...", 'info');
        try {
            const visionResponse = await callTextModel(genAI, {
                model: currentTextModel,
                contents: [
                    {
                        inlineData: {
                            data: frameReferenceBase64.split(',')[1],
                            mimeType: getMimeType(frameReferenceBase64),
                        }
                    },
                    "Conduct a rigorous, pixel-perfect visual analysis of this image to serve as a strict structural blueprint. Describe: 1. Subject Pose & Geometry: EXACT position of the head, hands, arms, and fingers (e.g. 'right hand covering the right eye', 'fingers spread', etc.). Focus heavily on replicating the exact body posture and hand placement. 2. Clothing & Accessories: Specific garments, fabrics, colors, rings, bracelets, nail polish. 3. Lighting & Composition: Camera framing (e.g. close-up), light direction, shadows. 4. Background details. DO NOT describe the person's face or identity. Keep it highly descriptive."
                ],
                config: {
                    safetySettings,
                }
            });
            activePrompt = visionResponse.text?.trim() || "";
            addLog(`Auto-generated scene description: ${activePrompt}`, 'success');
        } catch (e) {
            console.error("Failed to auto-describe frame:", e);
            addLog("Failed to auto-describe frame reference. Proceeding with empty prompt.", 'warning');
        }
    }

    let finalPrompt = "Generate an image. Do not output any conversational text, only the image.\n\n";

    if (frameReferenceBase64 && referenceImage) {
        finalPrompt += `CRITICAL INSTRUCTION: ORGANIC CHARACTER SYNTHESIS
Your task is to generate a new scene based EXACTLY on the text description provided below (composition, pose, clothing, lighting), but featuring the distinct person from the provided Reference Image (Image 1).
- CRITICAL: Blend the subject naturally into the scene. Make it look like an authentic, cohesive photograph.
- DO NOT copy the original pose, clothing, or background from Image 1.
- Image 1 defines the SUBJECT'S IDENTITY (facial features like eyes, nose, mouth). The text prompt below defines the POSE, CLOTHING, HAIR STYLE, and SCENE.
- IGNORE any conflicting names, genders, or facial descriptions in the text prompt below. ALWAYS prioritize Image 1 for the face/identity, but ALLOW their hair style and makeup to match the text prompt!\n\n`;
    } else if (frameReferenceBase64) {
        finalPrompt += `Task: You are provided with a frame reference image below. Recreate this scene exactly.\n\n`;
    } else if (referenceImage) {
        finalPrompt += `Task: You are provided with a character reference image below. Generate an organic, cohesive image featuring this character. CRITICAL: You MUST replace whatever subject is described in the text prompt with the character from Image 1, NO MATTER WHAT IS WRITTEN. Ignore conflicting names, genders, ages, or physical descriptions in the text.\n\n`;
    }

    if (referenceImage) {
        finalPrompt += `**Image 1 Details:**\n`;
        if (referenceImage.description) {
            finalPrompt += `- Context: ${referenceImage.description}\n`;
        }
        if (referenceImage.focusTags && referenceImage.focusTags.length > 0) {
            finalPrompt += `- CRITICAL FOCUS: You MUST strictly copy these specific elements from the character reference: ${referenceImage.focusTags.join(', ')}.\n`;
        }
        
        // Include character DNA if linked
        if (referenceImage.characterId && projectData?.characters) {
            const character = projectData.characters.find(c => c.id === referenceImage.characterId);
            if (character) {
                finalPrompt += `- Character Name: ${character.name}\n`;
                if (character.description.bodyType) finalPrompt += `- Body Type: ${character.description.bodyType}\n`;
                if (character.description.height) finalPrompt += `- Height: ${character.description.height}\n`;
                if (character.description.weight) finalPrompt += `- Weight: ${character.description.weight}\n`;
                // We omit clothing style here if we have a frame reference, to force it to use the frame's clothing
                if (!frameReferenceBase64 && character.description.clothingStyle) {
                    finalPrompt += `- Clothing Style: ${character.description.clothingStyle}\n`;
                }
            }
        }
        finalPrompt += `\n`;
    }

    if (activePrompt) {
        if (referenceImage) {
            finalPrompt += `Image Description to Generate:\n${activePrompt}\n\n`;
            finalPrompt += `CRITICAL OVERRIDE: You MUST replace the subject described in the text above with the person from Image 1. If the text above describes a different person, age, gender, or name, COMPLETELY IGNORE IT and use Image 1. Always prioritize Image 1 for the subject's face and identity. HOWEVER, you MUST strictly follow the camera framing, distance (e.g. Extreme Close-Up), body posture, and specific hand placement (e.g. hands touching the face) described in the text above. Do not default to a standard zoomed-out portrait if a tight framing or unique pose is requested. You MUST also follow the HAIR STYLE and MAKEUP described in the text, adapting the character's overall styling to perfectly match the current scene.\n\n`;
        } else {
            finalPrompt += `Image Description to Generate: ${activePrompt}\n\n`;
        }
    }

    const isRealistic = (projectData.artStyle || '').toLowerCase().match(/(realistic|photo|cinematic|film|iphone|camera|live action|realism)/) || activePrompt.toLowerCase().match(/(realistic|photo|cinematic|film|iphone|camera|live action|realism)/);
    if (isRealistic) {
        finalPrompt += `**REALISM & ANTI-SLOP OVERRIDE:**
- **Skin & Texture:** Avoid an overly plastic CGI look, but keep the skin naturally smooth, clean, and flattering.
- **Lighting & Framing:** Use cinematic, flattering natural lighting.
- **Expression:** Avoid stiff, posed, direct-to-camera stares. Use slightly averted gazes and natural, subtle expressions.
- **Overall:** Prioritize a highly natural but aesthetically pleasing photographic style.\n\n`;
    }

    if (aspectRatio === '2.35:1') {
        finalPrompt += `**ASPECT RATIO INSTRUCTION:** The requested aspect ratio is 2.35:1 (Cinematic Widescreen). Please compose the image so that it can be cropped to 2.35:1 without losing important subjects. Keep the main action vertically centered.\n\n`;
    } else if (aspectRatio === '14:9') {
        finalPrompt += `**ASPECT RATIO INSTRUCTION:** The requested aspect ratio is 14:9. Please compose the image so that it can be cropped to 14:9 without losing important subjects. Keep the main action horizontally centered.\n\n`;
    } else if (aspectRatio === '8:15') {
        finalPrompt += `**ASPECT RATIO INSTRUCTION:** The requested aspect ratio is 8:15. Please compose the image so that it can be cropped to 8:15 without losing important subjects. Keep the main action vertically centered.\n\n`;
    }
    
    const parts: any[] = [];
    
    if (referenceImage) {
        parts.push({ text: `[Image 1 - EXACT face/identity]:` });
        parts.push({
            inlineData: {
                data: referenceImage.data.split(',')[1],
                mimeType: getMimeType(referenceImage.data),
            }
        });
    }

    if (frameReferenceBase64 && !referenceImage) {
        parts.push({ text: `[Image 1 - EXACT pose/clothing/background]:` });
        parts.push({
            inlineData: {
                data: frameReferenceBase64.split(',')[1],
                mimeType: getMimeType(frameReferenceBase64),
            }
        });
    }
    
    // Add master art references
    if (projectData?.referenceImages) {
        const masterArts = projectData.referenceImages.filter(r => r.isMasterArt && r.enabled !== false);
        masterArts.forEach((masterRef, idx) => {
            const imgId = parts.length + 1;
            parts.push({ text: `[Image ${imgId} - EXACT Master Art Style Reference]: You MUST strictly copy the visual aesthetic, rendering technique, color palette, line work, tone, and texture of this image over the entire generated scene. Ignore any conflicting style words in the text prompt.` });
            parts.push({
                inlineData: {
                    data: masterRef.data.split(',')[1],
                    mimeType: getMimeType(masterRef.data),
                }
            });
        });
    }

    parts.unshift({ text: finalPrompt });

    const isKieImageModel = currentImageModel.startsWith('kie:') || currentImageModel.includes('nano-banana');
    if (isKieImageModel) {
        const keyToUse = customKieApiKey || (typeof window !== 'undefined' ? (() => {
            try {
                const stored = localStorage.getItem('mv_api_keys');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    return parsed.kie;
                }
            } catch {}
            return undefined;
        })() : undefined);

        if (!keyToUse) {
            throw new Error("Kie AI API Key is required for Nano Banana image generation. Please add your Kie AI API key in Settings -> API Settings.");
        }

        return await generateKieImage({
            prompt: finalPrompt,
            model: currentImageModel,
            aspectRatio: aspectRatio as string,
            apiKey: keyToUse,
            addLog
        });
    }

    const doGenerate = async (currentParts: any[]) => {
        addLog(`Sending request to ${currentImageModel}...`, 'info');
        const response = await withRetry(() => callTextModel(genAI, {
            model: currentImageModel,
            contents: { parts: currentParts },
            config: {
                responseModalities: ["IMAGE"],
                ...(aspectRatio !== 'Original' ? {
                    imageConfig: {
                        aspectRatio: getAspectRatio(aspectRatio as any),
                    }
                } : {}),
                safetySettings,
            },
        }));

        const candidate = response.candidates?.[0];
        
        if (candidate?.finishReason === 'SAFETY' || candidate?.finishReason === 'IMAGE_SAFETY') {
            throw new Error("Image generation was blocked by safety filters.");
        }
        if (candidate?.finishReason === 'RECITATION') {
            throw new Error("Image generation was blocked by recitation filters.");
        }
        if (candidate?.finishReason === 'OTHER') {
            throw new Error("Image generation was blocked for an unknown reason.");
        }
        if (candidate?.finishReason === 'IMAGE_OTHER') {
            throw new Error("IMAGE_OTHER");
        }

        const partsList = candidate?.content?.parts || [];
        for (const part of partsList) {
            if (part.inlineData) {
                const base64String = part.inlineData.data;
                return `data:image/png;base64,${base64String}`;
            }
        }

        console.error("Image generation response missing inlineData:", JSON.stringify(response, null, 2));
        throw new Error(`Image generation failed: No image data received. Response: ${JSON.stringify(response)}`);
    };

    try {
        addLog("Generating image... This may take some time.", 'info');
        return await doGenerate(parts);
    } catch (error: any) {
        const isQuotaOrAuth = error.message.includes('Quota') || error.message.includes('403') || error.message.includes('Permission Denied') || error.message.includes('429') || error.message.includes('limit');
        if (isQuotaOrAuth) {
            return await fallbackToPollinations(prompt, aspectRatio, addLog);
        }

        const isBlocked = error.message === "IMAGE_OTHER" || error.message.includes("safety") || error.message.includes("blocked") || error.message.includes("recitation");
        
        if (isBlocked) {
            addLog(`Image generation blocked (${error.message}). Retrying with a simplified prompt...`, 'warning');
            try {
                const fallbackParts = [{ text: prompt }];
                return await doGenerate(fallbackParts);
            } catch (fallbackError: any) {
                const isBlockedFall = fallbackError.message === "IMAGE_OTHER" || fallbackError.message.includes("safety") || fallbackError.message.includes("blocked") || fallbackError.message.includes("recitation");
                if (isBlockedFall) {
                    throw new Error("Image generation was completely blocked by safety policies. The prompt likely violates image-specific policies. Please try rephrasing your prompt.");
                }
                throw fallbackError;
            }
        }
        throw error;
    }
};

export const generateChatImage = async (
    prompt: string,
    aspectRatio: string,
    apiKey: string | undefined,
    addLog: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void,
    projectData?: ProjectData
): Promise<string> => {
    if (currentImageModel === 'pollinations') {
        return await fallbackToPollinations(prompt, aspectRatio, addLog);
    }
    
    addLog("Connecting to image generation service...", 'info');
    const genAI = getGenAI(apiKey);
    
    const enhancedPrompt = `Generate an image of the following scene. Do not output any conversational text, only the image.\n\n${prompt}`;

    const parts: any[] = [];
    if (projectData?.referenceImages) {
        const masterArts = projectData.referenceImages.filter(r => r.isMasterArt && r.enabled !== false);
        masterArts.forEach((masterRef) => {
            const imgId = parts.length + 1;
            parts.push({ text: `[Image ${imgId} - EXACT Master Art Style Reference]: You MUST strictly copy the visual aesthetic, rendering technique, color palette, line work, tone, and texture of this image over the entire generated scene. Ignore any conflicting style words in the text prompt.` });
            parts.push({
                inlineData: {
                    data: masterRef.data.split(',')[1],
                    mimeType: getMimeType(masterRef.data),
                }
            });
        });
    }
    parts.push({ text: enhancedPrompt });

    const isKieImageModel = currentImageModel.startsWith('kie:') || currentImageModel.includes('nano-banana');
    if (isKieImageModel) {
        const keyToUse = customKieApiKey || (typeof window !== 'undefined' ? (() => {
            try {
                const stored = localStorage.getItem('mv_api_keys');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    return parsed.kie;
                }
            } catch {}
            return undefined;
        })() : undefined);

        if (!keyToUse) {
            throw new Error("Kie AI API Key is required for Nano Banana image generation. Please add your Kie AI API key in Settings -> API Settings.");
        }

        return await generateKieImage({
            prompt,
            model: currentImageModel,
            aspectRatio,
            apiKey: keyToUse,
            addLog
        });
    }

    const doGenerate = async (currentParts: any[]) => {
        console.log("generateChatImage: Calling generateContent...");
        const response = await withRetry(() => callTextModel(genAI, {
            model: currentImageModel,
            contents: { parts: currentParts },
            config: {
                responseModalities: ["IMAGE"],
                ...(aspectRatio !== 'Original' ? {
                    imageConfig: {
                        aspectRatio: getAspectRatio(aspectRatio as any),
                    }
                } : {}),
                safetySettings,
            },
        }));
        console.log("generateChatImage: generateContent returned.");

        const candidate = response.candidates?.[0];
        
        if (candidate?.finishReason === 'SAFETY' || candidate?.finishReason === 'IMAGE_SAFETY') {
            throw new Error("Image generation was blocked by safety filters.");
        }
        if (candidate?.finishReason === 'RECITATION') {
            throw new Error("Image generation was blocked by recitation filters.");
        }
        if (candidate?.finishReason === 'OTHER') {
            throw new Error("Image generation was blocked for an unknown reason.");
        }
        if (candidate?.finishReason === 'IMAGE_OTHER') {
            throw new Error("IMAGE_OTHER");
        }

        const partsList = candidate?.content?.parts || [];
        for (const part of partsList) {
            if (part.inlineData) {
                const base64String = part.inlineData.data;
                return `data:image/png;base64,${base64String}`;
            }
        }

        console.error("Image generation response missing inlineData:", JSON.stringify(response, null, 2));
        throw new Error(`Image generation failed: No image data received. Response: ${JSON.stringify(response)}`);
    };

    try {
        addLog("Generating image... This may take some time.", 'info');
        return await doGenerate(parts);
    } catch (error: any) {
        const isQuotaOrAuth = error.message.includes('Quota') || error.message.includes('403') || error.message.includes('Permission Denied') || error.message.includes('429') || error.message.includes('limit');
        if (isQuotaOrAuth) {
            return await fallbackToPollinations(prompt, aspectRatio, addLog);
        }

        const isBlocked = error.message === "IMAGE_OTHER" || error.message.includes("safety") || error.message.includes("blocked") || error.message.includes("recitation");
        if (isBlocked) {
            addLog(`Image generation blocked (${error.message}). Retrying with a simplified prompt...`, 'warning');
            try {
                // Fallback: Just the base prompt without enhanced cinematic instructions
                const fallbackParts = [{ text: prompt }];
                return await doGenerate(fallbackParts);
            } catch (fallbackError: any) {
                const isBlockedFall = fallbackError.message === "IMAGE_OTHER" || fallbackError.message.includes("safety") || fallbackError.message.includes("blocked") || fallbackError.message.includes("recitation");
                if (isBlockedFall) {
                    throw new Error("Image generation was completely blocked by safety policies. The prompt likely violates image-specific policies. Please try rephrasing your prompt.");
                }
                throw fallbackError;
            }
        }
        throw error;
    }
};


const enhancementSchema = {
    type: Type.OBJECT,
    properties: {
        enhancedPrompt: { type: Type.STRING, description: "A detailed, single-paragraph prompt combining all elements and the master art style." }
    },
    required: ["enhancedPrompt"]
};

export const enhanceMotionPrompt = async (prompt: string, imagePrompt: string, apiKey?: string): Promise<string> => {
    const genAI = getGenAI(apiKey);

    const systemInstruction = `**You are Video Prompt Master — the world’s best expert on prompting scenes.**

Your job is to help the user write perfect prompts using a formula and all proven best practices.

**Core Formula you MUST always use:**
[Cinematography (shot type + camera movement + angle)] + [Action (one clear, specific action with strong verbs)] + [Context (environment, time, atmosphere)] + [Style & Ambiance (lighting, mood, aesthetic, film reference)].

**CRITICAL: Subject Identity & Image-to-Video Context**
The user is generating a video using an Image-to-Video AI (e.g., YouTube AI / Veo) from a base image.
- DO NOT use the character's name in the prompt. Use generic terms like "the person", "the subject", "the man", "the woman", etc.
- DO NOT describe the character's physical traits (e.g., hair color, eye shape, facial features, body type). The Image-to-Video AI will pull all identity and physical appearance strictly from the input reference image. Describing them in the text prompt will cause the AI to mutate or hallucinate a different character.
- ONLY describe their Action, Emotion, and Pose.

**Always include where relevant:**
- Sound design (SFX: ..., Ambient: ..., Music mood: ...)
- Negative elements (describe what to avoid, e.g. "no blur, no extra people, sharp focus")
- Cinematic language (dolly in, slow push, crane shot, shallow depth of field, lens flare, bokeh, etc.)

**Rules you follow every time:**
- Front-load the most important info.
- One main action per prompt (keep clips focused).
- Be extremely specific and visual — never vague.
- Aim for 100–150 words / 3–6 sentences.
- Use present tense and active language.
- Reference real film styles, directors, cameras, or lighting when it helps.
- Emphasize audio sync and image-to-video when relevant.

**CRITICAL: Base Image Consistency**
The base image was generated using this exact prompt:
"${imagePrompt}"

You MUST ensure that the Action, Context, and Style & Ambiance in your enhanced motion prompt perfectly match the vibe of the base image prompt. Do not invent new settings or new styles that contradict the base image prompt. Focus your enhancement primarily on the Cinematography and Action parts of the formula.

**Output Instructions:**
You MUST output ONLY the final enhanced, unified paragraph. DO NOT include any conversational text, pleasantries, or explanations of your process. DO NOT output the 5-part list structure. DO NOT say "Here is the prompt" or "I have applied the formula". Output ONLY the final, raw text of the enhanced prompt, ready to copy-paste.`;

    const response = await withRetry(() => callTextModel(genAI, {
        model: currentTextModel,
        contents: { parts: [{ text: prompt }] },
        config: {
            temperature: 0.7,
            maxOutputTokens: 2048,
            systemInstruction: systemInstruction,
        }
    }));

    return response.text?.trim() || prompt;
};

export const enhanceAndSanitizePrompt = async (prompt: string, projectData: ProjectData, apiKey?: string): Promise<string> => {
    const genAI = getGenAI(apiKey);

    let systemInstruction = `You are a prompt enhancement expert for generative AI. Your task is to take a user's prompt, enrich it with vivid details, and ensure it adheres to safety guidelines.
    
**Instructions:**
1.  **Enrich:** Add descriptive details about lighting, composition, color, and mood.
    - **Cinematic Composition:** Explicitly define shot type (e.g., Extreme Close-up, Dutch Angle) and framing.
    - **Lighting & Atmosphere:** Specify lighting conditions (e.g., volumetric rays, neon glow, chiaroscuro shadows, rim lighting).
    - **Artistic Texture (NANO BANANA PRINCIPLE):** Describe physical realities, specific geometry, colors, and lighting effects rather than vague adjectives or empty praise. Do NOT use buzzwords like "hyperrealistic," "masterpiece," "8k," "razor-sharp focus," "clean color grading," or list camera hardware. Instead, describe the *effect* of those things (e.g., "extremely shallow depth of field rendering the eyes in precise clarity", "visible subtle skin pores and fine textures", "polished studio aesthetic", "clean balanced color palette").
2.  **Incorporate Style:** Seamlessly integrate the master art style: "${projectData.artStyle}".
3.  **Sanitize:** Rephrase any potentially sensitive content to be safe for generation, while preserving the original artistic intent.
4.  **Wardrobe Rule:** If a character is wearing a suit, jacket, blazer, or open coat, you MUST explicitly ensure they are wearing an appropriate inner garment (e.g., dress shirt, t-shirt, blouse, turtleneck, tie) underneath unless the prompt specifically asks for them to be bare-chested. AVOID phrases like "deep V-neckline" when describing suits, as this causes the image generator to omit the inner shirt. Always explicitly describe the shirt underneath the suit.
5.  **Static Image Focus (CRITICAL):** The prompt is for generating a single, STATIC image. Focus purely on describing a single frozen moment in time. NEVER describe movement occurring over time (e.g., DO NOT use phrases like "slowly turns her head", "shifting to", "the camera pans", "starts to walk"). Instead, translate any motion into a static description of the frozen state or pose (e.g., "looking over her shoulder", "hand frozen mid-reach", "with a subtle nervous expression", "caught mid-stride").
6.  **Reflection Avoidance (CRITICAL):** Do NOT include phrasing that generates reflections (e.g., mirrors, glossy floors, puddles, water reflections). The image generator is currently struggling with them, so ensure the prompt strictly describes matte environments.
7.  **Multi-Character Separation (CRITICAL):** If multiple characters are present in the same scene, you MUST structurally separate them in your spatial description (e.g., 'On the left is X, on the far right is Y'). To prevent the image generator from blending them or swapping faces, you MUST explicitly restate their gender, distinct clothing colors, and hair styles directly in the prompt. Avoid grouping them together physically unless absolutely necessary, and always describe their unique visual traits.
8.  **SUBJECT FACING & HEAD ANGLE:** AI image generators frequently default to a "3/4 left profile" (looking left 45 degrees). You MUST actively override this by explicitly stating the character's facing direction and head angle. Use a mix of: "facing the camera directly," "profile view facing right," "looking off-screen to the right," "back to the camera looking over shoulder," "looking straight up," etc. Do NOT allow characters to repetitively face left 45 degrees.
9.  **Format:** Output the final, enhanced prompt by filling out the required JSON fields.`;

    if (projectData.characters && projectData.characters.length > 0) {
        systemInstruction += `\n\n**Character Consistency:** ONLY incorporate characters into the enhanced prompt if they were already mentioned or logically required by the original prompt. DO NOT arbitrarily insert other characters. For characters that *are* included: if a character's profile is missing details like hairstyle, outfit, makeup, or styling, you MUST invent highly detailed, fashionable, and cohesive options for them and include them directly in the 'enhancedPrompt'. CRITICAL: If a character's description includes a reference tag (e.g., "REF_1", "Based on REF_2"), DO NOT describe their facial features or identity in the prompt, and DO NOT write the REF tag in the prompt either. The image generation engine already knows which reference image belongs to which character. Describing their face or adding tags in text will cause the AI to generate a new, random character. Only describe their styling (hair, makeup, clothing), action, emotion, and the environment.\n\nMention characters strictly by their EXACT FULL NAME. CRITICAL: DO NOT use generic pronouns like "he", "she", "man", or "woman", as this confuses identity mapping. Always use their exact name.\n\n**Cast:**\n`;
        projectData.characters.forEach(char => {
            systemInstruction += `- **${char.name}:** ${JSON.stringify(char.description)}\n`;
        });
    }

    const parts: any[] = [{ text: prompt }];

    if (projectData.referenceImages && projectData.referenceImages.length > 0) {
        parts.push({ text: "\n\nHere are the reference images provided for this project. If the user refers to REF_1, REF_2, etc., they correspond to these images in order:" });
        projectData.referenceImages.forEach((ref, index) => {
            parts.push({ text: `\n[REF_${index + 1}]: ${ref.description || 'No description'}` });
            parts.push({
                inlineData: {
                    data: ref.data.split(',')[1],
                    mimeType: ref.data.startsWith('data:image/png') ? 'image/png' : 'image/jpeg',
                }
            });
        });
    }

    const response = await withRetry(() => callTextModel(genAI, {
        model: currentTextModel,
        contents: { parts },
        config: {
            temperature: 0.8,
            maxOutputTokens: 2048,
            responseSchema: enhancementSchema,
            responseMimeType: "application/json",
            systemInstruction,
            safetySettings,
        },
    }));

    try {
        const parsed = JSON.parse(extractJSON(response.text?.trim() || "{}"));
        
        // Construct a natural language prompt from the parsed JSON
        let combined = "";
        if (parsed.enhancedPrompt) combined += `${parsed.enhancedPrompt}\n\n`;
        
        return combined.trim() || prompt;
    } catch (e) {
        console.warn("Prompt enhancement blocked by safety settings or parsing failed.", e);
        return prompt;
    }
};

const dnaSchema = {
    type: Type.OBJECT,
    properties: {
        facialFeatures: { type: Type.STRING, description: "Detailed description of the character's facial features (e.g., 'sharp jawline, piercing blue eyes, a small scar on the left eyebrow')." },
        hairStyle: { type: Type.STRING, description: "Description of the hair style and color (e.g., 'short, messy blonde hair with dark roots')." },
        bodyType: { type: Type.STRING, description: "Description of the body type and build (e.g., 'athletic and lean build')." },
        height: { type: Type.STRING, description: "Estimated height or height category (e.g., 'tall', '6 feet', 'average height')." },
        weight: { type: Type.STRING, description: "Estimated weight or build category (e.g., 'slim', 'muscular', 'heavy set')." },
        clothingStyle: { type: Type.STRING, description: "Description of the character's typical clothing style or outfit in the image (e.g., 'casual streetwear', 'formal suit')." },
        personality: { type: Type.STRING, description: "A brief summary of the character's personality (e.g., 'brooding and introspective')." },
        keyExpressions: { type: Type.STRING, description: "Key facial expressions the character often shows (e.g., 'a subtle, knowing smirk; intense concentration')." },
    },
    required: ["facialFeatures", "hairStyle", "bodyType", "height", "weight", "clothingStyle", "personality", "keyExpressions"]
};

export interface StudioGroundingSource {
    title: string;
    url: string;
}

export interface StudioGroundingMetadata {
    webSearchQueries?: string[];
    sources?: StudioGroundingSource[];
}

export interface StudioGitRepoContext {
    isEnabled: boolean;
    owner: string;
    repo: string;
    branch: string;
    latestCommit?: {
        sha?: string;
        message?: string;
        authorName?: string;
        authorDate?: string;
        files?: Array<{ filename: string; status: string; additions: number; deletions: number; patch?: string }>;
    };
    indexedFilesCount?: number;
    fileTreeSample?: string[];
    retrievedSourceSnippets?: Array<{ path: string; content: string; language: string }>;
}

/**
 * Detects if an error from Gemini API or text models is a Token Limit Exceeded error (e.g. 1048576 token limit)
 */
export const isTokenLimitError = (err: any): boolean => {
    if (!err) return false;
    const str = (err?.message || '') + ' ' + (typeof err === 'object' ? JSON.stringify(err) : '') + ' ' + (err?.status || '');
    return str.includes('exceeds the maximum number of tokens allowed') ||
           str.includes('input token count exceeds') ||
           str.includes('1048576') ||
           (str.includes('INVALID_ARGUMENT') && (str.includes('token') || str.includes('beyond::dependency::INVALID_ARGUMENT')));
};

/**
 * Estimates character and token weight of a contents array and system instruction
 */
export const estimateContentTokens = (contents: any[], systemInstruction?: string): number => {
    let charCount = (systemInstruction || '').length;
    let imageCount = 0;
    
    for (const item of contents) {
        if (typeof item === 'string') {
            charCount += item.length;
            continue;
        }
        if (Array.isArray(item.parts)) {
            for (const part of item.parts) {
                if (part.text) {
                    charCount += part.text.length;
                }
                if (part.inlineData?.data) {
                    imageCount++;
                }
            }
        } else if (item.text) {
            charCount += item.text.length;
        }
    }

    // 1 token ~= 3.6 chars in multilingual/code context, + 500 tokens per image
    return Math.ceil(charCount / 3.6) + (imageCount * 500);
};

/**
 * Prunes and sanitizes conversation contents to stay safely within context limits (e.g. max ~650,000 tokens)
 * 1. Strips stale inlineData base64 images from historical turns (keeping only the latest attached image).
 * 2. Condenses oversized code/text snippets from older historical turns (> 2 turns ago).
 * 3. Applies a sliding window if total content still exceeds budget.
 */
export const pruneAndSanitizeStudioContents = (
    rawContents: { role: string; parts: any[] }[],
    maxTokens: number = 650000
): { role: string; parts: any[] }[] => {
    if (!rawContents || rawContents.length === 0) return rawContents;

    // Clone deep enough to mutate parts
    const cloned = rawContents.map((msg, idx) => {
        const isLatestTurn = idx >= rawContents.length - 2;
        const newParts = msg.parts.map(part => {
            // Strip base64 image data from older turns to prevent massive token/payload explosion
            if (part.inlineData) {
                if (isLatestTurn) {
                    return { ...part };
                } else {
                    return { text: "[Previously attached image: analyzed in earlier turn]" };
                }
            }
            // Condense huge text attachments (> 2,500 chars) in older turns
            if (!isLatestTurn && part.text && part.text.length > 2500) {
                const header = part.text.substring(0, 800);
                const footer = part.text.substring(part.text.length - 300);
                const omittedChars = part.text.length - 1100;
                return {
                    text: `${header}\n\n[... ${omittedChars} characters condensed from earlier turn to optimize context window ...]\n\n${footer}`
                };
            }
            return { ...part };
        });
        return {
            role: msg.role,
            parts: newParts
        };
    });

    // Merge consecutive same-role messages
    const merged: { role: string; parts: any[] }[] = [];
    for (const msg of cloned) {
        if (merged.length > 0 && merged[merged.length - 1].role === msg.role) {
            merged[merged.length - 1].parts.push(...msg.parts);
        } else {
            merged.push({ role: msg.role, parts: [...msg.parts] });
        }
    }

    // Check estimated token count
    let estTokens = estimateContentTokens(merged);
    if (estTokens <= maxTokens || merged.length <= 2) {
        return merged;
    }

    // Sliding window: prune oldest messages from the beginning while preserving alternating user/model flow
    const result = [...merged];
    while (result.length > 2 && estimateContentTokens(result) > maxTokens) {
        result.shift();
    }

    // Ensure first message is user role
    if (result.length > 0 && result[0].role === 'model') {
        result.shift();
    }

    return result.length > 0 ? result : merged.slice(-2);
};

export const sendStudioChatMessage = async (
    history: { role: 'user' | 'model', parts: any[] }[],
    newMessage: string,
    attachedImageBase64?: string | string[],
    apiKey?: string,
    projectData?: ProjectData,
    directorPlan?: DirectorPlan,
    enableWebSearch: boolean = false,
    gitRepoContext?: StudioGitRepoContext,
    isAppEditEnabled: boolean = true
): Promise<{ text: string; functionCalls?: any[]; groundingMetadata?: StudioGroundingMetadata }> => {
    const genAI = getGenAI(apiKey);

    let systemInstruction = `You are an expert AI Assistant, Creative Reasoning Partner, and Code Architect in MV Director Studio. You help users with their prompts, creative brainstorming, text refinement, storyboards, real-time factual knowledge, code analysis, Git repository workflows, visual concepts, and app project text authoring.

**CRITICAL INSTRUCTIONS & TOOL USAGE BOUNDARIES:**
1. **Direct Intent Focus:** Always focus precisely on what the user is asking. If the user asks to refine, improve, critique, or iterate on a prompt, text, or research a topic in the chat, **OUTPUT THE RESPONSE, PROMPT, OR RESEARCH DIRECTLY IN YOUR CHAT RESPONSE**. Do NOT assume every request is a music video storyboard or force scene creation unless requested.
2. **App Direct Write & Edit Mode (${isAppEditEnabled ? 'ENABLED / ACTIVE' : 'DISABLED / READ-ONLY'}):**
${isAppEditEnabled ? `   - ✏️ **APP DIRECT WRITE/EDIT MODE IS ACTIVE:** You have full authorization to modify, write, and update the application's project texts, lyrics, technical instructions, creative contexts, art styles, cast characters, and storyboard scene prompts using your function tools (\`updateProjectData\`, \`updateSceneImagePrompt\`, \`addCharacter\`, \`updateCharacter\`, \`generateImage\`, \`addAttachedImageAsReference\`).
   - When the user asks you to write, edit, rewrite, update, modify, or apply text changes to their project (such as lyrics, starter technical prompts, art style, aspect ratio, creative context, motifs, character attributes, or storyboard scene image prompts), **YOU SHOULD PROACTIVELY AND DIRECTLY INVOKE THE RESPECTIVE FUNCTION CALL** to write the text straight into the app!
   - In addition to executing the tool call, briefly summarize what you updated in the app so the user is informed.` : `   - 🔒 **APP DIRECT WRITE/EDIT MODE IS OFF:** Respond strictly in chat text. Do NOT call project-state modification tools (\`updateProjectData\`, \`updateCharacter\`, \`addCharacter\`, or \`updateSceneImagePrompt\`) unless the user explicitly commands you to save to their project tabs.`}
3. **Web Search & Grounding (Internet Access):** When Internet / Web Search is enabled, use Google Search grounding to provide verified, accurate, and up-to-date information, documentation, news, lyrics, and real-world references.
4. **Git & GitHub Repository Awareness & Capabilities:**
   - You are fully aware that you can connect to Git and GitHub repositories.
   - Users can connect any Git repository or attach source code files directly to the chat using the **\`🐙 Git / GitHub\`** toggle or button in the chat header and input bar.
   - When a repository is connected, you actively leverage the repository context (Repository URL, branch, commit history, author, patch diffs, and codebase architecture) to provide grounded answers, debug code, review changes, write commit messages, and create Jules task specifications.
   - If the user asks about Git or GitHub connectivity, explain that they can connect repositories, inspect commits, and analyze code directly within Studio Chat.
5. **No Slop & High Precision:** Ban stock filler phrases ("let's dive in", "it's important to note"). Be concrete, actionable, and direct.`;

    if (gitRepoContext && gitRepoContext.isEnabled) {
        systemInstruction += `\n\n--- 🐙 AUTHORITATIVE CONNECTED GITHUB REPOSITORY CONTEXT ---\n`;
        systemInstruction += `- **Repository:** ${gitRepoContext.owner}/${gitRepoContext.repo}\n`;
        systemInstruction += `- **Branch:** ${gitRepoContext.branch}\n`;
        if (gitRepoContext.latestCommit) {
            systemInstruction += `- **Latest Remote Commit:** ${gitRepoContext.latestCommit.sha ? gitRepoContext.latestCommit.sha.slice(0, 7) : 'HEAD'} ("${gitRepoContext.latestCommit.message || 'Latest update'}")\n`;
            systemInstruction += `- **Commit Author:** ${gitRepoContext.latestCommit.authorName || 'Contributor'} (${gitRepoContext.latestCommit.authorDate || 'Recent'})\n`;
            if (gitRepoContext.latestCommit.files && gitRepoContext.latestCommit.files.length > 0) {
                systemInstruction += `- **Files Changed in Latest Commit (${gitRepoContext.latestCommit.files.length}):**\n`;
                gitRepoContext.latestCommit.files.slice(0, 15).forEach((f: any) => {
                    systemInstruction += `  * \`${f.filename}\` (${f.status}, +${f.additions}/-${f.deletions})\n`;
                });

                const patches = gitRepoContext.latestCommit.files
                    .filter((f: any) => f.patch)
                    .map((f: any) => `--- GIT DIFF: ${f.filename} (${f.status}) ---\n\`\`\`diff\n${f.patch}\n\`\`\``)
                    .join('\n\n');

                if (patches) {
                    systemInstruction += `\n#### Exact Git Commit Diffs:\n${patches}\n`;
                }
            }
        }
        if (typeof gitRepoContext.indexedFilesCount === 'number' && gitRepoContext.indexedFilesCount > 0) {
            systemInstruction += `- **Total Indexed Files in Repo:** ${gitRepoContext.indexedFilesCount} files\n`;
        }
        if (gitRepoContext.fileTreeSample && gitRepoContext.fileTreeSample.length > 0) {
            systemInstruction += `\n#### Repository File Structure (Sample):\n${gitRepoContext.fileTreeSample.map(p => `- ${p}`).join('\n')}\n`;
        }
        if (gitRepoContext.retrievedSourceSnippets && gitRepoContext.retrievedSourceSnippets.length > 0) {
            systemInstruction += `\n#### Exact Source Code Files Retrieved from GitHub Repository:\n`;
            gitRepoContext.retrievedSourceSnippets.forEach(snip => {
                systemInstruction += `\n📁 **File: \`${snip.path}\`**\n\`\`\`${snip.language}\n${snip.content}\n\`\`\`\n`;
            });
        }
        systemInstruction += `\n**CRITICAL REPOSITORY DIRECTIVE:** You are ALREADY connected to this GitHub repository. The commit details, file structure, git diffs, and source code above are live and authoritative. NEVER tell the user that you don't have access to GitHub or ask them to paste code/diffs. Directly analyze the code and solve their request.\n`;
    }

    if (projectData) {
        const castContext = projectData.characters && projectData.characters.length > 0 
            ? projectData.characters.map(c => `- ${c.name}: ${JSON.stringify(c.description) || 'No description'}`).join('\n') 
            : 'None';
        const referenceContext = projectData.referenceImages && projectData.referenceImages.length > 0
            ? projectData.referenceImages.map((r, i) => `[REF_${i + 1}]: ${r.description || 'No description'}`).join('\n') 
            : 'None';
        
        systemInstruction += `\n\n### Current Project Context (Reference Only)\n`;
        systemInstruction += `- **Project Type:** ${projectData.projectType}\n`;
        systemInstruction += `- **Art Style:** ${projectData.artStyle}\n`;
        systemInstruction += `- **Aspect Ratio:** ${projectData.aspectRatio}\n`;
        if (projectData.generationMode === 'narrative') {
            systemInstruction += `- **Lyrics:**\n${projectData.lyrics}\n`;
        } else {
            systemInstruction += `- **Starter Prompt / Instructions:**\n${projectData.technicalInstructions}\n`;
        }
        systemInstruction += `- **Cast (Characters):**\n${castContext}\n`;
        systemInstruction += `- **Visual References:**\n${referenceContext}\n`;
    }
    
    if (directorPlan && directorPlan.scenes.length > 0) {
        systemInstruction += `\n\n### Current Storyboard Scenes (Reference Only)\n`;
        directorPlan.scenes.slice(0, 10).forEach((scene, i) => {
            systemInstruction += `[Scene ${i}] ${scene.contentBeat} - ${scene.imagePrompt.substring(0, 80)}...\n`;
        });
    }

    const generateImageTool = {
        name: "generateImage",
        description: "Generate an image based on a detailed prompt.",
        parameters: {
            type: Type.OBJECT,
            properties: {
                prompt: {
                    type: Type.STRING,
                    description: "The detailed prompt for the image generation.",
                },
                aspectRatio: {
                    type: Type.STRING,
                    description: "The aspect ratio of the image. Must be one of: '16:9', '9:16', '1:1'. Default is '16:9'.",
                }
            },
            required: ["prompt"],
        },
    };

    const updateProjectDataTool = {
        name: "updateProjectData",
        description: isAppEditEnabled 
            ? "Write or update the project configuration, lyrics, technical instructions/starter prompts, art style, aspect ratio, creative context, or recurring motifs in the Director tab. Proactively use this whenever the user asks to write, edit, generate, refine, or update text in the project."
            : "Update the project configuration in the Director tab. Use this when the user explicitly asks to save or apply changes to their Director tab or project settings.",
        parameters: {
            type: Type.OBJECT,
            properties: {
                technicalInstructions: { type: Type.STRING, description: "The updated starter prompt / technical instructions." },
                lyrics: { type: Type.STRING, description: "The updated lyrics." },
                artStyle: { type: Type.STRING, description: "The updated art style." },
                aspectRatio: { type: Type.STRING, description: "The updated aspect ratio ('16:9', '9:16', '1:1')." },
                creativeContext: { type: Type.STRING, description: "The updated creative context / narrative focus." },
                recurringMotifs: { type: Type.STRING, description: "The updated recurring motifs / visual symbols." }
            }
        }
    };
    
    const addCharacterTool = {
        name: "addCharacter",
        description: isAppEditEnabled
            ? "Add a new character to the project's cast list. Proactively use this when the user asks to create, add, or define a new character for the project."
            : "Add a new character to the project's cast list. Use this when the user explicitly asks to add or save a character to the project cast.",
        parameters: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: "Character's name." },
                facialFeatures: { type: Type.STRING, description: "Facial features." },
                hairStyle: { type: Type.STRING, description: "Hair style." },
                bodyType: { type: Type.STRING, description: "Body type." },
                height: { type: Type.STRING, description: "Height." },
                weight: { type: Type.STRING, description: "Weight." },
                clothingStyle: { type: Type.STRING, description: "Clothing style." },
                personality: { type: Type.STRING, description: "Personality." },
                keyExpressions: { type: Type.STRING, description: "Key expressions." }
            },
            required: ["name", "facialFeatures", "hairStyle"]
        }
    };
    
    const updateCharacterTool = {
        name: "updateCharacter",
        description: isAppEditEnabled
            ? "Update an existing character's details in the cast list by matching their name. Proactively use this when the user asks to modify or edit a character."
            : "Update an existing character's details in the cast list by matching their name. Use this when the user asks to update a character in the cast list.",
        parameters: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: "The EXACT name of the character to update." },
                facialFeatures: { type: Type.STRING, description: "Updated facial features." },
                hairStyle: { type: Type.STRING, description: "Updated hair style." },
                bodyType: { type: Type.STRING, description: "Updated body type." },
                height: { type: Type.STRING, description: "Updated height." },
                weight: { type: Type.STRING, description: "Updated weight." },
                clothingStyle: { type: Type.STRING, description: "Updated clothing style." },
                personality: { type: Type.STRING, description: "Updated personality." },
                keyExpressions: { type: Type.STRING, description: "Updated key expressions." }
            },
            required: ["name"]
        }
    };

    const addAttachedImageAsReferenceTool = {
        name: "addAttachedImageAsReference",
        description: "If the user uploaded an image in this message, use this tool to add that image to the project's Reference Images.",
        parameters: {
            type: Type.OBJECT,
            properties: {
                role: { type: Type.STRING, description: "The role of the image, e.g., 'Master Art Style', 'Character Sheet', or 'Pose Reference'." },
                isMasterArt: { type: Type.BOOLEAN, description: "Set to true if this is a master art style reference." },
                characterId: { type: Type.STRING, description: "Optional. The ID or Name of the character this reference belongs to." }
            }
        }
    };

    const updateSceneImagePromptTool = {
        name: "updateSceneImagePrompt",
        description: isAppEditEnabled
            ? "Update the image prompt of a specific scene in the storyboard. Proactively use this whenever the user asks to rewrite, refine, or update a storyboard scene's prompt."
            : "Update the image prompt of a specific scene in the storyboard. Use this when the user explicitly asks to update a specific storyboard scene.",
        parameters: {
            type: Type.OBJECT,
            properties: {
                sceneIndex: { type: Type.NUMBER, description: "The 0-based index of the scene to update." },
                newImagePrompt: { type: Type.STRING, description: "The new image prompt." }
            },
            required: ["sceneIndex", "newImagePrompt"]
        }
    };

    const rawContents = history.map(msg => ({
        role: msg.role,
        parts: msg.parts
    }));

    const newParts: any[] = [];
    if (newMessage) newParts.push({ text: newMessage });
    
    if (attachedImageBase64) {
        const imageList = Array.isArray(attachedImageBase64) ? attachedImageBase64 : [attachedImageBase64];
        for (const img of imageList) {
            if (typeof img === 'string' && img.includes(',')) {
                const mimeMatch = img.match(/^data:(image\/[a-zA-Z+]+);base64,/);
                const mimeType = mimeMatch ? mimeMatch[1] : (img.startsWith('data:image/png') ? 'image/png' : 'image/jpeg');
                newParts.push({
                    inlineData: {
                        data: img.split(',')[1],
                        mimeType: mimeType,
                    }
                });
            }
        }
    }
    if (newParts.length === 0) newParts.push({ text: "[Empty message]" });

    rawContents.push({
        role: 'user',
        parts: newParts
    });

    // Proactively prune history, strip stale base64 images, and condense oversized code attachments
    const sanitizedRaw = pruneAndSanitizeStudioContents(rawContents, 650000);

    const contents: any[] = [];
    for (const msg of sanitizedRaw) {
        if (contents.length > 0 && contents[contents.length - 1].role === msg.role) {
            contents[contents.length - 1].parts.push(...msg.parts);
        } else {
            contents.push({ role: msg.role, parts: [...msg.parts] });
        }
    }

    const tools: any[] = [];
    if (enableWebSearch) {
        // Google Search is a built-in server-side tool. In Gemini API, built-in tools cannot
        // be mixed with client-side functionDeclarations in the same tool array without server-side routing.
        tools.push({ googleSearch: {} });
    } else {
        tools.push({
            functionDeclarations: [
                generateImageTool,
                updateProjectDataTool,
                addCharacterTool,
                updateSceneImagePromptTool,
                updateCharacterTool,
                addAttachedImageAsReferenceTool
            ]
        });
    }

    const requestConfig: any = {
        temperature: 0.7,
        systemInstruction,
        safetySettings,
        ...(tools.length > 0 ? { tools } : {}),
    };

    console.log(`sendStudioChatMessage: Calling generateContent (webSearch=${enableWebSearch}, estTokens=${estimateContentTokens(contents, systemInstruction)})...`);
    let response: any;
    try {
        response = await withRetry(() => callTextModel(genAI, {
            model: currentTextModel,
            contents: contents,
            config: requestConfig
        }));
    } catch (callErr: any) {
        const errMsg = (callErr?.message || '') + JSON.stringify(callErr || '');
        if (errMsg.includes('include_server_side_tool_invocations') || errMsg.includes('Built-in tools with Function calling')) {
            console.warn("sendStudioChatMessage: Tool combination conflict detected, retrying with Google Search only...");
            response = await withRetry(() => callTextModel(genAI, {
                model: currentTextModel,
                contents: contents,
                config: {
                    temperature: 0.7,
                    systemInstruction,
                    safetySettings,
                    tools: [{ googleSearch: {} }]
                }
            }));
        } else if (isTokenLimitError(callErr)) {
            console.warn("sendStudioChatMessage: Input token limit exceeded (1048576 tokens). Auto-compacting conversation history and retrying...");
            // Emergency compaction: Keep only the most recent user prompt and strip all historical turns
            const emergencyContents: any[] = [
                {
                    role: 'user',
                    parts: newParts.map(p => {
                        if (p.text && p.text.length > 40000) {
                            return {
                                text: p.text.substring(0, 20000) + '\n\n[... content truncated to fit model token limit ...]\n\n' + p.text.substring(p.text.length - 5000)
                            };
                        }
                        return p;
                    })
                }
            ];

            const compactedSysInstruction = systemInstruction.length > 15000 
                ? systemInstruction.substring(0, 15000) + '\n[... system context truncated for token budget ...]'
                : systemInstruction;

            response = await withRetry(() => callTextModel(genAI, {
                model: currentTextModel,
                contents: emergencyContents,
                config: {
                    temperature: 0.7,
                    systemInstruction: compactedSysInstruction,
                    safetySettings,
                    ...(tools.length > 0 ? { tools } : {}),
                }
            }));
        } else {
            throw callErr;
        }
    }
    console.log("sendStudioChatMessage: generateContent returned.");

    let text = "";
    try {
        text = response.text?.trim() || "";
    } catch (e) {
        console.warn("sendStudioChatMessage: response.text threw an error (likely function call).", e);
        text = ""; // Don't set a safety error message if it's just a function call
    }
    console.log("sendStudioChatMessage: text extracted:", text);

    // Extract Google Search Grounding Metadata & Citations
    let groundingMetadata: StudioGroundingMetadata | undefined = undefined;
    try {
        const candidate = response.candidates?.[0];
        if (candidate?.groundingMetadata) {
            const gm = candidate.groundingMetadata as any;
            const queries: string[] = Array.isArray(gm.webSearchQueries) ? gm.webSearchQueries : [];
            const sources: StudioGroundingSource[] = [];

            if (Array.isArray(gm.groundingChunks)) {
                for (const chunk of gm.groundingChunks) {
                    if (chunk?.web?.uri) {
                        sources.push({
                            title: chunk.web.title || chunk.web.uri,
                            url: chunk.web.uri
                        });
                    }
                }
            }

            const uniqueSources = sources.filter((s, idx, arr) => 
                arr.findIndex(x => x.url === s.url) === idx
            );

            if (queries.length > 0 || uniqueSources.length > 0) {
                groundingMetadata = {
                    webSearchQueries: queries,
                    sources: uniqueSources
                };
            }
        }
    } catch (gmErr) {
        console.warn("sendStudioChatMessage: Failed to parse grounding metadata", gmErr);
    }

    return {
        text,
        functionCalls: response.functionCalls,
        groundingMetadata
    };
};

export const extractCharacterDNA = async (base64Data: string, apiKey?: string): Promise<any> => {
    const genAI = getGenAI(apiKey);

    const imagePart = {
        inlineData: {
            data: base64Data.split(',')[1],
            mimeType: base64Data.startsWith('data:image/png') ? 'image/png' : 'image/jpeg',
        },
    };

    const textPart = {
        text: "Analyze the person in this image and extract their key physical and personality traits into the provided JSON schema. Be descriptive and detailed."
    };

    const response = await withRetry(() => callTextModel(genAI, {
        model: currentTextModel,
        contents: { parts: [imagePart, textPart] },
        config: {
            ...generationConfig,
            responseSchema: dnaSchema,
            safetySettings,
        },
    }));

    let text = "{}";
    try {
        text = response.text?.trim() || "{}";
    } catch (e) {
        throw new Error("DNA extraction blocked by safety settings.");
    }
    
    try {
        return JSON.parse(extractJSON(text));
    } catch (e) {
        console.error("Failed to parse DNA:", text);
        throw new Error("The AI failed to extract character DNA in the expected format.");
    }
};

export const autoStyleCharacterDNA = async (currentDna: any, name: string, apiKey?: string): Promise<any> => {
    const genAI = getGenAI(apiKey);

    const textPart = {
        text: `You are an expert character designer and stylist. I have a character named "${name}" with the following partial profile. Please fill in any missing details, and specifically invent highly detailed, fashionable, and cohesive options for their hairstyle, clothing style, and makeup/styling if they are not already detailed. 
CRITICAL WARDROBE RULE: If you give the character a suit, jacket, blazer, or open coat, you MUST explicitly include an appropriate inner garment (e.g., dress shirt, t-shirt, blouse, turtleneck, tie) in the clothing description. AVOID phrases like "deep V-neckline" when describing suits.
Return the complete, enhanced profile using the provided JSON schema.\n\nCurrent Profile:\n${JSON.stringify(currentDna, null, 2)}`
    };

    const response = await withRetry(() => callTextModel(genAI, {
        model: currentTextModel,
        contents: { parts: [textPart] },
        config: {
            ...generationConfig,
            responseSchema: dnaSchema,
        }
    }));

    const text = response.text?.trim() || "{}";
    
    try {
        return JSON.parse(extractJSON(text));
    } catch (e) {
        console.error("Failed to parse DNA:", text);
        throw new Error("The AI failed to generate character styling in the expected format.");
    }
};

export const generateCharacterDNAFromText = async (prompt: string, apiKey?: string): Promise<any> => {
    const genAI = getGenAI(apiKey);

    const textPart = {
        text: `Based on the following character concept, generate a detailed physical and personality profile using the provided JSON schema. Be highly descriptive and creative, filling in any missing details to create a complete character.
CRITICAL WARDROBE RULE: If you give the character a suit, jacket, blazer, or open coat, you MUST explicitly include an appropriate inner garment (e.g., dress shirt, t-shirt, blouse, turtleneck, tie) in the clothing description. AVOID phrases like "deep V-neckline" when describing suits.
\n\nCharacter Concept: "${prompt}"`
    };

    const response = await withRetry(() => callTextModel(genAI, {
        model: currentTextModel,
        contents: { parts: [textPart] },
        config: {
            ...generationConfig,
            responseSchema: dnaSchema,
            safetySettings,
        },
    }));

    let text = "{}";
    try {
        text = response.text?.trim() || "{}";
    } catch (e) {
        throw new Error("DNA generation blocked by safety settings.");
    }
    
    try {
        return JSON.parse(extractJSON(text));
    } catch (e) {
        console.error("Failed to parse DNA:", text);
        throw new Error("The AI failed to generate character DNA in the expected format.");
    }
};


export const generateComboBatchScenes = async (
    prompt: string,
    apiKey: string | undefined,
    addLog: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void
): Promise<any[]> => {
    addLog("Connecting to Gemini to generate combo scenes...", 'info');
    const genAI = getGenAI(apiKey);
    
    const parts = [{ text: prompt }];
    const schema = {
        type: Type.ARRAY,
        description: "Array of generated scenes based on the provided combinations.",
        items: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING, description: "A short, descriptive title for the scene." },
                imagePrompt: { type: Type.STRING, description: "Detailed image prompt focusing on the action, setting, and mood in a documentary style." },
                videoMotionPrompt: { type: Type.STRING, description: "Camera motion or action." }
            },
            required: ["title", "imagePrompt", "videoMotionPrompt"]
        }
    };
    
    const config = {
        ...generationConfig,
        responseSchema: schema,
        systemInstruction: "You are an expert film director and cinematographer. Generate scenes that strictly follow the assigned Moment, Environment, and Atmosphere combinations in a photorealistic documentary style.",
    };
    
    addLog("Generating batch...", 'info');
    const response = await withRetry(() => callTextModel(genAI, { model: currentTextModel, contents: { parts }, config }));
    
    let text = response.text || "[]";
    try {
        const parsed = safeParseJSON(text);
        if (Array.isArray(parsed)) return parsed;
        if (parsed?.scenes && Array.isArray(parsed.scenes)) return parsed.scenes;
        return normalizeDirectorScenes(parsed);
    } catch (e) {
        throw new Error("Failed to parse combo batch scenes.");
    }
};


export const generateMultiSwapImage = async (
    frameReferenceBase64: string,
    characterMappings: { charId: string, description: string }[],
    aspectRatio: AspectRatio,
    projectData: ProjectData,
    apiKey: string | undefined,
    addLog: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void
): Promise<string> => {
    if (currentImageModel === 'pollinations') {
        throw new Error("Pollinations API does not support character swapping. Please select a Gemini image model in Settings.");
    }
    
    addLog("Connecting to image generation service for multi-character swap...", 'info');
    const genAI = getGenAI(apiKey);
    
    const isSingleSwap = characterMappings.length === 1;
    let finalPrompt = "";

    const is31 = currentImageModel === 'gemini-3.1-flash-image';
    if (!is31) { // Auto-describe frame reference for legacy models
        // Auto-describe frame reference to provide robust scene context for models that don't support native tag merging well
        addLog(`Analyzing frame reference to generate a scene description for ${currentImageModel}...`, 'info');
        try {
            const visionResponse = await callTextModel(genAI, {
                model: currentTextModel,
                contents: [
                    {
                        inlineData: {
                            data: frameReferenceBase64.split(',')[1],
                            mimeType: getMimeType(frameReferenceBase64),
                        }
                    },
                    "Conduct a rigorous, pixel-perfect visual analysis of this image to serve as a strict structural blueprint. Describe: 1. Subject Pose & Geometry: EXACT position of the head, hands, arms, and fingers. 2. Clothing & Accessories. 3. Lighting & Composition: Camera framing (e.g. close-up), light direction, shadows. 4. Background details. DO NOT describe the person's face or identity. Keep it highly descriptive."
                ]
            });
            const autoPrompt = visionResponse.text?.trim() || "";
            if (autoPrompt) {
                finalPrompt += `Image Description to Generate (Auto-analyzed from Frame Reference):\n${autoPrompt}\n\n`;
                const charLabelStr = "the provided Reference Image(s)";
                finalPrompt += `CRITICAL OVERRIDE: You MUST replace the subject(s) described in the text above with the person(s) from ${charLabelStr}. If the text above describes a different person, hair color, age, or gender, COMPLETELY IGNORE IT and use ${charLabelStr}. Always prioritize ${charLabelStr} for the subject's face, hair, and identity. HOWEVER, you MUST strictly follow the camera framing, body posture, clothing, and background described in the text above.\n\n`;
                addLog(`Auto-generated scene description: ${autoPrompt}`, 'success');
            }
        } catch (e) {
            console.error("Failed to auto-describe frame for swap:", e);
            addLog("Failed to auto-describe frame reference. Proceeding with base prompt.", 'warning');
        }
    } else {
        finalPrompt = isSingleSwap 
            ? "Task: Image Editing. You are provided with a [Scene Reference] image and a [Subject Reference] image. Generate an image that exactly matches the [Scene Reference] in every detail (composition, background, lighting, objects, pose), but seamlessly replaces the person's identity and facial features with the person in the [Subject Reference]. Ensure the lighting and shadows on the new face match the original scene perfectly for a highly realistic, unedited photograph look.\n\n" 
            : "Task: Image Editing. You are provided with a [Scene Reference] image and [Subject Reference] images. Generate an image that exactly matches the [Scene Reference] in every detail (composition, background, lighting, objects, pose), but seamlessly replaces the characters' identities and facial features with the people in the [Subject Reference] images. Ensure the lighting and shadows on the new faces match the original scene perfectly for a highly realistic, unedited photograph look.\n\n";
    }

    const parts: any[] = [];
    
    // Add Frame Reference ONLY for 3.1. Legacy models just copy it and ignore the character.
    if (is31) {
        parts.push({ text: `[Scene Reference]` });
        parts.push({
            inlineData: {
                data: frameReferenceBase64.split(',')[1],
                mimeType: getMimeType(frameReferenceBase64),
            }
        });
    }

    // Add Character References
    characterMappings.forEach((mapping, index) => {
        const refImage = projectData.referenceImages?.find(r => r.id === mapping.charId);
        const char = projectData.characters?.find(c => c.id === refImage?.characterId);
        
        if (refImage) {
            const effectiveDesc = mapping.description.trim() || (isSingleSwap ? "The main subject in the image" : `Character ${index + 1}`);
            if (!isSingleSwap || effectiveDesc !== "The main subject in the image") {
                finalPrompt += `**Character ${index + 1} Details:**\n`;
                finalPrompt += `- Role/Position in the scene: ${effectiveDesc}\n`;
                if (char) {
                    finalPrompt += `- Character Name: ${char.name}\n`;
                }
                finalPrompt += `\n`;
            } else if (isSingleSwap && char) {
                finalPrompt += `**Subject Details:**\n`;
                finalPrompt += `- Character Name: ${char.name}\n\n`;
            }
            
            parts.push({ text: is31 ? (isSingleSwap ? `[Subject Reference]` : `[Subject Reference ${index + 1}]`) : `[Image ${index + 1} - EXACT face/identity]:` });
            parts.push({
                inlineData: {
                    data: refImage.data.split(',')[1],
                    mimeType: getMimeType(refImage.data),
                }
            });
        }
    });
    
    // Add master art references
    if (projectData?.referenceImages) {
        const masterArts = projectData.referenceImages.filter(r => r.isMasterArt && r.enabled !== false);
        masterArts.forEach((masterRef) => {
            parts.push({ text: `[Style Reference]:` });
            parts.push({
                inlineData: {
                    data: masterRef.data.split(',')[1],
                    mimeType: getMimeType(masterRef.data),
                }
            });
        });
    }

    const isRealistic = (projectData.artStyle || '').toLowerCase().match(/(realistic|photo|cinematic|film|iphone|camera|live action|realism)/);
    if (isRealistic) {
        finalPrompt += `\n**REALISM & ANTI-SLOP OVERRIDE:**
- **Skin & Texture:** Avoid an overly plastic CGI look, but keep the skin naturally smooth, clean, and flattering.
- **Overall:** Prioritize a highly natural but aesthetically pleasing photographic style.\n\n`;
    }

    parts.push({ text: finalPrompt });

    const doGenerate = async () => {
        const response = await withRetry(() => callTextModel(genAI, {
            model: currentImageModel,
            contents: { parts },
            config: {
                responseModalities: ["IMAGE"],
                ...(aspectRatio !== 'Original' ? {
                    imageConfig: {
                        aspectRatio: getAspectRatio(aspectRatio as any),
                    }
                } : {}),
                safetySettings,
            },
        }));
        
        const candidate = response.candidates?.[0];
        
        if (candidate?.finishReason === 'SAFETY' || candidate?.finishReason === 'IMAGE_SAFETY') {
            throw new Error("Image generation was blocked by safety filters.");
        }
        
        const partsList = candidate?.content?.parts || [];
        for (const part of partsList) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        throw new Error("No image was returned by the model.");
    };

    try {
        const img = await doGenerate();
        addLog("Multi-character swap generated successfully.", 'success');
        return img;
    } catch (e: any) {
        addLog(`Failed to generate swapped image: ${e.message}`, 'error');
        throw e;
    }
};


export const generateEditedImage = async (
    base64ImageData: string,
    prompt: string,
    aspectRatio: AspectRatio,
    apiKey: string | undefined,
    addLog: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void
): Promise<string> => {
    if (currentImageModel === 'pollinations') {
        throw new Error("Pollinations API does not support image-to-image editing. Please select a Gemini image model in Settings.");
    }

    const genAI = getGenAI(apiKey);
    
    let activePrompt = "Task: Edit the provided image exactly according to the following instruction. Preserve elements that are not mentioned in the instruction. Instruction: " + prompt;
    
    const parts: any[] = [
        { text: `[Image to Edit]:` },
        {
            inlineData: {
                data: base64ImageData.split(',')[1],
                mimeType: getMimeType(base64ImageData),
            }
        },
        { text: activePrompt }
    ];
    
    const doGenerate = async () => {
        const response = await withRetry(() => callTextModel(genAI, {
            model: currentImageModel,
            contents: { parts },
            config: {
                responseModalities: ["IMAGE"],
                ...(aspectRatio !== 'Original' ? {
                    imageConfig: {
                        aspectRatio: getAspectRatio(aspectRatio as any),
                    }
                } : {}),
                safetySettings,
            },
        }));

        const candidate = response.candidates?.[0];
        
        if (candidate?.finishReason === 'SAFETY' || candidate?.finishReason === 'IMAGE_SAFETY') {
            throw new Error("Image generation was blocked by safety filters.");
        }
        if (candidate?.finishReason === 'RECITATION') {
            throw new Error("Image generation was blocked by recitation filters.");
        }
        if (candidate?.finishReason === 'OTHER') {
            throw new Error("Image generation was blocked for an unknown reason.");
        }
        if (candidate?.finishReason === 'IMAGE_OTHER') {
            throw new Error("IMAGE_OTHER");
        }

        const partsList = candidate?.content?.parts || [];
        for (const part of partsList) {
            if (part.inlineData) {
                const base64String = part.inlineData.data;
                return `data:image/png;base64,${base64String}`;
            }
        }
        throw new Error("No image data received from API.");
    };

    try {
        return await doGenerate();
    } catch (error: any) {
        throw error;
    }
};

export const generateExtendedImage = async (
    base64ImageData: string,
    prompt: string,
    aspectRatio: AspectRatio,
    apiKey: string | undefined,
    addLog: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void
): Promise<string> => {
    if (currentImageModel === 'pollinations') {
        throw new Error("Pollinations API does not support outpainting. Please select a Gemini image model in Settings.");
    }

    addLog("Connecting to image generation service for outpainting...", 'info');
    const genAI = getGenAI(apiKey);
    
    let defaultPrompt = "Task: Outpaint / Extend the borders of this image naturally to fit the new aspect ratio. Preserve the central subject exactly as it is without altering the original composition.";
    const activePrompt = prompt ? `${defaultPrompt} Additional instructions: ${prompt}` : defaultPrompt;
    
    const parts: any[] = [
        { text: `[Image to Extend]:` },
        {
            inlineData: {
                data: base64ImageData.split(',')[1],
                mimeType: getMimeType(base64ImageData),
            }
        },
        { text: activePrompt }
    ];
    
    const doGenerate = async () => {
        const response = await withRetry(() => callTextModel(genAI, {
            model: currentImageModel,
            contents: { parts },
            config: {
                responseModalities: ["IMAGE"],
                ...(aspectRatio !== 'Original' ? {
                    imageConfig: {
                        aspectRatio: getAspectRatio(aspectRatio as any),
                    }
                } : {}),
                safetySettings,
            },
        }));
        
        const candidate = response.candidates?.[0];
        
        if (candidate?.finishReason === 'SAFETY' || candidate?.finishReason === 'IMAGE_SAFETY') {
            throw new Error("Image generation was blocked by safety filters.");
        }
        if (candidate?.finishReason === 'RECITATION') {
            throw new Error("Image generation was blocked by recitation filters.");
        }
        if (candidate?.finishReason === 'OTHER') {
            throw new Error("Image generation was blocked for an unknown reason.");
        }
        
        const partsList = candidate?.content?.parts || [];
        for (const part of partsList) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        throw new Error("No image was returned by the model.");
    };

    try {
        const img = await doGenerate();
        addLog("Extended image generated successfully.", 'success');
        return img;
    } catch (e: any) {
        addLog(`Failed to generate extended image: ${e.message}`, 'error');
        throw e;
    }
};

export const changeReferenceBackground = async (
    imageBase64: string,
    apiKey: string | undefined,
    addLog: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void
): Promise<string> => {
    if (currentImageModel === 'pollinations') {
        throw new Error("Pollinations API does not support background replacement. Please select a Gemini image model in Settings.");
    }
    
    addLog("Connecting to image generation service to change background...", 'info');
    const genAI = getGenAI(apiKey);
    
    // We use a prompt instructing the model to change the background to a solid neutral gray.
    const finalPrompt = "Task: Recreate the EXACT person/subject shown in the reference image provided. You MUST keep their face, hair, clothing, and pose 100% identical. HOWEVER, replace the entire background with a solid, flat, neutral gray color (#808080). Do not add any shadows or props to the background. Only the subject should remain, on a solid gray backdrop.";

    const parts = [];
    parts.push({ text: finalPrompt });
    parts.push({
        inlineData: {
            data: imageBase64.split(',')[1],
            mimeType: getMimeType(imageBase64),
        }
    });

    const doGenerate = async () => {
        const response = await withRetry(() => callTextModel(genAI, {
            model: currentImageModel,
            contents: { parts },
            config: {
                responseModalities: ["IMAGE"],
                imageConfig: {
                    aspectRatio: '1:1',
                },
                safetySettings,
            },
        }));
        
        const candidate = response.candidates?.[0];
        
        if (candidate?.finishReason === 'SAFETY' || candidate?.finishReason === 'IMAGE_SAFETY') {
            throw new Error("Image generation was blocked by safety filters.");
        }
        
        const partsList = candidate?.content?.parts || [];
        for (const part of partsList) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        throw new Error("No image was returned by the model.");
    };

    try {
        const img = await doGenerate();
        addLog("Background changed successfully.", 'success');
        return img;
    } catch (e: any) {
        addLog(`Failed to change background: ${e.message}`, 'error');
        throw e;
    }
};

export const syncSubtitleTranslations = async (currentText: string, apiKey?: string, direction?: 'line1' | 'line2'): Promise<string> => {
    try {
        const keyToUse = apiKey || localStorage.getItem('gemini_api_key');
        if (!keyToUse) throw new Error("API key missing");

        const targetLang = localStorage.getItem('ai_sub_tgt_lang') || 'English';
        const subtitleType = localStorage.getItem('ai_sub_type') || 'standard';

        const genAI = new GoogleGenAI({ apiKey: keyToUse });
        
        let formatInstruction = "";
        if (subtitleType === 'standard') {
            formatInstruction = "Translate or keep the text as a single line in the target language.";
        } else if (subtitleType === 'bilingual') {
            formatInstruction = "Line 1: Native Language. Line 2: Translated to " + targetLang + ".";
        } else if (subtitleType === 'dual_trans') {
            formatInstruction = "Line 1: English. Line 2: Translated to " + targetLang + ".";
        } else if (subtitleType === 'triple') {
            formatInstruction = "Line 1: Native Language. Line 2: Romanized/Phonetic. Line 3: Translated to " + targetLang + ".";
        } else if (subtitleType === 'quad') {
            formatInstruction = "Line 1: Native Language. Line 2: Romanized/Phonetic. Line 3: English. Line 4: Translated to " + targetLang + ".";
        } else {
            formatInstruction = "Maintain the multi-line translation format.";
        }

        const prompt = `
You are an expert subtitler. The user has edited a subtitle block. Your task is to synchronize the translation and structure based on the required subtitle format.
If the current text is missing lines, you MUST generate them to match the required format.

Required Format Rule: ${formatInstruction}
Target Language for Translation: ${targetLang}

Current Subtitle Text:
"""
${currentText}
"""

Instructions:
1. Identify the core meaning of the current text. ${direction === 'line1' ? 'Pay special attention to Line 1 as the source of truth, deriving the other lines from it.' : direction === 'line2' ? 'Pay special attention to Line 2 as the source of truth, deriving the other lines from it.' : ''}
2. Output the fully formatted subtitle block according to the Required Format Rule.
3. Output ONLY the updated string, with no markdown formatting, no explanations, no quotes. Just the raw subtitle text with line breaks matching the original format.
4. ABSOLUTELY NO TRAILING PERIODS. Ensure none of the lines end with a period (.).
`;

        const response = await withRetry(() => callTextModel(genAI, {
            model: currentTextModel,
            contents: { parts: [{ text: prompt }] },
            config: {
                temperature: 0.2, // low temp for accurate translation
            }
        }));
        
        let out = response.text?.trim() || currentText;
        return out.split('\n').map(line => line.replace(/\.$/, '').trim()).join('\n');
    } catch (e) {
        console.error("syncSubtitleTranslations error:", e);
        throw e;
    }
};

export const uploadVideoToGemini = async (file: File, apiKey?: string): Promise<string> => {
    try {
        const keyToUse = apiKey || localStorage.getItem('gemini_api_key');
        if (!keyToUse) throw new Error("API key missing");

        const genAI = new GoogleGenAI({ apiKey: keyToUse });
        
        const config: any = {};
        if (file.type) config.mimeType = file.type;
        if (file.name) config.displayName = file.name;

        const response = await genAI.files.upload({ 
            file, 
            config: Object.keys(config).length > 0 ? config : undefined 
        });
        
        let genFile = await genAI.files.get({ name: response.name });
        while (genFile.state === 'PROCESSING') {
            await new Promise(r => setTimeout(r, 2000));
            genFile = await genAI.files.get({ name: response.name });
        }
        
        if (genFile.state === 'FAILED') {
            const errorMessage = genFile.error?.message || 'Unknown processing error';
            throw new Error(`File processing failed on Gemini servers: ${errorMessage}`);
        }
        
        return genFile.uri || '';
    } catch (e: any) {
        console.error("uploadVideoToGemini error:", e);
        throw e;
    }
};


export const fixSubtitleWithFrame = async (
    currentText: string, 
    frameBase64: string, // must be raw base64, without data uri prefix
    apiKey?: string
): Promise<string> => {
    try {
        const keyToUse = apiKey || localStorage.getItem('gemini_api_key');
        if (!keyToUse) throw new Error("API key missing");

        const genAI = new GoogleGenAI({ apiKey: keyToUse });
        
        const prompt = `
You are an expert subtitler and visual context analyzer.
Please analyze this exact frame captured from a video.
The user suspects the current subtitle block during this exact time is incorrect (e.g., misspelled, missing context, or doesn't match what is visually happening).

Current Subtitle Text:
"""
${currentText}
"""

Instructions:
1. Carefully analyze the visual actions, on-screen text, or speaker identity occurring in this frame.
2. Rewrite or correct the subtitle text based on this visual context. If there is hardcoded text on the screen, TRANSLATE IT into the target language of the 'Current Subtitle Text'.
3. CRITICAL LANGUAGE RULE: Your final output MUST match the language of the 'Current Subtitle Text'. For example, if the current text is English, but the on-screen hardcoded text is Chinese, you MUST translate that Chinese text into English.
4. PLACEHOLDER OVERRIDE: If the Current Subtitle Text is exactly "New Caption" or clearly a placeholder, completely ignore the language rule and just write a brand new English caption describing the most prominent on-screen text, emotion, or action.
5. Output ONLY the corrected text. Do not explain your reasoning, do not use quotes, and do not use markdown formatting.
6. ABSOLUTELY NO TRAILING PERIODS. Do NOT end the text with a period (.).
`;

        const currentModel = getCurrentTextModel();
        const response = await withRetry(() => callTextModel(genAI, {
            model: currentModel,
            contents: [
                { 
                    inlineData: { data: frameBase64, mimeType: 'image/jpeg' } 
                },
                prompt
            ]
        }));

        if (response.text) {
            let t = response.text.trim();
            if (t.endsWith('.')) t = t.slice(0, -1);
            return t;
        }
        return currentText;
    } catch (e) {
        console.error("fixSubtitleWithFrame error:", e);
        throw e;
    }
};

export const fixSubtitleWithAgenticVideo = async (
    currentText: string, 
    fileUri: string,
    startTimeSeconds: number,
    endTimeSeconds: number,
    apiKey?: string
): Promise<string> => {
    try {
        const keyToUse = apiKey || localStorage.getItem('gemini_api_key');
        if (!keyToUse) throw new Error("API key missing");

        const genAI = new GoogleGenAI({ apiKey: keyToUse });
        
        const prompt = `
You are an expert subtitler and visual context analyzer.
Please watch the video segment closely from ${startTimeSeconds.toFixed(2)}s to ${endTimeSeconds.toFixed(2)}s.
The user suspects the current subtitle block during this exact time is incorrect (e.g., misspelled, missing context, or doesn't match what is visually happening).

Current Subtitle Text:
"""
${currentText}
"""

Instructions:
1. Carefully analyze the visual actions, on-screen text, lip movements, or speaker identity occurring during this exact timestamp window.
2. Rewrite or correct the subtitle text based on this visual context. If there is hardcoded text on the screen, TRANSLATE IT into the target language of the 'Current Subtitle Text'.
3. CRITICAL LANGUAGE RULE: Your final output MUST match the language of the 'Current Subtitle Text'. For example, if the current text is English, but the on-screen hardcoded text is Chinese, you MUST translate that Chinese text into English.
4. PLACEHOLDER OVERRIDE: If the Current Subtitle Text is exactly "New Caption" or clearly a placeholder, completely ignore the language rule and just write a brand new English caption describing the most prominent on-screen text, emotion, or action.
5. Output ONLY the corrected text. Do not explain your reasoning, do not use quotes, and do not use markdown formatting.
6. ABSOLUTELY NO TRAILING PERIODS. Do NOT end the text with a period (.).
`;

        const currentModel = getCurrentTextModel();
        const agenticModel = (currentModel.includes('3.7') || currentModel.includes('3.8')) ? currentModel : 'gemini-3.7-flash';

        const response = await withRetry(() => callTextModel(genAI, {
            model: agenticModel, // Must use a model that supports agentic video
            contents: [
                { 
                    fileData: { fileUri, mimeType: 'video/mp4' },
                    videoMetadata: {
                        startOffset: `${startTimeSeconds.toFixed(2)}s`,
                        endOffset: `${endTimeSeconds.toFixed(2)}s`
                    }
                },
                prompt
            ],
            config: {
                temperature: 0.2,
                
            } as any
        }));
        
        let out = response.text?.trim() || currentText;
        return out.replace(/\.$/, '').trim();
    } catch (e) {
        console.error("fixSubtitleWithAgenticVideo error:", e);
        throw e;
    }
};

export const fixSubtitleWithAudio = async (
    currentText: string, 
    fileUri: string,
    startTimeSeconds: number,
    endTimeSeconds: number,
    apiKey?: string
): Promise<string> => {
    try {
        const keyToUse = apiKey || localStorage.getItem('gemini_api_key');
        if (!keyToUse) throw new Error("API key missing");

        const genAI = new GoogleGenAI({ apiKey: keyToUse });
        
        const prompt = `
You are an expert subtitler and audio transcriber.
Please listen to the audio segment closely from ${startTimeSeconds.toFixed(2)}s to ${endTimeSeconds.toFixed(2)}s.
The user suspects the current subtitle block during this exact time is incorrect (e.g., misspelled, missing words, or misheard).

Current Subtitle Text:
"""
${currentText}
"""

Instructions:
1. Carefully analyze the spoken words, pronunciation, tone, and acoustic nuances during this exact timestamp window.
2. Rewrite or correct the subtitle text based on this audio context. 
3. CRITICAL LANGUAGE RULE: Your final output MUST match the target language of the 'Current Subtitle Text'.
4. Output ONLY the corrected text. Do not explain your reasoning, do not use quotes, and do not use markdown formatting.
5. ABSOLUTELY NO TRAILING PERIODS. Do NOT end the text with a period (.).
`;

        const currentModel = getCurrentTextModel();
        // Agentic is mostly for video, but we can use standard flash for audio, or keep agentic if it works.
        const agenticModel = (currentModel.includes('3.7') || currentModel.includes('3.8')) ? currentModel : 'gemini-3.7-flash';

        const response = await withRetry(() => callTextModel(genAI, {
            model: agenticModel,
            contents: [
                { 
                    fileData: { fileUri, mimeType: 'video/mp4' },
                    videoMetadata: {
                        startOffset: `${startTimeSeconds.toFixed(2)}s`,
                        endOffset: `${endTimeSeconds.toFixed(2)}s`
                    }
                }, // Can still pass video file, model will extract audio
                prompt
            ],
            config: {
                temperature: 0.2
            } as any
        }));
        
        let out = response.text?.trim() || currentText;
        return out.replace(/\.$/, '').trim();
    } catch (e) {
        console.error("fixSubtitleWithAudio error:", e);
        throw e;
    }
};
