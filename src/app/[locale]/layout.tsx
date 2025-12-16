export const dynamic = 'force-dynamic';
import ClientProviders from "../ClientProviders";
import { routing } from "@/i18n/routing";
import { env } from "@/lib/env";
import type { Metadata } from "next";
import { getMessages } from "next-intl/server";
import { Quicksand } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import "../globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-quicksand",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: env.siteUrl ? new URL(env.siteUrl) : undefined,
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
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages({ locale }).catch(() => ({}));

  return (
    <html lang={locale} className={quicksand.variable} suppressHydrationWarning>
      <body
        className="min-h-screen bg-background text-foreground antialiased font-sans"
        suppressHydrationWarning
      >
        <ClientProviders messages={messages}>
          {children}
        </ClientProviders>

      </body>
    </html>
  );
}
