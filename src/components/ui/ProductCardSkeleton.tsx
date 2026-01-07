/**
 * Professional Product Card Skeleton Loader
 * Displays animated skeleton while products are loading
 */

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ProductCardSkeletonProps {
  className?: string;
}

export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <div
      className={cn(
        "border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden flex flex-col h-full",
        className
      )}
    >
      {/* Image Section Skeleton */}
      <div className="relative bg-gray-50 rounded-t-lg aspect-square">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Content Section Skeleton */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Category Name Skeleton */}
        <div className="flex justify-center">
          <Skeleton className="h-3 w-1/3 rounded-sm" />
        </div>

        {/* Product Name Skeleton */}
        <div className="space-y-1.5 flex flex-col items-center pt-1">
          <Skeleton className="h-4 w-3/4 rounded-sm" />
          <Skeleton className="h-4 w-1/2 rounded-sm" />
        </div>

        {/* Rating Skeleton (Optional space reservation) */}
        <div className="flex items-center justify-center gap-2.5 pt-1">
          <Skeleton className="h-3 w-28 rounded-sm" />
        </div>

        {/* Price & Button Skeleton */}
        <div className="mt-auto space-y-3 pt-2">
          {/* Price */}
          <div className="flex justify-center">
            <Skeleton className="h-5 w-1/3 rounded-sm" />
          </div>

          {/* Actions - matching flex items-center gap-2 */}
          <div className="flex items-center gap-2 h-11">
            {/* Add to Cart Button - flex-1 */}
            <Skeleton className="h-full flex-1 rounded-md" />
            {/* Wishlist Button - w-11 h-11 */}
            <Skeleton className="h-11 w-11 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({
  count = 8,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
