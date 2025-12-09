/**
 * Order API Service
 */

import { env } from "@/lib/env";
import type {
  CreateOrderRequest,
  CustomerOrdersResponse,
  OrderResponse,
  OrdersResponse,
  TrackingResponse,
  InvoiceResponse,
  OrderTrackResponse,
} from "@/types/api/order";
import { fetchWithFallback, handleApiResponse } from "./client";

export const orderService = {
  /**
   * Create a new order
   */
  createOrder: async (orderData: CreateOrderRequest): Promise<OrderResponse> => {
    const response = await fetchWithFallback("/api/orders", env.apiBaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(orderData),
    });

    return handleApiResponse<OrderResponse>(response);
  },

  /**
   * Get all user orders
   */
  getOrders: async (page = 1): Promise<OrdersResponse> => {
    const response = await fetchWithFallback(`/api/orders?page=${page}`, env.apiBaseUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    return handleApiResponse<OrdersResponse>(response);
  },

  /**
   * Get single order by ID
   */
  getOrder: async (orderId: number): Promise<OrderResponse> => {
    const response = await fetchWithFallback(`/api/orders/${orderId}`, env.apiBaseUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    return handleApiResponse<OrderResponse>(response);
  },

  /**
   * Track order by order number
   */
  trackOrder: async (orderNumber: string): Promise<OrderTrackResponse> => {
    const response = await fetchWithFallback(`/api/orders/track/${orderNumber}`, env.apiBaseUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    return handleApiResponse<OrderTrackResponse>(response);
  },

  /**
   * Get orders for a specific customer
   */
  getCustomerOrders: async (customerId: number): Promise<CustomerOrdersResponse> => {
    const response = await fetchWithFallback(
      `/api/orders/customer/${customerId}`,
      env.apiBaseUrl,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    return handleApiResponse<CustomerOrdersResponse>(response);
  },

  /**
   * Track order by tracking code
   */
  trackOrderByCode: async (trackingCode: string): Promise<TrackingResponse> => {
    const response = await fetchWithFallback(
      `/api/orders/tracking?tracking_code=${encodeURIComponent(trackingCode)}`,
      env.apiBaseUrl,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    return handleApiResponse<TrackingResponse>(response);
  },

  /**
   * Get invoice data by order number
   */
  getInvoice: async (orderNumber: string): Promise<InvoiceResponse> => {
    const response = await fetchWithFallback(
      `/api/orders/invoice/${encodeURIComponent(orderNumber)}`,
      env.apiBaseUrl,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    return handleApiResponse<InvoiceResponse>(response);
  },

  /**
   * Cancel order
   */
  cancelOrder: async (orderId: number): Promise<OrderResponse> => {
    const response = await fetchWithFallback(`/api/orders/${orderId}/cancel`, env.apiBaseUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    });

    return handleApiResponse<OrderResponse>(response);
  },

  /**
   * Track delivery by tracking number
   */
  trackDelivery: async (trackingNumber: string) => {
    const response = await fetchWithFallback(
      `/api/delivery/track/${trackingNumber}`,
      env.apiBaseUrl,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    return handleApiResponse(response);
  },

  /**
   * Update delivery location (admin/courier use)
   */
  updateDeliveryLocation: async (trackingNumber: string, location: Record<string, unknown>) => {
    const response = await fetchWithFallback(
      `/api/delivery/${trackingNumber}/location`,
      env.apiBaseUrl,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(location),
      }
    );

    return handleApiResponse(response);
  },
};
