import { useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

function getVisitorId(): string {
  const KEY = 'ax-visitor-id';
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}

export function useAbandonedCartTracker(productSlug: string, productName: string) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current || !isSupabaseConfigured) return;
    tracked.current = true;

    const visitorId = getVisitorId();
    supabase
      .from('abandoned_carts')
      .upsert(
        {
          visitor_id: visitorId,
          product_slug: productSlug,
          product_name: productName,
          last_step: 'view',
          last_seen_at: new Date().toISOString(),
        },
        { onConflict: 'visitor_id,product_slug' }
      )
      .then(({ error }) => {
        if (error) console.error('Abandoned cart track error:', error);
      });
  }, [productSlug, productName]);
}

export function trackCartStep(
  productSlug: string,
  step: string,
  email?: string
) {
  if (!isSupabaseConfigured) return;
  const visitorId = getVisitorId();
  const updates: Record<string, unknown> = {
    visitor_id: visitorId,
    product_slug: productSlug,
    last_step: step,
    last_seen_at: new Date().toISOString(),
  };
  if (email) updates.email = email;

  supabase
    .from('abandoned_carts')
    .upsert(updates, { onConflict: 'visitor_id,product_slug' })
    .then(({ error }) => {
      if (error) console.error('Cart step track error:', error);
    });
}

export function markCartRecovered(productSlug: string) {
  if (!isSupabaseConfigured) return;
  const visitorId = getVisitorId();
  supabase
    .from('abandoned_carts')
    .update({ recovered: true })
    .eq('visitor_id', visitorId)
    .eq('product_slug', productSlug)
    .then(({ error }) => {
      if (error) console.error('Cart recovery mark error:', error);
    });
}
