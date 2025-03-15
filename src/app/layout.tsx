import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'MacroMindAI - Personalized Nutrition Plans',
  description: 'Create personalized diet plans based on your fitness goals and dietary preferences.',
  keywords: ['diet planning', 'nutrition', 'meal plans', 'macronutrients', 'healthy eating', 'fitness'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable}`}>
      <body className={`${inter.className} antialiased transition-colors duration-300 bg-gray-50 dark:bg-dark-bg min-h-screen`}>
        <Providers>
          <div className="transition-all duration-300">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
} 