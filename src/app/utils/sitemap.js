// Direct ES modules export syntax that Next.js expects
export default {
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