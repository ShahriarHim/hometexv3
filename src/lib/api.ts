/**
 * @deprecated Legacy API shim - redirects to new modular services
 *
 * This file exists ONLY for backward compatibility with old imports.
 * All functionality has been moved to proper service modules.
 *
 * ⚠️ UPDATE YOUR IMPORTS TO USE THE NEW SERVICES:
 *
 * OLD: import { api } from "@/lib/api"
 * NEW: import { productService, authService } from "@/services/api"
 *
 * OLD: import { APIProduct } from "@/lib/api"
 * NEW: import type { Product } from "@/types/api"
 *
 * OLD: import { transformAPIProductToProduct } from "@/lib/api"
 * NEW: import { transformAPIProductToProduct } from "@/lib/transforms"
 */

// Re-export client utilities
export {
  authenticatedFetch,
  fetchPublicWithFallback,
  fetchWithFallback,
  getAuthToken,
} from "@/services/api/client";

// Re-export services with legacy API structure
import {
  authService,
  orderService,
  paymentService,
  productService,
  userService,
} from "@/services/api";

// Legacy API wrapper - maps old method names to new service methods
export const api = {
  products: {
    getAll: productService.getProducts,
    getById: productService.getProduct,
    getSimilar: productService.getSimilarProducts,
    ...productService, // Include all other methods
  },
  auth: authService,
  orders: {
    getAll: orderService.getOrders,
    ...orderService,
  },
  profile: userService,
  payment: paymentService,
};

// Re-export types
export type { Product as APIProduct } from "@/types/api";

// Re-export transform function
export { transformAPIProductToProduct } from "@/lib/transforms";
