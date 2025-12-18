"use client";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRecentViews } from "@/hooks/use-recent-views";
import { fetchPublicWithFallback } from "@/lib/api";
import { env } from "@/lib/env";
import type { Product as ProductType } from "@/types";
import { Clock, Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./HotDeals.module.css";

interface HotDealProduct {
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
  const [products, setProducts] = useState<HotDealProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [_swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(null);
  const { addRecentView } = useRecentViews();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
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
          const transformedProducts = data.data.products.map((product: Record<string, unknown>) => {
            const sellPrice = product.sell_price as
              | { price?: number; discount?: number; symbol?: string }
              | undefined;
            const category = product.category as { slug?: string } | undefined;
            const subCategory = product.sub_category as { slug?: string } | undefined;
            const childSubCategory = product.child_sub_category as { slug?: string } | undefined;

            const discountPercent =
              sellPrice?.discount && sellPrice.discount > 0 ? `${sellPrice.discount}% OFF` : null;

            return {
              id: product.id,
              name: product.name,
              img: product.primary_photo,
              primary_photo: product.primary_photo,
              price: sellPrice?.price || 0,
              displayPrice: `${sellPrice?.price || 0}${sellPrice?.symbol || "৳"}`,
              originalPrice: `${product.original_price || 0}${sellPrice?.symbol || "৳"}`,
              discount: discountPercent,
              stock: product.stock || 0,
              star: 4, // Default star rating
              category_slug: category?.slug || "general",
              subcategory_slug: subCategory?.slug || "products",
              product_slug: childSubCategory?.slug || (product.slug as string) || "",
            };
          });

          // Filter out out-of-stock items
          const inStockProducts = transformedProducts.filter(
            (product: HotDealProduct) => product.stock > 0
          );

          setProducts(inStockProducts);
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
    if (_swiperInstance && _swiperInstance.autoplay) {
      if (isHovering) {
        _swiperInstance.autoplay.stop();
      } else {
        _swiperInstance.autoplay.start();
      }
    }
  };

  const transformToProduct = (product: HotDealProduct): ProductType => {
    const originalPriceValue =
      parseFloat(product.originalPrice.replace(/[^\d.]/g, "")) || undefined;
    return {
      id: product.id.toString(),
      name: product.name,
      slug: product.product_slug || "",
      price: product.price,
      originalPrice: originalPriceValue,
      description: "",
      category: product.category_slug,
      subcategory: product.subcategory_slug,
      images: product.img ? [product.img] : [],
      primary_photo: product.primary_photo,
      inStock: product.stock > 0,
      rating: product.star || 4,
      reviewCount: 0,
      stock: product.stock,
    };
  };

  const handleAddToCart = (product: HotDealProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const productData = transformToProduct(product);
    addToCart(productData);
  };

  const handleWishlistToggle = (product: HotDealProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const productData = transformToProduct(product);
    if (isInWishlist(productData.id)) {
      removeFromWishlist(productData.id);
    } else {
      addToWishlist(productData);
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
          <Link href="/products?filter=trending" className={styles["see-all-link"]}>
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
              {products.map((product, index) => {
                const productUrl = `/products/${product.category_slug}/${product.subcategory_slug}/${product.id}`;

                const handleProductClick = () => {
                  const productForTracking: ProductType = {
                    id: product.id.toString(),
                    name: product.name,
                    slug: product.product_slug || "",
                    price: product.price,
                    originalPrice:
                      parseFloat(product.originalPrice.replace(/[^\d.]/g, "")) || undefined,
                    description: "",
                    category: product.category_slug,
                    subcategory: product.subcategory_slug,
                    images: product.img ? [product.img] : [],
                    primary_photo: product.primary_photo,
                    inStock: product.stock > 0,
                    rating: product.star || 4,
                    reviewCount: 0,
                    stock: product.stock,
                  };
                  addRecentView(productForTracking);
                };

                return (
                  <SwiperSlide
                    key={index}
                    className="owl2-item active"
                    onMouseEnter={() => handleProductHover(true)}
                    onMouseLeave={() => handleProductHover(false)}
                  >
                    <Link
                      href={productUrl as never}
                      onClick={handleProductClick}
                      className="block h-full"
                    >
                      <div className={styles["product-item-container"]}>
                        <div className={styles["product-image-container"]}>
                          <img src={product.img} alt={product.name} loading="lazy" />
                          {product.discount && (
                            <div className={styles["discount-badge"]}>{product.discount}</div>
                          )}
                          <div className={styles.overlay}>
                            <div className={styles["button-group"]}>
                              <button
                                title="Add to Cart"
                                onClick={(e) => handleAddToCart(product, e)}
                              >
                                <ShoppingCart className="w-4 h-4" />
                              </button>
                              <button
                                title={
                                  isInWishlist(product.id.toString())
                                    ? "Remove from Wishlist"
                                    : "Add to Wishlist"
                                }
                                onClick={(e) => handleWishlistToggle(product, e)}
                                className={
                                  isInWishlist(product.id.toString()) ? styles["active-heart"] : ""
                                }
                              >
                                <Heart
                                  className={`w-4 h-4 ${isInWishlist(product.id.toString()) ? "fill-current" : ""}`}
                                />
                              </button>
                            </div>
                            <div className={styles["overlay-info"]}>
                              <p className={styles["overlay-title"]}>{product.name}</p>
                              <div className={styles["overlay-prices"]}>
                                <span className={styles["price-new"]}>{product.displayPrice}</span>
                                <span className={styles["price-old"]}>{product.originalPrice}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className={styles["product-title"]}>{product.name}</div>

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
                    </Link>
                  </SwiperSlide>
                );
              })}

              {products.map((product, index) => {
                const productUrl = `/products/${product.category_slug}/${product.subcategory_slug}/${product.id}`;

                const handleProductClickCloned = () => {
                  const productForTracking: ProductType = {
                    id: product.id.toString(),
                    name: product.name,
                    slug: product.product_slug || "",
                    price: product.price,
                    originalPrice:
                      parseFloat(product.originalPrice.replace(/[^\d.]/g, "")) || undefined,
                    description: "",
                    category: product.category_slug,
                    subcategory: product.subcategory_slug,
                    images: product.img ? [product.img] : [],
                    primary_photo: product.primary_photo,
                    inStock: product.stock > 0,
                    rating: product.star || 4,
                    reviewCount: 0,
                    stock: product.stock,
                  };
                  addRecentView(productForTracking);
                };

                return (
                  <SwiperSlide
                    key={`cloned-after-${index}`}
                    className="owl2-item cloned"
                    onMouseEnter={() => handleProductHover(true)}
                    onMouseLeave={() => handleProductHover(false)}
                  >
                    <Link
                      href={productUrl as never}
                      onClick={handleProductClickCloned}
                      className="block h-full"
                    >
                      <div className={styles["product-item-container"]}>
                        <div className={styles["product-image-container"]}>
                          <img src={product.img} alt={product.name} loading="lazy" />
                          {product.discount && (
                            <div className={styles["discount-badge"]}>{product.discount}</div>
                          )}
                          <div className={styles.overlay}>
                            <div className={styles["button-group"]}>
                              <button
                                title="Add to Cart"
                                onClick={(e) => handleAddToCart(product, e)}
                              >
                                <ShoppingCart className="w-4 h-4" />
                              </button>
                              <button
                                title={
                                  isInWishlist(product.id.toString())
                                    ? "Remove from Wishlist"
                                    : "Add to Wishlist"
                                }
                                onClick={(e) => handleWishlistToggle(product, e)}
                                className={
                                  isInWishlist(product.id.toString()) ? styles["active-heart"] : ""
                                }
                              >
                                <Heart
                                  className={`w-4 h-4 ${isInWishlist(product.id.toString()) ? "fill-current" : ""}`}
                                />
                              </button>
                            </div>
                            <div className={styles["overlay-info"]}>
                              <p className={styles["overlay-title"]}>{product.name}</p>
                              <div className={styles["overlay-prices"]}>
                                <span className={styles["price-new"]}>{product.displayPrice}</span>
                                <span className={styles["price-old"]}>{product.originalPrice}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className={styles["product-title"]}>{product.name}</div>

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
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotDeals;
