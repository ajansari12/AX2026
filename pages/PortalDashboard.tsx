import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  FileText,
  MessageSquare,
  Receipt,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Calendar,
  Target,
  Layers,
  Play,
  Pause,
  Search,
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { useClientAuth } from '../hooks/useClientAuth';
import {
  useClientProjects,
  useClientDocuments,
  useClientMessages,
  useClientInvoices,
  useClientActivity,
} from '../hooks/useClientPortal';

export const PortalDashboard: React.FC = () => {
  const { client } = useClientAuth();
  const {
    projects,
    activeProjects,
    projectsByStatus,
    ongoingProjects,
    upcomingMilestones,
    overdueMilestones,
    isLoading: projectsLoading,
  } = useClientProjects();
  const { documents, isLoading: documentsLoading } = useClientDocuments();
  const { unreadCount, isLoading: messagesLoading } = useClientMessages();
  const { pendingInvoices, totalOutstanding, isLoading: invoicesLoading } = useClientInvoices();
  const { activities, isLoading: activitiesLoading } = useClientActivity(5);

  const isLoading = projectsLoading || documentsLoading || messagesLoading || invoicesLoading;

  // Get current time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Format currency
  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planning: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      in_progress: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      review: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      on_hold: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    };
    return colors[status] || colors.on_hold;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getDaysUntil = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / 86400000);
    return diffDays;
  };

  const statusConfig = [
    { key: 'planning', label: 'Planning', color: 'bg-blue-500', icon: <Search className="w-3.5 h-3.5" /> },
    { key: 'in_progress', label: 'In Progress', color: 'bg-amber-500', icon: <Play className="w-3.5 h-3.5" /> },
    { key: 'review', label: 'Review', color: 'bg-cyan-500', icon: <Search className="w-3.5 h-3.5" /> },
    { key: 'completed', label: 'Completed', color: 'bg-emerald-500', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    { key: 'on_hold', label: 'On Hold', color: 'bg-gray-500', icon: <Pause className="w-3.5 h-3.5" /> },
  ];

  // Quick stats
  const stats = [
    {
      label: 'Total Projects',
      value: projects.length,
      icon: <Layers className="w-5 h-5" />,
      color: 'bg-blue-500',
      link: '/portal/projects',
    },
    {
      label: 'Documents',
      value: documents.length,
      icon: <FileText className="w-5 h-5" />,
      color: 'bg-emerald-500',
      link: '/portal/documents',
    },
    {
      label: 'Unread Messages',
      value: unreadCount,
      icon: <MessageSquare className="w-5 h-5" />,
      color: 'bg-cyan-500',
      link: '/portal/messages',
    },
    {
      label: 'Pending Invoices',
      value: pendingInvoices.length,
      icon: <Receipt className="w-5 h-5" />,
      color: 'bg-amber-500',
      link: '/portal/invoices',
    },
  ];

  return (
    <>
      <SEO
        title="Dashboard | Client Portal"
        description="View your projects, documents, and messages in your client portal."
      />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 text-white"
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {getGreeting()}, {client?.name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-gray-300">
            Here's an overview of your projects and recent activity.
          </p>

          {/* Outstanding balance alert */}
          {totalOutstanding > 0 && (
            <div className="mt-6 flex items-center gap-3 bg-amber-500/20 border border-amber-500/30 rounded-xl px-4 py-3">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <p className="text-amber-100 text-sm">
                You have {formatCurrency(totalOutstanding)} in outstanding invoices.{' '}
                <Link to="/portal/invoices" className="underline hover:no-underline">
                  View invoices
                </Link>
              </p>
            </div>
          )}
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={stat.link}
                className="block bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-white`}>
                    {stat.icon}
                  </div>
                  <ArrowRight
                    size={16}
                    className="ml-auto text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors"
                  />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isLoading ? '-' : stat.value}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Project Status Overview */}
        {projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Project Status Overview
              </h2>
              <Link
                to="/portal/projects"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                View all
              </Link>
            </div>

            <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex mb-4">
              {statusConfig.map(({ key, color }) => {
                const count = projectsByStatus[key as keyof typeof projectsByStatus]?.length || 0;
                const percentage = projects.length > 0 ? (count / projects.length) * 100 : 0;
                if (percentage === 0) return null;
                return (
                  <div
                    key={key}
                    className={`${color} h-full transition-all`}
                    style={{ width: `${percentage}%` }}
                  />
                );
              })}
            </div>

            <div className="flex flex-wrap gap-4">
              {statusConfig.map(({ key, label, color, icon }) => {
                const count = projectsByStatus[key as keyof typeof projectsByStatus]?.length || 0;
                if (count === 0) return null;
                return (
                  <div key={key} className="flex items-center gap-2">
                    <div className={`w-6 h-6 ${color} rounded-md flex items-center justify-center text-white`}>
                      {icon}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {count} {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* All projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800"
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Your Projects
              </h2>
              <Link
                to="/portal/projects"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                View all
              </Link>
            </div>

            {projectsLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : ongoingProjects.length === 0 ? (
              <div className="p-12 text-center">
                <FolderKanban className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No ongoing projects</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {ongoingProjects.slice(0, 4).map((project) => (
                  <Link
                    key={project.id}
                    to={`/portal/projects/${project.id}`}
                    className="block p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">
                          {project.name}
                        </h3>
                        {project.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                            {project.description}
                          </p>
                        )}
                        {project.total_milestones && project.total_milestones > 0 && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                              <span>Progress</span>
                              <span>{project.completed_milestones}/{project.total_milestones} milestones</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full transition-all"
                                style={{
                                  width: `${(project.completed_milestones! / project.total_milestones) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}
                        {project.next_milestone && (
                          <div className="mt-3 flex items-center gap-2 text-xs">
                            <Target className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-gray-500 dark:text-gray-400">
                              Next: {project.next_milestone.title}
                            </span>
                            {project.next_milestone.due_date && (
                              <span className="text-gray-400">
                                (Due {formatDate(project.next_milestone.due_date)})
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${getStatusColor(project.status)}`}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>

          {/* Recent activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800"
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h2>
            </div>

            {activitiesLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex gap-3">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activities.length === 0 ? (
              <div className="p-12 text-center">
                <Clock className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                      {getActivityIcon(activity.activity_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {formatRelativeTime(activity.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Upcoming Deadlines & Timeline */}
        {(upcomingMilestones.length > 0 || overdueMilestones.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800"
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Upcoming Milestones
                </h2>
              </div>
              {overdueMilestones.length > 0 && (
                <span className="px-2.5 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg text-xs font-medium">
                  {overdueMilestones.length} overdue
                </span>
              )}
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {overdueMilestones.map((milestone) => (
                <Link
                  key={milestone.id}
                  to={`/portal/projects/${milestone.projectId}`}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {milestone.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {milestone.projectName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">
                      Overdue
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(milestone.due_date!)}
                    </p>
                  </div>
                </Link>
              ))}

              {upcomingMilestones.filter(m => !overdueMilestones.some(o => o.id === m.id)).slice(0, 4).map((milestone) => {
                const daysUntil = getDaysUntil(milestone.due_date!);
                const isUrgent = daysUntil <= 3;
                return (
                  <Link
                    key={milestone.id}
                    to={`/portal/projects/${milestone.projectId}`}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isUrgent
                        ? 'bg-amber-100 dark:bg-amber-900/30'
                        : 'bg-blue-100 dark:bg-blue-900/30'
                    }`}>
                      <Target className={`w-5 h-5 ${
                        isUrgent
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-blue-600 dark:text-blue-400'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {milestone.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {milestone.projectName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        isUrgent
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-gray-600 dark:text-gray-300'
                      }`}>
                        {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(milestone.due_date!)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              to="/portal/messages"
              className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">Send a Message</span>
            </Link>
            <Link
              to="/portal/documents"
              className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">View Documents</span>
            </Link>
            <Link
              to="/portal/invoices"
              className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Receipt className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">Pay an Invoice</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

// Helper to get activity icon based on type
function getActivityIcon(type: string) {
  const iconClass = "w-4 h-4 text-gray-500 dark:text-gray-400";

  switch (type) {
    case 'project_update':
      return <TrendingUp className={iconClass} />;
    case 'milestone_completed':
      return <CheckCircle2 className={iconClass} />;
    case 'document_uploaded':
      return <FileText className={iconClass} />;
    case 'message_received':
      return <MessageSquare className={iconClass} />;
    case 'invoice_sent':
      return <Receipt className={iconClass} />;
    default:
      return <Clock className={iconClass} />;
  }
}
