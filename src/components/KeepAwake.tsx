import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun } from 'lucide-react';

export const KeepAwake = () => {
    const [isAwake, setIsAwake] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const toggleAwake = () => {
        if (!isAwake) {
            if (audioRef.current) {
                audioRef.current.play().then(() => {
                    setIsAwake(true);
                }).catch(e => {
                    if (e?.name !== 'AbortError' && e?.name !== 'NotAllowedError') {
                        console.warn("Failed to play silent audio:", e);
                    }
                });
            }
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            setIsAwake(false);
        }
    };

    return (
        <>
            <button 
                onClick={toggleAwake}
                className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${isAwake ? 'text-yellow-400 bg-yellow-400/10' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                title={isAwake ? "Keep Awake is ON (Tab won't sleep)" : "Keep Awake is OFF (Click to prevent tab from sleeping)"}
            >
                {isAwake ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <audio 
                ref={audioRef} 
                loop 
                src="data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA" 
                className="hidden" 
            />
        </>
    );
};
