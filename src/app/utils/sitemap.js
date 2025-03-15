/**
 * Enhanced sitemap data module with a direct default export
 * Using modern JS features for better compatibility and performance
 */

// Define the site URL, with fallback
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://macromindai.com';

// Define the page data with standardized structure
const pages = [
  { url: '/', priority: 1.0, changefreq: 'weekly' },
  { url: '/#generator', priority: 0.9, changefreq: 'daily' },
  { url: '/#features', priority: 0.8, changefreq: 'monthly' },
  { url: '/#testimonials', priority: 0.7, changefreq: 'monthly' },
  { url: '/#about', priority: 0.6, changefreq: 'monthly' },
  { url: '/#contact', priority: 0.6, changefreq: 'monthly' },
  { url: '/privacy-policy', priority: 0.4, changefreq: 'yearly' },
  { url: '/terms-of-service', priority: 0.4, changefreq: 'yearly' }
];

// Direct default export for maximum compatibility
export default {
  siteUrl: SITE_URL,
  pages
}; 