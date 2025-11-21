"use client";

import React, { useState, useEffect } from 'react';
import CookiesPopup from './CookiesPopup';

/**
 * CookiesManager component that handles displaying the cookie consent popup
 * Only shows the popup if the user hasn't made a cookie preference choice yet
 */
const CookiesManager: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Check if user has already made a cookie preference choice
    const cookiePreferences = localStorage.getItem('cookiePreferences');
    
    if (!cookiePreferences) {
      // Small delay before showing popup for better UX
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShowPopup(false);
  };

  if (!showPopup) {
    return null;
  }

  return <CookiesPopup onClose={handleClose} />;
};

export default CookiesManager;

