
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, CheckCircle2, Moon, Sun, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTriggerBookingModal } from '../hooks/useGlobalBookingModal';

const NAV_LINKS = [
  { name: 'Services', path: '/services' },
  { name: 'Work', path: '/work' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Insights', path: '/insights' },
  { name: 'Resources', path: '/resources' },
];

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
    return 'light';
  });
  const triggerBookingModal = useTriggerBookingModal();

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Handle Theme Changes
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const menuVariants = {
    closed: { opacity: 0, x: "100%" },
    open: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  const linkVariants = {
    closed: { x: 50, opacity: 0 },
    open: (i: number) => ({ 
      x: 0, 
      opacity: 1, 
      transition: { delay: i * 0.1 + 0.2, type: "spring", stiffness: 300, damping: 30 } 
    })
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled || isOpen 
          ? 'py-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-gray-200 dark:border-gray-800 shadow-sm' 
          : 'py-6 bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative z-50">
        <NavLink to="/" aria-label="Axrategy Home" className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black dark:focus-visible:ring-white rounded-lg">
          <span className="group-hover:opacity-80 transition-opacity font-sansation"><span className="text-red-600">AX</span>RATEGY</span>
        </NavLink>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-black dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black dark:focus-visible:ring-white rounded-md ${
                  isActive ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Desktop CTAs & Theme Toggle */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <NavLink to="/contact" className={`text-sm font-medium transition-colors ${scrolled ? 'hidden lg:block' : ''} text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black dark:focus-visible:ring-white rounded-md`}>
            Get a Quote
          </NavLink>
          <button
            onClick={() => triggerBookingModal()}
            className="px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black text-sm font-bold rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 shadow-md flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black dark:focus-visible:ring-white"
          >
            <Calendar size={14} />
            Book a Call
          </button>
        </div>

        {/* Mobile Toggle & Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 transition-colors"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            className="p-2 text-gray-900 dark:text-white z-50 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white rounded-lg"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Full Screen Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl z-40 flex flex-col pt-32 px-6 h-screen md:hidden"
            aria-hidden={!isOpen}
          >
            <nav className="flex flex-col gap-6">
              {NAV_LINKS.map((link, i) => (
                <motion.div key={link.path} custom={i} variants={linkVariants}>
                  <NavLink
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) => `text-3xl font-bold tracking-tight ${isActive ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}
                  >
                    {link.name}
                  </NavLink>
                </motion.div>
              ))}
              
              <motion.div 
                variants={linkVariants} 
                custom={NAV_LINKS.length}
                className="h-px w-full bg-gray-100 dark:bg-gray-800 my-4"
              />

              <motion.div variants={linkVariants} custom={NAV_LINKS.length + 1} className="flex flex-col gap-4">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    triggerBookingModal();
                  }}
                  className="w-full text-center py-4 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-bold text-lg shadow-xl flex items-center justify-center gap-2"
                >
                  <Calendar size={20} />
                  Book a Call
                </button>
                <NavLink onClick={() => setIsOpen(false)} to="/contact" className="w-full text-center py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-lg">
                  Get a Quote
                </NavLink>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pt-20 pb-28 md:pb-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              <span className="font-sansation"><span className="text-red-600">AX</span>RATEGY</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">
              Simple tools that help small businesses grow.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
              Trusted by businesses across North America
            </p>
            <div className="text-sm text-gray-400 dark:text-gray-600">
              <p>Toronto, Canada</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Services</h4>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><NavLink to="/services/websites-landing-pages" className="hover:text-black dark:hover:text-white">Websites</NavLink></li>
              <li><NavLink to="/services/ai-assistants" className="hover:text-black dark:hover:text-white">AI Assistants</NavLink></li>
              <li><NavLink to="/services/automation-systems" className="hover:text-black dark:hover:text-white">Automation</NavLink></li>
              <li><NavLink to="/services/crm-setup" className="hover:text-black dark:hover:text-white">CRM Setup</NavLink></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><NavLink to="/work" className="hover:text-black dark:hover:text-white">Case Studies</NavLink></li>
              <li><NavLink to="/about" className="hover:text-black dark:hover:text-white">About</NavLink></li>
              <li><NavLink to="/pricing" className="hover:text-black dark:hover:text-white">Pricing</NavLink></li>
              <li><NavLink to="/contact" className="hover:text-black dark:hover:text-white">Contact</NavLink></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><NavLink to="/insights" className="hover:text-black dark:hover:text-white">Blog</NavLink></li>
              <li><NavLink to="/resources" className="hover:text-black dark:hover:text-white">Downloads</NavLink></li>
              <li><NavLink to="/terms" className="hover:text-black dark:hover:text-white">Terms of Service</NavLink></li>
              <li><NavLink to="/privacy" className="hover:text-black dark:hover:text-white">Privacy Policy</NavLink></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400 dark:text-gray-500">© 2026 <span className="font-sansation"><span className="text-red-600">AX</span>RATEGY</span> Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="https://linkedin.com/company/axrategy" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors">LinkedIn</a>
            <a href="https://twitter.com/axrategy" target="_blank" rel="noopener noreferrer" aria-label="Twitter/X" className="text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors">Twitter/X</a>
            <a href="https://instagram.com/axrategy" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const triggerBookingModal = useTriggerBookingModal();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-300">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      {/* Mobile Floating CTA - High Z-index */}
      <div className="fixed bottom-6 right-6 md:hidden z-[90]">
        <button
          onClick={() => triggerBookingModal()}
          className="bg-black dark:bg-white text-white dark:text-black rounded-full px-6 py-4 shadow-2xl shadow-black/20 font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform border border-white/10"
        >
          <Calendar size={18} />
          Book a Call
        </button>
      </div>
    </div>
  );
};
