const fs = require('fs');
let content = fs.readFileSync('src/components/SubtitleTimelineEditor.tsx', 'utf-8');

const oldUpdate = `        updateBlocks(prev => {
            return prev.map(block => {
                if (block.id !== id) return block;
                let newStart = block.start;
                let newEnd = block.end;
                const MIN_DURATION = 100;
                
                if (type === 'move') {
                    const blockDuration = initEnd - initStart;
                    newStart = Math.max(0, initStart + deltaMs);
                    newEnd = newStart + blockDuration;
                } else if (type === 'start') {
                    newStart = Math.max(0, Math.min(initEnd - MIN_DURATION, initStart + deltaMs));
                } else if (type === 'end') {
                    newEnd = Math.max(initStart + MIN_DURATION, initEnd + deltaMs);
                }
                
                return { ...block, start: newStart, end: newEnd };
            }).sort((a, b) => a.start - b.start);
        });`;

const newUpdate = `        updateBlocks(prev => {
            const sortedPrev = [...prev].sort((a, b) => a.start - b.start);
            const isFirstBlock = sortedPrev.length > 0 && sortedPrev[0].id === id;
            
            if (isFirstBlock && type === 'move') {
                const targetBlock = sortedPrev[0];
                const newStart = Math.max(0, initStart + deltaMs);
                const actualShift = newStart - targetBlock.start;
                
                if (actualShift === 0) return prev;
                
                return sortedPrev.map(block => ({
                    ...block,
                    start: block.start + actualShift,
                    end: block.end + actualShift
                }));
            }
            
            return prev.map(block => {
                if (block.id !== id) return block;
                let newStart = block.start;
                let newEnd = block.end;
                const MIN_DURATION = 100;
                
                if (type === 'move') {
                    const blockDuration = initEnd - initStart;
                    newStart = Math.max(0, initStart + deltaMs);
                    newEnd = newStart + blockDuration;
                } else if (type === 'start') {
                    newStart = Math.max(0, Math.min(initEnd - MIN_DURATION, initStart + deltaMs));
                } else if (type === 'end') {
                    newEnd = Math.max(initStart + MIN_DURATION, initEnd + deltaMs);
                }
                
                return { ...block, start: newStart, end: newEnd };
            }).sort((a, b) => a.start - b.start);
        });`;

content = content.replace(oldUpdate, newUpdate);
fs.writeFileSync('src/components/SubtitleTimelineEditor.tsx', content);
console.log("Updated handlePointerMove");
