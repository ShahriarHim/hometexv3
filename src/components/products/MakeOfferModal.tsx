"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCurrency } from "@/context/CurrencyContext";
import { useMakeOffer } from "@/context/MakeOfferContext";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import { CheckCircle2, DollarSign, Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import PriceFormatter from "./PriceFormatter";

interface MakeOfferModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function MakeOfferModal({ product, isOpen, onClose }: MakeOfferModalProps) {
  const { submitOffer } = useMakeOffer();
  const { symbol, convertPrice } = useCurrency();
  const [price, setPrice] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPrice("");
      setQuantity(1);
      setMessage("");
      setIsSuccess(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const currentPrice = product.price || 0;
  const minPriceBase = Math.floor(currentPrice * 0.5);
  const maxPriceBase = currentPrice;

  const minPrice = Math.round(convertPrice(minPriceBase));
  const maxPrice = Math.round(convertPrice(maxPriceBase));

  const numericPrice = parseFloat(price);
  const isValidPrice = !isNaN(numericPrice) && numericPrice >= minPrice && numericPrice <= maxPrice;
  const isValidQuantity = quantity >= 1;
  const isValid = isValidPrice && isValidQuantity;

  const handleSubmit = async () => {
    if (!isValid) {
      return;
    }

    setIsSubmitting(true);
    await submitOffer(product.id, numericPrice, quantity, message);
    setIsSubmitting(false);
    setIsSuccess(true);

    setTimeout(() => {
      onClose();
    }, 2500);
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl p-0 gap-0 overflow-hidden bg-white border-0 shadow-2xl flex flex-col md:flex-row h-[600px] md:h-[500px]">
        {/* Close Button Mobile/Desktop */}
        <button
          onClick={onClose}
          aria-label="Close"
          className={cn(
            "absolute right-0 top-0 z-50 flex h-10 w-10 items-center justify-center",
            "rounded-bl-2xl bg-primary text-primary-foreground",
            "transition duration-150 ease-out",
            "hover:opacity-90 hover:translate-y-[1px] hover:translate-x-[-1px]",
            "active:translate-y-[2px] active:translate-x-[-2px]"
          )}
        >
          <X className="h-4 w-4" />
        </button>

        {/* Left Side: Product Image (40%) */}
        <div className="w-full md:w-[40%] bg-gray-50 relative flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-gray-100 h-[200px] md:h-auto">
          <div className="relative w-full h-full max-h-[300px] flex items-center justify-center">
            {product.primary_photo || product.images?.[0] ? (
              <Image
                src={product.primary_photo || product.images?.[0] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-contain mix-blend-multiply"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                <DollarSign className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>
          <div className="mt-4 text-center hidden md:block">
            <h3 className="font-semibold text-gray-900 line-clamp-2 px-4">{product.name}</h3>
            <p className="text-gray-500 mt-1">
              Ref Price:{" "}
              <PriceFormatter amount={product.price} className="font-medium text-gray-900" />
            </p>
          </div>
        </div>

        {/* Right Side: Form (60%) */}
        <div className="w-full md:w-[60%] flex flex-col bg-white h-auto md:h-full">
          {!isSuccess ? (
            <div className="flex-1 flex flex-col p-6 md:p-8 overflow-y-auto">
              <DialogHeader className="mb-6 text-left">
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  Make an Offer
                </DialogTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Negotiate directly with the seller. Current market price is{" "}
                  <PriceFormatter amount={product.price} className="font-semibold text-gray-700" />.
                </p>
              </DialogHeader>

              <div className="space-y-4 flex-1">
                {/* Quantity Input */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Quantity</Label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 shrink-0 border-gray-200"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="h-10 text-center text-lg font-medium w-24"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 shrink-0 border-gray-200"
                      onClick={() => handleQuantityChange(1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Price Input */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Your Offer Price (Per Item)
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-2.5 h-6 w-6 flex items-center justify-center text-gray-400 font-bold">
                      {symbol}
                    </div>
                    <Input
                      type="number"
                      placeholder={`${minPrice} - ${maxPrice}`}
                      className={cn(
                        "pl-10 h-12 text-lg font-medium",
                        price && !isValidPrice ? "border-red-300 focus-visible:ring-red-200" : ""
                      )}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                  {price && !isValidPrice && (
                    <p className="text-xs text-red-500 font-medium">
                      Offer must be between {minPrice}
                      {symbol} and {maxPrice}
                      {symbol}
                    </p>
                  )}
                  {isValidPrice && quantity > 1 && (
                    <p className="text-xs text-gray-500 text-right">
                      Total Offer: {symbol}
                      {(numericPrice * quantity).toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Message Input */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Message to Seller</Label>
                  <Textarea
                    className="resize-none min-h-[60px]"
                    placeholder="I am interested in buying this..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-400 text-right">{message.length}/200</p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-11"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 h-11 bg-black text-white hover:bg-gray-800 transition-all font-medium"
                  onClick={handleSubmit}
                  disabled={!isValid || isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Submit Offer"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Offer Sent!</h3>
              <p className="text-gray-500 max-w-xs mx-auto">
                Your offer of{" "}
                <strong>
                  {symbol}
                  {(numericPrice * quantity).toLocaleString()}
                </strong>{" "}
                for {quantity} item(s) has been sent to the seller.
              </p>
              <Button className="mt-8 min-w-[140px]" onClick={onClose}>
                Done
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
