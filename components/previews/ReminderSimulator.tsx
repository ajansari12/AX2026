import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarCheck, Clock, Bell, MessageSquare, Mail, Users,
  ArrowRight, RotateCcw, AlertTriangle, CheckCircle2, Phone,
} from 'lucide-react';
import { PreviewEmailCapture } from './PreviewEmailCapture';
import { trackEvent } from '../../lib/analytics';

interface ReminderSimulatorProps {
  onCheckout: (email: string) => void;
}

const INDUSTRIES: Record<string, { noShowRate: number; avgRevPerAppt: number }> = {
  'Dental': { noShowRate: 23, avgRevPerAppt: 350 },
  'Chiropractic': { noShowRate: 27, avgRevPerAppt: 125 },
  'Legal': { noShowRate: 20, avgRevPerAppt: 500 },
  'Veterinary': { noShowRate: 18, avgRevPerAppt: 200 },
  'Accounting': { noShowRate: 15, avgRevPerAppt: 300 },
  'Medical': { noShowRate: 30, avgRevPerAppt: 250 },
  'Salon / Spa': { noShowRate: 25, avgRevPerAppt: 100 },
  'Other': { noShowRate: 22, avgRevPerAppt: 200 },
};

interface Reminder {
  timing: string;
  type: 'sms' | 'email';
  subject?: string;
  body: string;
  sent: boolean;
}

