import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  X, Send, Bot, User, Trash2, Copy, Check, Sparkles, Settings2, 
  ExternalLink, Key, RefreshCw, ChevronDown, ChevronUp, Plus, Sliders, Shield,
  Layers, MessageSquare, Terminal, Clapperboard, Brain, Music, Code, HelpCircle, Menu,
  Globe, Cpu, Edit3, Paperclip, FileCode, CheckSquare, Github, Coins, Info,
  Maximize2, Minimize2, RotateCcw, AlertCircle, Activity, Wifi, Zap,
  PanelLeftClose, PanelLeft, Type, History
} from 'lucide-react';
import { 
  KIE_POPULAR_MODELS, 
  SYSTEM_PERSONAS, 
  SystemPersona, 
  KieModelOption, 
  sendKieChatCompletion, 
  runKieChatWithRepoTools,
  runKieAutonomousLoop,
  LoopStepResult,
  KieChatMessage 
} from '@/services/kieChatService';
import { GitHubConnectModal, AttachContextMetadata } from './GitHubConnectModal';
import { RepoStatusBar } from './RepoStatusBar';
import { JulesTaskCard } from './JulesTaskCard';
import { CollapsibleFileAttachment, FileAttachmentItem } from './CollapsibleFileAttachment';
import { AutoLoopGuideModal } from './AutoLoopGuideModal';
import { KieModelDropdown } from './KieModelDropdown';
import { KieMarkdownRenderer } from './KieMarkdownRenderer';
import { KieLogsModal } from './KieLogsModal';
import { LongTextPasteModal, LongTextPasteData, detectSnippetFileName } from './LongTextPasteModal';
import { KieMemoryDistillModal } from './KieMemoryDistillModal';
import { 
  ChatFontSize, 
  CHAT_FONT_CONFIGS, 
  CHAT_FONT_SIZE_ORDER, 
  normalizeChatFontSize, 
  getNextFontSize, 
  getPrevFontSize 
} from '@/utils/chatFont';

interface ChatSession {
  id: string;
  title: string;
  model: string;
  personaId: string;
  customSystemPrompt: string;
  temperature: number;
  maxOutputTokens?: number;
  enableThinking?: boolean;
  thinkingBudgetTokens?: number;
  memoryEnabled?: boolean;
  maxMemoryTurns?: number; // e.g. 4, 8, 12, or 0 (unlimited)
  trimHistoricalAttachments?: boolean; // when true, historical turns have bulky file dumps summarized to prevent token bloat & 500 timeouts
  loopEnabled?: boolean;
  maxLoopSteps?: number;
  reasoningEffort?: 'low' | 'medium' | 'high' | 'xhigh';
  enableWebSearch?: boolean;
  repoConfig?: {
    owner?: string;
    repo?: string;
    branch?: string;
    isEnabled?: boolean;
  };
  messages: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    isError?: boolean;
    attachments?: FileAttachmentItem[];
    retrievedFiles?: Array<{ path: string; startLine: number; endLine: number; language?: string }>;
    analyzedCommitSha?: string;
    loopSteps?: LoopStepResult[];
    loopStepNumber?: number;
    loopTotalSteps?: number;
    architectBlueprint?: string;
    architectModel?: string;
    builderModel?: string;
    savedPercent?: number;
  }[];
  createdAt: number;
  updatedAt?: number;
}

interface KieChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultApiKey?: string;
  onSaveApiKey?: (key: string) => void;
  isStandalone?: boolean;
}

const STORAGE_KEY_SESSIONS = 'kie_chat_sessions_v1';
const STORAGE_KEY_ACTIVE_ID = 'kie_chat_active_session_id';
const STORAGE_KEY_API_KEY = 'kie_chat_api_key';

const DEFAULT_FIRST_SESSION: ChatSession = {
  id: 'session_default',
  title: 'AI Reasoning & Studio Partner',
  model: 'gemini-3.5-flash',
  personaId: 'general',
  customSystemPrompt: '',
  temperature: 0.7,
  memoryEnabled: true,
  maxMemoryTurns: 6, // Sliding window: last 6 turns (keeps fresh context while preventing gateway timeouts)
  trimHistoricalAttachments: true, // Auto-trims old 20KB+ file dumps from past turns
  loopEnabled: false,
  maxLoopSteps: 3,
  repoConfig: {
    isEnabled: false,
  },
  messages: [
    {
      id: 'welcome_1',
      role: 'assistant',
      content: '👋 **Welcome to KIE Studio Chat!**\n\nI am your multi-model AI reasoning partner powered by **GPT-4o**, **Claude 3.5 Sonnet**, **DeepSeek R1**, **Grok**, and **Gemini**.\n\n* **Prompt Engineering & Iteration**: Ask me to critique, refine, expand, or polish your prompts.\n* **Auto-Loop Mode**: Enable multi-turn self-critique & autonomous reasoning depth.\n* **GitHub Repo Analysis (Optional)**: Toggle **GitHub: ON** in the header anytime you want me to inspect your code repository, browse files, or generate Jules tasks.\n\nWhat would you like to work on?',
      timestamp: Date.now(),
    }
  ],
  createdAt: Date.now(),
};

const loadInitialSessions = (): { sessions: ChatSession[]; activeId: string } => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SESSIONS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Sanitize every session and message so content is always a valid string
        const sanitized: ChatSession[] = parsed.map(session => ({
          ...session,
          messages: Array.isArray(session.messages)
            ? session.messages.map((m: any) => ({
                ...m,
                content: typeof m?.content === 'string' ? m.content : String(m?.content ?? ''),
              }))
            : []
        }));
        const savedActiveId = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
        const validActiveId = (savedActiveId && sanitized.some(s => s.id === savedActiveId))
          ? savedActiveId
          : sanitized[0].id;
        return { sessions: sanitized, activeId: validActiveId };
      }
    }
  } catch (e) {
    console.error('Error loading KIE chat sessions:', e);
  }
  return { sessions: [DEFAULT_FIRST_SESSION], activeId: DEFAULT_FIRST_SESSION.id };
};

