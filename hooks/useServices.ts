import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Service } from '../types';

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const { data, error: fetchError } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (fetchError) throw fetchError;

      const mappedServices: Service[] = (data || []).map((service) => ({
        id: service.id,
        slug: service.slug,
        title: service.title,
        description: service.description,
        outcome: service.outcome,
        icon: service.icon,
        tags: service.tags || [],
        features: service.features || [],
        timeline: service.timeline,
        whoIsItFor: service.who_is_it_for,
        faq: service.faq || [],
      }));

      setServices(mappedServices);
      setError(null);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services');
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { services, isLoading, error, refetch: fetchServices };
};

export const useService = (slug: string) => {
  const { services, isLoading, error } = useServices();
  const service = services.find((s) => s.slug === slug);
  return { service, isLoading, error };
};
