import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Autoplay, Pagination, EffectFade } from "swiper";
import Constants from "@/ults/Constant";
import LoadingSpinner from "../common/Spinner";

const MainSlider = () => {
  const [sliders, setSliders] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${Constants.BASE_URL}/api/banner/slider`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setSliders(data.data || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching sliders:", err);
        setSliders([]); // Set empty array on error
        setIsLoading(false);
      });
  }, []);

  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.activeIndex);
  };

  if (isLoading) {
    return (
      <div className="relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto bg-white rounded-lg shadow-lg h-[500px] flex items-center justify-center">
        <img class="w-20 h-20 animate-spin" src="https://www.svgrepo.com/show/70469/loading.svg" alt="Loading icon"></img>
        </div>
      </div>
    );
  }

  if (!sliders.length) {
    return null;
  }

  return (
    <div className="relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto bg-white rounded-lg transition-shadow duration-300">
        <Swiper
          spaceBetween={0}
          effect={"fade"}
          speed={1000}
          loop={true}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet !bg-black",
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          modules={[Autoplay, Pagination, EffectFade]}
          onSlideChange={handleSlideChange}
          className="mySwiper"
        >
          {sliders.map((slide, index) => (
            <SwiperSlide key={`${index}-${activeIndex}`}>
              <div className="relative h-[500px] flex">
                {/* Left Section */}
                {slide.left && (
                  <div className="flex h-full w-[25%] gap-[15px]">
                    {[
                      {
                        opacity: "opacity-100",
                        width: "w-[40%]",
                        delay: "delay-100",
                      },
                      {
                        opacity: "opacity-80",
                        width: "w-[15%]",
                        delay: "delay-200",
                      },
                      {
                        opacity: "opacity-60",
                        width: "w-[10%]",
                        delay: "delay-300",
                      },
                      {
                        opacity: "opacity-40",
                        width: "w-[5%]",
                        delay: "delay-400",
                      },
                      {
                        opacity: "opacity-20",
                        width: "w-[5%]",
                        delay: "delay-500",
                      },
                    ].map((style, idx) => (
                      <div
                        key={idx}
                        className={`${style.opacity} ${style.width} h-full animate-fadeInColumn ${style.delay}`}
                        style={{ backgroundColor: slide.left.background_color }}
                      />
                    ))}
                  </div>
                )}

                {/* Middle Section */}
                <div className="flex-1 flex items-center justify-center bg-white overflow-hidden">
                  <div className="text-center px-4 max-w-3xl mx-auto">
                    {slide.meddle?.Header && (
                      <h3 className="text-red-600 text-6xl font-bold mb-6 animate-fadeIn">
                        {slide.meddle.Header}
                      </h3>
                    )}
                    <h2 className="text-gray-900 text-5xl font-bold mb-8 animate-fadeIn delay-200">
                      {slide.meddle?.title}
                    </h2>
                    {slide.meddle?.description && (
                      <p className="text-gray-600 text-lg mb-10 animate-fadeIn delay-400">
                        {slide.meddle.description}
                      </p>
                    )}
                    <a
                      href={slide.button_Link}
                      className="bg-black text-white px-8 py-3 text-lg font-medium inline-block 
                        hover:bg-gray-800 transition-all duration-300 rounded hover:scale-105 hover:shadow-lg animate-fadeIn delay-500"
                    >
                      {slide.button_text}
                    </a>
                  </div>
                </div>

                {/* Right Section */}
                {slide.right && (
                  <div className="flex h-full w-[25%] gap-[15px]">
                    {[
                      {
                        opacity: "opacity-20",
                        width: "w-[5%]",
                        delay: "delay-500",
                      },
                      {
                        opacity: "opacity-40",
                        width: "w-[5%]",
                        delay: "delay-400",
                      },
                      {
                        opacity: "opacity-60",
                        width: "w-[10%]",
                        delay: "delay-300",
                      },
                      {
                        opacity: "opacity-80",
                        width: "w-[15%]",
                        delay: "delay-200",
                      },
                      {
                        opacity: "opacity-100",
                        width: "w-[40%]",
                        delay: "delay-100",
                      },
                    ].map((style, idx) => (
                      <div
                        key={idx}
                        className={`${style.opacity} ${style.width} h-full animate-fadeInColumn ${style.delay}`}
                        style={{
                          backgroundColor: slide.right.background_color,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Tailwind Animations */}
      <style>
        {`
    @keyframes fadeInColumn {
      0% { opacity: 0; transform: translateY(20px); }
      100% { transform: translateY(0); }
    }

    .animate-fadeInColumn {
      animation: fadeInColumn 1s ease-in-out forwards;
    }

    /* Ensuring each column retains its original opacity */
    .opacity-100 { opacity: 1; }
    .opacity-80 { opacity: 0.8; }
    .opacity-60 { opacity: 0.6; }
    .opacity-40 { opacity: 0.4; }
    .opacity-20 { opacity: 0.2; }

    /* Animation Delay */
    .delay-100 { animation-delay: 0.2s; }
    .delay-200 { animation-delay: 0.3s; }
    .delay-300 { animation-delay: 0.4s; }
    .delay-400 { animation-delay: 0.5s; }
    .delay-500 { animation-delay: 0.6s; }
  `}
      </style>
    </div>
  );
};

export default MainSlider;
