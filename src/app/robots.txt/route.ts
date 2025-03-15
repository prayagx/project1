import { NextResponse } from 'next/server';
// Import sitemap with a more flexible approach
import sitemapModule from '../utils/sitemap';

// Define the interface for the sitemap object
interface SitemapData {
  siteUrl: string;
  pages: Array<{
    url: string;
    priority: number;
    changefreq: string;
  }>;
}

// Handle both direct export and { default } export
const sitemap = ('default' in sitemapModule ? sitemapModule.default : sitemapModule) as SitemapData;

// Add revalidation setting for static export
export const revalidate = 1;

export async function GET() {
  // Generate robots.txt content directly
  const content = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

Sitemap: ${sitemap.siteUrl}/sitemap.xml
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  });
} 