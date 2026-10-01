import React, { useState } from 'react';
import { X, MessageSquare, Copy, Check, User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import chatHistoryData from '../data/chat_history.json';

export const ChatHistoryModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(id);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 shrink-0">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-green-400" /> Chat Logs
          </h2>
          <button onClick={onClose} className="p-1 text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto custom-scrollbar flex flex-col gap-8">
          {chatHistoryData.map((session, sIdx) => (
            <div key={sIdx} className="flex flex-col gap-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">{session.date}</span>
                <span className="text-xs text-white/60 font-medium">{session.topic}</span>
              </div>
              
              <div className="flex flex-col gap-6">
                {session.messages.map((msg, mIdx) => {
                  const id = `${sIdx}-${mIdx}`;
                  const isUser = msg.role === 'user';
                  return (
                    <div key={mIdx} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className={`flex items-center gap-2 text-xs font-bold ${isUser ? 'text-blue-400' : 'text-green-400'}`}>
                          {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                          {isUser ? 'You' : 'AI Director'}
                        </div>
                        <button 
                          onClick={() => handleCopy(msg.text, id)}
                          className="px-2 py-1 flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded text-[10px] font-medium transition-colors"
                        >
                          {copiedIndex === id ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                          {copiedIndex === id ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 text-sm text-white/90 prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {chatHistoryData.length === 0 && (
            <div className="text-center text-white/40 text-sm py-12">
              No chat history available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
