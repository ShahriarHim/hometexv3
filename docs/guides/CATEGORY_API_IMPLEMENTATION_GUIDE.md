# Category API - Implementation Guide

## 🎯 Quick Decision Tree: Which API Should I Use?

```
Do you need ALL categories at once?
├─ YES → Use getMenu() or getFullCategoryTree()
│         ✅ Best for: Small category trees, desktop mega menus
│         📦 Returns: Complete tree with all levels
│         ⚡ Performance: 1 request, ~200-500ms
│
└─ NO → Continue...
    │
    Do you need to optimize initial load time?
    ├─ YES → Use getRootCategories() + lazy load children
    │         ✅ Best for: Large category trees, mobile menus
    │         📦 Returns: Only top-level categories
    │         ⚡ Performance: Fast initial (50-100ms), load more on demand
    │
    └─ NO → Continue...
        │
        Are you on a category page with slug in URL?
        ├─ YES → Use getCategoryBySlug()
        │         ✅ Best for: Category pages, SEO metadata needed
        │         📦 Returns: Category + breadcrumb + SEO data
        │         ⚡ Performance: ~50-150ms
        │
        └─ NO → Continue...
            │
            Do you only need breadcrumb navigation?
            └─ YES → Use getCategoryBreadcrumb()
                      ✅ Best for: Breadcrumb components
                      📦 Returns: Hierarchy path
                      ⚡ Performance: ~50ms
```

---

## 📚 All Available Endpoints

### 1. `productService.getMenu()`

**Complete Category Tree**

```typescript
import { productService } from "@/services/api";

const response = await productService.getMenu();
// Returns: Full nested tree with all categories, subcategories, and children
```

**Use When:**

- You have < 50 total categories
- You want instant access to all data
- You're building a desktop mega menu
- You want to avoid multiple API calls

**Returns:**

```typescript
{
  success: true,
  data: CategoryTree[]; // Full nested structure
}
```

---

### 2. `productService.getRootCategories()`

**Root Categories Only**

```typescript
import { productService } from "@/services/api";

const response = await productService.getRootCategories();
// Returns: Only top-level categories with has_children flag
```

**Use When:**

- You have > 50 total categories
- You want faster initial page load
- You're implementing lazy loading
- You're building a mobile menu

**Returns:**

```typescript
{
  success: true,
  data: RootCategory[]; // Only level 1, with has_children flag
}
```

**Follow up with:**

```typescript
// When user interacts, load children
const children = await productService.getCategoryChildren(categoryId);
```

---

### 3. `productService.getCategoryChildren(categoryId)`

**Children of Specific Category**

```typescript
import { productService } from "@/services/api";

const response = await productService.getCategoryChildren(10);
// Returns: Direct children of category ID 10
```

**Use When:**

- Implementing lazy loading (hover/click to expand)
- User expands a category in mobile menu
- You already have parent loaded and need children

**Returns:**

```typescript
{
  success: true,
  data: {
    category: { id, name, slug, level },
    children: CategoryChild[] // with has_children flags
  }
}
```

---

### 4. `productService.getCategoryBySlug(slug)`

**Category Details by Slug**

```typescript
import { productService } from "@/services/api";

const response = await productService.getCategoryBySlug("electronics");
// Returns: Full category data + breadcrumb + SEO metadata
```

**Use When:**

- You're on a category page (e.g., `/categories/electronics`)
- You need SEO metadata for the page
- You need breadcrumb data
- URL routing based on slug

**Returns:**

```typescript
{
  success: true,
  data: {
    id, name, slug, description,
    breadcrumb: BreadcrumbItem[],
    meta_title, meta_description,
    // ... other fields
  }
}
```

---

### 5. `productService.getCategoryBreadcrumb(categoryId)`

**Breadcrumb Path**

```typescript
import { productService } from "@/services/api";

const response = await productService.getCategoryBreadcrumb(100);
// Returns: Full hierarchy path from root to this category
```

**Use When:**

- Building breadcrumb navigation
- You need the full category hierarchy
- You have category ID but need parent chain

**Returns:**

```typescript
{
  success: true,
  data: [
    { id: 1, name: "Electronics", slug: "electronics", level: 1 },
    { id: 10, name: "Washing Machine", slug: "washing-machine", level: 2 },
    { id: 100, name: "Family Size", slug: "family-size", level: 3 }
  ]
}
```

---

## 🔥 Common Patterns

### Pattern 1: Desktop Mega Menu (Full Tree)

```typescript
"use client";
import { useEffect, useState } from "react";
import { getFullCategoryTree } from "@/lib/category-api-helpers";
import type { CategoryTree } from "@/types/api";

export function MegaMenu() {
  const [categories, setCategories] = useState<CategoryTree[]>([]);

  useEffect(() => {
    getFullCategoryTree().then(setCategories);
  }, []);

  return (
    <nav>
      {categories.map((cat) => (
        <div key={cat.id}>
          <h3>{cat.name}</h3>
          {cat.subcategories.map((sub) => (
            <div key={sub.id}>
              <h4>{sub.name}</h4>
              {sub.child_categories.map((child) => (
                <a key={child.id} href={`/categories/${cat.slug}/${sub.slug}/${child.slug}`}>
                  {child.name}
                </a>
              ))}
            </div>
          ))}
        </div>
      ))}
    </nav>
  );
}
```

---

### Pattern 2: Mobile Menu (Lazy Loading)

