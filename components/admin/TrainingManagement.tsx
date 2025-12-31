import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Plus, Edit2, Trash2, Save, X, Video, FileText, File,
  GripVertical, Eye, EyeOff, Users, Clock, Search, Filter
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface TrainingModule {
  id: string;
  title: string;
  description: string | null;
  category: 'getting-started' | 'guides' | 'videos' | 'documentation';
  type: 'video' | 'article' | 'document';
  content_url: string | null;
  content_body: string | null;
  duration: string | null;
  read_time: string | null;
  thumbnail_url: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  assignment_count?: number;
}

const CATEGORIES = [
  { value: 'getting-started', label: 'Getting Started', icon: BookOpen },
  { value: 'guides', label: 'Guides', icon: FileText },
  { value: 'videos', label: 'Videos', icon: Video },
  { value: 'documentation', label: 'Documentation', icon: File },
];

const TYPES = [
  { value: 'video', label: 'Video' },
  { value: 'article', label: 'Article' },
  { value: 'document', label: 'Document' },
];

const emptyModule: Partial<TrainingModule> = {
  title: '',
  description: '',
  category: 'guides',
  type: 'article',
  content_url: '',
  content_body: '',
  duration: '',
  read_time: '',
  thumbnail_url: '',
  order_index: 0,
  is_active: true,
};

