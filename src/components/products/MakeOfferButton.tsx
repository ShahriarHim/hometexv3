"use client";

import { Button } from "@/components/ui/button";
import { useMakeOffer } from "@/context/MakeOfferContext";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import { CheckCircle2, HandCoins } from "lucide-react";
import { useState } from "react";
import { MakeOfferModal } from "./MakeOfferModal";

interface MakeOfferButtonProps {
  product: Product;
  className?: string;
}

export function MakeOfferButton({ product, className }: MakeOfferButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { getOfferStatus } = useMakeOffer();
  const offerStatus = getOfferStatus(product.id);
  const isSubmitted = offerStatus?.status === "submitted";

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "w-[40px] h-[40px] rounded-[12px] bg-white text-[#333] shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center border-none hover:bg-blue-500 hover:text-white hover:shadow-[0_5px_15px_rgba(59,130,246,0.3)] transition-all duration-300 cursor-pointer pointer-events-auto transform hover:scale-110 p-0",
          isSubmitted && "bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700",
          className
        )}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!isSubmitted) {
            setIsOpen(true);
          }
        }}
        title={isSubmitted ? "Offer Sent" : "Make an Offer"}
      >
        {isSubmitted ? <CheckCircle2 className="w-5 h-5" /> : <HandCoins className="w-5 h-5" />}
      </Button>

      {isOpen && (
        <MakeOfferModal product={product} isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
