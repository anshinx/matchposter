import type { CafeSettings, Match } from './types';
import { DEFAULT_CAFE_SETTINGS, DEFAULT_MATCHES } from './constants';

const STORAGE_KEYS = {
  cafeSettings: 'matchposter_cafe_settings',
  matches: 'matchposter_matches',
} as const;

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

// ─── Kafe Ayarları ─────────────────────────────────────────────────────

export function getCafeSettings(): CafeSettings {
  if (!isBrowser()) return DEFAULT_CAFE_SETTINGS;

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.cafeSettings);
    if (stored) {
      return JSON.parse(stored) as CafeSettings;
    }
  } catch (e) {
    console.error('Failed to parse cafe settings from localStorage:', e);
  }
  return DEFAULT_CAFE_SETTINGS;
}

export function saveCafeSettings(settings: CafeSettings): void {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(STORAGE_KEYS.cafeSettings, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save cafe settings to localStorage:', e);
  }
}

// ─── Maç Verileri ──────────────────────────────────────────────────────

export function getMatches(): Match[] {
  if (!isBrowser()) return DEFAULT_MATCHES;

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.matches);
    if (stored) {
      return JSON.parse(stored) as Match[];
    }
  } catch (e) {
    console.error('Failed to parse matches from localStorage:', e);
  }

  // İlk çalıştırmada varsayılan maçları kaydet
  saveMatches(DEFAULT_MATCHES);
  return DEFAULT_MATCHES;
}

export function saveMatches(matches: Match[]): void {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(STORAGE_KEYS.matches, JSON.stringify(matches));
  } catch (e) {
    console.error('Failed to save matches to localStorage:', e);
  }
}

export function addMatch(match: Match): Match[] {
  const matches = getMatches();
  const updated = [...matches, match];
  saveMatches(updated);
  return updated;
}

export function updateMatch(id: string, updates: Partial<Match>): Match[] {
  const matches = getMatches();
  const updated = matches.map((m) => (m.id === id ? { ...m, ...updates } : m));
  saveMatches(updated);
  return updated;
}

export function deleteMatch(id: string): Match[] {
  const matches = getMatches();
  const updated = matches.filter((m) => m.id !== id);
  saveMatches(updated);
  return updated;
}
