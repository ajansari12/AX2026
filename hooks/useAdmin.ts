import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Lead {
  id: string;
  name: string;
  email: string;
  service_interest: string | null;
  message: string | null;
  source: string;
  status: string;
  created_at: string;
}

interface TeardownRequest {
  id: string;
  email: string;
  website_url: string;
  status: string;
  created_at: string;
}

interface ResourceDownload {
  id: string;
  email: string;
  resource_name: string;
  downloaded_at: string;
}

interface Subscriber {
  id: string;
  email: string;
  source: string;
  subscribed_at: string;
  is_active: boolean;
}

interface DashboardStats {
  totalLeads: number;
  newLeadsThisWeek: number;
  totalSubscribers: number;
  totalDownloads: number;
  totalTeardowns: number;
  totalConversations: number;
}

interface ChatConversation {
  id: string;
  visitor_id: string;
  email: string | null;
  created_at: string;
  updated_at: string;
  message_count?: number;
}

interface ChatMessageItem {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface Booking {
  id: string;
  cal_booking_id: string | null;
  name: string;
  email: string;
  scheduled_time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  notes: string | null;
  lead_id: string | null;
  created_at: string;
}

export function useAdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLeads(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateLeadStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      await fetchLeads();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return { leads, isLoading, error, refetch: fetchLeads, updateLeadStatus };
}

export function useAdminTeardowns() {
  const [teardowns, setTeardowns] = useState<TeardownRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeardowns = async () => {
      setIsLoading(true);
      try {
        const { data } = await supabase
          .from('teardown_requests')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        setTeardowns(data || []);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeardowns();
  }, []);

  return { teardowns, isLoading };
}

export function useAdminDownloads() {
  const [downloads, setDownloads] = useState<ResourceDownload[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDownloads = async () => {
      setIsLoading(true);
      try {
        const { data } = await supabase
          .from('resource_downloads')
          .select('*')
          .order('downloaded_at', { ascending: false })
          .limit(50);

        setDownloads(data || []);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDownloads();
  }, []);

  return { downloads, isLoading };
}

export function useAdminSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribers = async () => {
      setIsLoading(true);
      try {
        const { data } = await supabase
          .from('newsletter_subscribers')
          .select('*')
          .order('subscribed_at', { ascending: false })
          .limit(100);

        setSubscribers(data || []);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubscribers();
  }, []);

  return { subscribers, isLoading };
}

export function useAdminStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const [leadsRes, newLeadsRes, subscribersRes, downloadsRes, teardownsRes, conversationsRes] = await Promise.all([
          supabase.from('leads').select('id', { count: 'exact', head: true }),
          supabase.from('leads').select('id', { count: 'exact', head: true }).gte('created_at', oneWeekAgo.toISOString()),
          supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true }),
          supabase.from('resource_downloads').select('id', { count: 'exact', head: true }),
          supabase.from('teardown_requests').select('id', { count: 'exact', head: true }),
          supabase.from('chat_conversations').select('id', { count: 'exact', head: true }),
        ]);

        setStats({
          totalLeads: leadsRes.count || 0,
          newLeadsThisWeek: newLeadsRes.count || 0,
          totalSubscribers: subscribersRes.count || 0,
          totalDownloads: downloadsRes.count || 0,
          totalTeardowns: teardownsRes.count || 0,
          totalConversations: conversationsRes.count || 0,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return { stats, isLoading };
}

export function useAdminConversations() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      const { data: convData } = await supabase
        .from('chat_conversations')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(100);

      if (convData) {
        const conversationsWithCount = await Promise.all(
          convData.map(async (conv) => {
            const { count } = await supabase
              .from('chat_messages')
              .select('id', { count: 'exact', head: true })
              .eq('conversation_id', conv.id);
            return { ...conv, message_count: count || 0 };
          })
        );
        setConversations(conversationsWithCount);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return { conversations, isLoading, refetch: fetchConversations };
}

export function useConversationMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const { data } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });

        setMessages(data || []);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, [conversationId]);

  return { messages, isLoading };
}

export function useAdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .order('scheduled_time', { ascending: false })
        .limit(100);

      setBookings(data || []);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      await fetchBookings();
      return { success: true };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return { bookings, isLoading, refetch: fetchBookings, updateBookingStatus };
}
