"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { brandSpotlight } from "@/data/migration-content";

export const BrandSpotlight = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-3 mb-5">
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination]}
        breakpoints={{
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
        {brandSpotlight.map((item, index) => (
          <SwiperSlide key={item.id || index}>
            <div className="bg-[#17b4cd3b]">
              <div className="grid-item relative group">
                <div className="flex">
                  <div className="w-1/2">
                    <div className="aspect-w-2 aspect-h-3">
                      <img
                        src={item.logo}
                        alt={`${item.name} ${index + 1}`}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                  </div>
                  <div className="w-1/2 pl-4 flex flex-col justify-center">
                    <p>{item.name}</p>
                  </div>
                </div>
                <div className="popup bg-gray-800 absolute top-0 left-0 right-0 bottom-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-400 group-hover:opacity-100">
                  <p className="text-white text-2xl font-bold">{item.tagline || "Order Now"}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
