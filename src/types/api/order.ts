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
  is_gift?: boolean;
  gift_fee?: number;
  gift_message?: string;
  created_at: string;
  updated_at: string;
}

// Create Order Request
export interface CreateOrderRequest {
  customerId?: number;
  shippingAddress?: ShippingAddress & { street?: string; postalCode?: string };
  billingAddress?: ShippingAddress & { street?: string; postalCode?: string };
  items: Array<{
    id?: string;
    product_id: number;
    quantity: number;
    color?: string;
    size?: string;
  }>;
  shipping_address: ShippingAddress & { street?: string; postalCode?: string };
  billing_address?: ShippingAddress & { street?: string; postalCode?: string };
  payment_method: PaymentMethod;
  paymentMethod?: {
    type: string;
    cardNumber?: string;
    expirationDate?: string;
    cvv?: string;
  };
  notes?: string;
  coupon_code?: string;
  is_gift?: boolean;
  gift_fee?: number;
  gift_message?: string;
  giftMessage?: string;
  additionalDetails?: {
    notes?: string;
    couponCode?: string;
    isGift?: boolean;
    giftFee?: number;
    giftMessage?: string;
  };
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

export interface CustomerOrderSummary {
  id: number;
  created_at: string;
  updated_at: string;
  customer_name: string;
  customer_phone: string;
  order_number: string;
  order_status: number;
  order_status_string: string;
  payment_method: string;
  payment_status: string;
  sales_manager: string;
  shop: string;
  discount: number;
  due_amount: number;
  paid_amount: number;
  quantity: number;
  sub_total: number;
  total: number;
  consignment_id: string | null;
  tracking_code: string | null;
}

export interface CustomerOrdersResponse {
  success: boolean;
  message: string;
  data: CustomerOrderSummary[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface TrackingResponse {
  success: boolean;
  message: string;
  data?: {
    delivery_status?: string;
    status?: number;
    identifier_type?: string;
    identifier_value?: string;
    order?: {
      id?: number;
      order_number?: string;
      consignment_id?: string;
      tracking_code?: string;
      total?: number;
      customer_id?: number;
    };
  };
}

export interface InvoiceResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

// Detailed Order Response Types (for GET /api/orders/{orderId})
export interface OrderDetailCustomer {
  id: number;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface OrderDetailPaymentMethod {
  id: number;
  name: string;
  account_number: string;
}

export interface OrderDetailSalesManager {
  id: number;
  name: string;
}

export interface OrderDetailShop {
  id: number;
  name: string;
}

export interface OrderDetailSellPrice {
  price: number;
  discount: number;
  original_price: number;
}

export interface OrderDetailItem {
  id: number;
  name: string;
  photo: string;
  brand: string;
  category: string;
  sub_category: string;
  child_sub_category: string;
  supplier: string;
  cost: string;
  price: string;
  sell_price: OrderDetailSellPrice;
  quantity: number;
  sku: string;
  discount_fixed: number;
  discount_percent: number;
  discount_start: string;
  discount_end: string;
}

export interface OrderDetailTransaction {
  id: number;
  amount: number;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  payment_method_name: string;
  account_number: string;
  status: string;
  transaction_type: string;
  trx_id: string;
  transaction_by: string;
}

export interface OrderDetailData {
  id: number;
  created_at: string;
  updated_at: string;
  customer: OrderDetailCustomer;
  order_number: string;
  order_status: number;
  order_status_string: string;
  payment_method: OrderDetailPaymentMethod;
  payment_status: string;
  sales_manager: OrderDetailSalesManager | null;
  shop: OrderDetailShop | null;
  discount: number;
  due_amount: number;
  paid_amount: number;
  quantity: number;
  sub_total: number;
  total: number;
  order_details: OrderDetailItem[];
  transactions: OrderDetailTransaction[];
}

export interface OrderDetailResponse {
  success: boolean;
  message: string;
  data: OrderDetailData;
  order_id?: number;
}
