
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Section, Button } from '../components/UI';
import { SEO } from '../components/SEO';
import { NotFoundIllustration } from '../components/NotFoundIllustration';

export const NotFound: React.FC = () => (
  <>
    <SEO
      title="Page Not Found"
      description="The page you're looking for doesn't exist or has been moved. Return to the homepage or explore our services."
      noIndex={true}
    />
    <Section className="min-h-[80vh] flex flex-col items-center justify-center text-center">
    <NotFoundIllustration />
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Page not found</h2>
    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <div className="flex flex-col gap-4">
      <NavLink to="/">
        <Button size="lg">Return Home</Button>
      </NavLink>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        <span className="mr-2">Or try:</span>
        <NavLink to="/services" className="text-emerald-600 dark:text-emerald-400 hover:underline mr-2">Services</NavLink>
        <NavLink to="/pricing" className="text-emerald-600 dark:text-emerald-400 hover:underline mr-2">Pricing</NavLink>
        <NavLink to="/contact" className="text-emerald-600 dark:text-emerald-400 hover:underline">Contact</NavLink>
      </div>
    </div>
  </Section>
  </>
);
