const fs = require('fs');
let code = fs.readFileSync('src/components/PromptGenerator.tsx', 'utf-8');

const rightPaneUI = `                ) : activeTab === 'batch_edit' ? (
                    <div className="h-full flex items-center justify-center text-white/20 relative group">
                        {generatedBatchEditImages && generatedBatchEditImages.length > 0 ? (
                            <div className="w-full h-full flex flex-col items-center justify-center p-4 relative">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto w-full max-h-full custom-scrollbar p-2">
                                    {generatedBatchEditImages.map((img, idx) => (
                                        <div key={idx} className="relative group/item aspect-video bg-black/50 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                                            <img src={img} alt={\`Generated edit \${idx + 1}\`} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button onClick={(e) => downloadImage(e, img, \`batch_edit_\${Date.now()}_\${idx}.png\`)} className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white" title="Download">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <Layers className="w-16 h-16 opacity-20" />
                                <p className="uppercase tracking-widest font-bold text-sm text-center">Your batch edited images<br/>will appear here</p>
                            </div>
                        )}
                    </div>`;

code = code.replace(
    /                \) : activeTab === 'extend_image' \? \(/,
    rightPaneUI + "\n" + "                ) : activeTab === 'extend_image' ? ("
);

fs.writeFileSync('src/components/PromptGenerator.tsx', code);
