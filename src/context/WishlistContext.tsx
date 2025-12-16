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

interface WishlistStorage {
  userId: string | null;
  items: WishlistItem[];
}

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const currentUserIdRef = useRef<string | null>(null);

  // Load wishlist from localStorage and handle user changes
  useEffect(() => {
    // Get userId from user context or localStorage (to handle race conditions)
    let currentUserId: string | null = null;
    if (user?.id) {
      currentUserId = String(user.id);
    } else {
      // Try to get userId from localStorage if user context hasn't loaded yet
      try {
        const savedUser = localStorage.getItem("hometex-user");
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          if (parsedUser?.id) {
            currentUserId = String(parsedUser.id);
          }
        }
      } catch {
        // Ignore errors parsing user from localStorage
      }
    }

    const previousUserId = currentUserIdRef.current;

    // Detect user change: any change in user ID (including null transitions)
    const userChanged = previousUserId !== currentUserId;

    if (userChanged && previousUserId !== null) {
      // User changed from a logged-in state - clear state and localStorage immediately
      startTransition(() => {
        setItems([]);
      });
      localStorage.removeItem("hometex-wishlist");
      currentUserIdRef.current = currentUserId;

      // If logging out (currentUserId is null), we're done
      if (currentUserId === null) {
        return;
      }
      // Otherwise, continue to load new user's wishlist below
    }

    // Load from localStorage if available
    const savedWishlist = localStorage.getItem("hometex-wishlist");
    if (savedWishlist) {
      try {
        const parsed = JSON.parse(savedWishlist);

        // Handle backward compatibility: old format was just an array
        let wishlistData: WishlistStorage;
        if (Array.isArray(parsed)) {
          // Old format - treat as guest wishlist
          wishlistData = { userId: null, items: parsed };
        } else {
          wishlistData = parsed as WishlistStorage;
        }

        // Validate: Only load wishlist if it belongs to the current user
        // If logged in, wishlist must have matching userId
        // If logged out, wishlist must have userId: null
        const isValidForCurrentUser =
          currentUserId === null
            ? wishlistData.userId === null
            : wishlistData.userId === currentUserId;

        // eslint-disable-next-line no-console
        console.log("[WishlistContext] Validation:", {
          isValidForCurrentUser,
          currentUserId,
          wishlistUserId: wishlistData.userId,
        });

        if (isValidForCurrentUser) {
          // eslint-disable-next-line no-console
          console.log(
            "[WishlistContext] Loading wishlist - items count:",
            wishlistData.items?.length || 0
          );
          // Update ref first, then set items to prevent race conditions
          currentUserIdRef.current = currentUserId;
          startTransition(() => {
            setItems(wishlistData.items || []);
          });
        } else {
          // Wishlist belongs to different user, clear it
          startTransition(() => {
            setItems([]);
          });
          localStorage.removeItem("hometex-wishlist");
          currentUserIdRef.current = currentUserId;
        }
      } catch {
        // Invalid data, clear it
        startTransition(() => {
          setItems([]);
        });
        localStorage.removeItem("hometex-wishlist");
        currentUserIdRef.current = currentUserId;
      }
    } else {
      // No saved wishlist, just update the ref
      currentUserIdRef.current = currentUserId;
    }
  }, [user?.id]);

  useEffect(() => {
    // Get userId from user context or localStorage (to handle race conditions)
    let currentUserId: string | null = null;
    if (user?.id) {
      currentUserId = String(user.id);
    } else {
      // Try to get userId from localStorage if user context hasn't loaded yet
      try {
        const savedUser = localStorage.getItem("hometex-user");
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          if (parsedUser?.id) {
            currentUserId = String(parsedUser.id);
          }
        }
      } catch {
        // Ignore errors parsing user from localStorage
      }
    }

    // Don't save if user changed but we haven't updated the ref yet (race condition prevention)
    if (currentUserIdRef.current !== currentUserId) {
      return;
    }

    // Only save if we have items or if we're explicitly clearing (empty array with matching user)
    const wishlistData: WishlistStorage = {
      userId: currentUserId,
      items,
    };
    localStorage.setItem("hometex-wishlist", JSON.stringify(wishlistData));
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
