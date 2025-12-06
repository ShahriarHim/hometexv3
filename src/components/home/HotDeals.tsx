"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import Link from "next/link";
import { ShoppingCart, Eye, Heart, Clock } from "lucide-react";
import styles from "./HotDeals.module.css";
import { fetchPublicWithFallback } from "@/lib/api";
import { env } from "@/lib/env";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

interface Product {
  id: number;
  img: string;
  primary_photo: string;
  discount: string | null;
  name: string;
  price: number;
  displayPrice: string;
  originalPrice: string;
  stock: number;
  star: number;
  category_slug: string;
  subcategory_slug: string;
  product_slug: string;
}

const HotDeals = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);

  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 7,
    minutes: 11,
    seconds: 51,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetchPublicWithFallback("/api/products/trending", env.apiBaseUrl);
        const data = await response.json();

        if (data.success && data.data.products) {
          const transformedProducts = data.data.products.map((product: any) => {
            const discountPercent =
              product.sell_price.discount > 0 ? `${product.sell_price.discount}% OFF` : null;

            return {
              id: product.id,
              name: product.name,
              img: product.primary_photo,
              primary_photo: product.primary_photo,
              price: product.sell_price.price,
              displayPrice: `${product.sell_price.price}${product.sell_price.symbol}`,
              originalPrice: `${product.original_price}${product.sell_price.symbol}`,
              discount: discountPercent,
              stock: product.stock || 0,
              star: 4, // Default star rating
              category_slug: product.category?.slug || "general",
              subcategory_slug: product.sub_category?.slug || "products",
              product_slug: product.child_sub_category?.slug || product.slug || "",
            };
          });

          setProducts(transformedProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        let { days, hours, minutes, seconds } = prevTime;

        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) {
                days--;
              }
            }
          }
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleProductHover = (isHovering: boolean) => {
    if (swiperInstance && swiperInstance.autoplay) {
      if (isHovering) {
        swiperInstance.autoplay.stop();
      } else {
        swiperInstance.autoplay.start();
      }
    }
  };

  return (
    <div className={styles["hot-deals-container"]}>
      <div className={styles["hot-deals-box"]}>
        <div className={styles["hot-deals-header"]}>
          <div className={styles["hot-deals-title"]}>
            <h2>
              <span>Hot Deals!</span> Get Our Best Price
            </h2>
          </div>
          <Link href="/shop" className={styles["see-all-link"]}>
            + See All Products
          </Link>
        </div>

        <div className="flex">
          <div className="bg-lime-500 p-4 rounded-lg text-center text-white mr-5 flex-shrink-0">
            <div className="mb-3">
              <div className="w-12 h-12 bg-lime-700/50 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            <div className="text-4xl font-bold">{timeLeft.days}</div>
            <div className="text-sm">DAYS</div>
            <div className="text-4xl font-bold mt-2">
              {timeLeft.hours.toString().padStart(2, "0")}
            </div>
            <div className="text-sm">HOURS</div>
            <div className="text-4xl font-bold mt-2">
              {timeLeft.minutes.toString().padStart(2, "0")}
            </div>
            <div className="text-sm">MINUTES</div>
            <div className="text-4xl font-bold mt-2">
              {timeLeft.seconds.toString().padStart(2, "0")}
            </div>
            <div className="text-sm">SECONDS</div>
          </div>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
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
                delay: 2500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={true}
              speed={1000}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                },
                640: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 3,
                },
                1024: {
                  slidesPerView: 4,
                },
              }}
            >
              {products.map((product, index) => (
                <SwiperSlide
                  key={index}
                  className="owl2-item active"
                  onMouseEnter={() => handleProductHover(true)}
                  onMouseLeave={() => handleProductHover(false)}
                >
                  <div className={styles["product-item-container"]}>
                    <div className={styles["product-image-container"]}>
                      <img src={product.img} alt={product.name} loading="lazy" />
                      {product.discount && (
                        <div className={styles["discount-badge"]}>{product.discount}</div>
                      )}
                      <div className={styles.overlay}>
                        <div className={styles["button-group"]}>
                          <button title="Add to Cart">
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                          <button title="Quick View">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button title="Add to Wishlist">
                            <Heart className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className={styles["product-title"]}>
                      <Link
                        href={
                          `/products/${product.category_slug}/${product.subcategory_slug}/${product.id}` as any
                        }
                      >
                        {product.name}
                      </Link>
                    </div>

                    <div className={styles.rating}>
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={i < product.star ? styles.star : styles["star-empty"]}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    <div className={styles["price-container"]}>
                      <span className={styles["price-new"]}>{product.displayPrice}</span>
                      <span className={styles["price-old"]}>{product.originalPrice}</span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}

              {products.map((product, index) => (
                <SwiperSlide
                  key={`cloned-after-${index}`}
                  className="owl2-item cloned"
                  onMouseEnter={() => handleProductHover(true)}
                  onMouseLeave={() => handleProductHover(false)}
                >
                  <div className={styles["product-item-container"]}>
                    <div className={styles["product-image-container"]}>
                      <img src={product.img} alt={product.name} loading="lazy" />
                      {product.discount && (
                        <div className={styles["discount-badge"]}>{product.discount}</div>
                      )}
                      <div className={styles.overlay}>
                        <div className={styles["button-group"]}>
                          <button title="Add to Cart">
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                          <button title="Quick View">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button title="Add to Wishlist">
                            <Heart className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className={styles["product-title"]}>
                      <Link
                        href={
                          `/product/${product.category_slug}/${product.subcategory_slug}/${product.id}` as any
                        }
                      >
                        {product.name}
                      </Link>
                    </div>

                    <div className={styles.rating}>
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={i < product.star ? styles.star : styles["star-empty"]}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    <div className={styles["price-container"]}>
                      <span className={styles["price-new"]}>{product.displayPrice}</span>
                      <span className={styles["price-old"]}>{product.originalPrice}</span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotDeals;
