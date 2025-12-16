"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";
import { CategoryDropdown } from "./CategoryDropdown";
import { CategoryDropdownSkeleton } from "./CategoryDropdownSkeleton";
import { createCategorySlug, type TransformedCategory } from "./types";

interface CategoriesMenuBarProps {
  categories: TransformedCategory[];
  featuredCategories?: TransformedCategory[];
}

export const CategoriesMenuBar = ({ categories }: CategoriesMenuBarProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollButtons);
      window.addEventListener("resize", checkScrollButtons);
      return () => {
        container.removeEventListener("scroll", checkScrollButtons);
        window.removeEventListener("resize", checkScrollButtons);
      };
    }
    return undefined;
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const newScrollLeft =
        direction === "left"
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const handleMenuEnter = (categoryId: number) => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    setActiveMenu(categoryId);
  };

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const handleDropdownEnter = () => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
  };

  const handleDropdownLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  return (
    <>
      <div
        className={cn(
          "categories-menu-bar hidden md:block border-t border-border bg-background relative z-50",
          "animate-in slide-in-from-top-2 fade-in duration-300"
        )}
      >
        <div className="container mx-auto px-4 relative">
          <div className="relative overflow-visible">
            {/* Left Arrow Button */}
            {canScrollLeft && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 h-8 w-8 bg-background/80 hover:bg-background shadow-md"
                onClick={() => scroll("left")}
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}

            {/* Scrollable Menu Container */}
            <div
              ref={scrollContainerRef}
              className="overflow-x-auto overflow-y-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full"
              onScroll={checkScrollButtons}
            >
              <ul className="flex items-center justify-start gap-1 lg:gap-4 py-2 min-w-max">
                {categories.map((category) => (
                  <li
                    key={category.id}
                    className="relative"
                    onMouseEnter={() => handleMenuEnter(category.id)}
                    onMouseLeave={handleMenuLeave}
                  >
                    <Link
                      href={`/categories/${createCategorySlug(category.name)}`}
                      className={cn(
                        "inline-flex h-10 items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-semibold uppercase whitespace-nowrap transition-all duration-200",
                        "hover:bg-accent hover:text-accent-foreground",
                        activeMenu === category.id && "bg-accent text-accent-foreground"
                      )}
                    >
                      {category.name}
                      <ChevronDown
                        className={cn(
                          "relative top-[1px] ml-1 h-3 w-3 transition duration-200",
                          activeMenu === category.id && "rotate-180"
                        )}
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Arrow Button */}
            {canScrollRight && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 h-8 w-8 bg-background/80 hover:bg-background shadow-md"
                onClick={() => scroll("right")}
                aria-label="Scroll right"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Category Dropdown */}
          {activeMenu && (
            <div
              className="absolute left-0 right-0 top-full mt-1.5 z-[60] animate-in fade-in zoom-in-90 duration-300"
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <div className="rounded-xl border border-border bg-background shadow-2xl overflow-hidden">
                <Suspense fallback={<CategoryDropdownSkeleton />}>
                  {categories
                    .filter((category) => category.id === activeMenu)
                    .map((category) => (
                      <CategoryDropdown
                        key={category.id}
                        category={category}
                        featuredImage={category.image}
                      />
                    ))}
                </Suspense>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
