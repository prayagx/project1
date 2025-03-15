import { NextResponse } from 'next/server';
import sitemap from '../utils/sitemap';
import { seoConfig } from '../config';

// Add revalidation setting for static export
export const revalidate = 1;

export async function GET() {
  try {
    // Generate the sitemap content using the new utility
    const sitemapGenerator = await sitemap.generateSitemap(seoConfig.siteUrl);
    const sitemapContent = sitemapGenerator.generateXML();

    // Return the XML with the appropriate content type
    return new NextResponse(sitemapContent, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400'
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
} 