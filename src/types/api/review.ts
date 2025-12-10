/**
 * Review API Types
 */

import type { ApiResponse, ApiMeta } from "./common";

export interface ReviewProduct {
  id: number;
  name: string;
  slug: string;
}

export interface ReviewUser {
  id: number;
  name: string;
}

export interface Review {
  id: number;
  product_id: number | string;
  product?: ReviewProduct;
  user_id: number | string | null;
  user?: ReviewUser | null;
  reviewer_name: string;
  reviewer_email: string;
  rating: number;
  title: string;
  review: string;
  is_verified_purchase: boolean;
  is_recommended: boolean;
  is_approved: boolean;
  is_helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface ReviewResponse extends ApiResponse<Review> {
  meta?: ApiMeta;
}

export interface ReviewsListResponse extends ApiResponse<{ reviews: Review[] }> {
  meta?: ApiMeta;
}

export interface CreateReviewRequest {
  product_id: string | number;
  user_id?: string | number;
  rating: number;
  comment: string;
  title?: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  comment?: string;
  title?: string;
}

