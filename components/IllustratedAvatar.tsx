import React from 'react';

interface IllustratedAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Color palettes - warm and professional
const AVATAR_COLORS = [
  { bg: 'bg-gradient-to-br from-rose-400 to-pink-600', text: 'text-white' },
  { bg: 'bg-gradient-to-br from-violet-400 to-purple-600', text: 'text-white' },
  { bg: 'bg-gradient-to-br from-blue-400 to-indigo-600', text: 'text-white' },
  { bg: 'bg-gradient-to-br from-emerald-400 to-teal-600', text: 'text-white' },
  { bg: 'bg-gradient-to-br from-amber-400 to-orange-600', text: 'text-white' },
  { bg: 'bg-gradient-to-br from-cyan-400 to-blue-600', text: 'text-white' },
  { bg: 'bg-gradient-to-br from-fuchsia-400 to-pink-600', text: 'text-white' },
  { bg: 'bg-gradient-to-br from-lime-400 to-green-600', text: 'text-white' },
];

// Generate consistent color based on name
const getColorFromName = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

// Get initials from name
const getInitials = (name: string) => {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
};

export const IllustratedAvatar: React.FC<IllustratedAvatarProps> = ({
  name,
  size = 'md',
  className = '',
}) => {
  const color = getColorFromName(name);
  const initials = getInitials(name);

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${color.bg}
        ${color.text}
        rounded-full
        flex items-center justify-center
        font-bold
        shadow-inner
        ring-2 ring-white/20
        ${className}
      `}
      aria-label={`Avatar for ${name}`}
    >
      {initials}
    </div>
  );
};

// Simple avatar for social proof section (anonymous users)
interface AnonymousAvatarProps {
  index: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AnonymousAvatar: React.FC<AnonymousAvatarProps> = ({
  index,
  size = 'md',
  className = '',
}) => {
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${color.bg}
        rounded-full
        shadow-inner
        ring-2 ring-white dark:ring-gray-900
        ${className}
      `}
      aria-hidden="true"
    />
  );
};

export default IllustratedAvatar;
