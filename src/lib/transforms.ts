/**
 * Data Transformation Utilities
 * Helper functions to transform API responses to frontend data structures
 */

import type { HeroSlide } from "@/data/migration-content";
import type { HeroBanner } from "@/types/api/product";

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
  pricing?: {
    regular_price?: number;
    sale_price?: number;
    final_price?: number;
    discount?: {
      is_active?: boolean;
      value?: number;
    };
  };
  inventory?: {
    stock_status?: string;
    stock_quantity?: number;
  };
  media?: {
    gallery?: Array<{ url?: string } | string>;
  };
  category?: {
    name?: string;
    slug?: string;
  };
  sub_category?: {
    name?: string;
    slug?: string;
  };
  child_sub_category?: {
    name?: string;
    slug?: string;
  };
  brand?: {
    name?: string;
    logo?: string;
  };
  reviews?: {
    average_rating?: number;
    review_count?: number;
  };
  badges?: {
    is_featured?: boolean;
    is_new?: boolean;
  };
  has_variations?: boolean;
  variations?: Array<{
    attributes?: {
      Color?: string;
      Size?: string;
    };
  }>;
  specifications?: Array<{
    name?: string;
    key?: string;
    value?: string;
  }>;
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
        href: sliderData.button_Link || "/shop",
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
        href: "/shop",
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
 */
export const transformHeroBannerToSlideV2 = (banner: HeroBanner): HeroSlide => {
  return {
    id: `banner-${banner.id}`,
    eyebrow: banner.subtitle || "",
    title: banner.title,
    description: "", // New API doesn't have description field
    image: banner.image,
    cta: {
      label: banner.button_text || "Shop Now",
      href: (banner.link || "/shop") as any,
    },
    secondaryCta: {
      label: "",
      href: "" as any,
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
export const transformAPIProductToProduct = (apiProduct: APIProduct): Product => {
  // Extract pricing information
  const pricing = apiProduct.pricing || {};
  const finalPrice = pricing.final_price || pricing.regular_price || 0;
  const regularPrice = pricing.regular_price || finalPrice;
  const salePrice = pricing.sale_price;

  // Calculate discount percentage
  let discountPercent = 0;
  if (pricing.discount && pricing.discount.is_active) {
    discountPercent = Math.round(pricing.discount.value || 0);
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

  // Get images from media gallery, fallback to brand logo or empty array
  const images =
    apiProduct.media?.gallery && apiProduct.media.gallery.length > 0
      ? apiProduct.media.gallery.map((img: { url?: string } | string) =>
          typeof img === "string" ? img : img.url || ""
        )
      : apiProduct.brand?.logo
        ? [apiProduct.brand.logo]
        : [];

  // Extract features from specifications or attributes
  const features: string[] = [];
  if (apiProduct.specifications && Array.isArray(apiProduct.specifications)) {
    apiProduct.specifications.forEach((spec: { name?: string; key?: string; value?: string }) => {
      if (spec.value) {
        features.push(`${spec.name || spec.key || ""}: ${spec.value}`);
      }
    });
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
    inStock:
      apiProduct.inventory?.stock_status === "in_stock" &&
      (apiProduct.inventory?.stock_quantity ?? 0) > 0,
    rating: apiProduct.reviews?.average_rating || 4.5,
    reviewCount: apiProduct.reviews?.review_count || 0,
    material: apiProduct.brand?.name,
    isFeatured: apiProduct.badges?.is_featured || false,
    isNew: apiProduct.badges?.is_new || false,
    discount: discountPercent > 0 ? discountPercent : undefined,
    colors: colors.length > 0 ? colors : undefined,
    sizes: sizes.length > 0 ? sizes : undefined,
    features: features.length > 0 ? features : undefined,
  };
};
