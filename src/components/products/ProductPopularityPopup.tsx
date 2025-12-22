"use client";

import { getPusherClient } from "@/lib/pusher";
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
    if (!productId) {
      return;
    }

    // Generate unique user ID for this session
    const userId = `user-${Math.random().toString(36).substring(2, 15)}`;
    // Use public channel instead of presence channel (no auth needed)
    const channelName = `product-${productId}`;

    // Get initial viewer count
    fetch(`/api/product-viewers?productId=${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.viewerCount !== undefined) {
          setViewersCount(data.viewerCount);
        }
      })
      .catch((err) => console.error("Failed to fetch viewer count:", err));

    // Join the product page
    fetch("/api/product-viewers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, action: "join", userId }),
    }).catch((err) => console.error("Failed to join:", err));

    // Subscribe to real-time updates
    const pusher = getPusherClient();
    const channel = pusher.subscribe(channelName);

    channel.bind("viewer-update", (data: { viewerCount: number; productId: number }) => {
      if (data.productId === productId) {
        setViewersCount(data.viewerCount);
      }
    });

    // Generate sold count (this can remain static or come from API)
    const randomSold = Math.floor(Math.random() * 15) + 3; // 3-17 sold
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

    // Cleanup function
    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(autoHideTimeout);
      if (popupAlternateInterval) {
        clearInterval(popupAlternateInterval);
      }

      // Leave the product page
      fetch("/api/product-viewers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, action: "leave", userId }),
      }).catch((err) => console.error("Failed to leave:", err));

      // Unsubscribe from Pusher channel
      const pusher = getPusherClient();
      pusher.unsubscribe(channelName);
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
