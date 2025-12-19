import React, { useState } from 'react';
import { Section, Container, Button } from '../components/UI';
import { SEO } from '../components/SEO';
import {
  useAdminLeads,
  useAdminTeardowns,
  useAdminDownloads,
  useAdminSubscribers,
  useAdminStats,
} from '../hooks/useAdmin';
import {
  Users,
  Mail,
  Download,
  Globe,
  Loader2,
  RefreshCw,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  BarChart3,
} from 'lucide-react';

type TabType = 'overview' | 'leads' | 'teardowns' | 'downloads' | 'subscribers';

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    new: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    contacted: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
    qualified: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
    converted: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    closed: 'bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400',
    pending: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
    completed: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${styles[status] || styles.new}`}>
      {status}
    </span>
  );
};

const StatCard: React.FC<{ label: string; value: number; icon: React.ReactNode; trend?: string }> = ({
  label,
  value,
  icon,
  trend,
}) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-400">
        {icon}
      </div>
      {trend && (
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
          <TrendingUp size={12} /> {trend}
        </span>
      )}
    </div>
    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
  </div>
);

const OverviewTab: React.FC = () => {
  const { stats, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Leads"
          value={stats.totalLeads}
          icon={<Users size={24} />}
        />
        <StatCard
          label="New This Week"
          value={stats.newLeadsThisWeek}
          icon={<TrendingUp size={24} />}
          trend={stats.newLeadsThisWeek > 0 ? '+' + stats.newLeadsThisWeek : undefined}
        />
        <StatCard
          label="Email Subscribers"
          value={stats.totalSubscribers}
          icon={<Mail size={24} />}
        />
        <StatCard
          label="Resource Downloads"
          value={stats.totalDownloads}
          icon={<Download size={24} />}
        />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="text-gray-400" size={24} />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="https://cal.com/axrategy"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-center"
          >
            <p className="font-bold text-gray-900 dark:text-white">View Calendar</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage bookings</p>
          </a>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
            <p className="font-bold text-gray-900 dark:text-white">{stats.totalTeardowns}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Teardown Requests</p>
          </div>
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-center">
            <p className="font-bold text-emerald-700 dark:text-emerald-400">Active</p>
            <p className="text-sm text-emerald-600 dark:text-emerald-500">System Status</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const LeadsTab: React.FC = () => {
  const { leads, isLoading, refetch, updateLeadStatus } = useAdminLeads();
  const [updating, setUpdating] = useState<string | null>(null);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdating(id);
    await updateLeadStatus(id, status);
    setUpdating(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">{leads.length} leads found</p>
        <Button variant="outline" size="sm" onClick={refetch}>
          <RefreshCw size={14} className="mr-2" /> Refresh
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Email</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Interest</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Source</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{lead.name}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{lead.email}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400 max-w-[200px] truncate">
                    {lead.service_interest || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {lead.source.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {updating === lead.id ? (
                      <Loader2 className="animate-spin text-gray-400" size={16} />
                    ) : (
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className="text-xs font-bold uppercase bg-transparent border-none cursor-pointer focus:outline-none"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="converted">Converted</option>
                        <option value="closed">Closed</option>
                      </select>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(lead.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {leads.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto mb-4 text-gray-300 dark:text-gray-600" size={48} />
            <p className="text-gray-500 dark:text-gray-400">No leads yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

const TeardownsTab: React.FC = () => {
  const { teardowns, isLoading } = useAdminTeardowns();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Email</th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Website</th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {teardowns.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4 text-gray-900 dark:text-white">{req.email}</td>
                <td className="px-6 py-4">
                  <a
                    href={req.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Globe size={14} />
                    {req.website_url.replace(/^https?:\/\//, '').slice(0, 30)}
                  </a>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={req.status} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(req.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {teardowns.length === 0 && (
        <div className="text-center py-12">
          <Globe className="mx-auto mb-4 text-gray-300 dark:text-gray-600" size={48} />
          <p className="text-gray-500 dark:text-gray-400">No teardown requests yet</p>
        </div>
      )}
    </div>
  );
};

const DownloadsTab: React.FC = () => {
  const { downloads, isLoading } = useAdminDownloads();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Email</th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Resource</th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {downloads.map((dl) => (
              <tr key={dl.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4 text-gray-900 dark:text-white">{dl.email}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{dl.resource_name}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(dl.downloaded_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {downloads.length === 0 && (
        <div className="text-center py-12">
          <Download className="mx-auto mb-4 text-gray-300 dark:text-gray-600" size={48} />
          <p className="text-gray-500 dark:text-gray-400">No downloads yet</p>
        </div>
      )}
    </div>
  );
};

const SubscribersTab: React.FC = () => {
  const { subscribers, isLoading } = useAdminSubscribers();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Email</th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Source</th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {subscribers.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4 text-gray-900 dark:text-white">{sub.email}</td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {sub.source.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {sub.is_active ? (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                      <CheckCircle2 size={14} /> Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-400 text-sm font-medium">
                      <XCircle size={14} /> Inactive
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(sub.subscribed_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {subscribers.length === 0 && (
        <div className="text-center py-12">
          <Mail className="mx-auto mb-4 text-gray-300 dark:text-gray-600" size={48} />
          <p className="text-gray-500 dark:text-gray-400">No subscribers yet</p>
        </div>
      )}
    </div>
  );
};

export const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={18} /> },
    { id: 'leads', label: 'Leads', icon: <Users size={18} /> },
    { id: 'teardowns', label: 'Teardowns', icon: <Globe size={18} /> },
    { id: 'downloads', label: 'Downloads', icon: <Download size={18} /> },
    { id: 'subscribers', label: 'Subscribers', icon: <Mail size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <SEO
        title="Admin Dashboard"
        description="Manage leads, subscribers, and content for Axrategy."
      />

      <Section className="pt-28 pb-8">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
              <p className="text-gray-500 dark:text-gray-400">Manage your leads and content</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock size={16} />
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8 bg-white dark:bg-gray-900 p-2 rounded-2xl border border-gray-100 dark:border-gray-800">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-black dark:bg-white text-white dark:text-black shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'leads' && <LeadsTab />}
          {activeTab === 'teardowns' && <TeardownsTab />}
          {activeTab === 'downloads' && <DownloadsTab />}
          {activeTab === 'subscribers' && <SubscribersTab />}
        </Container>
      </Section>
    </div>
  );
};
