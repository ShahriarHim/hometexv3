"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Leaf, Minus, Plus, ShoppingCart, Star, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ProductBadges {
  is_featured?: boolean;
  is_new?: boolean;
  is_trending?: boolean;
  is_bestseller?: boolean;
  is_on_sale?: boolean;
  is_exclusive?: boolean;
  is_limited_edition?: boolean;
  is_eco_friendly?: boolean;
}

interface ProductStickyBarProps {
  productImage: string;
  productName: string;
  price: number;
  currencySymbol: string;
  isInStock: boolean;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  onQuantityChange: (newQuantity: number) => void;
  onAddToCart: () => void;
  onVisibilityChange?: (isVisible: boolean) => void;
  badges?: ProductBadges;
}

export const ProductStickyBar = ({
  productImage,
  productName,
  price,
  currencySymbol,
  isInStock,
  quantity,
  minQuantity,
  maxQuantity,
  onQuantityChange,
  onAddToCart,
  onVisibilityChange,
  badges,
}: ProductStickyBarProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    let lastScrollY = window.scrollY;

    const updateHeaders = (shouldBeVisible: boolean) => {
      const preheaderWrapper = document.getElementById("preheader-wrapper");
      const mainHeader = document.getElementById("main-header");

      if (preheaderWrapper) {
        if (shouldBeVisible) {
          preheaderWrapper.classList.remove("header-visible");
          preheaderWrapper.classList.add("header-hidden");
        } else {
          preheaderWrapper.classList.remove("header-hidden");
          preheaderWrapper.classList.add("header-visible");
        }
      }

      if (mainHeader) {
        if (shouldBeVisible) {
          mainHeader.classList.remove("header-visible");
          mainHeader.classList.add("header-hidden");
        } else {
          mainHeader.classList.remove("header-hidden");
          mainHeader.classList.add("header-visible");
        }
      }
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const shouldBeVisible = scrollY > 300;
          const hasChanged = Math.abs(scrollY - lastScrollY) > 5; // Only update if scrolled more than 5px

          if (hasChanged) {
            setIsVisible(shouldBeVisible);
            onVisibilityChange?.(shouldBeVisible);
            updateHeaders(shouldBeVisible);
            lastScrollY = scrollY;
          }

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initialize headers on mount
    updateHeaders(window.scrollY > 300);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      // Reset headers on unmount
      const preheaderWrapper = document.getElementById("preheader-wrapper");
      const mainHeader = document.getElementById("main-header");
      if (preheaderWrapper) {
        preheaderWrapper.classList.remove("header-hidden");
        preheaderWrapper.classList.add("header-visible");
      }
      if (mainHeader) {
        mainHeader.classList.remove("header-hidden");
        mainHeader.classList.add("header-visible");
      }
    };
  }, [onVisibilityChange]);

  const handleDecrease = () => {
    if (quantity > minQuantity) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#E8FE00] border-b border-[#E8FE00]/20 shadow-lg transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 py-3">
          {/* Product Image */}
          <div className="relative h-12 w-12 flex-shrink-0 rounded-md overflow-hidden border-2 border-black/10 shadow-sm">
            <Image
              src={productImage || "/placeholder.svg"}
              alt={productName}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>

          {/* Product Name */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-black truncate">{productName}</h3>
              {badges?.is_featured && (
                <Badge variant="default" className="animate-pulse text-xs px-2 py-0.5">
                  Featured
                </Badge>
              )}
              {badges?.is_new && (
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-xs px-2 py-0.5">
                  ✨ New
                </Badge>
              )}
              {badges?.is_trending && (
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 text-xs px-2 py-0.5">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trending
                </Badge>
              )}
              {badges?.is_bestseller && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-0 text-xs px-2 py-0.5">
                  🏆 Bestseller
                </Badge>
              )}
              {badges?.is_on_sale && (
                <Badge variant="destructive" className="animate-pulse text-xs px-2 py-0.5">
                  <Flame className="w-3 h-3 mr-1" />
                  On Sale
                </Badge>
              )}
              {badges?.is_exclusive && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-xs px-2 py-0.5">
                  <Star className="w-3 h-3 mr-1" />
                  Exclusive
                </Badge>
              )}
              {badges?.is_limited_edition && (
                <Badge className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white border-0 text-xs px-2 py-0.5">
                  ⚡ Limited Edition
                </Badge>
              )}
              {badges?.is_eco_friendly && (
                <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 text-xs px-2 py-0.5">
                  <Leaf className="w-3 h-3 mr-1" />
                  Eco Friendly
                </Badge>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="flex-shrink-0 hidden sm:block">
            <span className="text-lg font-bold text-black">
              {currencySymbol}
              {price.toLocaleString()}
            </span>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-white/90 hover:bg-white border-black/20 text-black"
              onClick={handleDecrease}
              disabled={quantity <= minQuantity || !isInStock}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                const newQuantity = parseInt(e.target.value, 10) || minQuantity;
                if (newQuantity >= minQuantity && newQuantity <= maxQuantity) {
                  onQuantityChange(newQuantity);
                }
              }}
              className="w-16 text-center border border-black/20 rounded px-2 py-1 text-sm bg-white/90 text-black font-medium"
              min={minQuantity}
              max={maxQuantity}
              disabled={!isInStock}
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-white/90 hover:bg-white border-black/20 text-black"
              onClick={handleIncrease}
              disabled={quantity >= maxQuantity || !isInStock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Add to Cart Button */}
          <div className="flex-shrink-0">
            <Button
              onClick={onAddToCart}
              size="sm"
              className="bg-black text-white hover:bg-black/90 shadow-md hover:shadow-lg transition-all border-0"
              disabled={!isInStock}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Add to Cart</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
