import { NextResponse } from 'next/server';
import sitemapData from '../utils/sitemap.js';

// Add revalidation setting for static export
export const revalidate = 1;

export async function GET() {
  try {
    // Generate the sitemap content directly
    const baseUrl = sitemapData.siteUrl;
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Create sitemap XML content
    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    
    // Add each URL to the sitemap
    sitemapData.pages.forEach(page => {
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