import { productService } from "@/services/api";
import type { CategoryTree } from "@/types/api";

export async function getCategoryData() {
  try {
    const response = await productService.getMenu();
    if (response.success) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
  return [];
}

export function findCategoryBySlug(categories: CategoryTree[], slug: string) {
  const createSlug = (name: string) => name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
  return categories.find((c) => createSlug(c.name) === slug);
}

export function getCategoryTitle(
  apiCategory: CategoryTree | undefined,
  subId: string | null,
  childId: string | null
) {
  let pageTitle = apiCategory?.name || "Category";
  let pageDescription = "Browse our collection";

  if (childId && apiCategory) {
    const sub = apiCategory.subcategories.find((s) => s.id === Number(subId));
    const child = sub?.child_categories.find((c) => c.id === Number(childId));
    if (child) {
      pageTitle = child.name;
      pageDescription = `Browse our ${child.name} collection`;
    }
  } else if (subId && apiCategory) {
    const sub = apiCategory.subcategories.find((s) => s.id === Number(subId));
    if (sub) {
      pageTitle = sub.name;
      pageDescription = `Browse our ${sub.name} collection`;
    }
  }

  return { pageTitle, pageDescription };
}
