// Re-export sitemap from a plain JavaScript file
import sitemapData from './sitemap.js';

// Export for direct imports from index.js
export const sitemap = sitemapData;

// Default export for standard imports
export default sitemapData; 