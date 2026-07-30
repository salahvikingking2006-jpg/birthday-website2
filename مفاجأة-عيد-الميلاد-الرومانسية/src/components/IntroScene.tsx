import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Mail, Play, Stars } from 'lucide-react';
import gsap from 'gsap';
import { soundEngine } from '../audio/soundEngine';

interface Props {
  onStartSurprise: () => void;
  recipientName: string;
}

export const IntroScene: React.FC<Props> = ({ onStartSurprise, recipientName }) => {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [showButton, setShowButton] = useState(false);
  const heartRef = useRef<HTMLDivElement>(null);
  const orbitSparklesRef = useRef<HTMLDivElement>(null);

  const fullText = `إلى ملاكي الغالية ${recipientName}... اليوم تبتسم السماء وتتفتح الأزهار احتفالاً بيوم ميلادكِ الساحر. أعددت لكِ هذه المفاجأة المليئة بالحب والجمال ❤️`;

  // GSAP Heartbeat & Orbit Animations
  useEffect(() => {
    // Start BGM on first user interaction if muted or standard
    soundEngine.playHeartbeat();
    const heartbeatInterval = setInterval(() => {
      soundEngine.playHeartbeat();
    }, 1800);

    // GSAP Heartbeat pulse
    if (heartRef.current) {
      gsap.to(heartRef.current, {
        scale: 1.25,
        duration: 0.35,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        repeatDelay: 1.2,
      });
    }

    // Orbiting sparkles rotation
    if (orbitSparklesRef.current) {
      gsap.to(orbitSparklesRef.current, {
        rotation: 360,
        duration: 12,
        repeat: -1,
        ease: 'none',
      });
    }

    return () => clearInterval(heartbeatInterval);
  }, []);

  // Letter by letter text animation when envelope opens
  const handleOpenEnvelope = () => {
    if (envelopeOpened) return;
    setEnvelopeOpened(true);
    soundEngine.playEnvelopeOpen();
    soundEngine.startBGM();

    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setShowButton(true);
        soundEngine.playSparkle();
      }
    }, 45);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 md:p-8 text-center"
    >
      {/* Golden Glowing Rays Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="w-[300px] h-[300px] bg-amber-400/10 rounded-full blur-2xl animate-ping" />
      </div>

      {/* Glowing Heart & Orbiting Sparkles */}
      <div className="relative mb-8 flex items-center justify-center">
        {/* Pulsing Aura Rings */}
        <div className="absolute w-40 h-40 rounded-full border border-rose-500/30 animate-ping opacity-75" />
        <div className="absolute w-56 h-56 rounded-full border border-pink-400/20 animate-ping opacity-40 delay-300" />

        {/* Orbiting Sparkles */}
        <div ref={orbitSparklesRef} className="absolute w-48 h-48 pointer-events-none">
          <Sparkles className="w-5 h-5 text-amber-300 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
          <Stars className="w-4 h-4 text-pink-300 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 filter drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]" />
          <Sparkles className="w-4 h-4 text-rose-300 absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 filter drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
          <Stars className="w-5 h-5 text-amber-200 absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 filter drop-shadow-[0_0_8px_rgba(253,230,138,0.8)]" />
        </div>

        {/* Main Glowing Pulsing Heart */}
        <div ref={heartRef} className="relative cursor-pointer" onClick={handleOpenEnvelope}>
          <Heart className="w-20 h-20 md:w-24 md:h-24 text-rose-500 fill-rose-500 filter drop-shadow-[0_0_25px_rgba(244,63,94,0.9)]" />
        </div>
      </div>

      {/* Romantic Title */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-[#FFAC41] font-cairo mb-3 drop-shadow-2xl"
      >
        كل عام وأنتِ بخير
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-[#FF1E56] text-lg sm:text-xl font-medium tracking-widest font-amiri mb-8 opacity-90"
      >
        اضغطي على المغلق الذهبي لفتح الرسالة الملكية ✨
      </motion.p>

      {/* Interactive Envelope */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 100 }}
        onClick={handleOpenEnvelope}
        className={`relative w-80 sm:w-96 cursor-pointer p-6 rounded-2xl border transition-all duration-700 shadow-2xl backdrop-blur-xl ${
          envelopeOpened
            ? 'bg-[#0a0206]/90 border-[#FF1E56]/60 shadow-[#FF1E56]/30'
            : 'bg-gradient-to-br from-[#120208]/90 via-[#2d0a0a]/60 to-[#050002]/90 border-[#FFAC41]/60 hover:border-[#FFAC41] hover:shadow-[#FF1E56]/40 hover:scale-105'
        }`}
      >
        {/* Shimmer Border Light */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-[#FFAC41]/20 to-transparent animate-pulse pointer-events-none" />

        <div className="flex flex-col items-center gap-4">
          {!envelopeOpened ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="p-4 rounded-full bg-[#FF1E56]/20 border border-[#FFAC41]/50 text-[#FFAC41] animate-bounce">
                <Mail className="w-10 h-10" />
              </div>
              <span className="text-[#FFAC41] font-bold font-cairo text-sm tracking-wider">
                [ انقري لفتح الرسالة الملكية ]
              </span>
            </div>
          ) : (
            <div className="text-right w-full font-amiri text-base sm:text-lg text-rose-100 leading-relaxed min-h-[120px]">
              <p className="whitespace-pre-line drop-shadow">{displayedText}</p>
              {displayedText.length < fullText.length && (
                <span className="inline-block w-2 h-4 bg-[#FFAC41] mr-1 animate-ping" />
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Main Action Button: "ابدئي المفاجأة ✨" */}
      <AnimatePresence>
        {showButton && (
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="mt-8"
          >
            <motion.button
              onClick={() => {
                soundEngine.playClick();
                soundEngine.playSparkle();
                onStartSurprise();
              }}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="main-button-immersive px-10 py-4 rounded-full text-white font-cairo font-extrabold text-xl md:text-2xl border-2 border-white/30 backdrop-blur-sm active:scale-95 transition-transform duration-300 flex items-center gap-3 cursor-pointer"
            >
              <Play className="w-6 h-6 fill-white text-white" />
              <span>ابدئي المفاجأة ✨</span>
              <Sparkles className="w-5 h-5 text-amber-200 animate-spin" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
