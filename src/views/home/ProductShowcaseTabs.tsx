"use client";

import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchPublicWithFallback } from "@/lib/api";
import { env } from "@/lib/env";
import type { Product } from "@/types";
import { ArrowRight, Bath, BedDouble, Leaf, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const tabConfig = [
  { id: "all", label: "All Products", icon: Sparkles },
  { id: "bedding", label: "Bedding", icon: BedDouble },
  { id: "bath", label: "Bath", icon: Bath },
  { id: "living-decor", label: "Living Décor", icon: Leaf },
  { id: "new", label: "New In", icon: ArrowRight },
];

interface APIProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  original_price: number;
  sell_price: {
    price: number;
    discount: number;
    symbol: string;
  };
  stock: number;
  primary_photo: string;
  category: {
    slug: string;
  };
  sub_category: {
    slug: string;
  };
  child_sub_category?: {
    slug: string;
  };
  discount_percent?: string;
  status?: string;
}

interface APIResponse {
  success: boolean;
  message: string;
  data: {
    products: APIProduct[];
  };
}

export const ProductShowcaseTabs = () => {
  const [value, setValue] = useState(tabConfig[0].id);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetchPublicWithFallback("/api/products/featured", env.apiBaseUrl);

        if (!response.ok) {
          throw new Error("Failed to fetch featured products");
        }

        const data: APIResponse = await response.json();

        if (data.success && data.data.products) {
          const transformedProducts: Product[] = data.data.products.map((product) => {
            const discountPercent = product.sell_price.discount || 0;
            const originalPrice = product.original_price || product.sell_price.price;
            const salePrice = product.sell_price.price;

            return {
              id: product.id.toString(),
              name: product.name,
              slug: product.slug,
              price: salePrice,
              originalPrice: discountPercent > 0 ? originalPrice : undefined,
              description: "",
              category: product.category?.slug || "general",
              subcategory: product.sub_category?.slug,
              childSubcategory: product.child_sub_category?.slug,
              images: product.primary_photo ? [product.primary_photo] : ["/placeholder.svg"],
              inStock: product.stock > 0,
              rating: 4.0,
              reviewCount: 5,
              discount: discountPercent > 0 ? discountPercent : undefined,
              isNew: false,
              isFeatured: false,
              stock: product.stock,
            };
          });

          // Filter out out-of-stock items
          const inStockProducts = transformedProducts.filter(
            (product) => (product.stock ?? 0) > 0 && product.inStock
          );

          setFeaturedProducts(inStockProducts);
        }
      } catch (err) {
        console.error("Error fetching featured products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const grouped = useMemo<Record<string, Product[]>>(() => {
    const mapping: Record<string, Product[]> = {
      all: featuredProducts,
      bedding: featuredProducts.filter((item) => item.category === "bedding"),
      bath: featuredProducts.filter((item) => item.category === "bath"),
      "living-decor": featuredProducts.filter((item) => item.category === "living-decor"),
      new: featuredProducts.filter((item) => item.isNew || false),
    };
    return mapping;
  }, [featuredProducts]);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4">
        <div className="flex flex-col lg:flex-row justify-between gap-6 lg:items-end">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Hot Swaps</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              Mix & Match Capsules
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Tap through curated edits by category. Every edit includes quick-view, wishlist, and
              cart shortcuts powered by our new contexts.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/products">
              Explore All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Tabs value={value} onValueChange={setValue} className="mt-10">
          <TabsList className="flex flex-wrap gap-3 bg-transparent p-0">
            {tabConfig.map((tab) => {
              const Icon = tab.icon;
              const isActive = value === tab.id;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all data-[state=active]:bg-foreground data-[state=active]:text-background"
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {!isActive && (
                    <span className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
                      {grouped[tab.id]?.length || 0}
                    </span>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {tabConfig.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-8">
              {isLoading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="mt-4 text-gray-600">Loading products...</p>
                  </div>
                </div>
              ) : (grouped[tab.id] || []).length === 0 ? (
                <div className="flex items-center justify-center min-h-[400px]">
                  <p className="text-muted-foreground">No products available in this category.</p>
                </div>
              ) : (
                <Carousel opts={{ align: "start", loop: true }} className="relative">
                  <CarouselContent>
                    {(grouped[tab.id] || []).map((product) => (
                      <CarouselItem
                        key={product.id}
                        className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                      >
                        <ProductCard product={product} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};
