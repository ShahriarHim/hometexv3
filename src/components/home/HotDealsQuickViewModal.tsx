"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { api, transformAPIProductToProduct } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Product as ProductType } from "@/types";
import {
  CheckCircle2,
  Facebook,
  Heart,
  Info,
  Instagram,
  Share2,
  Shield,
  Twitter,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface HotDealsQuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductType | null;
}

const sizes = ["XS", "S", "M", "L", "XL"];

export const HotDealsQuickViewModal: React.FC<HotDealsQuickViewModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = React.useState<number>(1);
  const [detailedProduct, setDetailedProduct] = React.useState<ProductType | null>(null);

  React.useEffect(() => {
    const fetchDetails = async () => {
      if (!product?.id || !isOpen) {
        return;
      }

      try {
        const response = await api.products.getById(product.id);
        const data = (response as { data?: unknown })?.data ?? response;

        if (data && typeof data === "object" && "id" in data) {
          const transformed = transformAPIProductToProduct(
            data as Parameters<typeof transformAPIProductToProduct>[0]
          );

          setDetailedProduct((prev) => ({
            ...(prev ?? product),
            ...transformed,
          }));
        }
      } catch (error) {
        // Silent fail – keep fallback product data

        console.error("Failed to load quick view product details", error);
      }
    };

    void fetchDetails();
  }, [product, isOpen]);

  const activeProduct = detailedProduct ?? product;

  const handleAddToCart = () => {
    if (!activeProduct) {
      return;
    }
    addToCart(activeProduct, quantity);
    onClose();
  };

  const handleWishlistToggle = () => {
    if (!activeProduct) {
      return;
    }
    if (isInWishlist(activeProduct.id)) {
      removeFromWishlist(activeProduct.id);
    } else {
      addToWishlist(activeProduct);
    }
  };

  if (!activeProduct) {
    return null;
  }

  const discountPercentage =
    activeProduct.originalPrice && activeProduct.originalPrice > activeProduct.price
      ? Math.round(
          ((activeProduct.originalPrice - activeProduct.price) / activeProduct.originalPrice) * 100
        )
      : null;

  const productUrl = `/products/${activeProduct.category}/${activeProduct.childSubcategory || activeProduct.subcategory || "all"}/${activeProduct.id}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" className="border border-border/60">
      <div className="grid gap-8 p-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.3fr)]">
        <div className="flex items-start justify-center">
          <Link
            href={productUrl as never}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-muted/40 block"
          >
            <div className="relative aspect-[3/4] md:aspect-[4/5]">
              <Image
                src={activeProduct.primary_photo || activeProduct.images[0] || "/placeholder.svg"}
                alt={activeProduct.name}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 420px, 100vw"
                priority
              />
            </div>
          </Link>
        </div>

        <ScrollArea className="max-h-[80vh] pr-2">
          <div className="space-y-6">
            <div className="space-y-2">
              <Link href={productUrl as never}>
                <h2 className="text-lg font-semibold leading-tight text-foreground md:text-xl hover:text-primary transition-colors">
                  {activeProduct.name}
                </h2>
              </Link>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-foreground md:text-3xl">
                    ৳{activeProduct.price.toLocaleString()}
                  </span>
                  {activeProduct.originalPrice && (
                    <span className="text-base text-muted-foreground line-through">
                      ৳{activeProduct.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                {discountPercentage && (
                  <Badge className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
                    -{discountPercentage}% OFF
                  </Badge>
                )}
                {activeProduct.badges && (
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    {activeProduct.badges.is_new && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                        New
                      </span>
                    )}
                    {activeProduct.badges.is_trending && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700">
                        Trending
                      </span>
                    )}
                    {activeProduct.badges.is_bestseller && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700">
                        Bestseller
                      </span>
                    )}
                    {activeProduct.badges.is_limited_edition && (
                      <span className="rounded-full bg-rose-100 px-2 py-0.5 text-rose-700">
                        Limited
                      </span>
                    )}
                    {activeProduct.badges.is_eco_friendly && (
                      <span className="rounded-full bg-lime-100 px-2 py-0.5 text-lime-700">
                        Eco
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Select Size
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        className={cn(
                          "min-w-[2.5rem] rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide transition-all",
                          "border-border bg-background text-foreground hover:border-primary hover:bg-primary/5"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  className="text-xs font-medium text-primary underline-offset-4 hover:underline"
                >
                  Size Chart
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-full border border-border bg-background px-3 py-1.5 text-sm">
                    <button
                      type="button"
                      className="px-2 text-lg leading-none text-muted-foreground hover:text-foreground"
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    >
                      −
                    </button>
                    <span className="min-w-[2rem] text-center text-sm font-medium">{quantity}</span>
                    <button
                      type="button"
                      className="px-2 text-lg leading-none text-muted-foreground hover:text-foreground"
                      onClick={() => setQuantity((prev) => prev + 1)}
                    >
                      +
                    </button>
                  </div>
                  <Button
                    className="w-full rounded-full bg-primary text-sm font-semibold tracking-wide text-primary-foreground hover:bg-primary/90"
                    size="lg"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </Button>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleWishlistToggle}
                    className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4",
                        isInWishlist(activeProduct.id) ? "fill-current text-primary" : ""
                      )}
                    />
                    <span>
                      {isInWishlist(activeProduct.id) ? "Added to Wishlist" : "Add to Wishlist"}
                    </span>
                  </button>

                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="text-[11px] font-medium uppercase tracking-[0.14em]">
                      Share
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80"
                        aria-label="Share on Facebook"
                      >
                        <Facebook className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80"
                        aria-label="Share on X"
                      >
                        <Twitter className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80"
                        aria-label="Share on Instagram"
                      >
                        <Instagram className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80"
                        aria-label="More share options"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {activeProduct.description && (
              <div
                className="rounded-2xl bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground"
                // Description comes from trusted backend HTML

                dangerouslySetInnerHTML={{ __html: activeProduct.description }}
              />
            )}

            <div className="space-y-4 rounded-2xl bg-muted/40 p-4">
              <div className="space-y-2">
                <h3 className="text-xs font-semibold tracking-[0.16em] text-muted-foreground">
                  PRODUCT HIGHLIGHTS
                </h3>
                {activeProduct.features && activeProduct.features.length > 0 ? (
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {activeProduct.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                      <span>Premium materials designed for everyday comfort and durability.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                      <span>Thoughtful stitching and finishing for a clean, elevated look.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                      <span>Balanced weight and softness suitable for all-season use.</span>
                    </li>
                  </ul>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 border-y border-dashed border-border/60 py-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      CERTIFIED QUALITY
                    </p>
                    <p className="text-xs text-muted-foreground">
                      OEKO-TEX® and locally tested for long-term use.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-xs font-semibold tracking-[0.16em] text-muted-foreground">
                    CARE INSTRUCTIONS
                  </h3>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Machine wash cold with similar colors. Use mild detergent only. Avoid bleach and
                  fabric softeners. Tumble dry low or line dry in shade. Iron on low heat if needed.
                </p>
              </div>
            </div>

            <div className="pt-2 text-center">
              <Link
                href={productUrl as never}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                View Full Details
              </Link>
            </div>
          </div>
        </ScrollArea>
      </div>
    </Modal>
  );
};

export default HotDealsQuickViewModal;
