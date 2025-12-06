"use client";

import React, { useState, useEffect } from "react";
import styles from "./PriceDropNotification.module.css";
import { Bell, Check, X } from "lucide-react";
import { toast } from "sonner";
import { getAuthToken, fetchWithFallback } from "@/lib/api";
import { env } from "@/lib/env";

interface PriceDropNotificationProps {
  product: {
    id: number;
    name: string;
    price: number;
  };
}

const PriceDropNotification: React.FC<PriceDropNotificationProps> = ({ product }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isVisible && notificationStatus === "idle") {
      timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000); // Auto-hide after 10 seconds
    }
    return () => clearTimeout(timer);
  }, [isVisible, notificationStatus]);

  const handleNotification = async () => {
    try {
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication Required", {
          description: "Please login to set price drop notifications",
        });
        return;
      }

      setIsSubmitting(true);

      const response = await fetchWithFallback("/api/product/price-drop", env.apiBaseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.id,
        }),
      });

      const data = await response.json();

      if (data.success || response.ok) {
        setNotificationStatus("success");
        toast.success("Price Drop Alert Set!", {
          description: `We'll notify you when ${product.name} price drops below ৳${product.price.toLocaleString()}`,
        });
      } else {
        setNotificationStatus("error");
        toast.error("Failed to Set Notification", {
          description: data.message || "Please try again later",
        });
      }
    } catch (error) {
      console.error("Error setting price drop notification:", error);
      setNotificationStatus("error");
      toast.error("Request Failed", {
        description: "Unable to set price drop notification. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
      // Auto-hide after success or error
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    }
  };

  const handleClick = () => {
    if (!isSubmitting) {
      if (notificationStatus !== "success") {
        handleNotification();
      } else {
        setIsVisible((prev) => !prev);
      }
    }
  };

  const handleBellClick = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <>
      {/* Bell Icon */}
      <div
        className={`${styles.bellIcon} ${isVisible && notificationStatus === "idle" ? styles.active : ""}`}
        onClick={handleBellClick}
        role="button"
        aria-label="Toggle price drop notification"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleBellClick();
          }
        }}
      >
        <Bell className="h-6 w-6" />
      </div>

      {/* Notification Button */}
      <div className={`${styles.container} ${isVisible ? styles.open : styles.closed}`}>
        <button
          className={`${styles.button} ${isSubmitting ? styles.loading : ""} ${
            notificationStatus === "success"
              ? styles.success
              : notificationStatus === "error"
                ? styles.error
                : ""
          }`}
          aria-expanded={isVisible}
          onClick={handleClick}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              <span>Setting notification...</span>
            </>
          ) : notificationStatus === "success" ? (
            <>
              <Check className="h-4 w-4" />
              <span>Notification set!</span>
            </>
          ) : notificationStatus === "error" ? (
            <>
              <X className="h-4 w-4" />
              <span>Failed. Try again?</span>
            </>
          ) : (
            <>
              <Bell className="h-4 w-4" />
              <span>Get notified when price drops below ৳{product.price.toLocaleString()}</span>
            </>
          )}
        </button>
      </div>
    </>
  );
};

export default PriceDropNotification;
