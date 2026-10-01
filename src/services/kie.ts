export interface SunoCoverOptions {
    uploadUrl: string;
    prompt: string;
    style: string;
    title: string;
    apiKey: string;
    addLog?: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
    onStatus?: (msg: string) => void;
    onTaskId?: (taskId: string) => void;
    
    // Additional parameters
    negativeTags?: string;
    vocalGender?: string;
    styleWeight?: number;
    weirdnessConstraint?: number;
    audioWeight?: number;
    personaId?: string;
    personaModel?: string;
}

export const checkSunoTaskStatus = async (taskId: string, apiKey: string): Promise<{name: string, url: string}[]> => {
    const pollRes = await fetch(`https://api.kie.ai/api/v1/generate/record-info?taskId=${taskId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${apiKey}`
        }
    });

    if (!pollRes.ok) {
        throw new Error(`Kie AI Polling Error: ${pollRes.status}`);
    }

    const pollData = await pollRes.json();
    
    if (pollData.code === 200 && pollData.data) {
        const status = pollData.data.status;
        if (status === "SUCCESS") {
            const sunoData = pollData.data.response?.sunoData;
            if (sunoData && sunoData.length > 0) {
                const tracks = sunoData.filter((track: any) => track.audioUrl).map((track: any, index: number) => {
                    const audioId = track.id || track.audioId || 'unknown';
                    return {
                        name: `[${audioId}] ` + (track.title || `Recovered Track ${index + 1}`),
                        url: track.audioUrl
                    };
                });
                if (tracks.length > 0) return tracks;
            } else if (pollData.data.audioUrl) {
                 return [{ name: "Recovered Audio", url: pollData.data.audioUrl }];
            }
            throw new Error("Task succeeded but no audio URL was found.");
        } else if (status === "FAILED") {
            throw new Error("Generation failed: " + (pollData.data.errorMessage || 'Unknown error'));
        } else {
            throw new Error(`Task is still processing. Current status: ${status}`);
        }
    }
    
    throw new Error(`Invalid response from Kie AI: ${pollData.msg}`);
};

export interface KieImageOptions {
    prompt: string;
    model?: string; // e.g. "google/nano-banana", "google/nano-banana-2", "google/nano-banana-pro", "google/nano-banana-2-lite", "google/nano-banana-edit"
    aspectRatio?: string;
    apiKey: string;
    referenceImageUrls?: string[];
    addLog?: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const generateKieImage = async (options: KieImageOptions): Promise<string> => {
    const rawModel = options.model?.replace(/^kie:/, '') || 'google/nano-banana';
    const cleanModel = rawModel.includes('nano-banana') ? rawModel : 'google/nano-banana';
    
    options.addLog?.(`Connecting to Kie AI (${cleanModel})...`, 'info');

    // Prepare aspect ratio mapping
    let ar = options.aspectRatio || '16:9';
    if (ar === '2.35:1' || ar === '21:9') ar = '16:9';
    if (ar === '9:16' || ar === '8:15') ar = '9:16';

    const reqBody: any = {
        model: cleanModel,
        input: {
            prompt: options.prompt,
            aspect_ratio: ar,
            aspectRatio: ar,
        }
    };

    if (options.referenceImageUrls && options.referenceImageUrls.length > 0) {
        reqBody.input.image = options.referenceImageUrls[0];
        reqBody.input.images = options.referenceImageUrls;
    }

    const res = await fetch("https://api.kie.ai/api/v1/jobs/createTask", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${options.apiKey}`
        },
        body: JSON.stringify(reqBody)
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Kie AI Image API Error: ${res.status} ${err}`);
    }

    const data = await res.json();
    if (data.code !== 200 && data.code !== 0 && !data.data?.taskId) {
        throw new Error(`Kie AI Image Error: ${data.msg || data.message || 'Unknown error'}`);
    }

    const taskId = data.data?.taskId || data.data?.task_id || data.taskId || data.id;
    if (!taskId) {
        const directUrl = data.data?.url || data.data?.imageUrl || data.data?.images?.[0];
        if (directUrl) return directUrl;
        throw new Error("Kie AI did not return a task ID or image URL.");
    }

    options.addLog?.(`Kie AI image task created (ID: ${taskId}). Rendering...`, 'info');

    let attempts = 0;
    while (attempts < 60) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        attempts++;

