import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface LeadNote {
  id: string;
  lead_id: string;
  content: string;
  author_email: string;
  created_at: string;
  updated_at: string;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  activity_type: string;
  description: string;
  metadata: Record<string, any>;
  actor_email: string | null;
  created_at: string;
}

export interface TimelineItem {
  id: string;
  type: 'note' | 'activity';
  content: string;
  author: string | null;
  created_at: string;
  activityType?: string;
  metadata?: Record<string, any>;
}

export function useLeadNotes(leadId: string | null) {
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!leadId) {
      setNotes([]);
      setActivities([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
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

      if (notesResult.error) throw notesResult.error;
      if (activitiesResult.error) throw activitiesResult.error;

      setNotes(notesResult.data || []);
      setActivities(activitiesResult.data || []);
    } catch (err) {
      console.error('Failed to fetch lead notes/activity:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, [leadId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addNote = async (content: string): Promise<LeadNote | null> => {
    if (!leadId) return null;

    try {
      const { data: session } = await supabase.auth.getSession();
      const email = session.session?.user?.email || 'unknown';

      const { data, error } = await supabase
        .from('lead_notes')
        .insert({
          lead_id: leadId,
          content: content.trim(),
          author_email: email,
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setNotes(prev => [data, ...prev]);

      // Refetch to get the activity that was auto-created
      setTimeout(fetchData, 100);

      return data;
    } catch (err) {
      console.error('Failed to add note:', err);
      throw err;
    }
  };

  const updateNote = async (noteId: string, content: string): Promise<LeadNote | null> => {
    try {
      const { data, error } = await supabase
        .from('lead_notes')
        .update({
          content: content.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', noteId)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setNotes(prev => prev.map(n => n.id === noteId ? data : n));

      return data;
    } catch (err) {
      console.error('Failed to update note:', err);
      throw err;
    }
  };

  const deleteNote = async (noteId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('lead_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      // Update local state
      setNotes(prev => prev.filter(n => n.id !== noteId));
    } catch (err) {
      console.error('Failed to delete note:', err);
      throw err;
    }
  };

  const logActivity = async (
    activityType: string,
    description: string,
    metadata: Record<string, any> = {}
  ): Promise<void> => {
    if (!leadId) return;

    try {
      const { data: session } = await supabase.auth.getSession();
      const email = session.session?.user?.email || null;

      const { error } = await supabase
        .from('lead_activity')
        .insert({
          lead_id: leadId,
          activity_type: activityType,
          description,
          metadata,
          actor_email: email,
        });

      if (error) throw error;

      // Refetch to get the new activity
      await fetchData();
    } catch (err) {
      console.error('Failed to log activity:', err);
      throw err;
    }
  };

  // Combine notes and activities into a unified timeline
  const timeline: TimelineItem[] = [
    ...notes.map(n => ({
      id: n.id,
      type: 'note' as const,
      content: n.content,
      author: n.author_email,
      created_at: n.created_at,
    })),
    ...activities.map(a => ({
      id: a.id,
      type: 'activity' as const,
      content: a.description,
      author: a.actor_email,
      created_at: a.created_at,
      activityType: a.activity_type,
      metadata: a.metadata,
    })),
  ].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return {
    notes,
    activities,
    timeline,
    isLoading,
    error,
    addNote,
    updateNote,
    deleteNote,
    logActivity,
    refetch: fetchData,
  };
}
