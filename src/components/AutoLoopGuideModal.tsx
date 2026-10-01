import React from 'react';
import { RefreshCw, Zap, CheckCircle2, ShieldAlert, Cpu, Sparkles, X, Brain, GitBranch, Clapperboard, Layers, ArrowRight } from 'lucide-react';

interface AutoLoopGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AutoLoopGuideModal: React.FC<AutoLoopGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 animate-fadeIn">
      <div 
        className="bg-[#12131a] border border-indigo-500/30 w-full max-w-3xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl shadow-indigo-950/60 overflow-hidden text-white font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <RefreshCw className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2 text-white">
                Chat Loop Mode Guide
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Auto-Execution
                </span>
              </h2>
              <p className="text-xs text-white/50">Automatic sequence execution, next-step analysis & smart stop conditions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 custom-scrollbar text-sm">
          
          {/* Concept Overview Card */}
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-3">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs uppercase tracking-wider">
              <Zap className="w-4 h-4 text-indigo-400" /> How Chat Loop Works (Two Specialized Modes)
            </div>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              When <strong>Chat Loop</strong> is toggled ON, the AI continues the sequence automatically without requiring manual prompting at every turn:
            </p>

            {/* Two Modes Comparison Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-950/30 via-emerald-950/20 to-black/40 border border-amber-500/40 space-y-1.5">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  🤖 Mode 1: AI-to-AI Talk (Dual Agent)
                </span>
                <p className="text-xs text-white/70 leading-relaxed">
                  The primary AI Assistant and a <strong>second AI Proxy</strong> converse in the transcript. The second AI takes your role to ask sharp follow-up questions, critique and refine prompts, request variations, or debate ideas in real-time!
                </p>
                <div className="text-[11px] text-amber-200/80 font-mono bg-black/40 p-2 rounded border border-white/5">
                  You prompt once ➔ AI #1 replies ➔ AI #2 (User Proxy) reads & asks for refinements ➔ AI #1 answers ➔ ...
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-950/30 via-purple-950/20 to-black/40 border border-indigo-500/40 space-y-1.5">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  ⚡ Mode 2: Auto-Task Run (Tool Sequence)
                </span>
                <p className="text-xs text-white/70 leading-relaxed">
                  The AI breaks down multi-step tasks (e.g. creating characters, generating images, updating specific settings when requested), reads the output, and automatically continues to the next step until finished.
                </p>
                <div className="text-[11px] text-indigo-200/80 font-mono bg-black/40 p-2 rounded border border-white/5">
                  Step 1 (Generate Cast) ➔ Step 2 (Refine Prompts) ➔ Step 3 (Render Test Art) ➔ [DONE]
                </div>
              </div>
            </div>

            {/* Persona Guide for AI #2 */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-emerald-400" /> AI #2 Proxy Personas in Dialogue Mode:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-black/40 border border-white/10">
                  <strong className="text-white flex items-center gap-1">👤 User Proxy (Inquisitor)</strong>
                  <span className="text-white/60 text-[11px]">Takes your place: asks probing follow-ups, requests prompt refinements, and tests alternatives.</span>
                </div>
                <div className="p-2 rounded-lg bg-black/40 border border-white/10">
                  <strong className="text-white flex items-center gap-1">🎬 Quality & Prompt Critic</strong>
                  <span className="text-white/60 text-[11px]">Audits for clichés, generic phrasing, and demands higher creative & technical precision.</span>
                </div>
                <div className="p-2 rounded-lg bg-black/40 border border-white/10">
                  <strong className="text-white flex items-center gap-1">🔥 Devil's Advocate</strong>
                  <span className="text-white/60 text-[11px]">Challenges assumptions, questions risks, and explores counter-perspectives.</span>
                </div>
                <div className="p-2 rounded-lg bg-black/40 border border-white/10">
                  <strong className="text-white flex items-center gap-1">💡 Co-Creator (Partner)</strong>
                  <span className="text-white/60 text-[11px]">Brainstorms creative twists, expands metaphors, and elevates ideas collaboratively.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Practical Use Cases Grid */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-bold text-white/60 tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Best Situations to Use Auto-Loop
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Card 1 */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2 hover:border-indigo-500/40 transition-colors">
                <div className="flex items-center gap-2 text-indigo-300 font-medium text-xs">
                  <GitBranch className="w-4 h-4 text-indigo-400" /> Multi-File Code & Jules Tasks
                </div>
                <p className="text-xs text-white/60 leading-relaxed">
                  When analyzing bug reports in your codebase (e.g. <span className="text-white font-mono">MyAndroidApp</span>), Loop enables the AI to inspect <span className="text-white/80">MainActivity.kt</span>, discover imported services, fetch <span className="text-white/80">PlayerService.kt</span> in Step 2, and produce accurate patches.
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2 hover:border-purple-500/40 transition-colors">
                <div className="flex items-center gap-2 text-purple-300 font-medium text-xs">
                  <Clapperboard className="w-4 h-4 text-purple-400" /> Music Video Storyboarding
                </div>
                <p className="text-xs text-white/60 leading-relaxed">
                  The AI drafts scene breakdowns in Step 1, checks character presence against the <strong>Character DNA</strong> registry in Step 2, and refines cinematography, lighting, and camera movements in Step 3.
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2 hover:border-emerald-500/40 transition-colors">
                <div className="flex items-center gap-2 text-emerald-300 font-medium text-xs">
                  <Brain className="w-4 h-4 text-emerald-400" /> Anti-Slop Prompt Polishing
                </div>
                <p className="text-xs text-white/60 leading-relaxed">
                  Automatically cleans generic AI buzzwords (*"photorealistic, cinematic masterpiece, ultra-detailed"*) and replaces them with concrete lens optics (35mm Anamorphic, f/1.8, Kodak 5219 film grain).
                </p>
              </div>

              {/* Card 4 */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2 hover:border-amber-500/40 transition-colors">
                <div className="flex items-center gap-2 text-amber-300 font-medium text-xs">
                  <Cpu className="w-4 h-4 text-amber-400" /> Flawless JSON & Code Syntax
                </div>
                <p className="text-xs text-white/60 leading-relaxed">
                  If generated JSON or Kotlin code contains subtle syntax mismatches, the loop validates and repairs the structure before presenting the output.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Settings & Tips */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-amber-400" /> Token Economics & Best Practices
            </div>
            <ul className="text-xs text-white/70 space-y-2 list-disc list-inside">
              <li>
                <strong className="text-white">Step Limits:</strong> <strong>2–3 steps</strong> is ideal for 95% of tasks. Use <strong>4–5 steps</strong> only for deep repository refactoring or complex multi-hop research.
              </li>
              <li>
                <strong className="text-white">Memory Interaction:</strong> To save tokens on long chat sessions, toggle <strong>Memory OFF</strong> while using Auto-Loop. The loop will self-refine the current prompt without re-sending old history.
              </li>
              <li>
                <strong className="text-white">Live Step Inspection:</strong> Each bot reply includes an expandable <strong>Auto-Loop Steps</strong> drawer so you can inspect what occurred at each reasoning pass.
              </li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-black/40 flex items-center justify-between">
          <span className="text-[11px] text-white/40">Available in KIE Chat Studio & Studio Tab Chat</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-colors flex items-center gap-1.5"
          >
            Got It <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
