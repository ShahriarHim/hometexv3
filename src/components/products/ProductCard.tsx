"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRecentViews } from "@/hooks/use-recent-views";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import { Eye, Flame, Heart, Layers, Leaf, Star, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import HotDealsQuickViewModal from "../home/HotDealsQuickViewModal";
import { MakeOfferButton } from "./MakeOfferButton";
import PriceView from "./PriceView";
import Title from "./Title";

// Helper function to get active badges in priority order (max 2)
const getActiveBadges = (badges?: Product["badges"]) => {
  if (!badges) {
    return [];
  }
  const active: Array<{ key: string; label: string; className: string; icon?: React.ReactNode }> =
    [];

  // Priority order: bestseller > trending > eco_friendly > exclusive > limited_edition > new
  if (badges.is_bestseller) {
    active.push({
      key: "bestseller",
      label: "🏆 Best",
      className: "bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-0 text-xs",
    });
  }
  if (badges.is_trending) {
    active.push({
      key: "trending",
      label: "Trend",
      className: "bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 text-xs",
      icon: <TrendingUp className="w-3 h-3 mr-1 inline" />,
    });
  }
  if (badges.is_eco_friendly) {
    active.push({
      key: "eco",
      label: "Eco",
      className: "bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 text-xs",
      icon: <Leaf className="w-3 h-3 mr-1 inline" />,
    });
  }
  if (badges.is_exclusive) {
    active.push({
      key: "exclusive",
      label: "Exclusive",
      className: "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-xs",
      icon: <Star className="w-3 h-3 mr-1 inline" />,
    });
  }
  if (badges.is_limited_edition) {
    active.push({
      key: "limited",
      label: "⚡ Limited",
      className: "bg-gradient-to-r from-indigo-500 to-blue-500 text-white border-0 text-xs",
    });
  }
  if (badges.is_new) {
    active.push({
      key: "new",
      label: "✨ New",
      className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-xs",
    });
  }

  // Return max 2 badges to prevent overflow
  return active.slice(0, 2);
};

interface ProductCardProps {
  product: Product;
  viewMode?: "grid-5" | "grid-3" | "list";
  showSaleLabel?: boolean;
  showTrendingIcon?: boolean;
  hidePrice?: boolean;
  hideRating?: boolean;
  className?: string;
}

