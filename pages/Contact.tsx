import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Section, Button } from '../components/UI';
import { SEO } from '../components/SEO';
import { Mail, MapPin, Clock, Check, Loader2, AlertCircle, Calendar } from 'lucide-react';
import { SERVICES } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { useLeads } from '../hooks/useLeads';
import { CalCard } from '../components/CalEmbed';

export const Contact: React.FC = () => {
  const { search } = useLocation();
  const { submitLead, isSubmitting } = useLeads();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'General Inquiry',
    message: '',
  });
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const serviceParam = params.get('service');
    if (serviceParam) {
      setFormData(prev => ({ ...prev, service: decodeURIComponent(serviceParam) }));
    }
  }, [search]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    setErrorMessage('');

    const result = await submitLead({
      name: formData.name,
      email: formData.email,
      service_interest: formData.service,
      message: formData.message,
      source: 'contact_form',
    });

    if (result.success) {
      setFormState('success');
      setFormData({ name: '', email: '', service: 'General Inquiry', message: '' });
    } else {
      setFormState('error');
      setErrorMessage(result.error || 'Something went wrong. Please try again.');
    }
  };

  const resetForm = () => {
    setFormState('idle');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen pt-20">
      <SEO
        title="Contact Us - Book a Strategy Call"
        description="Schedule a free strategy session with Axrategy. Let's discuss how we can automate your business and grow your revenue."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)]">

        <div className="bg-black text-white p-12 md:p-24 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

          <div className="relative z-10">
            <h1 className="text-5xl lg:text-6xl font-bold mb-8 tracking-tight">Let's figure out <br/><span className="text-gray-400">what you need.</span></h1>
            <p className="text-gray-300 text-lg mb-12 max-w-md leading-relaxed">
              Tell us what's taking up your time. We'll have a quick chat and see if we can help - no pressure, no sales pitch.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                   <Mail className="text-emerald-400" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Email</h4>
                  <p className="text-gray-400">hello@axrategy.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                   <MapPin className="text-emerald-400" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Location</h4>
                  <p className="text-gray-400">Toronto, Canada</p>
                  <p className="text-gray-500 text-sm">Serving clients across North America</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                 <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                   <Clock className="text-emerald-400" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">We'll Get Back to You</h4>
                  <p className="text-gray-400">Within a few hours</p>
                  <p className="text-gray-500 text-sm">And if we're not the right fit, we'll say so</p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10">
              <button
                onClick={() => setShowCalendar(true)}
                className="flex items-center gap-3 text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
              >
                <Calendar size={20} />
                <span>Or just pick a time to talk</span>
              </button>
            </div>
          </div>

          <div className="mt-12 text-sm text-gray-600 relative z-10">
            © 2026 Axrategy Inc.
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 md:p-24 flex items-center justify-center">

          <AnimatePresence mode="wait">
            {showCalendar ? (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-lg"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pick a Time to Talk</h2>
                  <button
                    onClick={() => setShowCalendar(false)}
                    className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Use form instead
                  </button>
                </div>
                <CalCard />
              </motion.div>
            ) : formState === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center max-w-md"
              >
                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={40} strokeWidth={3} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Got it!</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                  Thanks for reaching out. We'll get back to you within a day to set up a time to talk.
                </p>
                <div className="space-y-4">
                  <button
                    onClick={() => setShowCalendar(true)}
                    className="w-full py-4 px-6 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                  >
                    Book Now on Calendar
                  </button>
                  <Button onClick={resetForm} variant="outline" className="w-full">Send another message</Button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-md space-y-6"
                onSubmit={handleSubmit}
              >
                {formState === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3"
                  >
                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="text-red-700 dark:text-red-400 font-medium">{errorMessage}</p>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="text-sm text-red-600 dark:text-red-500 hover:underline mt-1"
                      >
                        Try again
                      </button>
                    </div>
                  </motion.div>
                )}

                <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

                 <div className={`transition-opacity duration-300 ${focusedField && focusedField !== 'name' ? 'opacity-60' : 'opacity-100'}`}>
                   <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">Name</label>
                   <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-4 py-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:bg-white dark:focus:bg-gray-800 transition-all text-lg"
                    placeholder="Jane Doe"
                   />
                 </div>

                 <div className={`transition-opacity duration-300 ${focusedField && focusedField !== 'email' ? 'opacity-60' : 'opacity-100'}`}>
                   <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">Email</label>
                   <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-4 py-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:bg-white dark:focus:bg-gray-800 transition-all text-lg"
                    placeholder="jane@company.com"
                   />
                 </div>

                 <div className={`transition-opacity duration-300 ${focusedField && focusedField !== 'service' ? 'opacity-60' : 'opacity-100'}`}>
                   <label htmlFor="service" className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">Interested In</label>
                   <div className="relative">
                     <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onFocus={() => setFocusedField('service')}
                      onBlur={() => setFocusedField(null)}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:bg-white dark:focus:bg-gray-800 transition-all text-lg appearance-none cursor-pointer"
                     >
                       <option value="General Inquiry">General Inquiry</option>
                       {SERVICES.map(service => (
                         <option key={service.id} value={service.title}>{service.title}</option>
                       ))}
                       <option value="Other">Other</option>
                     </select>
                     <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                     </div>
                   </div>
                 </div>

                 <div className={`transition-opacity duration-300 ${focusedField && focusedField !== 'message' ? 'opacity-60' : 'opacity-100'}`}>
                   <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">What's taking up most of your time?</label>
                   <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-4 py-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:bg-white dark:focus:bg-gray-800 transition-all text-lg resize-none"
                    placeholder="e.g., I'm spending too much time on follow-ups and paperwork..."
                   ></textarea>
                 </div>

                 <Button className="w-full py-4 text-base" disabled={isSubmitting || formState === 'submitting'}>
                    {isSubmitting || formState === 'submitting' ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="animate-spin" size={20} /> Sending...
                      </span>
                    ) : 'Send Message'}
                 </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
