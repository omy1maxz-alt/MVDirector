import{g as h,w as p}from"./index-Bs8wFp6R.js";function g(n=""){const i=`
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
`;return n?`${n}

${i}`:i}async function T(n){const{userPrompt:i,blueprint:e,contextText:o="",architectModel:t,googleApiKey:s}=n;if(!e||e.trim().length<20)return{fullText:e,blueprint:e,architectModel:t,builderModel:"gemini-3.7-flash",savedPercent:0,isExpanded:!1};try{const r=h(s),l=`You are an elite Senior Implementation Engineer.
The Lead Software Architect (${t}) has analyzed the user's request and designed a high-density Architectural Blueprint.

USER'S INQUIRY & GOAL:
"${i}"

${o?`SUPPORTING CODE / REPO CONTEXT:
${o}

`:""}
LEAD ARCHITECT'S BLUEPRINT (${t}):
"""
${e}
"""

YOUR DIRECTIVE:
1. Faithfully execute the Lead Architect's blueprint into complete, production-ready implementation.
2. Write full, clean, working code without lazy omissions (no "// TODO", no "// ...rest of code...").
3. Adhere strictly to the method signatures, error handling, and constraints specified by the Architect.
4. Format the final output clearly with clean markdown, code fences, and concise explanations.`,a=((await p(async()=>await r.models.generateContent({model:"gemini-3.7-flash",contents:l,config:{temperature:.3,maxOutputTokens:16384}}),2,1500)).text||"").trim();if(!a)throw new Error("Gemini builder produced empty response.");const c=e.length,u=a.length,d=Math.max(0,Math.min(95,Math.round((1-c/Math.max(u,1))*100)));return{fullText:a,blueprint:e,architectModel:t,builderModel:"gemini-3.7-flash",savedPercent:d,isExpanded:!0}}catch(r){return console.warn("[GeminiArchitectPipeline] Builder expansion fallback:",r),{fullText:e,blueprint:e,architectModel:t,builderModel:"gemini-3.7-flash",savedPercent:0,isExpanded:!1}}}export{T as expandBlueprintWithGemini,g as getKieArchitectDirective};
