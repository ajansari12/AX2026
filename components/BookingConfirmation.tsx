import React, { useMemo } from 'react';
import { Check, Calendar, Clock, Mail, Video, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface BookingConfirmationProps {
  bookingResult: {
    id: string;
    uid: string;
    status: string;
    start: string;
    end: string;
    meetingUrl?: string;
  };
  attendee: {
    name: string;
    email: string;
    timeZone: string;
  };
  onBookAnother?: () => void;
}

const formatTime = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  bookingResult,
  attendee,
  onBookAnother,
}) => {
  const timezone = useMemo(() => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }, []);

  return (
    <div className="w-full text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <Check size={40} className="text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          You're booked!
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          A calendar invitation has been sent to your email.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 mb-6 text-left border border-gray-100 dark:border-gray-700"
      >
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-lg">
          15 Minute Discovery Call
        </h4>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Calendar size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-900 dark:text-white font-medium">
                {formatDate(bookingResult.start)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-900 dark:text-white font-medium">
                {formatTime(bookingResult.start)} - {formatTime(bookingResult.end)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{timezone}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-900 dark:text-white font-medium">
                {attendee.email}
              </p>
            </div>
          </div>

          {bookingResult.meetingUrl && (
            <div className="flex items-start gap-3">
              <Video size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
              <div>
                <a
                  href={bookingResult.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline inline-flex items-center gap-1"
                >
                  Join Video Call
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Need to make changes? Check your email for the calendar invite with reschedule options.
        </p>

        {onBookAnother && (
          <button
            onClick={onBookAnother}
            className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline text-sm"
          >
            Book another call
          </button>
        )}
      </motion.div>
    </div>
  );
};
