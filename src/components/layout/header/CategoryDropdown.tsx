import { Link } from "@/i18n/routing";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createCategorySlug, type TransformedCategory } from "./types";

// TODO: Remove this helper when actual images are available from API
const getPlaceholderImage = (categoryName: string, index: number = 0): string => {
  const categoryLower = categoryName.toLowerCase();

  // Map category keywords to relevant Unsplash images for the 5 main categories
  const imageMap: Record<string, string[]> = {
    // Electronics
    electronics: [
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800",
      "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800",
    ],
    electronic: [
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800",
      "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800",
    ],
    // Home & Decor
    home: [
      "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
    ],
    decor: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800",
    ],
    // Fashion & Apparel
    fashion: [
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800",
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800",
    ],
    apparel: [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800",
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800",
    ],
    clothing: [
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800",
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800",
    ],
    // Kitchen & Dining
    kitchen: [
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800",
      "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800",
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800",
    ],
    dining: [
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800",
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800",
      "https://images.unsplash.com/photo-1615719413546-198b25453f85?w=800",
    ],
    // Health & Beauty
    health: [
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800",
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800",
    ],
    beauty: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",
      "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=800",
    ],
  };

  // Try to find matching category by checking if any keyword is in the category name
  const matchedKey = Object.keys(imageMap).find((key) => categoryLower.includes(key));

  if (matchedKey && imageMap[matchedKey]) {
    return imageMap[matchedKey][index % imageMap[matchedKey].length];
  }

  // Default fallback images
  const defaultImages = [
    "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
  ];

  return defaultImages[index % defaultImages.length];
};

interface CategoryDropdownProps {
  category: TransformedCategory;
  featuredImage: string | null;
}

export const CategoryDropdown = ({ category, featuredImage }: CategoryDropdownProps) => {
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<number>>(new Set());
  const [currentBlock1Index, setCurrentBlock1Index] = useState(0);
  const [currentBlock2Index, setCurrentBlock2Index] = useState(0);

  // Helper to check if image is from localhost and replace with placeholder
  const getImageUrl = (apiImage: string | null, categoryName: string, index: number) => {
    if (!apiImage || apiImage.includes("localhost") || apiImage.includes("127.0.0.1")) {
      return getPlaceholderImage(categoryName, index);
    }
    return apiImage;
  };

  // Prepare images for Block 1: First half of subcategories (or first 3)
  const block1Subcategories = category.sub.slice(
    0,
    Math.min(3, Math.ceil(category.sub.length / 2))
  );
  const block1Images = block1Subcategories.map((sub, idx) => ({
    id: sub.id,
    name: sub.name,
    image: getPlaceholderImage(sub.name, idx),
  }));

  // Prepare images for Block 2: Second half of subcategories (or remaining, max 3)
  const block2Start = block1Subcategories.length;
  const block2Subcategories = category.sub.slice(block2Start, block2Start + 3);
  const block2Images =
    block2Subcategories.length > 0
      ? block2Subcategories.map((sub, idx) => ({
          id: sub.id,
          name: sub.name,
          image: getPlaceholderImage(sub.name, idx + block1Subcategories.length),
        }))
      : [
          {
            id: category.id,
            name: category.name,
            image: getImageUrl(featuredImage, category.name, 0),
          },
        ];

  // Auto-slide for Block 1 every 3 seconds
  useEffect(() => {
    if (block1Images.length <= 1) {
      return undefined; // No cleanup needed
    }

    const interval = setInterval(() => {
      setCurrentBlock1Index((prev) => (prev + 1) % block1Images.length);
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [block1Images.length]);

  // Auto-slide for Block 2 every 3 seconds (slightly offset)
  useEffect(() => {
    if (block2Images.length <= 1) {
      return undefined; // No cleanup needed
    }

    const interval = setInterval(() => {
      setCurrentBlock2Index((prev) => (prev + 1) % block2Images.length);
    }, 3500); // Slightly different timing for visual variety

    return () => {
      clearInterval(interval);
    };
  }, [block2Images.length]);

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
        <div className="col-span-6">
          <div className="grid grid-cols-3 gap-x-4 gap-y-4">
            {category.sub.map((subcategory) => {
              const isExpanded = expandedSubcategories.has(subcategory.id);
              const hasChildren = subcategory.child && subcategory.child.length > 0;

              return (
                <div key={subcategory.id} className="space-y-2">
                  {/* Subcategory Title */}
                  <div className="flex items-center gap-0.5">
                    <Link
                      href={{
                        pathname: `/categories/${createCategorySlug(category.name)}`,
                        query: { sub: subcategory.id.toString() },
                      }}
                      className="flex items-center group"
                    >
                      <span className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                        {subcategory.name}
                      </span>
                    </Link>
                    {hasChildren && (
                      <button
                        onClick={() => toggleSubcategory(subcategory.id)}
                        className="p-0.5 hover:bg-accent rounded transition-colors flex-shrink-0 ml-1"
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

        {/* Right Section: Featured Images - 2 Blocks Side by Side */}
        <div className="col-span-6 flex">
          <div className="grid grid-cols-2 gap-3 w-full">
            {/* Block 1: Flexible Image Block (single or multiple) */}
            <div className="relative rounded-lg overflow-hidden bg-accent/50 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md group flex flex-col h-full min-h-[240px]">
              <div className="flex-1 bg-accent overflow-hidden relative">
                {block1Images.map((item, index) => (
                  <div
                    key={item.id}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      block1Images.length === 1 || index === currentBlock1Index
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
                {/* Carousel Indicators (only show if multiple images) */}
                {block1Images.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                    {block1Images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentBlock1Index(index)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          index === currentBlock1Index
                            ? "bg-primary w-4"
                            : "bg-background/60 hover:bg-background/80"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 via-background/70 to-transparent">
                <Link
                  href={{
                    pathname: `/categories/${createCategorySlug(category.name)}`,
                    query: block1Images[currentBlock1Index]
                      ? { sub: block1Images[currentBlock1Index].id.toString() }
                      : {},
                  }}
                  className="block p-3 hover:bg-accent/20 transition-colors"
                >
                  <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {block1Images[currentBlock1Index]?.name || category.name}
                  </h4>
                  {block1Images.length > 1 && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {currentBlock1Index + 1} of {block1Images.length}
                    </p>
                  )}
                </Link>
              </div>
            </div>

            {/* Block 2: Flexible Image Block (single or multiple) */}
            <div className="relative rounded-lg overflow-hidden bg-accent/50 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md group flex flex-col h-full min-h-[240px]">
              <div className="flex-1 bg-accent overflow-hidden relative">
                {block2Images.map((item, index) => (
                  <div
                    key={item.id}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      block2Images.length === 1 || index === currentBlock2Index
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
                {/* Carousel Indicators (only show if multiple images) */}
                {block2Images.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                    {block2Images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentBlock2Index(index)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          index === currentBlock2Index
                            ? "bg-primary w-4"
                            : "bg-background/60 hover:bg-background/80"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 via-background/70 to-transparent">
                <Link
                  href={{
                    pathname: `/categories/${createCategorySlug(category.name)}`,
                    query: block2Images[currentBlock2Index]
                      ? { sub: block2Images[currentBlock2Index].id.toString() }
                      : {},
                  }}
                  className="block p-3 hover:bg-accent/20 transition-colors"
                >
                  <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {block2Images[currentBlock2Index]?.name || category.name}
                  </h4>
                  {block2Images.length > 1 && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {currentBlock2Index + 1} of {block2Images.length}
                    </p>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
