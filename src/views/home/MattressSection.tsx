"use client";

import GenericProductCard from "@/components/products/GenericProductCard";
import { Button } from "@/components/ui/button";
import { transformAPIProductToProduct } from "@/lib/transforms";
import { productService } from "@/services/api";
import type { Product } from "@/types";
import { ArrowRight, Bed } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export const MattressSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [_swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(null);
  const [mattressCategoryId, setMattressCategoryId] = useState<number | null>(null);

  useEffect(() => {
    const fetchMattressProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // First, find the mattress category
        if (!mattressCategoryId) {
          const categoriesResponse = await productService.getRootCategories();
          if (categoriesResponse.success && categoriesResponse.data) {
            const mattressCategory = categoriesResponse.data.find(
              (cat) =>
                cat.name.toLowerCase().includes("mattress") ||
                cat.slug.toLowerCase().includes("mattress")
            );
            if (mattressCategory) {
              setMattressCategoryId(mattressCategory.id);
            }
          }
        }

        // Fetch products for mattress category
        if (mattressCategoryId) {
          const response = await productService.getProducts({
            category_id: mattressCategoryId,
            per_page: 20,
          });

          if (response.success && response.data.products) {
            const transformedProducts = response.data.products
              .map((apiProduct) => transformAPIProductToProduct(apiProduct))
              .filter((product) => product.inStock);

            setProducts(transformedProducts);
          }
        } else {
          // If no mattress category found, show empty state
          setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching mattress products:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMattressProducts();
  }, [mattressCategoryId]);

  if (isLoading && !mattressCategoryId) {
    return null; // Don't show section if category not found
  }

  if (!mattressCategoryId && !isLoading) {
    return null; // Hide section if no mattress category exists
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row justify-between gap-6 lg:items-end mb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Bed className="h-6 w-6 text-purple-500" />
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Comfort</p>
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              Mattress Collection
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Discover our premium mattress collection for ultimate comfort and restful sleep.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/products?category=mattress">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              <p className="mt-4 text-gray-600">Loading mattress products...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-600 mb-2">Error loading products</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        ) : products.length === 0 ? null : ( // Hide section if no products
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
            loop={products.length > 4}
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
                <GenericProductCard product={product} showSaleLabel={false} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};
