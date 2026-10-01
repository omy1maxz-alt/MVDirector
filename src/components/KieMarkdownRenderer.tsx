import React, { useState, createContext, useContext, useMemo, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { 
  Check, 
  Copy, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Code2 
} from 'lucide-react';
import { ChatFontSize, CHAT_FONT_CONFIGS } from '@/utils/chatFont';

// Stable plugins array to prevent ReactMarkdown from re-initializing plugins on every render
const STATIC_REMARK_PLUGINS = [remarkGfm, remarkBreaks];

// Context to unambiguously distinguish between fenced block code (<pre><code>) and inline code (<code>)
const InPreContext = createContext<boolean>(false);

// Helper to safely extract raw string from React children (handles strings, numbers, arrays, and React nodes)
const extractText = (node: React.ReactNode): string => {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (!node) return '';
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (typeof node === 'object' && node !== null && 'props' in node) {
    const props = (node as { props?: { children?: React.ReactNode } }).props;
    if (props && props.children) {
      return extractText(props.children);
    }
  }
  return '';
};

interface KieCodeBlockProps {
  className?: string;
  children?: React.ReactNode;
  fontSize?: ChatFontSize;
}

const KieCodeBlock = memo<KieCodeBlockProps>(({
  className,
  children,
  fontSize = '14px',
}) => {
  const [copied, setCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const match = /language-([a-zA-Z0-9_-]+)/.exec(className || '');
  const language = match ? match[1] : '';

  const rawCode = extractText(children).replace(/\n$/, '');
  const lineCount = rawCode ? rawCode.split('\n').length : 0;
  const isLong = lineCount > 10;
  const fontCfg = CHAT_FONT_CONFIGS[fontSize] || CHAT_FONT_CONFIGS['14px'];

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(rawCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="relative my-3 rounded-xl overflow-hidden border border-white/15 bg-[#0d0d11] shadow-2xl group/code text-left">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#17171d] border-b border-white/10 text-[11px] text-white/50 select-none">
        <div className="flex items-center gap-2">
          <Code2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
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
              type="button"
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
            type="button"
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[10px]">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className={`p-3.5 overflow-x-auto custom-scrollbar font-mono text-slate-100 bg-[#0d0d11] transition-all relative ${fontCfg.codeTextClass} ${
        isCollapsed ? 'max-h-36 overflow-hidden select-none' : ''
      }`}>
        <pre className="!m-0 !p-0 !bg-transparent !border-0 text-left">
          <code className={className}>
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

KieCodeBlock.displayName = 'KieCodeBlock';

export interface KieMarkdownRendererProps {
  content: string;
  fontSize?: ChatFontSize;
  isUser?: boolean;
  className?: string;
}

export const KieMarkdownRenderer = memo<KieMarkdownRendererProps>(({
  content,
  fontSize = '14px',
  isUser = false,
  className = '',
}) => {
  const fontCfg = CHAT_FONT_CONFIGS[fontSize] || CHAT_FONT_CONFIGS['14px'];

  const components = useMemo(() => ({
    // Headings (H1 - H6) with clear visual hierarchy and proportional scaling
    h1: ({ children, ...props }: any) => (
      <h1 
        className={`text-[1.45em] font-black text-white mt-4 mb-2 pb-1.5 border-b tracking-tight first:mt-0 ${
          isUser ? 'border-white/20' : 'border-white/10'
        }`} 
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: any) => (
      <h2 
        className={`text-[1.28em] font-extrabold text-white mt-3.5 mb-1.5 pb-1 border-b tracking-tight first:mt-0 ${
          isUser ? 'border-white/20' : 'border-white/10'
        }`} 
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: any) => (
      <h3 
        className={`text-[1.14em] font-bold mt-3 mb-1 tracking-tight first:mt-0 ${
          isUser ? 'text-indigo-100 font-extrabold' : 'text-indigo-300'
        }`} 
        {...props}
      >
        {children}
      </h3>
    ),
    h4: ({ children, ...props }: any) => (
      <h4 className="text-[1.04em] font-semibold text-white/95 mt-2.5 mb-1 tracking-tight first:mt-0" {...props}>
        {children}
      </h4>
    ),
    h5: ({ children, ...props }: any) => (
      <h5 className="text-[0.96em] font-semibold text-white/80 uppercase tracking-wider mt-2 mb-0.5 first:mt-0" {...props}>
        {children}
      </h5>
    ),
    h6: ({ children, ...props }: any) => (
      <h6 className="text-[0.9em] font-medium text-white/65 uppercase tracking-widest mt-1.5 mb-0.5 first:mt-0" {...props}>
        {children}
      </h6>
    ),

    // Paragraphs and text formatting
    p: ({ children, ...props }: any) => (
      <p className="my-2 leading-relaxed text-inherit break-words first:mt-0 last:mb-0" {...props}>
        {children}
      </p>
    ),
    strong: ({ children, ...props }: any) => (
      <strong className="font-bold text-white tracking-wide" {...props}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }: any) => (
      <em className="italic text-inherit/90" {...props}>
        {children}
      </em>
    ),
    del: ({ children, ...props }: any) => (
      <del className="line-through opacity-50 decoration-inherit" {...props}>
        {children}
      </del>
    ),

    // Fenced Code Blocks & Inline Code
    pre: ({ children }: any) => (
      <InPreContext.Provider value={true}>
        {children}
      </InPreContext.Provider>
    ),
    code: ({ className: codeClassName, children, ...props }: any) => {
      const isInPre = useContext(InPreContext);
      if (isInPre) {
        return (
          <KieCodeBlock className={codeClassName} fontSize={fontSize}>
            {children}
          </KieCodeBlock>
        );
      }
      return (
        <code 
          className={`px-1.5 py-0.5 mx-0.5 rounded-md font-mono border text-[0.88em] select-all align-baseline break-all ${
            isUser 
              ? 'bg-white/20 text-white border-white/25' 
              : 'bg-white/10 text-indigo-200 border-white/15'
          } ${fontCfg.inlineCodeClass}`} 
          {...props}
        >
          {children}
        </code>
      );
    },

    // Blockquotes with modern callout styling
    blockquote: ({ children, ...props }: any) => (
      <blockquote 
        className={`my-2.5 pl-3.5 py-1.5 border-l-4 rounded-r-xl italic shadow-sm text-inherit/85 ${
          isUser 
            ? 'border-white/40 bg-white/10' 
            : 'border-indigo-500 bg-indigo-950/25'
        } ${fontCfg.chatTextClass}`} 
        {...props}
      >
        {children}
      </blockquote>
    ),

    // Links with security attributes & icon
    a: ({ href, children, ...props }: any) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="inline-flex items-center gap-0.5 underline underline-offset-2 transition-colors font-medium break-all text-indigo-400 hover:text-indigo-300" 
        {...props}
      >
        <span>{children}</span>
        <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
      </a>
    ),

    // Lists (Ordered, Unordered, Nested)
    ul: ({ children, ...props }: any) => (
      <ul className="my-2 pl-5 list-disc space-y-1 text-inherit marker:text-indigo-400" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: any) => (
      <ol className="my-2 pl-5 list-decimal space-y-1 text-inherit marker:text-indigo-400 marker:font-semibold" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }: any) => (
      <li className="leading-relaxed pl-1" {...props}>
        {children}
      </li>
    ),

    // Horizontal Rules
    hr: (props: any) => (
      <hr className="my-3.5 border-0 border-t border-white/15" {...props} />
    ),

    // Tables (GFM)
    table: ({ children, ...props }: any) => (
      <div className="my-3.5 overflow-x-auto custom-scrollbar rounded-xl border border-white/15 bg-black/40 shadow-lg max-w-full">
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

    // GFM task list items
    input: ({ type, checked, ...props }: any) => {
      if (type === 'checkbox') {
        return (
          <input 
            type="checkbox" 
            checked={checked} 
            readOnly 
            className="mr-2 rounded accent-indigo-500 pointer-events-none align-middle" 
            {...props} 
          />
        );
      }
      return <input type={type} {...props} />;
    },
  }), [fontCfg, isUser, fontSize]);

  return (
    <div className={`kie-markdown-content break-words max-w-full text-left leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={STATIC_REMARK_PLUGINS}
        components={components}
      >
        {content || ''}
      </ReactMarkdown>
    </div>
  );
});

KieMarkdownRenderer.displayName = 'KieMarkdownRenderer';
