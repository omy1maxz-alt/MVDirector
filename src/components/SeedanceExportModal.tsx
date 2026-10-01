import React, { useState, useEffect, useRef } from 'react';
import { X, Download, Copy, Check, LayoutGrid } from 'lucide-react';
import { Scene, ProjectData } from '@/types';
import { generateSingleImage } from '@/services/gemini';

interface SeedanceExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenes: Scene[];
  projectData: ProjectData;
  apiKey?: string;
}

export function SeedanceExportModal({ isOpen, onClose, scenes, projectData, apiKey }: SeedanceExportModalProps) {
  const [gridSize, setGridSize] = useState<number>(4); // 4 = 2x2, 9 = 3x3, 16 = 4x4
  const [videoDuration, setVideoDuration] = useState<number>(10);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [promptStyle, setPromptStyle] = useState<'standard' | 'advanced'>('advanced');
  const [isGeneratingGrid, setIsGeneratingGrid] = useState(false);
  const [isEditingGrid, setIsEditingGrid] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [gridDataUrl, setGridDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const availableImages = scenes.filter(s => s.imageUrl);
  const imagesWithUrls = availableImages.slice(startIndex, startIndex + gridSize);

  // Generate the prompt based on selected scenes
  const generatePrompt = () => {
    if (imagesWithUrls.length === 0) return '';
    
    const durationPerScene = (videoDuration / imagesWithUrls.length).toFixed(1);
    
    const panels = imagesWithUrls.map((s, i) => {
        const startTime = (i * parseFloat(durationPerScene)).toFixed(1);
        let endTime = ((i + 1) * parseFloat(durationPerScene)).toFixed(1);
        if (i === imagesWithUrls.length - 1) endTime = videoDuration.toFixed(1);
        
        let motionDesc = s.videoMotionPrompt || s.imagePrompt || '';
        
        // Remove specific character names to prevent confusing Seedance
        if (projectData.characters && projectData.characters.length > 0) {
            projectData.characters.forEach((char, charIndex) => {
                if (char.name && char.name.trim().length > 0) {
                    // Create a case-insensitive regex for the character name
                    try {
                       const regex = new RegExp(char.name, 'gi');
                       const replacement = projectData.characters!.length > 1 ? `Subject ${charIndex + 1}` : 'the subject';
                       motionDesc = motionDesc.replace(regex, replacement);
                    } catch (e) {
                       // Fallback in case name has weird regex characters
                       const replacement = projectData.characters!.length > 1 ? `Subject ${charIndex + 1}` : 'the subject';
                       motionDesc = motionDesc.split(char.name).join(replacement);
                    }
                }
            });
        }
        
        return `${startTime}s–${endTime}s\n[${s.title || 'Scene ' + (startIndex + i + 1)}]\n${motionDesc}`;
    }).join('\n\n');

    if (promptStyle === 'advanced') {
      const charLock = projectData.characters?.length > 0 
        ? projectData.characters.map((c, i) => `${projectData.characters!.length > 1 ? `Subject ${i + 1}: ` : ''}${c.name || 'A consistent person'}`).join('\n')
        : 'Maintain consistent character identity and appearance in every shot.';
      
      const envLock = projectData.creativeContext || 'Authentic environment matching the visual style.';

      return `TITLE
${(projectData as any).title || 'Cinematic Sequence'}

GOAL
Create a single uninterrupted ${videoDuration}-second video that feels authentic and believable. Prioritize realism over perfection. Every movement, camera imperfection, environmental detail, and human behavior should feel completely natural. Reference the uploaded storyboard grid image to guide the sequence.

CHARACTER LOCK
${charLock}

Maintain the exact same facial identity, hairstyle, body proportions, clothing, accessories, age, and overall appearance in every shot. Never change outfits, hairstyle, facial features, or body shape.

ENVIRONMENT LOCK
${envLock}

VISUAL STYLE
Ultra-realistic documentary realism.
Natural body language.
Genuine candid behavior.
Subtle facial expressions.
Real-world imperfections.
Slice-of-life atmosphere.
Nothing should feel posed, rehearsed, cinematic, or artificially dramatic.

CAMERA STYLE
Authentic consumer camcorder/smartphone feel.
The camera operator behaves like a close friend casually recording everyday moments without directing the subject.
Characteristics: Handheld shake, slightly imperfect framing, frequent autofocus hunting, exposure pumping, mild rolling shutter, natural zoom hesitation.
No Hollywood composition or modern color grading.

LIGHTING
Entirely natural lighting.
Natural brightness variations.
No artificial studio lighting.

SHOT LIST (${videoDuration}s)

${panels}

AUDIO
Natural location audio only.
Soft ambience.
No music. No narration. No cinematic sound effects.

PRODUCTION CONSTRAINTS
Treat the entire video as one continuous recording.
Maintain identical character identity, lighting conditions, and documentary style throughout the video.
Avoid visual glitches, facial drift, wardrobe changes, hairstyle changes, duplicated people, teleportation, abrupt scene resets, or modern smartphone video aesthetics.`;
    }

    return `Create a ${videoDuration}-second cinematic sequence. Reference the uploaded storyboard grid image. Animate each panel in sequence following these actions and maintain exact character consistency.

Story Flow (${videoDuration}s)

${panels}

Editing Style
* Fast transitions
* Cinematic camera movement
* Match cuts
* Natural jump cuts
* High realism
* Consistent identity across every scene
* ${projectData.aspectRatio} aspect ratio`;
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatePrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  
  const handleDownloadGrid = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!gridDataUrl) return;
    const filename = `storyboard_grid_${gridSize}_${((projectData as any).title || 'project').replace(/\s+/g, '_')}.png`;
    try {
      const response = await fetch(gridDataUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      // Fallback
      const a = document.createElement('a');
      a.href = gridDataUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleEditGrid = async () => {
    if (!gridDataUrl) return;
    setIsEditingGrid(true);
    setEditError(null);
    try {
      const editPrompt = "Masterful realistic pencil sketch artwork on high-quality textured drawing paper, created with professional graphite pencils (HB, 2B, 4B, 6B, and 8B) combined with charcoal and blending stumps for rich tonal range. Intricate hatching, cross-hatching, and stippling techniques with visible pencil strokes, smooth gradients, and delicate shading that builds incredible depth and dimensionality. Subtle paper texture and tooth visible, light smudging for soft transitions, precise line work with varying pressure for expressive edges. Highly detailed, hyperrealistic pencil rendering with lifelike textures: individual skin pores suggested through fine shading, realistic hair strands with varying thickness and highlights, fabric folds with accurate drapery shading, and environmental elements drawn with masterful control. Dramatic yet controlled value contrast — deep rich blacks, luminous highlights achieved through negative space and eraser techniques, mid-tones with beautiful gradation. Professional fine art illustration style, reminiscent of classical graphite masters like Leonardo da Vinci studies or modern hyperrealistic pencil artists. Soft, even studio lighting or directional side lighting to emphasize three-dimensional form and cast gentle shadows. Clean composition with strong focal point, elegant negative space, and artistic framing. Slight paper imperfections and graphite dust for authenticity. Ultra-detailed 8K resolution, masterpiece pencil drawing, best quality, museum-level realism in graphite medium.";
      const editedUrl = await generateSingleImage(
        editPrompt, 
        projectData.aspectRatio || '16:9', 
        null, 
        gridDataUrl, 
        projectData, 
        apiKey, 
        (msg) => console.log(msg)
      );
      setGridDataUrl(editedUrl);
    } catch (e: any) {
      console.error("Failed to edit grid", e);
      setEditError(e.message || "Failed to edit grid");
    } finally {
      setIsEditingGrid(false);
    }
  };

  const handleGenerateGrid = async () => {
    if (imagesWithUrls.length === 0) return;
    setIsGeneratingGrid(true);

    try {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Determine grid layout (e.g. 2x2 for 4, 3x3 for 9)
        const cols = Math.ceil(Math.sqrt(gridSize));
        const rows = Math.ceil(gridSize / cols);

        // Standardize resolution per cell based on global aspect ratio. 
        // Let's use a decent resolution, e.g., 512 max dimension per cell.
        let cellW = 512;
        let cellH = 512;
        const ratioMap: Record<string, [number, number]> = {
            '16:9': [16, 9], '9:16': [9, 16], '1:1': [1, 1], '4:3': [4, 3], '3:4': [3, 4], '21:9': [21, 9]
        };
        const [rw, rh] = ratioMap[projectData.aspectRatio] || [16, 9];
        
        if (rw > rh) {
            cellH = Math.round((cellW / rw) * rh);
        } else {
            cellW = Math.round((cellH / rh) * rw);
        }

        const borderSize = 4;
        const textHeight = 40;
        const totalCellW = cellW + borderSize * 2;
        const totalCellH = cellH + borderSize * 2 + textHeight;

        canvas.width = totalCellW * cols;
        canvas.height = totalCellH * rows;

        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Load images
        const loadedImages = await Promise.all(imagesWithUrls.map(scene => {
            return new Promise<HTMLImageElement>((resolve) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => resolve(img);
                img.onerror = () => {
                    // Fallback to empty image on error to not break the grid
                    const fallbackImg = new Image();
                    fallbackImg.onload = () => resolve(fallbackImg);
                    fallbackImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; 
                };
                img.src = scene.imageUrl!;
            });
        }));

        loadedImages.forEach((img, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = col * totalCellW + borderSize;
            const y = row * totalCellH + borderSize;

            // Draw border
            ctx.fillStyle = '#000000';
            ctx.fillRect(col * totalCellW, row * totalCellH, totalCellW, totalCellH);
            
            // Draw inner background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x, y, cellW, cellH + textHeight);

            // Draw image (scaled to fit and center)
            const imgRatio = img.width / img.height;
            const cellRatio = cellW / cellH;
            let drawW = cellW;
            let drawH = cellH;
            let drawX = x;
            let drawY = y;

            if (imgRatio > cellRatio) {
                drawH = cellW / imgRatio;
                drawY = y + (cellH - drawH) / 2;
            } else {
                drawW = cellH * imgRatio;
                drawX = x + (cellW - drawW) / 2;
            }

            ctx.drawImage(img, drawX, drawY, drawW, drawH);

            // Draw number and text
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 24px sans-serif';
            ctx.fillText((i + 1).toString(), x + 10, y + 30);

            // Caption
            ctx.fillStyle = '#333333';
            ctx.font = '14px sans-serif';
            const caption = imagesWithUrls[i].title || 'Scene ' + (i + 1);
            ctx.fillText(caption.substring(0, Math.floor(cellW / 10)) + (caption.length > Math.floor(cellW / 10) ? '...' : ''), x + 5, y + cellH + 25);
        });

        setGridDataUrl(canvas.toDataURL('image/png'));
    } catch (e) {
        console.error("Failed to generate grid", e);
    } finally {
        setIsGeneratingGrid(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
        setGridDataUrl(null);
    }
  }, [isOpen, gridSize, startIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto custom-scrollbar">
      <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col my-auto relative">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <LayoutGrid className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Seedance Storyboard Grid</h2>
              <p className="text-xs text-white/50 font-mono">Stitch frames for multi-panel video generation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 flex flex-col md:flex-row gap-6 min-h-0">
          {/* Controls & Prompt */}
          <div className="w-full md:w-1/3 flex flex-col gap-4">
             <div className="flex gap-4">
               <div className="flex-1">
                 <label className="block text-xs font-bold text-white/60 mb-2 uppercase tracking-wider">Grid Size</label>
                 <select 
                   className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                   value={gridSize}
                   onChange={(e) => {
                     setGridSize(Number(e.target.value));
                     setStartIndex(0);
                   }}
                 >
                    <option value={4}>2x2 (4 frames)</option>
                    <option value={9}>3x3 (9 frames)</option>
                    <option value={16}>4x4 (16 frames)</option>
                 </select>
               </div>

               <div className="flex-1">
                 <label className="block text-xs font-bold text-white/60 mb-2 uppercase tracking-wider">Start At</label>
                 <select 
                   className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                   value={startIndex}
                   onChange={(e) => setStartIndex(Number(e.target.value))}
                 >
                    {Array.from({ length: Math.max(1, availableImages.length - gridSize + 1) }).map((_, i) => (
                      <option key={i} value={i}>Scene {i + 1}</option>
                    ))}
                 </select>
               </div>
               
               <div className="w-24">
                 <label className="block text-xs font-bold text-white/60 mb-2 uppercase tracking-wider">Duration</label>
                 <select 
                   className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                   value={videoDuration}
                   onChange={(e) => setVideoDuration(Number(e.target.value))}
                 >
                    <option value={5}>5s</option>
                    <option value={10}>10s</option>
                    <option value={15}>15s</option>
                 </select>
               </div>
             </div>
             
             <div>
               <label className="block text-xs font-bold text-white/60 mb-2 uppercase tracking-wider">Prompt Structure</label>
               <select 
                 className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                 value={promptStyle}
                 onChange={(e) => setPromptStyle(e.target.value as 'standard' | 'advanced')}
               >
                  <option value="standard">Standard (Fast, Direct)</option>
                  <option value="advanced">Documentary (Highly Structured)</option>
               </select>
               <div className="flex justify-between items-center mt-2">
                 <p className="text-xs text-white/40">Images used: {imagesWithUrls.length} / {gridSize} (Total: {availableImages.length})</p>
                 {videoDuration > 10 && <p className="text-[10px] text-yellow-400/80 bg-yellow-400/10 px-1.5 py-0.5 rounded">Check Seedance duration limits</p>}
               </div>
             </div>

             <div className="mt-4 flex-1 flex flex-col">
               <div className="flex items-center justify-between mb-2">
                 <label className="block text-xs font-bold text-white/60 uppercase tracking-wider">Seedance Prompt</label>
                 <button onClick={handleCopyPrompt} className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300">
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} Copy
                 </button>
               </div>
               <textarea 
                 readOnly 
                 value={generatePrompt()}
                 className="w-full flex-1 bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white/70 font-mono resize-none focus:outline-none custom-scrollbar min-h-[150px]"
               />
             </div>
             
             <button
               onClick={handleGenerateGrid}
               disabled={isGeneratingGrid || imagesWithUrls.length === 0}
               className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold text-sm transition-colors mt-2"
             >
               {isGeneratingGrid ? 'Stitching Grid...' : 'Generate Grid Image'}
             </button>
          </div>

          {/* Preview */}
          <div className="w-full md:w-2/3 bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center min-h-[300px]">
             {gridDataUrl ? (
                 <div className="flex flex-col items-center gap-4">
                     <img src={gridDataUrl} alt="Storyboard Grid" className="max-w-full max-h-[50vh] object-contain rounded border border-white/20 shadow-lg" />
                     
                     <div className="flex flex-wrap justify-center gap-4">
                       <button onClick={handleDownloadGrid} 
                          
                         
                         className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold text-white transition-colors"
                       >
                          <Download className="w-4 h-4" /> Download
                       </button>
                       <button
                         onClick={handleEditGrid}
                         disabled={isEditingGrid}
                         className="flex items-center gap-2 px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 disabled:opacity-50 text-purple-200 rounded-lg text-sm font-bold transition-colors"
                       >
                         {isEditingGrid ? 'Applying Style...' : '✏️ Apply Pencil Sketch Style'}
                       </button>
                     </div>
                     {editError && <div className="text-red-400 text-xs mt-2">{editError}</div>}

                 </div>
             ) : (
                 <div className="text-center">
                    <LayoutGrid className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-sm text-white/40">Click "Generate Grid Image" to preview</p>
                    <p className="text-xs text-white/30 mt-1">Stitches the first {gridSize} available scenes into one image.</p>
                 </div>
             )}
          </div>
        </div>

        {/* Hidden Canvas */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
