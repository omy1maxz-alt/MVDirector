import React, { useState } from 'react';
import { X, Download } from 'lucide-react';

interface ExportModalProps {
    defaultName: string;
    onExport: (filename: string) => void;
    onClose: () => void;
}

export function ExportModal({ defaultName, onExport, onClose }: ExportModalProps) {
    const [filename, setFilename] = useState(defaultName.replace('.srt', ''));

    const handleExport = (e: React.FormEvent) => {
        e.preventDefault();
        const finalName = filename.trim() ? `${filename.trim()}.srt` : defaultName;
        onExport(finalName);
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <Download className="w-4 h-4 text-indigo-400" />
                        Export Subtitles
                    </h3>
                    <button type="button" onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <form onSubmit={handleExport} className="p-4 flex flex-col gap-4">
                    <div>
                        <label className="text-xs font-bold text-white/70 mb-1 block">File Name</label>
                        <div className="flex items-center">
                            <input
                                type="text"
                                autoFocus
                                value={filename}
                                onChange={(e) => setFilename(e.target.value)}
                                className="flex-1 bg-black/50 border border-white/10 text-white rounded-l-xl p-3 text-sm focus:border-indigo-500 outline-none"
                                placeholder="E.g., my_subtitles"
                            />
                            <div className="bg-white/5 border border-l-0 border-white/10 px-3 py-3 rounded-r-xl text-white/50 text-sm font-bold">
                                .srt
                            </div>
                        </div>
                    </div>
                    <button 
                        type="submit"
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg"
                    >
                        Save File
                    </button>
                </form>
            </div>
        </div>
    );
}
