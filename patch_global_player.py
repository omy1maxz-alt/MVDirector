import re

with open('src/components/App.tsx', 'r') as f:
    content = f.read()

# The target is the <audio block starting at line 2076
target = """                        <audio 
                            ref={audioRef}
                            controls 
                            src={projectData.soundtrackUrl} 
                            className="w-full h-10"
                            onEnded={() => {"""

replacement = """                        {projectData.localFiles?.[projectData.currentTrackIndex || 0]?.type.includes('video') ? (
                            <video
                                ref={audioRef as any}
                                controls
                                src={projectData.soundtrackUrl}
                                className={`w-full ${showVideo ? 'h-[360px]' : 'h-[120px]'} object-contain`}
                                onEnded={() => {
                                    if (projectData.localPlaylist && projectData.currentTrackIndex !== undefined) {
                                        const nextIndex = (projectData.currentTrackIndex + 1) % projectData.localPlaylist.length;
                                        setProjectData(p => ({ ...p, soundtrackUrl: p.localPlaylist![nextIndex].url, currentTrackIndex: nextIndex }));
                                    }
                                }}
                                onPlay={() => {
                                    setIsPlaying(true);
                                    if ('mediaSession' in navigator) {
                                        navigator.mediaSession.metadata = new MediaMetadata({
                                            title: projectData.localPlaylist ? projectData.localPlaylist[projectData.currentTrackIndex || 0].name : 'MV Director Soundtrack',
                                            artist: 'Local File',
                                            album: 'AI Studio'
                                        });
                                    }
                                }}
                                onPause={() => setIsPlaying(false)}
                            />
                        ) : (
                        <audio 
                            ref={audioRef}
                            controls 
                            src={projectData.soundtrackUrl} 
                            className="w-full h-10"
                            onEnded={() => {"""

if target in content:
    content = content.replace(target, replacement)
    
    # We also need to balance the curly brace at the end of the original <audio> tag.
    # The original audio tag ended like this:
    #                             }}
    #                             onPause={() => setIsPlaying(false)}
    #                         />
    
    # Let's find that closing part
    close_target = """                            onPause={() => setIsPlaying(false)}
                        />"""
    close_replacement = """                            onPause={() => setIsPlaying(false)}
                        />
                        )}"""
    
    # Actually wait, we should do a regex replace to be safer, or just find the exact block.
