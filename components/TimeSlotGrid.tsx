import React, { useMemo } from 'react';
import { ChevronLeft, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface TimeSlotGridProps {
  selectedDate: Date;
  slots: string[];
  onTimeSelect: (time: string) => void;
  onBack: () => void;
  isLoading?: boolean;
}

const formatTime = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};

export const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  selectedDate,
  slots,
  onTimeSelect,
  onBack,
  isLoading = false,
}) => {
  const timezone = useMemo(() => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }, []);

  const groupedSlots = useMemo(() => {
    const morning: string[] = [];
    const afternoon: string[] = [];
    const evening: string[] = [];

    slots.forEach(slot => {
      const hour = new Date(slot).getHours();
      if (hour < 12) {
        morning.push(slot);
      } else if (hour < 17) {
        afternoon.push(slot);
      } else {
        evening.push(slot);
      }
    });

    return { morning, afternoon, evening };
  }, [slots]);

  const hasSlots = slots.length > 0;

  return (
    <div className="w-full">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
      >
        <ChevronLeft size={16} />
        Back to calendar
      </button>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
          {formatDate(selectedDate)}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <Clock size={14} />
          {timezone}
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      ) : !hasSlots ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No available times for this date.
          </p>
          <button
            onClick={onBack}
            className="mt-4 text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
          >
            Choose another date
          </button>
        </div>
      ) : (
        <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
          {groupedSlots.morning.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                Morning
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {groupedSlots.morning.map((slot, idx) => (
                  <motion.button
                    key={slot}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => onTimeSelect(slot)}
                    className="py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-900 dark:text-white hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all"
                  >
                    {formatTime(slot)}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {groupedSlots.afternoon.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                Afternoon
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {groupedSlots.afternoon.map((slot, idx) => (
                  <motion.button
                    key={slot}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => onTimeSelect(slot)}
                    className="py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-900 dark:text-white hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all"
                  >
                    {formatTime(slot)}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {groupedSlots.evening.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                Evening
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {groupedSlots.evening.map((slot, idx) => (
                  <motion.button
                    key={slot}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => onTimeSelect(slot)}
                    className="py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-900 dark:text-white hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all"
                  >
                    {formatTime(slot)}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
