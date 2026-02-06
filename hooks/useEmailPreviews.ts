import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface EmailTemplate {
  id: string;
  title: string;
  subjectLine: string;
  previewText: string;
  content: {
    from: string;
    body: string;
  } | null;
  industry: string;
  sequenceName: string;
  sequencePosition: number;
  sortOrder: number;
  isLocked: boolean;
}

export function useEmailPreviews() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('product_previews')
        .select('*')
        .eq('product_slug', 'email-sequence-templates')
        .order('sort_order', { ascending: true });

      if (error) throw error;

      const mapped: EmailTemplate[] = (data || []).map((row) => ({
        id: row.id,
        title: row.title,
        subjectLine: row.subject_line,
        previewText: row.preview_text,
        content: row.is_locked ? null : (row.content as { from: string; body: string } | null),
        industry: row.industry,
        sequenceName: row.sequence_name,
        sequencePosition: row.sequence_position,
        sortOrder: row.sort_order,
        isLocked: row.is_locked,
      }));

      setTemplates(mapped);
    } catch (err) {
      console.error('Error fetching email previews:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { templates, isLoading };
}
