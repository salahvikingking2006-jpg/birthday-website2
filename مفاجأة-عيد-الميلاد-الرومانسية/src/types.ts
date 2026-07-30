export type SceneId = 'intro' | 'cake' | 'letter' | 'rose' | 'gift' | 'final';

export type SongMelody = 'classic' | 'arabic' | 'medley';
export type InstrumentPreset = 'piano' | 'music_box' | 'orchestra' | 'harp';

export interface BirthdayLyricLine {
  text: string;
  timeSec: number;
}

export interface HeartParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  glow: number;
  color: string;
}

export interface SparkleParticle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  speedAlpha: number;
  color: string;
}

export interface MemoryCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  bgGradient: string;
}
