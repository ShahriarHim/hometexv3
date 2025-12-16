"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "dailyDealPopupLastShown";
const SESSION_KEY = "dailyDealPopupDismissed";

/**
 * Hook to manage Daily Deal Popup display logic
 * - Shows once per day (based on localStorage)
 * - Delayed 3-5 seconds after page load OR on exit intent
 * - Never reappears in same session after dismissal
 */
export const useDailyDealPopup = () => {
  const [shouldShow, setShouldShow] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Check if already dismissed in this session
    const sessionDismissed = sessionStorage.getItem(SESSION_KEY);
    if (sessionDismissed === "true") {
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => setHasChecked(true), 0);
      return;
    }

    // Check if shown today
    const lastShown = localStorage.getItem(STORAGE_KEY);
    const today = new Date().toDateString();

    if (lastShown === today) {
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => setHasChecked(true), 0);
      return;
    }

    // Random delay between 3-5 seconds
    const delay = Math.random() * 2000 + 3000; // 3000-5000ms

    const timeoutId = setTimeout(() => {
      setShouldShow(true);
      setHasChecked(true);
      localStorage.setItem(STORAGE_KEY, today);
    }, delay);

    let exitIntentTimeout: NodeJS.Timeout | null = null;

    // Exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is moving towards top of viewport (exit intent)
      if (e.clientY <= 5 && !shouldShow && !hasChecked) {
        if (exitIntentTimeout) {
          clearTimeout(exitIntentTimeout);
        }

        exitIntentTimeout = setTimeout(() => {
          setShouldShow(true);
          setHasChecked(true);
          localStorage.setItem(STORAGE_KEY, today);
          clearTimeout(timeoutId);
        }, 100);
      }
    };

    // Add exit intent listener after a short delay
    const exitIntentDelay = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(exitIntentDelay);
      if (exitIntentTimeout) {
        clearTimeout(exitIntentTimeout);
      }
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [shouldShow, hasChecked]);

  const handleClose = () => {
    setShouldShow(false);
    sessionStorage.setItem(SESSION_KEY, "true");
  };

  const handleShow = () => {
    setShouldShow(true);
  };

  return {
    shouldShow,
    handleClose,
    handleShow,
  };
};
