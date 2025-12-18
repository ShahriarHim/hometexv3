"use client";

import { useRecentViews } from "@/hooks/use-recent-views";
import { Flame, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import PriceView from "./PriceView";
import ProductSideMenu from "./ProductSideMenu";
import Title from "./Title";

/**
 * Unified Product Type that handles both API and UI formats
 */
interface UnifiedProduct {
  id: string | number;
  name: string;
  slug?: string;
  price: number | string;
  originalPrice?: number;
  description?: string;
  category?: string | { id: number; name: string };
  subcategory?: string | { id: number; name: string };
  childSubcategory?: string | { id: number; name: string };
  sub_category?: { id: number; name: string };
  child_sub_category?: { id: number; name: string };
  images?: string[];
  primary_photo?: string;
  inStock?: boolean;
  stock?: number;
  rating?: number;
  reviewCount?: number;
  discount?: number;
  isFeatured?: boolean;
  isNew?: boolean;
  discount_percent?: string;
}

interface GenericProductCardProps {
  product: UnifiedProduct;
  showSaleLabel?: boolean;
  showTrendingIcon?: boolean;
}

/**
 * Generic Product Card Component
 * Handles both API and UI product formats with smart field extraction
 */
const GenericProductCard = ({
  product,
  showSaleLabel = true,
  showTrendingIcon = true,
}: GenericProductCardProps) => {
  const { addRecentView } = useRecentViews();

  // Helper functions to extract values from nested objects or strings
  const getCategoryName = (): string => {
    if (!product.category) {
      return "";
    }
    return typeof product.category === "string" ? product.category : product.category.name;
  };

  const getSubcategoryName = (): string => {
    const sub = product.subcategory || product.sub_category;
    if (!sub) {
      return "all";
    }
    return typeof sub === "string" ? sub : sub.name;
  };

  const getImageUrl = (): string => {
    if (product.primary_photo) {
      return product.primary_photo;
    }
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return "/placeholder.svg";
  };

  const getPrice = (): number => {
    if (typeof product.price === "number") {
      return product.price;
    }
    if (typeof product.price === "string") {
      // Remove currency symbols and parse - handle formats like '650৳' or '৳650'
      const cleaned = product.price.replace(/[^0-9.]/g, "");
      const parsed = parseFloat(cleaned);
      return !isNaN(parsed) && parsed > 0 ? parsed : 0;
    }
    return 0;
  };

  const getDiscount = (): number => {
    if (product.discount) {
      return product.discount;
    }
    if (product.discount_percent) {
      const match = product.discount_percent.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    }
    return 0;
  };

  // Determine stock - handle both number and boolean inStock
  const stock =
    typeof product.stock === "number"
      ? product.stock
      : product.inStock === true
        ? 100
        : product.inStock === false
          ? 0
          : 50;

  const discount = getDiscount();
  const status = discount > 0 ? "sale" : "trending";
  const categoryName = getCategoryName();
  const subcategoryName = getSubcategoryName();
  const imageUrl = getImageUrl();
  const price = getPrice();

  const handleProductClick = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addRecentView(product as any);
  };

  const productUrl = `/products/${categoryName}/${subcategoryName}/${product.id}`;

  return (
    <div className="text-sm border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300 group overflow-hidden">
      <div className="relative overflow-hidden bg-gray-50 rounded-t-lg">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Link href={productUrl as any} onClick={handleProductClick}>
          <div className="relative w-full h-64 bg-gray-50 flex items-center justify-center">
            <Image
              src={imageUrl}
              alt={product.name || "Product Image"}
              width={500}
              height={500}
              className={`w-full h-full object-contain transition-transform duration-500
                ${stock !== 0 ? "group-hover:scale-105" : "opacity-50"}`}
              unoptimized
            />
            {/* Stock Indicator */}
            {stock > 0 && (
              <div className="absolute bottom-2 right-2 z-10 bg-primary/90 backdrop-blur-sm border border-primary rounded-full px-3 py-1.5 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-black animate-pulse"></div>
                  <span className="text-xs font-bold text-black group-hover:text-black">
                    {stock} in stock
                  </span>
                </div>
              </div>
            )}
            {stock === 0 && (
              <div className="absolute bottom-2 right-2 z-10 bg-red-500/95 backdrop-blur-sm border border-red-600 rounded-full px-3 py-1.5 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                  <span className="text-xs font-bold text-white">Out of stock</span>
                </div>
              </div>
            )}
          </div>
        </Link>

        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <ProductSideMenu product={product as any} />

        {/* Status Badge */}
        {showSaleLabel && status === "sale" ? (
          <p className="absolute top-2 left-2 z-10 text-sm border-2 border-gray-400 bg-white px-3.5 py-1.5 rounded-full font-bold text-gray-900 shadow-md">
            Sale!
          </p>
        ) : showTrendingIcon && status === "trending" ? (
          <Link
            href="/deal"
            className="absolute top-2 left-2 z-10 border-2 border-accent-secondary bg-white/95 backdrop-blur-sm p-2 rounded-full hover:bg-accent-secondary/10 transition-colors shadow-md"
          >
            <Flame
              size={20}
              fill="hsl(var(--accent-secondary))"
              className="text-accent-secondary"
            />
          </Link>
        ) : null}
      </div>

      <div className="p-5 flex flex-col gap-3.5">
        {categoryName && (
          <p className="uppercase line-clamp-1 text-sm font-semibold text-gray-600 tracking-wider">
            {categoryName}
          </p>
        )}

        <Link
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          href={productUrl as any}
          onClick={handleProductClick}
          className="hover:text-accent transition-colors"
        >
          <Title className="text-base line-clamp-2 font-bold text-gray-900 leading-snug">
            {product.name}
          </Title>
        </Link>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => (
              <Star
                key={`star-${product.id || product.slug || "product"}-${index}`}
                className={`h-5 w-5 ${
                  index < Math.floor(product.rating || 4)
                    ? "text-warning fill-warning"
                    : "text-gray-300 fill-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-gray-600 text-sm font-medium">{product.reviewCount || 5} Reviews</p>
        </div>

        <PriceView
          price={price}
          originalPrice={product.originalPrice}
          discount={discount}
          className="text-sm"
        />

        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <AddToCartButton product={product as any} className="w-full" />
      </div>
    </div>
  );
};

export default GenericProductCard;
