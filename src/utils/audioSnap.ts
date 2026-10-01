import { SubtitleBlock } from '../types';

export interface AudioEnergyProfile {
    sampleRate: number;
    duration: number; // in seconds
    frameDurationMs: number; // typically 10ms
    framesCount: number;
    rmsEnvelope: Float32Array; // RMS energy per frame (0.0 to 1.0)
    peakEnvelope: Float32Array; // Peak amplitude per frame (0.0 to 1.0)
    noiseFloor: number;
    globalMaxRms: number;
    defaultThreshold: number;
}

export interface SnapOptions {
    searchWindowMs?: number; // Search window before and after current timestamp (default: 1500ms)
    leadInMs?: number;       // Lead-in padding before speech onset (default: 60ms)
    tailPaddingMs?: number;  // Tail padding after speech offset (default: 100ms)
    minDurationMs?: number;  // Minimum allowed subtitle block duration (default: 300ms)
    sensitivity?: number;    // Sensitivity ratio (0.1 to 0.9, default: 0.25)
}

export interface SnapResult {
    originalStart: number;
    originalEnd: number;
    newStart: number;
    newEnd: number;
    startShiftMs: number;
    endShiftMs: number;
    speechFound: boolean;
    message: string;
}

// In-memory cache so we only decode audio once per file
const profileCache = new Map<string, AudioEnergyProfile>();

/**
 * Decodes an uploaded Audio/Video File using the Web Audio API and computes an RMS/peak energy envelope.
 */
