const STORAGE_PREFIX = 'ax-utm-';

export interface UTMParams {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
}

const EMPTY_UTM: UTMParams = {
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  utm_term: null,
  utm_content: null,
};

export function captureUTMParams(): void {
  if (typeof window === 'undefined') return;
  try {
    const params = new URLSearchParams(window.location.search);
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;
    keys.forEach(key => {
      const val = params.get(key);
      if (val) {
        sessionStorage.setItem(`${STORAGE_PREFIX}${key}`, val);
      }
    });
  } catch (_) {}
}

export function getUTMParams(): UTMParams {
  if (typeof window === 'undefined') return EMPTY_UTM;
  try {
    return {
      utm_source: sessionStorage.getItem(`${STORAGE_PREFIX}utm_source`),
      utm_medium: sessionStorage.getItem(`${STORAGE_PREFIX}utm_medium`),
      utm_campaign: sessionStorage.getItem(`${STORAGE_PREFIX}utm_campaign`),
      utm_term: sessionStorage.getItem(`${STORAGE_PREFIX}utm_term`),
      utm_content: sessionStorage.getItem(`${STORAGE_PREFIX}utm_content`),
    };
  } catch (_) {
    return EMPTY_UTM;
  }
}
