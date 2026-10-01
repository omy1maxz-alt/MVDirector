import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  X, 
  MessageSquare, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Copy, 
  Archive, 
  Check, 
  PanelLeftClose, 
  ArchiveRestore,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { StudioConversation, ConversationGroup } from '@/types/chat';
import { 
  groupConversationsByDate, 
  formatConversationTimestamp 
} from '@/services/studioChatStorage';

interface ChatSidebarProps {
  conversations: StudioConversation[];
  activeConversationId: string | null;
  isOpen: boolean;
  isMobile: boolean;
  onSelectConversation: (conversationId: string) => void;
  onNewChat: () => void;
  onRenameConversation: (conversationId: string, newTitle: string) => void;
  onDeleteConversation: (conversationId: string) => void;
  onDuplicateConversation: (conversationId: string) => void;
  onArchiveConversation: (conversationId: string, isArchived: boolean) => void;
  onCloseSidebar: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  activeConversationId,
  isOpen,
  isMobile,
  onSelectConversation,
  onNewChat,
  onRenameConversation,
  onDeleteConversation,
  onDuplicateConversation,
  onArchiveConversation,
  onCloseSidebar,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'active' | 'archived'>('active');
  const [activeMenuConvoId, setActiveMenuConvoId] = useState<string | null>(null);
  const [editingConvoId, setEditingConvoId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [deletingConvo, setDeletingConvo] = useState<StudioConversation | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  // Close 3-dot menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuConvoId(null);
      }
    };
    if (activeMenuConvoId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenuConvoId]);

  // Focus rename input when activated
  useEffect(() => {
    if (editingConvoId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [editingConvoId]);

  // Filter conversations
  const filteredConversations = useMemo(() => {
    let result = conversations.filter(c => {
      if (viewMode === 'archived') {
        return Boolean(c.isArchived);
      }
      return !c.isArchived;
    });

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        (c.title || '').toLowerCase().includes(q) ||
        (c.lastMessagePreview || '').toLowerCase().includes(q)
      );
    }

    return result;
  }, [conversations, viewMode, searchQuery]);

  // Group filtered conversations
  const conversationGroups: ConversationGroup[] = useMemo(() => {
    return groupConversationsByDate(filteredConversations);
  }, [filteredConversations]);

  const handleStartRename = (convo: StudioConversation) => {
    setActiveMenuConvoId(null);
    setEditingConvoId(convo.id);
    setEditingTitle(convo.title);
  };

  const handleSaveRename = () => {
    if (editingConvoId && editingTitle.trim()) {
      onRenameConversation(editingConvoId, editingTitle.trim());
    }
    setEditingConvoId(null);
    setEditingTitle('');
  };

  const handleKeyDownRename = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveRename();
    } else if (e.key === 'Escape') {
      setEditingConvoId(null);
      setEditingTitle('');
    }
  };

  const handleConfirmDelete = () => {
    if (deletingConvo) {
      onDeleteConversation(deletingConvo.id);
      setDeletingConvo(null);
    }
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isMobile && isOpen && (
        <div 
          onClick={onCloseSidebar}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          flex flex-col bg-[#0f0f14] border-r border-white/10 text-white z-40
          transition-all duration-300 ease-in-out shrink-0 select-none
          ${isMobile 
            ? `fixed inset-y-0 left-0 w-80 max-w-[85vw] shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}` 
            : `${isOpen ? 'w-64 xl:w-72 opacity-100' : 'w-0 opacity-0 pointer-events-none border-r-0'} overflow-hidden`
          }
        `}
      >
        {/* Top Action Bar */}
        <div className="p-3 border-b border-white/10 flex flex-col gap-2.5 bg-black/40">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <span className="text-xs font-bold text-white tracking-wide uppercase">Conversations</span>
            </div>
            
            {/* Close Button on Mobile / Desktop */}
            <button
              onClick={onCloseSidebar}
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              title="Close sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          {/* New Chat Primary Button */}
          <button
            onClick={() => {
              onNewChat();
              if (isMobile) onCloseSidebar();
            }}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all border border-indigo-400/30 active:scale-[0.99]"
            title="Start an independent new chat"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>

          {/* Search Box */}
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-white/5 hover:bg-white/8 focus:bg-black/60 border border-white/10 focus:border-indigo-500/50 rounded-lg pl-8 pr-7 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 p-0.5 text-white/40 hover:text-white"
                title="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Active vs Archived View Filter Tabs */}
          <div className="flex items-center gap-1 p-0.5 bg-black/40 rounded-lg border border-white/5 text-[11px]">
            <button
              onClick={() => setViewMode('active')}
              className={`flex-1 py-1 rounded-md text-center font-medium transition-all ${
                viewMode === 'active' 
                  ? 'bg-white/15 text-white shadow-xs font-semibold' 
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              Active ({conversations.filter(c => !c.isArchived).length})
            </button>
            <button
              onClick={() => setViewMode('archived')}
              className={`flex-1 py-1 rounded-md text-center font-medium transition-all ${
                viewMode === 'archived' 
                  ? 'bg-white/15 text-white shadow-xs font-semibold' 
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              Archived ({conversations.filter(c => c.isArchived).length})
            </button>
          </div>
        </div>

        {/* Conversation List / Groups */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-4">
          {filteredConversations.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center p-4 text-white/40 space-y-2">
              <MessageSquare className="w-8 h-8 opacity-25" />
              <p className="text-xs">
                {searchQuery ? 'No matching conversations' : viewMode === 'archived' ? 'No archived chats' : 'No conversations yet'}
              </p>
              {!searchQuery && viewMode === 'active' && (
                <button
                  onClick={() => {
                    onNewChat();
                    if (isMobile) onCloseSidebar();
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium"
                >
                  Start your first chat
                </button>
              )}
            </div>
          ) : (
            conversationGroups.map(group => (
              <div key={group.category} className="space-y-1">
                <div className="px-2 py-1 text-[10px] font-bold text-white/40 uppercase tracking-wider">
                  {group.label}
                </div>
                <div className="space-y-0.5">
                  {group.conversations.map(convo => {
                    const isActive = convo.id === activeConversationId;
                    const isMenuOpen = activeMenuConvoId === convo.id;
                    const isRenaming = editingConvoId === convo.id;

                    return (
                      <div
                        key={convo.id}
                        className={`
                          group relative flex items-center justify-between rounded-xl px-2.5 py-2 transition-all cursor-pointer border
                          ${isActive 
                            ? 'bg-indigo-600/20 border-indigo-500/40 text-white shadow-sm ring-1 ring-indigo-500/30' 
                            : 'bg-transparent hover:bg-white/5 border-transparent text-white/70 hover:text-white'
                          }
                        `}
                        onClick={() => {
                          if (!isRenaming) {
                            onSelectConversation(convo.id);
                            if (isMobile) onCloseSidebar();
                          }
                        }}
                      >
                        {/* Conversation Left Content */}
                        <div className="flex items-start gap-2 min-w-0 flex-1 pr-1">
                          <MessageSquare className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-white/40 group-hover:text-white/70'}`} />
                          
                          <div className="flex-1 min-w-0">
                            {isRenaming ? (
                              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                <input
                                  ref={renameInputRef}
                                  type="text"
                                  value={editingTitle}
                                  onChange={(e) => setEditingTitle(e.target.value)}
                                  onKeyDown={handleKeyDownRename}
                                  className="w-full bg-black/80 border border-indigo-400 rounded px-1.5 py-0.5 text-xs text-white focus:outline-none"
                                />
                                <button
                                  onClick={handleSaveRename}
                                  className="p-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white"
                                  title="Save title"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => setEditingConvoId(null)}
                                  className="p-1 rounded bg-white/10 hover:bg-white/20 text-white/70"
                                  title="Cancel"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <p className={`text-xs font-medium truncate ${isActive ? 'text-white font-semibold' : 'text-white/90'}`}>
                                  {convo.title || 'Untitled Conversation'}
                                </p>
                                {convo.lastMessagePreview && (
                                  <p className="text-[10px] text-white/40 truncate mt-0.5">
                                    {convo.lastMessagePreview}
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                        </div>

                        {/* Timestamp & Three-Dot Menu Trigger */}
                        {!isRenaming && (
                          <div className="flex items-center gap-1 shrink-0 ml-1">
                            <span className="text-[9px] text-white/40 group-hover:hidden">
                              {formatConversationTimestamp(convo.updatedAt || convo.createdAt)}
                            </span>

                            {/* 3-Dot Options Trigger */}
                            <div className="relative">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuConvoId(isMenuOpen ? null : convo.id);
                                }}
                                className={`p-1 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors ${
                                  isMenuOpen ? 'opacity-100 bg-white/10 text-white' : 'opacity-0 group-hover:opacity-100'
                                }`}
                                title="Conversation actions"
                              >
                                <MoreVertical className="w-3.5 h-3.5" />
                              </button>

                              {/* Dropdown Menu */}
                              {isMenuOpen && (
                                <div 
                                  ref={menuRef}
                                  onClick={(e) => e.stopPropagation()}
                                  className="absolute right-0 top-6 z-50 w-44 rounded-xl bg-[#181820] border border-white/15 shadow-2xl py-1 text-xs text-white/80 animate-in fade-in zoom-in-95 duration-100"
                                >
                                  <button
                                    onClick={() => handleStartRename(convo)}
                                    className="w-full px-3 py-1.5 text-left hover:bg-white/10 hover:text-white flex items-center gap-2 transition-colors"
                                  >
                                    <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                                    <span>Rename</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setActiveMenuConvoId(null);
                                      onDuplicateConversation(convo.id);
                                    }}
                                    className="w-full px-3 py-1.5 text-left hover:bg-white/10 hover:text-white flex items-center gap-2 transition-colors"
                                  >
                                    <Copy className="w-3.5 h-3.5 text-cyan-400" />
                                    <span>Duplicate</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setActiveMenuConvoId(null);
                                      onArchiveConversation(convo.id, !convo.isArchived);
                                    }}
                                    className="w-full px-3 py-1.5 text-left hover:bg-white/10 hover:text-white flex items-center gap-2 transition-colors"
                                  >
                                    {convo.isArchived ? (
                                      <>
                                        <ArchiveRestore className="w-3.5 h-3.5 text-amber-400" />
                                        <span>Unarchive</span>
                                      </>
                                    ) : (
                                      <>
                                        <Archive className="w-3.5 h-3.5 text-amber-400" />
                                        <span>Archive</span>
                                      </>
                                    )}
                                  </button>

                                  <div className="my-1 border-t border-white/10" />

                                  <button
                                    onClick={() => {
                                      setActiveMenuConvoId(null);
                                      setDeletingConvo(convo);
                                    }}
                                    className="w-full px-3 py-1.5 text-left hover:bg-red-500/20 text-red-300 hover:text-red-200 flex items-center gap-2 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-2.5 border-t border-white/10 bg-black/30 flex items-center justify-between text-[10px] text-white/40">
          <span>{conversations.length} total {conversations.length === 1 ? 'chat' : 'chats'}</span>
          <span className="flex items-center gap-1 text-emerald-400/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Auto-saved
          </span>
        </div>
      </aside>

      {/* Delete Confirmation Modal */}
      {deletingConvo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-[#14141c] border border-red-500/30 rounded-2xl w-full max-w-sm p-4 shadow-2xl text-white space-y-3">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Delete Conversation?</span>
            </div>
            
            <p className="text-xs text-white/70 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-white">"{deletingConvo.title}"</strong>? All associated messages and attachments in this chat will be removed.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingConvo(null)}
                className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-3 py-1.5 text-xs bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg shadow-md transition-colors"
              >
                Delete Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
