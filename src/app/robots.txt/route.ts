import { NextResponse } from 'next/server';
import sitemap from '../utils/sitemap';
import { seoConfig } from '../config';

// Add revalidation setting for static export
export const revalidate = 1;

export async function GET() {
  // Generate robots.txt content using the utility
  const content = sitemap.generateRobotsTxt(seoConfig.siteUrl);

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  });
} 