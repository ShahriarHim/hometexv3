"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRecentViews } from "@/hooks/use-recent-views";
import { generateProductUrl } from "@/lib/product-url";
import type { Product } from "@/types";
import { Heart, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid-5" | "grid-3" | "list";
}

export const ProductCard = ({ product, viewMode = "grid-3" }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const { addRecentView } = useRecentViews();
  const [imageLoaded, setImageLoaded] = useState(false);

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleProductClick = () => {
    addRecentView(product);
  };

  if (viewMode === "list") {
    const productUrl = generateProductUrl({
      category: product.category,
      subcategory: product.subcategory,
      childSubcategory: product.childSubcategory,
      productId: product.id,
    });
    return (
      <div className="group relative bg-card rounded-lg border border-border hover:shadow-lg transition-shadow p-4">
        <div className="flex gap-6">
          <Link
            href={productUrl as any}
            onClick={handleProductClick}
            className="relative w-48 h-48 flex-shrink-0 overflow-hidden bg-muted rounded-lg"
          >
            <img
              src={product.primary_photo || product.images[0] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {product.isNew && <Badge className="absolute top-2 left-2 bg-primary">New</Badge>}
            {product.discount && (
              <Badge className="absolute top-2 right-2 bg-destructive">-{product.discount}%</Badge>
            )}
          </Link>

          <div className="flex-1 flex flex-col">
            <Link href={productUrl as any} onClick={handleProductClick}>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
            </div>

            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">
                  ৳{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ৳{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddToCart}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  size="icon"
                  variant={inWishlist ? "default" : "outline"}
                  onClick={handleWishlistToggle}
                >
                  <Heart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const productUrl = generateProductUrl({
    category: product.category,
    subcategory: product.subcategory,
    childSubcategory: product.childSubcategory,
    productId: product.id,
  });

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <Link href={productUrl as any} onClick={handleProductClick}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.primary_photo || product.images[0] || "/placeholder.svg"}
            alt={product.name}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && <div className="absolute inset-0 bg-muted animate-pulse" />}
          {product.discount && (
            <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
              {product.discount}% OFF
            </Badge>
          )}
          {product.isNew && (
            <Badge className="absolute top-2 right-2 bg-sage text-white">New</Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={productUrl as any} onClick={handleProductClick}>
          <h3 className="font-medium text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center space-x-1 mb-2">
          <Star className="h-4 w-4 fill-primary text-primary" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-foreground">
            ৳{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ৳{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex space-x-2">
        <Button onClick={handleAddToCart} className="flex-1" size="sm">
          <ShoppingCart className="h-4 w-4 mr-1" />
          Add to Cart
        </Button>
        <Button
          onClick={handleWishlistToggle}
          variant={inWishlist ? "default" : "outline"}
          size="icon"
          className="shrink-0"
        >
          <Heart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
        </Button>
      </CardFooter>
    </Card>
  );
};
