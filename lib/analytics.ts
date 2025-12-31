type EventParams = {
  category?: string;
  label?: string;
  value?: number;
  [key: string]: string | number | boolean | undefined;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const initAnalytics = () => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false,
  });
};

export const trackPageView = (path: string, title?: string) => {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
  });
};

export const trackEvent = (action: string, params?: EventParams) => {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;

  window.gtag('event', action, {
    event_category: params?.category || 'engagement',
    event_label: params?.label,
    value: params?.value,
    ...params,
  });
};

export const trackConversion = (conversionId: string, value?: number) => {
  if (!window.gtag) return;

  window.gtag('event', 'conversion', {
    send_to: conversionId,
    value: value,
    currency: 'CAD',
  });
};

export const trackFormSubmission = (formName: string) => {
  trackEvent('form_submission', {
    category: 'form',
    label: formName,
  });
};

export const trackCTAClick = (ctaName: string, location: string) => {
  trackEvent('cta_click', {
    category: 'cta',
    label: ctaName,
    cta_location: location,
  });
};

export const trackBookingStarted = (serviceInterest?: string) => {
  trackEvent('booking_started', {
    category: 'booking',
    label: serviceInterest || 'general',
  });
};

export const trackBookingCompleted = (serviceInterest?: string) => {
  trackEvent('booking_completed', {
    category: 'booking',
    label: serviceInterest || 'general',
  });
};