export const KieChatModal: React.FC<KieChatModalProps> = ({
  isOpen,
  onClose,
  defaultApiKey = '',
  onSaveApiKey,
  isStandalone = false,
}) => {
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_API_KEY) || defaultApiKey || '';
  });
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);

  // Synchronously initialize sessions and activeSessionId from localStorage to avoid initial undefined render crash
  const [sessions, setSessions] = useState<ChatSession[]>(() => loadInitialSessions().sessions);
  const [activeSessionId, setActiveSessionId] = useState<string>(() => loadInitialSessions().activeId);

  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Model Provider Filtering State
  const [providerFilter, setProviderFilter] = useState<'big3' | 'Google' | 'OpenAI' | 'Anthropic' | 'xAI' | 'DeepSeek' | 'Moonshot' | 'Other' | 'all'>('big3');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState<boolean>(false);
  const [showMobileSessions, setShowMobileSessions] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('kie_chat_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });
  const [showFullModelCatalog, setShowFullModelCatalog] = useState<boolean>(false);
  const [showMemoryDistillModal, setShowMemoryDistillModal] = useState<boolean>(false);
  const [pasteModalData, setPasteModalData] = useState<LongTextPasteData | null>(null);
  const [showLogsModal, setShowLogsModal] = useState<boolean>(false);
  const [customModelInput, setCustomModelInput] = useState<string>('');
  const [showCustomModelField, setShowCustomModelField] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('kie_chat_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  // Font Size Settings State (min 4px, default 14px)
  const [fontSize, setFontSize] = useState<ChatFontSize>(() => {
    try {
      const saved = localStorage.getItem('kie_chat_font_size');
      return normalizeChatFontSize(saved);
    } catch {}
    return '14px';
  });

  const handleSetFontSize = (size: ChatFontSize) => {
    setFontSize(size);
    try {
      localStorage.setItem('kie_chat_font_size', size);
    } catch {}
  };

  const handleIncreaseFontSize = () => {
    handleSetFontSize(getNextFontSize(fontSize));
  };

  const handleDecreaseFontSize = () => {
    handleSetFontSize(getPrevFontSize(fontSize));
  };

  // Message Editing & File Upload & GitHub Connect State
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>('');
  const [attachedFiles, setAttachedFiles] = useState<FileAttachmentItem[]>([]);
  const [creditSaverEnabled, setCreditSaverEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('kie_credit_saver_enabled');
      return saved !== null ? saved === 'true' : true; // Default to true to save credits!
    } catch {
      return true;
    }
  });
  const [architectModeEnabled, setArchitectModeEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('kie_architect_mode_enabled');
      return saved === 'true'; // Default off, user can turn it on
    } catch {
      return false;
    }
  });
  const [expandedBlueprintMsgIds, setExpandedBlueprintMsgIds] = useState<Record<string, boolean>>({});
  const [showGitHubModal, setShowGitHubModal] = useState<boolean>(false);
  const [agentStatusText, setAgentStatusText] = useState<string>('');
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [isInputExpanded, setIsInputExpanded] = useState<boolean>(false);
  const [collapsedMessageIds, setCollapsedMessageIds] = useState<Record<string, boolean>>({});
  const [expandedLoopMsgIds, setExpandedLoopMsgIds] = useState<Record<string, boolean>>({});
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToggleCreditSaver = (enabled: boolean) => {
    setCreditSaverEnabled(enabled);
    try {
      localStorage.setItem('kie_credit_saver_enabled', String(enabled));
    } catch {}
  };

  const handleToggleArchitectMode = (enabled: boolean) => {
    setArchitectModeEnabled(enabled);
    try {
      localStorage.setItem('kie_architect_mode_enabled', String(enabled));
    } catch {}
  };

  const toggleExpandBlueprint = (msgId: string) => {
    setExpandedBlueprintMsgIds(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  const toggleCollapseMessage = (msgId: string) => {
    setCollapsedMessageIds(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  const toggleExpandLoopSteps = (msgId: string) => {
    setExpandedLoopMsgIds(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  const formatMessageForApi = (
    m: { role: string; content: string; attachments?: FileAttachmentItem[] },
    isHistorical: boolean = false,
    trimAttachments: boolean = true
  ): string => {
    let text = m.content;
    if (m.attachments && m.attachments.length > 0) {
      if (isHistorical && trimAttachments) {
        // Historical Turn: Compress bulky attached files into clean metadata summaries to prevent Gateway 500 timeouts
        const summaryBlock = m.attachments.map(att => {
          const lines = att.lineCount || (att.content ? att.content.split('\n').length : 0);
          const sizeKb = att.size ? (att.size / 1024).toFixed(1) : (att.content ? (att.content.length / 1024).toFixed(1) : '0');
          return `📁 *[Attached Earlier: ${att.path || att.name} (${lines} lines, ${sizeKb} KB) - full text provided in previous turn]*`;
        }).join('\n');
        text = text ? `${summaryBlock}\n\n${text}` : summaryBlock;
      } else {
        const attachBlock = m.attachments.map(att => {
          const lang = att.name.split('.').pop() || '';
          const rangeInfo = att.range ? ` (Lines ${att.range.start}-${att.range.end})` : '';
          return `📁 **Attached File: [${att.path || att.name}](${att.url || ''})${rangeInfo}**\n\`\`\`${lang}\n${att.content}\n\`\`\``;
        }).join('\n\n');
        text = text ? `${attachBlock}\n\n---\n\n${text}` : attachBlock;
      }
    }
    return text;
  };

  const handleTriggerJulesTaskPrompt = () => {
    setInputMessage('Based on our analysis and the authoritative GitHub source at master, produce a complete, structured Jules-Ready Task specification for this issue that I can hand off to Jules to implement. Target environment is AndroidIDE on Poco F5.');
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync API Key from props if available
  useEffect(() => {
    if (defaultApiKey && !apiKey) {
      setApiKey(defaultApiKey);
      localStorage.setItem(STORAGE_KEY_API_KEY, defaultApiKey);
    }
  }, [defaultApiKey]);

  // Persist sessions
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    }
  }, [sessions]);

  // Persist active session ID
  useEffect(() => {
    if (activeSessionId) {
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, activeSessionId);
    }
  }, [activeSessionId]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, activeSessionId, isLoading]);

  // Safe fallback guarantees activeSession is never undefined on any render pass
  const fallbackSession = sessions[0] || DEFAULT_FIRST_SESSION;
  const activeSession: ChatSession = sessions.find(s => s.id === activeSessionId) || fallbackSession;

  // Compute sequential conversational turn numbers (must be before any early return)
  const { messageTurns, totalTurns } = useMemo(() => {
    const map = new Map<string, number>();
    let currentTurn = 0;
    for (const msg of activeSession?.messages || []) {
      if (msg.role === 'user') {
        currentTurn += 1;
      }
      map.set(msg.id, Math.max(1, currentTurn));
    }
    return {
      messageTurns: map,
      totalTurns: currentTurn,
    };
  }, [activeSession?.messages]);

  const handleRevertToTurn = (targetTurn: number) => {
    if (!activeSession || isLoading) return;
    if (targetTurn < 1 || targetTurn >= totalTurns) return;

    const keptMessages = activeSession.messages.filter(m => {
      const t = messageTurns.get(m.id) || 1;
      return t <= targetTurn;
    });

    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return {
          ...s,
          messages: keptMessages,
        };
      }
      return s;
    }));
  };

  if (!isOpen) return null;

  const handleSaveKey = (newKey: string) => {
    setApiKey(newKey);
    localStorage.setItem(STORAGE_KEY_API_KEY, newKey);
    if (onSaveApiKey) {
      onSaveApiKey(newKey);
    }
    setShowKeyInput(false);
  };

  const handleCreateNewSession = () => {
    const newSession: ChatSession = {
      id: 'session_' + Date.now(),
      title: 'New Conversation',
      model: activeSession ? activeSession.model : 'gemini-3.5-flash',
      personaId: activeSession ? activeSession.personaId : 'general',
      customSystemPrompt: '',
      temperature: 0.7,
      memoryEnabled: activeSession ? (activeSession.memoryEnabled ?? true) : true,
      repoConfig: activeSession?.repoConfig ? { ...activeSession.repoConfig, isEnabled: false } : { isEnabled: false },
      messages: [
        {
          id: 'msg_' + Date.now(),
          role: 'assistant',
          content: `Started new conversation using **${activeSession ? activeSession.model : 'Gemini 3.5 Flash'}**. What would you like to explore?`,
          timestamp: Date.now(),
        }
      ],
      createdAt: Date.now(),
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length === 1) {
      // Just clear messages
      setSessions([{
        ...sessions[0],
        title: 'New Conversation',
        messages: [{
          id: 'msg_' + Date.now(),
          role: 'assistant',
          content: 'Chat cleared. How can I assist you?',
          timestamp: Date.now(),
        }]
      }]);
      return;
    }
    const updated = sessions.filter(s => s.id !== sessionId);
    setSessions(updated);
    if (activeSessionId === sessionId) {
      setActiveSessionId(updated[0].id);
    }
  };

  const handleUpdateSession = (updates: Partial<ChatSession>) => {
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return { ...s, ...updates };
      }
      return s;
    }));
  };

  // Message Delete Handler
  const handleDeleteMessage = (messageId: string) => {
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return {
          ...s,
          messages: s.messages.filter(m => m.id !== messageId),
        };
      }
      return s;
    }));
    if (editingMessageId === messageId) {
      setEditingMessageId(null);
      setEditingContent('');
    }
  };

  // Message Edit Start Handler
  const handleStartEdit = (messageId: string, currentText: string) => {
    setEditingMessageId(messageId);
    setEditingContent(currentText);
  };

  // Message Edit Save Handler with optional Resend (truncate subsequent messages)
  const handleSaveEdit = async (messageId: string, resend: boolean = false) => {
    const trimmed = editingContent.trim();
    if (!trimmed) {
      setEditingMessageId(null);
      setEditingContent('');
      return;
    }

    const msgIndex = activeSession.messages.findIndex(m => m.id === messageId);
    if (msgIndex === -1) {
      setEditingMessageId(null);
      setEditingContent('');
      return;
    }

    const targetMessage = activeSession.messages[msgIndex];

    if (!resend) {
      // Just save in place without truncating or resending
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: s.messages.map(m => m.id === messageId ? { ...m, content: trimmed } : m),
          };
        }
        return s;
      }));
      setEditingMessageId(null);
      setEditingContent('');
      return;
    }

    // RESEND MODE: Truncate / forget all messages that came after this message
    const precedingMessages = activeSession.messages.slice(0, msgIndex);
    const updatedMessage = {
      ...targetMessage,
      content: trimmed,
      timestamp: Date.now(),
    };

    const truncatedMessages = [...precedingMessages, updatedMessage];

    // Update session messages state immediately
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return {
          ...s,
          messages: truncatedMessages,
        };
      }
      return s;
    }));

    setEditingMessageId(null);
    setEditingContent('');

    // Check API Key
    if (!apiKey.trim()) {
      setShowKeyInput(true);
      return;
    }

    setIsLoading(true);

    // Prepare system prompt based on persona
    const persona = SYSTEM_PERSONAS.find(p => p.id === activeSession.personaId);
    let systemContent = persona ? persona.prompt : SYSTEM_PERSONAS[0].prompt;
    if (activeSession.customSystemPrompt?.trim()) {
      systemContent += '\n\nAdditional Instructions:\n' + activeSession.customSystemPrompt.trim();
    }

    if (architectModeEnabled) {
      try {
        const { getKieArchitectDirective } = await import('../services/geminiArchitectPipeline');
        systemContent = getKieArchitectDirective(systemContent);
      } catch (aErr) {
        console.warn('[KieChat] Architect Directive fallback in edit:', aErr);
      }
    }

    // Build payload messages with Smart Context Window (sliding window + historical attachment trimming)
    let messagesForContext: typeof truncatedMessages = [updatedMessage];
    if (activeSession.memoryEnabled !== false) {
      const maxTurns = activeSession.maxMemoryTurns ?? 6;
      if (maxTurns > 0 && truncatedMessages.length > maxTurns) {
        messagesForContext = truncatedMessages.slice(-maxTurns);
      } else {
        messagesForContext = truncatedMessages;
      }
    }

    const shouldTrimHistorical = activeSession.trimHistoricalAttachments !== false;
    const lastMsgIndex = messagesForContext.length - 1;

    const apiMessages: KieChatMessage[] = [
      { role: 'system', content: systemContent },
      ...messagesForContext.map((m, idx) => ({
        role: m.role as 'user' | 'assistant',
        content: formatMessageForApi(m, idx < lastMsgIndex, shouldTrimHistorical),
      }))
    ];

    abortControllerRef.current = new AbortController();

    try {
      let response = '';
      let retrievedFiles: Array<{ path: string; startLine: number; endLine: number; language?: string }> | undefined;
      let analyzedCommitSha: string | undefined;
      let loopSteps: LoopStepResult[] | undefined;

      const repoOwner = activeSession.repoConfig?.owner || '';
      const repoName = activeSession.repoConfig?.repo || '';
      const repoBranch = activeSession.repoConfig?.branch || 'main';
      const isRepoEnabled = Boolean(activeSession.repoConfig?.isEnabled && repoOwner && repoName);

      if (activeSession.loopEnabled) {
        setAgentStatusText(`Initializing Auto-Loop (${activeSession.maxLoopSteps || 3} steps)...`);
        const loopResult = await runKieAutonomousLoop({
          model: activeSession.model,
          messages: apiMessages,
          apiKey: apiKey.trim(),
          temperature: activeSession.temperature,
          reasoningEffort: activeSession.reasoningEffort,
          enableWebSearch: activeSession.enableWebSearch,
          signal: abortControllerRef.current.signal,
          maxSteps: activeSession.maxLoopSteps || 3,
          isRepoEnabled,
          repoOwner,
          repoName,
          repoBranch,
          onStepProgress: (step, total, msg) => setAgentStatusText(msg),
        });
        response = loopResult.text;
        loopSteps = loopResult.steps;
      } else if (isRepoEnabled) {
        setAgentStatusText(`Checking commit freshness on ${repoBranch}...`);
        const { getLatestCommit } = await import('../services/githubRepoContext');
        const latest = await getLatestCommit(repoOwner, repoName, repoBranch);
        analyzedCommitSha = latest.sha;

        if (architectModeEnabled) {
          setAgentStatusText(`⚡ Step 1/2: KIE (${activeSession.model}) is drafting architectural blueprint...`);
        }

        const agentResult = await runKieChatWithRepoTools({
          model: activeSession.model,
          messages: apiMessages,
          apiKey: apiKey.trim(),
          temperature: activeSession.temperature,
          maxTokens: architectModeEnabled ? Math.min(activeSession.maxOutputTokens || 2048, 800) : activeSession.maxOutputTokens,
          reasoningEffort: activeSession.reasoningEffort,
          enableWebSearch: activeSession.enableWebSearch,
          creditSaver: creditSaverEnabled,
          signal: abortControllerRef.current.signal,
          repoOwner,
          repoName,
          repoBranch,
          commitSha: latest.sha,
          onStatusUpdate: (msg) => setAgentStatusText(msg),
        });
        response = agentResult.text;
        retrievedFiles = agentResult.retrievedFiles;
      } else {
        if (architectModeEnabled) {
          setAgentStatusText(`⚡ Step 1/2: KIE (${activeSession.model}) is drafting architectural blueprint...`);
        }
        response = await sendKieChatCompletion({
          model: activeSession.model,
          messages: apiMessages,
          apiKey: apiKey.trim(),
          temperature: activeSession.temperature,
          maxTokens: architectModeEnabled ? Math.min(activeSession.maxOutputTokens || 2048, 800) : activeSession.maxOutputTokens,
          reasoningEffort: activeSession.reasoningEffort,
          enableThinking: activeSession.enableThinking,
          thinkingBudgetTokens: activeSession.thinkingBudgetTokens,
          enableWebSearch: activeSession.enableWebSearch,
          signal: abortControllerRef.current.signal,
        });
      }

      let finalBotContent = response;
      let architectBlueprint: string | undefined = undefined;
      let architectModel: string | undefined = undefined;
      let builderModel: string | undefined = undefined;
      let savedPercent: number | undefined = undefined;

      if (architectModeEnabled && response.trim().length > 20) {
        setAgentStatusText(`⚡ Step 2/2: Gemini 3.7 is expanding blueprint into full code (Free)...`);
        try {
          const { expandBlueprintWithGemini } = await import('../services/geminiArchitectPipeline');
          const expansion = await expandBlueprintWithGemini({
            userPrompt: trimmed || 'Implement the solution.',
            blueprint: response,
            architectModel: activeSession.model,
            signal: abortControllerRef.current?.signal,
          });
          if (expansion.isExpanded) {
            finalBotContent = expansion.fullText;
            architectBlueprint = expansion.blueprint;
            architectModel = expansion.architectModel;
            builderModel = expansion.builderModel;
            savedPercent = expansion.savedPercent;
          }
        } catch (bErr) {
          console.warn('[KieChat] Gemini Builder expansion fallback in edit:', bErr);
        }
      }

      const botMessage = {
        id: 'bot_' + Date.now(),
        role: 'assistant' as const,
        content: finalBotContent,
        timestamp: Date.now(),
        retrievedFiles,
        analyzedCommitSha,
        loopSteps,
        architectBlueprint,
        architectModel,
        builderModel,
        savedPercent,
      };

      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...truncatedMessages, botMessage],
          };
        }
        return s;
      }));
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      const errorContent = `⚠️ **Error calling KIE API:**\n\n${err.message || 'Unknown network error. Check your API key and connection.'}`;
      const errMessage = {
        id: 'err_' + Date.now(),
        role: 'assistant' as const,
        content: errorContent,
        timestamp: Date.now(),
        isError: true,
      };
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...truncatedMessages, errMessage],
          };
        }
        return s;
      }));
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  // Cancel Edit Handler
  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingContent('');
  };

  // File Upload Handlers
  const handleAttachRawFiles = (files: File[]) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      // 10MB limit per file
      if (file.size > 10 * 1024 * 1024) {
        alert(`File "${file.name}" exceeds the 10MB limit.`);
        return;
      }

      const reader = new FileReader();
      const isText = file.type.startsWith('text/') || 
                     /\.(txt|md|json|js|ts|tsx|jsx|html|css|py|java|c|cpp|rs|go|sh|yml|yaml|sql|csv|xml)$/i.test(file.name);

      if (isText) {
        reader.onload = (event) => {
          const text = event.target?.result as string;
          const lines = text.split('\n');
          setAttachedFiles(prev => [...prev, {
            name: file.name,
            size: file.size,
            lineCount: lines.length,
            content: text,
          }]);
        };
        reader.readAsText(file);
      } else {
        // Binary or image files
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          const isImage = file.type.startsWith('image/');
          setAttachedFiles(prev => [...prev, {
            name: file.name,
            size: file.size,
            lineCount: 1,
            content: isImage 
              ? `🖼️ **Image Attached: ${file.name}**\n![${file.name}](${dataUrl})` 
              : `📎 **Attached Document: ${file.name}** (${(file.size / 1024).toFixed(1)} KB)`
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    handleAttachRawFiles(Array.from(files));

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAttachedFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAttachGitHubContext = (contextText: string, metadata: AttachContextMetadata) => {
    if (metadata?.filePayload) {
      setAttachedFiles(prev => [...prev, metadata.filePayload!]);
    } else {
      setAttachedFiles(prev => [...prev, {
        name: metadata.title,
        size: contextText.length,
        lineCount: contextText.split('\n').length,
        content: contextText,
        url: metadata.url,
      }]);
    }
  };

  const handleProcessPastedOrLargeText = (rawText: string): boolean => {
    if (!rawText) return false;
    const isLarge = rawText.length > 120 || rawText.split('\n').length >= 3;
    if (!isLarge) return false;

    const fileName = detectSnippetFileName(rawText);
    const lineCount = rawText.split('\n').length;
    const newAttachment: FileAttachmentItem = {
      name: fileName,
      path: fileName,
      content: rawText,
      size: new Blob([rawText]).size,
      lineCount,
    };
    setAttachedFiles(prev => [...prev, newAttachment]);
    return true;
  };

  const handleSendMessage = async () => {
    if ((!inputMessage.trim() && attachedFiles.length === 0) || isLoading) return;

    const userText = inputMessage.trim();

    // Check for Revert command: e.g. "revert to turn 3", "revert to 3", "revert 3", "/revert 3", "rollback to turn 3", "undo to turn 3"
    const revertRegex = /^(?:\/)?(?:revert|rollback|undo)(?:\s+to)?(?:\s+turn)?(?:\s+#)?\s*(\d+)$/i;
    const revertMatch = userText.match(revertRegex);
    if (revertMatch) {
      const targetTurn = parseInt(revertMatch[1], 10);
      setInputMessage('');
      setAttachedFiles([]);
      setIsInputExpanded(false);
      if (!isNaN(targetTurn) && targetTurn > 0 && targetTurn < totalTurns) {
        handleRevertToTurn(targetTurn);
      }
      return;
    }

    if (!apiKey.trim()) {
      setShowKeyInput(true);
      return;
    }
    const attachmentsToSave = attachedFiles.length > 0 ? [...attachedFiles] : undefined;

    setInputMessage('');
    setAttachedFiles([]);
    setIsInputExpanded(false);

    const userMessage = {
      id: 'user_' + Date.now(),
      role: 'user' as const,
      content: userText || (attachmentsToSave ? `[Attached ${attachmentsToSave.map(f => f.name).join(', ')}]` : ''),
      timestamp: Date.now(),
      attachments: attachmentsToSave,
    };

    // Update session title on first user message if title is default
    const isFirstUserMessage = activeSession.messages.filter(m => m.role === 'user').length === 0;
    const newTitle = isFirstUserMessage 
      ? (userText ? (userText.length > 30 ? userText.slice(0, 30) + '...' : userText) : (attachmentsToSave?.[0]?.name || 'Chat Session'))
      : activeSession.title;

    const updatedMessages = [...activeSession.messages, userMessage];
    
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return {
          ...s,
          title: newTitle,
          messages: updatedMessages,
        };
      }
      return s;
    }));

    setIsLoading(true);

    // Prepare system prompt based on persona
    const persona = SYSTEM_PERSONAS.find(p => p.id === activeSession.personaId);
    let systemContent = persona ? persona.prompt : SYSTEM_PERSONAS[0].prompt;
    if (activeSession.customSystemPrompt?.trim()) {
      systemContent += '\n\nAdditional Instructions:\n' + activeSession.customSystemPrompt.trim();
    }

    // Build payload messages with Smart Context Window (sliding window + historical attachment trimming)
    let messagesForContext: typeof updatedMessages = [userMessage];
    if (activeSession.memoryEnabled !== false) {
      const maxTurns = activeSession.maxMemoryTurns ?? 6;
      if (maxTurns > 0 && updatedMessages.length > maxTurns) {
        messagesForContext = updatedMessages.slice(-maxTurns);
      } else {
        messagesForContext = updatedMessages;
      }
    }

    let processedMessages = [...messagesForContext];
    if (creditSaverEnabled && attachmentsToSave && attachmentsToSave.length > 0) {
      const totalAttachChars = attachmentsToSave.reduce((acc, f) => acc + (f.content?.length || 0), 0);
      if (totalAttachChars > 1000) {
        setAgentStatusText('⚡ Gemini is pre-reading & compressing code (Saving KIE credits)...');
        try {
          const { distillCodeContextWithGemini } = await import('../services/geminiCodeDistiller');
          const distillation = await distillCodeContextWithGemini({
            userPrompt: userText || 'Analyze the attached code files.',
            attachedFiles: attachmentsToSave,
            signal: abortControllerRef.current?.signal,
          });
          if (distillation.isDistilled) {
            processedMessages = processedMessages.map(m => {
              if (m.id === userMessage.id) {
                return {
                  ...m,
                  content: userText ? `${distillation.distilledText}\n\n---\n\n${userText}` : distillation.distilledText,
                  attachments: undefined,
                };
              }
              return m;
            });
          }
        } catch (dErr) {
          console.warn('[KieChat] Gemini Distillation fallback:', dErr);
        }
      }
    }

    if (architectModeEnabled) {
      try {
        const { getKieArchitectDirective } = await import('../services/geminiArchitectPipeline');
        systemContent = getKieArchitectDirective(systemContent);
      } catch (aErr) {
        console.warn('[KieChat] Architect Directive fallback:', aErr);
      }
    }

    const shouldTrimHistorical = activeSession.trimHistoricalAttachments !== false;
    const lastMsgIndex = processedMessages.length - 1;

    const apiMessages: KieChatMessage[] = [
      { role: 'system', content: systemContent },
      ...processedMessages.map((m, idx) => ({
        role: m.role as 'user' | 'assistant',
        content: formatMessageForApi(m, idx < lastMsgIndex, shouldTrimHistorical),
      }))
    ];

    abortControllerRef.current = new AbortController();

    try {
      let response = '';
      let retrievedFiles: Array<{ path: string; startLine: number; endLine: number; language?: string }> | undefined;
      let analyzedCommitSha: string | undefined;
      let loopSteps: LoopStepResult[] | undefined;

      const repoOwner = activeSession.repoConfig?.owner || '';
      const repoName = activeSession.repoConfig?.repo || '';
      const repoBranch = activeSession.repoConfig?.branch || 'main';
      const isRepoEnabled = Boolean(activeSession.repoConfig?.isEnabled && repoOwner && repoName);

      if (activeSession.loopEnabled) {
        const totalSteps = activeSession.maxLoopSteps || 3;
        let runningApiMessages: KieChatMessage[] = [...apiMessages];
        let commitShaForLoop: string | undefined = undefined;

        if (isRepoEnabled) {
          const { getLatestCommit } = await import('../services/githubRepoContext');
          const latest = await getLatestCommit(repoOwner, repoName, repoBranch);
          commitShaForLoop = latest.sha;
          analyzedCommitSha = latest.sha;
        }

        for (let step = 1; step <= totalSteps; step++) {
          if (abortControllerRef.current?.signal.aborted) break;

          setAgentStatusText(
            step === 1
              ? `Auto-Loop Turn 1/${totalSteps}: Thinking and writing initial reply...`
              : `Auto-Loop Turn ${step}/${totalSteps}: Reading previous reply and generating continuation...`
          );

          let stepResponse = '';
          let stepFiles: Array<{ path: string; startLine: number; endLine: number; language?: string }> | undefined;

          if (isRepoEnabled) {
            const agentResult = await runKieChatWithRepoTools({
              model: activeSession.model,
              messages: runningApiMessages,
              apiKey: apiKey.trim(),
              temperature: activeSession.temperature,
              reasoningEffort: activeSession.reasoningEffort,
              enableWebSearch: activeSession.enableWebSearch,
              creditSaver: creditSaverEnabled,
              signal: abortControllerRef.current.signal,
              repoOwner,
              repoName,
              repoBranch,
              commitSha: commitShaForLoop,
              onStatusUpdate: (msg) => setAgentStatusText(`Turn ${step}/${totalSteps}: ${msg}`),
            });
            stepResponse = agentResult.text;
            stepFiles = agentResult.retrievedFiles;
          } else {
            stepResponse = await sendKieChatCompletion({
              model: activeSession.model,
              messages: runningApiMessages,
              apiKey: apiKey.trim(),
              temperature: activeSession.temperature,
              reasoningEffort: activeSession.reasoningEffort,
              enableWebSearch: activeSession.enableWebSearch,
              signal: abortControllerRef.current.signal,
            });
          }

          if (!stepResponse.trim()) stepResponse = '(Completed turn)';

          const stepBotMessage = {
            id: `bot_${Date.now()}_step${step}`,
            role: 'assistant' as const,
            content: stepResponse,
            timestamp: Date.now(),
            retrievedFiles: stepFiles,
            analyzedCommitSha: commitShaForLoop,
            loopStepNumber: step,
            loopTotalSteps: totalSteps,
          };

          // Immediately post this turn into the chat transcript
          setSessions(prev => prev.map(s => {
            if (s.id === activeSessionId) {
              return {
                ...s,
                messages: [...s.messages, stepBotMessage],
              };
            }
            return s;
          }));

          // Prepare the prompt for the next turn if more steps remain
          if (step < totalSteps && !abortControllerRef.current?.signal.aborted) {
            runningApiMessages.push({
              role: 'assistant',
              content: stepResponse,
            });

            const nextTurnPrompt = step === 1
              ? `[AUTONOMOUS LOOP: TURN 2/${totalSteps} - SELF-ANALYSIS & EXPANSION]
Carefully read your previous response above. Now:
1. Identify any missing details, assumptions, or areas needing deeper elaboration.
2. Continue with the next logical progression, refined prompt iterations, code details, or deeper solutions.
3. Keep the answer direct, concrete, and actionable.`
              : `[AUTONOMOUS LOOP: TURN ${step + 1}/${totalSteps} - FINAL SYNTHESIS & POLISH]
Carefully review the conversation and your previous replies above.
1. Synthesize the final, verified response, prompt, code, or recommendations.
2. Resolve any remaining questions or unfinished sections.`;

            runningApiMessages.push({
              role: 'user',
              content: nextTurnPrompt,
            });

            // Brief delay between turns for natural rendering and user observation
            await new Promise(r => setTimeout(r, 650));
          }
        }
      } else if (isRepoEnabled) {
        setAgentStatusText(`Checking commit freshness on ${repoBranch}...`);
        const { getLatestCommit } = await import('../services/githubRepoContext');
        const latest = await getLatestCommit(repoOwner, repoName, repoBranch);
        analyzedCommitSha = latest.sha;

        if (architectModeEnabled) {
          setAgentStatusText(`⚡ Step 1/2: KIE (${activeSession.model}) is drafting architectural blueprint...`);
        }

        const agentResult = await runKieChatWithRepoTools({
          model: activeSession.model,
          messages: apiMessages,
          apiKey: apiKey.trim(),
          temperature: activeSession.temperature,
          maxTokens: architectModeEnabled ? Math.min(activeSession.maxOutputTokens || 2048, 800) : activeSession.maxOutputTokens,
          reasoningEffort: activeSession.reasoningEffort,
          enableWebSearch: activeSession.enableWebSearch,
          creditSaver: creditSaverEnabled,
          signal: abortControllerRef.current.signal,
          repoOwner,
          repoName,
          repoBranch,
          commitSha: latest.sha,
          onStatusUpdate: (msg) => setAgentStatusText(msg),
        });

        response = agentResult.text;
        retrievedFiles = agentResult.retrievedFiles;

        let finalRepoContent = response;
        let architectBlueprint: string | undefined = undefined;
        let architectModel: string | undefined = undefined;
        let builderModel: string | undefined = undefined;
        let savedPercent: number | undefined = undefined;

        if (architectModeEnabled && response.trim().length > 20) {
          setAgentStatusText(`⚡ Step 2/2: Gemini 3.7 is expanding blueprint into full code (Free)...`);
          try {
            const { expandBlueprintWithGemini } = await import('../services/geminiArchitectPipeline');
            const expansion = await expandBlueprintWithGemini({
              userPrompt: userText || 'Implement the repository solution.',
              blueprint: response,
              architectModel: activeSession.model,
              signal: abortControllerRef.current?.signal,
            });
            if (expansion.isExpanded) {
              finalRepoContent = expansion.fullText;
              architectBlueprint = expansion.blueprint;
              architectModel = expansion.architectModel;
              builderModel = expansion.builderModel;
              savedPercent = expansion.savedPercent;
            }
          } catch (bErr) {
            console.warn('[KieChat] Gemini Builder expansion fallback:', bErr);
          }
        }

        const botMessage = {
          id: 'bot_' + Date.now(),
          role: 'assistant' as const,
          content: finalRepoContent,
          timestamp: Date.now(),
          retrievedFiles,
          analyzedCommitSha,
          architectBlueprint,
          architectModel,
          builderModel,
          savedPercent,
        };

        setSessions(prev => prev.map(s => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              messages: [...s.messages, botMessage],
            };
          }
          return s;
        }));
      } else {
        if (architectModeEnabled) {
          setAgentStatusText(`⚡ Step 1/2: KIE (${activeSession.model}) is drafting architectural blueprint...`);
        }
        response = await sendKieChatCompletion({
          model: activeSession.model,
          messages: apiMessages,
          apiKey: apiKey.trim(),
          temperature: activeSession.temperature,
          maxTokens: architectModeEnabled ? Math.min(activeSession.maxOutputTokens || 2048, 800) : activeSession.maxOutputTokens,
          reasoningEffort: activeSession.reasoningEffort,
          enableThinking: activeSession.enableThinking,
          thinkingBudgetTokens: activeSession.thinkingBudgetTokens,
          enableWebSearch: activeSession.enableWebSearch,
          signal: abortControllerRef.current.signal,
        });

        let finalBotContent = response;
        let architectBlueprint: string | undefined = undefined;
        let architectModel: string | undefined = undefined;
        let builderModel: string | undefined = undefined;
        let savedPercent: number | undefined = undefined;

        if (architectModeEnabled && response.trim().length > 20) {
          setAgentStatusText(`⚡ Step 2/2: Gemini 3.7 is expanding blueprint into full code (Free)...`);
          try {
            const { expandBlueprintWithGemini } = await import('../services/geminiArchitectPipeline');
            const expansion = await expandBlueprintWithGemini({
              userPrompt: userText || 'Implement the solution.',
              blueprint: response,
              architectModel: activeSession.model,
              signal: abortControllerRef.current?.signal,
            });
            if (expansion.isExpanded) {
              finalBotContent = expansion.fullText;
              architectBlueprint = expansion.blueprint;
              architectModel = expansion.architectModel;
              builderModel = expansion.builderModel;
              savedPercent = expansion.savedPercent;
            }
          } catch (bErr) {
            console.warn('[KieChat] Gemini Builder expansion fallback:', bErr);
          }
        }

        const botMessage = {
          id: 'bot_' + Date.now(),
          role: 'assistant' as const,
          content: finalBotContent,
          timestamp: Date.now(),
          architectBlueprint,
          architectModel,
          builderModel,
          savedPercent,
        };

        setSessions(prev => prev.map(s => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              messages: [...s.messages, botMessage],
            };
          }
          return s;
        }));
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      const errorContent = `⚠️ **Error calling KIE API:**\n\n${err.message || 'Unknown network error. Check your API key and connection.'}`;
      const errMessage = {
        id: 'err_' + Date.now(),
        role: 'assistant' as const,
        content: errorContent,
        timestamp: Date.now(),
        isError: true,
      };
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...s.messages, errMessage],
          };
        }
        return s;
      }));
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  // Retry / Reload message handler
  const handleRetryMessage = async (targetMsgId?: string) => {
    if (!activeSession || isLoading) return;

    let targetIdx = -1;
    if (targetMsgId) {
      targetIdx = activeSession.messages.findIndex(m => m.id === targetMsgId);
    } else {
      targetIdx = activeSession.messages.length - 1;
    }

    if (targetIdx < 0) return;

    const targetMsg = activeSession.messages[targetIdx];
    // If target is an assistant or error message, slice history up to before this message
    // If target is a user message, slice up to and including this user message
    let precedingMessages = (targetMsg.role === 'assistant' || targetMsg.isError || targetMsg.id.startsWith('err_'))
      ? activeSession.messages.slice(0, targetIdx)
      : activeSession.messages.slice(0, targetIdx + 1);

    const lastUserMsg = [...precedingMessages].reverse().find(m => m.role === 'user');
    if (!lastUserMsg) return;

    // Immediately remove the error message from the session
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return {
          ...s,
          messages: precedingMessages,
        };
      }
      return s;
    }));

    if (!apiKey.trim()) {
      setShowKeyInput(true);
      return;
    }

    setIsLoading(true);

    const persona = SYSTEM_PERSONAS.find(p => p.id === activeSession.personaId);
    let systemContent = persona ? persona.prompt : SYSTEM_PERSONAS[0].prompt;
    if (activeSession.customSystemPrompt?.trim()) {
      systemContent += '\n\nAdditional Instructions:\n' + activeSession.customSystemPrompt.trim();
    }

    const messagesForContext = (activeSession.memoryEnabled === false)
      ? [lastUserMsg]
      : precedingMessages;

    const apiMessages: KieChatMessage[] = [
      { role: 'system', content: systemContent },
      ...messagesForContext.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: formatMessageForApi(m),
      }))
    ];

    abortControllerRef.current = new AbortController();

    try {
      let response = '';
      let retrievedFiles: Array<{ path: string; startLine: number; endLine: number; language?: string }> | undefined;
      let analyzedCommitSha: string | undefined;
      let loopSteps: LoopStepResult[] | undefined;

      const repoOwner = activeSession.repoConfig?.owner || 'omy1maxz-alt';
      const repoName = activeSession.repoConfig?.repo || 'Mydownloader';
      const repoBranch = activeSession.repoConfig?.branch || 'master';
      const isRepoEnabled = Boolean(activeSession.repoConfig?.isEnabled);

      if (activeSession.loopEnabled) {
        setAgentStatusText(`Initializing Auto-Loop (${activeSession.maxLoopSteps || 3} steps)...`);
        const loopResult = await runKieAutonomousLoop({
          model: activeSession.model,
          messages: apiMessages,
          apiKey: apiKey.trim(),
          temperature: activeSession.temperature,
          reasoningEffort: activeSession.reasoningEffort,
          enableWebSearch: activeSession.enableWebSearch,
          signal: abortControllerRef.current.signal,
          maxSteps: activeSession.maxLoopSteps || 3,
          isRepoEnabled,
          repoOwner,
          repoName,
          repoBranch,
          onStepProgress: (step, total, msg) => setAgentStatusText(msg),
        });
        response = loopResult.text;
        loopSteps = loopResult.steps;
      } else if (isRepoEnabled) {
        setAgentStatusText(`Checking commit freshness on ${repoBranch}...`);
        const { getLatestCommit } = await import('../services/githubRepoContext');
        const latest = await getLatestCommit(repoOwner, repoName, repoBranch);
        analyzedCommitSha = latest.sha;

        const agentResult = await runKieChatWithRepoTools({
          model: activeSession.model,
          messages: apiMessages,
          apiKey: apiKey.trim(),
          temperature: activeSession.temperature,
          reasoningEffort: activeSession.reasoningEffort,
          enableWebSearch: activeSession.enableWebSearch,
          signal: abortControllerRef.current.signal,
          repoOwner,
          repoName,
          repoBranch,
          commitSha: latest.sha,
          onStatusUpdate: (msg) => setAgentStatusText(msg),
        });
        response = agentResult.text;
        retrievedFiles = agentResult.retrievedFiles;
      } else {
        response = await sendKieChatCompletion({
          model: activeSession.model,
          messages: apiMessages,
          apiKey: apiKey.trim(),
          temperature: activeSession.temperature,
          maxTokens: activeSession.maxOutputTokens,
          reasoningEffort: activeSession.reasoningEffort,
          enableThinking: activeSession.enableThinking,
          thinkingBudgetTokens: activeSession.thinkingBudgetTokens,
          enableWebSearch: activeSession.enableWebSearch,
          signal: abortControllerRef.current.signal,
        });
      }

      const botMessage = {
        id: 'bot_' + Date.now(),
        role: 'assistant' as const,
        content: response,
        timestamp: Date.now(),
        retrievedFiles,
        analyzedCommitSha,
        loopSteps,
      };

      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...precedingMessages, botMessage],
          };
        }
        return s;
      }));
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      const errorContent = `⚠️ **Error calling KIE API:**\n\n${err.message || 'Unknown network error. Check your API key and connection.'}`;
      const errMessage = {
        id: 'err_' + Date.now(),
        role: 'assistant' as const,
        content: errorContent,
        timestamp: Date.now(),
        isError: true,
      };
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...precedingMessages, errMessage],
          };
        }
        return s;
      }));
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePopOut = () => {
    const popoutUrl = `${window.location.origin}${window.location.pathname}?mode=kie_chat`;
    // Attempt standard popup window, fallback smoothly to new tab or direct navigation if popup blocker interferes
    try {
      const newWin = window.open(popoutUrl, '_blank');
      if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
        window.location.href = popoutUrl;
      }
    } catch {
      window.location.href = popoutUrl;
    }
  };

  return (
    <div className={
      isStandalone 
        ? "w-full h-full min-h-[100dvh] bg-[#08080a] flex flex-col overflow-hidden text-white" 
        : isMaximized
          ? "fixed inset-0 z-[120] bg-black flex flex-col overflow-hidden text-white animate-in fade-in duration-150"
          : "fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
    }>
      <div className={`bg-[#101012] flex flex-col shadow-2xl overflow-hidden text-white relative w-full h-full ${
        isStandalone || isMaximized
          ? 'border-0 rounded-none max-h-[100dvh]' 
          : 'border-0 sm:border sm:border-white/10 rounded-none sm:rounded-2xl max-w-7xl sm:h-[94vh] sm:w-[96vw] max-h-[100dvh]'
      }`}>
        
        {/* Top Header Bar */}
        <header className="h-11 sm:h-12 border-b border-white/10 px-2 sm:px-3 pt-safe pl-safe pr-safe flex items-center justify-between shrink-0 bg-black/40 w-full max-w-full overflow-hidden">
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
            {/* Sidebar Toggle (Mobile Drawer & Desktop Collapse) */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && window.innerWidth < 768) {
                  setShowMobileSessions(prev => !prev);
                  setShowSettingsDrawer(false);
                } else {
                  toggleSidebar();
                }
              }}
              className="p-1 sm:p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors shrink-0"
              title={isSidebarCollapsed ? "Show conversations sidebar" : "Hide conversations sidebar (maximize space)"}
            >
              {isSidebarCollapsed ? <PanelLeft className="w-3.5 h-3.5 text-indigo-400" /> : <PanelLeftClose className="w-3.5 h-3.5" />}
            </button>

            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-fuchsia-600 flex items-center justify-center shadow-md shadow-indigo-600/30 shrink-0">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-bold text-xs sm:text-sm tracking-wide text-white whitespace-nowrap">KIE STUDIO</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-mono truncate max-w-[85px] sm:max-w-none">
                  {activeSession.model}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* API Diagnostics & Logs Button */}
            <button
              onClick={() => setShowLogsModal(true)}
              className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
              title="KIE API Live Diagnostics & Request/Response Logs"
            >
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Logs</span>
            </button>

            {/* GitHub Connect Trigger */}
            <button
              onClick={() => setShowGitHubModal(true)}
              className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
              title="Connect GitHub Repositories & Files"
            >
              <Github className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">GitHub</span>
            </button>

            {/* Expand / Restore Window Button */}
            {!isStandalone && (
              <button
                onClick={() => setIsMaximized(prev => !prev)}
                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
                title={isMaximized ? "Collapse window to standard dialog" : "Expand chat window to fullscreen"}
              >
                {isMaximized ? <Minimize2 className="w-3.5 h-3.5 text-indigo-400" /> : <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />}
                <span className="hidden md:inline">{isMaximized ? 'Restore' : 'Expand'}</span>
              </button>
            )}

            {/* Pop-out standalone window button (only when inside modal, not in standalone) */}
            {!isStandalone && (
              <button
                onClick={handlePopOut}
                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
                title="Pop out into dedicated window"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Pop Out</span>
              </button>
            )}

            {/* API Key Vault Trigger */}
            <button
              onClick={() => setShowKeyInput(prev => !prev)}
              className={`px-2 py-1 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
                apiKey.trim() 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20' 
                  : 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30 animate-pulse'
              }`}
              title="Configure KIE.ai API Key"
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{apiKey.trim() ? 'Key Set' : 'Set Key'}</span>
            </button>

            {/* Persona & Tuning Settings Drawer Button */}
            <button
              onClick={() => {
                setShowSettingsDrawer(prev => !prev);
                setShowMobileSessions(false);
              }}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                showSettingsDrawer ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/70'
              }`}
              title="Model Settings & System Persona"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              title={isStandalone ? "Return to Studio" : "Close"}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* API Key Slide-down Drawer */}
        {showKeyInput && (
          <div className="bg-[#18181c] border-b border-indigo-500/30 p-2.5 sm:p-3 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-2.5 animate-in slide-in-from-top-2 w-full max-w-full">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Shield className="w-4 h-4 text-indigo-400 shrink-0" />
              <div className="text-xs">
                <span className="font-semibold text-white">KIE.ai API Secret Key</span>
                <p className="text-[10px] text-white/50">Stored securely in your local browser storage and never shared.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="flex-1 bg-black/60 border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <button
                onClick={() => handleSaveKey(apiKey)}
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors shrink-0"
              >
                Save Key
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 min-h-0 w-full max-w-full flex overflow-hidden relative">
          
          {/* Mobile Sessions Backdrop */}
          {showMobileSessions && (
            <div 
              onClick={() => setShowMobileSessions(false)}
              className="fixed md:hidden inset-0 bg-black/75 z-40 animate-in fade-in"
            />
          )}

          {/* Left Sidebar: Session List & Presets (Desktop Collapsible + Mobile Slide-over) */}
          <aside className={`w-60 sm:w-52 border-r border-white/10 bg-[#0d0d10] flex flex-col shrink-0 transition-all duration-200 ${
            showMobileSessions 
              ? 'fixed md:static inset-y-0 left-0 z-50 shadow-2xl flex translate-x-0' 
              : isSidebarCollapsed 
                ? 'hidden' 
                : 'hidden md:flex'
          }`}>
            <div className="p-2 border-b border-white/10 flex items-center justify-between gap-1.5">
              <button
                onClick={() => {
                  handleCreateNewSession();
                  setShowMobileSessions(false);
                }}
                className="flex-1 py-1.5 px-2 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 rounded-lg text-xs font-semibold text-indigo-300 flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Chat</span>
              </button>
              <button
                onClick={() => setShowMobileSessions(false)}
                className="p-1.5 md:hidden text-white/40 hover:text-white rounded-lg"
                title="Close sidebar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={toggleSidebar}
                className="hidden md:flex p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                title="Collapse sidebar to maximize screen space"
              >
                <PanelLeftClose className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
              <div className="px-2 py-1 text-[10px] uppercase font-bold text-white/40 tracking-wider">
                Conversations ({sessions.length})
              </div>
              {sessions.map(s => {
                const isActive = s.id === activeSessionId;
                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      setActiveSessionId(s.id);
                      setShowMobileSessions(false);
                    }}
                    className={`group px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-all ${
                      isActive 
                        ? 'bg-white/10 text-white font-medium border border-white/15' 
                        : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 overflow-hidden min-w-0">
                      <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-white/30'}`} />
                      <span className="truncate">{s.title || 'Untitled'}</span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteSession(s.id, e)}
                      className="opacity-70 md:opacity-0 group-hover:opacity-100 p-0.5 text-white/30 hover:text-red-400 transition-opacity shrink-0"
                      title="Delete chat"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Persona Quick Indicator */}
            <div className="p-2 border-t border-white/10 text-[10px] text-white/50 bg-black/40">
              <div className="flex items-center justify-between mb-0.5">
                <span>Persona:</span>
                <span className="font-semibold text-indigo-400 truncate max-w-[100px]">
                  {SYSTEM_PERSONAS.find(p => p.id === activeSession.personaId)?.name || 'General'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Temp:</span>
                <span className="font-mono text-white/80">{activeSession.temperature}</span>
              </div>
            </div>
          </aside>

          {/* Center Chat Viewport */}
          <div className="flex-1 min-h-0 w-full max-w-full min-w-0 flex flex-col bg-[#0c0c0e] overflow-hidden">
            
            {/* Sleek Compact Model Selector & Toolbar */}
            <div className="border-b border-white/10 px-2 sm:px-3 py-1 bg-black/40 flex items-center justify-between gap-1.5 overflow-x-auto custom-scrollbar shrink-0 w-full min-w-0 text-xs">
              {/* Left Side: Model Selector & Quick Switches */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* App UI Custom Model Dropdown */}
                <KieModelDropdown
                  model={activeSession.model}
                  onSelectModel={(m) => handleUpdateSession({ model: m })}
                />

                {/* Quick Switch Flags */}
                <div className="hidden lg:flex items-center gap-1">
                  {[
                    { id: 'gemini-3.5-flash', label: 'Gemini 3.5' },
                    { id: 'gpt-5-6-sol', label: 'GPT-5.6' },
                    { id: 'claude-sonnet-5', label: 'Sonnet 5' },
                    { id: 'deepseek-v4-1-flash', label: 'DeepSeek 4.1' },
                    { id: 'grok-4-7', label: 'Grok 4.7' },
                  ].map(item => {
                    const isSel = activeSession.model === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleUpdateSession({ model: item.id })}
                        className={`px-1.5 py-0.5 rounded text-[11px] whitespace-nowrap transition-colors ${
                          isSel 
                            ? 'bg-indigo-600 text-white font-bold border border-indigo-400/50' 
                            : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>

                {/* Gallery Toggle */}
                <button
                  onClick={() => setShowFullModelCatalog(prev => !prev)}
                  className={`px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap transition-colors border ${
                    showFullModelCatalog 
                      ? 'bg-indigo-600/30 border-indigo-500/50 text-indigo-300 font-semibold' 
                      : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                  }`}
                  title="Toggle full model gallery pills"
                >
                  {showFullModelCatalog ? 'Hide Gallery ▴' : 'Gallery ▾'}
                </button>

                {/* Gemini Memory Distiller Launcher */}
                <button
                  type="button"
                  onClick={() => setShowMemoryDistillModal(true)}
                  className="px-2 py-0.5 rounded text-[10px] whitespace-nowrap transition-colors border bg-purple-500/15 border-purple-500/30 text-purple-200 hover:text-white hover:bg-purple-600/30 flex items-center gap-1 shadow-sm"
                  title="Distill multi-turn conversation memory with Gemini for KIE models"
                >
                  <Brain className="w-3 h-3 text-purple-400" />
                  <span className="hidden sm:inline">Distill Memory</span>
                  <span className="sm:hidden">Distill</span>
                </button>

                {/* Custom Model Input Popup */}
                {showCustomModelField && (
                  <div className="flex items-center gap-1 shrink-0 bg-white/5 p-0.5 rounded-lg border border-indigo-500/40">
                    <input
                      type="text"
                      placeholder="e.g. gpt-5-6-luna"
                      value={customModelInput}
                      onChange={(e) => setCustomModelInput(e.target.value)}
                      className="bg-black/80 px-1.5 py-0.5 text-xs rounded border border-white/10 text-white focus:outline-none focus:border-indigo-400 w-28 font-mono"
                    />
                    <button
                      onClick={() => {
                        if (customModelInput.trim()) {
                          handleUpdateSession({ model: customModelInput.trim() });
                          setShowCustomModelField(false);
                        }
                      }}
                      className="px-1.5 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded"
                    >
                      Set
                    </button>
                    <button
                      onClick={() => setShowCustomModelField(false)}
                      className="p-0.5 text-white/40 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Right Side: Feature Toggles (Memory, Loop, Repo, Font Size) */}
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                {/* Memory Quick Toggle */}
                <button
                  type="button"
                  onClick={() => handleUpdateSession({ memoryEnabled: activeSession.memoryEnabled === false ? true : false })}
                  className={`px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px] whitespace-nowrap transition-all flex items-center gap-1 font-medium ${
                    activeSession.memoryEnabled !== false
                      ? 'bg-purple-600/25 hover:bg-purple-600/35 text-purple-200 border border-purple-500/40'
                      : 'bg-white/5 hover:bg-white/10 text-white/40 border border-white/5 hover:text-white/70'
                  }`}
                  title={activeSession.memoryEnabled !== false ? "Memory ON: Retains context across turns" : "Memory OFF: Single prompt only"}
                >
                  <Brain className={`w-3 h-3 ${activeSession.memoryEnabled !== false ? 'text-purple-400' : 'text-white/40'}`} />
                  <span className="hidden sm:inline">Memory</span>
                  <span className="font-bold">{activeSession.memoryEnabled !== false ? 'ON' : 'OFF'}</span>
                </button>

                {/* Auto-Loop Quick Toggle */}
                <div className="flex items-center gap-0.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleUpdateSession({ loopEnabled: !activeSession.loopEnabled })}
                    className={`px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px] whitespace-nowrap transition-all flex items-center gap-1 font-medium ${
                      activeSession.loopEnabled
                        ? 'bg-emerald-600/25 hover:bg-emerald-600/35 text-emerald-200 border border-emerald-500/40'
                        : 'bg-white/5 hover:bg-white/10 text-white/40 border border-white/5 hover:text-white/70'
                    }`}
                    title={activeSession.loopEnabled ? `Auto-Loop ON (${activeSession.maxLoopSteps || 3}x)` : "Auto-Loop OFF"}
                  >
                    <RefreshCw className={`w-3 h-3 ${activeSession.loopEnabled ? 'text-emerald-400 animate-spin-slow' : 'text-white/40'}`} />
                    <span className="hidden sm:inline">Loop</span>
                    <span className="font-bold">{activeSession.loopEnabled ? `${activeSession.maxLoopSteps || 3}x` : 'OFF'}</span>
                  </button>

                  {activeSession.loopEnabled && (
                    <div className="relative inline-flex items-center">
                      <select
                        value={activeSession.maxLoopSteps || 3}
                        onChange={(e) => handleUpdateSession({ maxLoopSteps: parseInt(e.target.value, 10) })}
                        className="bg-emerald-950/80 hover:bg-emerald-900/90 border border-emerald-500/40 rounded-md pl-1.5 pr-4 py-0.5 text-[10px] font-bold text-emerald-200 focus:outline-none cursor-pointer appearance-none shadow-sm transition-colors"
                        title="Set Auto-Loop turns"
                      >
                        <option value={2} className="bg-[#18181c] text-white">2x</option>
                        <option value={3} className="bg-[#18181c] text-white">3x</option>
                        <option value={4} className="bg-[#18181c] text-white">4x</option>
                        <option value={5} className="bg-[#18181c] text-white">5x</option>
                      </select>
                      <ChevronDown className="w-2.5 h-2.5 text-emerald-400 absolute right-1 pointer-events-none" />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsGuideModalOpen(true)}
                    className="p-0.5 text-white/30 hover:text-indigo-300 rounded"
                    title="Open Auto-Loop Guide"
                  >
                    <HelpCircle className="w-3 h-3" />
                  </button>
                </div>

                {/* Credit Saver Quick Toggle (Gemini Code Distiller) */}
                <button
                  type="button"
                  onClick={() => handleToggleCreditSaver(!creditSaverEnabled)}
                  className={`px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium flex items-center gap-1 transition-all ${
                    creditSaverEnabled
                      ? 'bg-amber-500/20 border border-amber-500/40 text-amber-200'
                      : 'bg-white/5 border border-white/10 text-white/40 hover:text-white/70'
                  }`}
                  title={creditSaverEnabled ? "Credit Saver ON: Gemini pre-reads & compresses raw code files in the background to save 90-95% KIE credits" : "Credit Saver OFF: Raw code files are sent directly to KIE"}
                >
                  <Zap className={`w-3 h-3 ${creditSaverEnabled ? 'text-amber-400' : 'text-white/40'}`} />
                  <span className="hidden sm:inline">Saver</span>
                  <span className="font-bold">{creditSaverEnabled ? 'ON' : 'OFF'}</span>
                </button>

                {/* Architect Mode Quick Toggle (KIE Plan -> Gemini Build) */}
                <button
                  type="button"
                  onClick={() => handleToggleArchitectMode(!architectModeEnabled)}
                  className={`px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium flex items-center gap-1 transition-all ${
                    architectModeEnabled
                      ? 'bg-purple-600/30 border border-purple-500/50 text-purple-200 shadow-sm ring-1 ring-purple-500/30'
                      : 'bg-white/5 border border-white/10 text-white/40 hover:text-white/70'
                  }`}
                  title={architectModeEnabled ? "Architect Mode ON: KIE drafts high-level blueprint (~85-90% output credit savings), and Gemini builds the full code for free in the background." : "Architect Mode OFF: KIE writes the full response directly."}
                >
                  <Layers className={`w-3 h-3 ${architectModeEnabled ? 'text-purple-400' : 'text-white/40'}`} />
                  <span className="hidden sm:inline">Architect</span>
                  <span className="font-bold">{architectModeEnabled ? 'ON' : 'OFF'}</span>
                </button>

                {/* Repo Quick Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    if (!activeSession.repoConfig?.owner || !activeSession.repoConfig?.repo) {
                      setShowGitHubModal(true);
                      return;
                    }
                    handleUpdateSession({
                      repoConfig: {
                        ...activeSession.repoConfig,
                        isEnabled: !Boolean(activeSession.repoConfig?.isEnabled),
                      }
                    });
                  }}
                  className={`px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium flex items-center gap-1 transition-all ${
                    activeSession.repoConfig?.isEnabled && activeSession.repoConfig?.owner && activeSession.repoConfig?.repo
                      ? 'bg-blue-600/30 border border-blue-500/50 text-blue-200'
                      : 'bg-white/5 border border-white/10 text-white/40 hover:text-white/70'
                  }`}
                  title={activeSession.repoConfig?.owner ? `GitHub Repo Context: ${activeSession.repoConfig.owner}/${activeSession.repoConfig.repo}` : "Connect & Attach GitHub Repo"}
                >
                  <Github className={`w-3 h-3 ${activeSession.repoConfig?.isEnabled && activeSession.repoConfig?.owner ? 'text-blue-400' : 'text-white/40'}`} />
                  <span className="hidden sm:inline">Repo</span>
                  <span className="font-bold">{activeSession.repoConfig?.isEnabled && activeSession.repoConfig?.owner ? 'ON' : 'OFF'}</span>
                </button>

                {/* Compact Font Size Stepper */}
                <div className="flex items-center bg-white/5 border border-white/10 rounded-md p-0.5 shrink-0" title="Chat font size">
                  <button
                    type="button"
                    onClick={handleDecreaseFontSize}
                    disabled={fontSize === '4px'}
                    className="px-1 py-0.5 rounded text-white/50 hover:text-white disabled:opacity-20 text-[9px] font-bold"
                    title="Decrease font (A-)"
                  >
                    A-
                  </button>
                  <select
                    value={fontSize}
                    onChange={(e) => handleSetFontSize(e.target.value as ChatFontSize)}
                    className="bg-transparent text-[10px] font-semibold text-indigo-300 focus:outline-none cursor-pointer px-0.5 appearance-none text-center font-mono"
                  >
                    {CHAT_FONT_SIZE_ORDER.map(sz => (
                      <option key={sz} value={sz} className="bg-[#18181c] text-white">
                        {CHAT_FONT_CONFIGS[sz].label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleIncreaseFontSize}
                    disabled={fontSize === '24px'}
                    className="px-1 py-0.5 rounded text-white/50 hover:text-white disabled:opacity-20 text-[9px] font-bold"
                    title="Increase font (A+)"
                  >
                    A+
                  </button>
                </div>
              </div>
            </div>

            {/* Optional Collapsible Gallery for Full Models Catalog */}
            {showFullModelCatalog && (
              <div className="border-b border-white/10 px-2 sm:px-3 py-1.5 bg-black/60 flex flex-col gap-1.5 shrink-0 animate-in slide-in-from-top-1">
                <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar text-[11px] pb-0.5">
                  <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider shrink-0 mr-1 flex items-center gap-1">
                    <Layers className="w-3 h-3 text-indigo-400" /> Filter:
                  </span>
                  {[
                    { id: 'big3', label: '⭐ Flagship' },
                    { id: 'Google', label: 'Gemini (7)' },
                    { id: 'OpenAI', label: 'OpenAI (8)' },
                    { id: 'Anthropic', label: 'Claude (12)' },
                    { id: 'xAI', label: 'Grok (4)' },
                    { id: 'DeepSeek', label: 'DeepSeek (3)' },
                    { id: 'Moonshot', label: 'Kimi (1)' },
                    { id: 'all', label: 'All Models' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setProviderFilter(tab.id as any)}
                      className={`px-2 py-0.5 rounded-full whitespace-nowrap transition-all text-[11px] font-medium ${
                        providerFilter === tab.id
                          ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30 border border-indigo-400/50'
                          : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar shrink-0 w-full max-w-full min-w-0">
                  {(() => {
                    let filteredModels = KIE_POPULAR_MODELS;
                    if (providerFilter === 'big3') {
                      filteredModels = KIE_POPULAR_MODELS.filter(m => 
                        ['gemini-3.8-flash', 'gpt-6-astra', 'claude-sonnet-5', 'claude-opus-5', 'gpt-5-6-sol', 'gemini-3.7-flash', 'grok-4-7', 'deepseek-v4-1-flash', 'deepseek-r1', 'kimi-k3'].includes(m.id)
                      );
                    } else if (providerFilter === 'Google') {
                      filteredModels = KIE_POPULAR_MODELS.filter(m => m.provider === 'Google');
                    } else if (providerFilter === 'OpenAI') {
                      filteredModels = KIE_POPULAR_MODELS.filter(m => m.provider === 'OpenAI');
                    } else if (providerFilter === 'Anthropic') {
                      filteredModels = KIE_POPULAR_MODELS.filter(m => m.provider === 'Anthropic');
                    } else if (providerFilter === 'xAI') {
                      filteredModels = KIE_POPULAR_MODELS.filter(m => m.provider === 'xAI');
                    } else if (providerFilter === 'DeepSeek') {
                      filteredModels = KIE_POPULAR_MODELS.filter(m => m.provider === 'DeepSeek');
                    } else if (providerFilter === 'Moonshot') {
                      filteredModels = KIE_POPULAR_MODELS.filter(m => m.provider === 'Moonshot' || m.provider === 'Other');
                    }

                    return filteredModels.map(m => {
                      const isSelected = activeSession.model === m.id;
                      return (
                        <button
                          key={m.id}
                          onClick={() => handleUpdateSession({ model: m.id })}
                          className={`px-2 py-0.5 rounded text-[11px] whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${
                            isSelected
                              ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30 border border-indigo-400/50'
                              : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/5'
                          }`}
                          title={`${m.name} (${m.provider}) - ${m.description}`}
                        >
                          <span>{m.name}</span>
                          {m.badge && (
                            <span className={`text-[8px] px-1 rounded ${isSelected ? 'bg-black/30 text-white' : 'bg-white/10 text-white/50'}`}>
                              {m.badge}
                            </span>
                          )}
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

            {/* GitHub Repository Status Bar (Only when Repo analysis is enabled) */}
            {activeSession.repoConfig?.isEnabled && activeSession.repoConfig?.owner && activeSession.repoConfig?.repo && (
              <RepoStatusBar
                owner={activeSession.repoConfig.owner}
                repo={activeSession.repoConfig.repo}
                branch={activeSession.repoConfig.branch || 'main'}
                onBranchChange={(newBranch) => {
                  handleUpdateSession({
                    repoConfig: {
                      ...activeSession.repoConfig,
                      branch: newBranch,
                    }
                  });
                }}
                onRefreshStart={() => setAgentStatusText('Refreshing repository index...')}
                onRefreshComplete={() => setAgentStatusText('')}
                onGenerateJulesTask={handleTriggerJulesTaskPrompt}
                onOpenRepoBrowser={() => setShowGitHubModal(true)}
                onClose={() => {
                  setSessions(prev => prev.map(s => s.id === activeSession.id ? {
                    ...s,
                    repoConfig: {
                      ...s.repoConfig,
                      isEnabled: false
                    }
                  } : s));
                }}
              />
            )}

            {/* Messages Scroll Area */}
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-2 sm:p-3.5 space-y-2 sm:space-y-3 custom-scrollbar w-full max-w-full">
              {activeSession.messages.map((msg) => {
                const isUser = msg.role === 'user';
                const msgContent = typeof msg?.content === 'string' ? msg.content : String(msg?.content ?? '');
                const isLongMessage = msgContent.length > 280 || (msgContent.match(/\n/g) || []).length >= 5;
                const isCollapsed = Boolean(collapsedMessageIds[msg.id]);

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-1.5 sm:gap-2.5 w-full max-w-5xl mx-auto min-w-0 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shrink-0 shadow-md ${
                      isUser 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gradient-to-tr from-purple-700 to-indigo-800 text-white border border-white/10'
                    }`}>
                      {isUser ? <User className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Bot className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                    </div>

                    {/* Message Bubble Container */}
                    <div className={`flex flex-col gap-0.5 max-w-[92%] sm:max-w-[88%] min-w-0 group ${isUser ? 'items-end' : 'items-start'}`}>
                      {/* Bubble Header info + Action Toolbar */}
                      <div className={`flex items-center gap-1.5 px-0.5 w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 truncate max-w-[100px] sm:max-w-none">
                          {isUser ? 'You' : `${activeSession.model}`}
                        </span>
                        <span className="text-[10px] text-white/20">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-indigo-300 text-[9px] font-mono font-bold shadow-sm" title={`Turn #${messageTurns.get(msg.id) || 1}`}>
                          Turn {messageTurns.get(msg.id) || 1}
                        </span>

                        {/* Top Action Toolbar */}
                        <div className="flex items-center gap-1 opacity-70 md:opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                          {((messageTurns.get(msg.id) || 1) < totalTurns) && (
                            <button
                              onClick={() => handleRevertToTurn(messageTurns.get(msg.id) || 1)}
                              disabled={isLoading}
                              className="p-1 rounded hover:bg-amber-500/20 text-white/50 hover:text-amber-300 disabled:opacity-30 transition-colors flex items-center gap-0.5"
                              title={`Revert conversation to Turn ${messageTurns.get(msg.id) || 1} (removes turns ${(messageTurns.get(msg.id) || 1) + 1} to ${totalTurns})`}
                            >
                              <History className="w-3 h-3 text-amber-400" />
                              <span className="text-[9px] font-mono text-amber-300/80 hidden sm:inline">↩ Revert</span>
                            </button>
                          )}
                          {isLongMessage && (
                            <button
                              onClick={() => toggleCollapseMessage(msg.id)}
                              className="p-1 rounded hover:bg-white/10 text-indigo-300 hover:text-white transition-colors flex items-center gap-0.5 text-[10px] font-medium"
                              title={isCollapsed ? "Expand message text" : "Collapse message text"}
                            >
                              {isCollapsed ? (
                                <>
                                  <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />
                                  <span className="hidden sm:inline">Expand</span>
                                </>
                              ) : (
                                <>
                                  <ChevronUp className="w-3.5 h-3.5 text-indigo-400" />
                                  <span className="hidden sm:inline">Collapse</span>
                                </>
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => handleRetryMessage(msg.id)}
                            disabled={isLoading}
                            className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-indigo-300 disabled:opacity-30 transition-colors"
                            title={isUser ? "Retry / Resend message" : "Retry / Regenerate response"}
                          >
                            <RotateCcw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                          </button>
                          <button
                            onClick={() => handleStartEdit(msg.id, msg.content)}
                            className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                            title="Edit message"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="p-1 rounded hover:bg-red-500/20 text-white/50 hover:text-red-300 transition-colors"
                            title="Delete message"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleCopy(msgContent, msg.id)}
                            className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                            title="Copy text"
                          >
                            {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>

                      {/* Bubble Body */}
                      {(() => {
                        const isErrorMessage = Boolean(msg.isError || msg.id.startsWith('err_') || msgContent.startsWith('⚠️'));
                        const fontCfg = CHAT_FONT_CONFIGS[fontSize] || CHAT_FONT_CONFIGS['14px'];
                        return (
                          <div className={`px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 rounded-xl sm:rounded-2xl ${fontCfg.chatTextClass} leading-relaxed relative break-words w-full max-w-full min-w-0 overflow-hidden transition-all ${
                            isUser
                              ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg'
                              : isErrorMessage
                                ? 'bg-gradient-to-b from-[#220d11] to-[#160a0c] border border-red-500/40 text-red-100 rounded-tl-none shadow-xl'
                                : 'bg-[#18181c] border border-white/10 text-white/90 rounded-tl-none shadow-xl'
                          }`}>
                        {editingMessageId === msg.id ? (
                          <div className="space-y-2.5 min-w-[260px] sm:min-w-[360px] max-w-full">
                            <textarea
                              rows={3}
                              value={editingContent}
                              onChange={(e) => setEditingContent(e.target.value)}
                              className={`w-full p-2.5 bg-black/60 border border-white/20 rounded-xl ${fontCfg.inputTextClass} text-white focus:outline-none focus:border-indigo-400 resize-y custom-scrollbar`}
                              autoFocus
                              placeholder="Edit your message..."
                            />
                            <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
                              <button
                                onClick={handleCancelEdit}
                                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-[11px] font-medium transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveEdit(msg.id, false)}
                                disabled={!editingContent.trim() || isLoading}
                                className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 disabled:opacity-40 text-white text-[11px] font-medium transition-colors flex items-center gap-1"
                                title="Save changes in-place without removing subsequent messages"
                              >
                                <Check className="w-3 h-3" /> Save Only
                              </button>
                              <button
                                onClick={() => handleSaveEdit(msg.id, true)}
                                disabled={!editingContent.trim() || isLoading}
                                className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-[11px] font-bold transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
                                title="Forget all messages below this point and resend to the AI"
                              >
                                <Send className="w-3 h-3" /> Save & Resend
                              </button>
                            </div>
                            <div className="text-[10px] text-white/40 text-right pr-0.5">
                              "Save & Resend" forgets subsequent chat history and branches from here
                            </div>
                          </div>
                        ) : (
                          <div className={`relative transition-all ${isCollapsed ? 'max-h-28 sm:max-h-36 overflow-hidden select-none' : ''}`}>
                            {isUser ? (
                              <div>
                                <KieMarkdownRenderer 
                                  content={msgContent} 
                                  fontSize={fontSize} 
                                  isUser={true} 
                                />
                                {msg.attachments && msg.attachments.length > 0 && (
                                  <div className="mt-2.5 space-y-2">
                                    {msg.attachments.map((att, idx) => (
                                      <CollapsibleFileAttachment key={idx} file={att} />
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <>
                                {/* Loop Turn Badge */}
                                {msg.loopStepNumber && msg.loopTotalSteps && (
                                  <div className="flex items-center gap-1.5 mb-2.5 pb-2 border-b border-emerald-500/20 text-[11px] text-emerald-300">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 font-semibold text-emerald-200">
                                      <RefreshCw className="w-3 h-3 text-emerald-400" />
                                      <span>Auto-Loop Turn {msg.loopStepNumber} of {msg.loopTotalSteps}</span>
                                    </span>
                                    <span className="text-[10px] text-emerald-400/60">
                                      {msg.loopStepNumber === 1 ? '• Initial Reply' : msg.loopStepNumber === msg.loopTotalSteps ? '• Synthesis & Polish' : '• Reading Reply & Continuing'}
                                    </span>
                                  </div>
                                )}

                                {/* Inspected GitHub Files Badge */}
                                {msg.retrievedFiles && msg.retrievedFiles.length > 0 && (
                                  <div className="flex flex-wrap items-center gap-1.5 mb-2.5 pb-2 border-b border-white/10 text-[11px] text-blue-300">
                                    <FileCode className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                    <span className="font-semibold text-blue-200">Inspected from master:</span>
                                    {msg.retrievedFiles.map((rf, i) => (
                                      <span key={i} className="bg-blue-950/70 border border-blue-800/50 px-1.5 py-0.5 rounded text-blue-300 font-mono text-[10px]">
                                        {rf.path.split('/').pop()} (L{rf.startLine}-{rf.endLine})
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {/* Auto-Loop Execution Trajectory Drawer */}
                                {msg.loopSteps && msg.loopSteps.length > 0 && (
                                  <div className="mb-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 overflow-hidden text-xs">
                                    <button
                                      type="button"
                                      onClick={() => toggleExpandLoopSteps(msg.id)}
                                      className="w-full px-3 py-2 bg-emerald-950/40 hover:bg-emerald-900/40 flex items-center justify-between text-emerald-300 font-medium transition-colors"
                                    >
                                      <div className="flex items-center gap-2">
                                        <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>Auto-Loop Reasoning Trajectory ({msg.loopSteps.length} Steps)</span>
                                      </div>
                                      <div className="flex items-center gap-1.5 text-[11px] text-white/50">
                                        <span>{expandedLoopMsgIds[msg.id] ? 'Hide step details' : 'View steps'}</span>
                                        {expandedLoopMsgIds[msg.id] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                      </div>
                                    </button>
                                    {expandedLoopMsgIds[msg.id] && (
                                      <div className="p-3 space-y-2.5 border-t border-emerald-500/20 divide-y divide-white/5">
                                        {msg.loopSteps.map((s, sIdx) => (
                                          <div key={sIdx} className="pt-2 first:pt-0 space-y-1">
                                            <div className="flex items-center justify-between text-[11px]">
                                              <span className="font-bold text-emerald-300 uppercase tracking-wide">
                                                Step {s.step}: {s.label}
                                              </span>
                                            </div>
                                            <p className="text-white/70 text-[11px] font-mono bg-black/40 p-2 rounded-lg border border-white/5 whitespace-pre-wrap">
                                              {s.summary}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Architect Mode Pipeline Banner & Expandable Blueprint Drawer */}
                                {msg.architectBlueprint && (
                                  <div className="mb-3 rounded-xl border border-purple-500/30 bg-purple-950/20 overflow-hidden text-xs">
                                    <div className="px-3 py-2 bg-purple-950/40 flex items-center justify-between text-purple-200">
                                      <div className="flex items-center gap-1.5 font-medium flex-wrap">
                                        <Layers className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                                        <span>
                                          Architect Pipeline: Planned by <span className="text-white font-mono">{msg.architectModel}</span> → Built by <span className="text-white font-mono">{msg.builderModel || 'Gemini 3.7'}</span>
                                        </span>
                                        {msg.savedPercent ? (
                                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold ml-1">
                                            Saved ~{msg.savedPercent}% Credits
                                          </span>
                                        ) : null}
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => toggleExpandBlueprint(msg.id)}
                                        className="px-2 py-0.5 rounded-md bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-[10px] font-bold flex items-center gap-1 transition-all shrink-0 cursor-pointer"
                                      >
                                        <span>{expandedBlueprintMsgIds[msg.id] ? 'Hide Blueprint' : 'View Blueprint'}</span>
                                        <ChevronDown className={`w-3 h-3 transition-transform ${expandedBlueprintMsgIds[msg.id] ? 'rotate-180' : ''}`} />
                                      </button>
                                    </div>

                                    {expandedBlueprintMsgIds[msg.id] && (
                                      <div className="p-3 border-t border-purple-500/20 text-[11px] text-purple-200/90 font-mono bg-black/60 whitespace-pre-wrap max-h-60 overflow-y-auto custom-scrollbar">
                                        {msg.architectBlueprint}
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Jules Task Card if content contains Jules Task */}
                                {(msgContent.includes('### 📋 JULES TASK:') || msgContent.includes('Jules-Ready Implementation Task')) ? (
                                  <JulesTaskCard content={msgContent} />
                                ) : (
                                  <KieMarkdownRenderer 
                                    content={msgContent} 
                                    fontSize={fontSize} 
                                    isUser={false} 
                                  />
                                )}

                                {/* Retry / Reload Action Bar inside Error Messages */}
                                {isErrorMessage && (
                                  <div className="mt-3 pt-2.5 border-t border-red-500/30 flex flex-wrap items-center justify-between gap-2 bg-black/40 -mx-3 -mb-3 sm:-mx-4 sm:-mb-4 p-2.5 sm:p-3 rounded-b-2xl">
                                    <div className="flex items-center gap-1.5 text-[11px] text-red-300 font-medium">
                                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                                      <span>Request failed. Click reload to retry.</span>
                                    </div>
                                    <button
                                      onClick={() => handleRetryMessage(msg.id)}
                                      disabled={isLoading}
                                      className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-red-950/60 active:scale-95 cursor-pointer"
                                      title="Retry this request"
                                    >
                                      <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                                      <span>Reload / Retry</span>
                                    </button>
                                  </div>
                                )}
                              </>
                            )}

                            {/* Collapsed Overlay with Gradient and Expand Button */}
                            {isCollapsed && (
                              <div 
                                onClick={() => toggleCollapseMessage(msg.id)}
                                className={`absolute inset-x-0 bottom-0 h-20 flex items-end justify-center pb-2 cursor-pointer z-10 ${
                                  isUser
                                    ? 'bg-gradient-to-t from-indigo-600 via-indigo-600/90 to-transparent'
                                    : 'bg-gradient-to-t from-[#18181c] via-[#18181c]/90 to-transparent'
                                }`}
                              >
                                <span className={`px-3 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105 ${
                                  isUser
                                    ? 'bg-black/50 hover:bg-black/70 text-white border border-white/20'
                                    : 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400/30'
                                }`}>
                                  <ChevronDown className="w-3.5 h-3.5" /> 
                                  <span>Expand text ({msgContent.split('\n').length} lines)</span>
                                </span>
                              </div>
                            )}

                            {/* Expanded Footer Button for Long Messages */}
                            {isLongMessage && !isCollapsed && (
                              <div className={`mt-3 pt-1.5 border-t flex justify-end ${
                                isUser ? 'border-white/20 text-white/70' : 'border-white/10 text-white/50'
                              }`}>
                                <button
                                  onClick={() => toggleCollapseMessage(msg.id)}
                                  className="text-[10px] hover:text-white flex items-center gap-1 px-2 py-0.5 rounded hover:bg-white/10 transition-colors font-medium"
                                  title="Collapse message text"
                                >
                                  <ChevronUp className="w-3 h-3" />
                                  <span>Collapse text</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                        );
                      })()}
                    </div>
                  </div>
                );
              })}

              {/* Loading Indicator Bubble */}
              {isLoading && (
                <div className="flex gap-2 sm:gap-3 w-full max-w-4xl mx-auto min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-800 text-white border border-white/10 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
                  </div>
                  <div className="bg-[#18181c] border border-white/10 rounded-2xl rounded-tl-none p-3 sm:p-4 shadow-xl flex items-center gap-3">
                    <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin shrink-0" />
                    <span className="text-xs text-white/80 font-medium">
                      {agentStatusText || `Thinking via ${activeSession.model}...`}
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="border-t border-white/10 p-1.5 sm:p-2.5 bg-black/40 shrink-0 pb-[max(0.5rem,env(safe-area-inset-bottom))] w-full max-w-full">
              <div className="w-full max-w-5xl mx-auto flex flex-col gap-1 min-w-0">

                {/* Attached Files Chips */}
                {attachedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-1 pb-0.5">
                    {attachedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-indigo-950/60 border border-indigo-500/40 text-indigo-200 text-xs shadow-sm animate-in fade-in"
                      >
                        <FileCode className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span className="truncate max-w-[150px] font-mono text-[11px]">{file.name}</span>
                        {file.range && (
                          <span className="text-[10px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                            L{file.range.start}-L{file.range.end}
                          </span>
                        )}
                        <span className="text-[10px] text-indigo-300/60">
                          ({file.lineCount ? `${file.lineCount} lines` : `${((file.size || 0) / 1024).toFixed(1)} KB`})
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setInputMessage(prev => prev ? `${prev}\n${file.content}` : file.content);
                            handleRemoveAttachedFile(idx);
                          }}
                          className="p-0.5 rounded hover:bg-white/10 text-white/50 hover:text-indigo-300 transition-colors"
                          title="Paste back as raw text in input box"
                        >
                          <Type className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachedFile(idx)}
                          className="p-0.5 rounded hover:bg-white/10 text-white/50 hover:text-red-400 transition-colors"
                          title="Remove file"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className={`relative flex flex-col bg-[#151518] border transition-all w-full max-w-full min-w-0 rounded-xl sm:rounded-2xl shadow-xl ${
                  isInputExpanded 
                    ? 'border-indigo-500/70 shadow-indigo-500/10' 
                    : 'border-white/15 focus-within:border-indigo-500'
                }`}>
                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    multiple
                    className="hidden"
                  />

                  {/* Expanded Mode Top Toolbar */}
                  {isInputExpanded && (
                    <div className="flex items-center justify-between px-2.5 py-1 border-b border-white/10 bg-white/5 rounded-t-xl sm:rounded-t-2xl text-[11px] text-white/60">
                      <div className="flex items-center gap-1.5">
                        <Maximize2 className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span className="font-semibold text-indigo-200">Expanded Prompt Editor</span>
                        <span className="text-white/30 hidden sm:inline">•</span>
                        <span className="text-white/50 text-[10px] hidden sm:inline">
                          {inputMessage ? inputMessage.split('\n').length : 0} lines ({inputMessage.length} chars)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white/40 hidden md:inline">Enter for newline • Tap Send to submit</span>
                        <button
                          type="button"
                          onClick={() => setIsInputExpanded(false)}
                          className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/15 text-white/80 hover:text-white text-xs flex items-center gap-1 font-medium transition-colors"
                          title="Collapse chat box to compact mode"
                        >
                          <Minimize2 className="w-3 h-3 text-indigo-400" />
                          <span>Collapse</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Input Row: Horizontal in Compact Mode, Column in Expanded Mode */}
                  <div className={`relative flex ${isInputExpanded ? 'flex-col' : 'items-center'} w-full`}>
                    {/* In compact mode: attachment buttons on the left */}
                    {!isInputExpanded && (
                      <div className="pl-1.5 sm:pl-2 flex items-center gap-0.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="p-1 sm:p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                          title="Upload file (code, text, docs, images)"
                        >
                          <Paperclip className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowGitHubModal(true)}
                          className="p-1 sm:p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors hidden sm:flex"
                          title="Connect GitHub file or repo"
                        >
                          <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
                        </button>
                      </div>
                    )}

                    {/* Textarea with Clipboard & Mobile Paste Support */}
                    <textarea
                      rows={isInputExpanded ? 6 : 1}
                      value={inputMessage}
                      onChange={(e) => {
                        const newVal = e.target.value;
                        const diff = newVal.length - inputMessage.length;
                        // Catch mobile paste (keyboard clipboard ribbon or long-press paste where onPaste is bypassed)
                        if (diff > 150 || (diff > 50 && newVal.split('\n').length - inputMessage.split('\n').length >= 3)) {
                          let insertedText = '';
                          if (newVal.startsWith(inputMessage)) {
                            insertedText = newVal.slice(inputMessage.length);
                          } else if (newVal.endsWith(inputMessage)) {
                            insertedText = newVal.slice(0, newVal.length - inputMessage.length);
                          } else {
                            insertedText = newVal;
                          }
                          if (insertedText.length > 120 || insertedText.split('\n').length >= 3) {
                            const handled = handleProcessPastedOrLargeText(insertedText);
                            if (handled) {
                              return; // Prevent huge dump into textarea
                            }
                          }
                        }
                        setInputMessage(newVal);
                      }}
                      onPaste={(e) => {
                        if (e.clipboardData.files && e.clipboardData.files.length > 0) {
                          e.preventDefault();
                          handleAttachRawFiles(Array.from(e.clipboardData.files));
                          return;
                        }
                        const pasted = e.clipboardData?.getData('text/plain') || e.clipboardData?.getData('text');
                        if (pasted && (pasted.length > 120 || pasted.split('\n').length >= 3)) {
                          e.preventDefault();
                          handleProcessPastedOrLargeText(pasted);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape' && isInputExpanded) {
                          setIsInputExpanded(false);
                        }
                      }}
                      placeholder={`Message ${activeSession.model}...`}
                      className={`w-full min-w-0 bg-transparent px-2 sm:px-2.5 py-1.5 sm:py-2 ${(CHAT_FONT_CONFIGS[fontSize] || CHAT_FONT_CONFIGS['14px']).inputTextClass} text-white placeholder:text-white/30 focus:outline-none custom-scrollbar transition-all ${
                        isInputExpanded ? 'min-h-[140px] sm:min-h-[180px] resize-y font-mono' : 'min-h-[36px] max-h-[120px] resize-none'
                      }`}
                    />

                    {/* Compact Mode Right Action Buttons */}
                    {!isInputExpanded && (
                      <div className="pr-1.5 sm:pr-2 flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => setIsInputExpanded(true)}
                          className="p-1 sm:p-1.5 rounded-lg text-white/40 hover:text-indigo-300 hover:bg-white/10 transition-colors"
                          title="Expand chat box to multi-line editor"
                        >
                          <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
                        </button>
                        {isLoading ? (
                          <button
                            onClick={() => abortControllerRef.current?.abort()}
                            className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl bg-red-600/30 hover:bg-red-600/50 text-red-300 transition-colors text-xs font-semibold flex items-center gap-1"
                            title="Cancel generation"
                          >
                            <X className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Stop</span>
                          </button>
                        ) : (
                          <button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() && attachedFiles.length === 0}
                            className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-30 disabled:hover:bg-indigo-600 transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1 text-xs font-semibold"
                            title="Send message"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Send</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Expanded Mode Bottom Actions Toolbar */}
                  {isInputExpanded && (
                    <div className="flex items-center justify-between px-3 py-2 border-t border-white/10 bg-black/25 rounded-b-2xl">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
                          title="Upload file"
                        >
                          <Paperclip className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Attach</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowGitHubModal(true)}
                          className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
                          title="Connect GitHub file or repo"
                        >
                          <Github className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="hidden sm:inline">GitHub</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Quick Font Size Stepper */}
                        <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5" title="Quick adjust font size (Min: 4px)">
                          <button
                            type="button"
                            onClick={handleDecreaseFontSize}
                            disabled={fontSize === '4px'}
                            className="px-1.5 py-0.5 rounded text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-20 text-[10px] font-bold transition-colors"
                            title="Smaller font (A-) • Min 4px"
                          >
                            A-
                          </button>
                          <span className="text-[10px] font-mono text-indigo-300 font-semibold px-1 select-none">
                            {CHAT_FONT_CONFIGS[fontSize]?.shortLabel || fontSize}
                          </span>
                          <button
                            type="button"
                            onClick={handleIncreaseFontSize}
                            disabled={fontSize === '24px'}
                            className="px-1.5 py-0.5 rounded text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-20 text-[10px] font-bold transition-colors"
                            title="Larger font (A+)"
                          >
                            A+
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsInputExpanded(false)}
                          className="px-2.5 py-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 text-xs flex items-center gap-1 transition-colors"
                          title="Collapse chat box"
                        >
                          <Minimize2 className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="hidden sm:inline">Collapse</span>
                        </button>

                        {isLoading ? (
                          <button
                            onClick={() => abortControllerRef.current?.abort()}
                            className="px-3 py-1.5 rounded-xl bg-red-600/30 hover:bg-red-600/50 text-red-300 transition-colors text-xs font-semibold flex items-center gap-1.5"
                            title="Cancel generation"
                          >
                            <X className="w-3.5 h-3.5" /> <span>Stop</span>
                          </button>
                        ) : (
                          <button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() && attachedFiles.length === 0}
                            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-30 disabled:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-600/30 text-xs font-semibold flex items-center gap-1.5"
                            title="Send message"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Send</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-[8px] sm:text-[9px] text-white/30 px-1 pt-0.5">
                  <span className="truncate">
                    Endpoint: <strong className="text-white/60">
                      {activeSession.model.startsWith('claude') ? '/claude/v1/messages' : activeSession.model.startsWith('gpt-5-6') || activeSession.model.startsWith('gpt-6') ? '/codex/v1/responses' : activeSession.model.startsWith('gemini') ? `/${activeSession.model}/v1/chat/completions` : '/v1/chat/completions'}
                    </strong>
                    {(activeSession.model.startsWith('gpt-6') || activeSession.model.startsWith('gpt-5-6')) && (
                      <span className="ml-2 text-indigo-300">
                        • Reasoning: <strong>{activeSession.reasoningEffort || 'low'}</strong>
                        {activeSession.enableWebSearch && <span className="text-sky-300 ml-1.5">• Web Search: ON</span>}
                      </span>
                    )}
                  </span>
                  <span className="truncate ml-2">Model: <strong className="text-indigo-400">{activeSession.model}</strong></span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Drawer Backdrop for Mobile */}
          {showSettingsDrawer && (
            <div 
              onClick={() => setShowSettingsDrawer(false)}
              className="fixed md:hidden inset-0 bg-black/75 z-40 animate-in fade-in"
            />
          )}

          {/* Right Drawer: Settings, Persona & Temperature */}
          {showSettingsDrawer && (
            <aside className="w-72 border-l border-white/10 bg-[#141418] p-4 flex flex-col gap-5 shrink-0 overflow-y-auto custom-scrollbar animate-in slide-in-from-right-4 fixed md:relative inset-y-0 right-0 z-50 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-indigo-400" />
                  <span className="font-bold text-xs uppercase tracking-wider text-white">Model Parameters</span>
                </div>
                <button
                  onClick={() => setShowSettingsDrawer(false)}
                  className="p-1 text-white/40 hover:text-white rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Persona Selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">
                  System Persona
                </label>
                <div className="space-y-1.5">
                  {SYSTEM_PERSONAS.map(p => {
                    const isSelected = activeSession.personaId === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleUpdateSession({ personaId: p.id })}
                        className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                            : 'bg-white/5 hover:bg-white/10 border-white/5 text-white/70'
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between">
                          <span>{p.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                        </div>
                        <p className="text-[10px] text-white/50 mt-0.5 leading-snug">{p.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Instructions Addition */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">
                  Custom System Instructions
                </label>
                <textarea
                  rows={3}
                  value={activeSession.customSystemPrompt || ''}
                  onChange={(e) => handleUpdateSession({ customSystemPrompt: e.target.value })}
                  placeholder="e.g. Always respond in French, or format scripts in Fountain syntax..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 resize-none font-mono"
                />
              </div>

              {/* Temperature Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-white/50">
                  <span>Temperature</span>
                  <span className="font-mono text-indigo-400">{activeSession.temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.5"
                  step="0.1"
                  value={activeSession.temperature}
                  onChange={(e) => handleUpdateSession({ temperature: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-500 bg-white/10 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-white/30">
                  <span>Deterministic (0.0)</span>
                  <span>Creative (1.5)</span>
                </div>
              </div>

              {/* Conversation Memory / Multi-turn Context Control */}
              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-300">
                    <Brain className="w-3.5 h-3.5" /> Multi-Turn Memory
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUpdateSession({ memoryEnabled: activeSession.memoryEnabled === false ? true : false })}
                    className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      activeSession.memoryEnabled !== false ? 'bg-purple-600' : 'bg-white/20'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        activeSession.memoryEnabled !== false ? 'translate-x-3' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-[10px] text-white/50 leading-relaxed">
                  {activeSession.memoryEnabled !== false
                    ? "Enabled: Automatically preserves previous turns to maintain chat context."
                    : "Disabled: Sends only your latest prompt to save token usage on long conversations."}
                </p>

                {activeSession.memoryEnabled !== false && (
                  <div className="pt-2 border-t border-purple-500/20 space-y-2.5">
                    {/* Sliding Context Window selector */}
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-white/70 font-medium">Context Window:</span>
                      <div className="flex items-center gap-1">
                        {[
                          { val: 4, label: '4 Turns' },
                          { val: 6, label: '6 (Smart)' },
                          { val: 12, label: '12 Turns' },
                          { val: 0, label: 'Full' },
                        ].map(({ val, label }) => {
                          const currentVal = activeSession.maxMemoryTurns ?? 6;
                          const isSelected = currentVal === val;
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => handleUpdateSession({ maxMemoryTurns: val })}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                                isSelected
                                  ? 'bg-purple-600 text-white shadow'
                                  : 'bg-white/5 hover:bg-white/10 text-white/60'
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Auto-Trim Historical Attachments Toggle */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="space-y-0.5 pr-2">
                        <span className="text-[11px] text-white/80 font-medium block">Trim Historical Files</span>
                        <span className="text-[9px] text-white/40 block leading-tight">Summarizes 20KB+ file dumps from past turns to prevent 500 server timeouts</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleUpdateSession({ trimHistoricalAttachments: activeSession.trimHistoricalAttachments === false ? true : false })}
                        className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          activeSession.trimHistoricalAttachments !== false ? 'bg-purple-600' : 'bg-white/20'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            activeSession.trimHistoricalAttachments !== false ? 'translate-x-3' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Gemini Executive Memory Synthesis Trigger */}
                    <div className="pt-2 border-t border-purple-500/20">
                      <button
                        type="button"
                        onClick={() => setShowMemoryDistillModal(true)}
                        className="w-full py-1.5 px-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-200 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span>Distill Executive Memory with Gemini</span>
                      </button>
                      <span className="text-[9px] text-white/40 block mt-1 leading-tight text-center">
                        Synthesizes critical rules & facts so KIE models stay in sync without token bloat
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Auto-Loop (Autonomous ReAct Mode) Control */}
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                    <RefreshCw className="w-3.5 h-3.5" /> Auto-Loop Mode
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUpdateSession({ loopEnabled: !activeSession.loopEnabled })}
                    className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      activeSession.loopEnabled ? 'bg-emerald-600' : 'bg-white/20'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        activeSession.loopEnabled ? 'translate-x-3' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-[10px] text-white/50 leading-relaxed">
                  {activeSession.loopEnabled
                    ? "Active: The model runs an autonomous loop (drafting, inspecting dependencies, self-critique, and polishing) before returning."
                    : "Disabled: Standard single-pass direct response."}
                </p>
                {activeSession.loopEnabled && (
                  <div className="pt-1.5 border-t border-emerald-500/20 flex items-center justify-between text-[11px]">
                    <span className="text-white/60">Loop Max Steps:</span>
                    <div className="flex items-center gap-1">
                      {[2, 3, 4, 5].map((steps) => (
                        <button
                          key={steps}
                          type="button"
                          onClick={() => handleUpdateSession({ maxLoopSteps: steps })}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                            (activeSession.maxLoopSteps || 3) === steps
                              ? 'bg-emerald-600 text-white shadow'
                              : 'bg-white/5 hover:bg-white/10 text-white/60'
                          }`}
                        >
                          {steps}x
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Anthropic Claude Controls (Claude Sonnet 4.5, Sonnet 5, 3.7 Sonnet, Opus) */}
              {activeSession.model.startsWith('claude') && (
                <div className="space-y-3 p-3 rounded-xl bg-amber-950/20 border border-amber-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                      <Brain className="w-3.5 h-3.5 text-amber-400" /> Claude Thinking Mode
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUpdateSession({ enableThinking: !activeSession.enableThinking })}
                      className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        activeSession.enableThinking ? 'bg-amber-600' : 'bg-white/20'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          activeSession.enableThinking ? 'translate-x-3' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <p className="text-[10px] text-amber-100/70 leading-relaxed">
                    {activeSession.enableThinking
                      ? "Thinking ON: Claude allocates dedicated chain-of-thought tokens for step-by-step reasoning before responding."
                      : "Thinking OFF: Standard direct response without chain-of-thought overhead."}
                  </p>

                  {activeSession.enableThinking && (
                    <div className="space-y-1.5 pt-2 border-t border-amber-500/20">
                      <div className="flex items-center justify-between text-[10px] text-amber-200">
                        <span>Thinking Budget:</span>
                        <span className="font-mono font-bold">{activeSession.thinkingBudgetTokens || 2048} tokens</span>
                      </div>
                      <input
                        type="range"
                        min="1024"
                        max="32768"
                        step="1024"
                        value={activeSession.thinkingBudgetTokens || 2048}
                        onChange={(e) => handleUpdateSession({ thinkingBudgetTokens: parseInt(e.target.value, 10) })}
                        className="w-full accent-amber-500 bg-white/10 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[8px] text-amber-200/40">
                        <span>1k (Fast)</span>
                        <span>8k</span>
                        <span>32k (Deep)</span>
                      </div>
                    </div>
                  )}

                  {/* Claude Max Output Tokens */}
                  <div className="space-y-1.5 pt-2 border-t border-amber-500/20">
                    <div className="flex items-center justify-between text-[10px] text-amber-200">
                      <span>Max Output Tokens:</span>
                      <span className="font-mono font-bold">{activeSession.maxOutputTokens || (activeSession.enableThinking ? 16000 : 8192)}</span>
                    </div>
                    <input
                      type="range"
                      min="1024"
                      max="64000"
                      step="2048"
                      value={activeSession.maxOutputTokens || (activeSession.enableThinking ? 16000 : 8192)}
                      onChange={(e) => handleUpdateSession({ maxOutputTokens: parseInt(e.target.value, 10) })}
                      className="w-full accent-amber-500 bg-white/10 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[8px] text-amber-200/40">
                      <span>1k</span>
                      <span>16k</span>
                      <span>64k (Max for Sonnet 4.5)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Google Gemini Controls (Gemini 2.5 Pro, Flash, Gemini 3) */}
              {activeSession.model.startsWith('gemini') && (
                <div className="space-y-3 p-3 rounded-xl bg-blue-950/20 border border-blue-500/30">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-300">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Gemini Parameters
                  </div>

                  {/* Google Search Grounding */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] text-blue-200">
                      <Globe className="w-3 h-3 text-sky-400" />
                      <span>Google Search Grounding</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUpdateSession({ enableWebSearch: !activeSession.enableWebSearch })}
                      className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        activeSession.enableWebSearch ? 'bg-blue-600' : 'bg-white/20'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          activeSession.enableWebSearch ? 'translate-x-3' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Gemini Max Output Tokens */}
                  <div className="space-y-1.5 pt-2 border-t border-blue-500/20">
                    <div className="flex items-center justify-between text-[10px] text-blue-200">
                      <span>Max Output Tokens:</span>
                      <span className="font-mono font-bold">{activeSession.maxOutputTokens || 16384}</span>
                    </div>
                    <input
                      type="range"
                      min="1024"
                      max="65536"
                      step="2048"
                      value={activeSession.maxOutputTokens || 16384}
                      onChange={(e) => handleUpdateSession({ maxOutputTokens: parseInt(e.target.value, 10) })}
                      className="w-full accent-blue-500 bg-white/10 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[8px] text-blue-200/40">
                      <span>1k</span>
                      <span>16k</span>
                      <span>65k (Gemini Context)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Advanced Model Controls: OpenAI, Codex, Grok, DeepSeek, Kimi */}
              {(activeSession.model.startsWith('gpt') || activeSession.model.startsWith('o1') || activeSession.model.includes('codex') || activeSession.model.startsWith('grok') || activeSession.model.startsWith('deepseek') || activeSession.model.startsWith('kimi')) && (
                <div className="space-y-3 p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                    <Cpu className="w-3.5 h-3.5" /> {activeSession.model.startsWith('grok') ? 'xAI Grok Controls' : 'Model Reasoning & Search Controls'}
                  </div>

                  {/* Reasoning Effort */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-white/60">
                      <span>Reasoning Effort</span>
                      <span className="font-mono text-indigo-400 capitalize">{activeSession.reasoningEffort || 'low'}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {(['low', 'medium', 'high', 'xhigh'] as const).map(effort => {
                        const isEffortActive = (activeSession.reasoningEffort || 'low') === effort;
                        return (
                          <button
                            key={effort}
                            type="button"
                            onClick={() => handleUpdateSession({ reasoningEffort: effort })}
                            className={`py-1 text-[10px] font-medium rounded transition-all capitalize ${
                              isEffortActive 
                                ? 'bg-indigo-600 text-white font-bold shadow' 
                                : 'bg-white/5 hover:bg-white/10 text-white/60'
                            }`}
                          >
                            {effort}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Web Search Toggle */}
                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-[10px] text-white/70">
                      <Globe className="w-3 h-3 text-sky-400" />
                      <span>Live Web Search</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUpdateSession({ enableWebSearch: !activeSession.enableWebSearch })}
                      className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        activeSession.enableWebSearch ? 'bg-indigo-600' : 'bg-white/20'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          activeSession.enableWebSearch ? 'translate-x-3' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* API Cost & Credit Reduction Guide Card */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-200/90 space-y-1.5 mt-auto">
                <div className="font-bold text-amber-300 flex items-center gap-1.5 text-[11px]">
                  <Coins className="w-3.5 h-3.5 text-amber-400" /> API Cost & Credit Usage
                </div>
                <p className="leading-relaxed text-amber-100/70">
                  Credits on <strong>KIE.ai</strong> are billed on a <strong>token-usage</strong> basis:
                </p>
                <ul className="list-disc pl-3.5 space-y-0.5 text-amber-200/80">
                  <li><strong>Prompt Tokens:</strong> Cost for words in your message, conversation history, and persona prompt.</li>
                  <li><strong>Completion Tokens:</strong> Cost for the generated AI response (higher rate per token).</li>
                  <li><strong>Reasoning Tokens:</strong> Thinking models (o1, GPT-6 Astra) deduct credits for chain-of-thought tokens.</li>
                  <li><strong>Prompt Caching:</strong> Reusing the same session persona caches prompt tokens at a discount.</li>
                </ul>
              </div>

              {/* Provider Info Card */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[10px] text-white/60 space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-indigo-400" /> KIE.ai Caching Note
                </div>
                <p>
                  Repeated system prompts trigger KIE.ai prompt cache reads, lowering token consumption and accelerating latency.
                </p>
              </div>

            </aside>
          )}

        </div>

      </div>

      {/* GitHub Repository Connect Modal */}
      <GitHubConnectModal
        isOpen={showGitHubModal}
        onClose={() => setShowGitHubModal(false)}
        onSelectRepo={(repo) => {
          handleUpdateSession({
            repoConfig: {
              owner: repo.owner,
              repo: repo.repo,
              branch: repo.branch,
              isEnabled: true,
            }
          });
        }}
        onClearLinkedRepo={() => {
          handleUpdateSession({
            repoConfig: {
              owner: '',
              repo: '',
              branch: '',
              isEnabled: false,
            }
          });
        }}
        onAttachContext={handleAttachGitHubContext}
      />

      {/* Auto-Loop Guide Modal */}
      <AutoLoopGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      {/* Gemini Executive Memory Distillation Modal */}
      <KieMemoryDistillModal
        isOpen={showMemoryDistillModal}
        onClose={() => setShowMemoryDistillModal(false)}
        sessions={sessions.map(s => ({
          id: s.id,
          title: s.title,
          messages: s.messages,
          model: s.model,
          updatedAt: s.updatedAt,
          customSystemPrompt: s.customSystemPrompt,
        }))}
        activeSessionId={activeSessionId}
        messages={activeSession.messages}
        maxTurns={activeSession.maxMemoryTurns ?? 6}
        currentSystemPrompt={activeSession.customSystemPrompt}
        onApplyExecutiveMemory={(distilledText, targetSessionId) => {
          if (targetSessionId === 'all') {
            setSessions(prev => {
              const updated = prev.map(s => ({ ...s, customSystemPrompt: distilledText, updatedAt: Date.now() }));
              try { localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(updated)); } catch {}
              return updated;
            });
          } else if (targetSessionId && targetSessionId !== activeSessionId) {
            setSessions(prev => {
              const updated = prev.map(s => s.id === targetSessionId ? { ...s, customSystemPrompt: distilledText, updatedAt: Date.now() } : s);
              try { localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(updated)); } catch {}
              return updated;
            });
          } else {
            handleUpdateSession({ customSystemPrompt: distilledText });
          }
        }}
      />

      {/* Claude-style Long Text Paste Modal */}
      <LongTextPasteModal
        isOpen={pasteModalData !== null}
        pasteData={pasteModalData}
        onPasteAsFile={(fileItem) => {
          setAttachedFiles(prev => [...prev, fileItem]);
          setPasteModalData(null);
        }}
        onPasteAsText={(rawText) => {
          setInputMessage(prev => prev ? `${prev}\n${rawText}` : rawText);
          setPasteModalData(null);
        }}
        onCancel={() => setPasteModalData(null)}
      />

      {/* KIE Real-Time Diagnostics & API Logs Modal */}
      <KieLogsModal
        isOpen={showLogsModal}
        onClose={() => setShowLogsModal(false)}
      />
    </div>
  );
};
