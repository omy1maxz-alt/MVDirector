import { getGenAI, withRetry } from './gemini';

export interface ExpandBlueprintOptions {
  userPrompt: string;
  blueprint: string;
  contextText?: string;
  architectModel: string;
  googleApiKey?: string;
  signal?: AbortSignal;
}

export interface ExpandBlueprintResult {
  fullText: string;
  blueprint: string;
  architectModel: string;
  builderModel: string;
  savedPercent: number;
  isExpanded: boolean;
}

/**
 * Returns a strict system instruction that forces KIE (Claude, GPT, Grok) to output
 * only a compact architectural blueprint (~150-350 tokens) instead of generating thousands
 * of expensive output tokens.
 */
export function getKieArchitectDirective(baseSystemPrompt: string = ''): string {
  const directive = `
=== LEAD ARCHITECT BLUEPRINT DIRECTIVE ===
You are acting as the LEAD SOFTWARE & CINEMATIC ARCHITECT.
A downstream senior implementation engine (Google Gemini 3.7 Flash) will execute the full code writing, boilerplate, and long-form text for free based on your blueprint.

YOUR STRICT OUTPUT BUDGET:
- Do NOT write full boilerplate code, entire files, or repetitive implementation blocks.
- Output ONLY a high-density, compact Architectural Blueprint (strictly under 350 tokens).
- Use this structured blueprint format:
  1. **Core Strategy & Algorithm**: The exact logic mechanism, state model, or structural sequence.
  2. **Interface & Signatures**: Exact class names, function signatures, props, types, and return values.
  3. **Edge Cases & Guardrails**: Critical failure modes, null-safety, async hazards, or things NOT to break.
  4. **Builder Directives**: Precise step-by-step instructions for Gemini to construct the full code without deviation.
`;
  return baseSystemPrompt ? `${baseSystemPrompt}\n\n${directive}` : directive;
}

/**
 * Executes Step 2 of the Architect Pipeline:
 * Passes KIE's concise blueprint to Google Gemini 3.7 Flash in the background, which writes
 * out the complete, immaculate, full-length implementation for free.
 */
export async function expandBlueprintWithGemini(options: ExpandBlueprintOptions): Promise<ExpandBlueprintResult> {
  const { userPrompt, blueprint, contextText = '', architectModel, googleApiKey } = options;

  if (!blueprint || blueprint.trim().length < 20) {
    return {
      fullText: blueprint,
      blueprint,
      architectModel,
      builderModel: 'gemini-3.7-flash',
      savedPercent: 0,
      isExpanded: false,
    };
  }

  try {
    const genAI = getGenAI(googleApiKey);

    const builderPrompt = `You are an elite Senior Implementation Engineer.
The Lead Software Architect (${architectModel}) has analyzed the user's request and designed a high-density Architectural Blueprint.

USER'S INQUIRY & GOAL:
"${userPrompt}"

${contextText ? `SUPPORTING CODE / REPO CONTEXT:\n${contextText}\n\n` : ''}
LEAD ARCHITECT'S BLUEPRINT (${architectModel}):
"""
${blueprint}
"""

YOUR DIRECTIVE:
1. Faithfully execute the Lead Architect's blueprint into complete, production-ready implementation.
2. Write full, clean, working code without lazy omissions (no "// TODO", no "// ...rest of code...").
3. Adhere strictly to the method signatures, error handling, and constraints specified by the Architect.
4. Format the final output clearly with clean markdown, code fences, and concise explanations.`;

    const response = await withRetry(async () => {
      return await genAI.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: builderPrompt,
        config: {
          temperature: 0.3,
          maxOutputTokens: 16384,
        },
      });
    }, 2, 1500);

    const fullExpandedText = (response.text || '').trim();
    if (!fullExpandedText) {
      throw new Error('Gemini builder produced empty response.');
    }

    // Estimate credit savings: Blueprint chars vs Expanded chars
    const blueprintChars = blueprint.length;
    const expandedChars = fullExpandedText.length;
    const savedPercent = Math.max(0, Math.min(95, Math.round((1 - (blueprintChars / Math.max(expandedChars, 1))) * 100)));

    return {
      fullText: fullExpandedText,
      blueprint,
      architectModel,
      builderModel: 'gemini-3.7-flash',
      savedPercent,
      isExpanded: true,
    };
  } catch (err: any) {
    console.warn('[GeminiArchitectPipeline] Builder expansion fallback:', err);
    // If Gemini builder fails, gracefully return KIE's blueprint so user still gets their answer
    return {
      fullText: blueprint,
      blueprint,
      architectModel,
      builderModel: 'gemini-3.7-flash',
      savedPercent: 0,
      isExpanded: false,
    };
  }
}
