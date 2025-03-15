// src/app/robots.js - Static robots configuration for Next.js 15
// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://macromindai.com';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/404',
          '/500',
          '/*.json$',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
} 