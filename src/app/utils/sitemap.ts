import fs from 'fs';
import { seoConfig } from '../config';

/**
 * Sitemap utilities for generating SEO files
 */
const sitemapUtils = {
  generateSitemap,
  generateRobotsTxt,
  generateSEOFiles
};

// Default export for the module
export default sitemapUtils;

type UrlObject = {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
};

/**
 * Generate a sitemap.xml file for the website
 * @param baseUrl - The base URL of the website
 * @param pages - Array of page paths relative to the baseUrl
 * @param outputPath - Path to output the sitemap file
 */
export async function generateSitemap(
  baseUrl: string = seoConfig.siteUrl,
  outputPath: string = './public/sitemap.xml'
): Promise<void> {
  // Main static pages
  const staticPages: UrlObject[] = [
    { url: '/', priority: 1.0, changefreq: 'weekly' },
    { url: '/#generator', priority: 0.9, changefreq: 'daily' },
    { url: '/#features', priority: 0.8, changefreq: 'monthly' },
    { url: '/#testimonials', priority: 0.7, changefreq: 'monthly' },
    { url: '/#about', priority: 0.6, changefreq: 'monthly' },
    { url: '/#contact', priority: 0.6, changefreq: 'monthly' },
    { url: '/privacy-policy', priority: 0.4, changefreq: 'yearly' },
    { url: '/terms-of-service', priority: 0.4, changefreq: 'yearly' }
  ];

  // Current date for lastmod
  const currentDate = new Date().toISOString().split('T')[0];

  // Create sitemap XML content
  let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Add each URL to the sitemap
  staticPages.forEach((page) => {
    sitemapContent += `  <url>\n`;
    sitemapContent += `    <loc>${baseUrl}${page.url}</loc>\n`;
    sitemapContent += `    <lastmod>${currentDate}</lastmod>\n`;
    if (page.changefreq) {
      sitemapContent += `    <changefreq>${page.changefreq}</changefreq>\n`;
    }
    if (page.priority !== undefined) {
      sitemapContent += `    <priority>${page.priority.toFixed(1)}</priority>\n`;
    }
    sitemapContent += `  </url>\n`;
  });

  // Close sitemap
  sitemapContent += `</urlset>`;

  // Write sitemap file
  try {
    fs.writeFileSync(outputPath, sitemapContent);
    console.log(`Sitemap generated at ${outputPath}`);
  } catch (err) {
    console.error('Error writing sitemap:', err);
  }
}

/**
 * Generate a robots.txt file for the website
 * @param baseUrl - The base URL of the website
 * @param outputPath - Path to output the robots.txt file
 */
export function generateRobotsTxt(
  baseUrl: string = seoConfig.siteUrl,
  outputPath: string = './public/robots.txt'
): void {
  const robotsTxtContent = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;

  try {
    fs.writeFileSync(outputPath, robotsTxtContent);
    console.log(`robots.txt generated at ${outputPath}`);
  } catch (err) {
    console.error('Error writing robots.txt:', err);
  }
}

/**
 * Generate sitemap and robots.txt files
 */
export function generateSEOFiles(): void {
  generateSitemap();
  generateRobotsTxt();
} 