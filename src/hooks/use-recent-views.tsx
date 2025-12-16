"use client";

import type { Product } from "@/types";
import { useCallback, useEffect, useState } from "react";

interface RecentViewItem {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  childSubcategory?: string;
  viewedAt: number;
}

const STORAGE_KEY = "recentview";
const MAX_ITEMS = 20;

// Utility function to clear recent views (can be called outside of hook)
export const clearRecentViewsStorage = () => {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_KEY);
      // Dispatch custom event to notify components
      window.dispatchEvent(new Event("recentViewsUpdated"));
    } catch (error) {
      console.error("Error clearing recent views:", error);
    }
  }
};

// Helper function to load recent views from localStorage
const loadRecentViews = (): RecentViewItem[] => {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.error("Error loading recent views:", error);
  }
  return [];
};

export const useRecentViews = () => {
  const [recentViews, setRecentViews] = useState<RecentViewItem[]>(() => loadRecentViews());

  // Listen for storage changes (cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setRecentViews(loadRecentViews());
      }
    };

    // Listen for custom event (same-tab sync)
    const handleCustomStorageChange = () => {
      setRecentViews(loadRecentViews());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("recentViewsUpdated", handleCustomStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("recentViewsUpdated", handleCustomStorageChange);
    };
  }, []);

  const addRecentView = useCallback((product: Product) => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let items: RecentViewItem[] = stored ? JSON.parse(stored) : [];

      const newItem: RecentViewItem = {
        id: product.id,
        name: product.name,
        image: product.images?.[0] || product.primary_photo || "",
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.category,
        subcategory: product.subcategory,
        childSubcategory: product.childSubcategory,
        viewedAt: Date.now(),
      };

      items = items.filter((item) => item.id !== product.id);
      items.unshift(newItem);
      items = items.slice(0, MAX_ITEMS);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      setRecentViews(items);
      // Dispatch custom event to notify other components in the same tab
      window.dispatchEvent(new Event("recentViewsUpdated"));
    } catch (error) {
      console.error("Error saving recent view:", error);
    }
  }, []);

  const removeRecentView = useCallback((productId: string) => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return;
      }

      const items: RecentViewItem[] = JSON.parse(stored);
      const filtered = items.filter((item) => item.id !== productId);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      setRecentViews(filtered);
      // Dispatch custom event to notify other components in the same tab
      window.dispatchEvent(new Event("recentViewsUpdated"));
    } catch (error) {
      console.error("Error removing recent view:", error);
    }
  }, []);

  const clearRecentViews = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      localStorage.removeItem(STORAGE_KEY);
      setRecentViews([]);
      // Dispatch custom event to notify other components in the same tab
      window.dispatchEvent(new Event("recentViewsUpdated"));
    } catch (error) {
      console.error("Error clearing recent views:", error);
    }
  }, []);

  return {
    recentViews,
    addRecentView,
    removeRecentView,
    clearRecentViews,
  };
};
