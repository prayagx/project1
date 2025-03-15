import { NextResponse } from 'next/server';
import sitemap from '../utils/sitemap';

// Use static rendering for improved performance and compatibility
export const dynamic = 'force-static';
export const revalidate = false; // Never revalidate during build

export async function GET() {
  const { siteUrl } = sitemap;
  
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