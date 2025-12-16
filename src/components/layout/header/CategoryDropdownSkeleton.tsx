export const CategoryDropdownSkeleton = () => {
  return (
    <div className="w-full p-6 animate-pulse" suppressHydrationWarning>
      <div className="grid grid-cols-12 gap-6">
        {/* Left Section: Subcategories Skeleton */}
        <div className="col-span-9">
          <div className="grid grid-cols-3 gap-x-8 gap-y-4">
            {[...Array(9)].map((_, idx) => (
              <div key={idx} className="space-y-2">
                {/* Subcategory Title Skeleton */}
                <div className="flex items-center justify-between">
                  <div className="h-5 bg-muted rounded w-32"></div>
                  <div className="h-4 w-4 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section: Featured Image Skeleton */}
        <div className="col-span-3">
          <div className="relative rounded-lg overflow-hidden bg-accent/50 border border-border">
            {/* Image Skeleton */}
            <div className="aspect-[4/3] bg-muted"></div>

            {/* Content Skeleton */}
            <div className="p-3 space-y-2">
              <div className="h-4 bg-muted rounded w-24"></div>
              <div className="h-3 bg-muted rounded w-20"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
