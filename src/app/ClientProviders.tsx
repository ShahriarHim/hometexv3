"use client";

import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { Providers } from "./providers";
import FloatingBar from "@/components/FloatingBar";
import CookiesManager from "@/components/CookiesManager";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function ClientProviders({
  children,
  messages,
}: {
  children: ReactNode;
  messages: Record<string, any>;
}) {
  return (
    <ErrorBoundary>
      <NextIntlClientProvider messages={messages}>
        <Providers>
          {children}
          <FloatingBar />
          <CookiesManager />
        </Providers>
      </NextIntlClientProvider>
    </ErrorBoundary>
  );
}
