import { useEffect } from 'react';
import { Calendar, ExternalLink } from 'lucide-react';

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

export const CalEmbed: React.FC<CalEmbedProps> = ({
  calLink = 'axrategy/15min',
  className = '',
}) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://app.cal.com/embed/embed.js';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.Cal) {
        window.Cal('init', { origin: 'https://cal.com' });
        window.Cal('inline', {
          elementOrSelector: '#cal-embed-container',
          calLink: calLink,
          layout: 'month_view',
        });
        window.Cal('ui', {
          styles: { branding: { brandColor: '#2563eb' } },
          hideEventTypeDetails: false,
          layout: 'month_view',
        });
      }
    };

    return () => {
      script.remove();
    };
  }, [calLink]);

  return (
    <div className={className}>
      <div
        id="cal-embed-container"
        className="min-h-[550px] w-full rounded-2xl overflow-hidden bg-white dark:bg-gray-800"
      />
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
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://app.cal.com/embed/embed.js';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.Cal) {
        window.Cal('init', { origin: 'https://cal.com' });
      }
    };

    return () => {
      script.remove();
    };
  }, []);

  const handleClick = () => {
    if (window.Cal) {
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
