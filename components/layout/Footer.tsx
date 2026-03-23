import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Mail, Loader as Loader2, Check, Rss } from 'lucide-react';
import { useNewsletter } from '../../hooks/useNewsletter';

export const Footer: React.FC = () => {
  const { subscribe, isLoading, isSuccess, error } = useNewsletter();
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      await subscribe(email.trim());
      if (!error) {
        setEmail('');
      }
    }
  };

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pt-20 pb-28 md:pb-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 p-8 md:p-12 bg-gray-50 dark:bg-gray-800/50 rounded-3xl">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Get actionable tips every week</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Join business owners getting our weekly email with automation tips, AI insights, and real case studies. Unsubscribe anytime.
            </p>
            {isSuccess ? (
              <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                <Check size={20} />
                <span className="font-medium">You're subscribed! Check your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    aria-label="Email address"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Subscribe'}
                </button>
              </form>
            )}
            {error && (
              <p className="mt-3 text-sm text-red-500">{error}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              <span className="font-sansation"><span className="text-red-600">AX</span>RATEGY</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">
              AI systems that capture leads, book clients, and run while you sleep.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
              Trusted by businesses across North America
            </p>
            <div className="text-sm text-gray-400 dark:text-gray-600">
              <p>Toronto, Canada</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Services</h4>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><NavLink to="/services/websites-landing-pages" className="hover:text-black dark:hover:text-white">Websites</NavLink></li>
              <li><NavLink to="/services/ai-assistants" className="hover:text-black dark:hover:text-white">AI Assistants</NavLink></li>
              <li><NavLink to="/services/automation-systems" className="hover:text-black dark:hover:text-white">Automation</NavLink></li>
              <li><NavLink to="/services/crm-setup" className="hover:text-black dark:hover:text-white">CRM Setup</NavLink></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Industries</h4>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><NavLink to="/for-dentists" className="hover:text-black dark:hover:text-white">For Dentists</NavLink></li>
              <li><NavLink to="/for-lawyers" className="hover:text-black dark:hover:text-white">For Lawyers</NavLink></li>
              <li><NavLink to="/for-contractors" className="hover:text-black dark:hover:text-white">For Contractors</NavLink></li>
              <li><NavLink to="/for-real-estate-agents" className="hover:text-black dark:hover:text-white">For Real Estate</NavLink></li>
              <li><NavLink to="/for-accountants" className="hover:text-black dark:hover:text-white">For Accountants</NavLink></li>
              <li><NavLink to="/for-chiropractors" className="hover:text-black dark:hover:text-white">For Chiropractors</NavLink></li>
              <li><NavLink to="/for-insurance-agents" className="hover:text-black dark:hover:text-white">For Insurance</NavLink></li>
              <li><NavLink to="/for-financial-advisors" className="hover:text-black dark:hover:text-white">For Advisors</NavLink></li>
              <li><NavLink to="/for-veterinarians" className="hover:text-black dark:hover:text-white">For Veterinarians</NavLink></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><NavLink to="/work" className="hover:text-black dark:hover:text-white">Case Studies</NavLink></li>
              <li><NavLink to="/about" className="hover:text-black dark:hover:text-white">About</NavLink></li>
              <li><NavLink to="/pricing" className="hover:text-black dark:hover:text-white">Pricing</NavLink></li>
              <li><NavLink to="/products" className="hover:text-black dark:hover:text-white">Products</NavLink></li>
              <li><NavLink to="/contact" className="hover:text-black dark:hover:text-white">Contact</NavLink></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><NavLink to="/insights" className="hover:text-black dark:hover:text-white">Blog</NavLink></li>
              <li><NavLink to="/resources" className="hover:text-black dark:hover:text-white">Downloads</NavLink></li>
              <li><NavLink to="/terms" className="hover:text-black dark:hover:text-white">Terms of Service</NavLink></li>
              <li><NavLink to="/privacy" className="hover:text-black dark:hover:text-white">Privacy Policy</NavLink></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400 dark:text-gray-500">&copy; {new Date().getFullYear()} <span className="font-sansation"><span className="text-red-600">AX</span>RATEGY</span> Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="/rss.xml" target="_blank" rel="noopener noreferrer" aria-label="RSS Feed" className="text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1">
              <Rss size={14} />
              <span className="sr-only md:not-sr-only">RSS</span>
            </a>
            <a href="https://linkedin.com/company/axrategy" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors">LinkedIn</a>
            <a href="https://twitter.com/axrategy" target="_blank" rel="noopener noreferrer" aria-label="Twitter/X" className="text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors">Twitter/X</a>
            <a href="https://instagram.com/axrategy" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
