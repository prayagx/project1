import { NextResponse } from 'next/server';
import sitemapUtils from '../utils/sitemap';
import { seoConfig } from '../config';

export async function GET() {
  try {
    // Generate the sitemap content
    const staticPages = [
      { url: '/', priority: 1.0, changefreq: 'weekly' },
      { url: '/#generator', priority: 0.9, changefreq: 'daily' },
      { url: '/#features', priority: 0.8, changefreq: 'monthly' },
      { url: '/#testimonials', priority: 0.7, changefreq: 'monthly' },
      { url: '/#about', priority: 0.6, changefreq: 'monthly' },
      { url: '/#contact', priority: 0.6, changefreq: 'monthly' },
      { url: '/privacy-policy', priority: 0.4, changefreq: 'yearly' },
      { url: '/terms-of-service', priority: 0.4, changefreq: 'yearly' }
    ];
    
    const baseUrl = seoConfig.siteUrl;
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Create sitemap XML content
    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    
    // Add each URL to the sitemap
    staticPages.forEach((page) => {
      sitemapContent += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority.toFixed(1)}</priority>
  </url>`;
    });
    
    // Close sitemap
    sitemapContent += `
</urlset>`;

    // Return the XML with the appropriate content type
    return new NextResponse(sitemapContent, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400'
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
} 