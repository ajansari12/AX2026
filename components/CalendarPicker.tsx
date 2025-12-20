import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CalendarPickerProps {
  onDateSelect: (date: Date) => void;
  hasAvailability: (date: Date) => boolean;
  onMonthChange: (start: Date, end: Date) => void;
  isLoading?: boolean;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const CalendarPicker: React.FC<CalendarPickerProps> = ({
  onDateSelect,
  hasAvailability,
  onMonthChange,
  isLoading = false,
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const start = new Date(currentYear, currentMonth, 1);
    const end = new Date(currentYear, currentMonth + 1, 0);
    end.setHours(23, 59, 59, 999);
    onMonthChange(start, end);
  }, [currentMonth, currentYear, onMonthChange]);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const goToPreviousMonth = () => {
    setDirection(-1);
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    setDirection(1);
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isPastDate = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return date < today;
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const canGoPrevious = () => {
    return currentYear > today.getFullYear() ||
           (currentYear === today.getFullYear() && currentMonth > today.getMonth());
  };

  const handleDateClick = (day: number) => {
    if (isPastDate(day)) return;
    const selectedDate = new Date(currentYear, currentMonth, day);
    onDateSelect(selectedDate);
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          disabled={!canGoPrevious()}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {MONTHS[currentMonth]} {currentYear}
        </h3>
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${currentMonth}-${currentYear}`}
          initial={{ opacity: 0, x: direction * 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -20 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-7 gap-1"
        >
          {emptyDays.map((_, idx) => (
            <div key={`empty-${idx}`} className="aspect-square" />
          ))}
          {days.map((day) => {
            const date = new Date(currentYear, currentMonth, day);
            const isPast = isPastDate(day);
            const isTodayDate = isToday(day);
            const hasSlots = !isPast && hasAvailability(date);

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                disabled={isPast || isLoading}
                className={`
                  aspect-square rounded-xl text-sm font-medium transition-all relative
                  ${isPast
                    ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed'
                    : hasSlots
                      ? 'text-gray-900 dark:text-white hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:ring-2 hover:ring-emerald-500 cursor-pointer'
                      : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  }
                  ${isTodayDate && !isPast ? 'ring-2 ring-gray-300 dark:ring-gray-600' : ''}
                `}
              >
                {day}
                {hasSlots && !isPast && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500" />
                )}
              </button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {isLoading && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 border-t-emerald-500 rounded-full animate-spin" />
          Loading availability...
        </div>
      )}

      <div className="mt-6 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Available
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600" />
          Unavailable
        </div>
      </div>
    </div>
  );
};
