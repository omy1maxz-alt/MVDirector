import { StudioGroundingSource } from '@/services/gemini';
import { FileAttachmentItem } from '@/components/CollapsibleFileAttachment';

export interface StudioConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastMessagePreview?: string;
  messageCount?: number;
  isArchived?: boolean;
  customTitle?: boolean;
  systemPrompt?: string;
  repoConfig?: {
    owner: string;
    repo: string;
    branch: string;
    isEnabled?: boolean;
  };
}

export interface StudioMessage {
  id: string;
  conversationId: string;
  text: string;
  sender: 'user' | 'bot' | 'bot_proxy';
  createdAt?: string;
  agentPersona?: 'creator' | 'user_proxy' | 'critic' | 'devil' | 'collaborator';
  agentName?: string;
  attachedImage?: string;
  attachedImages?: string[];
  generatedImageUrl?: string;
  attachments?: FileAttachmentItem[];
  loopSteps?: Array<{ step: number; title: string; summary: string; output: string }>;
  loopStepNumber?: number;
  loopTotalSteps?: number;
  isLoopComplete?: boolean;
  loopCompletionSummary?: string;
  webSearchQueries?: string[];
  groundingSources?: StudioGroundingSource[];
}

export type ConversationGroupCategory = 'today' | 'yesterday' | 'previous_7_days' | 'older';

export interface ConversationGroup {
  category: ConversationGroupCategory;
  label: string;
  conversations: StudioConversation[];
}
