import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useI18n, Locale } from '../lib/i18n';

const LOCALE_NAMES: Record<Locale, { name: string; flag: string }> = {
  en: { name: 'English', flag: '🇺🇸' },
  fr: { name: 'Français', flag: '🇨🇦' },
};

interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal' | 'dropdown';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'default',
  className = '',
}) => {
  const { locale, setLocale, availableLocales } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (variant === 'minimal') {
    return (
      <div className={`flex gap-1 ${className}`}>
        {availableLocales.map((loc) => (
          <button
            key={loc}
            onClick={() => setLocale(loc)}
            className={`px-2 py-1 text-sm rounded transition-colors ${
              locale === loc
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {loc.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div ref={dropdownRef} className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm">{LOCALE_NAMES[locale].flag} {LOCALE_NAMES[locale].name}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
            >
              {availableLocales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setLocale(loc);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    locale === loc
                      ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{LOCALE_NAMES[loc].flag}</span>
                    <span>{LOCALE_NAMES[loc].name}</span>
                  </span>
                  {locale === loc && <Check className="w-4 h-4" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Default variant - button group
  return (
    <div className={`flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg ${className}`}>
      {availableLocales.map((loc) => (
        <button
          key={loc}
          onClick={() => setLocale(loc)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-all ${
            locale === loc
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <span>{LOCALE_NAMES[loc].flag}</span>
          <span className="hidden sm:inline">{LOCALE_NAMES[loc].name}</span>
        </button>
      ))}
    </div>
  );
};

// Simple text component that auto-translates
export const T: React.FC<{
  k: string;
  params?: Record<string, string>;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}> = ({ k, params, as: Component = 'span', className }) => {
  const { t } = useI18n();
  return React.createElement(Component, { className }, t(k as any, params));
};
