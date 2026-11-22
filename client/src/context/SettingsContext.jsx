import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { read, write } from '../lib/storage';

const SettingsContext = createContext(null);

const DEFAULTS = {
  highContrast: false,
  reducedMotion: false,
  largeText: false,
  sound: true,
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => ({ ...DEFAULTS, ...read('settings', {}) }));

  useEffect(() => {
    write('settings', settings);
    const root = document.documentElement;
    root.classList.toggle('hc', settings.highContrast);
    root.classList.toggle('reduce-motion', settings.reducedMotion);
    root.classList.toggle('large-text', settings.largeText);
  }, [settings]);

  const value = useMemo(
    () => ({
      settings,
      toggle: (key) => setSettings((current) => ({ ...current, [key]: !current[key] })),
    }),
    [settings]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used inside SettingsProvider');
  return context;
}
