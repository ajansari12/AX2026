import { Stethoscope, Scale, HardHat, Home, Calculator, Activity, Shield, TrendingUp, Heart } from 'lucide-react';

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
];
