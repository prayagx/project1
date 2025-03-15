/**
 * Enhanced sitemap data module with a direct default export
 * Optimized for Next.js 15 and React 19
 */

// Define the site URL, with fallback
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://macromindai.com';

// Define the page data with standardized structure for Next.js 15 compatibility
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

// Helper functions for sitemap generation
const generateSitemapXml = () => {
  const currentDate = new Date().toISOString().split('T')[0];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority.toFixed(1)}</priority>
  </url>`).join('\n')}
</urlset>`;
};

const generateRobotsTxt = () => {
  return `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Disallow certain paths that shouldn't be indexed
Disallow: /api/
Disallow: /_next/
Disallow: /404
Disallow: /500
Disallow: /*.json$

# Crawl delay for better server performance
Crawl-delay: 1

# Point to sitemap location
Sitemap: ${SITE_URL}/sitemap.xml
`;
};

// Direct default export for maximum compatibility with Next.js 15
export default {
  siteUrl: SITE_URL,
  pages,
  generateSitemapXml,
  generateRobotsTxt
}; 