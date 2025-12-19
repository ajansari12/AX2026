
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Section, Button } from '../components/UI';
import { SEO } from '../components/SEO';
import { Mail, MapPin, Clock, Check, Loader2 } from 'lucide-react';
import { SERVICES } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

export const Contact: React.FC = () => {
  const { search } = useLocation();
  const [selectedService, setSelectedService] = useState('General Inquiry');
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const serviceParam = params.get('service');
    if (serviceParam) {
      setSelectedService(decodeURIComponent(serviceParam));
    }
  }, [search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    // Simulate API call
    setTimeout(() => {
      setFormState('success');
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-20">
      <SEO 
        title="Contact Us - Book a Strategy Call"
        description="Schedule a free strategy session with Axrategy. Let's discuss how we can automate your business and grow your revenue."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)]">
        
        {/* Left Info Panel */}
        <div className="bg-black text-white p-12 md:p-24 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle bg gradient */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          
          <div className="relative z-10">
            <h1 className="text-5xl lg:text-6xl font-bold mb-8 tracking-tight">Stop losing <br/><span className="text-gray-400">leads today.</span></h1>
            <p className="text-gray-300 text-lg mb-12 max-w-md leading-relaxed">
              Tell us where your business hurts. We'll show you the exact system to fix it on a free 20-minute strategy call.
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
                  <h4 className="font-bold text-lg">Response Time</h4>
                  <p className="text-gray-400">Within 24 hours</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-sm text-gray-600 relative z-10">
            © 2026 Axrategy Inc.
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="bg-white dark:bg-gray-900 p-8 md:p-24 flex items-center justify-center">
          
          <AnimatePresence mode="wait">
            {formState === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center max-w-md"
              >
                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={40} strokeWidth={3} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Request Received!</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                  Thanks for reaching out. We've sent a confirmation email to you. We'll be in touch within 24 hours to schedule your call.
                </p>
                <Button onClick={() => setFormState('idle')} variant="outline">Send another message</Button>
              </motion.div>
            ) : (
              <motion.form 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-md space-y-6" 
                onSubmit={handleSubmit}
              >
                 <div className={`transition-opacity duration-300 ${focusedField && focusedField !== 'name' ? 'opacity-60' : 'opacity-100'}`}>
                   <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">Name</label>
                   <input 
                    id="name"
                    type="text" 
                    required
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
                    type="email" 
                    required
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
                      value={selectedService}
                      onFocus={() => setFocusedField('service')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setSelectedService(e.target.value)}
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
                   <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">Message</label>
                   <textarea 
                    id="message"
                    rows={4} 
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-4 py-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:bg-white dark:focus:bg-gray-800 transition-all text-lg resize-none" 
                    placeholder="Tell us about your goals..."
                   ></textarea>
                 </div>
                 
                 <Button className="w-full py-4 text-base" disabled={formState === 'submitting'}>
                    {formState === 'submitting' ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="animate-spin" size={20} /> Sending...
                      </span>
                    ) : 'Book Strategy Call'}
                 </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
