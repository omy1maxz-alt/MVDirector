const fs = require('fs');
let content = fs.readFileSync('src/components/SubtitleTimelineEditor.tsx', 'utf-8');

// 1. Update dragState interface
const oldDragState = `    const dragState = useRef<{
        type: 'move' | 'start' | 'end' | 'scrub' | null;`;
const newDragState = `    const dragState = useRef<{
        type: 'move' | 'sync_move' | 'start' | 'end' | 'scrub' | null;`;
content = content.replace(oldDragState, newDragState);

// 2. Update handlePointerDown signature and body
const oldPointerDown1 = `const handlePointerDown = (e: React.PointerEvent, type: 'move'|'start'|'end'|'scrub'|'select_scrub', id?: string, block?: SubtitleBlock) => {`;
const newPointerDown1 = `const handlePointerDown = (e: React.PointerEvent, type: 'move'|'sync_move'|'start'|'end'|'scrub'|'select_scrub', id?: string, block?: SubtitleBlock) => {`;
content = content.replace(oldPointerDown1, newPointerDown1);

const oldPointerDown2 = `            if (type === 'move' || type === 'start' || type === 'end') {
                setDraggingId(id);
                dragState.current = { type, id, startX: e.clientX, initStart: block.start, initEnd: block.end, target, pointerId: e.pointerId, initialBlocks: blocksState };
            } else if (type === 'select_scrub') {`;
const newPointerDown2 = `            if (type === 'move' || type === 'sync_move' || type === 'start' || type === 'end') {
                setDraggingId(id);
                dragState.current = { type, id, startX: e.clientX, initStart: block.start, initEnd: block.end, target, pointerId: e.pointerId, initialBlocks: blocksState };
            } else if (type === 'select_scrub') {`;
content = content.replace(oldPointerDown2, newPointerDown2);

// 3. Update handlePointerMove body
const oldMoveBody = `            // Check if we're dragging the first block (by checking initialBlocks)
            const sortedInitial = [...initialBlocks].sort((a, b) => a.start - b.start);
            const isFirstBlock = sortedInitial.length > 0 && sortedInitial[0].id === id;
            
            if (isFirstBlock && type === 'move') {
                const newFirstStart = Math.max(0, initStart + deltaMs);
                const allowedShift = newFirstStart - initStart;
                
                if (allowedShift === 0 && deltaMs === 0) return prev;
                
                return initialBlocks.map(block => ({
                    ...block,
                    start: block.start + allowedShift,
                    end: block.end + allowedShift
                })).sort((a, b) => a.start - b.start);
            }
            
            // Standard drag
            return prev.map(block => {`;

const newMoveBody = `            // Ripple Sync Drag (Moves this block and all following blocks)
            if (type === 'sync_move') {
                const newFirstStart = Math.max(0, initStart + deltaMs);
                const allowedShift = newFirstStart - initStart;
                
                if (allowedShift === 0 && deltaMs === 0) return prev;
                
                return initialBlocks.map(block => {
                    // Only shift blocks that start at or after the dragged block's initial start
                    if (block.start >= initStart) {
                        return {
                            ...block,
                            start: block.start + allowedShift,
                            end: block.end + allowedShift
                        };
                    }
                    return block;
                }).sort((a, b) => a.start - b.start);
            }
            
            // Standard drag
            return prev.map(block => {`;
content = content.replace(oldMoveBody, newMoveBody);

// 4. Update the handle rendering
const oldTopTab = `                                    {/* Move Handle (Top Tab) */}
                                    {isSelected && (
                                        <div 
                                            className="absolute -top-7 left-1/2 -translate-x-1/2 bg-amber-500 rounded-t-lg px-3 py-1 cursor-grab active:cursor-grabbing z-30 flex items-center justify-center touch-none shadow-md border-x border-t border-amber-400"
                                            onPointerDown={(e) => handlePointerDown(e, 'move', block.id, block)}
                                        >
                                            <GripHorizontal className="w-4 h-4 text-black" pointerEvents="none" />
                                        </div>
                                    )}`;

const newTopTab = `                                    {/* Move Handles (Top Tabs) */}
                                    {isSelected && (
                                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center shadow-md border border-amber-400 rounded-t-lg overflow-hidden z-30 h-7">
                                            <div 
                                                className={\`bg-amber-500 px-3 h-full cursor-grab active:cursor-grabbing flex items-center justify-center touch-none hover:bg-amber-400 transition-colors\`}
                                                title="Normal Drag (Move only this box)"
                                                onPointerDown={(e) => handlePointerDown(e, 'move', block.id, block)}
                                            >
                                                <GripHorizontal className="w-4 h-4 text-black" pointerEvents="none" />
                                            </div>
                                            <div className="w-px h-full bg-amber-600"></div>
                                            <div 
                                                className={\`bg-indigo-500 px-3 h-full cursor-grab active:cursor-grabbing flex items-center justify-center touch-none hover:bg-indigo-400 transition-colors border-l border-white/20\`}
                                                title="Sync Drag (Moves this box and all following boxes)"
                                                onPointerDown={(e) => handlePointerDown(e, 'sync_move', block.id, block)}
                                            >
                                                <ListTree className="w-4 h-4 text-white" pointerEvents="none" />
                                            </div>
                                        </div>
                                    )}`;
content = content.replace(oldTopTab, newTopTab);

// Update imports to include ListTree
const oldImports = `import { Upload, Download, Split, Copy, Trash2, Plus, Play, Pause, RotateCcw, RotateCw, ZoomIn, ZoomOut, Type, X, Edit2, GripHorizontal, Camera, Settings, Maximize, Clock } from 'lucide-react';`;
const newImports = `import { Upload, Download, Split, Copy, Trash2, Plus, Play, Pause, RotateCcw, RotateCw, ZoomIn, ZoomOut, Type, X, Edit2, GripHorizontal, Camera, Settings, Maximize, Clock, ListTree } from 'lucide-react';`;
content = content.replace(oldImports, newImports);

fs.writeFileSync('src/components/SubtitleTimelineEditor.tsx', content);
console.log("Updated sync drag logic and UI");
