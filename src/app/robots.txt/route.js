import { NextResponse } from 'next/server';

// Best practices for Next.js 15 static content
export const dynamic = 'force-static';
export const revalidate = false; // Never revalidate during build
export const runtime = 'nodejs'; // Use Node.js runtime for best compatibility

export async function GET() {
  try {
    // Define the site URL, with fallback
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://macromindai.com';
    
    // Generate the robots.txt content
    const content = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Disallow certain paths that shouldn't be indexed
Disallow: /api/
Disallow: /_next/
Disallow: /404
Disallow: /500
Disallow: /*.json$

# Crawl delay for better server performance
Crawl-delay: 1

# Point to sitemap location
Sitemap: ${SITE_URL}/sitemap.xml
`;

    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400'
      }
    });
  } catch (error) {
    console.error('Error generating robots.txt:', error instanceof Error ? error.message : String(error));
    return new NextResponse('Error generating robots.txt', { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
} 