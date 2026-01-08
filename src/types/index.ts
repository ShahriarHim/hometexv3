export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  subcategory?: string;
  childSubcategory?: string;
  images: string[];
  primary_photo?: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  colors?: string[];
  sizes?: string[];
  material?: string;
  features?: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  discount?: number;
  stock?: number;
  badges?: {
    is_featured?: boolean;
    is_new?: boolean;
    is_trending?: boolean;
    is_bestseller?: boolean;
    is_on_sale?: boolean;
    is_limited_edition?: boolean;
    is_exclusive?: boolean;
    is_eco_friendly?: boolean;
  };
  related_products?: {
    similar_products?: number[];
    frequently_bought_together?: number[];
    customers_also_viewed?: number[];
    recently_viewed?: number[];
  };
}

export interface ProductVariant {
  id: number;
  parent_id: number;
  sku: string;
  name: string;
  slug: string;
  attributes: {
    Size?: string;
    Color?: string;
    [key: string]: string | undefined;
  };
  pricing: {
    regular_price: number;
    sale_price: number | null;
    final_price: number;
  };
  inventory: {
    stock_status: string;
    stock_quantity: number;
  };
  media: Array<{ url?: string; type?: string; [key: string]: unknown }>;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  description?: string;
  subcategories?: Subcategory[];
  is_active?: boolean;
  sort_order?: number;
  has_children?: boolean;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  parent_id?: string;
  is_active?: boolean;
  sort_order?: number;
  child_categories?: ChildCategory[];
}

export interface ChildCategory {
  id: string;
  name: string;
  slug: string;
  parent_id: string;
  image?: string | null;
  is_active?: boolean;
  sort_order?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface WishlistItem {
  product: Product;
  addedAt: Date;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  cta?: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
  verified: boolean;
}
