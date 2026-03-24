import { Stethoscope, Scale, HardHat, Hop as Home, Calculator, Activity, Shield, TrendingUp, Heart, UtensilsCrossed, Sparkles, Building, Car, Dumbbell } from 'lucide-react';

export const NAV_LINKS = [
  { name: 'Services', path: '/services' },
  { name: 'Products', path: '/products' },
  { name: 'Work', path: '/work' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Insights', path: '/insights' },
];

export const INDUSTRY_LINKS = [
  { name: 'For Dentists', path: '/for-dentists', icon: Stethoscope, description: 'AI scheduling & patient management' },
  { name: 'For Lawyers', path: '/for-lawyers', icon: Scale, description: 'Client intake & case automation' },
  { name: 'For Contractors', path: '/for-contractors', icon: HardHat, description: 'Lead capture & job tracking' },
  { name: 'For Real Estate', path: '/for-real-estate-agents', icon: Home, description: 'Lead response & showing automation' },
  { name: 'For Accountants', path: '/for-accountants', icon: Calculator, description: 'Document collection & scheduling' },
  { name: 'For Chiropractors', path: '/for-chiropractors', icon: Activity, description: 'Patient reminders & recall' },
  { name: 'For Insurance', path: '/for-insurance-agents', icon: Shield, description: 'Renewals & lead follow-up' },
  { name: 'For Advisors', path: '/for-financial-advisors', icon: TrendingUp, description: 'Reviews & prospect nurturing' },
  { name: 'For Veterinarians', path: '/for-veterinarians', icon: Heart, description: 'Vaccines & pet owner care' },
  { name: 'For Restaurants', path: '/for-restaurants', icon: UtensilsCrossed, description: 'AI that captures reservations and answers FAQs 24/7' },
  { name: 'For Home Services', path: '/for-home-services', icon: Home, description: 'Never miss a job — AI answers when you\'re on-site' },
  { name: 'For Med Spas', path: '/for-med-spas', icon: Sparkles, description: 'Automate bookings, intake forms, and follow-ups' },
  { name: 'For Mortgage Brokers', path: '/for-mortgage-brokers', icon: Building, description: 'First to respond wins the deal — be that broker' },
  { name: 'For Auto Repair', path: '/for-auto-repair', icon: Car, description: 'AI books jobs and sends reminders while you\'re in the shop' },
  { name: 'For Gyms', path: '/for-gyms', icon: Dumbbell, description: 'Convert late-night website visits into paid memberships' },
];
