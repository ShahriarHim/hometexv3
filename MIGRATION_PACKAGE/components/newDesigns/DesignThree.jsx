"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper";
import ProductCard from "./ProductCard";
import styles from "../../styles/DesignThree.module.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import Constants from "@/ults/Constant";
import { setCookie, getCookie } from "cookies-next";
import Link from "next/link";
import Loader from "@/components/common/Loader";
import ProductModal from "../common/ProductModal";

function encodeProductId(id) {
  return encodeURIComponent(Buffer.from(`prod-${id}-salt`).toString("base64"));
}

const HotDealsCarousel = () => {
  const [products, setProducts] = useState([]);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${Constants.BASE_URL}/api/products-web`, {
          method: "GET",
          mode: "cors",
          cache: "no-cache",
          credentials: "omit",
          headers: {
            "Content-Type": "application/json",
          },
        }).catch((fetchError) => {
          throw new Error(`Network error: ${fetchError.message}`);
        });

        if (!response || !response.ok) {
          throw new Error(`HTTP error! status: ${response?.status || "unknown"}`);
        }

        const data = await response.json().catch((jsonError) => {
          throw new Error(`JSON parse error: ${jsonError.message}`);
        });

        const transformedProducts = (data.data || []).map((product) => ({
          id: product.id,
          img: product.primary_photo,
          primary_photo: product.primary_photo,
          discount: product.sell_price.discount
            ? product.sell_price.discount
            : null,
          name: product.name,
          price: product.sell_price.price,
          sell_price: product.sell_price,
          displayPrice: product.sell_price.price + product.sell_price.symbol,
          originalPrice: product.original_price + product.sell_price.symbol,
          stock: product.stock || 0,
          star: product.star || 0,
          category_slug: product.category?.name?.toLowerCase() || "",
          subcategory_slug: product.sub_category?.name?.toLowerCase() || "",
          product_slug: product.child_sub_category?.name?.toLowerCase() || "",
          encoded_id: encodeProductId(product.id),
        }));

        setProducts(transformedProducts);
      } catch (error) {
        console.warn("Error fetching products (non-critical):", error.message || error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    const loadProducts = async () => {
      try {
        await fetchProducts();
      } catch (error) {
        // Error already handled inside fetchProducts
        setProducts([]);
        setIsLoading(false);
      }
    };

    loadProducts().catch(() => {
      setProducts([]);
      setIsLoading(false);
    });
  }, []);

  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 7,
    minutes: 11,
    seconds: 51,
  });

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

  const handleProductClick = (product) => {
    // Get existing recently viewed products
    let recentlyViewed = getCookie("recentlyViewed");
    recentlyViewed = recentlyViewed ? JSON.parse(recentlyViewed) : [];

    // Add current product if not already in list
    const productInfo = {
      id: product.id,
      name: product.name,
      image: product.img,
    };

    // Remove if product already exists (to move it to front)
    recentlyViewed = recentlyViewed.filter((item) => item.id !== product.id);

    // Add to front of array
    recentlyViewed.unshift(productInfo);

    // Keep only last 10 items
    recentlyViewed = recentlyViewed.slice(0, 10);

    // Save back to cookie
    setCookie("recentlyViewed", JSON.stringify(recentlyViewed), {
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    setSelectedProduct(product);
  };

  const handleProductHover = (isHovering) => {
    if (swiperInstance && swiperInstance.autoplay) {
      if (isHovering) {
        swiperInstance.autoplay.stop();
      } else {
        swiperInstance.autoplay.start();
      }
    }
  };

  const closeModal = () => {
    setSelectedProduct(null);
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
          <Link href="/Shop" className={styles["see-all-link"]}>
            + See All Products
          </Link>
        </div>

        <div className="flex">
          <div className="bg-purple-600 p-4 rounded-lg text-center text-white mr-5 flex-shrink-0">
            <div className="mb-3">
              <div className="w-12 h-12 bg-purple-700/50 rounded-full flex items-center justify-center mx-auto">
                <i className="fas fa-clock text-2xl"></i>
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
            <div className="flex-1">
              <Loader />
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
                  onClick={() => handleProductClick(product)}
                  onMouseEnter={() => handleProductHover(true)}
                  onMouseLeave={() => handleProductHover(false)}
                >
                  <ProductCard
                    product={product}
                    openModal={handleProductClick}
                  />
                </SwiperSlide>
              ))}

              {products.map((product, index) => (
                <SwiperSlide
                  key={`cloned-after-${index}`}
                  className="owl2-item cloned"
                  onClick={() => handleProductClick(product)}
                  onMouseEnter={() => handleProductHover(true)}
                  onMouseLeave={() => handleProductHover(false)}
                >
                  <ProductCard
                    product={product}
                    openModal={handleProductClick}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
      <ProductModal product={selectedProduct} onClose={closeModal} />
    </div>
  );
};

export default HotDealsCarousel;
