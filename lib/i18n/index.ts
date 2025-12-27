import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Locale = 'en' | 'fr';

export interface TranslationKeys {
  // Navigation
  'nav.home': string;
  'nav.services': string;
  'nav.pricing': string;
  'nav.work': string;
  'nav.about': string;
  'nav.insights': string;
  'nav.contact': string;
  'nav.getStarted': string;

  // Hero
  'hero.title': string;
  'hero.subtitle': string;
  'hero.cta.primary': string;
  'hero.cta.secondary': string;

  // Services
  'services.title': string;
  'services.subtitle': string;
  'services.ai.title': string;
  'services.ai.description': string;
  'services.automation.title': string;
  'services.automation.description': string;
  'services.web.title': string;
  'services.web.description': string;
  'services.strategy.title': string;
  'services.strategy.description': string;

  // Pricing
  'pricing.title': string;
  'pricing.subtitle': string;
  'pricing.starter.title': string;
  'pricing.growth.title': string;
  'pricing.enterprise.title': string;
  'pricing.cta': string;
  'pricing.popular': string;
  'pricing.perMonth': string;
  'pricing.custom': string;

  // Contact
  'contact.title': string;
  'contact.subtitle': string;
  'contact.form.name': string;
  'contact.form.email': string;
  'contact.form.message': string;
  'contact.form.submit': string;
  'contact.form.sending': string;
  'contact.form.success': string;
  'contact.form.error': string;

  // Chat
  'chat.placeholder': string;
  'chat.greeting': string;
  'chat.typing': string;

  // Footer
  'footer.tagline': string;
  'footer.rights': string;
  'footer.privacy': string;
  'footer.terms': string;

  // Common
  'common.learnMore': string;
  'common.bookCall': string;
  'common.readMore': string;
  'common.viewAll': string;
  'common.loading': string;
  'common.error': string;
  'common.success': string;
  'common.cancel': string;
  'common.save': string;
  'common.delete': string;
  'common.edit': string;
  'common.close': string;
}

type Translations = Record<Locale, TranslationKeys>;

