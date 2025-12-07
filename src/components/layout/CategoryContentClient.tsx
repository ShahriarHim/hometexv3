"use client";

import { ProductCard } from "@/components/products/ProductCard";
import { Badge } from "@/components/ui/badge";
import { categories, products } from "@/data/demo-data";
import { Link } from "@/i18n/routing";
import type { CategoryTree } from "@/types/api";

interface CategoryContentClientProps {
  slug: string;
  subId: string | null;
  childId: string | null;
  apiCategory: CategoryTree | undefined;
  pageTitle: string;
  pageDescription: string;
}

export function CategoryContentClient({
  slug,
  subId,
  childId,
  apiCategory,
  pageTitle,
  pageDescription,
}: CategoryContentClientProps) {
  // Fallback to demo data if API category not found
  const demoCategory = categories.find((c) => c.slug === slug);

  // Filter products based on category/subcategory/child
  const categoryProducts = demoCategory
    ? products.filter((p) => p.category === demoCategory.slug)
    : products;

  return (
    <>
      {/* Category Hero */}
      <div className="bg-gradient-to-br from-background to-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-sage text-white">{categoryProducts.length} Products</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{pageTitle}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{pageDescription}</p>
        </div>
      </div>

      {/* Subcategories */}
      {demoCategory?.subcategories && demoCategory.subcategories.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {demoCategory.subcategories.map((sub) => (
              <Badge
                key={sub.id}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {sub.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* API Subcategories */}
      {apiCategory && !subId && (
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">Browse by Subcategory</h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {apiCategory.subcategories.map((sub) => (
              <Link
                key={sub.id}
                href={{
                  pathname: `/categories/${slug}`,
                  query: { sub: sub.id.toString() },
                }}
              >
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {sub.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Child Categories */}
      {apiCategory && subId && !childId && (
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">Browse by Type</h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {apiCategory.subcategories
              .find((s) => s.id === Number(subId))
              ?.child_categories.map((child) => (
                <Link
                  key={child.id}
                  href={{
                    pathname: `/categories/${slug}`,
                    query: { sub: subId, child: child.id.toString() },
                  }}
                >
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {child.name}
                  </Badge>
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* Products */}
      <div className="container mx-auto px-4 py-8">
        {categoryProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
