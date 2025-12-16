/**
 * Category API Usage Examples
 *
 * This file demonstrates the 3 main strategies for fetching category data
 * based on your performance and UX requirements.
 */

import {
  getCategoryBreadcrumb,
  getCategoryBySlug,
  getFullCategoryTree,
  getRootCategories,
  loadCategoryChildren,
} from "@/lib/category-api-helpers";

// ============================================================================
// STRATEGY 1: Full Tree (Best for small category lists)
// ============================================================================

/**
 * Use this when:
 * - You have a small category tree (< 50 categories)
 * - You want to show all categories immediately
 * - You want to avoid multiple API calls
 *
 * Example: Desktop mega menu that shows all categories at once
 */
async function _strategy1_FullTree() {
  // Fetch complete tree
  const categories = await getFullCategoryTree();

  // Render entire menu structure
  // eslint-disable-next-line no-console
  console.log("Full tree loaded:", categories.length, "root categories");

  // Access nested data immediately
  categories.forEach((category) => {
    // eslint-disable-next-line no-console
    console.log(`Category: ${category.name}`);
    category.subcategories.forEach((sub) => {
      // eslint-disable-next-line no-console
      console.log(`  - ${sub.name}`);
      sub.child_categories.forEach((child) => {
        // eslint-disable-next-line no-console
        console.log(`    - ${child.name}`);
      });
    });
  });
}

// ============================================================================
// STRATEGY 2: Lazy Loading (Best for large category lists)
// ============================================================================

/**
 * Use this when:
 * - You have a large category tree (> 50 categories)
 * - You want faster initial page load
 * - You want to load subcategories on user interaction
 *
 * Example: Mobile menu or dropdown that loads children on click/hover
 */
async function _strategy2_LazyLoading() {
  // Step 1: Initial load - fetch only root categories
  const rootCategories = await getRootCategories();
  // eslint-disable-next-line no-console
  console.log("Root categories loaded:", rootCategories.length);

  // Step 2: When user hovers/clicks a category, load its children
  const categoryId = rootCategories[0].id;

  if (rootCategories[0].has_children) {
    const children = await loadCategoryChildren(categoryId);
    // eslint-disable-next-line no-console
    console.log(`Children for ${rootCategories[0].name}:`, children);

    // Step 3: If needed, load next level
    if (children[0]?.has_children) {
      const grandChildren = await loadCategoryChildren(children[0].id);
      // eslint-disable-next-line no-console
      console.log("Grand children:", grandChildren);
    }
  }
}

// ============================================================================
// STRATEGY 3: Slug-based (Best for category pages)
// ============================================================================

/**
 * Use this when:
 * - You're on a category page with slug in URL
 * - You need SEO metadata (meta_title, meta_description)
 * - You need breadcrumb data
 *
 * Example: Category page at /categories/electronics
 */
async function _strategy3_SlugBased() {
  const slug = "electronics"; // From URL params

  // Fetch category with SEO data and breadcrumb
  const category = await getCategoryBySlug(slug);

  if (category) {
    // eslint-disable-next-line no-console
    console.log("Category:", category.name);
    // eslint-disable-next-line no-console
    console.log("SEO Title:", category.meta_title);
    // eslint-disable-next-line no-console
    console.log("SEO Description:", category.meta_description);
    // eslint-disable-next-line no-console
    console.log("Breadcrumb:", category.breadcrumb);

    // Use breadcrumb for navigation
    category.breadcrumb.forEach((item, index) => {
      // eslint-disable-next-line no-console
      console.log(`${"  ".repeat(index)}Level ${item.level}: ${item.name}`);
    });
  }
}

// ============================================================================
// REAL-WORLD EXAMPLES
// ============================================================================

/**
 * Example 1: Desktop Mega Menu Component
 */
export async function loadDesktopMegaMenu() {
  // For desktop, we want instant display, so load full tree
  const categories = await getFullCategoryTree();

  return {
    categories,
    renderStrategy: "full-tree",
    showAllLevels: true,
  };
}

/**
 * Example 2: Mobile Menu Component
 */
export async function loadMobileMenu() {
  // For mobile, optimize initial load with lazy loading
  const rootCategories = await getRootCategories();

  return {
    rootCategories,
    renderStrategy: "lazy-load",
    loadChildrenOnClick: true, // Load children when user clicks expand
  };
}

/**
 * Example 3: Category Page Component
 */
export async function loadCategoryPage(slug: string) {
  // Use slug-based API for category pages
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { notFound: true };
  }

  return {
    category,
    breadcrumb: category.breadcrumb,
    seo: {
      title: category.meta_title || category.name,
      description: category.meta_description,
    },
  };
}

/**
 * Example 4: Breadcrumb Component
 */
export async function loadBreadcrumb(categoryId: number) {
  // Dedicated breadcrumb endpoint
  const breadcrumb = await getCategoryBreadcrumb(categoryId);

  return breadcrumb.map((item) => ({
    label: item.name,
    href: `/categories/${item.slug}`,
    level: item.level,
  }));
}

/**
 * Example 5: Search/Filter Dropdown
 */
export async function loadCategoryFilter() {
  // For filters, you usually only need root categories
  const rootCategories = await getRootCategories();

  // Transform to filter options
  return rootCategories
    .filter((cat) => cat.is_active)
    .map((cat) => ({
      value: cat.slug,
      label: cat.name,
      hasSubcategories: cat.has_children,
    }));
}

// ============================================================================
// PERFORMANCE COMPARISON
// ============================================================================

/**
 * Performance Metrics (approximate):
 *
 * STRATEGY 1 (Full Tree):
 * - Initial Load: 200-500ms
 * - Subsequent Interactions: 0ms (data already loaded)
 * - Data Size: 50-200KB
 * - Best for: < 50 categories
 *
 * STRATEGY 2 (Lazy Loading):
 * - Initial Load: 50-100ms (only root categories)
 * - Subsequent Interactions: 50-100ms per level
 * - Data Size: 5-20KB per request
 * - Best for: > 50 categories
 *
 * STRATEGY 3 (Slug-based):
 * - Page Load: 50-150ms
 * - Includes: SEO data + breadcrumb
 * - Data Size: 2-10KB
 * - Best for: Category pages, SEO-focused pages
 */

// ============================================================================
// CACHING RECOMMENDATIONS
// ============================================================================

/**
 * Client-side Caching Strategy:
 *
 * 1. Full Tree: Cache for 1 hour (categories don't change often)
 * 2. Root Categories: Cache for 1 hour
 * 3. Children: Cache for 30 minutes (can be more dynamic)
 * 4. Slug-based: Cache for 1 hour per slug
 * 5. Breadcrumb: Cache for 1 hour per category ID
 *
 * Implementation with React Query:
 * ```typescript
 * useQuery({
 *   queryKey: ['categories', 'tree'],
 *   queryFn: getFullCategoryTree,
 *   staleTime: 60 * 60 * 1000, // 1 hour
 * })
 * ```
 */
