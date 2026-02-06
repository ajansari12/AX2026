import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, Calendar, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTriggerBookingModal } from '../../hooks/useGlobalBookingModal';
import { CommandPalette } from '../CommandPalette';
import { NAV_LINKS, INDUSTRY_LINKS } from './constants';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);
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

          <div
            className="relative"
            onMouseEnter={() => setIndustriesOpen(true)}
            onMouseLeave={() => setIndustriesOpen(false)}
          >
            <button
              className="text-sm font-medium transition-colors hover:text-black dark:hover:text-white text-gray-500 dark:text-gray-400 flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black dark:focus-visible:ring-white rounded-md"
              onClick={() => setIndustriesOpen(!industriesOpen)}
              aria-expanded={industriesOpen}
              aria-haspopup="true"
            >
              Industries
              <ChevronDown size={14} className={`transition-transform ${industriesOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {industriesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
                >
                  <div className="p-2">
                    {INDUSTRY_LINKS.map((industry) => (
                      <NavLink
                        key={industry.path}
                        to={industry.path}
                        onClick={() => setIndustriesOpen(false)}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                          <industry.icon size={18} className="text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{industry.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{industry.description}</div>
                        </div>
                      </NavLink>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <CommandPalette />
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
            <nav className="flex flex-col gap-6 overflow-y-auto">
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
                className="pt-2"
              >
                <div className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4 font-semibold">Industries</div>
                <div className="flex flex-col gap-3">
                  {INDUSTRY_LINKS.map((industry) => (
                    <NavLink
                      key={industry.path}
                      to={industry.path}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 text-lg font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                    >
                      <industry.icon size={20} />
                      {industry.name}
                    </NavLink>
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={linkVariants}
                custom={NAV_LINKS.length + 1}
                className="h-px w-full bg-gray-100 dark:bg-gray-800 my-4"
              />

              <motion.div variants={linkVariants} custom={NAV_LINKS.length + 2} className="flex flex-col gap-4">
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
