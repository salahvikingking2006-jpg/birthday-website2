import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Heart, Sparkles, ArrowRight, X, Music, Volume2 } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface Props {
  onNextScene: () => void;
  recipientName: string;
}

interface SurpriseCard {
  id: number;
  title: string;
  desc: string;
  icon: string;
  color: string;
  isRoses100?: boolean;
  isRingCard?: boolean;
}

export const GiftBoxScene: React.FC<Props> = ({ onNextScene, recipientName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<SurpriseCard | null>(null);
  const [show100Roses, setShow100Roses] = useState(false);
  const [showRingModal, setShowRingModal] = useState(false);
  const [roseSparkles, setRoseSparkles] = useState<number[]>([]);

  const surpriseCards: SurpriseCard[] = [
    {
      id: 1,
      title: 'هدية السعادة المطلقة 🌟',
      desc: 'وعد بدعمكِ وتحقيق كافة أحلامكِ وطموحاتكِ دون تردد.',
      icon: '✨',
      color: 'from-amber-500/20 to-rose-500/20 border-amber-400/50',
    },
    {
      id: 2,
      title: 'الوعد بالخطوبة السعيدة 💍',
      desc: 'وعدٌ مخلص من القلب بالخطوبة الرسمية بعد 6 سنوات بإذن الله، لنبني معاً عش الزوجية السعيد ونكمل العمر سوياً.',
      icon: '💍',
      color: 'from-amber-500/30 via-pink-500/20 to-rose-500/30 border-amber-400/60 shadow-[0_0_20px_rgba(251,191,36,0.3)]',
      isRingCard: true,
    },
    {
      id: 3,
      title: 'باقة من 100 وردة حمراء 💐',
      desc: 'ورود عريقة تفوح بأسمى مشاعر الحب والافتخار بجمال روحكِ النقية.',
      icon: '🌹',
      color: 'from-rose-600/30 to-red-600/30 border-rose-400/60 shadow-[0_0_20px_rgba(244,63,94,0.3)]',
      isRoses100: true,
    },
    {
      id: 4,
      title: 'وعد الحب والأمان ❤️',
      desc: 'أن تبقي دائماً الأولوية والنور والملاذ الأخير في كل لحظة وفي كل زمان.',
      icon: '💖',
      color: 'from-fuchsia-500/20 to-pink-500/20 border-fuchsia-400/50',
    },
  ];

  const handleOpenGift = () => {
    if (isOpen) return;
    setIsOpen(true);
    soundEngine.playGiftOpen();
    soundEngine.playSparkle();
  };

  const handleCardClick = (card: SurpriseCard) => {
    soundEngine.playClick();
    if (card.isRoses100) {
      setShow100Roses(true);
      soundEngine.playRomanticSerenade();
      soundEngine.playBloom();
    } else if (card.isRingCard) {
      setShowRingModal(true);
      soundEngine.playSparkle();
      soundEngine.playRomanticSerenade();
    } else {
      setSelectedCard(card);
    }
  };

  const trigger100RosesFlourish = () => {
    soundEngine.playRomanticSerenade();
    soundEngine.playSparkle();
    soundEngine.playBloom();
    setRoseSparkles((prev) => [...prev, Date.now()]);
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
        className="mb-6 z-10"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-[#FFAC41] font-cairo drop-shadow-2xl">
          صندوق المفاجآت السحرية 🎁
        </h2>
        <p className="text-[#FF1E56] font-amiri text-base sm:text-lg mt-2 font-medium tracking-wide">
          {isOpen
            ? 'انقري على الهدايا في الأسفل لرؤية الوعود والمفاجآت المجهزة لكِ!'
            : 'اضغطي على الصندوق لفتحه ورؤية الهدايا الثمينة!'}
        </p>
      </motion.div>

      {/* Interactive 3D Shimmering Gift Box */}
      <div className="relative my-6 flex flex-col items-center justify-center cursor-pointer select-none">
        {/* Glow & Upward Beam of Light when opened */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute -top-48 w-40 h-72 bg-gradient-to-t from-amber-300/40 via-pink-400/20 to-transparent blur-xl pointer-events-none rounded-t-full"
          />
        )}

        {/* Floating Hearts & Sparkles bursting upward */}
        {isOpen && (
          <motion.div
            initial={{ y: 0, opacity: 1, scale: 0.5 }}
            animate={{ y: -180, opacity: 0, scale: 1.5 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
            className="absolute top-0 pointer-events-none z-30 flex flex-col items-center gap-2"
          >
            <Heart className="w-12 h-12 text-rose-400 fill-rose-400 filter drop-shadow-[0_0_15px_rgba(244,63,94,0.9)]" />
            <Sparkles className="w-6 h-6 text-amber-300" />
          </motion.div>
        )}

        {/* GIFT BOX MAIN GRAPHIC */}
        <motion.div
          onClick={handleOpenGift}
          animate={
            !isOpen
              ? {
                  y: [0, -8, 0],
                  rotate: [0, -1.5, 1.5, 0],
                }
              : {}
          }
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-64 h-64 sm:w-72 sm:h-72 flex flex-col items-center justify-end z-20"
        >
          {/* GIFT LID (Animates Upward when opened) */}
          <motion.div
            animate={isOpen ? { y: -80, rotate: -12, opacity: 0.9 } : { y: 0, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 14 }}
            className="relative w-72 sm:w-80 h-16 bg-gradient-to-r from-rose-600 via-pink-500 to-rose-600 rounded-t-xl border-t-2 border-amber-300 shadow-2xl z-30 flex items-center justify-center overflow-hidden"
          >
            {/* Shimmer Ribbon Light */}
            <div className="absolute inset-y-0 w-12 bg-amber-400 border-x border-amber-200/80 shadow-md" />
            {/* Ribbon Bow */}
            <div className="absolute -top-6 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-amber-300 border-2 border-amber-100 shadow-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-rose-600 animate-spin" />
              </div>
            </div>
          </motion.div>

          {/* GIFT BOX BASE */}
          <div className="relative w-64 sm:w-72 h-48 bg-gradient-to-b from-rose-900 via-pink-950 to-slate-950 rounded-b-xl border-x-2 border-b-2 border-rose-500/50 shadow-2xl z-20 flex items-center justify-center overflow-hidden">
            {/* Vertical Ribbon */}
            <div className="absolute inset-y-0 w-12 bg-amber-400/90 border-x border-amber-200/80 shadow-md flex items-center justify-center">
              <Heart className="w-6 h-6 text-rose-700 fill-rose-700 animate-pulse" />
            </div>
            {/* Horizontal Ribbon */}
            <div className="absolute inset-x-0 h-10 bg-amber-400/90 border-y border-amber-200/80 shadow-md" />

            {!isOpen && (
              <span className="relative z-30 font-cairo font-bold text-amber-200 text-sm bg-slate-950/80 px-3 py-1 rounded-full border border-amber-300/60 shadow-md">
                انقري هنا للفتح ✨
              </span>
            )}
          </div>
        </motion.div>
      </div>

      {/* REVEALED SURPRISE CARDS GRID */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-4xl z-20 my-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {surpriseCards.map((card) => (
                <motion.div
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  className={`p-5 rounded-2xl bg-gradient-to-br ${card.color} bg-slate-900/90 border shadow-xl backdrop-blur-xl cursor-pointer text-right flex items-start gap-4 transition-all hover:shadow-amber-500/20`}
                >
                  <div className="text-3xl p-3 rounded-2xl bg-slate-950/60 border border-amber-300/30 shadow-inner">
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-amber-200 font-cairo mb-1">
                      {card.title}
                    </h3>
                    <p className="text-rose-100/90 font-amiri text-sm leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Next Button to Final Scene */}
            <motion.button
              onClick={() => {
                soundEngine.playClick();
                onNextScene();
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 main-button-immersive px-8 py-3.5 rounded-full text-white font-cairo font-extrabold text-base border border-white/30 flex items-center gap-2 mx-auto cursor-pointer shadow-lg"
            >
              <span>الذهاب إلى المشهد السينمائي النهائي 🌙</span>
              <ArrowRight className="w-5 h-5 rotate-180" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Standard Card Details Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCard(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border-2 border-amber-400/60 shadow-2xl text-center relative"
            >
              <div className="text-5xl mb-4">{selectedCard.icon}</div>
              <h3 className="text-2xl font-bold text-amber-200 font-cairo mb-3">
                {selectedCard.title}
              </h3>
              <p className="text-rose-100 font-amiri text-lg leading-relaxed mb-6">
                {selectedCard.desc}
              </p>
              <button
                onClick={() => setSelectedCard(null)}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white font-cairo font-bold text-sm shadow-md cursor-pointer"
              >
                إغلاق المفاجأة ❤️
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SPECIAL ENGAGEMENT RING PROMISE MODAL 💍 */}
      <AnimatePresence>
        {showRingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRingModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.85, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full p-6 sm:p-8 rounded-3xl bg-[#0d030c]/95 border-2 border-amber-400/80 shadow-[0_0_90px_rgba(251,191,36,0.4)] text-center text-slate-100 font-cairo overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setShowRingModal(false);
                }}
                className="absolute top-4 left-4 p-2.5 rounded-full bg-rose-950/60 text-amber-300 hover:text-white hover:bg-rose-600/40 transition-all border border-amber-400/40 cursor-pointer z-30"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/50 text-amber-300 text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                <span>عَقدُ عهدٍ ووعد أزلي 💍</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-500 font-cairo">
                الوعد بالخطوبة السعيدة 💍
              </h3>
              <p className="text-rose-200/90 font-amiri text-sm mt-1">
                العهد المقدس المكتوب بماء الذهب لأجل ملاكي {recipientName}
              </p>

              {/* 3D GLOWING DIAMOND ENGAGEMENT RING GRAPHIC */}
              <div className="relative my-6 flex items-center justify-center">
                {/* Ring Light Aura */}
                <div className="absolute w-56 h-56 rounded-full bg-amber-400/25 blur-2xl animate-pulse pointer-events-none" />

                <motion.div
                  animate={{ y: [0, -8, 0], rotate: [0, 2, -2, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative z-20 cursor-pointer"
                  onClick={() => {
                    soundEngine.playSparkle();
                    soundEngine.playRomanticSerenade();
                  }}
                >
                  <svg viewBox="0 0 240 240" className="w-56 h-56 sm:w-64 sm:h-64 filter drop-shadow-[0_0_25px_rgba(251,191,36,0.6)]">
                    {/* Velvet Ring Box Interior Cushion Base */}
                    <ellipse cx="120" cy="185" rx="75" ry="30" fill="#1c0715" stroke="#78350f" strokeWidth="2" />
                    <ellipse cx="120" cy="180" rx="65" ry="22" fill="#2d0a21" stroke="#fbbf24" strokeWidth="1" />
                    {/* Ring Slot Cutout */}
                    <ellipse cx="120" cy="178" rx="40" ry="8" fill="#090207" />

                    {/* Golden Ring Band Torus */}
                    <ellipse cx="120" cy="140" rx="46" ry="32" fill="none" stroke="url(#goldBandGrad)" strokeWidth="14" />
                    <ellipse cx="120" cy="140" rx="46" ry="32" fill="none" stroke="#fef08a" strokeWidth="3" opacity="0.8" />

                    {/* Ring Crown Base & Solitaire Prongs */}
                    <path d="M 108 108 L 112 90 L 128 90 L 132 108 Z" fill="url(#goldBandGrad)" stroke="#78350f" strokeWidth="1.5" />

                    {/* Platinum Solitaire Prongs */}
                    <path d="M 104 90 L 108 72" fill="none" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 136 90 L 132 72" fill="none" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 120 92 L 120 68" fill="none" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" />

                    {/* BRILLIANT SOLITAIRE DIAMOND GEMSTONE */}
                    <g transform="translate(120, 72)">
                      {/* Diamond Main Body Facets */}
                      <polygon points="0,-22 18,-8 14,12 0,22 -14,12 -18,-8" fill="url(#diamondBaseGrad)" stroke="#cbd5e1" strokeWidth="1.5" />
                      
                      {/* Top Table Facet */}
                      <polygon points="0,-22 10,-12 -10,-12" fill="#ffffff" opacity="0.95" />
                      <polygon points="10,-12 18,-8 10,0 0,-5" fill="#bae6fd" opacity="0.8" />
                      <polygon points="-10,-12 -18,-8 -10,0 0,-5" fill="#e0f2fe" opacity="0.85" />
                      <polygon points="-10,0 0,-5 10,0 14,12 0,22 -14,12" fill="#7dd3fc" opacity="0.6" />
                      <polygon points="0,-5 0,22" fill="none" stroke="#ffffff" strokeWidth="1" />

                      {/* Diamond Light Flare Starburst */}
                      <circle cx="-4" cy="-12" r="3" fill="#ffffff" className="animate-ping" />
                      <line x1="-15" y1="-15" x2="7" y2="-9" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="-4" y1="-24" x2="-4" y2="0" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                    </g>

                    {/* Floating Sparkle Rays */}
                    <circle cx="65" cy="80" r="3" fill="#fef08a" className="animate-pulse" />
                    <circle cx="175" cy="85" r="3.5" fill="#fff" className="animate-pulse" />
                    <circle cx="120" cy="35" r="4" fill="#fbbf24" className="animate-ping" />

                    <defs>
                      <linearGradient id="goldBandGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="30%" stopColor="#f59e0b" />
                        <stop offset="70%" stopColor="#d97706" />
                        <stop offset="100%" stopColor="#78350f" />
                      </linearGradient>

                      <linearGradient id="diamondBaseGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="40%" stopColor="#e0f2fe" />
                        <stop offset="80%" stopColor="#7dd3fc" />
                        <stop offset="100%" stopColor="#0284c7" />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>
              </div>

              {/* Romantic Pledge Card */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border-2 border-amber-400/50 shadow-inner mb-6">
                <p className="text-[#FFAC41] font-cairo font-extrabold text-lg mb-2">
                  "وعدٌ صادق ومخلص بالخطوبة الرسمية"
                </p>
                <p className="text-rose-100 font-amiri text-base sm:text-lg leading-relaxed">
                  "أعدكِ من أعماق قلبي بالخطوبة الرسمية بعد 6 سنوات بإذن الله، لنبني معاً عش الزوجية السعيد، ونضيء طريقنا بالحب والدفء والوفاء الأبدي يا {recipientName}."
                </p>
              </div>

              <button
                onClick={() => setShowRingModal(false)}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-cairo font-extrabold text-base shadow-xl cursor-pointer hover:scale-105 transition-all"
              >
                قبول الوعد الجميل ❤️
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SPECIAL 100 ROSES BOUQUET ANIMATED ROMANTIC MODAL */}
      <AnimatePresence>
        {show100Roses && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShow100Roses(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.85, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full p-6 sm:p-8 rounded-3xl bg-[#0c030a]/95 border-2 border-[#FFAC41]/70 shadow-[0_0_80px_rgba(244,63,94,0.45)] text-center text-slate-100 font-cairo overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setShow100Roses(false);
                }}
                className="absolute top-4 left-4 p-2.5 rounded-full bg-rose-950/60 text-rose-300 hover:text-white hover:bg-rose-600/40 transition-all border border-rose-500/40 cursor-pointer z-30"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title Header */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/60 border border-amber-400/50 text-amber-300 text-xs font-bold mb-3">
                <Music className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>تعزف الأغنية الرومانسية الآن 🎵</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-[#FFAC41] font-cairo">
                باقة 100 وردة حمراء فاخرة 💐
              </h3>
              <p className="text-rose-200/90 font-amiri text-sm mt-1">
                هدية مفعمة بأصدق مشاعر العاطفة والحب لأغلى إنسانة {recipientName}
              </p>

              {/* REALISTIC DETAILED 100 ROSES BOUQUET ANIMATED GRAPHIC */}
              <div className="relative my-6 flex items-center justify-center">
                {/* Glowing Aura Ring */}
                <div className="absolute w-64 h-64 rounded-full bg-rose-600/30 blur-2xl animate-pulse pointer-events-none" />

                {/* Floating Heart & Sparkle Particles */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.5, y: 0, x: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0.5, 1.2, 0.8],
                        y: [-20, -120 - Math.random() * 60],
                        x: [(Math.random() - 0.5) * 160, (Math.random() - 0.5) * 200],
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: i * 0.25,
                      }}
                      className="absolute"
                    >
                      <Heart className="w-5 h-5 text-rose-400 fill-rose-500 shadow-lg" />
                    </motion.div>
                  ))}
                </div>

                {/* SVG BOUQUET OF REALISTIC BLOOMING PETAL ROSES */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative z-20 cursor-pointer"
                  onClick={trigger100RosesFlourish}
                >
                  <svg viewBox="0 0 260 280" className="w-64 h-68 sm:w-76 sm:h-80 drop-shadow-2xl">
                    <defs>
                      <linearGradient id="rosePetalGrad1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffe4e6" />
                        <stop offset="30%" stopColor="#fb7185" />
                        <stop offset="70%" stopColor="#e11d48" />
                        <stop offset="100%" stopColor="#881337" />
                      </linearGradient>

                      <linearGradient id="rosePetalGrad2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f43f5e" />
                        <stop offset="50%" stopColor="#be123c" />
                        <stop offset="100%" stopColor="#4c0519" />
                      </linearGradient>

                      <linearGradient id="wrapperGoldGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#78350f" />
                      </linearGradient>
                    </defs>

                    {/* Stems Bundle Base */}
                    <g transform="translate(130, 210)">
                      <line x1="-15" y1="0" x2="-25" y2="50" stroke="#14532d" strokeWidth="4" />
                      <line x1="-5" y1="0" x2="-8" y2="55" stroke="#166534" strokeWidth="4" />
                      <line x1="5" y1="0" x2="8" y2="55" stroke="#15803d" strokeWidth="4" />
                      <line x1="15" y1="0" x2="25" y2="50" stroke="#14532d" strokeWidth="4" />
                    </g>

                    {/* Satin Golden Wrapper Cone */}
                    <path
                      d="M 65 170 L 130 250 L 195 170 Z"
                      fill="url(#wrapperGoldGrad)"
                      stroke="#d97706"
                      strokeWidth="2"
                    />
                    <path d="M 65 170 Q 130 195 195 170" fill="none" stroke="#fef3c7" strokeWidth="2.5" />

                    {/* Ribbon Bow on Wrapper */}
                    <g transform="translate(130, 192)">
                      <circle cx="0" cy="0" r="11" fill="#fbbf24" stroke="#78350f" strokeWidth="2" />
                      <path d="M -11 0 C -38 -22 -38 22 -11 0 Z" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
                      <path d="M 11 0 C 38 -22 38 22 11 0 Z" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
                      {/* Ribbon Tails */}
                      <path d="M -4 8 L -18 35 L -8 32 L 0 8" fill="#d97706" />
                      <path d="M 4 8 L 18 35 L 8 32 L 0 8" fill="#d97706" />
                    </g>

                    {/* Lush Green Leaf Accents Behind Roses */}
                    <g>
                      <path d="M 45 120 C 25 100 30 140 60 130 Z" fill="#15803d" stroke="#052e16" strokeWidth="1" />
                      <path d="M 215 120 C 235 100 230 140 200 130 Z" fill="#15803d" stroke="#052e16" strokeWidth="1" />
                      <path d="M 80 60 C 60 40 70 70 100 70 Z" fill="#166534" stroke="#052e16" strokeWidth="1" />
                      <path d="M 180 60 C 200 40 190 70 160 70 Z" fill="#166534" stroke="#052e16" strokeWidth="1" />
                    </g>

                    {/* REALISTIC OVERLAPPING PETAL ROSE BLOOMS CLUSTER (35+ Detailed Rose Heads) */}
                    <g>
                      {[
                        // Top Crown Cluster
                        { x: 130, y: 58, s: 20 },
                        { x: 105, y: 62, s: 18 },
                        { x: 155, y: 62, s: 18 },
                        { x: 80, y: 72, s: 17 },
                        { x: 180, y: 72, s: 17 },
                        { x: 60, y: 88, s: 16 },
                        { x: 200, y: 88, s: 16 },

                        // Upper Middle Cluster
                        { x: 130, y: 82, s: 21 },
                        { x: 100, y: 88, s: 19 },
                        { x: 160, y: 88, s: 19 },
                        { x: 72, y: 104, s: 18 },
                        { x: 188, y: 104, s: 18 },
                        { x: 48, y: 112, s: 16 },
                        { x: 212, y: 112, s: 16 },

                        // Central Heart Density
                        { x: 130, y: 108, s: 22 },
                        { x: 98, y: 112, s: 20 },
                        { x: 162, y: 112, s: 20 },
                        { x: 68, y: 128, s: 18 },
                        { x: 192, y: 128, s: 18 },

                        // Lower Tier Cluster
                        { x: 130, y: 134, s: 21 },
                        { x: 102, y: 138, s: 19 },
                        { x: 158, y: 138, s: 19 },
                        { x: 78, y: 150, s: 17 },
                        { x: 182, y: 150, s: 17 },
                        { x: 130, y: 158, s: 19 },
                        { x: 106, y: 164, s: 16 },
                        { x: 154, y: 164, s: 16 },
                      ].map((r, i) => (
                        <g key={i} transform={`translate(${r.x}, ${r.y}) scale(${r.s / 20})`}>
                          {/* Outer Petals */}
                          <path
                            d="M -15 -4 C -22 -18 -7 -22 0 -10 C 7 -22 22 -18 15 -4 C 19 12 0 17 0 17 C 0 17 -19 12 -15 -4 Z"
                            fill="url(#rosePetalGrad2)"
                            stroke="#450a0a"
                            strokeWidth="1.2"
                          />
                          {/* Inner Petal Layers */}
                          <path
                            d="M -10 -5 C -15 -14 -4 -18 0 -9 C 4 -18 15 -14 10 -5 C 13 7 0 11 0 11 C 0 11 -13 7 -10 -5 Z"
                            fill="url(#rosePetalGrad1)"
                            stroke="#881337"
                            strokeWidth="1"
                          />
                          {/* Core Spiral */}
                          <path
                            d="M -5 -6 C -8 -11 -2 -14 0 -7 C 2 -14 8 -11 5 -6 C 7 3 0 5 0 5 C 0 5 -7 3 -5 -6 Z"
                            fill="#ffe4e6"
                            opacity="0.9"
                          />
                          <circle cx="0" cy="-5" r="1.5" fill="#fef08a" />
                        </g>
                      ))}

                      {/* Sparkles on bouquet */}
                      <circle cx="130" cy="82" r="3" fill="#ffffff" className="animate-ping" />
                      <circle cx="98" cy="112" r="2.5" fill="#fef08a" className="animate-ping" />
                      <circle cx="162" cy="112" r="3" fill="#ffffff" className="animate-ping" />
                    </g>
                  </svg>
                </motion.div>
              </div>

              {/* Romantic Dedication Message */}
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 mb-6">
                <p className="text-rose-100 font-amiri text-base sm:text-lg leading-relaxed">
                  "مائة وردة حمراء حقيقية لا تكفي للتعبير عن مقدار حبكِ في قلبي.. أنتِ زهرة الروح وعبير الأيام يا {recipientName}."
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={trigger100RosesFlourish}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 text-white font-cairo font-extrabold text-sm shadow-lg flex items-center gap-2 cursor-pointer hover:scale-105 transition-all"
                >
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>عزف نغمات الورود الرومانسية 🎵</span>
                </button>

                <button
                  onClick={() => setShow100Roses(false)}
                  className="px-6 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-rose-200 font-cairo font-bold text-sm border border-rose-500/30 cursor-pointer transition-all"
                >
                  إغلاق الباقة ❤️
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
