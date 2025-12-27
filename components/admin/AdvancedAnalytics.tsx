import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Users, DollarSign, Target, ArrowRight,
  BarChart3, PieChart, Activity, Calendar, Filter, Download,
  ChevronDown, RefreshCw, Eye, MousePointer, Clock, Zap
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AnalyticsData {
  leads: {
    total: number;
    thisWeek: number;
    thisMonth: number;
    bySource: Record<string, number>;
    byStatus: Record<string, number>;
    byService: Record<string, number>;
    conversionRate: number;
    avgScore: number;
  };
  bookings: {
    total: number;
    thisWeek: number;
    thisMonth: number;
    upcomingCount: number;
  };
  revenue: {
    projected: number;
    wonDeals: number;
    avgDealValue: number;
    pipelineValue: number;
  };
  engagement: {
    chatSessions: number;
    avgChatMessages: number;
    resourceDownloads: number;
    newsletterSubscribers: number;
  };
  funnel: {
    visitors: number;
    leads: number;
    qualified: number;
    proposals: number;
    won: number;
  };
  trends: {
    date: string;
    leads: number;
    bookings: number;
  }[];
}

const DATE_RANGES = [
  { id: '7d', label: 'Last 7 days' },
  { id: '30d', label: 'Last 30 days' },
  { id: '90d', label: 'Last 90 days' },
  { id: 'ytd', label: 'Year to date' },
  { id: 'all', label: 'All time' },
];

