/**
 * Review API Service
 */

import { env } from "@/lib/env";
import type { ApiResponse } from "@/types/api/common";
import type {
  CreateReviewRequest,
  ReviewResponse,
  ReviewsListResponse,
  UpdateReviewRequest,
} from "@/types/api/review";
import { fetchPublicWithFallback, fetchWithFallback, handleApiResponse } from "./client";

export const reviewService = {
  /**
   * Get all reviews for a product
   */
  getProductReviews: async (productId: string | number): Promise<ReviewsListResponse> => {
    const response = await fetchPublicWithFallback(
      `/api/products/${productId}/reviews`,
      env.apiBaseUrl,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    return handleApiResponse<ReviewsListResponse>(response);
  },

  /**
   * Create a new review
   */
  createReview: async (data: CreateReviewRequest): Promise<ReviewResponse> => {
    // Ensure product_id and user_id are strings as API expects
    const payload: Record<string, string | number> = {
      product_id: String(data.product_id),
      rating: Number(data.rating),
      comment: String(data.comment),
    };

    // Only include user_id if provided
    if (data.user_id !== undefined && data.user_id !== null) {
      payload.user_id = String(data.user_id);
    }

    if (process.env.NODE_ENV === "development") {
      console.log("Creating review with payload:", payload);
      console.log("API URL:", env.apiBaseUrl);
    }

    const response = await fetchWithFallback("/api/store-review", env.apiBaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (process.env.NODE_ENV === "development") {
      console.log("Review creation response status:", response.status, response.statusText);
      // Clone response for logging without consuming the original
      const clonedResponse = response.clone();
      clonedResponse
        .json()
        .then((data) => {
          console.log("Review creation response data:", data);
        })
        .catch(() => {
          console.log("Could not parse response as JSON");
        });
    }

    return handleApiResponse<ReviewResponse>(response);
  },

  /**
   * Update an existing review
   */
  updateReview: async (reviewId: string | number, data: UpdateReviewRequest): Promise<ReviewResponse> => {
    const response = await fetchWithFallback(`/api/update-review/${reviewId}`, env.apiBaseUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        rating: data.rating,
        comment: data.comment,
      }),
    });

    return handleApiResponse<ReviewResponse>(response);
  },

  /**
   * Delete a review
   */
  deleteReview: async (reviewId: string | number): Promise<ApiResponse<null>> => {
    const response = await fetchWithFallback(`/api/delete-review/${reviewId}`, env.apiBaseUrl, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });

    return handleApiResponse<ApiResponse<null>>(response);
  },
};

