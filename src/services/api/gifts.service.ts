/**
 * Gift Cards API Service
 */

import { env } from "@/lib/env";
import type { ApiResponse } from "@/types/api/common";
import { fetchWithFallback, handleApiResponse } from "./client";

// Gift Card Data
export interface GiftCardData {
  recipient_name: string;
  recipient_email: string;
  sender_name: string;
  sender_email?: string;
  amount: number;
  message?: string;
  delivery_date?: string;
}

// Gift Card
export interface GiftCard {
  id: number;
  code: string;
  amount: number;
  balance: number;
  recipient_name: string;
  recipient_email: string;
  sender_name: string;
  message?: string;
  status: "active" | "used" | "expired" | "cancelled";
  expires_at?: string;
  created_at: string;
}

export const giftsService = {
  /**
   * Send a gift card
   */
  sendGiftCard: async (giftData: GiftCardData): Promise<ApiResponse<GiftCard>> => {
    const response = await fetchWithFallback("/api/gifts", env.apiBaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(giftData),
    });

    return handleApiResponse<ApiResponse<GiftCard>>(response);
  },

  /**
   * Get user's gift cards
   */
  getGiftCards: async (): Promise<ApiResponse<GiftCard[]>> => {
    const response = await fetchWithFallback("/api/gifts", env.apiBaseUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    return handleApiResponse<ApiResponse<GiftCard[]>>(response);
  },

  /**
   * Redeem a gift card
   */
  redeemGiftCard: async (code: string): Promise<ApiResponse<GiftCard>> => {
    const response = await fetchWithFallback("/api/gifts/redeem", env.apiBaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ code }),
    });

    return handleApiResponse<ApiResponse<GiftCard>>(response);
  },

  /**
   * Check gift card balance
   */
  checkBalance: async (code: string): Promise<ApiResponse<{ balance: number }>> => {
    const response = await fetchWithFallback(`/api/gifts/balance/${code}`, env.apiBaseUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    return handleApiResponse<ApiResponse<{ balance: number }>>(response);
  },
};