const translations: Translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.pricing': 'Pricing',
    'nav.work': 'Work',
    'nav.about': 'About',
    'nav.insights': 'Insights',
    'nav.contact': 'Contact',
    'nav.getStarted': 'Get Started',

    // Hero
    'hero.title': 'Transform Your Business with AI & Automation',
    'hero.subtitle': 'We help businesses leverage cutting-edge AI and automation to save time, reduce costs, and scale faster.',
    'hero.cta.primary': 'Book a Free Consultation',
    'hero.cta.secondary': 'Explore Services',

    // Services
    'services.title': 'Our Services',
    'services.subtitle': 'Comprehensive solutions to modernize your business',
    'services.ai.title': 'AI Assistants',
    'services.ai.description': 'Custom AI chatbots and virtual assistants that handle customer inquiries 24/7.',
    'services.automation.title': 'Business Automation',
    'services.automation.description': 'Streamline workflows and eliminate repetitive tasks with smart automation.',
    'services.web.title': 'Web Development',
    'services.web.description': 'Modern, fast, and SEO-optimized websites that convert visitors into customers.',
    'services.strategy.title': 'AI Strategy',
    'services.strategy.description': 'Strategic consulting to help you identify and implement AI opportunities.',

    // Pricing
    'pricing.title': 'Simple, Transparent Pricing',
    'pricing.subtitle': 'Choose the plan that fits your needs',
    'pricing.starter.title': 'Starter',
    'pricing.growth.title': 'Growth',
    'pricing.enterprise.title': 'Enterprise',
    'pricing.cta': 'Get Started',
    'pricing.popular': 'Most Popular',
    'pricing.perMonth': '/month',
    'pricing.custom': 'Custom',

    // Contact
    'contact.title': 'Get in Touch',
    'contact.subtitle': "Ready to transform your business? Let's talk.",
    'contact.form.name': 'Your Name',
    'contact.form.email': 'Email Address',
    'contact.form.message': 'How can we help?',
    'contact.form.submit': 'Send Message',
    'contact.form.sending': 'Sending...',
    'contact.form.success': 'Message sent successfully!',
    'contact.form.error': 'Failed to send message. Please try again.',

    // Chat
    'chat.placeholder': 'Type your message...',
    'chat.greeting': 'Hi! How can I help you today?',
    'chat.typing': 'Typing...',

    // Footer
    'footer.tagline': 'Empowering businesses with AI and automation.',
    'footer.rights': 'All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',

    // Common
    'common.learnMore': 'Learn More',
    'common.bookCall': 'Book a Call',
    'common.readMore': 'Read More',
    'common.viewAll': 'View All',
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.success': 'Success!',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.services': 'Services',
    'nav.pricing': 'Tarifs',
    'nav.work': 'Projets',
    'nav.about': 'À propos',
    'nav.insights': 'Blogue',
    'nav.contact': 'Contact',
    'nav.getStarted': 'Commencer',

    // Hero
    'hero.title': "Transformez votre entreprise avec l'IA et l'automatisation",
    'hero.subtitle': "Nous aidons les entreprises à exploiter l'IA et l'automatisation pour économiser du temps, réduire les coûts et croître plus rapidement.",
    'hero.cta.primary': 'Réserver une consultation gratuite',
    'hero.cta.secondary': 'Explorer les services',

    // Services
    'services.title': 'Nos Services',
    'services.subtitle': 'Des solutions complètes pour moderniser votre entreprise',
    'services.ai.title': 'Assistants IA',
    'services.ai.description': 'Chatbots IA personnalisés qui répondent aux demandes des clients 24h/24.',
    'services.automation.title': 'Automatisation',
    'services.automation.description': 'Optimisez vos processus et éliminez les tâches répétitives.',
    'services.web.title': 'Développement Web',
    'services.web.description': 'Sites web modernes, rapides et optimisés pour le référencement.',
    'services.strategy.title': 'Stratégie IA',
    'services.strategy.description': "Consultation stratégique pour identifier les opportunités d'IA.",

    // Pricing
    'pricing.title': 'Tarification simple et transparente',
    'pricing.subtitle': 'Choisissez le plan qui vous convient',
    'pricing.starter.title': 'Démarrage',
    'pricing.growth.title': 'Croissance',
    'pricing.enterprise.title': 'Entreprise',
    'pricing.cta': 'Commencer',
    'pricing.popular': 'Le plus populaire',
    'pricing.perMonth': '/mois',
    'pricing.custom': 'Sur mesure',

    // Contact
    'contact.title': 'Contactez-nous',
    'contact.subtitle': 'Prêt à transformer votre entreprise? Parlons-en.',
    'contact.form.name': 'Votre nom',
    'contact.form.email': 'Adresse courriel',
    'contact.form.message': 'Comment pouvons-nous vous aider?',
    'contact.form.submit': 'Envoyer le message',
    'contact.form.sending': 'Envoi en cours...',
    'contact.form.success': 'Message envoyé avec succès!',
    'contact.form.error': "Échec de l'envoi. Veuillez réessayer.",

    // Chat
    'chat.placeholder': 'Écrivez votre message...',
    'chat.greeting': "Bonjour! Comment puis-je vous aider aujourd'hui?",
    'chat.typing': 'En train d\'écrire...',

    // Footer
    'footer.tagline': "Donnons du pouvoir aux entreprises avec l'IA et l'automatisation.",
    'footer.rights': 'Tous droits réservés.',
    'footer.privacy': 'Politique de confidentialité',
    'footer.terms': "Conditions d'utilisation",

    // Common
    'common.learnMore': 'En savoir plus',
    'common.bookCall': 'Réserver un appel',
    'common.readMore': 'Lire la suite',
    'common.viewAll': 'Voir tout',
    'common.loading': 'Chargement...',
    'common.error': "Une erreur s'est produite",
    'common.success': 'Succès!',
    'common.cancel': 'Annuler',
    'common.save': 'Enregistrer',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.close': 'Fermer',
  },
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof TranslationKeys, params?: Record<string, string>) => string;
  availableLocales: Locale[];
}

const I18nContext = createContext<I18nContextType | null>(null);

const LOCALE_STORAGE_KEY = 'axrategy_locale';

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    // Check localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (stored === 'en' || stored === 'fr') return stored;

      // Check browser language
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'fr') return 'fr';
    }
    return 'en';
  });

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
    document.documentElement.lang = newLocale;
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useCallback(
    (key: keyof TranslationKeys, params?: Record<string, string>): string => {
      let text = translations[locale][key] || translations.en[key] || key;

      if (params) {
        Object.entries(params).forEach(([param, value]) => {
          text = text.replace(new RegExp(`{{${param}}}`, 'g'), value);
        });
      }

      return text;
    },
    [locale]
  );

  const value: I18nContextType = {
    locale,
    setLocale,
    t,
    availableLocales: ['en', 'fr'],
  };

  return React.createElement(I18nContext.Provider, { value }, children);
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

export const useTranslation = () => {
  const { t, locale } = useI18n();
  return { t, locale };
};

export { translations };
