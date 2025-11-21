"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Clock, ShoppingCart, Eye } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";

// Dummy Product Data
const DUMMY_HOT_DEALS = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  name: `Hot Deal Product ${i + 1}`,
  price: `৳${(i + 1) * 1500}`,
  originalPrice: `৳${(i + 1) * 2000}`,
  image: `https://placehold.co/300x300?text=Product+${i + 1}`,
  discount: "25% OFF",
}));

const HotDeals = () => {
  // Countdown Timer Logic
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 7,
    minutes: 11,
    seconds: 51,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            if (hours > 0) hours--;
            else {
              hours = 23;
              if (days > 0) days--;
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Carousel Logic
  const [api, setApi] = useState<CarouselApi>();
  const plugin = useRef(
    Autoplay({ delay: 2500, stopOnInteraction: false })
  );

  const handleMouseEnter = () => {
    plugin.current.stop();
  };

  const handleMouseLeave = () => {
    plugin.current.play();
  };

  return (
    <div className="py-12 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <div className="container mx-auto px-4">
        {/* Main Container Box with Border and Shadow */}
        <div className="relative bg-white rounded-2xl shadow-2xl border-4 border-red-500 overflow-hidden">
          {/* Decorative Corner Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500 to-orange-500 opacity-10 rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-red-500 to-pink-500 opacity-10 rounded-tr-full"></div>
          
          {/* Animated Pulse Border Effect */}
          <div className="absolute inset-0 rounded-2xl animate-pulse pointer-events-none">
            <div className="absolute inset-0 rounded-2xl border-2 border-red-300 opacity-50"></div>
          </div>

          <div className="relative z-10 p-6 md:p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wider shadow-lg animate-pulse">
                  🔥 Limited Time
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-red-600 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                  Hot Deals!
                </h2>
              </div>
              <Link 
                href="/shop" 
                className="text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors flex items-center gap-1 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg border border-red-200"
              >
                See All Products →
              </Link>
            </div>

            {/* Subtitle */}
            {/* <p className="text-lg text-gray-600 mb-6 font-medium">
              ⚡ Get Our Best Prices - Don't Miss Out!
            </p> */}

            <div className="flex flex-col md:flex-row gap-6">
              {/* Timer Section - Vertical Layout */}
              <div className="w-full md:w-32 lg:w-36 bg-gradient-to-b from-purple-600 via-pink-600 to-red-600 rounded-2xl p-4 text-white text-center shrink-0 flex flex-col justify-start shadow-2xl relative overflow-hidden">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_50%)]"></div>
                </div>
                
                <div className="relative z-10 flex flex-col gap-3">
                  {/* Clock Icon */}
                  <div className="mx-auto w-12 h-12 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg">
                    <Clock className="w-6 h-6 animate-pulse" />
                  </div>
                  
                  {/* Vertical Time Stack */}
                  <div className="flex flex-col gap-2">
                    {/* Days */}
                    <div className="py-2">
                      <div className="text-4xl font-extrabold leading-none tabular-nums">{timeLeft.days}</div>
                      <div className="text-xs opacity-90 uppercase tracking-wider mt-1 font-semibold">Days</div>
                    </div>
                    
                    {/* Hours */}
                    <div className="py-2">
                      <div className="text-4xl font-extrabold leading-none tabular-nums">{String(timeLeft.hours).padStart(2, '0')}</div>
                      <div className="text-xs opacity-90 uppercase tracking-wider mt-1 font-semibold">Hours</div>
                    </div>
                    
                    {/* Minutes */}
                    <div className="py-2">
                      <div className="text-4xl font-extrabold leading-none tabular-nums">{String(timeLeft.minutes).padStart(2, '0')}</div>
                      <div className="text-xs opacity-90 uppercase tracking-wider mt-1 font-semibold">Minutes</div>
                    </div>
                    
                    {/* Seconds */}
                    <div className="py-2 animate-pulse">
                      <div className="text-4xl font-extrabold leading-none tabular-nums">{String(timeLeft.seconds).padStart(2, '0')}</div>
                      <div className="text-xs opacity-90 uppercase tracking-wider mt-1 font-semibold">Seconds</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Carousel Section */}
              <div className="flex-1 min-w-0">
                <Carousel
                  setApi={setApi}
                  plugins={[plugin.current]}
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <CarouselContent className="-ml-4">
                    {DUMMY_HOT_DEALS.map((product) => (
                      <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                        <div className="group relative bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:shadow-2xl hover:border-red-400 transition-all duration-300 h-full hover:-translate-y-1">
                          {/* Image */}
                          <div className="aspect-square relative bg-gray-100 overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            
                            {/* Shine Effect - Sweeps from right to left on hover */}
                            <div className="absolute top-[-50%] right-[-60%] w-[20%] h-[200%] bg-gradient-to-r from-transparent via-white/40 to-transparent rotate-[-35deg] pointer-events-none transition-all duration-700 ease-in-out opacity-0 group-hover:right-[130%] group-hover:opacity-100"></div>
                            
                            {/* Discount Badge - Enhanced */}
                            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform">
                              {product.discount}
                            </div>
                            
                            {/* Hot Deal Stamp */}
                            <div className="absolute top-3 right-3 bg-yellow-400 text-red-700 text-xs font-black px-2 py-1 rounded-full shadow-lg border-2 border-red-600 animate-pulse">
                              🔥 HOT
                            </div>

                            {/* Overlay Actions */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                              <Button 
                                size="icon" 
                                variant="secondary" 
                                className="rounded-full hover:bg-red-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-lg hover:scale-110"
                                title="Add to Cart"
                              >
                                <ShoppingCart className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="secondary" 
                                className="rounded-full hover:bg-red-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75 shadow-lg hover:scale-110"
                                title="Quick View"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-4 bg-gradient-to-b from-white to-gray-50">
                            <h3 className="font-semibold text-gray-800 line-clamp-1 group-hover:text-red-600 transition-colors">
                              {product.name}
                            </h3>
                            <div className="flex items-baseline gap-2 mt-2">
                              <span className="text-xl font-extrabold text-red-600">{product.price}</span>
                              <span className="text-sm text-gray-400 line-through font-medium">{product.originalPrice}</span>
                            </div>
                            {/* Savings Badge */}
                            <div className="mt-2 inline-block bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                              Save ৳{((parseFloat(product.originalPrice.replace('৳', '')) - parseFloat(product.price.replace('৳', ''))))}
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotDeals;

