import { NextResponse } from 'next/server';
import sitemapData from '../utils/sitemap.js';

// Add revalidation setting for static export
export const revalidate = 1;

export async function GET() {
  // Generate robots.txt content directly
  const content = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

Sitemap: ${sitemapData.siteUrl}/sitemap.xml
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  });
} 