export const ProductCard = ({
  product,
  viewMode = "grid-3",
  showSaleLabel = true,
  showTrendingIcon = true,
  hidePrice = false,
  hideRating = false,
  className,
}: ProductCardProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addRecentView } = useRecentViews();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isRestockRequested, setIsRestockRequested] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const openQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
  };

  // Helper functions to extract values (ported from GenericProductCard)
  const getCategoryName = (): string => {
    if (!product.category) {
      return "";
    }
    // Handle case where category might be a string or an object
    if (typeof product.category === "string") {
      return product.category;
    }
    // Safe access for object property
    return (product.category as { name?: string }).name || "";
  };

  const getSubcategoryName = (): string => {
    // product.subcategory is the standard property, sub_category might be legacy or from API transform
    const sub =
      product.subcategory ||
      (product as unknown as { sub_category?: { name?: string } | string }).sub_category;
    if (!sub) {
      return "all";
    }
    if (typeof sub === "string") {
      return sub;
    }
    return (sub as { name?: string }).name || "all";
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

  // Stock logic
  const stock =
    typeof product.stock === "number"
      ? product.stock
      : product.inStock === true
        ? 100
        : product.inStock === false
          ? 0
          : 50;

  const categoryName = getCategoryName();
  const subcategoryName = getSubcategoryName();
  const imageUrl = getImageUrl();

  // Use product URL generation logic
  // Ensure we have valid segments for the URL to match the [category]/[childCategory]/[id] route
  const urlCategory = categoryName ? encodeURIComponent(categoryName) : "all";
  const urlSubcategory = subcategoryName ? encodeURIComponent(subcategoryName) : "all";

  const productUrl = `/products/${urlCategory}/${urlSubcategory}/${product.id}`;

  const handleProductClick = () => {
    addRecentView(product);
  };

  return (
    <div
      className={cn(
        "text-sm border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300 group overflow-hidden flex",
        viewMode === "list" ? "flex-row" : "flex-col h-full",
        className
      )}
    >
      {/* Image Section */}
      <div
        className={cn(
          "relative overflow-hidden bg-gray-50",
          viewMode === "list"
            ? "w-48 shrink-0 border-r border-gray-100 aspect-square"
            : "w-full aspect-square rounded-t-lg"
        )}
      >
        <div className="block w-full h-full relative group/image overflow-hidden">
          <Link
            href={productUrl as never}
            onClick={handleProductClick}
            className="absolute inset-0 z-0"
          />

          {/* Hot Deals Hover Effect - Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/5 to-black/50 opacity-0 group-hover/image:opacity-100 transition-opacity duration-1000 ease-in-out z-10 pointer-events-none" />

          {/* Hot Deals Hover Effect - Shine */}
          <div className="absolute -top-1/2 -left-[60%] w-[20%] h-[200%] bg-white/10 rotate-[35deg] pointer-events-none transition-all duration-1000 ease-in-out z-20 opacity-0 group-hover/image:left-[130%] group-hover/image:opacity-100" />

          {/* Quick View Button - Right Side, Icon Only, Sequenced Fade In */}
          <div className="absolute top-1/2 right-4 -translate-y-1/2 z-30 flex flex-col gap-2">
            {/* Quick View */}
            <div className="opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 ease-in-out delay-100">
              <button
                type="button"
                onClick={openQuickView}
                className="w-[40px] h-[40px] rounded-[12px] bg-white text-[#333] shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center border-none hover:bg-[#84cc16] hover:text-white hover:shadow-[0_5px_15px_rgba(132,204,22,0.3)] transition-all duration-300 cursor-pointer transform hover:scale-110"
              >
                <Eye className="w-5 h-5 transition-transform duration-300" />
              </button>
            </div>

            {/* Make Offer - Only if in stock */}
            {stock > 0 && (
              <div className="opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 ease-in-out delay-100">
                <MakeOfferButton product={product} />
              </div>
            )}
          </div>

          <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
            <Image
              src={imageUrl}
              alt={product.name || "Product Image"}
              fill
              className={cn(
                "object-contain p-4 transition-transform duration-1000 ease-in-out",
                stock !== 0 && "group-hover:scale-105",
                !isImageLoaded && "opacity-0",
                isImageLoaded && "opacity-100"
              )}
              onLoad={() => setIsImageLoaded(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {/* Stock Indicator - Fade out on hover */}
          {stock > 0 && (
            <div className="absolute bottom-2 right-2 z-10 bg-primary/90 backdrop-blur-sm border border-primary rounded-full px-3 py-1.5 shadow-lg group-hover/image:opacity-0 transition-opacity duration-1000 ease-in-out pointer-events-none">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-black animate-pulse"></div>
                <span className="text-xs font-bold text-black">{stock} in stock</span>
              </div>
            </div>
          )}
          {stock === 0 && (
            <div className="absolute bottom-2 right-2 z-10 bg-red-500/95 backdrop-blur-sm border border-red-600 rounded-full px-3 py-1.5 shadow-lg group-hover/image:opacity-0 transition-opacity duration-1000 ease-in-out pointer-events-none">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white"></div>
                <span className="text-xs font-bold text-white">Out of stock</span>
              </div>
            </div>
          )}
        </div>

        {/* Badges - Fade out on hover */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 group-hover/image:opacity-0 transition-opacity duration-1000 ease-in-out">
          {product.discount && product.discount > 0 ? (
            <Badge className="bg-destructive text-destructive-foreground text-xs shadow-md border-0">
              -{product.discount}%
            </Badge>
          ) : showSaleLabel && product.badges?.is_on_sale ? (
            <Badge variant="destructive" className="animate-pulse text-xs shadow-md border-0">
              <Flame className="w-3 h-3 mr-1" />
              Sale
            </Badge>
          ) : showTrendingIcon &&
            (product.badges?.is_trending || (!product.discount && !product.badges?.is_on_sale)) ? (
            <Link
              href="/deal"
              className="border-2 border-accent-secondary bg-white/95 backdrop-blur-sm p-2 rounded-full hover:bg-accent-secondary/10 transition-colors shadow-md block"
            >
              <Flame
                size={20}
                fill="hsl(var(--accent-secondary))"
                className="text-accent-secondary"
              />
            </Link>
          ) : null}
        </div>

        {/* Extra Badges (top right) - Fade out on hover */}
        {(() => {
          const activeBadges = getActiveBadges(product.badges);
          const hasLegacyNew = !product.badges?.is_new && product.isNew;

          if (activeBadges.length === 0 && !hasLegacyNew) {
            return null;
          }

          return (
            <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 items-end group-hover/image:opacity-0 transition-opacity duration-1000 ease-in-out">
              {activeBadges.map((badge) => (
                <Badge
                  key={badge.key}
                  className={cn(badge.className, "whitespace-nowrap shadow-sm")}
                >
                  {badge.icon}
                  {badge.label}
                </Badge>
              ))}
              {hasLegacyNew && activeBadges.length < 2 && (
                <Badge className="bg-emerald-500 text-white text-xs whitespace-nowrap shadow-sm border-0">
                  New
                </Badge>
              )}
            </div>
          );
        })()}
      </div>

      {/* Content Section */}
      {/* Content Section */}
      <div
        className={cn(
          "p-4 flex flex-1 text-left",
          viewMode === "list" ? "flex-row gap-6 items-center" : "flex-col gap-2"
        )}
      >
        {/* Main Info */}
        <div className="flex-1 flex flex-col gap-2">
          {categoryName && (
            <p className="uppercase line-clamp-1 text-xs font-semibold text-gray-500 tracking-wider">
              {categoryName}
            </p>
          )}

          <div className="flex justify-between items-start gap-2">
            <Link
              href={productUrl as never}
              onClick={handleProductClick}
              className="hover:text-accent transition-colors block flex-1"
            >
              <Title className="text-sm font-bold text-gray-900 leading-tight line-clamp-2">
                {product.name}
              </Title>
            </Link>
            {!hidePrice && viewMode !== "list" && (
              <PriceView
                price={product.price}
                originalPrice={product.originalPrice}
                discount={product.discount}
                className="flex-col items-end gap-0.5"
                priceClassName="text-black text-lg"
              />
            )}
          </div>

          {/* Rating */}
          {!hideRating && (
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={`star-${product.id}-${index}`}
                  className={cn(
                    "h-3.5 w-3.5",
                    index < Math.floor(product.rating || 0)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-200 fill-gray-200"
                  )}
                />
              ))}
              {(product.reviewCount || 0) > 0 && (
                <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
              )}
            </div>
          )}

          {/* Description - List Mode Only */}
          {viewMode === "list" && product.description && (
            <p className="text-sm text-gray-500 line-clamp-2 mt-1">{product.description}</p>
          )}

          {/* Grid Mode Actions */}
          {viewMode !== "list" && (
            <div className="mt-auto pt-2 space-y-3">
              <div className="flex items-center gap-2">
                {stock === 0 ? (
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      if (!isRestockRequested) {
                        setIsRestockRequested(true);
                      }
                    }}
                    disabled={isRestockRequested}
                    className={cn(
                      "flex-1 font-semibold tracking-wide flex items-center justify-center gap-2",
                      "bg-orange-100 text-orange-900 border border-orange-200 hover:bg-orange-200",
                      isRestockRequested && "opacity-80 cursor-not-allowed"
                    )}
                    size="sm"
                  >
                    <span>{isRestockRequested ? "Restock Requested" : "Request Restock"}</span>
                  </Button>
                ) : (
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(product, 1);
                    }}
                    className="flex-1 font-semibold tracking-wide flex items-center justify-center gap-2 h-9 text-xs uppercase"
                  >
                    <span>Add to Cart</span>
                  </Button>
                )}

                <Link
                  href={`/products?filter=similar_products&productId=${product.id}`}
                  className="block"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 flex-shrink-0 border-input hover:bg-accent hover:text-accent-foreground transition-colors"
                    title="Find Similar Products"
                  >
                    <Layers className="h-4 w-4" />
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "h-9 w-9 flex-shrink-0 border-input hover:bg-accent hover:text-accent-foreground transition-colors",
                    isInWishlist(product.id) &&
                      "text-red-500 hover:text-red-600 border-red-200 bg-red-50"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (isInWishlist(product.id)) {
                      removeFromWishlist(product.id);
                    } else {
                      addToWishlist(product);
                    }
                  }}
                  title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart className={cn("h-4 w-4", isInWishlist(product.id) && "fill-current")} />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* List Mode Right Column (Price + Actions) */}
        {viewMode === "list" && (
          <div className="flex flex-col justify-center items-end gap-4 min-w-[180px] pl-6 border-l border-gray-100 py-2">
            {!hidePrice && (
              <PriceView
                price={product.price}
                originalPrice={product.originalPrice}
                discount={product.discount}
                className="flex-col items-end gap-0.5"
                priceClassName="text-black text-2xl font-bold"
              />
            )}

            <div className="flex items-center gap-2 w-full">
              {stock === 0 ? (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    if (!isRestockRequested) {
                      setIsRestockRequested(true);
                    }
                  }}
                  disabled={isRestockRequested}
                  className={cn(
                    "flex-1 font-semibold tracking-wide flex items-center justify-center gap-2",
                    "bg-orange-100 text-orange-900 border border-orange-200 hover:bg-orange-200",
                    isRestockRequested && "opacity-80 cursor-not-allowed"
                  )}
                  size="sm"
                >
                  <span>{isRestockRequested ? "Restock Requested" : "Request Restock"}</span>
                </Button>
              ) : (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(product, 1);
                  }}
                  className="flex-1 font-semibold tracking-wide flex items-center justify-center gap-2 h-9 text-xs uppercase"
                >
                  <span>Add to Cart</span>
                </Button>
              )}

              <Link
                href={`/products?filter=similar_products&productId=${product.id}`}
                className="block"
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 flex-shrink-0 border-input hover:bg-accent hover:text-accent-foreground transition-colors"
                  title="Find Similar Products"
                >
                  <Layers className="h-4 w-4" />
                </Button>
              </Link>

              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "h-9 w-9 flex-shrink-0 border-input hover:bg-accent hover:text-accent-foreground transition-colors",
                  isInWishlist(product.id) &&
                    "text-red-500 hover:text-red-600 border-red-200 bg-red-50"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isInWishlist(product.id)) {
                    removeFromWishlist(product.id);
                  } else {
                    addToWishlist(product);
                  }
                }}
                title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <Heart className={cn("h-4 w-4", isInWishlist(product.id) && "fill-current")} />
              </Button>
            </div>
          </div>
        )}
      </div>
      <HotDealsQuickViewModal isOpen={isQuickViewOpen} onClose={closeQuickView} product={product} />
    </div>
  );
};
