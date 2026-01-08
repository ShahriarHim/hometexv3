"use client";

import { Link } from "@/i18n/routing";
import { productService } from "@/services/api";
import type { RootCategory } from "@/types/api";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export const CategorySpotlight = () => {
  const [categories, setCategories] = useState<RootCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productService.getRootCategories();
        if (response.success && response.data) {
          let availableCategories = response.data;
          // Ensure we have enough slides for a smooth loop (at least 6 or more)
          if (availableCategories.length > 0 && availableCategories.length < 10) {
            const duplicated = [...availableCategories, ...availableCategories];
            // Limit to reasonable amount
            availableCategories = duplicated.slice(0, 15);
          }
          setCategories(availableCategories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="max-w-screen-xl mx-auto px-3 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
          <div className="md:col-span-1 h-[200px] bg-gray-100 animate-pulse rounded-lg" />
          <div className="md:col-span-3 h-[200px] bg-gray-100 animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="max-w-[1800px] mx-auto px-4 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch">
        {/* Part 1: Featured Section - "Our Top Category" Static Card */}
        <div className="md:col-span-1 text-center transform transition duration-700 ease-in-out hover:scale-105 relative z-10 hidden md:block">
          <div className="flex items-center p-5 text-xl font-bold text-black rounded-lg shadow-xl hover:shadow-2xl bg-gradient-to-br h-full min-h-[200px] from-red-600 to-rose-400 transition-all duration-300">
            <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-xl rounded-lg h-[120px] w-[200px] flex justify-center items-center shadow-2xl border border-white/20">
              <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-rose-500">
                Our Top <br /> Category
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Only Header for "Our Top Category" */}
        <div className="md:hidden col-span-1 mb-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Top Categories</h2>
        </div>

        {/* Parts 2, 3, 4: Category Slider */}
        <div className="md:col-span-4">
          <Swiper
            slidesPerView={1}
            spaceBetween={20}
            navigation={false}
            modules={[Autoplay, Navigation]}
            className="h-full py-2 px-1"
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            speed={1000}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
              1536: {
                slidesPerView: 5,
                spaceBetween: 20,
              },
            }}
          >
            {categories.map((category, index) => (
              <SwiperSlide key={`${category.id}-${index}`} className="h-auto">
                <Link
                  href={`/categories/${category.slug}`}
                  className="block h-full rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transform transition-all duration-500 hover:-translate-y-1 group border border-gray-100"
                >
                  <div className="relative h-48 overflow-hidden">
                    {category.image ? (
                      <>
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextElementSibling?.classList.remove("hidden");
                          }}
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </>
                    ) : null}
                    {/* Fallback for no image */}
                    <div
                      className={`w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${
                        category.image ? "hidden" : ""
                      }`}
                    >
                      <span className="text-gray-400 font-medium text-4xl opacity-20">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-white relative">
                    <h3 className="text-lg font-bold text-center text-gray-800 group-hover:text-rose-500 transition-colors duration-300 truncate">
                      {category.name}
                    </h3>
                    <div className="w-10 h-1 bg-gray-200 mx-auto mt-2 rounded-full group-hover:bg-rose-500 transition-colors duration-300" />
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};
