import React from 'react';
import { NavLink } from 'react-router-dom';
import { BLOG_POSTS } from '../constants';

interface RelatedArticlesProps {
  slugs: string[];
}

export const RelatedArticles: React.FC<RelatedArticlesProps> = ({ slugs }) => {
  const posts = slugs
    .map(slug => BLOG_POSTS.find(p => p.slug === slug))
    .filter(Boolean) as typeof BLOG_POSTS;

  if (posts.length === 0) return null;

  return (
    <section className="py-24 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Related Articles
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-12 max-w-xl">
          Explore strategies and insights tailored to your industry.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map(post => (
            <NavLink
              key={post.slug}
              to={`/insights/${post.slug}`}
              className="group block"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <span className="inline-block px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest rounded-full mb-3">
                {post.category}
              </span>
              <h3 className="font-bold text-gray-900 dark:text-white leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {post.title}
              </h3>
            </NavLink>
          ))}
        </div>
      </div>
    </section>
  );
};
