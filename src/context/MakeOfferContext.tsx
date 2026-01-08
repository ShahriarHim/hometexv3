"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export interface Offer {
  productId: string;
  price: number;
  quantity: number;
  message?: string;
  status: "submitted" | "rejected" | "accepted";
  timestamp: number;
}

interface MakeOfferContextType {
  offers: Record<string, Offer>;
  submitOffer: (
    productId: string,
    price: number,
    quantity: number,
    message?: string
  ) => Promise<boolean>;
  getOfferStatus: (productId: string) => Offer | undefined;
}

const MakeOfferContext = createContext<MakeOfferContextType | undefined>(undefined);

export function MakeOfferProvider({ children }: { children: ReactNode }) {
  const [offers, setOffers] = useState<Record<string, Offer>>({});

  const submitOffer = async (
    productId: string,
    price: number,
    quantity: number,
    message?: string
  ) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock logic: Always accept for now (or just mark as submitted)
    setOffers((prev) => ({
      ...prev,
      [productId]: {
        productId,
        price,
        quantity,
        message,
        status: "submitted",
        timestamp: Date.now(),
      },
    }));

    return true;
  };

  const getOfferStatus = (productId: string) => offers[productId];

  return (
    <MakeOfferContext.Provider value={{ offers, submitOffer, getOfferStatus }}>
      {children}
    </MakeOfferContext.Provider>
  );
}

export function useMakeOffer() {
  const context = useContext(MakeOfferContext);
  if (context === undefined) {
    throw new Error("useMakeOffer must be used within a MakeOfferProvider");
  }
  return context;
}
