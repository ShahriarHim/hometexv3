"use client";

import NextAuthProvider from "@/components/providers/NextAuthProvider";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <NextAuthProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <OrderProvider>
            <CartProvider>
              <WishlistProvider>
                <TooltipProvider>
                  {children}
                  <Toaster />
                  <Sonner />
                </TooltipProvider>
              </WishlistProvider>
            </CartProvider>
          </OrderProvider>
        </AuthProvider>
      </QueryClientProvider>
    </NextAuthProvider>
  );
}