export const TrainingManagement: React.FC = () => {
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showEditor, setShowEditor] = useState(false);
  const [editingModule, setEditingModule] = useState<Partial<TrainingModule> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    setIsLoading(true);
    try {
      const { data: modulesData, error: modulesError } = await supabase
        .from('training_modules')
        .select('*')
        .order('category')
        .order('order_index');

      if (modulesError) throw modulesError;

      const { data: assignmentCounts } = await supabase
        .from('client_training_assignments')
        .select('module_id');

      const countMap: Record<string, number> = {};
      (assignmentCounts || []).forEach((a) => {
        countMap[a.module_id] = (countMap[a.module_id] || 0) + 1;
      });

      setModules(
        (modulesData || []).map((m) => ({
          ...m,
          assignment_count: countMap[m.id] || 0,
        }))
      );
    } catch (err) {
      console.error('Error fetching modules:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingModule?.title) {
      alert('Please enter a title');
      return;
    }

    setIsSaving(true);
    try {
      const moduleData = {
        title: editingModule.title,
        description: editingModule.description || null,
        category: editingModule.category,
        type: editingModule.type,
        content_url: editingModule.content_url || null,
        content_body: editingModule.content_body || null,
        duration: editingModule.type === 'video' ? editingModule.duration : null,
        read_time: editingModule.type === 'article' ? editingModule.read_time : null,
        thumbnail_url: editingModule.thumbnail_url || null,
        order_index: editingModule.order_index || 0,
        is_active: editingModule.is_active ?? true,
      };

      if (editingModule.id) {
        const { error } = await supabase
          .from('training_modules')
          .update(moduleData)
          .eq('id', editingModule.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('training_modules')
          .insert(moduleData);
        if (error) throw error;
      }

      setShowEditor(false);
      setEditingModule(null);
      fetchModules();
    } catch (err) {
      console.error('Error saving module:', err);
      alert('Failed to save module');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleActive = async (module: TrainingModule) => {
    try {
      const { error } = await supabase
        .from('training_modules')
        .update({ is_active: !module.is_active })
        .eq('id', module.id);
      if (error) throw error;
      fetchModules();
    } catch (err) {
      console.error('Error toggling module:', err);
    }
  };

  const deleteModule = async (id: string) => {
    if (!confirm('Delete this training module? This will also remove all client assignments.')) return;
    try {
      const { error } = await supabase
        .from('training_modules')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchModules();
    } catch (err) {
      console.error('Error deleting module:', err);
    }
  };

  const filteredModules = modules.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const groupedModules = CATEGORIES.map((cat) => ({
    ...cat,
    modules: filteredModules.filter((m) => m.category === cat.value),
  })).filter((g) => categoryFilter === 'all' || g.value === categoryFilter);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'article': return FileText;
      default: return File;
    }
  };

  if (showEditor && editingModule) {
    return (
      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {editingModule.id ? 'Edit Module' : 'Create Module'}
            </h1>
            <button
              onClick={() => {
                setShowEditor(false);
                setEditingModule(null);
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={editingModule.title || ''}
                onChange={(e) => setEditingModule({ ...editingModule, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Module title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={editingModule.description || ''}
                onChange={(e) => setEditingModule({ ...editingModule, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of this module"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={editingModule.category || 'guides'}
                  onChange={(e) => setEditingModule({ ...editingModule, category: e.target.value as TrainingModule['category'] })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={editingModule.type || 'article'}
                  onChange={(e) => setEditingModule({ ...editingModule, type: e.target.value as TrainingModule['type'] })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  {TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {editingModule.type === 'video' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Video URL
                  </label>
                  <input
                    type="url"
                    value={editingModule.content_url || ''}
                    onChange={(e) => setEditingModule({ ...editingModule, content_url: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={editingModule.duration || ''}
                    onChange={(e) => setEditingModule({ ...editingModule, duration: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="5 min"
                  />
                </div>
              </div>
            )}

            {editingModule.type === 'article' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={editingModule.read_time || ''}
                    onChange={(e) => setEditingModule({ ...editingModule, read_time: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="3 min read"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Content (Markdown/HTML)
                  </label>
                  <textarea
                    value={editingModule.content_body || ''}
                    onChange={(e) => setEditingModule({ ...editingModule, content_body: e.target.value })}
                    rows={10}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder="# Article Content&#10;&#10;Write your article content here..."
                  />
                </div>
              </>
            )}

            {editingModule.type === 'document' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Document URL
                </label>
                <input
                  type="url"
                  value={editingModule.content_url || ''}
                  onChange={(e) => setEditingModule({ ...editingModule, content_url: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Thumbnail URL (optional)
              </label>
              <input
                type="url"
                value={editingModule.thumbnail_url || ''}
                onChange={(e) => setEditingModule({ ...editingModule, thumbnail_url: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={editingModule.order_index || 0}
                  onChange={(e) => setEditingModule({ ...editingModule, order_index: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingModule.is_active ?? true}
                    onChange={(e) => setEditingModule({ ...editingModule, is_active: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Active (visible to clients)</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setShowEditor(false);
                  setEditingModule(null);
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Module'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Training Modules</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Create and manage training content for clients
          </p>
        </div>
        <button
          onClick={() => {
            setEditingModule({ ...emptyModule });
            setShowEditor(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          New Module
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search modules..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500">Total Modules</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{modules.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-green-600">{modules.filter((m) => m.is_active).length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500">Videos</p>
          <p className="text-2xl font-bold text-blue-600">{modules.filter((m) => m.type === 'video').length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500">Total Assignments</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {modules.reduce((sum, m) => sum + (m.assignment_count || 0), 0)}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : (
        <div className="space-y-6">
          {groupedModules.map((group) => (
            <div key={group.value}>
              <div className="flex items-center gap-2 mb-3">
                <group.icon className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{group.label}</h2>
                <span className="text-sm text-gray-500">({group.modules.length})</span>
              </div>

              {group.modules.length === 0 ? (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 text-center text-gray-500">
                  No modules in this category
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {group.modules.map((module) => {
                      const TypeIcon = getTypeIcon(module.type);
                      return (
                        <motion.div
                          key={module.id}
                          layout
                          className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                              <TypeIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                  {module.title}
                                </h3>
                                {!module.is_active && (
                                  <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-full">
                                    Inactive
                                  </span>
                                )}
                              </div>
                              {module.description && (
                                <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                                  {module.description}
                                </p>
                              )}
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {module.duration || module.read_time || 'No duration'}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {module.assignment_count || 0} assigned
                                </span>
                                <span>Order: {module.order_index}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleActive(module)}
                                className={`p-2 rounded-lg transition-colors ${
                                  module.is_active
                                    ? 'hover:bg-yellow-100 text-yellow-600'
                                    : 'hover:bg-green-100 text-green-600'
                                }`}
                                title={module.is_active ? 'Deactivate' : 'Activate'}
                              >
                                {module.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => {
                                  setEditingModule(module);
                                  setShowEditor(true);
                                }}
                                className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 rounded-lg"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteModule(module.id)}
                                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
