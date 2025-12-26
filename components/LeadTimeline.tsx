import React, { useState } from 'react';
import {
  MessageSquare,
  Activity,
  Send,
  Trash2,
  Clock,
  UserPlus,
  ArrowRightLeft,
  Pencil,
  X,
  Check,
  Loader2,
} from 'lucide-react';
import { useLeadNotes, TimelineItem } from '../hooks/useLeadNotes';
import { formatRelativeTime } from '../lib/utils';

interface LeadTimelineProps {
  leadId: string;
  leadName?: string;
}

export const LeadTimeline: React.FC<LeadTimelineProps> = ({ leadId, leadName }) => {
  const {
    timeline,
    isLoading,
    error,
    addNote,
    updateNote,
    deleteNote,
  } = useLeadNotes(leadId);

  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addNote(newNote);
      setNewNote('');
    } catch (error) {
      console.error('Failed to add note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: TimelineItem) => {
    setEditingNoteId(item.id);
    setEditContent(item.content);
  };

  const handleSaveEdit = async () => {
    if (!editingNoteId || !editContent.trim()) return;

    try {
      await updateNote(editingNoteId, editContent);
      setEditingNoteId(null);
      setEditContent('');
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  const handleDelete = async (noteId: string) => {
    try {
      await deleteNote(noteId);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const getActivityIcon = (item: TimelineItem) => {
    if (item.type === 'note') {
      return <MessageSquare size={16} className="text-blue-500" />;
    }

    switch (item.activityType) {
      case 'created':
        return <UserPlus size={16} className="text-emerald-500" />;
      case 'status_change':
        return <ArrowRightLeft size={16} className="text-orange-500" />;
      case 'note_added':
        return <MessageSquare size={16} className="text-blue-500" />;
      default:
        return <Activity size={16} className="text-gray-400" />;
    }
  };

  const getActivityColor = (item: TimelineItem): string => {
    if (item.type === 'note') {
      return 'bg-blue-50 dark:bg-blue-900/20';
    }

    switch (item.activityType) {
      case 'created':
        return 'bg-emerald-50 dark:bg-emerald-900/20';
      case 'status_change':
        return 'bg-orange-50 dark:bg-orange-900/20';
      default:
        return 'bg-gray-50 dark:bg-gray-800';
    }
  };

  const formatAuthor = (email: string | null): string => {
    if (!email) return 'System';
    // Extract name from email
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-xl">
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Clock size={20} className="text-gray-400" />
          Activity
          {leadName && <span className="text-gray-400 font-normal">for {leadName}</span>}
        </h3>
      </div>

      {/* Add Note Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-3">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            rows={2}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white placeholder:text-gray-400"
          />
          <button
            type="submit"
            disabled={isSubmitting || !newNote.trim()}
            className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed self-end transition-colors"
          >
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </form>

      {/* Timeline */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin text-gray-400" size={24} />
        </div>
      ) : (
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {timeline.map((item) => (
            <div key={item.id} className="flex gap-3 group">
              {/* Icon */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(item)}`}>
                {getActivityIcon(item)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {editingNoteId === item.id ? (
                  // Edit mode
                  <div className="flex gap-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={2}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                      autoFocus
                    />
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={handleSaveEdit}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => setEditingNoteId(null)}
                        className="p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap break-words">
                        {item.content}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatAuthor(item.author)} · {formatRelativeTime(item.created_at)}
                      </p>
                    </div>

                    {/* Actions for notes */}
                    {item.type === 'note' && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          title="Edit note"
                        >
                          <Pencil size={14} />
                        </button>
                        {deleteConfirm === item.id ? (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1 text-red-500 hover:text-red-600"
                              title="Confirm delete"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              title="Cancel"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(item.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete note"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {timeline.length === 0 && (
            <div className="text-center py-8">
              <Activity className="mx-auto mb-4 text-gray-300 dark:text-gray-600" size={48} />
              <p className="text-gray-500 dark:text-gray-400">No activity yet</p>
              <p className="text-sm text-gray-400 mt-1">Add a note to get started</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Compact version for inline display
export const LeadTimelineCompact: React.FC<{ leadId: string; maxItems?: number }> = ({
  leadId,
  maxItems = 5,
}) => {
  const { timeline, isLoading } = useLeadNotes(leadId);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <Loader2 size={14} className="animate-spin" />
        Loading...
      </div>
    );
  }

  const recentItems = timeline.slice(0, maxItems);

  if (recentItems.length === 0) {
    return (
      <p className="text-sm text-gray-400">No activity</p>
    );
  }

  return (
    <div className="space-y-2">
      {recentItems.map((item) => (
        <div key={item.id} className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">
            {item.type === 'note' ? '💬' : '📋'}
          </span>
          <span className="text-gray-600 dark:text-gray-400 truncate max-w-[200px]">
            {item.content}
          </span>
          <span className="text-gray-400 text-xs flex-shrink-0">
            {formatRelativeTime(item.created_at)}
          </span>
        </div>
      ))}
    </div>
  );
};
