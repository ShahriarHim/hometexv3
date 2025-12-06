import { Link } from "@/i18n/routing";
import { ChevronRight, Package2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { createCategorySlug, type TransformedCategory } from "./types";

interface CategoryDropdownProps {
  category: TransformedCategory;
  featuredImage: string | null;
}

export const CategoryDropdown = ({ category, featuredImage }: CategoryDropdownProps) => {
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<number>>(new Set());

  const toggleSubcategory = (subcategoryId: number) => {
    const newExpanded = new Set(expandedSubcategories);
    if (newExpanded.has(subcategoryId)) {
      newExpanded.delete(subcategoryId);
    } else {
      newExpanded.add(subcategoryId);
    }
    setExpandedSubcategories(newExpanded);
  };

  return (
    <div className="w-full p-6" suppressHydrationWarning>
      <div className="grid grid-cols-12 gap-6">
        {/* Left Section: Subcategories & Child Categories */}
        <div className="col-span-9">
          <div className="grid grid-cols-3 gap-x-8 gap-y-4">
            {category.sub.map((subcategory) => {
              const isExpanded = expandedSubcategories.has(subcategory.id);
              const hasChildren = subcategory.child && subcategory.child.length > 0;

              return (
                <div key={subcategory.id} className="space-y-2">
                  {/* Subcategory Title */}
                  <div className="flex items-center justify-between">
                    <Link
                      href={{
                        pathname: `/categories/${createCategorySlug(category.name)}`,
                        query: { sub: subcategory.id.toString() },
                      }}
                      className="flex items-center gap-2 group flex-1"
                    >
                      <span className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                        {subcategory.name}
                      </span>
                    </Link>
                    {hasChildren && (
                      <button
                        onClick={() => toggleSubcategory(subcategory.id)}
                        className="p-1 hover:bg-accent rounded transition-colors"
                        aria-label={isExpanded ? "Collapse" : "Expand"}
                      >
                        <ChevronRight
                          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                            isExpanded ? "rotate-90" : ""
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Child Categories - Collapsible */}
                  {hasChildren && isExpanded && (
                    <ul className="space-y-1.5 pl-0 animate-in slide-in-from-top-1 fade-in duration-200">
                      {subcategory.child.map((child) => (
                        <li key={child.id}>
                          <Link
                            href={{
                              pathname: `/categories/${createCategorySlug(category.name)}`,
                              query: { sub: subcategory.id.toString(), child: child.id.toString() },
                            }}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group/child"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 group-hover/child:bg-primary transition-colors" />
                            <span className="group-hover/child:translate-x-0.5 transition-transform">
                              {child.name}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Section: Featured Image */}
        <div className="col-span-3">
          <Link href={`/categories/${createCategorySlug(category.name)}`} className="block group">
            <div className="relative rounded-lg overflow-hidden bg-accent/50 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md">
              {/* Image */}
              <div className="aspect-[4/3] bg-accent overflow-hidden">
                {featuredImage ? (
                  <Image
                    src={featuredImage}
                    alt={category.name}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package2 className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                </div>
                {category.sub && category.sub.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {category.sub.length} collections
                  </p>
                )}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
