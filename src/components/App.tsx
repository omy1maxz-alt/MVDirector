
import React, { useState, useEffect, useRef } from 'react';
import { ArtStylePresetsModal } from '@/components/ArtStylePresetsModal';
import { YouTubeImportModal } from '@/components/YouTubeImportModal';
import { ProjectData, DirectorPlan, Scene, LogEntry, ApiKeys, AspectRatio, CharacterProfile, ReferenceImage, ExportedProject, ApiKeySource, AppSettings, InstructionPreset, ArtStylePreset } from '@/types';
import { createDirectorPlan, continueDirectorPlan, generateSceneImage, enhanceAndSanitizePrompt, enhanceMotionPrompt, extractCharacterDNA, generateCharacterDNAFromText, autoStyleCharacterDNA, setTextModel as setTextModelInService, setImageModel as setImageModelInService, setCustomOpenAISettings, setKieSettings, changeReferenceBackground } from '@/services/gemini';
import { generateSunoCover, checkSunoTaskStatus, generateSunoCoverArt } from '@/services/kie';
import { saveProjectToDB, loadProjectFromDB, savePlanToDB, loadPlanFromDB, clearDB } from '@/services/db';
import { SceneCard } from '@/components/SceneCard';
import { PromptGenerator } from '@/components/PromptGenerator';
import { ApiKeyVault } from '@/components/ApiKeyVault';
import { ChangelogModal } from '@/components/ChangelogModal';
import { DevJournalModal } from '@/components/DevJournalModal';
import { SecondBrainModal } from '@/components/SecondBrainModal';
import { KieChatModal } from '@/components/KieChatModal';
import { ChatHistoryModal } from '@/components/ChatHistoryModal';
import { SeedanceExportModal } from '@/components/SeedanceExportModal';
import { SystemState } from '@/components/SystemState';
import { ReferenceEditorModal } from '@/components/ReferenceEditorModal';
import { PromptingGuideModal } from '@/components/PromptingGuideModal';
import { CharacterEditorModal } from '@/components/CharacterEditorModal';
import { PromptHistoryModal } from '@/components/PromptHistoryModal';
import { InstructionPresetsModal } from '@/components/InstructionPresetsModal';
import { GitHubConnectModal } from '@/components/GitHubConnectModal';
import { CrashLogsModal } from '@/components/CrashLogsModal';
import { AspectRatioDropdown } from '@/components/AspectRatioDropdown';
import { GlobalCharacterDropdown } from '@/components/GlobalCharacterDropdown';
import { StudioChat } from '@/components/StudioChat';
import { SubtitlesTab } from '@/components/SubtitlesTab';
import { KeepAwake } from '@/components/KeepAwake';
import { KeyframeAnalyzer } from "@/components/KeyframeAnalyzer";
import { XploreTab } from "@/components/XploreTab";
import { PWAInstallButton } from '@/components/PWAInstallButton';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import ReactPlayer from 'react-player';
import { compressImage } from '@/utils/imageUtils';
import { motion, useDragControls } from 'motion/react';
import { listenAuthState } from '@/services/auth';
import type { User } from 'firebase/auth';
// FIX: Import missing 'Key' icon from lucide-react.
import { 
  Clapperboard, Sparkles, Settings, Trash2, Plus, 
  History, LayoutGrid, Music, Mic, X, Wand2, Terminal,
  BookOpen, Sliders, Image as ImageIcon, Upload, FileText,
  Clock, Hash, Maximize, Palette, Loader2, Download, ScrollText,
  HelpCircle, Server, Copy, Check, Film, ListOrdered, FilePlus, Bot, XCircle, ChevronDown, Key, Star, ShieldAlert, MessageSquare, Edit3, Save, Repeat, Minus, Play, Pause, SkipForward, SkipBack, RefreshCw,
  Subtitles, Eye, EyeOff, Scan, Youtube, Video, FolderOpen, Brain, Github, Bug } from 'lucide-react';

const Player = ReactPlayer as any;

const LYRICS_HISTORY_KEY = 'mv_director_lyrics_history';
const TECH_HISTORY_KEY = 'mv_director_tech_history';

const DEFAULT_PROJECT: ProjectData = {
  projectType: 'music-video',
  directorPersona: 'Avant-Garde Visionary',
  generationMode: 'technical',
  lyrics: "",
  technicalInstructions: `**Emoji/Emote Generation Prompt:**
Close-up portrait of [INSERT CHARACTER NAME], chibi emoji style, transparent background.
1. Smiling happily, waving.
2. Crying with a broken heart.
3. Angry with a little vein popping out.
4. Sleeping with a cute snot bubble.`,
  creativeContext: "",
  characterDescription: "",
  characters: [],
  totalDuration: "3:00",
  sceneCount: 4,
  useAutoSceneCount: false,
  artStyle: "Cinematic, 35mm film grain, high contrast, dramatic lighting",
  aspectRatio: "16:9",
  videoSegmentDuration: "6s",
  referenceImages: [],
  recurringMotifs: "",
  soundtrackUrl: ""
};

const DEFAULT_ART_STYLE_PRESETS = [
  // General & Film
  { label: "Cinematic", prompt: "Cinematic, 35mm film grain, high contrast, dramatic lighting, epic scope" },
  { label: "Photorealistic", prompt: "Hyperrealistic, 8K, sharp focus, detailed skin texture, professional photography" },
  { label: "iPhone Camera", prompt: "Shot on iPhone, realistic, slightly grainy, natural lighting, candid feel, modern aesthetic" },
  { label: "Noir / High Contrast", prompt: "Black and white film noir, high contrast, dramatic shadows, german expressionism, mysterious atmosphere" },
  // Director Styles
  { label: "Wes Anderson", prompt: "Symmetrical composition, flat space cinematography, distinctive color palette of pastel yellows, blues, and pinks. Whimsical and meticulously detailed. Wes Anderson aesthetic." },
  { label: "David Fincher", prompt: "Dark, moody, desaturated color grading with cyan and green tones. High contrast, gritty urban environment, sense of unease. David Fincher aesthetic." },
  { label: "Quentin Tarantino", prompt: "Saturated, warm 70s film look. Highly stylized, referencing classic cinema, anamorphic lens flare. Quentin Tarantino aesthetic." },
  { label: "Tim Burton / Gothic", prompt: "Gothic and whimsical style, desaturated colors with occasional bursts of vivid color. High contrast, twisted and surreal architecture, Tim Burton aesthetic." },
  // Animation
  { label: "Anime / Ghibli", prompt: "Hayao Ghibli anime style, beautiful hand-drawn background, soft colors, cinematic lighting, nostalgic feel" },
  { label: "3D Render / Pixar", prompt: "Pixar style 3D render, cute and expressive characters, vibrant colors, detailed textures" },
  // Aesthetic & Retro
  { label: "Vintage / 80s Film", prompt: "1980s film look, vintage colors, VHS aesthetic, soft focus, nostalgic" },
  { label: "Synthwave / Outrun", prompt: "80s retrofuturism, Synthwave aesthetic, neon grids, palm trees at sunset. Pinks, purples, and blues. Chrome textures and lens flare." },
  { label: "Vaporwave", prompt: "Vaporwave aesthetic, neon colors, retrofuturism, glitch art, 1980s and 1990s themes, palm trees, roman statues" },
  { label: "Cyberpunk / Blade Runner", prompt: "Blade Runner aesthetic, neon-drenched rainy cityscape at night. High contrast, reflections on wet pavement, futuristic Asian-inspired architecture." },
  { label: "Lo-fi / Chillhop", prompt: "Soft, warm, cozy aesthetic. Muted color palette, slightly blurry, often with a hint of nostalgia. Lo-fi vibe." },
  // Custom
  { label: "Other (Custom)", prompt: "custom" }
];

const INSTRUCTION_PRESETS = [
    { label: "Casual SNS Photo (Ultra-Realism)", instructions: "Generate the image with the texture and quality of a candid smartphone photo taken in natural light. Give the subject an imperfect, natural expression and a natural gaze (not staring directly at the camera) to capture a fleeting moment from daily life. Avoid excessive processing, glossy finishes, or anything that screams 'AI'. Introduce a slight background blur (shallow depth of field), but ensure the lighting direction matches perfectly between the subject and background. Include a sense of everyday life in the background, leaving a little negative space for a clean, fresh atmosphere. Ensure hands, fingers, and facial boundaries are naturally balanced with no deformities. Prioritize 100% naturalness, making it look like a real candid photo uploaded to social media." },
    { label: "Hyper-Realistic Photography", instructions: "Do NOT alter the bone structure, eye shape, nose shape, jawline, or proportions.\nMaintain the exact same person across all poses and scenes.\n\nRender the skin with realistic texture: visible pores, micro-blemishes, soft imperfections, natural uneven tones, subtle fine lines, and subsurface scattering.\nAvoid plastic, smooth, airbrushed, glossy, or CGI-like skin.\n\nRender the hair naturally with flyaways, baby hair, soft frizz, and realistic volume.\nAvoid helmet-like, overly shiny, or perfectly smooth hair.\n\nUse natural lighting with soft shadows and realistic falloff.\nAvoid overly perfect studio lighting unless requested.\n\nMaintain natural asymmetry in the face and expression.\nAvoid perfectly symmetrical or frozen expressions.\n\nPreserve the reference identity even when changing:\n- pose\n- outfit\n- background\n- lighting\n- expression\n\nMake the final image feel like a real candid photo taken with a real camera, not AI-generated." },
    { label: "High-Octane Action Sequence", instructions: "Create a fast-paced action sequence. Focus on dynamic camera angles, rapid movement, and intense lighting. Include close-ups of intense expressions and wide shots of chaotic environments. The sequence should feel explosive and energetic." },
    { label: "Atmospheric Horror Build-up", instructions: "Design a slow, atmospheric horror build-up. Use low-key lighting, heavy shadows, and claustrophobic framing. Focus on unsettling details, slow camera creeps, and a growing sense of dread. The environment should feel abandoned and hostile." },
    { label: "Ethereal Sci-Fi Exploration", instructions: "Generate a cinematic montage of exploration in a surreal, alien environment. Use a vibrant, otherworldly color palette. Include sweeping wide shots of massive landscapes and macro shots of strange flora/fauna. The mood should be one of wonder and isolation." },
    { label: "Gritty Noir Detective Story", instructions: "Create a gritty, neo-noir sequence. Use high-contrast lighting (chiaroscuro), rain-slicked streets, and neon reflections. Focus on a brooding protagonist, mysterious figures in the shadows, and close-ups of clues (e.g., a smoking cigarette, a dropped photograph)." },
    { label: "Emotional Character Study", instructions: "Design a sequence focused entirely on a character's emotional journey. Use soft, intimate lighting and shallow depth of field. The camera should linger on facial expressions and subtle body language. The environment should reflect the character's internal state." }
];

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

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const EMPTY_DNA = { facialFeatures: '', hairStyle: '', bodyType: '', height: '', weight: '', clothingStyle: '', personality: '', keyExpressions: '' };

const useKeepAlive = (isActive: boolean) => {
  const wasActive = useRef(false);

  useEffect(() => {
    if (isActive) {
      // We no longer automatically request Notification permission here
      // because it causes "Close any bubbles or overlays" errors on Android.
      // if ('Notification' in window && Notification.permission === 'default') {
      //   Notification.requestPermission().catch(console.error);
      // }
      wasActive.current = true;
    } else if (wasActive.current) {
      wasActive.current = false;
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.ready.then(reg => {
              try {
                reg.showNotification('MV Director AI', {
                  body: 'Generation tasks have completed!',
                });
              } catch {}
            }).catch(() => {});
          } else {
            new Notification('MV Director AI', {
              body: 'Generation tasks have completed!',
            });
          }
        } catch {
          // Android Chrome throws Illegal constructor for new Notification()
        }
      }
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    // 1. Prevent accidental close/reload
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = 'Generations are in progress. Are you sure you want to leave?';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // 2. Silent audio trick to prevent browser tab throttling/discarding
    let audioCtx: AudioContext | null = null;
    let oscillator: OscillatorNode | null = null;

    try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
            // Resume requires user interaction, but since isActive usually becomes true
            // right after a button click, this should work.
            if (audioCtx.state === 'suspended') {
                audioCtx.resume().catch(() => {});
            }
            oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            gainNode.gain.value = 0; // Completely silent
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.start();
        }
    } catch (e) {
        console.warn("Keep-alive audio failed", e);
    }

    return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        try {
            if (oscillator) {
                oscillator.stop();
                oscillator.disconnect();
            }
            if (audioCtx && audioCtx.state !== 'closed') {
                audioCtx.close();
            }
        } catch (e) {}
    };
  }, [isActive]);
};

