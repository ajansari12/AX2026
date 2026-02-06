import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface DemoMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface DemoContext {
  businessName: string;
  industry: string;
  primaryService: string;
}

const getVisitorId = (): string => {
  const key = 'axrategy_visitor_id';
  let visitorId = localStorage.getItem(key);
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem(key, visitorId);
  }
  return visitorId;
};

export function useDemoChat(context: DemoContext | null) {
  const [messages, setMessages] = useState<DemoMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const messageCount = messages.filter((m) => m.role === 'user').length;

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !context) return;

      const userMessage: DemoMessage = { role: 'user', content: content.trim() };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const visitorId = getVisitorId();
        const allMessages = [...messages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            messages: allMessages,
            conversationId,
            visitorId,
            demoContext: {
              businessName: context.businessName,
              industry: context.industry,
              primaryService: context.primaryService,
              demoMode: true,
            },
          }),
        });

        if (!response.ok) throw new Error('Failed to send message');

        const data = await response.json();

        if (data.conversationId && data.conversationId !== conversationId) {
          setConversationId(data.conversationId);
        }

        setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);

        supabase.from('product_events').insert({
          event_type: 'demo_message_sent',
          product_slug: 'ai-chat-widget',
          visitor_id: visitorId,
          metadata: { messageCount: messageCount + 1 },
        });
      } catch (err) {
        setError('Failed to get a response. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [messages, conversationId, context, messageCount]
  );

  const reset = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setError(null);
  }, []);

  return { messages, messageCount, isLoading, error, sendMessage, reset };
}
