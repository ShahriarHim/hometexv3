"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CurrencyCode = "USD" | "GBP" | "BDT";

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  formatPrice: (amount: number | undefined) => string;
  convertPrice: (amount: number) => number;
  symbol: string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const SYMBOLS: Record<CurrencyCode, string> = {
  USD: "$",
  GBP: "£",
  BDT: "৳",
};

// Assuming base prices in database are in BDT based on existing code using ৳ default?
// Wait, typically base is one currency. The existing code hardcoded ৳.
// So let's assume BASE is BDT.
// If base is BDT:
const RATES_FROM_BDT: Record<CurrencyCode, number> = {
  BDT: 1,
  USD: 1 / 120, // 1 USD = 120 BDT
  GBP: 1 / 150, // 1 GBP = ~150 BDT
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyCode>("BDT"); // Default to BDT as per previous hardcoding

  useEffect(() => {
    const saved = localStorage.getItem("selectedCurrency") as CurrencyCode;
    if (saved && RATES_FROM_BDT[saved]) {
      setCurrency(saved);
    }
  }, []);

  const handleSetCurrency = (code: CurrencyCode) => {
    setCurrency(code);
    localStorage.setItem("selectedCurrency", code);
  };

  const convertPrice = (amount: number) => {
    return amount * RATES_FROM_BDT[currency];
  };

  const formatPrice = (amount: number | undefined) => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return `${SYMBOLS[currency]}0`;
    }
    const converted = convertPrice(amount);

    // For BDT we usually don't use decimals, for USD/GBP we do
    const formatted =
      currency === "BDT"
        ? Math.round(converted).toLocaleString()
        : converted.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

    return `${SYMBOLS[currency]}${formatted}`;
  };

  // Prevent hydration mismatch by rendering children only after mount or handling it effectively.
  // Although for SEO we might want server rendering. But this is client preference.
  // We can just return children but key parts might flicker.
  // For now simple approach.

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency: handleSetCurrency,
        formatPrice,
        convertPrice,
        symbol: SYMBOLS[currency],
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
