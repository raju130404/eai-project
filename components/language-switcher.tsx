'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/navigation';
import { locales, localeNames, Locale } from '@/i18n';
import { Globe } from 'lucide-react';

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value as Locale;
    router.replace(pathname, { locale: nextLocale });
  };

  const short = (loc: Locale) => (loc === 'en' ? 'EN' : loc === 'hi' ? 'HI' : loc === 'te' ? 'TE' : 'TA');

  return (
    <div className={`relative inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-white/15 transition ${className}`}>
      <Globe className="h-3.5 w-3.5 text-rose-200 shrink-0" />
      {/* Visible label: code only on phones, code + name on larger screens */}
      <span aria-hidden="true" className="whitespace-nowrap">
        {short(currentLocale)}
        <span className="hidden sm:inline"> • {localeNames[currentLocale].split(' ')[0]}</span>
      </span>
      <select
        value={currentLocale}
        onChange={handleLanguageChange}
        aria-label="Select Language"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc} className="bg-slate-900 text-white">
            {short(loc)} • {localeNames[loc].split(' ')[0]}
          </option>
        ))}
      </select>
    </div>
  );
}
