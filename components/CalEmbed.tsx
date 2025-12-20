import { useEffect, useRef } from 'react';
import { Calendar, ExternalLink, Loader2 } from 'lucide-react';

declare global {
  interface Window {
    Cal?: (action: string, ...args: unknown[]) => void;
  }
}

interface CalEmbedProps {
  calLink?: string;
  className?: string;
}

export const CalEmbed: React.FC<CalEmbedProps> = ({
  calLink = 'axrategy/15min',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    const loadCal = () => {
      if (window.Cal && containerRef.current) {
        window.Cal('inline', {
          elementOrSelector: containerRef.current,
          calLink: calLink,
          config: {
            layout: 'month_view',
            theme: 'auto',
          },
        });
        initialized.current = true;
      }
    };

    const existingScript = document.querySelector('script[src="https://app.cal.com/embed/embed.js"]');

    if (existingScript && window.Cal) {
      loadCal();
      return;
    }

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://app.cal.com/embed/embed.js';
      script.async = true;
      script.onload = () => {
        if (window.Cal) {
          window.Cal('init', { origin: 'https://app.cal.com' });
          loadCal();
        }
      };
      document.head.appendChild(script);
    }
  }, [calLink]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={containerRef}
        className="min-h-[600px] rounded-2xl overflow-hidden"
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
}> = ({ calLink = 'axrategy/15min', children, className = '' }) => {
  useEffect(() => {
    const existingScript = document.querySelector('script[src="https://app.cal.com/embed/embed.js"]');

    if (existingScript && window.Cal) {
      return;
    }

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://app.cal.com/embed/embed.js';
      script.async = true;
      script.onload = () => {
        if (window.Cal) {
          window.Cal('init', { origin: 'https://app.cal.com' });
        }
      };
      document.head.appendChild(script);
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
