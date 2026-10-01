export interface SunoCoverOptions {
    uploadUrl?: string;
    prompt: string;
    style: string;
    title: string;
    apiKey: string;
    model?: string; // 'V6' | 'V6_WILD' | 'V6_MINI' | 'V5_5' | 'V5' | 'V4' | 'V3_5'
    instrumental?: boolean;
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
    // Try both modern jobs/recordInfo and generate/record-info endpoints
    let pollData: any = null;

    try {
        const res = await fetch(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${apiKey}` }
        });
        if (res.ok) {
            pollData = await res.json();
        }
    } catch {
        // Ignore and fallback
    }

    if (!pollData || (pollData.code !== 200 && pollData.code !== 0)) {
        const altRes = await fetch(`https://api.kie.ai/api/v1/generate/record-info?taskId=${taskId}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${apiKey}` }
        });
        if (!altRes.ok) {
            throw new Error(`Kie AI Polling Error: ${altRes.status}`);
        }
        pollData = await altRes.json();
    }
    
    if ((pollData.code === 200 || pollData.code === 0) && pollData.data) {
        const status = (pollData.data.status || pollData.data.state || '').toUpperCase();
        if (status === "SUCCESS" || status === "COMPLETED") {
            const sunoData = pollData.data.response?.sunoData || pollData.data.result?.sunoData || pollData.data.sunoData;
            if (sunoData && sunoData.length > 0) {
                const tracks = sunoData.filter((track: any) => track.audioUrl || track.audio_url || track.url).map((track: any, index: number) => {
                    const audioId = track.id || track.audioId || track.audio_id || 'unknown';
                    const trackUrl = track.audioUrl || track.audio_url || track.url;
                    return {
                        name: `[${audioId}] ` + (track.title || `Recovered Track ${index + 1}`),
                        url: trackUrl
                    };
                });
                if (tracks.length > 0) return tracks;
            } else if (pollData.data.audioUrl || pollData.data.audio_url || pollData.data.url) {
                const directUrl = pollData.data.audioUrl || pollData.data.audio_url || pollData.data.url;
                return [{ name: "Recovered Audio Track", url: directUrl }];
            }
            throw new Error("Task succeeded but no audio URL was found.");
        } else if (status === "FAILED" || status === "FAIL") {
            throw new Error("Generation failed: " + (pollData.data.errorMessage || pollData.data.error || 'Unknown error'));
        } else {
            throw new Error(`Task is still processing. Current status: ${status}`);
        }
    }
    
    throw new Error(`Invalid response from Kie AI: ${pollData?.msg || pollData?.message || 'Unknown error'}`);
};

