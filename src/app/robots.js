// src/app/robots.js - Static metadata file for Next.js 15 static export
// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots

// Simple object export for the robots.txt data
export default function robots() {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://macromindai.com';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/404', '/500', '/*.json$'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
} 