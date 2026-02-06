import React from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { useTriggerBookingModal } from '../hooks/useGlobalBookingModal';
import { Breadcrumbs } from './Breadcrumbs';
import { Header } from './layout/Header';
import { Footer } from './layout/Footer';

export { Header } from './layout/Header';
export { Footer } from './layout/Footer';

const LayoutBreadcrumbs: React.FC = () => {
  const { pathname } = useLocation();
  if (pathname === '/') return null;
  return (
    <div className="max-w-7xl mx-auto px-6 pt-24 pb-0">
      <Breadcrumbs />
    </div>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const triggerBookingModal = useTriggerBookingModal();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-300">
      <Header />
      <LayoutBreadcrumbs />
      <main className="flex-grow">{children}</main>
      <Footer />
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
