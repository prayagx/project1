/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
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
  // Adjust to prevent sitemap generation errors
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig; 