import { NextResponse } from 'next/server';
import sitemap from '../utils/sitemap';

// Define the interface for the sitemap object
interface SitemapPage {
  url: string;
  priority: number;
  changefreq: string;
}

interface SitemapData {
  siteUrl: string;
  pages: SitemapPage[];
}

// Using the static flag is preferred for static export in Next.js 14+
export const dynamic = 'force-static';

export async function GET() {
  try {
    // Cast the imported data to our interface
    const typedSitemap = sitemap as SitemapData;
    
    // Generate the sitemap content directly
    const baseUrl = typedSitemap.siteUrl;
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Create sitemap XML content
    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    
    // Add each URL to the sitemap
    typedSitemap.pages.forEach((page: SitemapPage) => {
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