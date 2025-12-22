export const dynamic = "force-dynamic";
import { Quicksand } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-quicksand",
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={quicksand.variable} suppressHydrationWarning>
      <body
        className="min-h-screen bg-background text-foreground antialiased font-sans"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
