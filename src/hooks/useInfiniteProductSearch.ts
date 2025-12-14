/**
 * Professional Infinite Product Search Hook
 * Implements industry-standard pagination with React Query's useInfiniteQuery
 */

import { productService } from "@/services/api/product.service";
import type { ProductQueryParams, ProductsResponse } from "@/types/api/product";
import { useInfiniteQuery } from "@tanstack/react-query";

interface UseInfiniteProductSearchParams {
  searchTerm?: string;
  category?: string;
  perPage?: number;
  sort?: ProductQueryParams["sort"];
  minPrice?: number;
  maxPrice?: number;
  enabled?: boolean;
}

/**
 * Hook for infinite scroll product search with pagination
 *
 * @example
 * ```tsx
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteProductSearch({
 *   searchTerm: "pillow",
 *   perPage: 20
 * });
 * ```
 */
export function useInfiniteProductSearch({
  searchTerm,
  category,
  perPage = 20,
  sort,
  minPrice,
  maxPrice,
  enabled = true,
}: UseInfiniteProductSearchParams = {}) {
  return useInfiniteQuery<ProductsResponse, Error>({
    queryKey: ["products", "infinite", searchTerm, category, perPage, sort, minPrice, maxPrice],

    queryFn: async ({ pageParam = 1 }) => {
      const params: ProductQueryParams = {
        page: pageParam as number,
        per_page: perPage,
        ...(searchTerm && { search: searchTerm }),
        ...(category && { category }),
        ...(sort && { sort }),
        ...(minPrice && { min_price: minPrice }),
        ...(maxPrice && { max_price: maxPrice }),
      };

      return productService.getProducts(params);
    },

    initialPageParam: 1,

    getNextPageParam: (lastPage, _allPages) => {
      // Check if there are more pages
      if (!lastPage?.data?.products || lastPage.data.products.length === 0) {
        return undefined;
      }

      const pagination = lastPage.data.pagination;
      if (!pagination) {
        return undefined;
      }

      // Use has_more flag or check if current_page < last_page
      if (pagination.has_more || pagination.current_page < pagination.last_page) {
        return pagination.current_page + 1;
      }

      return undefined;
    },

    enabled,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep unused data in cache for 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
}

/**
 * Helper hook to flatten paginated data into a single array
 */
export function useInfiniteProductSearchFlat(params: UseInfiniteProductSearchParams) {
  const query = useInfiniteProductSearch(params);

  const products = query.data?.pages.flatMap((page) => page.data?.products || []) || [];
  const totalCount = query.data?.pages[0]?.data?.pagination?.total || 0;

  return {
    ...query,
    products,
    totalCount,
  };
}
