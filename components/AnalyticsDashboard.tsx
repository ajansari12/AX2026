import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  MessageCircle,
  Mail,
  Calendar,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import { formatSource } from '../lib/utils';

interface AnalyticsDashboardProps {
  onNavigate?: (tab: string) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ onNavigate }) => {
  const { data, isLoading, error } = useAnalytics(30);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-6 rounded-2xl">
        <p>Failed to load analytics: {error}</p>
      </div>
    );
  }

  if (!data) return null;

  const { weeklyComparison, conversionRate, topSources, recentActivity, leadsOverTime, leadsByStatus } = data;

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="Leads This Week"
          value={weeklyComparison.thisWeek}
          trend={weeklyComparison.percentChange}
          icon={<Users size={24} />}
          onClick={() => onNavigate?.('leads')}
        />
        <MetricCard
          label="Conversion Rate"
          value={`${conversionRate.toFixed(1)}%`}
          icon={<Target size={24} />}
          subtitle="to converted"
        />
        <MetricCard
          label="Bookings"
          value={recentActivity.newBookings}
          icon={<Calendar size={24} />}
          subtitle="this week"
          onClick={() => onNavigate?.('bookings')}
        />
        <MetricCard
          label="Chat Sessions"
          value={recentActivity.newConversations}
          icon={<MessageCircle size={24} />}
          subtitle="this week"
          onClick={() => onNavigate?.('conversations')}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads Over Time Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Leads Over Time
            </h3>
            <span className="text-sm text-gray-400">Last 30 days</span>
          </div>
          <div className="h-48">
            <LeadsChart data={leadsOverTime} />
          </div>
        </div>

        {/* Source Distribution */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Lead Sources
            </h3>
            <span className="text-sm text-gray-400">{data.totalLeads} total</span>
          </div>
          <div className="space-y-4">
            {topSources.length > 0 ? (
              topSources.map((source) => (
                <div key={source.source}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-700 dark:text-gray-300">
                      {formatSource(source.source)}
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {source.count} ({source.percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-900 dark:bg-white rounded-full transition-all duration-500"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">No data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Status Distribution & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Breakdown */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Lead Status
          </h3>
          <div className="space-y-3">
            {leadsByStatus.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusDot status={item.status} />
                  <span className="text-gray-700 dark:text-gray-300 capitalize">
                    {item.status}
                  </span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">
                  {item.count}
                </span>
              </div>
            ))}
            {leadsByStatus.length === 0 && (
              <p className="text-gray-400 text-center py-4">No leads yet</p>
            )}
          </div>
        </div>

        {/* Weekly Comparison */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Weekly Comparison
          </h3>
          <div className="flex items-center justify-center gap-8 py-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {weeklyComparison.lastWeek}
              </p>
              <p className="text-sm text-gray-400">Last Week</p>
            </div>
            <div className="flex items-center">
              <ArrowRight className="text-gray-300" size={24} />
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {weeklyComparison.thisWeek}
              </p>
              <p className="text-sm text-gray-400">This Week</p>
            </div>
          </div>
          {weeklyComparison.percentChange !== 0 && (
            <div className={`text-center mt-4 flex items-center justify-center gap-1 ${
              weeklyComparison.percentChange > 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
              {weeklyComparison.percentChange > 0 ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <span className="font-bold">
                {Math.abs(weeklyComparison.percentChange).toFixed(0)}% {weeklyComparison.percentChange > 0 ? 'increase' : 'decrease'}
              </span>
            </div>
          )}
        </div>

        {/* Activity Summary */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            This Week's Activity
          </h3>
          <div className="space-y-4">
            <ActivityRow
              icon={<Users size={18} />}
              label="New Leads"
              value={recentActivity.newLeads}
              color="text-blue-600 dark:text-blue-400"
            />
            <ActivityRow
              icon={<Calendar size={18} />}
              label="Bookings"
              value={recentActivity.newBookings}
              color="text-emerald-600 dark:text-emerald-400"
            />
            <ActivityRow
              icon={<Mail size={18} />}
              label="Subscribers"
              value={recentActivity.newSubscribers}
              color="text-purple-600 dark:text-purple-400"
            />
            <ActivityRow
              icon={<MessageCircle size={18} />}
              label="Chat Sessions"
              value={recentActivity.newConversations}
              color="text-orange-600 dark:text-orange-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components

const MetricCard: React.FC<{
  label: string;
  value: string | number;
  trend?: number;
  subtitle?: string;
  icon: React.ReactNode;
  onClick?: () => void;
}> = ({ label, value, trend, subtitle, icon, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 transition-all ${
      onClick ? 'cursor-pointer hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-700' : ''
    }`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-400">
        {icon}
      </div>
      {trend !== undefined && (
        <span className={`text-sm font-bold flex items-center gap-1 ${
          trend >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
        }`}>
          {trend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {Math.abs(trend).toFixed(0)}%
        </span>
      )}
    </div>
    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
    <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle || label}</p>
  </div>
);

const LeadsChart: React.FC<{ data: { date: string; count: number }[] }> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        No data available
      </div>
    );
  }

  const max = Math.max(...data.map(d => d.count), 1);
  // Show only last 14 days for better visibility
  const chartData = data.slice(-14);

  return (
    <div className="h-full flex items-end justify-between gap-1">
      {chartData.map((point, i) => (
        <div key={point.date} className="flex-1 flex flex-col items-center group">
          <div className="relative w-full flex justify-center mb-2">
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
              <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                {point.count} leads on {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
            {/* Bar */}
            <div
              className="w-full max-w-[20px] bg-gray-200 dark:bg-gray-700 group-hover:bg-gray-900 dark:group-hover:bg-white rounded-t transition-all"
              style={{
                height: `${Math.max((point.count / max) * 100, 4)}%`,
                minHeight: '4px',
              }}
            />
          </div>
          {/* Date label - show for every other day */}
          {i % 2 === 0 && (
            <span className="text-[10px] text-gray-400 whitespace-nowrap">
              {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

const StatusDot: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, string> = {
    new: 'bg-blue-500',
    contacted: 'bg-yellow-500',
    qualified: 'bg-emerald-500',
    converted: 'bg-green-500',
    closed: 'bg-gray-400',
  };

  return (
    <div className={`w-2.5 h-2.5 rounded-full ${colors[status] || colors.new}`} />
  );
};

const ActivityRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}> = ({ icon, label, value, color }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className={color}>{icon}</div>
      <span className="text-gray-700 dark:text-gray-300">{label}</span>
    </div>
    <span className="font-bold text-gray-900 dark:text-white">{value}</span>
  </div>
);
