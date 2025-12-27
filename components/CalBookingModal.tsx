import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { CustomCalendar } from './CustomCalendar';

interface CalBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTypeId?: number;
  serviceInterest?: string;
}

export const CalBookingModal: React.FC<CalBookingModalProps> = ({
  isOpen,
  onClose,
  eventTypeId = 0,
  serviceInterest,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-md max-h-[90vh] overflow-y-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white transition-colors z-10"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>

              <div className="mb-4 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Book a Discovery Call
                </h2>
                <p className="text-gray-300 text-sm">
                  Pick a time that works for you. We'll have a quick chat about your business.
                </p>
              </div>

              <CustomCalendar eventTypeId={eventTypeId} serviceInterest={serviceInterest} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const useBookingModal = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [serviceInterest, setServiceInterest] = React.useState<string | undefined>(undefined);

  const open = React.useCallback((service?: string) => {
    setServiceInterest(service);
    setIsOpen(true);
  }, []);
  const close = React.useCallback(() => {
    setIsOpen(false);
    setServiceInterest(undefined);
  }, []);
  const toggle = React.useCallback(() => setIsOpen(prev => !prev), []);

  return { isOpen, open, close, toggle, serviceInterest };
};
