/**
 * Category API Helper Functions
 * Provides convenient wrappers for the 5 category API endpoints
 */

import { productService } from "@/services/api";
import type {
  BreadcrumbItem,
  CategoryBySlug,
  CategoryChild,
  CategoryTree,
  RootCategory,
} from "@/types/api";

/**
 * Strategy 1: Fetch full tree (use for initial full menu load)
 * Best for: Small category trees, when you need all data upfront
 */
export async function getFullCategoryTree(): Promise<CategoryTree[]> {
  try {
    const response = await productService.getMenu();
    if (response.success) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching full category tree:", error);
  }
  return [];
}

/**
 * Strategy 2: Fetch root categories only (optimized lazy loading)
 * Best for: Large category trees, better initial page load performance
 * Follow up with getCategoryChildren() on hover/click
 */
export async function getRootCategories(): Promise<RootCategory[]> {
  try {
    const response = await productService.getRootCategories();
    if (response.success) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching root categories:", error);
  }
  return [];
}

/**
 * Lazy load children for a category
 * Best for: Loading subcategories on demand (hover or click)
 */
export async function loadCategoryChildren(categoryId: number): Promise<CategoryChild[]> {
  try {
    const response = await productService.getCategoryChildren(categoryId);
    if (response.success) {
      return response.data.children;
    }
  } catch (error) {
    console.error(`Error loading children for category ${categoryId}:`, error);
  }
  return [];
}

/**
 * Get category details by slug (for category pages)
 * Best for: Category page routing, includes breadcrumb and SEO data
 */
export async function getCategoryBySlug(slug: string): Promise<CategoryBySlug | null> {
  try {
    const response = await productService.getCategoryBySlug(slug);
    if (response.success) {
      return response.data;
    }
  } catch (error) {
    console.error(`Error fetching category with slug "${slug}":`, error);
  }
  return null;
}

/**
 * Get breadcrumb path for a category
 * Best for: Breadcrumb navigation components
 */
export async function getCategoryBreadcrumb(categoryId: number): Promise<BreadcrumbItem[]> {
  try {
    const response = await productService.getCategoryBreadcrumb(categoryId);
    if (response.success) {
      return response.data;
    }
  } catch (error) {
    console.error(`Error fetching breadcrumb for category ${categoryId}:`, error);
  }
  return [];
}

/**
 * Find category by slug in cached tree data
 * Use this to avoid API calls when you already have the tree loaded
 */
export function findCategoryInTree(categories: CategoryTree[], slug: string): CategoryTree | null {
  const createSlug = (name: string) => name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");

  for (const category of categories) {
    if (createSlug(category.name) === slug || category.slug === slug) {
      return category;
    }
  }
  return null;
}

/**
 * Get category title and description for page headers
 * Works with either full tree data or slug-based data
 */
export function getCategoryPageInfo(
  category: CategoryTree | CategoryBySlug | undefined,
  subId?: string | null,
  childId?: string | null
): { title: string; description: string } {
  let title = category?.name || "Category";
  let description = "Browse our collection";

  if (!category) {
    return { title, description };
  }

  // If it's CategoryBySlug, use its description
  if ("breadcrumb" in category) {
    description = category.description || description;
    return { title, description };
  }

  // If it's CategoryTree with children navigation
  const categoryTree = category as CategoryTree;

  if (childId && categoryTree.subcategories) {
    const sub = categoryTree.subcategories.find((s) => s.id === Number(subId));
    const child = sub?.child_categories.find((c) => c.id === Number(childId));
    if (child) {
      title = child.name;
      description = `Browse our ${child.name} collection`;
    }
  } else if (subId && categoryTree.subcategories) {
    const sub = categoryTree.subcategories.find((s) => s.id === Number(subId));
    if (sub) {
      title = sub.name;
      description = `Browse our ${sub.name} collection`;
    }
  }

  return { title, description };
}
