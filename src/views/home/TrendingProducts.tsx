"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import ProductCardOnSale from "@/components/products/ProductCardOnSale";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import type { Product } from "@/types";
import { fetchPublicWithFallback } from "@/lib/api";
import { env } from "@/lib/env";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

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

export const TrendingProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchPublicWithFallback("/api/products/trending", env.apiBaseUrl);

        if (!response.ok) {
          throw new Error("Failed to fetch trending products");
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

          setProducts(transformedProducts);
        }
      } catch (err) {
        console.error("Error fetching trending products:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingProducts();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row justify-between gap-6 lg:items-end mb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-orange-500" />
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                Hot Right Now
              </p>
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              Trending Products
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Explore what&apos;s trending right now! These products are flying off the shelves.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/shop">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              <p className="mt-4 text-gray-600">Loading trending products...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-600 mb-2">Error loading products</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-muted-foreground">No trending products available at the moment.</p>
            </div>
          </div>
        ) : (
          <Swiper
            onSwiper={setSwiperInstance}
            slidesPerView={4}
            spaceBetween={20}
            navigation={false}
            modules={[Navigation, Autoplay]}
            className="mySwiper"
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            speed={1000}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
            }}
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCardOnSale product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};
