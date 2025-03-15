import { seoConfig } from '../config';

// Define the sitemap configuration as suggested in the error message
const sitemap = {
  // Helper function to generate sitemap
  async generateSitemap(baseUrl = seoConfig.siteUrl, outputPath = './public/sitemap.xml') {
    const staticPages = [
      { url: '/', priority: 1.0, changefreq: 'weekly' },
      { url: '/#generator', priority: 0.9, changefreq: 'daily' },
      { url: '/#features', priority: 0.8, changefreq: 'monthly' },
      { url: '/#testimonials', priority: 0.7, changefreq: 'monthly' },
      { url: '/#about', priority: 0.6, changefreq: 'monthly' },
      { url: '/#contact', priority: 0.6, changefreq: 'monthly' },
      { url: '/privacy-policy', priority: 0.4, changefreq: 'yearly' },
      { url: '/terms-of-service', priority: 0.4, changefreq: 'yearly' }
    ];

    return {
      staticPages,
      baseUrl,
      generateXML() {
        const currentDate = new Date().toISOString().split('T')[0];
        
        let content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
        
        staticPages.forEach(page => {
          content += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority.toFixed(1)}</priority>
  </url>`;
        });
        
        content += `
</urlset>`;
        
        return content;
      }
    };
  },
  
  // Helper function to generate robots.txt
  generateRobotsTxt(baseUrl = seoConfig.siteUrl) {
    return `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;
  }
};

// Export the sitemap object as the default export
export default sitemap; 