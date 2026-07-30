import React, { useEffect, useRef } from 'react';

interface Heart {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  maxOpacity: number;
  pulseSpeed: number;
  pulsePhase: number;
  color: string;
}

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  twinkleSpeed: number;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
}

export const BackgroundCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const parallaxRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Parallax mouse/touch listener
    const handleMouseMove = (e: MouseEvent) => {
      parallaxRef.current.x = (e.clientX / window.innerWidth - 0.5) * 30;
      parallaxRef.current.y = (e.clientY / window.innerHeight - 0.5) * 30;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        parallaxRef.current.x = (e.touches[0].clientX / window.innerWidth - 0.5) * 30;
        parallaxRef.current.y = (e.touches[0].clientY / window.innerHeight - 0.5) * 30;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    // Generate romantic colors for hearts with Immersive UI palette
    const heartColors = [
      'rgba(255, 30, 86, ',   // #FF1E56 Primary Immersive Red/Pink
      'rgba(255, 172, 65, ',  // #FFAC41 Golden Flame
      'rgba(255, 90, 128, ',  // Vibrant Rose
      'rgba(244, 63, 94, ',   // Rose-500
      'rgba(251, 113, 133, ', // Rose-400
      'rgba(253, 164, 175, ', // Light Rose
      'rgba(255, 215, 0, ',   // Gold
    ];

    // Create hearts (hundreds)
    const heartCount = Math.min(130, Math.floor((width * height) / 9000));
    const hearts: Heart[] = Array.from({ length: heartCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: Math.random() * 14 + 6,
      speedY: Math.random() * 1.5 + 0.6,
      speedX: (Math.random() - 0.5) * 0.8,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      opacity: Math.random() * 0.7 + 0.2,
      maxOpacity: Math.random() * 0.7 + 0.3,
      pulseSpeed: Math.random() * 0.04 + 0.01,
      pulsePhase: Math.random() * Math.PI * 2,
      color: heartColors[Math.floor(Math.random() * heartColors.length)],
    }));

    // Create Blinking Stars
    const starCount = Math.min(100, Math.floor((width * height) / 12000));
    const stars: Star[] = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.5,
      alpha: Math.random(),
      maxAlpha: Math.random() * 0.8 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
    }));

    // Floating Light Particles
    const particleCount = 50;
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 3 + 1,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      alpha: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.3 ? '#f472b6' : '#fbbf24',
    }));

    // Light Wave Phase
    let wavePhase = 0;

    // Draw Heart shape on canvas
    const drawHeart = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      colorWithAlpha: string,
      glow: boolean
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      if (glow) {
        ctx.shadowColor = 'rgba(244, 114, 182, 0.8)';
        ctx.shadowBlur = size * 1.2;
      }

      ctx.beginPath();
      const d = size;
      ctx.moveTo(0, -d * 0.3);
      ctx.bezierCurveTo(-d * 0.5, -d * 0.8, -d, -d * 0.3, 0, d * 0.7);
      ctx.bezierCurveTo(d, -d * 0.3, d * 0.5, -d * 0.8, 0, -d * 0.3);
      ctx.closePath();

      ctx.fillStyle = colorWithAlpha;
      ctx.fill();
      ctx.restore();
    };

    // Render loop
    const render = () => {
      // Background gradient base with subtle light wave overlay
      wavePhase += 0.005;
      const px = parallaxRef.current.x;
      const py = parallaxRef.current.y;

      ctx.clearRect(0, 0, width, height);

      // Immersive Deep Atmospheric Gradient Background
      const bgGradient = ctx.createRadialGradient(
        width / 2 + px,
        height / 2 + py,
        100,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.95
      );
      bgGradient.addColorStop(0, '#4a0404'); // Deep Crimson Red
      bgGradient.addColorStop(0.35, '#2d0a0a'); // Dark Velvet
      bgGradient.addColorStop(0.7, '#1a0505'); // Midnight Rose
      bgGradient.addColorStop(1, '#050002'); // Pure Immersive Dark Base

      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Soft Animated Light Waves
      ctx.save();
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const waveY = height * (0.3 + i * 0.25) + Math.sin(wavePhase + i) * 40;
        ctx.moveTo(0, waveY);
        for (let x = 0; x <= width; x += 40) {
          const y = waveY + Math.sin(x * 0.003 + wavePhase * (i + 1)) * 30;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();

        const waveGrad = ctx.createLinearGradient(0, waveY - 50, 0, height);
        waveGrad.addColorStop(0, `rgba(236, 72, 153, ${0.03 - i * 0.008})`);
        waveGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = waveGrad;
        ctx.fill();
      }
      ctx.restore();

      // Render Blinking Stars
      stars.forEach((star) => {
        star.alpha += star.twinkleSpeed;
        if (star.alpha > star.maxAlpha || star.alpha < 0.1) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }

        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, star.alpha)})`;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = star.size * 2;
        ctx.beginPath();
        const starX = star.x + px * 0.2;
        const starY = star.y + py * 0.2;
        ctx.arc(starX, starY, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Render Floating Light Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x + px * 0.5, p.y + py * 0.5, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      });

      // Render Falling Hearts (Parallax + Rotation + Pulsing Glow)
      hearts.forEach((heart) => {
        heart.y += heart.speedY;
        heart.x += heart.speedX + Math.sin(heart.y * 0.01) * 0.3;
        heart.rotation += heart.rotationSpeed;
        heart.pulsePhase += heart.pulseSpeed;

        const pulseOpacity = heart.opacity + Math.sin(heart.pulsePhase) * 0.15;
        const finalOpacity = Math.max(0.1, Math.min(heart.maxOpacity, pulseOpacity));

        // Reset if moved past bottom of canvas
        if (heart.y > height + 40) {
          heart.y = -40;
          heart.x = Math.random() * width;
          heart.speedY = Math.random() * 1.5 + 0.6;
        }

        const hx = heart.x + px * (heart.size * 0.05);
        const hy = heart.y + py * (heart.size * 0.05);

        drawHeart(
          ctx,
          hx,
          hy,
          heart.size,
          heart.rotation,
          `${heart.color}${finalOpacity})`,
          heart.size > 10
        );
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
    />
  );
};
