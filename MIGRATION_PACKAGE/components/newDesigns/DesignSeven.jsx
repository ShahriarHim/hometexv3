import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

const DesignSeven = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const gridData = [
    {
      image: "https://colchonesnaco.com/wp-content/uploads/2023/05/sealy.png",
      text1: "Sealy",
      text2: "Order Now",
    },
    {
      image: "https://colchonesnaco.com/wp-content/uploads/2023/05/sealy.png",
      text1: "Sealy",
      text2: "Order Now",
    },
    {
      image: "https://colchonesnaco.com/wp-content/uploads/2023/05/sealy.png",
      text1: "Sealy",
      text2: "Order Now",
    },
    {
      image: "https://colchonesnaco.com/wp-content/uploads/2023/05/sealy.png",
      text1: "Sealy",
      text2: "Order Now",
    },
    {
      image: "https://colchonesnaco.com/wp-content/uploads/2023/05/sealy.png",
      text1: "Sealy",
      text2: "Order Now",
    },
    {
      image: "https://colchonesnaco.com/wp-content/uploads/2023/05/sealy.png",
      text1: "Sealy",
      text2: "Order Now",
    },
    {
      image: "https://colchonesnaco.com/wp-content/uploads/2023/05/sealy.png",
      text1: "Sealy",
      text2: "Order Now",
    },
    {
      image: "https://colchonesnaco.com/wp-content/uploads/2023/05/sealy.png",
      text1: "Sealy",
      text2: "Order Now",
    },
   
  ];
  return (
    <div className="max-w-screen-xl mx-auto px-3 mb-5">
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
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
        {gridData.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="bg-[#17b4cd3b]">
              <div className="grid-item relative">
                <div className="flex">
                  <div className="w-1/2">
                    <div className="aspect-w-2 aspect-h-3">
                      <img
                        src={item.image}
                        alt={`Image ${index + 1}`}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                  </div>
                  <div className="w-1/2 pl-4 flex flex-col justify-center">
                    <p>{item.text1}</p>
                  </div>
                </div>
                <div className="popup bg-gray-800 absolute top-0 left-0 right-0 bottom-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-400">
                  <p className="text-white text-2xl text-bold">{item.text2}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default DesignSeven;