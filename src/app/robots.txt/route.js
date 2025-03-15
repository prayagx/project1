import { NextResponse } from 'next/server';
import sitemapUtils from '../utils/sitemap.js';

// Best practices for Next.js 15 static content
export const dynamic = 'force-static';
export const revalidate = false; // Never revalidate during build
export const runtime = 'nodejs'; // Use Node.js runtime for best compatibility

export async function GET() {
  try {
    // Generate robots.txt content using our utility function
    const robotsTxtContent = sitemapUtils.generateRobotsTxt();
    
    // Return with proper headers for text content
    return new NextResponse(robotsTxtContent, {
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