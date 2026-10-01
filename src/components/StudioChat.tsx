import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  Trash2, 
  Edit2, 
  Edit3,
  Image as ImageIcon, 
  X, 
  Loader2, 
  Copy, 
  Check, 
  Github, 
  FileCode, 
  Maximize2, 
  Minimize2, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw, 
  RotateCcw,
  Sparkles, 
  HelpCircle, 
  Square, 
  Globe, 
  ExternalLink, 
  Search, 
  GitBranch, 
  Terminal, 
  Paperclip, 
  UploadCloud, 
  FileText, 
  Music, 
  File, 
  Type,
  Plus,
  PanelLeft,
  PanelLeftClose,
  Clapperboard,
  Brain,
  PenLine,
  History,
  Undo2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { sendStudioChatMessage, generateChatImage, StudioGroundingSource, StudioGitRepoContext } from '@/services/gemini';
import { compressImage } from '@/utils/imageUtils';
import { get, set, del } from 'idb-keyval';
import { GitHubConnectModal } from './GitHubConnectModal';
import { CollapsibleFileAttachment, FileAttachmentItem } from './CollapsibleFileAttachment';
import { AutoLoopGuideModal } from './AutoLoopGuideModal';
import { RepoStatusBar } from './RepoStatusBar';
import { LongTextPasteModal, LongTextPasteData, detectSnippetFileName } from './LongTextPasteModal';
import { KieMemoryDistillModal } from './KieMemoryDistillModal';
import { ChatSidebar } from './studio-chat/ChatSidebar';
import { StudioConversation, StudioMessage } from '@/types/chat';
import { 
  loadConversationsList, 
  saveConversationsList, 
  loadConversationMessages, 
  saveConversationMessages, 
  deleteConversationFromDB, 
  generateConversationTitle, 
  formatConversationTimestamp 
} from '@/services/studioChatStorage';

import { 
  ChatFontSize, 
  CHAT_FONT_CONFIGS, 
  CHAT_FONT_SIZE_ORDER, 
  normalizeChatFontSize, 
  getNextFontSize, 
  getPrevFontSize 
} from '@/utils/chatFont';

export type StudioFontSize = ChatFontSize;
export const STUDIO_FONT_CONFIGS = CHAT_FONT_CONFIGS;

// Static plugin array to prevent ReactMarkdown from re-initializing plugins on every keystroke
const STATIC_STUDIO_REMARK_PLUGINS = [remarkGfm];

