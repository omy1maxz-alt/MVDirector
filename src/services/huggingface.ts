// Hugging Face Inference Service
// Uses the Serverless Inference API (Free Tier compatible)

const HF_API_URL = "https://api-inference.huggingface.co/models";

// Models Configuration
export const HF_IMAGE_MODELS = [
    { id: "stabilityai/stable-diffusion-xl-base-1.0", name: "Stable Diffusion XL (Fast)", label: "SDXL (Recommended)" },
    { id: "tencent/HunyuanImage-3.0-Instruct", name: "Tencent Hunyuan 3.0 (High Quality)", label: "Hunyuan 3.0 (Beta)" }
];

const MUSIC_MODEL = "facebook/musicgen-small";

const NEGATIVE_PROMPT = "blurry, low quality, distorted, deformed, ugly, bad anatomy, pixelated, watermark, text, signature, bad hands, extra limbs";

// Helper to wait
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const generateMusicHF = async (prompt: string, apiKey: string, onLog?: (msg: string, type: any) => void): Promise<string> => {
    if (!apiKey) throw new Error("Hugging Face API Token is missing.");
    if (!apiKey.startsWith("hf_")) throw new Error("Invalid Token. HF tokens must start with 'hf_'.");
    
    onLog?.(`Composing music with ${MUSIC_MODEL}...`, 'info');

    return executeHFRequest(
        MUSIC_MODEL, 
        { inputs: prompt }, 
        apiKey
    );
};

export const generateImageHF = async (
    prompt: string, 
    aspectRatio: string, 
    apiKey: string, 
    model: string = HF_IMAGE_MODELS[0].id, 
    onLog?: (msg: string, type: any) => void
): Promise<string> => {
    if (!apiKey) throw new Error("Hugging Face API Token is missing.");
    if (!apiKey.startsWith("hf_")) throw new Error("Invalid Token. HF tokens must start with 'hf_'.");

    const modelConfig = HF_IMAGE_MODELS.find(m => m.id === model);
    const modelName = modelConfig?.label || "Custom Model";
    
    onLog?.(`Generating image with ${modelName}...`, 'info');

    // Build Payload
    // CRITICAL FIX: Hunyuan on Free Tier fails if 'parameters' object is present or malformed.
    // We only send advanced parameters to SDXL which we know supports them.
    let payload: any = { inputs: prompt };

    if (model.includes("stable-diffusion")) {
        payload.parameters = {
            negative_prompt: NEGATIVE_PROMPT,
            num_inference_steps: 25, 
            guidance_scale: 7.5,
            width: 1024, 
            height: 1024
        };
    }

    return executeHFRequest(model, payload, apiKey);
};

// --- Core Request Handler with Retry Logic ---

const executeHFRequest = async (model: string, payload: any, apiKey: string): Promise<string> => {
    // CACHE BUSTER: Add timestamp to URL to prevent browser from caching failed CORS states
    const url = `${HF_API_URL}/${model}?t=${Date.now()}`;
    
    // Attempt 1: Standard Request with Cold Boot Header
    try {
        const blob = await fetchWithRetry(url, payload, apiKey, true);
        return URL.createObjectURL(blob);
    } catch (error: any) {
        // Attempt 2: Fallback (No custom headers, simple request) if first failed due to Network/CORS
        if (error.message.includes("Network") || error.message.includes("fetch") || error.message.includes("Connection")) {
            console.warn("HF: Retrying with simplified headers...");
            try {
                // On retry, ensure we aren't sending headers that trigger preflight blocks
                const blob = await fetchWithRetry(url, payload, apiKey, false);
                return URL.createObjectURL(blob);
            } catch (retryError: any) {
                if (model.includes("Hunyuan")) {
                     throw new Error("Hunyuan 3.0 is overloaded. Please switch to 'SDXL'. If that fails, try a VPN or disable AdBlock.");
                }
                throw new Error("Connection Blocked. 1. Disable AdBlock (Common). 2. If in China/Russia, use VPN.");
            }
        }
        throw error;
    }
};

const fetchWithRetry = async (url: string, payload: any, apiKey: string, useWaitHeader: boolean): Promise<Blob> => {
    const headers: any = {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
    };

    // x-wait-for-model is great for cold boots, but sometimes triggers CORS errors in strict browsers
    if (useWaitHeader) {
        headers["x-wait-for-model"] = "true";
    }

    const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errText = await response.text();
        handleHfError(response.status, errText, url);
    }

    return await response.blob();
};

// --- Error Handling Helpers ---

const handleHfError = (status: number, errText: string, url: string) => {
    let errMsg = errText;
    try {
        const json = JSON.parse(errText);
        errMsg = json.error || json.message || errText;
    } catch (e) {}

    const modelId = url.split('/').pop()?.split('?')[0]; // Clean query params from ID

    if (status === 403 || status === 401) {
        throw new Error(`Access Denied (${status}). 1. Check API Key. 2. Accept Terms at https://huggingface.co/${modelId}`);
    }
    
    if (status === 503) {
         throw new Error(`Model ${modelId} is loading (503). Wait 30s and try again.`);
    }

    if (status === 500) {
        throw new Error(`Model ${modelId} crashed. Try switching to SDXL.`);
    }
    
    throw new Error(`HF Error ${status}: ${errMsg}`);
};

const cleanHfError = (msg: string): string => {
    if (msg.includes("Failed to fetch")) return "Network Error. Likely CORS or Connection dropped. Retrying might work.";
    return msg;
};