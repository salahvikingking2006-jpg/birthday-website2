import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, RefreshCw, Music, Star, Volume2 } from 'lucide-react';
import gsap from 'gsap';
import { soundEngine } from '../audio/soundEngine';

interface Props {
  onReplay: () => void;
  recipientName: string;
  onOpenSongModal?: () => void;
}

interface StardustParticle {
  id: string;
  seed: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

export const FinalScene: React.FC<Props> = ({ onReplay, recipientName, onOpenSongModal }) => {
  const moonGlowRef = useRef<HTMLDivElement>(null);
  const moonCrescentRef = useRef<SVGGElement>(null);
  const stardustCountRef = useRef<number>(0);
  const [textStage, setTextStage] = useState<number>(0);
  const [stardust, setStardust] = useState<StardustParticle[]>([]);
  const [moonPulseCount, setMoonPulseCount] = useState<number>(0);
  const [hasClickedMoon, setHasClickedMoon] = useState<boolean>(false);
  const [hoveredStarId, setHoveredStarId] = useState<number | null>(null);
  const lastTwinkleTimeRef = useRef<number>(0);

  // Handle star hover with soft twinkling sound effect
  const handleStarHover = (starId: number) => {
    setHoveredStarId(starId);
    const now = Date.now();
    if (now - lastTwinkleTimeRef.current > 60) {
      soundEngine.playStarTwinkleSound(starId);
      lastTwinkleTimeRef.current = now;
    }
  };

  // Handle Interactive Moon Click
  const handleMoonClick = () => {
    soundEngine.playMoonMagicSound();
    setHasClickedMoon(true);
    setMoonPulseCount((prev) => prev + 1);

    // GSAP Moon Crescent radiant expansion
    if (moonCrescentRef.current) {
      gsap.fromTo(
        moonCrescentRef.current,
        { scale: 1 },
        { scale: 1.3, duration: 0.4, yoyo: true, repeat: 1, ease: 'power2.out' }
      );
    }

    // Spawn 28 sparkling stardust particles cascading from moon downwards to couple
    const now = Date.now();
    const newParticles: StardustParticle[] = Array.from({ length: 28 }).map((_, i) => {
      const angle = (Math.PI * 0.8 * (i / 28)) - (Math.PI * 0.4);
      const startDist = 20 + Math.random() * 60;
      const startX = 720 + Math.sin(angle) * startDist;
      const startY = 220 + Math.cos(angle) * startDist * 0.5;

      // Target position around couple on hill (x: 520..920, y: 460..660)
      const targetX = 720 + (Math.random() - 0.5) * 440;
      const targetY = 460 + Math.random() * 200;

      const colors = ['#FFFBEB', '#FDE68A', '#F59E0B', '#F43F5E', '#FFFFFF'];
      stardustCountRef.current += 1;

      return {
        id: `stardust-${now}-${stardustCountRef.current}-${i}`,
        seed: i + Math.random(),
        startX,
        startY,
        targetX,
        targetY,
        size: 2.5 + Math.random() * 4.5,
        duration: 1.8 + Math.random() * 2.2,
        delay: i * 0.04,
        color: colors[i % colors.length],
      };
    });

    setStardust((prev) => [...prev.slice(-40), ...newParticles]);
  };

  // Organically scattered stars across the night sky (not in lines)
  const scatteredStars = useMemo(() => {
    return Array.from({ length: 90 }).map((_, i) => {
      // Deterministic pseudo-random formulas based on index i
      const r1 = Math.abs(Math.sin(i * 12.9898 + 78.233) * 43758.5453) % 1;
      const r2 = Math.abs(Math.sin(i * 63.7264 + 19.892) * 23421.631) % 1;
      const r3 = Math.abs(Math.sin(i * 93.2847 + 45.123) * 85731.124) % 1;
      const r4 = Math.abs(Math.sin(i * 34.1123 + 89.432) * 12934.543) % 1;

      const topVal = r1 * 72 + 2;
      const leftVal = r2 * 96 + 2;

      return {
        id: i,
        topVal,
        leftVal,
        top: `${topVal}%`, // Scatter vertically across 2% to 74%
        left: `${leftVal}%`, // Scatter horizontally across 2% to 98%
        size: 3 + r3 * 5, // Sizes from 3px to 8px
        duration: 1.6 + r4 * 3.2,
        delay: r2 * 3,
        minOpacity: 0.1 + r3 * 0.15,
        maxOpacity: 0.85 + r4 * 0.15,
      };
    });
  }, []);

  // Dense swaying grass field across the entire hill crest with concentrated density under couple
  const denseGrassTufts = useMemo(() => {
    const tufts = [];
    const count = 135; // 135 grass tufts for rich density
    for (let i = 0; i < count; i++) {
      // Deterministic pseudo-random seed
      const r1 = Math.abs(Math.sin(i * 17.583 + 3.14) * 43758.545) % 1;
      const r2 = Math.abs(Math.sin(i * 31.912 + 7.82) * 23421.631) % 1;
      const r3 = Math.abs(Math.sin(i * 57.123 + 12.9) * 85731.124) % 1;

      // Concentrated distribution around couple (x = 550 to 890) and spread across hill
      let x;
      if (i < 65) {
        // High density around seating area
        x = 540 + (i / 65) * 360 + (r1 - 0.5) * 20;
      } else {
        // Broad distribution across entire hill crest
        x = 20 + ((i - 65) / 70) * 1400 + (r1 - 0.5) * 24;
      }

      const t = Math.max(0, Math.min(1, x / 1440));

      // Calculate exact hill surface Y curve (Quad Bezier M 0 690 Q 720 500 1440 680)
      const yHill = (1 - t) * (1 - t) * 690 + 2 * (1 - t) * t * 500 + t * t * 680;

      // Vertical offset so blades nestle naturally into ground
      const y = yHill + (r2 - 0.5) * 6;

      const numBlades = 3 + Math.floor(r3 * 4); // 3 to 6 blades per tuft
      const bladeColors = ['#818cf8', '#a5b4fc', '#6366f1', '#c084fc', '#93c5fd', '#818cf8', '#a855f7', '#38bdf8'];

      const blades = [];
      for (let j = 0; j < numBlades; j++) {
        const rB1 = Math.abs(Math.sin((i * 10 + j) * 11.23 + 1.1) * 12345.67) % 1;
        const rB2 = Math.abs(Math.sin((i * 10 + j) * 23.45 + 2.2) * 98765.43) % 1;

        const dx = (j - numBlades / 2) * 3.2 + (rB1 - 0.5) * 2.5;
        const height = (i < 65 ? 22 : 16) + rB2 * 24; // Extra tall grass near couple
        const curveX = (rB1 > 0.5 ? 1 : -1) * (4 + rB2 * 12); // wind bend curve

        blades.push({
          dx,
          height,
          curveX,
          color: bladeColors[(i + j) % bladeColors.length],
          strokeWidth: 1.5 + rB1 * 1.3,
        });
      }

      tufts.push({
        id: i,
        x,
        y,
        blades,
        duration: 2.2 + r1 * 2.4, // 2.2s to 4.6s sway cycle
        delay: r2 * 2,
        maxAngle: 8 + r3 * 10, // 8 to 18 deg sway in wind
        isForeground: i < 65,
      });
    }
    return tufts;
  }, []);

  // Sequential text timeline effect
  useEffect(() => {
    soundEngine.startBGM();
    soundEngine.playRomanticSerenade();
    soundEngine.playNightWindSound();

    const t1 = setTimeout(() => setTextStage(1), 1200);  // "كل عام وأنتِ بخير يا ملاك ❤️"
    const t2 = setTimeout(() => setTextStage(2), 4800);  // "أتمنى أن تكون كل أيامكِ سعادة"
    const t3 = setTimeout(() => setTextStage(3), 8500);  // "أحبكِ أكثر مما تستطيع الكلمات وصفه"
    const t4 = setTimeout(() => setTextStage(4), 12500); // "مع كل حبي... صلاح الدين ❤️"

    // GSAP Moon Glow Aura rotation/pulse
    if (moonGlowRef.current) {
      gsap.to(moonGlowRef.current, {
        scale: 1.2,
        opacity: 0.95,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.easeInOut',
      });
    }

    // GSAP Moon Crescent radiant pulse
    if (moonCrescentRef.current) {
      gsap.to(moonCrescentRef.current, {
        scale: 1.06,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.easeInOut',
      });
    }

    // Periodic wind and cricket audio ambience
    soundEngine.playNightWindSound(); // Play wind immediately on scene mount
    const windInterval = setInterval(() => {
      soundEngine.playNightWindSound();
    }, 5500);

    const cricketInterval = setInterval(() => {
      soundEngine.playCricketChirp();
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearInterval(windInterval);
      clearInterval(cricketInterval);
    };
  }, []);

  // Fireflies scattered organically ACROSS THE ENTIRE SCREEN with delicate small glowing sizes
  const fireflies = useMemo(() => {
    return Array.from({ length: 36 }).map((_, i) => {
      // Deterministic pseudo-random generation
      const r1 = Math.abs(Math.sin(i * 17.123 + 45.67) * 43758.54) % 1;
      const r2 = Math.abs(Math.sin(i * 31.456 + 12.89) * 23421.63) % 1;
      const r3 = Math.abs(Math.sin(i * 89.123 + 76.54) * 85731.12) % 1;
      const r4 = Math.abs(Math.sin(i * 54.321 + 98.76) * 12934.54) % 1;

      // Varied tiny sizes: small, medium, large
      let sizeType: 'small' | 'medium' | 'large' = 'medium';
      if (i % 3 === 0) sizeType = 'small';
      else if (i % 5 === 0) sizeType = 'large';

      const sizes = {
        small: { core: 0.9, aura: 2.2, outerGlow: 4.5 },
        medium: { core: 1.4, aura: 3.5, outerGlow: 7.0 },
        large: { core: 2.2, aura: 5.2, outerGlow: 10.0 },
      }[sizeType];

      return {
        id: i,
        cx: 60 + r1 * 1320, // Spread across entire 1440 width
        cy: 320 + r2 * 460, // Spread vertically from lower sky to grass base
        rx: 50 + r3 * 150,
        ry: 35 + r4 * 90,
        duration: 5.5 + r3 * 8.5,
        delay: r2 * 4,
        sizes,
        color: i % 2 === 0 ? '#fde047' : '#fef08a',
      };
    });
  }, []);

  // White Curved Shooting Stars (شهاب بيضاء مسار منحني)
  const curvedMeteors = [
    { id: 1, path: 'M 100 80 Q 400 180 800 320', delay: 1, duration: 3.2 },
    { id: 2, path: 'M 600 40 Q 950 160 1350 350', delay: 5.5, duration: 2.8 },
    { id: 3, path: 'M 300 120 Q 650 280 1100 450', delay: 10, duration: 3.5 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2 }}
      className="relative z-10 w-full min-h-screen flex flex-col items-center justify-between p-4 sm:p-8 text-center overflow-hidden select-none"
    >
      {/* 🎬 SLOW CINEMATIC CAMERA CONTAINER (SLOW ZOOM OUT OUTWARD DRIFT) */}
      <motion.div
        animate={{
          scale: [1.06, 1],
          y: [-10, 0],
        }}
        transition={{
          duration: 20,
          ease: 'easeOut',
        }}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
      >
        {/* Deep Midnight Sky Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#01030d] via-[#070a1f] to-[#120721]" />

        {/* Soft Ground Fog Layer */}
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#090d24]/60 via-[#1e1b4b]/20 to-transparent blur-2xl z-10" />

        {/* Ambient Moonlight Beam Radial Aura */}
        <div
          ref={moonGlowRef}
          className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-radial from-amber-100/35 via-amber-200/15 to-transparent blur-3xl pointer-events-none"
        />

        {/* 🌟 ORGANICALLY SCATTERED TWINKLING STARS IN THE ROMANTIC SKY WITH HOVER MAGIC */}
        <div
          className="absolute inset-0 pointer-events-auto z-10"
          onMouseLeave={() => setHoveredStarId(null)}
        >
          {scatteredStars.map((star) => {
            const isHovered = hoveredStarId === star.id;
            let isNearby = false;

            if (hoveredStarId !== null && !isHovered) {
              const hStar = scatteredStars[hoveredStarId];
              if (hStar) {
                const dist = Math.hypot(star.leftVal - hStar.leftVal, (star.topVal - hStar.topVal) * 1.35);
                if (dist < 14) {
                  isNearby = true;
                }
              }
            }

            return (
              <motion.div
                key={`scattered-star-${star.id}`}
                onMouseEnter={() => handleStarHover(star.id)}
                initial={{ opacity: star.minOpacity }}
                animate={
                  isHovered
                    ? { opacity: 1, scale: 2.5 }
                    : isNearby
                    ? { opacity: 0.95, scale: 1.6 }
                    : {
                        opacity: [star.minOpacity, star.maxOpacity, star.minOpacity],
                        scale: [0.75, 1.3, 0.75],
                      }
                }
                transition={
                  isHovered || isNearby
                    ? { duration: 0.2, ease: 'easeOut' }
                    : {
                        duration: star.duration,
                        repeat: Infinity,
                        delay: star.delay,
                        ease: 'easeInOut',
                      }
                }
                style={{
                  top: star.top,
                  left: star.left,
                }}
                className="absolute flex items-center justify-center cursor-pointer p-1 -m-1"
              >
                <Star
                  className={
                    isHovered
                      ? "text-amber-200 fill-amber-200 filter drop-shadow-[0_0_18px_rgba(254,240,138,1)]"
                      : isNearby
                      ? "text-amber-300 fill-amber-300 filter drop-shadow-[0_0_12px_rgba(253,230,138,0.95)]"
                      : "text-amber-100 fill-amber-100 filter drop-shadow-[0_0_8px_rgba(254,240,138,0.95)]"
                  }
                  style={{ width: `${star.size}px`, height: `${star.size}px` }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* ☄️ WHITE CURVED SHOOTING STARS (مسارات منحنية أنيقة) */}
        {curvedMeteors.map((m) => (
          <svg key={`curved-meteor-${m.id}`} className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <motion.path
              d={m.path}
              fill="none"
              stroke="url(#meteorGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0, pathOffset: 0 }}
              animate={{
                pathLength: [0, 0.45, 0],
                pathOffset: [0, 0.6, 1],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: m.duration,
                repeat: Infinity,
                repeatDelay: 6,
                delay: m.delay,
                ease: 'easeInOut',
              }}
            />
            <defs>
              <linearGradient id="meteorGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                <stop offset="70%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#fef08a" stopOpacity="1" />
              </linearGradient>
            </defs>
          </svg>
        ))}

        {/* FLOATING MAGICAL PARTICLES RISING INTO THE NIGHT AIR */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              initial={{ y: '100%', x: `${(i * 4) % 100}%`, opacity: 0 }}
              animate={{
                y: ['90%', '20%'],
                x: [`${(i * 4) % 100}%`, `${(i * 4 + (i % 2 === 0 ? 5 : -5)) % 100}%`],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 10 + (i % 5) * 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeInOut',
              }}
              className="absolute w-1.5 h-1.5 rounded-full bg-amber-200 shadow-[0_0_10px_#fde047]"
            />
          ))}
        </div>

        {/* 🎨 HIGH DEFINITION CINEMATIC SVG LANDSCAPE */}
        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 w-full h-full filter drop-shadow-[0_0_35px_rgba(0,0,0,0.9)]"
        >
          <defs>
            {/* Giant Radiant Full Moon Gradient */}
            <radialGradient id="cinematicMoonGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="20%" stopColor="#FFFBEB" />
              <stop offset="55%" stopColor="#FDE68A" />
              <stop offset="85%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </radialGradient>

            {/* Moon Soft Halo */}
            <radialGradient id="cinematicMoonHalo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.7" />
              <stop offset="45%" stopColor="#F59E0B" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            {/* Night Grassy Hill Gradient */}
            <linearGradient id="cinematicHillGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="40%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            {/* Realistic Boy Outfit & Rim Light Gradient (أزرق غامق فاخر) */}
            <linearGradient id="boySuitGrad" x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="60%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            {/* Realistic Girl Dress & Rim Light Gradient (بنفسجي ملكي داكن) */}
            <linearGradient id="girlDressGrad" x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#581c87" />
              <stop offset="60%" stopColor="#2e1065" />
              <stop offset="100%" stopColor="#090514" />
            </linearGradient>

            {/* Moonlight Rim Highlight */}
            <linearGradient id="moonlightRim" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#fde68a" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* 1. HUGE RADIANT INTERACTIVE GLOWING CRESCENT MOON (هلال مضيء وساحر تفاعلي عند الضغط عليه) */}
          <g transform="translate(720, 220)">
            {/* Soft Light Rings & Radiant Halo */}
            <circle cx="0" cy="0" r="210" fill="url(#cinematicMoonHalo)" />
            <circle cx="0" cy="0" r="155" fill="none" stroke="#FEF3C7" strokeWidth="2" strokeOpacity="0.5" />
            
            {/* Dynamic Light Pulses triggered on Moon click */}
            {moonPulseCount > 0 && (
              <motion.circle
                key={`moon-pulse-${moonPulseCount}`}
                cx="0"
                cy="0"
                r="100"
                fill="none"
                stroke="#FDE68A"
                strokeWidth="4"
                initial={{ r: 90, opacity: 0.9 }}
                animate={{ r: 240, opacity: 0 }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
              />
            )}

            {/* Clickable Interactive Crescent Moon Group */}
            <motion.g
              ref={moonCrescentRef}
              onClick={handleMoonClick}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="cursor-pointer filter drop-shadow-[0_0_35px_rgba(253,230,138,0.98)]"
            >
              {/* Crescent Body Path */}
              <path
                d="M -15 -105 A 105 105 0 1 0 95 40 A 90 90 0 1 1 -15 -105 Z"
                fill="url(#cinematicMoonGrad)"
                stroke="#FFFBEB"
                strokeWidth="2.5"
              />

              {/* Luminous Inner Edge Rim Highlight */}
              <path
                d="M -15 -105 A 105 105 0 1 0 95 40"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="3.5"
                strokeLinecap="round"
                opacity="0.95"
              />

              {/* Twinkling Crescent Tip Stars */}
              <circle cx="-15" cy="-105" r="4" fill="#FFFFFF" className="animate-ping" />
              <circle cx="95" cy="40" r="4" fill="#FFFFFF" className="animate-ping" />
            </motion.g>

            {/* Subtle Interactive Invitation Hint Badge above Moon */}
            <foreignObject x="-120" y="-155" width="240" height="40">
              <motion.div
                onClick={handleMoonClick}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="cursor-pointer mx-auto flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 border border-amber-300/60 text-amber-200 text-xs font-bold shadow-lg backdrop-blur-md hover:bg-slate-900 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                <span>{hasClickedMoon ? 'انقري مجدداً لإسقاط النجوم ✨' : 'اضغطي على القمر للسحر 🌙'}</span>
              </motion.div>
            </foreignObject>
          </g>

          {/* 🌟 CASCADING STARDUST LIGHT PARTICLES FROM MOON TOWARDS COUPLE */}
          {stardust.map((p) => (
            <motion.g
              key={p.id}
              initial={{ x: p.startX, y: p.startY, opacity: 1, scale: 0.4 }}
              animate={{
                x: [p.startX, p.startX + (p.targetX - p.startX) * 0.5 + Math.sin(p.seed) * 35, p.targetX],
                y: [p.startY, p.startY + (p.targetY - p.startY) * 0.5, p.targetY],
                opacity: [0, 1, 0.85, 0],
                scale: [0.4, 1.4, 1, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: 'easeOut',
              }}
            >
              <circle cx="0" cy="0" r={p.size} fill={p.color} className="filter drop-shadow-[0_0_8px_#fde047]" />
            </motion.g>
          ))}

          {/* 2. BACKGROUND MOUNTAINS & DISTANT HILLS */}
          <path
            d="M 0 650 Q 380 530 720 590 T 1440 560 L 1440 900 L 0 900 Z"
            fill="#080b21"
            opacity="0.9"
          />

          {/* 3. MAIN FOREGROUND SWEEPING NIGHT HILL (كتلة بالليل مع شبكات أعشاب ملصقة بالأرض) */}
          <path
            d="M 0 690 Q 720 500 1440 680 L 1440 900 L 0 900 Z"
            fill="url(#cinematicHillGrad)"
            stroke="#3730a3"
            strokeWidth="2.5"
          />

          {/* Dense Animated Swaying Grass Field across the Hill Crest */}
          <g opacity="0.95">
            {denseGrassTufts.map((tuft) => (
              <motion.g
                key={`grass-tuft-${tuft.id}`}
                transform={`translate(${tuft.x}, ${tuft.y})`}
                style={{ transformOrigin: 'bottom center' }}
                animate={{
                  rotate: [-tuft.maxAngle * 0.4, tuft.maxAngle, -tuft.maxAngle * 0.3, tuft.maxAngle * 0.8, -tuft.maxAngle * 0.4],
                  skewX: [-tuft.maxAngle * 0.3, tuft.maxAngle * 0.5, -tuft.maxAngle * 0.3],
                }}
                transition={{
                  duration: tuft.duration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: tuft.delay,
                }}
              >
                {tuft.blades.map((b, idx) => (
                  <path
                    key={`blade-${tuft.id}-${idx}`}
                    d={`M ${b.dx} 0 Q ${b.dx + b.curveX} ${-b.height * 0.6} ${b.dx + b.curveX * 1.35} ${-b.height}`}
                    fill="none"
                    stroke={b.color}
                    strokeWidth={b.strokeWidth}
                    strokeLinecap="round"
                  />
                ))}
              </motion.g>
            ))}
          </g>

          {/* 5. 🐝 DANCING & FLOATING FIREFLIES SCATTERED ACROSS THE ENTIRE SCREEN */}
          {fireflies.map((ff) => (
            <g key={`ff-orb-${ff.id}`} transform={`translate(${ff.cx}, ${ff.cy})`}>
              <motion.g
                animate={{
                  x: [
                    -ff.rx / 2,
                    ff.rx / 2,
                    ff.rx / 3,
                    -ff.rx / 2,
                  ],
                  y: [
                    -ff.ry / 2,
                    ff.ry / 3,
                    -ff.ry,
                    -ff.ry / 2,
                  ],
                  opacity: [0.3, 1, 0.45, 0.3],
                  scale: [0.85, 1.25, 0.9, 0.85],
                }}
                transition={{
                  duration: ff.duration,
                  repeat: Infinity,
                  delay: ff.delay,
                  ease: 'easeInOut',
                }}
              >
                {/* Outer Glow Halo */}
                <circle cx="0" cy="0" r={ff.sizes.outerGlow} fill="#fef08a" opacity="0.25" className="animate-pulse" />
                {/* Inner Bright Aura */}
                <circle cx="0" cy="0" r={ff.sizes.aura} fill={ff.color} opacity="0.8" />
                {/* Core Luminous Point */}
                <circle cx="0" cy="0" r={ff.sizes.core} fill="#FFFFFF" />
              </motion.g>
            </g>
          ))}
        </svg>
      </motion.div>

      {/* 📜 TOP MINIMAL BADGE */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="relative z-20 pt-2 sm:pt-4"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-950/80 border border-amber-400/50 text-amber-300 text-xs font-semibold shadow-md backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
          <span>المشهد السينمائي الأخير تحت ضوء القمر 🌙</span>
        </div>
      </motion.div>

      {/* 📜 BOTTOM SECTION: SEQUENTIAL ELEGANT COMPACT TEXT & ACTION BUTTONS */}
      <div className="relative z-20 mt-auto w-full max-w-xl mx-auto flex flex-col items-center gap-4 pb-4">
        {/* Sequential Lines Container */}
        <div className="w-full space-y-2 sm:space-y-3">
          <AnimatePresence>
            {textStage >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="px-4 py-2.5 sm:px-6 sm:py-3 rounded-2xl bg-slate-950/85 border border-amber-400/50 backdrop-blur-md shadow-xl"
              >
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-[#FFAC41] font-cairo leading-snug drop-shadow-md">
                  كل عام وأنتِ بخير يا ملاك ❤️
                </h1>
              </motion.div>
            )}

            {textStage >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-slate-950/80 border border-amber-300/30 backdrop-blur-md shadow-lg"
              >
                <p className="text-amber-100 font-amiri text-base sm:text-lg md:text-xl font-bold drop-shadow">
                  أتمنى أن تكون كل أيامكِ سعادة
                </p>
              </motion.div>
            )}

            {textStage >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-rose-950/75 border border-rose-400/35 backdrop-blur-md shadow-lg"
              >
                <p className="text-rose-200 font-amiri text-base sm:text-lg md:text-xl font-bold drop-shadow">
                  أحبكِ أكثر مما تستطيع الكلمات وصفه
                </p>
              </motion.div>
            )}

            {textStage >= 4 && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="px-4 py-3 sm:px-6 sm:py-3.5 rounded-2xl bg-gradient-to-r from-amber-950/85 via-slate-950/90 to-amber-950/85 border border-amber-400/50 backdrop-blur-md shadow-xl"
              >
                <p className="text-amber-200 font-amiri text-base sm:text-lg font-bold mb-0.5">
                  مع كل حبي...
                </p>
                <p className="text-xl sm:text-3xl font-black text-rose-300 font-cairo drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]">
                  صلاح الدين ❤️
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 🎵 BOTTOM ACTION BUTTONS & FOOTER */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="flex flex-col items-center gap-3 w-full mt-1"
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            {onOpenSongModal && (
              <motion.button
                onClick={() => {
                  soundEngine.playClick();
                  onOpenSongModal();
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 rounded-full bg-slate-950/90 hover:bg-rose-950 text-amber-200 border border-amber-400/60 font-cairo font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg backdrop-blur-md transition-all"
              >
                <Music className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>مشغل أغنية عيد الميلاد 🎵</span>
              </motion.button>
            )}

            <motion.button
              onClick={() => {
                soundEngine.playClick();
                onReplay();
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="main-button-immersive px-7 py-2.5 rounded-full text-white font-cairo font-bold text-base border border-white/40 flex items-center gap-2.5 cursor-pointer shadow-lg transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>إعادة التجربة السحرية ✨</span>
            </motion.button>
          </div>

          {/* Footer Signature */}
          <footer className="text-rose-200/90 font-amiri text-sm drop-shadow">
            صُنعت بأعظم مشاعر الحب والشغف خصيصاً ليوم ميلادكِ الميمون 🌹
          </footer>
        </motion.div>
      </div>
    </motion.div>
  );
};
