// Direct ES modules export syntax that Next.js expects
// This file provides sitemap data for use in route handlers and other components

// Define the site URL, with fallback
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://macromindai.com';

// Define the page data
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

// Generate the sitemap XML
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

// Generate robots.txt content
const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /
Disallow: /404
Disallow: /500
Disallow: /*.json$
Crawl-delay: 1

Sitemap: ${SITE_URL}/sitemap.xml`;
};

// Export the module with all sitemap-related utilities
export default {
  siteUrl: SITE_URL,
  pages,
  generateSitemapXml,
  generateRobotsTxt
}; 