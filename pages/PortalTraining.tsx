import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Play,
  FileText,
  BookOpen,
  Clock,
  CheckCircle2,
  ChevronRight,
  Search,
  ExternalLink,
  Video,
  File,
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { useClientTraining, TrainingModule } from '../hooks/useClientPortal';

type CategoryFilter = 'all' | 'getting-started' | 'guides' | 'videos' | 'documentation';

export const PortalTraining: React.FC = () => {
  const {
    modules,
    isLoading,
    error,
    markAsStarted,
    markAsCompleted,
    isModuleCompleted,
    completedCount,
    totalModules,
    overallProgress,
  } = useClientTraining();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);

  const categories: { value: CategoryFilter; label: string; icon: React.ReactNode }[] = [
    { value: 'all', label: 'All Resources', icon: <BookOpen size={18} /> },
    { value: 'getting-started', label: 'Getting Started', icon: <Play size={18} /> },
    { value: 'guides', label: 'Guides', icon: <FileText size={18} /> },
    { value: 'videos', label: 'Video Tutorials', icon: <Video size={18} /> },
    { value: 'documentation', label: 'Documentation', icon: <File size={18} /> },
  ];

  const filteredModules = modules.filter((module) => {
    const matchesSearch = searchQuery
      ? module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (module.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      : true;
    const matchesCategory = categoryFilter === 'all' || module.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play size={16} className="text-pink-500" />;
      case 'article':
        return <FileText size={16} className="text-blue-500" />;
      case 'document':
        return <File size={16} className="text-emerald-500" />;
      default:
        return <BookOpen size={16} className="text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'getting-started': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
      guides: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      videos: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
      documentation: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    };
    return colors[category] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  };

  const handleOpenModule = (module: TrainingModule) => {
    setSelectedModule(module);
    markAsStarted(module.id);
  };

  const handleCompleteModule = () => {
    if (selectedModule) {
      markAsCompleted(selectedModule.id);
      setSelectedModule(null);
    }
  };

  const handleOpenContent = (module: TrainingModule) => {
    if (module.content_url) {
      window.open(module.content_url, '_blank');
      markAsCompleted(module.id);
    }
  };

  if (isLoading) {
    return (
      <>
        <SEO
          title="Training Center | Client Portal"
          description="Access training materials, guides, and documentation for your projects."
        />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <SEO
          title="Training Center | Client Portal"
          description="Access training materials, guides, and documentation for your projects."
        />
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Unable to load training content
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Training Center | Client Portal"
        description="Access training materials, guides, and documentation for your projects."
      />

      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <GraduationCap size={20} />
                </div>
                <h1 className="text-2xl font-bold">Training Center</h1>
              </div>
              <p className="text-gray-300">
                Learn how to get the most out of your projects and tools
              </p>
            </div>

            <div className="bg-white/10 rounded-xl p-4 min-w-[200px]">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-300">Your Progress</span>
                <span className="font-bold">{completedCount}/{totalModules}</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search training materials..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-all"
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategoryFilter(cat.value)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                categoryFilter === cat.value
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {filteredModules.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center"
          >
            <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No resources found
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {modules.length === 0
                ? 'No training materials have been assigned yet. Check back later!'
                : 'Try adjusting your search or filter criteria.'}
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredModules.map((module, index) => {
                const completed = isModuleCompleted(module.id);

                return (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => handleOpenModule(module)}
                    className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:border-gray-200 dark:hover:border-gray-700 transition-all cursor-pointer group"
                  >
                    <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-4">
                      {getTypeIcon(module.type)}
                    </div>

                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                        {module.title}
                      </h3>
                      {completed && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      )}
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                      {module.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getCategoryColor(module.category)}`}>
                        {module.category.replace('-', ' ')}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                        <Clock size={12} />
                        <span>{module.duration || module.read_time || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors flex items-center gap-1">
                        {module.type === 'video' ? 'Watch' : 'Read'}
                        <ChevronRight size={16} />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        <AnimatePresence>
          {selectedModule && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setSelectedModule(null)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-white dark:bg-gray-900 rounded-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                      {getTypeIcon(selectedModule.type)}
                    </div>
                    <div>
                      <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${getCategoryColor(selectedModule.category)}`}>
                        {selectedModule.category.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedModule(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {selectedModule.title}
                  </h2>

                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {selectedModule.description}
                  </p>

                  {selectedModule.type === 'video' && (
                    <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-6">
                      {selectedModule.content_url ? (
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                            <Play size={24} className="text-white dark:text-gray-900 ml-1" />
                          </div>
                          <p className="text-gray-500 dark:text-gray-400">
                            Click below to watch the video
                          </p>
                          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                            Duration: {selectedModule.duration}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Video size={24} className="text-gray-400" />
                          </div>
                          <p className="text-gray-500 dark:text-gray-400">
                            Video content coming soon
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {(selectedModule.type === 'article' || selectedModule.type === 'document') && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-6">
                      {selectedModule.content_body ? (
                        <div
                          className="prose dark:prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: selectedModule.content_body }}
                        />
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400">
                          {selectedModule.type === 'article'
                            ? 'Full article content would be displayed here. Click below to access the full article.'
                            : 'This document is available for download. Click the button below to access the full documentation.'}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      <span>{selectedModule.duration || selectedModule.read_time || 'N/A'}</span>
                    </div>
                    {isModuleCompleted(selectedModule.id) && (
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={14} />
                        <span>Completed</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex gap-3">
                  {selectedModule.content_url ? (
                    <button
                      onClick={() => handleOpenContent(selectedModule)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                    >
                      {selectedModule.type === 'video' ? (
                        <>
                          <Play size={18} />
                          <span>Watch Video</span>
                        </>
                      ) : selectedModule.type === 'document' ? (
                        <>
                          <ExternalLink size={18} />
                          <span>Download Document</span>
                        </>
                      ) : (
                        <>
                          <BookOpen size={18} />
                          <span>Read Article</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleCompleteModule}
                      disabled={isModuleCompleted(selectedModule.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white disabled:text-gray-400 rounded-xl font-medium transition-colors"
                    >
                      {isModuleCompleted(selectedModule.id) ? (
                        <>
                          <CheckCircle2 size={18} />
                          <span>Completed</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={18} />
                          <span>Mark as Complete</span>
                        </>
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedModule(null)}
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Need additional help?
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Can't find what you're looking for? Our team is here to help.
              </p>
            </div>
            <a
              href="#/portal/messages"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Contact Support
              <ChevronRight size={16} />
            </a>
          </div>
        </motion.div>
      </div>
    </>
  );
};
