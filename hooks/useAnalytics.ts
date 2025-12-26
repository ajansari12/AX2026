import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface LeadsBySource {
  source: string;
  count: number;
}

interface LeadsByStatus {
  status: string;
  count: number;
}

interface LeadsOverTime {
  date: string;
  count: number;
}

interface WeeklyComparison {
  thisWeek: number;
  lastWeek: number;
  percentChange: number;
}

export interface AnalyticsData {
  leadsBySource: LeadsBySource[];
  leadsByStatus: LeadsByStatus[];
  leadsOverTime: LeadsOverTime[];
  conversionRate: number;
  totalLeads: number;
  weeklyComparison: WeeklyComparison;
  topSources: { source: string; count: number; percentage: number }[];
  recentActivity: {
    newLeads: number;
    newBookings: number;
    newSubscribers: number;
    newConversations: number;
  };
}

export function useAnalytics(days = 30) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const now = new Date();
      const daysAgo = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      const thisWeekStart = new Date(now);
      thisWeekStart.setDate(thisWeekStart.getDate() - 7);
      const lastWeekStart = new Date(thisWeekStart);
      lastWeekStart.setDate(lastWeekStart.getDate() - 7);

      // Fetch leads from the period
      const { data: leads, error: leadsError } = await supabase
        .from('leads')
        .select('id, source, status, created_at')
        .gte('created_at', daysAgo.toISOString())
        .order('created_at', { ascending: true });

      if (leadsError) throw leadsError;

      // Fetch recent activity counts (last 7 days)
      const weekAgo = thisWeekStart.toISOString();
      const [bookingsRes, subscribersRes, conversationsRes] = await Promise.all([
        supabase.from('bookings').select('id', { count: 'exact', head: true }).gte('created_at', weekAgo),
        supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true }).gte('subscribed_at', weekAgo),
        supabase.from('chat_conversations').select('id', { count: 'exact', head: true }).gte('created_at', weekAgo),
      ]);

      const leadsData = leads || [];
      const totalLeads = leadsData.length;

      // Leads by source
      const sourceMap = new Map<string, number>();
      leadsData.forEach(lead => {
        const source = lead.source || 'unknown';
        sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
      });
      const leadsBySource = Array.from(sourceMap.entries())
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count);

      // Top sources with percentages
      const topSources = leadsBySource.slice(0, 5).map(s => ({
        ...s,
        percentage: totalLeads > 0 ? (s.count / totalLeads) * 100 : 0,
      }));

      // Leads by status
      const statusMap = new Map<string, number>();
      leadsData.forEach(lead => {
        const status = lead.status || 'new';
        statusMap.set(status, (statusMap.get(status) || 0) + 1);
      });
      const leadsByStatus = Array.from(statusMap.entries())
        .map(([status, count]) => ({ status, count }));

      // Conversion rate
      const converted = leadsData.filter(l => l.status === 'converted').length;
      const conversionRate = totalLeads > 0 ? (converted / totalLeads) * 100 : 0;

      // Leads over time (daily counts)
      const leadsOverTime: LeadsOverTime[] = [];
      const dateMap = new Map<string, number>();

      // Initialize all dates in range with 0
      for (let d = new Date(daysAgo); d <= now; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        dateMap.set(dateStr, 0);
      }

      // Count leads per date
      leadsData.forEach(lead => {
        const dateStr = new Date(lead.created_at).toISOString().split('T')[0];
        dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1);
      });

      dateMap.forEach((count, date) => {
        leadsOverTime.push({ date, count });
      });
      leadsOverTime.sort((a, b) => a.date.localeCompare(b.date));

      // Weekly comparison
      const thisWeekLeads = leadsData.filter(l =>
        new Date(l.created_at) >= thisWeekStart
      ).length;
      const lastWeekLeads = leadsData.filter(l => {
        const date = new Date(l.created_at);
        return date >= lastWeekStart && date < thisWeekStart;
      }).length;
      const percentChange = lastWeekLeads > 0
        ? ((thisWeekLeads - lastWeekLeads) / lastWeekLeads) * 100
        : thisWeekLeads > 0 ? 100 : 0;

      setData({
        leadsBySource,
        leadsByStatus,
        leadsOverTime,
        conversionRate,
        totalLeads,
        weeklyComparison: {
          thisWeek: thisWeekLeads,
          lastWeek: lastWeekLeads,
          percentChange,
        },
        topSources,
        recentActivity: {
          newLeads: thisWeekLeads,
          newBookings: bookingsRes.count || 0,
          newSubscribers: subscribersRes.count || 0,
          newConversations: conversationsRes.count || 0,
        },
      });
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { data, isLoading, error, refetch: fetchAnalytics };
}
