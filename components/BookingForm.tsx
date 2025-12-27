import React, { useState, useMemo } from 'react';
import { ChevronLeft, Calendar, Clock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const SERVICE_OPTIONS = [
  { value: '', label: 'Not sure yet' },
  { value: 'ai-assistants', label: 'AI That Answers For You' },
  { value: 'automation-systems', label: 'Automatic Follow-Ups' },
  { value: 'websites-landing-pages', label: 'A Website That Books Clients' },
  { value: 'app-development', label: 'Client Portal / App' },
  { value: 'crm-setup', label: 'CRM Setup' },
  { value: 'analytics-optimization', label: 'Analytics Setup' },
];

interface BookingFormProps {
  selectedDate: Date;
  selectedTime: string;
  onSubmit: (data: { name: string; email: string; notes?: string; serviceInterest?: string }) => void;
  onBack: () => void;
  isSubmitting?: boolean;
  error?: string | null;
  initialServiceInterest?: string;
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
    year: 'numeric',
  });
};

export const BookingForm: React.FC<BookingFormProps> = ({
  selectedDate,
  selectedTime,
  onSubmit,
  onBack,
  isSubmitting = false,
  error,
  initialServiceInterest = '',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    notes: '',
    serviceInterest: initialServiceInterest,
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const timezone = useMemo(() => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      email: formData.email,
      notes: formData.notes || undefined,
      serviceInterest: formData.serviceInterest || undefined,
    });
  };

  return (
    <div className="w-full">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
      >
        <ChevronLeft size={16} />
        Back to times
      </button>

      <div className="mb-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          15 Minute Discovery Call
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Calendar size={16} className="text-emerald-500" />
            {formatDate(selectedDate)}
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Clock size={16} className="text-emerald-500" />
            {formatTime(selectedTime)} ({timezone})
          </div>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={`transition-opacity duration-300 ${focusedField && focusedField !== 'name' ? 'opacity-60' : 'opacity-100'}`}>
          <label htmlFor="booking-name" className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
            Your Name
          </label>
          <input
            id="booking-name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            placeholder="Jane Doe"
          />
        </div>

        <div className={`transition-opacity duration-300 ${focusedField && focusedField !== 'email' ? 'opacity-60' : 'opacity-100'}`}>
          <label htmlFor="booking-email" className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
            Email Address
          </label>
          <input
            id="booking-email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            placeholder="jane@company.com"
          />
        </div>

        <div className={`transition-opacity duration-300 ${focusedField && focusedField !== 'service' ? 'opacity-60' : 'opacity-100'}`}>
          <label htmlFor="booking-service" className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
            What are you interested in? <span className="text-gray-400">(optional)</span>
          </label>
          <select
            id="booking-service"
            value={formData.serviceInterest}
            onChange={(e) => setFormData(prev => ({ ...prev, serviceInterest: e.target.value }))}
            onFocus={() => setFocusedField('service')}
            onBlur={() => setFocusedField(null)}
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          >
            {SERVICE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={`transition-opacity duration-300 ${focusedField && focusedField !== 'notes' ? 'opacity-60' : 'opacity-100'}`}>
          <label htmlFor="booking-notes" className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
            Anything we should know? <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            id="booking-notes"
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            onFocus={() => setFocusedField('notes')}
            onBlur={() => setFocusedField(null)}
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
            placeholder="e.g., I run a dental clinic and want to automate appointment reminders..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Booking...
            </>
          ) : (
            'Confirm Booking'
          )}
        </button>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          By booking, you agree to receive a calendar invite and meeting details via email.
        </p>
      </form>
    </div>
  );
};
