'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Match, TeamSlug } from '@/lib/types';
import {
  getMatches,
  saveMatches,
  addMatch as addMatchToStorage,
  deleteMatch as deleteMatchFromStorage,
} from '@/lib/storage';
import { DEFAULT_MATCHES } from '@/lib/constants';

// ─── Hook ───────────────────────────────────────────────────────────────
export function useMatches() {
  const [matches, setMatches] = useState<Match[]>(DEFAULT_MATCHES);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  useEffect(() => {
    setMatches(getMatches());
    setIsLoaded(true);
  }, []);

  // ─── Sofascore'dan Yenile (server-side proxied) ────────────────────────
  const refreshFromApi = useCallback(async () => {
    setIsRefreshing(true);
    setRefreshError(null);

    try {
      const res = await fetch('/api/matches', { cache: 'no-store' });

      if (!res.ok) {
        throw new Error(`Sunucu hatası: ${res.status}`);
      }

      const apiMatches: Match[] = await res.json();

      if (!Array.isArray(apiMatches) || apiMatches.length === 0) {
        throw new Error('Sofascore veri döndürmedi');
      }

      // Manuel eklenen maçları koru
      const currentMatches = getMatches();
      const manualMatches = currentMatches.filter((m) => m.source === 'manual');
      const apiIds = new Set(apiMatches.map((m) => m.sofascoreId).filter(Boolean));
      const filteredManual = manualMatches.filter((m) => !m.sofascoreId || !apiIds.has(m.sofascoreId));

      const merged = [...apiMatches, ...filteredManual].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      saveMatches(merged);
      setMatches(merged);
      setLastUpdated(new Date());
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Bilinmeyen hata';
      setRefreshError(msg);
      console.warn('Sofascore fetch hatası:', msg);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // ─── Manuel Maç Ekle ─────────────────────────────────────────────────
  const addMatch = useCallback((match: Match) => {
    const tagged: Match = { ...match, source: 'manual' };
    const updated = addMatchToStorage(tagged);
    setMatches(updated);
  }, []);

  // ─── Maç Sil ─────────────────────────────────────────────────────────
  const removeMatch = useCallback((id: string) => {
    const updated = deleteMatchFromStorage(id);
    setMatches(updated);
  }, []);

  // ─── Tüm Maçları Güncelle ────────────────────────────────────────────
  const updateMatches = useCallback((newMatches: Match[]) => {
    saveMatches(newMatches);
    setMatches(newMatches);
  }, []);

  const sortedMatches = [...matches].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return {
    matches: sortedMatches,
    isLoaded,
    isRefreshing,
    lastUpdated,
    refreshError,
    refreshFromApi,
    addMatch,
    removeMatch,
    updateMatches,
  };
}