export const AdvancedAnalytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [activeTab, setActiveTab] = useState<'overview' | 'funnel' | 'sources' | 'roi'>('overview');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const getDateFilter = () => {
    const now = new Date();
    switch (dateRange) {
      case '7d':
        return new Date(now.setDate(now.getDate() - 7)).toISOString();
      case '30d':
        return new Date(now.setDate(now.getDate() - 30)).toISOString();
      case '90d':
        return new Date(now.setDate(now.getDate() - 90)).toISOString();
      case 'ytd':
        return new Date(now.getFullYear(), 0, 1).toISOString();
      default:
        return null;
    }
  };

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const dateFilter = getDateFilter();

      // Fetch leads
      let leadsQuery = supabase.from('leads').select('*');
      if (dateFilter) {
        leadsQuery = leadsQuery.gte('created_at', dateFilter);
      }
      const { data: leads } = await leadsQuery;

      // Fetch bookings
      let bookingsQuery = supabase.from('bookings').select('*');
      if (dateFilter) {
        bookingsQuery = bookingsQuery.gte('created_at', dateFilter);
      }
      const { data: bookings } = await bookingsQuery;

      // Fetch chat conversations
      let chatsQuery = supabase.from('chat_conversations').select('*');
      if (dateFilter) {
        chatsQuery = chatsQuery.gte('created_at', dateFilter);
      }
      const { data: chats } = await chatsQuery;

      // Fetch chat messages
      const { data: messages } = await supabase.from('chat_messages').select('conversation_id');

      // Fetch newsletter subscribers
      let subscribersQuery = supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true });
      const { count: subscriberCount } = await subscribersQuery;

      // Fetch resource downloads
      let downloadsQuery = supabase.from('resource_downloads').select('*', { count: 'exact', head: true });
      if (dateFilter) {
        downloadsQuery = downloadsQuery.gte('created_at', dateFilter);
      }
      const { count: downloadCount } = await downloadsQuery;

      // Calculate stats
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const leadsArr = leads || [];
      const bookingsArr = bookings || [];

      // Group by source
      const bySource: Record<string, number> = {};
      const byStatus: Record<string, number> = {};
      const byService: Record<string, number> = {};

      leadsArr.forEach((lead) => {
        const source = lead.source || 'Unknown';
        bySource[source] = (bySource[source] || 0) + 1;

        const status = lead.status || 'new';
        byStatus[status] = (byStatus[status] || 0) + 1;

        const service = lead.service_interest || 'Unknown';
        byService[service] = (byService[service] || 0) + 1;
      });

      // Calculate pipeline value
      const pipelineValue = leadsArr.reduce((sum, lead) => {
        return sum + (lead.expected_value || 0) * ((lead.probability || 0) / 100);
      }, 0);

      const wonLeads = leadsArr.filter((l) => l.pipeline_stage === 'won');
      const wonValue = wonLeads.reduce((sum, l) => sum + (l.expected_value || 0), 0);

      // Calculate trends
      const trendData: { date: string; leads: number; bookings: number }[] = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        trendData.push({
          date: dateStr,
          leads: leadsArr.filter(
            (l) => l.created_at.startsWith(dateStr)
          ).length,
          bookings: bookingsArr.filter(
            (b) => b.created_at.startsWith(dateStr)
          ).length,
        });
      }

      // Calculate funnel
      const funnel = {
        visitors: Math.round(leadsArr.length * 8.5), // Estimate
        leads: leadsArr.length,
        qualified: leadsArr.filter((l) => l.pipeline_stage === 'qualified' || l.pipeline_stage === 'proposal' || l.pipeline_stage === 'negotiation' || l.pipeline_stage === 'won').length,
        proposals: leadsArr.filter((l) => l.pipeline_stage === 'proposal' || l.pipeline_stage === 'negotiation' || l.pipeline_stage === 'won').length,
        won: wonLeads.length,
      };

      setData({
        leads: {
          total: leadsArr.length,
          thisWeek: leadsArr.filter((l) => new Date(l.created_at) > weekAgo).length,
          thisMonth: leadsArr.filter((l) => new Date(l.created_at) > monthAgo).length,
          bySource,
          byStatus,
          byService,
          conversionRate: leadsArr.length > 0 ? (wonLeads.length / leadsArr.length) * 100 : 0,
          avgScore: leadsArr.length > 0
            ? leadsArr.reduce((sum, l) => sum + (l.score || 0), 0) / leadsArr.length
            : 0,
        },
        bookings: {
          total: bookingsArr.length,
          thisWeek: bookingsArr.filter((b) => new Date(b.created_at) > weekAgo).length,
          thisMonth: bookingsArr.filter((b) => new Date(b.created_at) > monthAgo).length,
          upcomingCount: bookingsArr.filter((b) => new Date(b.scheduled_time) > now).length,
        },
        revenue: {
          projected: pipelineValue,
          wonDeals: wonValue,
          avgDealValue: wonLeads.length > 0 ? wonValue / wonLeads.length : 0,
          pipelineValue,
        },
        engagement: {
          chatSessions: chats?.length || 0,
          avgChatMessages: chats?.length && messages
            ? messages.length / chats.length
            : 0,
          resourceDownloads: downloadCount || 0,
          newsletterSubscribers: subscriberCount || 0,
        },
        funnel,
        trends: trendData,
      });
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = () => {
    if (!data) return;

    const csvContent = [
      'Metric,Value',
      `Total Leads,${data.leads.total}`,
      `Conversion Rate,${data.leads.conversionRate.toFixed(1)}%`,
      `Projected Revenue,$${data.revenue.projected.toLocaleString()}`,
      `Won Deals,$${data.revenue.wonDeals.toLocaleString()}`,
      `Total Bookings,${data.bookings.total}`,
      `Newsletter Subscribers,${data.engagement.newsletterSubscribers}`,
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${dateRange}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Advanced Analytics
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Track performance, conversions, and ROI
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {DATE_RANGES.map((range) => (
              <option key={range.id} value={range.id}>
                {range.label}
              </option>
            ))}
          </select>
          <button
            onClick={fetchAnalytics}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'funnel', label: 'Conversion Funnel', icon: Target },
          { id: 'sources', label: 'Lead Sources', icon: PieChart },
          { id: 'roi', label: 'ROI Calculator', icon: DollarSign },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 -mb-px transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Leads"
              value={data.leads.total}
              change={data.leads.thisWeek}
              changeLabel="this week"
              icon={Users}
              color="blue"
            />
            <MetricCard
              title="Conversion Rate"
              value={`${data.leads.conversionRate.toFixed(1)}%`}
              icon={Target}
              color="green"
            />
            <MetricCard
              title="Pipeline Value"
              value={`$${data.revenue.pipelineValue.toLocaleString()}`}
              icon={DollarSign}
              color="purple"
            />
            <MetricCard
              title="Avg. Lead Score"
              value={Math.round(data.leads.avgScore)}
              icon={Zap}
              color="orange"
            />
          </div>

          {/* Trend Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Lead & Booking Trends
            </h3>
            <div className="h-64">
              <TrendChart data={data.trends} />
            </div>
          </div>

          {/* Engagement Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Chat Sessions</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {data.engagement.chatSessions}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Download className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Resource Downloads</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {data.engagement.resourceDownloads}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Subscribers</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {data.engagement.newsletterSubscribers}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Upcoming Bookings</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {data.bookings.upcomingCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Funnel Tab */}
      {activeTab === 'funnel' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-6">
            Conversion Funnel
          </h3>
          <FunnelChart data={data.funnel} />
        </div>
      )}

      {/* Sources Tab */}
      {activeTab === 'sources' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Leads by Source
            </h3>
            <BarChartHorizontal data={data.leads.bySource} />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Leads by Service Interest
            </h3>
            <BarChartHorizontal data={data.leads.byService} />
          </div>
        </div>
      )}

      {/* ROI Tab */}
      {activeTab === 'roi' && (
        <ROICalculator data={data} />
      )}
    </div>
  );
};

