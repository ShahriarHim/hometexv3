"use client";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MediaGallery } from "@/components/products/MediaGallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { trackEvent } from "@/lib/analytics";
import { api, type APIProduct } from "@/lib/api";
import {
  AlertTriangle,
  Award,
  Check,
  ChevronRight,
  Heart,
  Loader2,
  MapPin,
  Package,
  Shield,
  ShoppingCart,
  Star,
  Tag,
  TrendingUp,
  Truck,
} from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ProductDetailNew = () => {
  const params = useParams<{ id?: string }>();
  const id = params?.id;
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

  const [product, setProduct] = useState<APIProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [showTaxIncluded, setShowTaxIncluded] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await api.products.getById(id);

        if (response.success === false || !response.data) {
          setError(response.message || "Failed to load product");
          return;
        }

        const productData = response.data;
        setProduct(productData);

        // Track product view
        trackEvent({
          event: "product_view",
          product_id: productData.id.toString(),
          sku: productData.sku,
          name: productData.name,
          price: productData.pricing.final_price,
          currency: productData.pricing.currency,
        });

        // Fetch related products if IDs are available
        if (productData.related_products?.similar_products?.length > 0) {
          // In a real app, you'd fetch these by IDs
          // For now, we'll just use the demo data
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to load product";
        setError(
          errorMessage.includes("500")
            ? "The server is temporarily unavailable. Please try again later."
            : "Failed to load product. Please check your connection."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <Shield className="h-10 w-10 text-destructive" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
              <p className="text-muted-foreground mb-4">{error}</p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => window.location.reload()}>Try Again</Button>
              <Button variant="outline" asChild>
                <Link href="/shop">Back to Shop</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get current variant or use product defaults
  const currentVariant =
    selectedVariant !== null ? product.variations.find((v) => v.id === selectedVariant) : null;

  const currentPrice = currentVariant?.pricing.final_price ?? product.pricing.final_price;
  const currentRegularPrice =
    currentVariant?.pricing.regular_price ?? product.pricing.regular_price;
  const currentSalePrice = currentVariant?.pricing.sale_price ?? product.pricing.sale_price;
  const currentStock = currentVariant?.inventory.stock_quantity ?? product.inventory.stock_quantity;
  const currentStockStatus =
    currentVariant?.inventory.stock_status ?? product.inventory.stock_status;
  const currentSku = currentVariant?.sku ?? product.sku;

  // Calculate price with/without tax
  const taxAmount = product.pricing.tax.included
    ? 0
    : (currentPrice * product.pricing.tax.rate) / 100;
  const priceWithTax = currentPrice + taxAmount;
  const displayPrice = showTaxIncluded ? priceWithTax : currentPrice;

  // Check if discount is active
  const isDiscountActive = product.pricing.discount.is_active;
  const discountValue = product.pricing.discount.value;

  // Stock availability
  const isInStock = currentStockStatus === "in_stock" && currentStock > 0;
  const isLowStock =
    product.inventory.is_low_stock || currentStock <= product.inventory.low_stock_threshold;

  // Extract unique attribute keys from variations
  const attributeKeys = Array.from(
    new Set(product.variations.flatMap((v) => Object.keys(v.attributes || {})))
  );

  // Get available values for each attribute
  const getAvailableAttributeValues = (attrKey: string): string[] => {
    return Array.from(
      new Set(
        product.variations
          .map((v) => v.attributes[attrKey])
          .filter((value): value is string => value !== undefined)
      )
    );
  };

  // Check if a specific combination is available
  const isAttributeCombinationAvailable = (attrKey: string, value: string) => {
    const testAttributes = { ...selectedAttributes, [attrKey]: value };
    return product.variations.some((v) => {
      const match = Object.entries(testAttributes).every(([k, val]) => v.attributes[k] === val);
      return match && v.inventory.stock_status === "in_stock" && v.inventory.stock_quantity > 0;
    });
  };

  // Handle attribute selection
  const handleAttributeSelect = (attrKey: string, value: string) => {
    const newAttributes = { ...selectedAttributes, [attrKey]: value };
    setSelectedAttributes(newAttributes);

    // Find matching variant
    const matchingVariant = product.variations.find((v) =>
      Object.entries(newAttributes).every(([k, val]) => v.attributes[k] === val)
    );

    if (matchingVariant) {
      setSelectedVariant(matchingVariant.id);
      trackEvent({
        event: "variant_select",
        product_id: product.id.toString(),
        variant_id: matchingVariant.id,
        attributes: newAttributes,
      });
    }
  };

  // Handle quantity change with bulk pricing
  const handleQuantityChange = (newQuantity: number) => {
    const min = product.minimum_order_quantity;
    const max = product.maximum_order_quantity;

    if (newQuantity < min) {
      toast.error(`Minimum order quantity is ${min}`);
      trackEvent({
        event: "quantity_error",
        product_id: product.id.toString(),
        message: `Below minimum: ${min}`,
      });
      return;
    }

    if (newQuantity > max) {
      toast.error(`Maximum order quantity is ${max}`);
      trackEvent({
        event: "quantity_error",
        product_id: product.id.toString(),
        message: `Above maximum: ${max}`,
      });
      return;
    }

    if (newQuantity > currentStock) {
      toast.error(`Only ${currentStock} items available`);
      trackEvent({
        event: "stock_error",
        product_id: product.id.toString(),
        message: `Insufficient stock: ${currentStock}`,
      });
      return;
    }

    setQuantity(newQuantity);
  };

  // Get bulk pricing for current quantity
  const getBulkPrice = () => {
    const tier = product.bulk_pricing.find(
      (bp) => quantity >= bp.min_quantity && (!bp.max_quantity || quantity <= bp.max_quantity)
    );
    return tier;
  };

  const bulkTier = getBulkPrice();
  const effectivePrice = bulkTier?.price ?? currentPrice;

  // Handle add to cart
  const handleAddToCart = () => {
    if (!isInStock) {
      toast.error("Product is out of stock");
      return;
    }

    if (product.has_variations && !selectedVariant) {
      toast.error("Please select product options");
      return;
    }

    // Use transformed product for cart
    const cartProduct = {
      id: product.id.toString(),
      name: product.name,
      slug: product.slug,
      price: effectivePrice,
      originalPrice: currentRegularPrice,
      description: product.description,
      category: product.category.slug,
      subcategory: product.sub_category?.slug,
      images: product.media.gallery?.map((g: any) => g.url || g) || [product.brand.logo],
      inStock: isInStock,
      rating: product.reviews.average_rating,
      reviewCount: product.reviews.review_count,
      material: product.brand.name,
      isFeatured: product.badges.is_featured,
      isNew: product.badges.is_new,
    };

    addToCart(cartProduct as any, quantity, selectedAttributes.Color, selectedAttributes.Size);

    trackEvent({
      event: "add_to_cart",
      product_id: product.id.toString(),
      variant_id: selectedVariant || undefined,
      sku: currentSku,
      price: effectivePrice,
      quantity,
    });
  };

  // Handle wishlist toggle
  const inWishlist = isInWishlist(product.id.toString());
  const handleWishlistToggle = () => {
    const cartProduct = {
      id: product.id.toString(),
      name: product.name,
      slug: product.slug,
      price: currentPrice,
      originalPrice: currentRegularPrice,
      description: product.description,
      category: product.category.slug,
      images: product.media.gallery?.map((g: any) => g.url || g) || [product.brand.logo],
      inStock: isInStock,
      rating: product.reviews.average_rating,
      reviewCount: product.reviews.review_count,
    };

    if (inWishlist) {
      removeFromWishlist(product.id.toString());
    } else {
      addToWishlist(cartProduct as any);
      trackEvent({ event: "add_to_wishlist", product_id: product.id.toString() });
    }
  };

  // Handle buy now
  const handleBuyNow = () => {
    handleAddToCart();
    trackEvent({
      event: "begin_checkout",
      product_id: product.id.toString(),
      variant_id: selectedVariant || undefined,
      price: effectivePrice,
      quantity,
    });
    // Redirect to checkout
    window.location.href = "/checkout";
  };

  // Generate JSON-LD schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description.replace(/<[^>]*>/g, ""),
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand.name,
      logo: product.brand.logo,
    },
    offers: product.variations.map((v) => ({
      "@type": "Offer",
      price: v.pricing.final_price,
      priceCurrency: product.pricing.currency,
      availability:
        v.inventory.stock_status === "in_stock"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${typeof window !== "undefined" ? window.location.origin : ""}/product/${product.id}`,
      sku: v.sku,
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.reviews.average_rating,
      reviewCount: product.reviews.review_count,
    },
    image: product.media.gallery?.map((g: any) => g.url || g) || [product.seo.og_image],
  };

  return (
    <>
      <Head>
        <title>{product.seo.meta_title || product.name}</title>
        <meta name="description" content={product.seo.meta_description} />
        <meta name="keywords" content={product.seo.meta_keywords.join(", ")} />
        {product.seo.canonical_url && <link rel="canonical" href={product.seo.canonical_url} />}

        {/* OpenGraph */}
        <meta property="og:title" content={product.seo.og_title} />
        <meta property="og:description" content={product.seo.og_description} />
        <meta property="og:image" content={product.seo.og_image} />
        <meta property="og:type" content="product" />

        {/* Twitter Card */}
        <meta name="twitter:card" content={product.seo.twitter_card} />
        <meta name="twitter:title" content={product.seo.og_title} />
        <meta name="twitter:description" content={product.seo.og_description} />
        <meta name="twitter:image" content={product.seo.og_image} />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <nav
            className="flex items-center space-x-2 text-sm text-muted-foreground mb-6"
            aria-label="Breadcrumb"
          >
            <Link href={"/" as any} className="hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            {product.breadcrumb.map((crumb, idx) => (
              <div key={`${crumb.slug}-${idx}`} className="flex items-center space-x-2">
                <Link href={`/categories/${crumb.slug}` as any} className="hover:text-foreground">
                  {crumb.name}
                </Link>
                {idx < product.breadcrumb.length - 1 && <ChevronRight className="h-4 w-4" />}
              </div>
            ))}
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{product.name}</span>
          </nav>

          {/* <Button variant="ghost" asChild className="mb-6">
            <Link href="/shop">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Link>
          </Button> */}

          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            {/* Media Gallery */}
            <div>
              <MediaGallery
                images={product.media.gallery?.map((g: any) => g.url || g) || [product.brand.logo]}
                videos={product.media.videos}
                productId={product.id.toString()}
                productName={product.name}
              />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {product.badges.is_featured && <Badge variant="default">Featured</Badge>}
                  {product.badges.is_new && <Badge className="bg-green-500">New</Badge>}
                  {product.badges.is_trending && (
                    <Badge className="bg-orange-500">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                  {product.badges.is_bestseller && (
                    <Badge className="bg-yellow-500">Bestseller</Badge>
                  )}
                  {product.badges.is_on_sale && <Badge variant="destructive">On Sale</Badge>}
                  {product.status === "active" && isInStock ? (
                    <Badge variant="outline" className="bg-green-50">
                      <Check className="w-3 h-3 mr-1" />
                      In Stock
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                  {isLowStock && isInStock && (
                    <Badge variant="outline" className="bg-orange-50 text-orange-700">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Low Stock
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-sm text-muted-foreground mb-4">SKU: {currentSku}</p>

                {/* Brand */}
                {product.brand && (
                  <Link
                    href={`/brand/${product.brand.slug}` as any}
                    className="inline-flex items-center gap-2 mb-4 hover:opacity-80"
                  >
                    {product.brand.logo && (
                      <img
                        src={product.brand.logo}
                        alt={product.brand.name}
                        className="h-8 object-contain"
                      />
                    )}
                    <span className="text-sm font-medium">{product.brand.name}</span>
                  </Link>
                )}

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= Math.round(product.reviews.average_rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm">
                    {product.reviews.average_rating.toFixed(1)} ({product.reviews.review_count}{" "}
                    reviews)
                  </span>
                  <span className="text-sm text-muted-foreground">
                    • {product.reviews.verified_purchase_percentage.toFixed(0)}% verified
                  </span>
                </div>
              </div>

              <Separator />

              {/* Pricing */}
              <div className="space-y-3">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-4xl font-bold text-primary">
                    {product.pricing.currency_symbol}
                    {displayPrice.toLocaleString()}
                  </span>
                  {(currentSalePrice || currentRegularPrice > currentPrice) && (
                    <span className="text-2xl text-muted-foreground line-through">
                      {product.pricing.currency_symbol}
                      {currentRegularPrice.toLocaleString()}
                    </span>
                  )}
                  {isDiscountActive && discountValue > 0 && (
                    <Badge variant="destructive" className="text-lg px-3 py-1">
                      {discountValue}% OFF
                    </Badge>
                  )}
                </div>

                {/* Tax toggle */}
                <div className="flex items-center gap-2 text-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTaxIncluded(!showTaxIncluded)}
                    className="h-auto p-0 text-muted-foreground hover:text-foreground"
                  >
                    {showTaxIncluded ? "Incl." : "Excl."} {product.pricing.tax.rate}% tax
                    {!product.pricing.tax.included &&
                      ` (+${product.pricing.currency_symbol}${taxAmount.toFixed(2)})`}
                  </Button>
                </div>

                {/* Bulk pricing */}
                {product.bulk_pricing.length > 0 && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2 mb-2">
                        <Tag className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-blue-900">
                            Bulk Pricing Available
                          </p>
                          <div className="mt-2 space-y-1">
                            {product.bulk_pricing.map((tier, idx) => (
                              <div key={idx} className="text-xs text-blue-700">
                                Buy {tier.min_quantity}
                                {tier.max_quantity && `-${tier.max_quantity}`}:{" "}
                                {product.pricing.currency_symbol}
                                {tier.price} each
                                {tier.discount_percentage &&
                                  ` (${tier.discount_percentage.toFixed(1)}% off)`}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <Separator />

              {/* Description */}
              <div>
                <p
                  className="text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>

              {/* Variant Selection */}
              {product.has_variations && attributeKeys.length > 0 && (
                <div className="space-y-4">
                  {attributeKeys.map((attrKey) => (
                    <div key={attrKey}>
                      <p className="text-sm font-medium mb-2">{attrKey}</p>
                      <div className="flex flex-wrap gap-2">
                        {getAvailableAttributeValues(attrKey).map((value) => {
                          const isAvailable = isAttributeCombinationAvailable(attrKey, value);
                          const isSelected = selectedAttributes[attrKey] === value;

                          return (
                            <Button
                              key={value}
                              variant={isSelected ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleAttributeSelect(attrKey, value)}
                              disabled={!isAvailable}
                              className="min-w-[60px]"
                            >
                              {value}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity */}
              <div>
                <p className="text-sm font-medium mb-2">
                  Quantity (Min: {product.minimum_order_quantity}, Max:{" "}
                  {product.maximum_order_quantity})
                </p>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= product.minimum_order_quantity}
                  >
                    -
                  </Button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-20 text-center border rounded px-2 py-2"
                    min={product.minimum_order_quantity}
                    max={Math.min(product.maximum_order_quantity, currentStock)}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= Math.min(product.maximum_order_quantity, currentStock)}
                  >
                    +
                  </Button>
                  <span className="text-sm text-muted-foreground">{currentStock} available</span>
                </div>
                {bulkTier && bulkTier.discount_percentage && (
                  <p className="text-sm text-green-600 mt-2">
                    You save {bulkTier.discount_percentage.toFixed(1)}% at this quantity!
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="flex-1"
                  disabled={!isInStock || product.status !== "active"}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  size="lg"
                  variant="secondary"
                  className="flex-1"
                  disabled={!isInStock || product.status !== "active"}
                >
                  Buy Now
                </Button>
                <Button
                  onClick={handleWishlistToggle}
                  variant={inWishlist ? "default" : "outline"}
                  size="lg"
                >
                  <Heart className={`h-5 w-5 ${inWishlist ? "fill-current" : ""}`} />
                </Button>
              </div>

              {/* Stock Locations */}
              {product.inventory.stock_by_location &&
                product.inventory.stock_by_location.length > 0 && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="h-4 w-4" />
                        <p className="text-sm font-medium">Available at Locations</p>
                      </div>
                      <div className="space-y-2">
                        {product.inventory.stock_by_location.map((loc) => (
                          <div key={loc.shop_id} className="flex justify-between text-sm">
                            <span>{loc.shop_name}</span>
                            <span className="font-medium">
                              {loc.quantity} in stock
                              {loc.reserved > 0 && ` (${loc.reserved} reserved)`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

              {/* Shipping Info */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Delivery</p>
                      <p className="text-xs text-muted-foreground">
                        {product.shipping.estimated_delivery.min_days}-
                        {product.shipping.estimated_delivery.max_days} days
                        {product.shipping.estimated_delivery.express_available &&
                          " • Express available"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {product.shipping.free_shipping ? "Free Shipping" : "Standard Shipping"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Ships from {product.shipping.ships_from.city},{" "}
                        {product.shipping.ships_from.country}
                      </p>
                    </div>
                  </div>
                  {product.return_policy.returnable && (
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {product.return_policy.return_window_days} Days Return
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.return_policy.conditions}
                        </p>
                      </div>
                    </div>
                  )}
                  {product.warranty.has_warranty && (
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Warranty</p>
                        <p className="text-xs text-muted-foreground">
                          {product.warranty.duration} {product.warranty.duration_unit}{" "}
                          {product.warranty.type} warranty
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Sold count */}
              {product.inventory.sold_count > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>{product.inventory.sold_count} units sold</span>
                </div>
              )}
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="details" className="mb-12">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviews.review_count})</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />

                  {product.short_description && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Summary</h4>
                      <p className="text-muted-foreground">{product.short_description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specs" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Specifications</h3>

                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4 pb-3 border-b">
                      <span className="font-medium">Brand</span>
                      <span>{product.brand.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pb-3 border-b">
                      <span className="font-medium">Manufacturer</span>
                      <span>{product.manufacturer.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pb-3 border-b">
                      <span className="font-medium">Country of Origin</span>
                      <span>{product.country_of_origin.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pb-3 border-b">
                      <span className="font-medium">Weight</span>
                      <span>
                        {product.shipping.weight} {product.shipping.weight_unit}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pb-3 border-b">
                      <span className="font-medium">Dimensions</span>
                      <span>
                        {product.shipping.dimensions.length} × {product.shipping.dimensions.width} ×{" "}
                        {product.shipping.dimensions.height} {product.shipping.dimensions.unit}
                      </span>
                    </div>
                    {product.specifications &&
                      product.specifications.length > 0 &&
                      product.specifications.map((spec: any, idx: number) => (
                        <div key={idx} className="grid grid-cols-2 gap-4 pb-3 border-b">
                          <span className="font-medium">{spec.name || spec.key}</span>
                          <span>{spec.value}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold mb-2">
                        {product.reviews.average_rating.toFixed(1)}
                      </div>
                      <div className="flex justify-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= Math.round(product.reviews.average_rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Based on {product.reviews.review_count} reviews
                      </p>
                    </div>

                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count =
                          product.reviews.rating_distribution[
                            `${rating}_star` as keyof typeof product.reviews.rating_distribution
                          ];
                        const percentage = (count / product.reviews.review_count) * 100;

                        return (
                          <div key={rating} className="flex items-center gap-2">
                            <span className="text-sm w-8">{rating}★</span>
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-400"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-12 text-right">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-4 text-sm text-muted-foreground mb-6">
                    <div>
                      <Check className="inline h-4 w-4 text-green-600 mr-1" />
                      {product.reviews.verified_purchase_percentage.toFixed(0)}% verified purchases
                    </div>
                    <div>
                      👍 {product.reviews.recommendation_percentage.toFixed(0)}% would recommend
                    </div>
                  </div>

                  <p className="text-center text-muted-foreground">
                    Detailed reviews will be displayed here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shipping" className="space-y-4">
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
                    <div className="space-y-3 text-sm">
                      <p>
                        <strong>Delivery Time:</strong>{" "}
                        {product.shipping.estimated_delivery.min_days}-
                        {product.shipping.estimated_delivery.max_days} business days
                      </p>
                      <p>
                        <strong>Ships From:</strong> {product.shipping.ships_from.city},{" "}
                        {product.shipping.ships_from.country}
                      </p>
                      <p>
                        <strong>Shipping Class:</strong> {product.shipping.shipping_class}
                      </p>
                      {product.shipping.free_shipping && (
                        <p className="text-green-600 font-medium">✓ Free Shipping Available</p>
                      )}
                      {product.shipping.estimated_delivery.express_available && (
                        <p className="text-blue-600">
                          Express shipping available for faster delivery
                        </p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Return Policy</h3>
                    <div className="space-y-3 text-sm">
                      {product.return_policy.returnable ? (
                        <>
                          <p>
                            <strong>Return Window:</strong>{" "}
                            {product.return_policy.return_window_days} days from delivery
                          </p>
                          <p>
                            <strong>Conditions:</strong> {product.return_policy.conditions}
                          </p>
                        </>
                      ) : (
                        <p>This product is not eligible for returns.</p>
                      )}
                    </div>
                  </div>

                  {product.warranty.has_warranty && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Warranty</h3>
                        <div className="space-y-2 text-sm">
                          <p>
                            <strong>Duration:</strong> {product.warranty.duration}{" "}
                            {product.warranty.duration_unit}
                          </p>
                          <p>
                            <strong>Type:</strong> {product.warranty.type}
                          </p>
                          <p>{product.warranty.details}</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Related Products */}
          {product.related_products && (
            <div className="space-y-8">
              {product.related_products.frequently_bought_together &&
                product.related_products.frequently_bought_together.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Frequently Bought Together</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      Product IDs: {product.related_products.frequently_bought_together.join(", ")}
                    </p>
                  </div>
                )}

              {product.related_products.similar_products &&
                product.related_products.similar_products.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      Product IDs: {product.related_products.similar_products.join(", ")}
                    </p>
                  </div>
                )}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ProductDetailNew;
