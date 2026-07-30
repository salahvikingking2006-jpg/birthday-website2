import { SongMelody, InstrumentPreset, BirthdayLyricLine } from '../types';

// Web Audio API Synthesizer for romantic ambient soundtrack and interactive polyphonic birthday music
class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isBgmPlaying: boolean = false;
  private bgmIntervalId: number | null = null;
  private masterGain: GainNode | null = null;

  // Active song playback state
  private isSongPlayingState: boolean = false;
  private activeOscillators: OscillatorNode[] = [];
  private songTimeoutIds: number[] = [];
  private songProgressInterval: number | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.65;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.65, this.ctx.currentTime + 0.2);
    }
    return this.isMuted;
  }

  public getMutedState(): boolean {
    return this.isMuted;
  }

  public startBGM() {
    this.initCtx();
    if (this.isBgmPlaying || !this.ctx || this.isSongPlayingState) return;
    this.isBgmPlaying = true;

    // Romantic Arpeggio notes (F# minor / A major romantic scale)
    const notes = [220, 277.18, 329.63, 369.99, 415.3, 440, 554.37, 659.25];
    const chords = [
      [220, 277.18, 329.63, 440],    // A Maj
      [185, 220, 277.18, 369.99],    // F#m
      [146.83, 220, 293.66, 369.99], // D Maj
      [164.81, 246.94, 329.63, 415.3], // E Maj
    ];

    let step = 0;
    const playStep = () => {
      if (!this.isBgmPlaying || !this.ctx || this.isSongPlayingState) return;
      const now = this.ctx.currentTime;

      if (step % 8 === 0) {
        const chordIndex = Math.floor(step / 8) % chords.length;
        const currentChord = chords[chordIndex];
        currentChord.forEach((freq, idx) => {
          this.playTone(freq, now + idx * 0.05, 3.2, 'sine', 0.07);
        });
      }

      const randomNote = notes[Math.floor(Math.random() * notes.length)];
      this.playTone(randomNote, now, 1.2, 'triangle', 0.05);

      step++;
    };

    playStep();
    this.bgmIntervalId = window.setInterval(playStep, 600);
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmIntervalId !== null) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }

  private playTone(
    freq: number,
    startTime: number,
    duration: number,
    type: OscillatorType = 'sine',
    maxVolume = 0.2
  ) {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(maxVolume, startTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + duration);
      this.activeOscillators.push(osc);

      osc.onended = () => {
        const idx = this.activeOscillators.indexOf(osc);
        if (idx !== -1) this.activeOscillators.splice(idx, 1);
      };
    } catch {
      // ignore audio errors
    }
  }

  // Instrument-specific acoustic synthesis note generator
  private playInstrumentNote(
    freq: number,
    startTime: number,
    duration: number,
    preset: InstrumentPreset = 'piano',
    volumeMultiplier = 1.0
  ) {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const now = startTime;

    try {
      if (preset === 'piano') {
        // Multi-layered piano with low-pass filter warmth
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, now);
        filter.connect(this.masterGain);

        // Main note oscillator
        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(freq, now);

        // Warm sub-octave oscillator
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 0.5, now);

        const vol = 0.22 * volumeMultiplier;
        gain1.gain.setValueAtTime(0, now);
        gain1.gain.linearRampToValueAtTime(vol, now + 0.02);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + duration * 1.1);

        gain2.gain.setValueAtTime(0, now);
        gain2.gain.linearRampToValueAtTime(vol * 0.4, now + 0.03);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.9);

        osc1.connect(gain1);
        gain1.connect(filter);
        osc2.connect(gain2);
        gain2.connect(filter);

        osc1.start(now);
        osc1.stop(now + duration * 1.1);
        osc2.start(now);
        osc2.stop(now + duration * 0.9);

        this.activeOscillators.push(osc1, osc2);
      } else if (preset === 'music_box') {
        // Crystalline Music Box chime with high metallic harmonic
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * 2, now); // Higher octave for bell effect

        const shimmer = this.ctx.createOscillator();
        const shimmerGain = this.ctx.createGain();
        shimmer.type = 'sine';
        shimmer.frequency.setValueAtTime(freq * 2 * 2.756, now); // Metallic overtone

        const vol = 0.18 * volumeMultiplier;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(vol, now + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 1.4);

        shimmerGain.gain.setValueAtTime(0, now);
        shimmerGain.gain.linearRampToValueAtTime(vol * 0.25, now + 0.008);
        shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.8);

        osc.connect(gain);
        gain.connect(this.masterGain);
        shimmer.connect(shimmerGain);
        shimmerGain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + duration * 1.4);
        shimmer.start(now);
        shimmer.stop(now + duration * 0.8);

        this.activeOscillators.push(osc, shimmer);
      } else if (preset === 'orchestra') {
        // Warm Strings pad + Glockenspiel top
        const oscStrings1 = this.ctx.createOscillator();
        const oscStrings2 = this.ctx.createOscillator();
        const stringsGain = this.ctx.createGain();

        oscStrings1.type = 'sawtooth';
        oscStrings2.type = 'sawtooth';
        oscStrings1.frequency.setValueAtTime(freq * 0.996, now);
        oscStrings2.frequency.setValueAtTime(freq * 1.004, now);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.connect(this.masterGain);

        const vol = 0.15 * volumeMultiplier;
        stringsGain.gain.setValueAtTime(0, now);
        stringsGain.gain.linearRampToValueAtTime(vol, now + 0.12);
        stringsGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 1.3);

        oscStrings1.connect(stringsGain);
        oscStrings2.connect(stringsGain);
        stringsGain.connect(filter);

        oscStrings1.start(now);
        oscStrings1.stop(now + duration * 1.3);
        oscStrings2.start(now);
        oscStrings2.stop(now + duration * 1.3);

        // Bell highlight
        const bell = this.ctx.createOscillator();
        const bellGain = this.ctx.createGain();
        bell.type = 'sine';
        bell.frequency.setValueAtTime(freq * 2, now + 0.02);
        bellGain.gain.setValueAtTime(0, now + 0.02);
        bellGain.gain.linearRampToValueAtTime(vol * 0.8, now + 0.03);
        bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

        bell.connect(bellGain);
        bellGain.connect(this.masterGain);
        bell.start(now + 0.02);
        bell.stop(now + 0.8);

        this.activeOscillators.push(oscStrings1, oscStrings2, bell);
      } else if (preset === 'harp') {
        // Plucked acoustic harp tone
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        const biquad = this.ctx.createBiquadFilter();
        biquad.type = 'bandpass';
        biquad.frequency.setValueAtTime(freq * 1.8, now);
        biquad.Q.setValueAtTime(3, now);

        const vol = 0.24 * volumeMultiplier;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(vol, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 1.2);

        osc.connect(biquad);
        biquad.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + duration * 1.2);

        this.activeOscillators.push(osc);
      }
    } catch {
      // ignore
    }
  }

  // Play chord progression backing under melody
  private playChordBacking(
    chordFreqs: number[],
    startTime: number,
    duration: number,
    preset: InstrumentPreset
  ) {
    chordFreqs.forEach((freq, i) => {
      this.playInstrumentNote(freq, startTime + i * 0.04, duration, preset, 0.45);
    });
  }

  public isSongPlaying(): boolean {
    return this.isSongPlayingState;
  }

  public stopHappyBirthdaySong() {
    this.isSongPlayingState = false;

    // Clear active timeouts
    this.songTimeoutIds.forEach((id) => clearTimeout(id));
    this.songTimeoutIds = [];

    if (this.songProgressInterval) {
      clearInterval(this.songProgressInterval);
      this.songProgressInterval = null;
    }

    // Stop active oscillators
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore
      }
    });
    this.activeOscillators = [];
  }

  public playHappyBirthdaySong(options?: {
    melody?: SongMelody;
    instrument?: InstrumentPreset;
    recipientName?: string;
    tempoMultiplier?: number;
    onProgressSec?: (currentSec: number, totalSec: number) => void;
    onEnd?: () => void;
  }): { totalDurationSec: number; lyrics: BirthdayLyricLine[] } {
    this.initCtx();
    this.stopHappyBirthdaySong();

    if (this.isMuted || !this.ctx || !this.masterGain) {
      return { totalDurationSec: 0, lyrics: [] };
    }

    const wasBgmPlaying = this.isBgmPlaying;
    if (wasBgmPlaying) {
      this.stopBGM();
    }

    this.isSongPlayingState = true;

    const melodyType = options?.melody || 'medley';
    const instrument = options?.instrument || 'piano';
    const recipient = options?.recipientName || 'ملاكي';
    const speed = options?.tempoMultiplier || 1.0;

    const now = this.ctx.currentTime + 0.1;
    const beat = 0.5 / speed;

    // Frequencies (Hz)
    const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.0, A4 = 440.0, B4 = 493.88;
    const C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99, A5 = 880.0;

    // Chords
    const chordC = [130.81, 196.0, 261.63, 329.63];  // C Major (C2, G2, C3, E3)
    const chordG = [98.0, 196.0, 246.94, 293.66];   // G Major (G2, G3, B3, D4)
    const chordF = [87.31, 174.61, 261.63, 349.23];  // F Major (F2, F3, C4, F4)
    const chordAm = [110.0, 220.0, 261.63, 329.63];  // Am (A2, A3, C4, E4)

    interface NoteItem {
      freq: number;
      dur: number;
      chord?: number[];
      lyric?: string;
      sparkle?: boolean;
    }

    const notesList: NoteItem[] = [];
    const lyrics: BirthdayLyricLine[] = [];

    if (melodyType === 'classic' || melodyType === 'medley') {
      // Phrase 1: Happy birthday to you
      notesList.push(
        { freq: G4, dur: beat * 0.75, chord: chordC, lyric: 'HAPPY BIRTHDAY TO YOU 🎂' },
        { freq: G4, dur: beat * 0.25 },
        { freq: A4, dur: beat * 1.0 },
        { freq: G4, dur: beat * 1.0 },
        { freq: C5, dur: beat * 1.0 },
        { freq: B4, dur: beat * 2.0, sparkle: true }
      );

      // Phrase 2: Happy birthday to you
      notesList.push(
        { freq: G4, dur: beat * 0.75, chord: chordG, lyric: 'سنة حلوة يا جميل 💖' },
        { freq: G4, dur: beat * 0.25 },
        { freq: A4, dur: beat * 1.0 },
        { freq: G4, dur: beat * 1.0 },
        { freq: D5, dur: beat * 1.0 },
        { freq: C5, dur: beat * 2.0, sparkle: true }
      );

      // Phrase 3: Happy birthday dear [recipient]
      notesList.push(
        { freq: G4, dur: beat * 0.75, chord: chordAm, lyric: `عيد ميلاد سعيد يا ${recipient} ✨` },
        { freq: G4, dur: beat * 0.25 },
        { freq: G5, dur: beat * 1.0, chord: chordF },
        { freq: E5, dur: beat * 1.0 },
        { freq: C5, dur: beat * 1.0 },
        { freq: B4, dur: beat * 1.0 },
        { freq: A4, dur: beat * 2.2, sparkle: true }
      );

      // Phrase 4: Happy birthday to you (Slowing down ritardando for finale)
      const rBeat = beat * 1.25;
      notesList.push(
        { freq: F5, dur: rBeat * 0.75, chord: chordF, lyric: 'كل عام وأنتِ بقلبي وفي عمري 🌹' },
        { freq: F5, dur: rBeat * 0.25 },
        { freq: E5, dur: rBeat * 1.0, chord: chordC },
        { freq: C5, dur: rBeat * 1.0 },
        { freq: D5, dur: rBeat * 1.2, chord: chordG },
        { freq: C5, dur: rBeat * 3.0, chord: chordC, sparkle: true }
      );
    }

    if (melodyType === 'arabic' || melodyType === 'medley') {
      // Arabic Classic "Sana Helwa Ya Jameel" (سنة حلوة يا جميل)
      const aBeat = beat * 1.05;

      notesList.push(
        { freq: G4, dur: aBeat * 0.8, chord: chordC, lyric: 'سنة حلوة يا جميل 🎵' },
        { freq: G4, dur: aBeat * 0.2 },
        { freq: C5, dur: aBeat * 1.0 },
        { freq: G4, dur: aBeat * 1.0 },
        { freq: E5, dur: aBeat * 1.0 },
        { freq: D5, dur: aBeat * 1.0 },
        { freq: C5, dur: aBeat * 2.0, sparkle: true }
      );

      notesList.push(
        { freq: G4, dur: aBeat * 0.8, chord: chordG, lyric: 'سنة حلوة يا ملاكي ❤️' },
        { freq: G4, dur: aBeat * 0.2 },
        { freq: D5, dur: aBeat * 1.0 },
        { freq: G4, dur: aBeat * 1.0 },
        { freq: F5, dur: aBeat * 1.0 },
        { freq: E5, dur: aBeat * 1.0 },
        { freq: D5, dur: aBeat * 2.0, sparkle: true }
      );

      notesList.push(
        { freq: G4, dur: aBeat * 0.8, chord: chordAm, lyric: `سنة حلوة يا ${recipient} 🥰` },
        { freq: G4, dur: aBeat * 0.2 },
        { freq: G5, dur: aBeat * 1.0, chord: chordF },
        { freq: E5, dur: aBeat * 1.0 },
        { freq: C5, dur: aBeat * 1.0 },
        { freq: B4, dur: aBeat * 1.0 },
        { freq: A5, dur: aBeat * 2.2, sparkle: true }
      );

      notesList.push(
        { freq: F5, dur: aBeat * 0.8, chord: chordF, lyric: 'سنة حلوة يا جميل 🌟' },
        { freq: F5, dur: aBeat * 0.2 },
        { freq: E5, dur: aBeat * 1.0, chord: chordC },
        { freq: C5, dur: aBeat * 1.0 },
        { freq: D5, dur: aBeat * 1.2, chord: chordG },
        { freq: C5, dur: aBeat * 3.2, chord: chordC, sparkle: true }
      );
    }

    let timeCursor = now;
    let relativeSec = 0;

    notesList.forEach((note) => {
      if (note.lyric) {
        lyrics.push({
          text: note.lyric,
          timeSec: relativeSec,
        });
      }

      // Play main melody note
      this.playInstrumentNote(note.freq, timeCursor, note.dur, instrument, 1.0);

      // Play chord backing if present
      if (note.chord) {
        this.playChordBacking(note.chord, timeCursor, note.dur * 2.5, instrument);
      }

      // Sparkle flourish on phrase endings
      if (note.sparkle) {
        this.playInstrumentNote(note.freq * 2, timeCursor + 0.06, 0.6, 'music_box', 0.5);
        this.playInstrumentNote(note.freq * 3, timeCursor + 0.12, 0.8, 'music_box', 0.3);
      }

      timeCursor += note.dur;
      relativeSec += note.dur;
    });

    // Final resolving flourish (Glissando arpeggio)
    const finalTime = timeCursor;
    const arpeggioNotes = [C4, E4, G4, C5, E5, G5, C5 * 2];
    arpeggioNotes.forEach((f, idx) => {
      this.playInstrumentNote(f, finalTime + idx * 0.08, 1.8, 'harp', 0.6);
    });

    const totalDurationSec = relativeSec + 2.5;

    // Monitor progress callback
    const startTimeMs = Date.now();
    this.songProgressInterval = window.setInterval(() => {
      if (!this.isSongPlayingState) return;
      const elapsed = (Date.now() - startTimeMs) / 1000;
      if (options?.onProgressSec) {
        options.onProgressSec(Math.min(elapsed, totalDurationSec), totalDurationSec);
      }
      if (elapsed >= totalDurationSec) {
        this.stopHappyBirthdaySong();
        if (options?.onEnd) options.onEnd();
        if (wasBgmPlaying && !this.isBgmPlaying) {
          this.startBGM();
        }
      }
    }, 200);

    return { totalDurationSec, lyrics };
  }

  // Sound FX
  public playHeartbeat() {
    this.initCtx();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const g1 = this.ctx.createGain();
    osc1.frequency.setValueAtTime(70, now);
    osc1.frequency.exponentialRampToValueAtTime(30, now + 0.15);
    g1.gain.setValueAtTime(0.4, now);
    g1.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc1.connect(g1);
    g1.connect(this.masterGain);
    osc1.start(now);
    osc1.stop(now + 0.15);

    const osc2 = this.ctx.createOscillator();
    const g2 = this.ctx.createGain();
    const t2 = now + 0.22;
    osc2.frequency.setValueAtTime(85, t2);
    osc2.frequency.exponentialRampToValueAtTime(35, t2 + 0.2);
    g2.gain.setValueAtTime(0.5, t2);
    g2.gain.exponentialRampToValueAtTime(0.01, t2 + 0.2);
    osc2.connect(g2);
    g2.connect(this.masterGain);
    osc2.start(t2);
    osc2.stop(t2 + 0.2);
  }

  public playSparkle() {
    this.initCtx();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const freqs = [1046.5, 1318.5, 1567.98, 2093, 2637];
    freqs.forEach((f, i) => {
      this.playTone(f, now + i * 0.05, 0.4, 'sine', 0.12);
    });
  }

  public playEnvelopeOpen() {
    this.initCtx();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const freqs = [300, 450, 600, 750, 900, 1200];
    freqs.forEach((f, i) => {
      this.playTone(f, now + i * 0.04, 0.5, 'triangle', 0.15);
    });
  }

  public playCandleIgnite() {
    this.initCtx();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.3);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  public playFireworks() {
    this.initCtx();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const boomOsc = this.ctx.createOscillator();
    const boomGain = this.ctx.createGain();
    boomOsc.frequency.setValueAtTime(180, now);
    boomOsc.frequency.exponentialRampToValueAtTime(40, now + 0.6);
    boomGain.gain.setValueAtTime(0.6, now);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    boomOsc.connect(boomGain);
    boomGain.connect(this.masterGain);
    boomOsc.start(now);
    boomOsc.stop(now + 0.6);

    for (let i = 0; i < 8; i++) {
      const delay = 0.2 + Math.random() * 0.5;
      const freq = 1200 + Math.random() * 1500;
      this.playTone(freq, now + delay, 0.15, 'sine', 0.15);
    }
  }

  public playConfetti() {
    this.initCtx();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98];
    freqs.forEach((f, i) => {
      this.playTone(f, now + i * 0.03, 0.6, 'triangle', 0.15);
    });
  }

  public playBloom() {
    this.initCtx();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const chord = [440, 554.37, 659.25, 880, 1108.73];
    chord.forEach((freq, idx) => {
      this.playTone(freq, now + idx * 0.08, 1.8, 'sine', 0.15);
    });
  }

  public playGiftOpen() {
    this.initCtx();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const arpeggio = [392.0, 493.88, 587.33, 783.99, 987.77, 1174.66];
    arpeggio.forEach((f, i) => {
      this.playTone(f, now + i * 0.06, 0.8, 'triangle', 0.18);
    });
  }

  public playRomanticSerenade() {
    this.initCtx();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    // Romantic multi-note harp glissando & warm piano chord
    const melody = [440, 554.37, 659.25, 880, 1108.73, 1318.5, 1760];
    melody.forEach((f, i) => {
      this.playInstrumentNote(f, now + i * 0.1, 2.5, 'harp', 0.8);
      if (i % 2 === 0) {
        this.playInstrumentNote(f * 0.5, now + i * 0.1, 2.2, 'piano', 0.5);
      }
    });
  }

  public playClick() {
    this.initCtx();
    if (this.isMuted || !this.ctx) return;
    this.playTone(800, this.ctx.currentTime, 0.05, 'sine', 0.1);
  }

  public playNightWindSound() {
    this.initCtx();
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Synthesize audible, realistic gentle night wind swell with noise and dual bandpass sweeps
      const bufferSize = this.ctx.sampleRate * 4.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.8;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, now);
      filter.frequency.exponentialRampToValueAtTime(480, now + 2.2);
      filter.frequency.exponentialRampToValueAtTime(180, now + 4.2);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.085, now + 2.0); // Audibly clear wind gain
      gain.gain.linearRampToValueAtTime(0.001, now + 4.2);

      noise.connect(filter);
      filter.connect(gain);
      if (this.masterGain) {
        gain.connect(this.masterGain);
      } else {
        gain.connect(this.ctx.destination);
      }

      noise.start(now);
      noise.stop(now + 4.2);
    } catch (e) {
      console.error(e);
    }
  }

  public playCricketChirp() {
    this.initCtx();
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // High-frequency natural cricket chirp bursts (~4800Hz - 5400Hz)
      const numPulses = 3 + Math.floor(Math.random() * 3);
      const pulseDuration = 0.022; // 22ms per chirp pulse
      const freq = 4800 + Math.random() * 500;

      for (let i = 0; i < numPulses; i++) {
        const startTime = now + i * 0.045;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        osc.frequency.linearRampToValueAtTime(freq + 200, startTime + pulseDuration * 0.5);
        osc.frequency.linearRampToValueAtTime(freq, startTime + pulseDuration);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.02, startTime + 0.004);
        gain.gain.linearRampToValueAtTime(0.001, startTime + pulseDuration);

        osc.connect(gain);
        if (this.masterGain) {
          gain.connect(this.masterGain);
        } else {
          gain.connect(this.ctx.destination);
        }

        osc.start(startTime);
        osc.stop(startTime + pulseDuration);
      }
    } catch (e) {
      console.error(e);
    }
  }

  public playStarTwinkleSound(freqOffset = 0) {
    this.initCtx();
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Soft crystalline bell tone (~1400Hz - 2800Hz)
      const baseFreq = 1400 + (freqOffset % 8) * 160 + Math.random() * 120;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.18);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.035, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      if (this.masterGain) {
        gain.connect(this.masterGain);
      } else {
        gain.connect(this.ctx.destination);
      }

      osc.start(now);
      osc.stop(now + 0.36);
    } catch (e) {
      console.error(e);
    }
  }

  public playMoonMagicSound() {
    this.initCtx();
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Celestial ascending chime chord (E Major / B Major pentatonic shimmering bell tones)
      const freqs = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.5, 1567.98, 1975.53];
      freqs.forEach((freq, idx) => {
        const startTime = now + idx * 0.06;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.08, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.6);

        osc.connect(gain);
        if (this.masterGain) {
          gain.connect(this.masterGain);
        } else {
          gain.connect(this.ctx!.destination);
        }

        osc.start(startTime);
        osc.stop(startTime + 1.7);
      });
    } catch (e) {
      console.error(e);
    }
  }
}

export const soundEngine = new SoundEngine();
