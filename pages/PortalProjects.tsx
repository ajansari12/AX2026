import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderKanban,
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  ChevronRight,
  Target,
  DollarSign,
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { useClientProjects, Project, Milestone } from '../hooks/useClientPortal';

export const PortalProjects: React.FC = () => {
  const { projectId } = useParams();
  const { projects, isLoading, getProject } = useClientProjects();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // If we have a projectId, show the detail view
  if (projectId) {
    return <ProjectDetail projectId={projectId} getProject={getProject} />;
  }

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    if (filter === 'all') return true;
    if (filter === 'active') return ['planning', 'in_progress', 'review'].includes(project.status);
    if (filter === 'completed') return project.status === 'completed';
    return true;
  });

  // Get status color
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planning: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      in_progress: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      review: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      on_hold: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
      cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return colors[status] || colors.on_hold;
  };

  return (
    <>
      <SEO
        title="Projects | Client Portal"
        description="View and track your project progress."
      />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Track your project progress and milestones
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            {(['all', 'active', 'completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${
                  filter === tab
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Projects grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 animate-pulse">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3" />
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2 mb-4" />
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded w-full" />
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center"
          >
            <FolderKanban className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No projects found
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {filter === 'all'
                ? "You don't have any projects yet."
                : `No ${filter} projects.`}
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/portal/projects/${project.id}`}
                    className="block bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:border-gray-200 dark:hover:border-gray-700 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                          {project.name}
                        </h3>
                        {project.service_type && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {project.service_type}
                          </p>
                        )}
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${getStatusColor(project.status)}`}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>

                    {project.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {project.description}
                      </p>
                    )}

                    {/* Progress */}
                    {project.total_milestones && project.total_milestones > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600 dark:text-gray-400">Progress</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {Math.round((project.completed_milestones! / project.total_milestones) * 100)}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{
                              width: `${(project.completed_milestones! / project.total_milestones) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      {project.start_date && (
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          <span>{new Date(project.start_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      {project.total_milestones && project.total_milestones > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Target size={14} />
                          <span>{project.completed_milestones}/{project.total_milestones} milestones</span>
                        </div>
                      )}
                      <ChevronRight
                        size={16}
                        className="ml-auto text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors"
                      />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
};

// Project Detail Component
interface ProjectDetailProps {
  projectId: string;
  getProject: (id: string) => Project | null;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectId, getProject }) => {
  const project = getProject(projectId);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto">
        <Link
          to="/portal/projects"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Projects</span>
        </Link>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center">
          <AlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Project not found
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            This project may have been removed or you don't have access to it.
          </p>
        </div>
      </div>
    );
  }

  // Get status color
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planning: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      in_progress: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      review: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      on_hold: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
      cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return colors[status] || colors.on_hold;
  };

  // Get milestone status icon
  const getMilestoneIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'blocked':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />;
    }
  };

  // Format currency
  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <SEO
        title={`${project.name} | Client Portal`}
        description={project.description || `View details for ${project.name}`}
      />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back link */}
        <Link
          to="/portal/projects"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Projects</span>
        </Link>

        {/* Project header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {project.name}
              </h1>
              {project.service_type && (
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {project.service_type}
                </p>
              )}
            </div>
            <span className={`px-3 py-1.5 rounded-xl text-sm font-medium ${getStatusColor(project.status)}`}>
              {project.status.replace('_', ' ')}
            </span>
          </div>

          {project.description && (
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {project.description}
            </p>
          )}

          {/* Project stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {project.start_date && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-1">
                  <Calendar size={14} />
                  <span>Start Date</span>
                </div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(project.start_date).toLocaleDateString()}
                </p>
              </div>
            )}
            {project.estimated_end_date && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-1">
                  <Clock size={14} />
                  <span>Est. End Date</span>
                </div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(project.estimated_end_date).toLocaleDateString()}
                </p>
              </div>
            )}
            {project.total_value && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-1">
                  <DollarSign size={14} />
                  <span>Project Value</span>
                </div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(project.total_value, project.currency)}
                </p>
              </div>
            )}
            {project.total_milestones && project.total_milestones > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-1">
                  <Target size={14} />
                  <span>Progress</span>
                </div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {Math.round((project.completed_milestones! / project.total_milestones) * 100)}% Complete
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Milestones */}
        {project.milestones && project.milestones.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800"
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Milestones
              </h2>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {project.milestones.map((milestone: Milestone, index: number) => (
                <div
                  key={milestone.id}
                  className="p-6 flex items-start gap-4"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getMilestoneIcon(milestone.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className={`font-medium ${
                          milestone.status === 'completed'
                            ? 'text-gray-500 dark:text-gray-400 line-through'
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {milestone.title}
                        </h3>
                        {milestone.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {milestone.description}
                          </p>
                        )}
                      </div>
                      {milestone.due_date && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {new Date(milestone.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {milestone.completed_at && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
                        Completed on {new Date(milestone.completed_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Next milestone highlight */}
        {project.next_milestone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 text-white"
          >
            <div className="flex items-center gap-2 text-gray-300 text-sm mb-2">
              <Target size={16} />
              <span>Next Milestone</span>
            </div>
            <h3 className="text-lg font-semibold mb-1">
              {project.next_milestone.title}
            </h3>
            {project.next_milestone.description && (
              <p className="text-gray-300 text-sm mb-3">
                {project.next_milestone.description}
              </p>
            )}
            {project.next_milestone.due_date && (
              <p className="text-sm text-gray-400">
                Due: {new Date(project.next_milestone.due_date).toLocaleDateString()}
              </p>
            )}
          </motion.div>
        )}
      </div>
    </>
  );
};
