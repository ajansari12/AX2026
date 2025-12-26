# Feature Specifications

Detailed implementation guides for priority features.

---

## 1. Admin Search & Filtering

### Overview
Add comprehensive search and filtering to the admin panel that works across all data types.

### Database Changes

```sql
-- Add full-text search indexes (Supabase migration)
-- migrations/20251226_add_search_indexes.sql

-- Add search index to leads
CREATE INDEX leads_search_idx ON leads
USING GIN (to_tsvector('english', coalesce(name, '') || ' ' || coalesce(email, '') || ' ' || coalesce(message, '')));

-- Add search index to chat messages
CREATE INDEX chat_messages_search_idx ON chat_messages
USING GIN (to_tsvector('english', content));
```

### New Hook: useAdminSearch.ts

```typescript
import { useState, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { debounce } from '../lib/utils';

interface SearchFilters {
  query: string;
  status?: string[];
  source?: string[];
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface UseAdminSearchReturn<T> {
  results: T[];
  isLoading: boolean;
  error: string | null;
  filters: SearchFilters;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  totalCount: number;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
}

const DEFAULT_FILTERS: SearchFilters = {
  query: '',
  status: [],
  source: [],
  sortBy: 'created_at',
  sortOrder: 'desc',
};

export function useAdminSearch<T>(
  table: 'leads' | 'bookings' | 'newsletter_subscribers',
  pageSize = 25
): UseAdminSearchReturn<T> {
  const [results, setResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const fetchResults = useCallback(async (currentFilters: SearchFilters, currentPage: number) => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from(table)
        .select('*', { count: 'exact' });

      // Text search
      if (currentFilters.query) {
        query = query.or(
          `name.ilike.%${currentFilters.query}%,email.ilike.%${currentFilters.query}%`
        );
      }

      // Status filter
      if (currentFilters.status?.length) {
        query = query.in('status', currentFilters.status);
      }

      // Source filter
      if (currentFilters.source?.length) {
        query = query.in('source', currentFilters.source);
      }

      // Date range
      if (currentFilters.dateFrom) {
        query = query.gte('created_at', currentFilters.dateFrom);
      }
      if (currentFilters.dateTo) {
        query = query.lte('created_at', currentFilters.dateTo);
      }

      // Sorting
      query = query.order(
        currentFilters.sortBy || 'created_at',
        { ascending: currentFilters.sortOrder === 'asc' }
      );

      // Pagination
      const from = (currentPage - 1) * pageSize;
      query = query.range(from, from + pageSize - 1);

      const { data, error: queryError, count } = await query;

      if (queryError) throw queryError;

      setResults(data as T[]);
      setTotalCount(count || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsLoading(false);
    }
  }, [table, pageSize]);

  // Debounced search
  const debouncedFetch = useMemo(
    () => debounce(fetchResults, 300),
    [fetchResults]
  );

  const setFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFiltersState(prev => {
      const updated = { ...prev, ...newFilters };
      debouncedFetch(updated, 1);
      setPage(1);
      return updated;
    });
  }, [debouncedFetch]);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
    setPage(1);
    fetchResults(DEFAULT_FILTERS, 1);
  }, [fetchResults]);

  return {
    results,
    isLoading,
    error,
    filters,
    setFilters,
    resetFilters,
    totalCount,
    page,
    setPage: (newPage: number) => {
      setPage(newPage);
      fetchResults(filters, newPage);
    },
    pageSize,
  };
}
```

### UI Component: SearchFilters.tsx

