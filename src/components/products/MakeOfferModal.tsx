"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMakeOffer } from "@/context/MakeOfferContext";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import { CheckCircle2, DollarSign } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import PriceFormatter from "./PriceFormatter";

interface MakeOfferModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function MakeOfferModal({ product, isOpen, onClose }: MakeOfferModalProps) {
  const { submitOffer } = useMakeOffer();
  const [price, setPrice] = useState<string>("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const currentPrice = product.price || 0;
  // Floor: 50% of price, Ceiling: Current price
  const minPrice = Math.floor(currentPrice * 0.5);
  const maxPrice = currentPrice;

  const numericPrice = parseFloat(price);
  const isValid = !isNaN(numericPrice) && numericPrice >= minPrice && numericPrice <= maxPrice;

  const handleSubmit = async () => {
    if (!isValid) {
      return;
    }

    setIsSubmitting(true);
    await submitOffer(product.id, numericPrice, message);
    setIsSubmitting(false);
    setIsSuccess(true);

    // Auto close after brief success show
    setTimeout(() => {
      onClose();
      setIsSuccess(false); // Reset for next time if inspected again
      setPrice("");
      setMessage("");
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md gap-0 p-0 overflow-hidden bg-white border-0 shadow-2xl">
        <div className="p-6 pb-0">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl">Make an Offer</DialogTitle>
            <DialogDescription>
              Suggest a price for this item. We&apos;ll review it instantly.
            </DialogDescription>
          </DialogHeader>

          {/* Product Snapshot */}
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg mb-6 border border-gray-100">
            <div className="relative w-16 h-16 rounded-md overflow-hidden bg-white border border-gray-200 shrink-0">
              {product.primary_photo || product.images?.[0] ? (
                <Image
                  src={product.primary_photo || product.images?.[0] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-contain p-1"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-gray-300" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h4 className="font-medium text-sm line-clamp-1 text-gray-900">{product.name}</h4>
              <p className="text-sm text-gray-500 mt-0.5">
                Current:{" "}
                <PriceFormatter amount={product.price} className="text-gray-900 font-semibold" />
              </p>
            </div>
          </div>

          {!isSuccess ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Your Offer</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    type="number"
                    placeholder={`${minPrice} - ${maxPrice}`}
                    className={cn(
                      "pl-10 h-11 text-lg font-medium",
                      price && !isValid ? "border-red-300 focus-visible:ring-red-200" : ""
                    )}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                {price && !isValid && (
                  <p className="text-xs text-red-500 font-medium animate-in slide-in-from-top-1">
                    Offer must be between {minPrice}৳ and {maxPrice}৳
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Message (Optional)</label>
                <Input
                  className="h-10"
                  placeholder="I love this! Would you accept..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={100}
                />
                <p className="text-xs text-gray-400 text-right">{message.length}/100</p>
              </div>
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Offer Sent!</h3>
              <p className="text-gray-500">Good luck! We&apos;ll notify you if accepted.</p>
            </div>
          )}
        </div>

        {!isSuccess && (
          <DialogFooter className="p-6 bg-gray-50/50 mt-6 border-t border-gray-100 flex-row gap-2 sm:gap-2">
            <Button
              variant="outline"
              className="flex-1 border-gray-300"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSubmit} disabled={!isValid || isSubmitting}>
              {isSubmitting ? "Sending..." : "Submit Offer"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
