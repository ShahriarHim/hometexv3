"use client";

import { useState, useEffect } from 'react';

export interface CookiePreferences {
  necessary: boolean;
  preferences: boolean;
  statistics: boolean;
  marketing: boolean;
}

/**
 * Hook to access cookie consent preferences
 * @returns Object containing cookie preferences and helper methods
 */
export const useCookieConsent = () => {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadPreferences = () => {
      const saved = localStorage.getItem('cookiePreferences');
      if (saved) {
        try {
          setPreferences(JSON.parse(saved));
        } catch (error) {
          console.error('Failed to parse cookie preferences:', error);
          setPreferences(null);
        }
      }
      setIsLoaded(true);
    };

    loadPreferences();

    // Listen for storage changes (if user updates preferences in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cookiePreferences' && e.newValue) {
        try {
          setPreferences(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Failed to parse cookie preferences from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  /**
   * Check if a specific cookie type is allowed
   */
  const isAllowed = (type: keyof CookiePreferences): boolean => {
    return preferences?.[type] ?? false;
  };

  /**
   * Check if user has made any cookie preference choice
   */
  const hasConsent = (): boolean => {
    return preferences !== null;
  };

  /**
   * Reset cookie preferences (clears localStorage)
   */
  const resetPreferences = () => {
    localStorage.removeItem('cookiePreferences');
    setPreferences(null);
  };

  return {
    preferences,
    isLoaded,
    isAllowed,
    hasConsent,
    resetPreferences,
  };
};

