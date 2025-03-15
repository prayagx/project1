import { NextResponse } from 'next/server';
import sitemap from '../utils/sitemap';

// Type definitions for the sitemap module are now in the module itself

// Best practices for Next.js 15 static content
export const dynamic = 'force-static';
export const revalidate = false; // Never revalidate during build
export const runtime = 'nodejs'; // Use Node.js runtime for best compatibility

export async function GET(): Promise<NextResponse> {
  try {
    // No need for casting as the module is already typed
    const content = sitemap.generateRobotsTxt();

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