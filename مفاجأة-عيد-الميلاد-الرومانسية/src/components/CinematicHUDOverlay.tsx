import React from 'react';
import { SceneId } from '../types';

interface Props {
  currentScene: SceneId;
}

export const CinematicHUDOverlay: React.FC<Props> = ({ currentScene }) => {
  const chapterTitles: Record<SceneId, string> = {
    intro: 'Chapter 01: The Awakening',
    cake: 'Chapter 02: The Celebration',
    letter: 'Chapter 03: The Heart\'s Whisper',
    rose: 'Chapter 04: Eternal Bloom',
    gift: 'Chapter 05: Unwrapping Dreams',
    final: 'Chapter 06: Eternal Love',
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden font-sans select-none">
      {/* Central Glow Effect from Immersive Design */}
      <div className="glow-circle-immersive top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70" />

      {/* Top Center Status Indicator */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 flex items-center gap-2.5 bg-slate-950/60 px-3 py-1 rounded-full border border-[#FF1E56]/30 backdrop-blur-sm">
        <div className="w-2 h-2 rounded-full bg-[#FF1E56] shadow-[0_0_10px_#FF1E56] animate-pulse" />
        <span className="text-[10px] sm:text-xs tracking-widest font-light opacity-80 uppercase text-[#FFAC41]">
          Syncing Emotions
        </span>
      </div>

      {/* Left Side Vertical Cinematic Indicator (Hidden on very small screens to avoid clutter) */}
      <div className="hidden lg:flex absolute top-1/2 left-8 -translate-y-1/2 flex-col gap-16 items-center opacity-40">
        <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-[#FF1E56] to-white" />
        <div className="rotate-90 text-[10px] tracking-[0.5em] uppercase whitespace-nowrap text-white font-mono">
          Cinematic Experience
        </div>
        <div className="w-[1px] h-24 bg-gradient-to-b from-white via-[#FFAC41] to-transparent" />
      </div>

      {/* Bottom HUD Bar */}
      <div className="absolute bottom-6 left-0 w-full flex justify-between px-6 sm:px-12 pointer-events-none text-xs">
        <div className="flex flex-col gap-1.5 items-start">
          <div className="w-12 h-[1px] bg-[#FF1E56]/50" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#FF1E56]/80 font-mono">
            Atmosphere: Romantic
          </span>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <div className="w-12 h-[1px] bg-[#FFAC41]/50" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#FFAC41]/90 font-mono">
            {chapterTitles[currentScene]}
          </span>
        </div>
      </div>
    </div>
  );
};
