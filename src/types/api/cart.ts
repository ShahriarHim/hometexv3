/**
 * Cart and Wishlist Types
 */

import type { Product } from "./product";

// Cart Item
export interface CartItem {
  id: number;
  user_id?: number;
  product_id: number;
  product?: Product;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
  created_at?: string;
  updated_at?: string;
}

// Cart
export interface Cart {
  items: CartItem[];
  subtotal: number;
  total: number;
  items_count: number;
}

// Cart Response
export interface CartResponse {
  success: boolean;
  message: string;
  data: Cart;
}

// Add to Cart Request
export interface AddToCartRequest {
  product_id: number;
  quantity: number;
  color?: string;
  size?: string;
}

// Update Cart Item Request
export interface UpdateCartItemRequest {
  quantity: number;
}

// Wishlist Item
export interface WishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  product?: Product;
  created_at: string;
}

// Wishlist Response
export interface WishlistResponse {
  success: boolean;
  message: string;
  data: {
    items: WishlistItem[];
  };
}
