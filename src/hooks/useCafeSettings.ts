'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CafeSettings } from '@/lib/types';
import { getCafeSettings, saveCafeSettings } from '@/lib/storage';
import { DEFAULT_CAFE_SETTINGS } from '@/lib/constants';

export function useCafeSettings() {
  const [settings, setSettings] = useState<CafeSettings>(DEFAULT_CAFE_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setSettings(getCafeSettings());
    setIsLoaded(true);
  }, []);

  const updateSettings = useCallback((newSettings: CafeSettings) => {
    setSettings(newSettings);
    saveCafeSettings(newSettings);
  }, []);

  const updateField = useCallback(
    <K extends keyof CafeSettings>(field: K, value: CafeSettings[K]) => {
      setSettings((prev) => {
        const updated = { ...prev, [field]: value };
        saveCafeSettings(updated);
        return updated;
      });
    },
    []
  );

  return { settings, isLoaded, updateSettings, updateField };
}
