"use client";

import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import PriceFormatter from "./PriceFormatter";
import QuantityButtons from "./QuantityButtons";

interface Props {
  product: Product;
  className?: string;
}

const AddToCartButton = ({ product, className }: Props) => {
  const { items, addToCart, updateQuantity: _updateQuantity } = useCart();

  const cartItem = items.find((item) => item.product.id === product.id);
  const itemCount = cartItem?.quantity || 0;

  // Helper to extract numeric price from string or number
  const getNumericPrice = (price: number | string | undefined): number => {
    if (typeof price === "number") {
      return price;
    }
    if (typeof price === "string") {
      const cleaned = price.replace(/[^0-9.]/g, "");
      const parsed = parseFloat(cleaned);
      return !isNaN(parsed) && parsed > 0 ? parsed : 0;
    }
    return 0;
  };

  // Determine stock - handle both number stock and boolean inStock
  const productStock =
    typeof product.stock === "number"
      ? product.stock
      : product.inStock === true
        ? 100
        : product.inStock === false
          ? 0
          : 50;

  const isOutOfStock = productStock === 0;
  const numericPrice = getNumericPrice(product.price);

  const handleAddToCart = () => {
    if (productStock > itemCount) {
      addToCart(product, 1);
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
              amount={numericPrice * itemCount}
              className="text-price font-bold text-lg"
            />
          </div>
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={cn(
            "w-full h-12 rounded-md bg-accent text-accent-foreground shadow-sm border-0 font-bold text-base tracking-wide hover:bg-accent-hover active:bg-accent-hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 px-4 py-3",
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
