"use client";

import { useMemo, useState } from "react";
import { featuredProducts, newProducts, products } from "@/data/demo-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bath, BedDouble, Leaf, Sparkles } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/types";

const tabConfig = [
  { id: "all", label: "All Products", icon: Sparkles },
  { id: "bedding", label: "Bedding", icon: BedDouble },
  { id: "bath", label: "Bath", icon: Bath },
  { id: "living-decor", label: "Living Décor", icon: Leaf },
  { id: "new", label: "New In", icon: ArrowRight },
];

export const ProductShowcaseTabs = () => {
  const [value, setValue] = useState(tabConfig[0].id);

  const grouped = useMemo<Record<string, Product[]>>(() => {
    const mapping: Record<string, Product[]> = {
      all: featuredProducts,
      bedding: products.filter((item) => item.category === "bedding"),
      bath: products.filter((item) => item.category === "bath"),
      "living-decor": products.filter((item) => item.category === "living-decor"),
      new: newProducts,
    };
    return mapping;
  }, []);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4">
        <div className="flex flex-col lg:flex-row justify-between gap-6 lg:items-end">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Hot Swaps
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              Mix & Match Capsules
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Tap through curated edits by category. Every edit includes quick-view, wishlist, and cart shortcuts powered by our new contexts.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/shop">
              Explore All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Tabs value={value} onValueChange={setValue} className="mt-10">
          <TabsList className="flex flex-wrap gap-3 bg-transparent p-0">
            {tabConfig.map((tab) => {
              const Icon = tab.icon;
              const isActive = value === tab.id;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all data-[state=active]:bg-foreground data-[state=active]:text-background"
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {!isActive && (
                    <span className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
                      {grouped[tab.id]?.length || 0}
                    </span>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {tabConfig.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-8">
              <Carousel
                opts={{ align: "start", loop: true }}
                className="relative"
              >
                <CarouselContent>
                  {(grouped[tab.id] || []).map((product) => (
                    <CarouselItem
                      key={product.id}
                      className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                    >
                      <ProductCard product={product} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

