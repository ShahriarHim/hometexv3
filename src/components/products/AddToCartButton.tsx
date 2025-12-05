"use client";

import type { Product } from "@/types";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import PriceFormatter from "./PriceFormatter";
import QuantityButtons from "./QuantityButtons";

interface Props {
  product: Product;
  className?: string;
}

const AddToCartButton = ({ product, className }: Props) => {
  const { items, addToCart, updateQuantity } = useCart();
  
  const cartItem = items.find((item) => item.product.id === product.id);
  const itemCount = cartItem?.quantity || 0;
  const isOutOfStock = !product.inStock;

  const handleAddToCart = () => {
    const productStock = product.stock ?? (product.inStock ? 100 : 0);
    
    if (productStock > itemCount) {
      addToCart(product, 1);
      toast.success(
        `${product?.name?.substring(0, 12)}... added successfully!`
      );
    } else {
      toast.error("Can not add more than available stock");
    }
  };

  return (
    <div className="w-full mt-1">
      {itemCount > 0 ? (
        <div className="text-base w-full space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 font-semibold">Quantity</span>
            <QuantityButtons product={product} />
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-3">
            <span className="text-sm font-bold text-gray-900">Subtotal</span>
            <PriceFormatter
              amount={product?.price ? product?.price * itemCount : 0}
              className="text-[#2d8659] font-bold text-lg"
            />
          </div>
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={cn(
            "w-full h-12 rounded-md bg-[#2d8659] text-white shadow-sm border-0 font-bold text-base tracking-wide hover:bg-[#2d8659]/90 active:bg-[#2d8659]/95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 px-4 py-3",
            className
          )}
        >
          <ShoppingBag className="h-5 w-5" />
          <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;

