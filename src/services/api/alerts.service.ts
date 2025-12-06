/**
 * Alerts API Service (Price Drop & Restock)
 */

import { env } from "@/lib/env";
import type {
  AddPriceDropAlertRequest,
  AddRestockRequestRequest,
  PriceDropAlertsResponse,
  RestockRequestsResponse,
} from "@/types/api/alerts";
import type { ApiResponse } from "@/types/api/common";
import { fetchWithFallback, handleApiResponse } from "./client";

export const alertsService = {
  /**
   * Get user's price drop alerts
   */
  getPriceDropAlerts: async (): Promise<PriceDropAlertsResponse> => {
    const response = await fetchWithFallback("/api/product/price-drop-list", env.apiBaseUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    return handleApiResponse<PriceDropAlertsResponse>(response);
  },

  /**
   * Add a price drop alert for a product
   */
  addPriceDropAlert: async (alertData: AddPriceDropAlertRequest): Promise<ApiResponse<null>> => {
    const response = await fetchWithFallback("/api/product/price-drop-alert", env.apiBaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(alertData),
    });

    return handleApiResponse<ApiResponse<null>>(response);
  },

  /**
   * Remove a price drop alert
   */
  removePriceDropAlert: async (alertId: number): Promise<ApiResponse<null>> => {
    const response = await fetchWithFallback(
      `/api/product/price-drop-alert/${alertId}`,
      env.apiBaseUrl,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      }
    );

    return handleApiResponse<ApiResponse<null>>(response);
  },

  /**
   * Get user's restock requests
   */
  getRestockRequests: async (): Promise<RestockRequestsResponse> => {
    const response = await fetchWithFallback("/api/product/restock-request-list", env.apiBaseUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    return handleApiResponse<RestockRequestsResponse>(response);
  },

  /**
   * Add a restock request for an out-of-stock product
   */
  addRestockRequest: async (requestData: AddRestockRequestRequest): Promise<ApiResponse<null>> => {
    const response = await fetchWithFallback("/api/product/restock-request", env.apiBaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestData),
    });

    return handleApiResponse<ApiResponse<null>>(response);
  },

  /**
   * Remove a restock request
   */
  removeRestockRequest: async (requestId: number): Promise<ApiResponse<null>> => {
    const response = await fetchWithFallback(
      `/api/product/restock-request/${requestId}`,
      env.apiBaseUrl,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      }
    );

    return handleApiResponse<ApiResponse<null>>(response);
  },
};
