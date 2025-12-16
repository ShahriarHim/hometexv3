"use client";

import GenericProductCard from "@/components/products/GenericProductCard";
import { Button } from "@/components/ui/button";
import { fetchPublicWithFallback } from "@/lib/api";
import { env } from "@/lib/env";
import type { Product } from "@/types";
import { ArrowRight, Tag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

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

export const OnSaleProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [_swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(null);

  useEffect(() => {
    const fetchOnSaleProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchPublicWithFallback("/api/products/on-sale", env.apiBaseUrl);

        if (!response.ok) {
          throw new Error("Failed to fetch on-sale products");
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
              stock: product.stock, // Add stock to the product object
            };
          });

          setProducts(transformedProducts);
        }
      } catch (err) {
        console.error("Error fetching on-sale products:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOnSaleProducts();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row justify-between gap-6 lg:items-end mb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-orange-500" />
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                Special Offers
              </p>
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">Products On Sale</h2>
            <p className="text-muted-foreground max-w-2xl">
              Don&apos;t miss out on these amazing deals! Limited time offers on selected products.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/products?filter=onsale">
              View All Sales
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              <p className="mt-4 text-gray-600">Loading on-sale products...</p>
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
              <p className="text-muted-foreground">No products on sale at the moment.</p>
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
                <GenericProductCard
                  product={product}
                  showSaleLabel={true}
                  showTrendingIcon={false}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};
