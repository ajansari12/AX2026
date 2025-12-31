import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const pathToLabel: Record<string, string> = {
  services: 'Services',
  work: 'Case Studies',
  pricing: 'Pricing',
  about: 'About',
  insights: 'Insights',
  resources: 'Resources',
  contact: 'Contact',
  terms: 'Terms of Service',
  privacy: 'Privacy Policy',
  'for-dentists': 'For Dentists',
  'for-lawyers': 'For Lawyers',
  'for-contractors': 'For Contractors',
  'for-real-estate-agents': 'For Real Estate',
  'for-accountants': 'For Accountants',
  'for-chiropractors': 'For Chiropractors',
  'for-insurance-agents': 'For Insurance',
  'for-financial-advisors': 'For Advisors',
  'for-veterinarians': 'For Veterinarians',
};

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const location = useLocation();

  const breadcrumbs: BreadcrumbItem[] = items || (() => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    const crumbs: BreadcrumbItem[] = [];
    let currentPath = '';

    pathParts.forEach((part, index) => {
      currentPath += `/${part}`;
      const isLast = index === pathParts.length - 1;

      crumbs.push({
        label: pathToLabel[part] || part.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        path: isLast ? undefined : currentPath,
      });
    });

    return crumbs;
  })();

  if (breadcrumbs.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://axrategy.com"
      },
      ...breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        "item": item.path ? `https://axrategy.com${item.path}` : undefined
      }))
    ]
  };

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
      <nav aria-label="Breadcrumb" className={`${className}`}>
        <ol className="flex items-center gap-2 text-sm" itemScope itemType="https://schema.org/BreadcrumbList">
          <li className="flex items-center" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <NavLink
              to="/"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1"
              itemProp="item"
            >
              <Home size={14} />
              <span itemProp="name" className="sr-only">Home</span>
            </NavLink>
            <meta itemProp="position" content="1" />
          </li>

          {breadcrumbs.map((item, index) => (
            <li key={index} className="flex items-center" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <ChevronRight size={14} className="text-gray-300 dark:text-gray-600 mx-1" aria-hidden="true" />
              {item.path ? (
                <NavLink
                  to={item.path}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  itemProp="item"
                >
                  <span itemProp="name">{item.label}</span>
                </NavLink>
              ) : (
                <span className="text-gray-900 dark:text-white font-medium" itemProp="name">
                  {item.label}
                </span>
              )}
              <meta itemProp="position" content={String(index + 2)} />
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};
