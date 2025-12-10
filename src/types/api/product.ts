/**
 * Product Types
 */

import type { PaginatedResponse } from "./common";

// Product
export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  description?: string;
  short_description?: string;
  price: number;
  regular_price: number;
  sale_price?: number;
  final_price: number;
  discount_percent?: number;
  stock_status: "in_stock" | "out_of_stock" | "backorder";
  stock_quantity: number;
  images: string[];
  thumbnail?: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  brand?: {
    id: number;
    name: string;
    logo?: string;
  };
  tags?: string[];
  attributes?: Record<string, string>;
  specifications?: Record<string, string>;
  features?: string[];
  colors?: string[];
  sizes?: string[];
  rating?: number;
  reviews_count?: number;
  is_featured?: boolean;
  is_new?: boolean;
  is_bestseller?: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at?: string;
  updated_at?: string;
}

// Product List Response
export interface ProductsResponse {
  success: boolean;
  message: string;
  data: {
    products: PaginatedResponse<Product>;
  };
}

// Product Detail Response
export interface ProductDetailResponse {
  success: boolean;
  message: string;
  data: Product;
}

// Product Query Params
export interface ProductQueryParams {
  page?: number;
  per_page?: number;
  category?: string;
  sort?: "price_asc" | "price_desc" | "newest" | "popular";
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  search?: string;
}

// Hero Banners
export interface HeroBanner {
  id: number;
  name: string;
  slider: string; // URL with embedded JSON data
  sl: number; // sort/slide order
  status: number; // 1 = active, 0 = inactive
}

// Legacy HeroBanner interface for new API structure (if ever migrated)
export interface HeroBannerV2 {
  id: number;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  button_text?: string;
  order: number;
  is_active: boolean;
}

export interface HeroBannersResponse {
  success: boolean;
  data: HeroBanner[];
}

// Categories/Menu
export interface ChildCategory {
  id: number;
  name: string;
  slug: string;
  parent_id: number;
  image: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface Subcategory {
  id: number;
  name: string;
  slug: string;
  parent_id: number;
  image: string | null;
  is_active: boolean;
  sort_order: number;
  child_categories: ChildCategory[];
}

export interface CategoryTree {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  description?: string | null;
  is_active: boolean;
  sort_order: number;
  subcategories: Subcategory[];
  level?: number;
  has_children?: boolean;
  parent_id?: number | null;
  meta_title?: string | null;
  meta_description?: string | null;
}

export interface MenuResponse {
  success: boolean;
  message: string;
  data: CategoryTree[];
  meta?: {
    request_id: string;
    timestamp: string;
    response_time_ms: number;
  };
}

// Root Categories (for lazy loading)
export interface RootCategory {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  has_children: boolean;
  is_active: boolean;
  sort_order: number;
}

export interface RootCategoriesResponse {
  success: boolean;
  message: string;
  data: RootCategory[];
  meta?: {
    request_id: string;
    timestamp: string;
    response_time_ms: number;
  };
}

// Category by Slug
export interface BreadcrumbItem {
  id: number;
  name: string;
  slug: string;
  level: number;
}

export interface CategoryBySlug {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  parent_id?: number | null;
  level: number;
  breadcrumb: BreadcrumbItem[];
  is_active: boolean;
  meta_title?: string | null;
  meta_description?: string | null;
  image: string | null;
}

export interface CategoryBySlugResponse {
  success: boolean;
  message: string;
  data: CategoryBySlug;
  meta?: {
    request_id: string;
    timestamp: string;
    response_time_ms: number;
  };
}

// Category Children (for lazy loading)
export interface CategoryChildInfo {
  id: number;
  name: string;
  slug: string;
  level: number;
}

export interface CategoryChild {
  id: number;
  name: string;
  slug: string;
  parent_id: number;
  has_children: boolean;
  is_active: boolean;
  sort_order: number;
}

export interface CategoryChildrenResponse {
  success: boolean;
  message: string;
  data: {
    category: CategoryChildInfo;
    children: CategoryChild[];
  };
  meta?: {
    request_id: string;
    timestamp: string;
    response_time_ms: number;
  };
}

// Breadcrumb
export interface BreadcrumbResponse {
  success: boolean;
  message: string;
  data: BreadcrumbItem[];
  meta?: {
    request_id: string;
    timestamp: string;
    response_time_ms: number;
  };
}
