/**
 * Wishlist API Service
 */

import { env } from "@/lib/env";
import type { WishlistResponse } from "@/types/api/cart";
import type { ApiResponse } from "@/types/api/common";
import { fetchWithFallback, handleApiResponse } from "./client";

export const wishlistService = {
  /**
   * Get user's wishlist
   */
  getWishlist: async (): Promise<WishlistResponse> => {
    const response = await fetchWithFallback("/api/wishlist", env.apiBaseUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    return handleApiResponse<WishlistResponse>(response);
  },

  /**
   * Add product to wishlist
   */
  addToWishlist: async (productId: number): Promise<WishlistResponse> => {
    const response = await fetchWithFallback("/api/wishlist/add", env.apiBaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ product_id: productId }),
    });

    return handleApiResponse<WishlistResponse>(response);
  },

  /**
   * Remove product from wishlist
   */
  removeFromWishlist: async (productId: number): Promise<WishlistResponse> => {
    const response = await fetchWithFallback(`/api/wishlist/${productId}`, env.apiBaseUrl, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });

    return handleApiResponse<WishlistResponse>(response);
  },

  /**
   * Check if product is in wishlist
   */
  isInWishlist: async (productId: number): Promise<ApiResponse<{ in_wishlist: boolean }>> => {
    const response = await fetchWithFallback(`/api/wishlist/check/${productId}`, env.apiBaseUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    return handleApiResponse<ApiResponse<{ in_wishlist: boolean }>>(response);
  },

  /**
   * Clear entire wishlist
   */
  clearWishlist: async (): Promise<ApiResponse<null>> => {
    const response = await fetchWithFallback("/api/wishlist/clear", env.apiBaseUrl, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });

    return handleApiResponse<ApiResponse<null>>(response);
  },
};
