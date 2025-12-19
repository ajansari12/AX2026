import React, { useEffect, useState } from 'react';
import { Calendar, ExternalLink, Loader2 } from 'lucide-react';

interface CalEmbedProps {
  calLink?: string;
  className?: string;
}

export const CalEmbed: React.FC<CalEmbedProps> = ({
  calLink = 'axrategy/strategy-call',
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://app.cal.com/embed/embed.js';
    script.async = true;

    script.onload = () => {
      setIsLoading(false);
      if ((window as any).Cal) {
        (window as any).Cal('init', { origin: 'https://app.cal.com' });
      }
    };

    script.onerror = () => {
      setIsLoading(false);
      setError(true);
    };

    const existingScript = document.querySelector('script[src="https://app.cal.com/embed/embed.js"]');
    if (!existingScript) {
      document.head.appendChild(script);
    } else {
      setIsLoading(false);
      if ((window as any).Cal) {
        (window as any).Cal('init', { origin: 'https://app.cal.com' });
      }
    }

    return () => {
      // We don't remove the script on unmount to prevent re-loading issues
    };
  }, []);

  if (error) {
    return (
      <div className={`bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 text-center ${className}`}>
        <Calendar className="mx-auto mb-4 text-gray-400" size={48} />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          Calendar temporarily unavailable
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Please use the form or book directly on Cal.com
        </p>
        <a
          href={`https://cal.com/${calLink}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          Open Calendar <ExternalLink size={16} />
        </a>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-2xl">
          <div className="text-center">
            <Loader2 className="animate-spin mx-auto mb-3 text-gray-400" size={32} />
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading calendar...</p>
          </div>
        </div>
      )}

      <div
        data-cal-link={calLink}
        data-cal-config='{"layout":"month_view","theme":"auto"}'
        className="min-h-[500px] rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        style={{ width: '100%' }}
      />

      <p className="text-center text-xs text-gray-400 mt-4">
        Powered by{' '}
        <a
          href="https://cal.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600 dark:hover:text-gray-300 underline"
        >
          Cal.com
        </a>
      </p>
    </div>
  );
};

export const CalButton: React.FC<{
  calLink?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ calLink = 'axrategy/strategy-call', children, className = '' }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://app.cal.com/embed/embed.js';
    script.async = true;

    script.onload = () => {
      if ((window as any).Cal) {
        (window as any).Cal('init', { origin: 'https://app.cal.com' });
      }
    };

    const existingScript = document.querySelector('script[src="https://app.cal.com/embed/embed.js"]');
    if (!existingScript) {
      document.head.appendChild(script);
    } else if ((window as any).Cal) {
      (window as any).Cal('init', { origin: 'https://app.cal.com' });
    }
  }, []);

  return (
    <button
      data-cal-link={calLink}
      data-cal-config='{"layout":"month_view","theme":"auto"}'
      className={className}
    >
      {children}
    </button>
  );
};
