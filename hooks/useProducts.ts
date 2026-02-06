import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { Product, ProductCategory } from '../types';

export const useProducts = (filterCategory?: ProductCategory) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (fetchError) throw fetchError;

      const mapped: Product[] = (data || []).map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        description: p.description,
        type: p.type,
        category: p.category as ProductCategory,
        priceCents: p.price_cents,
        priceDisplay: p.price_display,
        setupFeeCents: p.setup_fee_cents,
        billingPeriod: p.billing_period,
        industry: p.industry,
        icon: p.icon,
        features: (p.features as string[]) || [],
        proofPoint: p.proof_point,
        ctaText: p.cta_text,
        sortOrder: p.sort_order,
        isActive: p.is_active,
        isFeatured: p.is_featured,
        stripePriceId: p.stripe_price_id,
      }));

      setProducts(mapped);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (!filterCategory) return products;
    return products.filter((p) => p.category === filterCategory);
  }, [products, filterCategory]);

  return { products: filtered, allProducts: products, isLoading, error, refetch: fetchProducts };
};

export const useProduct = (slug: string) => {
  const { allProducts, isLoading, error } = useProducts();
  const product = allProducts.find((p) => p.slug === slug);
  return { product, isLoading, error };
};
