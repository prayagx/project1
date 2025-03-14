declare module 'next-themes' {
  export interface ThemeProviderProps {
    attribute?: string;
    defaultTheme?: string;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
    forcedTheme?: string;
    storageKey?: string;
    value?: { 
      theme: string; 
      setTheme: (theme: string) => void;
      resolvedTheme?: string;
      systemTheme?: string;
    };
    children?: React.ReactNode;
  }

  export function ThemeProvider(props: ThemeProviderProps): JSX.Element;

  export function useTheme(): {
    theme: string | undefined;
    setTheme: (theme: string) => void;
    resolvedTheme?: string;
    systemTheme?: string;
  };
} 