import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-800';
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-[shimmer_2s_infinite]',
    none: '',
  };

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  return (
    <div
      className={`${baseClasses} ${animationClasses[animation]} ${variantClasses[variant]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};

export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 ${className}`}>
    <Skeleton className="h-48 w-full mb-4" />
    <Skeleton className="h-4 w-3/4 mb-3" />
    <Skeleton className="h-4 w-1/2 mb-4" />
    <Skeleton className="h-10 w-full" />
  </div>
);

export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 4 }) => (
  <tr className="border-b border-gray-100 dark:border-gray-800">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

export const ListItemSkeleton: React.FC = () => (
  <div className="flex items-center gap-4 p-4 border-b border-gray-100 dark:border-gray-800">
    <Skeleton variant="circular" className="w-10 h-10 flex-shrink-0" />
    <div className="flex-1">
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <Skeleton className="h-8 w-20" />
  </div>
);

export const DashboardCardSkeleton: React.FC = () => (
  <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-5 w-24" />
      <Skeleton variant="circular" className="w-8 h-8" />
    </div>
    <Skeleton className="h-8 w-20 mb-2" />
    <Skeleton className="h-4 w-32" />
  </div>
);

export const ActivityFeedSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex gap-4">
        <Skeleton variant="circular" className="w-8 h-8 flex-shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    ))}
  </div>
);

export const ProjectCardSkeleton: React.FC = () => (
  <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
    <Skeleton className="h-2 w-full rounded-full mb-4" />
    <div className="flex gap-4">
      <Skeleton className="h-16 w-20" />
      <Skeleton className="h-16 w-20" />
      <Skeleton className="h-16 w-20" />
    </div>
  </div>
);

export const MessageSkeleton: React.FC = () => (
  <div className="p-4 border-b border-gray-100 dark:border-gray-800">
    <div className="flex items-center gap-3 mb-2">
      <Skeleton variant="circular" className="w-10 h-10" />
      <div className="flex-1">
        <Skeleton className="h-4 w-32 mb-1" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
    <Skeleton className="h-4 w-full mb-1" />
    <Skeleton className="h-4 w-3/4" />
  </div>
);

export const InvoiceSkeleton: React.FC = () => (
  <div className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl">
    <div className="flex items-center justify-between mb-3">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-6 w-16" />
    </div>
  </div>
);
