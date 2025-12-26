import { useState, useCallback, useMemo, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { debounce } from '../lib/utils';

export interface SearchFilters {
  query: string;
  status?: string[];
  source?: string[];
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UseAdminSearchReturn<T> {
  results: T[];
  isLoading: boolean;
  error: string | null;
  filters: SearchFilters;
  setFilters: (filters: Partial<SearchFilters>) => void;
  setFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  resetFilters: () => void;
  totalCount: number;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  totalPages: number;
  hasActiveFilters: boolean;
}

const DEFAULT_FILTERS: SearchFilters = {
  query: '',
  status: [],
  source: [],
  sortBy: 'created_at',
  sortOrder: 'desc',
};

const STORAGE_KEY_PREFIX = 'admin_filters_';

export function useAdminSearch<T>(
  table: 'leads' | 'bookings' | 'newsletter_subscribers' | 'teardown_requests' | 'resource_downloads',
  pageSize = 25,
  persistFilters = true
): UseAdminSearchReturn<T> {
  // Load initial filters from localStorage
  const getInitialFilters = (): SearchFilters => {
    if (!persistFilters) return DEFAULT_FILTERS;
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${table}`);
      if (stored) {
        return { ...DEFAULT_FILTERS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to load filters from localStorage:', e);
    }
    return DEFAULT_FILTERS;
  };

  const [results, setResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<SearchFilters>(getInitialFilters);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  // Save filters to localStorage when they change
  useEffect(() => {
    if (persistFilters) {
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}${table}`, JSON.stringify(filters));
      } catch (e) {
        console.warn('Failed to save filters to localStorage:', e);
      }
    }
  }, [filters, table, persistFilters]);

  const fetchResults = useCallback(async (currentFilters: SearchFilters, currentPage: number) => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from(table)
        .select('*', { count: 'exact' });

      // Text search - search across name and email fields
      if (currentFilters.query && currentFilters.query.trim()) {
        const searchTerm = currentFilters.query.trim();
        // Different tables have different searchable fields
        if (table === 'leads') {
          query = query.or(
            `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,message.ilike.%${searchTerm}%`
          );
        } else if (table === 'bookings') {
          query = query.or(
            `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,notes.ilike.%${searchTerm}%`
          );
        } else if (table === 'newsletter_subscribers' || table === 'resource_downloads') {
          query = query.ilike('email', `%${searchTerm}%`);
        } else if (table === 'teardown_requests') {
          query = query.or(
            `email.ilike.%${searchTerm}%,website_url.ilike.%${searchTerm}%`
          );
        }
      }

      // Status filter
      if (currentFilters.status && currentFilters.status.length > 0) {
        query = query.in('status', currentFilters.status);
      }

      // Source filter
      if (currentFilters.source && currentFilters.source.length > 0) {
        query = query.in('source', currentFilters.source);
      }

      // Date range filter
      const dateField = table === 'newsletter_subscribers' ? 'subscribed_at'
        : table === 'resource_downloads' ? 'downloaded_at'
        : table === 'bookings' ? 'scheduled_time'
        : 'created_at';

      if (currentFilters.dateFrom) {
        query = query.gte(dateField, currentFilters.dateFrom);
      }
      if (currentFilters.dateTo) {
        // Add 1 day to include the entire end date
        const endDate = new Date(currentFilters.dateTo);
        endDate.setDate(endDate.getDate() + 1);
        query = query.lt(dateField, endDate.toISOString().split('T')[0]);
      }

      // Sorting
      const sortField = currentFilters.sortBy || dateField;
      query = query.order(sortField, { ascending: currentFilters.sortOrder === 'asc' });

      // Pagination
      const from = (currentPage - 1) * pageSize;
      query = query.range(from, from + pageSize - 1);

      const { data, error: queryError, count } = await query;

      if (queryError) throw queryError;

      setResults((data as T[]) || []);
      setTotalCount(count || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [table, pageSize]);

  // Debounced fetch for query changes
  const debouncedFetch = useMemo(
    () => debounce((currentFilters: SearchFilters, currentPage: number) => {
      fetchResults(currentFilters, currentPage);
    }, 300),
    [fetchResults]
  );

  // Initial fetch
  useEffect(() => {
    fetchResults(filters, page);
  }, []); // Only on mount

  const setFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFiltersState(prev => {
      const updated = { ...prev, ...newFilters };
      // If query changed, use debounced fetch
      if (newFilters.query !== undefined && newFilters.query !== prev.query) {
        debouncedFetch(updated, 1);
      } else {
        // For other filters, fetch immediately
        fetchResults(updated, 1);
      }
      setPage(1);
      return updated;
    });
  }, [debouncedFetch, fetchResults]);

  const setFilter = useCallback(<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters({ [key]: value });
  }, [setFilters]);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
    setPage(1);
    fetchResults(DEFAULT_FILTERS, 1);
    if (persistFilters) {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}${table}`);
    }
  }, [fetchResults, table, persistFilters]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    fetchResults(filters, newPage);
  }, [fetchResults, filters]);

  const hasActiveFilters = !!(
    filters.query ||
    (filters.status && filters.status.length > 0) ||
    (filters.source && filters.source.length > 0) ||
    filters.dateFrom ||
    filters.dateTo
  );

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    results,
    isLoading,
    error,
    filters,
    setFilters,
    setFilter,
    resetFilters,
    totalCount,
    page,
    setPage: handlePageChange,
    pageSize,
    totalPages,
    hasActiveFilters,
  };
}
