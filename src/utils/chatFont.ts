export type ChatFontSize = 
  | '4px' 
  | '6px' 
  | '8px' 
  | '10px' 
  | '12px' 
  | '14px' 
  | '15px' 
  | '16px' 
  | '18px' 
  | '20px' 
  | '24px';

export interface ChatFontConfig {
  id: ChatFontSize;
  label: string;
  shortLabel: string;
  sizePx: string;
  chatTextClass: string;
  proseClass: string;
  inputTextClass: string;
  codeTextClass: string;
  inlineCodeClass: string;
}

export const CHAT_FONT_SIZE_ORDER: ChatFontSize[] = [
  '4px',
  '6px',
  '8px',
  '10px',
  '12px',
  '14px',
  '15px',
  '16px',
  '18px',
  '20px',
  '24px',
];

export const CHAT_FONT_CONFIGS: Record<ChatFontSize, ChatFontConfig> = {
  '4px': {
    id: '4px',
    label: 'Micro (4px)',
    shortLabel: '4px',
    sizePx: '4px',
    chatTextClass: 'text-[4px] leading-tight',
    proseClass: 'text-[4px] leading-tight',
    inputTextClass: 'text-[4px]',
    codeTextClass: 'text-[4px] leading-tight',
    inlineCodeClass: 'text-[4px] px-0.5 py-0',
  },
  '6px': {
    id: '6px',
    label: 'Tiny (6px)',
    shortLabel: '6px',
    sizePx: '6px',
    chatTextClass: 'text-[6px] leading-tight',
    proseClass: 'text-[6px] leading-tight',
    inputTextClass: 'text-[6px]',
    codeTextClass: 'text-[5px] leading-tight',
    inlineCodeClass: 'text-[5px] px-0.5 py-0',
  },
  '8px': {
    id: '8px',
    label: 'Mini (8px)',
    shortLabel: '8px',
    sizePx: '8px',
    chatTextClass: 'text-[8px] leading-snug',
    proseClass: 'text-[8px] leading-snug',
    inputTextClass: 'text-[8px]',
    codeTextClass: 'text-[7px] leading-snug',
    inlineCodeClass: 'text-[7px] px-0.5 py-0',
  },
  '10px': {
    id: '10px',
    label: 'Ultra Compact (10px)',
    shortLabel: '10px',
    sizePx: '10px',
    chatTextClass: 'text-[10px] leading-snug',
    proseClass: 'text-[10px] leading-snug',
    inputTextClass: 'text-[10px]',
    codeTextClass: 'text-[9px] leading-snug',
    inlineCodeClass: 'text-[9px] px-1 py-0.2',
  },
  '12px': {
    id: '12px',
    label: 'Compact (12px)',
    shortLabel: '12px',
    sizePx: '12px',
    chatTextClass: 'text-xs leading-relaxed',
    proseClass: 'text-xs leading-relaxed',
    inputTextClass: 'text-xs',
    codeTextClass: 'text-[11px] leading-relaxed',
    inlineCodeClass: 'text-[10px] px-1 py-0.2',
  },
  '14px': {
    id: '14px',
    label: 'Standard (14px)',
    shortLabel: '14px',
    sizePx: '14px',
    chatTextClass: 'text-sm leading-relaxed',
    proseClass: 'prose-sm text-sm leading-relaxed',
    inputTextClass: 'text-sm',
    codeTextClass: 'text-xs sm:text-[13px] leading-relaxed',
    inlineCodeClass: 'text-[11px] sm:text-xs px-1.5 py-0.5',
  },
  '15px': {
    id: '15px',
    label: 'Medium (15px)',
    shortLabel: '15px',
    sizePx: '15px',
    chatTextClass: 'text-[15px] leading-relaxed',
    proseClass: 'text-[15px] leading-relaxed',
    inputTextClass: 'text-[15px]',
    codeTextClass: 'text-[13px] sm:text-sm leading-relaxed',
    inlineCodeClass: 'text-xs sm:text-[13px] px-1.5 py-0.5',
  },
  '16px': {
    id: '16px',
    label: 'Large (16px)',
    shortLabel: '16px',
    sizePx: '16px',
    chatTextClass: 'text-base leading-relaxed',
    proseClass: 'prose-base text-base leading-relaxed',
    inputTextClass: 'text-base',
    codeTextClass: 'text-sm sm:text-[15px] leading-relaxed',
    inlineCodeClass: 'text-sm px-1.5 py-0.5',
  },
  '18px': {
    id: '18px',
    label: 'Extra Large (18px)',
    shortLabel: '18px',
    sizePx: '18px',
    chatTextClass: 'text-lg leading-relaxed',
    proseClass: 'prose-lg text-lg leading-relaxed',
    inputTextClass: 'text-lg',
    codeTextClass: 'text-[15px] sm:text-base leading-relaxed',
    inlineCodeClass: 'text-base px-2 py-0.5',
  },
  '20px': {
    id: '20px',
    label: 'Huge (20px)',
    shortLabel: '20px',
    sizePx: '20px',
    chatTextClass: 'text-xl leading-relaxed',
    proseClass: 'prose-xl text-xl leading-relaxed',
    inputTextClass: 'text-xl',
    codeTextClass: 'text-base sm:text-lg leading-relaxed',
    inlineCodeClass: 'text-lg px-2 py-0.5',
  },
  '24px': {
    id: '24px',
    label: 'Display (24px)',
    shortLabel: '24px',
    sizePx: '24px',
    chatTextClass: 'text-2xl leading-relaxed',
    proseClass: 'prose-2xl text-2xl leading-relaxed',
    inputTextClass: 'text-2xl',
    codeTextClass: 'text-lg sm:text-xl leading-relaxed',
    inlineCodeClass: 'text-xl px-2 py-0.5',
  },
};

export function normalizeChatFontSize(saved: string | null | undefined): ChatFontSize {
  if (!saved) return '14px';
  // Legacy aliases
  if (saved === 'xs') return '12px';
  if (saved === 'sm') return '14px';
  if (saved === 'md') return '15px';
  if (saved === 'lg') return '16px';
  if (saved === 'xl') return '18px';
  if (saved in CHAT_FONT_CONFIGS) {
    return saved as ChatFontSize;
  }
  return '14px';
}

export function getNextFontSize(current: ChatFontSize): ChatFontSize {
  const currentIndex = CHAT_FONT_SIZE_ORDER.indexOf(current);
  if (currentIndex >= 0 && currentIndex < CHAT_FONT_SIZE_ORDER.length - 1) {
    return CHAT_FONT_SIZE_ORDER[currentIndex + 1];
  }
  return current;
}

export function getPrevFontSize(current: ChatFontSize): ChatFontSize {
  const currentIndex = CHAT_FONT_SIZE_ORDER.indexOf(current);
  if (currentIndex > 0) {
    return CHAT_FONT_SIZE_ORDER[currentIndex - 1];
  }
  return current;
}
