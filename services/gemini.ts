
import { GoogleGenAI, Type, Modality, GenerateContentResponse, Content, HarmCategory, HarmBlockThreshold, FinishReason } from "@google/genai";
import { Scene, ProjectData, DirectorPlan, ReferenceImage, AspectRatio, VoiceName, VisionStructData, AnalysisFocus, FaceAnalysisData, BodyAnalysisData, CharacterProfile } from "../types";

// --- CONFIGURATION ---

// Permissive Safety Settings: Reduces "Nanny" filtering while keeping core safety.
// This allows for more dramatic/cinematic content (e.g., stage blood, horror makeup) 
// without triggering false positive blocks.
const SAFETY_SETTINGS = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH }
];

const QUOTA_ERROR_MESSAGE = "Quota Exceeded (429). The Free Tier rate limit is strict and may be IP-based. Changing keys might not help. Please wait 1-2 minutes before trying again.";

// --- HELPERS ---

const extractJSON = (text: string) => {
  if (!text) return "{}";
  const firstBrace = text.indexOf('{');
  const firstBracket = text.indexOf('[');
  let startIdx = -1;
  let openChar = '';
  let closeChar = '';

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIdx = firstBrace;
    openChar = '{';
    closeChar = '}';
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
    openChar = '[';
    closeChar = ']';
  }

  if (startIdx === -1) return text;

  let balance = 0;
  let endIdx = -1;
  let inString = false;
  let escape = false;

  for (let i = startIdx; i < text.length; i++) {
    const char = text[i];
    if (escape) { escape = false; continue; }
    if (char === '\\') { escape = true; continue; }
    if (char === '"') { inString = !inString; continue; }
    if (!inString) {
      if (char === openChar) balance++;
      else if (char === closeChar) {
        balance--;
        if (balance === 0) { endIdx = i; break; }
      }
    }
  }

  let jsonStr = endIdx !== -1 ? text.substring(startIdx, endIdx + 1) : text.substring(startIdx);
  jsonStr = jsonStr.replace(/,(\s*[}\]])/g, '$1');
  return jsonStr;
};

// PCM to WAV Converter (for Gemini Audio)
const createWavHeader = (sampleRate: number, numChannels: number, bitsPerSample: number, dataLength: number) => {
    const buffer = new ArrayBuffer(44);
    const view = new DataView(buffer);
    const writeString = (offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i));
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + dataLength, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true);
    view.setUint16(32, numChannels * (bitsPerSample / 8), true);
    view.setUint16(34, bitsPerSample, true);
    writeString(36, 'data');
    view.setUint32(40, dataLength, true);

    return buffer;
};

const base64ToUint8Array = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
};

const calculateTargetSceneCount = (totalDuration: string, segmentDurationStr: string): number => {
    // Parse Total Duration (e.g., "3:05" or "185")
    let totalSeconds = 0;
    if (totalDuration.includes(':')) {
        const parts = totalDuration.split(':');
        const min = parseInt(parts[0]) || 0;
        const sec = parseInt(parts[1]) || 0;
        totalSeconds = (min * 60) + sec;
    } else {
        totalSeconds = parseInt(totalDuration) || 180;
    }

    // Parse Segment Duration (e.g., "8s" or "8")
    const segmentSeconds = parseInt(segmentDurationStr.replace(/[^0-9]/g, '')) || 8;

    if (totalSeconds <= 0 || segmentSeconds <= 0) return 10; // Fallback
    return Math.ceil(totalSeconds / segmentSeconds);
};

// --- PROMPT BUILDERS ---

const formatDnaString = (description: CharacterProfile['description'], excludeFace: boolean = false): string => {
    const parts = [
        // CRITICAL: If excludeFace is true, we SKIP the text description of the face.
        // This prevents "Semantic Override" where the model prefers the text (e.g. "Oval face") 
        // over the actual pixels of the reference image.
        !excludeFace && description.facialFeatures && `Features: ${description.facialFeatures}`,
        
        description.hairStyle && `Hair: ${description.hairStyle}`,
        description.bodyType && `Body: ${description.bodyType}`,
        description.personality && `Personality: ${description.personality}`,
        description.keyExpressions && `Expressions: ${description.keyExpressions}`,
    ].filter(Boolean);
    
    if (parts.length === 0) return "Standard subject";
    return parts.join(', ');
};

