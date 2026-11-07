// ThemeContext — 4 themes: eski, yolak, pixel, neon
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const THEMES = [
  { id: 'eski', label: 'ESKI', emoji: '☀️' },
  { id: 'yolak', label: "YO'LAK", emoji: '🛤️' },
  { id: 'pixel', label: 'PIXEL', emoji: '👾' },
  { id: 'neon', label: 'NEON', emoji: '🌙' },
];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('marsit_theme') || 'eski';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('marsit_theme', theme);
  }, [theme]);

  function cycleTheme() {
    const idx = THEMES.findIndex(t => t.id === theme);
    const next = THEMES[(idx + 1) % THEMES.length];
    setTheme(next.id);
  }

  const currentTheme = THEMES.find(t => t.id === theme) || THEMES[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme, themes: THEMES, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

