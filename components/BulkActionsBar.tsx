import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Trash2, Download, Tag, CheckSquare, Square, AlertTriangle,
  Loader2,
} from 'lucide-react';

interface BulkActionsBarProps {
  selectedCount: number;
  totalCount: number;
  isProcessing: boolean;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkDelete: () => Promise<void>;
  onBulkExport: () => void;
  onBulkStatusChange: (status: string) => Promise<void>;
  statusOptions: { value: string; label: string; color?: string }[];
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  totalCount,
  isProcessing,
  onSelectAll,
  onClearSelection,
  onBulkDelete,
  onBulkExport,
  onBulkStatusChange,
  statusOptions,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const handleDelete = async () => {
    await onBulkDelete();
    setShowDeleteConfirm(false);
  };

  const handleStatusChange = async (status: string) => {
    await onBulkStatusChange(status);
    setShowStatusMenu(false);
  };

  if (selectedCount === 0) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-6"
        >
          {/* Selection info */}
          <div className="flex items-center gap-3">
            <button
              onClick={selectedCount === totalCount ? onClearSelection : onSelectAll}
              className="p-1 hover:bg-white/10 dark:hover:bg-gray-900/10 rounded"
            >
              {selectedCount === totalCount ? (
                <CheckSquare className="w-5 h-5" />
              ) : (
                <Square className="w-5 h-5" />
              )}
            </button>
            <span className="font-medium">
              {selectedCount} of {totalCount} selected
            </span>
          </div>

          <div className="w-px h-6 bg-white/20 dark:bg-gray-900/20" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Status change dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                disabled={isProcessing}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 dark:bg-gray-900/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-colors disabled:opacity-50"
              >
                <Tag className="w-4 h-4" />
                <span>Change Status</span>
              </button>

              <AnimatePresence>
                {showStatusMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 min-w-[160px]"
                  >
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleStatusChange(option.value)}
                        className="w-full px-4 py-2 text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        {option.color && (
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: option.color }}
                          />
                        )}
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Export */}
            <button
              onClick={onBulkExport}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 dark:bg-gray-900/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>

            {/* Delete */}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>

          <div className="w-px h-6 bg-white/20 dark:bg-gray-900/20" />

          {/* Clear selection */}
          <button
            onClick={onClearSelection}
            className="p-2 hover:bg-white/10 dark:hover:bg-gray-900/10 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Loading indicator */}
          {isProcessing && (
            <div className="absolute inset-0 bg-gray-900/80 dark:bg-white/80 rounded-2xl flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Delete {selectedCount} items?
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