const buildCompositeInstruction = (allReferences: ReferenceImage[], characters: CharacterProfile[]) => {
  if (allReferences.length === 0) return "";

  const generalInstructions: string[] = [];
  const faceLockInstructions: string[] = [];
  const otherCharInstructions: string[] = [];
  
  const characterReferences: { [key: string]: ReferenceImage[] } = {};

  // Group references by character and handle non-character general refs
  allReferences.forEach(ref => {
    if (ref.characterId) {
      if (!characterReferences[ref.characterId]) {
        characterReferences[ref.characterId] = [];
      }
      characterReferences[ref.characterId].push(ref);
    } else {
      // Handle general, non-character-specific references
      const refIndex = allReferences.findIndex(r => r.id === ref.id);
      const id = `[REF_${refIndex + 1}]`;
      ref.roles.forEach(role => {
        // Exclude character-specific roles from general instructions
        if (!['Face', 'Body', 'Outfit'].includes(role)) {
            switch (role) {
                case 'Style': generalInstructions.push(`${id} >> STYLE: Match the color grading, film stock, and aesthetic.`); break;
                case 'Environment': generalInstructions.push(`${id} >> BACKGROUND: Replicate the setting and location elements.`); break;
                case 'Composition': generalInstructions.push(`${id} >> COMPOSITION: Use this image's camera angle, framing, and depth.`); break;
                case 'Frame': generalInstructions.push(`${id} >> COMPOSITION ANCHOR: Use this image as the structural blueprint.`); break;
                case 'Lighting': generalInstructions.push(`${id} >> LIGHTING: Replicate the lighting setup and mood.`); break;
                default: generalInstructions.push(`${id} >> GENERAL: Use as a general visual guide.`); break;
            }
        }
      });
    }
  });

  // Process character-specific references
  Object.keys(characterReferences).forEach(charId => {
    const char = characters.find(c => c.id === charId);
    if (!char) return;
    
    // SAFETY FIX: Append " Character" to the name to avoid safety filters
    const safeName = `${char.name} Character`;
    const charRefs = characterReferences[charId];
    
    // Find the primary face reference, or fall back to the first one
    let primaryFaceRef = charRefs.find(r => r.isPrimary && r.roles.includes('Face'));
    if (!primaryFaceRef) {
      primaryFaceRef = charRefs.find(r => r.roles.includes('Face'));
    }

    if (primaryFaceRef) {
        const refIndex = allReferences.findIndex(r => r.id === primaryFaceRef!.id);
        const id = `[REF_${refIndex + 1}]`;
        
        // AGGRESSIVE IDENTITY LOCK (Based on Grok/Community Best Practices)
        const strictLock = `
SUBJECT: ${safeName}
REFERENCE: ${id}
INSTRUCTION: The face of ${safeName} must be **100% IDENTICAL** in facial geometry, bone structure, eye shape, nose shape, and skin texture to the face in ${id}.
CRITICAL: Do NOT alter, stylize, beautify, reinterpret, generalize, or deviate in ANY way from the exact facial identity shown in ${id}.
PRIORITY: Facial identity accuracy is the HIGHEST priority — override scene, lighting, style, and artistic effects if necessary to preserve it exactly.
        `.trim();
        faceLockInstructions.push(strictLock);
    }
    
    // Process other roles for this character
    charRefs.forEach(ref => {
      const refIndex = allReferences.findIndex(r => r.id === ref.id);
      const id = `[REF_${refIndex + 1}]`;
      ref.roles.forEach(role => {
        if (role !== 'Face') { // Face is handled with priority above
          switch(role) {
            case 'Outfit': otherCharInstructions.push(`[OUTFIT for ${safeName}]: The character "${safeName}" must wear the clothes from ${id}.`); break;
            case 'Body': otherCharInstructions.push(`[BODY for ${safeName}]: The character "${safeName}" should have the body type and pose from ${id}.`); break;
          }
        }
      });
    });
  });

  let composite = "";
  
  if (faceLockInstructions.length > 0) {
      composite += `\n[MASTER DIRECTIVE: STRICT IDENTITY LOCK]\nUse the provided reference images as PERMANENT, LOCKED facial identities.\n${faceLockInstructions.join('\n\n')}\n`;
  }
  
  if (otherCharInstructions.length > 0) {
      composite += `\n[CHARACTER STYLING]\n${otherCharInstructions.join('\n')}\n`;
  }
  
  if (generalInstructions.length > 0) {
      composite += `\n[SCENE REFERENCES]\n${generalInstructions.join('\n')}\n`;
  }

  return composite;
};


