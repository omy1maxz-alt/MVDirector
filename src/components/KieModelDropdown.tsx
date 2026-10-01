import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  ChevronDown, 
  Check, 
  Search, 
  X, 
  Sparkles, 
  Cpu, 
  Sliders, 
  Layers, 
  ExternalLink,
  Plus
} from 'lucide-react';
import { KIE_POPULAR_MODELS, KieModelOption } from '@/services/kieChatService';

interface KieModelDropdownProps {
  model: string;
  onSelectModel: (modelId: string) => void;
  className?: string;
}

const PROVIDER_COLORS: Record<string, { dot: string; badge: string; border: string }> = {
  Google: {
    dot: 'bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.6)]',
    badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
    border: 'hover:border-cyan-500/40'
  },
  OpenAI: {
    dot: 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]',
    badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    border: 'hover:border-emerald-500/40'
  },
  Anthropic: {
    dot: 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]',
    badge: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    border: 'hover:border-amber-500/40'
  },
  xAI: {
    dot: 'bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,0.6)]',
    badge: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
    border: 'hover:border-purple-500/40'
  },
  DeepSeek: {
    dot: 'bg-indigo-400 shadow-[0_0_6px_rgba(129,140,248,0.6)]',
    badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    border: 'hover:border-indigo-500/40'
  },
  Moonshot: {
    dot: 'bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.6)]',
    badge: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    border: 'hover:border-blue-500/40'
  },
  Custom: {
    dot: 'bg-pink-400 shadow-[0_0_6px_rgba(244,114,182,0.6)]',
    badge: 'bg-pink-500/10 text-pink-300 border-pink-500/20',
    border: 'hover:border-pink-500/40'
  }
};

const FLAGSHIP_POPULAR_IDS = [
  'gemini-3.5-flash',
  'gpt-5-6-sol',
  'claude-sonnet-5',
  'deepseek-v4-1-flash',
  'grok-4-7',
  'deepseek-r1',
  'kimi-k3',
  'gemini-3.8-flash',
  'claude-opus-5'
];

type ProviderFilterType = 'all' | 'popular' | 'Google' | 'OpenAI' | 'Anthropic' | 'xAI' | 'DeepSeek' | 'Moonshot';