```typescript
import React from 'react';
import { Search, X, Calendar, Filter } from 'lucide-react';

interface SearchFiltersProps {
  query: string;
  onQueryChange: (query: string) => void;
  statusOptions: { value: string; label: string }[];
  selectedStatuses: string[];
  onStatusChange: (statuses: string[]) => void;
  sourceOptions: { value: string; label: string }[];
  selectedSources: string[];
  onSourceChange: (sources: string[]) => void;
  dateFrom?: string;
  dateTo?: string;
  onDateChange: (from?: string, to?: string) => void;
  onReset: () => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  query,
  onQueryChange,
  statusOptions,
  selectedStatuses,
  onStatusChange,
  sourceOptions,
  selectedSources,
  onSourceChange,
  dateFrom,
  dateTo,
  onDateChange,
  onReset,
}) => {
  const hasActiveFilters = query || selectedStatuses.length || selectedSources.length || dateFrom || dateTo;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            multiple
            value={selectedStatuses}
            onChange={(e) => onStatusChange(Array.from(e.target.selectedOptions, o => o.value))}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 min-w-[150px]"
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Source Filter */}
        <div className="relative">
          <select
            multiple
            value={selectedSources}
            onChange={(e) => onSourceChange(Array.from(e.target.selectedOptions, o => o.value))}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 min-w-[150px]"
          >
            {sourceOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFrom || ''}
            onChange={(e) => onDateChange(e.target.value, dateTo)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
          />
          <span className="text-gray-400">to</span>
          <input
            type="date"
            value={dateTo || ''}
            onChange={(e) => onDateChange(dateFrom, e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
          />
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2.5 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <X size={16} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};
```

---

## 2. Data Export Functionality

### New Hook: useDataExport.ts

```typescript
import { useState } from 'react';
import { supabase } from '../lib/supabase';

type ExportFormat = 'csv' | 'json';

interface ExportOptions {
  table: string;
  filters?: Record<string, any>;
  columns?: string[];
  format?: ExportFormat;
  filename?: string;
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
  }: ExportOptions) => {
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
          if (Array.isArray(value)) {
            query = query.in(key, value);
          } else if (value) {
            query = query.eq(key, value);
          }
        });

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
      }

      // Convert to desired format
      let content: string;
      let mimeType: string;
      let extension: string;

      if (format === 'csv') {
        content = convertToCSV(allData);
        mimeType = 'text/csv';
        extension = 'csv';
      } else {
        content = JSON.stringify(allData, null, 2);
        mimeType = 'application/json';
        extension = 'json';
      }

      // Download file
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename || table}_${new Date().toISOString().split('T')[0]}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setProgress(100);
      return { success: true, count: allData.length };
    } catch (error) {
      console.error('Export failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Export failed' };
    } finally {
      setIsExporting(false);
    }
  };

  return { exportData, isExporting, progress };
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const rows = data.map(row =>
    headers.map(header => {
      const value = row[header];
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      if (value === null || value === undefined) return '';
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}
```

### Export Button Component

```typescript
import React from 'react';
import { Download, Loader2 } from 'lucide-react';
import { useDataExport } from '../hooks/useDataExport';

interface ExportButtonProps {
  table: string;
  filters?: Record<string, any>;
  label?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  table,
  filters,
  label = 'Export',
}) => {
  const { exportData, isExporting, progress } = useDataExport();

  const handleExport = async () => {
    const result = await exportData({
      table,
      filters,
      format: 'csv',
    });

    if (result.success) {
      // Show success toast
      console.log(`Exported ${result.count} records`);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
    >
      {isExporting ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          <span>{progress}%</span>
        </>
      ) : (
        <>
          <Download size={16} />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
```

---

## 3. Lead Notes & Activity Timeline

### Database Schema

```sql
-- migrations/20251226_add_lead_notes.sql

-- Notes table
CREATE TABLE lead_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity log table
CREATE TABLE lead_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'status_change', 'note_added', 'email_sent', 'call_made', etc.
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  actor_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX lead_notes_lead_id_idx ON lead_notes(lead_id);
CREATE INDEX lead_activity_lead_id_idx ON lead_activity(lead_id);
CREATE INDEX lead_activity_created_at_idx ON lead_activity(created_at DESC);

-- RLS Policies
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read notes"
  ON lead_notes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert notes"
  ON lead_notes FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Trigger to auto-log status changes
CREATE OR REPLACE FUNCTION log_lead_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO lead_activity (lead_id, activity_type, description, metadata)
    VALUES (
      NEW.id,
      'status_change',
      'Status changed from ' || OLD.status || ' to ' || NEW.status,
      jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lead_status_change_trigger
  AFTER UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION log_lead_status_change();
```

