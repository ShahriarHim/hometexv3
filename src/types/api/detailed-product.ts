/**
 * Detailed Product Types
 * Used for product detail pages with full API response structure
 */

export interface ProductVariation {
  id: number;
  sku: string;
  attributes: Record<string, string>;
  pricing: {
    regular_price: number;
    sale_price: number | null;
    final_price: number;
  };
  inventory: {
    stock_status: "in_stock" | "out_of_stock" | "backorder";
    stock_quantity: number;
  };
  media?: Array<{ url: string } | string>;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
}

export interface BulkPricingTier {
  min_quantity: number;
  max_quantity?: number | null;
  price: number;
  discount_percentage?: number;
}

export interface StockLocation {
  shop_id: number;
  shop_name: string;
  quantity: number;
  reserved: number;
}

export interface DetailedProduct {
  id: number;
  name: string;
  slug: string;
  sku: string;
  description?: string;
  short_description?: string;
  status?: "active" | "inactive" | "draft";

  // Pricing
  pricing: {
    regular_price: number;
    sale_price?: number | null;
    final_price: number;
    currency: string;
    currency_symbol: string;
    discount: {
      is_active: boolean;
      value: number;
      type?: "percentage" | "fixed";
    };
    tax: {
      included: boolean;
      rate: number;
    };
  };

  // Inventory
  inventory: {
    stock_status: "in_stock" | "out_of_stock" | "backorder";
    stock_quantity: number;
    is_low_stock?: boolean;
    low_stock_threshold?: number;
    sold_count?: number;
    stock_by_location?: StockLocation[];
  };

  // Variations
  has_variations?: boolean;
  variations?: ProductVariation[];

  // Bulk pricing
  bulk_pricing?: BulkPricingTier[];

  // Order constraints
  minimum_order_quantity?: number;
  maximum_order_quantity?: number;

  // Media
  media?: {
    gallery?: Array<{ url: string } | string>;
    videos?: Array<{ id?: number; type?: string; url: string; thumbnail?: string; title?: string }>;
    primary_image?: string | { url?: string; image_url?: string; path?: string };
    thumbnail?: string | { url?: string; image_url?: string; path?: string };
  };

  // Categories
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  sub_category?: {
    id: number;
    name: string;
    slug: string;
  };
  child_sub_category?: {
    id: number;
    name: string;
    slug: string;
  };

  // Brand
  brand?: {
    id: number;
    name: string;
    slug?: string;
    logo?: string;
  };

  // Reviews
  reviews?: {
    average_rating: number;
    review_count: number;
    verified_purchase_percentage?: number;
    recommendation_percentage?: number;
    rating_distribution?: {
      "1_star": number;
      "2_star": number;
      "3_star": number;
      "4_star": number;
      "5_star": number;
    };
  };

  // Badges
  badges?: {
    is_featured?: boolean;
    is_new?: boolean;
    is_trending?: boolean;
    is_bestseller?: boolean;
    is_on_sale?: boolean;
  };

  // SEO
  seo?: {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string[];
    canonical_url?: string;
    og_title?: string;
    og_description?: string;
    og_image?: string;
    twitter_card?: string;
  };

  // Shipping
  shipping?: {
    weight?: number;
    weight_unit?: string;
    dimensions?: {
      length: number;
      width: number;
      height: number;
      unit: string;
    };
    free_shipping?: boolean;
    shipping_class?: string;
    estimated_delivery?: {
      min_days: number;
      max_days: number;
      express_available?: boolean;
    };
    ships_from?: {
      city: string;
      country: string;
    };
  };

  // Warranty
  warranty?: {
    has_warranty: boolean;
    duration?: number;
    duration_unit?: string;
    type?: string;
    details?: string;
  };

  // Return Policy
  return_policy?: {
    returnable: boolean;
    return_window_days?: number;
    conditions?: string;
  };

  // Manufacturer
  manufacturer?: {
    id: number;
    name: string;
  };

  // Country of Origin
  country_of_origin?: {
    code: string;
    name: string;
  };

  // Breadcrumb
  breadcrumb?: Array<{
    id: number;
    name: string;
    slug: string;
    level?: number;
  }>;

  // Related products
  related_products?: {
    frequently_bought_together?: number[];
    similar_products?: number[];
  };

  // Specifications
  specifications?: Array<{
    name?: string;
    key?: string;
    value?: string;
  }>;

  // Tags
  tags?: string[];

  // Timestamps
  created_at?: string;
  updated_at?: string;
}

export interface DetailedProductResponse {
  success: boolean;
  message: string;
  data: DetailedProduct;
}

/**
 * Helper function to get safe default values
 */
export const getDefaultDetailedProduct = (partial: Partial<DetailedProduct>): DetailedProduct => ({
  id: 0,
  name: "",
  slug: "",
  sku: "",
  pricing: {
    regular_price: 0,
    final_price: 0,
    currency: "BDT",
    currency_symbol: "৳",
    discount: { is_active: false, value: 0 },
    tax: { included: true, rate: 0 },
  },
  inventory: {
    stock_status: "out_of_stock",
    stock_quantity: 0,
  },
  ...partial,
});