// Custom CodeBlock component with 1-click Copy button, line counter, and expand/collapse for StudioChat
const StudioCodeBlock = memo<{
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  fontSize?: ChatFontSize;
}>(({ inline, className, children, fontSize = '14px', ...props }) => {
  const [copied, setCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const rawCode = String(children).replace(/\n$/, '');
  const lineCount = rawCode ? rawCode.split('\n').length : 0;
  const isLong = lineCount > 10;

  const fontCfg = STUDIO_FONT_CONFIGS[fontSize] || STUDIO_FONT_CONFIGS['14px'];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(rawCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // react-markdown v9+ no longer passes `inline` boolean prop.
  // Inline code does not match language-* and does not contain/end with newlines.
  const isInline = inline ?? (!match && !String(children).includes('\n'));

  if (isInline) {
    return (
      <code className={`rounded bg-white/10 text-indigo-200 font-mono ${fontCfg.inlineCodeClass}`} {...props}>
        {children}
      </code>
    );
  }

  return (
    <div className="relative my-3 rounded-xl overflow-hidden border border-white/15 bg-[#0d0d11] shadow-2xl group/code">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#17171d] border-b border-white/10 text-[11px] text-white/50 select-none">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-indigo-300 uppercase tracking-wider">
            {language || 'code'}
          </span>
          <span className="text-[10px] text-white/40">
            {lineCount} {lineCount === 1 ? 'line' : 'lines'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {isLong && (
            <button
              onClick={() => setIsCollapsed(prev => !prev)}
              className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-white/10 text-indigo-300 hover:text-white transition-colors text-[10px] font-medium"
              title={isCollapsed ? "Expand all code lines" : "Collapse code block"}
            >
              {isCollapsed ? (
                <>
                  <ChevronDown className="w-3 h-3 text-indigo-400" />
                  <span>Expand</span>
                </>
              ) : (
                <>
                  <ChevronUp className="w-3 h-3 text-indigo-400" />
                  <span>Collapse</span>
                </>
              )}
            </button>
          )}
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-md hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] text-emerald-400 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[10px]">Copy code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className={`p-3.5 overflow-x-auto custom-scrollbar font-mono ${fontCfg.codeTextClass} text-slate-100 bg-[#0d0d11] transition-all relative ${
        isCollapsed ? 'max-h-36 overflow-hidden select-none' : ''
      }`}>
        <pre className="!m-0 !p-0 !bg-transparent !border-0">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
        {isCollapsed && (
          <div 
            onClick={() => setIsCollapsed(false)}
            className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0d0d11] via-[#0d0d11]/90 to-transparent flex items-end justify-center pb-2 cursor-pointer group-hover/code:from-[#111116]"
          >
            <span className="px-3 py-1 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold flex items-center gap-1 shadow-lg border border-indigo-400/30">
              <ChevronDown className="w-3 h-3" /> Show all {lineCount} lines
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

StudioCodeBlock.displayName = 'StudioCodeBlock';

// Dedicated Memoized Markdown Renderer for Studio Messages
const StudioMarkdownRenderer = memo<{
  text: string;
  fontSize: ChatFontSize;
  isProxy?: boolean;
}>(({ text, fontSize, isProxy }) => {
  const fontCfg = STUDIO_FONT_CONFIGS[fontSize] || STUDIO_FONT_CONFIGS['14px'];

  const components = useMemo(() => ({
    pre: ({ children }: any) => <>{children}</>,
    code: (props: any) => <StudioCodeBlock {...props} fontSize={fontSize} />,
    table: ({ children, ...props }: any) => (
      <div className="my-3 overflow-x-auto rounded-xl border border-white/15 bg-black/40 shadow-lg">
        <table className={`w-full text-left ${fontCfg.chatTextClass} border-collapse divide-y divide-white/10`} {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }: any) => (
      <thead className="bg-white/10 text-white font-semibold text-[11px] uppercase tracking-wider" {...props}>
        {children}
      </thead>
    ),
    th: ({ children, ...props }: any) => (
      <th className="px-3 py-2 border-r border-white/10 last:border-r-0 font-bold" {...props}>
        {children}
      </th>
    ),
    tbody: ({ children, ...props }: any) => (
      <tbody className="divide-y divide-white/10 text-white/80" {...props}>
        {children}
      </tbody>
    ),
    tr: ({ children, ...props }: any) => (
      <tr className="hover:bg-white/5 transition-colors odd:bg-white/[0.02]" {...props}>
        {children}
      </tr>
    ),
    td: ({ children, ...props }: any) => (
      <td className={`px-3 py-2 border-r border-white/10 last:border-r-0 font-mono ${fontCfg.chatTextClass}`} {...props}>
        {children}
      </td>
    ),
    blockquote: ({ children, ...props }: any) => (
      <blockquote className={`my-2.5 pl-3 border-l-2 italic ${fontCfg.chatTextClass} py-1 pr-2 rounded-r-lg ${
        isProxy ? 'border-amber-400 text-amber-200/90 bg-amber-950/20' : 'border-indigo-400 text-white/70 bg-indigo-950/20'
      }`} {...props}>
        {children}
      </blockquote>
    ),
    a: ({ href, children, ...props }: any) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors inline-flex items-center gap-0.5" 
        {...props}
      >
        {children}
      </a>
    ),
    ul: ({ children, ...props }: any) => (
      <ul className="my-2 pl-4 list-disc space-y-1 text-white/90" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: any) => (
      <ol className="my-2 pl-4 list-decimal space-y-1 text-white/90" {...props}>
        {children}
      </ol>
    ),
  }), [fontCfg, fontSize, isProxy]);

  return (
    <ReactMarkdown 
      remarkPlugins={STATIC_STUDIO_REMARK_PLUGINS}
      components={components}
    >
      {text}
    </ReactMarkdown>
  );
});

StudioMarkdownRenderer.displayName = 'StudioMarkdownRenderer';

export type Message = StudioMessage;

export type LoopModeType = 'dialogue' | 'task';
export type ProxyPersonaType = 'user_proxy' | 'critic' | 'devil' | 'collaborator';

export const StudioChat = ({ apiKeys, apiKeySource, onLog, projectData, setProjectData, directorPlan, setDirectorPlan }: any) => {
  const [conversations, setConversations] = useState<StudioConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });
  const [isEditingTitleInHeader, setIsEditingTitleInHeader] = useState(false);
  const [headerTitleInput, setHeaderTitleInput] = useState('');

  const activeConversationIdRef = useRef<string | null>(null);
  activeConversationIdRef.current = activeConversationId;

  const activeConversation = conversations.find(c => c.id === activeConversationId) || null;

  const [messages, setMessages] = useState<Message[]>([]);

  // Compute sequential turn number for each message in the conversation
  const { messageTurns, totalTurns } = useMemo(() => {
    const map = new Map<string, number>();
    let currentTurn = 0;
    for (const msg of messages) {
      if (msg.sender === 'user') {
        currentTurn += 1;
      }
      map.set(msg.id, Math.max(1, currentTurn));
    }
    return {
      messageTurns: map,
      totalTurns: currentTurn,
    };
  }, [messages]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editInput, setEditInput] = useState('');
  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const attachedImage = attachedImages[0] || null;
  const [attachedFiles, setAttachedFiles] = useState<FileAttachmentItem[]>([]);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [isInputExpanded, setIsInputExpanded] = useState(false);
  const [collapsedMessageIds, setCollapsedMessageIds] = useState<Record<string, boolean>>({});
  const [expandedLoopMsgIds, setExpandedLoopMsgIds] = useState<Record<string, boolean>>({});
  const [expandedSourcesMsgIds, setExpandedSourcesMsgIds] = useState<Record<string, boolean>>({});
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isWebSearchEnabled, setIsWebSearchEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('mv_studio_web_search_enabled');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });
  const [isAppEditEnabled, setIsAppEditEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('mv_studio_app_edit_enabled');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });
  const [isGitRepoEnabled, setIsGitRepoEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('mv_studio_git_enabled');
      const config = localStorage.getItem('mv_studio_git_repo_config');
      return saved === 'true' && !!config;
    } catch {
      return false;
    }
  });
  const [gitRepoConfig, setGitRepoConfig] = useState<{ owner: string; repo: string; branch: string } | null>(() => {
    try {
      const saved = localStorage.getItem('mv_studio_git_repo_config');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });
  const [indexedSummary, setIndexedSummary] = useState<any>(null);
  const [pasteModalData, setPasteModalData] = useState<LongTextPasteData | null>(null);
  const [showMemoryDistillModal, setShowMemoryDistillModal] = useState<boolean>(false);
  const [isLoopEnabled, setIsLoopEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('mv_studio_loop_enabled') === 'true';
    } catch {
      return false;
    }
  });
  const [loopMode, setLoopMode] = useState<LoopModeType>(() => {
    try {
      return (localStorage.getItem('mv_studio_loop_mode') as LoopModeType) || 'dialogue';
    } catch {
      return 'dialogue';
    }
  });
  const [proxyPersona, setProxyPersona] = useState<ProxyPersonaType>(() => {
    try {
      return (localStorage.getItem('mv_studio_proxy_persona') as ProxyPersonaType) || 'user_proxy';
    } catch {
      return 'user_proxy';
    }
  });
  const [loopIterations, setLoopIterations] = useState<number>(4);
  const [loopProgressText, setLoopProgressText] = useState<string>('');
  const [activeLoopStep, setActiveLoopStep] = useState<number>(0);
  const abortLoopRef = useRef<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const dragCounter = useRef(0);

  const [fontSize, setFontSize] = useState<ChatFontSize>(() => {
    try {
      const saved = localStorage.getItem('mv_studio_font_size');
      return normalizeChatFontSize(saved);
    } catch {}
    return '14px';
  });

  const handleSetFontSize = (size: ChatFontSize) => {
    setFontSize(size);
    try {
      localStorage.setItem('mv_studio_font_size', size);
    } catch {}
  };

  const handleIncreaseFontSize = () => {
    handleSetFontSize(getNextFontSize(fontSize));
  };

  const handleDecreaseFontSize = () => {
    handleSetFontSize(getPrevFontSize(fontSize));
  };

  const toggleExpandSources = (msgId: string) => {
    setExpandedSourcesMsgIds(prev => ({
      ...prev,
      [msgId]: prev[msgId] === undefined ? false : !prev[msgId]
    }));
  };

  const handleToggleAppEdit = (enabled: boolean) => {
    setIsAppEditEnabled(enabled);
    try {
      localStorage.setItem('mv_studio_app_edit_enabled', String(enabled));
    } catch {}
    if (onLog) {
      onLog(
        enabled 
          ? '✏️ App Edit Mode ON: Assistant can directly write, edit, and apply project text & settings into the app.'
          : '🔒 App Edit Mode OFF: Assistant will only reply in chat.',
        enabled ? 'info' : 'warning'
      );
    }
  };

  const handleToggleWebSearch = (enabled: boolean) => {
    setIsWebSearchEnabled(enabled);
    try {
      localStorage.setItem('mv_studio_web_search_enabled', String(enabled));
    } catch {}
    if (onLog) {
      onLog(`Google Search Grounding ${enabled ? 'enabled' : 'disabled'} for Studio Chat.`, enabled ? 'info' : 'warning');
    }
  };

  const handleToggleGitRepo = (enabled: boolean) => {
    if (enabled && !gitRepoConfig) {
      setIsGitHubModalOpen(true);
      return;
    }
    setIsGitRepoEnabled(enabled);
    try {
      localStorage.setItem('mv_studio_git_enabled', String(enabled));
    } catch {}

    if (activeConversationId && gitRepoConfig) {
      setConversations(prev => {
        const updated = prev.map(c => c.id === activeConversationId ? {
          ...c,
          repoConfig: {
            ...gitRepoConfig,
            isEnabled: enabled,
          },
          updatedAt: new Date().toISOString(),
        } : c);
        saveConversationsList(updated);
        return updated;
      });
    }

    if (onLog) {
      onLog(`Git & GitHub Repository Awareness ${enabled ? 'enabled' : 'disabled'} for Studio Chat.`, enabled ? 'info' : 'warning');
    }
  };

  const toggleExpandLoopSteps = (msgId: string) => {
    setExpandedLoopMsgIds(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  const handleToggleLoop = (enabled: boolean) => {
    setIsLoopEnabled(enabled);
    try {
      localStorage.setItem('mv_studio_loop_enabled', String(enabled));
    } catch {}
  };

  const handleChangeLoopMode = (mode: LoopModeType) => {
    setLoopMode(mode);
    try {
      localStorage.setItem('mv_studio_loop_mode', mode);
    } catch {}
  };

  const handleChangeProxyPersona = (persona: ProxyPersonaType) => {
    setProxyPersona(persona);
    try {
      localStorage.setItem('mv_studio_proxy_persona', persona);
    } catch {}
  };

  const handleStopGeneration = () => {
    abortLoopRef.current = true;
    setIsLoading(false);
    setLoopProgressText('');
    setActiveLoopStep(0);
    if (onLog) onLog('AI generation stopped by user.', 'warning');
  };

  const handleStopLoop = handleStopGeneration;

  const toggleCollapseMessage = (msgId: string) => {
    setCollapsedMessageIds(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  const [isInitialized, setIsInitialized] = useState(false);

  // Auto-detect mobile screen on mount & resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard shortcut Ctrl+B or Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        setIsSidebarOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initialize conversations list and load active chat
  useEffect(() => {
    const initConversations = async () => {
      try {
        const list = await loadConversationsList();
        setConversations(list);

        let initialActiveId: string | null = null;
        try {
          initialActiveId = localStorage.getItem('mv_studio_active_convo_id');
        } catch {}

        const targetConvo = list.find(c => c.id === initialActiveId && !c.isArchived) || list.find(c => !c.isArchived) || list[0];

        if (targetConvo) {
          setActiveConversationId(targetConvo.id);
          activeConversationIdRef.current = targetConvo.id;
          if (targetConvo.repoConfig && targetConvo.repoConfig.owner && targetConvo.repoConfig.repo) {
            setGitRepoConfig({
              owner: targetConvo.repoConfig.owner,
              repo: targetConvo.repoConfig.repo,
              branch: targetConvo.repoConfig.branch || 'main',
            });
            setIsGitRepoEnabled(targetConvo.repoConfig.isEnabled !== false);
          }
          const msgs = await loadConversationMessages(targetConvo.id);
          setMessages(msgs);
        } else {
          // Initialize first fresh conversation
          const newId = `convo_${Date.now()}`;
          const newConvo: StudioConversation = {
            id: newId,
            title: 'New Chat',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messageCount: 0,
            isArchived: false,
          };
          const initialList = [newConvo];
          setConversations(initialList);
          setActiveConversationId(newId);
          activeConversationIdRef.current = newId;
          setMessages([]);
          await saveConversationsList(initialList);
          await saveConversationMessages(newId, []);
        }
      } catch (error) {
        console.error("Failed to load conversations:", error);
      } finally {
        setIsInitialized(true);
      }
    };
    initConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectConversation = async (convoId: string) => {
    if (convoId === activeConversationId) return;
    setActiveConversationId(convoId);
    activeConversationIdRef.current = convoId;
    try {
      localStorage.setItem('mv_studio_active_convo_id', convoId);
    } catch {}

    const targetConvo = conversations.find(c => c.id === convoId);
    if (targetConvo?.repoConfig && targetConvo.repoConfig.owner && targetConvo.repoConfig.repo) {
      setGitRepoConfig({
        owner: targetConvo.repoConfig.owner,
        repo: targetConvo.repoConfig.repo,
        branch: targetConvo.repoConfig.branch || 'main',
      });
      setIsGitRepoEnabled(targetConvo.repoConfig.isEnabled !== false);
    } else {
      setGitRepoConfig(null);
      setIsGitRepoEnabled(false);
    }

    setInput('');
    setAttachedImages([]);
    setAttachedFiles([]);
    setEditingMessageId(null);
    setIsEditingTitleInHeader(false);

    const msgs = await loadConversationMessages(convoId);
    if (activeConversationIdRef.current === convoId) {
      setMessages(msgs);
    }
  };

  const handleNewChat = async () => {
    const newId = `convo_${Date.now()}`;
    const newConvo: StudioConversation = {
      id: newId,
      title: 'New Chat',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: 0,
      isArchived: false,
    };

    const updatedList = [newConvo, ...conversations.filter(c => c.id !== newId)];
    setConversations(updatedList);
    setActiveConversationId(newId);
    activeConversationIdRef.current = newId;
    setMessages([]);
    setInput('');
    setAttachedImages([]);
    setAttachedFiles([]);
    setEditingMessageId(null);
    setIsEditingTitleInHeader(false);

    try {
      localStorage.setItem('mv_studio_active_convo_id', newId);
    } catch {}

    await saveConversationsList(updatedList);
    await saveConversationMessages(newId, []);
    if (onLog) onLog('Started a new studio chat conversation.', 'info');
  };

  const handleRenameConversation = async (convoId: string, newTitle: string) => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    const updatedList = conversations.map(c => {
      if (c.id === convoId) {
        return { ...c, title: trimmed, customTitle: true, updatedAt: new Date().toISOString() };
      }
      return c;
    });
    setConversations(updatedList);
    await saveConversationsList(updatedList);
    if (onLog) onLog(`Renamed conversation to "${trimmed}"`, 'success');
  };

  const handleDeleteConversation = async (convoId: string) => {
    const remaining = await deleteConversationFromDB(convoId);
    setConversations(remaining);

    if (activeConversationId === convoId) {
      if (remaining.length > 0) {
        const nextActive = remaining.find(c => !c.isArchived) || remaining[0];
        handleSelectConversation(nextActive.id);
      } else {
        handleNewChat();
      }
    }
    if (onLog) onLog('Conversation deleted.', 'warning');
  };

  const handleDuplicateConversation = async (convoId: string) => {
    const sourceConvo = conversations.find(c => c.id === convoId);
    if (!sourceConvo) return;
    const sourceMessages = await loadConversationMessages(convoId);

    const newId = `convo_${Date.now()}`;
    const duplicatedConvo: StudioConversation = {
      ...sourceConvo,
      id: newId,
      title: `${sourceConvo.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customTitle: true,
    };

    const duplicatedMessages: StudioMessage[] = sourceMessages.map((m, idx) => ({
      ...m,
      id: `${Date.now()}_dup_${idx}`,
      conversationId: newId,
    }));

    await saveConversationMessages(newId, duplicatedMessages);
    const updatedList = [duplicatedConvo, ...conversations];
    setConversations(updatedList);
    await saveConversationsList(updatedList);
    handleSelectConversation(newId);
    if (onLog) onLog(`Duplicated conversation "${sourceConvo.title}"`, 'success');
  };

  const handleArchiveConversation = async (convoId: string, isArchived: boolean) => {
    const updatedList = conversations.map(c => {
      if (c.id === convoId) {
        return { ...c, isArchived, updatedAt: new Date().toISOString() };
      }
      return c;
    });
    setConversations(updatedList);
    await saveConversationsList(updatedList);

    if (isArchived && activeConversationId === convoId) {
      const nextActive = updatedList.find(c => !c.isArchived);
      if (nextActive) {
        handleSelectConversation(nextActive.id);
      } else {
        handleNewChat();
      }
    }
    if (onLog) onLog(isArchived ? 'Conversation archived.' : 'Conversation unarchived.', 'info');
  };

const PROXY_PERSONA_INFO: Record<ProxyPersonaType, { label: string; role: string; desc: string; icon: string }> = {
  user_proxy: {
    label: 'User Proxy (Inquisitor)',
    role: 'User Role',
    desc: 'Takes your place to ask sharp follow-up questions, request prompt improvements & probe for depth',
    icon: '👤'
  },
  critic: {
    label: 'Quality & Prompt Critic',
    role: 'Critic & Reviewer',
    desc: 'Audits for generic phrasing, lack of specificity, and demands higher creative/technical quality',
    icon: '🎬'
  },
  devil: {
    label: "Devil's Advocate",
    role: 'Debate Partner',
    desc: 'Challenges assumptions, tests edge cases, and argues counter-perspectives',
    icon: '🔥'
  },
  collaborator: {
    label: 'Co-Creator',
    role: 'Creative Partner',
    desc: 'Builds upon concepts, proposes hooks, and elevates ideas collaboratively',
    icon: '💡'
  }
};

  const processMessage = async (userMessage: Message, currentMessages: Message[], targetConvoId: string) => {
    setIsLoading(true);
    abortLoopRef.current = false;
    setActiveLoopStep(0);
    const convoMessages: Message[] = [...currentMessages, userMessage];
    try {
        const key = apiKeySource === 'custom' ? apiKeys.google : undefined;
        
        const history = currentMessages.map((m, idx) => {
            const isRecentTurn = idx >= currentMessages.length - 2;
            const parts: any[] = [];
            let msgText = m.text;
            if (m.attachments && m.attachments.length > 0) {
              const attachBlock = m.attachments.map(att => {
                const lang = att.name.split('.').pop() || '';
                const rangeInfo = att.range ? ` (Lines ${att.range.start}-${att.range.end})` : '';
                let fileContent = att.content;
                // Condense historical file attachments to avoid blowing past 1M token budget
                if (!isRecentTurn && fileContent && fileContent.length > 2500) {
                  fileContent = fileContent.substring(0, 800) + `\n\n[... ${fileContent.length - 1100} characters condensed from earlier turn ...]\n\n` + fileContent.substring(fileContent.length - 300);
                }
                return `📁 **Attached File: [${att.path || att.name}](${att.url || ''})${rangeInfo}**\n\`\`\`${lang}\n${fileContent}\n\`\`\``;
              }).join('\n\n');
              msgText = msgText ? `${attachBlock}\n\n---\n\n${msgText}` : attachBlock;
            }
            if (msgText) parts.push({ text: msgText });
            const msgImages = m.attachedImages && m.attachedImages.length > 0 
              ? m.attachedImages 
              : (m.attachedImage ? [m.attachedImage] : []);
            if (msgImages.length > 0) {
              if (isRecentTurn) {
                for (const img of msgImages) {
                  if (typeof img === 'string' && img.includes(',')) {
                    parts.push({
                      inlineData: {
                        data: img.split(',')[1],
                        mimeType: img.startsWith('data:image/png') ? 'image/png' : 'image/jpeg',
                      }
                    });
                  }
                }
              } else {
                parts.push({ text: `[User attached ${msgImages.length} image(s): analyzed in earlier turn]` });
              }
            }
            if (m.generatedImageUrl) {
                parts.push({ text: "[Image generated by model]" });
            }
            if (parts.length === 0) parts.push({ text: "[Empty message]" });
            return {
                role: m.sender === 'user' || m.sender === 'bot_proxy' ? 'user' : 'model' as 'user' | 'model',
                parts
            };
        });

        // Assemble current prompt with attached files
        let promptToSend = userMessage.text;
        if (userMessage.attachments && userMessage.attachments.length > 0) {
          const attachBlock = userMessage.attachments.map(att => {
            const lang = att.name.split('.').pop() || '';
            const rangeInfo = att.range ? ` (Lines ${att.range.start}-${att.range.end})` : '';
            return `📁 **Attached File: [${att.path || att.name}](${att.url || ''})${rangeInfo}**\n\`\`\`${lang}\n${att.content}\n\`\`\``;
          }).join('\n\n');
          promptToSend = promptToSend ? `${attachBlock}\n\n---\n\n${promptToSend}` : attachBlock;
        }

        // Assemble Git Repo Context if enabled
        let gitRepoContextData: StudioGitRepoContext | undefined = undefined;
        if (isGitRepoEnabled && gitRepoConfig) {
          try {
            const { 
              getLatestCommit, 
              fetchAndIndexRepo, 
              searchRepoCode, 
              readRepoFileSnippet 
            } = await import('@/services/githubRepoContext');

            // 1. Fetch repo index and latest commit
            const [repoIndex, commit] = await Promise.all([
              fetchAndIndexRepo(gitRepoConfig.owner, gitRepoConfig.repo, gitRepoConfig.branch, false).catch(() => null),
              getLatestCommit(gitRepoConfig.owner, gitRepoConfig.repo, gitRepoConfig.branch).catch(() => null)
            ]);

            // 2. Extract potential code files from latest commit or user prompt
            const candidatePaths = new Set<string>();
            if (commit?.files) {
              commit.files.slice(0, 3).forEach((f: any) => {
                if (f.filename) candidatePaths.add(f.filename);
              });
            }

            // Extract keywords or file mentions from user prompt
            const promptWords = userMessage.text
              .replace(/[^a-zA-Z0-9_\-\.\/]/g, ' ')
              .split(/\s+/)
              .filter(w => w.length > 2 && !['what', 'this', 'that', 'with', 'from', 'have', 'your', 'check', 'github', 'repo', 'code', 'show', 'tell', 'about'].includes(w.toLowerCase()));

            if (promptWords.length > 0 && candidatePaths.size < 4 && repoIndex) {
              for (const word of promptWords.slice(0, 4)) {
                const matched = repoIndex.files.find(f => f.path.toLowerCase().includes(word.toLowerCase()));
                if (matched) {
                  candidatePaths.add(matched.path);
                }
              }
              if (candidatePaths.size < 2 && promptWords[0]) {
                const searchResults = await searchRepoCode({
                  owner: gitRepoConfig.owner,
                  repo: gitRepoConfig.repo,
                  branch: gitRepoConfig.branch,
                  commitSha: commit?.sha || 'HEAD',
                  query: promptWords[0],
                }).catch(() => []);
                for (const res of searchResults.slice(0, 2)) {
                  candidatePaths.add(res.path);
                }
              }
            }

            // If still empty but repo has files, add top 2 source files
            if (candidatePaths.size === 0 && repoIndex?.files) {
              const primaryFiles = repoIndex.files.filter(f => f.isAndroidSource || f.path.endsWith('.ts') || f.path.endsWith('.tsx') || f.path.endsWith('.kt') || f.path.endsWith('.java'));
              primaryFiles.slice(0, 2).forEach(f => candidatePaths.add(f.path));
            }

            // 3. Read snippets for candidate paths
            const retrievedSnippets: Array<{ path: string; content: string; language: string }> = [];
            for (const cPath of Array.from(candidatePaths).slice(0, 4)) {
              try {
                const snip = await readRepoFileSnippet({
                  owner: gitRepoConfig.owner,
                  repo: gitRepoConfig.repo,
                  commitSha: commit?.sha || 'HEAD',
                  path: cPath,
                  startLine: 1,
                  endLine: 200,
                });
                retrievedSnippets.push({
                  path: snip.path,
                  content: snip.content,
                  language: snip.language,
                });
              } catch {}
            }

            // 4. File tree sample
            const fileTreeSample = repoIndex?.files 
              ? repoIndex.files.slice(0, 25).map(f => f.path)
              : undefined;

            gitRepoContextData = {
              isEnabled: true,
              owner: gitRepoConfig.owner,
              repo: gitRepoConfig.repo,
              branch: gitRepoConfig.branch,
              latestCommit: commit || undefined,
              indexedFilesCount: repoIndex?.totalFiles || indexedSummary?.totalFiles || 0,
              fileTreeSample,
              retrievedSourceSnippets: retrievedSnippets.length > 0 ? retrievedSnippets : undefined,
            };
          } catch (err) {
            console.warn('[StudioChat] Git context assembly error:', err);
            gitRepoContextData = {
              isEnabled: true,
              owner: gitRepoConfig.owner,
              repo: gitRepoConfig.repo,
              branch: gitRepoConfig.branch,
              indexedFilesCount: indexedSummary?.totalFiles || 0
            };
          }
        }

        const totalSteps = isLoopEnabled ? Math.max(2, Math.min(10, loopIterations)) : 1;
        let currentHistory = [...history];
        let pendingNextStep = '';
        let lastAgentResponseText = '';

        for (let step = 1; step <= totalSteps; step++) {
          if (abortLoopRef.current) {
            onLog('Chat Loop stopped by user.', 'info');
            break;
          }

          setActiveLoopStep(step);

          // ==========================================
          // MODE 1: AI-TO-AI DIALOGUE (DUAL AGENT LOOP)
          // Even steps = AI Proxy (Taking User's Role)
          // Odd steps = AI Director / Creator
          // ==========================================
          if (isLoopEnabled && loopMode === 'dialogue' && step > 1 && step % 2 === 0) {
            // STEP IS EVEN: AI User-Proxy / Inquisitor speaks (Taking user role)
            const personaInfo = PROXY_PERSONA_INFO[proxyPersona] || PROXY_PERSONA_INFO.user_proxy;
            setLoopProgressText(
              `Chat Loop (Step ${step}/${totalSteps}): ${personaInfo.icon} AI ${personaInfo.label} is analyzing reply & formulating next question...`
            );

            const personaDirectives: Record<ProxyPersonaType, string> = {
              user_proxy: `You are acting as the USER in an autonomous AI-to-AI conversation. The user started the topic (e.g. improving a prompt, creative brainstorming, storytelling, or analysis).
Read the AI Assistant's latest response above.
Your instructions:
1. Actively step into the user's shoes.
2. Ask a sharp, insightful follow-up question, ask to refine or improve the prompt/response even further (e.g., more vivid lighting, concise composition, negative constraints, higher technical clarity, or different stylistic variations), or request concrete examples.
3. Speak naturally from the first-person perspective ('Can we make this prompt more dynamic?', 'How can we refine the mood?', 'Give me 3 alternate versions that emphasize...').
4. Keep your question direct and punchy (1 to 2 short paragraphs).
5. If the user's objective is fully satisfied and the prompt/response is finalized, conclude with: [LOOP_COMPLETE: Objective fully satisfied]`,
              critic: `You are acting as an elite Quality & Prompt Critic in an autonomous AI-to-AI conversation.
Read the Assistant's latest response above.
Your instructions:
1. Critically evaluate what was proposed. Identify any vague descriptions, generic AI buzzwords, weak structure, or lack of specificity.
2. Pose a demanding, pointed critique to push the Assistant toward a higher-quality, more impactful prompt or solution.
3. If the plan/prompt is masterclass quality and complete, conclude with: [LOOP_COMPLETE: Masterclass quality achieved]`,
              devil: `You are acting as the Devil's Advocate in an AI-to-AI debate loop.
Read the Assistant's latest response above.
Your instructions:
1. Challenge key creative, conceptual, or prompt assumptions.
2. Pose counter-proposals or highlight potential edge cases and pitfalls.
3. If the debate has reached a strong consensus, end with: [LOOP_COMPLETE: Consensus reached]`,
              collaborator: `You are acting as a Co-Creator in an AI-to-AI brainstorming loop.
Read the Assistant's latest response above.
Your instructions:
1. Enthusiastically build upon the ideas and prompts presented.
2. Pitch a compelling twist, hook, or enhancement and ask the Assistant how to integrate it.
3. If the concept/prompt is fully fleshed out, end with: [LOOP_COMPLETE: Concept finalized]`
            };

            const proxyPrompt = `[AI-TO-AI DIALOGUE LOOP (Turn ${step}/${totalSteps}) - YOUR ROLE: ${personaInfo.role.toUpperCase()}]
${personaDirectives[proxyPersona]}
Ask your question / critique to the AI Assistant now:`;

            const proxyResponse = await sendStudioChatMessage(
              currentHistory,
              proxyPrompt,
              undefined,
              key,
              projectData,
              directorPlan,
              isWebSearchEnabled,
              gitRepoContextData,
              isAppEditEnabled
            );

            let proxyText = proxyResponse.text || '';
            const loopCompleteMatch = proxyText.match(/\[LOOP_COMPLETE:\s*([^\]]+)\]/i);
            const isExplicitComplete = Boolean(
              loopCompleteMatch ||
              proxyText.includes('[LOOP_COMPLETE]') ||
              proxyText.includes('[CONVERSATION_COMPLETE]') ||
              proxyText.includes('[DONE]')
            );
            const completionSummary = loopCompleteMatch ? loopCompleteMatch[1].trim() : undefined;

            const proxyBotMessage: Message = {
              id: `${Date.now()}_proxy_step${step}`,
              conversationId: targetConvoId,
              text: proxyText || "What is the next creative progression for this?",
              sender: 'bot_proxy',
              createdAt: new Date().toISOString(),
              agentPersona: proxyPersona,
              agentName: `AI Proxy (${personaInfo.label})`,
              loopStepNumber: step,
              loopTotalSteps: totalSteps,
              isLoopComplete: isExplicitComplete || (step === totalSteps),
              loopCompletionSummary: completionSummary,
            };

            convoMessages.push(proxyBotMessage);
            await saveConversationMessages(targetConvoId, convoMessages);

            setConversations(prev => {
              const updated = prev.map(c => {
                if (c.id === targetConvoId) {
                  return {
                    ...c,
                    updatedAt: new Date().toISOString(),
                    lastMessagePreview: proxyBotMessage.text.slice(0, 80).replace(/\n/g, ' '),
                    messageCount: convoMessages.length,
                  };
                }
                return c;
              });
              saveConversationsList(updated);
              return updated;
            });

            if (activeConversationIdRef.current === targetConvoId) {
              setMessages(prev => [...prev, proxyBotMessage]);
            }

            if (isExplicitComplete || step === totalSteps || abortLoopRef.current) {
              if (isExplicitComplete) {
                onLog(`AI-to-AI Dialogue completed in Step ${step}!`, 'success');
              }
              break;
            }

            // Update history for next turn (proxy message acts as user prompt to Director)
            currentHistory.push({
              role: 'user',
              parts: [{ text: proxyText }]
            });

            await new Promise(r => setTimeout(r, 650));
            continue;
          }

          // ==========================================
          // ODD STEPS (OR TASK MODE): AI ASSISTANT SPEAKS
          // ==========================================
          let currentPrompt = '';
          if (step === 1) {
            currentPrompt = isLoopEnabled
              ? loopMode === 'dialogue'
                ? `${promptToSend}\n\n[AI-TO-AI DIALOGUE MODE ACTIVE: Step 1/${totalSteps}]\nProvide your response. After your response, the AI User-Proxy (${PROXY_PERSONA_INFO[proxyPersona]?.label || 'User Role'}) will review your output and ask the next follow-up question or refinement in real time.`
                : `${promptToSend}\n\n[CHAT LOOP: AUTOMATIC SEQUENCE EXECUTION (Step 1/${totalSteps})]\nBreak down the objective and execute the first step now using your direct output or tools.\nCRITICAL PROTOCOL: Conclude with [NEXT_STEP: <action>] or [LOOP_COMPLETE: <summary>].`
              : promptToSend;
          } else if (loopMode === 'dialogue') {
            currentPrompt = `[AI-TO-AI DIALOGUE: ASSISTANT RESPONSE (Step ${step}/${totalSteps})]
Respond directly to the AI Proxy's question/critique above. Provide improved prompt variations, creative solutions, or detailed answers according to their request.`;
          } else {
            // Task Mode follow-up prompt
            const nextAction = pendingNextStep || 'Continue the requested workflow';
            currentPrompt = `[CHAT LOOP AUTOMATIC SEQUENCE EXECUTION (Step ${step}/${totalSteps})]
Execute the next required action: "${nextAction}".
CRITICAL PROTOCOL: Conclude with [NEXT_STEP: <action>] or [LOOP_COMPLETE: <summary>].`;
          }

          if (isLoopEnabled && totalSteps > 1) {
            setLoopProgressText(
              step === 1
                ? `Chat Loop (Step 1/${totalSteps}): 🤖 AI Assistant is processing initial instruction...`
                : `Chat Loop (Step ${step}/${totalSteps}): 🤖 AI Assistant is answering AI Proxy's questions...`
            );
          }

          const imagesToSend = userMessage.attachedImages && userMessage.attachedImages.length > 0
            ? userMessage.attachedImages
            : (userMessage.attachedImage ? [userMessage.attachedImage] : undefined);

          const response = await sendStudioChatMessage(
            currentHistory, 
            currentPrompt, 
            step === 1 ? imagesToSend : undefined, 
            key, 
            projectData,
            directorPlan,
            isWebSearchEnabled,
            gitRepoContextData,
            isAppEditEnabled
          );

          let stepText = response.text || '';
          let generatedImageUrl: string | undefined = undefined;

          if (response.functionCalls && response.functionCalls.length > 0) {
            for (const call of response.functionCalls) {
              if (call.name === 'generateImage') {
                const args = call.args as any;
                onLog(`Generating image: ${args.prompt}`, 'info');
                stepText = stepText || `I generated an image based on your request: "${args.prompt}"`;
                try {
                  generatedImageUrl = await generateChatImage(args.prompt, args.aspectRatio || '16:9', key, onLog, projectData);
                  onLog('Image generated successfully.', 'success');
                } catch (e: any) {
                  onLog(`Failed to generate image: ${e.message}`, 'error');
                  stepText += `\n\n[Error generating image: ${e.message}]`;
                }
              } else if (call.name === 'updateProjectData') {
                if (setProjectData) {
                  setProjectData((prev: any) => ({
                    ...prev,
                    ...call.args
                  }));
                  stepText = stepText || "I've updated your Director tab settings based on your request!";
                  onLog('Project settings updated by Assistant.', 'success');
                }
              } else if (call.name === 'addCharacter') {
                if (setProjectData) {
                  setProjectData((prev: any) => ({
                    ...prev,
                    characters: [...(prev.characters || []), {
                      id: Date.now().toString() + Math.random().toString(36).substring(7),
                      name: call.args.name,
                      description: {
                        facialFeatures: call.args.facialFeatures || 'Average',
                        hairStyle: call.args.hairStyle || 'Standard',
                        bodyType: call.args.bodyType || 'Average',
                        height: call.args.height || 'Average',
                        weight: call.args.weight || 'Average',
                        clothingStyle: call.args.clothingStyle || 'Casual',
                        personality: call.args.personality || 'Neutral',
                        keyExpressions: call.args.keyExpressions || 'Neutral'
                      }
                    }]
                  }));
                  stepText = stepText || `I've added the character "${call.args.name}" to your cast.`;
                  onLog(`Added character ${call.args.name}`, 'success');
                }
              } else if (call.name === 'addAttachedImageAsReference') {
                if (setProjectData && userMessage.attachedImage) {
                  setProjectData((prev: any) => {
                    const newRefs = [...(prev.referenceImages || [])];
                    let charId = call.args.characterId;
                    if (charId && prev.characters) {
                      const char = prev.characters.find((c: any) => c.name.toLowerCase() === charId.toLowerCase());
                      if (char) charId = char.id;
                    }
                    newRefs.push({
                      id: Date.now().toString() + Math.random().toString(36).substring(7),
                      data: userMessage.attachedImage!,
                      roles: [call.args.role || 'Reference'],
                      isMasterArt: call.args.isMasterArt || false,
                      characterId: charId || undefined
                    });
                    return { ...prev, referenceImages: newRefs };
                  });
                  stepText = stepText || "I've added the uploaded image to your references!";
                  onLog('Added reference image.', 'success');
                } else if (!userMessage.attachedImage) {
                  stepText = stepText || "You didn't upload an image for me to add as a reference!";
                  onLog('Failed to add reference: No image attached to the prompt.', 'warning');
                }
              } else if (call.name === 'updateCharacter') {
                if (setProjectData) {
                  setProjectData((prev: any) => {
                    const newChars = [...(prev.characters || [])];
                    const idx = newChars.findIndex((c: any) => c.name.toLowerCase() === call.args.name.toLowerCase());
                    if (idx !== -1) {
                      newChars[idx] = {
                        ...newChars[idx],
                        description: {
                          ...newChars[idx].description,
                          ...(call.args.facialFeatures && { facialFeatures: call.args.facialFeatures }),
                          ...(call.args.hairStyle && { hairStyle: call.args.hairStyle }),
                          ...(call.args.bodyType && { bodyType: call.args.bodyType }),
                          ...(call.args.height && { height: call.args.height }),
                          ...(call.args.weight && { weight: call.args.weight }),
                          ...(call.args.clothingStyle && { clothingStyle: call.args.clothingStyle }),
                          ...(call.args.personality && { personality: call.args.personality }),
                          ...(call.args.keyExpressions && { keyExpressions: call.args.keyExpressions })
                        }
                      };
                    }
                    return { ...prev, characters: newChars };
                  });
                  stepText = stepText || `I've updated the character "${call.args.name}".`;
                  onLog(`Updated character ${call.args.name}`, 'success');
                }
              } else if (call.name === 'updateSceneImagePrompt') {
                if (setDirectorPlan && directorPlan) {
                  setDirectorPlan((prev: any) => {
                    if (!prev) return prev;
                    const newScenes = [...prev.scenes];
                    if (call.args.sceneIndex >= 0 && call.args.sceneIndex < newScenes.length) {
                      newScenes[call.args.sceneIndex] = {
                        ...newScenes[call.args.sceneIndex],
                        imagePrompt: call.args.newImagePrompt
                      };
                    }
                    return { ...prev, scenes: newScenes };
                  });
                  stepText = stepText || `I've updated the image prompt for Scene ${call.args.sceneIndex + 1}.`;
                  onLog(`Updated Scene ${call.args.sceneIndex + 1} prompt`, 'success');
                }
              }
            }
          }

          lastAgentResponseText = stepText;

          // Analyze response content for Stop Condition or Next Step
          const loopCompleteMatch = stepText.match(/\[LOOP_COMPLETE:\s*([^\]]+)\]/i);
          const isExplicitComplete = Boolean(
            loopCompleteMatch ||
            stepText.includes('[LOOP_COMPLETE]') ||
            stepText.includes('[TASK_COMPLETE]') ||
            stepText.includes('[DONE]')
          );
          const completionSummary = loopCompleteMatch ? loopCompleteMatch[1].trim() : undefined;

          const nextStepMatch = stepText.match(/\[NEXT_STEP:\s*([^\]]+)\]/i) || stepText.match(/\[CONTINUE:\s*([^\]]+)\]/i);
          pendingNextStep = nextStepMatch ? nextStepMatch[1].trim() : '';

          const stepBotResponse: Message = {
            id: `${Date.now()}_step${step}`,
            conversationId: targetConvoId,
            text: stepText || "Done.",
            sender: 'bot',
            createdAt: new Date().toISOString(),
            agentPersona: 'creator',
            agentName: 'AI Assistant',
            generatedImageUrl: step === 1 ? generatedImageUrl : undefined,
            loopStepNumber: isLoopEnabled && totalSteps > 1 ? step : undefined,
            loopTotalSteps: isLoopEnabled && totalSteps > 1 ? totalSteps : undefined,
            isLoopComplete: isExplicitComplete || (step === totalSteps && isLoopEnabled),
            loopCompletionSummary: completionSummary,
            webSearchQueries: response.groundingMetadata?.webSearchQueries,
            groundingSources: response.groundingMetadata?.sources,
          };

          convoMessages.push(stepBotResponse);
          await saveConversationMessages(targetConvoId, convoMessages);

          setConversations(prev => {
            const updated = prev.map(c => {
              if (c.id === targetConvoId) {
                return {
                  ...c,
                  updatedAt: new Date().toISOString(),
                  lastMessagePreview: stepText ? stepText.slice(0, 80).replace(/\n/g, ' ') : c.lastMessagePreview,
                  messageCount: convoMessages.length,
                };
              }
              return c;
            });
            saveConversationsList(updated);
            return updated;
          });

          // Post this step immediately into the chat transcript ONLY if user is still on this conversation
          if (activeConversationIdRef.current === targetConvoId) {
            setMessages(prev => [...prev, stepBotResponse]);
          }

          // Check Stop Conditions:
          if (!isLoopEnabled || isExplicitComplete || step === totalSteps || abortLoopRef.current) {
            if (isExplicitComplete) {
              onLog(`Chat Loop sequence completed successfully in Step ${step}!`, 'success');
            }
            break;
          }

          // Prepare next step in the loop sequence
          currentHistory.push({
            role: 'model',
            parts: [{ text: stepText || 'Executed requested step.' }]
          });

          // Small natural settling delay between loop steps
          await new Promise(r => setTimeout(r, 650));
        }
    } catch (error: any) {
        onLog(`Chat error: ${error.message}`, 'error');
        const errMsg = error?.message || '';
        const isTokenErr = errMsg.includes('1048576') || 
                           errMsg.includes('exceeds the maximum number of tokens') ||
                           errMsg.includes('input token count exceeds');
        
        const userFriendlyMsg = isTokenErr
          ? `⚠️ **Context Token Limit (1,048,576 Tokens)**\n\nThis conversation thread accumulated a very large amount of context across multiple large code files, image references, or extended chat history. Earlier turns have been compacted automatically so you can continue your workflow.`
          : `Error: ${errMsg}`;

        const errorBotMessage: Message = {
          id: Date.now().toString(),
          conversationId: targetConvoId,
          text: userFriendlyMsg,
          sender: 'bot',
          createdAt: new Date().toISOString(),
        };
        convoMessages.push(errorBotMessage);
        await saveConversationMessages(targetConvoId, convoMessages);
        if (activeConversationIdRef.current === targetConvoId) {
          setMessages(prev => [...prev, errorBotMessage]);
        }
    } finally {
        setIsLoading(false);
        setLoopProgressText('');
        setActiveLoopStep(0);
    }
  };

  const handleProcessPastedOrLargeText = (rawText: string): boolean => {
    if (!rawText) return false;
    const isLarge = rawText.length > 150 || rawText.split('\n').length >= 3;
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
    if (onLog) {
      onLog(`Auto-attached pasted text as ${fileName} (${lineCount} lines)`, 'info');
    }
    return true;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && attachedImages.length === 0 && attachedFiles.length === 0) return;
    if (isLoading) return;

    abortLoopRef.current = false;

    // Check for Revert command: e.g. "revert to turn 3", "revert to 3", "revert 3", "/revert 3", "rollback to turn 3", "undo to turn 3"
    const trimmedInput = input.trim();
    const revertRegex = /^(?:\/)?(?:revert|rollback|undo)(?:\s+to)?(?:\s+turn)?(?:\s+#)?\s*(\d+)$/i;
    const revertMatch = trimmedInput.match(revertRegex);
    if (revertMatch) {
      const targetTurn = parseInt(revertMatch[1], 10);
      setInput('');
      setAttachedImages([]);
      setAttachedFiles([]);
      setIsInputExpanded(false);

      if (isNaN(targetTurn)) {
        if (onLog) onLog(`Invalid revert turn number: "${revertMatch[1]}"`, 'error');
        return;
      }
      if (totalTurns === 0) {
        if (onLog) onLog('Cannot revert: Chat has no turns yet.', 'info');
        return;
      }
      if (targetTurn >= totalTurns) {
        if (onLog) onLog(`Cannot revert to Turn ${targetTurn}: Conversation is currently at Turn ${totalTurns}.`, 'info');
        return;
      }
      if (targetTurn <= 0) {
        await handleClearChat();
        if (onLog) onLog('Reverted conversation to start (cleared all turns).', 'warning');
        return;
      }

      await handleRevertToTurn(targetTurn);
      return;
    }

    let targetConvoId = activeConversationIdRef.current;
    if (!targetConvoId) {
      targetConvoId = `convo_${Date.now()}`;
      const newConvo: StudioConversation = {
        id: targetConvoId,
        title: 'New Chat',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messageCount: 0,
        isArchived: false,
      };
      const updatedConvos = [newConvo, ...conversations];
      setConversations(updatedConvos);
      setActiveConversationId(targetConvoId);
      activeConversationIdRef.current = targetConvoId;
      await saveConversationsList(updatedConvos);
    }

    const userAttachments = attachedFiles.length > 0 ? [...attachedFiles] : undefined;
    const userImages = attachedImages.length > 0 ? [...attachedImages] : undefined;
    const userMessage: Message = {
      id: Date.now().toString(),
      conversationId: targetConvoId,
      text: input,
      sender: 'user',
      createdAt: new Date().toISOString(),
      attachedImage: userImages?.[0] || undefined,
      attachedImages: userImages,
      attachments: userAttachments,
    };

    const currentMessages = [...messages];
    const updatedWithUser = [...currentMessages, userMessage];

    if (activeConversationIdRef.current === targetConvoId) {
      setMessages(updatedWithUser);
    }
    const currentInputText = input;
    setInput('');
    setAttachedImages([]);
    setAttachedFiles([]);
    setIsInputExpanded(false);

    // Auto-generate title if this is the first user message or still has placeholder title
    const currentConvo = conversations.find(c => c.id === targetConvoId);
    const isPlaceholderTitle = !currentConvo || !currentConvo.customTitle || currentConvo.title === 'New Chat' || currentConvo.title === 'Untitled Conversation';

    let resolvedTitle = currentConvo?.title || 'New Chat';
    if (isPlaceholderTitle) {
      resolvedTitle = generateConversationTitle(currentInputText, Boolean(userMessage.attachedImage || userMessage.attachedImages?.length), Boolean(userAttachments?.length));
    }

    const updatedConvoList = conversations.map(c => {
      if (c.id === targetConvoId) {
        return {
          ...c,
          title: resolvedTitle,
          updatedAt: new Date().toISOString(),
          lastMessagePreview: currentInputText.slice(0, 80).replace(/\n/g, ' '),
          messageCount: updatedWithUser.length,
        };
      }
      return c;
    });
    setConversations(updatedConvoList);
    await saveConversationsList(updatedConvoList);
    await saveConversationMessages(targetConvoId, updatedWithUser);

    await processMessage(userMessage, currentMessages, targetConvoId);
  };

  const handleClearChat = async () => {
    if (!activeConversationId) return;
    setMessages([]);
    await saveConversationMessages(activeConversationId, []);
    setConversations(prev => {
      const updated = prev.map(c => {
        if (c.id === activeConversationId) {
          return {
            ...c,
            lastMessagePreview: '',
            messageCount: 0,
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      });
      saveConversationsList(updated);
      return updated;
    });
    if (onLog) onLog('Cleared messages in current conversation.', 'warning');
  };

  const handleRevertToTurn = async (targetTurn: number) => {
    if (!activeConversationId || isLoading) return;
    if (targetTurn < 1 || targetTurn >= totalTurns) {
      if (onLog) onLog(`Cannot revert to Turn ${targetTurn}. Current total turns: ${totalTurns}`, 'info');
      return;
    }

    // Keep all messages belonging to Turn 1 up to targetTurn
    // Remove all messages belonging to subsequent turns (targetTurn + 1 through totalTurns)
    const keptMessages = messages.filter(m => {
      const t = messageTurns.get(m.id) || 1;
      return t <= targetTurn;
    });

    const targetConvoId = activeConversationId;
    setMessages(keptMessages);
    setEditingMessageId(null);
    setEditInput('');
    await saveConversationMessages(targetConvoId, keptMessages);

    setConversations(prev => {
      const lastMsg = keptMessages[keptMessages.length - 1];
      const updatedList = prev.map(c => {
        if (c.id === targetConvoId) {
          return {
            ...c,
            lastMessagePreview: lastMsg?.text ? lastMsg.text.slice(0, 80).replace(/\n/g, ' ') : '',
            messageCount: keptMessages.length,
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      });
      saveConversationsList(updatedList);
      return updatedList;
    });

    if (onLog) {
      onLog(`Reverted chat to Turn ${targetTurn}. Removed turns ${targetTurn + 1} through ${totalTurns}.`, 'warning');
    }
  };

  const handleEditMessage = (msgId: string) => {
    const msgIndex = messages.findIndex(m => m.id === msgId);
    if (msgIndex === -1) return;
    
    const msgToEdit = messages[msgIndex];
    setEditingMessageId(msgId);
    setEditInput(msgToEdit.text);
  };

  const handleDeleteMessage = async (msgId: string) => {
    if (!activeConversationId) return;
    const updated = messages.filter(m => m.id !== msgId);
    setMessages(updated);
    await saveConversationMessages(activeConversationId, updated);
    setConversations(prev => {
      const lastMsg = updated[updated.length - 1];
      const updatedList = prev.map(c => {
        if (c.id === activeConversationId) {
          return {
            ...c,
            lastMessagePreview: lastMsg?.text ? lastMsg.text.slice(0, 80).replace(/\n/g, ' ') : '',
            messageCount: updated.length,
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      });
      saveConversationsList(updatedList);
      return updatedList;
    });
  };

  const handleSaveEdit = async (msgId: string, resend: boolean = false) => {
    if (!editInput.trim() || !activeConversationId) {
      setEditingMessageId(null);
      return;
    }
    const msgIndex = messages.findIndex(m => m.id === msgId);
    if (msgIndex === -1) return;

    const targetConvoId = activeConversationId;

    if (resend) {
      // Remove all messages after the edited one
      const newMessages = messages.slice(0, msgIndex);
      const updatedMessage: Message = {
        ...messages[msgIndex],
        text: editInput,
        conversationId: targetConvoId,
      };
      const finalMessages = [...newMessages, updatedMessage];
      setMessages(finalMessages);
      setEditingMessageId(null);
      await saveConversationMessages(targetConvoId, finalMessages);
      await processMessage(updatedMessage, newMessages, targetConvoId);
    } else {
      // Just save in place without resending
      const updatedMessages = [...messages];
      updatedMessages[msgIndex] = {
        ...updatedMessages[msgIndex],
        text: editInput
      };
      setMessages(updatedMessages);
      setEditingMessageId(null);
      await saveConversationMessages(targetConvoId, updatedMessages);
      setConversations(prev => {
        const lastMsg = updatedMessages[updatedMessages.length - 1];
        const updatedList = prev.map(c => {
          if (c.id === targetConvoId) {
            return {
              ...c,
              lastMessagePreview: lastMsg?.text ? lastMsg.text.slice(0, 80).replace(/\n/g, ' ') : c.lastMessagePreview,
              updatedAt: new Date().toISOString(),
            };
          }
          return c;
        });
        saveConversationsList(updatedList);
        return updatedList;
      });
    }
  };

  const handleCancelEdit = () => {
      setEditingMessageId(null);
      setEditInput('');
  };

  const handleRetryMessage = async (targetMsgId?: string) => {
    if (!activeConversationId || isLoading) return;

    let targetIdx = -1;
    if (targetMsgId) {
      targetIdx = messages.findIndex(m => m.id === targetMsgId);
    } else {
      targetIdx = messages.length - 1;
    }

    if (targetIdx < 0) return;

    const targetMsg = messages[targetIdx];
    let userMsg: Message | undefined;
    let precedingMessages: Message[] = [];

    if (targetMsg.sender === 'user') {
      // Retrying from a user message
      userMsg = targetMsg;
      precedingMessages = messages.slice(0, targetIdx);
    } else {
      // Retrying a bot or bot_proxy message: find the nearest preceding user message
      const lastUserIdx = messages.slice(0, targetIdx).map(m => m.sender).lastIndexOf('user');
      if (lastUserIdx !== -1) {
        userMsg = messages[lastUserIdx];
        precedingMessages = messages.slice(0, lastUserIdx);
      } else {
        const anyUser = messages.find(m => m.sender === 'user');
        if (anyUser) {
          userMsg = anyUser;
          precedingMessages = [];
        }
      }
    }

    if (!userMsg) return;

    const targetConvoId = activeConversationId;
    // Set UI messages to the preceding history
    setMessages(precedingMessages);
    await saveConversationMessages(targetConvoId, precedingMessages);

    // Reprocess the user prompt
    await processMessage(userMsg, precedingMessages, targetConvoId);
  };

  const processRawFiles = async (files: File[]) => {
    if (!files || files.length === 0) return;

    const newAttachments: FileAttachmentItem[] = [];
    const newImages: string[] = [];

    for (const file of files) {
      // Check if file is an image
      if (file.type.startsWith('image/') || /\.(png|jpe?g|webp|gif|svg|bmp)$/i.test(file.name)) {
        try {
          const compressed = await compressImage(file);
          newImages.push(compressed);
          if (onLog) onLog(`Attached image: ${file.name}`, 'info');
        } catch (err: any) {
          if (onLog) onLog(`Failed to process image ${file.name}: ${err.message}`, 'error');
        }
        continue;
      }

      // Read text, code, script, markdown, JSON, SRT, or document file
      try {
        const text = await file.text();
        const lineCount = text.split('\n').length;
        newAttachments.push({
          name: file.name,
          path: file.name,
          content: text,
          size: file.size,
          lineCount: lineCount,
        });
      } catch (err: any) {
        // Fallback representation for binary/other files
        newAttachments.push({
          name: file.name,
          path: file.name,
          content: `[Attached File: ${file.name} | MIME: ${file.type || 'application/octet-stream'} | Size: ${(file.size / 1024).toFixed(1)} KB]`,
          size: file.size,
          lineCount: 1,
        });
      }
    }

    if (newImages.length > 0) {
      setAttachedImages(prev => [...prev, ...newImages]);
      if (onLog) onLog(`Attached ${newImages.length} image(s) to Studio Chat.`, 'success');
    }

    if (newAttachments.length > 0) {
      setAttachedFiles(prev => {
        const existingNames = new Set(prev.map(f => f.name));
        const nonDuplicates = newAttachments.filter(f => !existingNames.has(f.name));
        return [...prev, ...nonDuplicates];
      });
      if (onLog) onLog(`Attached ${newAttachments.length} file(s) to Studio Chat.`, 'success');
    }
  };

  const handleGenericFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await processRawFiles(Array.from(files));
    if (e.target) e.target.value = '';
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await processRawFiles(Array.from(files));
    if (e.target) e.target.value = '';
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDraggingOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      setIsDraggingOver(false);
      dragCounter.current = 0;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    dragCounter.current = 0;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processRawFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  return (
    <div className="relative flex-1 min-h-0 flex overflow-hidden bg-[#0a0a0a] animate-in fade-in duration-300">
      {/* Left Conversations Sidebar (ChatGPT/Claude style with time grouping and search) */}
      <ChatSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        isOpen={isSidebarOpen}
        isMobile={isMobile}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onRenameConversation={handleRenameConversation}
        onDeleteConversation={handleDeleteConversation}
        onDuplicateConversation={handleDuplicateConversation}
        onArchiveConversation={handleArchiveConversation}
        onCloseSidebar={() => setIsSidebarOpen(false)}
      />

      {/* Main Chat Area */}
      <div 
        className="relative flex-1 min-h-0 flex flex-col overflow-hidden bg-[#0a0a0a]"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Drag & Drop File Upload Backdrop Overlay */}
        {isDraggingOver && (
          <div className="absolute inset-0 z-50 bg-indigo-950/90 backdrop-blur-md border-2 border-dashed border-indigo-400 m-2 rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-150 pointer-events-none shadow-2xl shadow-indigo-500/20">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center mb-3 shadow-lg shadow-indigo-500/20">
              <UploadCloud className="w-9 h-9 text-indigo-300 animate-bounce" />
            </div>
            <h4 className="text-lg font-bold text-white mb-1.5">Drop Files to Attach to Studio Chat</h4>
            <p className="text-xs text-indigo-200/80 max-w-md">
              Release anywhere to attach your code files, scripts, text, Markdown, JSON, SRT subtitles, audio, or reference images.
            </p>
          </div>
        )}

        {/* Unified High-Density Studio Chat Header & Controls Toolbar */}
        <div className="border-b border-white/10 px-2 sm:px-3 py-1.5 bg-[#0c0d12]/95 backdrop-blur-md flex items-center justify-between gap-1.5 shrink-0 z-10 w-full min-w-0">
          {/* Left: Sidebar Toggle + Title Rename */}
          <div className="flex items-center gap-1.5 min-w-0 shrink-0">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(prev => !prev)}
              className={`p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0 flex items-center gap-1 ${
                !isSidebarOpen ? 'bg-indigo-600/20 text-indigo-300 ring-1 ring-indigo-500/30' : ''
              }`}
              title={isSidebarOpen ? "Collapse sidebar" : "Open conversation history (Ctrl+B)"}
            >
              {isSidebarOpen ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeft className="w-3.5 h-3.5" />}
              {!isSidebarOpen && (
                <span className="text-[10px] font-semibold hidden md:inline">({conversations.length})</span>
              )}
            </button>

            {isEditingTitleInHeader ? (
              <div className="flex items-center gap-1 max-w-[140px] xs:max-w-xs sm:max-w-sm">
                <input
                  type="text"
                  value={headerTitleInput}
                  onChange={(e) => setHeaderTitleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (activeConversationId && headerTitleInput.trim()) {
                        handleRenameConversation(activeConversationId, headerTitleInput.trim());
                      }
                      setIsEditingTitleInHeader(false);
                    } else if (e.key === 'Escape') {
                      setIsEditingTitleInHeader(false);
                    }
                  }}
                  autoFocus
                  className="w-full bg-black/60 border border-indigo-400 rounded px-1.5 py-0.5 text-xs text-white focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (activeConversationId && headerTitleInput.trim()) {
                      handleRenameConversation(activeConversationId, headerTitleInput.trim());
                    }
                    setIsEditingTitleInHeader(false);
                  }}
                  className="p-1 rounded bg-indigo-600 text-white"
                >
                  <Check className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setIsEditingTitleInHeader(false)}
                  className="p-1 rounded bg-white/10 text-white/70"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div 
                className="flex items-center gap-1 min-w-0 group/title cursor-pointer" 
                onClick={() => {
                  if (activeConversation) {
                    setHeaderTitleInput(activeConversation.title);
                    setIsEditingTitleInHeader(true);
                  }
                }}
                title="Click to rename"
              >
                <h2 className="text-xs font-semibold text-white truncate max-w-[100px] xs:max-w-[140px] sm:max-w-[180px] md:max-w-[220px]">
                  {activeConversation?.title || 'New Chat'}
                </h2>
                <Edit3 className="w-2.5 h-2.5 text-white/30 group-hover/title:text-indigo-300 transition-colors shrink-0" />
              </div>
            )}
          </div>

          {/* Right: Consolidated Quick Controls Toolbar */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar min-w-0 shrink">
            {/* App Write & Edit Mode Toggle */}
            <button
              type="button"
              onClick={() => handleToggleAppEdit(!isAppEditEnabled)}
              className={`px-1.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] whitespace-nowrap transition-all flex items-center gap-1 font-medium shrink-0 border ${
                isAppEditEnabled
                  ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border-emerald-400/40 shadow-sm ring-1 ring-emerald-500/30'
                  : 'bg-white/5 hover:bg-white/10 text-white/50 border-white/10 hover:text-white/80'
              }`}
              title={isAppEditEnabled ? 'App Direct Write & Edit ON: AI is authorized to write and update project lyrics, technical specs, and storyboard prompts directly in the app.' : 'Click to enable App Direct Write & Edit mode.'}
            >
              <PenLine className={`w-3 h-3 ${isAppEditEnabled ? 'text-emerald-400' : 'text-white/40'}`} />
              <span className="hidden xs:inline">App Edit</span>
              <span className={`text-[8px] font-bold px-1 rounded uppercase ${
                isAppEditEnabled ? 'bg-emerald-400/25 text-emerald-300' : 'bg-white/10 text-white/40'
              }`}>
                {isAppEditEnabled ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Web Search Grounding Toggle */}
            <button
              type="button"
              onClick={() => handleToggleWebSearch(!isWebSearchEnabled)}
              className={`px-1.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] whitespace-nowrap transition-all flex items-center gap-1 font-medium shrink-0 border ${
                isWebSearchEnabled
                  ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border-cyan-400/40 shadow-sm ring-1 ring-cyan-500/30'
                  : 'bg-white/5 hover:bg-white/10 text-white/50 border-white/10 hover:text-white/80'
              }`}
              title={isWebSearchEnabled ? 'Live Web Search ON: Google Search Grounding for real-time facts.' : 'Click to enable Live Web Search Grounding.'}
            >
              <Globe className={`w-3 h-3 ${isWebSearchEnabled ? 'text-cyan-400 animate-spin-slow' : 'text-white/40'}`} />
              <span className="hidden xs:inline">Search</span>
              <span className={`text-[8px] font-bold px-1 rounded uppercase ${
                isWebSearchEnabled ? 'bg-cyan-400/25 text-cyan-300' : 'bg-white/10 text-white/40'
              }`}>
                {isWebSearchEnabled ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Git Repository Awareness Toggle */}
            <button
              type="button"
              onClick={() => handleToggleGitRepo(!isGitRepoEnabled)}
              className={`px-1.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] whitespace-nowrap transition-all flex items-center gap-1 font-medium shrink-0 border ${
                isGitRepoEnabled
                  ? 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-200 border-blue-400/40 shadow-sm ring-1 ring-blue-500/30'
                  : 'bg-white/5 hover:bg-white/10 text-white/50 border-white/10 hover:text-white/80'
              }`}
              title={isGitRepoEnabled && gitRepoConfig ? `Connected Git Repo ON: ${gitRepoConfig.owner}/${gitRepoConfig.repo} (${gitRepoConfig.branch}).` : 'Enable Git Repository Awareness.'}
            >
              <Github className={`w-3 h-3 ${isGitRepoEnabled && gitRepoConfig ? 'text-blue-400' : 'text-white/40'}`} />
              <span className="hidden xs:inline">Git</span>
              <span className={`text-[8px] font-bold px-1 rounded uppercase ${
                isGitRepoEnabled && gitRepoConfig ? 'bg-blue-400/25 text-blue-300' : 'bg-white/10 text-white/40'
              }`}>
                {isGitRepoEnabled && gitRepoConfig ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Gemini Executive Memory Distiller */}
            <button
              type="button"
              onClick={() => setShowMemoryDistillModal(true)}
              className="px-1.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] whitespace-nowrap transition-all flex items-center gap-1 font-medium shrink-0 border bg-purple-500/15 hover:bg-purple-500/25 text-purple-200 border-purple-500/30 shadow-sm"
              title="Distill multi-turn conversation memory with Gemini across chat windows"
            >
              <Brain className="w-3 h-3 text-purple-400" />
              <span className="hidden xs:inline">Distill</span>
            </button>

            {/* Chat Loop Toggle */}
            <button
              type="button"
              onClick={() => handleToggleLoop(!isLoopEnabled)}
              className={`px-1.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] whitespace-nowrap transition-all flex items-center gap-1 font-medium shrink-0 ${
                isLoopEnabled
                  ? 'bg-emerald-600/25 hover:bg-emerald-600/35 text-emerald-200 border border-emerald-500/40 shadow-sm ring-1 ring-emerald-500/30'
                  : 'bg-white/5 hover:bg-white/10 text-white/50 border border-white/5 hover:text-white/80'
              }`}
              title={isLoopEnabled ? `Chat Loop ON: Autonomous multi-turn AI execution.` : 'Chat Loop OFF: Single-pass direct generation.'}
            >
              <RefreshCw className={`w-3 h-3 ${isLoopEnabled ? 'text-emerald-400 animate-spin-slow' : 'text-white/40'}`} />
              <span className="hidden xs:inline">Loop</span>
              <span className={`text-[8px] font-bold px-1 rounded uppercase ${
                isLoopEnabled ? 'bg-emerald-500/30 text-emerald-300' : 'bg-white/10 text-white/40'
              }`}>
                {isLoopEnabled ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Loop Mode & Persona Selectors when enabled */}
            {isLoopEnabled && (
              <>
                <select
                  value={loopMode}
                  onChange={(e) => handleChangeLoopMode(e.target.value as LoopModeType)}
                  className="bg-emerald-950/60 border border-emerald-500/40 rounded-md px-1 py-0.5 text-[10px] font-semibold text-emerald-200 focus:outline-none cursor-pointer shrink-0"
                  title="Select Chat Loop interaction style"
                >
                  <option value="dialogue" className="bg-[#18181c] text-white">🤖 Dual</option>
                  <option value="task" className="bg-[#18181c] text-white">⚡ Task</option>
                </select>

                {loopMode === 'dialogue' && (
                  <select
                    value={proxyPersona}
                    onChange={(e) => handleChangeProxyPersona(e.target.value as ProxyPersonaType)}
                    className="bg-amber-950/60 border border-amber-500/40 rounded-md px-1 py-0.5 text-[10px] font-semibold text-amber-200 focus:outline-none cursor-pointer shrink-0 hidden md:inline-block"
                    title="Select AI 2 Persona"
                  >
                    <option value="user_proxy" className="bg-[#18181c] text-white">👤 User</option>
                    <option value="critic" className="bg-[#18181c] text-white">🎬 Critic</option>
                    <option value="devil" className="bg-[#18181c] text-white">🔥 Devil</option>
                    <option value="collaborator" className="bg-[#18181c] text-white">💡 Co-Dir</option>
                  </select>
                )}

                <select
                  value={loopIterations}
                  onChange={(e) => setLoopIterations(parseInt(e.target.value, 10))}
                  className="bg-black/60 border border-white/20 rounded-md px-1 py-0.5 text-[10px] text-white/80 focus:outline-none cursor-pointer shrink-0"
                  title="Total turns"
                >
                  <option value={2} className="bg-[#18181c] text-white">2x</option>
                  <option value={4} className="bg-[#18181c] text-white">4x</option>
                  <option value={6} className="bg-[#18181c] text-white">6x</option>
                  <option value={8} className="bg-[#18181c] text-white">8x</option>
                  <option value={10} className="bg-[#18181c] text-white">10x</option>
                </select>
              </>
            )}

            {/* Stop Loop Button if running */}
            {isLoading && isLoopEnabled && (
              <button
                type="button"
                onClick={handleStopLoop}
                className="px-1.5 py-0.5 rounded-md bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200 text-[10px] font-semibold flex items-center gap-1 transition-all shadow-sm shrink-0 animate-pulse"
                title="Stop ongoing Chat Loop immediately"
              >
                <Square className="w-2.5 h-2.5 text-red-400 fill-red-400" />
                <span>Stop</span>
              </button>
            )}

            {/* Compact Font Size Stepper */}
            <div className="flex items-center bg-white/5 border border-white/10 rounded-md p-0.5 shrink-0" title="Adjust chat font size">
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

            {/* Turn Counter & Revert Menu */}
            {totalTurns > 0 && (
              <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-md px-1.5 py-0.5 shrink-0" title={`Current conversation has ${totalTurns} turns`}>
                <span className="text-[10px] font-mono font-bold text-indigo-300">Turn {totalTurns}</span>
                {totalTurns > 1 && (
                  <select
                    onChange={(e) => {
                      const t = parseInt(e.target.value, 10);
                      if (!isNaN(t) && t > 0 && t < totalTurns) {
                        handleRevertToTurn(t);
                      }
                      e.target.value = '';
                    }}
                    defaultValue=""
                    disabled={isLoading}
                    className="bg-transparent text-[9px] font-bold text-amber-300 hover:text-amber-200 focus:outline-none cursor-pointer border-l border-white/15 pl-1 ml-0.5"
                    title="Revert conversation to an earlier turn"
                  >
                    <option value="" disabled className="bg-[#18181c] text-white/60">↩ Revert...</option>
                    {Array.from({ length: totalTurns - 1 }, (_, i) => i + 1).reverse().map(turn => (
                      <option key={turn} value={turn} className="bg-[#18181c] text-white">
                        Turn {turn} (remove {turn + 1}..{totalTurns})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Guide Trigger */}
            <button
              type="button"
              onClick={() => setIsGuideModalOpen(true)}
              className="p-1 text-white/40 hover:text-indigo-300 hover:bg-white/5 rounded-md transition-colors shrink-0"
              title="Open Chat Loop Guide"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>

            {/* Clear Chat Button */}
            {messages.length > 0 && (
              <button
                onClick={handleClearChat}
                className="p-1 rounded-md text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                title="Clear current chat"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            {/* New Chat Button */}
            <button
              type="button"
              onClick={handleNewChat}
              className="px-2 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold flex items-center gap-1 shadow-sm transition-all border border-indigo-400/30 active:scale-95 shrink-0"
              title="Create new conversation"
            >
              <Plus className="w-3 h-3" />
              <span className="hidden sm:inline">New</span>
            </button>
          </div>
        </div>

      {/* Connected Git Repository Status Bar */}
      {isGitRepoEnabled && gitRepoConfig && (
        <RepoStatusBar
          owner={gitRepoConfig.owner}
          repo={gitRepoConfig.repo}
          branch={gitRepoConfig.branch}
          onBranchChange={(newBranch) => {
            setGitRepoConfig(prev => {
              if (!prev) return null;
              const updated = { ...prev, branch: newBranch };
              try { localStorage.setItem('mv_studio_git_repo_config', JSON.stringify(updated)); } catch {}
              return updated;
            });
            if (activeConversationId && gitRepoConfig) {
              setConversations(prev => {
                const updated = prev.map(c => c.id === activeConversationId ? {
                  ...c,
                  repoConfig: {
                    ...gitRepoConfig,
                    branch: newBranch,
                    isEnabled: true,
                  },
                  updatedAt: new Date().toISOString(),
                } : c);
                saveConversationsList(updated);
                return updated;
              });
            }
          }}
          onRefreshComplete={(index) => {
            setIndexedSummary(index);
          }}
          onOpenRepoBrowser={() => setIsGitHubModalOpen(true)}
          onClose={() => {
            setIsGitRepoEnabled(false);
            try { localStorage.setItem('mv_studio_git_enabled', 'false'); } catch {}
            if (activeConversationId && gitRepoConfig) {
              setConversations(prev => {
                const updated = prev.map(c => c.id === activeConversationId ? {
                  ...c,
                  repoConfig: {
                    ...gitRepoConfig,
                    isEnabled: false,
                  },
                  updatedAt: new Date().toISOString(),
                } : c);
                saveConversationsList(updated);
                return updated;
              });
            }
          }}
        />
      )}

      <div className="flex-1 min-h-0 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4 custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-3 sm:p-4 max-w-lg mx-auto my-auto space-y-3 sm:space-y-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-0.5 shadow-xl shadow-indigo-500/10">
              <div className="w-full h-full bg-[#0d0e15] rounded-2xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Start a new conversation</h3>
              <p className="text-xs sm:text-sm text-white/50 mt-1">
                Ask anything, brainstorm music video ideas, or refine creative prompts.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full pt-1 text-left">
              <button
                type="button"
                onClick={() => setInput("Help me create a Suno instrumental prompt with cinematic synthwave energy, heavy analog bass, and 80s neon arpeggios")}
                className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-indigo-500/50 transition-all text-xs text-white/85 flex items-start gap-2.5 group/card"
              >
                <Music className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5 group-hover/card:scale-110 transition-transform" />
                <div>
                  <div className="font-semibold text-white">Suno Instrumental Prompt</div>
                  <div className="text-[11px] text-white/45">Create high-energy electronic music prompt</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLoopEnabled(true);
                  setInput("Refine my storyboard idea into 5 vivid visual scene prompts with cinematography camera angles and lighting notes");
                }}
                className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-500/50 transition-all text-xs text-white/85 flex items-start gap-2.5 group/card"
              >
                <Clapperboard className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 group-hover/card:scale-110 transition-transform" />
                <div>
                  <div className="font-semibold text-white">Storyboard Scene Prompts</div>
                  <div className="text-[11px] text-white/45">Generate cinematic multi-scene sequences</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setInput("Can you summarize the purpose of our connected GitHub repository and outline the key modules?")}
                className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-blue-500/50 transition-all text-xs text-white/85 flex items-start gap-2.5 group/card"
              >
                <Github className="w-4 h-4 text-blue-400 shrink-0 mt-0.5 group-hover/card:scale-110 transition-transform" />
                <div>
                  <div className="font-semibold text-white">Git Repository Architecture</div>
                  <div className="text-[11px] text-white/45">Analyze repository files and structure</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setInput("Generate an image of a neon-lit cyberpunk metropolis rooftop at dusk, 35mm anamorphic lens, hyperrealistic reflections")}
                className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-purple-500/50 transition-all text-xs text-white/85 flex items-start gap-2.5 group/card"
              >
                <ImageIcon className="w-4 h-4 text-purple-400 shrink-0 mt-0.5 group-hover/card:scale-110 transition-transform" />
                <div>
                  <div className="font-semibold text-white">Generate Scene Visual</div>
                  <div className="text-[11px] text-white/45">Render high-definition Imagen graphic</div>
                </div>
              </button>
            </div>
          </div>
        )}
        {messages.map(msg => {
          const isLongMessage = (msg.text || '').length > 280 || ((msg.text || '').match(/\n/g) || []).length >= 5;
          const isCollapsed = Boolean(collapsedMessageIds[msg.id]);
          const isProxy = msg.sender === 'bot_proxy';
          const isUser = msg.sender === 'user';
          const isDirector = msg.sender === 'bot';
          const turnNumber = messageTurns.get(msg.id) || 1;
          const canRevert = turnNumber < totalTurns;

          if (isUser) {
            return (
              <div key={msg.id} className="flex items-start justify-end gap-2 sm:gap-3 group w-full min-w-0">
                <div className="flex flex-col items-end min-w-0 max-w-[calc(100%-40px)] sm:max-w-xl md:max-w-2xl">
                  {/* Top action toolbar - always contained within viewport bounds */}
                  <div className="flex items-center gap-1 mb-1 px-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-1.5 py-0.5 rounded-full bg-white/15 text-white/90 text-[9px] sm:text-[10px] font-mono font-bold shadow-sm" title={`Turn #${turnNumber}`}>
                      Turn {turnNumber}
                    </span>
                    {canRevert && (
                      <button 
                        onClick={() => handleRevertToTurn(turnNumber)} 
                        disabled={isLoading}
                        className="p-1 rounded hover:bg-amber-500/20 text-white/50 hover:text-amber-300 disabled:opacity-30 transition-colors flex items-center gap-0.5" 
                        title={`Revert conversation to Turn ${turnNumber} (removes turns ${turnNumber + 1} to ${totalTurns})`}
                      >
                        <History className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-[9px] font-mono text-amber-300/80 hidden sm:inline">↩ Revert</span>
                      </button>
                    )}
                    {isLongMessage && (
                      <button 
                        onClick={() => toggleCollapseMessage(msg.id)} 
                        className="p-1 rounded hover:bg-white/10 text-indigo-300 hover:text-white transition-colors" 
                        title={isCollapsed ? "Expand message" : "Collapse message"}
                      >
                        {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                      </button>
                    )}
                    <button 
                      onClick={() => handleRetryMessage(msg.id)} 
                      disabled={isLoading}
                      className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-indigo-300 disabled:opacity-30 transition-colors" 
                      title="Retry / Resend message"
                    >
                      <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button 
                      onClick={() => handleEditMessage(msg.id)} 
                      className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors" 
                      title="Edit message"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteMessage(msg.id)} 
                      className="p-1 rounded hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors" 
                      title="Delete message"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] text-white/40 ml-1 font-medium">You</span>
                  </div>

                  {/* User Bubble */}
                  <div className="w-full bg-indigo-600 text-white p-2.5 sm:p-3.5 rounded-2xl rounded-tr-sm shadow-md min-w-0 break-words overflow-hidden">
                    {editingMessageId === msg.id ? (
                      <div className="flex flex-col gap-2">
                        <textarea
                          value={editInput}
                          onChange={(e) => setEditInput(e.target.value)}
                          className={`w-full bg-black/20 border border-white/20 rounded-lg p-2 ${STUDIO_FONT_CONFIGS[fontSize].inputTextClass} text-white outline-none resize-none custom-scrollbar`}
                          rows={3}
                          autoFocus
                        />
                        <div className="flex flex-wrap justify-end gap-2">
                          <button onClick={handleCancelEdit} className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 rounded-md transition-colors text-white/80 hover:text-white">Cancel</button>
                          <button onClick={() => handleSaveEdit(msg.id, false)} disabled={!editInput.trim() || isLoading} className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 disabled:opacity-40 rounded-md transition-colors text-white">Save Only</button>
                          <button 
                            onClick={() => handleSaveEdit(msg.id, true)} 
                            disabled={!editInput.trim() || isLoading}
                            className="px-3 py-1 text-xs bg-white text-indigo-700 font-bold hover:bg-white/90 disabled:opacity-40 rounded-md transition-all shadow-md flex items-center gap-1"
                            title="Forget all subsequent messages below this point and resend prompt"
                          >
                            Save & Resend
                          </button>
                        </div>
                        <div className="text-[10px] text-white/40 text-right pr-0.5">
                          "Save & Resend" deletes subsequent chat history and branches from here
                        </div>
                      </div>
                    ) : (
                      <div className={`space-y-2 relative transition-all min-w-0 ${isCollapsed ? 'max-h-28 sm:max-h-36 overflow-hidden select-none' : ''}`}>
                        {/* Attached Images Grid */}
                        {((msg.attachedImages && msg.attachedImages.length > 0) || msg.attachedImage) && (
                          <div className="flex flex-wrap gap-2 my-1.5">
                            {(msg.attachedImages && msg.attachedImages.length > 0 
                              ? msg.attachedImages 
                              : [msg.attachedImage!]
                            ).map((imgUrl, imgIdx) => (
                              <div key={imgIdx} className="relative group max-w-full">
                                <img 
                                  src={imgUrl} 
                                  alt={`User upload ${imgIdx + 1}`} 
                                  className="rounded-lg max-h-48 sm:max-h-60 max-w-[200px] sm:max-w-[260px] object-cover border border-white/20 shadow-md cursor-pointer hover:opacity-95 transition-opacity" 
                                  onClick={() => window.open(imgUrl, '_blank')}
                                  title="Click to view full image"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="space-y-1.5 my-1.5 w-full min-w-0">
                            {msg.attachments.map((att, i) => (
                              <CollapsibleFileAttachment key={i} file={att} />
                            ))}
                          </div>
                        )}
                        {msg.text && (
                          <div className={`${STUDIO_FONT_CONFIGS[fontSize].chatTextClass} whitespace-pre-wrap break-words`}>
                            {msg.text}
                          </div>
                        )}

                        {/* Collapsed Overlay */}
                        {isCollapsed && (
                          <div 
                            onClick={() => toggleCollapseMessage(msg.id)}
                            className="absolute inset-x-0 bottom-0 h-16 flex items-end justify-center pb-1.5 cursor-pointer z-10 bg-gradient-to-t from-indigo-600 via-indigo-600/90 to-transparent"
                          >
                            <span className="px-3 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 shadow-lg bg-black/50 hover:bg-black/70 text-white border border-white/20 transition-transform hover:scale-105">
                              <ChevronDown className="w-3.5 h-3.5" /> 
                              <span>Expand text ({(msg.text || '').split('\n').length} lines)</span>
                            </span>
                          </div>
                        )}

                        {/* Expanded Footer Button */}
                        {isLongMessage && !isCollapsed && (
                          <div className="mt-2 pt-1 border-t border-white/20 text-white/70 flex justify-end">
                            <button
                              onClick={() => toggleCollapseMessage(msg.id)}
                              className="text-[10px] hover:text-white flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors font-medium"
                              title="Collapse message text"
                            >
                              <ChevronUp className="w-3 h-3" />
                              <span>Collapse message</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* User Avatar */}
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-500/30 border border-indigo-400/30 flex items-center justify-center shrink-0 mt-0.5" title="You">
                  <User className="w-4 h-4 text-white/80" />
                </div>
              </div>
            );
          }

          // Bot & Proxy Messages
          return (
            <div key={msg.id} className="flex items-start justify-start gap-2 sm:gap-3 group w-full min-w-0">
              {/* Bot / Proxy Avatar Icon */}
              {isDirector && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 shadow-sm mt-0.5" title="AI Assistant">
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                </div>
              )}

              {isProxy && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 shadow-sm mt-0.5" title="AI Proxy (Taking User Role)">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                </div>
              )}

              <div className="flex flex-col items-start min-w-0 max-w-[calc(100%-40px)] sm:max-w-xl md:max-w-3xl">
                {/* Top action toolbar */}
                <div className="flex items-center gap-1 mb-1 px-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-semibold text-white/40 mr-0.5">
                    {isProxy ? (msg.agentName || 'AI Proxy') : 'AI Assistant'}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-indigo-300 border border-indigo-500/20 text-[9px] sm:text-[10px] font-mono font-bold shadow-sm mr-1" title={`Turn #${turnNumber}`}>
                    Turn {turnNumber}
                  </span>
                  {canRevert && (
                    <button 
                      onClick={() => handleRevertToTurn(turnNumber)} 
                      disabled={isLoading}
                      className="p-1 rounded hover:bg-amber-500/20 text-white/50 hover:text-amber-300 disabled:opacity-30 transition-colors flex items-center gap-0.5 mr-0.5" 
                      title={`Revert conversation to Turn ${turnNumber} (removes turns ${turnNumber + 1} to ${totalTurns})`}
                    >
                      <History className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[9px] font-mono text-amber-300/80 hidden sm:inline">↩ Revert</span>
                    </button>
                  )}
                  {isLongMessage && (
                    <button 
                      onClick={() => toggleCollapseMessage(msg.id)} 
                      className="p-1 rounded hover:bg-white/10 text-indigo-300 hover:text-white transition-colors" 
                      title={isCollapsed ? "Expand message" : "Collapse message"}
                    >
                      {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                    </button>
                  )}
                  <button 
                    onClick={() => handleRetryMessage(msg.id)} 
                    disabled={isLoading}
                    className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-indigo-300 disabled:opacity-30 transition-colors" 
                    title="Retry / Regenerate response"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                  <button 
                    onClick={() => handleCopyMessage(msg.id, msg.text)} 
                    className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors" 
                    title="Copy message"
                  >
                    {copiedMessageId === msg.id ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button 
                    onClick={() => handleEditMessage(msg.id)} 
                    className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors" 
                    title="Edit message"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleDeleteMessage(msg.id)} 
                    className="p-1 rounded hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors" 
                    title="Delete message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Bubble Container */}
                <div className={`w-full p-2.5 sm:p-3.5 rounded-2xl rounded-tl-sm transition-all min-w-0 break-words overflow-hidden ${
                  isProxy
                    ? 'bg-gradient-to-br from-amber-950/40 via-emerald-950/30 to-[#10141a] border border-amber-500/40 text-amber-50 shadow-md'
                    : 'bg-white/5 border border-white/10 text-white/80 shadow-sm'
                }`}>
                  {editingMessageId === msg.id ? (
                    <div className="flex flex-col gap-2">
                      <textarea
                        value={editInput}
                        onChange={(e) => setEditInput(e.target.value)}
                        className={`w-full bg-black/20 border border-white/20 rounded-lg p-2 ${STUDIO_FONT_CONFIGS[fontSize].inputTextClass} text-white outline-none resize-none custom-scrollbar`}
                        rows={3}
                        autoFocus
                      />
                      <div className="flex flex-wrap justify-end gap-2">
                        <button onClick={handleCancelEdit} className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 rounded-md transition-colors text-white/80 hover:text-white">Cancel</button>
                        <button onClick={() => handleSaveEdit(msg.id, false)} disabled={!editInput.trim() || isLoading} className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 disabled:opacity-40 rounded-md transition-colors text-white">Save Only</button>
                      </div>
                    </div>
                  ) : (
                    <div className={`space-y-3 relative transition-all min-w-0 ${isCollapsed ? 'max-h-28 sm:max-h-36 overflow-hidden select-none' : ''}`}>
                      {msg.attachedImage && (
                        <img src={msg.attachedImage} alt="User upload" className="rounded-lg max-w-full h-auto max-h-48 object-contain" />
                      )}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="space-y-1.5 my-2 w-full min-w-0">
                          {msg.attachments.map((att, i) => (
                            <CollapsibleFileAttachment key={i} file={att} />
                          ))}
                        </div>
                      )}
                      {/* Chat Loop Step Header / Speaker Badge */}
                      {msg.loopStepNumber && msg.loopTotalSteps && (
                        <div className={`mb-2 flex flex-wrap items-center gap-1.5 pb-2 border-b text-xs ${
                          isProxy 
                            ? 'border-amber-500/30 text-amber-200' 
                            : 'border-emerald-500/20 text-emerald-300'
                        }`}>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold ${
                            isProxy
                              ? 'bg-amber-500/20 border border-amber-500/40 text-amber-200'
                              : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-200'
                          }`}>
                            {isProxy ? (
                              <>
                                <User className="w-3.5 h-3.5 text-amber-400" />
                                <span>{msg.agentName || 'AI User-Proxy'} • Turn {msg.loopStepNumber}/{msg.loopTotalSteps}</span>
                              </>
                            ) : (
                              <>
                                <Bot className="w-3.5 h-3.5 text-emerald-400" />
                                <span>{msg.agentName || 'AI Assistant'} • Turn {msg.loopStepNumber}/{msg.loopTotalSteps}</span>
                              </>
                            )}
                          </span>

                          {msg.isLoopComplete ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-[10px] text-emerald-200 font-bold">
                              <span>🎉 Conversation Complete</span>
                              {msg.loopCompletionSummary && (
                                <span className="font-normal text-emerald-300/80">• {msg.loopCompletionSummary}</span>
                              )}
                            </span>
                          ) : (
                            <span className="text-[10px] opacity-70">
                              {isProxy ? '• Questioning & Refining' : '• Responding & Enhancing'}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Auto-Loop Trajectory Accordion */}
                      {msg.loopSteps && msg.loopSteps.length > 0 && (
                        <div className="my-2 rounded-xl border border-emerald-500/30 bg-emerald-950/20 overflow-hidden text-xs">
                          <button
                            type="button"
                            onClick={() => toggleExpandLoopSteps(msg.id)}
                            className="w-full px-3 py-2 bg-emerald-950/40 hover:bg-emerald-900/40 flex items-center justify-between text-emerald-300 font-medium transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Auto-Loop Trajectory ({msg.loopSteps.length} Steps)</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-white/50">
                              <span>{expandedLoopMsgIds[msg.id] ? 'Hide steps' : 'View steps'}</span>
                              {expandedLoopMsgIds[msg.id] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </div>
                          </button>
                          {expandedLoopMsgIds[msg.id] && (
                            <div className="p-3 space-y-2.5 border-t border-emerald-500/20 divide-y divide-white/5">
                              {msg.loopSteps.map((s, sIdx) => (
                                <div key={sIdx} className="pt-2 first:pt-0 space-y-1">
                                  <span className="font-bold text-emerald-300 uppercase tracking-wide text-[11px]">
                                    Step {s.step}: {s.title}
                                  </span>
                                  <p className="text-white/70 text-[11px] font-mono bg-black/40 p-2 rounded-lg border border-white/5 whitespace-pre-wrap">
                                    {s.summary}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Google Web Search Grounding & Sources */}
                      {((msg.webSearchQueries && msg.webSearchQueries.length > 0) || (msg.groundingSources && msg.groundingSources.length > 0)) && (
                        <div className="my-2.5 rounded-xl border border-cyan-500/30 bg-cyan-950/20 overflow-hidden text-xs shadow-sm">
                          <div className="px-3 py-1.5 bg-cyan-950/40 border-b border-cyan-500/20 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-cyan-300 font-semibold text-[11px]">
                              <Globe className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Live Google Web Grounding</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-400/20 border border-cyan-400/30 text-cyan-200 uppercase font-mono font-bold">
                                Verified
                              </span>
                            </div>
                            {msg.groundingSources && msg.groundingSources.length > 0 && (
                              <button
                                type="button"
                                onClick={() => toggleExpandSources(msg.id)}
                                className="text-[11px] text-cyan-300/70 hover:text-cyan-100 flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded hover:bg-white/5"
                              >
                                <span>{expandedSourcesMsgIds[msg.id] === false ? `Show ${msg.groundingSources.length} sources` : `Hide sources`}</span>
                                {expandedSourcesMsgIds[msg.id] === false ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                              </button>
                            )}
                          </div>

                          {/* Search Queries Badges */}
                          {msg.webSearchQueries && msg.webSearchQueries.length > 0 && (
                            <div className="p-2.5 bg-black/30 flex flex-wrap items-center gap-1.5 border-b border-cyan-500/10">
                              <span className="text-[10px] text-cyan-300/70 font-medium flex items-center gap-1">
                                <Search className="w-2.5 h-2.5 text-cyan-400" />
                                Searched:
                              </span>
                              {msg.webSearchQueries.map((q, qIdx) => (
                                <span
                                  key={qIdx}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-900/30 border border-cyan-500/25 text-cyan-200 text-[11px] font-mono"
                                >
                                  <span>"{q}"</span>
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Grounding Sources */}
                          {msg.groundingSources && msg.groundingSources.length > 0 && expandedSourcesMsgIds[msg.id] !== false && (
                            <div className="p-2.5 space-y-1.5 bg-black/40">
                              <div className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">
                                Referenced Citations ({msg.groundingSources.length}):
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                {msg.groundingSources.map((source, sIdx) => {
                                  let hostname = '';
                                  try {
                                    hostname = new URL(source.url).hostname.replace(/^www\./, '');
                                  } catch {
                                    hostname = source.url;
                                  }
                                  return (
                                    <a
                                      key={sIdx}
                                      href={source.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="group/link flex items-start gap-2 p-2 rounded-lg bg-white/5 hover:bg-cyan-950/50 border border-white/10 hover:border-cyan-500/40 transition-all text-[11px]"
                                      title={source.title || source.url}
                                    >
                                      <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5 group-hover/link:scale-110 transition-transform" />
                                      <div className="min-w-0 flex-1">
                                        <div className="text-white/90 group-hover/link:text-cyan-200 font-medium truncate">
                                          {source.title || hostname}
                                        </div>
                                        <div className="text-[10px] text-white/40 flex items-center gap-1 mt-0.5 font-mono truncate">
                                          <span className="truncate">{hostname}</span>
                                          <ExternalLink className="w-2.5 h-2.5 text-white/30 group-hover/link:text-cyan-400 shrink-0" />
                                        </div>
                                      </div>
                                    </a>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {msg.text && (
                        <div className={`${!isUser ? `${STUDIO_FONT_CONFIGS[fontSize].proseClass} prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-td:border-white/20 prose-th:border-white/20` : `${STUDIO_FONT_CONFIGS[fontSize].chatTextClass} whitespace-pre-wrap`}`}>
                          {!isUser ? (
                            <StudioMarkdownRenderer text={msg.text} fontSize={fontSize} isProxy={isProxy} />
                          ) : (
                            msg.text
                          )}
                        </div>
                      )}
                      {msg.generatedImageUrl && (
                        <img src={msg.generatedImageUrl} alt="Generated" className="rounded-lg max-w-full h-auto object-contain mt-2 border border-white/10" />
                      )}

                      {/* Collapsed Overlay */}
                      {isCollapsed && (
                        <div 
                          onClick={() => toggleCollapseMessage(msg.id)}
                          className="absolute inset-x-0 bottom-0 h-16 flex items-end justify-center pb-1.5 cursor-pointer z-10 bg-gradient-to-t from-[#141417] via-[#141417]/90 to-transparent"
                        >
                          <span className="px-3 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 shadow-lg bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400/30 transition-transform hover:scale-105">
                            <ChevronDown className="w-3.5 h-3.5" /> 
                            <span>Expand text ({(msg.text || '').split('\n').length} lines)</span>
                          </span>
                        </div>
                      )}

                      {/* Expanded Footer Button */}
                      {isLongMessage && !isCollapsed && (
                        <div className="mt-2 pt-1 border-t border-white/10 text-white/50 flex justify-end">
                          <button
                            onClick={() => toggleCollapseMessage(msg.id)}
                            className="text-[10px] hover:text-white flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors font-medium"
                            title="Collapse message text"
                          >
                            <ChevronUp className="w-3 h-3" />
                            <span>Collapse message</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
         {isLoading && (
            <div className="flex items-start gap-2 sm:gap-3">
                 <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                </div>
                <div className="max-w-[88%] sm:max-w-lg p-2.5 sm:p-3 rounded-2xl bg-white/5 text-white/80 rounded-bl-lg space-y-2 border border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-150"></div>
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-300"></div>
                      <span className="text-xs text-white/80 font-medium">
                        {loopProgressText || 'Thinking & executing...'}
                      </span>
                    </div>
                    {isLoopEnabled && (
                      <div className="flex items-center justify-between pt-1 border-t border-white/10">
                        <span className="text-[10px] text-emerald-400/80 font-mono">
                          Auto-Execution Active
                        </span>
                        <button
                          type="button"
                          onClick={handleStopLoop}
                          className="px-2 py-0.5 rounded bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200 text-[10px] font-bold flex items-center gap-1 transition-colors"
                        >
                          <Square className="w-2.5 h-2.5 text-red-400 fill-red-400" />
                          <span>Stop</span>
                        </button>
                      </div>
                    )}
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-2 sm:p-3 md:p-4 border-t border-white/10 bg-[#0d0e15]/95 backdrop-blur-md">
        {/* Attached Images & Files Preview Bar */}
        {(attachedImages.length > 0 || attachedFiles.length > 0) && (
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 animate-in fade-in max-h-36 overflow-y-auto custom-scrollbar p-1.5 rounded-lg bg-black/40 border border-white/10">
            {/* Multiple Attached Images Preview Thumbnails */}
            {attachedImages.map((imgSrc, imgIdx) => (
              <div key={imgIdx} className="relative inline-block group shrink-0">
                <img 
                  src={imgSrc} 
                  alt={`Upload ${imgIdx + 1}`} 
                  className="h-10 sm:h-12 w-10 sm:w-12 rounded-lg border border-purple-500/40 shadow-md object-cover hover:scale-105 transition-transform" 
                />
                <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded bg-black/80 text-[8px] text-purple-200 font-mono font-bold leading-none">
                  #{imgIdx + 1}
                </span>
                <button 
                  type="button"
                  onClick={() => setAttachedImages(prev => prev.filter((_, i) => i !== imgIdx))}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-400 shadow-sm transition-transform group-hover:scale-110"
                  title="Remove image"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {/* Attached Files List */}
            {attachedFiles.map((file, idx) => {
              const ext = (file.name.split('.').pop() || '').toLowerCase();
              const isCode = ['js', 'jsx', 'ts', 'tsx', 'py', 'json', 'html', 'css', 'scss', 'sql', 'sh', 'yaml', 'yml', 'rs', 'go', 'java', 'c', 'cpp'].includes(ext);
              const isAudio = ['mp3', 'wav', 'm4a', 'ogg', 'flac', 'aac'].includes(ext);

              return (
                <div
                  key={idx}
                  className="flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/35 text-indigo-200 text-[11px] sm:text-xs shadow-sm hover:border-indigo-400 transition-all shrink-0"
                >
                  {isCode ? (
                    <FileCode className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-400 shrink-0" />
                  ) : isAudio ? (
                    <Music className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
                  ) : (
                    <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 shrink-0" />
                  )}
                  <span className="truncate max-w-[110px] sm:max-w-[150px] font-mono text-[10px] sm:text-[11px] font-medium" title={file.name}>
                    {file.name}
                  </span>
                  {file.range && (
                    <span className="text-[9px] sm:text-[10px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                      L{file.range.start}-L{file.range.end}
                    </span>
                  )}
                  <span className="text-[9px] sm:text-[10px] text-indigo-300/60 font-mono hidden xs:inline">
                    ({file.lineCount ? `${file.lineCount}L` : `${((file.size || 0) / 1024).toFixed(1)}KB`})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setInput(prev => prev ? `${prev}\n${file.content}` : file.content);
                      setAttachedFiles(prev => prev.filter((_, i) => i !== idx));
                    }}
                    className="p-0.5 rounded hover:bg-white/10 text-white/50 hover:text-indigo-300 transition-colors ml-0.5"
                    title="Paste back as raw text in input box"
                  >
                    <Type className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== idx))}
                    className="p-0.5 rounded hover:bg-white/10 text-white/50 hover:text-red-400 transition-colors ml-0.5"
                    title="Remove file"
                  >
                    <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </button>
                </div>
              );
            })}

            {(attachedFiles.length > 0 || attachedImages.length > 0) && (
              <button
                type="button"
                onClick={() => {
                  setAttachedFiles([]);
                  setAttachedImages([]);
                }}
                className="text-[10px] text-white/40 hover:text-red-400 px-1.5 py-0.5 rounded hover:bg-white/5 transition-colors ml-auto shrink-0"
                title="Clear all attachments"
              >
                Clear All ({attachedImages.length + attachedFiles.length})
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSendMessage} className={`relative flex flex-col bg-black/60 border rounded-xl shadow-xl transition-all ${
          isInputExpanded ? 'border-indigo-500/80 shadow-indigo-500/10' : 'border-white/10 focus-within:border-indigo-500/60'
        }`}>
          {/* Hidden File Inputs */}
          <input 
            type="file" 
            multiple
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleGenericFileUpload} 
          />
          <input 
            type="file" 
            accept="image/*" 
            multiple
            className="hidden" 
            ref={imageInputRef} 
            onChange={handleImageUpload} 
          />

          {/* Expanded Top Header */}
          {isInputExpanded && (
            <div className="flex items-center justify-between px-2.5 sm:px-3 py-1.5 border-b border-white/10 bg-white/5 rounded-t-xl text-[11px] text-white/60">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Maximize2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="font-semibold text-indigo-200">Studio Prompt Editor</span>
                <span className="text-white/30 hidden sm:inline">•</span>
                <span className="text-white/50 text-[11px] hidden sm:inline">
                  {input ? input.split('\n').length : 0} lines ({input.length} chars)
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
                  <Minimize2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Collapse</span>
                </button>
              </div>
            </div>
          )}

          {/* Textarea with Clipboard Paste & Mobile Paste Support */}
          <textarea
            value={input}
            onChange={e => {
              const newVal = e.target.value;
              const diff = newVal.length - input.length;
              // Catch mobile paste (Android keyboard clipboard ribbon or long-press paste where onPaste is bypassed)
              if (diff > 150 || (diff > 50 && newVal.split('\n').length - input.split('\n').length >= 3)) {
                let insertedText = '';
                if (newVal.startsWith(input)) {
                  insertedText = newVal.slice(input.length);
                } else if (newVal.endsWith(input)) {
                  insertedText = newVal.slice(0, newVal.length - input.length);
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
              setInput(newVal);
            }}
            onPaste={async (e) => {
              if (e.clipboardData.files && e.clipboardData.files.length > 0) {
                e.preventDefault();
                await processRawFiles(Array.from(e.clipboardData.files));
                return;
              }
              const pasted = e.clipboardData?.getData('text/plain') || e.clipboardData?.getData('text');
              if (pasted && (pasted.length > 120 || pasted.split('\n').length >= 3)) {
                e.preventDefault();
                handleProcessPastedOrLargeText(pasted);
              }
            }}
            onKeyDown={e => {
                if (e.key === 'Escape' && isInputExpanded) {
                    setIsInputExpanded(false);
                }
            }}
            placeholder="Ask AI Studio, query Git repo, attach files/images, search web..."
            className={`w-full bg-transparent ${STUDIO_FONT_CONFIGS[fontSize].inputTextClass} text-white/90 outline-none custom-scrollbar transition-all ${
              isInputExpanded 
                ? `p-2.5 sm:p-3 min-h-[140px] sm:min-h-[200px] resize-y font-mono ${STUDIO_FONT_CONFIGS[fontSize].inputTextClass}` 
                : 'p-2.5 sm:p-3 min-h-[44px] max-h-32 resize-none'
            }`}
            rows={isInputExpanded ? 7 : 2}
          />

          {/* Unified Action Toolbar */}
          <div className={`flex items-center justify-between px-2 sm:px-2.5 py-1.5 border-t border-white/5 bg-white/[0.02] rounded-b-xl gap-1.5 ${
            isInputExpanded ? 'bg-white/5 border-white/10' : ''
          }`}>
            {/* Left Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto custom-scrollbar py-0.5">
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className={`p-1.5 sm:px-2 sm:py-1 rounded-lg text-xs flex items-center gap-1 transition-all shrink-0 ${
                  attachedFiles.length > 0
                    ? 'text-indigo-200 bg-indigo-500/25 ring-1 ring-indigo-500/40'
                    : 'text-white/50 hover:text-white hover:bg-white/10'
                }`}
                title="Attach Files (Code, Text, Markdown, JSON, SRT, Documents, etc.)"
              >
                <Paperclip className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="hidden md:inline">Files</span>
                {attachedFiles.length > 0 && (
                  <span className="text-[9px] px-1 rounded bg-indigo-500/30 text-indigo-200 font-bold">{attachedFiles.length}</span>
                )}
              </button>

              <button 
                type="button" 
                onClick={() => imageInputRef.current?.click()}
                className={`p-1.5 sm:px-2 sm:py-1 rounded-lg text-xs flex items-center gap-1 transition-all shrink-0 ${
                  attachedImages.length > 0
                    ? 'text-purple-200 bg-purple-500/25 ring-1 ring-purple-500/40'
                    : 'text-white/50 hover:text-white hover:bg-white/10'
                }`}
                title={`Attach Images (${attachedImages.length} attached)`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="hidden md:inline">Images</span>
                {attachedImages.length > 0 && (
                  <span className="text-[9px] px-1 rounded bg-purple-500/30 text-purple-200 font-bold">{attachedImages.length}</span>
                )}
              </button>

              <button 
                type="button" 
                onClick={() => setIsGitHubModalOpen(true)}
                className={`p-1.5 sm:px-2 sm:py-1 rounded-lg text-xs flex items-center gap-1 transition-all shrink-0 border ${
                  isGitRepoEnabled && gitRepoConfig
                    ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border-blue-500/40'
                    : 'bg-transparent hover:bg-white/10 text-white/50 hover:text-white border-transparent'
                }`}
                title={isGitRepoEnabled && gitRepoConfig ? `Connected Git Repo: ${gitRepoConfig.owner}/${gitRepoConfig.repo} (${gitRepoConfig.branch})` : "Connect & Attach GitHub Repo"}
              >
                <Github className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="hidden sm:inline">Git</span>
                <span className={`text-[9px] font-bold px-1 rounded uppercase ${isGitRepoEnabled && gitRepoConfig ? 'bg-blue-400/25 text-blue-300' : 'bg-white/10 text-white/40'}`}>
                  {isGitRepoEnabled && gitRepoConfig ? 'ON' : 'OFF'}
                </span>
              </button>

              <button 
                type="button" 
                onClick={() => handleToggleAppEdit(!isAppEditEnabled)}
                className={`p-1.5 sm:px-2 sm:py-1 rounded-lg text-xs flex items-center gap-1 transition-all shrink-0 border ${
                  isAppEditEnabled 
                    ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border-emerald-500/40' 
                    : 'bg-transparent hover:bg-white/10 text-white/50 hover:text-white border-transparent'
                }`}
                title={isAppEditEnabled ? "App Direct Write & Edit is ON: AI will write/edit texts directly into the app" : "Turn ON App Direct Write & Edit Mode"}
              >
                <PenLine className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="hidden sm:inline">App Edit</span>
                <span className={`text-[9px] font-bold px-1 rounded uppercase ${isAppEditEnabled ? 'bg-emerald-400/25 text-emerald-300' : 'bg-white/10 text-white/40'}`}>
                  {isAppEditEnabled ? 'ON' : 'OFF'}
                </span>
              </button>

              <button 
                type="button" 
                onClick={() => handleToggleWebSearch(!isWebSearchEnabled)}
                className={`p-1.5 sm:px-2 sm:py-1 rounded-lg text-xs flex items-center gap-1 transition-all shrink-0 border ${
                  isWebSearchEnabled 
                    ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border-cyan-500/40' 
                    : 'bg-transparent hover:bg-white/10 text-white/50 hover:text-white border-transparent'
                }`}
                title={isWebSearchEnabled ? "Live Google Web Search Grounding is ON" : "Turn ON Live Web Search Grounding"}
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="hidden sm:inline">Search</span>
                <span className={`text-[9px] font-bold px-1 rounded uppercase ${isWebSearchEnabled ? 'bg-cyan-400/25 text-cyan-300' : 'bg-white/10 text-white/40'}`}>
                  {isWebSearchEnabled ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
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
                <span className="text-[10px] font-mono text-indigo-300 font-semibold px-1 select-none hidden xxs:inline">
                  {STUDIO_FONT_CONFIGS[fontSize]?.shortLabel || fontSize}
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
                onClick={handleClearChat} 
                className="p-1.5 text-white/40 hover:text-red-400 hover:bg-white/10 rounded-md transition-colors" 
                title="Clear Chat History"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <button 
                type="button" 
                onClick={() => setIsInputExpanded(!isInputExpanded)} 
                className="p-1.5 text-white/40 hover:text-indigo-300 hover:bg-white/10 rounded-md transition-colors" 
                title={isInputExpanded ? "Collapse input" : "Expand to multi-line prompt editor"}
              >
                {isInputExpanded ? (
                  <Minimize2 className="w-3.5 h-3.5 text-indigo-400" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
                )}
              </button>

              {isLoading ? (
                <button 
                  type="button" 
                  onClick={handleStopGeneration} 
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-all text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 animate-pulse"
                  title="Stop AI Generation"
                >
                  <Square className="w-3 h-3 fill-current text-white" />
                  <span>Stop</span>
                </button>
              ) : (
                <button 
                  type="submit" 
                  disabled={!input.trim() && !attachedImage && attachedFiles.length === 0} 
                  className="px-3 py-1.5 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-semibold flex items-center gap-1 shadow-sm active:scale-95"
                  title="Send message"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Send</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <GitHubConnectModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        onSelectRepo={(repo) => {
          setGitRepoConfig(repo);
          setIsGitRepoEnabled(true);
          try {
            localStorage.setItem('mv_studio_git_repo_config', JSON.stringify(repo));
            localStorage.setItem('mv_studio_git_enabled', 'true');
          } catch {}
          if (activeConversationId) {
            setConversations(prev => {
              const updated = prev.map(c => c.id === activeConversationId ? {
                ...c,
                repoConfig: {
                  ...repo,
                  isEnabled: true,
                },
                updatedAt: new Date().toISOString(),
              } : c);
              saveConversationsList(updated);
              return updated;
            });
          }
          if (onLog) onLog(`Linked GitHub repository: ${repo.owner}/${repo.repo} (${repo.branch})`, 'success');
        }}
        onClearLinkedRepo={() => {
          setGitRepoConfig(null);
          setIsGitRepoEnabled(false);
          setIndexedSummary(null);
          try {
            localStorage.removeItem('mv_studio_git_repo_config');
            localStorage.setItem('mv_studio_git_enabled', 'false');
          } catch {}
          if (activeConversationId) {
            setConversations(prev => {
              const updated = prev.map(c => c.id === activeConversationId ? {
                ...c,
                repoConfig: undefined,
                updatedAt: new Date().toISOString(),
              } : c);
              saveConversationsList(updated);
              return updated;
            });
          }
          if (onLog) onLog('Linked GitHub repository cleared and unlinked from local storage.', 'info');
        }}
        onAttachContext={(content, metadata) => {
          if (metadata?.filePayload) {
            setAttachedFiles(prev => [...prev, metadata.filePayload!]);
          } else {
            setAttachedFiles(prev => [...prev, {
              name: metadata?.title || 'GitHub File',
              content,
              size: content.length,
              lineCount: content.split('\n').length,
              url: metadata?.url,
            }]);
          }
          if (onLog) onLog(`Attached ${metadata?.title || 'GitHub file'} as structured preview.`, 'success');
        }}
      />

      {/* Auto-Loop Guide Modal */}
      <AutoLoopGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      {/* Gemini Executive Memory Distiller Modal */}
      <KieMemoryDistillModal
        isOpen={showMemoryDistillModal}
        onClose={() => setShowMemoryDistillModal(false)}
        sessions={conversations.map(c => ({
          id: c.id,
          title: c.title,
          messages: ((c as any).messages || []).map((m: any) => ({
            id: m.id,
            role: m.sender === 'user' ? 'user' : (m.role || 'assistant'),
            content: m.text || m.content || '',
            name: m.agentName || m.name
          })),
          systemPrompt: c.systemPrompt,
          updatedAt: c.updatedAt ? new Date(c.updatedAt).getTime() : Date.now(),
        }))}
        activeSessionId={activeConversationId || ''}
        messages={messages.map(m => ({
          id: m.id,
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text,
          name: m.agentName,
        }))}
        currentSystemPrompt={activeConversation?.systemPrompt || ''}
        onApplyExecutiveMemory={(distilledText, targetSessionId) => {
          const nowStr = new Date().toISOString();
          if (targetSessionId === 'all') {
            setConversations(prev => {
              const updated = prev.map(c => ({
                ...c,
                systemPrompt: distilledText,
                updatedAt: nowStr,
              }));
              saveConversationsList(updated);
              return updated;
            });
            if (onLog) onLog('Applied distilled memory to all conversations in Studio.', 'success');
          } else if (targetSessionId && targetSessionId !== activeConversationId) {
            setConversations(prev => {
              const updated = prev.map(c => c.id === targetSessionId ? {
                ...c,
                systemPrompt: distilledText,
                updatedAt: nowStr,
              } : c);
              saveConversationsList(updated);
              return updated;
            });
            if (onLog) onLog('Applied distilled memory to target conversation.', 'success');
          } else {
            if (activeConversationId) {
              setConversations(prev => {
                const updated = prev.map(c => c.id === activeConversationId ? {
                  ...c,
                  systemPrompt: distilledText,
                  updatedAt: nowStr,
                } : c);
                saveConversationsList(updated);
                return updated;
              });
            }
            if (onLog) onLog('Applied distilled executive memory to active conversation.', 'success');
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
          if (onLog) onLog(`Attached pasted text as ${fileItem.name} (${fileItem.lineCount} lines)`, 'success');
        }}
        onPasteAsText={(rawText) => {
          setInput(prev => prev ? `${prev}\n${rawText}` : rawText);
          setPasteModalData(null);
        }}
        onCancel={() => setPasteModalData(null)}
      />
      </div>
    </div>
  );
};

export default StudioChat;
