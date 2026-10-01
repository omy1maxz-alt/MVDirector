import React, { useState, useEffect } from 'react';
import { Lock, KeyRound } from 'lucide-react';

export const PasswordGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState(false);

  const envPassword = (import.meta as any).env.VITE_APP_PASSWORD;

  useEffect(() => {
    // If no password is required in the environment, unlock immediately.
    if (!envPassword) {
      setIsUnlocked(true);
      return;
    }

    // Check if previously unlocked in this browser session/storage
    const savedStatus = localStorage.getItem('mv_director_unlocked');
    if (savedStatus === 'true') {
      setIsUnlocked(true);
    }
  }, [envPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === envPassword) {
      setIsUnlocked(true);
      setError(false);
      localStorage.setItem('mv_director_unlocked', 'true');
    } else {
      setError(true);
      setPassword('');
    }
  };

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center p-4 z-50">
      <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
        <div className="w-16 h-16 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-pink-500/20">
          <Lock className="w-8 h-8 text-pink-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-white text-center mb-2">Protected App</h2>
        <p className="text-sm text-white/40 text-center mb-8">
          This application requires a password to access.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className={`w-full bg-black/40 border ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-pink-500'} rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/20 outline-none transition-colors`}
                autoFocus
              />
            </div>
            {error && (
              <p className="text-red-400 text-xs mt-2 text-center animate-pulse">
                Incorrect password. Please try again.
              </p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-pink-900/20 flex items-center justify-center gap-2"
          >
            Unlock Application
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <p className="text-[10px] text-white/30 leading-relaxed">
            <strong>Security Notice:</strong> This lock prevents casual access via shared links. However, if this app was remixed, developers can view the source code to bypass this screen. Secrets do not transfer during remixes.
          </p>
        </div>
      </div>
    </div>
  );
};
