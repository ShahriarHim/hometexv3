"use client";

import React, { createContext, useContext, useState, useEffect, startTransition, useRef } from "react";
import type { CartItem, Product } from "@/types";
import { toast } from "sonner";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const lastToastRef = useRef<{ message: string; timestamp: number } | null>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem("hometex-cart");
    if (savedCart) {
      startTransition(() => {
        setItems(JSON.parse(savedCart));
      });
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("hometex-cart", JSON.stringify(items));
  }, [items]);

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

        if (!lastToastRef.current || lastToastRef.current.message !== message || now - lastToastRef.current.timestamp > 500) {
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

      if (!lastToastRef.current || lastToastRef.current.message !== message || now - lastToastRef.current.timestamp > 500) {
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
