"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRecentViews } from "@/hooks/use-recent-views";
import type { Product } from "@/types";
import { Flame, Heart, Leaf, ShoppingCart, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Helper function to get active badges in priority order (max 2)
const getActiveBadges = (badges?: Product["badges"]) => {
  if (!badges) return [];
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
}

/**
 * Determines which card variant to show based on priority rules:
 * 1. Featured > Out of Stock > Price Rule > Even/Odd Rule
 * 2. If product.isFeatured === true → force Concave Card
 * 3. If product.stock === 0 → force Standard Card
 * 4. If product.price > 5000 → force Concave Card
 * 5. Otherwise: product.id % 2 === 0 → Concave Card, else Standard Card
 */
const getCardType = (product: Product): "concave" | "standard" => {
  // Priority 1: Featured products → Concave Card
  if (product.isFeatured === true) {
    return "concave";
  }

  // Priority 2: Out of stock → Standard Card
  if (product.stock === 0) {
    return "standard";
  }

  // Priority 3: Price > 5000 → Concave Card
  if (product.price > 5000) {
    return "concave";
  }

  // Priority 4: Even/Odd rule based on product ID
  const productIdNum = parseInt(product.id, 10) || 0;
  return productIdNum % 2 === 0 ? "concave" : "standard";
};

// Standard Card Component (Component B)
const StandardCard = ({
  product,
  viewMode,
  handlers,
}: {
  product: Product;
  viewMode: "grid-5" | "grid-3" | "list";
  handlers: {
    addToCart: () => void;
    wishlistToggle: () => void;
    productClick: () => void;
    inWishlist: boolean;
    imageLoaded: boolean;
    setImageLoaded: (loaded: boolean) => void;
  };
}) => {
  const productUrl = `/products/${product.category}/${product.childSubcategory || product.subcategory || "all"}/${product.id}`;

  if (viewMode === "list") {
    return (
      <div className="group relative bg-card rounded-lg border border-border hover:shadow-lg transition-shadow p-4">
        <div className="flex gap-6">
          <Link
            href={productUrl as never}
            onClick={handlers.productClick}
            className="relative w-48 h-48 flex-shrink-0 overflow-hidden bg-muted rounded-lg"
          >
            <img
              src={product.primary_photo || product.images[0] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
              {product.discount && (
                <Badge className="bg-destructive text-destructive-foreground text-xs">
                  -{product.discount}%
                </Badge>
              )}
              {product.badges?.is_on_sale && (
                <Badge variant="destructive" className="animate-pulse text-xs">
                  <Flame className="w-3 h-3 mr-1" />
                  Sale
                </Badge>
              )}
            </div>
            {(() => {
              const activeBadges = getActiveBadges(product.badges);
              const hasLegacyNew = !product.badges?.is_new && product.isNew;

              return (
                <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
                  {activeBadges.map((badge) => (
                    <Badge key={badge.key} className={`${badge.className} whitespace-nowrap`}>
                      {badge.icon}
                      {badge.label}
                    </Badge>
                  ))}
                  {hasLegacyNew && activeBadges.length < 2 && (
                    <Badge className="bg-primary text-xs whitespace-nowrap">New</Badge>
                  )}
                </div>
              );
            })()}
          </Link>

          <div className="flex-1 flex flex-col">
            <Link href={productUrl as never} onClick={handlers.productClick}>
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
                <Button size="sm" onClick={handlers.addToCart}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  size="icon"
                  variant={handlers.inWishlist ? "default" : "outline"}
                  onClick={handlers.wishlistToggle}
                >
                  <Heart className={`h-4 w-4 ${handlers.inWishlist ? "fill-current" : ""}`} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <Link href={productUrl as never} onClick={handlers.productClick}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.primary_photo || product.images[0] || "/placeholder.svg"}
            alt={product.name}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
              handlers.imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => handlers.setImageLoaded(true)}
          />
          {!handlers.imageLoaded && <div className="absolute inset-0 bg-muted animate-pulse" />}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {product.discount && (
              <Badge className="bg-destructive text-destructive-foreground text-xs">
                {product.discount}% OFF
              </Badge>
            )}
            {product.badges?.is_on_sale && (
              <Badge variant="destructive" className="animate-pulse text-xs">
                <Flame className="w-3 h-3 mr-1" />
                Sale
              </Badge>
            )}
          </div>
          {(() => {
            const activeBadges = getActiveBadges(product.badges);
            const hasLegacyNew = !product.badges?.is_new && product.isNew;

            return (
              <div className="absolute top-2 right-2 z-20 flex flex-col gap-1">
                {activeBadges.map((badge) => (
                  <Badge key={badge.key} className={`${badge.className} whitespace-nowrap`}>
                    {badge.icon}
                    {badge.label}
                  </Badge>
                ))}
                {hasLegacyNew && activeBadges.length < 2 && (
                  <Badge className="bg-sage text-white text-xs whitespace-nowrap">New</Badge>
                )}
              </div>
            );
          })()}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={productUrl as never} onClick={handlers.productClick}>
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
        <Button onClick={handlers.addToCart} className="flex-1" size="sm">
          <ShoppingCart className="h-4 w-4 mr-1" />
          Add to Cart
        </Button>
        <Button
          onClick={handlers.wishlistToggle}
          variant={handlers.inWishlist ? "default" : "outline"}
          size="icon"
          className="shrink-0"
        >
          <Heart className={`h-4 w-4 ${handlers.inWishlist ? "fill-current" : ""}`} />
        </Button>
      </CardFooter>
    </Card>
  );
};

// Concave Card Component (Component A)
const ConcaveCard = ({
  product,
  viewMode,
  handlers,
}: {
  product: Product;
  viewMode: "grid-5" | "grid-3" | "list";
  handlers: {
    addToCart: () => void;
    wishlistToggle: () => void;
    productClick: () => void;
    inWishlist: boolean;
    imageLoaded: boolean;
    setImageLoaded: (loaded: boolean) => void;
  };
}) => {
  const productUrl = `/products/${product.category}/${product.childSubcategory || product.subcategory || "all"}/${product.id}`;

  if (viewMode === "list") {
    return (
      <div className="group relative bg-card rounded-lg border border-border hover:shadow-lg transition-shadow p-4">
        <div className="flex gap-6">
          <Link
            href={productUrl as never}
            onClick={handlers.productClick}
            className="relative w-48 h-48 flex-shrink-0 overflow-hidden bg-muted rounded-lg"
          >
            <img
              src={product.primary_photo || product.images[0] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
              {product.discount && (
                <Badge className="bg-destructive text-destructive-foreground text-xs">
                  -{product.discount}%
                </Badge>
              )}
              {product.badges?.is_on_sale && (
                <Badge variant="destructive" className="animate-pulse text-xs">
                  <Flame className="w-3 h-3 mr-1" />
                  Sale
                </Badge>
              )}
            </div>
            {(() => {
              const activeBadges = getActiveBadges(product.badges);
              const hasLegacyNew = !product.badges?.is_new && product.isNew;

              return (
                <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
                  {activeBadges.map((badge) => (
                    <Badge key={badge.key} className={`${badge.className} whitespace-nowrap`}>
                      {badge.icon}
                      {badge.label}
                    </Badge>
                  ))}
                  {hasLegacyNew && activeBadges.length < 2 && (
                    <Badge className="bg-primary text-xs whitespace-nowrap">New</Badge>
                  )}
                </div>
              );
            })()}
          </Link>

          <div className="flex-1 flex flex-col">
            <Link href={productUrl as never} onClick={handlers.productClick}>
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
                <Button size="sm" onClick={handlers.addToCart}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  size="icon"
                  variant={handlers.inWishlist ? "default" : "outline"}
                  onClick={handlers.wishlistToggle}
                >
                  <Heart className={`h-4 w-4 ${handlers.inWishlist ? "fill-current" : ""}`} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-primary/20 shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] bg-gradient-to-br from-card to-card/95">
      <Link href={productUrl as never} onClick={handlers.productClick}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.primary_photo || product.images[0] || "/placeholder.svg"}
            alt={product.name}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
              handlers.imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => handlers.setImageLoaded(true)}
          />
          {!handlers.imageLoaded && <div className="absolute inset-0 bg-muted animate-pulse" />}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {product.discount && (
              <Badge className="bg-destructive text-destructive-foreground text-xs">
                {product.discount}% OFF
              </Badge>
            )}
            {product.badges?.is_on_sale && (
              <Badge variant="destructive" className="animate-pulse text-xs">
                <Flame className="w-3 h-3 mr-1" />
                Sale
              </Badge>
            )}
          </div>
          {(() => {
            const activeBadges = getActiveBadges(product.badges);
            const hasLegacyNew = !product.badges?.is_new && product.isNew;

            return (
              <div className="absolute top-2 right-2 z-20 flex flex-col gap-1">
                {activeBadges.map((badge) => (
                  <Badge key={badge.key} className={`${badge.className} whitespace-nowrap`}>
                    {badge.icon}
                    {badge.label}
                  </Badge>
                ))}
                {hasLegacyNew && activeBadges.length < 2 && (
                  <Badge className="bg-sage text-white text-xs whitespace-nowrap">New</Badge>
                )}
              </div>
            );
          })()}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={productUrl as never} onClick={handlers.productClick}>
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
        <Button onClick={handlers.addToCart} className="flex-1" size="sm">
          <ShoppingCart className="h-4 w-4 mr-1" />
          Add to Cart
        </Button>
        <Button
          onClick={handlers.wishlistToggle}
          variant={handlers.inWishlist ? "default" : "outline"}
          size="icon"
          className="shrink-0"
        >
          <Heart className={`h-4 w-4 ${handlers.inWishlist ? "fill-current" : ""}`} />
        </Button>
      </CardFooter>
    </Card>
  );
};

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

  const cardType = getCardType(product);

  const handlers = {
    addToCart: handleAddToCart,
    wishlistToggle: handleWishlistToggle,
    productClick: handleProductClick,
    inWishlist,
    imageLoaded,
    setImageLoaded,
  };

  if (cardType === "concave") {
    return <ConcaveCard product={product} viewMode={viewMode} handlers={handlers} />;
  }

  return <StandardCard product={product} viewMode={viewMode} handlers={handlers} />;
};
