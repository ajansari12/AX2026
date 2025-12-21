
export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  outcome: string;
  icon: string;
  tags: string[];
  fullDescription?: string;
  features?: string[];
  timeline?: string;
  faq?: { q: string; a: string }[];
  whoIsItFor?: string;
}

export interface CaseStudy {
  id: string;
  slug: string;
  client: string;
  industry: string;
  title: string;
  summary: string; // Used for card description
  problem: string; // Full text for detail page
  solution: string; // Full text for detail page
  outcome: string; // Primary stat (e.g. "30% less admin")
  outcomeDetails: string[]; // List of specific results
  image: string; // Main hero image
  gallery?: string[]; // Additional screenshots
  tags: string[]; // Filter categories
  stack: string[];
}

export interface Author {
  name: string;
  role: string;
  avatar: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML string
  category: 'Strategy' | 'Automation' | 'AI' | 'Design' | 'Growth';
  readTime: string;
  date: string;
  image: string;
  author: Author;
  featured?: boolean;
}

export interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  ctaText: string;
}

export interface PricingComparisonCategory {
  category: string;
  items: {
    label: string;
    tier1: string | boolean; // Starter
    tier2: string | boolean; // Growth
    tier3: string | boolean; // Scale
  }[];
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  duration: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
}

export type PricingMode = 'one-time' | 'monthly';

export type PricingPreference = 'one_time' | 'monthly' | 'undecided';

export interface MonthlyPricingTier {
  name: string;
  setupFee: string;
  monthlyPrice: string;
  description: string;
  features: string[];
  ongoingBenefits: string[];
  isPopular?: boolean;
  ctaText: string;
  commitment: string;
}
