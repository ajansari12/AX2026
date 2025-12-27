import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, X, Send, RotateCcw, Calendar, ArrowRight, User, Bot,
  Phone, ThumbsUp, ThumbsDown, Paperclip,
} from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { ChatMessage } from './ChatMessage';
import { supabase } from '../lib/supabase';

const TypingIndicator: React.FC = () => (
  <div className="flex items-center gap-1">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
        animate={{ y: [0, -4, 0] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: i * 0.15,
          ease: 'easeInOut',
        }}
      />
    ))}
  </div>
);

// Page-specific proactive greetings
const PAGE_GREETINGS: Record<string, string> = {
  '/': "Hi! I can help you discover how AI can transform your business. What would you like to know?",
  '/services': "Interested in our services? I can explain what each one includes and help you find the best fit.",
  '/pricing': "Questions about pricing? I can help you understand our packages and what's included.",
  '/work': "Looking at our case studies? I can share more details about any project or discuss similar solutions for you.",
  '/contact': "Ready to get started? I can answer any last questions before you book a call.",
  '/about': "Want to learn more about us? I can share our story, approach, and what makes us different.",
};

const QUICK_ACTIONS = [
  { label: 'What services do you offer?', icon: ArrowRight },
  { label: 'How much does it cost?', icon: ArrowRight },
  { label: 'How long does a project take?', icon: ArrowRight },
];

// Callback request form component
const CallbackRequestForm: React.FC<{
  onSubmit: (data: { name: string; phone: string; preferredTime: string }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}> = ({ onSubmit, onCancel, isSubmitting }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredTime, setPreferredTime] = useState('asap');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, phone, preferredTime });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3"
      onSubmit={handleSubmit}
    >
      <p className="text-sm font-medium text-gray-900 dark:text-white">Request a Callback</p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        required
        disabled={isSubmitting}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 disabled:opacity-50"
      />
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone number"
        required
        disabled={isSubmitting}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 disabled:opacity-50"
      />
      <select
        value={preferredTime}
        onChange={(e) => setPreferredTime(e.target.value)}
        disabled={isSubmitting}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white disabled:opacity-50"
      >
        <option value="asap">As soon as possible</option>
        <option value="morning">Morning (9am - 12pm)</option>
        <option value="afternoon">Afternoon (12pm - 5pm)</option>
        <option value="evening">Evening (5pm - 8pm)</option>
      </select>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-3 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Request Call'}
        </button>
      </div>
    </motion.form>
  );
};

// Email capture form component
const EmailCaptureForm: React.FC<{
  onSubmit: (email: string) => void;
  onSkip: () => void;
  isSubmitting: boolean;
}> = ({ onSubmit, onSkip, isSubmitting }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-100 dark:to-gray-200 rounded-xl p-4 space-y-3"
    >
      <p className="text-sm font-medium text-white dark:text-gray-900">
        Want a copy of this conversation?
      </p>
      <p className="text-xs text-gray-300 dark:text-gray-600">
        Enter your email and we'll send you a transcript.
      </p>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={isSubmitting}
          className="w-full px-3 py-2 rounded-lg bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-900/20 text-sm text-white dark:text-gray-900 placeholder-gray-400 disabled:opacity-50"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onSkip}
            disabled={isSubmitting}
            className="flex-1 px-3 py-2 rounded-lg border border-white/20 dark:border-gray-900/20 text-sm text-white/80 dark:text-gray-700 hover:bg-white/10 dark:hover:bg-gray-900/10 disabled:opacity-50"
          >
            Skip
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
          >
            {isSubmitting ? 'Sending...' : 'Send Transcript'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

// Chat rating component
const ChatRating: React.FC<{
  onRate: (rating: 'positive' | 'negative', feedback?: string) => void;
}> = ({ onRate }) => {
  const [rated, setRated] = useState<'positive' | 'negative' | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleRate = (rating: 'positive' | 'negative') => {
    setRated(rating);
    if (rating === 'negative') {
      setShowFeedback(true);
    } else {
      onRate(rating);
    }
  };

  const handleFeedbackSubmit = () => {
    onRate('negative', feedback);
    setShowFeedback(false);
  };

  if (rated === 'positive') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400"
      >
        <ThumbsUp className="w-4 h-4" />
        <span>Thanks for your feedback!</span>
      </motion.div>
    );
  }

  if (rated === 'negative' && !showFeedback) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
      >
        <ThumbsDown className="w-4 h-4" />
        <span>Thanks for your feedback!</span>
      </motion.div>
    );
  }

  if (showFeedback) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="What could we improve?"
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 resize-none"
          rows={2}
        />
        <button
          onClick={handleFeedbackSubmit}
          className="px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium"
        >
          Submit
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-3"
    >
      <span className="text-xs text-gray-500 dark:text-gray-400">Was this helpful?</span>
      <div className="flex gap-1">
        <button
          onClick={() => handleRate('positive')}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-emerald-500 transition-colors"
        >
          <ThumbsUp className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleRate('negative')}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-red-500 transition-colors"
        >
          <ThumbsDown className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// Proactive greeting bubble
