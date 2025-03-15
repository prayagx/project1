import { NextResponse } from 'next/server';
import sitemap from '../utils/sitemap';

// Using the static flag is preferred for static export in Next.js 14+
export const dynamic = 'force-static';

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