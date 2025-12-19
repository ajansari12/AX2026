import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { useTeardownRequest } from '../hooks/useTeardownRequest';

export const Section: React.FC<{
  children: React.ReactNode;
  className?: string;
  id?: string;
  light?: boolean;
}> = ({ children, className = '', id, light = false }) => {
  return (
    <section
      id={id}
      className={`py-24 md:py-32 px-6 transition-colors duration-300 ${
        light
          ? 'bg-white dark:bg-gray-900/50'
          : 'bg-transparent'
      } ${className}`}
    >
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  );
};

export const Container: React.FC<{
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({ children, className = '', size = 'xl' }) => {
  const sizes = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
  };
  return <div className={`mx-auto ${sizes[size]} ${className}`}>{children}</div>;
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const useIsDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return isDark;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  style,
  ...props
}) => {
  const isDark = useIsDarkMode();
  const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black dark:focus-visible:ring-white";

  const variants = {
    primary: "bg-white dark:bg-black border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 shadow-lg hover:shadow-xl hover:-translate-y-0.5",
    secondary: "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-transparent",
    outline: "border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-white/5",
    ghost: "hover:bg-gray-50 dark:hover:bg-white/5"
  };

  const sizes = {
    sm: "px-5 py-2.5 text-sm",
    md: "px-7 py-3.5 text-sm",
    lg: "px-9 py-4 text-base"
  };

  const variantColors: Record<string, string> = {
    primary: isDark ? '#ffffff' : '#000000',
    secondary: isDark ? '#ffffff' : '#18181b',
    outline: isDark ? '#ffffff' : '#18181b',
    ghost: isDark ? '#9ca3af' : '#4b5563',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      style={{ color: variantColors[variant], ...style }}
      {...props}
    >
      {children}
    </button>
  );
};

export const FadeIn: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
  >
    {children}
  </motion.div>
);

export const ExitIntentModal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({ websiteUrl: '', email: '' });
  const { submitRequest, isSubmitting } = useTeardownRequest();

  const [hasDismissed, setHasDismissed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('axrategy_exit_dismissed') === 'true';
  });

  useEffect(() => {
    if (hasDismissed) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setIsVisible(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasDismissed]);

  const close = () => {
    setIsVisible(false);
    setHasDismissed(true);
    sessionStorage.setItem('axrategy_exit_dismissed', 'true');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    setErrorMessage('');

    let url = formData.websiteUrl;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    const result = await submitRequest({
      email: formData.email,
      website_url: url,
    });

    if (result.success) {
      setFormState('success');
      setFormData({ websiteUrl: '', email: '' });
      setTimeout(close, 3000);
    } else {
      setFormState('error');
      setErrorMessage(result.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-lg w-full p-8 relative overflow-hidden ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={close}
              aria-label="Close modal"
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            >
              <X size={20} />
            </button>

            <AnimatePresence mode="wait">
              {formState === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-8"
                  role="status"
                  aria-live="polite"
                >
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                    <Check size={32} strokeWidth={3} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Check your inbox!</h3>
                  <p className="text-gray-600 dark:text-gray-400">The teardown details are on their way.</p>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wide border border-blue-100 dark:border-blue-800">
                    Before you go
                  </div>
                  <h3 id="modal-title" className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
                    Get a Free 10-Minute <br/>Website Teardown
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                    Not sure why visitors aren't booking? Enter your email and we'll send you a personalized video review of your homepage.
                  </p>

                  {formState === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-sm"
                    >
                      <AlertCircle className="text-red-500 flex-shrink-0" size={16} />
                      <p className="text-red-700 dark:text-red-400">{errorMessage}</p>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="flex flex-col gap-3 pt-2">
                    <div>
                      <label htmlFor="website-url" className="sr-only">Website URL</label>
                      <input
                        id="website-url"
                        name="websiteUrl"
                        type="text"
                        placeholder="Your Website URL (e.g. mybusiness.com)"
                        required
                        value={formData.websiteUrl}
                        onChange={handleInputChange}
                        className="w-full px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20 transition-all bg-gray-50"
                      />
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label htmlFor="email-address" className="sr-only">Email Address</label>
                        <input
                          id="email-address"
                          name="email"
                          type="email"
                          placeholder="Your Email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20 transition-all bg-gray-50"
                        />
                      </div>
                      <Button disabled={isSubmitting || formState === 'submitting'} className="whitespace-nowrap">
                        {isSubmitting || formState === 'submitting' ? <Loader2 className="animate-spin" /> : <><ArrowRight className="mr-2" size={18}/> Get It</>}
                      </Button>
                    </div>
                  </form>
                  <p className="text-xs text-gray-400 text-center">No spam. Actionable advice only.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
