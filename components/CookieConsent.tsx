import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Settings, Check } from 'lucide-react';
import { NavLink } from 'react-router-dom';

type CookiePreferences = {
  essential: boolean;
  analytics: boolean;
  preferences: boolean;
};

const COOKIE_CONSENT_KEY = 'axrategy_cookie_consent';
const COOKIE_PREFERENCES_KEY = 'axrategy_cookie_preferences';

export const useCookieConsent = () => {
  const [hasConsented, setHasConsented] = useState<boolean | null>(null);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    preferences: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    const savedPrefs = localStorage.getItem(COOKIE_PREFERENCES_KEY);

    if (consent) {
      setHasConsented(true);
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }
    } else {
      setHasConsented(false);
    }
  }, []);

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      preferences: true,
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(allAccepted));
    setPreferences(allAccepted);
    setHasConsented(true);
  };

  const acceptSelected = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    setPreferences(prefs);
    setHasConsented(true);
  };

  const rejectNonEssential = () => {
    const essentialOnly: CookiePreferences = {
      essential: true,
      analytics: false,
      preferences: false,
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(essentialOnly));
    setPreferences(essentialOnly);
    setHasConsented(true);
  };

  return {
    hasConsented,
    preferences,
    acceptAll,
    acceptSelected,
    rejectNonEssential,
  };
};

export const CookieConsentBanner: React.FC = () => {
  const { hasConsented, acceptAll, acceptSelected, rejectNonEssential } = useCookieConsent();
  const [showDetails, setShowDetails] = useState(false);
  const [tempPrefs, setTempPrefs] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    preferences: false,
  });

  if (hasConsented === null || hasConsented === true) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
      >
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          {!showDetails ? (
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl flex-shrink-0">
                  <Cookie className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    We value your privacy
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
                    By clicking "Accept All", you consent to our use of cookies as described in our{' '}
                    <NavLink to="/privacy" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                      Privacy Policy
                    </NavLink>.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={acceptAll}
                      className="px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                    >
                      Accept All
                    </button>
                    <button
                      onClick={rejectNonEssential}
                      className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      Essential Only
                    </button>
                    <button
                      onClick={() => setShowDetails(true)}
                      className="px-5 py-2.5 text-gray-600 dark:text-gray-400 rounded-xl font-semibold text-sm hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2"
                    >
                      <Settings size={16} />
                      Customize
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Cookie Preferences</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label="Close preferences"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Essential Cookies</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Required for the website to function properly</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Always on</span>
                      <div className="w-12 h-6 bg-emerald-500 rounded-full flex items-center justify-end px-1 cursor-not-allowed">
                        <div className="w-4 h-4 bg-white rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Analytics Cookies</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Help us understand how visitors interact with our site</p>
                    </div>
                    <button
                      onClick={() => setTempPrefs(p => ({ ...p, analytics: !p.analytics }))}
                      className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                        tempPrefs.analytics ? 'bg-emerald-500 justify-end' : 'bg-gray-300 dark:bg-gray-600 justify-start'
                      }`}
                      aria-label={tempPrefs.analytics ? 'Disable analytics cookies' : 'Enable analytics cookies'}
                    >
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Preference Cookies</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Remember your settings and preferences</p>
                    </div>
                    <button
                      onClick={() => setTempPrefs(p => ({ ...p, preferences: !p.preferences }))}
                      className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                        tempPrefs.preferences ? 'bg-emerald-500 justify-end' : 'bg-gray-300 dark:bg-gray-600 justify-start'
                      }`}
                      aria-label={tempPrefs.preferences ? 'Disable preference cookies' : 'Enable preference cookies'}
                    >
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => acceptSelected(tempPrefs)}
                  className="flex-1 px-5 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={16} />
                  Save Preferences
                </button>
                <button
                  onClick={acceptAll}
                  className="px-5 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Accept All
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
