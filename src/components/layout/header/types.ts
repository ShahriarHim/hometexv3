import type { Category } from "@/lib/api";

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

export const transformCategories = (categories: Category[]): TransformedCategory[] => {
  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    image: category.image || null,
    sub: category.sub_categories.map((subCategory) => ({
      id: subCategory.id,
      name: subCategory.name,
      child: subCategory.child_sub_categories.map((childSubCategory) => ({
        id: childSubCategory.id,
        name: childSubCategory.name,
      })),
    })),
  }));
};

export const getFeaturedCategories = (categories: TransformedCategory[]): TransformedCategory[] => {
  if (categories.length >= 2) {
    return [categories[0], categories[1]];
  }
  return categories.slice(0, 2);
};
