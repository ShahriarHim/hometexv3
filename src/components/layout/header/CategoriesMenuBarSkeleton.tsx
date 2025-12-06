import { cn } from "@/lib/utils";

export const CategoriesMenuBarSkeleton = () => {
  return (
    <div
      className={cn(
        "categories-menu-bar hidden md:block border-t border-border bg-background relative z-50",
        "animate-in slide-in-from-top-2 fade-in duration-300"
      )}
    >
      <div className="container mx-auto px-4 relative">
        <div className="relative overflow-visible">
          <div className="overflow-x-auto overflow-y-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full">
            <ul className="flex items-center justify-start gap-1 lg:gap-4 py-2 min-w-max animate-pulse">
              {[...Array(8)].map((_, idx) => (
                <li key={idx} className="relative">
                  <div className="h-10 w-24 bg-muted rounded-md"></div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
