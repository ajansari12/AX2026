import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { convertToCSV, downloadFile } from '../lib/utils';

type ExportFormat = 'csv' | 'json';

interface ExportOptions {
  table: string;
  filters?: Record<string, any>;
  columns?: string[];
  format?: ExportFormat;
  filename?: string;
}

interface ExportResult {
  success: boolean;
  count?: number;
  error?: string;
}

export function useDataExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const exportData = async ({
    table,
    filters = {},
    columns,
    format = 'csv',
    filename,
  }: ExportOptions): Promise<ExportResult> => {
    setIsExporting(true);
    setProgress(0);

    try {
      // Fetch all data (paginated for large datasets)
      let allData: any[] = [];
      let page = 0;
      const pageSize = 1000;
      let hasMore = true;

      while (hasMore) {
        let query = supabase.from(table).select(columns?.join(',') || '*');

        // Apply filters
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value) && value.length > 0) {
              query = query.in(key, value);
            } else if (typeof value === 'string' && value.includes('%')) {
              // Handle LIKE patterns
              query = query.ilike(key, value);
            } else if (!Array.isArray(value)) {
              query = query.eq(key, value);
            }
          }
        });

        // Order by created_at descending for consistent export
        query = query.order('created_at', { ascending: false });

        const { data, error } = await query
          .range(page * pageSize, (page + 1) * pageSize - 1);

        if (error) throw error;

        if (data && data.length > 0) {
          allData = [...allData, ...data];
          page++;
          setProgress(Math.min(90, page * 10));
        } else {
          hasMore = false;
        }

        // Safety check to prevent infinite loops
        if (page > 100) {
          console.warn('Export stopped: too many pages');
          break;
        }
      }

      if (allData.length === 0) {
        setProgress(100);
        return { success: true, count: 0 };
      }

      // Clean up data for export (remove internal fields, format dates)
      const cleanedData = allData.map(row => {
        const cleaned: Record<string, any> = {};
        Object.entries(row).forEach(([key, value]) => {
          // Skip internal fields
          if (key.startsWith('_')) return;

          // Format dates
          if (value && typeof value === 'string' &&
              (key.includes('_at') || key.includes('date') || key.includes('time'))) {
            try {
              cleaned[key] = new Date(value).toLocaleString();
            } catch {
              cleaned[key] = value;
            }
          } else if (typeof value === 'object' && value !== null) {
            // Stringify objects/arrays
            cleaned[key] = JSON.stringify(value);
          } else {
            cleaned[key] = value;
          }
        });
        return cleaned;
      });

      // Convert to desired format
      let content: string;
      let mimeType: string;
      let extension: string;

      if (format === 'csv') {
        content = convertToCSV(cleanedData);
        mimeType = 'text/csv;charset=utf-8;';
        extension = 'csv';
      } else {
        content = JSON.stringify(cleanedData, null, 2);
        mimeType = 'application/json';
        extension = 'json';
      }

      // Generate filename with date
      const dateStr = new Date().toISOString().split('T')[0];
      const exportFilename = `${filename || table}_${dateStr}.${extension}`;

      // Download file
      downloadFile(content, exportFilename, mimeType);

      setProgress(100);
      return { success: true, count: cleanedData.length };
    } catch (error) {
      console.error('Export failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Export failed'
      };
    } finally {
      setIsExporting(false);
      // Reset progress after a short delay
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return { exportData, isExporting, progress };
}
