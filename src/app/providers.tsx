'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import { DietPlanProvider } from './context/DietPlanContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <DietPlanProvider>
        {children}
      </DietPlanProvider>
    </ThemeProvider>
  );
} 