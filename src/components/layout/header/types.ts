import type { CategoryTree } from "@/types/api";

export interface TransformedCategory {
  id: number;
  name: string;
  image: string | null;
  sub: {
    id: number;
    name: string;
    child: {
      id: number;
      name: string;
    }[];
  }[];
}

export const createCategorySlug = (name: string): string => {
  return name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
};

export const transformCategories = (categories: CategoryTree[]): TransformedCategory[] => {
  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    image: category.image || null,
    sub: category.subcategories.map((subCategory) => ({
      id: subCategory.id,
      name: subCategory.name,
      child: subCategory.child_categories.map((childCategory) => ({
        id: childCategory.id,
        name: childCategory.name,
      })),
    })),
  }));
};

export const getFeaturedCategories = (categories: TransformedCategory[]): TransformedCategory[] => {
  // Return up to 4 featured categories for the megamenu 2x2 grid
  return categories.slice(0, Math.min(4, categories.length));
};