// Public helper to preview the prompt without generating
export const constructScenePrompt = (
    prompt: string, 
    references: ReferenceImage[], 
    projectData: ProjectData
): string => {
    // 1. Explicitly find mentioned characters by name
    let charactersInScene = projectData.characters.filter(c => 
        new RegExp(`\\b${c.name}\\b`, 'i').test(prompt)
    );

    // 2. If no specific characters are named, check for generic terms
    if (charactersInScene.length === 0) {
        const genericTerms = ['character', 'person', 'subject', 'figure', 'man', 'woman', 'boy', 'girl'];
        const hasGenericTerm = genericTerms.some(term => new RegExp(`\\b${term}\\b`, 'i').test(prompt));

        // 3. If a generic term is found AND there's only one character in the project, assume it's them.
        if (hasGenericTerm && projectData.characters.length === 1) {
            charactersInScene = projectData.characters;
        }
    }

    const mentionedCharacterIds = new Set(charactersInScene.map(c => c.id));
    const isCharacterShot = charactersInScene.length > 0;

    // 4. Filter references based on characters in the scene
    const relevantReferences = isCharacterShot 
        ? references.filter(ref => !ref.characterId || mentionedCharacterIds.has(ref.characterId))
        : references.filter(ref => !ref.characterId); // Only general (style, env) refs for non-char shots

    // 5. Build the composite instructions ONLY with relevant characters and references
    const compositeRules = buildCompositeInstruction(relevantReferences, charactersInScene);

    // 6. Build DNA strings ONLY for characters in the scene
    const dna = charactersInScene.map(c => {
        const hasFaceRef = projectData.referenceImages.some(r => r.characterId === c.id && r.roles.includes('Face'));
        return `[${c.name} Character Details]: ${formatDnaString(c.description, hasFaceRef)}`;
    }).join("\n");

    // 7. Assemble the final prompt, conditionally including character sections
    const technicalBlock = projectData.technicalInstructions ? `\n[DIRECTOR NOTES]\n${projectData.technicalInstructions}\n` : "";
    const manifestoBlock = projectData.creativeContext ? `\n[CREATIVE MANIFESTO]\n${projectData.creativeContext}\n` : "";
    const styleBlock = `[VISUAL STYLE]\n${projectData.artStyle}`;

    // Only include character blocks if characters are supposed to be in the scene.
    if (isCharacterShot) {
        return `${manifestoBlock}
${compositeRules}

[SCENE ACTION]
${prompt}

[CHARACTER TRAITS (Secondary)]
${dna}

${technicalBlock}
${styleBlock}`;
    } else {
        // This is an environment-only shot. Omit all character-specific instructions.
        return `${manifestoBlock}
${compositeRules} 

[SCENE ACTION]
${prompt}

${technicalBlock}
${styleBlock}`;
    }
};

// --- API FUNCTIONS ---

export const streamChatResponse = async (
  fullHistory: Content[],
  apiKey?: string
) => {
  const finalKey = apiKey || process.env.API_KEY;
  if (!finalKey) throw new Error("API Key is missing.");
  const ai = new GoogleGenAI({ apiKey: finalKey });

  const response = await ai.models.generateContentStream({
    model: 'gemini-3-flash-preview',
    contents: fullHistory,
    config: { safetySettings: SAFETY_SETTINGS }
  });

  return response;
};

