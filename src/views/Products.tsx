"use client";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchPublicWithFallback } from "@/lib/api";
import { env } from "@/lib/env";
import { productService } from "@/services/api";
import type { Product } from "@/types";
import type { CategoryTree } from "@/types/api";
import { Grid3x3, LayoutGrid, List, Loader2, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type ViewMode = "grid-5" | "grid-3" | "list";

interface APIProduct {
  id: number;
  name: string;
  slug: string;
  price?: string | number;
  original_price?: number;
  regular_price?: number;
  final_price?: number;
  sell_price?: {
    price?: number;
    discount?: number;
    symbol?: string;
  };
  stock?: number;
  stock_quantity?: number;
  stock_status?: string;
  primary_photo?: string;
  images?: string[];
  thumbnail?: string;
  description?: string;
  short_description?: string;
  discount_percent?: number | string;
  rating?: number;
  reviews_count?: number;
  isNew?: number | boolean;
  is_new?: boolean;
  isFeatured?: number | boolean;
  is_featured?: boolean;
  category?: {
    slug?: string;
    name?: string;
  };
  sub_category?: {
    slug?: string;
    name?: string;
  };
  child_sub_category?: {
    slug?: string;
    name?: string;
  };
}

interface APIResponse {
  success: boolean;
  message: string;
  data: {
    products: APIProduct[];
  };
}

const Products = () => {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter");
  const isTrending = filterParam === "trending";
  const isBestsellers = filterParam === "bestsellers";
  const isOnSale = filterParam === "onsale";

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid-3");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryTree[]>([]);
  const [loading, setLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productService.getMenu();
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isTrending) {
      const fetchTrendingProducts = async () => {
        try {
          setLoading(true);
          const response = await fetchPublicWithFallback("/api/products/trending", env.apiBaseUrl);

          if (!response.ok) {
            throw new Error("Failed to fetch trending products");
          }

          const data: APIResponse = await response.json();

          if (data.success && data.data.products) {
            const transformedProducts: Product[] = data.data.products.map((product) => {
              const discountPercent = product.sell_price?.discount || 0;
              const originalPrice = product.original_price || product.sell_price?.price || 0;
              const salePrice = product.sell_price?.price || 0;

              return {
                id: product.id.toString(),
                name: product.name,
                slug: product.slug,
                price: salePrice,
                originalPrice: discountPercent > 0 ? originalPrice : undefined,
                description: "",
                category:
                  product.category?.slug ||
                  product.category?.name?.toLowerCase().replace(/\s+/g, "-") ||
                  "product",
                subcategory:
                  product.sub_category?.slug ||
                  product.sub_category?.name?.toLowerCase().replace(/\s+/g, "-") ||
                  "all",
                childSubcategory: product.child_sub_category?.slug,
                images: product.primary_photo ? [product.primary_photo] : ["/placeholder.svg"],
                inStock: (product.stock ?? 0) > 0,
                rating: 4.0,
                reviewCount: 5,
                discount: discountPercent > 0 ? discountPercent : undefined,
                isNew: false,
                isFeatured: false,
                stock: product.stock,
              };
            });

            // Filter out out-of-stock items
            const inStockProducts = transformedProducts.filter(
              (product) => (product.stock ?? 0) > 0 && product.inStock
            );

            setApiProducts(inStockProducts);
            setHasMore(false);
            setPage(1);
          }
        } catch (err) {
          console.error("Error fetching trending products:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchTrendingProducts();
    } else if (isBestsellers) {
      const fetchBestsellersProducts = async () => {
        try {
          setLoading(true);
          const response = await fetchPublicWithFallback(
            "/api/products/bestsellers",
            env.apiBaseUrl
          );

          if (!response.ok) {
            throw new Error("Failed to fetch bestsellers products");
          }

          const data: APIResponse = await response.json();

          if (data.success && data.data.products) {
            const transformedProducts: Product[] = data.data.products.map((product) => {
              const discountPercent = product.sell_price?.discount || 0;
              const originalPrice = product.original_price || product.sell_price?.price || 0;
              const salePrice = product.sell_price?.price || 0;

              return {
                id: product.id.toString(),
                name: product.name,
                slug: product.slug,
                price: salePrice,
                originalPrice: discountPercent > 0 ? originalPrice : undefined,
                description: "",
                category:
                  product.category?.slug ||
                  product.category?.name?.toLowerCase().replace(/\s+/g, "-") ||
                  "product",
                subcategory:
                  product.sub_category?.slug ||
                  product.sub_category?.name?.toLowerCase().replace(/\s+/g, "-") ||
                  "all",
                childSubcategory: product.child_sub_category?.slug,
                images: product.primary_photo ? [product.primary_photo] : ["/placeholder.svg"],
                inStock: (product.stock ?? 0) > 0,
                rating: 4.0,
                reviewCount: 5,
                discount: discountPercent > 0 ? discountPercent : undefined,
                isNew: false,
                isFeatured: false,
                stock: product.stock,
              };
            });

            // Filter out out-of-stock items
            const inStockProducts = transformedProducts.filter(
              (product) => (product.stock ?? 0) > 0 && product.inStock
            );

            setApiProducts(inStockProducts);
            setHasMore(false);
            setPage(1);
          }
        } catch (err) {
          console.error("Error fetching bestsellers products:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchBestsellersProducts();
    } else if (isOnSale) {
      const fetchOnSaleProducts = async () => {
        try {
          setLoading(true);
          const response = await fetchPublicWithFallback("/api/products/on-sale", env.apiBaseUrl);

          if (!response.ok) {
            throw new Error("Failed to fetch on-sale products");
          }

          const data: APIResponse = await response.json();

          if (data.success && data.data.products) {
            const transformedProducts: Product[] = data.data.products.map((product) => {
              const discountPercent = product.sell_price?.discount || 0;
              const originalPrice = product.original_price || product.sell_price?.price || 0;
              const salePrice = product.sell_price?.price || 0;

              return {
                id: product.id.toString(),
                name: product.name,
                slug: product.slug,
                price: salePrice,
                originalPrice: discountPercent > 0 ? originalPrice : undefined,
                description: "",
                category:
                  product.category?.slug ||
                  product.category?.name?.toLowerCase().replace(/\s+/g, "-") ||
                  "product",
                subcategory:
                  product.sub_category?.slug ||
                  product.sub_category?.name?.toLowerCase().replace(/\s+/g, "-") ||
                  "all",
                childSubcategory: product.child_sub_category?.slug,
                images: product.primary_photo ? [product.primary_photo] : ["/placeholder.svg"],
                inStock: (product.stock ?? 0) > 0,
                rating: 4.0,
                reviewCount: 5,
                discount: discountPercent > 0 ? discountPercent : undefined,
                isNew: false,
                isFeatured: false,
                stock: product.stock,
              };
            });

            // Filter out out-of-stock items
            const inStockProducts = transformedProducts.filter(
              (product) => (product.stock ?? 0) > 0 && product.inStock
            );

            setApiProducts(inStockProducts);
            setHasMore(false);
            setPage(1);
          }
        } catch (err) {
          console.error("Error fetching on-sale products:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchOnSaleProducts();
    } else {
      const fetchAllProducts = async (pageToFetch = 1) => {
        try {
          if (pageToFetch === 1) {
            setLoading(true);
            setHasMore(true);
          } else {
            setLoadingMore(true);
          }

          const response = await productService.getProducts({
            page: pageToFetch,
            per_page: 20,
          });

          if (response.success && response.data?.products) {
            const transformedProducts: Product[] = response.data.products.map(
              (product: APIProduct) => {
                // Consistent with other blocks: use sell_price and original_price
                const discountPercent = product.sell_price?.discount || 0;
                const originalPrice = product.original_price || product.sell_price?.price || 0;
                const salePrice = product.sell_price?.price || 0;

                // Handle category - API returns object with slug/name
                const categorySlug =
                  product.category?.slug ||
                  product.category?.name?.toLowerCase().replace(/\s+/g, "-") ||
                  "product";

                // Handle subcategory
                const subcategorySlug =
                  product.sub_category?.slug ||
                  product.sub_category?.name?.toLowerCase().replace(/\s+/g, "-") ||
                  "all";

                // Handle images - API has primary_photo or images array
                const images = product.primary_photo
                  ? [product.primary_photo]
                  : product.images && product.images.length > 0
                    ? product.images
                    : ["/placeholder.svg"];

                // Handle stock
                const stockQty = product.stock ?? product.stock_quantity ?? 0;
                const inStock = stockQty > 0;

                return {
                  id: product.id.toString(),
                  name: product.name,
                  slug: product.slug,
                  price: salePrice,
                  originalPrice: discountPercent > 0 ? originalPrice : undefined,
                  description: product.description || product.short_description || "",
                  category: categorySlug,
                  subcategory: subcategorySlug,
                  childSubcategory: product.child_sub_category?.slug,
                  images: images,
                  inStock: inStock,
                  rating: 4.0,
                  reviewCount: 5,
                  discount: discountPercent > 0 ? discountPercent : undefined,
                  isNew: product.is_new ?? false,
                  isFeatured: product.is_featured ?? false,
                  stock: stockQty,
                };
              }
            );

            if (pageToFetch === 1) {
              setApiProducts(transformedProducts);
            } else {
              setApiProducts((prev) => [...prev, ...transformedProducts]);
            }

            const pagination = response.data.pagination;
            if (pagination) {
              setHasMore(pagination.current_page < pagination.last_page);
              setPage(pagination.current_page);
            } else {
              setHasMore(false);
            }
          } else {
            setHasMore(false);
          }
        } catch (err) {
          console.error("Error fetching all products:", err);
        } finally {
          setLoading(false);
          setLoadingMore(false);
        }
      };

      fetchAllProducts(1);
    }
  }, [isTrending, isBestsellers, isOnSale]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      // Find the fetch function we should call
      // Currently only fetchAllProducts supports pagination cleanly
      if (!isTrending && !isBestsellers && !isOnSale) {
        const fetchAllProducts = async (pageToFetch: number) => {
          try {
            setLoadingMore(true);
            const response = await productService.getProducts({
              page: pageToFetch,
              per_page: 20,
            });

            if (response.success && response.data?.products) {
              const transformedProducts: Product[] = response.data.products.map(
                (product: APIProduct) => {
                  const discountPercent = product.sell_price?.discount || 0;
                  const originalPrice = product.original_price || product.sell_price?.price || 0;
                  const salePrice = product.sell_price?.price || 0;

                  const categorySlug =
                    product.category?.slug ||
                    product.category?.name?.toLowerCase().replace(/\s+/g, "-") ||
                    "product";
                  const subcategorySlug =
                    product.sub_category?.slug ||
                    product.sub_category?.name?.toLowerCase().replace(/\s+/g, "-") ||
                    "all";

                  const images = product.primary_photo
                    ? [product.primary_photo]
                    : product.images && product.images.length > 0
                      ? product.images
                      : ["/placeholder.svg"];

                  const stockQty = product.stock ?? product.stock_quantity ?? 0;
                  const inStock = stockQty > 0;

                  return {
                    id: product.id.toString(),
                    name: product.name,
                    slug: product.slug,
                    price: salePrice,
                    originalPrice: discountPercent > 0 ? originalPrice : undefined,
                    description: product.description || product.short_description || "",
                    category: categorySlug,
                    subcategory: subcategorySlug,
                    childSubcategory: product.child_sub_category?.slug,
                    images: images,
                    inStock: inStock,
                    rating: 4.0,
                    reviewCount: 5,
                    discount: discountPercent > 0 ? discountPercent : undefined,
                    isNew: product.is_new ?? false,
                    isFeatured: product.is_featured ?? false,
                    stock: stockQty,
                  };
                }
              );

              setApiProducts((prev) => [...prev, ...transformedProducts]);

              const pagination = response.data.pagination;
              if (pagination) {
                setHasMore(pagination.current_page < pagination.last_page);
                setPage(pagination.current_page);
              } else {
                setHasMore(false);
              }
            } else {
              setHasMore(false);
            }
          } catch (err) {
            console.error("Error loading more products:", err);
          } finally {
            setLoadingMore(false);
          }
        };

        fetchAllProducts(page + 1);
      } else {
        // For Trending/Bestsellers/OnSale, we might not have pagination from API
        // in which case we disable Load More
        setHasMore(false);
      }
    }
  };

  const sourceProducts = apiProducts;

  const filteredProducts = sourceProducts.filter((p) => {
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesPrice = true;
    if (priceRange === "0-50") {
      matchesPrice = p.price < 50;
    } else if (priceRange === "50-100") {
      matchesPrice = p.price >= 50 && p.price < 100;
    } else if (priceRange === "100+") {
      matchesPrice = p.price >= 100;
    }

    return matchesCategory && matchesSearch && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const gridClass = {
    "grid-5": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
    "grid-3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    list: "grid-cols-1",
  }[viewMode];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {isTrending
              ? "Hot Deals"
              : isBestsellers
                ? "Best Sellers"
                : isOnSale
                  ? "Products On Sale"
                  : "All Products"}
          </h1>
          <p className="text-muted-foreground">
            {isTrending
              ? "Get Our Best Price"
              : isBestsellers
                ? "Discover our most popular products loved by thousands of customers"
                : isOnSale
                  ? "Don't miss out on these amazing deals! Limited time offers on selected products."
                  : "Browse our complete collection"}
          </p>
        </div>

        {/* Search & Filters - Sticky only when scrolled */}
        <div
          className={`bg-card border border-border rounded-lg p-4 mb-4 shadow-sm ${
            isScrolled ? "sticky top-16 z-40" : ""
          }`}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-50">Under $50</SelectItem>
                <SelectItem value="50-100">$50 - $100</SelectItem>
                <SelectItem value="100+">$100+</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Controls - Only visible when scrolled */}
            {isScrolled && (
              <div className="flex gap-2 items-center">
                <Button
                  variant={viewMode === "grid-5" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid-5")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid-3" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid-3")}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Products Count & View Mode - Non-sticky (original design when not scrolled) */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-muted-foreground">{sortedProducts.length} products found</p>
          {!isScrolled && (
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid-5" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid-5")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid-3" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid-3")}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className={`grid ${gridClass} gap-6`}>
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-12 flex justify-center pb-8">
                <Button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  variant="outline"
                  size="lg"
                  className="min-w-[200px] border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 rounded-full font-bold h-12"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Loading More...
                    </>
                  ) : (
                    "Load More Products"
                  )}
                </Button>
              </div>
            )}

            {sortedProducts.length === 0 && !loading && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No products found</p>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Products;
