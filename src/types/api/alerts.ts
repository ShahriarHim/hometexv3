/**
 * Alerts Types (Price Drop & Restock)
 */

import type { Product } from "./product";

// Price Drop Alert
export interface PriceDropAlert {
  id: number;
  user_id: number;
  product_id: number;
  product?: Product;
  target_price: number;
  current_price: number;
  is_active: boolean;
  notified_at?: string;
  created_at: string;
  updated_at: string;
}

// Price Drop Alerts Response
export interface PriceDropAlertsResponse {
  success: boolean;
  message: string;
  data: PriceDropAlert[];
}

// Restock Request
export interface RestockRequest {
  id: number;
  user_id: number;
  product_id: number;
  product?: Product;
  email: string;
  phone?: string;
  is_notified: boolean;
  notified_at?: string;
  created_at: string;
  updated_at: string;
}

// Restock Requests Response
export interface RestockRequestsResponse {
  success: boolean;
  message: string;
  data: RestockRequest[];
}

// Add Price Drop Alert Request
export interface AddPriceDropAlertRequest {
  product_id: number;
  target_price: number;
}

// Add Restock Request
export interface AddRestockRequestRequest {
  product_id: number;
  email: string;
  phone?: string;
}
