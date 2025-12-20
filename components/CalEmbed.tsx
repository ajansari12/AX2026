import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface CalEmbedProps {
  calLink?: string;
  className?: string;
}

export const CalEmbed: React.FC<CalEmbedProps> = ({
  calLink = 'axrategy/15min',
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 rounded-2xl">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading calendar...</p>
          </div>
        </div>
      )}
      <iframe
        src={`https://cal.com/${calLink}?embed=true&theme=auto&layout=month_view`}
        className="w-full min-h-[600px] rounded-2xl border-0"
        onLoad={() => setIsLoading(false)}
        allow="payment"
        title="Schedule a meeting"
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
  return (
    <a
      href={`https://cal.com/${calLink}`}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
};
