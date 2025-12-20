import { useState, useCallback } from 'react';

const CAL_PROXY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cal-proxy`;

interface TimeSlot {
  time: string;
}

interface SlotsResponse {
  status: string;
  data: {
    slots: Record<string, TimeSlot[]>;
  };
}

interface BookingResponse {
  status: string;
  data?: {
    id: string;
    uid: string;
    status: string;
    start: string;
    end: string;
    meetingUrl?: string;
  };
  error?: string;
}

interface Attendee {
  name: string;
  email: string;
  timeZone: string;
}

interface BookingData {
  start: string;
  eventTypeId: number;
  attendee: Attendee;
  notes?: string;
}

export type BookingStep = 'date' | 'time' | 'form' | 'confirm';

export interface BookingState {
  selectedDate: Date | null;
  selectedTime: string | null;
  attendee: Attendee | null;
  bookingResult: BookingResponse['data'] | null;
}

export function useCalBooking(eventTypeId: number = 0) {
  const [step, setStep] = useState<BookingStep>('date');
  const [slots, setSlots] = useState<Record<string, TimeSlot[]>>({});
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingState, setBookingState] = useState<BookingState>({
    selectedDate: null,
    selectedTime: null,
    attendee: null,
    bookingResult: null,
  });

  const headers = {
    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  };

  const fetchSlots = useCallback(async (startDate: Date, endDate: Date) => {
    setIsLoadingSlots(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        action: 'slots',
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        eventTypeSlug: '15min',
      });

      const response = await fetch(`${CAL_PROXY_URL}?${params}`, { headers });
      const data: SlotsResponse = await response.json();

      if (data.status === 'success' && data.data?.slots) {
        setSlots(data.data.slots);
      } else {
        setError('Unable to load available times');
      }
    } catch (err) {
      console.error('Error fetching slots:', err);
      setError('Failed to load availability');
    } finally {
      setIsLoadingSlots(false);
    }
  }, []);

  const createBooking = useCallback(async (bookingData: BookingData): Promise<boolean> => {
    setIsBooking(true);
    setError(null);

    try {
      const params = new URLSearchParams({ action: 'book' });
      const response = await fetch(`${CAL_PROXY_URL}?${params}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(bookingData),
      });

      const data: BookingResponse = await response.json();

      if (data.status === 'success' && data.data) {
        setBookingState(prev => ({
          ...prev,
          bookingResult: data.data!,
          attendee: bookingData.attendee,
        }));
        setStep('confirm');
        return true;
      } else {
        setError(data.error || 'Failed to create booking');
        return false;
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('Failed to book appointment');
      return false;
    } finally {
      setIsBooking(false);
    }
  }, []);

  const selectDate = useCallback((date: Date) => {
    setBookingState(prev => ({
      ...prev,
      selectedDate: date,
      selectedTime: null,
    }));
    setStep('time');
  }, []);

  const selectTime = useCallback((time: string) => {
    setBookingState(prev => ({
      ...prev,
      selectedTime: time,
    }));
    setStep('form');
  }, []);

  const goBack = useCallback(() => {
    if (step === 'time') {
      setStep('date');
    } else if (step === 'form') {
      setStep('time');
    }
  }, [step]);

  const reset = useCallback(() => {
    setStep('date');
    setBookingState({
      selectedDate: null,
      selectedTime: null,
      attendee: null,
      bookingResult: null,
    });
    setError(null);
  }, []);

  const getSlotsForDate = useCallback((date: Date): string[] => {
    const dateKey = date.toISOString().split('T')[0];
    const dateSlots = slots[dateKey] || [];
    return dateSlots.map(slot => slot.time);
  }, [slots]);

  const hasAvailability = useCallback((date: Date): boolean => {
    const dateKey = date.toISOString().split('T')[0];
    return !!slots[dateKey]?.length;
  }, [slots]);

  return {
    step,
    slots,
    isLoadingSlots,
    isBooking,
    error,
    bookingState,
    eventTypeId,
    fetchSlots,
    createBooking,
    selectDate,
    selectTime,
    goBack,
    reset,
    getSlotsForDate,
    hasAvailability,
    setError,
  };
}