export const App: React.FC = () => {
  const [projectData, setProjectData] = useState<ProjectData>(DEFAULT_PROJECT);
  const [directorPlan, setDirectorPlan] = useState<DirectorPlan | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKeys>({ google: '', huggingface: '' });
  const [apiKeySource, setApiKeySource] = useState<ApiKeySource>('builtin');
  const [textModel, setTextModel] = useState<string>('gemini-3.7-flash');
  const [imageModel, setImageModel] = useState<string>('gemini-3.1-flash-image');
  const [isDirecting, setIsDirecting] = useState(false);
  const [directorError, setDirectorError] = useState<string | null>(null);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'director' | 'storyboard' | 'studio' | 'lab' | 'system' | 'music' | 'subtitles' | 'keyframes' | 'xplore'>('director');
  const [showKeyVault, setShowKeyVault] = useState(false);
  const [googleUser, setGoogleUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = listenAuthState((user) => {
      setGoogleUser(user);
    });
    return () => unsub();
  }, []);
  const playerDragControls = useDragControls();
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [localSoundtrackUrl, setLocalSoundtrackUrl] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const playerRef = useRef<any>(null);
  const [showChangelog, setShowChangelog] = useState(false);
  const [showDevJournal, setShowDevJournal] = useState(false);
  const [showSecondBrain, setShowSecondBrain] = useState(false);
  const [showCrashLogs, setShowCrashLogs] = useState(false);
  const [showKieChat, setShowKieChat] = useState(false);
  const [showGitHubConnect, setShowGitHubConnect] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [showPromptGuide, setShowPromptGuide] = useState(false);
  const [showSeedanceModal, setShowSeedanceModal] = useState(false);
  
  const [coverPrompt, setCoverPrompt] = useState<string>(() => {
    try { return localStorage.getItem('suno_cover_prompt') || ''; } catch { return ''; }
  });
  const [coverStyle, setCoverStyle] = useState<string>(() => {
    try { return localStorage.getItem('suno_cover_style') || ''; } catch { return ''; }
  });
  const [coverTitle, setCoverTitle] = useState<string>(() => {
    try { return localStorage.getItem('suno_cover_title') || ''; } catch { return ''; }
  });
  const [coverModel, setCoverModel] = useState<'V6' | 'V6_WILD' | 'V6_MINI' | 'V5_5' | 'V5' | 'V4' | 'V3_5'>(() => {
    try { return (localStorage.getItem('suno_cover_model') as any) || 'V6'; } catch { return 'V6'; }
  });
  const [coverPersonaId, setCoverPersonaId] = useState<string>(() => {
    try { return localStorage.getItem('suno_cover_persona') || ''; } catch { return ''; }
  });
  const [showPersonaSettings, setShowPersonaSettings] = useState<boolean>(false);
  const [isGeneratingCoverArt, setIsGeneratingCoverArt] = useState<boolean>(false);
  const [generatedCoverArtUrls, setGeneratedCoverArtUrls] = useState<string[]>([]);
  const [coverInstrumental, setCoverInstrumental] = useState<boolean>(false);
  const [coverNegativeTags, setCoverNegativeTags] = useState<string>('');
  const [coverVocalGender, setCoverVocalGender] = useState<'m' | 'f' | ''>('');
  const [coverStyleWeight, setCoverStyleWeight] = useState<number>(0.6);
  const [coverWeirdnessConstraint, setCoverWeirdnessConstraint] = useState<number>(0.5);
  const [coverAudioWeight, setCoverAudioWeight] = useState<number>(0.5);
  const [coverStatus, setCoverStatus] = useState<string>('');
  const [currentCoverTaskId, setCurrentCoverTaskId] = useState<string>('');
  const [isCovering, setIsCovering] = useState<boolean>(false);
  const [recoverTaskId, setRecoverTaskId] = useState<string>('');
  const [isRecoveringTaskId, setIsRecoveringTaskId] = useState<boolean>(false);
  useEffect(() => {
    try { localStorage.setItem('suno_cover_prompt', coverPrompt); } catch {}
  }, [coverPrompt]);
  useEffect(() => {
    try { localStorage.setItem('suno_cover_style', coverStyle); } catch {}
  }, [coverStyle]);
  useEffect(() => {
    try { localStorage.setItem('suno_cover_title', coverTitle); } catch {}
  }, [coverTitle]);
  useEffect(() => {
    try { localStorage.setItem('suno_cover_model', coverModel); } catch {}
  }, [coverModel]);
  useEffect(() => {
    try { localStorage.setItem('suno_cover_persona', coverPersonaId); } catch {}
  }, [coverPersonaId]);


  const [newCharName, setNewCharName] = useState('');
  const [newCharDna, setNewCharDna] = useState(EMPTY_DNA);
  const [charPrompt, setCharPrompt] = useState('');
  const [isGeneratingChar, setIsGeneratingChar] = useState(false);
  const [selectedArtStyle, setSelectedArtStyle] = useState('Cinematic');
  const [editingReference, setEditingReference] = useState<ReferenceImage | null>(null);
  const [editingCharacter, setEditingCharacter] = useState<CharacterProfile | null>(null);
  const [copied, setCopied] = useState<'image' | 'video' | null>(null);
  const [lyricsHistory, setLyricsHistory] = useState<string[]>([]);
  const [techHistory, setTechHistory] = useState<string[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState<'lyrics' | 'tech' | null>(null);
  const [artStylePresets, setArtStylePresets] = useState<ArtStylePreset[]>([]);
  const [showArtStylePresetsModal, setShowArtStylePresetsModal] = useState(false);
  const [instructionPresets, setInstructionPresets] = useState<InstructionPreset[]>([]);
  const [showInstructionPresetsModal, setShowInstructionPresetsModal] = useState(false);
  const [showYouTubeModal, setShowYouTubeModal] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const [isLiveSyncEnabled, setIsLiveSyncEnabled] = useState(() => {
    const saved = localStorage.getItem('mv_live_sync');
    return saved !== null ? saved === 'true' : false; // Default to false so it doesn't cause unexpected behavior
  });

  useEffect(() => {
    localStorage.setItem('mv_live_sync', String(isLiveSyncEnabled));
  }, [isLiveSyncEnabled]);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);

  const isWorking = isDirecting || isBatchGenerating || (directorPlan?.scenes.some(s => s.isGenerating || s.isGeneratingVideo) ?? false);
  useKeepAlive(isWorking);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importFileRef = useRef<HTMLInputElement>(null);
  const importSettingsFileRef = useRef<HTMLInputElement>(null);
  const isInitialMount = useRef(true);
  const generationAbortController = useRef<AbortController | null>(null);
  const projectMenuRef = useRef<HTMLDivElement>(null);
  const settingsMenuRef = useRef<HTMLDivElement>(null);
  
  const apiKeysRef = useRef(apiKeys);
  const apiKeySourceRef = useRef(apiKeySource);
  useEffect(() => {
    apiKeysRef.current = apiKeys;
    apiKeySourceRef.current = apiKeySource;
  }, [apiKeys, apiKeySource]);

  useEffect(() => {
    setLocalSoundtrackUrl(projectData.soundtrackUrl || '');
  }, [projectData.soundtrackUrl]);

  useEffect(() => {
    if (audioRef.current && (projectData.soundtrackUrl?.startsWith('blob:') || projectData.localPlaylist)) {
        if (isPlaying) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    // Suppress AbortError and NotAllowedError (autoplay blocks)
                    if (error?.name !== 'AbortError' && error?.name !== 'NotAllowedError') {
                        console.warn('Audio play notice:', error);
                    }
                });
            }
        } else {
            audioRef.current.pause();
        }
    }
  }, [projectData.soundtrackUrl, projectData.currentTrackIndex, isPlaying]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (projectMenuRef.current && !projectMenuRef.current.contains(event.target as Node)) {
            setIsProjectMenuOpen(false);
        }
        if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
            setIsSettingsMenuOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const lastSyncedTimestamp = useRef<number>(Date.now());
  const agentUpdateRef = useRef<boolean>(false);

  // Push updates to agent
  useEffect(() => {
    if (!isLiveSyncEnabled || isInitialMount.current) return;
    if (agentUpdateRef.current) {
        agentUpdateRef.current = false;
        return; // Don't echo back if the agent just updated it
    }
    const timeout = setTimeout(() => {
        const payload = {
            updatedBy: 'user',
            timestamp: Date.now(),
            projectData: projectData
        };
        fetch('/api/agent-bridge', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        }).catch(() => {}); // Ignore errors
    }, 1000); // Debounce
    return () => clearTimeout(timeout);
  }, [projectData, isLiveSyncEnabled]);

  // Poll for agent updates
  useEffect(() => {
    if (!isLiveSyncEnabled) return;
    const interval = setInterval(() => {
        fetch('/api/agent-bridge')
            .then(res => res.json())
            .then(data => {
                if (data && data.updatedBy === 'agent' && data.timestamp > lastSyncedTimestamp.current) {
                    lastSyncedTimestamp.current = data.timestamp;
                    agentUpdateRef.current = true;
                    setProjectData(data.projectData);
                    addLog("Agent updated the project state remotely.", "success");
                }
            })
            .catch(() => {});
    }, 2000);
    return () => clearInterval(interval);
  }, [isLiveSyncEnabled]);

  const sanitizeProject = (raw: any): ProjectData => {
    const base = { ...DEFAULT_PROJECT, ...(raw || {}) };
    base.characters = Array.isArray(base.characters)
      ? base.characters.map((c: any, i: number) => {
          const descriptionVal = c?.description || c?.dna || EMPTY_DNA;
          return {
            id: c?.id || `char_${Date.now()}_${i}`,
            name: c?.name || 'Unnamed',
            dna: descriptionVal,
            description: descriptionVal,
            role: c?.role || 'protagonist'
          };
        })
      : [];
    base.referenceImages = Array.isArray(base.referenceImages)
      ? base.referenceImages.map((r: any, idx: number) => ({
          id: r?.id || `ref_${Date.now()}_${idx}`,
          data: r?.data || '',
          description: r?.description || '',
          roles: Array.isArray(r?.roles) ? r.roles : ['character_identity'],
          focusTags: Array.isArray(r?.focusTags) ? r.focusTags : [],
          characterId: r?.characterId,
          enabled: r?.enabled !== false
        }))
      : [];
    base.scenes = Array.isArray(base.scenes) ? base.scenes : [];
    return base;
  };

  const sanitizePlan = (raw: any): DirectorPlan | null => {
    if (!raw) return null;
    return {
      ...raw,
      scenes: Array.isArray(raw.scenes) ? raw.scenes : [],
    };
  };

  useEffect(() => {
    const init = async () => {
      try {
        const savedPresets = localStorage.getItem('instruction_presets');
        if (savedPresets) {
          try {
            setInstructionPresets(JSON.parse(savedPresets));
          } catch (e) {
            setInstructionPresets(INSTRUCTION_PRESETS.map((p, i) => ({ id: i.toString(), ...p })));
          }
        } else {
          setInstructionPresets(INSTRUCTION_PRESETS.map((p, i) => ({ id: i.toString(), ...p })));
        }

        let initialArtStyles = DEFAULT_ART_STYLE_PRESETS.map((p, i) => ({ id: i.toString(), ...p }));
        const savedArtStyles = localStorage.getItem('art_style_presets');
        if (savedArtStyles) {
          try {
            initialArtStyles = JSON.parse(savedArtStyles);
          } catch (e) {
            // Keep default
          }
        }
        setArtStylePresets(initialArtStyles);

        const savedProject = await loadProjectFromDB();
        if (savedProject) {
          const sanitizedProject = sanitizeProject(savedProject);
          // Recreate blob URLs for local files if they exist and are valid Blob/File instances
          if (savedProject.localFiles && savedProject.localFiles.length > 0) {
            const newPlaylist: { name: string; url: string }[] = [];
            for (const f of savedProject.localFiles) {
              if (f && ((f as any) instanceof Blob || (f as any) instanceof File)) {
                try {
                  newPlaylist.push({ name: f.name || 'track', url: URL.createObjectURL(f) });
                } catch (blobErr) {
                  console.warn('Failed to create object URL for local audio file:', blobErr);
                }
              }
            }
            if (newPlaylist.length > 0) {
              sanitizedProject.localPlaylist = newPlaylist;
              if (sanitizedProject.soundtrackUrl && sanitizedProject.soundtrackUrl.startsWith('blob:')) {
                const trackIndex = sanitizedProject.currentTrackIndex || 0;
                sanitizedProject.soundtrackUrl = newPlaylist[trackIndex]?.url || newPlaylist[0].url;
              }
            }
          }
          // Safeguard: If user already pasted or typed lyrics during initial mount, preserve it!
          const fallbackLyrics = localStorage.getItem('mv_latest_lyrics') || '';
          if (!sanitizedProject.lyrics && fallbackLyrics) {
            sanitizedProject.lyrics = fallbackLyrics;
          }
          setProjectData(current => {
            if (current.lyrics && current.lyrics.trim() && !sanitizedProject.lyrics) {
              return { ...sanitizedProject, lyrics: current.lyrics };
            }
            return sanitizedProject;
          });
          setLocalSoundtrackUrl(sanitizedProject.soundtrackUrl || '');
          const matchingPreset = initialArtStyles.find(p => p.prompt === sanitizedProject.artStyle);
          if (matchingPreset) setSelectedArtStyle(matchingPreset.label);
          else if (sanitizedProject.artStyle) setSelectedArtStyle("Other (Custom)");
        }
        const savedPlan = await loadPlanFromDB();
        if (savedPlan) setDirectorPlan(sanitizePlan(savedPlan));

        const storedKeys = localStorage.getItem('mv_api_keys');
        if (storedKeys) {
          try {
            const parsedKeys = JSON.parse(storedKeys);
            if (parsedKeys && typeof parsedKeys === 'object') {
              setApiKeys(parsedKeys);
              apiKeysRef.current = parsedKeys;
              setCustomOpenAISettings(parsedKeys.openaiBaseUrl, parsedKeys.openaiApiKey, parsedKeys.openaiModel);
              setKieSettings(parsedKeys.kie, parsedKeys.kieCustomModel);
            }
          } catch (kErr) {
            console.warn('Failed to parse stored API keys:', kErr);
          }
        }
        const storedSource = localStorage.getItem('mv_api_key_source') as ApiKeySource;
        if (storedSource && ['builtin', 'custom'].includes(storedSource)) {
          setApiKeySource(storedSource);
          apiKeySourceRef.current = storedSource;
        }
        const storedTextModel = localStorage.getItem('mv_text_model');
        if (storedTextModel) {
          setTextModel(storedTextModel);
          setTextModelInService(storedTextModel);
        }
        
        let storedImageModel = localStorage.getItem('mv_image_model');
        if (storedImageModel === 'gemini-2.5-flash') {
          storedImageModel = 'gemini-2.5-flash-image';
          try { localStorage.setItem('mv_image_model', storedImageModel); } catch {}
        }
        if (storedImageModel) {
          setImageModel(storedImageModel);
          setImageModelInService(storedImageModel);
        }
        try {
          const lHistory = localStorage.getItem(LYRICS_HISTORY_KEY);
          setLyricsHistory(lHistory ? JSON.parse(lHistory) : []);
        } catch {
          setLyricsHistory([]);
        }
        try {
          const tHistory = localStorage.getItem(TECH_HISTORY_KEY);
          setTechHistory(tHistory ? JSON.parse(tHistory) : []);
        } catch {
          setTechHistory([]);
        }
        addLog("System initialized.", 'info');
        addLog("New project initialized. Saved project loaded if available.", 'success');
      } catch (fatalInitErr) {
        console.warn('Fatal init catch recovered:', fatalInitErr);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (isInitialMount.current) { isInitialMount.current = false; return; }
    const handler = setTimeout(() => {
      saveProjectToDB(projectData).catch(err => {
        console.warn('Auto-save notice:', err);
      });
    }, 500);

    // Immediate save on app pause, backgrounding, tab switch, or pagehide (prevents data loss when switching apps on mobile)
    const handleImmediateSave = () => {
      saveProjectToDB(projectData).catch(() => {});
      try {
        if (projectData.lyrics) localStorage.setItem('mv_latest_lyrics', projectData.lyrics);
      } catch {}
    };

    const handleVisChange = () => {
      if (document.visibilityState === 'hidden') {
        handleImmediateSave();
      }
    };

    document.addEventListener('visibilitychange', handleVisChange);
    window.addEventListener('pagehide', handleImmediateSave);
    window.addEventListener('beforeunload', handleImmediateSave);

    return () => {
      clearTimeout(handler);
      document.removeEventListener('visibilitychange', handleVisChange);
      window.removeEventListener('pagehide', handleImmediateSave);
      window.removeEventListener('beforeunload', handleImmediateSave);
    };
  }, [projectData]);

  
  
  useEffect(() => {
      if (!isBatchGenerating) return;
      const runBatch = async () => {
          if (!directorPlan) return;
          generationAbortController.current = new AbortController();
          const { signal } = generationAbortController.current;
          const scenesToProcess = directorPlan.scenes.map((s, i) => ({ ...s, originalIndex: i })).filter(s => s.isQueued);
          if (scenesToProcess.length === 0) { setIsBatchGenerating(false); addLog('Batch generation finished: No scenes were queued.', 'info'); return; }
          addLog(`Starting batch generation for ${scenesToProcess.length} scenes.`, 'info');
          for (let i = 0; i < scenesToProcess.length; i++) {
              const scene = scenesToProcess[i];
              if (signal.aborted) { addLog('Batch generation cancelled by user.', 'warning'); break; }
              try {
                  const seed = scene.seed || Math.floor(Math.random() * 1000000);
                  await handleGenerateScene(scene.originalIndex, { aspectRatio: scene.aspectRatio || projectData.aspectRatio, seed });
                  await delay(10000); // Increased from 7000ms to stay safely under 15 RPM
              } catch (error: any) {
                   if (error.message && (error.message.includes("Quota Exceeded") || error.message.includes("429"))) {
                      addLog(`Rate limit hit on Scene ${scene.originalIndex + 1}. Pausing for 60s before retry...`, 'warning');
                      const pauseUntil = Date.now() + 60000;
                      while (Date.now() < pauseUntil) { if (signal.aborted) break; await delay(500); }
                      if (signal.aborted) break;
                      i--; continue;
                  } else { addLog(`Batch stopped due to a critical error on Scene ${scene.originalIndex + 1}: ${error.message}`, 'error'); break; }
              } finally {
                  setDirectorPlan(current => {
                     if (!current) return null; const newScenes = [...current.scenes];
                     if (newScenes[scene.originalIndex]) newScenes[scene.originalIndex] = { ...newScenes[scene.originalIndex], isQueued: false };
                     return { ...current, scenes: newScenes };
                  });
              }
          }
          setDirectorPlan(current => {
             if (!current) return null; const newScenes = current.scenes.map(s => s.isQueued ? { ...s, isQueued: false } : s);
             return { ...current, scenes: newScenes };
          });
          setIsBatchGenerating(false); addLog('Batch generation finished.', 'success');
      };
      runBatch();
      return () => generationAbortController.current?.abort();
  }, [isBatchGenerating]);

  const addLog = (msg: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    setLogs(prev => [...prev, { id: `${Date.now()}-${Math.random()}`, timestamp: new Date().toLocaleTimeString(), message: msg, type }]);
  };

  const saveToHistory = (type: 'lyrics' | 'tech', value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const key = type === 'lyrics' ? LYRICS_HISTORY_KEY : TECH_HISTORY_KEY;
    const history = type === 'lyrics' ? lyricsHistory : techHistory;
    const setter = type === 'lyrics' ? setLyricsHistory : setTechHistory;
    if (history[0] === trimmed) return;
    const newHistory = [trimmed, ...history.filter(h => h !== trimmed)].slice(0, 50);
    setter(newHistory);
    localStorage.setItem(key, JSON.stringify(newHistory));
  };
  
  const handleSelectFromHistory = (prompt: string) => {
    if (showHistoryModal === 'lyrics') setProjectData(p => ({ ...p, lyrics: prompt }));
    else if (showHistoryModal === 'tech') setProjectData(p => ({ ...p, technicalInstructions: prompt }));
    setShowHistoryModal(null);
  };

  const handleClearHistory = () => {
    if (!showHistoryModal) return;
    const key = showHistoryModal === 'lyrics' ? LYRICS_HISTORY_KEY : TECH_HISTORY_KEY;
    const setter = showHistoryModal === 'lyrics' ? setLyricsHistory : setTechHistory;
    setter([]);
    localStorage.removeItem(key);
    addLog(`Cleared ${showHistoryModal} prompt history.`, 'info');
  };

  const handleSaveInstructionPresets = (presets: InstructionPreset[]) => {
    setInstructionPresets(presets);
    localStorage.setItem('instruction_presets', JSON.stringify(presets));
    addLog("Instruction presets saved.", 'success');
  };

  const handleSaveKeys = (keys: ApiKeys, source: ApiKeySource, model: string, imgModel: string) => {
    setApiKeys(keys);
    setApiKeySource(source);
    setTextModel(model);
    setImageModel(imgModel);
    setTextModelInService(model);
    setImageModelInService(imgModel);
    apiKeysRef.current = keys;
    setCustomOpenAISettings(keys.openaiBaseUrl, keys.openaiApiKey, keys.openaiModel);
    setKieSettings(keys.kie, keys.kieCustomModel);
    apiKeySourceRef.current = source;
    localStorage.setItem('mv_api_keys', JSON.stringify(keys));
    localStorage.setItem('mv_api_key_source', source);
    localStorage.setItem('mv_text_model', model);
    localStorage.setItem('mv_image_model', imgModel);
    addLog("API settings updated.", 'success');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
        addLog(`Compressing ${files.length} image(s)...`, 'info');
        const newRefs: ReferenceImage[] = [];
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const compressedBase64 = await compressImage(file);
            newRefs.push({ 
                id: `${Date.now()}-${Math.random()}-${i}`, 
                data: compressedBase64, 
                description: file.name, 
                roles: ['General'] // Default to character as it's most common
            });
        }
        
        setProjectData(p => ({ ...p, referenceImages: [...(p.referenceImages || []), ...newRefs] }));
        addLog(`Added ${newRefs.length} image reference(s).`, 'success'); 
        
        // If single upload, open editor immediately
        if (newRefs.length === 1) {
            setEditingReference(newRefs[0]);
        }
    } catch (error) {
        addLog("Failed to process images.", 'error');
        console.error(error);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleChangeReferenceBackground = async (base64: string): Promise<string> => {
      const key = apiKeySource === 'custom' ? apiKeys.google : undefined;
      return await changeReferenceBackground(base64, key, addLog);
  };
  
  const handleUpdateReference = (updatedRef: ReferenceImage) => {
    setProjectData(p => {
        let newRefs = [...p.referenceImages];
        // If the updated ref is being set as primary, unset other primary flags for the same character.
        if (updatedRef.isPrimary && updatedRef.characterId) {
            newRefs = newRefs.map(r => {
                if (r.characterId === updatedRef.characterId && r.id !== updatedRef.id) {
                    return { ...r, isPrimary: false };
                }
                return r;
            });
        }
        // Now, find and update the actual reference in the potentially modified array.
        const refIndex = newRefs.findIndex(r => r.id === updatedRef.id);
        if (refIndex !== -1) {
            newRefs[refIndex] = updatedRef;
        } else {
             newRefs.push(updatedRef);
        }
        return { ...p, referenceImages: newRefs };
    });
    addLog(`Reference '${updatedRef.description}' updated.`, 'info');
  };

  const handleRemoveReference = (id: string) => {
    setProjectData(p => ({ ...p, referenceImages: (p.referenceImages || []).filter(r => r.id !== id) }));
    addLog("Reference image removed.", 'info');
  };

  const handleToggleReferenceEnabled = (id: string) => {
    setProjectData(p => {
        const newRefs = (p.referenceImages || []).map(r => 
            r.id === id ? { ...r, enabled: r.enabled === false ? true : false } : r
        );
        return { ...p, referenceImages: newRefs };
    });
  };

  const handleNewProject = async () => {
    try {
        await clearDB();
        setProjectData(DEFAULT_PROJECT); setDirectorPlan(null); setLogs([]);
        addLog("New project started. All previous data cleared.", 'success');
        setActiveTab('director'); setSelectedArtStyle('Cinematic');
    } catch (error) {
        const msg = error instanceof Error ? error.message : "An unknown error occurred.";
        addLog(`Failed to clear project data: ${msg}`, 'error');
    }
  };

  const handleExportProject = () => {
    const _projectData = { ...projectData, localFiles: undefined, localPlaylist: undefined };
    const exportData: ExportedProject = { projectData: _projectData, directorPlan };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mv_director_project_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addLog("Project exported successfully.", 'success');
  };

  const handleImportFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        if (!content || !content.trim()) throw new Error("Empty file selected.");

        let imported: any = null;
        try {
          imported = JSON.parse(content);
        } catch (jsonErr: any) {
          throw new Error(`Invalid JSON file: ${jsonErr.message}`);
        }

        const incomingProject = imported.projectData || (
          imported.lyrics !== undefined || 
          imported.projectType !== undefined || 
          imported.technicalInstructions !== undefined || 
          imported.scenes !== undefined
            ? imported 
            : null
        );

        if (!incomingProject) {
          throw new Error("Invalid project file structure. Expected projectData or project properties.");
        }

        const sanitizedProj = sanitizeProject(incomingProject);
        const incomingPlan = imported.directorPlan || (imported.scenes && Array.isArray(imported.scenes) ? { scenes: imported.scenes } : null);
        const sanitizedP = sanitizePlan(incomingPlan);

        setProjectData(sanitizedProj);
        setDirectorPlan(sanitizedP);

        await saveProjectToDB(sanitizedProj).catch(dbErr => console.warn('Import DB save warning:', dbErr));
        if (sanitizedP) {
          await savePlanToDB(sanitizedP).catch(dbErr => console.warn('Import Plan DB save warning:', dbErr));
        }

        const preset = artStylePresets.find(p => p.prompt === sanitizedProj.artStyle);
        setSelectedArtStyle(preset ? preset.label : "Other (Custom)");
        addLog("Project imported successfully.", 'success');
      } catch (err: any) {
        console.warn('Import failed:', err);
        addLog(`Import failed: ${err.message}`, 'error');
      }
    };
    reader.onerror = () => {
      addLog("Failed to read the selected file.", 'error');
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
    if (importFileRef.current) importFileRef.current.value = '';
  };

  const handleExportSettings = () => {
    const settings: AppSettings = { apiKeys, apiKeySource };
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mv_director_settings.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addLog("App settings exported.", 'success');
  };

  const handleImportSettingsFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        if (!content || !content.trim()) throw new Error("Empty settings file.");
        const imported = JSON.parse(content) as AppSettings;
        if (imported && (imported.apiKeys || imported.apiKeySource)) {
          handleSaveKeys(imported.apiKeys || apiKeys, imported.apiKeySource || 'builtin', textModel, imageModel);
          addLog("App settings imported successfully.", 'success');
        } else {
          throw new Error("Invalid settings file format.");
        }
      } catch (err: any) {
        console.warn('Settings import failed:', err);
        addLog(`Settings import failed: ${err.message}`, 'error');
      }
    };
    reader.onerror = () => {
      addLog("Failed to read settings file.", 'error');
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
    if (importSettingsFileRef.current) importSettingsFileRef.current.value = '';
  };

  const handleDirectorMagic = async () => {
    const isKie = textModel.startsWith('kie:');
    const isOpenAI = textModel === 'custom-openai';

    if (isKie) {
      const kieKey = apiKeysRef.current.kie || (typeof window !== 'undefined' ? localStorage.getItem('kie_api_key') : '');
      if (!kieKey) {
        setShowKeyVault(true);
        addLog("A KIE AI API Key is required when using a KIE model. Please enter your key in Settings -> API Settings.", 'warning');
        return;
      }
    } else if (isOpenAI) {
      if (!apiKeysRef.current.openaiApiKey) {
        setShowKeyVault(true);
        addLog("Your Custom OpenAI API Key is required. Please add it in the Vault.", 'warning');
        return;
      }
    } else if (apiKeySourceRef.current === 'custom' && !apiKeysRef.current.google) {
      setShowKeyVault(true);
      addLog("Your Google Gemini API Key is required for this action. Please add it in the Vault.", 'warning');
      return;
    }

    const key = apiKeySourceRef.current === 'custom' ? apiKeysRef.current.google : undefined;
    setDirectorError(null);
    setIsDirecting(true);
    try {
      const plan = await createDirectorPlan(projectData, key, addLog);
      setDirectorPlan(plan); await savePlanToDB(plan);
      addLog("Director Plan ready.", 'success');
      setActiveTab('storyboard');
    } catch (e: any) {
      addLog(`Error: ${e.message}`, 'error');
      setDirectorError(e.message);
    } finally { setIsDirecting(false); }
  };

  const handleContinueDirectorMagic = async () => {
    if (!directorPlan) return;
    const isKie = textModel.startsWith('kie:');
    const isOpenAI = textModel === 'custom-openai';

    if (isKie) {
      const kieKey = apiKeysRef.current.kie || (typeof window !== 'undefined' ? localStorage.getItem('kie_api_key') : '');
      if (!kieKey) {
        setShowKeyVault(true);
        addLog("A KIE AI API Key is required when using a KIE model. Please enter your key in Settings -> API Settings.", 'warning');
        return;
      }
    } else if (isOpenAI) {
      if (!apiKeysRef.current.openaiApiKey) {
        setShowKeyVault(true);
        addLog("Your Custom OpenAI API Key is required. Please add it in the Vault.", 'warning');
        return;
      }
    } else if (apiKeySourceRef.current === 'custom' && !apiKeysRef.current.google) {
      setShowKeyVault(true);
      addLog("Your Google Gemini API Key is required for this action. Please add it in the Vault.", 'warning');
      return;
    }

    const key = apiKeySourceRef.current === 'custom' ? apiKeysRef.current.google : undefined;
    setIsDirecting(true);
    try {
      const plan = await continueDirectorPlan(projectData, directorPlan, key, addLog);
      setDirectorPlan(plan); await savePlanToDB(plan);
      addLog("Director Plan continued successfully.", 'success');
    } catch (e: any) {
      addLog(`Error: ${e.message}`, 'error');
    } finally { setIsDirecting(false); }
  };

  const handleStopGenerateScene = (index: number) => {
    setDirectorPlan(c => c && { ...c, scenes: c.scenes.map((s, i) => i === index ? { ...s, isGenerating: false, isQueued: false } : s) });
    addLog(`[S${index + 1}] Generation stopped by user.`, 'info');
  };

  const handleGenerateScene = async (index: number, params: { aspectRatio: AspectRatio, seed: number }) => {
    if (!directorPlan) return;
    const isUsingKieImg = imageModel.startsWith('kie:') || imageModel.includes('nano-banana');
    const isUsingPollinations = imageModel === 'pollinations';
    const key = apiKeySourceRef.current === 'custom' ? apiKeysRef.current.google : undefined;
    if (apiKeySourceRef.current === 'custom' && !key && !isUsingKieImg && !isUsingPollinations) {
        setShowKeyVault(true);
        addLog("Your own API Key is required for this action. Please add it in the Vault.", 'warning');
        return;
    }
    if (isUsingKieImg && !apiKeysRef.current.kie) {
        setShowKeyVault(true);
        addLog("Kie AI API Key is required for Nano Banana image generation. Please add it in API Settings.", 'warning');
        return;
    }

    const currentScene = directorPlan.scenes[index];
    const previousScenes = currentScene.isContinuation ? directorPlan.scenes.slice(0, index).filter(s => s.imageUrl).slice(-2) : [];
    const previousReferences: ReferenceImage[] = previousScenes.map((s, i) => ({
        id: `prev-scene-${i}`,
        data: s.imageUrl!,
        description: `This is a PREVIOUSLY GENERATED SCENE in the sequence. Use it ONLY for visual continuity (character appearance, lighting, environment style). DO NOT duplicate the composition, pose, or action. The new image MUST depict the NEW action and framing described in the main prompt.`,
        roles: ['Continuity']
    }));
    
    const allReferences = [...projectData.referenceImages, ...previousReferences];

    setDirectorPlan(c => c && { ...c, scenes: c.scenes.map((s, i) => i === index ? { ...s, isGenerating: true, seed: params.seed } : s) });
    try {
      const url = await generateSceneImage(directorPlan.scenes[index].imagePrompt, params.aspectRatio, allReferences, projectData, key, params.seed, (msg, type) => addLog(`[S${index + 1}] ${msg}`, type), directorPlan.scenes[index].disabledCharacterIds);
      setDirectorPlan(c => {
          if (!c) return null; 
          if (!c.scenes[index].isGenerating) return c; // Generation was stopped
          const newScenes = c.scenes.map((s, i) => i === index ? { ...s, imageUrl: url, isGenerating: false, seed: params.seed } : s);
          const newPlan = { ...c, scenes: newScenes }; savePlanToDB(newPlan); return newPlan;
      });
    } catch (e: any) {
      setDirectorPlan(c => c && { ...c, scenes: c.scenes.map((s, i) => i === index ? { ...s, isGenerating: false } : s) });
      addLog(`[S${index + 1}] Failed: ${e.message}`, 'error'); throw e;
    }
  };
  
  const handleEnhanceMotionPrompt = async (index: number) => {
    if (!directorPlan) return;
    const key = apiKeySourceRef.current === 'custom' ? apiKeysRef.current.google : undefined;
     if (apiKeySourceRef.current === 'custom' && !key) {
        setShowKeyVault(true);
        addLog("Your own API Key is required for this action. Please add it in the Vault.", 'warning');
        return;
    }
    setDirectorPlan(c => c && { ...c, scenes: c.scenes.map((s, i) => i === index ? { ...s, isEnhancingVideo: true } : s) });
    addLog(`[S${index+1}] Enhancing motion prompt...`, 'info');
    try {
      const enhanced = await enhanceMotionPrompt(directorPlan.scenes[index].videoMotionPrompt, directorPlan.scenes[index].imagePrompt, key);
      setDirectorPlan(c => {
          if (!c) return null; const newScenes = c.scenes.map((s, i) => i === index ? { ...s, videoMotionPrompt: enhanced, isEnhancingVideo: false } : s);
          const newPlan = { ...c, scenes: newScenes }; savePlanToDB(newPlan); return newPlan;
      });
      addLog(`[S${index+1}] Motion prompt enhanced.`, 'success');
    } catch(e: any) {
      setDirectorPlan(c => c && { ...c, scenes: c.scenes.map((s, i) => i === index ? { ...s, isEnhancingVideo: false } : s) });
      addLog(`[S${index + 1}] Enhancement Failed: ${e.message}`, 'error');
    }
  };

  const handleEnhancePrompt = async (index: number) => {
    if (!directorPlan) return;
    const key = apiKeySourceRef.current === 'custom' ? apiKeysRef.current.google : undefined;
     if (apiKeySourceRef.current === 'custom' && !key) {
        setShowKeyVault(true);
        addLog("Your own API Key is required for this action. Please add it in the Vault.", 'warning');
        return;
    }
    setDirectorPlan(c => c && { ...c, scenes: c.scenes.map((s, i) => i === index ? { ...s, isEnhancing: true } : s) });
    addLog(`[S${index+1}] Enhancing & sanitizing prompt...`, 'info');
    try {
      const enhanced = await enhanceAndSanitizePrompt(directorPlan.scenes[index].imagePrompt, projectData, key);
      
      const newDisabledCharacterIds: string[] = [];
      if (projectData.characters && projectData.characters.length > 0) {
          const lowerPrompt = enhanced.toLowerCase();
          projectData.characters.forEach(char => {
              if (!lowerPrompt.includes(char.name.toLowerCase())) {
                  newDisabledCharacterIds.push(char.id);
              }
          });
      }

      setDirectorPlan(c => {
          if (!c) return null; const newScenes = c.scenes.map((s, i) => i === index ? { ...s, imagePrompt: enhanced, isEnhancing: false, disabledCharacterIds: newDisabledCharacterIds } : s);
          const newPlan = { ...c, scenes: newScenes }; savePlanToDB(newPlan); return newPlan;
      });
      addLog(`[S${index+1}] Prompt enhanced.`, 'success');
    } catch(e: any) {
      setDirectorPlan(c => c && { ...c, scenes: c.scenes.map((s, i) => i === index ? { ...s, isEnhancing: false } : s) });
      addLog(`[S${index + 1}] Enhancement Failed: ${e.message}`, 'error');
    }
  };
  
  const handleBatchGenerate = () => {
      if (!directorPlan) return;
      const isUsingKieImg = imageModel.startsWith('kie:') || imageModel.includes('nano-banana');
      const isUsingPollinations = imageModel === 'pollinations';
      const key = apiKeySourceRef.current === 'custom' ? apiKeysRef.current.google : undefined;
      if (apiKeySourceRef.current === 'custom' && !key && !isUsingKieImg && !isUsingPollinations) {
          setShowKeyVault(true);
          addLog("Your own API Key is required for batch generation.", 'warning');
          return;
      }
      if (isUsingKieImg && !apiKeysRef.current.kie) {
          setShowKeyVault(true);
          addLog("Kie AI API Key is required for Nano Banana image generation. Please add it in API Settings.", 'warning');
          return;
      }
      const scenesToQueue = directorPlan.scenes.filter(s => !s.imageUrl);
      if (scenesToQueue.length === 0) { addLog("All scenes already have images.", 'info'); return; }
      setDirectorPlan(c => c && { ...c, scenes: c.scenes.map(s => !s.imageUrl ? { ...s, isQueued: true } : s) });
      setIsBatchGenerating(true);
  };
  
  const handleStopBatch = () => {
      generationAbortController.current?.abort();
      setIsBatchGenerating(false);
      setDirectorPlan(c => c && { ...c, scenes: c.scenes.map(s => ({...s, isQueued: false, isGenerating: false })) });
  };

  const handleAddCharacter = () => {
    if (!newCharName) return;
    const newChar: CharacterProfile = { 
        id: `${Date.now()}-${Math.random()}`,
        name: newCharName, 
        description: newCharDna
    };
    setProjectData(p => ({ ...p, characters: [...p.characters, newChar] }));
    setNewCharName('');
    setNewCharDna(EMPTY_DNA);
  };
  
  const handleUpdateCharacter = (updatedChar: CharacterProfile) => {
    setProjectData(p => ({ ...p, characters: p.characters.map(c => c.id === updatedChar.id ? updatedChar : c) }));
    setEditingCharacter(null); addLog(`Character "${updatedChar.name}" updated.`, 'info');
  };

  const handleRemoveCharacter = (id: string) => {
    setProjectData(p => ({ ...p, characters: p.characters.filter(c => c.id !== id) }));
    addLog(`Character removed.`, 'info');
  };

  const [isAnalyzingDNA, setIsAnalyzingDNA] = useState(false);
  const abortControllerDNARef = useRef<AbortController | null>(null);

  const handleAnalyzeDNAFromReference = async (base64Data: string) => {
    const key = apiKeySourceRef.current === 'custom' ? apiKeysRef.current.google : undefined;
    if (apiKeySourceRef.current === 'custom' && !key) {
        setShowKeyVault(true);
        addLog("Your own API Key is required for DNA analysis.", 'warning');
        return;
    }
    
    setIsAnalyzingDNA(true);
    const ac = new AbortController();
    abortControllerDNARef.current = ac;
    addLog("Extracting character DNA from reference image...", 'info');
    
    try {
        const dna = await extractCharacterDNA(base64Data, key);
        if (ac.signal.aborted) return;
        setNewCharDna(dna);
        setNewCharName(editingReference?.description.replace(/\.[^/.]+$/, "") || "New Character");
        addLog("DNA extracted successfully. Fields populated in 'Cast' section.", 'success');
    } catch (e: any) {
        if (ac.signal.aborted) return;
        addLog(`DNA Extraction Failed: ${e.message}`, 'error');
    } finally {
        if (!ac.signal.aborted) {
            setIsAnalyzingDNA(false);
        }
        abortControllerDNARef.current = null;
    }
  };

  const handleStopDNAExtraction = () => {
      if (abortControllerDNARef.current) {
          abortControllerDNARef.current.abort();
          abortControllerDNARef.current = null;
      }
      setIsAnalyzingDNA(false);
      addLog("DNA extraction stopped by user.", 'warning');
  };

  const handleAutoStyleCharacter = async () => {
    const key = apiKeySourceRef.current === 'custom' ? apiKeysRef.current.google : undefined;
    if (apiKeySourceRef.current === 'custom' && !key) {
        setShowKeyVault(true);
        addLog("Your own API Key is required to auto-style character.", 'warning');
        return;
    }

    setIsGeneratingChar(true);
    addLog("Auto-styling character with AI...", 'info');
    try {
        const dna = await autoStyleCharacterDNA(newCharDna, newCharName || "Unnamed Character", key);
        setNewCharDna(dna);
        addLog("Character styled successfully.", 'success');
    } catch (e: any) {
        addLog(`Auto-Styling Failed: ${e.message}`, 'error');
    } finally {
        setIsGeneratingChar(false);
    }
  };

  const handleGenerateCharFromPrompt = async () => {
    if (!charPrompt.trim()) return;
    const key = apiKeySourceRef.current === 'custom' ? apiKeysRef.current.google : undefined;
    if (apiKeySourceRef.current === 'custom' && !key) {
        setShowKeyVault(true);
        addLog("Your own API Key is required to generate character.", 'warning');
        return;
    }

    setIsGeneratingChar(true);
    addLog("Generating character DNA from text prompt...", 'info');
    try {
        const dna = await generateCharacterDNAFromText(charPrompt, key);
        setNewCharDna(dna);
        if (!newCharName) {
            setNewCharName(charPrompt.split(' ').slice(0, 2).join(' ')); // Use first two words as default name
        }
        addLog("Character generated successfully from text.", 'success');
    } catch (e: any) {
        addLog(`Character Generation Failed: ${e.message}`, 'error');
    } finally {
        setIsGeneratingChar(false);
    }
  };

  const handleCopyAll = (type: 'image' | 'video') => {
    if (!directorPlan) return;
    const prompts = directorPlan.scenes.map((s, i) => `// SCENE ${i+1}\n${type === 'image' ? s.imagePrompt : s.videoMotionPrompt}`).join('\n\n');
    navigator.clipboard.writeText(prompts); setCopied(type); setTimeout(() => setCopied(null), 2000);
  };
  
  const handleArtStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const label = e.target.value; setSelectedArtStyle(label);
    if (label !== "Other (Custom)") {
        const preset = artStylePresets.find(p => p.label === label);
        if (preset) setProjectData(p => ({ ...p, artStyle: preset.prompt }));
    }
  };

  const handleSaveArtStylePresets = (newPresets: ArtStylePreset[]) => {
    setArtStylePresets(newPresets);
    localStorage.setItem('art_style_presets', JSON.stringify(newPresets));
  };
  
  const handleDownloadAllImages = async () => {
    if (!directorPlan) return;
    const scenes = directorPlan.scenes.filter(s => s.imageUrl);
    if (scenes.length === 0) { addLog("No images to download.", 'warning'); return; }
    addLog(`Preparing zip with ${scenes.length} images...`, 'info');
    
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      for (const scene of scenes) {
          const idx = directorPlan.scenes.findIndex(s => s.timestamp === scene.timestamp);
          const sceneNum = String(idx + 1).padStart(2, '0');
          const projName = (directorPlan.title || 'project').replace(/[^a-zA-Z0-9]/g, '_');
          
          try {
            const response = await fetch(scene.imageUrl!);
            const blob = await response.blob();
            zip.file(`scene_${sceneNum}_${projName}.png`, blob);
          } catch (e) {
            console.error(`Failed to fetch image for scene ${sceneNum}`, e);
            addLog(`Failed to include scene ${sceneNum} in ZIP.`, 'warning');
          }
      }
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      const projName = (directorPlan.title || 'project').replace(/[^a-zA-Z0-9]/g, '_');
      link.download = `${projName}_images.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      
      addLog("All images downloaded as ZIP.", 'success');
    } catch (e: any) {
      addLog(`Failed to download images: ${e.message}`, 'error');
    }
  };

  const handleExportLogs = () => {
    const text = logs.map(l => `[${l.timestamp}] ${l.type.toUpperCase()}: ${l.message}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a');
    link.href = url; link.download = `mv_director_logs_${Date.now()}.txt`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const handleDnaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setNewCharDna(prev => ({...prev, [e.target.name]: e.target.value}));
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[#050505] text-white font-sans overflow-hidden">
      <OfflineIndicator />
      <input type="file" ref={importFileRef} className="hidden" accept=".json" onChange={handleImportFileSelect} />
      <input type="file" ref={importSettingsFileRef} className="hidden" accept=".json" onChange={handleImportSettingsFileSelect} />
      <header className="safe-top-bar border-b border-white/10 bg-black flex items-center justify-between px-3 md:px-5 shrink-0 z-50 pl-safe pr-safe">
        <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20"><Clapperboard className="w-4 h-4 text-white" /></div>
            <h1 className="text-base md:text-lg font-bold tracking-tight text-white flex items-center gap-2 font-bebas">MV DIRECTOR <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-sans font-bold">MOBILE AI</span></h1>
        </div>
        <div className="flex items-center gap-1.5">
            <div ref={projectMenuRef} className="relative">
                <button onClick={() => setIsProjectMenuOpen(!isProjectMenuOpen)} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-white/80 transition-colors">Project <ChevronDown className="w-3 h-3 text-white/40" /></button>
                {isProjectMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl z-50 animate-in fade-in zoom-in-95">
                        <button onClick={() => { handleNewProject(); setIsProjectMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-xs text-white/80 hover:bg-white/5"><FilePlus className="w-4 h-4 text-indigo-400" /> New Project</button>
                        <button onClick={() => { importFileRef.current?.click(); setIsProjectMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-xs text-white/80 hover:bg-white/5"><Upload className="w-4 h-4 text-indigo-400" /> Import Project</button>
                        <button onClick={() => { handleExportProject(); setIsProjectMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-xs text-white/80 hover:bg-white/5"><Download className="w-4 h-4 text-indigo-400" /> Export Project</button>
                        <div className="h-px bg-white/10 my-1" />
                        <button onClick={() => { importSettingsFileRef.current?.click(); setIsProjectMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-xs text-white/80 hover:bg-white/5"><Upload className="w-4 h-4 text-green-400" /> Import Settings</button>
                        <button onClick={() => { handleExportSettings(); setIsProjectMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-xs text-white/80 hover:bg-white/5"><Download className="w-4 h-4 text-green-400" /> Export Settings</button>
                    </div>
                )}
            </div>
            
             <div className="flex items-center gap-1.5">
                <PWAInstallButton compact />
                <button
                    onClick={() => setShowKeyVault(true)}
                    className="flex items-center gap-1.5 px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs transition-colors"
                    title={googleUser ? `Signed in as ${googleUser.displayName || googleUser.email}` : "Sign in with Google or configure API keys"}
                >
                    {googleUser ? (
                        <>
                            {googleUser.photoURL ? (
                                <img src={googleUser.photoURL} alt="Google" className="w-4 h-4 rounded-full border border-white/20" />
                            ) : (
                                <div className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center">
                                    {(googleUser.displayName || googleUser.email || 'G')[0].toUpperCase()}
                                </div>
                            )}
                            <span className="hidden lg:inline text-white/90 font-medium max-w-[90px] truncate">{googleUser.displayName || 'Google'}</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                            </svg>
                            <span className="hidden sm:inline text-white/70 font-semibold">Sign In</span>
                        </>
                    )}
                </button>
                <button 
                    onClick={() => setShowKieChat(true)} 
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-indigo-600/30 to-fuchsia-600/30 hover:from-indigo-600/50 hover:to-fuchsia-600/50 text-indigo-200 border border-indigo-500/30 rounded-lg text-xs font-semibold shadow-sm transition-all" 
                    title="Open KIE Multi-Model AI Chat Studio (GPT, Claude, Gemini, DeepSeek)"
                >
                    <Bot className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="hidden sm:inline">KIE Chat</span>
                </button>
                <button onClick={() => setShowChatHistory(true)} className="p-1.5 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors" title="Chat Logs"><MessageSquare className="w-4 h-4" /></button>
                <div ref={settingsMenuRef} className="relative">
                    <button onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)} className="p-1.5 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors" title="Settings & Info"><Settings className="w-4 h-4" /></button>
                    {isSettingsMenuOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl z-50 animate-in fade-in zoom-in-95">
                            <button onClick={() => setIsLiveSyncEnabled(!isLiveSyncEnabled)} className="w-full text-left flex items-center gap-3 px-3 py-2 text-xs text-white/80 hover:bg-white/5">
                                {isLiveSyncEnabled ? <span className="w-4 h-4 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center"><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span></span> : <span className="w-4 h-4 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center"><span className="w-2 h-2 rounded-full bg-red-400"></span></span>}
                                {isLiveSyncEnabled ? 'Live Agent: ON' : 'Live Agent: OFF'}
                            </button>
                            <div className="h-px bg-white/10 my-1" />
                            <button onClick={() => { setShowKieChat(true); setIsSettingsMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-xs text-indigo-300 font-semibold hover:bg-white/5"><Bot className="w-4 h-4 text-indigo-400" /> KIE Chat Studio</button>
                            <button onClick={() => { setShowGitHubConnect(true); setIsSettingsMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-xs text-white/80 hover:bg-white/5"><Github className="w-4 h-4 text-white/80" /> GitHub Connect</button>
                            <button onClick={() => { setShowKeyVault(true); setIsSettingsMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-xs text-white/80 hover:bg-white/5"><Key className="w-4 h-4 text-indigo-400" /> API Settings</button>
                            <button onClick={() => { setShowDevJournal(true); setIsSettingsMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-xs text-white/80 hover:bg-white/5"><ScrollText className="w-4 h-4 text-indigo-400" /> Dev Journal</button>
                            <button onClick={() => { setShowSecondBrain(true); setIsSettingsMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-xs text-white/80 hover:bg-white/5"><Brain className="w-4 h-4 text-purple-400" /> Second Brain</button>
                            <button onClick={() => { setShowCrashLogs(true); setIsSettingsMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-xs text-red-400/90 hover:bg-white/5"><Bug className="w-4 h-4 text-red-400" /> Crash Logs</button>
                             <button onClick={() => { setShowChangelog(true); setIsSettingsMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-xs text-white/80 hover:bg-white/5"><FileText className="w-4 h-4 text-indigo-400" /> Changelog</button>
                        </div>
                    )}
                </div>
            </div>
            <KeepAwake />
        </div>
      </header>

      <main className="flex-1 min-h-0 flex flex-col overflow-hidden relative pb-[calc(4.5rem+max(env(safe-area-inset-bottom,0px),0.5rem))]">
          {activeTab === 'director' ? (
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
              <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar bg-[#0a0a0a] animate-in fade-in duration-300">
                <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8 pb-32">
                  <div className="flex flex-col md:flex-row gap-3 items-center justify-between border-b border-white/5 pb-4">
                    <div>
                      <h1 className="text-xl md:text-2xl font-bebas tracking-wider text-white">Production Director</h1>
                      <p className="text-xs text-white/40 font-mono uppercase tracking-widest">Configure your project specifications and cast</p>
                    </div>
                    <div className="p-1 bg-white/5 rounded-xl flex w-full md:w-auto">
                      <button onClick={() => setProjectData({...projectData, generationMode: 'narrative'})} className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all ${projectData.generationMode === 'narrative' ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}><BookOpen className="w-3.5 h-3.5" /> Story Mode</button>
                      <button onClick={() => setProjectData({...projectData, generationMode: 'technical'})} className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all ${projectData.generationMode === 'technical' ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}><Sliders className="w-3.5 h-3.5" /> Tech Mode</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-indigo-500/20 pb-2">
                            {projectData.generationMode === 'narrative' ? <FileText className="w-3 h-3" /> : <Terminal className="w-3 h-3" />}
                            {projectData.generationMode === 'narrative' ? 'Creative Brief' : 'Technical Specs'}
                          </h2>
                          <div className="flex items-center gap-2">
                              <button onClick={() => setShowHistoryModal(projectData.generationMode === 'narrative' ? 'lyrics' : 'tech')} className="text-[10px] font-bold text-white/40 hover:text-white flex items-center gap-1.5"><History className="w-3 h-3" /> History</button>
                              <button onClick={() => setShowPromptGuide(true)} className="p-1.5 text-white/30 hover:text-indigo-400 transition-colors" title="Open Director's Handbook"><HelpCircle className="w-4 h-4" /></button>
                          </div>
                        </div>
                        {projectData.generationMode === 'narrative' ? (
                          <div className="space-y-3">
                            <textarea 
                              value={projectData.lyrics} 
                              onBlur={(e) => {
                                saveToHistory('lyrics', e.target.value);
                                try { localStorage.setItem('mv_latest_lyrics', e.target.value); } catch {}
                              }} 
                              onChange={(e) => {
                                const val = e.target.value;
                                setProjectData(prev => ({ ...prev, lyrics: val }));
                                try { localStorage.setItem('mv_latest_lyrics', val); } catch {}
                              }}
                              onPaste={(e) => {
                                const pastedText = e.clipboardData?.getData('text');
                                if (pastedText) {
                                  setTimeout(() => {
                                    const currentVal = (e.target as HTMLTextAreaElement).value;
                                    setProjectData(prev => ({ ...prev, lyrics: currentVal }));
                                    try { localStorage.setItem('mv_latest_lyrics', currentVal); } catch {}
                                  }, 10);
                                }
                              }}
                              className="w-full h-48 bg-black border border-white/10 rounded-xl p-4 text-sm text-white/80 focus:border-indigo-500 outline-none resize-none custom-scrollbar" 
                              placeholder="Paste lyrics, poem, or story here..." 
                            />
                            <div className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-white/5">
                              <label className="text-[10px] font-bold text-white/60 flex items-center gap-1.5 uppercase tracking-widest">
                                <Music className="w-3 h-3 text-pink-400" /> Reference Audio
                              </label>
                              <div className="flex items-center gap-3">
                                {projectData.localFiles && projectData.localFiles.length > 0 && (
                                  <span className="text-xs text-pink-400 font-medium truncate max-w-[150px] sm:max-w-[200px]" title={projectData.localFiles[0].name}>
                                    {projectData.localFiles[0].name}
                                  </span>
                                )}
                                <label className="cursor-pointer px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-md text-[10px] font-bold text-white transition-colors border border-white/10">
                                  {projectData.localFiles?.length ? 'Change Song' : 'Attach Song'}
                                  <input 
                                    type="file" 
                                    className="hidden" 
                                     
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                          if (!file.type.includes('audio') && !file.type.includes('video')) {
                                              addLog('Invalid file. Please select an audio file.', 'error');
                                              return;
                                          }
                                          const url = URL.createObjectURL(file);
                                          setProjectData(p => ({ ...p, soundtrackUrl: url, localPlaylist: undefined, currentTrackIndex: undefined, localFiles: [file] }));
                                          // Note: We don't auto-play here, just attach it for Gemini
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <textarea 
                              value={projectData.technicalInstructions} 
                              onBlur={(e) => saveToHistory('tech', e.target.value)} 
                              onChange={(e) => setProjectData({...projectData, technicalInstructions: e.target.value})} 
                              className="w-full h-48 bg-black border border-white/10 rounded-xl p-4 text-sm text-indigo-200 font-mono focus:border-indigo-500 outline-none resize-none custom-scrollbar" 
                              placeholder="1. Wide shot of the cityscape at dusk.&#10;2. Medium shot of the character looking thoughtful."
                            />
                            <div className="space-y-2 pt-2">
                              <div className="flex items-center justify-between">
                                <label className="text-[9px] font-bold text-white/30 flex items-center gap-1.5 uppercase tracking-widest"><ListOrdered className="w-3 h-3" /> Instruction Presets</label>
                                <button onClick={() => setShowInstructionPresetsModal(true)} className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest transition-colors">Manage</button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {instructionPresets.map(p => (
                                  <button key={p.id} onClick={() => setProjectData({...projectData, technicalInstructions: p.instructions})} className="flex-auto text-center py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-bold text-white/60 transition-colors border border-white/5">{p.label}</button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-6 shadow-2xl">
                        <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-indigo-500/20 pb-2"><Settings className="w-3.5 h-3.5" /> Project Specifications</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2 md:col-span-2">
                              <label className="text-[10px] font-bold text-white/60 flex items-center gap-1.5 uppercase tracking-widest"><ShieldAlert className="w-3 h-3 text-amber-400" /> Creative Context / Manifesto</label>
                              <textarea
                                  value={projectData.creativeContext}
                                  onChange={(e) => setProjectData(p => ({ ...p, creativeContext: e.target.value }))}
                                  className="w-full h-24 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-indigo-500 text-amber-100/80 resize-none custom-scrollbar"
                                  placeholder="E.g., This is for a horror film with theatrical effects. This can help avoid safety blocks for artistic content."
                              />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                              <label className="text-[10px] font-bold text-white/60 flex items-center gap-1.5 uppercase tracking-widest"><Repeat className="w-3 h-3" /> Recurring Motifs / Symbols</label>
                              <input
                                  type="text"
                                  value={projectData.recurringMotifs}
                                  onChange={(e) => setProjectData(p => ({ ...p, recurringMotifs: e.target.value }))}
                                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-indigo-500 text-white"
                                  placeholder="E.g., a shattered mirror, a single red rose..."
                              />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <div className="flex items-center justify-between">
                              <label className="text-[10px] font-bold text-white/60 flex items-center gap-1.5 uppercase tracking-widest"><Palette className="w-3 h-3" /> Master Art Style</label>
                              <button onClick={() => setShowArtStylePresetsModal(true)} className="text-[9px] font-bold text-purple-400 hover:text-purple-300 uppercase tracking-widest transition-colors">Manage</button>
                            </div>
                            <div className="relative">
                              <select value={selectedArtStyle} onChange={handleArtStyleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-indigo-500 text-indigo-100 appearance-none pr-10">
                                {artStylePresets.map(preset => (
                                  preset.label !== "Other (Custom)" && <option key={preset.label} value={preset.label} className="bg-[#1a1a1a] text-white">{preset.label}</option>
                                ))}
                                <option value="Other (Custom)" className="bg-[#1a1a1a] text-white">Other (Custom)</option>
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                            </div>
                            {selectedArtStyle === "Other (Custom)" && (
                              <textarea value={projectData.artStyle} onChange={(e) => setProjectData(prev => ({...prev, artStyle: e.target.value}))} className="w-full h-20 mt-2 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-indigo-500 text-indigo-100 resize-none custom-scrollbar animate-in fade-in duration-300" placeholder="e.g., Psychedelic oil painting, 1960s rock poster..."/>
                            )}
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-white/60 flex items-center gap-1.5 uppercase tracking-widest"><Maximize className="w-3 h-3" /> Aspect Ratio</label>
                            <AspectRatioDropdown 
                              value={projectData.aspectRatio} 
                              onChange={(val) => setProjectData(prev => ({...prev, aspectRatio: val}))} 
                            />
                          </div>

                          <div className="space-y-4 md:col-span-2 p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="flex items-center justify-between">
                              <label className="text-[10px] font-bold text-white/60 flex items-center gap-1.5 uppercase tracking-widest"><Hash className="w-3 h-3" /> Scene Generation</label>
                              <div className="flex bg-black/50 rounded-lg p-1 border border-white/10">
                                <button onClick={() => setProjectData(prev => ({...prev, useAutoSceneCount: true}))} className={`px-3 py-1 rounded-md text-[9px] font-bold transition-all ${projectData.useAutoSceneCount ? 'bg-indigo-600 text-white' : 'text-white/40 hover:text-white'}`}>AUTO (DURATION)</button>
                                <button onClick={() => setProjectData(prev => ({...prev, useAutoSceneCount: false}))} className={`px-3 py-1 rounded-md text-[9px] font-bold transition-all ${!projectData.useAutoSceneCount ? 'bg-indigo-600 text-white' : 'text-white/40 hover:text-white'}`}>MANUAL (COUNT)</button>
                              </div>
                            </div>

                            {projectData.useAutoSceneCount ? (
                              <div className="space-y-3 animate-in fade-in duration-300">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-white/60 flex items-center gap-1.5 uppercase tracking-widest"><Clock className="w-3 h-3" /> Total Duration</label>
                                  <input type="text" value={projectData.totalDuration} onChange={(e) => setProjectData(prev => ({...prev, totalDuration: e.target.value}))} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-indigo-500 text-white font-mono" placeholder="3:00"/>
                                </div>
                                <div className="w-full bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-4 py-3 flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-indigo-300">{calculateEstimatedScenes(projectData.totalDuration, "7s")} SCENES</span>
                                    <span className="text-[9px] text-indigo-400/60 font-mono uppercase tracking-widest">(Estimated at 7s/scene)</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2 animate-in fade-in duration-300">
                                <label className="text-[10px] font-bold text-white/60 flex items-center gap-1.5 uppercase tracking-widest"><Hash className="w-3 h-3" /> Exact Scene Count</label>
                                <input 
                                    type="number" 
                                    value={projectData.sceneCount === 0 ? '' : projectData.sceneCount} 
                                    onChange={(e) => {
                                        const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                                        setProjectData(prev => ({...prev, sceneCount: isNaN(val) ? 0 : val}));
                                    }}
                                    onBlur={() => {
                                        if (projectData.sceneCount < 1) setProjectData(prev => ({...prev, sceneCount: 4}));
                                    }}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-indigo-500 text-white font-mono"
                                    placeholder="e.g., 12"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-12">
                      <div className="space-y-4">
                        <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-indigo-500/20 pb-2"><Mic className="w-3 h-3" /> Cast</h2>
                        <div className="flex flex-wrap gap-2">
                          {(projectData.characters || []).map(char => (
                            <div key={char.id} onClick={() => setEditingCharacter(char)} className="group relative flex cursor-pointer items-center gap-2 pl-4 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs whitespace-nowrap hover:bg-indigo-500/10 hover:border-indigo-500/50 transition-colors">
                              <span className="font-medium">{char.name}</span>
                            </div>
                          ))}
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4 shadow-xl">
                          <div className="space-y-2 mb-4 pb-4 border-b border-white/10">
                            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Generate from Concept</label>
                            <div className="flex gap-2">
                              <input 
                                placeholder="e.g., A tall, muscular cyberpunk hacker with neon pink hair" 
                                value={charPrompt} 
                                onChange={e => setCharPrompt(e.target.value)} 
                                onKeyDown={e => e.key === 'Enter' && handleGenerateCharFromPrompt()}
                                className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-indigo-500" 
                              />
                              <button 
                                onClick={handleGenerateCharFromPrompt} 
                                disabled={isGeneratingChar || !charPrompt.trim()}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap"
                              >
                                {isGeneratingChar ? 'Generating...' : 'Generate'}
                              </button>
                            </div>
                          </div>

                          <input placeholder="Character Name" value={newCharName} onChange={e => setNewCharName(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500" />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                               <div className="flex flex-col gap-2">
                                 <select
                                   name="facialFeatures"
                                   value={newCharDna.facialFeatures.startsWith('REF_') ? newCharDna.facialFeatures : 'text'}
                                   onChange={(e) => {
                                     if (e.target.value === 'text') {
                                       setNewCharDna(prev => ({ ...prev, facialFeatures: '' }));
                                     } else {
                                       handleDnaChange(e);
                                     }
                                   }}
                                   className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-indigo-500 appearance-none"
                                 >
                                   <option value="text" className="bg-[#1a1a1a] text-white">Manual Text Description</option>
                                   {(projectData.referenceImages || []).map((ref, idx) => {
                                       const linkedChar = ref.characterId ? (projectData.characters || []).find(c => c.id === ref.characterId) : null;
                                       const label = linkedChar ? `Character: ${linkedChar.name}` : (ref.description || 'Unnamed Reference');
                                       return (
                                         <option key={ref.id} value={`REF_${idx + 1}`} className="bg-[#1a1a1a] text-white">
                                           REF_{idx + 1} - {label}
                                         </option>
                                       );
                                   })}
                                 </select>
                                 {!newCharDna.facialFeatures.startsWith('REF_') && (
                                   <input placeholder="Describe facial features manually..." name="facialFeatures" value={newCharDna.facialFeatures} onChange={handleDnaChange} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-indigo-500" />
                                 )}
                               </div>
                               <input placeholder="Hair Style" name="hairStyle" value={newCharDna.hairStyle} onChange={handleDnaChange} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-indigo-500" />
                               <input placeholder="Body Type" name="bodyType" value={newCharDna.bodyType} onChange={handleDnaChange} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-indigo-500" />
                               <input placeholder="Height" name="height" value={newCharDna.height} onChange={handleDnaChange} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-indigo-500" />
                               <input placeholder="Weight" name="weight" value={newCharDna.weight} onChange={handleDnaChange} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-indigo-500" />
                               <input placeholder="Clothing Style" name="clothingStyle" value={newCharDna.clothingStyle} onChange={handleDnaChange} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-indigo-500" />
                               <input placeholder="Personality" name="personality" value={newCharDna.personality} onChange={handleDnaChange} className="w-full md:col-span-2 bg-black border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-indigo-500" />
                               <input placeholder="Key Expressions" name="keyExpressions" value={newCharDna.keyExpressions} onChange={handleDnaChange} className="w-full md:col-span-2 bg-black border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-indigo-500" />
                          </div>
                          <div className="p-3 bg-amber-900/10 border border-amber-500/10 rounded-xl"><p className="text-[10px] text-amber-200/60 leading-relaxed italic">Character names are automatically sanitized for AI safety.</p></div>
                          <div className="flex gap-2">
                            <button onClick={handleAutoStyleCharacter} disabled={isGeneratingChar} className="flex-1 py-3 bg-fuchsia-600/10 text-fuchsia-400 rounded-xl text-xs font-bold hover:bg-fuchsia-600/20 transition-colors border border-fuchsia-500/20 disabled:opacity-50">✨ AUTO-STYLE</button>
                            <button onClick={handleAddCharacter} disabled={isGeneratingChar} className="flex-1 py-3 bg-indigo-600/10 text-indigo-400 rounded-xl text-xs font-bold hover:bg-indigo-600/20 transition-colors border border-indigo-500/20 disabled:opacity-50">+ ADD TO CAST</button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-indigo-500/20 pb-2"><ImageIcon className="w-3 h-3" /> Visual References</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {(projectData.referenceImages || []).map((ref, index) => {
                                const character = ref.characterId ? (projectData.characters || []).find(c => c.id === ref.characterId) : null;
                                return (
                                    <div key={ref.id} className="relative group aspect-square">
                                        <button onClick={() => setEditingReference(ref)} className={`w-full h-full rounded-2xl border-2 hover:border-indigo-500 overflow-hidden transition-all shadow-xl bg-black ${ref.enabled === false ? 'opacity-30 border-dashed border-white/20' : 'border-white/10'}`}>
                                            <img src={ref.data} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                            <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 backdrop-blur-md rounded-lg text-[8px] font-bold text-white/80 border border-white/10 uppercase tracking-wider">REF_{index + 1}</div>
                                            
                                            <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1">
                                              {(ref.roles || []).slice(0, 3).map(role => (
                                                <span key={role} className="px-1.5 py-0.5 bg-indigo-600/80 backdrop-blur-sm text-[7px] font-bold text-white rounded uppercase tracking-tighter">
                                                  {role}
                                                </span>
                                              ))}
                                              {ref.focusTags && ref.focusTags.length > 0 && (
                                                <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-500/80 backdrop-blur-sm text-[7px] font-black text-black rounded uppercase tracking-tighter shadow-lg">
                                                  <Star className="w-2 h-2 fill-current" /> LOCK
                                                </div>
                                              )}
                                              {ref.isMasterArt && (
                                                <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-purple-500/80 backdrop-blur-sm text-[7px] font-black text-white rounded uppercase tracking-tighter shadow-lg">
                                                  <Star className="w-2 h-2 fill-current" /> MASTER ART
                                                </div>
                                              )}
                                            </div>

                                            {character && (
                                                <div className="absolute top-2 right-2 px-2 py-1 bg-indigo-600/90 text-white text-[8px] font-bold rounded-lg border border-white/20 backdrop-blur-md shadow-lg">
                                                    {character.name}
                                                </div>
                                            )}
                                        </button>
                                        
                                        <div className="absolute -top-2 -right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                            <button onClick={(e) => { e.stopPropagation(); handleRemoveReference(ref.id); }} className="p-1.5 bg-black border border-white/10 rounded-full text-white/40 hover:bg-red-500 hover:text-white shadow-xl" title="Delete Reference"><X className="w-3.5 h-3.5" /></button>
                                            <button onClick={(e) => { e.stopPropagation(); handleToggleReferenceEnabled(ref.id); }} className={`p-1.5 bg-black border border-white/10 rounded-full shadow-xl ${ref.enabled === false ? 'text-white/40 hover:bg-white/20' : 'text-indigo-400 hover:bg-indigo-500/20'}`} title={ref.enabled === false ? "Enable Reference" : "Disable Reference"}>
                                                {ref.enabled === false ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                            </button>
                                        </div>

                                    </div>
                                );
                            })}
                            <button onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 hover:bg-white/5 hover:border-indigo-500/50 transition-all text-white/20 hover:text-indigo-400">
                              <Plus className="w-6 h-6" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">Upload</span>
                            </button>
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden"  multiple onChange={handleImageUpload} />
                      </div>

                      <div className="pt-8">
                        <button 
                          onClick={handleDirectorMagic} 
                          disabled={isDirecting} 
                          className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-indigo-600/20 flex items-center justify-center gap-3 disabled:opacity-50 transition-all group"
                        >
                          {isDirecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />} 
                          {isDirecting ? 'Directing Production...' : 'Initialize Production Plan'}
                        </button>
                        {directorError && (
                          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs leading-relaxed">
                            <strong className="font-bold block mb-1">Generation Failed</strong>
                            {directorError}
                          </div>
                        )}
                        <p className="text-center mt-4 text-[10px] text-white/20 uppercase tracking-widest font-bold">Generates a complete scene-by-scene storyboard</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'storyboard' ? (
            <div className="flex-1 min-h-0 bg-black/50 overflow-hidden flex flex-col">
              <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-6">
                {directorPlan && (
                  <div className="flex-shrink-0 mb-6 flex flex-col xl:flex-row items-start xl:items-center justify-between pb-4 border-b border-white/5 gap-4">
                    <div className="flex items-center gap-3"><div className="p-2 bg-indigo-600/20 rounded-lg"><Clapperboard className="w-5 h-5 text-indigo-400" /></div><div><h2 className="text-lg font-bold text-white">Production Storyboard</h2><p className="text-xs text-white/50 font-mono uppercase tracking-widest">{directorPlan.title} • {directorPlan.scenes.length} Scenes</p></div></div>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="mr-2 flex items-center gap-2">
                          <AspectRatioDropdown 
                            value={projectData.aspectRatio} 
                            onChange={(val) => setProjectData(prev => ({...prev, aspectRatio: val}))} 
                            className="w-[140px]"
                          />
                          {projectData.characters && projectData.characters.length > 0 && (
                            <GlobalCharacterDropdown 
                              characters={projectData.characters}
                              scenes={directorPlan.scenes}
                              onUpdateScenes={(newScenes) => {
                                setDirectorPlan(currentPlan => {
                                  if (!currentPlan) return null;
                                  const newPlan = { ...currentPlan, scenes: newScenes };
                                  savePlanToDB(newPlan);
                                  return newPlan;
                                });
                              }}
                            />
                          )}
                        </div>
                        {isBatchGenerating ? (
                          <button onClick={handleStopBatch} className="flex items-center gap-2 px-3 py-1.5 bg-red-600/80 hover:bg-red-500 rounded-lg text-xs font-bold text-white transition-colors"><XCircle className="w-3.5 h-3.5" /> Stop Generation</button>
                        ) : (
                          <button onClick={handleBatchGenerate} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600/80 hover:bg-indigo-500 rounded-lg text-xs font-bold text-white transition-colors"><Bot className="w-3.5 h-3.5" /> Generate All Images</button>
                        )}
                        <button onClick={handleDownloadAllImages} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 rounded-lg text-xs font-bold text-indigo-300 transition-colors"><Download className="w-3.5 h-3.5" /> Download All</button>
                        <button onClick={() => setShowSeedanceModal(true)} className="flex items-center gap-2 px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/40 rounded-lg text-xs font-bold text-purple-300 transition-colors"><LayoutGrid className="w-3.5 h-3.5" /> Seedance Grid</button>
                        <button onClick={() => handleCopyAll('image')} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-white/60 transition-colors">{copied === 'image' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />} Copy Stills</button>
                        <button onClick={() => handleCopyAll('video')} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-white/60 transition-colors">{copied === 'video' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />} Copy Motion</button>
                    </div>
                  </div>
                )}
                {directorPlan ? (
                  <div className="pb-32">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {directorPlan.scenes.map((scene, idx) => (
                        <SceneCard key={idx} scene={scene} index={idx} onGenerate={params => handleGenerateScene(idx, params || { aspectRatio: scene.aspectRatio || projectData.aspectRatio, seed: 0 })} onStopGenerate={() => handleStopGenerateScene(idx)} onUpdate={updates => { setDirectorPlan(currentPlan => { if (!currentPlan) return null; const newScenes = currentPlan.scenes.map((s, i) => i === idx ? { ...s, ...updates } : s); return { ...currentPlan, scenes: newScenes }; }); }} onEnhance={() => handleEnhancePrompt(idx)} onEnhanceVideo={() => handleEnhanceMotionPrompt(idx)} projectData={projectData}
            apiKey={apiKeySourceRef.current === 'custom' ? apiKeysRef.current.google : undefined} />
                      ))}
                    </div>
                    <div className="mt-8 flex justify-center">
                      <button 
                        onClick={handleContinueDirectorMagic} 
                        disabled={isDirecting}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 rounded-xl text-sm font-bold text-indigo-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDirecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clapperboard className="w-4 h-4" />}
                        {isDirecting ? 'Generating Next Scenes...' : 'Continue Storyboard (Generate Next Scenes)'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-white/10 space-y-4">
                    <Clapperboard className="w-16 h-16 opacity-20" />
                    <p className="uppercase tracking-widest font-bold">No Plan Active</p>
                    <button onClick={() => setActiveTab('director')} className="px-4 py-2 bg-indigo-600 rounded-lg text-white text-xs font-bold hover:bg-indigo-500 transition-colors">Go to Director to Create Plan</button>
                  </div>
                )}
              </div>
            </div>
          ) : null}
          <div className={`flex-1 min-h-0 flex-col overflow-hidden ${activeTab === 'studio' ? 'flex' : 'hidden'}`}>
            <StudioChat apiKeys={apiKeys} apiKeySource={apiKeySource} onLog={addLog} projectData={projectData}
            apiKey={apiKeySourceRef.current === 'custom' ? apiKeysRef.current.google : undefined} setProjectData={setProjectData} directorPlan={directorPlan} setDirectorPlan={setDirectorPlan} />
          </div>
          <div className={`flex-1 min-h-0 flex-col overflow-hidden ${activeTab === 'lab' ? 'flex' : 'hidden'}`}>
            <PromptGenerator projectData={projectData}
            apiKey={apiKeySourceRef.current === 'custom' ? apiKeysRef.current.google : undefined} apiKeys={apiKeys} apiKeySource={apiKeySource} onLog={addLog} />
          </div>
          <div className={`flex-1 min-h-0 flex-col overflow-hidden ${activeTab === 'subtitles' ? 'flex' : 'hidden'}`}>
            <SubtitlesTab 
              apiKeys={apiKeys} 
              apiKeySource={apiKeySource} 
              onMediaSwap={(file) => {
                  const url = URL.createObjectURL(file);
                  setProjectData(p => ({ ...p, soundtrackUrl: url, localPlaylist: undefined, currentTrackIndex: undefined, localFiles: [file] }));
                  setIsPlaying(true);
                  if (file.type.includes('video')) {
                      setShowVideo(true);
                  }
              }} 
            />
          </div>
          <div className={`flex-1 min-h-0 flex-col overflow-hidden ${activeTab === 'keyframes' ? 'flex' : 'hidden'}`}>
            <KeyframeAnalyzer apiKeys={apiKeys as any} apiKeySource={apiKeySource as any} />
          </div>
          <div className={`flex-1 min-h-0 flex-col overflow-hidden ${activeTab === 'xplore' ? 'flex' : 'hidden'}`}>
            <XploreTab projectData={projectData} directorPlan={directorPlan} />
          </div>
          <div className={`flex-1 min-h-0 flex-col overflow-hidden ${activeTab === 'music' ? 'flex' : 'hidden'}`}>
             <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                 <div className="max-w-4xl mx-auto space-y-8">
                     <div className="flex items-center justify-between">
                         <div>
                             <h2 className="text-2xl font-black text-white font-bebas tracking-wide">SOUNDTRACK</h2>
                             <p className="text-white/50 text-sm">Manage your project's audio and music.</p>
                         </div>
                     </div>
                     <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-6 shadow-2xl">
                         <div className="space-y-2">
                             <div className="flex items-center justify-between">
                                 <label className="text-[10px] font-bold text-white/60 flex items-center gap-1.5 uppercase tracking-widest"><Music className="w-3 h-3 text-pink-400" /> Soundtrack URL (YouTube or Audio Link)</label>
                                 <button onClick={() => setShowYouTubeModal(true)} className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors font-medium">
                                     <Youtube className="w-3.5 h-3.5" />
                                     Browse YouTube
                                 </button>
                             </div>
                             <div className="flex flex-col md:flex-row gap-2">
                                 <div className="flex-1 flex gap-2">
                                     <input
                                         type="text"
                                         value={localSoundtrackUrl}
                                         onChange={(e) => setLocalSoundtrackUrl(e.target.value)}
                                         onKeyDown={(e) => {
                                             if (e.key === 'Enter') {
                                                 setProjectData(p => ({ ...p, soundtrackUrl: localSoundtrackUrl, localPlaylist: undefined, currentTrackIndex: undefined, localFiles: undefined }));
                                                 setIsPlaying(true);
                                             }
                                         }}
                                         className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-pink-500 text-white"
                                         placeholder="E.g., https://www.youtube.com/watch?v=..."
                                     />
                                     <button 
                                         onClick={() => {
                                             setProjectData(p => ({ ...p, soundtrackUrl: localSoundtrackUrl, localPlaylist: undefined, currentTrackIndex: undefined, localFiles: undefined }));
                                             setIsPlaying(true);
                                         }}
                                         className="px-4 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                                     >
                                         <Play className="w-4 h-4" /> Play
                                     </button>
                                 </div>
                                 <div className="flex gap-2">
                                     <button 
                                         onClick={() => document.getElementById('audio-upload')?.click()}
                                         className="flex-1 md:flex-none px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center justify-center gap-2"
                                     >
                                         <Upload className="w-4 h-4" /> Local File
                                     </button>
                                     <input 
                                         type="file" 
                                         id="audio-upload" 
                                         className="hidden" 
                                         
                                         onChange={(e) => {
                                             const file = e.target.files?.[0];
                                             if (file) {
                                                 if (!file.type.includes('audio') && !file.type.includes('video')) {
                                                     addLog('Invalid file. Please select an audio file.', 'error');
                                                     return;
                                                 }
                                                 const url = URL.createObjectURL(file);
                                                 setProjectData(p => ({ ...p, soundtrackUrl: url, localPlaylist: undefined, currentTrackIndex: undefined, localFiles: [file] }));
                                                 setIsPlaying(true);
                                             }
                                         }}
                                     />
                                     <button 
                                         onClick={() => document.getElementById('audio-upload-folder')?.click()}
                                         className="flex-1 md:flex-none px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center justify-center gap-2"
                                     >
                                         <Upload className="w-4 h-4" /> Local Folder
                                     </button>
                                     <input 
                                         type="file" 
                                         id="audio-upload-folder" 
                                         className="hidden" 
                                         
                                         // @ts-expect-error webkitdirectory is non-standard but supported
                                         webkitdirectory="true"
                                         directory="true"
                                         multiple
                                         onChange={(e) => {
                                             const allFiles = Array.from(e.target.files || []);
                                             const files = allFiles.filter(f => f.type.startsWith('audio/') || f.type.startsWith('video/'));
                                             if (files.length === 0 && allFiles.length > 0) {
                                                 addLog('No valid audio files found in the selected folder.', 'error');
                                             } else if (files.length > 0) {
                                                 const playlist = files.map(f => ({ name: f.name, url: URL.createObjectURL(f) }));
                                                 setProjectData(p => ({ ...p, soundtrackUrl: playlist[0].url, localPlaylist: playlist, currentTrackIndex: 0, localFiles: files }));
                                                 setIsPlaying(true);
                                             }
                                         }}
                                     />
                                 </div>
                             </div>
                             <p className="text-[9px] text-white/40 mt-1">
                                 Supported: YouTube, SoundCloud, Vimeo, Twitch, or direct audio links (.mp3, .wav). <br/>
                                 *Note: Some YouTube music videos block embedding. Use the 'Pop out' (Maximize) button on the player if it fails to play.*
                             </p>
                         </div>

                         <div className="pt-6 border-t border-white/10 space-y-4">
                              <div>
                                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                      <Wand2 className="w-4 h-4 text-pink-400" /> AI Music & Cover Studio (Suno AI)
                                  </h3>
                                  <p className="text-xs text-white/50 mt-1">Generate original AI soundtrack songs from lyrics, or create AI covers of existing songs.</p>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-white/60 uppercase">Model Engine</label>
                                      <select 
                                          value={coverModel} 
                                          onChange={(e) => setCoverModel(e.target.value as any)} 
                                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-pink-500 text-white"
                                      >
                                          <option value="V6">Suno V6.0 Flagship (Latest SOTA - Multi-Genre)</option>
                                          <option value="V6_WILD">Suno V6 Wild (Experimental & Expressive)</option>
                                          <option value="V6_MINI">Suno V6 Mini (Turbo Fast)</option>
                                          <option value="V5_5">Suno V5.5 Pro</option>
                                          <option value="V5">Suno V5</option>
                                          <option value="V4">Suno V4 (Classic)</option>
                                          <option value="V3_5">Suno V3.5</option>
                                      </select>
                                  </div>
                                  <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-white/60 uppercase">Track Type</label>
                                      <button 
                                          type="button"
                                          onClick={() => setCoverInstrumental(!coverInstrumental)}
                                          className={`w-full flex items-center justify-between px-3 py-2 border rounded-xl text-xs font-semibold transition-all ${coverInstrumental ? "bg-pink-500/20 border-pink-500/50 text-pink-300" : "bg-black/40 border-white/10 text-white/70"}`}
                                      >
                                          <span>{coverInstrumental ? "Instrumental (No Vocals)" : "Vocal Track (With Lyrics)"}</span>
                                          <span className="text-[10px] uppercase font-bold text-pink-400">{coverInstrumental ? "ON" : "OFF"}</span>
                                      </button>
                                  </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-white/60 uppercase">Title</label>
                                      <input type="text" value={coverTitle} onChange={(e) => setCoverTitle(e.target.value)} placeholder="e.g. Neon Dreams" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-pink-500 text-white" />
                                  </div>
                                  <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-white/60 uppercase">Style</label>
                                      <input type="text" value={coverStyle} onChange={(e) => setCoverStyle(e.target.value)} placeholder="e.g. Synthwave, Female Vocals" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-pink-500 text-white" />
                                  </div>
                              </div>
                              <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-white/60 uppercase">
                                      {coverInstrumental ? "Style Prompt & Instrumentation" : "Lyrics / Prompt (Required)"}
                                  </label>
                                  <textarea 
                                      value={coverPrompt} 
                                      onChange={(e) => setCoverPrompt(e.target.value)} 
                                      rows={3} 
                                      placeholder={coverInstrumental ? "Describe instruments, tempo, and mood..." : "Enter your custom lyrics here..."} 
                                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-pink-500 text-white custom-scrollbar resize-none"
                                  />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                 <div className="space-y-1 lg:col-span-3">
                                      <label className="text-[10px] font-bold text-white/60 uppercase">Negative Tags</label>
                                      <input type="text" value={coverNegativeTags} onChange={(e) => setCoverNegativeTags(e.target.value)} placeholder="e.g. heavy metal, male vocal" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-pink-500 text-white" />
                                 </div>
                                 <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-white/60 uppercase">Vocal Gender</label>
                                      <select value={coverVocalGender} onChange={(e) => setCoverVocalGender(e.target.value as any)} disabled={coverInstrumental} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-pink-500 text-white disabled:opacity-40">
                                          <option value="">Not Specified</option>
                                          <option value="m">Male (m)</option>
                                          <option value="f">Female (f)</option>
                                      </select>
                                 </div>
                              </div>

                              <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2">
                                  <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                                          <Sparkles className="w-3.5 h-3.5" /> Suno Voice Persona (Custom Singer / Clone)
                                      </span>
                                      <button 
                                          type="button" 
                                          onClick={() => setShowPersonaSettings(!showPersonaSettings)}
                                          className="text-[10px] text-white/50 hover:text-white underline"
                                      >
                                          {showPersonaSettings ? "Hide Voice Settings" : "Configure Voice ID"}
                                      </button>
                                  </div>
                                  {showPersonaSettings && (
                                      <div className="space-y-2 pt-1 animate-in fade-in">
                                          <p className="text-[10px] text-white/40">Enter a Suno Persona / Voice ID to generate with a specific cloned voice or consistent artist profile.</p>
                                          <input 
                                              type="text" 
                                              value={coverPersonaId} 
                                              onChange={(e) => setCoverPersonaId(e.target.value)} 
                                              placeholder="e.g. persona_abc123 or Voice Profile ID" 
                                              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-pink-500 text-white"
                                          />
                                      </div>
                                  )}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                 <div className="space-y-1">
                                     <label className="text-[10px] font-bold text-white/60 uppercase">Style Weight ({coverStyleWeight})</label>
                                     <input type="range" min="0" max="1" step="0.01" value={coverStyleWeight} onChange={(e) => setCoverStyleWeight(parseFloat(e.target.value))} className="w-full accent-pink-500" />
                                 </div>
                                 <div className="space-y-1">
                                     <label className="text-[10px] font-bold text-white/60 uppercase">Audio Weight ({coverAudioWeight})</label>
                                     <input type="range" min="0" max="1" step="0.01" value={coverAudioWeight} onChange={(e) => setCoverAudioWeight(parseFloat(e.target.value))} className="w-full accent-pink-500" />
                                 </div>
                                 <div className="space-y-1">
                                     <label className="text-[10px] font-bold text-white/60 uppercase">Weirdness ({coverWeirdnessConstraint})</label>
                                     <input type="range" min="0" max="1" step="0.01" value={coverWeirdnessConstraint} onChange={(e) => setCoverWeirdnessConstraint(parseFloat(e.target.value))} className="w-full accent-pink-500" />
                                 </div>
                              </div>

                              <div className="flex justify-end">
                                  <button 
                                      disabled={isCovering || !coverPrompt || !coverStyle || !coverTitle}
                                      onClick={async () => {
                                          if (apiKeySource === "custom" && !apiKeys.kie) {
                                               addLog("You need to set a custom Kie AI API key to use Suno generations.", "error");
                                               setShowKeyVault(true);
                                               return;
                                          }
                                          if (apiKeySource === "builtin") {
                                               addLog("Built-in API key does not support Suno generations. Please enter your Kie AI API key.", "error");
                                               setShowKeyVault(true);
                                               return;
                                          }
                                          
                                          try {
                                              setCurrentCoverTaskId("");
                                              setIsCovering(true);
                                              const actionName = (localSoundtrackUrl && !localSoundtrackUrl.startsWith("blob:")) ? "AI Song Cover" : "Original AI Music";
                                              setCoverStatus(`Initiating ${actionName}...`);
                                              addLog(`Initiating ${actionName} with Suno (${coverModel})...`, "info");
                                              const results = await generateSunoCover({
                                                  uploadUrl: (localSoundtrackUrl && !localSoundtrackUrl.startsWith("blob:")) ? localSoundtrackUrl : undefined, 
                                                  prompt: coverPrompt, 
                                                  style: coverStyle, 
                                                  title: coverTitle, 
                                                  model: coverModel,
                                                  instrumental: coverInstrumental,
                                                  apiKey: apiKeys.kie!, 
                                                  addLog,
                                                  onStatus: setCoverStatus,
                                                  onTaskId: setCurrentCoverTaskId,
                                                  negativeTags: coverNegativeTags,
                                                  vocalGender: coverVocalGender,
                                                  styleWeight: coverStyleWeight,
                                                  weirdnessConstraint: coverWeirdnessConstraint,
                                                  audioWeight: coverAudioWeight,
                                                  personaId: coverPersonaId.trim() || undefined
                                              });
                                              if (results && results.length > 0) {
                                                  setLocalSoundtrackUrl(results[0].url);
                                                  setProjectData(p => ({ ...p, soundtrackUrl: results[0].url, localPlaylist: results, currentTrackIndex: 0, localFiles: undefined }));
                                                  setIsPlaying(true);
                                                  addLog(`AI track generated successfully! ${results.length} track(s) loaded into player.`, "success");
                                              } else {
                                                  throw new Error("No audio tracks were returned from Suno.");
                                              }
                                          } catch (e: any) {
                                              addLog(`Suno generation failed: ${e.message}`, "error");
                                          } finally {
                                              setIsCovering(false);
                                              setCoverStatus("");
                                          }
                                      }}
                                      className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${isCovering ? "bg-white/10 text-white/40 cursor-not-allowed" : (!coverPrompt || !coverStyle || !coverTitle) ? "bg-pink-900/40 text-white/40 cursor-not-allowed" : "bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-900/20"}`}
                                  >
                                      {isCovering ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                                      {isCovering ? (coverStatus || "Generating Audio...") : ((localSoundtrackUrl && !localSoundtrackUrl.startsWith("blob:")) ? "Generate AI Cover" : "Generate Original Suno Track")}
                                  </button>
                             </div>
                             
                             {currentCoverTaskId && (
                                 <div className="flex flex-col gap-1 items-end mt-2 animate-in fade-in slide-in-from-top-2">
                                     <p className="text-[10px] text-white/50">Task ID (Save this to recover later if needed)</p>
                                     <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5">
                                         <span className="text-xs font-mono text-pink-400 select-all">{currentCoverTaskId}</span>
                                         <button 
                                             onClick={() => {
                                                 navigator.clipboard.writeText(currentCoverTaskId);
                                                 addLog("Task ID copied to clipboard", "success");
                                             }}
                                             className="min-w-6 min-h-6 flex items-center justify-center rounded-md hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                                             title="Copy Task ID"
                                         >
                                             <Copy className="w-3 h-3" />
                                         </button>
                                     </div>
                                 </div>
                             )}
                             
                             <div className="pt-4 mt-6 border-t border-white/10">
                                 <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5 text-indigo-400" /> Recover from Task ID</h4>
                                 <p className="text-[10px] text-white/50 mb-3">If you previously started a generation and lost connection or navigated away, you can recover the result by entering the Kie AI task ID here.</p>
                                 <div className="flex gap-2">
                                     <input 
                                         type="text" 
                                         value={recoverTaskId} 
                                         onChange={(e) => setRecoverTaskId(e.target.value)} 
                                         placeholder="Enter Kie AI Task ID..." 
                                         className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs outline-none focus:border-indigo-500 text-white" 
                                     />
                                     <button 
                                         disabled={isRecoveringTaskId || !recoverTaskId.trim()}
                                         onClick={async () => {
                                             if (!recoverTaskId.trim()) return;
                                             if (apiKeySource === 'custom' && !apiKeys.kie) {
                                                  addLog("You need to set a custom Kie AI API key to recover Suno tasks.", "error");
                                                  setShowKeyVault(true);
                                                  return;
                                             }
                                             if (apiKeySource === 'builtin') {
                                                  addLog("Built-in API key does not support Suno operations. Please enter your Kie AI API key.", "error");
                                                  setShowKeyVault(true);
                                                  return;
                                             }
                                             
                                             try {
                                                 setIsRecoveringTaskId(true);
                                                 addLog(`Checking status for Task ID: ${recoverTaskId}...`, "info");
                                                 const results = await checkSunoTaskStatus(recoverTaskId.trim(), apiKeys.kie!);
                                                 
                                                 addLog(`Audio recovered successfully! Loaded ${results.length} track(s).`, "success");
                                                 setProjectData(p => ({ ...p, soundtrackUrl: results[0].url, localPlaylist: results, currentTrackIndex: 0, localFiles: undefined }));
                                                 setLocalSoundtrackUrl(results[0].url);
                                                 setIsPlaying(true);
                                             } catch (e: any) {
                                                 addLog(`Task recovery failed: ${e.message}`, "error");
                                             } finally {
                                                 setIsRecoveringTaskId(false);
                                             }
                                         }}
                                         className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${isRecoveringTaskId || !recoverTaskId.trim() ? 'bg-white/10 text-white/40 cursor-not-allowed' : 'bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/40 border border-indigo-500/30'}`}
                                     >
                                         {isRecoveringTaskId ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                                         Check Status
                                     </button>
                                 </div>
                             </div>

                             {(!localSoundtrackUrl || localSoundtrackUrl.startsWith('blob:')) && (
                                 <p className="text-[10px] text-yellow-500 flex items-start gap-1 mt-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                                     <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                     <span>
                                         <strong>Public URL Required:</strong> Cover generation does not support local files. Please copy and paste a direct public audio link (e.g., Dropbox download URL, or discord cdn link) here. Or provide a YouTube URL in the main input box above.
                                     </span>
                                 </p>
                             )}
                             <p className="text-[10px] text-white/40 mt-3 italic flex items-start gap-1">
                                 <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                                 <span>Note: Suno strictly enforces copyright logic server-side. If you receive an "Uploaded audio matches existing work" error, it cannot be bypassed with API parameters. You must heavily alter the original audio (e.g., change pitch, isolate vocals) before uploading.</span>
                             </p>
                         </div>
                     </div>
                 </div>
             </div>
         </div>

         {activeTab === 'system' ? (
            <div className="flex-1 min-h-0 flex flex-col w-full p-4 bg-black overflow-hidden">
              <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                <h2 className="text-lg font-bold text-white mb-4">System Logs</h2>
                {logs.map(log => (
                  <div key={log.id} className="text-xs font-mono flex gap-2 mb-1">
                    <span className="text-white/30">[{log.timestamp}]</span>
                    <span className={
                      log.type === 'error' ? 'text-red-400' :
                      log.type === 'success' ? 'text-green-400' :
                      log.type === 'warning' ? 'text-yellow-400' :
                      'text-indigo-200'
                    }>{log.message}</span>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            </div>
          ) : null}
          
          
        </main>

        <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-white/10 z-50 safe-bottom-nav">
            <div className="flex justify-around items-center bg-white/5 p-1 rounded-xl border border-white/5 overflow-x-auto custom-scrollbar">
                <button onClick={() => setActiveTab('director')} className={`min-w-[44px] min-h-[44px] flex-1 flex flex-col items-center justify-center gap-1 py-1 rounded-lg text-[10px] font-bold transition-all ${activeTab === 'director' ? 'text-indigo-400 bg-indigo-500/10' : 'text-white/40 hover:text-white'}`}>
                    <LayoutGrid className="w-4 h-4" />
                    <span>Director</span>
                </button>
                 <button onClick={() => setActiveTab('studio')} className={`min-w-[44px] min-h-[44px] flex-1 flex flex-col items-center justify-center gap-1 py-1 rounded-lg text-[10px] font-bold transition-all ${activeTab === 'studio' ? 'text-indigo-400 bg-indigo-500/10' : 'text-white/40 hover:text-white'}`}>
                    <MessageSquare className="w-4 h-4" />
                    <span>Studio</span>
                </button>
                <button onClick={() => setActiveTab('storyboard')} className={`min-w-[44px] min-h-[44px] flex-1 flex flex-col items-center justify-center gap-1 py-1 rounded-lg text-[10px] font-bold transition-all ${activeTab === 'storyboard' ? 'text-indigo-400 bg-indigo-500/10' : 'text-white/40 hover:text-white'}`}>
                    <Film className="w-4 h-4" />
                    <span>Storyboard</span>
                </button>
                <button onClick={() => setActiveTab('lab')} className={`min-w-[44px] min-h-[44px] flex-1 flex flex-col items-center justify-center gap-1 py-1 rounded-lg text-[10px] font-bold transition-all ${activeTab === 'lab' ? 'text-indigo-400 bg-indigo-500/10' : 'text-white/40 hover:text-white'}`}>
                    <Sparkles className="w-4 h-4" />
                    <span>Lab</span>
                </button>
                <button onClick={() => setActiveTab('subtitles')} className={`min-w-[44px] min-h-[44px] flex-1 flex flex-col items-center justify-center gap-1 py-1 rounded-lg text-[10px] font-bold transition-all ${activeTab === 'subtitles' ? 'text-blue-400 bg-blue-500/10' : 'text-white/40 hover:text-white'}`}>
                    <Subtitles className="w-4 h-4" />
                    <span>Captions</span>
                </button>
                <button onClick={() => setActiveTab('keyframes')} className={`min-w-[44px] min-h-[44px] flex-1 flex flex-col items-center justify-center gap-1 py-1 rounded-lg text-[10px] font-bold transition-all ${activeTab === 'keyframes' ? 'text-emerald-400 bg-emerald-500/10' : 'text-white/40 hover:text-white'}`}>
                    <Scan className="w-4 h-4" />
                    <span>Keyframes</span>
                </button>
                <button onClick={() => setActiveTab('music')} className={`min-w-[44px] min-h-[44px] flex-1 flex flex-col items-center justify-center gap-1 py-1 rounded-lg text-[10px] font-bold transition-all ${activeTab === 'music' ? 'text-pink-400 bg-pink-500/10' : 'text-white/40 hover:text-white'}`}>
                    <Music className="w-4 h-4" />
                    <span>Music</span>
                </button>
                <button onClick={() => setActiveTab('xplore')} className={`min-w-[44px] min-h-[44px] flex-1 flex flex-col items-center justify-center gap-1 py-1 rounded-lg text-[10px] font-bold transition-all ${activeTab === 'xplore' ? 'text-cyan-400 bg-cyan-500/10' : 'text-white/40 hover:text-white'}`}>
                    <FolderOpen className="w-4 h-4" />
                    <span>Xplore</span>
                </button>
                <button onClick={() => setActiveTab('system')} className={`min-w-[44px] min-h-[44px] flex-1 flex flex-col items-center justify-center gap-1 py-1 rounded-lg text-[10px] font-bold transition-all ${activeTab === 'system' ? 'text-amber-400 bg-amber-500/10' : 'text-white/40 hover:text-white'}`}>
                    <Server className="w-4 h-4" />
                    <span>System</span>
                </button>
            </div>
        </div>

      <ApiKeyVault isOpen={showKeyVault} onClose={() => setShowKeyVault(false)} currentKeys={apiKeys} currentSource={apiKeySource} currentTextModel={textModel} currentImageModel={imageModel} onSave={handleSaveKeys} />
      <ChangelogModal isOpen={showChangelog} onClose={() => setShowChangelog(false)} />
      <ChatHistoryModal isOpen={showChatHistory} onClose={() => setShowChatHistory(false)} />
      <DevJournalModal isOpen={showDevJournal} onClose={() => setShowDevJournal(false)} />
      <CrashLogsModal isOpen={showCrashLogs} onClose={() => setShowCrashLogs(false)} />
      <SecondBrainModal isOpen={showSecondBrain} onClose={() => setShowSecondBrain(false)} />
      <KieChatModal 
        isOpen={showKieChat} 
        onClose={() => setShowKieChat(false)} 
        defaultApiKey={apiKeys.kie || ''}
        onSaveApiKey={(key) => {
          const updated = { ...apiKeys, kie: key };
          setApiKeys(updated);
          apiKeysRef.current = updated;
          setKieSettings(key, updated.kieCustomModel);
          localStorage.setItem('mv_api_keys', JSON.stringify(updated));
          localStorage.setItem('kie_api_key', key);
        }}
      />
      <GitHubConnectModal 
        isOpen={showGitHubConnect} 
        onClose={() => setShowGitHubConnect(false)} 
      />
      <PromptingGuideModal isOpen={showPromptGuide} onClose={() => setShowPromptGuide(false)} />
      <PromptHistoryModal isOpen={showHistoryModal !== null} onClose={() => setShowHistoryModal(null)} history={showHistoryModal === 'lyrics' ? lyricsHistory : techHistory} onSelect={handleSelectFromHistory} onClear={handleClearHistory} />
      <InstructionPresetsModal isOpen={showInstructionPresetsModal} onClose={() => setShowInstructionPresetsModal(false)} presets={instructionPresets} onSavePresets={handleSaveInstructionPresets} />
      <ArtStylePresetsModal isOpen={showArtStylePresetsModal} onClose={() => setShowArtStylePresetsModal(false)} presets={artStylePresets} onSavePresets={handleSaveArtStylePresets} />
      <YouTubeImportModal 
          isOpen={showYouTubeModal} 
          onClose={() => setShowYouTubeModal(false)} 
          onSelectVideo={(url, title) => {
              setLocalSoundtrackUrl(url);
              setProjectData(p => ({ ...p, soundtrackUrl: url, localPlaylist: undefined, currentTrackIndex: undefined, localFiles: undefined }));
              setIsPlaying(true);
              addLog(`Imported YouTube Video: ${title}`, 'success');
          }} 
      />
      {editingReference && <ReferenceEditorModal 
          image={editingReference} 
          characters={projectData.characters} 
          onClose={() => setEditingReference(null)} 
          onSave={handleUpdateReference} 
          onRemove={handleRemoveReference}
          onAnalyze={(ref) => handleAnalyzeDNAFromReference(ref.data)}
          isAnalyzing={isAnalyzingDNA}
          onStopAnalysis={handleStopDNAExtraction}
          onChangeBackground={handleChangeReferenceBackground}
      />}
      {editingCharacter && (
        <CharacterEditorModal 
            character={editingCharacter}
            onClose={() => setEditingCharacter(null)}
            onSave={handleUpdateCharacter}
            onRemove={handleRemoveCharacter}
            apiKey={apiKeySourceRef.current === 'custom' ? apiKeysRef.current.google : undefined}
            referenceImages={projectData.referenceImages}
        />
      )}

      {projectData.soundtrackUrl && (
        <motion.div 
            drag 
            dragMomentum={false}
            dragListener={false}
            dragControls={playerDragControls}
            className="fixed bottom-16 right-4 z-50 bg-black/80 border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md w-64 md:w-80 transition-colors hover:border-pink-500/50"
            style={{ touchAction: "none" }}
        >
            <div 
              onPointerDown={(e) => playerDragControls.start(e)}
              style={{ touchAction: "none" }}
              className="bg-pink-500/10 px-3 py-1.5 border-b border-white/5 flex items-center justify-between cursor-move"
            >
                <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest flex items-center gap-1.5"><Music className="w-3 h-3" /> Soundtrack</span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            if (projectData.soundtrackUrl?.startsWith('blob:')) {
                                if (audioRef.current) {
                                    if (!audioRef.current.paused) {
                                        audioRef.current.pause();
                                    } else {
                                        const playPromise = audioRef.current.play();
                                        if (playPromise !== undefined) {
                                            playPromise.catch(error => {
                                                if (error?.name !== 'AbortError' && error?.name !== 'NotAllowedError') {
                                                    console.warn("Audio play notice:", error);
                                                }
                                            });
                                        }
                                    }
                                }
                            } else {
                                setIsPlaying(!isPlaying);
                            }
                        }}
                        className="text-white/40 hover:text-white transition-colors"
                        title={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </button>
                    {projectData.soundtrackUrl?.includes('youtube.com') || projectData.soundtrackUrl?.includes('youtu.be') ? (
                        <button
                            onClick={() => setShowVideo(!showVideo)}
                            className={`transition-colors ${showVideo ? 'text-indigo-400 hover:text-indigo-300' : 'text-white/40 hover:text-white'}`}
                            title={showVideo ? "Hide Video" : "Watch Video"}
                        >
                            <Video className="w-3 h-3" />
                        </button>
                    ) : null}
                    <button
                        onClick={() => setIsPlayerMinimized(!isPlayerMinimized)}
                        className="text-white/40 hover:text-white transition-colors"
                        title={isPlayerMinimized ? "Expand player" : "Minimize player"}
                    >
                        {isPlayerMinimized ? <Plus className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                    </button>
                    <button 
                        onClick={() => {
                            if (projectData.soundtrackUrl?.startsWith('blob:')) {
                                const win = window.open('', 'AudioPlayer', 'width=400,height=150');
                                if (win) {
                                    win.document.body.innerHTML = `
                                        <title>MV Director - Audio Player</title>
                                        <style>body { background: #111; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; font-family: sans-serif; }</style>
                                        <div style="text-align: center;">
                                            <p style="font-size: 12px; opacity: 0.7; margin-bottom: 10px;">Local Audio Track</p>
                                            <audio controls autoplay src="${projectData.soundtrackUrl}" style="width: 300px;"></audio>
                                        </div>
                                    `;
                                }
                            } else {
                                // Open YouTube or other URLs directly in a new tab to avoid iframe embedding restrictions (Error 150/153)
                                window.open(projectData.soundtrackUrl, '_blank');
                            }
                        }}
                        className="text-white/40 hover:text-indigo-400 transition-colors"
                        title="Pop out player"
                    >
                        <Maximize className="w-3 h-3" />
                    </button>
                    <button onClick={() => setProjectData(p => ({ ...p, soundtrackUrl: '', localPlaylist: undefined, currentTrackIndex: undefined }))} className="text-white/40 hover:text-red-400 transition-colors">
                        <X className="w-3 h-3" />
                    </button>
                </div>
            </div>
            <div className={isPlayerMinimized ? 'hidden' : 'p-2'}>
                {(projectData.soundtrackUrl?.startsWith('blob:') || projectData.localPlaylist) ? (
                    <div className="flex flex-col gap-1">
                        {projectData.localPlaylist && projectData.localPlaylist.length > 0 && (
                            <div className="flex items-center justify-between px-1">
                                <div className="text-[9px] text-white/50 truncate flex-1" title={projectData.localPlaylist[projectData.currentTrackIndex || 0].name}>
                                    Playing: {projectData.localPlaylist[projectData.currentTrackIndex || 0].name}
                                </div>
                                <div className="flex items-center gap-1">
                                    <button 
                                        onClick={() => {
                                            const name = projectData.localPlaylist![projectData.currentTrackIndex || 0].name;
                                            const match = name.match(/\[(.*?)\]/);
                                            const idToCopy = match ? match[1] : name;
                                            navigator.clipboard.writeText(idToCopy);
                                            addLog("Audio ID copied to clipboard", "success");
                                        }}
                                        className="p-0.5 text-white/40 hover:text-white hover:bg-white/10 rounded mr-1"
                                        title="Copy Audio ID"
                                    >
                                        <Copy className="w-3 h-3" />
                                    </button>
                                    {projectData.localPlaylist.length > 1 && (
                                        <>
                                            <button onClick={() => {
                                                 const prevIndex = ((projectData.currentTrackIndex || 0) - 1 + projectData.localPlaylist!.length) % projectData.localPlaylist!.length;
                                                 setProjectData(p => ({ ...p, soundtrackUrl: p.localPlaylist![prevIndex].url, currentTrackIndex: prevIndex }));
                                            }} className="p-0.5 text-white/40 hover:text-white hover:bg-white/10 rounded">
                                                <SkipBack className="w-3 h-3" />
                                            </button>
                                            <span className="text-[9px] text-white/30">{(projectData.currentTrackIndex || 0) + 1}/{projectData.localPlaylist.length}</span>
                                            <button onClick={() => {
                                                 const nextIndex = ((projectData.currentTrackIndex || 0) + 1) % projectData.localPlaylist!.length;
                                                 setProjectData(p => ({ ...p, soundtrackUrl: p.localPlaylist![nextIndex].url, currentTrackIndex: nextIndex }));
                                            }} className="p-0.5 text-white/40 hover:text-white hover:bg-white/10 rounded">
                                                <SkipForward className="w-3 h-3" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                        {projectData.localFiles?.[projectData.currentTrackIndex || 0]?.type.includes('video') ? (
                            <video 
                                ref={audioRef as any}
                                controls 
                                src={projectData.soundtrackUrl} 
                                className={`w-full ${showVideo ? 'h-[360px]' : 'h-[120px]'} object-contain`}
                                onEnded={() => {
                                    if (projectData.localPlaylist && projectData.currentTrackIndex !== undefined) {
                                        const nextIndex = (projectData.currentTrackIndex + 1) % projectData.localPlaylist.length;
                                        setProjectData(p => ({ ...p, soundtrackUrl: p.localPlaylist![nextIndex].url, currentTrackIndex: nextIndex }));
                                    }
                                }}
                                onPlay={() => {
                                    setIsPlaying(true);
                                    if ('mediaSession' in navigator) {
                                        navigator.mediaSession.metadata = new MediaMetadata({
                                            title: projectData.localPlaylist ? projectData.localPlaylist[projectData.currentTrackIndex || 0].name : 'MV Director Soundtrack',
                                            artist: 'Local File',
                                            album: 'AI Studio'
                                        });
                                        if (projectData.localPlaylist && projectData.localPlaylist.length > 1) {
                                            navigator.mediaSession.setActionHandler('nexttrack', () => {
                                                const nextIndex = ((projectData.currentTrackIndex || 0) + 1) % projectData.localPlaylist!.length;
                                                setProjectData(p => ({ ...p, soundtrackUrl: p.localPlaylist![nextIndex].url, currentTrackIndex: nextIndex }));
                                            });
                                            navigator.mediaSession.setActionHandler('previoustrack', () => {
                                                const prevIndex = ((projectData.currentTrackIndex || 0) - 1 + projectData.localPlaylist!.length) % projectData.localPlaylist!.length;
                                                setProjectData(p => ({ ...p, soundtrackUrl: p.localPlaylist![prevIndex].url, currentTrackIndex: prevIndex }));
                                            });
                                        } else {
                                            navigator.mediaSession.setActionHandler('nexttrack', null);
                                            navigator.mediaSession.setActionHandler('previoustrack', null);
                                        }
                                    }
                                }}
                                onPause={() => setIsPlaying(false)}
                            />
                        ) : (
                            <audio 
                                ref={audioRef}
                                controls 
                                src={projectData.soundtrackUrl} 
                                className="w-full h-10"
                                onEnded={() => {
                                    if (projectData.localPlaylist && projectData.currentTrackIndex !== undefined) {
                                        const nextIndex = (projectData.currentTrackIndex + 1) % projectData.localPlaylist.length;
                                        setProjectData(p => ({ ...p, soundtrackUrl: p.localPlaylist![nextIndex].url, currentTrackIndex: nextIndex }));
                                    }
                                }}
                                onPlay={() => {
                                    setIsPlaying(true);
                                    if ('mediaSession' in navigator) {
                                        navigator.mediaSession.metadata = new MediaMetadata({
                                            title: projectData.localPlaylist ? projectData.localPlaylist[projectData.currentTrackIndex || 0].name : 'MV Director Soundtrack',
                                            artist: 'Local File',
                                            album: 'AI Studio'
                                        });
                                        if (projectData.localPlaylist && projectData.localPlaylist.length > 1) {
                                            navigator.mediaSession.setActionHandler('nexttrack', () => {
                                                const nextIndex = ((projectData.currentTrackIndex || 0) + 1) % projectData.localPlaylist!.length;
                                                setProjectData(p => ({ ...p, soundtrackUrl: p.localPlaylist![nextIndex].url, currentTrackIndex: nextIndex }));
                                            });
                                            navigator.mediaSession.setActionHandler('previoustrack', () => {
                                                const prevIndex = ((projectData.currentTrackIndex || 0) - 1 + projectData.localPlaylist!.length) % projectData.localPlaylist!.length;
                                                setProjectData(p => ({ ...p, soundtrackUrl: p.localPlaylist![prevIndex].url, currentTrackIndex: prevIndex }));
                                            });
                                        } else {
                                            navigator.mediaSession.setActionHandler('nexttrack', null);
                                            navigator.mediaSession.setActionHandler('previoustrack', null);
                                        }
                                    }
                                }}
                                onPause={() => setIsPlaying(false)}
                            />
                        )}
                    </div>
                ) : (
                    <div className={isPlayerMinimized ? "h-0 overflow-hidden opacity-0" : "w-full"}>
                        <Player 
                            ref={playerRef}
                            url={projectData.soundtrackUrl} 
                            width="100%" 
                            height={showVideo ? "360px" : "120px"} 
                            controls={true}
                            playing={isPlaying}
                            onPlay={() => {
                                setIsPlaying(true);
                                if ('mediaSession' in navigator) {
                                    navigator.mediaSession.metadata = new MediaMetadata({
                                        title: 'MV Director Soundtrack',
                                        artist: 'YouTube',
                                        album: 'AI Studio'
                                    });
                                }
                            }}
                            onPause={() => setIsPlaying(false)}
                            onError={(e) => {
                                console.error("ReactPlayer Error:", e);
                                addLog(`Media Player Error: Could not play the provided link. If this is a YouTube video, the creator may have disabled embedding (Error 150/153). Try using the 'Pop out player' button instead.`, 'error');
                            }}
                            config={{
                                youtube: {
                                    playerVars: { 
                                        origin: window.location.origin
                                    }
                                }
                            } as any}
                        />
                    </div>
                )}
            </div>
        </motion.div>
      )}

      {directorPlan && (
          <SeedanceExportModal 
            isOpen={showSeedanceModal}
            onClose={() => setShowSeedanceModal(false)}
            scenes={directorPlan.scenes}
            projectData={projectData}
            apiKey={apiKeySourceRef.current === 'custom' ? apiKeysRef.current.google : undefined}
          />
      )}
    </div>
  );
};
