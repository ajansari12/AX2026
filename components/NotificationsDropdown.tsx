import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, MessageSquare, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ClientMessage } from '../hooks/useClientPortal';

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  unreadMessages: ClientMessage[];
  unreadCount: number;
  onMarkAsRead: (messageId: string) => void;
}

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  isOpen,
  onClose,
  unreadMessages,
  unreadCount,
  onMarkAsRead,
}) => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = (message: ClientMessage) => {
    onMarkAsRead(message.id);
    navigate('/portal/messages');
    onClose();
  };

  const handleMarkAllAsRead = () => {
    unreadMessages.forEach(msg => onMarkAsRead(msg.id));
  };

  const handleViewAll = () => {
    navigate('/portal/messages');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div ref={dropdownRef} className="relative">
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-2 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden z-50"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-gray-600 dark:text-gray-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1 transition-colors"
                  >
                    <Check size={14} />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {unreadMessages.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bell size={24} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No new notifications</p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">You're all caught up!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {unreadMessages.slice(0, 5).map((message) => (
                    <button
                      key={message.id}
                      onClick={() => handleNotificationClick(message)}
                      className="w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-9 h-9 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <MessageSquare size={16} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {message.sender_name || 'Axrategy Team'}
                            </span>
                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          </div>
                          {message.subject && (
                            <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                              {message.subject}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {message.content.substring(0, 60)}
                            {message.content.length > 60 ? '...' : ''}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {formatTime(message.created_at)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <button
                onClick={handleViewAll}
                className="w-full text-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                View all messages
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
