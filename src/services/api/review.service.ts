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
    const formData = new FormData();
    formData.append("product_id", String(data.product_id));
    formData.append("rating", String(data.rating));
    formData.append("comment", String(data.comment));

    if (data.title) {
      formData.append("title", data.title);
    }

    if (data.user_id !== undefined && data.user_id !== null) {
      formData.append("user_id", String(data.user_id));
    }

    if (Array.isArray(data.images)) {
      data.images.forEach((file) => {
        if (file instanceof File) {
          formData.append("images[]", file);
        }
      });
    }

    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log("Creating review with form data:", {
        product_id: String(data.product_id),
        rating: String(data.rating),
        hasImages: Boolean(data.images?.length),
      });
      // eslint-disable-next-line no-console
      console.log("API URL:", env.apiBaseUrl);
    }

    const response = await fetchWithFallback("/api/store-review", env.apiBaseUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });

    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log("Review creation response status:", response.status, response.statusText);
      // Clone response for logging without consuming the original
      const clonedResponse = response.clone();
      clonedResponse
        .json()
        .then((data) => {
          // eslint-disable-next-line no-console
          console.log("Review creation response data:", data);
        })
        .catch(() => {
          // eslint-disable-next-line no-console
          console.log("Could not parse response as JSON");
        });
    }

    return handleApiResponse<ReviewResponse>(response);
  },

  /**
   * Update an existing review
   */
  updateReview: async (
    reviewId: string | number,
    data: UpdateReviewRequest
  ): Promise<ReviewResponse> => {
    const shouldSendMultipart = Array.isArray(data.images) && data.images.length > 0;
    const headers: Record<string, string> = { Accept: "application/json" };

    let body: BodyInit;

    if (shouldSendMultipart) {
      const formData = new FormData();
      if (data.rating !== undefined) {
        formData.append("rating", String(data.rating));
      }
      if (data.comment !== undefined) {
        formData.append("comment", String(data.comment));
      }
      data.images?.forEach((file) => {
        if (file instanceof File) {
          formData.append("images[]", file);
        }
      });
      body = formData;
    } else {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify({
        rating: data.rating,
        comment: data.comment,
      });
    }

    const response = await fetchWithFallback(`/api/update-review/${reviewId}`, env.apiBaseUrl, {
      method: "PUT",
      headers,
      body,
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