export const createDirectorPlan = async (data: ProjectData, apiKey?: string, onLog?: (msg: string, type: any) => void): Promise<DirectorPlan> => {
  onLog?.("Directing production plan...", 'info');
  const finalKey = apiKey || process.env.API_KEY;
  if (!finalKey) throw new Error("API Key is missing. Please add it in the Vault.");
  
  // Create a new instance right before use to ensure most up-to-date API key
  const ai = new GoogleGenAI({ apiKey: finalKey });
  
  const characterContext = data.characters.map(c => `[CHARACTER: ${c.name} Character]\nDNA: ${formatDnaString(c.description)}`).join('\n\n');
  const mode = data.generationMode || 'narrative';

  // Strict Auto-Calculation logic
  const targetCount = data.useAutoSceneCount 
      ? calculateTargetSceneCount(data.totalDuration, data.videoSegmentDuration) 
      : data.sceneCount;

  onLog?.(`Calculated ${targetCount} scenes for ${data.totalDuration} @ ${data.videoSegmentDuration}/clip`, 'info');

  const creativeManifesto = data.creativeContext ? `[CREATIVE MANIFESTO & SAFETY CONTEXT]:\n${data.creativeContext}\n` : "";
  const recurringMotifs = data.recurringMotifs ? `[RECURRING VISUAL SYMBOLS]:\nWeave these elements into multiple scenes: "${data.recurringMotifs}"\n` : "";

  const qualityManifesto = `
    [DIRECTOR'S PROTOCOL: "THE VISUAL BIBLE & CONTINUITY THREAD"]:
    You are not just listing scenes; you are building a connected film.
    
    1.  **VISUAL BIBLE (CRITICAL STEP):** Before generating the scene list, internally decide on the character's specific "Base Look" (e.g., "Neon pink bob cut, wearing a distressed oversized leather jacket over a silver slip dress").
    2.  **CONTINUITY ENFORCEMENT:** You MUST explicitly describe this "Base Look" in EVERY SINGLE image prompt where the character appears. Do NOT assume the AI remembers Scene 1 when generating Scene 5.
        -   *Bad:* "The character walks down the street." (What are they wearing? What street?)
        -   *Good:* "Subject1 Character, **wearing her signature distressed leather jacket and silver dress**, walks down the **rain-slicked Shibuya crossing (established in Scene 1)**."
    3.  **THREADING:** If Scene 2 follows Scene 1 directly, explicitly state "Continuing from the previous shot..." in the prompt description.
    4.  **LATENT ENERGY (For Video):** In 'videoMotionPrompt', describe PHYSICS and INTERACTION, not just camera movement.
        -   *Bad:* "Camera pans right."
        -   *Good:* "Camera pans right as wind whips the character's hair across her face and she pushes it back."
    
    [PRONOUN SAFETY RULE]: Refer to characters ONLY by their defined safe name (e.g. "${data.characters[0]?.name || 'The Character'} Character") or "the subject". NO he/she/him/her.
  `;

  let directorPrompt = "";

  if (mode === 'technical') {
      onLog?.("Using Technical Logic. Converting instructions directly to storyboard.", 'info');
      directorPrompt = `
      ROLE: Technical Script Supervisor.
      TASK: Convert the user's raw technical notes into a structured JSON storyboard using the highest cinematic standards.
      ${creativeManifesto}
      ${recurringMotifs}
      INPUT NOTES: "${data.technicalInstructions || 'No instructions provided.'}"
      CAST: ${characterContext}
      ${qualityManifesto}
      INSTRUCTIONS:
      1.  FIDELITY: Stick strictly to the user's provided notes for the CORE CONCEPT of each scene.
      2.  ENHANCEMENT: For each note, you MUST expand it into a fully detailed 'imagePrompt' and 'videoMotionPrompt' following the Continuity Protocol. 
      3.  STRUCTURE: Output exactly ${targetCount} scenes.
      4.  STYLE: Apply the global visual style: "${data.artStyle}".
      OUTPUT FORMAT: JSON with title, theme, colorPalette, and scenes.`;
  } else {
      onLog?.("Using Narrative Logic. Interpreting lyrics creatively.", 'info');
      directorPrompt = `
        ROLE: Professional Music Video Director (Persona: ${data.directorPersona}).
        TASK: Create a stunning visual narrative based on the provided Lyrics/Story.
        ${creativeManifesto}
        ${recurringMotifs}
        INPUT SPECS: Duration ${data.totalDuration}, Style ${data.artStyle}.
        LYRICS/SOURCE: "${data.lyrics || 'Narrative arc'}"
        CAST: ${characterContext}
        ${qualityManifesto}
        STRUCTURE INSTRUCTION: You MUST output exactly ${targetCount} scenes to cover the ${data.totalDuration} duration.
        CRITICAL: Ensure the "Base Look" of the character (defined by you based on the song's vibe) is repeated in every imagePrompt to ensure consistency.
        OUTPUT FORMAT: JSON with title, theme, colorPalette, and scenes.`;
  }

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: [{ text: directorPrompt }] },
        config: { 
            temperature: mode === 'technical' ? 0.3 : 0.8,
            responseMimeType: "application/json",
            safetySettings: SAFETY_SETTINGS,
            responseSchema: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                theme: { type: Type.STRING },
                colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } },
                scenes: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                    timestamp: { type: Type.STRING },
                    contentBeat: { type: Type.STRING },
                    concept: { type: Type.STRING },
                    imagePrompt: { type: Type.STRING },
                    videoMotionPrompt: { type: Type.STRING }
                    },
                    required: ["timestamp", "contentBeat", "concept", "imagePrompt", "videoMotionPrompt"]
                }
                }
            },
            required: ["title", "theme", "colorPalette", "scenes"]
            }
        }
    });
    
    const rawText = response.text || "{}";
    return JSON.parse(extractJSON(rawText));
  } catch (error: any) {
    let msg = error.message || String(error);
    if (msg.includes("429")) msg = QUOTA_ERROR_MESSAGE;
    else if (msg.includes("Failed to fetch")) msg = "Network Error. If in a restricted region (China/Russia/Iran), use a VPN.";
    throw new Error(msg);
  }
};

