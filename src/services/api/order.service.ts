/**
 * Order API Service
 */

import { env } from "@/lib/env";
import type {
  CreateOrderRequest,
  CustomerOrdersResponse,
  InvoiceResponse,
  OrderDetailResponse,
  OrderResponse,
  OrdersResponse,
  OrderTrackResponse,
  TrackingResponse,
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
   * Get orders for authenticated customer (requires authentication)
   */
  getMyOrders: async (): Promise<CustomerOrdersResponse> => {
    const response = await fetchWithFallback("/api/my-order", env.apiBaseUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    return handleApiResponse<CustomerOrdersResponse>(response);
  },

  /**
   * Get single order by ID
   */
  getOrder: async (orderId: number): Promise<OrderDetailResponse> => {
    const response = await fetchWithFallback(`/api/orders/${orderId}`, env.apiBaseUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    return handleApiResponse<OrderDetailResponse>(response);
  },

  /**
   * Get single order by order number
   */
  getOrderByNumber: async (orderNumber: string): Promise<OrderDetailResponse> => {
    // Try tracking endpoint first (supports invoice parameter)
    try {
      const response = await fetchWithFallback(
        `/api/orders/tracking?invoice=${encodeURIComponent(orderNumber)}`,
        env.apiBaseUrl,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const trackingData = await handleApiResponse<TrackingResponse>(response);

      // Check if tracking was successful and has order data
      if (trackingData.success && trackingData.data?.order?.id) {
        // Fetch full order details using the order ID from tracking response
        return orderService.getOrder(trackingData.data.order.id);
      }

      // If tracking response indicates order not found
      if (!trackingData.success || !trackingData.data?.order) {
        throw new Error(trackingData.message || "Order not found");
      }
    } catch (trackingErr) {
      // If it's already an error about order not found, re-throw it
      if (trackingErr instanceof Error && trackingErr.message.includes("not found")) {
        throw trackingErr;
      }
      // Otherwise, try fallback methods
    }

    // Fallback: try invoice endpoint which might return order data
    try {
      const invoiceResponse = await orderService.getInvoice(orderNumber);
      if (invoiceResponse.data && typeof invoiceResponse.data === "object") {
        // Check if invoice data has order ID
        const invoiceData = invoiceResponse.data as { id?: number; order_id?: number };
        const orderIdFromInvoice = invoiceData.id || invoiceData.order_id;

        if (orderIdFromInvoice) {
          return orderService.getOrder(orderIdFromInvoice);
        }

        // If invoice data has the full order structure, use it directly
        if ((invoiceData as { order_number?: string }).order_number) {
          return {
            success: true,
            message: "Order details retrieved successfully",
            data: invoiceData as OrderDetailResponse["data"],
          };
        }
      }
    } catch {
      // Invoice endpoint also failed, will throw final error below
    }

    throw new Error(`Order not found: ${orderNumber}`);
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
    const response = await fetchWithFallback(`/api/orders/customer/${customerId}`, env.apiBaseUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

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
   * Track order by order number (invoice)
   */
  trackOrderByNumber: async (orderNumber: string): Promise<TrackingResponse> => {
    const response = await fetchWithFallback(
      `/api/orders/tracking?invoice=${encodeURIComponent(orderNumber)}`,
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
