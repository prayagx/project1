import { useState, useEffect } from 'react';
import { analyticsConfig } from '../config';

// Extend window interface to include gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem(analyticsConfig.consentCookieName);
    if (!hasConsented) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem(analyticsConfig.consentCookieName, 'true');
    setShowBanner(false);
    
    // Enable analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted'
      });
    }
  };

  const declineCookies = () => {
    localStorage.setItem(analyticsConfig.consentCookieName, 'false');
    setShowBanner(false);
    
    // Disable analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied'
      });
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-4 shadow-lg z-50 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-700 dark:text-gray-300 flex-1">
          <p>
            We use cookies to enhance your experience, analyze site traffic, and for marketing purposes. 
            By clicking "Accept", you consent to the use of cookies for analytics and personalized content.
            <a href="/privacy-policy" className="text-primary-500 hover:text-primary-600 ml-1">
              Learn more
            </a>
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={declineCookies}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex-1 sm:flex-initial"
          >
            Decline
          </button>
          <button
            onClick={acceptCookies}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 flex-1 sm:flex-initial"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
} 