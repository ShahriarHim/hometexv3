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

const getCartStorageKey = (userId: string | null): string => {
  return userId ? `hometex-cart-${userId}` : "hometex-cart-guest";
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartPopupOpen, setIsCartPopupOpen] = useState(false);
  const lastToastRef = useRef<{ message: string; timestamp: number } | null>(null);
  const currentUserIdRef = useRef<string | null>(null);
  const hasLoadedRef = useRef<boolean>(false);
  const isTransitioningRef = useRef<boolean>(false);

  // Load cart from localStorage and handle user changes
  useEffect(() => {
    const currentUserId = user?.id || null;
    const storageKey = getCartStorageKey(currentUserId);

    // Check if user changed (only after initial load)
    if (hasLoadedRef.current && currentUserIdRef.current !== currentUserId) {
      // User changed - immediately clear state to prevent stale data
      isTransitioningRef.current = true;
      setItems([]);
      currentUserIdRef.current = currentUserId;

      // Load the new user's cart
      const savedCart = localStorage.getItem(storageKey);
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          const cartItems = Array.isArray(parsed) ? parsed : parsed.items || [];
          startTransition(() => {
            setItems(cartItems);
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
      const savedCart = localStorage.getItem(storageKey);
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          const cartItems = Array.isArray(parsed) ? parsed : parsed.items || [];
          startTransition(() => {
            setItems(cartItems);
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
        const oldCart = localStorage.getItem("hometex-cart");
        if (oldCart) {
          try {
            const parsed = JSON.parse(oldCart);
            const cartItems = Array.isArray(parsed) ? parsed : parsed.items || [];
            // Migrate old cart to new format
            startTransition(() => {
              setItems(cartItems);
              localStorage.setItem(storageKey, JSON.stringify(cartItems));
              localStorage.removeItem("hometex-cart");
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

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!hasLoadedRef.current || isTransitioningRef.current) {
      return; // Don't save before initial load or during user transitions
    }

    const currentUserId = user?.id || null;
    // Only save if user ID matches current ref (prevent saving to wrong user's storage)
    if (currentUserIdRef.current !== currentUserId) {
      return;
    }

    const storageKey = getCartStorageKey(currentUserId);
    localStorage.setItem(storageKey, JSON.stringify(items));
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
