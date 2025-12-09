import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export const ProductDetailSkeleton = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center space-x-2 mb-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-48" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Media Gallery Skeleton */}
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-20 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-3/4" />
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-5 w-5 rounded" />
                ))}
              </div>
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>

            <Separator />

            {/* Pricing */}
            <div className="space-y-3">
              <div className="flex items-baseline gap-3">
                <Skeleton className="h-12 w-48" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-40" />
            </div>

            <Separator />

            {/* Variant Selection */}
            <div className="space-y-4">
              <Skeleton className="h-5 w-32" />
              <div className="flex flex-wrap gap-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-20 rounded-md" />
                ))}
              </div>
              <Skeleton className="h-5 w-32" />
              <div className="flex flex-wrap gap-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-24 rounded-md" />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-10 w-20 rounded-md" />
                <Skeleton className="h-10 w-10 rounded-md" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Skeleton className="h-12 flex-1 rounded-md" />
              <Skeleton className="h-12 flex-1 rounded-md" />
              <Skeleton className="h-12 w-12 rounded-md" />
            </div>

            {/* Stock Info */}
            <div className="space-y-2">
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="space-y-6">
          <div className="flex gap-4 border-b">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-24 mb-2" />
            ))}
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        {/* Similar Products Skeleton */}
        <div className="mt-12 space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

