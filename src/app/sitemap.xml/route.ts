import { NextResponse } from 'next/server';
import sitemap from '../utils/sitemap';

// Define the interface for the sitemap data
interface SitemapPage {
  url: string;
  priority: number;
  changefreq: string;
}

interface SitemapData {
  siteUrl: string;
  pages: SitemapPage[];
}

// Use static rendering for improved performance and compatibility
export const dynamic = 'force-static';
export const revalidate = false; // Never revalidate during build

export async function GET(): Promise<NextResponse> {
  try {
    // Cast the imported data to our interface
    const { siteUrl, pages } = sitemap as SitemapData;
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Create sitemap XML using template literals and modern array methods
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((page: SitemapPage) => `  <url>
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
    console.error('Error generating sitemap:', error instanceof Error ? error.message : String(error));
    return new NextResponse('Error generating sitemap', { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
} 