import Cal, { getCalApi } from '@calcom/embed-react';
import { useEffect } from 'react';

interface CalEmbedProps {
  calLink?: string;
  className?: string;
}

export const CalEmbed: React.FC<CalEmbedProps> = ({
  calLink = 'axrategy/15min',
  className = '',
}) => {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: '15min' });
      cal('ui', {
        hideEventTypeDetails: false,
        layout: 'month_view',
        cssVarsPerTheme: {
          light: { 'cal-brand': '#000000' },
          dark: { 'cal-brand': '#ffffff' },
        },
      });
    })();
  }, []);

  return (
    <div className={`relative ${className}`}>
      <Cal
        namespace="15min"
        calLink={calLink}
        style={{ width: '100%', height: '100%', overflow: 'scroll' }}
        config={{ layout: 'month_view', theme: 'auto' }}
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
    (async function () {
      const cal = await getCalApi({ namespace: 'button' });
      cal('ui', {
        hideEventTypeDetails: false,
        layout: 'month_view',
        cssVarsPerTheme: {
          light: { 'cal-brand': '#000000' },
          dark: { 'cal-brand': '#ffffff' },
        },
      });
    })();
  }, []);

  return (
    <button
      data-cal-namespace="button"
      data-cal-link={calLink}
      data-cal-config='{"layout":"month_view","theme":"auto"}'
      className={className}
    >
      {children}
    </button>
  );
};