export const generateSunoCoverArt = async (taskId: string, apiKey: string, addLog?: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void): Promise<string[]> => {
    addLog?.(`Requesting Suno AI Cover Art for task ${taskId}...`, 'info');

    const res = await fetch("https://api.kie.ai/api/v1/jobs/createTask", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "ai-music-api/cover-generate",
            input: {
                taskId: taskId,
                callBackUrl: "https://example.com/callback"
            }
        })
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Cover Art Request Error: ${res.status} ${err}`);
    }

    const data = await res.json();
    const coverTaskId = data.data?.taskId || data.data?.task_id || data.taskId || data.id;
    if (!coverTaskId) {
        throw new Error("Could not create cover art task.");
    }

    addLog?.(`Cover art task created (ID: ${coverTaskId}). Rendering artwork...`, 'info');

    let attempts = 0;
    while (attempts < 40) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        attempts++;

        try {
            const pollRes = await fetch(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${coverTaskId}`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${apiKey}` }
            });

            if (pollRes.ok) {
                const pollData = await pollRes.json();
                if ((pollData.code === 200 || pollData.code === 0) && pollData.data) {
                    const status = (pollData.data.status || pollData.data.state || '').toUpperCase();
                    if (status === 'SUCCESS' || status === 'COMPLETED') {
                        const images = pollData.data.result?.images || pollData.data.response?.images || [pollData.data.imageUrl || pollData.data.url].filter(Boolean);
                        if (images && images.length > 0) {
                            addLog?.("Suno Cover Art generated successfully!", 'success');
                            return images;
                        }
                    } else if (status === 'FAILED' || status === 'FAIL') {
                        throw new Error(`Cover art generation failed: ${pollData.data.errorMessage || 'Server error'}`);
                    }
                }
            }
        } catch (e: any) {
            if (e.message?.includes('generation failed')) throw e;
        }
    }

    throw new Error("Cover art generation timed out.");
};

export interface KieImageOptions {
    prompt: string;
    model?: string;
    aspectRatio?: string;
    apiKey: string;
    referenceImageUrls?: string[];
    addLog?: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const generateKieImage = async (options: KieImageOptions): Promise<string> => {
    const rawModel = options.model?.replace(/^kie:/, '') || 'google/nano-banana';
    const cleanModel = rawModel.includes('nano-banana') ? rawModel : 'google/nano-banana';
    
    options.addLog?.(`Connecting to Kie AI (${cleanModel})...`, 'info');

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
                headers: { "Authorization": `Bearer ${options.apiKey}` }
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
    const isCoverMode = Boolean(options.uploadUrl && !options.uploadUrl.startsWith('blob:'));
    const selectedModel = options.model || "V6";

    options.onStatus?.(isCoverMode ? "Connecting to Kie AI Suno Cover API..." : "Connecting to Kie AI Suno Music Generator...");
    options.addLog?.(isCoverMode ? `Connecting to Suno Cover API (${selectedModel})...` : `Connecting to Suno Music Generator (${selectedModel})...`, "info");

    const reqBody: any = {
        prompt: options.prompt,
        lyrics: options.prompt,
        customMode: true,
        instrumental: Boolean(options.instrumental),
        model: selectedModel,
        callBackUrl: "https://example.com/callback",
        style: options.style,
        title: options.title
    };

    if (isCoverMode) {
        reqBody.uploadUrl = options.uploadUrl;
        reqBody.upload_url = options.uploadUrl;
    }

    if (options.negativeTags) {
        reqBody.negativeTags = options.negativeTags;
        reqBody.negative_tags = options.negativeTags;
    }
    if (options.vocalGender) {
        reqBody.vocalGender = options.vocalGender;
        reqBody.vocal_gender = options.vocalGender;
    }
    if (options.styleWeight !== undefined) reqBody.styleWeight = options.styleWeight;
    if (options.weirdnessConstraint !== undefined) reqBody.weirdnessConstraint = options.weirdnessConstraint;
    if (options.audioWeight !== undefined) reqBody.audioWeight = options.audioWeight;
    if (options.personaId) reqBody.personaId = options.personaId;
    if (options.personaModel) reqBody.personaModel = options.personaModel;

    // Primary endpoint: /api/v1/generate/upload-cover for audio cover, or /api/v1/generate/music / /api/v1/jobs/createTask for direct music
    const endpoint = isCoverMode 
        ? "https://api.kie.ai/api/v1/generate/upload-cover"
        : "https://api.kie.ai/api/v1/generate/music";

    let taskId = '';
    let createRes = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${options.apiKey}`
        },
        body: JSON.stringify(reqBody)
    });

    if (!createRes.ok) {
        // Fallback to standard jobs/createTask endpoint
        const fallbackRes = await fetch("https://api.kie.ai/api/v1/jobs/createTask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${options.apiKey}`
            },
            body: JSON.stringify({
                model: isCoverMode ? "ai-music-api/cover-generate" : "ai-music-api/generate-music",
                input: reqBody
            })
        });

        if (!fallbackRes.ok) {
            const err = await createRes.text();
            throw new Error(`Kie AI API Error: ${createRes.status} ${err}`);
        }
        const fbData = await fallbackRes.json();
        taskId = fbData.data?.taskId || fbData.data?.task_id || fbData.taskId || fbData.id;
    } else {
        const data = await createRes.json();
        if (data.code !== 200 && data.code !== 0) {
            throw new Error(`Kie AI API Error: ${data.msg || data.message || 'Generation rejected'}`);
        }
        taskId = data.data?.taskId || data.data?.task_id || data.taskId || data.id;
    }

    if (!taskId) {
        throw new Error("Kie AI did not return a valid Task ID.");
    }

    if (options.onTaskId) {
        options.onTaskId(taskId);
    }

    const pollingMsg = `Suno task created (ID: ${taskId}). Synthesizing audio tracks...`;
    options.addLog?.(pollingMsg, "info");
    options.onStatus?.(pollingMsg);

    // Poll for status
    let attempts = 0;
    while (attempts < 60) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        attempts++;

        try {
            const tracks = await checkSunoTaskStatus(taskId, options.apiKey);
            if (tracks && tracks.length > 0) {
                return tracks;
            }
        } catch (e: any) {
            if (e.message?.includes('Generation failed')) {
                throw e;
            }
            if (attempts % 3 === 0) {
                const waitMsg = `Suno synthesis in progress... (${attempts * 5}s elapsed)`;
                options.addLog?.(waitMsg, "info");
                options.onStatus?.(waitMsg);
            }
        }
    }

    throw new Error("Suno generation timed out after 5 minutes. You can recover it later using the Task ID.");
};
