import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MapPin, Calendar, X } from 'lucide-react';

interface Notification {
  id: string;
  type: 'booking' | 'viewing' | 'signup';
  city: string;
  action: string;
  timeAgo: string;
}

// Sample cities for realistic notifications
const CITIES = [
  'Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa',
  'New York', 'Los Angeles', 'Chicago', 'Boston', 'Seattle',
  'London', 'Sydney', 'Dubai', 'Singapore', 'Tokyo',
];

const ACTIONS = {
  booking: [
    'just booked a strategy call',
    'scheduled a consultation',
    'booked a discovery session',
  ],
  viewing: [
    'is viewing this page',
    'is exploring our services',
    'is checking out pricing',
  ],
  signup: [
    'just subscribed to our newsletter',
    'downloaded our AI guide',
    'joined our community',
  ],
};

const generateNotification = (): Notification => {
  const types = ['booking', 'viewing', 'signup'] as const;
  const type = types[Math.floor(Math.random() * types.length)];
  const city = CITIES[Math.floor(Math.random() * CITIES.length)];
  const actions = ACTIONS[type];
  const action = actions[Math.floor(Math.random() * actions.length)];
  const timeAgo = type === 'viewing' ? 'now' : `${Math.floor(Math.random() * 30) + 1}m ago`;

  return {
    id: Math.random().toString(36).substring(7),
    type,
    city,
    action,
    timeAgo,
  };
};

export const SocialProofNotification: React.FC = () => {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed notifications this session
    if (sessionStorage.getItem('social_proof_dismissed')) {
      setIsDismissed(true);
      return;
    }

    // Show first notification after 15 seconds
    const initialTimer = setTimeout(() => {
      showNotification();
    }, 15000);

    return () => clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    if (isDismissed) return;

    // Show new notifications every 45-90 seconds
    const interval = setInterval(() => {
      const delay = Math.random() * 45000 + 45000; // 45-90 seconds
      setTimeout(() => {
        if (!isDismissed) {
          showNotification();
        }
      }, delay);
    }, 60000);

    return () => clearInterval(interval);
  }, [isDismissed]);

  const showNotification = () => {
    const newNotification = generateNotification();
    setNotification(newNotification);
    setIsVisible(true);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 5000);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('social_proof_dismissed', 'true');
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-4 h-4 text-emerald-500" />;
      case 'viewing':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'signup':
        return <MapPin className="w-4 h-4 text-purple-500" />;
    }
  };

  const getIconBg = (type: Notification['type']) => {
    switch (type) {
      case 'booking':
        return 'bg-emerald-100 dark:bg-emerald-900/30';
      case 'viewing':
        return 'bg-blue-100 dark:bg-blue-900/30';
      case 'signup':
        return 'bg-purple-100 dark:bg-purple-900/30';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && notification && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-24 left-6 z-40 max-w-[320px] bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-4"
        >
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-3 h-3" />
          </button>

          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full ${getIconBg(notification.type)} flex items-center justify-center`}>
              {getIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-white">
                <span className="font-medium">Someone from {notification.city}</span>
                <br />
                <span className="text-gray-600 dark:text-gray-400">{notification.action}</span>
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {notification.timeAgo}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Live visitor count component
export const LiveViewerCount: React.FC<{ page?: string }> = ({ page }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simulate live viewer count (in production, this would come from analytics)
    const baseCount = Math.floor(Math.random() * 5) + 2; // 2-6 viewers
    setCount(baseCount);
    setIsVisible(true);

    // Fluctuate count slightly every 30 seconds
    const interval = setInterval(() => {
      setCount(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newCount = prev + change;
        return Math.max(1, Math.min(10, newCount)); // Keep between 1-10
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [page]);

  if (!isVisible || count === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-600 dark:text-gray-400"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span>{count} {count === 1 ? 'person' : 'people'} viewing this page</span>
    </motion.div>
  );
};
