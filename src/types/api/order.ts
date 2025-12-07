/**
 * Order Types
 */

import type { Product } from "./product";

// Order Status
export type OrderStatus =
  | "pending"
  | "processing"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type PaymentMethod = "cod" | "bkash" | "nagad" | "rocket" | "ssl_commerce";

// Order Item
export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product?: Product;
  quantity: number;
  price: number;
  subtotal: number;
  color?: string;
  size?: string;
}

// Shipping Address
export interface ShippingAddress {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state?: string;
  postal_code?: string;
  country: string;
}

// Order
export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  subtotal: number;
  shipping_cost: number;
  discount: number;
  tax: number;
  total: number;
  items: OrderItem[];
  shipping_address: ShippingAddress;
  billing_address?: ShippingAddress;
  notes?: string;
  tracking_number?: string;
  transaction_id?: string;
  created_at: string;
  updated_at: string;
}

// Create Order Request
export interface CreateOrderRequest {
  items: Array<{
    product_id: number;
    quantity: number;
    color?: string;
    size?: string;
  }>;
  shipping_address: ShippingAddress;
  billing_address?: ShippingAddress;
  payment_method: PaymentMethod;
  notes?: string;
  coupon_code?: string;
}

// Order Response
export interface OrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

// Orders List Response
export interface OrdersResponse {
  success: boolean;
  message: string;
  data: {
    orders: Order[];
    pagination?: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
}

// Order Track Response
export interface OrderTrackResponse {
  success: boolean;
  data: {
    order: Order;
    tracking_history: Array<{
      status: OrderStatus;
      note?: string;
      timestamp: string;
    }>;
  };
}
