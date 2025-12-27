import { useEffect, useCallback, useState } from 'react';

// Custom event for triggering booking modal
const BOOKING_MODAL_EVENT = 'openBookingModal';

interface BookingModalEventDetail {
  serviceInterest?: string;
}

// Hook to trigger the booking modal from anywhere
export function useTriggerBookingModal() {
  const trigger = useCallback((serviceInterest?: string) => {
    window.dispatchEvent(
      new CustomEvent<BookingModalEventDetail>(BOOKING_MODAL_EVENT, {
        detail: { serviceInterest },
      })
    );
  }, []);

  return trigger;
}

// Hook to listen for booking modal triggers (used where the modal is rendered)
export function useBookingModalListener(onOpen: (serviceInterest?: string) => void) {
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<BookingModalEventDetail>;
      onOpen(customEvent.detail?.serviceInterest);
    };

    window.addEventListener(BOOKING_MODAL_EVENT, handler);
    return () => window.removeEventListener(BOOKING_MODAL_EVENT, handler);
  }, [onOpen]);
}

// Combined hook for components that both host the modal and might trigger it
export function useGlobalBookingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [serviceInterest, setServiceInterest] = useState<string | undefined>(undefined);

  const open = useCallback((service?: string) => {
    setServiceInterest(service);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setServiceInterest(undefined);
  }, []);

  // Listen for external triggers
  useBookingModalListener(open);

  return { isOpen, open, close, serviceInterest };
}
