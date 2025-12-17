/**
 * Data Transformation Utilities
 * Helper functions to transform API responses to frontend data structures
 */

import type { HeroSlide } from "@/data/migration-content";
import type { Route } from "next";

// Types for API data structures
interface HeroBannerSliderData {
  meddle: {
    Header?: string;
    title?: string;
    description?: string;
  };
  button_text?: string;
  button_Link?: string;
  left: {
    background_color?: string;
  };
  right: {
    background_color?: string;
  };
}

interface HeroBannerItem {
  id: number;
  slider: string;
}

interface APIProduct {
  id: number;
  name?: string;
  slug?: string;
  description?: string;
  short_description?: string;
  // Support both nested pricing object and flat price fields
  pricing?: {
    regular_price?: number;
    sale_price?: number;
    final_price?: number;
    discount?: {
      is_active?: boolean;
      value?: number;
    };
  };
  // Flat price fields (actual API structure)
  price?: number | string; // Can be "650৳" or 650
  original_price?: number;
  regular_price?: number;
  sale_price?: number;
  final_price?: number;
  discount_percent?: number | string; // Can be "10%" or 10
  sell_price?: {
    price?: number;
    discount?: number;
    symbol?: string;
  };
  cost?: string | number;
  inventory?: {
    stock_status?: string;
    stock_quantity?: number;
  };
  // Support both nested inventory and flat fields
  stock_status?: "in_stock" | "out_of_stock" | "backorder" | "Active" | "Inactive";
  stock_quantity?: number;
  stock?: number;
  media?: {
    gallery?: Array<{ url?: string } | string>;
  };
  // Support flat images array
  images?: string[];
  thumbnail?: string;
  primary_photo?: string; // Actual API field for main image
  category?: {
    id?: number;
    name?: string;
    slug?: string;
  };
  sub_category?: {
    id?: number;
    name?: string;
    slug?: string;
  };
  child_sub_category?: {
    id?: number;
    name?: string;
    slug?: string;
  };
  brand?: {
    id?: number;
    name?: string;
    logo?: string;
  };
  reviews?: {
    average_rating?: number;
    review_count?: number;
  };
  // Support flat rating fields
  rating?: number;
  reviews_count?: number;
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
  // Support flat badge fields
  is_featured?: boolean | number; // Can be 0 or 1
  is_new?: boolean | number; // Can be 0 or 1
  is_bestseller?: boolean;
  isTrending?: boolean | number;
  has_variations?: boolean;
  variations?: Array<{
    attributes?: {
      Color?: string;
      Size?: string;
    };
  }>;
  specifications?:
    | Array<{
        name?: string;
        key?: string;
        value?: string;
      }>
    | Record<string, string>;
  attributes?: Array<unknown> | Record<string, string>;
}

interface Product {
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
  material?: string;
  isFeatured: boolean;
  isNew: boolean;
  discount?: number;
  colors?: string[];
  sizes?: string[];
  features?: string[];
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
}

/**
 * Transform API hero banner data to HeroSlide format
 */
export const transformHeroBannerToSlide = (banner: HeroBannerItem): HeroSlide => {
  try {
    // Extract JSON from the slider field (it's embedded in a URL)
    const sliderUrl = banner.slider;
    const jsonStartIndex = sliderUrl.indexOf("{");
    const jsonString = sliderUrl.substring(jsonStartIndex);
    const sliderData: HeroBannerSliderData = JSON.parse(jsonString);

    // Helper to generate color palette from a single color
    const generatePalette = (baseColor: string): string[] => {
      if (!baseColor || baseColor === "") {
        return [];
      }
      // Return the same color for simplicity, or you can generate variations
      return [baseColor, baseColor, baseColor, baseColor, baseColor];
    };

    return {
      id: `banner-${banner.id}`,
      eyebrow: sliderData.meddle.Header || "",
      title: sliderData.meddle.title || "",
      description: sliderData.meddle.description || "",
      image: "", // API doesn't provide a direct image URL for the main banner
      cta: {
        label: sliderData.button_text || "Shop Now",
        href: sliderData.button_Link || "/products",
      },
      secondaryCta: {
        label: "",
        href: "",
      },
      stats: {
        label: "",
        value: "",
      },
      accentPalette: {
        left: sliderData.left.background_color
          ? generatePalette(sliderData.left.background_color)
          : [],
        right: sliderData.right.background_color
          ? generatePalette(sliderData.right.background_color)
          : [],
      },
    };
  } catch {
    // Return a default slide if parsing fails
    return {
      id: `banner-${banner.id}`,
      eyebrow: "",
      title: "Welcome to HomeTex",
      description: "",
      image: "",
      cta: {
        label: "Shop Now",
        href: "/products",
      },
      secondaryCta: {
        label: "",
        href: "",
      },
      stats: {
        label: "",
        value: "",
      },
      accentPalette: {
        left: [],
        right: [],
      },
    };
  }
};

