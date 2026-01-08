"use client";

import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { transformAPIProductToProduct } from "@/lib/transforms";
import { productService } from "@/services/api/product.service";
import type { Product } from "@/types";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CategoryTab {
  id: string;
  label: string;
  slug: string | null;
  categoryId: number | null;
  icon: typeof Sparkles;
}

export const ProductShowcaseTabs = () => {
  const [tabs, setTabs] = useState<CategoryTab[]>([
    { id: "all", label: "All Products", slug: null, categoryId: null, icon: Sparkles },
  ]);
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({});
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await productService.getRootCategories();

        if (response.success && response.data) {
          const activeCategories = response.data.filter((cat) => cat.is_active);

          const categoryTabs: CategoryTab[] = [
            { id: "all", label: "All Products", slug: null, categoryId: null, icon: Sparkles },
            ...activeCategories.map((cat) => ({
              id: cat.slug,
              label: cat.name,
              slug: cat.slug,
              categoryId: cat.id,
              icon: Sparkles,
            })),
          ];
          setTabs(categoryTabs);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!isLoadingCategories && selectedTab && tabs.length > 0) {
      const selectedTabData = tabs.find((tab) => tab.id === selectedTab);
      if (!selectedTabData) {
        return;
      }

      const categoryId = selectedTabData.categoryId;
      const cacheKey = selectedTab;

      if (productsByCategory[cacheKey] || loadingProducts[cacheKey]) {
        return;
      }

      const fetchProducts = async () => {
        try {
          setLoadingProducts((prev) => ({ ...prev, [cacheKey]: true }));
          const params: Parameters<typeof productService.getProducts>[0] = {
            per_page: 20,
          };

          if (categoryId) {
            params.category_id = categoryId;
          }

          const response = await productService.getProducts(params);

          if (response.success && response.data.products) {
            const transformedProducts = response.data.products.map((apiProduct) =>
              transformAPIProductToProduct(apiProduct)
            );
            const inStockProducts = transformedProducts.filter((product) => product.inStock);

            setProductsByCategory((prev) => ({
              ...prev,
              [cacheKey]: inStockProducts,
            }));
          } else {
            console.warn(`No products returned for category ${categoryId || "all"}`, response);
          }
        } catch (err) {
          console.error(`Error fetching products for category ${categoryId || "all"}:`, err);
        } finally {
          setLoadingProducts((prev) => ({ ...prev, [cacheKey]: false }));
        }
      };

      fetchProducts();
    }
  }, [selectedTab, isLoadingCategories, tabs, loadingProducts, productsByCategory]);

  const handleTabChange = (newValue: string) => {
    setSelectedTab(newValue);
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4">
        <div className="flex flex-col lg:flex-row justify-between gap-6 lg:items-end">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Featured Collections
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              Curated Collections
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Explore our handpicked selections across every category. Discover designs that elevate
              your living space.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/products">
              Explore All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Tabs value={selectedTab} onValueChange={handleTabChange} className="mt-10">
          {isLoadingCategories ? (
            <div className="flex items-center justify-center min-h-[100px]">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <TabsList className="flex flex-wrap gap-3 bg-transparent p-0">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all data-[state=active]:bg-foreground data-[state=active]:text-background"
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {tabs.map((tab) => {
                const cacheKey = tab.id;
                const products = productsByCategory[cacheKey] || [];
                const isLoading = loadingProducts[cacheKey] || false;

                return (
                  <TabsContent key={tab.id} value={tab.id} className="mt-8">
                    {isLoading ? (
                      <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                          <p className="mt-4 text-gray-600">Loading products...</p>
                        </div>
                      </div>
                    ) : products.length === 0 ? (
                      <div className="flex items-center justify-center min-h-[400px]">
                        <p className="text-muted-foreground">
                          No products available in this category.
                        </p>
                      </div>
                    ) : (
                      <Carousel opts={{ align: "start", loop: true }} className="relative">
                        <CarouselContent>
                          {products.map((product) => (
                            <CarouselItem
                              key={product.id}
                              className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                            >
                              <ProductCard product={product} />
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>
                    )}
                  </TabsContent>
                );
              })}
            </>
          )}
        </Tabs>
      </div>
    </section>
  );
};
