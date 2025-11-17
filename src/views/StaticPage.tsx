"use client";

import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

interface StaticPageProps {
  title: string;
  description: string;
  children?: ReactNode;
}

const StaticPage = ({ title, description, children }: StaticPageProps) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1 container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto space-y-6 text-muted-foreground">
        <div>
          <p className="text-sm uppercase tracking-wide text-primary/70">Hometex Bangladesh</p>
          <h1 className="text-4xl font-bold text-foreground mt-2">{title}</h1>
        </div>
        <p className="text-lg">{description}</p>
        {children}
      </div>
    </main>
    <Footer />
  </div>
);

export default StaticPage;

