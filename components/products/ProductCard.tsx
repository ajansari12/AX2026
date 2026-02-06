import React from 'react';
import { NavLink } from 'react-router-dom';
import { Product } from '../../types';
import { ProductIcon } from './ProductIcon';
import { ArrowRight, Repeat, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, featured }) => {
  const categoryLabel = {
    micro_product: 'Digital Product',
    standalone_subscription: 'Monthly Subscription',
    productized_service: 'Done-For-You Service',
  }[product.category];

  const categoryColor = {
    micro_product: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800',
    standalone_subscription: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800',
    productized_service: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-800',
  }[product.category];

  return (
    <NavLink
      to={`/products/${product.slug}`}
      className="block group h-full"
    >
      <div className={`relative p-7 rounded-2xl h-full flex flex-col transition-all duration-300 border hover:-translate-y-1 hover:shadow-xl ${
        featured
          ? 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-md'
          : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-sm'
      }`}>
        {product.isFeatured && (
          <div className="absolute -top-3 right-6 bg-gray-900 dark:bg-white text-white dark:text-black px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Popular
          </div>
        )}

        <div className="flex items-start justify-between mb-5">
          <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 group-hover:scale-110 transition-transform">
            <ProductIcon name={product.icon} size={24} />
          </div>
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${categoryColor}`}>
            {product.billingPeriod === 'monthly' && <Repeat size={10} />}
            {categoryLabel}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
          {product.name}
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed flex-grow">
          {product.tagline}
        </p>

        <div className="flex items-center justify-between mt-auto pt-5 border-t border-gray-100 dark:border-gray-800">
          <div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {product.priceDisplay}
            </span>
            {product.setupFeeCents > 0 && (
              <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">
                + ${(product.setupFeeCents / 100).toLocaleString()} setup
              </span>
            )}
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:bg-gray-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-all">
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </NavLink>
  );
};
