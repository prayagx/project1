import { NextResponse } from 'next/server';
import { seoConfig } from '../config';

// Add revalidation setting for static export
export const revalidate = 1;

export async function GET() {
  const content = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

Sitemap: ${seoConfig.siteUrl}/sitemap.xml
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  });
} 