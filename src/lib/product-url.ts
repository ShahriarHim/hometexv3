/**
 * Product URL Generation Utility
 *
 * Generates product URLs following the hierarchy:
 * /en/products/:category/:sub-category/:child-sub-category/:productId
 *
 * Rules:
 * - Only include segments that exist (omit null/undefined/missing segments)
 * - Maintain correct ordering: category → sub-category → child-sub-category → product ID
 * - No duplicate or repeated segments
 */

export interface ProductUrlParams {
  category: string;
  subcategory?: string | null;
  childSubcategory?: string | null;
  productId: string | number;
  locale?: string;
}

/**
 * Generates a product URL following the category hierarchy
 * @param params - Product URL parameters
 * @returns Product URL path (without locale prefix)
 */
export function generateProductUrl(params: ProductUrlParams): string {
  const { category, subcategory, childSubcategory, productId } = params;

  // Validate required fields
  if (!category || !productId) {
    throw new Error("Category and productId are required");
  }

  // Build URL segments array
  const segments: string[] = [category];

  // Add sub-category if it exists
  if (subcategory && subcategory.trim() !== "") {
    segments.push(subcategory);
  }

  // Add child-sub-category if it exists
  if (childSubcategory && childSubcategory.trim() !== "") {
    segments.push(childSubcategory);
  }

  // Add product ID
  segments.push(String(productId));

  // Join segments and return
  return `/products/${segments.join("/")}`;
}

/**
 * Generates a product URL with locale prefix
 * @param params - Product URL parameters
 * @returns Product URL path with locale prefix
 */
export function generateProductUrlWithLocale(params: ProductUrlParams): string {
  const locale = params.locale || "en";
  const path = generateProductUrl(params);
  return `/${locale}${path}`;
}

/**
 * Parses a product URL to extract category hierarchy and product ID
 * @param urlPath - URL path (e.g., "/products/category/sub-category/child-sub-category/123")
 * @returns Parsed product URL parameters or null if invalid
 */
export function parseProductUrl(urlPath: string): ProductUrlParams | null {
  // Remove leading/trailing slashes and split
  const cleanPath = urlPath.replace(/^\/+|\/+$/g, "");
  const parts = cleanPath.split("/").filter(Boolean);

  // Must have at least "products", category, and productId (minimum 3 parts)
  if (parts.length < 3 || parts[0] !== "products") {
    return null;
  }

  // Remove "products" prefix
  const segments = parts.slice(1);

  // Last segment is always productId
  const productId = segments[segments.length - 1];

  // First segment is always category
  const category = segments[0];

  // Determine sub-category and child-sub-category based on segment count
  let subcategory: string | undefined;
  let childSubcategory: string | undefined;

  if (segments.length === 4) {
    // category/sub-category/child-sub-category/productId
    subcategory = segments[1];
    childSubcategory = segments[2];
  } else if (segments.length === 3) {
    // category/sub-category/productId OR category/productId (ambiguous)
    // Assume it's category/sub-category/productId if middle segment doesn't look like an ID
    const middleSegment = segments[1];
    if (isNaN(Number(middleSegment))) {
      subcategory = middleSegment;
    }
    // Otherwise, it's category/productId (no sub-category)
  } else if (segments.length === 2) {
    // category/productId
    // No sub-category or child-sub-category
  }

  return {
    category,
    subcategory: subcategory || undefined,
    childSubcategory: childSubcategory || undefined,
    productId,
  };
}
