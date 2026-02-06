import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Percent, ArrowRight, Sparkles } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useProducts } from '../../hooks/useProducts';
import { FadeIn } from '../UI';

interface Bundle {
  id: string;
  name: string;
  slug: string;
  description: string;
  discount_percent: number;
  product_ids: string[];
}

export const ProductBundles: React.FC = () => {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { allProducts } = useProducts();

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    const fetch = async () => {
      try {
        const { data: bundleData } = await supabase
          .from('product_bundles')
          .select('id, name, slug, description, discount_percent')
          .eq('is_active', true)
          .order('discount_percent', { ascending: true });

        if (!bundleData || bundleData.length === 0) {
          setIsLoading(false);
          return;
        }

        const { data: itemsData } = await supabase
          .from('product_bundle_items')
          .select('bundle_id, product_id')
          .in('bundle_id', bundleData.map(b => b.id));

        const mapped = bundleData.map(b => ({
          ...b,
          product_ids: (itemsData || [])
            .filter(i => i.bundle_id === b.id)
            .map(i => i.product_id),
        }));

        setBundles(mapped);
      } catch (err) {
        console.error('Error fetching bundles:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, []);

  if (isLoading || bundles.length === 0 || allProducts.length === 0) return null;

  const accentColors = [
    { bg: 'from-blue-600 to-cyan-600', badge: 'bg-blue-500', light: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' },
    { bg: 'from-emerald-600 to-teal-600', badge: 'bg-emerald-500', light: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' },
    { bg: 'from-orange-600 to-amber-600', badge: 'bg-orange-500', light: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400' },
  ];

  return (
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-2">
        <Package className="w-5 h-5 text-gray-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Save with Bundles</h2>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
        Combine products and save up to 25%.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bundles.map((bundle, idx) => {
          const colors = accentColors[idx % accentColors.length];
          const products = bundle.product_ids
            .map(pid => allProducts.find(p => p.id === pid))
            .filter(Boolean);

          const totalPrice = products.reduce((sum, p) => sum + (p?.priceCents || 0), 0);
          const discountedPrice = Math.round(totalPrice * (1 - bundle.discount_percent / 100));
          const savings = totalPrice - discountedPrice;

          return (
            <FadeIn key={bundle.id} delay={idx * 0.08}>
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-lg transition-all group">
                <div className={`bg-gradient-to-r ${colors.bg} px-6 py-4 flex items-center justify-between`}>
                  <h3 className="font-bold text-white text-lg">{bundle.name}</h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-bold">
                    <Percent size={14} /> {bundle.discount_percent}% off
                  </span>
                </div>

                <div className="p-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
                    {bundle.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {products.map(p => (
                      <div key={p!.id} className="flex items-center gap-2 text-sm">
                        <Sparkles size={14} className="text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 font-medium truncate">{p!.name}</span>
                        <span className="ml-auto text-gray-400 text-xs line-through">{p!.priceDisplay}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Bundle price</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${(discountedPrice / 100).toLocaleString()}
                      </p>
                      {savings > 0 && (
                        <p className={`text-xs font-semibold ${colors.light} px-2 py-0.5 rounded-full inline-block mt-1`}>
                          Save ${(savings / 100).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <NavLink
                      to={`/products/${products[0]?.slug || ''}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      View <ArrowRight size={14} />
                    </NavLink>
                  </div>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
};
