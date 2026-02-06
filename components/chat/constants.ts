import { ArrowRight } from 'lucide-react';

export const PAGE_GREETINGS: Record<string, string> = {
  '/': "Hi! I can help you discover how AI can transform your business. What would you like to know?",
  '/services': "Interested in our services? I can explain what each one includes and help you find the best fit.",
  '/pricing': "Questions about pricing? I can help you understand our packages and what's included.",
  '/work': "Looking at our case studies? I can share more details about any project or discuss similar solutions for you.",
  '/contact': "Ready to get started? I can answer any last questions before you book a call.",
  '/about': "Want to learn more about us? I can share our story, approach, and what makes us different.",
};

export const QUICK_ACTIONS = [
  { label: 'What services do you offer?', icon: ArrowRight },
  { label: 'How much does it cost?', icon: ArrowRight },
  { label: 'How long does a project take?', icon: ArrowRight },
];
