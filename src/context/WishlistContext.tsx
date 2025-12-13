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
    const currentUserId = user?.id || null;
    const savedWishlist = localStorage.getItem("hometex-wishlist");

    // Check if user changed
    if (currentUserIdRef.current !== null && currentUserIdRef.current !== currentUserId) {
      // User changed, clear wishlist
      setItems([]);
      localStorage.removeItem("hometex-wishlist");
      currentUserIdRef.current = currentUserId;
      return;
    }

    // Load from localStorage if available
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

        // Only load wishlist if it belongs to the current user or if no user is logged in
        if (wishlistData.userId === currentUserId || (!currentUserId && !wishlistData.userId)) {
          startTransition(() => {
            setItems(wishlistData.items || []);
            currentUserIdRef.current = currentUserId;
          });
        } else {
          // Wishlist belongs to different user, clear it
          setItems([]);
          currentUserIdRef.current = currentUserId;
        }
      } catch {
        // Invalid data, clear it
        setItems([]);
        currentUserIdRef.current = currentUserId;
      }
    } else {
      currentUserIdRef.current = currentUserId;
    }
  }, [user?.id]);

  useEffect(() => {
    const currentUserId = user?.id || null;
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
