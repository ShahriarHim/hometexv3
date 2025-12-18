"use client";

import { Eye } from "lucide-react";
import React, { useEffect, useState } from "react";
import styles from "./ProductPopularityPopup.module.css";

type PopupType = "popular" | "inDemand" | "hidden";

interface ProductPopularityPopupProps {
  productId?: number;
}

export const ProductPopularityPopup: React.FC<ProductPopularityPopupProps> = ({ productId }) => {
  const [viewersCount, setViewersCount] = useState<number>(0);
  const [soldCount, setSoldCount] = useState<number>(0);
  const [currentPopup, setCurrentPopup] = useState<PopupType>("hidden");
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  useEffect(() => {
    // Generate random numbers for demo data
    const randomViewers = Math.floor(Math.random() * 50) + 15; // 15-64 viewers
    const randomSold = Math.floor(Math.random() * 15) + 3; // 3-17 sold

    setViewersCount(randomViewers);
    setSoldCount(randomSold);

    // Initial delay: 10-15 seconds after page load
    const initialDelay = Math.floor(Math.random() * 5000) + 10000; // 10-15 seconds

    let popupAlternateInterval: NodeJS.Timeout;
    let autoHideTimeout: NodeJS.Timeout;

    const scheduleAutoHide = () => {
      // Clear any existing auto-hide timer
      if (autoHideTimeout) {
        clearTimeout(autoHideTimeout);
      }
      // Auto-hide after 5-6 seconds
      const hideDelay = Math.floor(Math.random() * 1000) + 5000; // 5-6 seconds
      autoHideTimeout = setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentPopup("hidden");
          setIsTransitioning(false);
        }, 400); // Fade out duration
      }, hideDelay);
    };

    const initialTimeout = setTimeout(() => {
      setCurrentPopup("popular");
      scheduleAutoHide();

      // Start alternating after first popup appears
      const alternatePopup = () => {
        setIsTransitioning(true);
        // Fade out current content
        setTimeout(() => {
          setCurrentPopup((prev) => {
            if (prev === "popular") {
              return "inDemand";
            } else if (prev === "inDemand") {
              return "popular";
            }
            return prev;
          });
          // Fade in new content
          setTimeout(() => {
            setIsTransitioning(false);
            scheduleAutoHide(); // Schedule auto-hide for the new popup
          }, 50);
        }, 400); // Fade out duration
      };

      // Alternate between popups every 8-12 seconds
      popupAlternateInterval = setInterval(alternatePopup, Math.floor(Math.random() * 4000) + 8000); // 8-12 seconds
    }, initialDelay);

    // Update numbers periodically for dynamic feel
    const numberUpdateInterval = setInterval(() => {
      const newViewers = Math.floor(Math.random() * 50) + 15;
      const newSold = Math.floor(Math.random() * 15) + 3;
      setViewersCount(newViewers);
      setSoldCount(newSold);
    }, 15000); // Update every 15 seconds

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(autoHideTimeout);
      clearInterval(numberUpdateInterval);
      if (popupAlternateInterval) {
        clearInterval(popupAlternateInterval);
      }
    };
  }, [productId]);

  const isVisible = currentPopup !== "hidden";

  return (
    <div
      className={`${styles.container} ${isVisible ? styles.visible : styles.hidden} ${
        isTransitioning ? styles.transitioning : ""
      }`}
    >
      {/* Popular Popup - Viewers Count */}
      {currentPopup === "popular" && (
        <div className={`${styles.popupContent} ${styles.popularContent}`}>
          <Eye className={styles.eyeIcon} />
          <span className={styles.viewersText}>
            {viewersCount} others are looking at this right now
          </span>
        </div>
      )}

      {/* In Demand Popup */}
      {currentPopup === "inDemand" && (
        <div className={`${styles.popupContent} ${styles.demandContent}`}>
          <h4 className={styles.demandTitle}>In Demand</h4>
          <p className={styles.demandText}>Sold {soldCount} times in last 48 hours</p>
        </div>
      )}
    </div>
  );
};

export default ProductPopularityPopup;
