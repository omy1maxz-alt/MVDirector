import React, { useState, useMemo } from 'react';
import { ProjectData, DirectorPlan } from '@/types';
import { Search, Image as ImageIcon, Music, Film, Folder, File, HardDrive, ChevronRight } from 'lucide-react';

interface XploreTabProps {
    projectData: ProjectData;
    directorPlan: DirectorPlan | null;
}

type FileItem = {
    id: string;
    name: string;
    type: 'audio' | 'image' | 'video';
    url?: string;
    size?: string;
    source: string;
};

export const XploreTab: React.FC<XploreTabProps> = ({ projectData, directorPlan }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFolder, setActiveFolder] = useState<'all' | 'audio' | 'images' | 'videos'>('all');

    // Aggregate all files from project data and director plan
    const allFiles = useMemo(() => {
        const files: FileItem[] = [];

        // 1. Audio Files (Local Playlist / Soundtrack)
        if (projectData.localFiles) {
            projectData.localFiles.forEach((f, i) => {
                files.push({
                    id: `audio_local_${i}`,
                    name: f.name,
                    type: 'audio',
                    url: projectData.localPlaylist?.[i]?.url,
                    size: (f.size / (1024 * 1024)).toFixed(2) + ' MB',
                    source: 'Local Upload'
                });
            });
        } else if (projectData.soundtrackUrl) {
            files.push({
                id: `audio_url_0`,
                name: projectData.soundtrackUrl.split('/').pop() || 'Soundtrack',
                type: 'audio',
                url: projectData.soundtrackUrl,
                source: 'External URL'
            });
        }

        // 2. Reference Images
        projectData.referenceImages.forEach((ref) => {
            files.push({
                id: ref.id,
                name: `Reference_${ref.id.substring(0, 5)}.png`,
                type: 'image',
                url: ref.data,
                source: 'Reference Images'
            });
        });

        // 3. Scene Media (Images and Videos)
        if (directorPlan) {
            directorPlan.scenes.forEach((scene, index) => {
                if (scene.imageUrl) {
                    files.push({
                        id: `scene_${index}_image`,
                        name: `Scene_${index + 1}_Image.png`,
                        type: 'image',
                        url: scene.imageUrl,
                        source: 'Scene Generations'
                    });
                }
                if (scene.videoUrl) {
                    files.push({
                        id: `scene_${index}_video`,
                        name: `Scene_${index + 1}_Video.mp4`,
                        type: 'video',
                        url: scene.videoUrl,
                        source: 'Scene Generations'
                    });
                }
            });
        }

        return files;
    }, [projectData, directorPlan]);

    const filteredFiles = useMemo(() => {
        let filtered = allFiles;
        if (activeFolder !== 'all') {
            filtered = filtered.filter(f => f.type === activeFolder || (activeFolder === 'images' && f.type === 'image') || (activeFolder === 'videos' && f.type === 'video'));
        }
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(f => f.name.toLowerCase().includes(query) || f.source.toLowerCase().includes(query));
        }
        return filtered;
    }, [allFiles, activeFolder, searchQuery]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'audio': return <Music className="w-5 h-5 text-pink-400" />;
            case 'image': return <ImageIcon className="w-5 h-5 text-indigo-400" />;
            case 'video': return <Film className="w-5 h-5 text-emerald-400" />;
            default: return <File className="w-5 h-5 text-white/50" />;
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-full min-h-0 bg-[#0a0a0a] text-white w-full">
            {/* Sidebar (Folders) */}
            <div className="w-full md:w-64 border-r border-white/5 bg-black/50 p-4 flex flex-col gap-2 shrink-0">
                <div className="flex items-center gap-2 mb-4 px-2">
                    <HardDrive className="w-5 h-5 text-white/50" />
                    <h2 className="font-bold text-sm text-white/80 uppercase tracking-widest">Asset Xplorer</h2>
                </div>
                
                <button onClick={() => setActiveFolder('all')} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeFolder === 'all' ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                    <Folder className="w-4 h-4" />
                    <span className="text-sm font-medium">All Files</span>
                    <span className="ml-auto text-xs opacity-50">{allFiles.length}</span>
                </button>
                <button onClick={() => setActiveFolder('audio')} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeFolder === 'audio' ? 'bg-pink-500/20 text-pink-400' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                    <Music className="w-4 h-4" />
                    <span className="text-sm font-medium">Audio</span>
                    <span className="ml-auto text-xs opacity-50">{allFiles.filter(f => f.type === 'audio').length}</span>
                </button>
                <button onClick={() => setActiveFolder('images')} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeFolder === 'images' ? 'bg-indigo-500/20 text-indigo-400' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                    <ImageIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Images</span>
                    <span className="ml-auto text-xs opacity-50">{allFiles.filter(f => f.type === 'image').length}</span>
                </button>
                <button onClick={() => setActiveFolder('videos')} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeFolder === 'videos' ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                    <Film className="w-4 h-4" />
                    <span className="text-sm font-medium">Videos</span>
                    <span className="ml-auto text-xs opacity-50">{allFiles.filter(f => f.type === 'video').length}</span>
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 min-h-0">
                {/* Topbar / Search */}
                <div className="h-14 border-b border-white/5 flex items-center px-4 gap-4 shrink-0 bg-black/20">
                    <div className="flex items-center text-xs text-white/40 hidden sm:flex">
                        Root <ChevronRight className="w-3 h-3 mx-1" /> {activeFolder === 'all' ? 'All Files' : activeFolder.charAt(0).toUpperCase() + activeFolder.slice(1)}
                    </div>
                    <div className="flex-1" />
                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search files..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>
                </div>

                {/* File Grid/List */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {filteredFiles.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-white/30">
                            <Folder className="w-12 h-12 mb-4 opacity-20" />
                            <p>No files found.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {filteredFiles.map((file) => (
                                <div key={file.id} className="group flex flex-col bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl overflow-hidden transition-all cursor-pointer">
                                    <div className="aspect-square bg-black/50 relative flex items-center justify-center overflow-hidden">
                                        {file.type === 'image' && file.url ? (
                                            <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                                        ) : file.type === 'video' && file.url ? (
                                            <video src={file.url} className="w-full h-full object-cover" />
                                        ) : (
                                            getIcon(file.type)
                                        )}
                                        {/* Overlay Type Icon */}
                                        <div className="absolute top-2 left-2 p-1.5 bg-black/60 backdrop-blur-md rounded-md border border-white/10 shadow-lg">
                                            {getIcon(file.type)}
                                        </div>
                                    </div>
                                    <div className="p-3 flex flex-col gap-1">
                                        <h3 className="text-xs font-bold text-white truncate" title={file.name}>{file.name}</h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-white/40 truncate">{file.source}</span>
                                            {file.size && <span className="text-[9px] text-white/30">{file.size}</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