const ProactiveGreeting: React.FC<{
  message: string;
  onDismiss: () => void;
  onClick: () => void;
}> = ({ message, onDismiss, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 10, scale: 0.9 }}
    className="fixed bottom-24 right-6 z-40 max-w-[300px] bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-4 cursor-pointer"
    onClick={onClick}
  >
    <button
      onClick={(e) => {
        e.stopPropagation();
        onDismiss();
      }}
      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
    >
      <X className="w-3 h-3" />
    </button>
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 flex items-center justify-center">
        <Bot className="w-4 h-4 text-white dark:text-gray-900" />
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>
    </div>
  </motion.div>
);

export const ChatWidget: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showProactiveGreeting, setShowProactiveGreeting] = useState(false);
  const [proactiveGreetingDismissed, setProactiveGreetingDismissed] = useState(false);
  const [isSubmittingCallback, setIsSubmittingCallback] = useState(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [callbackSuccess, setCallbackSuccess] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const { messages, sendMessage, isLoading, error, clearChat, conversationId } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get page-specific greeting
  const currentPath = location.pathname.replace(/\/$/, '') || '/';
  const pageGreeting = PAGE_GREETINGS[currentPath] || PAGE_GREETINGS['/'];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Show proactive greeting after 10 seconds on page
  useEffect(() => {
    if (isOpen || proactiveGreetingDismissed || messages.length > 0) return;

    const timer = setTimeout(() => {
      setShowProactiveGreeting(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, [isOpen, proactiveGreetingDismissed, messages.length, location.pathname]);

  // Hide proactive greeting when location changes
  useEffect(() => {
    setShowProactiveGreeting(false);
  }, [location.pathname]);

  // Show rating after conversation ends (5+ messages and no activity for 30s)
  useEffect(() => {
    if (messages.length < 5 || isLoading) return;

    const timer = setTimeout(() => {
      setShowRating(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, [messages.length, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    const message = inputValue;
    setInputValue('');
    setShowRating(false);
    await sendMessage(message);
  };

  const handleQuickAction = async (action: string) => {
    await sendMessage(action);
  };

  const handleBookCall = () => {
    window.open('/#/contact', '_self');
    setIsOpen(false);
  };

  const handleCallbackRequest = async (data: { name: string; phone: string; preferredTime: string }) => {
    setIsSubmittingCallback(true);
    try {
      // Save callback request to database
      await supabase.from('leads').insert({
        name: data.name,
        email: '', // Will be captured separately if needed
        phone: data.phone,
        source: 'chat_callback',
        message: `Callback requested - Preferred time: ${data.preferredTime}`,
        status: 'new',
      });
      setCallbackSuccess(true);
      setShowCallbackForm(false);
      setTimeout(() => setCallbackSuccess(false), 5000);
    } catch (err) {
      console.error('Failed to submit callback request:', err);
    } finally {
      setIsSubmittingCallback(false);
    }
  };

  const handleEmailCapture = async (email: string) => {
    setIsSubmittingEmail(true);
    try {
      // Update conversation with email
      if (conversationId) {
        await supabase
          .from('chat_conversations')
          .update({ email })
          .eq('id', conversationId);
      }
      setShowEmailCapture(false);
    } catch (err) {
      console.error('Failed to save email:', err);
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  const handleRating = async (rating: 'positive' | 'negative', feedback?: string) => {
    try {
      // Save rating to database
      if (conversationId) {
        await supabase.from('chat_ratings').insert({
          conversation_id: conversationId,
          rating,
          feedback: feedback || null,
        });
      }
    } catch (err) {
      console.error('Failed to save rating:', err);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setAttachments(prev => [...prev, ...Array.from(files)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleProactiveClick = () => {
    setShowProactiveGreeting(false);
    setIsOpen(true);
  };

  const handleClearChat = () => {
    clearChat();
    setShowRating(false);
    setShowEmailCapture(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Show email capture if there are messages and we haven't captured email
    if (messages.length > 2) {
      setTimeout(() => setShowEmailCapture(true), 500);
    }
  };

  return (
    <>
      {/* Proactive greeting bubble */}
      <AnimatePresence>
        {showProactiveGreeting && !isOpen && (
          <ProactiveGreeting
            message={pageGreeting}
            onDismiss={() => {
              setShowProactiveGreeting(false);
              setProactiveGreetingDismissed(true);
            }}
            onClick={handleProactiveClick}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col"
            style={{ height: 'min(600px, calc(100vh - 140px))' }}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white dark:text-gray-900" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Axrategy Assistant</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Powered by Claude</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={handleClearChat}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    title="New conversation"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 flex items-center justify-center mt-1">
                      <Bot className="w-4 h-4 text-white dark:text-gray-900" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-md p-4 max-w-[80%]">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {pageGreeting}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {QUICK_ACTIONS.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(action.label)}
                        className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-300 flex items-center justify-between group"
                      >
                        <span>{action.label}</span>
                        <action.icon className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 flex items-center justify-center mt-1">
                          <Bot className="w-4 h-4 text-white dark:text-gray-900" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-br-md'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-bl-md'
                        }`}
                      >
                        <ChatMessage content={message.content} isUser={message.role === 'user'} />
                      </div>
                      {message.role === 'user' && (
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center mt-1">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {/* Show rating after conversation */}
                  {showRating && !isLoading && (
                    <div className="pt-2">
                      <ChatRating onRate={handleRating} />
                    </div>
                  )}
                </>
              )}

              {/* Callback request form */}
              {showCallbackForm && (
                <CallbackRequestForm
                  onSubmit={handleCallbackRequest}
                  onCancel={() => setShowCallbackForm(false)}
                  isSubmitting={isSubmittingCallback}
                />
              )}

              {/* Callback success message */}
              {callbackSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 text-sm text-emerald-700 dark:text-emerald-400"
                >
                  Thanks! We'll call you back soon.
                </motion.div>
              )}

              {/* Email capture form */}
              {showEmailCapture && !isOpen && (
                <EmailCaptureForm
                  onSubmit={handleEmailCapture}
                  onSkip={() => setShowEmailCapture(false)}
                  isSubmitting={isSubmittingEmail}
                />
              )}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2 justify-start"
                >
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 flex items-center justify-center mt-1">
                    <Bot className="w-4 h-4 text-white dark:text-gray-900" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-md px-4 py-3">
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-600 dark:text-red-400"
                >
                  {error}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              {/* Attachments preview */}
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-300"
                    >
                      <Paperclip className="w-3 h-3" />
                      <span className="truncate max-w-[100px]">{file.name}</span>
                      <button
                        onClick={() => removeAttachment(index)}
                        className="ml-1 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Attach file"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20 text-sm disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="px-4 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Action buttons */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setShowCallbackForm(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-300"
                >
                  <Phone className="w-4 h-4" />
                  <span>Request Callback</span>
                </button>
                <button
                  onClick={handleBookCall}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Call</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowProactiveGreeting(false);
        }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg hover:shadow-xl flex items-center justify-center transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
};
