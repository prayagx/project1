import { ReactNode } from 'react';

export interface FeatureItem {
  title: string;
  description: string;
  icon: ReactNode;
  details?: string[];
}

export interface FeatureCategory {
  category: string;
  description: string;
  items: FeatureItem[];
} 