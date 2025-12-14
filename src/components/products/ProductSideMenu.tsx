"use client";

import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import { Heart } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

const ProductSideMenu = ({ product, className }: { product: Product; className?: string }) => {
  const { items, addToWishlist, removeFromWishlist } = useWishlist();

  // Use useMemo to compute derived state instead of useEffect
  const isInWishlist = useMemo(() => {
    return items.some((item) => item.product.id === product.id);
  }, [product.id, items]);

  const handleFavorite = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast.success("Product removed successfully!");
    } else {
      addToWishlist(product);
      toast.success("Product added successfully!");
    }
  };

  return (
    <div className={cn("absolute top-2 right-2 z-10 hover:cursor-pointer", className)}>
      <div
        onClick={handleFavorite}
        className={`p-2 rounded-full transition-all duration-200 ${
          isInWishlist
            ? "bg-accent text-accent-foreground shadow-sm"
            : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50"
        }`}
      >
        <Heart
          size={16}
          fill={isInWishlist ? "currentColor" : "none"}
          strokeWidth={2}
          className={isInWishlist ? "text-white" : "text-gray-900"}
        />
      </div>
    </div>
  );
};

export default ProductSideMenu;
