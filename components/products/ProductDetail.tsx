import React from 'react';
import { NavLink } from 'react-router-dom';
import { Section, Container, FadeIn } from '../UI';
import { Product } from '../../types';
import { ProductIcon } from './ProductIcon';
import { Check, ArrowLeft, Calendar, ArrowRight, Repeat, Shield, Clock, Zap } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';

interface ProductDetailProps {
  product: Product;
  onBookCall: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBookCall }) => {
  const { allProducts } = useProducts();
  const related = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  const categoryLabel = {
    micro_product: 'Digital Product',
    standalone_subscription: 'Monthly Subscription',
    productized_service: 'Done-For-You Service',
  }[product.category];

  const categoryColor = {
    micro_product: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800',
    standalone_subscription: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800',
    productized_service: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-800',
  }[product.category];

  return (
    <>
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
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${categoryColor}`}>
                  {product.billingPeriod === 'monthly' && <Repeat size={11} />}
                  {categoryLabel}
                </span>
                {product.industry !== 'all' && (
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                    {product.industry}
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
                {product.name}
              </h1>

              <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 leading-relaxed max-w-2xl">
                {product.description}
              </p>

              {product.proofPoint && (
                <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-2xl p-6 mb-10">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                    <p className="text-emerald-800 dark:text-emerald-300 font-medium leading-relaxed">
                      {product.proofPoint}
                    </p>
                  </div>
                </div>
              )}

              <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">What's included</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="sticky top-32">
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300">
                      <ProductIcon name={product.icon} size={28} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{categoryLabel}</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                        {product.priceDisplay}
                      </p>
                    </div>
                  </div>

                  {product.setupFeeCents > 0 && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                      + ${(product.setupFeeCents / 100).toLocaleString()} one-time setup fee
                    </div>
                  )}

                  <button
                    onClick={onBookCall}
                    className="w-full py-4 px-6 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 text-base flex items-center justify-center gap-2 mb-4"
                  >
                    <Calendar size={18} />
                    {product.ctaText}
                  </button>

                  <p className="text-xs text-gray-400 dark:text-gray-500 text-center mb-8">
                    {product.billingPeriod === 'monthly'
                      ? 'Start with a free consultation. Cancel anytime after the first month.'
                      : 'Start with a free consultation. No commitment until you approve the scope.'}
                  </p>

                  <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <Shield size={16} className="text-emerald-500 flex-shrink-0" />
                      <span>Satisfaction guaranteed</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <Clock size={16} className="text-emerald-500 flex-shrink-0" />
                      <span>
                        {product.category === 'micro_product'
                          ? 'Delivered within 48 hours'
                          : product.category === 'standalone_subscription'
                          ? 'Live within 1-2 weeks'
                          : 'Completed in 1-2 weeks'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <Check size={16} className="text-emerald-500 flex-shrink-0" />
                      <span>
                        {product.billingPeriod === 'monthly'
                          ? 'No long-term contract required'
                          : 'One-time payment, no recurring fees'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section>
          <Container size="lg">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Related products</h2>
              <NavLink to="/products" className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1">
                View all <ArrowRight size={14} />
              </NavLink>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p, idx) => (
                <FadeIn key={p.id} delay={idx * 0.05}>
                  <NavLink to={`/products/${p.slug}`} className="block group">
                    <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-md transition-all">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400">
                          <ProductIcon name={p.icon} size={20} />
                        </div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">{p.priceDisplay}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{p.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{p.tagline}</p>
                    </div>
                  </NavLink>
                </FadeIn>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section className="pb-32 pt-0">
        <Container size="md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Looking for a full custom solution?
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Our monthly and one-time packages include everything from website design to AI automation.
            </p>
            <NavLink
              to="/pricing"
              className="inline-flex items-center gap-2 text-gray-900 dark:text-white font-semibold hover:underline"
            >
              See full pricing <ArrowRight size={16} />
            </NavLink>
          </div>
        </Container>
      </Section>
    </>
  );
};