        try {
            const pollRes = await fetch(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${options.apiKey}`
                }
            });

            if (!pollRes.ok) {
                const altRes = await fetch(`https://api.kie.ai/api/v1/generate/record-info?taskId=${taskId}`, {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${options.apiKey}` }
                });
                if (!altRes.ok) continue;
                const altData = await altRes.json();
                if (altData.code === 200 && altData.data) {
                    const status = (altData.data.status || altData.data.state || '').toUpperCase();
                    if (status === 'SUCCESS' || status === 'COMPLETED') {
                        const imgUrl = altData.data.response?.images?.[0] || altData.data.imageUrl || altData.data.url || altData.data.result?.images?.[0];
                        if (imgUrl) return imgUrl;
                    } else if (status === 'FAILED' || status === 'FAIL') {
                        throw new Error(`Kie AI image generation failed: ${altData.data.errorMessage || altData.msg || 'Unknown error'}`);
                    }
                }
                continue;
            }

            const pollData = await pollRes.json();
            if ((pollData.code === 200 || pollData.code === 0) && pollData.data) {
                const status = (pollData.data.status || pollData.data.state || '').toUpperCase();
                if (status === 'SUCCESS' || status === 'COMPLETED') {
                    const imgUrl = 
                        pollData.data.result?.images?.[0] || 
                        pollData.data.response?.images?.[0] || 
                        pollData.data.result?.image || 
                        pollData.data.imageUrl || 
                        pollData.data.url ||
                        pollData.data.output?.[0];
                    if (imgUrl) {
                        options.addLog?.("Kie AI image generated successfully!", 'success');
                        return imgUrl;
                    }
                    throw new Error("Task succeeded but no image URL was found in response.");
                } else if (status === 'FAILED' || status === 'FAIL') {
                    throw new Error(`Kie AI image generation failed: ${pollData.data.errorMessage || pollData.data.error || pollData.msg || 'Server error'}`);
                } else {
                    if (attempts % 4 === 0) {
                        options.addLog?.(`Kie AI rendering in progress (${status.toLowerCase()})...`, 'info');
                    }
                }
            }
        } catch (pollErr: any) {
            if (pollErr.message?.includes('generation failed')) throw pollErr;
            console.warn("Polling Kie image task warning:", pollErr);
        }
    }

    throw new Error("Kie AI image generation timed out after 3 minutes.");
};

export const generateSunoCover = async (options: SunoCoverOptions): Promise<{name: string, url: string}[]> => {
    let finalUploadUrl = options.uploadUrl;

    if (options.uploadUrl.startsWith('blob:')) {
        throw new Error("Kie AI requires a public audio URL to generate a cover. Please provide a YouTube link or a direct public link to the audio file instead of a local file.");
    }
    
    options.onStatus?.("Connecting to Kie AI Suno Cover API...");
    options.addLog?.("Connecting to Kie AI Suno Cover API...", "info");
    
    const reqBody: any = {
        uploadUrl: finalUploadUrl,
        prompt: options.prompt,
        customMode: true,
        instrumental: false,
        model: "V5_5",
        callBackUrl: "https://example.com/callback", // Dummy callback
        style: options.style,
        title: options.title
    };

    if (options.negativeTags) reqBody.negativeTags = options.negativeTags;
    if (options.vocalGender) reqBody.vocalGender = options.vocalGender;
    if (options.styleWeight !== undefined) reqBody.styleWeight = options.styleWeight;
    if (options.weirdnessConstraint !== undefined) reqBody.weirdnessConstraint = options.weirdnessConstraint;
    if (options.audioWeight !== undefined) reqBody.audioWeight = options.audioWeight;
    if (options.personaId) reqBody.personaId = options.personaId;
    if (options.personaModel) reqBody.personaModel = options.personaModel;

    const res = await fetch("https://api.kie.ai/api/v1/generate/upload-cover", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${options.apiKey}`
        },
        body: JSON.stringify(reqBody)
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Kie AI API Error: ${res.status} ${err}`);
    }

    const data = await res.json();
    if (data.code !== 200) {
        throw new Error(`Kie AI API Error: ${data.msg}`);
    }

    const taskId = data.data.taskId;
    
    if (options.onTaskId) {
        options.onTaskId(taskId);
    }
    
    const pollingMsg = `Cover task created (ID: ${taskId}). Polling for results...`;
    options.addLog?.(pollingMsg, "info");
    options.onStatus?.(pollingMsg);
    
    // Poll the status
    let attempts = 0;
    while (attempts < 60) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        attempts++;
        
        let apiError: Error | null = null;
        try {
            const pollRes = await fetch(`https://api.kie.ai/api/v1/generate/record-info?taskId=${taskId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${options.apiKey}`
                }
            });
            if (!pollRes.ok) continue;
            
            const pollData = await pollRes.json();
            
            if (pollData.code === 200 && pollData.data) {
                const status = pollData.data.status;
                if (status === "SUCCESS") {
                    // Extract audio URL
                    const sunoData = pollData.data.response?.sunoData;
                    if (sunoData && sunoData.length > 0) {
                        return sunoData.filter((track: any) => track.audioUrl).map((track: any, index: number) => {
                            const audioId = track.id || track.audioId || 'unknown';
                            return {
                                name: `[${audioId}] ` + (track.title || `${options.title} (Track ${index + 1})`),
                                url: track.audioUrl
                            };
                        });
                    } else if (pollData.data.audioUrl) {
                         return [{ name: options.title, url: pollData.data.audioUrl }];
                    }
                    apiError = new Error("Generation succeeded but no audio URL found.");
                } else if (status === "FAILED") {
                    apiError = new Error("Generation failed on Kie AI servers: " + (pollData.data.errorMessage || 'Unknown error'));
                } else {
                    const waitMsg = `Task status: ${status}. Waiting...`;
                    options.addLog?.(waitMsg, "info");
                    options.onStatus?.(waitMsg);
                }
            }

        } catch (e: any) {
            console.warn("Polling error:", e);
        }
        
        if (apiError) {
            throw apiError;
        }
    }

    throw new Error("Polling timeout after 5 minutes.");
};
