/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
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
  // Disable the telemetry to avoid issues
  distDir: process.env.BUILD_DIR || '.next',
  // Allow environment variables to be accessed
  env: {
    CALORIE_NINJAS_API_KEY: process.env.CALORIE_NINJAS_API_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://macromindai.com'
  },
  // Ensure TypeScript paths are properly resolved
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // Configuration for the latest Next.js
  experimental: {
    optimizePackageImports: ['@heroicons/react', '@headlessui/react', 'framer-motion'],
  },
  // Adjust to prevent sitemap generation errors
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig; 