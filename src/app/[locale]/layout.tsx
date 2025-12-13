import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Quicksand } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { env } from "@/lib/env";
import "../globals.css";
import { Providers } from "../providers";
import FloatingBar from "@/components/FloatingBar";
import CookiesManager from "@/components/CookiesManager";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-quicksand",
  weight: ["400", "500", "600", "700"],
});

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
  // Await params (Next.js 15+)
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className={quicksand.variable} suppressHydrationWarning>
      <body
        className="min-h-screen bg-background text-foreground antialiased font-sans"
        suppressHydrationWarning
      >
        <ErrorBoundary>
          <NextIntlClientProvider messages={messages}>
            <Providers>
              {children}
              <FloatingBar />
              <CookiesManager />
            </Providers>
          </NextIntlClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
