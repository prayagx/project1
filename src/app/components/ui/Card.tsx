'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  interactive?: boolean;
  onClick?: () => void;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({
  children,
  className = '',
  title,
  subtitle,
  icon,
  interactive = false,
  onClick,
  shadow = 'md'
}: CardProps) {
  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  return (
    <motion.div
      className={`
        bg-white dark:bg-dark-card 
        rounded-xl border border-gray-100 dark:border-dark-border
        ${shadows[shadow]}
        overflow-hidden
        transition-all duration-300
        ${interactive ? 'cursor-pointer hover:shadow-card-hover' : ''}
        ${className}
      `}
      onClick={onClick}
      whileHover={interactive ? { 
        y: -5,
        transition: { duration: 0.2 },
      } : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {(title || icon) && (
        <div className="px-5 py-4 border-b border-gray-100 dark:border-dark-border flex items-center">
          {icon && (
            <div className="mr-3 text-primary-500">
              {icon}
            </div>
          )}
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}
      <div className="p-5">
        {children}
      </div>
    </motion.div>
  );
}

export function CardGrid({ 
  children, 
  className = '', 
  columns = { default: 1, sm: 1, md: 2, lg: 3 } 
}: { 
  children: ReactNode; 
  className?: string;
  columns?: { 
    default: number; 
    sm?: number; 
    md?: number; 
    lg?: number; 
    xl?: number; 
  }; 
}) {
  const getGridCols = () => {
    const cols = [];
    if (columns.default) cols.push(`grid-cols-${columns.default}`);
    if (columns.sm) cols.push(`sm:grid-cols-${columns.sm}`);
    if (columns.md) cols.push(`md:grid-cols-${columns.md}`);
    if (columns.lg) cols.push(`lg:grid-cols-${columns.lg}`);
    if (columns.xl) cols.push(`xl:grid-cols-${columns.xl}`);
    return cols.join(' ');
  };

  return (
    <div className={`grid ${getGridCols()} gap-6 ${className}`}>
      {children}
    </div>
  );
} 