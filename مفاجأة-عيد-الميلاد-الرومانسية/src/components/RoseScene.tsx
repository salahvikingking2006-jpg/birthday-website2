import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, ArrowRight, RefreshCw, Sun } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface Props {
  onNextScene: () => void;
  recipientName: string;
}

interface FallingPetal {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  speedY: number;
  speedX: number;
}

export const RoseScene: React.FC<Props> = ({ onNextScene, recipientName }) => {
  const [isBloomed, setIsBloomed] = useState(false);
  const [fallingPetals, setFallingPetals] = useState<FallingPetal[]>([]);

  const handleRoseClick = () => {
    if (!isBloomed) {
      setIsBloomed(true);
      soundEngine.playBloom();
      soundEngine.playSparkle();

      // Create falling rose petals
      const newPetals: FallingPetal[] = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 220,
        y: Math.random() * -40,
        rotation: Math.random() * 360,
        scale: Math.random() * 0.7 + 0.6,
        speedY: Math.random() * 2 + 1.2,
        speedX: (Math.random() - 0.5) * 1.8,
      }));
      setFallingPetals(newPetals);
    } else {
      // Add extra falling petals on tap
      soundEngine.playClick();
      const extraPetals: FallingPetal[] = Array.from({ length: 10 }, (_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 260,
        y: -20,
        rotation: Math.random() * 360,
        scale: Math.random() * 0.6 + 0.5,
        speedY: Math.random() * 2 + 1.2,
        speedX: (Math.random() - 0.5) * 1.8,
      }));
      setFallingPetals((prev) => [...prev, ...extraPetals]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 md:p-8 text-center"
    >
      {/* Title Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-4 z-10"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/60 border border-amber-400/40 text-amber-300 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
          <span>الزهرة الأبدية المحفوظة 🌹</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-rose-100 to-[#FFAC41] font-cairo drop-shadow-lg">
          زهرة الحب الأبدية 🌹
        </h2>
        <p className="text-rose-200 font-amiri text-base sm:text-lg mt-2 font-medium tracking-wide">
          {isBloomed
            ? 'تفتحت وردتكِ الأبدية لترسم أسمى معاني الحب والوفاء!'
            : 'اضغطي على القبة الزجاجية لتتفتح زهرة الورد الأبدية وتتساقط بتلاتها الساحرة!'}
        </p>
      </motion.div>

      {/* Main Glass Dome Cloche & Eternal Rose Graphic */}
      <div className="relative my-4 flex flex-col items-center justify-center select-none">
        
        {/* Soft, Non-Glaring Background Halo (Subtle, Dark & Clean - NO blur wash out) */}
        <div
          className={`absolute w-72 h-72 rounded-full transition-all duration-1000 blur-xl pointer-events-none ${
            isBloomed
              ? 'bg-rose-900/30 scale-110 border border-amber-400/20'
              : 'bg-slate-900/40 scale-95'
          }`}
        />

        {/* Falling Petals simulation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
          {fallingPetals.map((petal) => (
            <motion.div
              key={petal.id}
              initial={{ x: petal.x, y: petal.y, rotate: petal.rotation, opacity: 1 }}
              animate={{
                y: 380,
                x: petal.x + petal.speedX * 70,
                rotate: petal.rotation + 220,
                opacity: 0,
              }}
              transition={{ duration: 4.5 + Math.random() * 2, ease: 'easeOut' }}
              className="absolute left-1/2 top-1/4"
            >
              <div
                style={{ transform: `scale(${petal.scale})` }}
                className="w-6 h-8 bg-gradient-to-br from-rose-600 via-pink-600 to-rose-900 rounded-full rounded-tr-none shadow-lg border border-rose-300/40 opacity-95"
              />
            </motion.div>
          ))}
        </div>

        {/* HIGH CONTRAST CLEAR ETERNAL ROSE DOME */}
        <motion.div
          onClick={handleRoseClick}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="relative z-20 cursor-pointer p-4 rounded-3xl bg-slate-950/70 border border-amber-400/40 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-md"
        >
          <svg
            viewBox="0 0 240 320"
            className="w-64 h-80 sm:w-72 sm:h-96 filter drop-shadow-[0_4px_15px_rgba(0,0,0,0.9)] transition-all duration-500"
          >
            {/* Wooden / Obsidian Pedestal Base */}
            <ellipse cx="120" cy="285" rx="90" ry="18" fill="#1e1b1e" stroke="#d97706" strokeWidth="3" />
            <ellipse cx="120" cy="280" rx="84" ry="14" fill="#292524" stroke="#f59e0b" strokeWidth="1.5" />
            <rect x="40" y="275" width="160" height="12" rx="4" fill="#1c1917" stroke="#b45309" strokeWidth="2" />

            {/* Glass Cloche Dome Outline */}
            <path
              d="M 50 275 L 50 120 A 70 70 0 0 1 190 120 L 190 275 Z"
              fill="rgba(255, 255, 255, 0.04)"
              stroke="rgba(251, 191, 36, 0.6)"
              strokeWidth="2.5"
            />

            {/* Glass Highlight Reflections */}
            <path
              d="M 65 260 L 65 130 A 55 55 0 0 1 110 75"
              fill="none"
              stroke="rgba(255, 255, 255, 0.35)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M 75 250 L 75 145"
              fill="none"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Rose Wooden Base Knob Top */}
            <circle cx="120" cy="48" r="8" fill="#f59e0b" stroke="#fff" strokeWidth="1" />

            {/* Stem & Leaves - Sharp High Contrast Green */}
            <path
              d="M 120 140 Q 112 210 120 275"
              fill="none"
              stroke="#15803d"
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* Inner Dark Stem Detail */}
            <path
              d="M 120 140 Q 112 210 120 275"
              fill="none"
              stroke="#042f2e"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Left Leaf */}
            <g transform="translate(115, 210)">
              <path
                d="M 0 0 C -40 -15 -45 15 0 20 Z"
                fill="#16a34a"
                stroke="#052e16"
                strokeWidth="2"
              />
              <path d="M 0 0 L -25 5" fill="none" stroke="#bbf7d0" strokeWidth="1.5" />
            </g>

            {/* Right Leaf */}
            <g transform="translate(122, 235)">
              <path
                d="M 0 0 C 40 -15 45 15 0 20 Z"
                fill="#16a34a"
                stroke="#052e16"
                strokeWidth="2"
              />
              <path d="M 0 0 L 25 5" fill="none" stroke="#bbf7d0" strokeWidth="1.5" />
            </g>

            {/* Fallen Petals at Bottom of Dome */}
            <g transform="translate(90, 268)">
              <ellipse cx="0" cy="0" rx="12" ry="6" fill="#be123c" stroke="#4c0519" strokeWidth="1" />
            </g>
            <g transform="translate(145, 270)">
              <ellipse cx="0" cy="0" rx="14" ry="7" fill="#9f1239" stroke="#4c0519" strokeWidth="1" />
            </g>

            {/* HIGH-VISIBILITY ETERNAL ROSE BLOOM (Crisp Crimson & Ruby Red with Gold Trimming) */}
            <g transform="translate(120, 130)">
              {/* Layer 4 - Base Calyx */}
              <path d="M -15 15 Q 0 35 15 15 Q 0 25 -15 15 Z" fill="#15803d" stroke="#052e16" strokeWidth="2" />

              {/* Layer 3 - Outer Wide Petals */}
              <motion.path
                d="M -50 -10 C -75 -50 -25 -85 0 -35 C 25 -85 75 -50 50 -10 C 60 35 0 50 0 50 C 0 50 -60 35 -50 -10 Z"
                fill="url(#deepRubyGrad3)"
                stroke="#450a0a"
                strokeWidth="2.5"
                animate={isBloomed ? { scale: 1.3, rotate: 10 } : { scale: 1.0 }}
                transition={{ duration: 1, ease: 'backOut' }}
              />

              {/* Layer 2 - Middle Petals */}
              <motion.path
                d="M -35 -15 C -55 -55 -15 -70 0 -30 C 15 -70 55 -55 35 -15 C 40 25 0 38 0 38 C 0 38 -40 25 -35 -15 Z"
                fill="url(#deepRubyGrad2)"
                stroke="#7f1d1d"
                strokeWidth="2"
                animate={isBloomed ? { scale: 1.2, rotate: -12 } : { scale: 1.05 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />

              {/* Layer 1 - Inner Spiral Core Bud */}
              <motion.path
                d="M -20 -20 C -30 -45 -5 -55 0 -25 C 5 -55 30 -45 20 -20 C 25 15 0 25 0 25 C 0 25 -25 15 -20 -20 Z"
                fill="url(#deepRubyGrad1)"
                stroke="#fecdd3"
                strokeWidth="1.5"
                animate={isBloomed ? { scale: 1.15, rotate: 6 } : { scale: 1.1 }}
                transition={{ duration: 0.6 }}
              />

              {/* Center Golden Sparkle Accent */}
              <circle cx="0" cy="-25" r="4" fill="#fbbf24" className="animate-pulse" />
            </g>

            {/* Rich Ruby Red Gradients */}
            <defs>
              <linearGradient id="deepRubyGrad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffe4e6" />
                <stop offset="35%" stopColor="#fb7185" />
                <stop offset="70%" stopColor="#e11d48" />
                <stop offset="100%" stopColor="#881337" />
              </linearGradient>

              <linearGradient id="deepRubyGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="50%" stopColor="#be123c" />
                <stop offset="100%" stopColor="#4c0519" />
              </linearGradient>

              <linearGradient id="deepRubyGrad3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e11d48" />
                <stop offset="60%" stopColor="#9f1239" />
                <stop offset="100%" stopColor="#2e020d" />
              </linearGradient>
            </defs>
          </svg>

          {/* Prompt Label Under Cloche */}
          <div className="mt-2 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-rose-950/80 border border-amber-400/50 text-amber-200 text-xs font-bold font-cairo shadow">
              {isBloomed ? 'انقري لإسقاط بتلات إضافية 🌸' : 'اضغطي على القبة لتفتيح الوردة ✨'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Romantic Note Card on Bloom */}
      <AnimatePresence>
        {isBloomed && (
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 120 }}
            className="z-20 max-w-lg w-full p-6 rounded-3xl bg-[#0a0206]/95 border-2 border-[#FFAC41]/60 shadow-[0_0_50px_rgba(255,30,86,0.35)] backdrop-blur-2xl text-center my-4"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[#FFAC41] animate-spin" />
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#FFAC41] font-cairo">
                وردة حمرّاء لا تذبل أبداً ❤️
              </h3>
            </div>
            <p className="text-rose-100 font-amiri text-base sm:text-lg leading-relaxed mb-6">
              "كما تفتحت هذه الوردة، تتفتح حياتنا بالسعادة والدفء والحنان في حضوركِ يا {recipientName}."
            </p>

            <motion.button
              onClick={() => {
                soundEngine.playClick();
                onNextScene();
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="main-button-immersive px-6 py-2.5 rounded-full text-white font-cairo font-bold text-sm border border-white/30 flex items-center gap-2 mx-auto cursor-pointer shadow-md"
            >
              <span>الانتقال إلى صندوق المفاجآت 🎁</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