export const KieModelDropdown: React.FC<KieModelDropdownProps> = ({
  model,
  onSelectModel,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [providerFilter, setProviderFilter] = useState<ProviderFilterType>('all');
  const [customModelInput, setCustomModelInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(null);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Find currently active model details
  const activeModelOption: KieModelOption = KIE_POPULAR_MODELS.find(m => m.id === model) || {
    id: model,
    name: model,
    provider: 'Custom',
    description: 'Custom Model ID',
    badge: 'Custom'
  };

  const activeColors = PROVIDER_COLORS[activeModelOption.provider] || PROVIDER_COLORS.Custom;

  const handleOpenDropdown = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = Math.min(420, window.innerWidth - 24);
      let left = rect.left;
      
      // Prevent overflow off right edge of screen
      if (left + dropdownWidth > window.innerWidth - 12) {
        left = Math.max(12, window.innerWidth - dropdownWidth - 12);
      }
      
      // Calculate top position, ensure it stays within viewport
      const top = rect.bottom + 6;
      setCoords({ top, left, width: dropdownWidth });
    }
    setIsOpen(true);
    setSearchQuery('');
    setShowCustomInput(false);
  };

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle window resize while open
  useEffect(() => {
    if (!isOpen) return;
    const handleResize = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const dropdownWidth = Math.min(420, window.innerWidth - 24);
        let left = rect.left;
        if (left + dropdownWidth > window.innerWidth - 12) {
          left = Math.max(12, window.innerWidth - dropdownWidth - 12);
        }
        setCoords({ top: rect.bottom + 6, left, width: dropdownWidth });
      }
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Filter models based on search query and provider tab
  const filteredModels = KIE_POPULAR_MODELS.filter(m => {
    if (providerFilter === 'popular') {
      if (!FLAGSHIP_POPULAR_IDS.includes(m.id)) return false;
    } else if (providerFilter === 'DeepSeek') {
      if (m.provider !== 'DeepSeek') return false;
    } else if (providerFilter === 'Moonshot') {
      if (m.provider !== 'Moonshot' && m.provider !== 'Other') return false;
    } else if (providerFilter !== 'all') {
      if (m.provider !== providerFilter) return false;
    }

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      m.name.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q) ||
      m.provider.toLowerCase().includes(q) ||
      (m.badge && m.badge.toLowerCase().includes(q)) ||
      m.description.toLowerCase().includes(q)
    );
  });

  // Group models when not searching
  const groupedModels: { category: string; models: KieModelOption[] }[] = [];
  if (searchQuery.trim() || providerFilter !== 'all') {
    groupedModels.push({ category: 'Results', models: filteredModels });
  } else {
    // Standard grouped view
    const popular = KIE_POPULAR_MODELS.filter(m => FLAGSHIP_POPULAR_IDS.includes(m.id));
    if (popular.length > 0) groupedModels.push({ category: '⭐ Flagship Popular', models: popular });

    const google = KIE_POPULAR_MODELS.filter(m => m.provider === 'Google');
    if (google.length > 0) groupedModels.push({ category: 'Google Gemini', models: google });

    const openai = KIE_POPULAR_MODELS.filter(m => m.provider === 'OpenAI');
    if (openai.length > 0) groupedModels.push({ category: 'OpenAI & Codex', models: openai });

    const anthropic = KIE_POPULAR_MODELS.filter(m => m.provider === 'Anthropic');
    if (anthropic.length > 0) groupedModels.push({ category: 'Anthropic Claude', models: anthropic });

    const xai = KIE_POPULAR_MODELS.filter(m => m.provider === 'xAI');
    if (xai.length > 0) groupedModels.push({ category: 'Grok / xAI', models: xai });

    const deepseek = KIE_POPULAR_MODELS.filter(m => m.provider === 'DeepSeek');
    if (deepseek.length > 0) groupedModels.push({ category: 'DeepSeek Reasoning', models: deepseek });

    const moonshot = KIE_POPULAR_MODELS.filter(m => m.provider === 'Moonshot' || m.provider === 'Other');
    if (moonshot.length > 0) groupedModels.push({ category: 'Moonshot (Kimi)', models: moonshot });
  }

  const handleSelect = (modelId: string) => {
    onSelectModel(modelId);
    setIsOpen(false);
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customModelInput.trim()) {
      onSelectModel(customModelInput.trim());
      setCustomModelInput('');
      setShowCustomInput(false);
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Trigger Button - Matches App UI (AspectRatioDropdown & SubtitleFormatDropdown) */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
          } else {
            handleOpenDropdown();
          }
        }}
        className="bg-black/50 hover:bg-black/70 border border-white/10 hover:border-white/20 rounded-xl px-2.5 sm:px-3 py-1 text-xs text-white cursor-pointer transition-all flex items-center justify-between gap-2 shadow-sm group focus:outline-none focus:border-indigo-500/70"
        title="Select AI Model"
      >
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <div className={`w-2 h-2 rounded-full shrink-0 ${activeColors.dot}`} />
          <span className="font-semibold text-white truncate max-w-[130px] sm:max-w-[180px]">
            {activeModelOption.name}
          </span>
          {activeModelOption.provider && (
            <span className={`hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-mono rounded border shrink-0 ${activeColors.badge}`}>
              {activeModelOption.provider}
            </span>
          )}
        </div>
        <ChevronDown 
          className={`w-3.5 h-3.5 text-white/40 group-hover:text-white transition-transform duration-200 shrink-0 ml-0.5 ${
            isOpen ? 'rotate-180 text-indigo-400' : ''
          }`} 
        />
      </button>

      {/* Floating Menu Popover (Rendered in Portal to escape modal overflow clipping) */}
      {isOpen && coords && createPortal(
        <>
          {/* Backdrop Click Dismiss */}
          <div 
            className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-[1px] animate-in fade-in duration-150" 
            onClick={() => setIsOpen(false)} 
          />

          {/* Dropdown Container */}
          <div
            ref={dropdownRef}
            style={{ 
              top: coords.top, 
              left: coords.left, 
              width: coords.width,
              maxHeight: `calc(100vh - ${coords.top + 16}px)`
            }}
            className="fixed z-[9999] bg-[#151515] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 flex flex-col min-h-[300px]"
          >
            {/* Popover Header */}
            <div className="px-3.5 py-2.5 border-b border-white/5 bg-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <Cpu className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">
                  AI Model Catalog
                </span>
                <span className="text-[9px] font-mono text-white/40 bg-white/5 px-1.5 py-0.5 rounded">
                  {KIE_POPULAR_MODELS.length} models
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                title="Close catalog"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* In-Dropdown Search Input */}
            <div className="p-2 border-b border-white/5 bg-black/40 shrink-0">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search model, provider, or capability..."
                  className="w-full bg-black/60 border border-white/10 focus:border-indigo-500 rounded-xl pl-8 pr-7 py-1.5 text-xs text-white placeholder:text-white/30 outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 p-0.5 text-white/40 hover:text-white rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Provider Quick Filter Tabs */}
              <div className="flex items-center gap-1 mt-1.5 overflow-x-auto custom-scrollbar pb-0.5">
                {(['all', 'popular', 'Google', 'OpenAI', 'Anthropic', 'xAI', 'DeepSeek', 'Moonshot'] as ProviderFilterType[]).map((tab) => {
                  const isActive = providerFilter === tab;
                  const labelMap: Record<ProviderFilterType, string> = {
                    all: 'All',
                    popular: '⭐ Popular',
                    Google: 'Google',
                    OpenAI: 'OpenAI',
                    Anthropic: 'Claude',
                    xAI: 'Grok',
                    DeepSeek: 'DeepSeek',
                    Moonshot: 'Kimi / Moonshot'
                  };
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setProviderFilter(tab)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-medium whitespace-nowrap transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white font-bold shadow-sm'
                          : 'bg-white/5 hover:bg-white/10 text-white/50 hover:text-white'
                      }`}
                    >
                      {labelMap[tab]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Model List View */}
            <div className="flex-1 overflow-y-auto p-2 space-y-3 custom-scrollbar">
              {groupedModels.length === 0 ? (
                <div className="py-8 text-center text-white/40 text-xs">
                  No matching models found for &ldquo;{searchQuery}&rdquo;.
                </div>
              ) : (
                groupedModels.map((group) => (
                  <div key={group.category} className="space-y-1">
                    <div className="px-2 pt-1 pb-0.5 text-[10px] font-bold text-white/40 uppercase tracking-wider flex items-center justify-between">
                      <span>{group.category}</span>
                      <span className="text-[9px] font-mono text-white/30">{group.models.length}</span>
                    </div>

                    <div className="space-y-0.5">
                      {group.models.map((m) => {
                        const isSelected = m.id === model;
                        const colors = PROVIDER_COLORS[m.provider] || PROVIDER_COLORS.Custom;

                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => handleSelect(m.id)}
                            className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all group ${
                              isSelected
                                ? 'bg-indigo-500/15 border border-indigo-500/30 text-indigo-200'
                                : 'bg-transparent hover:bg-white/5 border border-transparent text-white/80 hover:text-white'
                            }`}
                          >
                            <div className="flex items-start gap-2 min-w-0 flex-1 pr-2">
                              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${colors.dot}`} />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className={`text-xs font-semibold ${isSelected ? 'text-indigo-200 font-bold' : 'text-white'}`}>
                                    {m.name}
                                  </span>
                                  <span className={`px-1.5 py-0.2 text-[8px] font-mono rounded border ${colors.badge}`}>
                                    {m.provider}
                                  </span>
                                  {m.badge && (
                                    <span className="px-1.5 py-0.2 text-[8px] rounded bg-white/10 text-white/60">
                                      {m.badge}
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-white/40 line-clamp-1 mt-0.5">
                                  {m.description}
                                </div>
                              </div>
                            </div>

                            <div className="shrink-0 flex items-center">
                              {isSelected ? (
                                <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                              ) : (
                                <div className="w-4 h-4" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Custom Model Slug Creator at Bottom */}
            <div className="p-2 border-t border-white/5 bg-black/60 shrink-0">
              {showCustomInput ? (
                <form onSubmit={handleApplyCustom} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={customModelInput}
                    onChange={(e) => setCustomModelInput(e.target.value)}
                    placeholder="Enter model slug, e.g. gpt-5-6-luna"
                    className="flex-1 bg-black border border-white/15 focus:border-indigo-500 rounded-lg px-2 py-1 text-xs text-white placeholder:text-white/30 outline-none font-mono"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-colors shrink-0"
                  >
                    Set Model
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCustomInput(false)}
                    className="p-1 text-white/40 hover:text-white rounded"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowCustomInput(true)}
                  className="w-full py-1 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors border border-white/5"
                >
                  <Plus className="w-3 h-3 text-indigo-400" />
                  <span>Use custom model identifier slug...</span>
                </button>
              )}
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
};
