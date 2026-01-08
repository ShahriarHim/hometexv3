"use client";

import { ProductCard } from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { api, transformAPIProductToProduct } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface FrequentlyBoughtTogetherProps {
  productIds: number[];
  currentProductId: string;
}

export function FrequentlyBoughtTogether({
  productIds,
  currentProductId,
}: FrequentlyBoughtTogetherProps) {
  const {
    data: productsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["frequently-bought", productIds],
    queryFn: async () => {
      if (!productIds || productIds.length === 0) {
        return null;
      }
      const response = await api.products.getProductsByIds(productIds);
      return response.success && response.data?.products ? response.data.products : [];
    },
    enabled: productIds.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const products = productsResponse || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Frequently Bought Together</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(Math.min(productIds.length, 4))].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Frequently Bought Together</h2>
        <div className="p-4 border border-red-200 bg-red-50 rounded-lg flex items-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <p>Failed to load frequently bought products</p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Frequently Bought Together</h2>
      <Swiper
        slidesPerView={4}
        spaceBetween={20}
        navigation={true}
        modules={[Navigation, Autoplay]}
        className="mySwiper px-1"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={false}
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
        {products.map((product) => {
          // Identify duplicate products (if any) and handle key uniqueness
          // We are using DetailedProduct properties, but ProductCard expects Product type
          // OR DetailedProduct might be compatible or need transformation.
          // ProductCard expects 'Product' type.
          // 'product' here is from 'getProductsByIds' which returns 'DetailedProduct[]'.

          const transformedProduct = transformAPIProductToProduct(product);

          if (transformedProduct.id === currentProductId) {
            return null;
          }

          return (
            <SwiperSlide key={product.id} className="pb-10 pt-2 px-1">
              <ProductCard product={transformedProduct} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