export const enhanceAndSanitizePrompt = async (
    originalPrompt: string,
    style: string,
    apiKey?: string
): Promise<string> => {
    const finalKey = apiKey || process.env.API_KEY;
    if (!finalKey) throw new Error("API Key is missing.");
    const ai = new GoogleGenAI({ apiKey: finalKey });

    const refinementInstruction = `
    ROLE: Expert Prompt Engineer and AI Safety Specialist.
    TASK: Enhance and sanitize the following user prompt for a high-end, safety-sensitive image AI (like Gemini).
    
    PRIMARY GOALS:
    1.  **ENHANCE FOR CLARITY:** Rewrite the prompt to be **direct, factual, and unambiguous**. Instead of poetic descriptions, use concrete, observable details. Add specific camera, lighting, and technical specifications.
    2.  **SANITIZE:** Proactively rewrite any terms that might trigger safety filters, while preserving the original artistic intent. Frame the scene in a safe, artistic context.

    ENHANCEMENT STYLE:
    - **DO:** Use technical terms (e.g., "35mm lens", "Rembrandt lighting", "sharp focus").
    - **DO:** Describe specific expressions and actions (e.g., "shouting with angry expression", "sarcastic smile showing teeth").
    - **DO NOT:** Use overly artistic or abstract language (e.g., "ethereal vibe", "curated aesthetic", "intimate moment"). Be literal.

    NUANCED SANITIZATION (CRITICAL):
    - **De-risk anatomical close-ups:** When a prompt combines "close-up," "profile," "neck," "jawline," and "shadows," it can be misconstrued. Rephrase to focus on artistic effect.
        - **Example IN:** "deep shadows highlighting the anatomical structure of the neck and jawline"
        - **Example OUT:** "high-contrast lighting that sculpts the facial features and jawline"
    - **Soften lighting terms:**
        - **"Deep shadows" ->** "dramatic contrast", "soft shadows", "chiaroscuro lighting"
        - **"Highlighting structure" ->** "sculpting features", "defining contours"

    BASIC SANITIZATION RULES:
    -   'blood' -> 'dark crimson liquid', 'theatrical red makeup', 'spilled red wine'
    -   'wound', 'injury' -> 'special effects makeup for a horror film', 'cinematic prosthetic'
    -   'fight', 'battle', 'war' -> 'dramatic theatrical performance', 'intense choreographed scene for a film'
    -   'gun', 'rifle', 'pistol' -> 'prop movie pistol', 'futuristic energy weapon', 'stylized toy gun'
    -   'nude', 'naked' -> 'artistic figure study in the style of Rembrandt', 'classical marble statue', 'anatomy sketch'
    
    CONTEXTUALIZE:
    -   Always ensure the prompt starts with a safe artistic frame, e.g., "A movie set still...", "An oil painting of...", "A cinematic shot for an action movie...".

    INSTRUCTIONS:
    -   Maintain the core visual concept of the original prompt.
    -   Incorporate the overall style: "${style}".
    -   Output ONLY the new, improved, and sanitized prompt paragraph. DO NOT add any conversational text, markdown, or explanations.

    ORIGINAL PROMPT: "${originalPrompt}"
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: refinementInstruction,
        });
        return response.text?.trim() || originalPrompt;
    } catch (error: any) {
        throw new Error(`Prompt enhancement failed: ${error.message}`);
    }
};

export const generateSceneImage = async (
  prompt: string,
  aspectRatio: AspectRatio,
  references: ReferenceImage[],
  projectData: ProjectData,
  apiKey?: string,
  seed?: number,
  onLog?: (msg: string, type: any) => void
): Promise<string> => {
  onLog?.("Rendering cinematic frame...", 'info');
  const finalKey = apiKey || process.env.API_KEY;
  if (!finalKey) throw new Error("API Key is missing. Please add it in the Vault.");

  // Create a new instance right before use to ensure most up-to-date API key
  const ai = new GoogleGenAI({ apiKey: finalKey });
  
  try {
      // Use the shared constructor logic so logs match reality
      const promptWithRefs = constructScenePrompt(prompt, references, projectData);
      
      // Diagnostic Logs
      onLog?.(`Constructed Prompt Length: ${promptWithRefs.length} chars.`, 'info');
      
      const parts: any[] = [{ text: promptWithRefs }];
      let refCount = 0;
      
      references.forEach(ref => {
        const match = ref.data.match(/^data:(.*?);base64,(.*)$/);
        if (match) {
            parts.push({ inlineData: { mimeType: match[1], data: match[2] } });
            refCount++;
        }
      });
      
      if (refCount > 0) onLog?.(`Attached ${refCount} reference images to prompt.`, 'info');

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts },
        config: {
          imageConfig: { aspectRatio: aspectRatio === '16:9' ? "16:9" : aspectRatio === '9:16' ? "9:16" : "1:1" },
          seed: seed,
          safetySettings: SAFETY_SETTINGS // Inject permissive safety
        }
      });

      const candidate = response.candidates?.[0];
      
      // IMPROVED ERROR HANDLING
      if (candidate?.finishReason && candidate.finishReason !== FinishReason.STOP) {
          const reason = candidate.finishReason;
          let friendlyMsg = `Generation Blocked (${reason}).`;
          
          if (reason === FinishReason.SAFETY) {
              friendlyMsg = "Safety Filter Triggered. Try using the 'Enhance & Sanitize' button, or use the Creative Context field to explain artistic intent.";
          } else if (reason === FinishReason.IMAGE_OTHER || reason === FinishReason.RECITATION || reason === FinishReason.OTHER) {
              friendlyMsg = "Content Policy Block. The model refused this prompt. Try using generic terms like 'The Character' instead of specific names (even neutral ones like 'Nova' or 'Eve').";
          }

          console.warn("Safety Block Response:", response);
          throw new Error(friendlyMsg);
      }

      const imagePart = candidate?.content?.parts.find(p => p.inlineData);
      
      if (!imagePart?.inlineData?.data) {
          console.error("Gemini Empty Response:", response);
          throw new Error("No image returned. The model might have silently blocked the request.");
      }

      onLog?.("Frame completed.", 'success');
      return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
  } catch (error: any) {
      let msg = error.message || String(error);
      if (msg.includes("429")) msg = QUOTA_ERROR_MESSAGE;
      else if (msg.includes("400")) msg = "Invalid Request (400). This often happens if you attach too many large reference images. Try removing some references.";
      else if (msg.includes("401") || msg.includes("403")) msg = "Auth Error (401/403). Check API Key.";
      else if (msg.includes("503") || msg.includes("500")) msg = "Server Error. Try again.";
      else if (msg.includes("Failed to fetch")) msg = "Network Error. Google API unreachable. Try a VPN if in a restricted region.";
      throw new Error(msg);
  }
};

export const generateSceneVideo = async (
  motionPrompt: string,
  imageUrl: string,
  aspectRatio: AspectRatio,
  apiKey?: string,
  onLog?: (msg: string, type: any) => void
): Promise<string> => {
  onLog?.("Initializing Video Generation (Veo)...", 'info');
  const finalKey = apiKey || process.env.API_KEY;
  if (!finalKey) throw new Error("API Key is missing.");

  // Create a new instance right before use to ensure most up-to-date API key
  const ai = new GoogleGenAI({ apiKey: finalKey });

  const match = imageUrl.match(/^data:(.*?);base64,(.*)$/);
  if (!match) throw new Error("Invalid source image.");
  const mimeType = match[1];
  const imageBytes = match[2];

  try {
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: motionPrompt,
        image: { imageBytes, mimeType },
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: aspectRatio === '16:9' ? '16:9' : '9:16',
        }
      });

      onLog?.("Video request sent. Queued...", 'info');

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        onLog?.("Rendering video frames...", 'info');
        operation = await ai.operations.getVideosOperation({operation: operation});
      }
      
      if (operation.error) throw new Error(`Veo Error: ${operation.error.message}`);

      const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!videoUri) throw new Error("Video generation failed: No URI returned.");

      onLog?.("Video completed.", 'success');
      return `${videoUri}&key=${finalKey}`;
  } catch (error: any) {
      let msg = error.message || String(error);
      if (msg.includes("429")) msg = QUOTA_ERROR_MESSAGE;
      else if (msg.includes("Failed to fetch")) msg = "Network Error. Veo API unreachable. Try a VPN if in a restricted region.";
      throw new Error(msg);
  }
};

export const generateSpeech = async (
    text: string,
    voice: VoiceName,
    apiKey?: string,
    onLog?: (msg: string, type: any) => void
): Promise<string> => {
    onLog?.("Synthesizing audio...", 'info');
    const finalKey = apiKey || process.env.API_KEY;
    if (!finalKey) throw new Error("API Key is missing.");

    // Create a new instance right before use to ensure most up-to-date API key
    const ai = new GoogleGenAI({ apiKey: finalKey });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                // Must be an array with a single Modality.AUDIO element.
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: voice },
                    },
                },
            },
        });

        const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!audioData) throw new Error("No audio data returned.");

        // Convert PCM to WAV for browser playback
        const pcmData = base64ToUint8Array(audioData);
        // Gemini TTS output is 24kHz, Mono, 16-bit PCM (usually)
        const wavHeader = createWavHeader(24000, 1, 16, pcmData.length);
        
        // Combine Header + PCM
        const wavBytes = new Uint8Array(wavHeader.byteLength + pcmData.byteLength);
        wavBytes.set(new Uint8Array(wavHeader), 0);
        wavBytes.set(pcmData, wavHeader.byteLength);

        const blob = new Blob([wavBytes], { type: 'audio/wav' });
        onLog?.("Audio generated successfully.", 'success');
        return URL.createObjectURL(blob);
    } catch (error: any) {
        let msg = error.message || String(error);
        if (msg.includes("429")) msg = QUOTA_ERROR_MESSAGE;
        else if (msg.includes("Failed to fetch")) msg = "Network Error. TTS API unreachable. Try a VPN if in a restricted region.";
        throw new Error(msg);
    }
};

export const extractCharacterDNA = async (
    base64Data: string,
    apiKey?: string
): Promise<CharacterProfile['description']> => {
    const finalKey = apiKey || process.env.API_KEY;
    if (!finalKey) throw new Error("API Key required for DNA analysis");

    const ai = new GoogleGenAI({ apiKey: finalKey });
    const match = base64Data.match(/^data:(.*?);base64,(.*)$/);
    if (!match) throw new Error("Invalid image data for DNA analysis");

    const prompt = `Analyze the most prominent person in this image. Extract their visual DNA into a JSON object. Be clinical and highly descriptive. Focus on stable visual traits. Infer personality from expression and context.

- facialFeatures: Describe bone structure, eye shape, nose, mouth, and any unique features like scars or moles.
- hairStyle: Describe color, texture, length, and style.
- bodyType: Describe build, height estimation, and posture.
- personality: Infer a personality type based on their expression, attire, and the overall context of the image.
- keyExpressions: List potential expressions this person might show, e.g., 'thoughtful, determined, slight smile'.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: {
                parts: [
                    { inlineData: { mimeType: match[1], data: match[2] } },
                    { text: prompt }
                ]
            },
            config: {
                temperature: 0.2,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        facialFeatures: { type: Type.STRING },
                        hairStyle: { type: Type.STRING },
                        bodyType: { type: Type.STRING },
                        personality: { type: Type.STRING },
                        keyExpressions: { type: Type.STRING }
                    },
                    required: ["facialFeatures", "hairStyle", "bodyType", "personality", "keyExpressions"]
                }
            }
        });

        const rawJSON = response.text || "{}";
        return JSON.parse(extractJSON(rawJSON));
    } catch (e: any) {
        throw new Error(`DNA Analysis Failed: ${e.message}`);
    }
};

