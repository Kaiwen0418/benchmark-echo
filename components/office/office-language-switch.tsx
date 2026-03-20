'use client';

import type { AppLocale } from '@/lib/site-data';

type OfficeLanguageSwitchProps = {
  locale: AppLocale;
  onChange: (locale: AppLocale) => void;
  ariaLabel: string;
  labels: Record<AppLocale, string>;
};

export function OfficeLanguageSwitch({
  locale,
  onChange,
  ariaLabel,
  labels
}: OfficeLanguageSwitchProps) {
  return (
    <div className="office-language-switch" aria-label={ariaLabel}>
      {(['zh', 'en', 'ja'] as AppLocale[]).map((value) => (
        <button
          key={value}
          type="button"
          className={locale === value ? 'office-pill active' : 'office-pill'}
          onClick={() => onChange(value)}
        >
          {labels[value]}
        </button>
      ))}
    </div>
  );
}
