export const CategoryPageSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Category Hero Skeleton */}
      <div className="bg-gradient-to-br from-background to-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="h-6 w-32 bg-muted rounded-full mx-auto mb-4"></div>
          <div className="h-12 w-64 bg-muted rounded-lg mx-auto mb-4"></div>
          <div className="h-6 w-96 bg-muted rounded mx-auto max-w-2xl"></div>
        </div>
      </div>

      {/* Subcategories/Navigation Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 w-48 bg-muted rounded mx-auto mb-4"></div>
        <div className="flex flex-wrap gap-2 justify-center">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="h-8 w-24 bg-muted rounded-full"></div>
          ))}
        </div>
      </div>

      {/* Products Grid Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, idx) => (
            <div key={idx} className="space-y-3">
              {/* Image */}
              <div className="aspect-square bg-muted rounded-lg"></div>
              {/* Title */}
              <div className="h-4 w-3/4 bg-muted rounded"></div>
              {/* Price */}
              <div className="h-4 w-1/2 bg-muted rounded"></div>
              {/* Rating */}
              <div className="h-3 w-2/3 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
