import { NextResponse } from 'next/server';
import sitemap from '../utils/sitemap';

// Use static rendering for improved performance and compatibility
export const dynamic = 'force-static';
export const revalidate = false; // Never revalidate during build

export async function GET() {
  try {
    const { siteUrl, pages } = sitemap;
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Create sitemap XML using template literals for better readability
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority.toFixed(1)}</priority>
  </url>`).join('\n')}
</urlset>`;

    // Return with proper headers for XML content
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