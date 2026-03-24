import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { Section, Container, FadeIn } from '../components/UI';
import { SEO } from '../components/SEO';
import { ProductIcon } from '../components/products/ProductIcon';
import { useTriggerBookingModal } from '../hooks/useGlobalBookingModal';
import { supabase } from '../lib/supabase';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types';
import {
  ArrowLeft,
  ArrowRight,
  Package,
  Percent,
  Check,
  Calendar,
  Shield,
  Clock,
  Sparkles,
} from 'lucide-react';

interface BundleData {
  id: string;
  name: string;
  slug: string;
  description: string;
  discount_percent: number;
}

export const BundleDetail: React.FC = () => {
  const { bundleSlug } = useParams<{ bundleSlug: string }>();
  const [bundle, setBundle] = useState<BundleData | null>(null);
  const [bundleProductIds, setBundleProductIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { allProducts } = useProducts();
  const triggerBookingModal = useTriggerBookingModal();

  useEffect(() => {
    if (!bundleSlug) return;

    const fetchBundle = async () => {
      try {
        const { data: bundleData } = await supabase
          .from('product_bundles')
          .select('id, name, slug, description, discount_percent')
          .eq('slug', bundleSlug)
          .eq('is_active', true)
          .maybeSingle();

        if (!bundleData) {
          setIsLoading(false);
          return;
        }

        setBundle(bundleData);

        const { data: itemsData } = await supabase
          .from('product_bundle_items')
          .select('product_id')
          .eq('bundle_id', bundleData.id);

        setBundleProductIds((itemsData || []).map((i) => i.product_id));
      } catch (err) {
        console.error('Error fetching bundle:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBundle();
  }, [bundleSlug]);

  if (isLoading) {
    return (
      <Section className="pt-32 md:pt-48">
        <Container size="lg">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-xl w-48" />
            <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl w-1/2" />
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-xl w-2/3" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-72 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
              ))}
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  if (!bundle) {
    return (
      <Section className="pt-32 md:pt-48 text-center">
        <Container size="md">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Bundle not found</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">This bundle doesn't exist or is no longer available.</p>
          <NavLink to="/products" className="text-gray-900 dark:text-white font-semibold hover:underline">
            Browse all products
          </NavLink>
        </Container>
      </Section>
    );
  }

  const products = bundleProductIds
    .map((pid) => allProducts.find((p) => p.id === pid))
    .filter(Boolean) as Product[];

  const totalPrice = products.reduce((sum, p) => sum + p.priceCents, 0);
  const discountedPrice = Math.round(totalPrice * (1 - bundle.discount_percent / 100));
  const savings = totalPrice - discountedPrice;

  return (
    <>
      <SEO
        title={`${bundle.name} - Save ${bundle.discount_percent}%`}
        description={bundle.description}
      />

      <Section className="pt-32 md:pt-44 pb-0">
        <Container size="lg">
          <NavLink
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-10"
          >
            <ArrowLeft size={16} />
            All Products
          </NavLink>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            <div className="lg:col-span-3">
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                  <Package size={11} />
                  Bundle
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
                  <Percent size={11} />
                  {bundle.discount_percent}% off
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
                {bundle.name}
              </h1>

              <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 leading-relaxed max-w-2xl">
                {bundle.description}
              </p>

              <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  {products.length} products included
                </h2>
                <div className="space-y-4">
                  {products.map((product, idx) => (
                    <FadeIn key={product.id} delay={idx * 0.05}>
                      <BundleProductCard product={product} />
                    </FadeIn>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="sticky top-32">
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <Package size={28} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Bundle</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                        ${(discountedPrice / 100).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-6">
                    <p className="text-sm text-gray-400 line-through">
                      ${(totalPrice / 100).toLocaleString()}
                    </p>
                    {savings > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">
                        Save ${(savings / 100).toLocaleString()}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={triggerBookingModal}
                    className="w-full py-4 px-6 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 text-base flex items-center justify-center gap-2 mb-4"
                  >
                    <Calendar size={18} />
                    Get This Bundle
                  </button>

                  <p className="text-xs text-gray-400 dark:text-gray-500 text-center mb-8">
                    Start with a free consultation. No commitment until you approve the scope.
                  </p>

                  <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <Shield size={16} className="text-emerald-500 flex-shrink-0" />
                      <span>Satisfaction guaranteed</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <Clock size={16} className="text-emerald-500 flex-shrink-0" />
                      <span>All products delivered within 2 weeks</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <Check size={16} className="text-emerald-500 flex-shrink-0" />
                      <span>One-time payment, no recurring fees</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800 p-6">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-blue-900 dark:text-blue-300 text-sm mb-1">
                        Why buy the bundle?
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-400 leading-relaxed">
                        These products are designed to work together. You save {bundle.discount_percent}% compared to buying each one individually.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="pb-32 pt-0">
        <Container size="md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Need something different?
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Browse individual products or explore our custom service packages.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <NavLink
                to="/products"
                className="inline-flex items-center gap-2 text-gray-900 dark:text-white font-semibold hover:underline"
              >
                Browse all products <ArrowRight size={16} />
              </NavLink>
              <span className="text-gray-300 dark:text-gray-600 hidden sm:inline">|</span>
              <NavLink
                to="/pricing"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
              >
                See custom packages <ArrowRight size={16} />
              </NavLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
};

const BundleProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const categoryLabel = {
    micro_product: 'Digital Product',
    standalone_subscription: 'Subscription',
    productized_service: 'Done-For-You',
  }[product.category];

  return (
    <NavLink
      to={`/products/${product.slug}`}
      className="block group"
    >
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-md transition-all">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 flex-shrink-0">
            <ProductIcon name={product.icon} size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {categoryLabel}
              </span>
              <span className="text-xs text-gray-400 line-through ml-auto flex-shrink-0">
                {product.priceDisplay}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">
              {product.tagline}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
              {product.features.slice(0, 3).map((feature, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <Check size={12} className="text-emerald-500 flex-shrink-0" />
                  <span className="truncate">{feature}</span>
                </div>
              ))}
              {product.features.length > 3 && (
                <span className="text-xs text-gray-400">+{product.features.length - 3} more</span>
              )}
            </div>
          </div>
          <ArrowRight size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors flex-shrink-0 mt-1" />
        </div>
      </div>
    </NavLink>
  );
};
