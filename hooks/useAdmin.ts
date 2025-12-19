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

        const [leadsRes, newLeadsRes, subscribersRes, downloadsRes, teardownsRes] = await Promise.all([
          supabase.from('leads').select('id', { count: 'exact', head: true }),
          supabase.from('leads').select('id', { count: 'exact', head: true }).gte('created_at', oneWeekAgo.toISOString()),
          supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true }),
          supabase.from('resource_downloads').select('id', { count: 'exact', head: true }),
          supabase.from('teardown_requests').select('id', { count: 'exact', head: true }),
        ]);

        setStats({
          totalLeads: leadsRes.count || 0,
          newLeadsThisWeek: newLeadsRes.count || 0,
          totalSubscribers: subscribersRes.count || 0,
          totalDownloads: downloadsRes.count || 0,
          totalTeardowns: teardownsRes.count || 0,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return { stats, isLoading };
}
