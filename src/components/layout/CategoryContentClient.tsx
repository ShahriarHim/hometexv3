"use client";

import { ProductCard } from "@/components/products/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import { transformAPIProductToProduct } from "@/lib/transforms";
import { productService } from "@/services/api";
import type { Product } from "@/types";
import type { CategoryTree } from "@/types/api";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CategoryPageSkeleton } from "./CategoryPageSkeleton";

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!apiCategory) {
        setLoading(false);
        return;
      }

      // Validate that subId and childId exist in the category tree
      if (subId) {
        const sub = apiCategory.subcategories.find((s) => s.id === Number(subId));
        if (!sub) {
          console.warn(`Subcategory ${subId} not found in category ${apiCategory.id}`);
          setProducts([]);
          setLoading(false);
          return;
        }

        if (childId) {
          const child = sub.child_categories.find((c) => c.id === Number(childId));
          if (!child) {
            console.warn(`Child category ${childId} not found in subcategory ${subId}`);
            setProducts([]);
            setLoading(false);
            return;
          }
        }
      }

      setLoading(true);
      try {
        const params: {
          category_id: number;
          sub_category?: number;
          child_sub_category_id?: number;
        } = {
          category_id: apiCategory.id,
        };

        if (subId) {
          params.sub_category = Number(subId);
        }

        if (childId) {
          params.child_sub_category_id = Number(childId);
        }

        const response = await productService.getProducts(params);

        if (response.success && response.data?.products) {
          const transformedProducts = response.data.products.map((apiProduct) =>
            transformAPIProductToProduct(
              apiProduct as Parameters<typeof transformAPIProductToProduct>[0]
            )
          );
          setProducts(transformedProducts);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [apiCategory, subId, childId]);

  // Get the current category image
  let categoryImage: string | null = null;
  if (apiCategory) {
    if (childId && subId) {
      const sub = apiCategory.subcategories.find((s) => s.id === Number(subId));
      const child = sub?.child_categories.find((c) => c.id === Number(childId));
      categoryImage = child?.image || null;
    } else if (subId) {
      const sub = apiCategory.subcategories.find((s) => s.id === Number(subId));
      categoryImage = sub?.image || null;
    } else {
      categoryImage = apiCategory.image || null;
    }
  }

  if (loading) {
    return <CategoryPageSkeleton />;
  }

  if (!apiCategory) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground text-lg">Category not found.</p>
      </div>
    );
  }

  return (
    <>
      {/* Category Hero */}
      <div className="bg-gradient-to-br from-background to-muted py-16">
        <div className="container mx-auto px-4 text-center">
          {categoryImage && (
            <div className="mb-6 flex justify-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <Image
                  src={categoryImage}
                  alt={pageTitle}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
            </div>
          )}
          <Badge className="mb-4 bg-sage text-white">{products.length} Products</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{pageTitle}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{pageDescription}</p>
        </div>
      </div>

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
        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
