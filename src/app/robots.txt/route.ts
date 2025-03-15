import { NextResponse } from 'next/server';
import sitemap from '../utils/sitemap';

// Define the interface for the sitemap data
interface SitemapData {
  siteUrl: string;
  pages: Array<{
    url: string;
    priority: number;
    changefreq: string;
  }>;
}

// Use static rendering for improved performance and compatibility
export const dynamic = 'force-static';
export const revalidate = false; // Never revalidate during build

export async function GET(): Promise<NextResponse> {
  // Cast the imported data to our interface and destructure
  const { siteUrl } = sitemap as SitemapData;
  
  // Generate robots.txt with best practices for search engines
  const content = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Disallow certain paths that shouldn't be indexed
Disallow: /api/
Disallow: /_next/

# Point to sitemap location
Sitemap: ${siteUrl}/sitemap.xml
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  });
} 