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
    [key: string]: any;
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
  media: any[];
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
  image: string;
  description?: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  image?: string;
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
