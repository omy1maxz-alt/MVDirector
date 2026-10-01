export interface SubtitleBlock {
  id: string;
  start: number; // in milliseconds
  end: number;
  text: string;
  isLocked?: boolean;
}

const timeToMs = (timeStr: string): number => {
  if (!timeStr) return 0;
  const cleanStr = timeStr.trim().replace(',', '.');
  const [time, msStr] = cleanStr.split('.');
  const parts = time.split(':');
  let seconds = 0;
  if (parts.length === 3) {
    seconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
  } else if (parts.length === 2) {
    seconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
  } else {
    seconds = parseInt(parts[0]) || 0;
  }
  return (seconds * 1000) + (msStr ? parseInt(msStr.padEnd(3, '0').substring(0, 3)) : 0);
};

export const msToSrtTime = (ms: number): string => {
  const h = Math.floor(ms / 3600000).toString().padStart(2, '0');
  const m = Math.floor((ms % 3600000) / 60000).toString().padStart(2, '0');
  const s = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
  const ml = Math.floor(ms % 1000).toString().padStart(3, '0');
  return `${h}:${m}:${s},${ml}`;
};

export const msToVttTime = (ms: number): string => {
  const h = Math.floor(ms / 3600000).toString().padStart(2, '0');
  const m = Math.floor((ms % 3600000) / 60000).toString().padStart(2, '0');
  const s = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
  const ml = Math.floor(ms % 1000).toString().padStart(3, '0');
  return h === '00' ? `${m}:${s}.${ml}` : `${h}:${m}:${s}.${ml}`;
};

export const parseSubtitles = (content: string): SubtitleBlock[] => {
  const blocks: SubtitleBlock[] = [];
  // Normalize newlines
  const text = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  // Split by double newlines to get blocks
  const chunks = text.split(/\n\n+/);
  
  for (const chunk of chunks) {
    const lines = chunk.trim().split('\n');
    if (lines.length < 2) continue;
    
    // Find the line with the timestamp
    let timeLineIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('-->')) {
        timeLineIdx = i;
        break;
      }
    }
    
    if (timeLineIdx === -1) continue;
    
    const [startStr, endStr] = lines[timeLineIdx].split('-->').map(s => s.trim());
    
    // Text is everything after the timeline
    const textLines = lines.slice(timeLineIdx + 1);
    
    // Ignore WEBVTT header or other non-subtitle blocks
    if (startStr && endStr) {
        blocks.push({
          id: Math.random().toString(36).substring(7),
          start: timeToMs(startStr),
          end: timeToMs(endStr),
          text: textLines.join('\n').trim()
        });
    }
  }
  
  return blocks.sort((a, b) => a.start - b.start);
};

export const generateSrt = (blocks: SubtitleBlock[]): string => {
  return blocks.map((block, index) => {
    return `${index + 1}\n${msToSrtTime(block.start)} --> ${msToSrtTime(block.end)}\n${block.text}\n`;
  }).join('\n');
};

export const generateVtt = (blocks: SubtitleBlock[]): string => {
  let vtt = 'WEBVTT\n\n';
  vtt += blocks.map(block => {
    return `${msToVttTime(block.start)} --> ${msToVttTime(block.end)}\n${block.text}\n`;
  }).join('\n');
  return vtt;
};
