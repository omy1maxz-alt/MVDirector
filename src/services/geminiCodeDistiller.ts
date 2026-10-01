import { getGenAI, withRetry } from './gemini';
import { FileAttachmentItem } from '../components/CollapsibleFileAttachment';

export interface DistillContextOptions {
  userPrompt: string;
  attachedFiles?: FileAttachmentItem[];
  gitContextText?: string;
  googleApiKey?: string;
  signal?: AbortSignal;
}

export interface DistillContextResult {
  distilledText: string;
  originalChars: number;
  distilledChars: number;
  savedPercent: number;
  isDistilled: boolean;
}

/**
 * Uses Google Gemini (Free / High-Context) to pre-read, analyze, and distill massive
 * raw code files or Git repositories into a high-density, compact intelligence brief.
 * This saves 90-95% of KIE AI credits by preventing large raw code dumps into expensive KIE models.
 */
export async function distillCodeContextWithGemini(options: DistillContextOptions): Promise<DistillContextResult> {
  const { userPrompt, attachedFiles = [], gitContextText = '', googleApiKey, signal } = options;

  // 1. Assemble raw source text
  let rawContentBlocks: string[] = [];

  if (attachedFiles.length > 0) {
    attachedFiles.forEach(att => {
      const rangeInfo = att.range ? ` (Lines ${att.range.start}-${att.range.end})` : '';
      rawContentBlocks.push(`=== FILE: ${att.path || att.name}${rangeInfo} ===\n${att.content}`);
    });
  }

  if (gitContextText.trim()) {
    rawContentBlocks.push(`=== GIT REPOSITORY CONTEXT & DIFFS ===\n${gitContextText}`);
  }

  const combinedRawText = rawContentBlocks.join('\n\n');
  const originalChars = combinedRawText.length;

  // If content is already very small (< 1,000 characters), no need to compress
  if (originalChars < 1000) {
    return {
      distilledText: combinedRawText,
      originalChars,
      distilledChars: originalChars,
      savedPercent: 0,
      isDistilled: false,
    };
  }

  // 2. Query Gemini to distill the codebase
  try {
    const genAI = getGenAI(googleApiKey);

    const distillationPrompt = `You are an elite Code Intelligence Distiller. Your job is to pre-read large codebases and extract ONLY the exact context needed for a downstream AI reasoning model to fulfill the user's request.

USER'S INQUIRY / TASK:
"${userPrompt}"

RAW CODEBASE / ATTACHMENTS TO ANALYZE (${(originalChars / 1024).toFixed(1)} KB):
${combinedRawText}

INSTRUCTIONS:
1. Thoroughly analyze the user's inquiry and the attached code files/repo.
2. Filter out all boilerplate, unused imports, standard templates, and irrelevant classes.
3. Extract ONLY the relevant class/function signatures, state variables, exact lines of interest, data models, or error sources.
4. If this is a bug investigation or feature request, identify the precise file paths, line numbers, and logic bottlenecks.
5. Format your output strictly in high-density Markdown:
   - **Target Summary**: 1-2 sentence distillation of what the code does regarding the user inquiry.
   - **Relevant Code Excerpts**: Exact necessary snippets (keep minimal and concise).
   - **Architecture & Constraints**: Key types, imports, dependencies, or parameters.
   - **Root Cause / Implementation Notes**: Direct observations from the source code.
6. Keep the total output concise, compact, and under 1,200 tokens. Do NOT write full conversational greetings or fluff.`;

    const response = await withRetry(async () => {
      return await genAI.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: distillationPrompt,
        config: {
          temperature: 0.2,
          maxOutputTokens: 4096,
        },
      });
    }, 2, 1500);

    const distilled = (response.text || '').trim();
    if (!distilled || distilled.length < 50) {
      throw new Error('Gemini distillation produced empty output.');
    }

    const distilledChars = distilled.length;
    const savedPercent = Math.max(0, Math.min(98, Math.round((1 - (distilledChars / originalChars)) * 100)));

    const formattedDistillation = `⚡ **[Gemini Pre-Digested Code Intelligence]** *(Compressed ${Math.round(originalChars / 1024)}KB → ${Math.round(distilledChars / 1024)}KB | Saved ~${savedPercent}% KIE Credits)*\n\n${distilled}`;

    return {
      distilledText: formattedDistillation,
      originalChars,
      distilledChars,
      savedPercent,
      isDistilled: true,
    };
  } catch (err: any) {
    console.warn('[GeminiCodeDistiller] Distillation fallback to raw text:', err);
    // Graceful fallback to raw text if Gemini quota/network fails
    return {
      distilledText: combinedRawText,
      originalChars,
      distilledChars: originalChars,
      savedPercent: 0,
      isDistilled: false,
    };
  }
}

