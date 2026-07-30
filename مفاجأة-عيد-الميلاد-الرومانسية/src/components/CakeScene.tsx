import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, Flame, Gift, ArrowRight, Music } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface Props {
  onNextScene: () => void;
  recipientName: string;
  onOpenSongModal?: () => void;
}

export const CakeScene: React.FC<Props> = ({ onNextScene, recipientName, onOpenSongModal }) => {
  const [litCandles, setLitCandles] = useState<boolean[]>([false, false, false, false, false]);
  const [isSequenceActive, setIsSequenceActive] = useState(false);
  const [sequenceComplete, setSequenceComplete] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const cakeRef = useRef<HTMLDivElement>(null);

  // Trigger the full 10-step cinematic sequence when clicking the cake
  const handleCakeClick = () => {
    if (isSequenceActive || sequenceComplete) return;
    setIsSequenceActive(true);
    soundEngine.playClick();

    // Play Happy Birthday Song!
    soundEngine.playHappyBirthdaySong({ recipientName, melody: 'medley', instrument: 'piano' });

    // Step 1: Camera zoom effect & Shake
    // Step 2: Candles ignite one by one
    const candleTimings = [200, 600, 1000, 1400, 1800];
    candleTimings.forEach((delay, idx) => {
      setTimeout(() => {
        setLitCandles((prev) => {
          const updated = [...prev];
          updated[idx] = true;
          return updated;
        });
        soundEngine.playCandleIgnite();
      }, delay);
    });

    // Step 3 & 4: Warm golden lighting spread & Confetti / Heart explosion
    setTimeout(() => {
      soundEngine.playFireworks();
      setShowFireworks(true);
      triggerConfettiExplosion();
    }, 2200);

    // Step 5 & 6: Heart bursts & Magic sounds
    setTimeout(() => {
      soundEngine.playConfetti();
      triggerHeartBurst();
    }, 2800);

    // Step 10: Complete sequence & reveal message
    setTimeout(() => {
      setSequenceComplete(true);
      setIsSequenceActive(false);
      soundEngine.playSparkle();
    }, 3800);
  };

  const triggerConfettiExplosion = () => {
    // Cannon 1
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#f472b6', '#ec4899', '#fbbf24', '#ffffff', '#e11d48'],
    });

    // Cannon 2 (burst after slight delay)
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 70,
        origin: { x: 0.1, y: 0.5 },
        colors: ['#fbbf24', '#f472b6', '#ffffff'],
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 70,
        origin: { x: 0.9, y: 0.5 },
        colors: ['#ec4899', '#f472b6', '#ffd700'],
      });
    }, 400);
  };

  const triggerHeartBurst = () => {
    const scalar = 2;
    const heartShape = confetti.shapeFromText({ text: '❤️', scalar });

    confetti({
      shapes: [heartShape],
      particleCount: 40,
      scalar: 1.5,
      spread: 120,
      startVelocity: 35,
      origin: { y: 0.55 },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 md:p-8 text-center"
    >
      {/* Background Fireworks & Warm Golden Glow */}
      <AnimatePresence>
        {showFireworks && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
          >
            {/* Warm Golden Glow Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 via-rose-500/10 to-transparent animate-pulse" />

            {/* Fireworks Bulbs */}
            <div className="absolute top-1/4 left-1/6 w-32 h-32 rounded-full border-2 border-dashed border-amber-300 animate-ping opacity-60" />
            <div className="absolute top-1/3 right-1/6 w-40 h-40 rounded-full border-2 border-dashed border-pink-400 animate-ping opacity-60 delay-300" />
            <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full border-2 border-dashed border-rose-400 animate-ping opacity-75 delay-700" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Animated Balloons */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {[
          { color: 'bg-rose-500', left: '10%', delay: 0 },
          { color: 'bg-pink-400', left: '25%', delay: 2 },
          { color: 'bg-amber-400', left: '75%', delay: 1 },
          { color: 'bg-fuchsia-500', left: '88%', delay: 3 },
        ].map((balloon, idx) => (
          <motion.div
            key={idx}
            initial={{ y: '110vh', opacity: 0.8 }}
            animate={{ y: '-20vh' }}
            transition={{
              duration: 12 + idx * 2,
              repeat: Infinity,
              delay: balloon.delay,
              ease: 'linear',
            }}
            style={{ left: balloon.left }}
            className="absolute flex flex-col items-center"
          >
            <div className={`w-12 h-16 rounded-full ${balloon.color} shadow-lg shadow-rose-500/30 border border-white/20`} />
            <div className="w-0.5 h-12 bg-white/40" />
          </motion.div>
        ))}
      </div>

      {/* Title */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6 z-10"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-[#FFAC41] font-cairo drop-shadow-2xl">
          كعكة الميلاد الساحرة 🎂
        </h2>
        <p className="text-[#FF1E56] font-amiri text-base sm:text-lg mt-2 font-medium tracking-wide">
          {sequenceComplete
            ? 'تمنّي أمنية زاهية من أعماق قلبكِ ✨'
            : 'اضغطي على الكعكة لإشعال الشموع وبدء الاحتفال!'}
        </p>
      </motion.div>

      {/* Interactive Birthday Cake */}
      <motion.div
        ref={cakeRef}
        onClick={handleCakeClick}
        animate={
          isSequenceActive
            ? {
                scale: [1, 1.15, 1.08],
                rotate: [0, -2, 2, -1, 1, 0],
              }
            : {
                y: [0, -10, 0],
              }
        }
        transition={
          isSequenceActive
            ? { duration: 0.8, ease: 'easeOut' }
            : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
        }
        className="relative cursor-pointer my-6 z-10 group select-none"
      >
        {/* Glow behind cake */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-rose-500/40 via-amber-400/20 to-transparent blur-2xl rounded-full" />

        {/* SVG Cake Container */}
        <div className="relative w-72 h-72 sm:w-88 sm:h-88 md:w-96 md:h-96 flex flex-col items-center justify-end pb-4">
          
          {/* CANDLES ROW */}
          <div className="flex items-end justify-center gap-4 sm:gap-6 mb-[-6px] z-20">
            {litCandles.map((isLit, i) => (
              <div key={i} className="flex flex-col items-center">
                {/* Candle Flame */}
                <div className="h-8 flex items-end justify-center mb-1">
                  {isLit ? (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [1, 1.25, 1], rotate: [-3, 3, -3] }}
                      transition={{ duration: 0.6, repeat: Infinity, repeatType: 'mirror' }}
                      className="relative flex items-center justify-center"
                    >
                      <Flame className="w-6 h-8 text-amber-400 fill-amber-300 filter drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
                      <div className="absolute w-8 h-8 bg-amber-400/30 rounded-full blur-md animate-ping" />
                    </motion.div>
                  ) : (
                    <div className="w-1 h-3 bg-slate-400 rounded-full opacity-60" />
                  )}
                </div>

                {/* Candle Body */}
                <div className="w-3.5 h-12 bg-gradient-to-b from-rose-300 via-pink-400 to-rose-500 rounded-t-sm border-x border-t border-amber-200/50 shadow-md flex flex-col justify-around items-center">
                  <div className="w-full h-1 bg-white/40" />
                  <div className="w-full h-1 bg-white/40" />
                </div>
              </div>
            ))}
          </div>

          {/* CAKE LAYER 3 (TOP TIER) */}
          <div className="relative w-48 sm:w-56 h-20 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 rounded-t-3xl border-t-2 border-pink-200 shadow-xl flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/30 via-transparent to-transparent" />
            {/* Frosting drips */}
            <div className="absolute top-0 inset-x-0 h-6 bg-amber-100 rounded-b-full opacity-90 border-b border-amber-200/60" />
            <Sparkles className="w-5 h-5 text-amber-200 animate-spin opacity-80" />
          </div>

          {/* CAKE LAYER 2 (MIDDLE TIER) */}
          <div className="relative w-64 sm:w-72 h-24 bg-gradient-to-r from-rose-600 via-pink-500 to-rose-600 rounded-t-2xl border-t-2 border-pink-300 shadow-2xl flex items-center justify-center overflow-hidden -mt-2">
            <div className="absolute inset-0 bg-white/10" />
            <div className="flex gap-4">
              <Heart className="w-5 h-5 text-rose-200 fill-rose-200 animate-pulse" />
              <Heart className="w-5 h-5 text-rose-200 fill-rose-200 animate-pulse delay-150" />
              <Heart className="w-5 h-5 text-rose-200 fill-rose-200 animate-pulse delay-300" />
            </div>
          </div>

          {/* CAKE LAYER 1 (BOTTOM BASE TIER) */}
          <div className="relative w-76 sm:w-88 h-28 bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 rounded-t-2xl border-t-4 border-amber-400/80 shadow-2xl flex items-center justify-around px-6 overflow-hidden -mt-2">
            <div className="w-full h-full bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
            <span className="absolute text-amber-300 font-sacramento text-2xl font-bold tracking-widest drop-shadow-md">
              Happy Birthday {recipientName}
            </span>
          </div>

          {/* CAKE PLATE */}
          <div className="w-84 sm:w-96 h-5 bg-gradient-to-r from-slate-700 via-slate-300 to-slate-700 rounded-full shadow-2xl border-t border-white/50 -mt-1" />
        </div>
      </motion.div>

      {/* Birthday Dramatic Message Card on Sequence Complete */}
      <AnimatePresence>
        {sequenceComplete && (
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 120 }}
            className="z-20 max-w-xl w-full p-6 sm:p-8 rounded-3xl bg-[#0a0206]/90 border-2 border-[#FFAC41]/60 shadow-[0_0_50px_rgba(255,30,86,0.35)] backdrop-blur-2xl text-center my-4"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-6 h-6 text-[#FFAC41] animate-spin" />
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#FFAC41] font-cairo">
                كل عام وأنتِ الأجمل والأغلى ❤️
              </h3>
              <Sparkles className="w-6 h-6 text-[#FFAC41] animate-spin" />
            </div>

            <p className="text-rose-100 font-amiri text-lg sm:text-xl leading-relaxed mb-6">
              تتفتح الأيام بوجودكِ وتشرق الحياة بضحكتكِ. أدام الله عليكِ السعادة والبهجة والصحة في عامكِ الجديد.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <motion.button
                onClick={() => {
                  soundEngine.playClick();
                  if (onOpenSongModal) {
                    onOpenSongModal();
                  } else {
                    soundEngine.playHappyBirthdaySong({ recipientName });
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3.5 rounded-full bg-[#FF1E56]/20 border border-[#FFAC41]/50 text-[#FFAC41] hover:text-white hover:bg-[#FF1E56]/30 font-cairo font-bold text-sm flex items-center gap-2 cursor-pointer transition-all shadow-md"
              >
                <Music className="w-4 h-4" />
                <span>خصّصي واستمعي للأغنية 🎶</span>
              </motion.button>

              <motion.button
                onClick={() => {
                  soundEngine.playClick();
                  onNextScene();
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="main-button-immersive px-8 py-3.5 rounded-full text-white font-cairo font-bold text-base border border-white/30 flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>الانتقال إلى رسالة الحب ✉️</span>
                <ArrowRight className="w-5 h-5 rotate-180" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
