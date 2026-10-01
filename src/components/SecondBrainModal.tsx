import React, { useState, useEffect } from 'react';
import { X, Brain, Plus, Trash2, Search, Save, Clock, ChevronLeft } from 'lucide-react';
import { BrainNote } from '@/types';
import { loadBrainNotesFromDB, saveBrainNotesToDB } from '@/services/db';

interface SecondBrainModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecondBrainModal: React.FC<SecondBrainModalProps> = ({ isOpen, onClose }) => {
  const [notes, setNotes] = useState<BrainNote[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileList, setShowMobileList] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadNotes();
    }
  }, [isOpen]);

  const loadNotes = async () => {
    setIsLoading(true);
    const loadedNotes = await loadBrainNotesFromDB();
    setNotes(loadedNotes);
    if (loadedNotes.length > 0 && !selectedNoteId) {
      setSelectedNoteId(loadedNotes[0].id);
    }
    setIsLoading(false);
  };

  const handleCreateNote = () => {
    const newNote: BrainNote = {
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      title: 'Untitled Note',
      content: '',
      tags: [],
    };
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    setSelectedNoteId(newNote.id);
    saveNotes(updatedNotes);
    setShowMobileList(false);
  };

  const saveNotes = async (notesToSave: BrainNote[]) => {
    setIsSaving(true);
    await saveBrainNotesToDB(notesToSave);
    setTimeout(() => setIsSaving(false), 500);
  };

  const handleUpdateNote = (id: string, updates: Partial<BrainNote>) => {
    const updatedNotes = notes.map(note => {
      if (note.id === id) {
        return { ...note, ...updates, updatedAt: new Date().toISOString() };
      }
      return note;
    });
    setNotes(updatedNotes);
  };

  const handleDeleteNote = (id: string) => {
    const updatedNotes = notes.filter(n => n.id !== id);
    setNotes(updatedNotes);
    if (selectedNoteId === id) {
      setSelectedNoteId(updatedNotes.length > 0 ? updatedNotes[0].id : null);
      if (updatedNotes.length === 0) setShowMobileList(true);
    }
    saveNotes(updatedNotes);
  };

  // Debounced save for content changes
  useEffect(() => {
    if (!isOpen || isLoading) return;
    const timeoutId = setTimeout(() => {
      saveNotes(notes);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [notes, isOpen, isLoading]);

  if (!isOpen) return null;

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedNote = notes.find(n => n.id === selectedNoteId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-6xl h-[85vh] shadow-2xl flex overflow-hidden">
        
        {/* Sidebar */}
        <div className={`w-full md:w-80 border-r border-white/10 flex-col bg-[#111] shrink-0 ${showMobileList ? 'flex' : 'hidden md:flex'}`}>
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" />
              Second Brain
            </h2>
            <div className="flex items-center gap-1">
              <button 
                onClick={handleCreateNote}
                className="p-1.5 bg-white/5 hover:bg-white/10 text-white rounded-md transition-colors"
                title="New Note"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button 
                onClick={onClose}
                className="md:hidden p-1.5 bg-white/5 hover:bg-white/10 text-white rounded-md transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="p-3 border-b border-white/10">
            <div className="relative">
              <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-md py-1.5 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-white/40">Loading notes...</div>
            ) : filteredNotes.length === 0 ? (
              <div className="p-4 text-center text-sm text-white/40">No notes found.</div>
            ) : (
              filteredNotes.map(note => (
                <div
                  key={note.id}
                  onClick={() => {
                    setSelectedNoteId(note.id);
                    setShowMobileList(false);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedNoteId(note.id);
                      setShowMobileList(false);
                    }
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors flex flex-col gap-1 group relative cursor-pointer ${
                    selectedNoteId === note.id ? 'bg-purple-500/20 border border-purple-500/30' : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="font-semibold text-white text-sm truncate pr-6">{note.title || 'Untitled Note'}</div>
                  <div className="flex items-center justify-between text-[10px] text-white/40">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(note.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNote(note.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 text-white/0 group-hover:text-white/40 hover:!text-red-400 rounded-md transition-all"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Editor Area */}
        <div className={`flex-1 flex-col bg-[#0a0a0a] min-w-0 ${!showMobileList ? 'flex' : 'hidden md:flex'}`}>
          {selectedNote ? (
            <>
              <div className="p-4 sm:p-6 border-b border-white/10 flex items-start justify-between gap-4">
                <button
                  onClick={() => setShowMobileList(true)}
                  className="md:hidden p-2 -ml-2 shrink-0 text-white/40 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={selectedNote.title}
                  onChange={(e) => handleUpdateNote(selectedNote.id, { title: e.target.value })}
                  className="bg-transparent border-none text-xl sm:text-2xl font-bold text-white focus:outline-none flex-1 placeholder:text-white/20"
                  placeholder="Note Title"
                />
                <div className="flex items-center gap-2 shrink-0">
                  <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-md transition-opacity ${isSaving ? 'opacity-100 text-purple-400' : 'opacity-0'}`}>
                    <Save className="w-3.5 h-3.5" /> Saving...
                  </div>
                  <button
                    onClick={() => handleDeleteNote(selectedNote.id)}
                    className="p-2 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button onClick={onClose} className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-md transition-colors ml-2">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 p-4 sm:p-6 overflow-hidden flex flex-col">
                <textarea
                  value={selectedNote.content}
                  onChange={(e) => handleUpdateNote(selectedNote.id, { content: e.target.value })}
                  placeholder="Write your design decisions, technical constraints, or learned lessons here..."
                  className="w-full flex-1 bg-transparent border-none text-white/80 text-sm sm:text-base leading-relaxed focus:outline-none resize-none custom-scrollbar placeholder:text-white/20"
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-white/40 relative">
              <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-md transition-colors">
                <X className="w-5 h-5" />
              </button>
              <Brain className="w-16 h-16 mb-4 opacity-20" />
              <p>Select a note or create a new one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
