import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface BulkActionResult {
  success: number;
  failed: number;
  errors: string[];
}

export function useBulkActions<T extends { id: string }>(tableName: string) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<BulkActionResult | null>(null);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const selectAll = useCallback((items: T[]) => {
    setSelectedIds(new Set(items.map(item => item.id)));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isSelected = useCallback((id: string) => {
    return selectedIds.has(id);
  }, [selectedIds]);

  const bulkUpdateStatus = useCallback(async (newStatus: string) => {
    if (selectedIds.size === 0) return null;

    setIsProcessing(true);
    const result: BulkActionResult = { success: 0, failed: 0, errors: [] };

    try {
      const ids = Array.from(selectedIds);

      const { error } = await supabase
        .from(tableName)
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .in('id', ids);

      if (error) {
        result.failed = ids.length;
        result.errors.push(error.message);
      } else {
        result.success = ids.length;
        clearSelection();
      }
    } catch (err) {
      result.failed = selectedIds.size;
      result.errors.push(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsProcessing(false);
      setLastResult(result);
    }

    return result;
  }, [selectedIds, tableName, clearSelection]);

  const bulkDelete = useCallback(async () => {
    if (selectedIds.size === 0) return null;

    setIsProcessing(true);
    const result: BulkActionResult = { success: 0, failed: 0, errors: [] };

    try {
      const ids = Array.from(selectedIds);

      const { error } = await supabase
        .from(tableName)
        .delete()
        .in('id', ids);

      if (error) {
        result.failed = ids.length;
        result.errors.push(error.message);
      } else {
        result.success = ids.length;
        clearSelection();
      }
    } catch (err) {
      result.failed = selectedIds.size;
      result.errors.push(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsProcessing(false);
      setLastResult(result);
    }

    return result;
  }, [selectedIds, tableName, clearSelection]);

  const bulkExport = useCallback(async (items: T[], filename: string = 'export.csv') => {
    if (selectedIds.size === 0) return;

    const selectedItems = items.filter(item => selectedIds.has(item.id));
    if (selectedItems.length === 0) return;

    // Convert to CSV
    const headers = Object.keys(selectedItems[0]);
    const csvContent = [
      headers.join(','),
      ...selectedItems.map(item =>
        headers.map(header => {
          const value = (item as Record<string, unknown>)[header];
          if (value === null || value === undefined) return '';
          if (typeof value === 'object') return JSON.stringify(value).replace(/"/g, '""');
          return String(value).includes(',') ? `"${value}"` : String(value);
        }).join(',')
      ),
    ].join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [selectedIds]);

  return {
    selectedIds,
    selectedCount: selectedIds.size,
    isProcessing,
    lastResult,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
    bulkUpdateStatus,
    bulkDelete,
    bulkExport,
  };
}