### Hook: useLeadNotes.ts

```typescript
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface LeadNote {
  id: string;
  lead_id: string;
  content: string;
  author_email: string;
  created_at: string;
}

interface LeadActivity {
  id: string;
  lead_id: string;
  activity_type: string;
  description: string;
  metadata: Record<string, any>;
  actor_email: string | null;
  created_at: string;
}

export function useLeadNotes(leadId: string) {
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    const [notesResult, activitiesResult] = await Promise.all([
      supabase
        .from('lead_notes')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false }),
      supabase
        .from('lead_activity')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false })
        .limit(50),
    ]);

    if (notesResult.data) setNotes(notesResult.data);
    if (activitiesResult.data) setActivities(activitiesResult.data);
    setIsLoading(false);
  }, [leadId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addNote = async (content: string) => {
    const { data: session } = await supabase.auth.getSession();
    const email = session.session?.user?.email || 'unknown';

    const { data, error } = await supabase
      .from('lead_notes')
      .insert({
        lead_id: leadId,
        content,
        author_email: email,
      })
      .select()
      .single();

    if (error) throw error;

    // Also log as activity
    await supabase.from('lead_activity').insert({
      lead_id: leadId,
      activity_type: 'note_added',
      description: 'Note added',
      actor_email: email,
    });

    setNotes(prev => [data, ...prev]);
    return data;
  };

  const deleteNote = async (noteId: string) => {
    await supabase.from('lead_notes').delete().eq('id', noteId);
    setNotes(prev => prev.filter(n => n.id !== noteId));
  };

  // Combine notes and activities into timeline
  const timeline = [...notes.map(n => ({
    id: n.id,
    type: 'note' as const,
    content: n.content,
    author: n.author_email,
    created_at: n.created_at,
  })), ...activities.map(a => ({
    id: a.id,
    type: 'activity' as const,
    content: a.description,
    author: a.actor_email,
    created_at: a.created_at,
    activityType: a.activity_type,
  }))].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return {
    notes,
    activities,
    timeline,
    isLoading,
    addNote,
    deleteNote,
    refetch: fetchData,
  };
}
```

### Component: LeadTimeline.tsx

```typescript
import React, { useState } from 'react';
import { MessageSquare, Activity, Send, Trash2, Clock } from 'lucide-react';
import { useLeadNotes } from '../hooks/useLeadNotes';
import { formatDistanceToNow } from 'date-fns';

interface LeadTimelineProps {
  leadId: string;
}

export const LeadTimeline: React.FC<LeadTimelineProps> = ({ leadId }) => {
  const { timeline, isLoading, addNote, deleteNote } = useLeadNotes(leadId);
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsSubmitting(true);
    try {
      await addNote(newNote);
      setNewNote('');
    } catch (error) {
      console.error('Failed to add note:', error);
    }
    setIsSubmitting(false);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'note':
        return <MessageSquare size={16} className="text-blue-500" />;
      case 'status_change':
        return <Activity size={16} className="text-orange-500" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Activity</h3>

      {/* Add Note Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-3">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            rows={2}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
          />
          <button
            type="submit"
            disabled={isSubmitting || !newNote.trim()}
            className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 self-end"
          >
            <Send size={18} />
          </button>
        </div>
      </form>

      {/* Timeline */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {timeline.map((item) => (
          <div key={item.id} className="flex gap-3 group">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              {getActivityIcon(item.type === 'note' ? 'note' : item.activityType || 'activity')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-gray-900 dark:text-white">{item.content}</p>
                {item.type === 'note' && (
                  <button
                    onClick={() => deleteNote(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {item.author && `${item.author} · `}
                {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}

        {timeline.length === 0 && !isLoading && (
          <p className="text-center text-gray-400 py-8">No activity yet</p>
        )}
      </div>
    </div>
  );
};
```

