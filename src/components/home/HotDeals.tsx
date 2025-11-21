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
    <div className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            <span className="text-primary mr-2">Hot Deals!</span>
            Get Our Best Price
          </h2>
          <Link href="/shop" className="text-sm font-medium text-gray-600 hover:text-primary">
            + See All Products
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Timer Section */}
          <div className="w-full md:w-48 lg:w-56 bg-purple-600 rounded-xl p-6 text-white text-center shrink-0 flex flex-col justify-center shadow-lg">
            <div className="mx-auto mb-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-3xl font-bold leading-none">{timeLeft.days}</div>
                <div className="text-xs opacity-80 uppercase tracking-wider mt-1">Days</div>
              </div>
              <div>
                <div className="text-3xl font-bold leading-none">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-xs opacity-80 uppercase tracking-wider mt-1">Hours</div>
              </div>
              <div>
                <div className="text-3xl font-bold leading-none">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="text-xs opacity-80 uppercase tracking-wider mt-1">Minutes</div>
              </div>
              <div>
                <div className="text-3xl font-bold leading-none">{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div className="text-xs opacity-80 uppercase tracking-wider mt-1">Seconds</div>
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
                    <div className="group relative bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                      {/* Image */}
                      <div className="aspect-square relative bg-gray-100 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Discount Badge */}
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                          {product.discount}
                        </div>

                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                          <Button 
                            size="icon" 
                            variant="secondary" 
                            className="rounded-full hover:bg-primary hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300"
                            title="Add to Cart"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="secondary" 
                            className="rounded-full hover:bg-primary hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
                            title="Quick View"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-medium text-gray-800 line-clamp-1 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-lg font-bold text-primary">{product.price}</span>
                          <span className="text-sm text-gray-400 line-through">{product.originalPrice}</span>
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
  );
};

export default HotDeals;

