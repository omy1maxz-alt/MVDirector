const fs = require('fs');
let content = fs.readFileSync('src/components/SubtitleTimelineEditor.tsx', 'utf-8');

// 1. Add state
const selectedIdDecl = `const [selectedId, setSelectedId] = useState<string | null>(null);`;
content = content.replace(selectedIdDecl, `${selectedIdDecl}\n    const [draggingId, setDraggingId] = useState<string | null>(null);`);

// 2. Set state on pointer down
const oldPointerDown = `            if (type === 'move' || type === 'start' || type === 'end') {
                dragState.current = { type, id, startX: e.clientX, initStart: block.start, initEnd: block.end, target, pointerId: e.pointerId, initialBlocks: blocksState };
            } else if (type === 'select_scrub') {`;
            
const newPointerDown = `            if (type === 'move' || type === 'start' || type === 'end') {
                setDraggingId(id);
                dragState.current = { type, id, startX: e.clientX, initStart: block.start, initEnd: block.end, target, pointerId: e.pointerId, initialBlocks: blocksState };
            } else if (type === 'select_scrub') {`;

content = content.replace(oldPointerDown, newPointerDown);

// 3. Clear state on pointer up
const oldPointerUp = `        dragState.current = { type: null, id: null, startX: 0, initStart: 0, initEnd: 0, initialBlocks: [] };
        document.removeEventListener('pointermove', handlePointerMove);`;

const newPointerUp = `        dragState.current = { type: null, id: null, startX: 0, initStart: 0, initEnd: 0, initialBlocks: [] };
        setDraggingId(null);
        document.removeEventListener('pointermove', handlePointerMove);`;

content = content.replace(oldPointerUp, newPointerUp);

// 4. Update the render logic
const oldRender = `                        {blocks.map(block => {
                            const isSelected = block.id === selectedId;
                            const left = (block.start / 1000) * activeZoom;
                            const width = ((block.end - block.start) / 1000) * activeZoom;
                            
                            return (
                                <div 
                                    key={block.id}
                                    className={\`absolute h-12 rounded-md shadow-md flex items-center overflow-hidden transition-colors cursor-pointer touch-none box-border
                                        \${isSelected ? 'bg-amber-500/20 border-y-2 border-amber-400 z-20' : 'bg-amber-600/80 border border-amber-500/50 hover:bg-amber-500'}
                                    \`}`;

const newRender = `                        {blocks.map(block => {
                            const isSelected = block.id === selectedId;
                            const isDragging = block.id === draggingId;
                            const left = (block.start / 1000) * activeZoom;
                            const width = ((block.end - block.start) / 1000) * activeZoom;
                            
                            return (
                                <div 
                                    key={block.id}
                                    className={\`absolute h-12 rounded-md shadow-md flex items-center overflow-hidden transition-colors cursor-pointer touch-none box-border
                                        \${isDragging ? 'bg-green-500/30 border-y-2 border-green-400 z-30' : 
                                          isSelected ? 'bg-amber-500/20 border-y-2 border-amber-400 z-20' : 
                                          'bg-amber-600/80 border border-amber-500/50 hover:bg-amber-500'}
                                    \`}`;

content = content.replace(oldRender, newRender);

fs.writeFileSync('src/components/SubtitleTimelineEditor.tsx', content);
console.log("Updated dragging colors!");
