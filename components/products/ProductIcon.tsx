import React from 'react';
import {
  FileSearch, BookOpen, Mail, Package, MessageSquare, Bell, Star, Zap,
  MapPin, Database, Layout, BarChart, LucideProps
} from 'lucide-react';

const iconMap: Record<string, React.FC<LucideProps>> = {
  FileSearch,
  BookOpen,
  Mail,
  Package,
  MessageSquare,
  Bell,
  Star,
  Zap,
  MapPin,
  Database,
  Layout,
  BarChart,
};

interface ProductIconProps {
  name: string;
  size?: number;
  className?: string;
}

export const ProductIcon: React.FC<ProductIconProps> = ({ name, size = 24, className }) => {
  const Icon = iconMap[name] || Package;
  return <Icon size={size} className={className} />;
};