```typescript
"use client";
import { useEffect, useState } from "react";
import { getRootCategories, loadCategoryChildren } from "@/lib/category-api-helpers";
import type { RootCategory, CategoryChild } from "@/types/api";

export function MobileMenu() {
  const [categories, setCategories] = useState<RootCategory[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [children, setChildren] = useState<CategoryChild[]>([]);

  useEffect(() => {
    getRootCategories().then(setCategories);
  }, []);

  const handleExpand = async (categoryId: number) => {
    if (expandedId === categoryId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(categoryId);
    const childData = await loadCategoryChildren(categoryId);
    setChildren(childData);
  };

  return (
    <nav>
      {categories.map((cat) => (
        <div key={cat.id}>
          <button onClick={() => handleExpand(cat.id)}>
            {cat.name} {cat.has_children && "▼"}
          </button>
          {expandedId === cat.id && (
            <ul>
              {children.map((child) => (
                <li key={child.id}>{child.name}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </nav>
  );
}
```

---

### Pattern 3: Category Page

```typescript
import { getCategoryBySlug } from "@/lib/category-api-helpers";
import { notFound } from "next/navigation";

interface Props {
  params: { slug: string };
}

export default async function CategoryPage({ params }: Props) {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav>
        <a href="/">Home</a>
        {category.breadcrumb.map((item) => (
          <span key={item.id}>
            {" > "}
            <a href={`/categories/${item.slug}`}>{item.name}</a>
          </span>
        ))}
      </nav>

      {/* SEO */}
      <h1>{category.meta_title || category.name}</h1>
      <p>{category.meta_description}</p>

      {/* Content */}
      <div>{category.description}</div>
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const category = await getCategoryBySlug(params.slug);

  return {
    title: category?.meta_title || category?.name,
    description: category?.meta_description,
  };
}
```

---

### Pattern 4: Breadcrumb Component

```typescript
"use client";
import { useEffect, useState } from "react";
import { getCategoryBreadcrumb } from "@/lib/category-api-helpers";
import type { BreadcrumbItem } from "@/types/api";
import Link from "next/link";

interface Props {
  categoryId: number;
}

export function Breadcrumb({ categoryId }: Props) {
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([]);

  useEffect(() => {
    getCategoryBreadcrumb(categoryId).then(setBreadcrumb);
  }, [categoryId]);

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex gap-2">
        <li>
          <Link href="/">Home</Link>
        </li>
        {breadcrumb.map((item, index) => (
          <li key={item.id} className="flex gap-2">
            <span>/</span>
            {index < breadcrumb.length - 1 ? (
              <Link href={`/categories/${item.slug}`}>{item.name}</Link>
            ) : (
              <span>{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

---

## ⚡ Performance Optimization Tips

### 1. Use React Query for Caching

```typescript
import { useQuery } from "@tanstack/react-query";
import { getFullCategoryTree } from "@/lib/category-api-helpers";

export function useCategories() {
  return useQuery({
    queryKey: ["categories", "tree"],
    queryFn: getFullCategoryTree,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  });
}
```

### 2. Server-Side Caching

```typescript
import { unstable_cache } from "next/cache";
import { getFullCategoryTree } from "@/lib/category-api-helpers";

const getCachedCategories = unstable_cache(async () => getFullCategoryTree(), ["categories-tree"], {
  revalidate: 3600, // 1 hour
  tags: ["categories"],
});
```

### 3. Preload on Hover

```typescript
<Link
  href="/categories/electronics"
  onMouseEnter={() => {
    // Prefetch category data on hover
    getCategoryBySlug("electronics");
  }}
>
  Electronics
</Link>
```

---

## 📊 Performance Comparison

| Strategy    | Initial Load | User Interaction   | Total Requests | Best For        |
| ----------- | ------------ | ------------------ | -------------- | --------------- |
| Full Tree   | 200-500ms    | 0ms (cached)       | 1              | < 50 categories |
| Root + Lazy | 50-100ms     | 50-100ms per level | 1 + N          | > 50 categories |
| Slug-based  | 50-150ms     | N/A                | 1 per page     | Category pages  |
| Breadcrumb  | 50ms         | N/A                | 1              | Navigation only |

---

## 🎓 Helper Functions Available

```typescript
// Import from lib/category-api-helpers.ts
import {
  getFullCategoryTree, // Get complete tree
  getRootCategories, // Get only root categories
  loadCategoryChildren, // Lazy load children
  getCategoryBySlug, // Get category by slug
  getCategoryBreadcrumb, // Get breadcrumb path
  findCategoryInTree, // Find category in cached tree
  getCategoryPageInfo, // Get title/description for page
} from "@/lib/category-api-helpers";
```

---

## ✅ Migration Checklist

When updating your components:

- [ ] Identify if you need full tree or lazy loading
- [ ] Replace old API calls with new service methods
- [ ] Add proper TypeScript types
- [ ] Implement caching strategy
- [ ] Handle loading and error states
- [ ] Test on slow network (throttle to 3G)
- [ ] Verify SEO metadata works
- [ ] Check breadcrumb navigation
- [ ] Test mobile responsiveness
- [ ] Measure performance improvements

---

## 🔗 Related Documentation

- [Category API Quick Reference](./CATEGORY_API_QUICK_REFERENCE.md)
- [Category API Frontend Guide](./CATEGORY_API_FRONTEND_GUIDE.md)
- [Usage Examples](../examples/CATEGORY_API_USAGE_EXAMPLES.ts)
- [Helper Functions](../src/lib/category-api-helpers.ts)