export const ReminderSimulator: React.FC<ReminderSimulatorProps> = ({ onCheckout }) => {
  const [step, setStep] = useState<'form' | 'timeline' | 'cancel'>('form');
  const [formData, setFormData] = useState({
    clientName: '',
    date: '',
    time: '10:00',
    industry: 'Dental',
  });
  const [showCancelFlow, setShowCancelFlow] = useState(false);
  const [waitlistFilled, setWaitlistFilled] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName.trim() || !formData.date) return;
    trackEvent('reminder_simulator_started', { category: 'product_preview' });
    setStep('timeline');
  };

  const handleReset = () => {
    setStep('form');
    setShowCancelFlow(false);
    setWaitlistFilled(false);
  };

  const handleCancelToggle = () => {
    setShowCancelFlow(true);
    setTimeout(() => setWaitlistFilled(true), 2000);
  };

  const industryData = INDUSTRIES[formData.industry] || INDUSTRIES['Other'];
  const monthlyNoShows = Math.round((industryData.noShowRate / 100) * 80);
  const savedNoShows = Math.round(monthlyNoShows * 0.65);
  const savedRevenue = savedNoShows * industryData.avgRevPerAppt;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const reminders: Reminder[] = [
    {
      timing: '48 hours before',
      type: 'sms',
      body: `Hi ${formData.clientName || 'there'}! This is a reminder that you have an appointment at our office on ${formatDate(formData.date)} at ${formData.time}. Reply CONFIRM to confirm or RESCHEDULE if you need a different time.`,
      sent: true,
    },
    {
      timing: '24 hours before',
      type: 'email',
      subject: `Appointment Reminder -- ${formatDate(formData.date)} at ${formData.time}`,
      body: `Hi ${formData.clientName || 'there'},\n\nJust a friendly reminder about your upcoming appointment:\n\nDate: ${formatDate(formData.date)}\nTime: ${formData.time}\nLocation: 123 Main Street, Suite 200\n\nIf you need to reschedule, please click here or call us at (555) 123-4567.\n\nWe look forward to seeing you!`,
      sent: true,
    },
    {
      timing: '2 hours before',
      type: 'sms',
      body: `Hi ${formData.clientName || 'there'}! Quick reminder -- your appointment is today at ${formData.time}. We're located at 123 Main Street, Suite 200. See you soon!`,
      sent: true,
    },
  ];

  if (step === 'form') {
    return (
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-6">
            <Bell className="w-8 h-8 text-gray-900 dark:text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            See your reminder sequence in action
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Enter an appointment and preview the automated SMS and email reminders your clients will receive.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Client Name</label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => setFormData((p) => ({ ...p, clientName: e.target.value }))}
              placeholder="e.g. Jessica Miller"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Appointment Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData((p) => ({ ...p, time: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Industry</label>
            <select
              value={formData.industry}
              onChange={(e) => setFormData((p) => ({ ...p, industry: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20"
            >
              {Object.keys(INDUSTRIES).map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 text-base flex items-center justify-center gap-2">
            <CalendarCheck size={18} />
            Preview Reminders
          </button>
        </form>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex items-center justify-between">
        <button onClick={handleReset} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <RotateCcw size={16} /> New Simulation
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
        <div className="flex items-center gap-3 mb-1">
          <CalendarCheck size={18} className="text-gray-600 dark:text-gray-400" />
          <span className="font-semibold text-gray-900 dark:text-white text-sm">{formData.clientName}'s Appointment</span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 pl-8">{formatDate(formData.date)} at {formData.time}</p>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-6">
          {reminders.map((reminder, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="relative pl-14"
            >
              <div className={`absolute left-3 top-1 w-7 h-7 rounded-full flex items-center justify-center z-10 ${reminder.type === 'sms' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                {reminder.type === 'sms' ? <Phone size={12} className="text-emerald-600 dark:text-emerald-400" /> : <Mail size={12} className="text-blue-600 dark:text-blue-400" />}
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-5 py-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{reminder.timing}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium uppercase">{reminder.type}</span>
                  </div>
                  <CheckCircle2 size={14} className="text-emerald-500" />
                </div>

                {reminder.subject && (
                  <div className="px-5 py-2 border-b border-gray-100 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Subject: <span className="font-medium text-gray-900 dark:text-white">{reminder.subject}</span></p>
                  </div>
                )}

                <div className={`px-5 py-4 text-sm leading-relaxed whitespace-pre-line ${reminder.type === 'sms' ? 'bg-emerald-50/50 dark:bg-emerald-900/5 text-gray-700 dark:text-gray-300' : 'bg-blue-50/50 dark:bg-blue-900/5 text-gray-700 dark:text-gray-300'}`}>
                  {reminder.body}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {!showCancelFlow ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-sm">What if the client cancels?</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">See the automatic waitlist-fill flow in action.</p>
            </div>
            <button onClick={handleCancelToggle} className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 font-semibold rounded-xl text-sm hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center gap-2">
              <AlertTriangle size={14} /> Simulate Cancel
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <AlertTriangle size={18} className="text-red-500" />
              <div>
                <p className="font-semibold text-red-700 dark:text-red-400 text-sm">{formData.clientName} cancelled</p>
                <p className="text-xs text-red-600/80 dark:text-red-400/60">Slot opened: {formatDate(formData.date)} at {formData.time}</p>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {waitlistFilled && (
              <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Users size={18} className="text-emerald-600 dark:text-emerald-400" />
                  <p className="font-semibold text-emerald-700 dark:text-emerald-400 text-sm">Waitlist notification sent</p>
                </div>
                <div className="bg-white/60 dark:bg-gray-900/40 rounded-xl p-3 text-xs text-gray-700 dark:text-gray-300">
                  <p className="font-semibold mb-1">SMS to 3 waitlist clients:</p>
                  "Great news! A slot just opened up on {formatDate(formData.date)} at {formData.time}. Reply YES to claim it -- first come, first served!"
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Impact Calculator</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Based on {formData.industry} industry averages (~{industryData.noShowRate}% no-show rate, ~80 appointments/month):
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{monthlyNoShows}</p>
            <p className="text-xs text-red-600/80 dark:text-red-400/60 mt-1">No-shows/month without reminders</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{savedNoShows}</p>
            <p className="text-xs text-emerald-600/80 dark:text-emerald-400/60 mt-1">No-shows prevented with reminders</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">${savedRevenue.toLocaleString()}</p>
            <p className="text-xs text-blue-600/80 dark:text-blue-400/60 mt-1">Revenue saved per month</p>
          </div>
        </div>
      </div>

      <PreviewEmailCapture
        productSlug="appointment-reminders"
        ctaLabel="Start Free Trial"
        ctaPrice="$99/mo"
        headline="Stop losing revenue to no-shows."
        subtext="Automated SMS and email reminders with waitlist backfill. Set it up once, save thousands every month."
        onCheckout={onCheckout}
      />
    </motion.div>
  );
};
