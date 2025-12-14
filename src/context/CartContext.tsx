"use client";

import { useAuth } from "@/context/AuthContext";
import type { CartItem, Product } from "@/types";
import React, {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isCartPopupOpen: boolean;
  setIsCartPopupOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartStorage {
  userId: string | null;
  items: CartItem[];
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartPopupOpen, setIsCartPopupOpen] = useState(false);
  const lastToastRef = useRef<{ message: string; timestamp: number } | null>(null);
  const currentUserIdRef = useRef<string | null>(null);

  // Load cart from localStorage and handle user changes
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

    // Detect user change: only treat it as a change if previousUserId was NOT null
    // This prevents clearing cart on initial load when previousUserId starts as null
    const userChanged = previousUserId !== null && previousUserId !== currentUserId;

    if (userChanged) {
      // User actually changed (not initial load) - clear state and localStorage
      startTransition(() => {
        setItems([]);
      });
      localStorage.removeItem("hometex-cart");
      currentUserIdRef.current = currentUserId;

      // If logging out (currentUserId is null), we're done
      if (currentUserId === null) {
        return;
      }
      // Otherwise, continue to load new user's cart below
    } else if (previousUserId === currentUserId && previousUserId !== null) {
      // User hasn't changed and we've already loaded (not initial mount) - don't reload
      // eslint-disable-next-line no-console
      console.log("[CartContext] User unchanged - skipping reload");
      return;
    }

    // Update ref to current user (for both initial load and user changes)
    currentUserIdRef.current = currentUserId;

    // Load from localStorage if available
    const savedCart = localStorage.getItem("hometex-cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);

        // Handle backward compatibility: old format was just an array
        let cartData: CartStorage;
        if (Array.isArray(parsed)) {
          // Old format - treat as guest cart
          cartData = { userId: null, items: parsed };
        } else {
          cartData = parsed as CartStorage;
        }

        // Validate: Only load cart if it belongs to the current user
        // If logged in, cart must have matching userId
        // If logged out, cart must have userId: null
        const isValidForCurrentUser =
          currentUserId === null ? cartData.userId === null : cartData.userId === currentUserId;

        if (isValidForCurrentUser) {
          // Update ref first, then set items to prevent race conditions
          currentUserIdRef.current = currentUserId;
          startTransition(() => {
            setItems(cartData.items || []);
          });
        } else {
          // Cart belongs to different user, clear it
          startTransition(() => {
            setItems([]);
          });
          localStorage.removeItem("hometex-cart");
          currentUserIdRef.current = currentUserId;
        }
      } catch {
        // Invalid data, clear it
        startTransition(() => {
          setItems([]);
        });
        localStorage.removeItem("hometex-cart");
        currentUserIdRef.current = currentUserId;
      }
    } else {
      // No saved cart, just update the ref
      currentUserIdRef.current = currentUserId;
    }
  }, [user?.id]);

  // Save cart to localStorage whenever it changes
  // Only save if user is logged in or if it's a guest cart (user is null and items exist)
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
    const cartData: CartStorage = {
      userId: currentUserId,
      items,
    };
    localStorage.setItem("hometex-cart", JSON.stringify(cartData));
  }, [items, user?.id]);

  const addToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    setItems((prev) => {
      const existingItem = prev.find(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === color &&
          item.selectedSize === size
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        const message = `Updated quantity to ${newQuantity}`;
        const now = Date.now();

        if (
          !isCartPopupOpen &&
          (!lastToastRef.current ||
            lastToastRef.current.message !== message ||
            now - lastToastRef.current.timestamp > 500)
        ) {
          toast.dismiss();
          toast.success(message);
          lastToastRef.current = { message, timestamp: now };
        }

        return prev.map((item) =>
          item.product.id === product.id &&
          item.selectedColor === color &&
          item.selectedSize === size
            ? { ...item, quantity: newQuantity }
            : item
        );
      }

      const message = `Added ${quantity} to cart`;
      const now = Date.now();

      if (
        !isCartPopupOpen &&
        (!lastToastRef.current ||
          lastToastRef.current.message !== message ||
          now - lastToastRef.current.timestamp > 500)
      ) {
        toast.dismiss();
        toast.success(message);
        lastToastRef.current = { message, timestamp: now };
      }

      return [...prev, { product, quantity, selectedColor: color, selectedSize: size }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
    toast.success("Removed from cart");
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.success("Cart cleared");
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isCartPopupOpen,
        setIsCartPopupOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