---

## 4. Spam Protection

### Install Dependencies

```bash
npm install @hcaptcha/react-hcaptcha
```

### Environment Variables

```env
VITE_HCAPTCHA_SITE_KEY=your-site-key
HCAPTCHA_SECRET_KEY=your-secret-key # Server-side only
```

### Updated Contact Form with hCaptcha

```typescript
import React, { useState, useRef } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

export const ContactForm: React.FC = () => {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  // Honeypot field (hidden from real users)
  const [honeypot, setHoneypot] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check honeypot
    if (honeypot) {
      console.log('Bot detected');
      return;
    }

    // Check captcha
    if (!captchaToken) {
      alert('Please complete the captcha');
      return;
    }

    // Submit form
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        captchaToken,
      }),
    });

    if (response.ok) {
      // Success
      setFormData({ name: '', email: '', message: '' });
      captchaRef.current?.resetCaptcha();
      setCaptchaToken(null);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Honeypot - hidden from real users */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
      />

      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        placeholder="Your name"
        required
      />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        placeholder="Your email"
        required
      />

      <textarea
        name="message"
        value={formData.message}
        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
        placeholder="Your message"
        required
      />

      <HCaptcha
        ref={captchaRef}
        sitekey={import.meta.env.VITE_HCAPTCHA_SITE_KEY}
        onVerify={setCaptchaToken}
        onExpire={() => setCaptchaToken(null)}
      />

      <button type="submit" disabled={!captchaToken}>
        Send Message
      </button>
    </form>
  );
};
```

### Server-Side Verification (Supabase Edge Function)

```typescript
// supabase/functions/verify-captcha/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const HCAPTCHA_SECRET = Deno.env.get('HCAPTCHA_SECRET_KEY');

serve(async (req) => {
  const { captchaToken } = await req.json();

  const response = await fetch('https://hcaptcha.com/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `response=${captchaToken}&secret=${HCAPTCHA_SECRET}`,
  });

  const data = await response.json();

  return new Response(
    JSON.stringify({ success: data.success }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});
```

### Rate Limiting Middleware

```typescript
// lib/rateLimit.ts
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number;  // Max requests per window
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { windowMs: 60000, maxRequests: 5 }
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return { allowed: true, remaining: config.maxRequests - 1, resetIn: config.windowMs };
  }

  if (record.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: record.resetTime - now,
    };
  }

  record.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetIn: record.resetTime - now,
  };
}
```

---

## 5. Admin Email Notifications

### Supabase Edge Function: send-notification

