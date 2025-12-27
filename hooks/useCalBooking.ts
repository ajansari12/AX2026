import { useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

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
  error?: string | {
    code: string;
    message: string;
    details?: unknown;
  };
}

interface Attendee {
  name: string;
  email: string;
  timeZone: string;
}

interface BookingData {
  start: string;
  eventTypeId?: number;
  eventTypeSlug?: string;
  username?: string;
  attendee: Attendee;
  notes?: string;
  serviceInterest?: string;
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
  const [apiUnavailable, setApiUnavailable] = useState(false);
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
    if (apiUnavailable) return;

    setIsLoadingSlots(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        action: 'slots',
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        eventTypeSlug: '15min',
        username: 'axrategy',
      });

      const response = await fetch(`${CAL_PROXY_URL}?${params}`, { headers });
      const data = await response.json();

      if (response.status === 500 && data.error?.includes('API key')) {
        setApiUnavailable(true);
        return;
      }

      if (!response.ok) {
        setApiUnavailable(true);
        return;
      }

      if (data.status === 'success' && data.data?.slots) {
        setSlots(data.data.slots);
      } else {
        setApiUnavailable(true);
      }
    } catch (err) {
      console.error('Error fetching slots:', err);
      setApiUnavailable(true);
    } finally {
      setIsLoadingSlots(false);
    }
  }, [apiUnavailable]);

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

        // Create lead record from calendar booking
        if (isSupabaseConfigured) {
          try {
            await supabase.from('leads').insert({
              name: bookingData.attendee.name,
              email: bookingData.attendee.email,
              service_interest: bookingData.serviceInterest || null,
              message: bookingData.notes || 'Booked via calendar',
              source: 'calendar_booking',
              status: 'new',
            });
          } catch (leadErr) {
            // Silent fail - don't block booking success for lead creation failure
            console.error('Error creating lead from booking:', leadErr);
          }
        }

        return true;
      } else {
        const errorMessage = typeof data.error === 'string'
          ? data.error
          : data.error?.message || 'Failed to create booking';
        setError(errorMessage);
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
    apiUnavailable,
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
