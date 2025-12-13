"use client";

import type { Product } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useCallback, useEffect, useRef, useState } from "react";

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

const getStorageKey = (userId: string | null): string => {
  return userId ? `recentview-${userId}` : "recentview-guest";
};

const MAX_ITEMS = 20;

// Utility function to clear recent views (can be called outside of hook)
export const clearRecentViewsStorage = () => {
  if (typeof window !== "undefined") {
    try {
      // Clear all recent view keys (for backward compatibility)
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith("recentview")) {
          localStorage.removeItem(key);
        }
      });
      // Also clear old format
      localStorage.removeItem("recentview");
      // Dispatch custom event to notify components
      window.dispatchEvent(new Event("recentViewsUpdated"));
    } catch (error) {
      console.error("Error clearing recent views:", error);
    }
  }
};

// Helper function to load recent views from localStorage
const loadRecentViews = (userId: string | null): RecentViewItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const storageKey = getStorageKey(userId);
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
    // Check old format for backward compatibility
    if (!userId) {
      const oldStored = localStorage.getItem("recentview");
      if (oldStored) {
        const parsed = JSON.parse(oldStored);
        const items = Array.isArray(parsed) ? parsed : [];
        // Migrate to new format
        if (items.length > 0) {
          localStorage.setItem(storageKey, JSON.stringify(items));
          localStorage.removeItem("recentview");
        }
        return items;
      }
    }
  } catch (error) {
    console.error("Error loading recent views:", error);
  }
  return [];
};

export const useRecentViews = () => {
  const { user } = useAuth();
  const [recentViews, setRecentViews] = useState<RecentViewItem[]>([]);
  const currentUserIdRef = useRef<string | null>(null);
  const hasLoadedRef = useRef<boolean>(false);

  // Load initial data and handle user changes
  useEffect(() => {
    const currentUserId = user?.id || null;

    // Check if user changed (only after initial load)
    if (hasLoadedRef.current && currentUserIdRef.current !== currentUserId) {
      // User changed - immediately clear state to prevent stale data
      setRecentViews([]);
      currentUserIdRef.current = currentUserId;

      // Load the new user's recent views
      const newViews = loadRecentViews(currentUserId);
      setRecentViews(newViews);
      return;
    }

    // Handle initial load or when user becomes null (logout)
    if (!hasLoadedRef.current || currentUserId === null) {
      if (currentUserId === null) {
        // User logged out - clear state immediately
        setRecentViews([]);
        currentUserIdRef.current = null;
        hasLoadedRef.current = true;
        return;
      }

      // Initial load - load from localStorage
      const views = loadRecentViews(currentUserId);
      setRecentViews(views);
      currentUserIdRef.current = currentUserId;
      hasLoadedRef.current = true;
    }
  }, [user?.id]);

  // Listen for storage changes (cross-tab sync)
  useEffect(() => {
    const currentUserId = user?.id || null;
    const storageKey = getStorageKey(currentUserId);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey) {
        setRecentViews(loadRecentViews(currentUserId));
      }
    };

    // Listen for custom event (same-tab sync)
    const handleCustomStorageChange = () => {
      setRecentViews(loadRecentViews(currentUserId));
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("recentViewsUpdated", handleCustomStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("recentViewsUpdated", handleCustomStorageChange);
    };
  }, [user?.id]);

  const addRecentView = useCallback((product: Product) => {
    if (typeof window === "undefined") return;

    const currentUserId = user?.id || null;
    const storageKey = getStorageKey(currentUserId);

    try {
      const stored = localStorage.getItem(storageKey);
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

      localStorage.setItem(storageKey, JSON.stringify(items));
      setRecentViews(items);
      // Dispatch custom event to notify other components in the same tab
      window.dispatchEvent(new Event("recentViewsUpdated"));
    } catch (error) {
      console.error("Error saving recent view:", error);
    }
  }, [user?.id]);

  const removeRecentView = useCallback((productId: string) => {
    if (typeof window === "undefined") return;

    const currentUserId = user?.id || null;
    const storageKey = getStorageKey(currentUserId);

    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return;

      const items: RecentViewItem[] = JSON.parse(stored);
      const filtered = items.filter((item) => item.id !== productId);

      localStorage.setItem(storageKey, JSON.stringify(filtered));
      setRecentViews(filtered);
      // Dispatch custom event to notify other components in the same tab
      window.dispatchEvent(new Event("recentViewsUpdated"));
    } catch (error) {
      console.error("Error removing recent view:", error);
    }
  }, [user?.id]);

  const clearRecentViews = useCallback(() => {
    if (typeof window === "undefined") return;

    const currentUserId = user?.id || null;
    const storageKey = getStorageKey(currentUserId);

    try {
      localStorage.removeItem(storageKey);
      setRecentViews([]);
      // Dispatch custom event to notify other components in the same tab
      window.dispatchEvent(new Event("recentViewsUpdated"));
    } catch (error) {
      console.error("Error clearing recent views:", error);
    }
  }, [user?.id]);

  return {
    recentViews,
    addRecentView,
    removeRecentView,
    clearRecentViews,
  };
};