```typescript
// supabase/functions/send-notification/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL');

interface NotificationPayload {
  type: 'new_lead' | 'new_booking' | 'new_teardown' | 'new_chat';
  data: Record<string, any>;
}

serve(async (req) => {
  const { type, data }: NotificationPayload = await req.json();

  const templates: Record<string, { subject: string; html: string }> = {
    new_lead: {
      subject: `New Lead: ${data.name}`,
      html: `
        <h2>New Lead Received</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Service Interest:</strong> ${data.service_interest || 'Not specified'}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message || 'No message'}</p>
        <p><strong>Source:</strong> ${data.source}</p>
        <hr />
        <p><a href="https://axrategy.com/#/admin">View in Dashboard</a></p>
      `,
    },
    new_booking: {
      subject: `New Booking: ${data.name}`,
      html: `
        <h2>New Booking Scheduled</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Time:</strong> ${new Date(data.scheduled_time).toLocaleString()}</p>
        <p><strong>Notes:</strong> ${data.notes || 'None'}</p>
        <hr />
        <p><a href="https://axrategy.com/#/admin">View in Dashboard</a></p>
      `,
    },
    new_teardown: {
      subject: `New Teardown Request`,
      html: `
        <h2>Website Teardown Requested</h2>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Website:</strong> <a href="${data.website_url}">${data.website_url}</a></p>
        <hr />
        <p><a href="https://axrategy.com/#/admin">View in Dashboard</a></p>
      `,
    },
    new_chat: {
      subject: `New Chat Conversation`,
      html: `
        <h2>Visitor Started Chat</h2>
        <p>A new visitor has started a conversation.</p>
        <p><strong>Email:</strong> ${data.email || 'Not provided yet'}</p>
        <hr />
        <p><a href="https://axrategy.com/#/admin">View in Dashboard</a></p>
      `,
    },
  };

  const template = templates[type];
  if (!template) {
    return new Response(JSON.stringify({ error: 'Unknown notification type' }), { status: 400 });
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Axrategy <notifications@axrategy.com>',
      to: ADMIN_EMAIL,
      subject: template.subject,
      html: template.html,
    }),
  });

  const result = await response.json();

  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

### Database Trigger for Auto-Notifications

```sql
-- migrations/20251226_add_notification_triggers.sql

-- Function to send notification via edge function
CREATE OR REPLACE FUNCTION notify_new_lead()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM
    net.http_post(
      url := 'https://your-project.supabase.co/functions/v1/send-notification',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.service_role_key') || '"}'::jsonb,
      body := jsonb_build_object(
        'type', 'new_lead',
        'data', row_to_json(NEW)
      )
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_new_lead
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_lead();
```

---

## 6. Analytics Dashboard

### Hook: useAnalytics.ts

```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { startOfWeek, endOfWeek, subWeeks, format, eachDayOfInterval } from 'date-fns';

interface AnalyticsData {
  leadsBySource: { source: string; count: number }[];
  leadsByStatus: { status: string; count: number }[];
  leadsOverTime: { date: string; count: number }[];
  conversionRate: number;
  avgResponseTime: number;
  weeklyComparison: {
    thisWeek: number;
    lastWeek: number;
    percentChange: number;
  };
}

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setIsLoading(true);

    const now = new Date();
    const thisWeekStart = startOfWeek(now);
    const lastWeekStart = startOfWeek(subWeeks(now, 1));
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Fetch all leads
    const { data: leads } = await supabase
      .from('leads')
      .select('*')
      .gte('created_at', thirtyDaysAgo.toISOString());

    if (!leads) {
      setIsLoading(false);
      return;
    }

    // Leads by source
    const sourceMap = new Map<string, number>();
    leads.forEach(lead => {
      sourceMap.set(lead.source, (sourceMap.get(lead.source) || 0) + 1);
    });
    const leadsBySource = Array.from(sourceMap.entries())
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);

    // Leads by status
    const statusMap = new Map<string, number>();
    leads.forEach(lead => {
      statusMap.set(lead.status, (statusMap.get(lead.status) || 0) + 1);
    });
    const leadsByStatus = Array.from(statusMap.entries())
      .map(([status, count]) => ({ status, count }));

    // Leads over time (last 30 days)
    const days = eachDayOfInterval({ start: thirtyDaysAgo, end: now });
    const leadsOverTime = days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const count = leads.filter(lead =>
        lead.created_at.startsWith(dateStr)
      ).length;
      return { date: dateStr, count };
    });

    // Conversion rate
    const converted = leads.filter(l => l.status === 'converted').length;
    const conversionRate = leads.length > 0 ? (converted / leads.length) * 100 : 0;

    // Weekly comparison
    const thisWeekLeads = leads.filter(l =>
      new Date(l.created_at) >= thisWeekStart
    ).length;
    const lastWeekLeads = leads.filter(l => {
      const date = new Date(l.created_at);
      return date >= lastWeekStart && date < thisWeekStart;
    }).length;
    const percentChange = lastWeekLeads > 0
      ? ((thisWeekLeads - lastWeekLeads) / lastWeekLeads) * 100
      : 0;

    setData({
      leadsBySource,
      leadsByStatus,
      leadsOverTime,
      conversionRate,
      avgResponseTime: 0, // Would need response timestamps
      weeklyComparison: {
        thisWeek: thisWeekLeads,
        lastWeek: lastWeekLeads,
        percentChange,
      },
    });

    setIsLoading(false);
  };

  return { data, isLoading, refetch: fetchAnalytics };
}
```

### Component: AnalyticsDashboard.tsx

```typescript
import React from 'react';
import { TrendingUp, TrendingDown, Users, Target, Clock, BarChart3 } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';

