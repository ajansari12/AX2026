
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Section, Button } from '../components/UI';

export const NotFound: React.FC = () => (
  <Section className="min-h-[80vh] flex flex-col items-center justify-center text-center">
    <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800 mb-8 select-none">404</h1>
    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Page not found</h2>
    <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-md mx-auto">
      The page you are looking for does not exist. It may have been moved or deleted.
    </p>
    <div className="flex flex-col gap-4">
      <NavLink to="/">
        <Button size="lg">Return Home</Button>
      </NavLink>
      <div className="text-sm text-gray-500">
        <span className="mr-2">Popular pages:</span>
        <NavLink to="/services" className="text-emerald-600 hover:underline mr-2">Services</NavLink>
        <NavLink to="/pricing" className="text-emerald-600 hover:underline mr-2">Pricing</NavLink>
        <NavLink to="/contact" className="text-emerald-600 hover:underline">Contact</NavLink>
      </div>
    </div>
  </Section>
);
