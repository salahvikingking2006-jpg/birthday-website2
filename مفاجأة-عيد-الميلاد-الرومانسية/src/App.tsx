import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { SceneId } from './types';
import { soundEngine } from './audio/soundEngine';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { NavigationControls } from './components/NavigationControls';
import { CinematicHUDOverlay } from './components/CinematicHUDOverlay';
import { IntroScene } from './components/IntroScene';
import { CakeScene } from './components/CakeScene';
import { LoveLetterScene } from './components/LoveLetterScene';
import { RoseScene } from './components/RoseScene';
import { GiftBoxScene } from './components/GiftBoxScene';
import { FinalScene } from './components/FinalScene';
import { BirthdaySongModal } from './components/BirthdaySongModal';
import { Edit3, Check, Heart, Volume2, Sparkles } from 'lucide-react';

export default function App() {
  const [currentScene, setCurrentScene] = useState<SceneId>('intro');
  const [isMuted, setIsMuted] = useState(false);
  const [recipientName, setRecipientName] = useState('ملاكي');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(recipientName);
  const [isSongModalOpen, setIsSongModalOpen] = useState(false);

  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      setRecipientName(tempName.trim());
    }
    setIsEditingName(false);
    soundEngine.playClick();
  };

  return (
    <div className="relative min-h-screen bg-immersive-canvas text-slate-100 font-cairo overflow-x-hidden selection:bg-[#FF1E56] selection:text-white">
      {/* Background Radial Atmosphere & Falling Hearts Canvas */}
      <div className="atmosphere-radial" />
      <BackgroundCanvas />

      {/* Cinematic HUD Visual Elements */}
      <CinematicHUDOverlay currentScene={currentScene} />

      {/* Top Bar Navigation & Controls */}
      <NavigationControls
        currentScene={currentScene}
        onSelectScene={(scene) => setCurrentScene(scene)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        recipientName={recipientName}
        onReplayIntro={() => setCurrentScene('intro')}
        onOpenSongModal={() => setIsSongModalOpen(true)}
      />

      {/* Main Container Rendering Active Scene with Smooth Fade Transitions */}
      <main className="relative pt-16 min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center">
        <AnimatePresence mode="wait">
          {currentScene === 'intro' && (
            <IntroScene
              key="intro"
              recipientName={recipientName}
              onStartSurprise={() => setCurrentScene('cake')}
            />
          )}

          {currentScene === 'cake' && (
            <CakeScene
              key="cake"
              recipientName={recipientName}
              onNextScene={() => setCurrentScene('letter')}
              onOpenSongModal={() => setIsSongModalOpen(true)}
            />
          )}

          {currentScene === 'letter' && (
            <LoveLetterScene
              key="letter"
              recipientName={recipientName}
              onNextScene={() => setCurrentScene('rose')}
            />
          )}

          {currentScene === 'rose' && (
            <RoseScene
              key="rose"
              recipientName={recipientName}
              onNextScene={() => setCurrentScene('gift')}
            />
          )}

          {currentScene === 'gift' && (
            <GiftBoxScene
              key="gift"
              recipientName={recipientName}
              onNextScene={() => setCurrentScene('final')}
            />
          )}

          {currentScene === 'final' && (
            <FinalScene
              key="final"
              recipientName={recipientName}
              onReplay={() => setCurrentScene('intro')}
              onOpenSongModal={() => setIsSongModalOpen(true)}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Interactive Birthday Song Customizer Modal */}
      <BirthdaySongModal
        isOpen={isSongModalOpen}
        onClose={() => setIsSongModalOpen(false)}
        recipientName={recipientName}
      />

      {/* Floating Name Personalizer Trigger Button (Bottom Left) */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => {
            setTempName(recipientName);
            setIsEditingName(true);
            soundEngine.playClick();
          }}
          className="px-3.5 py-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-rose-500/30 text-rose-200 text-xs font-semibold hover:text-white hover:bg-rose-500/20 transition-all shadow-lg flex items-center gap-1.5"
        >
          <Edit3 className="w-3.5 h-3.5 text-amber-300" />
          <span>تخصيص اسم المحبوبة ({recipientName})</span>
        </button>
      </div>

      {/* Recipient Name Modal */}
      <AnimatePresence>
        {isEditingName && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-sm w-full p-6 rounded-3xl bg-slate-900 border-2 border-rose-500/50 shadow-2xl text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <Heart className="w-6 h-6 text-rose-500 fill-rose-500 animate-pulse" />
                <h3 className="text-xl font-bold text-rose-200 font-cairo">
                  تخصيص الاسم المفضل
                </h3>
              </div>
              <p className="text-slate-300 font-amiri text-sm mb-4">
                اكتبي الاسم الذي تريدين أن يظهر في كافة أرجاء المفاجأة السينمائية:
              </p>

              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="أدخلي الاسم هنا..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-rose-500/40 text-rose-100 text-center font-bold focus:outline-none focus:border-amber-400 mb-6"
              />

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleSaveName}
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-sm shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>حفظ الاسم ✨</span>
                </button>
                <button
                  onClick={() => setIsEditingName(false)}
                  className="px-4 py-2 rounded-full bg-slate-800 text-slate-300 text-sm hover:text-white"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
