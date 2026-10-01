import React, { useState, useEffect } from 'react';
import { X, Youtube, ListVideo, Search, Video, Loader2, LogOut } from 'lucide-react';
import { initAuth, googleSignIn, logout, fetchYouTubePlaylists, fetchYouTubePlaylistItems, searchYouTube, getAccessToken } from '../services/youtube';

interface YouTubeImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVideo: (url: string, title: string) => void;
}

export const YouTubeImportModal: React.FC<YouTubeImportModalProps> = ({ isOpen, onClose, onSelectVideo }) => {
  const [needsAuth, setNeedsAuth] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'playlists' | 'search'>('playlists');
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<any | null>(null);
  const [playlistItems, setPlaylistItems] = useState<any[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = initAuth(
      (user, t) => { setToken(t); setNeedsAuth(false); loadPlaylists(t); },
      () => setNeedsAuth(true)
    );
    return () => unsubscribe();
  }, [isOpen]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setToken(result.accessToken);
        setNeedsAuth(false);
        loadPlaylists(result.accessToken);
      }
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') {
        console.warn('Login cancelled by user');
      } else {
        console.error('Login failed:', err);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setNeedsAuth(true);
    setToken(null);
    setPlaylists([]);
    setPlaylistItems([]);
    setSelectedPlaylist(null);
  };

  const loadPlaylists = async (t: string) => {
    setIsLoading(true);
    try {
      const data = await fetchYouTubePlaylists(t);
      setPlaylists(data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectPlaylist = async (playlist: any) => {
    setSelectedPlaylist(playlist);
    setIsLoading(true);
    try {
      const t = token || await getAccessToken();
      if (t) {
        const data = await fetchYouTubePlaylistItems(t, playlist.id);
        setPlaylistItems(data.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const t = token || await getAccessToken();
      if (t) {
        const data = await searchYouTube(t, searchQuery);
        setSearchResults(data.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectVideo = (videoId: string, title: string) => {
    onSelectVideo(`https://www.youtube.com/watch?v=${videoId}`, title);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1C1C1E] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/20">
          <div className="flex items-center space-x-2">
            <Youtube className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-white">Import from YouTube</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {needsAuth ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
                <Youtube className="w-10 h-10 text-red-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Connect YouTube</h2>
                <p className="text-white/60 max-w-md">Sign in to browse your private playlists and liked videos directly within the app.</p>
              </div>
              
              <button 
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="gsi-material-button relative overflow-hidden bg-white text-black font-medium py-3 px-6 rounded-lg flex items-center space-x-3 hover:bg-gray-100 transition-colors"
              >
                {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                )}
                <span>Sign in with Google</span>
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-white/10 px-4 pt-2 space-x-6">
                <button
                  onClick={() => setActiveTab('playlists')}
                  className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'playlists' ? 'border-red-500 text-white' : 'border-transparent text-white/50 hover:text-white/80'}`}
                >
                  My Playlists
                </button>
                <button
                  onClick={() => setActiveTab('search')}
                  className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'search' ? 'border-red-500 text-white' : 'border-transparent text-white/50 hover:text-white/80'}`}
                >
                  Search
                </button>
                <div className="flex-1" />
                <button onClick={handleLogout} className="flex items-center space-x-2 text-white/40 hover:text-white/80 pb-3 text-xs">
                  <LogOut className="w-3 h-3" />
                  <span>Sign Out</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {isLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
                  </div>
                ) : (
                  <>
                    {activeTab === 'playlists' && (
                      <div>
                        {selectedPlaylist ? (
                          <div>
                            <button onClick={() => setSelectedPlaylist(null)} className="text-sm text-red-400 hover:text-red-300 mb-4 flex items-center">
                              ← Back to Playlists
                            </button>
                            <h4 className="font-semibold text-white mb-4">{selectedPlaylist.snippet.title}</h4>
                            <div className="space-y-2">
                              {playlistItems.map((item) => (
                                <button
                                  key={item.id}
                                  onClick={() => handleSelectVideo(item.snippet.resourceId.videoId, item.snippet.title)}
                                  className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 text-left transition-colors group"
                                >
                                  <div className="w-16 h-10 bg-black rounded overflow-hidden flex-shrink-0">
                                    {item.snippet.thumbnails?.default?.url && (
                                      <img src={item.snippet.thumbnails.default.url} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white truncate">{item.snippet.title}</p>
                                    <p className="text-xs text-white/50 truncate">{item.snippet.videoOwnerChannelTitle}</p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {playlists.map((pl) => (
                              <button
                                key={pl.id}
                                onClick={() => selectPlaylist(pl)}
                                className="text-left bg-white/5 hover:bg-white/10 rounded-xl overflow-hidden transition-all group"
                              >
                                <div className="aspect-video bg-black relative">
                                  {pl.snippet.thumbnails?.medium?.url ? (
                                    <img src={pl.snippet.thumbnails.medium.url} alt="" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center"><ListVideo className="w-8 h-8 text-white/20" /></div>
                                  )}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                                    <span className="text-white font-medium text-sm drop-shadow-md truncate">{pl.snippet.title}</span>
                                  </div>
                                </div>
                              </button>
                            ))}
                            {playlists.length === 0 && (
                              <p className="col-span-3 text-center text-white/50 py-8">No playlists found.</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'search' && (
                      <div>
                        <form onSubmit={handleSearch} className="relative mb-6">
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search YouTube..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-red-500 text-white transition-colors"
                          />
                          <Search className="w-4 h-4 text-white/40 absolute left-4 top-3.5" />
                          <button type="submit" className="hidden" />
                        </form>

                        <div className="space-y-2">
                          {searchResults.map((item) => (
                            <button
                              key={item.id.videoId}
                              onClick={() => handleSelectVideo(item.id.videoId, item.snippet.title)}
                              className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 text-left transition-colors group"
                            >
                              <div className="w-24 h-16 bg-black rounded overflow-hidden flex-shrink-0 relative">
                                {item.snippet.thumbnails?.medium?.url ? (
                                  <img src={item.snippet.thumbnails.medium.url} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center"><Video className="w-6 h-6 text-white/20" /></div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0 py-1">
                                <p className="text-sm font-medium text-white line-clamp-2 leading-snug">{item.snippet.title}</p>
                                <p className="text-xs text-white/50 mt-1">{item.snippet.channelTitle}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
