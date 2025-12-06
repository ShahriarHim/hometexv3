"use client";

import { dealHighlights } from "@/data/migration-content";
import Link from "next/link";

export const DealHighlights = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <h1 className="text-3xl font-bold mb-8 px-4 max-w-7xl mx-auto">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
          Today&apos;s Best Deals
        </span>
      </h1>
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {dealHighlights.map((item) => (
          <div
            key={item.id}
            className={`relative group rounded-xl overflow-hidden h-[180px] bg-gradient-to-r ${item.gradient} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
          >
            {/* Content Layout */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between z-20">
              {/* Text Content */}
              <div className="space-y-1">
                <h2 className="text-white text-2xl font-bold tracking-wider">{item.title}</h2>
                <p className="text-white/90 text-lg font-semibold">{item.subtitle}</p>
              </div>

              {/* Shop Now Button */}
              <Link
                href="/shop"
                className="bg-white w-fit text-black px-6 py-2 rounded-full transform hover:scale-105 transition-all duration-300 hover:shadow-lg text-sm font-medium"
              >
                SHOP NOW
              </Link>
            </div>

            {/* Product Image */}
            <div className="absolute right-0 bottom-0 w-1/2 h-full">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Animated Grid Overlay */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 z-10">
              {[...Array(9)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white/20 transform scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500"
                  style={{
                    transitionDelay: `${index * 30}ms`,
                  }}
                />
              ))}
            </div>

            {/* Animated Lines */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              <div className="absolute left-0 top-0 w-full h-[3px] bg-white/60 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              <div className="absolute left-0 bottom-0 w-full h-[3px] bg-white/60 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              <div className="absolute left-0 top-0 h-full w-[3px] bg-white/60 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <div className="absolute right-0 top-0 h-full w-[3px] bg-white/60 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
