
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article' | 'service';
  schema?: Record<string, any>;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image = 'https://axrategy.com/og-image.svg', // Branded social preview
  type = 'website',
  schema
}) => {
  const location = useLocation();
  const domain = 'https://axrategy.com'; // In production, use env var
  const canonicalUrl = `${domain}${location.pathname === '/' ? '' : location.pathname}`;
  const siteName = 'Axrategy';

  useEffect(() => {
    // 1. Update Title
    document.title = `${title} | ${siteName}`;

    // 2. Helper to update/create meta tags
    const updateMeta = (name: string, content: string, attribute: 'name' | 'property' = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 3. Helper to update/create link tags
    const updateLink = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // --- Standard Meta ---
    updateMeta('description', description);

    // --- OpenGraph ---
    updateMeta('og:site_name', siteName, 'property');
    updateMeta('og:title', title, 'property');
    updateMeta('og:description', description, 'property');
    updateMeta('og:url', canonicalUrl, 'property');
    updateMeta('og:type', type === 'service' ? 'website' : type, 'property');
    updateMeta('og:image', image, 'property');

    // --- Twitter Card ---
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);
    updateMeta('twitter:domain', 'axrategy.com');

    // --- Canonical ---
    updateLink('canonical', canonicalUrl);

    // --- Structured Data (JSON-LD) ---
    const scriptId = 'axrategy-json-ld';
    let script = document.getElementById(scriptId);
    
    if (schema) {
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schema);
    } else if (script) {
      // Clean up schema if not present on current page to avoid stale data
      script.textContent = '';
    }

  }, [title, description, image, type, schema, canonicalUrl]);

  return null;
};
