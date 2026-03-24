import React, { useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { Section, FadeIn, Container } from '../components/UI';
import { SEO } from '../components/SEO';
import { useProducts, useProduct } from '../hooks/useProducts';
import { ProductCategory } from '../types';
import { ProductCard } from '../components/products/ProductCard';
import { ProductDetail } from '../components/products/ProductDetail';
import { ProductBundles } from '../components/products/ProductBundles';
import { useTriggerBookingModal } from '../hooks/useGlobalBookingModal';
import { Calendar, ArrowRight, Sparkles, Repeat, Wrench, Bot } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const CATEGORIES: { key: ProductCategory | 'all'; label: string; icon: React.ElementType; description: string }[] = [
  { key: 'all', label: 'All Products', icon: Sparkles, description: 'Browse everything' },
  { key: 'micro_product', label: 'Digital Products', icon: Sparkles, description: 'Download instantly' },
  { key: 'standalone_subscription', label: 'Subscriptions', icon: Repeat, description: 'Monthly tools' },
  { key: 'productized_service', label: 'Done-For-You', icon: Wrench, description: 'Fixed scope & price' },
];

export const Products: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  if (slug) {
    return <ProductDetailView slug={slug} />;
  }

  return <ProductCatalog />;
};

const ProductCatalog: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const { allProducts, isLoading } = useProducts();
  const triggerBookingModal = useTriggerBookingModal();

  const filtered = activeCategory === 'all'
    ? allProducts
    : allProducts.filter((p) => p.category === activeCategory);

  const featured = allProducts.filter((p) => p.isFeatured);

  return (
    <>
      <SEO
        title="Products & Tools"
        description="Ready-to-use tools, templates, and services for small businesses. From $37 digital downloads to done-for-you services. No sales call required."
      />

      <Section className="pt-32 md:pt-48 pb-10 px-4">
        <Container size="lg">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-8 border border-blue-100 dark:border-blue-800">
              No Sales Call Required
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight tracking-tight">
              Tools that work while you sleep.
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 max-w-2xl mb-12 leading-relaxed">
              Ready-to-use products you can buy right now. No proposal process, no multi-week wait. Pick what you need and get started today.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 rounded-3xl bg-gray-950 dark:bg-gray-900 border border-gray-800 p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-8"
          >
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Demo Available
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">AI Receptionist</h2>
              <p className="text-base font-semibold text-gray-300 mb-3">Try before you buy — personalized to your business</p>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
                We set up a dedicated AI assistant for your business — custom-trained on your services, hours, and FAQs. This is configured per client, not a generic bot. Try the demo below to see what yours could look like.
              </p>
            </div>
            <div className="flex flex-col gap-3 flex-shrink-0 w-full md:w-auto">
              <NavLink
                to="/products/ai-chat-widget"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white text-gray-900 font-bold rounded-2xl hover:bg-gray-100 transition-all active:scale-95 text-sm whitespace-nowrap"
              >
                <Bot size={16} />
                Try It Free
                <ArrowRight size={16} />
              </NavLink>
              <p className="text-center text-xs text-gray-500">No credit card required to try</p>
              <NavLink
                to="/products/ai-chat-widget"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-transparent border border-gray-700 text-gray-300 font-semibold rounded-2xl hover:border-gray-500 hover:text-white transition-all text-sm whitespace-nowrap"
              >
                Get It On My Site — $99/mo
              </NavLink>
            </div>
          </motion.div>

          <div className="flex flex-wrap gap-3 mb-16">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeCategory === cat.key
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-black shadow-lg'
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                <cat.icon size={16} />
                {cat.label}
              </button>
            ))}
          </div>
        </Container>
      </Section>

      {!isLoading && featured.length > 0 && activeCategory === 'all' && (
        <Section className="pt-0 pb-8">
          <Container size="lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Featured</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((product, idx) => (
                <FadeIn key={product.id} delay={idx * 0.05}>
                  <ProductCard product={product} featured />
                </FadeIn>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {activeCategory === 'all' && (
        <Section className="pt-4 pb-0">
          <Container size="lg">
            <ProductBundles />
          </Container>
        </Section>
      )}

      <Section className={`${activeCategory === 'all' && featured.length > 0 ? 'pt-8' : 'pt-0'}`}>
        <Container size="lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeCategory !== 'all' && (
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                  {CATEGORIES.find((c) => c.key === activeCategory)?.label}
                </h2>
              )}

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-80 animate-pulse" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                  No products found in this category.
                </div>
              ) : (
                <>
                  {activeCategory === 'all' ? (
                    <>
                      {['micro_product', 'standalone_subscription', 'productized_service'].map((cat) => {
                        const catProducts = allProducts.filter((p) => p.category === cat);
                        if (catProducts.length === 0) return null;
                        const catMeta = CATEGORIES.find((c) => c.key === cat);
                        return (
                          <div key={cat} className="mb-16 last:mb-0">
                            <div className="flex items-center justify-between mb-8">
                              <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{catMeta?.label}</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{catMeta?.description}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {catProducts.map((product, idx) => (
                                <FadeIn key={product.id} delay={idx * 0.05}>
                                  <ProductCard product={product} />
                                </FadeIn>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filtered.map((product, idx) => (
                        <FadeIn key={product.id} delay={idx * 0.05}>
                          <ProductCard product={product} />
                        </FadeIn>
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </Container>
      </Section>

      <Section className="pb-32 pt-0">
        <Container size="md">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-[2.5rem] p-10 md:p-16 text-center border border-gray-100 dark:border-gray-800">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Need something custom?
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-lg mx-auto leading-relaxed">
              These products cover the most common needs, but every business is different. If you need a tailored solution, let's talk.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={triggerBookingModal}
                className="inline-flex items-center gap-2 px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all text-lg"
              >
                <Calendar size={20} />
                Book a Call
              </button>
              <NavLink to="/pricing" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
                See custom packages <ArrowRight size={16} />
              </NavLink>
            </div>
          </div>
        </Container>
      </Section>

    </>
  );
};

const ProductDetailView: React.FC<{ slug: string }> = ({ slug }) => {
  const { product, isLoading, error } = useProduct(slug);
  const triggerBookingModal = useTriggerBookingModal();

  const handleCheckout = async (email: string) => {
    if (!product) return;
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/product-checkout`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          productSlug: product.slug,
          customerEmail: email,
        }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
    }
  };

  if (isLoading) {
    return (
      <Section className="pt-32 md:pt-48">
        <Container size="lg">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl w-1/3" />
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-xl w-2/3" />
            <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
          </div>
        </Container>
      </Section>
    );
  }

  if (!product) {
    return (
      <Section className="pt-32 md:pt-48 text-center">
        <Container size="md">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Product not found</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">This product doesn't exist or is no longer available.</p>
          <NavLink to="/products" className="text-gray-900 dark:text-white font-semibold hover:underline">
            Browse all products
          </NavLink>
        </Container>
      </Section>
    );
  }

  return (
    <>
      <SEO title={product.name} description={product.tagline} />
      <ProductDetail product={product} onBookCall={triggerBookingModal} onCheckout={handleCheckout} />
    </>
  );
};
