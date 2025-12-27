import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CaseStudy } from '../types';

export const useCaseStudies = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      setIsLoading(true);
      const { data, error: fetchError } = await supabase
        .from('case_studies')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (fetchError) throw fetchError;

      const mappedCaseStudies: CaseStudy[] = (data || []).map((cs) => ({
        id: cs.id,
        slug: cs.slug,
        client: cs.client,
        industry: cs.industry,
        title: cs.title,
        summary: cs.summary,
        problem: cs.problem,
        solution: cs.solution,
        outcome: cs.outcome,
        outcomeDetails: cs.outcome_details || [],
        image: cs.image,
        tags: cs.tags || [],
        stack: cs.stack || [],
      }));

      setCaseStudies(mappedCaseStudies);
      setError(null);
    } catch (err) {
      console.error('Error fetching case studies:', err);
      setError('Failed to load case studies');
      setCaseStudies([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { caseStudies, isLoading, error, refetch: fetchCaseStudies };
};

export const useCaseStudy = (slug: string) => {
  const { caseStudies, isLoading, error } = useCaseStudies();
  const caseStudy = caseStudies.find((cs) => cs.slug === slug);
  return { caseStudy, isLoading, error };
};