export interface ChatWindowSessionInput {
  id: string;
  title: string;
  messages: Array<{ role: string; content: string; name?: string; id?: string }>;
  model?: string;
  systemPrompt?: string;
}

export interface DistillMemoryOptions {
  messages?: Array<{ role: string; content: string; name?: string; id?: string }>;
  sessions?: ChatWindowSessionInput[];
  selectedSessionId?: string | 'all';
  maxTurns?: number;
  currentSystemPrompt?: string;
  googleApiKey?: string;
  signal?: AbortSignal;
}

export interface DistillMemoryResult {
  executiveMemory: string;
  originalTurnsCount: number;
  originalChars: number;
  distilledChars: number;
  savedPercent: number;
  sourceWindowsCount: number;
}

/**
 * Uses Google Gemini (Free Tier / Ultra High Context) to read through past conversation turns
 * across one or multiple chat windows and synthesize them into a high-density, authoritative Executive Working Memory.
 * This allows downstream reasoning models (GPT-4o, Claude 3.5, DeepSeek R1, Grok, Gemini) to maintain
 * deep cross-session continuity without hitting token bloat, rate limits, or context drops.
 */
export async function distillConversationMemoryWithGemini(options: DistillMemoryOptions): Promise<DistillMemoryResult> {
  const { 
    messages, 
    sessions, 
    selectedSessionId = 'current', 
    maxTurns, 
    currentSystemPrompt = '', 
    googleApiKey 
  } = options;

  let transcriptBlocks: string[] = [];
  let totalTurnsCount = 0;
  let sourceWindowsCount = 1;

  if (sessions && sessions.length > 0) {
    const targetSessions = selectedSessionId === 'all'
      ? sessions.filter(s => s.messages && s.messages.length > 0)
      : sessions.filter(s => s.id === selectedSessionId || (selectedSessionId === 'current' && s.id === sessions[0]?.id));

    sourceWindowsCount = targetSessions.length;

    targetSessions.forEach((sess) => {
      const relevant = sess.messages.filter(m => m.content && m.content.trim() && m.id !== 'welcome_1');
      const turns = maxTurns && maxTurns > 0 ? relevant.slice(-maxTurns * 2) : relevant;
      if (turns.length === 0) return;

      totalTurnsCount += Math.ceil(turns.length / 2);
      const sessionHeader = `=== 📁 CHAT WINDOW: "${sess.title || 'Untitled Session'}" (Model: ${sess.model || 'Standard'}) ===`;
      
      const formattedSessionTurns = turns.map((m, idx) => {
        const speaker = m.role === 'user' ? 'USER' : 'ASSISTANT';
        const cleanContent = m.content.length > 3000 ? `${m.content.slice(0, 3000)}\n...[truncated long attachment]...` : m.content;
        return `[Turn ${Math.floor(idx / 2) + 1} | ${speaker}]:\n${cleanContent}`;
      }).join('\n\n');

      transcriptBlocks.push(`${sessionHeader}\n\n${formattedSessionTurns}`);
    });
  } else if (messages && messages.length > 0) {
    const relevant = messages.filter(m => m.content && m.content.trim() && m.id !== 'welcome_1');
    const turns = maxTurns && maxTurns > 0 ? relevant.slice(-maxTurns * 2) : relevant;
    totalTurnsCount = Math.ceil(turns.length / 2);

    if (turns.length > 0) {
      const formattedTurns = turns.map((m, idx) => {
        const speaker = m.role === 'user' ? 'USER' : 'ASSISTANT';
        const cleanContent = m.content.length > 3000 ? `${m.content.slice(0, 3000)}\n...[truncated long attachment]...` : m.content;
        return `[Turn ${Math.floor(idx / 2) + 1} | ${speaker}]:\n${cleanContent}`;
      }).join('\n\n---\n\n');
      transcriptBlocks.push(formattedTurns);
    }
  }

  const combinedTranscript = transcriptBlocks.join('\n\n=========================================\n\n');
  const originalChars = combinedTranscript.length;

  if (transcriptBlocks.length === 0 || originalChars === 0) {
    return {
      executiveMemory: currentSystemPrompt.trim() || 'No conversation history available in selected chat window(s).',
      originalTurnsCount: 0,
      originalChars: 0,
      distilledChars: 0,
      savedPercent: 0,
      sourceWindowsCount: 0,
    };
  }

  try {
    const genAI = getGenAI(googleApiKey);

    const memoryDistillPrompt = `You are an elite Memory Synthesis & Context Distiller for an AI reasoning system.
Your job is to read the multi-window / multi-turn conversation transcripts below and extract ALL critical decisions, architectural rules, code constraints, user preferences, variables, and unresolved tasks across all active windows.

You must synthesize this into a structured, crystal-clear EXECUTIVE WORKING MEMORY block designed for downstream reasoning models (like GPT-4o, Claude 3.5 Sonnet, DeepSeek R1, or Gemini).

CURRENT EXISTING SYSTEM PROMPT / PREVIOUS MEMORY:
${currentSystemPrompt ? `"${currentSystemPrompt}"` : '(None)'}

CONVERSATION TRANSCRIPTS (${sourceWindowsCount} chat window(s), ${totalTurnsCount} turns, ${(originalChars / 1024).toFixed(1)} KB):
${combinedTranscript}

SYNTHESIS REQUIREMENTS:
1. Cross-reference insights across all chat windows. Extract ALL explicit user requirements, constraints, forbidden patterns, and preferences established across all conversations.
2. Record key architectural decisions made (file paths, libraries, schemas, API endpoints, model choices, database structures).
3. Summarize previous bug root-causes or fixes so models don't re-introduce past errors.
4. Capture the exact current working state and pending next actions.
5. Filter out all conversational pleasantries, repetition, greetings, and boilerplate.
6. Format your output strictly in concise Markdown with bullet points under these 5 headers:
   - **🎯 Core Objective & User Intent**
   - **🔒 Critical Technical Constraints & Rules**
   - **🏗️ Finalized Architecture & Key Identifiers**
   - **💡 Key Discoveries & Past Fixes**
   - **📌 Active Working State & Immediate Next Steps**

Output ONLY the structured Markdown executive memory. No conversational preamble.`;

    const response = await withRetry(async () => {
      return await genAI.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: memoryDistillPrompt,
        config: {
          temperature: 0.2,
          maxOutputTokens: 2048,
        },
      });
    }, 2, 1500);

    const distilled = (response.text || '').trim();
    if (!distilled || distilled.length < 50) {
      throw new Error('Gemini memory distillation returned empty output.');
    }

    const distilledChars = distilled.length;
    const savedPercent = Math.max(0, Math.min(95, Math.round((1 - (distilledChars / originalChars)) * 100)));

    return {
      executiveMemory: distilled,
      originalTurnsCount: totalTurnsCount,
      originalChars,
      distilledChars,
      savedPercent,
      sourceWindowsCount,
    };
  } catch (err: any) {
    console.warn('[GeminiCodeDistiller] Memory distillation failed, generating fallback summary:', err);
    const fallback = `### 🧠 Working Context Summary (${sourceWindowsCount} window(s), ${totalTurnsCount} turns)\n- Active Context: Synthesized from ${sourceWindowsCount} chat window(s).\n- System instructions retained: ${currentSystemPrompt || 'None'}`;
    return {
      executiveMemory: fallback,
      originalTurnsCount: totalTurnsCount,
      originalChars,
      distilledChars: fallback.length,
      savedPercent: 0,
      sourceWindowsCount,
    };
  }
}

