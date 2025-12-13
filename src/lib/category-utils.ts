import { productService } from "@/services/api";
import type { CategoryTree } from "@/types/api";

export async function getCategoryData() {
  try {
    console.log("Fetching categories from API...");
    const response = await productService.getMenu();
    console.log("API Response:", { success: response.success, dataCount: response.data?.length });

    if (response.success && response.data) {
      console.log("Categories fetched successfully:", response.data.length, "categories");
      return response.data;
    } else {
      console.error("API returned unsuccessful response:", response);
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message, error.stack);
    }
  }
  return [];
}

export function findCategoryBySlug(categories: CategoryTree[], slug: string) {
  const createSlug = (name: string) => name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
  const foundCategory = categories.find((c) => createSlug(c.name) === slug);

  if (!foundCategory) {
    console.warn(`Category not found for slug: ${slug}`);
    console.log(
      "Available categories:",
      categories.map((c) => ({ id: c.id, name: c.name, slug: createSlug(c.name) }))
    );
  }

  return foundCategory;
}

export function getCategoryTitle(
  apiCategory: CategoryTree | undefined,
  subId: string | null,
  childId: string | null
) {
  if (!apiCategory) {
    console.warn("No API category found, using default title");
    return {
      pageTitle: "Category",
      pageDescription: "Browse our collection",
    };
  }

  let pageTitle = apiCategory.name;
  let pageDescription = apiCategory.description || "Browse our collection";

  if (childId && subId) {
    const sub = apiCategory.subcategories.find((s) => s.id === Number(subId));
    if (!sub) {
      console.warn(`Subcategory not found for ID: ${subId} in category: ${apiCategory.name}`);
      return { pageTitle, pageDescription };
    }

    const child = sub.child_categories.find((c) => c.id === Number(childId));
    if (child) {
      pageTitle = child.name;
      pageDescription = `Browse our ${child.name} collection`;
    } else {
      console.warn(`Child category not found for ID: ${childId} in subcategory: ${sub.name}`);
    }
  } else if (subId) {
    const sub = apiCategory.subcategories.find((s) => s.id === Number(subId));
    if (sub) {
      pageTitle = sub.name;
      pageDescription = `Browse our ${sub.name} collection`;
    } else {
      console.warn(`Subcategory not found for ID: ${subId} in category: ${apiCategory.name}`);
    }
  }

  return { pageTitle, pageDescription };
}
