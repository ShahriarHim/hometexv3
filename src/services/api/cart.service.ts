/**
 * Cart API Service
 */

import { env } from "@/lib/env";
import type { AddToCartRequest, CartResponse, UpdateCartItemRequest } from "@/types/api/cart";
import type { ApiResponse } from "@/types/api/common";
import { fetchWithFallback, handleApiResponse } from "./client";

export const cartService = {
  /**
   * Get user's cart
   */
  getCart: async (): Promise<CartResponse> => {
    const response = await fetchWithFallback("/api/cart", env.apiBaseUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    return handleApiResponse<CartResponse>(response);
  },

  /**
   * Add item to cart
   */
  addToCart: async (item: AddToCartRequest): Promise<CartResponse> => {
    const response = await fetchWithFallback("/api/cart/add", env.apiBaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(item),
    });

    return handleApiResponse<CartResponse>(response);
  },

  /**
   * Update cart item quantity
   */
  updateCartItem: async (itemId: number, data: UpdateCartItemRequest): Promise<CartResponse> => {
    const response = await fetchWithFallback(`/api/cart/${itemId}`, env.apiBaseUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    return handleApiResponse<CartResponse>(response);
  },

  /**
   * Remove item from cart
   */
  removeFromCart: async (itemId: number): Promise<CartResponse> => {
    const response = await fetchWithFallback(`/api/cart/${itemId}`, env.apiBaseUrl, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });

    return handleApiResponse<CartResponse>(response);
  },

  /**
   * Clear entire cart
   */
  clearCart: async (): Promise<ApiResponse<null>> => {
    const response = await fetchWithFallback("/api/cart/clear", env.apiBaseUrl, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });

    return handleApiResponse<ApiResponse<null>>(response);
  },
};
