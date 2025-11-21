"use client";

import React from 'react';
import { useCookieConsent } from '@/hooks/useCookieConsent';

/**
 * Example component demonstrating how to use the useCookieConsent hook
 * This component shows how to check cookie preferences before loading
 * analytics, marketing scripts, or other tracking tools
 */
const CookieConsentExample: React.FC = () => {
  const { preferences, isLoaded, isAllowed, hasConsent, resetPreferences } = useCookieConsent();

  // Wait for preferences to load
  if (!isLoaded) {
    return <div>Loading preferences...</div>;
  }

  // Check if user has given consent
  if (!hasConsent()) {
    return <div>Waiting for cookie consent...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Cookie Consent Status</h2>
      
      <div className="space-y-2">
        <p>
          <strong>Necessary Cookies:</strong> {isAllowed('necessary') ? '✅ Enabled' : '❌ Disabled'}
        </p>
        <p>
          <strong>Preferences Cookies:</strong> {isAllowed('preferences') ? '✅ Enabled' : '❌ Disabled'}
        </p>
        <p>
          <strong>Statistics Cookies:</strong> {isAllowed('statistics') ? '✅ Enabled' : '❌ Disabled'}
        </p>
        <p>
          <strong>Marketing Cookies:</strong> {isAllowed('marketing') ? '✅ Enabled' : '❌ Disabled'}
        </p>
      </div>

      {/* Example: Load analytics only if statistics cookies are allowed */}
      {isAllowed('statistics') && (
        <div className="mt-4 p-4 bg-blue-100 rounded">
          <p>📊 Analytics tracking is enabled</p>
          {/* This is where you would load Google Analytics, etc. */}
        </div>
      )}

      {/* Example: Load marketing scripts only if marketing cookies are allowed */}
      {isAllowed('marketing') && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <p>📢 Marketing tracking is enabled</p>
          {/* This is where you would load Facebook Pixel, Google Ads, etc. */}
        </div>
      )}

      <button 
        onClick={resetPreferences}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Reset Cookie Preferences
      </button>
    </div>
  );
};

export default CookieConsentExample;

