/**
 * Contact & Support API Service
 */

import { env } from "@/lib/env";
import type { ApiResponse } from "@/types/api/common";
import { fetchPublicWithFallback, handleApiResponse } from "./client";

// Contact Form Data
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  order_id?: string;
}

export const contactService = {
  /**
   * Send contact form message
   */
  sendContactForm: async (formData: ContactFormData): Promise<ApiResponse<null>> => {
    const response = await fetchPublicWithFallback("/api/contact", env.apiBaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    });

    return handleApiResponse<ApiResponse<null>>(response);
  },

  /**
   * Get contact history (authenticated users)
   */
  getContactHistory: async () => {
    const response = await fetchPublicWithFallback("/api/contact/history", env.apiBaseUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    return handleApiResponse(response);
  },
};
