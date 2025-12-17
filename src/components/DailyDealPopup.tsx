"use client";

import { Button } from "@/components/ui/button";
import styles from "@/styles/DailyDealPopup.module.css";
import { Clock, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface DailyDealPopupProps {
  onClose: () => void;
}

const DailyDealPopup = ({ onClose }: DailyDealPopupProps) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 23,
    seconds: 45,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const product = {
    id: "demo-1",
    name: "Premium Cotton Bed Sheet Set - King Size",
    image: "/images/products/bedsheet-hero.jpg",
    originalPrice: 3500,
    dealPrice: 2450,
    discount: 30,
    url: "/products/bedding/bed-sheets/demo-1",
  };

  const handleGrabDeal = () => {
    onClose();
    window.location.href = product.url;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className={styles.container}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="daily-deal-title"
    >
      <div className={styles.popup}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close daily deal popup"
          type="button"
        >
          <X className={styles.closeIcon} />
        </button>

        <div className={styles.dealLabel}>Daily Deal</div>

        <div className={styles.imageContainer}>
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={300}
            className={styles.productImage}
            unoptimized
          />
        </div>

        <div className={styles.content}>
          <h3 id="daily-deal-title" className={styles.productName}>
            {product.name}
          </h3>

          <div className={styles.priceBlock}>
            <div className={styles.priceRow}>
              <span className={styles.originalPrice}>
                ৳{product.originalPrice.toLocaleString()}
              </span>
              <span className={styles.discountBadge}>-{product.discount}%</span>
            </div>
            <div className={styles.dealPrice}>৳{product.dealPrice.toLocaleString()}</div>
          </div>

          <div className={styles.timerContainer}>
            <Clock className={styles.timerIcon} />
            <span className={styles.timerLabel}>Ends in:</span>
            <div className={styles.timer}>
              <span className={styles.timerValue}>
                {String(timeLeft.hours).padStart(2, "0")}:
                {String(timeLeft.minutes).padStart(2, "0")}:
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
            </div>
          </div>

          <Button onClick={handleGrabDeal} className={styles.ctaButton} size="lg">
            Grab Deal
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DailyDealPopup;
