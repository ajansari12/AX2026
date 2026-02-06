import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, X, Send, RotateCcw, Calendar, Bot, User, Phone, Paperclip,
} from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './chat/TypingIndicator';
import { CallbackRequestForm } from './chat/CallbackRequestForm';
import { EmailCaptureForm } from './chat/EmailCaptureForm';
import { ChatRatingWidget } from './chat/ChatRatingWidget';
import { ProactiveGreeting } from './chat/ProactiveGreeting';
import { QUICK_ACTIONS } from './chat/constants';
import { useChatWidget } from '../hooks/useChatWidget';

export const ChatWidget: React.FC = () => {
  const chat = useChatWidget();

  return (
    <>
      <AnimatePresence>
        {chat.showProactiveGreeting && !chat.isOpen && (
          <ProactiveGreeting
            message={chat.pageGreeting}
            onDismiss={chat.handleDismissGreeting}
            onClick={chat.handleProactiveClick}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {chat.isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col"
            style={{ height: 'min(600px, calc(100vh - 140px))' }}
          >
            <ChatHeader
              hasMessages={chat.messages.length > 0}
              onClear={chat.handleClearChat}
              onClose={chat.handleClose}
            />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chat.messages.length === 0 ? (
                <EmptyState
                  greeting={chat.pageGreeting}
                  onQuickAction={chat.handleQuickAction}
                />
              ) : (
                <>
                  {chat.messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'assistant' && <BotAvatar />}
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-br-md'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-bl-md'
                        }`}
                      >
                        <ChatMessage content={message.content} isUser={message.role === 'user'} />
                      </div>
                      {message.role === 'user' && <UserAvatar />}
                    </motion.div>
                  ))}

                  {chat.showRating && !chat.isLoading && (
                    <div className="pt-2">
                      <ChatRatingWidget onRate={chat.handleRating} />
                    </div>
                  )}
                </>
              )}

              {chat.showCallbackForm && (
                <CallbackRequestForm
                  onSubmit={chat.handleCallbackRequest}
                  onCancel={() => chat.setShowCallbackForm(false)}
                  isSubmitting={chat.isSubmittingCallback}
                />
              )}

              {chat.callbackSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 text-sm text-emerald-700 dark:text-emerald-400"
                >
                  Thanks! We'll call you back soon.
                </motion.div>
              )}

              {chat.showEmailCapture && !chat.isOpen && (
                <EmailCaptureForm
                  onSubmit={chat.handleEmailCapture}
                  onSkip={() => {}}
                  isSubmitting={chat.isSubmittingEmail}
                />
              )}

              {chat.isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2 justify-start"
                >
                  <BotAvatar />
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-md px-4 py-3">
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}

              {chat.error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-600 dark:text-red-400"
                >
                  {chat.error}
                </motion.div>
              )}

              <div ref={chat.messagesEndRef} />
            </div>

            <ChatInputArea
              inputValue={chat.inputValue}
              onInputChange={chat.setInputValue}
              onSubmit={chat.handleSubmit}
              isLoading={chat.isLoading}
              attachments={chat.attachments}
              onFileSelect={chat.handleFileSelect}
              onRemoveAttachment={chat.removeAttachment}
              fileInputRef={chat.fileInputRef}
              inputRef={chat.inputRef}
              onRequestCallback={() => chat.setShowCallbackForm(true)}
              onBookCall={chat.handleBookCall}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={chat.handleToggle}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg hover:shadow-xl flex items-center justify-center transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {chat.isOpen ? (
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

const BotAvatar: React.FC = () => (
  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 flex items-center justify-center mt-1">
    <Bot className="w-4 h-4 text-white dark:text-gray-900" />
  </div>
);

const UserAvatar: React.FC = () => (
  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center mt-1">
    <User className="w-4 h-4 text-white" />
  </div>
);

const ChatHeader: React.FC<{
  hasMessages: boolean;
  onClear: () => void;
  onClose: () => void;
}> = ({ hasMessages, onClear, onClose }) => (
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
      {hasMessages && (
        <button
          onClick={onClear}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title="New conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      )}
      <button
        onClick={onClose}
        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const EmptyState: React.FC<{
  greeting: string;
  onQuickAction: (action: string) => void;
}> = ({ greeting, onQuickAction }) => (
  <div className="space-y-4">
    <div className="flex gap-2">
      <BotAvatar />
      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-md p-4 max-w-[80%]">
        <p className="text-sm text-gray-700 dark:text-gray-300">{greeting}</p>
      </div>
    </div>
    <div className="space-y-2">
      {QUICK_ACTIONS.map((action, index) => (
        <button
          key={index}
          onClick={() => onQuickAction(action.label)}
          className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-300 flex items-center justify-between group"
        >
          <span>{action.label}</span>
          <action.icon className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
        </button>
      ))}
    </div>
  </div>
);

const ChatInputArea: React.FC<{
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  attachments: File[];
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAttachment: (index: number) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onRequestCallback: () => void;
  onBookCall: () => void;
}> = ({
  inputValue,
  onInputChange,
  onSubmit,
  isLoading,
  attachments,
  onFileSelect,
  onRemoveAttachment,
  fileInputRef,
  inputRef,
  onRequestCallback,
  onBookCall,
}) => (
  <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
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
              onClick={() => onRemoveAttachment(index)}
              className="ml-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    )}

    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileSelect}
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
        onChange={(e) => onInputChange(e.target.value)}
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

    <div className="flex gap-2 mt-3">
      <button
        onClick={onRequestCallback}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-300"
      >
        <Phone className="w-4 h-4" />
        <span>Request Callback</span>
      </button>
      <button
        onClick={onBookCall}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium"
      >
        <Calendar className="w-4 h-4" />
        <span>Book Call</span>
      </button>
    </div>
  </div>
);
