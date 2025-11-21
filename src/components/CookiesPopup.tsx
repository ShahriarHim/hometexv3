"use client";

import React, { useState, useEffect } from 'react';
import styles from '@/styles/CookiesPopup.module.css';

interface CookiePreferences {
  necessary: boolean;
  preferences: boolean;
  statistics: boolean;
  marketing: boolean;
}

interface CookiesPopupProps {
  onClose: () => void;
}

const CookiesPopup: React.FC<CookiesPopupProps> = ({ onClose }) => {
  const defaultPreferences: CookiePreferences = {
    necessary: true,
    preferences: false,
    statistics: false,
    marketing: false,
  };

  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    const savedPreferences = localStorage.getItem('cookiePreferences');
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error('Failed to parse cookie preferences:', error);
      }
    }
  }, []);

  const handleToggle = (type: keyof CookiePreferences) => {
    setPreferences((prev) => {
      // "Necessary" is always true, so skip toggling it
      if (type === 'necessary') return prev;
      const newPreferences = { ...prev, [type]: !prev[type] };
      localStorage.setItem('cookiePreferences', JSON.stringify(newPreferences));
      return newPreferences;
    });
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      preferences: true,
      statistics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookiePreferences', JSON.stringify(allAccepted));
    onClose();
  };

  const handleAllowSelection = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    onClose();
  };

  const handleDeny = () => {
    const allDenied: CookiePreferences = {
      necessary: true, // remains true
      preferences: false,
      statistics: false,
      marketing: false,
    };
    setPreferences(allDenied);
    localStorage.setItem('cookiePreferences', JSON.stringify(allDenied));
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        {/* Left section: Logo & short text */}
        <div className={styles.leftSection}>
          <img
            src="/images/hometex-logo.png"
            alt="Cookie Logo"
            className={styles.logo}
          />
          <p className={styles.description}>
            We use cookies to enhance your shopping experience.{' '}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.learnMoreLink}
            >
              Learn more
            </a>
          </p>
        </div>

        {/* Middle section: Toggles in a row */}
        <div className={styles.middleSection}>
          <div className={styles.toggleGroup}>
            <label className={styles.toggleLabel}>
              Necessary
              <div className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={preferences.necessary}
                  disabled
                  readOnly
                />
                <span className={`${styles.slider} ${styles.disabled}`}></span>
              </div>
            </label>

            <label className={styles.toggleLabel}>
              Preferences
              <div className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={preferences.preferences}
                  onChange={() => handleToggle('preferences')}
                />
                <span className={styles.slider}></span>
              </div>
            </label>

            <label className={styles.toggleLabel}>
              Statistics
              <div className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={preferences.statistics}
                  onChange={() => handleToggle('statistics')}
                />
                <span className={styles.slider}></span>
              </div>
            </label>

            <label className={styles.toggleLabel}>
              Marketing
              <div className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={() => handleToggle('marketing')}
                />
                <span className={styles.slider}></span>
              </div>
            </label>
          </div>
        </div>

        {/* Right section: Buttons */}
        <div className={styles.rightSection}>
          <button
            className={`${styles.popupButton} ${styles.acceptAll}`}
            onClick={handleAcceptAll}
            aria-label="Accept all cookies"
          >
            Allow all
          </button>
          <button
            className={`${styles.popupButton} ${styles.allowSelection}`}
            onClick={handleAllowSelection}
            aria-label="Allow selected cookies"
          >
            Allow selection
          </button>
          <button
            className={`${styles.popupButton} ${styles.deny}`}
            onClick={handleDeny}
            aria-label="Deny optional cookies"
          >
            Deny
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookiesPopup;

