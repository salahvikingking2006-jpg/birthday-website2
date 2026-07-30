import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Heart, Sparkles, ArrowRight, Feather, RefreshCw } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface Props {
  onNextScene: () => void;
  recipientName: string;
}

export const LoveLetterScene: React.FC<Props> = ({ onNextScene, recipientName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const letterParagraphs = [
    `أميرتي وغاليتي ${recipientName} ❤️،`,
    `في هذا اليوم الاستثنائي من السنة، أردت أن أرسل لكِ همسات صادقة تتجاوز حدود الكلمات...`,
    `أنتِ اللمسة الدافئة في أيامي، والضوء الذي ينير عتمة الليالي، والبسمة التي ترد الروح. كل لحظة بقربكِ هي عاطفة جياشة وحكاية حب تتجدد كل صباح.`,
    `أتمنى لكِ عاماً مليئاً بالورود المعطرة، والأحلام المحققة، والضحكات التي تنبع من القلب. دمتِ لي شيئاً جميلاً لا ينتهي.`,
    `بحب دائم وشغف لا يزول 🌹`,
  ];

  const fullLetterText = letterParagraphs.join('\n\n');

  const handleOpenLetter = () => {
    if (isOpen) return;
    setIsOpen(true);
    soundEngine.playEnvelopeOpen();

    let currentLength = 0;
    const typingInterval = setInterval(() => {
      if (currentLength < fullLetterText.length) {
        setTypedText(fullLetterText.slice(0, currentLength + 1));
        currentLength++;
      } else {
        clearInterval(typingInterval);
        setIsTypingComplete(true);
        soundEngine.playSparkle();
      }
    }, 40);
  };

  const handleReplayLetter = () => {
    setIsOpen(false);
    setTypedText('');
    setIsTypingComplete(false);
    setTimeout(() => {
      handleOpenLetter();
    }, 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 md:p-8 text-center"
    >
      {/* Title */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF1E56]/15 border border-[#FF1E56]/35 text-[#FFAC41] mb-3 font-cairo text-sm">
          <Feather className="w-4 h-4 text-[#FFAC41]" />
          <span>رسالة حب ملكية مخصصة</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-[#FFAC41] font-cairo drop-shadow-2xl">
          رسالة من أعمق أعماق القلب ✉️
        </h2>
      </motion.div>

      {/* Floating Interactive Envelope & Parchment Paper */}
      <div className="relative w-full max-w-xl flex items-center justify-center">
        {!isOpen ? (
          /* Sealed Floating Envelope */
          <motion.div
            onClick={handleOpenLetter}
            animate={{
              y: [0, -12, 0],
              rotate: [0, -1, 1, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-80 sm:w-96 h-56 bg-gradient-to-br from-[#1d040a] via-[#3d0812] to-[#050002] rounded-2xl border-2 border-[#FFAC41]/70 shadow-[0_0_45px_rgba(255,30,86,0.45)] cursor-pointer flex flex-col items-center justify-center p-6 relative overflow-hidden group"
          >
            {/* Wax Seal */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FF1E56] to-rose-600 border-2 border-[#FFAC41] shadow-lg flex items-center justify-center text-white mb-2 group-hover:scale-110 transition-transform">
              <Heart className="w-8 h-8 fill-amber-200 text-amber-200 animate-pulse" />
            </div>

            <p className="text-[#FFAC41] font-cairo font-bold text-base mt-2">
              انقري لفتح الخطاب الملكي ✨
            </p>
            <p className="text-rose-300/80 font-amiri text-xs mt-1">
              مختوم بحب أبدي إلى {recipientName}
            </p>

            {/* Shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </motion.div>
        ) : (
          /* Opened Parchment Paper with Animated Handwritten Typing */
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            className="w-full bg-[#0a0206]/95 border-2 border-[#FFAC41]/60 rounded-3xl p-6 sm:p-10 shadow-[0_0_60px_rgba(255,30,86,0.35)] backdrop-blur-2xl text-right relative overflow-hidden"
          >
            {/* Corner Decorative Ornaments */}
            <Sparkles className="w-6 h-6 text-[#FFAC41] absolute top-4 left-4 opacity-80" />
            <Heart className="w-6 h-6 text-[#FF1E56] absolute bottom-4 left-4 opacity-80" />

            <div className="font-amiri text-lg sm:text-xl text-rose-100 leading-relaxed whitespace-pre-line min-h-[240px]">
              {typedText}
              {!isTypingComplete && (
                <span className="inline-block w-2 h-5 bg-[#FFAC41] mr-1 animate-ping" />
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-4 border-t border-[#FF1E56]/20 flex items-center justify-between">
              <button
                onClick={handleReplayLetter}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF1E56]/15 border border-[#FF1E56]/30 text-[#FFAC41] hover:text-white text-sm font-cairo transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>إعادة قراءة الرسالة</span>
              </button>

              <motion.button
                onClick={() => {
                  soundEngine.playClick();
                  onNextScene();
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="main-button-immersive px-6 py-2.5 rounded-full text-white font-cairo font-bold text-sm border border-white/30 flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>الذهاب إلى الوردة الأبدية 🌹</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
