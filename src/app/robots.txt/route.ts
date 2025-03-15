import { NextResponse } from 'next/server';
import sitemap from '../utils/sitemap';

// Define the interface for the sitemap object
interface SitemapData {
  siteUrl: string;
  pages: Array<{
    url: string;
    priority: number;
    changefreq: string;
  }>;
}

// Using the static flag is preferred for static export in Next.js 14+
export const dynamic = 'force-static';

export async function GET() {
  // Cast the imported data to our interface
  const typedSitemap = sitemap as SitemapData;
  
  // Generate robots.txt content directly
  const content = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

Sitemap: ${typedSitemap.siteUrl}/sitemap.xml
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  });
} 