// Metric Card Component
const MetricCard: React.FC<{
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.FC<{ className?: string }>;
  color: 'blue' | 'green' | 'purple' | 'orange';
}> = ({ title, value, change, changeLabel, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {change !== undefined && (
          <span className="text-sm text-green-600 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            +{change} {changeLabel}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
};

// Trend Chart Component (Simple CSS-based)
const TrendChart: React.FC<{ data: { date: string; leads: number; bookings: number }[] }> = ({ data }) => {
  const maxValue = Math.max(...data.flatMap((d) => [d.leads, d.bookings]), 1);

  return (
    <div className="flex items-end gap-1 h-full">
      {data.map((day, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex gap-0.5">
            <div
              className="flex-1 bg-blue-500 rounded-t"
              style={{ height: `${(day.leads / maxValue) * 200}px` }}
              title={`${day.leads} leads`}
            />
            <div
              className="flex-1 bg-green-500 rounded-t"
              style={{ height: `${(day.bookings / maxValue) * 200}px` }}
              title={`${day.bookings} bookings`}
            />
          </div>
          {i % 5 === 0 && (
            <span className="text-xs text-gray-400 truncate max-w-full">
              {new Date(day.date).getDate()}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

// Funnel Chart Component
const FunnelChart: React.FC<{ data: { visitors: number; leads: number; qualified: number; proposals: number; won: number } }> = ({ data }) => {
  const stages = [
    { key: 'visitors', label: 'Website Visitors', value: data.visitors, color: 'bg-gray-400' },
    { key: 'leads', label: 'Leads Generated', value: data.leads, color: 'bg-blue-500' },
    { key: 'qualified', label: 'Qualified Leads', value: data.qualified, color: 'bg-purple-500' },
    { key: 'proposals', label: 'Proposals Sent', value: data.proposals, color: 'bg-yellow-500' },
    { key: 'won', label: 'Deals Won', value: data.won, color: 'bg-green-500' },
  ];

  const maxValue = Math.max(...stages.map((s) => s.value), 1);

  return (
    <div className="space-y-4">
      {stages.map((stage, i) => {
        const conversionRate = i > 0 && stages[i - 1].value > 0
          ? ((stage.value / stages[i - 1].value) * 100).toFixed(1)
          : null;

        return (
          <div key={stage.key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {stage.label}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{stage.value.toLocaleString()}</span>
                {conversionRate && (
                  <span className="text-xs text-green-600">({conversionRate}%)</span>
                )}
              </div>
            </div>
            <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stage.value / maxValue) * 100}%` }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`h-full ${stage.color} rounded-lg`}
              />
            </div>
            {i < stages.length - 1 && (
              <div className="flex justify-center my-2">
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Horizontal Bar Chart
const BarChartHorizontal: React.FC<{ data: Record<string, number> }> = ({ data }) => {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const maxValue = Math.max(...entries.map(([, v]) => v), 1);

  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-cyan-500'];

  return (
    <div className="space-y-3">
      {entries.map(([label, value], i) => (
        <div key={label}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[60%]">
              {label}
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {value}
            </span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(value / maxValue) * 100}%` }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={`h-full ${colors[i % colors.length]} rounded-full`}
            />
          </div>
        </div>
      ))}
      {entries.length === 0 && (
        <p className="text-gray-500 text-center py-4">No data available</p>
      )}
    </div>
  );
};

// ROI Calculator
const ROICalculator: React.FC<{ data: AnalyticsData }> = ({ data }) => {
  const [marketingSpend, setMarketingSpend] = useState(5000);
  const [avgProjectValue, setAvgProjectValue] = useState(data.revenue.avgDealValue || 10000);

  const costPerLead = data.leads.total > 0 ? marketingSpend / data.leads.total : 0;
  const costPerWon = data.funnel.won > 0 ? marketingSpend / data.funnel.won : 0;
  const totalRevenue = data.funnel.won * avgProjectValue;
  const roi = marketingSpend > 0 ? ((totalRevenue - marketingSpend) / marketingSpend) * 100 : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-6">
        ROI Calculator
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
            Marketing Spend ($)
          </label>
          <input
            type="number"
            value={marketingSpend}
            onChange={(e) => setMarketingSpend(parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
            Average Project Value ($)
          </label>
          <input
            type="number"
            value={avgProjectValue}
            onChange={(e) => setAvgProjectValue(parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Cost per Lead</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${costPerLead.toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Cost per Won Deal</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${costPerWon.toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">
            ${totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">ROI</p>
          <p className={`text-2xl font-bold ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {roi.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
          Key Insights
        </h4>
        <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-400">
          <li>
            You're generating {data.leads.total} leads from ${marketingSpend.toLocaleString()} spend
          </li>
          <li>
            Your conversion rate is {data.leads.conversionRate.toFixed(1)}%
          </li>
          {roi > 0 && (
            <li>
              For every $1 spent, you're making ${(roi / 100 + 1).toFixed(2)} back
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};
