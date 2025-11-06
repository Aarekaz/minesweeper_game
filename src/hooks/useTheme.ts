import { useState, useEffect, useCallback } from 'react';

export type ThemeName = 'dark' | 'light' | 'ocean' | 'forest' | 'sunset';

const THEME_KEY = 'minesweeper-theme';

const themes: Record<ThemeName, { [key: string]: string }> = {
  dark: {
    '--bg-primary': '#0a0a0a',
    '--bg-secondary': '#1a1a1a',
    '--bg-tertiary': '#2a2a2a',
    '--text-primary': '#ffffff',
    '--text-secondary': '#999999',
    '--accent-primary': '#60a5fa',
    '--accent-secondary': '#93c5fd',
    '--border-color': 'rgba(255, 255, 255, 0.1)',
    '--shadow-color': 'rgba(0, 0, 0, 0.6)',
  },
  light: {
    '--bg-primary': '#f5f5f5',
    '--bg-secondary': '#e5e5e5',
    '--bg-tertiary': '#d5d5d5',
    '--text-primary': '#1a1a1a',
    '--text-secondary': '#666666',
    '--accent-primary': '#2563eb',
    '--accent-secondary': '#3b82f6',
    '--border-color': 'rgba(0, 0, 0, 0.1)',
    '--shadow-color': 'rgba(0, 0, 0, 0.2)',
  },
  ocean: {
    '--bg-primary': '#0a1628',
    '--bg-secondary': '#1e3a5f',
    '--bg-tertiary': '#2d5f8d',
    '--text-primary': '#e0f2fe',
    '--text-secondary': '#7dd3fc',
    '--accent-primary': '#06b6d4',
    '--accent-secondary': '#22d3ee',
    '--border-color': 'rgba(6, 182, 212, 0.2)',
    '--shadow-color': 'rgba(6, 95, 70, 0.4)',
  },
  forest: {
    '--bg-primary': '#0f1e13',
    '--bg-secondary': '#1c3a24',
    '--bg-tertiary': '#2d5f3b',
    '--text-primary': '#d1fae5',
    '--text-secondary': '#6ee7b7',
    '--accent-primary': '#10b981',
    '--accent-secondary': '#34d399',
    '--border-color': 'rgba(16, 185, 129, 0.2)',
    '--shadow-color': 'rgba(6, 78, 59, 0.4)',
  },
  sunset: {
    '--bg-primary': '#1e0a14',
    '--bg-secondary': '#3a1c2e',
    '--bg-tertiary': '#5f2d48',
    '--text-primary': '#fce7f3',
    '--text-secondary': '#f9a8d4',
    '--accent-primary': '#ec4899',
    '--accent-secondary': '#f472b6',
    '--border-color': 'rgba(236, 72, 153, 0.2)',
    '--shadow-color': 'rgba(131, 24, 67, 0.4)',
  },
};

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      return (stored as ThemeName) || 'dark';
    } catch {
      return 'dark';
    }
  });

  const applyTheme = useCallback((themeName: ThemeName) => {
    const theme = themes[themeName];
    const root = document.documentElement;

    Object.entries(theme).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    try {
      localStorage.setItem(THEME_KEY, themeName);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }

    setCurrentTheme(themeName);
  }, []);

  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme, applyTheme]);

  return {
    currentTheme,
    setTheme: applyTheme,
    themes: Object.keys(themes) as ThemeName[],
  };
}
