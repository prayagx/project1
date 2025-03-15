// Dual-mode export that works in both CommonJS and ES Modules environments
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const sitemapData = {
  siteUrl: 'https://macromindai.com',
  pages: [
    { url: '/', priority: 1.0, changefreq: 'weekly' },
    { url: '/#generator', priority: 0.9, changefreq: 'daily' },
    { url: '/#features', priority: 0.8, changefreq: 'monthly' },
    { url: '/#testimonials', priority: 0.7, changefreq: 'monthly' },
    { url: '/#about', priority: 0.6, changefreq: 'monthly' },
    { url: '/#contact', priority: 0.6, changefreq: 'monthly' },
    { url: '/privacy-policy', priority: 0.4, changefreq: 'yearly' },
    { url: '/terms-of-service', priority: 0.4, changefreq: 'yearly' }
  ]
};

// Set both default export and module.exports for maximum compatibility
exports.default = sitemapData;
// For CommonJS environments
if (typeof module !== 'undefined') {
  module.exports = sitemapData;
  // Also add named exports for direct property access
  module.exports.default = sitemapData;
} 