export const dynamic = "force-dynamic";
import CookiesManager from "@/components/CookiesManager";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import FloatingBar from "@/components/FloatingBar";
import { routing } from "@/i18n/routing";
import { env } from "@/lib/env";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import "../globals.css";
import { Providers } from "../providers";

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: "Hometex Bangladesh - Premium Textiles for Bedding, Bath & Home Décor",
  description:
    "Shop premium quality textiles at Hometex Bangladesh. Discover luxurious bedding, bath essentials, kitchen linens, and home décor. Free shipping on orders over BDT 3,000.",
  openGraph: {
    title: "Hometex Bangladesh - Premium Home Textiles",
    description: "Discover premium bedding, bath essentials, and home décor at Hometex Bangladesh",
    images: ["/images/hero-bedroom.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@HometexBD",
    images: ["/images/hero-bedroom.jpg"],
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages({ locale });

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
