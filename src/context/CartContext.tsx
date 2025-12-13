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
    const currentUserId = user?.id || null;
    const savedCart = localStorage.getItem("hometex-cart");

    // Check if user changed
    if (currentUserIdRef.current !== null && currentUserIdRef.current !== currentUserId) {
      // User changed, clear cart
      setItems([]);
      localStorage.removeItem("hometex-cart");
      currentUserIdRef.current = currentUserId;
      return;
    }

    // Load from localStorage if available
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

        // Only load cart if it belongs to the current user or if no user is logged in
        if (cartData.userId === currentUserId || (!currentUserId && !cartData.userId)) {
          startTransition(() => {
            setItems(cartData.items || []);
            currentUserIdRef.current = currentUserId;
          });
        } else {
          // Cart belongs to different user, clear it
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

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    const currentUserId = user?.id || null;
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
