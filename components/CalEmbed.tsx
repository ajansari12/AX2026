import { useEffect, useRef, useId, useState } from 'react';
import { Calendar, ExternalLink, Loader as Loader2 } from 'lucide-react';

interface CalEmbedProps {
  calLink?: string;
  className?: string;
}

declare global {
  interface Window {
    Cal?: {
      (action: string, ...args: unknown[]): void;
      ns?: Record<string, unknown>;
      q?: unknown[];
      loaded?: boolean;
    };
  }
}

let calScriptLoaded = false;
let calScriptLoading = false;
const calScriptCallbacks: (() => void)[] = [];

function fireCallbacks() {
  if (window.Cal) {
    window.Cal('init', { origin: 'https://cal.com' });
  }
  calScriptCallbacks.forEach(cb => cb());
  calScriptCallbacks.length = 0;
}

function loadCalScript(callback: () => void) {
  if (calScriptLoaded && window.Cal) {
    callback();
    return;
  }

  calScriptCallbacks.push(callback);

  if (calScriptLoading) {
    return;
  }

  calScriptLoading = true;

  const existingScript = document.querySelector<HTMLScriptElement>('script[src*="cal.com/embed/embed.js"]');
  if (existingScript) {
    if (window.Cal) {
      calScriptLoaded = true;
      calScriptLoading = false;
      fireCallbacks();
    } else {
      existingScript.addEventListener('load', () => {
        calScriptLoaded = true;
        calScriptLoading = false;
        fireCallbacks();
      }, { once: true });
      existingScript.addEventListener('error', () => {
        calScriptLoading = false;
        calScriptCallbacks.length = 0;
      }, { once: true });
    }
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://app.cal.com/embed/embed.js';
  script.async = true;

  script.onload = () => {
    calScriptLoaded = true;
    calScriptLoading = false;
    fireCallbacks();
  };

  script.onerror = () => {
    calScriptLoading = false;
    calScriptCallbacks.length = 0;
  };

  document.head.appendChild(script);
}

export const CalEmbed: React.FC<CalEmbedProps> = ({
  calLink = 'axrategy/15min',
  className = '',
}) => {
  const containerId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    if (initializedRef.current) return;

    const initializeEmbed = () => {
      if (!window.Cal || !containerRef.current) return;

      initializedRef.current = true;
      setIsLoading(false);

      window.Cal('inline', {
        elementOrSelector: containerRef.current,
        calLink: calLink,
        layout: 'month_view',
      });

      window.Cal('ui', {
        styles: { branding: { brandColor: '#2563eb' } },
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
    };

    loadCalScript(initializeEmbed);

    const timeout = setTimeout(() => {
      if (!initializedRef.current) {
        setIsLoading(false);
        setLoadFailed(true);
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [calLink, containerId]);

  if (loadFailed) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[300px] gap-4 ${className}`}>
        <Calendar className="w-10 h-10 text-gray-400" />
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          The calendar couldn't load. Book directly on Cal.com.
        </p>
        <a
          href={`https://cal.com/${calLink}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Calendar className="w-4 h-4" />
          Open Booking Page
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        ref={containerRef}
        id={`cal-embed-${containerId.replace(/:/g, '-')}`}
        className="min-h-[550px] w-full rounded-2xl overflow-hidden bg-white dark:bg-gray-800 relative"
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="text-sm text-gray-500">Loading calendar...</span>
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 text-center">
        <a
          href={`https://cal.com/${calLink}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ExternalLink className="w-4 h-4" />
          Open in new tab if calendar doesn't load
        </a>
      </div>
    </div>
  );
};

export const CalButton: React.FC<{
  calLink?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ calLink = 'axrategy/15min', children, className = '' }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadCalScript(() => setIsReady(true));
  }, []);

  const handleClick = () => {
    if (isReady && window.Cal) {
      window.Cal('modal', {
        calLink: calLink,
        layout: 'month_view',
      });
    } else {
      window.open(`https://cal.com/${calLink}`, '_blank');
    }
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
};

export const CalCard: React.FC<{
  calLink?: string;
  className?: string;
}> = ({ calLink = 'axrategy/15min', className = '' }) => {
  return (
    <div className={`bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 text-center ${className}`}>
      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        Book a Discovery Call
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
        Schedule a 15-minute call to discuss how we can help transform your business.
      </p>
      <a
        href={`https://cal.com/${calLink}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
      >
        <Calendar className="w-5 h-5" />
        Schedule Now
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
};
