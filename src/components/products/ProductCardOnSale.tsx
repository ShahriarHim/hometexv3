"use client";

import type { Product } from "@/types";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { Flame, Star } from "lucide-react";
import PriceView from "./PriceView";
import Title from "./Title";
import ProductSideMenu from "./ProductSideMenu";
import AddToCartButton from "./AddToCartButton";

const ProductCardOnSale = ({ product }: { product: Product }) => {
  const stock = product.stock ?? (product.inStock ? 100 : 0);
  const discount = product.discount || 0;
  const status = discount > 0 ? "sale" : "trending";

  return (
    <div className="text-sm border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300 group overflow-hidden">
      <div className="relative overflow-hidden bg-gray-50 rounded-t-lg">
        {product?.images && product.images.length > 0 && (
          <Link
            href={
              `/products/${product.category}/${product.subcategory || "all"}/${product.id}` as any
            }
          >
            <div className="relative w-full h-64 bg-gray-50 flex items-center justify-center">
              <Image
                src={product.images[0]}
                alt={product.name || "productImage"}
                width={500}
                height={500}
                priority
                className={`w-full h-full object-contain transition-transform duration-500 
                ${stock !== 0 ? "group-hover:scale-105" : "opacity-50"}`}
              />
              {/* Stock Indicator - Modern overlay */}
              {stock > 0 && (
                <div className="absolute bottom-2 right-2 z-10 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-full px-3 py-1.5 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#93D991] animate-pulse"></div>
                    <span className="text-xs font-bold text-[#2d8659]">{stock} in stock</span>
                  </div>
                </div>
              )}
              {stock === 0 && (
                <div className="absolute bottom-2 right-2 z-10 bg-red-500/95 backdrop-blur-sm border border-red-600 rounded-full px-3 py-1.5 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                    <span className="text-xs font-bold text-white">Out of stock</span>
                  </div>
                </div>
              )}
            </div>
          </Link>
        )}
        <ProductSideMenu product={product} />
        {status === "sale" ? (
          <p className="absolute top-2 left-2 z-10 text-sm border-2 border-gray-400 bg-white px-3.5 py-1.5 rounded-full font-bold text-gray-900 shadow-md">
            Sale!
          </p>
        ) : (
          <Link
            href={"/deal"}
            className="absolute top-2 left-2 z-10 border-2 border-[#fb6c08] bg-white/95 backdrop-blur-sm p-2 rounded-full hover:bg-[#fb6c08]/10 transition-colors shadow-md"
          >
            <Flame size={20} fill="#fb6c08" className="text-[#fb6c08]" />
          </Link>
        )}
      </div>
      <div className="p-5 flex flex-col gap-3.5">
        {product.category && (
          <p className="uppercase line-clamp-1 text-sm font-semibold text-gray-600 tracking-wider">
            {product.category}
          </p>
        )}
        <Link
          href={
            `/products/${product.category}/${product.subcategory || "all"}/${product.id}` as any
          }
          className="hover:text-[#2d8659] transition-colors"
        >
          <Title className="text-base line-clamp-2 font-bold text-gray-900 leading-snug">
            {product?.name}
          </Title>
        </Link>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={`h-5 w-5 ${
                  index < Math.floor(product.rating || 4)
                    ? "text-[#93D991] fill-[#93D991]"
                    : "text-gray-300 fill-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-gray-600 text-sm font-medium">{product.reviewCount || 5} Reviews</p>
        </div>
        <PriceView
          price={product?.price}
          originalPrice={product?.originalPrice}
          discount={discount}
          className="text-sm"
        />
        <AddToCartButton product={product} className="w-full" />
      </div>
    </div>
  );
};

export default ProductCardOnSale;
