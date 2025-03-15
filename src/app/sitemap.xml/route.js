import { NextResponse } from 'next/server';

// Best practices for Next.js 15 static content
export const dynamic = 'force-static';
export const revalidate = false; // Never revalidate during build 
export const runtime = 'nodejs'; // Use Node.js runtime for best compatibility

export async function GET() {
  try {
    // Define the site URL, with fallback
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://macromindai.com';
    
    // Define the page data
    const pages = [
      { url: '/', priority: 1.0, changefreq: 'weekly' },
      { url: '/#generator', priority: 0.9, changefreq: 'daily' },
      { url: '/#features', priority: 0.8, changefreq: 'monthly' },
      { url: '/#testimonials', priority: 0.7, changefreq: 'monthly' },
      { url: '/#about', priority: 0.6, changefreq: 'monthly' },
      { url: '/#contact', priority: 0.6, changefreq: 'monthly' },
      { url: '/privacy-policy', priority: 0.4, changefreq: 'yearly' },
      { url: '/terms-of-service', priority: 0.4, changefreq: 'yearly' }
    ];
    
    // Generate the sitemap XML
    const currentDate = new Date().toISOString().split('T')[0];
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority.toFixed(1)}</priority>
  </url>`).join('\n')}
</urlset>`;

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