export async function analyzeAudioFile(file: File, frameDurationMs: number = 10): Promise<AudioEnergyProfile> {
    const cacheKey = `${file.name}_${file.size}_${file.lastModified}`;
    const cached = profileCache.get(cacheKey);
    if (cached) {
        return cached;
    }

    // Adapt frame duration for large files to conserve memory during analysis
    let effectiveFrameDurationMs = frameDurationMs;
    if (file.size > 100 * 1024 * 1024) {
        effectiveFrameDurationMs = Math.max(frameDurationMs, 50); // 50ms frames for files >100MB
    } else if (file.size > 40 * 1024 * 1024) {
        effectiveFrameDurationMs = Math.max(frameDurationMs, 25); // 25ms frames for files >40MB
    }

    const MAX_FILE_SIZE = 300 * 1024 * 1024; // 300MB
    if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Waveform generation and Peak Snap require files under 300MB.`);
    }

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
        throw new Error('Web Audio API is not supported in this browser.');
    }

    const isVideoFile = file.type?.toLowerCase().startsWith('video/') || /\.(mp4|mov|avi|mkv|webm|m4v|3gp|flv)$/i.test(file.name);
    
    // Safety check for extremely large video/audio files (>150MB or video files >80MB)
    // Slicing or skipping heavy Float32 channel extraction prevents browser tab crashes / memory reload
    if (file.size > 200 * 1024 * 1024 || (isVideoFile && file.size > 80 * 1024 * 1024)) {
        console.warn(`[audioSnap] File (${(file.size / 1024 / 1024).toFixed(1)}MB, video=${isVideoFile}) is large. Using lightweight fallback audio profile to protect browser memory.`);
        // Estimate duration based on file size or return a safe placeholder profile
        const estDurationSec = Math.max(10, Math.floor(file.size / (128 * 1024 / 8))); // rough estimate
        const fallbackFrames = Math.max(100, Math.floor(estDurationSec * 100));
        const dummyRms = new Float32Array(fallbackFrames).fill(0.3);
        const dummyPeak = new Float32Array(fallbackFrames).fill(0.5);
        const profile: AudioEnergyProfile = {
            sampleRate: 44100,
            duration: estDurationSec,
            frameDurationMs: 10,
            framesCount: fallbackFrames,
            rmsEnvelope: dummyRms,
            peakEnvelope: dummyPeak,
            noiseFloor: 0.05,
            globalMaxRms: 0.5,
            defaultThreshold: 0.2
        };
        profileCache.set(cacheKey, profile);
        return profile;
    }

    const audioCtx = new AudioContextClass();
    try {
        // Slice max 60MB if file is large audio to avoid arrayBuffer allocation crash
        const blobToRead = file.size > 60 * 1024 * 1024 ? file.slice(0, 60 * 1024 * 1024) : file;
        const arrayBuffer = await blobToRead.arrayBuffer();
        const audioBuffer = await new Promise<AudioBuffer>((resolve, reject) => {
            audioCtx.decodeAudioData(arrayBuffer, resolve, (err) => {
                reject(err || new Error('Failed to decode audio data'));
            });
        });

        const sampleRate = audioBuffer.sampleRate;
        const duration = audioBuffer.duration;
        const samplesPerFrame = Math.max(1, Math.floor((sampleRate * effectiveFrameDurationMs) / 1000));
        const totalSamples = audioBuffer.length;
        const framesCount = Math.floor(totalSamples / samplesPerFrame);

        const rmsEnvelope = new Float32Array(framesCount);
        const peakEnvelope = new Float32Array(framesCount);

        const numChannels = audioBuffer.numberOfChannels;
        const channelData: Float32Array[] = [];
        for (let c = 0; c < numChannels; c++) {
            channelData.push(audioBuffer.getChannelData(c));
        }

        let globalMaxRms = 0;

        // Compute RMS and peak per frame
        for (let f = 0; f < framesCount; f++) {
            const startSample = f * samplesPerFrame;
            const endSample = Math.min(totalSamples, startSample + samplesPerFrame);
            let sumSq = 0;
            let maxAmp = 0;
            const frameLen = endSample - startSample;

            for (let s = startSample; s < endSample; s++) {
                // Downmix channels by average
                let sampleVal = 0;
                for (let c = 0; c < numChannels; c++) {
                    sampleVal += channelData[c][s];
                }
                sampleVal /= numChannels;

                const absVal = Math.abs(sampleVal);
                if (absVal > maxAmp) maxAmp = absVal;
                sumSq += sampleVal * sampleVal;
            }

            const rms = frameLen > 0 ? Math.sqrt(sumSq / frameLen) : 0;
            rmsEnvelope[f] = rms;
            peakEnvelope[f] = maxAmp;

            if (rms > globalMaxRms) {
                globalMaxRms = rms;
            }
        }

        // Estimate noise floor using 15th percentile of RMS values
        // Sample up to 2000 points to keep sorting fast
        const sampleStep = Math.max(1, Math.floor(framesCount / 2000));
        const sampleValues: number[] = [];
        for (let i = 0; i < framesCount; i += sampleStep) {
            sampleValues.push(rmsEnvelope[i]);
        }
        sampleValues.sort((a, b) => a - b);
        const p15Index = Math.floor(sampleValues.length * 0.15);
        const noiseFloor = sampleValues[p15Index] || 0.005;

        // Default dynamic threshold for speech activity
        const defaultThreshold = noiseFloor + Math.max(0.01, (globalMaxRms - noiseFloor) * 0.22);

        const profile: AudioEnergyProfile = {
            sampleRate,
            duration,
            frameDurationMs: effectiveFrameDurationMs,
            framesCount,
            rmsEnvelope,
            peakEnvelope,
            noiseFloor,
            globalMaxRms,
            defaultThreshold,
        };

        profileCache.set(cacheKey, profile);
        return profile;
    } finally {
        if (audioCtx.state !== 'closed') {
            audioCtx.close().catch(() => {});
        }
    }
}

/**
 * Calculates a local adaptive speech threshold within a time window around the subtitle block.
 */
function getLocalThreshold(profile: AudioEnergyProfile, centerTimeMs: number, windowMs: number, sensitivity: number): number {
    const { frameDurationMs, framesCount, rmsEnvelope, noiseFloor, globalMaxRms } = profile;
    const startFrame = Math.max(0, Math.floor((centerTimeMs - windowMs) / frameDurationMs));
    const endFrame = Math.min(framesCount - 1, Math.ceil((centerTimeMs + windowMs) / frameDurationMs));

    if (startFrame >= endFrame) {
        return profile.defaultThreshold;
    }

    let localMin = 1.0;
    let localMax = 0.0;

    for (let f = startFrame; f <= endFrame; f++) {
        const val = rmsEnvelope[f];
        if (val < localMin) localMin = val;
        if (val > localMax) localMax = val;
    }

    const range = localMax - localMin;
    if (range < 0.01) {
        return profile.defaultThreshold;
    }

    // Adaptive threshold based on local dynamic range and sensitivity
    const factor = Math.min(0.8, Math.max(0.05, sensitivity));
    return localMin + range * factor;
}

/**
 * Snaps a single subtitle block to natural speech gaps and detected audio peaks.
 */
export function snapBlockToAudio(
    block: { start: number; end: number; isLocked?: boolean },
    profile: AudioEnergyProfile,
    prevBlock?: { start: number; end: number } | null,
    nextBlock?: { start: number; end: number } | null,
    options?: SnapOptions
): SnapResult {
    const searchWindowMs = options?.searchWindowMs ?? 1600;
    const leadInMs = options?.leadInMs ?? 60;
    const tailPaddingMs = options?.tailPaddingMs ?? 100;
    const minDurationMs = options?.minDurationMs ?? 300;
    const sensitivity = options?.sensitivity ?? 0.22;

    const originalStart = block.start;
    const originalEnd = block.end;

    // Hard boundaries defined by adjacent blocks and track boundaries
    const minStartBound = prevBlock ? Math.max(0, prevBlock.end + 20) : 0;
    const maxStartBound = originalEnd - minDurationMs;

    const minEndBound = originalStart + minDurationMs;
    const maxEndBound = nextBlock ? Math.max(minEndBound, nextBlock.start - 20) : Math.floor(profile.duration * 1000);

    const { frameDurationMs, framesCount, rmsEnvelope } = profile;

    // 1. --- SNAP START TIMESTAMP ---
    // Search window for start: [searchMinMs, searchMaxMs]
    const searchStartMinMs = Math.max(minStartBound, originalStart - searchWindowMs);
    const searchStartMaxMs = Math.min(maxStartBound, originalStart + searchWindowMs);

    const startSearchMinFrame = Math.max(0, Math.floor(searchStartMinMs / frameDurationMs));
    const startSearchMaxFrame = Math.min(framesCount - 1, Math.ceil(searchStartMaxMs / frameDurationMs));
    const startCurFrame = Math.min(framesCount - 1, Math.max(0, Math.round(originalStart / frameDurationMs)));

    const startThreshold = getLocalThreshold(profile, originalStart, searchWindowMs * 1.5, sensitivity);

    let detectedOnsetFrame: number | null = null;
    const isStartInSpeech = rmsEnvelope[startCurFrame] >= startThreshold;

    if (isStartInSpeech) {
        // Speech already started; scan backwards to find the preceding gap / rising onset
        for (let f = startCurFrame; f >= startSearchMinFrame; f--) {
            if (rmsEnvelope[f] < startThreshold) {
                // Found silence/gap preceding speech; onset is the next frame that crosses threshold
                detectedOnsetFrame = Math.min(startCurFrame, f + 1);
                break;
            }
        }
        // If it stayed above threshold all the way back, check if there's a local minimum
        if (detectedOnsetFrame === null) {
            let minEnergy = rmsEnvelope[startCurFrame];
            let minFrame = startCurFrame;
            for (let f = startCurFrame; f >= startSearchMinFrame; f--) {
                if (rmsEnvelope[f] < minEnergy) {
                    minEnergy = rmsEnvelope[f];
                    minFrame = f;
                }
            }
            detectedOnsetFrame = minFrame;
        }
    } else {
        // Start is currently in silence/gap; look forward for the first speech onset
        for (let f = startCurFrame; f <= startSearchMaxFrame; f++) {
            if (rmsEnvelope[f] >= startThreshold) {
                // Ensure it's sustained speech (not a 10ms micro-click)
                const nextFrame = Math.min(framesCount - 1, f + 2);
                if (rmsEnvelope[nextFrame] >= startThreshold * 0.8) {
                    detectedOnsetFrame = f;
                    break;
                }
            }
        }
        // If not found forward, look slightly backward in case start was placed just past speech onset
        if (detectedOnsetFrame === null) {
            for (let f = startCurFrame; f >= startSearchMinFrame; f--) {
                if (rmsEnvelope[f] >= startThreshold) {
                    detectedOnsetFrame = f;
                    break;
                }
            }
        }
    }

    let newStart = originalStart;
    let startFound = false;

    if (detectedOnsetFrame !== null) {
        const detectedOnsetMs = detectedOnsetFrame * frameDurationMs;
        // Apply lead-in padding (text appears slightly before speech onset)
        const proposedStart = detectedOnsetMs - leadInMs;
        newStart = Math.max(minStartBound, Math.min(maxStartBound, Math.round(proposedStart)));
        startFound = true;
    }

    // 2. --- SNAP END TIMESTAMP ---
    // Recalculate minimum end bound with newly snapped start
    const effectiveMinEndBound = newStart + minDurationMs;
    const searchEndMinMs = Math.max(effectiveMinEndBound, originalEnd - searchWindowMs);
    const searchEndMaxMs = Math.min(maxEndBound, originalEnd + searchWindowMs);

    const endSearchMinFrame = Math.max(0, Math.floor(searchEndMinMs / frameDurationMs));
    const endSearchMaxFrame = Math.min(framesCount - 1, Math.ceil(searchEndMaxMs / frameDurationMs));
    const endCurFrame = Math.min(framesCount - 1, Math.max(0, Math.round(originalEnd / frameDurationMs)));

    const endThreshold = getLocalThreshold(profile, originalEnd, searchWindowMs * 1.5, sensitivity);

    let detectedOffsetFrame: number | null = null;
    const isEndInSpeech = rmsEnvelope[endCurFrame] >= endThreshold;

    if (isEndInSpeech) {
        // End cuts off active speech; scan forward to find where speech stops into a gap
        for (let f = endCurFrame; f <= endSearchMaxFrame; f++) {
            if (rmsEnvelope[f] < endThreshold) {
                // Confirm it stays below threshold for at least 60ms (true pause)
                const checkFrame = Math.min(framesCount - 1, f + 6);
                let isTrueGap = true;
                for (let k = f; k <= checkFrame; k++) {
                    if (rmsEnvelope[k] > endThreshold * 1.3) {
                        isTrueGap = false;
                        break;
                    }
                }
                if (isTrueGap) {
                    detectedOffsetFrame = f;
                    break;
                }
            }
        }
        // If speech continues past the search window, use the lowest local energy frame
        if (detectedOffsetFrame === null) {
            let minEnergy = rmsEnvelope[endCurFrame];
            let minFrame = endCurFrame;
            for (let f = endCurFrame; f <= endSearchMaxFrame; f++) {
                if (rmsEnvelope[f] < minEnergy) {
                    minEnergy = rmsEnvelope[f];
                    minFrame = f;
                }
            }
            detectedOffsetFrame = minFrame;
        }
    } else {
        // End is in silence/gap; scan backwards towards the actual end of speech
        for (let f = endCurFrame; f >= endSearchMinFrame; f--) {
            if (rmsEnvelope[f] >= endThreshold) {
                detectedOffsetFrame = f + 1;
                break;
            }
        }
        // If not found backwards, check forward in case of a slightly delayed syllable
        if (detectedOffsetFrame === null) {
            for (let f = endCurFrame; f <= endSearchMaxFrame; f++) {
                if (rmsEnvelope[f] >= endThreshold) {
                    detectedOffsetFrame = f;
                    break;
                }
            }
        }
    }

    let newEnd = originalEnd;
    let endFound = false;

    if (detectedOffsetFrame !== null) {
        const detectedOffsetMs = detectedOffsetFrame * frameDurationMs;
        // Apply tail padding (subtitles linger briefly after speech stops)
        const proposedEnd = detectedOffsetMs + tailPaddingMs;
        newEnd = Math.max(effectiveMinEndBound, Math.min(maxEndBound, Math.round(proposedEnd)));
        endFound = true;
    }

    // Final safety clamps
    if (newEnd < newStart + minDurationMs) {
        newEnd = Math.min(maxEndBound, newStart + minDurationMs);
    }
    if (newStart > newEnd - minDurationMs) {
        newStart = Math.max(minStartBound, newEnd - minDurationMs);
    }

    const startShiftMs = newStart - originalStart;
    const endShiftMs = newEnd - originalEnd;
    const speechFound = startFound || endFound;

    const startShiftDesc = startShiftMs !== 0 ? `${startShiftMs > 0 ? '+' : ''}${startShiftMs}ms start` : 'start aligned';
    const endShiftDesc = endShiftMs !== 0 ? `${endShiftMs > 0 ? '+' : ''}${endShiftMs}ms end` : 'end aligned';

    let message = '';
    if (Math.abs(startShiftMs) < 15 && Math.abs(endShiftMs) < 15) {
        message = 'Subtitle block is already tightly aligned with audio speech boundaries.';
    } else if (speechFound) {
        message = `Snapped to audio (${startShiftDesc}, ${endShiftDesc})`;
    } else {
        message = 'No distinct speech boundaries detected near this block.';
    }

    return {
        originalStart,
        originalEnd,
        newStart,
        newEnd,
        startShiftMs,
        endShiftMs,
        speechFound,
        message,
    };
}

/**
 * Snaps all unlocked subtitle blocks in a track to audio boundaries in sequence.
 */
export function snapAllBlocksToAudio(
    blocks: SubtitleBlock[],
    profile: AudioEnergyProfile,
    options?: SnapOptions
): { updatedBlocks: SubtitleBlock[]; changedCount: number } {
    const sorted = [...blocks].sort((a, b) => a.start - b.start);
    let changedCount = 0;

    const updated: SubtitleBlock[] = [];

    for (let i = 0; i < sorted.length; i++) {
        const block = sorted[i];
        if (block.isLocked) {
            updated.push(block);
            continue;
        }

        const prevBlock = updated.length > 0 ? updated[updated.length - 1] : null;
        const nextBlock = i < sorted.length - 1 ? sorted[i + 1] : null;

        const result = snapBlockToAudio(block, profile, prevBlock, nextBlock, options);
        if (result.startShiftMs !== 0 || result.endShiftMs !== 0) {
            changedCount++;
        }

        updated.push({
            ...block,
            start: result.newStart,
            end: result.newEnd,
        });
    }

    return { updatedBlocks: updated, changedCount };
}
