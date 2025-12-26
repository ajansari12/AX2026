import React, { useEffect, useRef, useCallback } from 'react';

/**
 * Cloudflare Turnstile CAPTCHA Component
 *
 * To use:
 * 1. Get your site key from https://dash.cloudflare.com/turnstile
 * 2. Add VITE_TURNSTILE_SITE_KEY to your .env file
 * 3. Add the Turnstile script to your index.html:
 *    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
 */

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: TurnstileOptions) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
      getResponse: (widgetId: string) => string | undefined;
    };
  }
}

interface TurnstileOptions {
  sitekey: string;
  callback?: (token: string) => void;
  'error-callback'?: () => void;
  'expired-callback'?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
  tabindex?: number;
}

interface TurnstileProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
  className?: string;
}

// Get site key from environment
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';

export const Turnstile: React.FC<TurnstileProps> = ({
  onVerify,
  onError,
  onExpire,
  theme = 'auto',
  size = 'normal',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const handleVerify = useCallback((token: string) => {
    onVerify(token);
  }, [onVerify]);

  const handleError = useCallback(() => {
    onError?.();
  }, [onError]);

  const handleExpire = useCallback(() => {
    onExpire?.();
  }, [onExpire]);

  useEffect(() => {
    // Don't render if no site key
    if (!SITE_KEY) {
      console.warn('Turnstile: No site key configured. Set VITE_TURNSTILE_SITE_KEY in your environment.');
      return;
    }

    // Wait for Turnstile to load
    const initTurnstile = () => {
      if (!window.turnstile || !containerRef.current) {
        return;
      }

      // Remove existing widget if any
      if (widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // Widget might not exist
        }
      }

      // Render new widget
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        callback: handleVerify,
        'error-callback': handleError,
        'expired-callback': handleExpire,
        theme,
        size,
      });
    };

    // Check if Turnstile is already loaded
    if (window.turnstile) {
      initTurnstile();
    } else {
      // Wait for script to load
      const checkInterval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(checkInterval);
          initTurnstile();
        }
      }, 100);

      // Cleanup interval after 10 seconds
      setTimeout(() => clearInterval(checkInterval), 10000);

      return () => clearInterval(checkInterval);
    }

    // Cleanup
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // Widget might not exist
        }
      }
    };
  }, [handleVerify, handleError, handleExpire, theme, size]);

  // If no site key, don't render anything
  if (!SITE_KEY) {
    return null;
  }

  return (
    <div ref={containerRef} className={className} />
  );
};

/**
 * Hook to manage Turnstile state
 */
export function useTurnstile() {
  const [token, setToken] = React.useState<string | null>(null);
  const [isVerified, setIsVerified] = React.useState(false);
  const [error, setError] = React.useState(false);

  const handleVerify = useCallback((newToken: string) => {
    setToken(newToken);
    setIsVerified(true);
    setError(false);
  }, []);

  const handleError = useCallback(() => {
    setToken(null);
    setIsVerified(false);
    setError(true);
  }, []);

  const handleExpire = useCallback(() => {
    setToken(null);
    setIsVerified(false);
  }, []);

  const reset = useCallback(() => {
    setToken(null);
    setIsVerified(false);
    setError(false);
  }, []);

  // Check if Turnstile is configured
  const isConfigured = Boolean(SITE_KEY);

  return {
    token,
    isVerified,
    error,
    isConfigured,
    handleVerify,
    handleError,
    handleExpire,
    reset,
  };
}

/**
 * Check if Turnstile is enabled
 */
export function isTurnstileEnabled(): boolean {
  return Boolean(SITE_KEY);
}
