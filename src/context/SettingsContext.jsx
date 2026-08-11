// ============================================================================
// SettingsContext
// ----------------------------------------------------------------------------
// Lets an admin tune the level/gas thresholds that drive status colors and
// alert logging, without touching code. Persisted to localStorage so the
// choice survives a page refresh. There is no backend for this project, so
// settings are per-browser, not shared across admins — the Settings page
// says so explicitly.
// ============================================================================
import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'ecosanitation.thresholds.v1';

export const DEFAULT_THRESHOLDS = {
  levelWarning: 60,
  levelCritical: 85,
  methaneWarning: 300,
  methaneCritical: 600,
};

const SettingsContext = createContext(null);

function loadStoredThresholds() {
  if (typeof window === 'undefined') return DEFAULT_THRESHOLDS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_THRESHOLDS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_THRESHOLDS, ...parsed };
  } catch {
    return DEFAULT_THRESHOLDS;
  }
}

export function SettingsProvider({ children }) {
  const [thresholds, setThresholds] = useState(loadStoredThresholds);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(thresholds));
    } catch {
      // localStorage unavailable (private browsing, etc.) — settings just
      // won't persist across refreshes; not fatal.
    }
  }, [thresholds]);

  const updateThresholds = (partial) => setThresholds((prev) => ({ ...prev, ...partial }));
  const resetThresholds = () => setThresholds(DEFAULT_THRESHOLDS);

  return (
    <SettingsContext.Provider value={{ thresholds, updateThresholds, resetThresholds }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within a SettingsProvider');
  return ctx;
}
