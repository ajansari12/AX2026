import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Send,
  Loader2,
  User,
  Clock,
  CheckCheck,
  FolderOpen,
  X,
  Plus,
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { useClientAuth } from '../hooks/useClientAuth';
import { useClientMessages, useClientProjects, ClientMessage } from '../hooks/useClientPortal';

export const PortalMessages: React.FC = () => {
  const { client } = useClientAuth();
  const { messages, isLoading, sendMessage, markAsRead, unreadCount } = useClientMessages();
  const { projects } = useClientProjects();
  const [showCompose, setShowCompose] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ClientMessage | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [newMessage]);

  // Mark message as read when selected
  useEffect(() => {
    if (selectedMessage && !selectedMessage.is_read && selectedMessage.sender_type === 'admin') {
      markAsRead(selectedMessage.id);
    }
  }, [selectedMessage, markAsRead]);

  // Handle send message
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    const result = await sendMessage(
      newMessage.trim(),
      newSubject.trim() || undefined,
      selectedProjectId || undefined
    );

    if (result.success) {
      setNewMessage('');
      setNewSubject('');
      setSelectedProjectId('');
      setShowCompose(false);
    }
    setIsSending(false);
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Group messages by date
  const groupMessagesByDate = (msgs: ClientMessage[]) => {
    const groups: { [key: string]: ClientMessage[] } = {};

    msgs.forEach((msg) => {
      const date = new Date(msg.created_at);
      const dateKey = date.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(msg);
    });

    return Object.entries(groups).map(([date, msgs]) => ({
      date,
      messages: msgs,
    }));
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <>
      <SEO
        title="Messages | Client Portal"
        description="Communicate with our team directly through your portal."
      />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'Communicate with our team'}
            </p>
          </div>

          <button
            onClick={() => setShowCompose(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            <Plus size={18} />
            <span>New Message</span>
          </button>
        </div>

        {/* Compose modal */}
        <AnimatePresence>
          {showCompose && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setShowCompose(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-white dark:bg-gray-900 rounded-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    New Message
                  </h2>
                  <button
                    onClick={() => setShowCompose(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      placeholder="What's this about?"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-all"
                    />
                  </div>

                  {/* Project (optional) */}
                  {projects.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Related Project (optional)
                      </label>
                      <select
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-all"
                      >
                        <option value="">No project selected</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      ref={textareaRef}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
                  <button
                    onClick={() => setShowCompose(false)}
                    className="px-4 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={isSending || !newMessage.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSending ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Send</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Messages list */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
                    <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center"
          >
            <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No messages yet
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Start a conversation with our team.
            </p>
            <button
              onClick={() => setShowCompose(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              <Plus size={18} />
              <span>Send a Message</span>
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {groupedMessages.map((group) => (
              <div key={group.date}>
                {/* Date header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
                  <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    {formatDateHeader(group.date)}
                  </span>
                  <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
                </div>

                {/* Messages in group */}
                <div className="space-y-3">
                  {group.messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => setSelectedMessage(message)}
                      className={`bg-white dark:bg-gray-900 rounded-2xl border cursor-pointer transition-all ${
                        !message.is_read && message.sender_type === 'admin'
                          ? 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10'
                          : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                      }`}
                    >
                      <div className="p-4 md:p-6">
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.sender_type === 'admin'
                              ? 'bg-gray-900 dark:bg-white'
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}>
                            {message.sender_type === 'admin' ? (
                              <span className="text-sm font-bold text-white dark:text-gray-900">A</span>
                            ) : (
                              <User size={18} className="text-gray-600 dark:text-gray-300" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {message.sender_type === 'admin' ? 'Axrategy Team' : message.sender_name || 'You'}
                                  </span>
                                  {!message.is_read && message.sender_type === 'admin' && (
                                    <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-medium rounded-full">
                                      New
                                    </span>
                                  )}
                                </div>
                                {message.subject && (
                                  <p className="font-medium text-gray-700 dark:text-gray-300 mt-1">
                                    {message.subject}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                                <Clock size={12} />
                                <span>{formatRelativeTime(message.created_at)}</span>
                              </div>
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                              {message.content}
                            </p>

                            {/* Meta info */}
                            <div className="flex items-center gap-4 mt-3">
                              {message.project && (
                                <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                  <FolderOpen size={12} />
                                  <span>{message.project.name}</span>
                                </span>
                              )}
                              {message.sender_type === 'client' && message.is_read && (
                                <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                                  <CheckCheck size={12} />
                                  <span>Read</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Message detail modal */}
        <AnimatePresence>
          {selectedMessage && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setSelectedMessage(null)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-white dark:bg-gray-900 rounded-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      selectedMessage.sender_type === 'admin'
                        ? 'bg-gray-900 dark:bg-white'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}>
                      {selectedMessage.sender_type === 'admin' ? (
                        <span className="text-sm font-bold text-white dark:text-gray-900">A</span>
                      ) : (
                        <User size={18} className="text-gray-600 dark:text-gray-300" />
                      )}
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900 dark:text-white">
                        {selectedMessage.sender_type === 'admin' ? 'Axrategy Team' : selectedMessage.sender_name || 'You'}
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(selectedMessage.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {selectedMessage.subject && (
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      {selectedMessage.subject}
                    </h3>
                  )}
                  {selectedMessage.project && (
                    <div className="flex items-center gap-2 mb-4 text-sm text-gray-500 dark:text-gray-400">
                      <FolderOpen size={14} />
                      <span>Project: {selectedMessage.project.name}</span>
                    </div>
                  )}
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                      {selectedMessage.content}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={() => {
                      setSelectedMessage(null);
                      setShowCompose(true);
                      if (selectedMessage.subject) {
                        setNewSubject(`Re: ${selectedMessage.subject}`);
                      }
                      if (selectedMessage.project_id) {
                        setSelectedProjectId(selectedMessage.project_id);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                  >
                    <Send size={18} />
                    <span>Reply</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

// Helper to format date headers
function formatDateHeader(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }

  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
