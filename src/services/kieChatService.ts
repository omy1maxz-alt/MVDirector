

import { logKieApiCall, generateCurlCommand, sanitizeAuthHeader } from './kieLogService';

export interface KieChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface KieChatCompletionOptions {
  model: string;
  messages: KieChatMessage[];
  apiKey: string;
  baseUrl?: string;
  temperature?: number;
  maxTokens?: number;
  reasoningEffort?: 'low' | 'medium' | 'high' | 'xhigh';
  enableThinking?: boolean;
  thinkingBudgetTokens?: number;
  enableWebSearch?: boolean;
  responseFormat?: 'json_object';
  signal?: AbortSignal;
}

export type KieEndpointType = 'openai' | 'claude' | 'codex' | 'grok' | 'responses';

export interface KieModelOption {
  id: string;
  name: string;
  provider: 'OpenAI' | 'Anthropic' | 'Google' | 'DeepSeek' | 'Meta' | 'xAI' | 'Moonshot' | 'Other' | 'Custom';
  badge?: string;
  description: string;
  endpointType?: KieEndpointType;
  path?: string;
  supportsThinking?: boolean;
  supportsReasoningEffort?: boolean;
  supportsWebSearch?: boolean;
  maxOutputTokens?: number;
}

export const KIE_POPULAR_MODELS: KieModelOption[] = [
  // --- GOOGLE GEMINI (Official Kie.ai Market) ---
  { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash', provider: 'Google', badge: 'Advanced Coding & Agents', description: 'Gemini 3.8 Flash API for Advanced Coding and AI Agents on Kie.ai.', endpointType: 'openai', path: '/gemini-3-8-flash-openai/v1/chat/completions', supportsWebSearch: true, maxOutputTokens: 65536 },
  { id: 'gemini-3.7-flash', name: 'Gemini 3.7 Flash', provider: 'Google', badge: 'Fast Reasoning', description: 'Gemini 3.7 Flash hybrid reasoning for rapid tool execution and coding.', endpointType: 'openai', path: '/gemini-3-7-flash-openai/v1/chat/completions', supportsWebSearch: true, maxOutputTokens: 65536 },
  { id: 'gemini-3.6-flash', name: 'Gemini 3.6 Flash', provider: 'Google', badge: 'High Throughput', description: 'Gemini 3.6 Flash API for fast responses and multimodal processing.', endpointType: 'openai', path: '/gemini-3-6-flash-openai/v1/chat/completions', supportsWebSearch: true, maxOutputTokens: 65536 },
  { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash', provider: 'Google', badge: 'Multimodal Speed', description: 'Gemini 3.5 Flash for balanced efficiency and long-context understanding with Google Search grounding.', endpointType: 'openai', path: '/gemini-3-5-flash-openai/v1/chat/completions', supportsWebSearch: true, maxOutputTokens: 65536 },
  { id: 'gemini-3.1-pro', name: 'Gemini 3.1 Pro', provider: 'Google', badge: 'Advanced Cognitive', description: 'Gemini 3.1 Pro for deep analysis and complex context understanding.', endpointType: 'openai', path: '/gemini-3.1-pro/v1/chat/completions', supportsWebSearch: true, maxOutputTokens: 65536 },
  { id: 'gemini-3-pro', name: 'Gemini 3 Pro', provider: 'Google', badge: 'Deep Reasoning', description: 'Gemini 3 Pro for comprehensive research and long-horizon problem solving.', endpointType: 'openai', path: '/gemini-3-pro/v1/chat/completions', supportsWebSearch: true, maxOutputTokens: 65536 },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'Google', badge: 'Massive Context', description: 'Gemini 2.5 Pro with large context window for full codebase synthesis.', endpointType: 'openai', path: '/gemini-2.5-pro/v1/chat/completions', supportsWebSearch: true, maxOutputTokens: 65536 },

  // --- OPENAI & CODEX (Official Kie.ai Market) ---
  { id: 'gpt-6-astra', name: 'GPT-6 Astra', provider: 'OpenAI', badge: 'Frontier Flagship', description: 'Next-generation frontier reasoning and autonomous execution via Kie.ai Codex.', endpointType: 'codex', path: '/codex/v1/responses', supportsReasoningEffort: true, supportsWebSearch: true, maxOutputTokens: 32768 },
  { id: 'gpt-5-6-sol', name: 'GPT 5.6 Sol', provider: 'OpenAI', badge: 'Frontier Flagship', description: 'Flagship tier for complex work, advanced reasoning, coding, tool use, and long-horizon tasks.', endpointType: 'codex', path: '/codex/v1/responses', supportsReasoningEffort: true, supportsWebSearch: true, maxOutputTokens: 32768 },
  { id: 'gpt-5-6-terra', name: 'GPT 5.6 Terra', provider: 'OpenAI', badge: 'Balanced Scale', description: 'Balanced everyday performance combining high intelligence with cost efficiency.', endpointType: 'codex', path: '/codex/v1/responses', supportsReasoningEffort: true, maxOutputTokens: 16384 },
  { id: 'gpt-5-6-luna', name: 'GPT 5.6 Luna', provider: 'OpenAI', badge: 'Fast & Affordable', description: 'Fastest and most affordable tier in the GPT-5.6 family for high-throughput applications.', endpointType: 'codex', path: '/codex/v1/responses', supportsReasoningEffort: true, maxOutputTokens: 16384 },
  { id: 'gpt-5-5', name: 'GPT-5.5', provider: 'OpenAI', badge: 'High Intelligence', description: 'GPT-5.5 API for deep problem solving, creative composition, and web workflows.', endpointType: 'codex', path: '/codex/v1/responses', supportsReasoningEffort: true, supportsWebSearch: true, maxOutputTokens: 32768 },
  { id: 'gpt-5-4', name: 'GPT-5.4', provider: 'OpenAI', badge: 'Multimodal Reasoning', description: 'GPT-5.4 API for structured outputs, coding execution, and tool use.', endpointType: 'codex', path: '/codex/v1/responses', supportsReasoningEffort: true, supportsWebSearch: true, maxOutputTokens: 32768 },
  { id: 'gpt-5-2', name: 'GPT-5.2', provider: 'OpenAI', badge: 'Multimodal', description: 'GPT-5.2 flagship model for multi-turn conversational intelligence, web search grounding, and adjustable reasoning effort.', endpointType: 'openai', path: '/gpt-5-2/v1/chat/completions', supportsWebSearch: true, supportsReasoningEffort: true, maxOutputTokens: 32768 },
  { id: 'codex', name: 'OpenAI Codex', provider: 'OpenAI', badge: 'Codex Execution', description: 'OpenAI Codex API on Kie.ai for code synthesis and agentic commands.', endpointType: 'codex', path: '/codex/v1/responses', supportsReasoningEffort: true, maxOutputTokens: 32768 },

  // --- ANTHROPIC CLAUDE (Official Kie.ai Market) ---
  { id: 'claude-opus-5', name: 'Claude Opus 5', provider: 'Anthropic', badge: 'Deep Thought', description: 'Claude Opus 5 for complex literary prose, cinematic direction, and deep logic.', endpointType: 'claude', path: '/claude/v1/messages', supportsThinking: true, maxOutputTokens: 64000 },
  { id: 'claude-opus-4-8', name: 'Claude Opus 4.8', provider: 'Anthropic', badge: 'Advanced Cognitive', description: 'Claude Opus 4.8 for nuanced multi-domain reasoning and long documents.', endpointType: 'claude', path: '/claude/v1/messages', supportsThinking: true, maxOutputTokens: 32768 },
  { id: 'claude-opus-4-7', name: 'Claude Opus 4.7', provider: 'Anthropic', badge: 'Market Featured', description: 'Claude Opus 4.7 API for deep analytical synthesis and writing.', endpointType: 'claude', path: '/claude/v1/messages', supportsThinking: true, maxOutputTokens: 32768 },
  { id: 'claude-opus-4-6', name: 'Claude Opus 4.6', provider: 'Anthropic', badge: 'Deep Context', description: 'Claude Opus 4.6 for thoughtful reasoning and assistant-style dialogue.', endpointType: 'claude', path: '/claude/v1/messages', supportsThinking: true, maxOutputTokens: 32768 },
  { id: 'claude-opus-4-5', name: 'Claude Opus 4.5', provider: 'Anthropic', badge: 'High Nuance', description: 'Claude Opus 4.5 on Kie.ai.', endpointType: 'claude', path: '/claude/v1/messages', supportsThinking: true, maxOutputTokens: 32768 },
  { id: 'claude-sonnet-5', name: 'Claude Sonnet 5', provider: 'Anthropic', badge: 'Next-Gen Flagship', description: 'Claude Sonnet 5 with superior reasoning, prose nuance, and high coding accuracy.', endpointType: 'claude', path: '/claude/v1/messages', supportsThinking: true, maxOutputTokens: 64000 },
  { id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6', provider: 'Anthropic', badge: 'Market Featured', description: 'Claude Sonnet 4.6 for clear writing, document analysis, and coding.', endpointType: 'claude', path: '/claude/v1/messages', supportsThinking: true, maxOutputTokens: 64000 },
  { id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5', provider: 'Anthropic', badge: '64k Output Tokens', description: 'Claude Sonnet 4.5 with up to 64k output tokens and extended thinking mode.', endpointType: 'claude', path: '/claude/v1/messages', supportsThinking: true, maxOutputTokens: 64000 },
  { id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5', provider: 'Anthropic', badge: 'Ultra Fast', description: 'Claude Haiku 4.5 for high speed, responsive chat, and quick parsing.', endpointType: 'claude', path: '/claude/v1/messages', maxOutputTokens: 8192 },
  { id: 'claude-fable-5', name: 'Claude Fable 5', provider: 'Anthropic', badge: 'Creative & Code', description: 'Claude Fable 5 API for creative storytelling, screenplay pacing, and scripting.', endpointType: 'claude', path: '/claude/v1/messages', supportsThinking: true, maxOutputTokens: 32768 },

  // --- GROK / XAI (Official Kie.ai Market) ---
  { id: 'grok-4-7', name: 'Grok 4.7', provider: 'xAI', badge: '500K Context • SWE 71%', description: 'Frontier reasoning model from SpaceXAI with 500K context, 4-tier reasoning effort (low/medium/high/xhigh), and 71.0% DeepSWE benchmark.', endpointType: 'grok', path: '/grok/v1/responses', supportsReasoningEffort: true, supportsWebSearch: true, maxOutputTokens: 16384 },
  { id: 'grok-4-6', name: 'Grok 4.6', provider: 'xAI', badge: 'Fast Reasoning', description: 'Grok 4.6 API optimized for coding intelligence and interactive AI.', endpointType: 'grok', path: '/grok/v1/responses', supportsWebSearch: true, maxOutputTokens: 16384 },
  { id: 'grok-4-5', name: 'Grok 4.5', provider: 'xAI', badge: 'Coding & Logic', description: 'Grok 4.5 API on Kie.ai for code and logic reasoning.', endpointType: 'grok', path: '/grok/v1/responses', supportsWebSearch: true, maxOutputTokens: 16384 },
  { id: 'grok-4-3', name: 'Grok 4.3', provider: 'xAI', badge: 'Speed & Chat', description: 'Grok 4.3 for fast conversational interactions.', endpointType: 'grok', path: '/grok/v1/responses', maxOutputTokens: 16384 },

  // --- DEEPSEEK & MOONSHOT (Official Kie.ai Market) ---
  { id: 'deepseek-v4-1-flash', name: 'DeepSeek V4.1 Flash', provider: 'DeepSeek', badge: 'Fast Open Reasoning', description: 'DeepSeek V4.1 Flash API with deep thinking, structured input arrays, and function calling.', endpointType: 'responses', path: '/openai/v1/responses', supportsReasoningEffort: true, maxOutputTokens: 16384 },
  { id: 'deepseek-r1', name: 'DeepSeek R1', provider: 'DeepSeek', badge: 'Reasoning Engine', description: 'DeepSeek R1 flagship reasoning model for math, coding, and logical deductions.', endpointType: 'responses', path: '/openai/v1/responses', supportsReasoningEffort: true, maxOutputTokens: 16384 },
  { id: 'deepseek-v3', name: 'DeepSeek V3', provider: 'DeepSeek', badge: '671B MoE', description: 'DeepSeek V3 general intelligence model with high speed and extensive capabilities.', endpointType: 'responses', path: '/openai/v1/responses', maxOutputTokens: 16384 },
  { id: 'kimi-k3', name: 'Kimi K3', provider: 'Moonshot', badge: '1M Context', description: 'Kimi K3 API with massive 1M context window for long documents.', endpointType: 'responses', path: '/openai/v1/responses', supportsReasoningEffort: true, maxOutputTokens: 32768 },
];

export interface SystemPersona {
  id: string;
  name: string;
  iconName: string;
  prompt: string;
  description: string;
}

export const SYSTEM_PERSONAS: SystemPersona[] = [
  {
    id: 'general',
    name: 'General Assistant',
    iconName: 'Bot',
    description: 'Helpful, concise, and direct assistant without AI slop.',
    prompt: `You are a helpful, brilliant, concise AI assistant. You answer questions directly without fluff, pleasantries, or patronizing disclaimers. Prioritize clear reasoning, practical utility, and clean markdown.`
  },
  {
    id: 'director',
    name: 'Film Director & Screenwriter',
    iconName: 'Clapperboard',
    description: 'Cinematic visual beats, camera direction, lighting, and storyboards.',
    prompt: `You are an award-winning cinematic director and screenplay consultant. When asked about scenes, storyboards, or visual ideas:
- Focus on camera framing (e.g. Dutch tilt, tracking shot, extreme close-up, low-angle hero shot).
- Specify lighting mood (volumetric haze, golden hour rim light, neon chiaroscuro, desaturated noir).
- Direct pacing and actor micro-expressions rather than generic descriptions.
- Format responses cleanly with bold section headers.`
  },
  {
    id: 'four-heads',
    name: 'Four Heads Decision Architect',
    iconName: 'Brain',
    description: 'Memory → Creativity → Critic → Decision structured thinking.',
    prompt: `You are governed by four specialized cognitive heads:
1. MEMORY: What constraints and past lessons apply here?
2. CREATIVITY: What are 2-3 innovative, viable alternative approaches?
3. CRITIC: Where can this fail? What are the hidden costs, bugs, or risks?
4. HEAD: Synthesize the final decision (Real Problem, What We Know, Options, Risks, Decision, Why, Next Action).
Structure your response by addressing these four perspectives clearly.`
  },
  {
    id: 'code-architect',
    name: 'Senior Fullstack Architect',
    iconName: 'Code',
    description: 'Expert TypeScript, React, Vite, CSS, and API systems.',
    prompt: `You are an elite Senior TypeScript and React software architect.
- Provide clean, modern, fully functional code without placeholder omissions.
- Explain edge-cases, memory leaks, re-render risks, and type safety constraints.
- Prefer simplicity, high performance, and standards-compliant web APIs.`
  },
  {
    id: 'lyricist',
    name: 'Lyricist & Subtitle Translator',
    iconName: 'Music',
    description: 'Poetic cadence, slang, cultural idioms, and bilingual timing.',
    prompt: `You are an expert bilingual lyricist and subtitle adaptor.
- Preserve the emotional subtext, rhythm, rhyme, and cultural slang of lyrics.
- Never translate literally when doing so loses the musical feeling.
- When given subtitle lines, keep them concise and easy to read within standard screen time limits.`
  },
  {
    id: 'jules-architect',
    name: 'AndroidIDE & Jules Lead Architect',
    iconName: 'Smartphone',
    description: 'Specialized for Jules (remote dev) -> GitHub -> AndroidIDE (Poco F5) workflow.',
    prompt: `You are the Lead Android Systems Architect for the user's mobile app.

WORKFLOW ARCHITECTURE:
1. Jules is the remote developer who implements and pushes changes to GitHub.
2. GitHub is the single authoritative source of truth.
3. The user pulls code from GitHub directly into their local AndroidIDE environment on their Xiaomi Poco F5.
4. AndroidIDE builds and tests the APK locally on physical hardware.
5. The user reports runtime symptoms, build errors, or media detection bugs to you.

INVESTIGATION DISCIPLINE:
- Always base conclusions on verified repository code from GitHub.
- Explicitly categorize findings as:
  * [CONFIRMED]: Verified directly in the authoritative GitHub source code.
  * [LIKELY]: Strongly supported by evidence but requiring device verification.
  * [HYPOTHESIS]: A potential cause that has not yet been verified.
- When generating fixes, output a structured, unambiguous "Jules-Ready Task" containing: Target Files & Functions, Verified Root Cause, Constraints (things Jules must NOT break), and AndroidIDE Validation Steps.`
  }
];

function extractKieApiResponse(data: any): string {
  if (!data) return '';
  if (typeof data === 'string') {
    return data.replace(/<think>[\s\S]*?<\/think>/gi, '').replace(/<thought>[\s\S]*?<\/thought>/gi, '').trim();
  }

  // Check for error responses returned by upstream
  if (data.error) {
    const errMsg = typeof data.error === 'string' ? data.error : (data.error.message || JSON.stringify(data.error));
    throw new Error(`[KIE AI Error]: ${errMsg}`);
  }
  if (data.detail) {
    const detailMsg = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
    throw new Error(`[KIE AI Error]: ${detailMsg}`);
  }
  if (data.msg && data.msg !== 'success' && !data.data && !data.output && !data.choices) {
    if (data.msg.toLowerCase().includes('server exception')) {
      throw new Error(`[KIE AI Status]: Server exception, please try again later. (The upstream provider for this model is temporarily overloaded or undergoing maintenance on Kie.ai. You can retry in a moment or switch to GPT-5.5, GPT 5.6 Sol, Gemini 3.8 Flash, or Claude Sonnet 5).`);
    }
    throw new Error(`[KIE AI Status]: ${data.msg}`);
  }
  if (data.status === 'error' && data.message) {
    throw new Error(`[KIE AI Error]: ${data.message}`);
  }

  // 1. OpenAPI Responses format (OpenAI Responses / Codex / Grok / DeepSeek / Kimi)
  if (Array.isArray(data.output)) {
    const textPieces: string[] = [];
    for (const item of data.output) {
      if (typeof item === 'string') {
        textPieces.push(item);
        continue;
      }
      if (item.type === 'message' || item.role === 'assistant' || !item.type) {
        if (Array.isArray(item.content)) {
          for (const c of item.content) {
            if (c.type === 'output_text' && typeof c.text === 'string') {
              textPieces.push(c.text);
            } else if (typeof c.text === 'string') {
              textPieces.push(c.text);
            } else if (typeof c === 'string') {
              textPieces.push(c);
            }
          }
        } else if (typeof item.content === 'string') {
          textPieces.push(item.content);
        } else if (typeof item.text === 'string') {
          textPieces.push(item.text);
        }
      } else if (item.type === 'output_text' && typeof item.text === 'string') {
        textPieces.push(item.text);
      }
    }
    if (textPieces.length > 0) {
      const fullText = textPieces.join('\n');
      return fullText.replace(/<think>[\s\S]*?<\/think>/gi, '').replace(/<thought>[\s\S]*?<\/thought>/gi, '').trim();
    }
  }

  // 2. Standard OpenAI chat completion choices
  if (data.choices?.[0]) {
    const choice = data.choices[0];
    const text = choice.message?.content || choice.text || '';
    if (text) {
      return text.replace(/<think>[\s\S]*?<\/think>/gi, '').replace(/<thought>[\s\S]*?<\/thought>/gi, '').trim();
    }
  }

  // 3. Anthropic Claude content array
  if (Array.isArray(data.content)) {
    const textParts = data.content
      .filter((c: any) => c.type === 'text' || typeof c.text === 'string')
      .map((c: any) => c.text);
    if (textParts.length > 0) {
      const fullText = textParts.join('\n');
      return fullText.replace(/<think>[\s\S]*?<\/think>/gi, '').replace(/<thought>[\s\S]*?<\/thought>/gi, '').trim();
    }
  }

  // 4. Fallback direct text fields
  if (typeof data.text === 'string') return data.text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  if (typeof data.content === 'string') return data.content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  if (typeof data.response === 'string') return data.response.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  if (typeof data.result === 'string') return data.result.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  // If empty array, throw error
  if (Array.isArray(data) && data.length === 0) {
    throw new Error('KIE model returned an empty response. Please verify your prompt or try another KIE model.');
  }

  return JSON.stringify(data);
}

export function normalizeKieModelId(rawModel: string): string {
  if (!rawModel) return 'gemini-3.5-flash';
  const trimmed = rawModel.trim().toLowerCase();
  if (trimmed === 'deepseek-4.1' || trimmed === 'deepseek-4-1' || trimmed === 'deepseek-v4.1' || trimmed === 'deepseek-v4-1' || trimmed === 'deepseek-41') {
    return 'deepseek-v4-1-flash';
  }
  if (trimmed === 'deepseek-reasoner' || trimmed === 'deepseek-r-1') {
    return 'deepseek-r1';
  }
  if (trimmed === 'deepseek-chat' || trimmed === 'deepseek-v-3') {
    return 'deepseek-v3';
  }
  if (trimmed === 'kimi' || trimmed === 'kimi-k-3' || trimmed === 'moonshot-k3') {
    return 'kimi-k3';
  }
  return rawModel.trim();
}

export async function sendKieChatCompletion(options: KieChatCompletionOptions): Promise<string> {
  const normalizedModel = normalizeKieModelId(options.model);
  const {
    model = normalizedModel,
    messages,
    apiKey,
    baseUrl,
    temperature = 0.7,
    maxTokens,
    reasoningEffort,
    enableThinking,
    thinkingBudgetTokens,
    enableWebSearch,
    signal
  } = { ...options, model: normalizedModel };

  if (!apiKey || apiKey.trim() === '') {
    throw new Error('KIE.ai API key is required. Please add your key in the Chat Studio header or in API Settings.');
  }

  const modelConfig = KIE_POPULAR_MODELS.find(m => m.id === model);
  const endpointType: KieEndpointType = modelConfig?.endpointType || (
    model.startsWith('claude') ? 'claude' :
    model.startsWith('gpt-5-6') || model.startsWith('gpt-6') || model.startsWith('gpt-5-5') || model.startsWith('gpt-5-4') || model === 'codex' ? 'codex' :
    model.startsWith('grok') ? 'grok' :
    model.startsWith('deepseek') || model.startsWith('kimi') ? 'responses' :
    'openai'
  );

  let url = 'https://api.kie.ai/v1/chat/completions';
  if (baseUrl?.trim()) {
    url = baseUrl.trim().replace(/\/+$/, '') + '/chat/completions';
  } else if (modelConfig?.path) {
    url = `https://api.kie.ai${modelConfig.path}`;
  } else if (endpointType === 'claude') {
    url = 'https://api.kie.ai/claude/v1/messages';
  } else if (endpointType === 'codex') {
    url = 'https://api.kie.ai/codex/v1/responses';
  } else if (endpointType === 'grok') {
    url = 'https://api.kie.ai/grok/v1/responses';
  } else if (endpointType === 'responses') {
    url = 'https://api.kie.ai/openai/v1/responses';
  }

  const cleanKey = apiKey.trim().replace(/^Bearer\s+/i, '');
  const startTime = Date.now();

  try {
    // 1. Anthropic Claude Messages Protocol (/claude/v1/messages)
    if (endpointType === 'claude' && !baseUrl) {
      const systemMsg = messages.find(m => m.role === 'system');
      const userAndAssistantMsgs = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content
        }));

      const isThinkingEnabled = Boolean(enableThinking || (thinkingBudgetTokens && thinkingBudgetTokens > 0));
      const budget = thinkingBudgetTokens || 2048;

      const claudeBody: Record<string, any> = {
        model,
        messages: userAndAssistantMsgs.length > 0 ? userAndAssistantMsgs : [{ role: 'user', content: 'Hello' }],
        max_tokens: isThinkingEnabled ? Math.max(maxTokens || 8192, budget + 2048) : (maxTokens || 4096),
        temperature: isThinkingEnabled ? 1 : temperature,
      };

      if (isThinkingEnabled) {
        claudeBody.thinking = {
          type: 'enabled',
          budget_tokens: budget,
        };
      }

      if (systemMsg?.content) {
        claudeBody.system = systemMsg.content;
      }

      const reqHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cleanKey}`,
        'X-Api-Key': cleanKey,
        'anthropic-version': '2023-06-01',
      };

      const curlCmd = generateCurlCommand(url, 'POST', reqHeaders, claudeBody, cleanKey);

      let response: Response;
      let durationMs = 0;
      try {
        response = await fetch(url, {
          method: 'POST',
          headers: reqHeaders,
          body: JSON.stringify(claudeBody),
          signal,
        });
        durationMs = Date.now() - startTime;
      } catch (networkErr: any) {
        durationMs = Date.now() - startTime;
        logKieApiCall({
          model,
          url,
          method: 'POST',
          status: 0,
          statusText: 'Network Error',
          durationMs,
          requestHeaders: { ...reqHeaders, Authorization: sanitizeAuthHeader(cleanKey), 'X-Api-Key': '***' },
          requestBody: claudeBody,
          responseRaw: String(networkErr),
          isError: true,
          errorMessage: networkErr?.message || 'Network request failed',
          curlCommand: curlCmd,
        });
        throw networkErr;
      }

      if (!response.ok) {
        let errorDetail = '';
        let errJson: any = null;
        try {
          errJson = await response.json();
          errorDetail = errJson.error?.message || errJson.msg || errJson.message || JSON.stringify(errJson);
        } catch {
          errorDetail = await response.text();
        }

        logKieApiCall({
          model,
          url,
          method: 'POST',
          status: response.status,
          statusText: response.statusText,
          durationMs,
          requestHeaders: { ...reqHeaders, Authorization: sanitizeAuthHeader(cleanKey), 'X-Api-Key': '***' },
          requestBody: claudeBody,
          responseRaw: errJson || errorDetail,
          isError: true,
          errorMessage: errorDetail || `HTTP ${response.status}`,
          curlCommand: curlCmd,
        });

        if (response.status === 401) {
          throw new Error('KIE Authentication failed (401). Please check your API key.');
        } else if (response.status === 402 || response.status === 429) {
          throw new Error(`KIE Rate limit or credit exhaustion (${response.status}): ${errorDetail || 'Check your KIE account balance.'}`);
        } else if (errorDetail.toLowerCase().includes('not supported')) {
          throw new Error(`KIE Model '${model}' is not supported or not active on your KIE account for /claude/v1/messages.`);
        } else {
          throw new Error(`KIE Claude API Error (${response.status}): ${errorDetail || response.statusText}`);
        }
      }

      const data = await response.json();
      logKieApiCall({
        model,
        url,
        method: 'POST',
        status: response.status,
        statusText: response.statusText,
        durationMs,
        requestHeaders: { ...reqHeaders, Authorization: sanitizeAuthHeader(cleanKey), 'X-Api-Key': '***' },
        requestBody: claudeBody,
        responseRaw: data,
        isError: false,
        curlCommand: curlCmd,
      });

      return extractKieApiResponse(data);
    }

    // 2. OpenAI Responses API Protocol (/codex/v1/responses, /grok/v1/responses, /openai/v1/responses)
    if ((endpointType === 'codex' || endpointType === 'grok' || endpointType === 'responses') && !baseUrl) {
      const systemMsg = messages.find(m => m.role === 'system');
      const nonSystemMsgs = messages.filter(m => m.role !== 'system');

      const responsesBody: Record<string, any> = {
        model,
        stream: false,
        input: nonSystemMsgs.length > 0 
          ? nonSystemMsgs.map(m => ({
              role: m.role,
              content: m.content,
            }))
          : (systemMsg ? [{ role: 'user', content: systemMsg.content }] : [{ role: 'user', content: 'Generate response' }]),
      };

      if (systemMsg?.content) {
        responsesBody.instructions = systemMsg.content;
      }

      if (reasoningEffort) {
        responsesBody.reasoning = { effort: reasoningEffort };
      }

      if (enableWebSearch && (endpointType === 'codex' || endpointType === 'grok')) {
        responsesBody.tools = [{ type: 'web_search' }];
      }

      if (options.responseFormat === 'json_object') {
        responsesBody.text = { format: { type: 'json_object' } };
      }

      if (maxTokens) {
        responsesBody.max_output_tokens = maxTokens;
      }

      const reqHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cleanKey}`,
      };
      const curlCmd = generateCurlCommand(url, 'POST', reqHeaders, responsesBody, cleanKey);

      let response: Response;
      let durationMs = 0;
      try {
        response = await fetch(url, {
          method: 'POST',
          headers: reqHeaders,
          body: JSON.stringify(responsesBody),
          signal,
        });
        durationMs = Date.now() - startTime;
      } catch (networkErr: any) {
        durationMs = Date.now() - startTime;
        logKieApiCall({
          model,
          url,
          method: 'POST',
          status: 0,
          statusText: 'Network Error',
          durationMs,
          requestHeaders: { ...reqHeaders, Authorization: sanitizeAuthHeader(cleanKey) },
          requestBody: responsesBody,
          responseRaw: String(networkErr),
          isError: true,
          errorMessage: networkErr?.message || 'Network request failed',
          curlCommand: curlCmd,
        });
        throw networkErr;
      }

      if (!response.ok) {
        let errorDetail = '';
        let errJson: any = null;
        try {
          errJson = await response.json();
          errorDetail = errJson.error?.message || errJson.msg || errJson.message || JSON.stringify(errJson);
        } catch {
          errorDetail = await response.text();
        }

        logKieApiCall({
          model,
          url,
          method: 'POST',
          status: response.status,
          statusText: response.statusText,
          durationMs,
          requestHeaders: { ...reqHeaders, Authorization: sanitizeAuthHeader(cleanKey) },
          requestBody: responsesBody,
          responseRaw: errJson || errorDetail,
          isError: true,
          errorMessage: errorDetail || `HTTP ${response.status}`,
          curlCommand: curlCmd,
        });

        if (response.status === 401) {
          throw new Error('KIE Authentication failed (401). Please check your API key.');
        } else if (response.status === 402 || response.status === 429) {
          throw new Error(`KIE Rate limit or credit exhaustion (${response.status}): ${errorDetail || 'Check your KIE account balance.'}`);
        } else if (errorDetail.toLowerCase().includes('not supported')) {
          throw new Error(`KIE Model '${model}' is not supported on endpoint ${url}. Please verify model availability on your KIE account.`);
        } else if (response.status === 500 || response.status === 502 || response.status === 503 || response.status === 504) {
          throw new Error(`KIE Server Exception (${response.status}): The upstream provider for '${model}' is temporarily unavailable (${errorDetail || 'Server exception'}).`);
        } else {
          throw new Error(`KIE Responses API Error (${response.status}): ${errorDetail || response.statusText}`);
        }
      }

      const data = await response.json();
      logKieApiCall({
        model,
        url,
        method: 'POST',
        status: response.status,
        statusText: response.statusText,
        durationMs,
        requestHeaders: { ...reqHeaders, Authorization: sanitizeAuthHeader(cleanKey) },
        requestBody: responsesBody,
        responseRaw: data,
        isError: false,
        curlCommand: curlCmd,
      });

      return extractKieApiResponse(data);
    }

    // 3. Standard Chat Completions Protocol (Gemini openai-compatible, GPT-5.2, generic /v1/chat/completions)
    const body: Record<string, any> = {
      messages,
    };

    // Only include model parameter if url is generic /v1/chat/completions
    if (!url.includes('/gpt-5-2/')) {
      body.model = model;
      body.temperature = temperature;
    }

    if (maxTokens) {
      body.max_tokens = maxTokens;
    }

    if (options.responseFormat === 'json_object') {
      body.response_format = { type: 'json_object' };
    }

    if (reasoningEffort) {
      body.reasoning_effort = (reasoningEffort === 'xhigh' || reasoningEffort === 'high') ? 'high' : 'low';
    }

    if (enableWebSearch) {
      body.tools = [{ type: 'function', function: { name: 'web_search' } }];
    }

    const reqHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${cleanKey}`,
    };
    const curlCmd = generateCurlCommand(url, 'POST', reqHeaders, body, cleanKey);

    // Execute with automatic retry on transient upstream server exceptions
    let lastError: any = null;
    for (let attempt = 1; attempt <= 2; attempt++) {
      const attemptStartTime = Date.now();
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: reqHeaders,
          body: JSON.stringify(body),
          signal,
        });
        const attemptDuration = Date.now() - attemptStartTime;

        if (!response.ok) {
          let errorDetail = '';
          let errJson: any = null;
          try {
            errJson = await response.json();
            errorDetail = errJson.error?.message || errJson.msg || errJson.message || JSON.stringify(errJson);
          } catch {
            errorDetail = await response.text();
          }

          logKieApiCall({
            model,
            url,
            method: 'POST',
            status: response.status,
            statusText: response.statusText,
            durationMs: attemptDuration,
            requestHeaders: { ...reqHeaders, Authorization: sanitizeAuthHeader(cleanKey) },
            requestBody: body,
            responseRaw: errJson || errorDetail,
            isError: true,
            errorMessage: errorDetail || `HTTP ${response.status}`,
            curlCommand: curlCmd,
            attemptNumber: attempt,
          });

          if (response.status === 401) {
            throw new Error('KIE Authentication failed (401). Please check your API key.');
          } else if (response.status === 402 || response.status === 429) {
            throw new Error(`KIE Rate limit or credit exhaustion (${response.status}): ${errorDetail || 'Check your KIE account balance.'}`);
          } else if (errorDetail.toLowerCase().includes('not supported')) {
            throw new Error(`KIE Model '${model}' is not supported on ${url}. Please verify this model is enabled in your KIE.ai account.`);
          } else if ((response.status >= 500 || errorDetail.toLowerCase().includes('server exception')) && attempt < 2) {
            await new Promise(r => setTimeout(r, 1200));
            continue;
          } else {
            throw new Error(`KIE API Error (${response.status}): ${errorDetail || response.statusText}`);
          }
        }

        const data = await response.json();

        // Check if Kie returned an error payload disguised inside HTTP 200
        const isUpstreamError = Boolean(
          (data?.code && data.code !== 200) ||
          data?.error ||
          (data?.msg && data.msg !== 'success' && !data.choices && !data.output && !data.data)
        );

        if (isUpstreamError) {
          const errMsg = data?.error?.message || data?.msg || data?.message || `Upstream code ${data?.code || 500}`;
          logKieApiCall({
            model,
            url,
            method: 'POST',
            status: data?.code || 500,
            statusText: data?.msg || 'Server Exception',
            durationMs: attemptDuration,
            requestHeaders: { ...reqHeaders, Authorization: sanitizeAuthHeader(cleanKey) },
            requestBody: body,
            responseRaw: data,
            isError: true,
            errorMessage: errMsg,
            curlCommand: curlCmd,
            attemptNumber: attempt,
          });

          if ((errMsg.toLowerCase().includes('server exception') || (data?.code && data.code >= 500)) && attempt < 2) {
            await new Promise(r => setTimeout(r, 1500));
            continue;
          }
          throw new Error(`[KIE AI Status]: Server exception, please try again later. (${errMsg})`);
        }

        logKieApiCall({
          model,
          url,
          method: 'POST',
          status: response.status,
          statusText: response.statusText,
          durationMs: attemptDuration,
          requestHeaders: { ...reqHeaders, Authorization: sanitizeAuthHeader(cleanKey) },
          requestBody: body,
          responseRaw: data,
          isError: false,
          curlCommand: curlCmd,
          attemptNumber: attempt,
        });

        return extractKieApiResponse(data);
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || '');
        if (msg.includes('server exception') && attempt < 2) {
          await new Promise(r => setTimeout(r, 1500));
          continue;
        }
        throw err;
      }
    }
    throw lastError || new Error('Failed to communicate with KIE API.');
  } catch (err: any) {
    throw err;
  }
}

export interface KieRepoAgentOptions extends KieChatCompletionOptions {
  repoOwner: string;
  repoName: string;
  repoBranch: string;
  commitSha: string;
  githubToken?: string;
  creditSaver?: boolean;
  onStatusUpdate?: (statusText: string) => void;
}

export interface KieRepoAgentResult {
  text: string;
  retrievedFiles: Array<{ path: string; startLine: number; endLine: number; language?: string }>;
  analyzedCommitSha: string;
}

/**
 * Intelligent repository-aware agent loop that fetches authoritative source code on demand
 * without dumping the whole repository into prompts.
 */
export async function runKieChatWithRepoTools(options: KieRepoAgentOptions): Promise<KieRepoAgentResult> {
  const { 
    repoOwner, 
    repoName, 
    repoBranch, 
    commitSha, 
    githubToken,
    messages, 
    onStatusUpdate,
    ...restOptions 
  } = options;

  const retrievedFiles: Array<{ path: string; startLine: number; endLine: number; language?: string }> = [];

  // 1. Identify last user inquiry
  const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
  const userText = lastUserMsg ? lastUserMsg.content : '';

  // Extract key search terms from user inquiry (e.g. "HLS", "m3u8", "MediaDetection", "download", etc.)
  const keywords = userText
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length >= 3 && !['what', 'when', 'where', 'which', 'this', 'that', 'from', 'with', 'about', 'have', 'does', 'your'].includes(word.toLowerCase()));

  // Dynamic import of context services to keep module decoupled
  const { searchRepoCode, readRepoFileSnippet, fetchAndIndexRepo, getLatestCommit } = await import('./githubRepoContext');

  if (onStatusUpdate) {
    onStatusUpdate(`Inspecting repository ${repoOwner}/${repoName} at commit ${commitSha.slice(0, 7)}...`);
  }

  // Pre-load index to verify commit freshness & find candidate files
  const index = await fetchAndIndexRepo(repoOwner, repoName, repoBranch, false, githubToken);

  // Fetch latest commit details with files & diffs
  let latestCommitInfo: any = null;
  try {
    latestCommitInfo = await getLatestCommit(repoOwner, repoName, repoBranch, githubToken);
  } catch (commitErr) {
    console.warn('[KieRepoAgent] Could not fetch detailed commit info:', commitErr);
  }

  let targetedSnippetsText = '';

  // 2. Identify candidate files to inspect:
  // First, include any files changed in the latest commit
  const commitChangedFiles = latestCommitInfo?.files
    ? latestCommitInfo.files
        .map((f: any) => f.filename)
        .filter((p: string) => p.endsWith('.kt') || p.endsWith('.java') || p.endsWith('.xml') || p.endsWith('AndroidManifest.xml'))
    : [];

  const candidatePathsToFetch = new Set<string>(commitChangedFiles.slice(0, 3));

  if (keywords.length > 0 && candidatePathsToFetch.size < 3) {
    if (onStatusUpdate) {
      onStatusUpdate(`Searching relevant source files for: ${keywords.slice(0, 3).join(', ')}...`);
    }

    // Search code for the top 2 most relevant keywords
    const topResults = await searchRepoCode({
      owner: repoOwner,
      repo: repoName,
      branch: repoBranch,
      commitSha,
      query: keywords[0],
      token: githubToken,
    });

    for (const res of topResults) {
      if (candidatePathsToFetch.size >= 3) break;
      if (res.path.endsWith('.kt') || res.path.endsWith('.java') || res.path.endsWith('.xml') || res.path.endsWith('AndroidManifest.xml')) {
        candidatePathsToFetch.add(res.path);
      }
    }
  }

  for (const candidatePath of candidatePathsToFetch) {
    try {
      if (onStatusUpdate) {
        onStatusUpdate(`Reading ${candidatePath.split('/').pop()} from GitHub...`);
      }

      const snippet = await readRepoFileSnippet({
        owner: repoOwner,
        repo: repoName,
        commitSha,
        path: candidatePath,
        startLine: 1,
        endLine: 220, // targeted head/core logic
        token: githubToken,
      });

      retrievedFiles.push({
        path: snippet.path,
        startLine: snippet.startLine,
        endLine: snippet.endLine,
        language: snippet.language,
      });

      targetedSnippetsText += `\n\n--- [EXACT GITHUB SOURCE: ${snippet.path} (lines ${snippet.startLine}-${snippet.endLine}) @ commit ${commitSha.slice(0, 7)}] ---\n\`\`\`${snippet.language}\n${snippet.content}\n\`\`\`\n`;
    } catch (err) {
      console.warn('[KieRepoAgent] Snippet fetch error for', candidatePath, err);
    }
  }

  // Format commit info and diffs
  let commitSectionText = '';
  if (latestCommitInfo) {
    commitSectionText = `
Latest Remote Commit on GitHub:
- Commit SHA: ${latestCommitInfo.sha}
- Author: ${latestCommitInfo.authorName} (${latestCommitInfo.authorDate || 'recent'})
- Commit Message: "${latestCommitInfo.message.trim()}"
`;

    if (latestCommitInfo.files && latestCommitInfo.files.length > 0) {
      commitSectionText += `\nFiles Changed in Latest Commit (${latestCommitInfo.files.length}):\n` +
        latestCommitInfo.files.map((f: any) => `* \`${f.filename}\` (${f.status}, +${f.additions}/-${f.deletions})`).join('\n');

      const patches = latestCommitInfo.files
        .filter((f: any) => f.patch)
        .map((f: any) => `--- GIT DIFF: ${f.filename} (${f.status}) ---\n\`\`\`diff\n${f.patch}\n\`\`\``)
        .join('\n\n');

      if (patches) {
        commitSectionText += `\n\nExact Git Patch / Diff from Latest Commit:\n${patches}`;
      }
    }
  }

  // Build enhanced system/context instructions
  let rawRepoContext = `
${commitSectionText}

${targetedSnippetsText ? `Targeted Authoritative Code Retrieved from GitHub:\n${targetedSnippetsText}` : ''}
`;

  let processedRepoContext = rawRepoContext;
  if (options.creditSaver !== false && rawRepoContext.length > 1500) {
    try {
      if (onStatusUpdate) {
        onStatusUpdate(`⚡ Gemini is pre-reading & distilling repository context (Saving KIE credits)...`);
      }
      const { distillCodeContextWithGemini } = await import('./geminiCodeDistiller');
      const distillation = await distillCodeContextWithGemini({
        userPrompt: userText || 'Analyze the connected repository code.',
        gitContextText: rawRepoContext,
        signal: options.signal,
      });
      if (distillation.isDistilled) {
        processedRepoContext = distillation.distilledText;
      }
    } catch (dErr) {
      console.warn('[KieRepoAgent] Gemini Distillation fallback:', dErr);
    }
  }

  const repoContextInstruction = `
--- AUTHORITATIVE GITHUB REPOSITORY CONTEXT ---
Connected Repository: ${repoOwner}/${repoName}
Active Branch: ${repoBranch}
Analyzed Commit SHA: ${commitSha}
Indexed Files: ${index.androidSourceFiles} Android source files available in repository.
Workflow: Jules modifies GitHub -> User pulls to AndroidIDE on Poco F5 -> AndroidIDE builds APK.

${processedRepoContext}

DIRECTIVE FOR THIS ASSISTANT:
1. You are ALREADY connected to the repository (${repoOwner}/${repoName}) via the app's GitHub bridge. The latest commit details, changed files, git diffs, and source code are provided above.
2. NEVER ask the user to provide the repository URL, branch, or paste commit diffs. Analyze the provided commit details and code directly.
3. Categorize all findings explicitly:
   - [CONFIRMED]: Verified directly in the authoritative code and diff above.
   - [LIKELY]: Strongly supported by logic but requiring device test on Poco F5.
   - [HYPOTHESIS]: A potential cause not yet directly proven.
4. If providing a fix for Jules or the user, format as a structured "Jules-Ready Task" containing: Target Files & Functions, Verified Root Cause, Constraints (things Jules must NOT break), and AndroidIDE Validation Steps.
`;

  const updatedMessages = messages.map(m => {
    if (m.role === 'system') {
      return {
        ...m,
        content: `${m.content}\n\n${repoContextInstruction}`,
      };
    }
    return m;
  });

  if (!updatedMessages.some(m => m.role === 'system')) {
    updatedMessages.unshift({
      role: 'system',
      content: repoContextInstruction,
    });
  }

  if (onStatusUpdate) {
    onStatusUpdate(`Analyzing code with ${options.model}...`);
  }

  const responseText = await sendKieChatCompletion({
    ...restOptions,
    messages: updatedMessages,
  });

  return {
    text: responseText,
    retrievedFiles,
    analyzedCommitSha: commitSha,
  };
}