/**
 * Transform new API HeroBanner to HeroSlide format
 * Uses HeroBannerV2 interface which has the proper structure
 */
interface HeroBannerV2Input {
  id: number;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  button_text?: string;
}

export const transformHeroBannerToSlideV2 = (banner: HeroBannerV2Input): HeroSlide => {
  return {
    id: `banner-${banner.id}`,
    eyebrow: banner.subtitle || "",
    title: banner.title,
    description: "", // New API doesn't have description field
    image: banner.image,
    cta: {
      label: banner.button_text || "Shop Now",
      href: (banner.link || "/products") as Route,
    },
    secondaryCta: {
      label: "",
      href: "" as Route,
    },
    stats: {
      label: "",
      value: "",
    },
    accentPalette: {
      left: [],
      right: [],
    },
  };
};

/**
 * Transform API product data to Product format
 */
// Helper function to extract numeric value from price string (e.g., "650৳" -> 650)
const extractNumericPrice = (price: number | string | undefined): number => {
  if (typeof price === "number") {
    return price;
  }
  if (typeof price === "string") {
    // Remove currency symbols and whitespace, extract number
    const numeric = price.replace(/[^\d.]/g, "");
    const parsed = parseFloat(numeric);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

// Helper function to extract numeric value from discount percent (e.g., "10%" -> 10)
const extractNumericDiscount = (discount: number | string | undefined): number => {
  if (typeof discount === "number") {
    return discount;
  }
  if (typeof discount === "string") {
    // Remove % symbol and extract number
    const numeric = discount.replace(/[^\d.]/g, "");
    const parsed = parseFloat(numeric);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

export const transformAPIProductToProduct = (apiProduct: APIProduct): Product => {
  // Extract pricing information - handle both nested pricing object and direct price fields
  const pricing = apiProduct.pricing || {};

  // Priority: sell_price.price > original_price > price (parsed) > regular_price > final_price
  let finalPrice = 0;
  let regularPrice = 0;
  let salePrice: number | undefined = undefined;

  if (apiProduct.sell_price?.price !== undefined) {
    finalPrice = apiProduct.sell_price.price;
  } else if (apiProduct.original_price !== undefined) {
    finalPrice = apiProduct.original_price;
  } else if (apiProduct.price !== undefined) {
    finalPrice = extractNumericPrice(apiProduct.price);
  } else {
    finalPrice =
      pricing.final_price ||
      apiProduct.final_price ||
      pricing.regular_price ||
      apiProduct.regular_price ||
      0;
  }

  // Regular price (original/regular price before discount)
  if (apiProduct.original_price !== undefined) {
    regularPrice = apiProduct.original_price;
  } else if (apiProduct.price !== undefined) {
    regularPrice = extractNumericPrice(apiProduct.price);
  } else {
    regularPrice = pricing.regular_price || apiProduct.regular_price || finalPrice;
  }

  // Sale price (if different from final price)
  salePrice = pricing.sale_price || apiProduct.sale_price;

  // Calculate discount percentage
  let discountPercent = 0;
  if (pricing.discount && pricing.discount.is_active) {
    discountPercent = Math.round(pricing.discount.value || 0);
  } else if (apiProduct.discount_percent) {
    discountPercent = extractNumericDiscount(apiProduct.discount_percent);
  } else if (apiProduct.sell_price?.discount) {
    discountPercent = apiProduct.sell_price.discount;
  } else if (salePrice && regularPrice > salePrice) {
    discountPercent = Math.round(((regularPrice - salePrice) / regularPrice) * 100);
  } else if (regularPrice > finalPrice) {
    discountPercent = Math.round(((regularPrice - finalPrice) / regularPrice) * 100);
  }

  // Strip HTML tags from description
  const stripHtml = (html: string) => {
    if (!html) {
      return "";
    }
    return html.replace(/<[^>]*>/g, "").trim();
  };

  // Extract unique colors and sizes from variations
  const colors =
    apiProduct.has_variations && apiProduct.variations
      ? (Array.from(
          new Set(apiProduct.variations.map((v) => v.attributes?.Color).filter(Boolean))
        ) as string[])
      : [];

  const sizes =
    apiProduct.has_variations && apiProduct.variations
      ? (Array.from(
          new Set(apiProduct.variations.map((v) => v.attributes?.Size).filter(Boolean))
        ) as string[])
      : [];

  // Get images - priority: primary_photo > images array > media gallery > thumbnail > brand logo
  const images: string[] = [];

  if (apiProduct.primary_photo) {
    images.push(apiProduct.primary_photo);
  } else if (apiProduct.images && apiProduct.images.length > 0) {
    images.push(...apiProduct.images);
  } else if (apiProduct.media?.gallery && apiProduct.media.gallery.length > 0) {
    const galleryImages = apiProduct.media.gallery
      .map((img: { url?: string } | string) => (typeof img === "string" ? img : img.url || ""))
      .filter(Boolean);
    images.push(...galleryImages);
  } else if (apiProduct.thumbnail) {
    images.push(apiProduct.thumbnail);
  } else if (apiProduct.brand?.logo) {
    images.push(apiProduct.brand.logo);
  }

  // Extract features from specifications or attributes
  const features: string[] = [];
  if (apiProduct.specifications) {
    if (Array.isArray(apiProduct.specifications)) {
      apiProduct.specifications.forEach((spec: { name?: string; key?: string; value?: string }) => {
        if (spec.value) {
          features.push(`${spec.name || spec.key || ""}: ${spec.value}`);
        }
      });
    } else if (typeof apiProduct.specifications === "object") {
      // Handle Record<string, string> format
      Object.entries(apiProduct.specifications).forEach(([key, value]) => {
        if (value) {
          features.push(`${key}: ${value}`);
        }
      });
    }
  }

  return {
    id: apiProduct.id.toString(),
    name: apiProduct.name || "Unnamed Product",
    slug: apiProduct.slug || "",
    price: finalPrice,
    originalPrice: regularPrice > finalPrice ? regularPrice : undefined,
    description: stripHtml(apiProduct.description || apiProduct.short_description || ""),
    category:
      apiProduct.category?.slug ||
      apiProduct.category?.name?.toLowerCase().replace(/\s+/g, "-") ||
      "uncategorized",
    subcategory:
      apiProduct.sub_category?.slug ||
      apiProduct.sub_category?.name?.toLowerCase().replace(/\s+/g, "-"),
    childSubcategory:
      apiProduct.child_sub_category?.slug ||
      apiProduct.child_sub_category?.name?.toLowerCase().replace(/\s+/g, "-"),
    images: images,
    stock:
      apiProduct.inventory?.stock_quantity ?? apiProduct.stock_quantity ?? apiProduct.stock ?? 0,
    inStock:
      (apiProduct.inventory?.stock_quantity ?? apiProduct.stock_quantity ?? apiProduct.stock ?? 0) >
        0 ||
      apiProduct.inventory?.stock_status === "in_stock" ||
      apiProduct.stock_status === "in_stock" ||
      apiProduct.stock_status === "Active",
    rating: apiProduct.reviews?.average_rating || apiProduct.rating || 4.5,
    reviewCount: apiProduct.reviews?.review_count || apiProduct.reviews_count || 0,
    material: apiProduct.brand?.name,
    isFeatured:
      apiProduct.badges?.is_featured ||
      apiProduct.is_featured === true ||
      apiProduct.is_featured === 1 ||
      false,
    isNew:
      apiProduct.badges?.is_new || apiProduct.is_new === true || apiProduct.is_new === 1 || false,
    discount: discountPercent > 0 ? discountPercent : undefined,
    colors: colors.length > 0 ? colors : undefined,
    sizes: sizes.length > 0 ? sizes : undefined,
    features: features.length > 0 ? features : undefined,
    badges: (() => {
      if (apiProduct.badges) {
        return {
          is_featured: apiProduct.badges.is_featured ?? false,
          is_new: apiProduct.badges.is_new ?? false,
          is_trending: apiProduct.badges.is_trending ?? false,
          is_bestseller: apiProduct.badges.is_bestseller ?? false,
          is_on_sale: apiProduct.badges.is_on_sale ?? false,
          is_limited_edition: apiProduct.badges.is_limited_edition ?? false,
          is_exclusive: apiProduct.badges.is_exclusive ?? false,
          is_eco_friendly: apiProduct.badges.is_eco_friendly ?? false,
        };
      }
      // Fallback to flat fields if badges object doesn't exist
      return {
        is_featured: apiProduct.is_featured === true || apiProduct.is_featured === 1 || false,
        is_new: apiProduct.is_new === true || apiProduct.is_new === 1 || false,
        is_trending: apiProduct.isTrending === true || apiProduct.isTrending === 1 || false,
        is_bestseller:
          apiProduct.is_bestseller === true ||
          (typeof apiProduct.is_bestseller === "number" && apiProduct.is_bestseller === 1) ||
          false,
        is_on_sale: false,
        is_limited_edition: false,
        is_exclusive: false,
        is_eco_friendly: false,
      };
    })(),
  };
};
