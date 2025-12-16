/**
 * Payment API Service (SSL Commerz Integration)
 */

import { env } from "@/lib/env";
import type {
  PaymentRequest,
  PaymentResponse,
  PaymentVerificationResponse,
} from "@/types/api/payment";
import { fetchWithFallback, handleApiResponse } from "./client";

export const paymentService = {
  /**
   * Initiate SSL Commerz payment
   */
  initiatePayment: async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
    const response = await fetchWithFallback("/api/payment/initiate", env.apiBaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    return handleApiResponse<PaymentResponse>(response);
  },

  /**
   * Verify payment transaction
   */
  verifyPayment: async (transactionId: string): Promise<PaymentVerificationResponse> => {
    const response = await fetchWithFallback(
      `/api/payment/verify/${transactionId}`,
      env.apiBaseUrl,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    return handleApiResponse<PaymentVerificationResponse>(response);
  },

  /**
   * SSL Commerz payment initialization with full configuration
   */
  initiateSSLCommerz: async (orderData: {
    amount: number;
    orderId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    productName?: string;
    productCategory?: string;
    shippingMethod?: string;
  }): Promise<PaymentResponse> => {
    const payload = {
      total_amount: orderData.amount.toString(),
      currency: "BDT",
      tran_id: orderData.orderId,
      success_url: `${typeof window !== "undefined" ? window.location.origin : ""}/payment/success`,
      fail_url: `${typeof window !== "undefined" ? window.location.origin : ""}/payment/fail`,
      cancel_url: `${typeof window !== "undefined" ? window.location.origin : ""}/payment/cancel`,
      cus_name: orderData.customerName,
      cus_email: orderData.customerEmail,
      cus_phone: orderData.customerPhone,
      cus_add1: orderData.customerAddress,
      shipping_method: orderData.shippingMethod || "Courier",
      product_name: orderData.productName || "HomeTex Products",
      product_category: orderData.productCategory || "Home Textiles",
      product_profile: "general",
    };

    const response = await fetchWithFallback("/api/payment/ssl-commerz/initiate", env.apiBaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    return handleApiResponse<PaymentResponse>(response);
  },

  /**
   * Handle SSL Commerz callback
   */
  handleCallback: async (callbackData: Record<string, unknown>) => {
    const response = await fetchWithFallback("/api/payment/ssl-commerz/callback", env.apiBaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(callbackData),
    });

    return handleApiResponse(response);
  },
};
