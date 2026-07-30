import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Music,
  Play,
  Pause,
  RotateCcw,
  X,
  Sparkles,
  Heart,
  Volume2,
  SlidersHorizontal,
  Music2,
  Disc,
  VolumeX,
} from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';
import { SongMelody, InstrumentPreset, BirthdayLyricLine } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
}

export const BirthdaySongModal: React.FC<Props> = ({ isOpen, onClose, recipientName }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedMelody, setSelectedMelody] = useState<SongMelody>('medley');
  const [selectedInstrument, setSelectedInstrument] = useState<InstrumentPreset>('piano');
  const [tempo, setTempo] = useState<number>(1.0);
  const [progressSec, setProgressSec] = useState<number>(0);
  const [totalSec, setTotalSec] = useState<number>(20);
  const [activeLyric, setActiveLyric] = useState<string>('');
  const [lyricsList, setLyricsList] = useState<BirthdayLyricLine[]>([]);

  useEffect(() => {
    if (!isOpen) {
      if (isPlaying) {
        soundEngine.stopHappyBirthdaySong();
        setIsPlaying(false);
      }
    }
  }, [isOpen]);

  const handleTogglePlay = () => {
    soundEngine.playClick();

    if (isPlaying) {
      soundEngine.stopHappyBirthdaySong();
      setIsPlaying(false);
    } else {
      startSongPlayback();
    }
  };

  const startSongPlayback = () => {
    setIsPlaying(true);
    setProgressSec(0);

    const { totalDurationSec, lyrics } = soundEngine.playHappyBirthdaySong({
      melody: selectedMelody,
      instrument: selectedInstrument,
      recipientName,
      tempoMultiplier: tempo,
      onProgressSec: (curr, total) => {
        setProgressSec(curr);
        setTotalSec(total);

        // Find current matching lyric line
        const currentLine = lyrics.reduce((acc, line) => {
          if (curr >= line.timeSec) return line.text;
          return acc;
        }, `كل عام وأنتِ بخير يا ${recipientName} ❤️`);

        setActiveLyric(currentLine);
      },
      onEnd: () => {
        setIsPlaying(false);
        setProgressSec(0);
      },
    });

    setTotalSec(totalDurationSec);
    setLyricsList(lyrics);
    if (lyrics.length > 0) {
      setActiveLyric(lyrics[0].text);
    }
  };

  const handleSelectMelody = (melody: SongMelody) => {
    setSelectedMelody(melody);
    if (isPlaying) {
      soundEngine.stopHappyBirthdaySong();
      setIsPlaying(false);
    }
  };

  const handleSelectInstrument = (inst: InstrumentPreset) => {
    setSelectedInstrument(inst);
    if (isPlaying) {
      soundEngine.stopHappyBirthdaySong();
      setIsPlaying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative max-w-lg w-full p-6 sm:p-8 rounded-3xl bg-[#0d0309]/95 border-2 border-[#FFAC41]/50 shadow-[0_0_60px_rgba(255,30,86,0.35)] text-slate-100 font-cairo overflow-hidden"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#FF1E56]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-[#FFAC41]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={() => {
              soundEngine.playClick();
              soundEngine.stopHappyBirthdaySong();
              setIsPlaying(false);
              onClose();
            }}
            className="absolute top-4 left-4 p-2.5 rounded-full bg-rose-950/40 text-rose-300 hover:text-white hover:bg-rose-600/30 transition-all border border-rose-500/30 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF1E56]/15 border border-[#FFAC41]/40 text-[#FFAC41] text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-[#FFAC41]" />
              <span>استمع إلى الأغنية الساحرة المحسّنة 🎶</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-[#FFAC41] font-cairo">
              أغنية عيد الميلاد 🎂
            </h2>
            <p className="text-rose-200/80 font-amiri text-sm mt-1">
              لحن موسيقية راقية مصممة بإتقان لتليق بيوم ميلادكِ الميمون يا {recipientName}
            </p>
          </div>

          {/* Spinning Vinyl Record Visualizer */}
          <div className="flex flex-col items-center justify-center my-6">
            <div className="relative flex items-center justify-center">
              {/* Spinning Disc */}
              <motion.div
                animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-slate-900 via-slate-950 to-rose-950 border-4 border-[#FFAC41]/40 shadow-2xl flex items-center justify-center relative p-2"
              >
                <div className="w-full h-full rounded-full border border-white/10 flex items-center justify-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#FF1E56] to-pink-600 border-2 border-amber-300/60 flex flex-col items-center justify-center p-1 text-center shadow-inner">
                    <Heart className="w-6 h-6 text-white fill-white animate-pulse" />
                    <span className="text-[10px] font-bold text-amber-200 truncate max-w-[70px]">
                      {recipientName}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Equalizer Wave Lines on Playing */}
              {isPlaying && (
                <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: ['15%', '85%', '25%', '95%', '30%'] }}
                      transition={{
                        duration: 0.5 + i * 0.1,
                        repeat: Infinity,
                        repeatType: 'mirror',
                      }}
                      className="w-1 bg-gradient-to-t from-rose-500 to-amber-300 rounded-full"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Synchronized Lyrics Display */}
            <div className="mt-4 min-h-[44px] flex items-center justify-center px-4 py-2 rounded-2xl bg-rose-950/30 border border-rose-500/20 max-w-md w-full text-center">
              <p className="text-amber-200 font-cairo font-bold text-sm sm:text-base animate-pulse">
                {activeLyric || `كل عام وأنتِ بخير يا ${recipientName} ❤️`}
              </p>
            </div>
          </div>

          {/* Audio Progress Slider Bar */}
          <div className="mb-6">
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-rose-500/20 mb-2">
              <div
                className="h-full bg-gradient-to-r from-[#FF1E56] via-pink-400 to-[#FFAC41] transition-all duration-200"
                style={{ width: `${totalSec > 0 ? (progressSec / totalSec) * 100 : 0}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-rose-300/70 font-mono">
              <span>{formatTime(progressSec)}</span>
              <span>{formatTime(totalSec)}</span>
            </div>
          </div>

          {/* Main Play Controls */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => {
                soundEngine.playClick();
                if (isPlaying) {
                  soundEngine.stopHappyBirthdaySong();
                  setIsPlaying(false);
                }
                startSongPlayback();
              }}
              className="p-3 rounded-full bg-slate-800/80 text-rose-300 hover:text-white hover:bg-slate-700 transition-all border border-rose-500/30 cursor-pointer"
              title="إعادة التشغيل من البداية"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={handleTogglePlay}
              className="px-8 py-3.5 rounded-full main-button-immersive text-white font-extrabold text-base border border-white/40 shadow-xl flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 fill-white" />
                  <span>إيقاف مؤقت</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-white" />
                  <span>تشغيل الأغنية 🎵</span>
                </>
              )}
            </button>
          </div>

          {/* Customization Options: Melody & Instrument */}
          <div className="space-y-4 pt-4 border-t border-rose-500/20 text-xs">
            {/* Melody Type */}
            <div>
              <label className="block text-slate-300 font-bold mb-2 flex items-center gap-1.5">
                <Music2 className="w-4 h-4 text-[#FFAC41]" />
                <span>اختر اللحن الموسيقي:</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'medley', label: '🌟 المزيج الشامل' },
                  { id: 'arabic', label: '🎵 سنة حلوة يا جميل' },
                  { id: 'classic', label: '🎂 Happy Birthday' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectMelody(m.id as SongMelody)}
                    className={`py-2 px-2 rounded-xl font-semibold border transition-all cursor-pointer text-center ${
                      selectedMelody === m.id
                        ? 'bg-[#FF1E56]/30 border-[#FFAC41] text-amber-200 shadow-md font-bold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Instrument Preset */}
            <div>
              <label className="block text-slate-300 font-bold mb-2 flex items-center gap-1.5">
                <Disc className="w-4 h-4 text-[#FFAC41]" />
                <span>اختر الآلة الموسيقية:</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'piano', label: '🎹 بيانو سينمائي' },
                  { id: 'music_box', label: '🔔 صندوق الموسيقى' },
                  { id: 'orchestra', label: '🎻 أوركسترا' },
                  { id: 'harp', label: '🎼 قيثارة هارپ' },
                ].map((inst) => (
                  <button
                    key={inst.id}
                    onClick={() => handleSelectInstrument(inst.id as InstrumentPreset)}
                    className={`py-2 px-2 rounded-xl font-semibold border transition-all cursor-pointer text-center ${
                      selectedInstrument === inst.id
                        ? 'bg-[#FF1E56]/30 border-[#FFAC41] text-amber-200 shadow-md font-bold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {inst.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tempo Selector */}
            <div>
              <label className="block text-slate-300 font-bold mb-2 flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-[#FFAC41]" />
                <span>السرعة والإيقاع:</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { speed: 0.85, label: '🌙 هادئ ورومانسي' },
                  { speed: 1.0, label: '✨ معتدل (طبيعي)' },
                  { speed: 1.2, label: '🎉 سريع واحتفالي' },
                ].map((t) => (
                  <button
                    key={t.speed}
                    onClick={() => {
                      setTempo(t.speed);
                      if (isPlaying) {
                        soundEngine.stopHappyBirthdaySong();
                        setIsPlaying(false);
                      }
                    }}
                    className={`py-2 px-2 rounded-xl font-semibold border transition-all cursor-pointer text-center ${
                      tempo === t.speed
                        ? 'bg-[#FF1E56]/30 border-[#FFAC41] text-amber-200 shadow-md font-bold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