export const AnalyticsDashboard: React.FC = () => {
  const { data, isLoading } = useAnalytics();

  if (isLoading || !data) {
    return <div>Loading analytics...</div>;
  }

  const { weeklyComparison, conversionRate, leadsBySource, leadsOverTime } = data;

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          label="This Week"
          value={weeklyComparison.thisWeek}
          trend={weeklyComparison.percentChange}
          icon={<Users size={24} />}
        />
        <MetricCard
          label="Conversion Rate"
          value={`${conversionRate.toFixed(1)}%`}
          icon={<Target size={24} />}
        />
        <MetricCard
          label="Top Source"
          value={leadsBySource[0]?.source || 'N/A'}
          subtitle={`${leadsBySource[0]?.count || 0} leads`}
          icon={<BarChart3 size={24} />}
        />
        <MetricCard
          label="Avg Response Time"
          value="< 5 min"
          icon={<Clock size={24} />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads Over Time Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Leads Over Time
          </h3>
          <div className="h-64">
            <SimpleLineChart data={leadsOverTime} />
          </div>
        </div>

        {/* Source Distribution */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Lead Sources
          </h3>
          <div className="space-y-4">
            {leadsBySource.map((source, i) => (
              <div key={source.source} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{source.source.replace('_', ' ')}</span>
                    <span className="font-bold">{source.count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-900 dark:bg-white rounded-full"
                      style={{
                        width: `${(source.count / leadsBySource[0].count) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{
  label: string;
  value: string | number;
  trend?: number;
  subtitle?: string;
  icon: React.ReactNode;
}> = ({ label, value, trend, subtitle, icon }) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-400">
        {icon}
      </div>
      {trend !== undefined && (
        <span className={`text-sm font-bold flex items-center gap-1 ${
          trend >= 0 ? 'text-emerald-600' : 'text-red-600'
        }`}>
          {trend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {Math.abs(trend).toFixed(0)}%
        </span>
      )}
    </div>
    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
    <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle || label}</p>
  </div>
);

// Simple line chart component (could use recharts for production)
const SimpleLineChart: React.FC<{ data: { date: string; count: number }[] }> = ({ data }) => {
  const max = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="flex items-end justify-between h-full gap-1">
      {data.slice(-14).map((point, i) => (
        <div key={point.date} className="flex-1 flex flex-col items-center">
          <div
            className="w-full bg-gray-900 dark:bg-white rounded-t"
            style={{ height: `${(point.count / max) * 100}%`, minHeight: '4px' }}
          />
          {i % 2 === 0 && (
            <span className="text-[10px] text-gray-400 mt-2 rotate-45 origin-left">
              {point.date.slice(5)}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
```

---

## Summary

These specifications cover the top 6 priority features:

1. **Admin Search & Filtering** - Complete with hooks and UI
2. **Data Export** - CSV/JSON export with progress
3. **Lead Notes & Timeline** - Activity tracking system
4. **Spam Protection** - hCaptcha + honeypot + rate limiting
5. **Email Notifications** - Resend integration with triggers
6. **Analytics Dashboard** - Metrics and visualizations

Each feature is designed to integrate with the existing Supabase architecture and React component patterns used in the codebase.
