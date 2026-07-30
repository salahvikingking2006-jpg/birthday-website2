import React from 'react';
import { Volume2, VolumeX, Sparkles, Heart, RefreshCw, Music } from 'lucide-react';
import { SceneId } from '../types';
import { soundEngine } from '../audio/soundEngine';

interface Props {
  currentScene: SceneId;
  onSelectScene: (scene: SceneId) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  recipientName: string;
  onReplayIntro: () => void;
  onOpenSongModal: () => void;
}

export const NavigationControls: React.FC<Props> = ({
  currentScene,
  onSelectScene,
  isMuted,
  onToggleMute,
  recipientName,
  onReplayIntro,
  onOpenSongModal,
}) => {
  const scenes: { id: SceneId; label: string; icon: string }[] = [
    { id: 'intro', label: 'المقدمة', icon: '✨' },
    { id: 'cake', label: 'كعكة الميلاد', icon: '🎂' },
    { id: 'letter', label: 'رسالة من القلب', icon: '✉️' },
    { id: 'rose', label: 'الوردة الأبدية', icon: '🌹' },
    { id: 'gift', label: 'صندوق المفاجآت', icon: '🎁' },
    { id: 'final', label: 'الخاتمة', icon: '🌙' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between backdrop-blur-md bg-[#050002]/80 border-b border-[#FF1E56]/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      {/* Brand & Recipient Name */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <Heart className="w-6 h-6 text-[#FF1E56] fill-[#FF1E56] animate-pulse filter drop-shadow-[0_0_8px_#FF1E56]" />
          <Sparkles className="w-3 h-3 text-[#FFAC41] absolute -top-1 -right-1 animate-spin" />
        </div>
        <span className="text-sm md:text-base font-extrabold text-[#FFAC41] font-cairo tracking-wide">
          عيد ميلاد سعيد {recipientName} ❤️
        </span>
      </div>

      {/* Navigation Tabs (Horizontal scroll on mobile) */}
      <nav className="hidden md:flex items-center gap-1 bg-[#0a0206]/80 p-1 rounded-full border border-[#FFAC41]/40">
        {scenes.map((scene) => {
          const isActive = currentScene === scene.id;
          return (
            <button
              key={scene.id}
              onClick={() => {
                soundEngine.playClick();
                onSelectScene(scene.id);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 font-cairo cursor-pointer ${
                isActive
                  ? 'main-button-immersive text-white shadow-lg scale-105 border border-white/40'
                  : 'text-rose-200/80 hover:text-white hover:bg-[#FF1E56]/15'
              }`}
            >
              <span>{scene.icon}</span>
              <span>{scene.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Actions: Song Modal, Replay & Mute Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenSongModal();
          }}
          title="مشغل أغنية عيد الميلاد"
          className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/30 border border-amber-400/60 text-amber-200 hover:text-white hover:border-amber-300 transition-all text-xs font-bold flex items-center gap-1.5 font-cairo cursor-pointer shadow-md hover:scale-105"
        >
          <Music className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>أغنية عيد الميلاد 🎵</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            onReplayIntro();
          }}
          title="إعادة العرض السينمائي"
          className="p-2 rounded-full bg-[#0a0206]/80 border border-[#FFAC41]/40 text-[#FFAC41] hover:text-white hover:bg-[#FF1E56]/20 transition-all text-xs flex items-center gap-1 font-cairo cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">إعادة العرض</span>
        </button>

        <button
          onClick={onToggleMute}
          title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
          className={`p-2.5 rounded-full transition-all duration-300 cursor-pointer ${
            isMuted
              ? 'bg-slate-900 text-slate-400 border border-slate-700'
              : 'main-button-immersive text-white shadow-md border border-white/30 animate-pulse'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
