#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

console.log(`${colors.bright}${colors.cyan}Starting build process...${colors.reset}`);

try {
  // Clean previous build
  console.log(`\n${colors.yellow}Cleaning previous build...${colors.reset}`);
  if (fs.existsSync('.next')) {
    execSync('rm -rf .next', { stdio: 'inherit' });
  }
  if (fs.existsSync('out')) {
    execSync('rm -rf out', { stdio: 'inherit' });
  }

  // Create public directory if it doesn't exist
  if (!fs.existsSync('public')) {
    fs.mkdirSync('public', { recursive: true });
  }

  // Create sitemap.xml if it doesn't exist
  const sitemapPath = path.join('public', 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    console.log(`\n${colors.yellow}Creating sitemap.xml...${colors.reset}`);
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://macromindai.netlify.app/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://macromindai.netlify.app/#generator</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://macromindai.netlify.app/#features</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://macromindai.netlify.app/#testimonials</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://macromindai.netlify.app/#about</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://macromindai.netlify.app/#contact</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;
    fs.writeFileSync(sitemapPath, sitemapContent);
  }

  // Create robots.txt if it doesn't exist
  const robotsPath = path.join('public', 'robots.txt');
  if (!fs.existsSync(robotsPath)) {
    console.log(`\n${colors.yellow}Creating robots.txt...${colors.reset}`);
    const robotsContent = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

Sitemap: https://macromindai.netlify.app/sitemap.xml`;
    fs.writeFileSync(robotsPath, robotsContent);
  }

  // Create a simple build command that bypasses the sitemap issue
  console.log(`\n${colors.yellow}Running Next.js build...${colors.reset}`);
  
  // Create a temporary next.config.js file that doesn't use the sitemap
  const nextConfigPath = 'next.config.js';
  const nextConfigBackupPath = 'next.config.js.bak';
  
  if (fs.existsSync(nextConfigPath)) {
    fs.copyFileSync(nextConfigPath, nextConfigBackupPath);
    
    // Read the current config
    const configContent = fs.readFileSync(nextConfigPath, 'utf8');
    
    // Create a simplified config
    const simplifiedConfig = `/** @type {import('next').NextConfig} */
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
};

module.exports = nextConfig;`;
    
    // Write the simplified config
    fs.writeFileSync(nextConfigPath, simplifiedConfig);
  }
  
  try {
    // Run the build command
    execSync('next build --debug', { stdio: 'inherit' });
    
    console.log(`\n${colors.bright}${colors.green}Build completed successfully!${colors.reset}`);
    console.log(`\n${colors.cyan}The static site has been generated in the 'out' directory.${colors.reset}`);
    console.log(`${colors.cyan}You can now deploy this directory to Netlify.${colors.reset}`);
  } finally {
    // Restore the original next.config.js
    if (fs.existsSync(nextConfigBackupPath)) {
      fs.copyFileSync(nextConfigBackupPath, nextConfigPath);
      fs.unlinkSync(nextConfigBackupPath);
    }
  }
} catch (error) {
  console.error(`\n${colors.red}Build failed:${colors.reset}`, error);
  process.exit(1);
} 