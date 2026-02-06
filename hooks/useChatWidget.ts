import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useChat } from './useChat';
import { supabase } from '../lib/supabase';
import { PAGE_GREETINGS } from '../components/chat/constants';

export function useChatWidget() {
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

  useEffect(() => {
    if (isOpen || proactiveGreetingDismissed || messages.length > 0) return;

    const timer = setTimeout(() => {
      setShowProactiveGreeting(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, [isOpen, proactiveGreetingDismissed, messages.length, location.pathname]);

  useEffect(() => {
    setShowProactiveGreeting(false);
  }, [location.pathname]);

  useEffect(() => {
    if (messages.length < 5 || isLoading) return;

    const timer = setTimeout(() => {
      setShowRating(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, [messages.length, isLoading]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    const message = inputValue;
    setInputValue('');
    setShowRating(false);
    await sendMessage(message);
  }, [inputValue, isLoading, sendMessage]);

  const handleQuickAction = useCallback(async (action: string) => {
    await sendMessage(action);
  }, [sendMessage]);

  const handleBookCall = useCallback(() => {
    window.open('/#/contact', '_self');
    setIsOpen(false);
  }, []);

  const handleCallbackRequest = useCallback(async (data: { name: string; phone: string; preferredTime: string }) => {
    setIsSubmittingCallback(true);
    try {
      await supabase.from('leads').insert({
        name: data.name,
        email: '',
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
  }, []);

  const handleEmailCapture = useCallback(async (email: string) => {
    setIsSubmittingEmail(true);
    try {
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
  }, [conversationId]);

  const handleRating = useCallback(async (rating: 'positive' | 'negative', feedback?: string) => {
    try {
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
  }, [conversationId]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setAttachments(prev => [...prev, ...Array.from(files)]);
    }
  }, []);

  const removeAttachment = useCallback((index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleProactiveClick = useCallback(() => {
    setShowProactiveGreeting(false);
    setIsOpen(true);
  }, []);

  const handleClearChat = useCallback(() => {
    clearChat();
    setShowRating(false);
    setShowEmailCapture(false);
  }, [clearChat]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (messages.length > 2) {
      setTimeout(() => setShowEmailCapture(true), 500);
    }
  }, [messages.length]);

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
    setShowProactiveGreeting(false);
  }, []);

  const handleDismissGreeting = useCallback(() => {
    setShowProactiveGreeting(false);
    setProactiveGreetingDismissed(true);
  }, []);

  return {
    isOpen,
    inputValue,
    setInputValue,
    showCallbackForm,
    setShowCallbackForm,
    showEmailCapture,
    showRating,
    showProactiveGreeting,
    isSubmittingCallback,
    isSubmittingEmail,
    callbackSuccess,
    attachments,
    messages,
    isLoading,
    error,
    pageGreeting,
    messagesEndRef,
    inputRef,
    fileInputRef,
    handleSubmit,
    handleQuickAction,
    handleBookCall,
    handleCallbackRequest,
    handleEmailCapture,
    handleRating,
    handleFileSelect,
    removeAttachment,
    handleProactiveClick,
    handleClearChat,
    handleClose,
    handleToggle,
    handleDismissGreeting,
  };
}
