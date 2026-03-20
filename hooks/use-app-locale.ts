'use client';

import { useEffect, useMemo, useState } from 'react';

import type { AppLocale } from '@/lib/site-data';

export function resolveLocale(value: string | null | undefined, fallback: AppLocale = 'en'): AppLocale {
  return value === 'zh' || value === 'en' || value === 'ja' ? value : fallback;
}

export function useAppLocale(requestedLocale: string | null | undefined, fallback: AppLocale = 'en') {
  const initialLocale = useMemo(
    () => resolveLocale(requestedLocale, fallback),
    [fallback, requestedLocale]
  );
  const [locale, setLocale] = useState<AppLocale>(initialLocale);

  useEffect(() => {
    try {
      const storedLang = window.localStorage.getItem('uiLang');
      if (storedLang === 'zh' || storedLang === 'en' || storedLang === 'ja') {
        setLocale(storedLang);
        return;
      }
    } catch {}

    setLocale(initialLocale);
  }, [initialLocale]);

  useEffect(() => {
    try {
      window.localStorage.setItem('uiLang', locale);
    } catch {}
  }, [locale]);

  return { locale, setLocale };
}
