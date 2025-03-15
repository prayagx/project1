import { NextResponse } from 'next/server';
import sitemapUtils from '../utils/sitemap.js';

// Best practices for Next.js 15 static content
export const dynamic = 'force-static';
export const revalidate = false; // Never revalidate during build 
export const runtime = 'nodejs'; // Use Node.js runtime for best compatibility

export async function GET() {
  try {
    // Generate sitemap XML using our utility function
    const sitemapContent = sitemapUtils.generateSitemapXml();
    
    // Return with proper headers for XML content
    return new NextResponse(sitemapContent, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400'
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error instanceof Error ? error.message : String(error));
    return new NextResponse('Error generating sitemap', { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
} 