"use client";

import { useAuth } from "@/context/AuthContext";
import type { Product, WishlistItem } from "@/types";
import React, {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const getWishlistStorageKey = (userId: string | null): string => {
  return userId ? `hometex-wishlist-${userId}` : "hometex-wishlist-guest";
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const currentUserIdRef = useRef<string | null>(null);
  const hasLoadedRef = useRef<boolean>(false);
  const isTransitioningRef = useRef<boolean>(false);

  // Load wishlist from localStorage and handle user changes
  useEffect(() => {
    const currentUserId = user?.id || null;
    const storageKey = getWishlistStorageKey(currentUserId);

    // Check if user changed (only after initial load)
    if (hasLoadedRef.current && currentUserIdRef.current !== currentUserId) {
      // User changed - immediately clear state to prevent stale data
      isTransitioningRef.current = true;
      setItems([]);
      currentUserIdRef.current = currentUserId;

      // Load the new user's wishlist
      const savedWishlist = localStorage.getItem(storageKey);
      if (savedWishlist) {
        try {
          const parsed = JSON.parse(savedWishlist);
          const wishlistItems = Array.isArray(parsed) ? parsed : parsed.items || [];
          startTransition(() => {
            setItems(wishlistItems);
            isTransitioningRef.current = false;
          });
        } catch {
          startTransition(() => {
            setItems([]);
            isTransitioningRef.current = false;
          });
        }
      } else {
        startTransition(() => {
          setItems([]);
          isTransitioningRef.current = false;
        });
      }
      return;
    }

    // Handle initial load or when user becomes null (logout)
    if (!hasLoadedRef.current || currentUserId === null) {
      if (currentUserId === null) {
        // User logged out - clear state immediately
        setItems([]);
        currentUserIdRef.current = null;
        hasLoadedRef.current = true;
        return;
      }

      // Initial load - load from localStorage if available
      const savedWishlist = localStorage.getItem(storageKey);
      if (savedWishlist) {
        try {
          const parsed = JSON.parse(savedWishlist);
          const wishlistItems = Array.isArray(parsed) ? parsed : parsed.items || [];
          startTransition(() => {
            setItems(wishlistItems);
            currentUserIdRef.current = currentUserId;
            hasLoadedRef.current = true;
          });
        } catch {
          startTransition(() => {
            setItems([]);
            currentUserIdRef.current = currentUserId;
            hasLoadedRef.current = true;
          });
        }
      } else {
        // Also check old format for backward compatibility
        const oldWishlist = localStorage.getItem("hometex-wishlist");
        if (oldWishlist) {
          try {
            const parsed = JSON.parse(oldWishlist);
            const wishlistItems = Array.isArray(parsed) ? parsed : parsed.items || [];
            // Migrate old wishlist to new format
            startTransition(() => {
              setItems(wishlistItems);
              localStorage.setItem(storageKey, JSON.stringify(wishlistItems));
              localStorage.removeItem("hometex-wishlist");
              currentUserIdRef.current = currentUserId;
              hasLoadedRef.current = true;
            });
          } catch {
            startTransition(() => {
              setItems([]);
              currentUserIdRef.current = currentUserId;
              hasLoadedRef.current = true;
            });
          }
        } else {
          currentUserIdRef.current = currentUserId;
          hasLoadedRef.current = true;
        }
      }
    }
  }, [user?.id]);

  useEffect(() => {
    if (!hasLoadedRef.current || isTransitioningRef.current) {
      return; // Don't save before initial load or during user transitions
    }

    const currentUserId = user?.id || null;
    // Only save if user ID matches current ref (prevent saving to wrong user's storage)
    if (currentUserIdRef.current !== currentUserId) {
      return;
    }

    const storageKey = getWishlistStorageKey(currentUserId);
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, user?.id]);

  const addToWishlist = (product: Product) => {
    setItems((prev) => {
      const exists = prev.find((item) => item.product.id === product.id);
      if (exists) {
        toast.info("Already in wishlist");
        return prev;
      }
      toast.success("Added to wishlist");
      return [...prev, { product, addedAt: new Date() }];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
    toast.success("Removed from wishlist");
  };

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.product.id === productId);
  };

  const clearWishlist = () => {
    setItems([]);
    toast.success("Wishlist cleared");
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};