export interface LoopStepResult {
  step: number;
  label: string;
  summary: string;
  output: string;
  retrievedFiles?: Array<{ path: string; startLine: number; endLine: number; language?: string }>;
}

export interface KieLoopExecutionOptions extends KieChatCompletionOptions {
  maxSteps?: number;
  repoOwner?: string;
  repoName?: string;
  repoBranch?: string;
  commitSha?: string;
  isRepoEnabled?: boolean;
  githubToken?: string;
  onStepProgress?: (step: number, totalSteps: number, statusText: string) => void;
}

/**
 * Autonomous Multi-Step Agentic Loop (ReAct / Self-Critique / Multi-File Traversal)
 */
export async function runKieAutonomousLoop(options: KieLoopExecutionOptions): Promise<{
  text: string;
  steps: LoopStepResult[];
  retrievedFiles: Array<{ path: string; startLine: number; endLine: number; language?: string }>;
  analyzedCommitSha?: string;
}> {
  const {
    maxSteps = 3,
    messages,
    repoOwner,
    repoName,
    repoBranch = 'master',
    commitSha,
    isRepoEnabled = false,
    githubToken,
    onStepProgress,
    ...restOptions
  } = options;

  let activeCommitSha = commitSha;
  if (isRepoEnabled && repoOwner && repoName && !activeCommitSha) {
    try {
      const { getLatestCommit } = await import('./githubRepoContext');
      const latest = await getLatestCommit(repoOwner, repoName, repoBranch, githubToken);
      activeCommitSha = latest.sha;
    } catch (e) {
      console.warn('[runKieAutonomousLoop] Could not resolve latest commit:', e);
    }
  }

  const totalSteps = Math.max(2, Math.min(5, maxSteps));
  const steps: LoopStepResult[] = [];
  const allRetrievedFiles: Array<{ path: string; startLine: number; endLine: number; language?: string }> = [];

  // Step 1: Initial Discovery / Draft
  if (onStepProgress) {
    onStepProgress(1, totalSteps, isRepoEnabled ? `Step 1/${totalSteps}: Inspecting repository & candidate source files...` : `Step 1/${totalSteps}: Generating initial blueprint & concept...`);
  }

  let step1Result = '';
  if (isRepoEnabled && repoOwner && repoName && activeCommitSha) {
    const repoAgent = await runKieChatWithRepoTools({
      ...restOptions,
      messages,
      repoOwner,
      repoName,
      repoBranch,
      commitSha: activeCommitSha,
      githubToken,
      onStatusUpdate: (msg) => {
        if (onStepProgress) onStepProgress(1, totalSteps, `Step 1/${totalSteps}: ${msg}`);
      }
    });
    step1Result = repoAgent.text;
    if (repoAgent.retrievedFiles) {
      allRetrievedFiles.push(...repoAgent.retrievedFiles);
    }
  } else {
    step1Result = await sendKieChatCompletion({
      ...restOptions,
      messages,
    });
  }

  steps.push({
    step: 1,
    label: isRepoEnabled ? 'Initial Code Discovery & Analysis' : 'Initial Draft & Plan',
    summary: step1Result.slice(0, 160).replace(/\n/g, ' ') + '...',
    output: step1Result,
    retrievedFiles: [...allRetrievedFiles]
  });

  if (totalSteps === 1) {
    return {
      text: step1Result,
      steps,
      retrievedFiles: allRetrievedFiles,
      analyzedCommitSha: activeCommitSha,
    };
  }

  // Step 2: Self-Critique, Dependency Traversal, or Edge Case Audit
  if (onStepProgress) {
    onStepProgress(2, totalSteps, isRepoEnabled ? `Step 2/${totalSteps}: Traversing secondary dependencies & verifying edge cases...` : `Step 2/${totalSteps}: Auditing prompt against constraints & anti-slop rules...`);
  }

  // Check if step 1 mentioned a candidate secondary file from github
  let secondarySnippetText = '';
  if (isRepoEnabled && repoOwner && repoName && activeCommitSha) {
    try {
      const { readRepoFileSnippet } = await import('./githubRepoContext');
      // Look for mention of files like X.kt or Y.xml in step 1 output
      const fileMatches = step1Result.match(/[\w/-]+\.(?:kt|java|xml|gradle)/g);
      if (fileMatches && fileMatches.length > 0) {
        const uniqueMatches = Array.from(new Set(fileMatches)).filter(f => !allRetrievedFiles.some(r => r.path.endsWith(f)));
        if (uniqueMatches.length > 0) {
          const targetPath = uniqueMatches[0];
          try {
            const snippet = await readRepoFileSnippet({
              owner: repoOwner,
              repo: repoName,
              commitSha: activeCommitSha,
              path: targetPath,
              startLine: 1,
              endLine: 150,
              token: githubToken,
            });
            allRetrievedFiles.push({
              path: snippet.path,
              startLine: snippet.startLine,
              endLine: snippet.endLine,
              language: snippet.language,
            });
            secondarySnippetText = `\n\n--- [FOLLOW-UP GITHUB DEPENDENCY: ${snippet.path} (lines ${snippet.startLine}-${snippet.endLine})] ---\n\`\`\`${snippet.language}\n${snippet.content}\n\`\`\`\n`;
          } catch (e) {
            // Secondary snippet not found or path was partial
          }
        }
      }
    } catch (e) {
      console.warn('Dependency traversal error in loop step 2:', e);
    }
  }

  const step2CritiquePrompt: KieChatMessage[] = [
    ...messages,
    { role: 'assistant', content: step1Result },
    {
      role: 'user',
      content: isRepoEnabled 
        ? `[AUTONOMOUS LOOP STEP 2/${totalSteps}: CRITIQUE & DEPENDENCY VERIFICATION]
${secondarySnippetText ? `Additional retrieved dependency context:\n${secondarySnippetText}\n` : ''}
Critique your Step 1 analysis with extreme architectural discipline:
1. Are all assumptions backed by the confirmed code?
2. Check for potential regressions on Android 14+ / AndroidIDE / Poco F5 device constraints.
3. If providing a fix, verify exact function names and null-safety. Identify missing pieces or risks.`
        : `[AUTONOMOUS LOOP STEP 2/${totalSteps}: CRITIQUE & REFINEMENT PASS]
Critique your initial draft:
1. Eliminate any generic AI buzzwords or cliché phrasing.
2. Check for alignment with character definitions, camera optics, and concrete details.
3. Identify edge cases or gaps in the narrative/logic.`
    }
  ];

  const step2Result = await sendKieChatCompletion({
    ...restOptions,
    messages: step2CritiquePrompt,
  });

  steps.push({
    step: 2,
    label: isRepoEnabled ? 'Dependency Verification & Rigorous Critique' : 'Self-Critique & Anti-Slop Audit',
    summary: step2Result.slice(0, 160).replace(/\n/g, ' ') + '...',
    output: step2Result,
  });

  if (totalSteps === 2) {
    return {
      text: step2Result,
      steps,
      retrievedFiles: allRetrievedFiles,
      analyzedCommitSha: commitSha,
    };
  }

  // Step 3 (or Final Step): Synthesis & Final Polished Output
  if (onStepProgress) {
    onStepProgress(totalSteps, totalSteps, `Step ${totalSteps}/${totalSteps}: Synthesizing definitive, verified solution...`);
  }

  const finalSynthesisPrompt: KieChatMessage[] = [
    ...messages,
    { role: 'assistant', content: step1Result },
    { role: 'user', content: `Critique summary:\n${step2Result}\n\n[AUTONOMOUS LOOP STEP ${totalSteps}/${totalSteps}: DEFINITIVE SYNTHESIS]\nProduce the final, polished, and definitive output integrating the critiques and verified code. Make it directly actionable, structured, and complete.` }
  ];

  const finalResult = await sendKieChatCompletion({
    ...restOptions,
    messages: finalSynthesisPrompt,
  });

  steps.push({
    step: totalSteps,
    label: 'Definitive Synthesized Response',
    summary: finalResult.slice(0, 160).replace(/\n/g, ' ') + '...',
    output: finalResult,
  });

  return {
    text: finalResult,
    steps,
    retrievedFiles: allRetrievedFiles,
    analyzedCommitSha: commitSha,
  };
}

export const callKieChatCompletion = sendKieChatCompletion;

