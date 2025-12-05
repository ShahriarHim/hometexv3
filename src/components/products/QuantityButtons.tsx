"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types";

interface Props {
  product: Product;
}

const QuantityButtons = ({ product }: Props) => {
  const { items, updateQuantity } = useCart();
  
  const cartItem = items.find((item) => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;
  const productStock = product.stock ?? (product.inStock ? 100 : 0);

  const handleDecrease = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (productStock > quantity) {
      updateQuantity(product.id, quantity + 1);
    }
  };

  return (
    <div className="flex items-center gap-2.5">
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 border-2 border-gray-300 hover:border-[#93D991] hover:bg-[#93D991]/10 disabled:opacity-50"
        onClick={handleDecrease}
        disabled={quantity <= 1}
      >
        <Minus className="h-4 w-4 font-bold" />
      </Button>
      <span className="text-base font-bold w-10 text-center text-gray-900">{quantity}</span>
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 border-2 border-[#93D991] bg-[#93D991]/10 hover:bg-[#93D991] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleIncrease}
        disabled={productStock <= quantity}
      >
        <Plus className="h-4 w-4 font-bold" />
      </Button>
    </div>
  );
};

export default QuantityButtons;