// FIX: Implement and export transformSceneWithCharacters
export const transformSceneWithCharacters = async (
    analysis: VisionStructData,
    mappings: { [key: string]: string },
    characters: CharacterProfile[],
    apiKey?: string,
): Promise<string> => {
    const finalKey = apiKey || process.env.API_KEY;
    if (!finalKey) throw new Error("API Key required for transplant");

    const ai = new GoogleGenAI({ apiKey: finalKey });

    const mappedCharacters = Object.entries(mappings)
        .map(([personId, characterId]) => {
            const character = characters.find(c => c.id === characterId);
            const person = analysis.objects.find(o => o.id === personId);
            if (!character || !person) return null;
            // SAFETY FIX: Use the safe name in the transplant prompt
            return `- Replace person described as "${person.label}" (ID: ${personId}) with the character "${character.name} Character".\n  - ${character.name} Character's DNA: ${formatDnaString(character.description)}`;
        })
        .filter(Boolean)
        .join('\n');

    if (!mappedCharacters) {
        throw new Error("No valid character mappings provided for transplant.");
    }

    const transplantPrompt = `
    You are not analyzing an image. You are transforming an existing scene-analysis JSON into a new image-generation TEXT PROMPT.

    **SOURCE SCENE ANALYSIS:**
    \`\`\`json
    ${JSON.stringify(analysis, null, 2)}
    \`\`\`

    **TRANSFORMATION RULES:**
    1.  **PRESERVE:** You MUST preserve the following from the source JSON: 'composition', 'global_context', 'lighting', 'camera_angle', 'background architecture', and 'color_palette'. Do NOT re-analyze the environment or change the framing.
    2.  **REPLACE:** You must replace all 'Person' category objects with the new characters defined below.
    3.  **INSERT:** Create a new, single-paragraph image prompt that describes the preserved scene but with the following characters inserted. The new characters should adopt the pose and location of the person they are replacing.

    **CHARACTER MAPPING:**
    ${mappedCharacters}
    
    **OUTPUT:**
    Return ONLY the final, rewritten, generation-ready text prompt paragraph. Do not include markdown, conversational text, or any other explanations.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: transplantPrompt,
        });
        return response.text?.trim() || "Failed to generate new prompt.";
    } catch (error: any) {
        throw new Error(`Scene transplant failed: ${error.message}`);
    }
};

// --- ANALYSIS ENGINES (DEFAULT, FACE, BODY) ---

const VISION_STRUCT_SYSTEM_PROMPT = `
ROLE & OBJECTIVE: You are VisionStruct, an advanced Computer Vision & Data Serialization Engine. Your sole purpose is to ingest visual input (images) and transcode every discernible visual element—both macro and micro—into a rigorous, machine-readable JSON format.
CORE DIRECTIVE: Do not summarize. Capture 100% of the visual data. If a detail exists in pixels, it must exist in your JSON output. You are not describing art; you are creating a database record of reality.
CRITICAL CONSTRAINTS: Note extreme micro-details (scratches, dust, fabric folds). Use null for non-applicable fields.
OUTPUT FORMAT (STRICT): You must return ONLY a single valid JSON object.
`;

const FACE_ANALYSIS_PROMPT = `
ROLE & OBJECTIVE: You are a forensic character artist. Analyze the provided image, focusing exclusively on the most prominent human face. Deconstruct its features with extreme detail into a JSON format.
CORE DIRECTIVE: Ignore the background, clothing, and overall scene. Your entire focus is a clinical, granular breakdown of the facial structure and features.
CRITICAL CONSTRAINTS: Capture subtle details like skin pores, individual hair strands, and light reflection on the cornea.
OUTPUT FORMAT (STRICT): You must return ONLY a single valid JSON object.
`;

const BODY_ANALYSIS_PROMPT = `
ROLE & OBJECTIVE: You are a fashion and kinesiology expert. Analyze the provided image, focusing exclusively on the human subject's body, pose, and clothing. Deconstruct the posture, limb positions, and every layer of clothing with extreme detail into a JSON format.
CORE DIRECTIVE: Ignore specific facial details and the background environment. Your focus is a clinical breakdown of the physical form and attire.
CRITICAL CONSTRAINTS: Describe fabric folds, material textures, and layering precisely. Define pose using clear directional language.
OUTPUT FORMAT (STRICT): You must return ONLY a single valid JSON object.
`;

// Schemas
const visionStructSchema = {
    type: Type.OBJECT,
    properties: {
        meta: { type: Type.OBJECT, properties: { image_quality: { type: Type.STRING }, image_type: { type: Type.STRING }, resolution_estimation: { type: Type.STRING }}},
        global_context: { type: Type.OBJECT, properties: { scene_description: { type: Type.STRING }, time_of_day: { type: Type.STRING }, weather_atmosphere: { type: Type.STRING }, lighting: { type: Type.OBJECT, properties: { source: { type: Type.STRING }, direction: { type: Type.STRING }, quality: { type: Type.STRING }, color_temp: { type: Type.STRING } } } } },
        color_palette: { type: Type.OBJECT, properties: { dominant_hex_estimates: { type: Type.ARRAY, items: { type: Type.STRING } }, accent_colors: { type: Type.ARRAY, items: { type: Type.STRING } }, contrast_level: { type: Type.STRING } } },
        composition: { type: Type.OBJECT, properties: { camera_angle: { type: Type.STRING }, framing: { type: Type.STRING }, depth_of_field: { type: Type.STRING }, focal_point: { type: Type.STRING } } },
        objects: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, label: { type: Type.STRING }, category: { type: Type.STRING }, location: { type: Type.STRING }, prominence: { type: Type.STRING }, visual_attributes: { type: Type.OBJECT, properties: { color: { type: Type.STRING }, texture: { type: Type.STRING }, material: { type: Type.STRING }, state: { type: Type.STRING }, dimensions_relative: { type: Type.STRING } } }, micro_details: { type: Type.ARRAY, items: { type: Type.STRING } }, pose_or_orientation: { type: Type.STRING }, text_content: { type: Type.STRING, nullable: true } } } },
        text_ocr: { type: Type.OBJECT, properties: { present: { type: Type.BOOLEAN }, content: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { text: { type: Type.STRING }, location: { type: Type.STRING }, font_style: { type: Type.STRING }, legibility: { type: Type.STRING } } } } } },
        semantic_relationships: { type: Type.ARRAY, items: { type: Type.STRING } }
    }
};
const faceAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        face_shape: { type: Type.STRING },
        skin: { type: Type.OBJECT, properties: { tone: { type: Type.STRING }, texture: { type: Type.STRING }, imperfections: { type: Type.ARRAY, items: { type: Type.STRING } } } },
        eyes: { type: Type.OBJECT, properties: { color: { type: Type.STRING }, shape: { type: Type.STRING }, eyebrows: { type: Type.STRING }, eyelashes: { type: Type.STRING } } },
        nose: { type: Type.OBJECT, properties: { shape: { type: Type.STRING }, bridge: { type: Type.STRING } } },
        mouth: { type: Type.OBJECT, properties: { lips_shape: { type: Type.STRING }, expression: { type: Type.STRING } } },
        hair: { type: Type.OBJECT, properties: { color: { type: Type.STRING }, style: { type: Type.STRING }, texture: { type: Type.STRING }, length: { type: Type.STRING } } },
        facial_hair: { type: Type.STRING, nullable: true },
        key_features: { type: Type.ARRAY, items: { type: Type.STRING } }
    }
};
const bodyAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        pose_description: { type: Type.STRING },
        body_type: { type: Type.STRING },
        clothing: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { layer: { type: Type.STRING }, item_name: { type: Type.STRING }, color: { type: Type.STRING }, material: { type: Type.STRING }, fit: { type: Type.STRING }, patterns: { type: Type.ARRAY, items: { type: Type.STRING } }, details: { type: Type.ARRAY, items: { type: Type.STRING } } } } },
        accessories: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { item_name: { type: Type.STRING }, location: { type: Type.STRING }, material: { type: Type.STRING } } } }
    }
};

export const analyzeSceneStructure = async (base64Data: string, focus: AnalysisFocus, apiKey?: string): Promise<VisionStructData | FaceAnalysisData | BodyAnalysisData> => {
    const finalKey = apiKey || process.env.API_KEY;
    if (!finalKey) throw new Error("API Key required for analysis");
  
    const ai = new GoogleGenAI({ apiKey: finalKey });
    const match = base64Data.match(/^data:(.*?);base64,(.*)$/);
    if (!match) throw new Error("Invalid image data");

    let systemInstruction = VISION_STRUCT_SYSTEM_PROMPT;
    let responseSchema: any = visionStructSchema;

    switch (focus) {
        case 'face':
            systemInstruction = FACE_ANALYSIS_PROMPT;
            responseSchema = faceAnalysisSchema;
            break;
        case 'body':
            systemInstruction = BODY_ANALYSIS_PROMPT;
            responseSchema = bodyAnalysisSchema;
            break;
        default:
            // Use default values
            break;
    }
  
    let rawJSON = "{}";
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: { 
                parts: [
                    { inlineData: { mimeType: match[1], data: match[2] } }
                ] 
            },
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema,
            }
        });

        // FIX: Use extractJSON for robust parsing, consistent with createDirectorPlan.
        // This avoids potential issues if the model wraps the JSON in markdown backticks.
        rawJSON = response.text || "{}";
        const result = JSON.parse(extractJSON(rawJSON));
        result.analysisType = focus; // Add discriminator for frontend
        return result;
    } catch (e: any) {
        let errMsg = e.message || String(e);
        if (e instanceof SyntaxError) {
             errMsg = `Failed to parse model's JSON response. This may be a temporary model issue. Raw output: ${rawJSON}`;
        }
        throw new Error(`VisionStruct Analysis Failed: ${errMsg}`);
    }
};
