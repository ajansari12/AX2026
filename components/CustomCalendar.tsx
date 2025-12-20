import React, { useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCalBooking } from '../hooks/useCalBooking';
import { CalendarPicker } from './CalendarPicker';
import { TimeSlotGrid } from './TimeSlotGrid';
import { BookingForm } from './BookingForm';
import { BookingConfirmation } from './BookingConfirmation';
import { Calendar, ExternalLink } from 'lucide-react';

interface CustomCalendarProps {
  eventTypeId?: number;
  onBookingComplete?: () => void;
  className?: string;
}

export const CustomCalendar: React.FC<CustomCalendarProps> = ({
  eventTypeId = 0,
  onBookingComplete,
  className = '',
}) => {
  const {
    step,
    isLoadingSlots,
    isBooking,
    error,
    bookingState,
    fetchSlots,
    createBooking,
    selectDate,
    selectTime,
    goBack,
    reset,
    getSlotsForDate,
    hasAvailability,
    setError,
  } = useCalBooking(eventTypeId);

  const timezone = useMemo(() => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }, []);

  const handleMonthChange = useCallback((start: Date, end: Date) => {
    fetchSlots(start, end);
  }, [fetchSlots]);

  const handleFormSubmit = useCallback(async (data: { name: string; email: string; notes?: string }) => {
    if (!bookingState.selectedTime) return;

    const success = await createBooking({
      start: bookingState.selectedTime,
      eventTypeId: eventTypeId,
      attendee: {
        name: data.name,
        email: data.email,
        timeZone: timezone,
      },
      notes: data.notes,
    });

    if (success && onBookingComplete) {
      onBookingComplete();
    }
  }, [bookingState.selectedTime, eventTypeId, timezone, createBooking, onBookingComplete]);

  const slotsForSelectedDate = bookingState.selectedDate
    ? getSlotsForDate(bookingState.selectedDate)
    : [];

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden ${className}`}>
      <div className="p-6">
        <AnimatePresence mode="wait">
          {step === 'date' && (
            <motion.div
              key="date"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <CalendarPicker
                onDateSelect={selectDate}
                hasAvailability={hasAvailability}
                onMonthChange={handleMonthChange}
                isLoading={isLoadingSlots}
              />
            </motion.div>
          )}

          {step === 'time' && bookingState.selectedDate && (
            <motion.div
              key="time"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <TimeSlotGrid
                selectedDate={bookingState.selectedDate}
                slots={slotsForSelectedDate}
                onTimeSelect={selectTime}
                onBack={goBack}
                isLoading={isLoadingSlots}
              />
            </motion.div>
          )}

          {step === 'form' && bookingState.selectedDate && bookingState.selectedTime && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <BookingForm
                selectedDate={bookingState.selectedDate}
                selectedTime={bookingState.selectedTime}
                onSubmit={handleFormSubmit}
                onBack={goBack}
                isSubmitting={isBooking}
                error={error}
              />
            </motion.div>
          )}

          {step === 'confirm' && bookingState.bookingResult && bookingState.attendee && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <BookingConfirmation
                bookingResult={bookingState.bookingResult}
                attendee={bookingState.attendee}
                onBookAnother={reset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <a
          href="https://cal.com/axrategy/15min"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <Calendar size={14} />
          <span>Open in Cal.com</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
};
