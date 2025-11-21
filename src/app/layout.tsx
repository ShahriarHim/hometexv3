import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import FloatingBar from "@/components/FloatingBar";
import CookiesManager from "@/components/CookiesManager";

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-quicksand",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={quicksand.variable}>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        <Providers>
          {children}
          <FloatingBar />
          <CookiesManager />
        </Providers>
      </body>
    </html>
  );
}

