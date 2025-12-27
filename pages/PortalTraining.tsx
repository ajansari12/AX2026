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
} from 'lucide-react';
import { SEO } from '../components/SEO';

// Training content types
interface TrainingModule {
  id: string;
  title: string;
  description: string;
  category: 'getting-started' | 'guides' | 'videos' | 'documentation';
  type: 'video' | 'article' | 'document';
  duration?: string; // For videos
  readTime?: string; // For articles
  thumbnail?: string;
  url: string;
  completed?: boolean;
}

// Sample training content - In production, this would come from Supabase
const TRAINING_MODULES: TrainingModule[] = [
  {
    id: '1',
    title: 'Welcome to Your Client Portal',
    description: 'Learn how to navigate your portal and access all features.',
    category: 'getting-started',
    type: 'video',
    duration: '3 min',
    url: '#',
    completed: true,
  },
  {
    id: '2',
    title: 'Understanding Your Project Dashboard',
    description: 'Track milestones, view progress, and stay updated on your project status.',
    category: 'getting-started',
    type: 'video',
    duration: '5 min',
    url: '#',
    completed: true,
  },
  {
    id: '3',
    title: 'Managing Documents & Assets',
    description: 'How to view, download, and organize your project documents.',
    category: 'guides',
    type: 'article',
    readTime: '4 min read',
    url: '#',
  },
  {
    id: '4',
    title: 'Communicating with Your Team',
    description: 'Best practices for messaging and getting quick responses.',
    category: 'guides',
    type: 'article',
    readTime: '3 min read',
    url: '#',
  },
  {
    id: '5',
    title: 'Paying Invoices Online',
    description: 'Secure payment options and viewing your billing history.',
    category: 'guides',
    type: 'article',
    readTime: '2 min read',
    url: '#',
  },
  {
    id: '6',
    title: 'AI Assistant Setup Guide',
    description: 'Complete guide to setting up and configuring your AI assistant.',
    category: 'documentation',
    type: 'document',
    url: '#',
  },
  {
    id: '7',
    title: 'Automation Workflow Documentation',
    description: 'Technical documentation for your custom automation workflows.',
    category: 'documentation',
    type: 'document',
    url: '#',
  },
  {
    id: '8',
    title: 'Website CMS Training',
    description: 'Learn how to update content on your new website.',
    category: 'videos',
    type: 'video',
    duration: '12 min',
    url: '#',
  },
  {
    id: '9',
    title: 'Analytics Dashboard Overview',
    description: 'Understanding your metrics and KPIs.',
    category: 'videos',
    type: 'video',
    duration: '8 min',
    url: '#',
  },
];

type CategoryFilter = 'all' | 'getting-started' | 'guides' | 'videos' | 'documentation';

export const PortalTraining: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);

  // Categories with icons
  const categories: { value: CategoryFilter; label: string; icon: React.ReactNode }[] = [
    { value: 'all', label: 'All Resources', icon: <BookOpen size={18} /> },
    { value: 'getting-started', label: 'Getting Started', icon: <Play size={18} /> },
    { value: 'guides', label: 'Guides', icon: <FileText size={18} /> },
    { value: 'videos', label: 'Video Tutorials', icon: <Video size={18} /> },
    { value: 'documentation', label: 'Documentation', icon: <File size={18} /> },
  ];

  // Filter modules
  const filteredModules = TRAINING_MODULES.filter((module) => {
    const matchesSearch = searchQuery
      ? module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesCategory = categoryFilter === 'all' || module.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Get completed count
  const completedCount = TRAINING_MODULES.filter(m => m.completed).length;
  const progressPercent = (completedCount / TRAINING_MODULES.length) * 100;

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play size={16} className="text-purple-500" />;
      case 'article':
        return <FileText size={16} className="text-blue-500" />;
      case 'document':
        return <File size={16} className="text-emerald-500" />;
      default:
        return <BookOpen size={16} className="text-gray-500" />;
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'getting-started': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      guides: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      videos: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
      documentation: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    };
    return colors[category] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  };

  return (
    <>
      <SEO
        title="Training Center | Client Portal"
        description="Access training materials, guides, and documentation for your projects."
      />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with progress */}
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

            {/* Progress indicator */}
            <div className="bg-white/10 rounded-xl p-4 min-w-[200px]">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-300">Your Progress</span>
                <span className="font-bold">{completedCount}/{TRAINING_MODULES.length}</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
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

        {/* Category tabs */}
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

        {/* Training modules grid */}
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
              Try adjusting your search or filter criteria.
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredModules.map((module, index) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => setSelectedModule(module)}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:border-gray-200 dark:hover:border-gray-700 transition-all cursor-pointer group"
                >
                  {/* Thumbnail or icon */}
                  <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-4">
                    {getTypeIcon(module.type)}
                  </div>

                  {/* Content */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                      {module.title}
                    </h3>
                    {module.completed && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    )}
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                    {module.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getCategoryColor(module.category)}`}>
                      {module.category.replace('-', ' ')}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                      <Clock size={12} />
                      <span>{module.duration || module.readTime}</span>
                    </div>
                  </div>

                  {/* Hover indicator */}
                  <div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors flex items-center gap-1">
                      {module.type === 'video' ? 'Watch' : 'Read'}
                      <ChevronRight size={16} />
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Module detail modal */}
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
                {/* Header */}
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

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {selectedModule.title}
                  </h2>

                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {selectedModule.description}
                  </p>

                  {/* Video placeholder */}
                  {selectedModule.type === 'video' && (
                    <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                          <Play size={24} className="text-white dark:text-gray-900 ml-1" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">
                          Video content would play here
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                          Duration: {selectedModule.duration}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Article/Document placeholder */}
                  {(selectedModule.type === 'article' || selectedModule.type === 'document') && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-6">
                      <p className="text-gray-600 dark:text-gray-400">
                        {selectedModule.type === 'article'
                          ? 'Full article content would be displayed here. This could include formatted text, images, code snippets, and step-by-step instructions.'
                          : 'This document is available for download. Click the button below to access the full documentation.'}
                      </p>
                    </div>
                  )}

                  {/* Meta info */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      <span>{selectedModule.duration || selectedModule.readTime}</span>
                    </div>
                    {selectedModule.completed && (
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={14} />
                        <span>Completed</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex gap-3">
                  <button
                    onClick={() => {
                      // In production, this would open the actual content
                      window.open(selectedModule.url, '_blank');
                    }}
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

        {/* Help section */}
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
