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
      <body className={`${inter.className} antialiased bg-white dark:bg-gray-900 transition-colors duration-300 min-h-screen`}>
        <Providers>
          <div className="w-full min-h-screen transition-all duration-300">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
} 