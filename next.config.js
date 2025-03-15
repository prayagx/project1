/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    // Retain only valid experimental features
    webVitalsAttribution: ['CLS', 'LCP', 'FCP'],
  },
  // Ensure output is configured for Netlify
  output: 'export',
  // Disable image optimization for static exports
  images: {
    unoptimized: true,
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig; 