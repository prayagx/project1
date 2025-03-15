// src/app/robots.js
// Next.js 15 metadata API for static site generation
// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots

export default function robots() {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://macromindai.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/404',
        '/500',
        '/*.json$'
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
} 