
export type ImageRole = 'Face' | 'Body' | 'Outfit' | 'Environment' | 'Style' | 'Lighting' | 'Composition' | 'Frame' | 'General';
export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '3:4' | '2.35:1';
export type ProjectType = 'music-video' | 'editorial-vlog';
export type DirectorPersona = 'Avant-Garde Visionary' | 'Gritty Realist' | 'Nostalgic Romantic' | 'Social Media Mogul' | 'K-Pop High Gloss';
export type VoiceName = 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr';
export type AnalysisFocus = 'default' | 'face' | 'body';
export type ApiKeySource = 'builtin' | 'custom';

export interface ApiKeys {
  google?: string;
  huggingface?: string;
}

export interface Scene {
  timestamp: string;
  contentBeat: string;
  concept: string;
  imagePrompt: string;
  videoMotionPrompt: string;
  imageUrl?: string;
  videoUrl?: string;
  isGenerating?: boolean;
  isGeneratingVideo?: boolean;
  isEnhancing?: boolean;
  isQueued?: boolean;
  seed?: number;
}

export interface ReferenceImage {
  id: string;
  data: string;
  description: string;
  roles: ImageRole[];
  characterId?: string;
  isPrimary?: boolean;
  isTurnaround?: boolean;
}

export interface CharacterProfile {
  id: string;
  name: string;
  description: {
    facialFeatures: string;
    hairStyle: string;
    bodyType: string;
    personality: string;
    keyExpressions: string;
  };
}

export interface ProjectData {
  projectType: ProjectType;
  directorPersona: DirectorPersona;
  // Added generationMode to resolve TypeScript error in App.tsx and distinguish logic
  generationMode: 'narrative' | 'technical';
  lyrics: string;
  technicalInstructions: string;
  creativeContext?: string;
  recurringMotifs?: string;
  characterDescription: string;
  characters: CharacterProfile[];
  totalDuration: string;
  sceneCount: number;
  useAutoSceneCount: boolean;
  artStyle: string;
  aspectRatio: AspectRatio;
  videoSegmentDuration: string;
  referenceImages: ReferenceImage[];
  globalSeed?: number;
  basePromptTemplate?: string;
}

export interface DirectorPlan {
  title: string;
  theme: string;
  colorPalette: string[];
  scenes: Scene[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

// FIX: Export CharacterMapping type
export type CharacterMapping = { [key: string]: string; };

export interface ExportedProject {
    projectData: ProjectData;
    directorPlan: DirectorPlan | null;
}

export interface AppSettings {
  apiKeys: ApiKeys;
  apiKeySource: ApiKeySource;
}

// --- VisionStruct Analysis Types (Upgraded) ---
export interface VisionStructData {
    analysisType: 'default';
    meta: {
        image_quality: string;
        image_type: string;
        resolution_estimation: string;
    };
    global_context: {
        scene_description: string;
        time_of_day: string;
        weather_atmosphere: string;
        lighting: {
            source: string;
            direction: string;
            quality: string;
            color_temp: string;
        };
    };
    color_palette: {
        dominant_hex_estimates: string[];
        accent_colors: string[];
        contrast_level: string;
    };
    composition: {
        camera_angle: string;
        framing: string;
        depth_of_field: string;
        focal_point: string;
    };
    objects: Array<{
        id: string;
        label: string;
        category: string;
        location: string;
        prominence: string;
        visual_attributes: {
            color: string;
            texture: string;
            material: string;
            state: string;
            dimensions_relative: string;
        };
        micro_details: string[];
        pose_or_orientation: string;
        text_content: string | null;
    }>;
    text_ocr: {
        present: boolean;
        content: Array<{
            text: string;
            location: string;
            font_style: string;
            legibility: string;
        }>;
    };
    semantic_relationships: string[];
}

export interface FaceAnalysisData {
    analysisType: 'face';
    face_shape: string;
    skin: {
        tone: string;
        texture: string;
        imperfections: string[];
    };
    eyes: {
        color: string;
        shape: string;
        eyebrows: string;
        eyelashes: string;
    };
    nose: {
        shape: string;
        bridge: string;
    };
    mouth: {
        lips_shape: string;
        expression: string;
    };
    hair: {
        color: string;
        style: string;
        texture: string;
        length: string;
    };
    facial_hair: string | null;
    key_features: string[];
}

export interface BodyAnalysisData {
    analysisType: 'body';
    pose_description: string;
    body_type: string;
    clothing: Array<{
        layer: string;
        item_name: string;
        color: string;
        material: string;
        fit: string;
        patterns: string[];
        details: string[];
    }>;
    accessories: Array<{
        item_name: string;
        location: string;
        material: string;
    }>;
}
