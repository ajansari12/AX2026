import React, { useState, useMemo } from 'react';
import { Section, Container } from '../components/UI';
import { SEO } from '../components/SEO';
import { Search, ChevronDown, Rocket, Briefcase, CreditCard, Globe, Bot, BarChart3, LifeBuoy } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  items: FAQItem[];
}

const CATEGORIES: FAQCategory[] = [
  {
    id: 'getting-started',
    label: 'Getting Started',
    icon: <Rocket size={18} />,
    items: [
      { q: 'How does the onboarding process work?', a: 'After signing up, you\'ll receive a welcome email with access to your client portal. We\'ll schedule an onboarding call to discuss your goals, audit your current systems, and build a tailored action plan. Most clients are fully onboarded within one week.' },
      { q: 'What do I need to get started?', a: 'Just your business goals and access to any existing tools you use (website, CRM, social media accounts). We handle all the technical setup, configuration, and integration work.' },
      { q: 'How long before I see results?', a: 'Most clients see initial improvements within the first 2 weeks. Significant results like increased leads and automated workflows typically appear within 30-60 days.' },
      { q: 'Do you require long-term contracts?', a: 'No. Our monthly services are month-to-month with no long-term commitment required. One-time products are single purchases. We believe in earning your business every month.' },
    ],
  },
  {
    id: 'services',
    label: 'Services',
    icon: <Briefcase size={18} />,
    items: [
      { q: 'What industries do you specialize in?', a: 'We work with local service businesses including dentists, lawyers, contractors, real estate agents, accountants, chiropractors, insurance agents, financial advisors, and veterinarians. Our solutions are tailored to each industry\'s unique needs.' },
      { q: 'Can you work with my existing website?', a: 'Yes! We can optimize, redesign, or build on top of your existing website. If a full rebuild makes more sense, we\'ll explain why and provide a seamless migration.' },
      { q: 'Do you offer custom solutions?', a: 'Absolutely. While our productized services cover most needs, we also create custom automation workflows, integrations, and strategies tailored to your specific business requirements.' },
    ],
  },
  {
    id: 'pricing',
    label: 'Pricing & Billing',
    icon: <CreditCard size={18} />,
    items: [
      { q: 'How does your pricing work?', a: 'We offer three tiers: one-time digital products (starting at $49), monthly subscriptions for ongoing services (starting at $297/mo), and done-for-you packages for comprehensive solutions. Visit our pricing page for full details.' },
      { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, ACH bank transfers, and can arrange invoicing for enterprise clients. All payments are processed securely through Stripe.' },
      { q: 'Can I change my plan later?', a: 'Yes, you can upgrade, downgrade, or cancel your subscription at any time. Changes take effect at the start of your next billing cycle.' },
      { q: 'Do you offer refunds?', a: 'We offer a satisfaction guarantee on all our services. If you\'re not happy with the results within the first 30 days, we\'ll work to fix it or provide a refund.' },
    ],
  },
  {
    id: 'website',
    label: 'Website & Hosting',
    icon: <Globe size={18} />,
    items: [
      { q: 'Do you provide hosting?', a: 'Yes, all our website packages include managed hosting with SSL, CDN, daily backups, and 99.9% uptime guarantee. We handle all the technical details so you can focus on your business.' },
      { q: 'Will my website be mobile-friendly?', a: 'Every website we build is fully responsive and optimized for all devices. We test across phones, tablets, and desktops to ensure a perfect experience.' },
      { q: 'How do you handle SEO?', a: 'Every website includes on-page SEO optimization (meta tags, schema markup, sitemap, speed optimization). We also offer ongoing SEO services including content strategy, local SEO, and link building.' },
    ],
  },
  {
    id: 'ai-automation',
    label: 'AI & Automation',
    icon: <Bot size={18} />,
    items: [
      { q: 'What kind of automations can you set up?', a: 'We automate lead follow-up, appointment reminders, review requests, email sequences, CRM updates, invoice generation, social media posting, and much more. If it\'s repetitive, we can probably automate it.' },
      { q: 'How does the AI chat widget work?', a: 'Our AI chat widget uses advanced language models trained on your business data to answer customer questions 24/7. It can qualify leads, book appointments, and route complex inquiries to your team.' },
      { q: 'Will automations replace my team?', a: 'No. Automations handle repetitive tasks so your team can focus on high-value work like building relationships and closing deals. Think of it as giving your team superpowers, not replacing them.' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics & Reporting',
    icon: <BarChart3 size={18} />,
    items: [
      { q: 'What analytics do you provide?', a: 'We set up comprehensive tracking including website traffic, lead sources, conversion rates, email performance, ad spend ROI, and customer lifetime value. Everything is available in your client portal dashboard.' },
      { q: 'Can I see reports in real-time?', a: 'Yes. Your client portal includes a real-time analytics dashboard. We also send weekly summary emails and monthly detailed reports with insights and recommendations.' },
    ],
  },
  {
    id: 'support',
    label: 'Support',
    icon: <LifeBuoy size={18} />,
    items: [
      { q: 'How do I get support?', a: 'You can reach us through your client portal messaging system, email, or phone during business hours. Urgent issues are addressed within 2 hours, and all other requests within 24 hours.' },
      { q: 'Do you offer training?', a: 'Yes! Every service includes training resources in your portal. We also offer live training sessions and can create custom training materials for your team.' },
      { q: 'What happens if something breaks?', a: 'We monitor all systems 24/7 with automated alerts. If an issue is detected, our team is notified immediately and begins working on a fix. Most issues are resolved before you even notice them.' },
    ],
  },
];

export const HelpCenter: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return activeCategory ? CATEGORIES.filter(c => c.id === activeCategory) : CATEGORIES;

    const term = search.toLowerCase();
    return CATEGORIES
      .map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
          item.q.toLowerCase().includes(term) || item.a.toLowerCase().includes(term)
        ),
      }))
      .filter(cat => cat.items.length > 0);
  }, [search, activeCategory]);

  const toggleItem = (key: string) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const allFAQs = CATEGORIES.flatMap(c => c.items);
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': allFAQs.map(item => ({
      '@type': 'Question',
      'name': item.q,
      'acceptedAnswer': { '@type': 'Answer', 'text': item.a },
    })),
  };

  return (
    <>
      <SEO
        title="Help Center | Frequently Asked Questions"
        description="Find answers to common questions about Axrategy's services, pricing, AI automation, and more."
        schema={faqSchema}
      />

      <Section className="pt-32 pb-12">
        <Container size="md">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
              Help Center
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Find answers to common questions about our services and solutions.
            </p>
          </div>

          <div className="relative max-w-lg mx-auto mb-12">
            <input
              type="text"
              placeholder="Search for answers..."
              value={search}
              onChange={e => { setSearch(e.target.value); setActiveCategory(null); }}
              className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-all shadow-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !activeCategory
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              All
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id === activeCategory ? null : cat.id); setSearch(''); }}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="pt-0 pb-32">
        <Container size="md">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No results found. Try a different search term.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {filteredCategories.map(cat => (
                <div key={cat.id}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-gray-400 dark:text-gray-500">{cat.icon}</span>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{cat.label}</h2>
                  </div>
                  <div className="space-y-2">
                    {cat.items.map((item, idx) => {
                      const key = `${cat.id}-${idx}`;
                      const isOpen = openItems.has(key);
                      return (
                        <div
                          key={key}
                          className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden"
                        >
                          <button
                            onClick={() => toggleItem(key)}
                            className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                          >
                            <span className="font-medium text-gray-900 dark:text-white pr-4">{item.q}</span>
                            <ChevronDown
                              size={18}
                              className={`flex-shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            />
                          </button>
                          {isOpen && (
                            <div className="px-5 pb-5 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-50 dark:border-gray-800 pt-4">
                              {item.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
};
