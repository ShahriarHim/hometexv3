"use client";

import Link from "next/link";
import Head from "next/head";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/products/ProductCard";
import { MediaGallery } from "@/components/products/MediaGallery";
import PriceDropNotification from "@/components/products/PriceDropNotification";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { 
  ShoppingCart, Heart, Star, Truck, Shield, Package, 
  ArrowLeft, Loader2, MapPin, Clock, Award, Check,
  ChevronRight, AlertTriangle, Info, Tag, TrendingUp, X, ChevronLeft, ChevronDown
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api, type APIProduct } from "@/lib/api";
import { trackEvent } from "@/lib/analytics";
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
  const [similarProducts, setSimilarProducts] = useState<any[]>([]); // Using any[] since API returns different structure
  const [similarProductsLoading, setSimilarProductsLoading] = useState(false);
  const [showBulkPricingModal, setShowBulkPricingModal] = useState(false);
  const [selectedBulkPrice, setSelectedBulkPrice] = useState<number | null>(null);
  const [showStickySidebar, setShowStickySidebar] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const addToCartSectionRef = useRef<HTMLDivElement>(null);

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

        // Initialize quantity to minimum order quantity
        if (productData.minimum_order_quantity) {
          setQuantity(productData.minimum_order_quantity);
        }

        // Track product view
        trackEvent({
          event: "product_view",
          product_id: productData.id.toString(),
          sku: productData.sku,
          name: productData.name,
          price: productData.pricing.final_price,
          currency: productData.pricing.currency
        });

        // Fetch similar products
        fetchSimilarProducts(productData.id.toString());
      } catch (err) {
        console.error("Error fetching product:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to load product";
        setError(errorMessage.includes("500") 
          ? "The server is temporarily unavailable. Please try again later." 
          : "Failed to load product. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch similar products
  const fetchSimilarProducts = async (productId: string) => {
    try {
      setSimilarProductsLoading(true);
      const response = await api.products.getSimilar(productId);
      
      if (response.success && response.data?.products) {
        setSimilarProducts(response.data.products);
      }
    } catch (err) {
      console.error("Error fetching similar products:", err);
    } finally {
      setSimilarProductsLoading(false);
    }
  };

  // Scroll detection for compact sticky sidebar - only shows after scrolling past Add to Cart
  useEffect(() => {
    if (!product || !addToCartSectionRef.current) {
      setShowStickySidebar(false);
      return;
    }

    const handleScroll = () => {
      const section = addToCartSectionRef.current;
      if (!section) {
        setShowStickySidebar(false);
        return;
      }

      const rect = section.getBoundingClientRect();
      // Only show when section has completely scrolled past the top of viewport
      const isScrolledPast = rect.bottom < 0;
      
      // Don't auto-show if user manually minimized it
      if (isScrolledPast && !isMinimized) {
        setShowStickySidebar(true);
      } else if (!isScrolledPast) {
        setShowStickySidebar(false);
        setIsMinimized(false); // Reset minimized state when section comes back into view
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [product, isMinimized]);

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
  const currentVariant = selectedVariant !== null 
    ? product.variations.find(v => v.id === selectedVariant)
    : null;

  const currentPrice = currentVariant?.pricing.final_price ?? product.pricing.final_price;
  const currentRegularPrice = currentVariant?.pricing.regular_price ?? product.pricing.regular_price;
  const currentSalePrice = currentVariant?.pricing.sale_price ?? product.pricing.sale_price;
  const currentStock = currentVariant?.inventory.stock_quantity ?? product.inventory.stock_quantity;
  const currentStockStatus = currentVariant?.inventory.stock_status ?? product.inventory.stock_status;
  const currentSku = currentVariant?.sku ?? product.sku;

  // Calculate effective price based on selected bulk price or current price
  const effectiveBasePrice = selectedBulkPrice !== null ? selectedBulkPrice : currentPrice;

  // Calculate price with/without tax
  const taxAmount = product.pricing.tax.included 
    ? 0 
    : (effectiveBasePrice * product.pricing.tax.rate) / 100;
  const priceWithTax = effectiveBasePrice + taxAmount;
  const displayPrice = showTaxIncluded ? priceWithTax : effectiveBasePrice;

  // Check if discount is active
  const isDiscountActive = product.pricing.discount.is_active;
  const discountValue = product.pricing.discount.value;

  // Stock availability
  const isInStock = currentStockStatus === "in_stock" && currentStock > 0;
  const isLowStock = product.inventory.is_low_stock || currentStock <= product.inventory.low_stock_threshold;

  // Get product image URL - matches MediaGallery pattern
  const productImages = product.media.gallery?.map((g: any) => g.url || g) || [];
  const productImageUrl = productImages.length > 0 
    ? productImages[0] 
    : (product.brand?.logo || '/placeholder.svg');

  // Extract unique attribute keys from variations
  const attributeKeys = product.has_variations && product.variations && product.variations.length > 0
    ? Array.from(
        new Set(
          product.variations.flatMap(v => Object.keys(v.attributes || {}))
        )
      )
    : [];

  // Get available values for each attribute (deduplicated)
  const getAvailableAttributeValues = (attrKey: string) => {
    if (!product.variations) return [];
    return Array.from(
      new Set(
        product.variations
          .filter(v => v.attributes && v.attributes[attrKey])
          .map(v => v.attributes[attrKey])
      )
    );
  };

  // Check if a specific combination is available
  const isAttributeCombinationAvailable = (attrKey: string, value: string) => {
    if (!product.variations) return false;
    const testAttributes = { ...selectedAttributes, [attrKey]: value };
    return product.variations.some(v => {
      const match = Object.entries(testAttributes).every(
        ([k, val]) => v.attributes && v.attributes[k] === val
      );
      return match && v.inventory.stock_status === "in_stock" && v.inventory.stock_quantity > 0;
    });
  };

  // Handle attribute selection
  const handleAttributeSelect = (attrKey: string, value: string) => {
    const newAttributes = { ...selectedAttributes, [attrKey]: value };
    setSelectedAttributes(newAttributes);

    // Find matching variant
    if (!product.variations) return;
    
    const matchingVariant = product.variations.find(v =>
      Object.entries(newAttributes).every(([k, val]) => v.attributes && v.attributes[k] === val)
    );

    if (matchingVariant) {
      setSelectedVariant(matchingVariant.id);
      trackEvent({
        event: "variant_select",
        product_id: product.id.toString(),
        variant_id: matchingVariant.id,
        attributes: newAttributes
      });
    }
  };

  // Calculate effective maximum quantity (handles null/undefined)
  const getEffectiveMaxQuantity = () => {
    const max = product.maximum_order_quantity;
    if (max !== null && max !== undefined) {
      return Math.min(max, currentStock);
    }
    return currentStock;
  };

  // Handle quantity change with bulk pricing
  const handleQuantityChange = (newQuantity: number) => {
    // Validate input
    if (isNaN(newQuantity) || newQuantity < 1) {
      return;
    }

    const min = product.minimum_order_quantity || 1;
    const effectiveMax = getEffectiveMaxQuantity();
    
    // Check minimum
    if (newQuantity < min) {
      toast.error(`Minimum order quantity is ${min}`);
      trackEvent({ event: "quantity_error", product_id: product.id.toString(), message: `Below minimum: ${min}` });
      return;
    }
    
    // Check maximum (effective max already considers stock and max order quantity)
    if (newQuantity > effectiveMax) {
      const max = product.maximum_order_quantity;
      // Check if it's a maximum quantity limit (only if max is set and is the limiting factor)
      if (max !== null && max !== undefined && max < currentStock && newQuantity > max) {
        toast.error(`Maximum order quantity is ${max}`);
        trackEvent({ event: "quantity_error", product_id: product.id.toString(), message: `Above maximum: ${max}` });
      } else {
        toast.error(`Only ${currentStock} items available`);
        trackEvent({ event: "stock_error", product_id: product.id.toString(), message: `Insufficient stock: ${currentStock}` });
      }
      return;
    }
    
    setQuantity(newQuantity);
  };

  // Get bulk pricing for current quantity
  const getBulkPrice = () => {
    const tier = product.bulk_pricing.find(
      bp => quantity >= bp.min_quantity && (!bp.max_quantity || quantity <= bp.max_quantity)
    );
    return tier;
  };

  const bulkTier = getBulkPrice();

  // Handle bulk pricing tier selection
  const handleBulkPricingSelect = (price: number) => {
    setSelectedBulkPrice(price);
    setShowBulkPricingModal(false);
    toast.success("Bulk price applied!");
  };

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
      price: effectiveBasePrice,
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
      price: effectiveBasePrice,
      quantity
    });

    toast.success("Added to cart");
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
      price: effectiveBasePrice,
      quantity
    });
    // Redirect to checkout
    window.location.href = "/checkout";
  };

  // Generate JSON-LD schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description.replace(/<[^>]*>/g, ''),
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand.name,
      logo: product.brand.logo
    },
    offers: product.variations.map(v => ({
      "@type": "Offer",
      price: v.pricing.final_price,
      priceCurrency: product.pricing.currency,
      availability: v.inventory.stock_status === "in_stock" 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      url: `${typeof window !== 'undefined' ? window.location.origin : ''}/product/${product.id}`,
      sku: v.sku
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.reviews.average_rating,
      reviewCount: product.reviews.review_count
    },
    image: product.media.gallery?.map((g: any) => g.url || g) || [product.seo.og_image]
  };

  return (
    <>
      <Head>
        <title>{product.seo.meta_title || product.name}</title>
        <meta name="description" content={product.seo.meta_description} />
        <meta name="keywords" content={product.seo.meta_keywords.join(', ')} />
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
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
            <Link href={"/" as const} className="hover:text-foreground">Home</Link>
            <ChevronRight className="h-4 w-4" />
            {product.breadcrumb.map((crumb, idx) => (
              <div key={`${crumb.slug}-${idx}`} className="flex items-center space-x-2">
                <Link 
                  href={`/shop?category=${crumb.slug}`}
                  className="hover:text-foreground"
                >
                  {crumb.name}
                </Link>
                {idx < product.breadcrumb.length - 1 && <ChevronRight className="h-4 w-4" />}
              </div>
            ))}
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{product.name}</span>
          </nav>
{/* 
          <Button variant="ghost" asChild className="mb-6">
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
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.badges.is_featured && (
                    <Badge variant="default" className="animate-pulse">Featured</Badge>
                  )}
                  {product.badges.is_new && (
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">✨ New</Badge>
                  )}
                  {product.badges.is_trending && (
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                      <TrendingUp className="w-3 h-3 mr-1" />Trending
                    </Badge>
                  )}
                  {product.badges.is_bestseller && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-0">
                      🏆 Bestseller
                      {product.inventory.sold_count > 0 && ` • ${product.inventory.sold_count} sold`}
                    </Badge>
                  )}
                  {product.badges.is_on_sale && (
                    <Badge variant="destructive" className="animate-pulse">🔥 On Sale</Badge>
                  )}
                  {product.status === "active" && isInStock ? (
                    <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                      <Check className="w-3 h-3 mr-1" />In Stock
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                  {isLowStock && isInStock && (
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 animate-pulse">
                      <AlertTriangle className="w-3 h-3 mr-1" />Low Stock
                    </Badge>
                  )}
                </div>

                <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {product.name}
                </h1>
                {/* <p className="text-sm text-muted-foreground mb-4">SKU: {currentSku}</p> */}

                {/* Brand */}
                {/* {product.brand && (
                  <Link 
                    href={`/brand/${product.brand.slug}`}
                    className="inline-flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity group"
                  >
                    {product.brand.logo && (
                      <div className="h-8 w-auto overflow-hidden rounded">
                        <img 
                          src={product.brand.logo} 
                          alt={product.brand.name} 
                          className="h-8 object-contain group-hover:scale-110 transition-transform" 
                        />
                      </div>
                    )}
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">
                      {product.brand.name}
                    </span>
                  </Link>
                )} */}

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 transition-all ${
                          star <= Math.round(product.reviews.average_rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold">
                    {product.reviews.average_rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviews.review_count} reviews)
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    • {product.reviews.verified_purchase_percentage.toFixed(0)}% verified
                  </span>
                </div>
              </div>

              <Separator />

              {/* Pricing */}
              <div className="space-y-3">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {product.pricing.currency_symbol}{displayPrice.toLocaleString()}
                  </span>
                  {(currentSalePrice || currentRegularPrice > currentPrice) && (
                    <span className="text-2xl text-muted-foreground line-through decoration-2">
                      {product.pricing.currency_symbol}{currentRegularPrice.toLocaleString()}
                    </span>
                  )}
                  {isDiscountActive && discountValue > 0 && (
                    <Badge variant="destructive" className="text-lg px-4 py-1.5 animate-pulse">
                      {discountValue}% OFF
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-base px-3 py-1.5 bg-green-50 border-green-300 text-green-700 font-medium">
                    <Package className="w-4 h-4 mr-1.5" />
                    {currentStock} available
                  </Badge>
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
                    {!product.pricing.tax.included && ` (+${product.pricing.currency_symbol}${taxAmount.toFixed(2)})`}
                  </Button>
                </div>

                {/* Bulk pricing */}
                {product.bulk_pricing.length > 0 && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        <Tag className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <p className="text-sm font-medium text-blue-900">Bulk Pricing Available</p>
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() => setShowBulkPricingModal(true)}
                              className="h-auto p-0 text-blue-700 hover:text-blue-900 font-medium"
                            >
                              View Bulk Pricing
                            </Button>
                          </div>
                          <div className="mt-2 space-y-1">
                            {product.bulk_pricing.slice(0, 3).map((tier, idx) => (
                              <div key={idx} className="text-xs text-blue-700">
                                Buy {tier.min_quantity}
                                {tier.max_quantity && `-${tier.max_quantity}`}: {product.pricing.currency_symbol}
                                {tier.price} each
                                {tier.discount_percentage && ` (${tier.discount_percentage.toFixed(1)}% off)`}
                              </div>
                            ))}
                            {product.bulk_pricing.length > 3 && (
                              <div className="text-xs text-blue-600 font-medium">
                                +{product.bulk_pricing.length - 3} more tier(s)
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <Separator />

              {/* Description
              <div>
                <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: product.description }} />
              </div> */}

              {/* Variant Selection */}
              {product.has_variations && product.variations && product.variations.length > 0 && attributeKeys.length > 0 && (
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-blue-900">
                      <Package className="w-4 h-4" />
                      <span>Product Options</span>
                    </div>
                    {attributeKeys.map(attrKey => {
                      const uniqueValues = getAvailableAttributeValues(attrKey);
                      
                      return (
                        <div key={attrKey}>
                          <p className="text-sm font-medium mb-2 text-gray-700">
                            Select {attrKey}:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {uniqueValues.map(value => {
                              const isAvailable = isAttributeCombinationAvailable(attrKey, value);
                              const isSelected = selectedAttributes[attrKey] === value;
                              
                              return (
                                <Button
                                  key={value}
                                  variant={isSelected ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleAttributeSelect(attrKey, value)}
                                  disabled={!isAvailable}
                                  className={`min-w-[70px] transition-all ${
                                    isSelected 
                                      ? "bg-primary shadow-lg scale-105" 
                                      : "hover:scale-105 hover:border-primary"
                                  } ${!isAvailable && "opacity-40 cursor-not-allowed"}`}
                                >
                                  {value}
                                  {isSelected && <Check className="ml-1 w-3 h-3" />}
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                    
                    {selectedVariant && (
                      <div className="pt-3 border-t border-blue-200">
                        <div className="flex items-center justify-between text-xs text-blue-900">
                          <span>Selected: {currentSku}</span>
                          <span className="font-semibold">{currentStock} in stock</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Quantity */}
              <div>
                  <p className="text-sm font-medium mb-2">
                    Quantity (Min: {product.minimum_order_quantity}
                    {product.maximum_order_quantity !== null && product.maximum_order_quantity !== undefined 
                      ? `, Max: ${product.maximum_order_quantity}` 
                      : ''})
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
                    max={getEffectiveMaxQuantity()}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= getEffectiveMaxQuantity()}
                  >
                    +
                  </Button>
                </div>
                {bulkTier && bulkTier.discount_percentage && (
                  <p className="text-sm text-green-600 mt-2">
                    You save {bulkTier.discount_percentage.toFixed(1)}% at this quantity!
                  </p>
                )}
              </div>

              {/* Actions */}
              <div ref={addToCartSectionRef} className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="flex-1 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  disabled={!isInStock || product.status !== "active"}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  size="lg"
                  variant="secondary"
                  className="flex-1 shadow-md hover:shadow-lg transition-all hover:scale-105"
                  disabled={!isInStock || product.status !== "active"}
                >
                  ⚡ Buy Now
                </Button>
                <Button
                  onClick={handleWishlistToggle}
                  variant={inWishlist ? "default" : "outline"}
                  size="lg"
                  className="shadow-md hover:shadow-lg transition-all hover:scale-110"
                >
                  <Heart className={`h-5 w-5 transition-all ${inWishlist ? "fill-current animate-pulse" : ""}`} />
                </Button>
              </div>

              {/* Stock Locations */}
              {product.inventory.stock_by_location && product.inventory.stock_by_location.length > 0 && (
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-4 w-4 text-purple-600" />
                      <p className="text-sm font-semibold text-purple-900">Available at Locations</p>
                    </div>
                    <div className="space-y-2">
                      {product.inventory.stock_by_location.map(loc => (
                        <div key={loc.shop_id} className="flex justify-between text-sm bg-white/50 rounded p-2">
                          <span className="font-medium">{loc.shop_name}</span>
                          <span className="text-purple-700 font-bold">
                            {loc.quantity} units
                            {loc.reserved > 0 && ` (${loc.reserved} reserved)`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Shipping Info */}
              {/* <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-200">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <Truck className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-green-900">Fast Delivery</p>
                      <p className="text-xs text-green-700">
                        {product.shipping.estimated_delivery.min_days}-{product.shipping.estimated_delivery.max_days} days
                        {product.shipping.estimated_delivery.express_available && " • Express available"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-blue-900">
                        {product.shipping.free_shipping ? "🎁 Free Shipping" : "Standard Shipping"}
                      </p>
                      <p className="text-xs text-blue-700">
                        Ships from {product.shipping.ships_from.city}, {product.shipping.ships_from.country}
                      </p>
                    </div>
                  </div>
                  {product.return_policy.returnable && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500 rounded-lg">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-purple-900">
                          {product.return_policy.return_window_days} Days Easy Return
                        </p>
                        <p className="text-xs text-purple-700">
                          {product.return_policy.conditions}
                        </p>
                      </div>
                    </div>
                  )}
                  {product.warranty.has_warranty && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-500 rounded-lg">
                        <Award className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-amber-900">Quality Warranty</p>
                        <p className="text-xs text-amber-700">
                          {product.warranty.duration} {product.warranty.duration_unit} {product.warranty.type} warranty
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card> */}

              {/* Sold count - only show if NOT a bestseller */}
              {product.inventory.sold_count > 0 && !product.badges.is_bestseller && (
                <div className="flex items-center justify-center gap-2 text-sm bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-3">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                  <span className="font-semibold text-orange-900">
                    🔥 {product.inventory.sold_count} units sold - Popular choice!
                  </span>
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
                      <span>{product.shipping.weight} {product.shipping.weight_unit}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pb-3 border-b">
                      <span className="font-medium">Dimensions</span>
                      <span>
                        {product.shipping.dimensions.length} × {product.shipping.dimensions.width} × {product.shipping.dimensions.height} {product.shipping.dimensions.unit}
                      </span>
                    </div>
                    {product.specifications && product.specifications.length > 0 && (
                      product.specifications.map((spec: any, idx: number) => (
                        <div key={idx} className="grid grid-cols-2 gap-4 pb-3 border-b">
                          <span className="font-medium">{spec.name || spec.key}</span>
                          <span>{spec.value}</span>
                        </div>
                      ))
                    )}
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
                      {[5, 4, 3, 2, 1].map(rating => {
                        const count = product.reviews.rating_distribution[`${rating}_star` as keyof typeof product.reviews.rating_distribution];
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
                        <strong>Delivery Time:</strong> {product.shipping.estimated_delivery.min_days}-
                        {product.shipping.estimated_delivery.max_days} business days
                      </p>
                      <p>
                        <strong>Ships From:</strong> {product.shipping.ships_from.city}, {product.shipping.ships_from.country}
                      </p>
                      <p>
                        <strong>Shipping Class:</strong> {product.shipping.shipping_class}
                      </p>
                      {product.shipping.free_shipping && (
                        <p className="text-green-600 font-medium">✓ Free Shipping Available</p>
                      )}
                      {product.shipping.estimated_delivery.express_available && (
                        <p className="text-blue-600">Express shipping available for faster delivery</p>
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
                            <strong>Return Window:</strong> {product.return_policy.return_window_days} days from delivery
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
                            <strong>Duration:</strong> {product.warranty.duration} {product.warranty.duration_unit}
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
          {similarProducts && similarProducts.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">Similar Products</h2>
                {similarProductsLoading && (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProducts.map((similarProduct: any) => {
                  // Similar products API returns a different structure than single product API
                  const finalPrice = similarProduct.sell_price?.price || similarProduct.original_price || 0;
                  const regularPrice = similarProduct.original_price || finalPrice;
                  const hasDiscount = regularPrice > finalPrice;
                  
                  // Parse discount from string format (e.g., "10%")
                  let discountPercent = 0;
                  if (similarProduct.discount_percent && typeof similarProduct.discount_percent === 'string') {
                    discountPercent = parseInt(similarProduct.discount_percent.replace('%', '')) || 0;
                  }
                  
                  const transformedProduct = {
                    id: similarProduct.id.toString(),
                    name: similarProduct.name || 'Unnamed Product',
                    slug: similarProduct.slug || '',
                    price: finalPrice,
                    originalPrice: hasDiscount ? regularPrice : undefined,
                    description: similarProduct.description || '',
                    category: similarProduct.category?.slug || '',
                    subcategory: similarProduct.sub_category?.slug,
                    images: similarProduct.primary_photo 
                      ? [similarProduct.primary_photo]
                      : (similarProduct.brand?.logo ? [similarProduct.brand.logo] : []),
                    inStock: similarProduct.stock > 0 && similarProduct.status === "Active",
                    rating: 4.5, // Similar products API doesn't include full review data
                    reviewCount: 0,
                    material: similarProduct.brand?.name,
                    isFeatured: similarProduct.isFeatured === 1,
                    isNew: similarProduct.isNew === 1,
                    discount: discountPercent > 0 ? discountPercent : undefined,
                  };
                  
                  return (
                    <ProductCard 
                      key={similarProduct.id} 
                      product={transformedProduct} 
                    />
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Legacy Related Products Section - Keep for compatibility */}
          {product.related_products && (
            <div className="space-y-8 mt-12">
              {product.related_products.frequently_bought_together && product.related_products.frequently_bought_together.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Frequently Bought Together</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Product IDs: {product.related_products.frequently_bought_together.join(", ")}
                  </p>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Compact Sticky Sidebar - Desktop */}
        {product && (
          <>
            <style jsx>{`
              @keyframes slideInLeft {
                0% {
                  transform: translateY(-50%) translateX(-120%) scale(0.9);
                  opacity: 0;
                }
                60% {
                  transform: translateY(-50%) translateX(5%) scale(1.02);
                  opacity: 0.9;
                }
                100% {
                  transform: translateY(-50%) translateX(0) scale(1);
                  opacity: 1;
                }
              }

              @keyframes slideOutLeft {
                0% {
                  transform: translateY(-50%) translateX(0) scale(1);
                  opacity: 1;
                }
                100% {
                  transform: translateY(-50%) translateX(-120%) scale(0.9);
                  opacity: 0;
                }
              }

              @keyframes fadeInUp {
                0% {
                  transform: translateY(10px);
                  opacity: 0;
                }
                100% {
                  transform: translateY(0);
                  opacity: 1;
                }
              }

              @keyframes scaleIn {
                0% {
                  transform: scale(0.95);
                  opacity: 0;
                }
                100% {
                  transform: scale(1);
                  opacity: 1;
                }
              }

              @keyframes pulse {
                0%, 100% {
                  box-shadow: 0 0 0 0 rgba(72, 85%, 58%, 0.4);
                }
                50% {
                  box-shadow: 0 0 0 8px rgba(72, 85%, 58%, 0);
                }
              }

              @keyframes minimizeCollapse {
                0% {
                  transform: translateY(-50%) translateX(0);
                  opacity: 1;
                }
                100% {
                  transform: translateY(-50%) translateX(-120%);
                  opacity: 0;
                }
              }

              .sidebar-container {
                animation: ${showStickySidebar && !isMinimized ? 'slideInLeft' : isMinimized && showStickySidebar ? 'minimizeCollapse' : 'slideOutLeft'} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
              }

              .sidebar-container.minimized {
                pointer-events: none;
                opacity: 0;
              }

              @keyframes minimizeGlow {
                0%, 100% {
                  box-shadow: 
                    4px 0 20px rgba(72, 85%, 58%, 0.4),
                    0 0 0 0 rgba(72, 85%, 58%, 0.7),
                    inset -2px 0 12px rgba(255, 255, 255, 0.15);
                }
                50% {
                  box-shadow: 
                    6px 0 30px rgba(72, 85%, 58%, 0.6),
                    0 0 0 6px rgba(72, 85%, 58%, 0.3),
                    inset -2px 0 12px rgba(255, 255, 255, 0.25);
                }
              }

              @keyframes minimizeShimmer {
                0% {
                  transform: translateX(-100%) translateY(-50%);
                }
                100% {
                  transform: translateX(200%) translateY(-50%);
                }
              }

              @keyframes minimizeFloat {
                0%, 100% {
                  transform: translateY(-50%) translateX(0);
                }
                50% {
                  transform: translateY(-52%) translateX(0);
                }
              }

              @keyframes minimizeNeon {
                0%, 100% {
                  filter: drop-shadow(0 0 3px rgba(72, 85%, 58%, 0.8)) 
                          drop-shadow(0 0 6px rgba(72, 85%, 58%, 0.6))
                          drop-shadow(0 0 9px rgba(72, 85%, 58%, 0.4));
                }
                50% {
                  filter: drop-shadow(0 0 5px rgba(72, 85%, 58%, 1)) 
                          drop-shadow(0 0 10px rgba(72, 85%, 58%, 0.8))
                          drop-shadow(0 0 15px rgba(72, 85%, 58%, 0.6));
                }
              }

              .minimize-btn {
                transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                position: absolute;
                top: 50%;
                right: -20px;
                transform: translateY(-50%);
                width: 40px;
                height: 64px;
                border-radius: 0 16px 16px 0;
                background: linear-gradient(
                  135deg,
                  hsl(var(--primary)),
                  hsl(var(--primary-light)),
                  hsl(var(--primary))
                );
                background-size: 200% 200%;
                border: 2px solid hsl(var(--primary));
                border-left: none;
                box-shadow: 
                  4px 0 20px rgba(72, 85%, 58%, 0.4),
                  0 0 0 0 rgba(72, 85%, 58%, 0.7),
                  inset -3px 0 15px rgba(255, 255, 255, 0.2),
                  inset 0 0 20px rgba(255, 255, 255, 0.1);
                z-index: 10;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                overflow: hidden;
                animation: minimizeGlow 3s ease-in-out infinite, minimizeFloat 4s ease-in-out infinite;
                perspective: 1000px;
              }

              .minimize-btn::before {
                content: '';
                position: absolute;
                top: 50%;
                left: -50%;
                width: 50%;
                height: 200%;
                background: linear-gradient(
                  90deg,
                  transparent,
                  rgba(255, 255, 255, 0.4),
                  transparent
                );
                transform: translateY(-50%) rotate(45deg);
                animation: minimizeShimmer 3s ease-in-out infinite;
                z-index: 1;
              }

              .minimize-btn::after {
                content: '';
                position: absolute;
                inset: -2px;
                border-radius: 0 16px 16px 0;
                padding: 2px;
                background: linear-gradient(
                  135deg,
                  hsl(var(--primary-light)),
                  hsl(var(--primary)),
                  hsl(var(--primary-light))
                );
                background-size: 200% 200%;
                -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                -webkit-mask-composite: xor;
                mask-composite: exclude;
                opacity: 0;
                transition: opacity 0.5s;
                animation: shimmer 3s linear infinite;
                z-index: -1;
              }

              .minimize-btn:hover::after {
                opacity: 1;
              }

              .minimize-btn:hover {
                transform: translateY(-50%) translateX(4px) scale(1.05);
                width: 44px;
                height: 68px;
                box-shadow: 
                  8px 0 35px rgba(72, 85%, 58%, 0.7),
                  0 0 0 4px rgba(72, 85%, 58%, 0.4),
                  inset -3px 0 15px rgba(255, 255, 255, 0.3),
                  inset 0 0 30px rgba(255, 255, 255, 0.15);
                background-position: 100% 0;
                animation: minimizeGlow 1.5s ease-in-out infinite, minimizeFloat 4s ease-in-out infinite;
              }

              .minimize-btn:hover::before {
                animation: minimizeShimmer 1.5s ease-in-out infinite;
              }

              .minimize-btn:active {
                transform: translateY(-50%) translateX(2px) scale(0.98);
                box-shadow: 
                  4px 0 20px rgba(72, 85%, 58%, 0.5),
                  0 0 0 2px rgba(72, 85%, 58%, 0.3),
                  inset -3px 0 15px rgba(255, 255, 255, 0.2);
              }

              .minimize-icon {
                transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                color: white;
                filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
                z-index: 2;
                position: relative;
                animation: minimizeNeon 2s ease-in-out infinite;
              }

              .minimize-btn:hover .minimize-icon {
                transform: scale(1.4) rotate(-90deg);
                filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))
                        drop-shadow(0 0 12px rgba(72, 85%, 58%, 0.8));
                animation: minimizeNeon 1s ease-in-out infinite;
              }

              .sidebar-card-wrapper {
                position: relative;
              }

              .sidebar-content {
                animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
              }

              .sidebar-image {
                animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both;
                transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
              }

              .sidebar-image:hover {
                transform: scale(1.1) rotate(2deg);
              }

              @keyframes cardGlow {
                0%, 100% {
                  box-shadow: 
                    0 20px 60px rgba(0, 0, 0, 0.15),
                    0 0 0 1px rgba(72, 85%, 58%, 0.1),
                    inset 0 0 0 rgba(72, 85%, 58%, 0);
                }
                50% {
                  box-shadow: 
                    0 25px 70px rgba(0, 0, 0, 0.2),
                    0 0 0 1px rgba(72, 85%, 58%, 0.15),
                    inset 0 0 20px rgba(72, 85%, 58%, 0.05);
                }
              }

              .sidebar-card {
                transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                position: relative;
                animation: cardGlow 4s ease-in-out infinite;
              }

              .sidebar-card::before {
                content: '';
                position: absolute;
                inset: -1px;
                border-radius: inherit;
                padding: 1px;
                background: linear-gradient(
                  135deg,
                  hsl(var(--primary) / 0.3),
                  hsl(var(--primary-light) / 0.2),
                  hsl(var(--secondary) / 0.1),
                  transparent
                );
                background-size: 200% 200%;
                -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                -webkit-mask-composite: xor;
                mask-composite: exclude;
                opacity: 0;
                transition: opacity 0.4s;
                animation: shimmer 4s linear infinite;
                pointer-events: none;
                z-index: -1;
              }

              .sidebar-card:hover {
                transform: translateX(6px) scale(1.02);
                animation: cardGlow 2s ease-in-out infinite;
              }

              .sidebar-card:hover::before {
                opacity: 1;
              }

              .quantity-button {
                transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
                pointer-events: auto !important;
                cursor: pointer;
                z-index: 10;
                position: relative;
              }

              .quantity-button:hover:not(:disabled) {
                transform: scale(1.1);
                background-color: hsl(var(--primary) / 0.1);
              }

              .quantity-button:active:not(:disabled) {
                transform: scale(0.95);
              }

              .quantity-button:disabled {
                pointer-events: none;
                opacity: 0.5;
                cursor: not-allowed;
              }

              .add-to-cart-btn {
                transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                position: relative;
                overflow: hidden;
              }

              .add-to-cart-btn::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: translate(-50%, -50%);
                transition: width 0.6s, height 0.6s;
              }

              .add-to-cart-btn:hover:not(:disabled)::before {
                width: 300px;
                height: 300px;
              }

              .add-to-cart-btn:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(72, 85%, 58%, 0.4);
              }

              .add-to-cart-btn:active:not(:disabled) {
                transform: translateY(0);
              }

              @keyframes shimmer {
                0% {
                  background-position: -1000px 0;
                }
                100% {
                  background-position: 1000px 0;
                }
              }

              .sidebar-border {
                position: relative;
                overflow: hidden;
              }

              @keyframes borderGlow {
                0%, 100% {
                  box-shadow: 
                    -2px 0 8px rgba(72, 85%, 58%, 0.3),
                    -4px 0 12px rgba(72, 85%, 58%, 0.2);
                }
                50% {
                  box-shadow: 
                    -2px 0 12px rgba(72, 85%, 58%, 0.5),
                    -4px 0 16px rgba(72, 85%, 58%, 0.3),
                    -6px 0 20px rgba(72, 85%, 58%, 0.15);
                }
              }

              .sidebar-border::after {
                content: '';
                position: absolute;
                top: 0;
                right: 0;
                width: 5px;
                height: 100%;
                background: linear-gradient(
                  180deg,
                  hsl(var(--primary)),
                  hsl(var(--primary-light)),
                  hsl(var(--primary-dark)),
                  hsl(var(--primary-light)),
                  hsl(var(--primary))
                );
                background-size: 100% 300%;
                animation: shimmer 4s linear infinite;
                box-shadow: 
                  -2px 0 8px rgba(72, 85%, 58%, 0.3),
                  -4px 0 12px rgba(72, 85%, 58%, 0.2);
                animation: shimmer 4s linear infinite, borderGlow 3s ease-in-out infinite;
              }
            `}</style>
            {!isMinimized && (
              <div
                className={`hidden lg:block fixed z-50 left-0 sidebar-container ${
                  !showStickySidebar ? "pointer-events-none" : ""
                }`}
                style={{
                  top: "50%",
                }}
              >
              <div className="sidebar-card-wrapper" style={{ pointerEvents: 'auto' }}>
                <Card className="w-72 sidebar-card shadow-2xl border-r-4 border-primary bg-gradient-to-br from-white via-primary/5 to-secondary/10 dark:from-gray-900 dark:via-primary/10 dark:to-secondary/20 backdrop-blur-md sidebar-border">
                  <CardContent className="p-3 space-y-3 sidebar-content" style={{ pointerEvents: 'auto' }}>
                  {/* Compact Product Image & Name */}
                  <div className="flex gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-muted ring-2 ring-primary/20 sidebar-image">
                      {productImageUrl && productImageUrl !== '/placeholder.svg' ? (
                        <img
                          src={productImageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (!target.src.includes('/placeholder.svg')) {
                              target.src = '/placeholder.svg';
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-xs line-clamp-2 leading-tight mb-1 transition-colors hover:text-primary">
                        {product.name}
                      </h3>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-bold text-primary transition-transform hover:scale-110 inline-block">
                          {product.pricing.currency_symbol}
                          {displayPrice.toLocaleString()}
                        </span>
                        {(currentSalePrice || currentRegularPrice > currentPrice) && (
                          <span className="text-xs text-muted-foreground line-through">
                            {product.pricing.currency_symbol}
                            {currentRegularPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Compact Quantity & Add to Cart */}
                  <div className="flex items-center gap-2 pt-2 border-t border-primary/20">
                    <div className="flex items-center gap-1 border rounded-md overflow-hidden">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 quantity-button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleQuantityChange(quantity - 1);
                        }}
                        disabled={quantity <= product.minimum_order_quantity}
                        type="button"
                      >
                        <span className="text-xs">−</span>
                      </Button>
                      <span className="text-xs font-medium w-6 text-center transition-all">
                        {quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 quantity-button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleQuantityChange(quantity + 1);
                        }}
                        disabled={quantity >= getEffectiveMaxQuantity()}
                        type="button"
                      >
                        <span className="text-xs">+</span>
                      </Button>
                    </div>
                    <Button
                      onClick={handleAddToCart}
                      size="sm"
                      className="flex-1 h-8 text-xs font-semibold add-to-cart-btn"
                      disabled={!isInStock || product.status !== "active"}
                    >
                      <ShoppingCart className="mr-1.5 h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
                </Card>
                
                {/* Stylish Minimize Button - Right Side */}
                {!isMinimized && showStickySidebar && (
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="minimize-btn"
                    aria-label="Minimize sidebar"
                  >
                    <ChevronLeft className="h-4 w-4 minimize-icon" />
                  </button>
                )}
              </div>
            </div>
            )}

            {/* Premium Restore Button - When Minimized */}
            {isMinimized && showStickySidebar && (
              <div
                className="hidden lg:block fixed z-50 left-0"
                style={{
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <button
                  onClick={() => setIsMinimized(false)}
                  className="minimize-btn"
                  style={{
                    right: 'auto',
                    left: '0',
                    borderRadius: '0 16px 16px 0',
                    borderLeft: '2px solid hsl(var(--primary))',
                    borderRight: 'none',
                  }}
                  aria-label="Restore sidebar"
                >
                  <ChevronRight className="h-4 w-4 minimize-icon" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Compact Sticky Sidebar - Mobile */}
        {product && (
          <>
            <style jsx>{`
              @keyframes slideUpMobile {
                0% {
                  transform: translateY(100%) scale(0.95);
                  opacity: 0;
                }
                60% {
                  transform: translateY(-3%) scale(1.01);
                  opacity: 0.9;
                }
                100% {
                  transform: translateY(0) scale(1);
                  opacity: 1;
                }
              }

              @keyframes slideDownMobile {
                0% {
                  transform: translateY(0) scale(1);
                  opacity: 1;
                }
                100% {
                  transform: translateY(100%) scale(0.95);
                  opacity: 0;
                }
              }

              @keyframes fadeInScale {
                0% {
                  opacity: 0;
                  transform: scale(0.9);
                }
                100% {
                  opacity: 1;
                  transform: scale(1);
                }
              }

              .mobile-sidebar-container {
                animation: ${showStickySidebar ? 'slideUpMobile' : 'slideDownMobile'} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
              }

              .mobile-sidebar-content {
                animation: fadeInScale 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
              }

              .mobile-image {
                transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
              }

              .mobile-image:active {
                transform: scale(1.15);
              }

              .mobile-quantity-btn {
                transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
              }

              .mobile-quantity-btn:active:not(:disabled) {
                transform: scale(1.2);
                background-color: hsl(var(--primary) / 0.2);
              }

              .mobile-add-btn {
                transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                position: relative;
                overflow: hidden;
              }

              .mobile-add-btn::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: translate(-50%, -50%);
                transition: width 0.5s, height 0.5s;
              }

              .mobile-add-btn:active:not(:disabled)::before {
                width: 200px;
                height: 200px;
              }

              .mobile-add-btn:active:not(:disabled) {
                transform: scale(0.95);
              }
            `}</style>
            <div
              className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 mobile-sidebar-container ${
                !showStickySidebar ? "pointer-events-none" : ""
              }`}
            >
              <div className="bg-gradient-to-r from-white via-primary/5 to-secondary/10 dark:from-gray-900 dark:via-primary/10 dark:to-secondary/20 backdrop-blur-md border-t-4 border-primary shadow-2xl">
                <div className="container mx-auto px-4 py-2.5 mobile-sidebar-content">
                  <div className="flex items-center gap-2.5">
                    {/* Compact Product Image */}
                    <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden bg-muted ring-2 ring-primary/20 mobile-image">
                      {productImageUrl && productImageUrl !== '/placeholder.svg' ? (
                        <img
                          src={productImageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (!target.src.includes('/placeholder.svg')) {
                              target.src = '/placeholder.svg';
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Compact Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-xs line-clamp-1 mb-0.5 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-bold text-primary transition-transform inline-block">
                          {product.pricing.currency_symbol}
                          {displayPrice.toLocaleString()}
                        </span>
                        {(currentSalePrice ||
                          currentRegularPrice > currentPrice) && (
                          <span className="text-xs text-muted-foreground line-through">
                            {product.pricing.currency_symbol}
                            {currentRegularPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Compact Quantity & Add to Cart */}
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5 border rounded-md overflow-hidden">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 mobile-quantity-btn"
                          onClick={() => handleQuantityChange(quantity - 1)}
                          disabled={quantity <= product.minimum_order_quantity}
                        >
                          <span className="text-xs">−</span>
                        </Button>
                        <span className="text-xs font-medium w-5 text-center transition-all">
                          {quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 mobile-quantity-btn"
                          onClick={() => handleQuantityChange(quantity + 1)}
                          disabled={
                            quantity >=
                            Math.min(product.maximum_order_quantity, currentStock)
                          }
                        >
                          <span className="text-xs">+</span>
                        </Button>
                      </div>
                      <Button
                        onClick={handleAddToCart}
                        size="sm"
                        className="h-8 px-3 text-xs font-semibold whitespace-nowrap mobile-add-btn"
                        disabled={!isInStock || product.status !== "active"}
                      >
                        <ShoppingCart className="mr-1 h-3.5 w-3.5" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <Footer />

        {/* Price Drop Notification */}
        {product && (
          <PriceDropNotification 
            product={{
              id: product.id,
              name: product.name,
              price: currentPrice,
            }}
          />
        )}

        {/* Bulk Pricing Modal */}
        <Dialog open={showBulkPricingModal} onOpenChange={setShowBulkPricingModal}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Bulk Pricing Tiers</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="space-y-3">
                {product && product.bulk_pricing.map((tier, idx) => (
                  <Card 
                    key={idx}
                    className={`cursor-pointer transition-all hover:shadow-md hover:border-blue-400 ${
                      selectedBulkPrice === tier.price ? 'border-blue-600 bg-blue-50' : ''
                    }`}
                    onClick={() => handleBulkPricingSelect(tier.price)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Tag className="h-4 w-4 text-blue-600" />
                            <span className="font-semibold text-gray-900">
                              {tier.min_quantity}
                              {tier.max_quantity && ` - ${tier.max_quantity}`}
                              {!tier.max_quantity && '+'} units
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Minimum quantity: {tier.min_quantity}
                            {tier.max_quantity && ` | Maximum: ${tier.max_quantity}`}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            {product.pricing.currency_symbol}{tier.price.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">per unit</div>
                          {tier.discount_percentage && (
                            <Badge variant="destructive" className="mt-1">
                              {tier.discount_percentage.toFixed(1)}% OFF
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground text-center">
                Click any tier to apply that pricing
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default ProductDetailNew;

