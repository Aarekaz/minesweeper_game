import { useCallback, useRef, useEffect } from 'react';

export type SoundType = 'click' | 'flag' | 'reveal' | 'explosion' | 'victory' | 'combo';

interface SoundSettings {
  enabled: boolean;
  volume: number;
}

const SOUND_SETTINGS_KEY = 'minesweeper-sound-settings';

// Simple sound generator using Web Audio API
class SoundGenerator {
  private audioContext: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      this.audioContext = new AudioContext();
    }
  }

  private getContext(): AudioContext | null {
    if (!this.audioContext) return null;

    // Resume context if suspended (browser autoplay policy)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    return this.audioContext;
  }

  playClick(volume: number) {
    const ctx = this.getContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volume * 0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.05);
  }

  playFlag(volume: number) {
    const ctx = this.getContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(900, ctx.currentTime + 0.1);
    oscillator.type = 'square';

    gainNode.gain.setValueAtTime(volume * 0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  }

  playReveal(volume: number) {
    const ctx = this.getContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 400;
    oscillator.type = 'triangle';

    gainNode.gain.setValueAtTime(volume * 0.08, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.08);
  }

  playExplosion(volume: number) {
    const ctx = this.getContext();
    if (!ctx) return;

    // Create noise for explosion effect
    const bufferSize = ctx.sampleRate * 0.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.5);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noise.start(ctx.currentTime);
    noise.stop(ctx.currentTime + 0.5);
  }

  playVictory(volume: number) {
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C (major chord)

    notes.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      const startTime = ctx.currentTime + index * 0.1;
      gainNode.gain.setValueAtTime(volume * 0.2, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.4);
    });
  }

  playCombo(volume: number, comboLevel: number) {
    const ctx = this.getContext();
    if (!ctx) return;

    const baseFreq = 400 + (comboLevel * 50);
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, ctx.currentTime + 0.1);
    oscillator.type = 'sawtooth';

    gainNode.gain.setValueAtTime(volume * 0.12, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  }
}

export function useSoundEffects() {
  const soundGenerator = useRef<SoundGenerator>(new SoundGenerator());
  const settingsRef = useRef<SoundSettings>({
    enabled: true,
    volume: 0.5,
  });

  // Load settings
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SOUND_SETTINGS_KEY);
      if (stored) {
        settingsRef.current = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load sound settings:', error);
    }
  }, []);

  const saveSettings = useCallback((settings: SoundSettings) => {
    settingsRef.current = settings;
    try {
      localStorage.setItem(SOUND_SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save sound settings:', error);
    }
  }, []);

  const playSound = useCallback((type: SoundType, options?: { comboLevel?: number }) => {
    if (!settingsRef.current.enabled) return;

    const { volume } = settingsRef.current;

    switch (type) {
      case 'click':
        soundGenerator.current.playClick(volume);
        break;
      case 'flag':
        soundGenerator.current.playFlag(volume);
        break;
      case 'reveal':
        soundGenerator.current.playReveal(volume);
        break;
      case 'explosion':
        soundGenerator.current.playExplosion(volume);
        break;
      case 'victory':
        soundGenerator.current.playVictory(volume);
        break;
      case 'combo':
        soundGenerator.current.playCombo(volume, options?.comboLevel || 1);
        break;
    }
  }, []);

  const toggleSound = useCallback(() => {
    const newSettings = {
      ...settingsRef.current,
      enabled: !settingsRef.current.enabled,
    };
    saveSettings(newSettings);
  }, [saveSettings]);

  const setVolume = useCallback((volume: number) => {
    const newSettings = {
      ...settingsRef.current,
      volume: Math.max(0, Math.min(1, volume)),
    };
    saveSettings(newSettings);
  }, [saveSettings]);

  return {
    playSound,
    toggleSound,
    setVolume,
    soundEnabled: settingsRef.current.enabled,
    volume: settingsRef.current.volume,
  };
}
