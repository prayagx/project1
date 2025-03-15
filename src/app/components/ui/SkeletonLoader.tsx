'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
  rounded?: string;
}

export function Skeleton({
  className = '',
  height = 'h-6',
  width = 'w-full',
  rounded = 'rounded-md'
}: SkeletonProps) {
  return (
    <div
      className={`${height} ${width} ${rounded} bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer bg-[length:400%_100%] ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-dark-card p-4 rounded-lg shadow-md space-y-4 animate-pulse">
      <Skeleton height="h-6" width="w-3/4" />
      <div className="space-y-2">
        <Skeleton height="h-4" />
        <Skeleton height="h-4" />
        <Skeleton height="h-4" width="w-5/6" />
      </div>
    </div>
  );
}

export function MealPlanSkeleton() {
  return (
    <div className="bg-white dark:bg-dark-card p-4 rounded-lg shadow-md space-y-6 animate-pulse">
      <Skeleton height="h-7" width="w-1/2" />
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton height="h-5" width="w-1/4" />
          <div className="pl-4 space-y-2">
            <Skeleton height="h-4" />
            <Skeleton height="h-4" width="w-11/12" />
            <Skeleton height="h-4" width="w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white dark:bg-dark-card p-4 rounded-lg shadow-md space-y-4">
      <Skeleton height="h-6" width="w-1/2" />
      <div className="h-64 flex items-center justify-center">
        <div className="w-32 h-32 rounded-full border-4 border-gray-200 dark:border-gray-700 border-t-primary-500 animate-spin" />
      </div>
    </div>
  );
}

export default function SkeletonLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <CardSkeleton />
      <CardSkeleton />
      <MealPlanSkeleton />
      <ChartSkeleton />
    </div>
  );
} 