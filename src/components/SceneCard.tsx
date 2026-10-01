import React, { useState, useEffect } from 'react';
import { Scene, AspectRatio, ProjectData } from '@/types';
import { Image as ImageIcon, Film, Wand2, RefreshCw, Edit3, Check, Loader2, Play, Download, Link as LinkIcon, Copy, CheckCheck, XCircle, Maximize2, X } from 'lucide-react';

interface SceneCardProps {
  scene: Scene;
  index: number;
  onGenerate: (params?: { aspectRatio: AspectRatio; seed: number }) => void;
  onStopGenerate?: () => void;
  onUpdate: (updates: Partial<Scene>) => void;
  onEnhance: () => void;
  onEnhanceVideo: () => void;
  projectData: ProjectData;
  apiKey?: string;
}

const ASPECT_RATIOS = [
  { value: '16:9', desc: 'Landscape' },
  { value: '2.35:1', desc: 'Cinema' },
  { value: '14:9', desc: 'Widescreen' },
  { value: '4:3', desc: 'Retro' },
  { value: '1:1', desc: 'Square' },
  { value: '9:16', desc: 'Vertical' },
  { value: '8:15', desc: 'Vertical' },
  { value: '3:4', desc: 'Tall' },
];

export const SceneCard: React.FC<SceneCardProps> = ({
  scene,
  index,
  onGenerate,
  onStopGenerate,
  onUpdate,
  onEnhance,
  onEnhanceVideo,
  projectData
}) => {
  const [isEditingImagePrompt, setIsEditingImagePrompt] = useState(false);
  const [isEditingVideoPrompt, setIsEditingVideoPrompt] = useState(false);
  const [tempImagePrompt, setTempImagePrompt] = useState(scene.imagePrompt);
  const [tempVideoPrompt, setTempVideoPrompt] = useState(scene.videoMotionPrompt);
  const [copiedImage, setCopiedImage] = useState(false);
  const [copiedVideo, setCopiedVideo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showRatioDropdown, setShowRatioDropdown] = useState(false);

  useEffect(() => {
    setTempImagePrompt(scene.imagePrompt);
  }, [scene.imagePrompt]);

  useEffect(() => {
    setTempVideoPrompt(scene.videoMotionPrompt);
  }, [scene.videoMotionPrompt]);

  const handleCopyImagePrompt = () => {
    navigator.clipboard.writeText(scene.imagePrompt);
    setCopiedImage(true);
    setTimeout(() => setCopiedImage(false), 2000);
  };

  const handleCopyVideoPrompt = () => {
    navigator.clipboard.writeText(scene.videoMotionPrompt);
    setCopiedVideo(true);
    setTimeout(() => setCopiedVideo(false), 2000);
  };

  const handleSaveImagePrompt = () => {
    // Auto-detect disabled characters based on presence in the edited prompt
    const newDisabledCharacterIds: string[] = [];
    if (projectData.characters && projectData.characters.length > 0) {
        const lowerPrompt = tempImagePrompt.toLowerCase();
        projectData.characters.forEach(char => {
            if (!lowerPrompt.includes(char.name.toLowerCase())) {
                newDisabledCharacterIds.push(char.id);
            }
        });
    }

    onUpdate({ 
      imagePrompt: tempImagePrompt,
      disabledCharacterIds: newDisabledCharacterIds
    });
    setIsEditingImagePrompt(false);
  };

  const handleSaveVideoPrompt = () => {
    onUpdate({ videoMotionPrompt: tempVideoPrompt });
    setIsEditingVideoPrompt(false);
  };

  const handleDownload = async () => {
    if (scene.imageUrl) {
      try {
        const response = await fetch(scene.imageUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `scene-${index + 1}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } catch (e) {
        // Fallback
        const a = document.createElement('a');
        a.href = scene.imageUrl;
        a.download = `scene-${index + 1}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }
  };

  return (
    <>
      {isFullscreen && (scene.imageUrl || scene.videoUrl) && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md" onClick={() => setIsFullscreen(false)}>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsFullscreen(false); }}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>
          {scene.videoUrl ? (
            <video src={scene.videoUrl} autoPlay loop controls className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
          ) : scene.imageUrl ? (
            <img src={scene.imageUrl} alt={scene.title} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
          ) : null}
        </div>
      )}

      <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden flex flex-col group hover:scale-[1.015] hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:border-indigo-500/50 transition-all duration-300 z-0 hover:z-10 relative">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
              {index + 1}
            </div>
            <h3 className="text-sm font-bold text-white">{scene.title || `Scene ${index + 1}`}</h3>
            {index > 0 && (
              <button
                onClick={() => onUpdate({ isContinuation: !scene.isContinuation })}
                className={`p-1 rounded-md transition-colors ml-2 ${scene.isContinuation ? 'bg-indigo-600/20 text-indigo-400' : 'text-white/20 hover:text-white/60'}`}
                title={scene.isContinuation ? "Continuation: ON (Will use previous scene as visual reference)" : "Continuation: OFF (Will not use previous scene as reference)"}
              >
                <LinkIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {(scene.imageUrl || scene.videoUrl) && (
              <button
                onClick={() => setIsFullscreen(true)}
                className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors"
                title="View Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}
            {scene.imageUrl && (
              <button
                onClick={handleDownload}
                className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors"
                title="Download Image"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
            <div className="relative">
              <button
                onClick={() => setShowRatioDropdown(!showRatioDropdown)}
                className="bg-white/10 hover:bg-white/20 border border-transparent rounded-md px-2 py-1 text-xs font-medium outline-none focus:border-indigo-500 text-white appearance-none cursor-pointer h-[28px] transition-colors flex items-center gap-1.5 min-w-[72px] justify-between"
                title="Scene Aspect Ratio (Overrides Project Default)"
              >
                <div className="flex items-center gap-1.5">
                  <div 
                    className="border border-white/70 rounded-[1px] opacity-80"
                    style={{
                      aspectRatio: (scene.aspectRatio || projectData.aspectRatio || '16:9').replace(':', '/'),
                      width: parseFloat((scene.aspectRatio || projectData.aspectRatio || '16:9').split(':')[0]) >= parseFloat((scene.aspectRatio || projectData.aspectRatio || '16:9').split(':')[1]) ? '12px' : undefined,
                      height: parseFloat((scene.aspectRatio || projectData.aspectRatio || '16:9').split(':')[0]) < parseFloat((scene.aspectRatio || projectData.aspectRatio || '16:9').split(':')[1]) ? '12px' : undefined,
                    }}
                  />
                  <span>{scene.aspectRatio || projectData.aspectRatio || '16:9'}</span>
                </div>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-white/50 transition-transform ${showRatioDropdown ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
              </button>
              
              {showRatioDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowRatioDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1.5 w-[180px] bg-[#151515] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="px-3 py-2 border-b border-white/5 bg-white/5">
                      <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Aspect Ratio</p>
                    </div>
                    <div className="p-1.5 max-h-[240px] overflow-y-auto custom-scrollbar flex flex-col gap-0.5">
                      {ASPECT_RATIOS.map((ratio) => {
                        const numW = parseFloat(ratio.value.split(':')[0]);
                        const numH = parseFloat(ratio.value.split(':')[1]);
                        const isHorizontal = numW > numH;
                        const isSquare = ratio.value === '1:1';
                        const currentRatio = scene.aspectRatio || projectData.aspectRatio || '16:9';
                        const isSelected = currentRatio === ratio.value;

                        return (
                          <button
                            key={ratio.value}
                            className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left text-xs transition-all ${
                              isSelected 
                                ? 'bg-indigo-500/15 text-indigo-300' 
                                : 'text-white/70 hover:bg-white/10 hover:text-white'
                            }`}
                            onClick={() => {
                              onUpdate({ aspectRatio: ratio.value as AspectRatio });
                              setShowRatioDropdown(false);
                            }}
                          >
                            <div className={`w-7 h-7 rounded flex items-center justify-center shrink-0 ${isSelected ? 'bg-indigo-500/20' : 'bg-black/40 border border-white/5'}`}>
                              <div 
                                className={`${isSelected ? 'bg-indigo-400 border border-indigo-400' : 'border-2 border-white/40'} rounded-[2px] transition-colors`}
                                style={{
                                  aspectRatio: ratio.value.replace(':', '/'),
                                  width: isHorizontal || isSquare ? '14px' : undefined,
                                  height: !isHorizontal && !isSquare ? '14px' : undefined,
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <span className={`block font-medium ${isSelected ? 'text-indigo-200' : 'text-white/90'}`}>{ratio.value}</span>
                              <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-indigo-400/70' : 'text-white/40'}`}>{ratio.desc}</span>
                            </div>
                            {isSelected && (
                              <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mr-1 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
            {scene.isGenerating || scene.isQueued ? (
              <button
                onClick={() => onStopGenerate && onStopGenerate()}
                className="p-1.5 bg-red-600 hover:bg-red-500 text-white rounded-md transition-colors"
                title="Stop Generation"
              >
                <XCircle className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => onGenerate()}
                className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition-colors"
                title="Generate Image"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div 
          className={`relative aspect-video bg-black/60 flex items-center justify-center overflow-hidden group/media ${(scene.imageUrl || scene.videoUrl) ? 'cursor-pointer' : ''}`}
          onClick={() => {
            if (scene.imageUrl || scene.videoUrl) setIsFullscreen(true);
          }}
        >
          {scene.videoUrl ? (
            <video src={scene.videoUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
          ) : scene.imageUrl ? (
            <img src={scene.imageUrl} alt={scene.title} className="w-full h-full object-cover transition-transform duration-500 group-hover/media:scale-105" />
          ) : (
            <div className="text-white/20 flex flex-col items-center gap-2">
              <ImageIcon className="w-8 h-8" />
              <span className="text-xs font-medium uppercase tracking-widest">No Media</span>
            </div>
          )}
          
          {(scene.imageUrl || scene.videoUrl) && (
            <div className="absolute inset-0 bg-black/0 group-hover/media:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover/media:opacity-100">
              <div className="bg-black/50 backdrop-blur-sm p-3 rounded-full text-white transform scale-90 group-hover/media:scale-100 transition-all">
                <Maximize2 className="w-6 h-6" />
              </div>
            </div>
          )}

          {scene.isGenerating && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest animate-pulse">Generating Image...</span>
            </div>
          )}
          {scene.isQueued && !scene.isGenerating && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
              <RefreshCw className="w-8 h-8 text-white/40 animate-spin" />
              <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Queued...</span>
            </div>
          )}
          {scene.isGeneratingVideo && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest animate-pulse">Generating Video...</span>
            </div>
          )}
        </div>

      <div className="p-4 space-y-4 flex-1 flex flex-col">
        {((scene.songSection || scene.emotionalTone) || (projectData.characters && projectData.characters.length > 0)) && (
          <div className="flex flex-col gap-2 mb-2">
            {(scene.songSection || scene.emotionalTone) && (
              <div className="flex flex-wrap gap-2">
                {scene.songSection && (
                  <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider rounded-md">
                    {scene.songSection}
                  </span>
                )}
                {scene.emotionalTone && (
                  <span className="px-2 py-1 bg-rose-500/20 text-rose-300 text-[10px] font-bold uppercase tracking-wider rounded-md">
                    {scene.emotionalTone}
                  </span>
                )}
              </div>
            )}
            
            {projectData.characters && projectData.characters.length > 0 && (
              <div className="space-y-1.5 mt-2">
                <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Active Characters in Scene</label>
                <div className="flex flex-wrap gap-1.5">
                  {projectData.characters.map(char => {
                    const isDisabled = scene.disabledCharacterIds?.includes(char.id);
                    return (
                      <button 
                        key={char.id}
                        onClick={() => {
                            const newDisabled = isDisabled 
                                ? (scene.disabledCharacterIds || []).filter(id => id !== char.id)
                                : [...(scene.disabledCharacterIds || []), char.id];
                            onUpdate({ disabledCharacterIds: newDisabled });
                        }}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-all flex items-center gap-1.5 ${
                          isDisabled ? 'bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 hover:text-white/60' : 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/30'
                        }`}
                        title={isDisabled ? `Click to re-enable ${char.name} for this scene` : `Click to disable ${char.name} for this scene`}
                      >
                         <div className={`w-1.5 h-1.5 rounded-full ${isDisabled ? 'bg-white/20' : 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]'}`} />
                        {char.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
              <ImageIcon className="w-3 h-3" /> Image Prompt
            </label>
            <div className="flex items-center gap-1">
              <button onClick={handleCopyImagePrompt} className="p-1 text-white/40 hover:text-indigo-400 transition-colors" title="Copy Prompt">
                {copiedImage ? <CheckCheck className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              </button>
              <button onClick={onEnhance} disabled={scene.isEnhancing} className="p-1 text-white/40 hover:text-indigo-400 transition-colors" title="Enhance Prompt">
                {scene.isEnhancing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
              </button>
              {isEditingImagePrompt ? (
                <button onClick={handleSaveImagePrompt} className="p-1 text-green-400 hover:text-green-300 transition-colors">
                  <Check className="w-3 h-3" />
                </button>
              ) : (
                <button onClick={() => setIsEditingImagePrompt(true)} className="p-1 text-white/40 hover:text-white transition-colors">
                  <Edit3 className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
          {isEditingImagePrompt ? (
            <textarea
              value={tempImagePrompt}
              onChange={(e) => setTempImagePrompt(e.target.value)}
              onFocus={(e) => {
                setTimeout(() => {
                  e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
              }}
              onInput={(e) => {
                const target = e.currentTarget;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
              }}
              style={{ minHeight: '160px' }}
              className="w-full shrink-0 bg-black/50 border border-indigo-500/50 rounded-lg p-3 text-sm text-white outline-none resize-none overflow-hidden focus:ring-2 focus:ring-indigo-500"
            />
          ) : (
            <p className="text-xs text-white/70 leading-relaxed line-clamp-4">{scene.imagePrompt}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
              <Film className="w-3 h-3" /> Motion Prompt
            </label>
            <div className="flex items-center gap-1">
              <button onClick={handleCopyVideoPrompt} className="p-1 text-white/40 hover:text-indigo-400 transition-colors" title="Copy Prompt">
                {copiedVideo ? <CheckCheck className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              </button>
              <button onClick={onEnhanceVideo} disabled={scene.isEnhancingVideo} className="p-1 text-white/40 hover:text-indigo-400 transition-colors" title="Enhance Motion Prompt">
                {scene.isEnhancingVideo ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
              </button>
              {isEditingVideoPrompt ? (
                <button onClick={handleSaveVideoPrompt} className="p-1 text-green-400 hover:text-green-300 transition-colors">
                  <Check className="w-3 h-3" />
                </button>
              ) : (
                <button onClick={() => setIsEditingVideoPrompt(true)} className="p-1 text-white/40 hover:text-white transition-colors">
                  <Edit3 className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
          {isEditingVideoPrompt ? (
            <textarea
              value={tempVideoPrompt}
              onChange={(e) => setTempVideoPrompt(e.target.value)}
              onFocus={(e) => {
                setTimeout(() => {
                  e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
              }}
              onInput={(e) => {
                const target = e.currentTarget;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
              }}
              style={{ minHeight: '120px' }}
              className="w-full shrink-0 bg-black/50 border border-indigo-500/50 rounded-lg p-3 text-sm text-white outline-none resize-none overflow-hidden focus:ring-2 focus:ring-indigo-500"
            />
          ) : (
            <p className="text-xs text-white/70 leading-relaxed">{scene.videoMotionPrompt}</p>
          )}
        </div>
      </div>
    </div>
    </>
  );
};
