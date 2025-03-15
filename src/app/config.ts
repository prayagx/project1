// Configuration settings for the application

// Analytics configuration
export const analyticsConfig = {
  // Google Analytics measurement ID
  googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || 'G-MEASUREMENT_ID',
  
  // Enable/disable analytics in development
  enableInDevelopment: false,
  
  // Tracking consent cookie name
  consentCookieName: 'macromind_analytics_consent',
  
  // Track events throttle (in milliseconds)
  trackingThrottle: 1000,
};

// SEO configuration
export const seoConfig = {
  // Default site title
  defaultTitle: 'MacroMindAI - Your AI-Powered Nutrition Companion',
  
  // Default site description
  defaultDescription: 'Get personalized meal plans and nutritional guidance powered by artificial intelligence. Create custom diet plans tailored to your body, goals, and preferences.',
  
  // Site URL
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://macromindai.com',
  
  // Default OG image
  defaultOgImage: '/images/og-image.jpg',
  
  // Twitter handle
  twitterHandle: '@macromindai',
  
  // Default locale
  locale: 'en_US',
  
  // Site name
  siteName: 'MacroMindAI',
};

// Feature flags
export const featureFlags = {
  // Enable weekly meal planning
  weeklyMealPlanning: true,
  
  // Enable analytics tracking
  analyticsTracking: true,
  
  // Enable social sharing
  socialSharing: true,
  
  // Enable print functionality
  printFunctionality: true,
  
  // Enable advanced cuisine preferences
  advancedCuisinePreferences: true,
}; 