/**
 * API Services Barrel Export
 * Centralized export for all API services
 */

// Export client utilities
export * from "./client";

// Export services
export * from "./alerts.service";
export * from "./auth.service";
export * from "./cart.service";
export * from "./contact.service";
export * from "./gifts.service";
export * from "./order.service";
export * from "./payment.service";
export * from "./product.service";
export * from "./review.service";
export * from "./user.service";
export * from "./wishlist.service";

// Re-export types for convenience
export type * from "@/types/api/alerts";
export type * from "@/types/api/cart";
export type * from "@/types/api/common";
export type * from "@/types/api/order";
export type * from "@/types/api/payment";
export type * from "@/types/api/product";
export type * from "@/types/api/review";
export type * from "@/types/api/user";
