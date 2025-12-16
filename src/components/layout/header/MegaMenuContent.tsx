import { Link } from "@/i18n/routing";
import { ArrowRight, ChevronRight, Package2, Sparkles, TrendingUp } from "lucide-react";
import { useState } from "react";
import { createCategorySlug, type TransformedCategory } from "./types";

interface MegaMenuContentProps {
  categories: TransformedCategory[];
  featuredCategories: TransformedCategory[];
  showAllCategories?: boolean;
}

export const MegaMenuContent = ({
  categories,
  featuredCategories,
  showAllCategories = false,
}: MegaMenuContentProps) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  // Show more categories: 9 for limited view, all for full view
  const displayCategories = showAllCategories ? categories : categories.slice(0, 9);

  const toggleCategory = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div className="w-full p-4" suppressHydrationWarning>
      <div className="grid grid-cols-12 gap-4">
        {/* Left Section: Categories Grid */}
        <div className="col-span-6">
          <div className="grid grid-cols-3 gap-x-4 gap-y-3">
            {displayCategories.map((category) => {
              const isExpanded = expandedCategories.has(category.id);
              const hasSubcategories = category.sub && category.sub.length > 0;

              return (
                <div key={category.id} className="space-y-2">
                  {/* Category Title with Icon */}
                  <div className="flex items-center gap-0.5">
                    <Link
                      href={`/categories/${createCategorySlug(category.name)}`}
                      className="flex items-center gap-1.5 group"
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-accent group-hover:bg-accent/80 transition-all duration-200 flex-shrink-0">
                        <Package2 className="w-3 h-3 text-primary" />
                      </div>
                      <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                        {category.name}
                      </span>
                    </Link>
                    {hasSubcategories && (
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="p-0.5 hover:bg-accent rounded transition-colors flex-shrink-0"
                        aria-label={isExpanded ? "Collapse" : "Expand"}
                      >
                        <ChevronRight
                          className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${
                            isExpanded ? "rotate-90" : ""
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Subcategories - Collapsible */}
                  {hasSubcategories && isExpanded && (
                    <ul className="space-y-1.5 pl-9 animate-in slide-in-from-top-1 fade-in duration-200">
                      {category.sub.map((sub) => (
                        <li key={sub.id} className="space-y-1">
                          <Link
                            href={{
                              pathname: `/categories/${createCategorySlug(category.name)}`,
                              query: { sub: sub.id.toString() },
                            }}
                            className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group/sub"
                          >
                            <span className="group-hover/sub:translate-x-0.5 transition-transform">
                              {sub.name}
                            </span>
                          </Link>
                          {/* Child Subcategories */}
                          {sub.child && sub.child.length > 0 && (
                            <ul className="space-y-0.5 pl-3 mt-1">
                              {sub.child.map((child) => (
                                <li key={child.id}>
                                  <Link
                                    href={{
                                      pathname: `/categories/${createCategorySlug(category.name)}`,
                                      query: { sub: sub.id.toString(), child: child.id.toString() },
                                    }}
                                    className="text-[11px] text-muted-foreground/80 hover:text-primary transition-colors flex items-center gap-1 group/child"
                                  >
                                    <span className="w-1 h-1 rounded-full bg-muted-foreground/40 group-hover/child:bg-primary transition-colors" />
                                    <span className="group-hover/child:translate-x-0.5 transition-transform">
                                      {child.name}
                                    </span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Section: Featured Cards */}
        <div className="col-span-6">
          <div className="grid grid-cols-2 gap-2">
            {featuredCategories.slice(0, 4).map((category, idx) => (
              <Link
                key={category.id}
                href={`/categories/${createCategorySlug(category.name)}`}
                className="block group"
              >
                <div className="relative rounded-lg overflow-hidden bg-accent/50 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md">
                  {/* Badge */}
                  <div className="absolute top-1.5 left-1.5 z-10">
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-background/90 backdrop-blur-sm border border-border">
                      {idx === 0 ? (
                        <>
                          <TrendingUp className="w-2.5 h-2.5 text-primary" />
                          <span className="text-[10px] font-semibold text-primary uppercase">
                            Trending
                          </span>
                        </>
                      ) : idx === 1 ? (
                        <>
                          <Sparkles className="w-2.5 h-2.5 text-primary" />
                          <span className="text-[10px] font-semibold text-primary uppercase">
                            New
                          </span>
                        </>
                      ) : idx === 2 ? (
                        <>
                          <Package2 className="w-2.5 h-2.5 text-primary" />
                          <span className="text-[10px] font-semibold text-primary uppercase">
                            Popular
                          </span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-2.5 h-2.5 text-primary" />
                          <span className="text-[10px] font-semibold text-primary uppercase">
                            Featured
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Image */}
                  <div className="aspect-[3/1] bg-accent overflow-hidden">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package2 className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                    {category.sub && category.sub.length > 0 && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {category.sub.length} items
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
