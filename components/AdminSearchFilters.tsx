import React, { useState } from 'react';
import { Search, X, Calendar, ChevronDown, Download, Loader2 } from 'lucide-react';
import type { SearchFilters } from '../hooks/useAdminSearch';
import { useDataExport } from '../hooks/useDataExport';

interface FilterOption {
  value: string;
  label: string;
}

interface AdminSearchFiltersProps {
  filters: SearchFilters;
  onFilterChange: (filters: Partial<SearchFilters>) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  statusOptions?: FilterOption[];
  sourceOptions?: FilterOption[];
  totalCount: number;
  tableName: string;
  showExport?: boolean;
}

export const AdminSearchFilters: React.FC<AdminSearchFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  hasActiveFilters,
  statusOptions = [],
  sourceOptions = [],
  totalCount,
  tableName,
  showExport = true,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { exportData, isExporting, progress } = useDataExport();

  const handleExport = async (format: 'csv' | 'json') => {
    const result = await exportData({
      table: tableName,
      filters: {
        ...(filters.status?.length ? { status: filters.status } : {}),
        ...(filters.source?.length ? { source: filters.source } : {}),
      },
      format,
      filename: tableName,
    });

    if (result.success) {
      console.log(`Exported ${result.count} records`);
    } else {
      console.error('Export failed:', result.error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 mb-6 space-y-4">
      {/* Top row: Search and Actions */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email..."
            value={filters.query}
            onChange={(e) => onFilterChange({ query: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-all"
          />
          {filters.query && (
            <button
              onClick={() => onFilterChange({ query: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap gap-2">
          {/* Status Filter */}
          {statusOptions.length > 0 && (
            <div className="relative">
              <select
                value={filters.status?.[0] || ''}
                onChange={(e) => onFilterChange({ status: e.target.value ? [e.target.value] : [] })}
                className="appearance-none px-4 py-2.5 pr-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
              >
                <option value="">All Status</option>
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          )}

          {/* Source Filter */}
          {sourceOptions.length > 0 && (
            <div className="relative">
              <select
                value={filters.source?.[0] || ''}
                onChange={(e) => onFilterChange({ source: e.target.value ? [e.target.value] : [] })}
                className="appearance-none px-4 py-2.5 pr-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
              >
                <option value="">All Sources</option>
                {sourceOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          )}

          {/* Date Range Toggle */}
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all ${
              filters.dateFrom || filters.dateTo
                ? 'border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <Calendar size={16} />
            <span>Date Range</span>
          </button>

          {/* Reset Button */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-4 py-2.5 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <X size={16} />
              Clear Filters
            </button>
          )}
        </div>

        {/* Export Buttons */}
        {showExport && (
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('csv')}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{progress}%</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>CSV</span>
                </>
              )}
            </button>
            <button
              onClick={() => handleExport('json')}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>JSON</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Date Range Picker */}
      {showDatePicker && (
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500 dark:text-gray-400">From:</label>
            <input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => onFilterChange({ dateFrom: e.target.value || undefined })}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500 dark:text-gray-400">To:</label>
            <input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => onFilterChange({ dateTo: e.target.value || undefined })}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
            />
          </div>
          {(filters.dateFrom || filters.dateTo) && (
            <button
              onClick={() => onFilterChange({ dateFrom: undefined, dateTo: undefined })}
              className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              Clear dates
            </button>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <span>
          {totalCount} {totalCount === 1 ? 'result' : 'results'} found
          {hasActiveFilters && ' (filtered)'}
        </span>
      </div>
    </div>
  );
};

// Pagination component
interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (page > 3) {
      pages.push('...');
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (page < totalPages - 2) {
      pages.push('...');
    }

    if (!pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        Previous
      </button>

      <div className="flex gap-1">
        {getVisiblePages().map((p, i) => (
          typeof p === 'number' ? (
            <button
              key={i}
              onClick={() => onPageChange(p)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              {p}
            </button>
          ) : (
            <span key={i} className="w-10 h-10 flex items-center justify-center text-gray-400">
              {p}
            </span>
          )
        ))}
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        Next
      </button>
    </div>
  );
};
