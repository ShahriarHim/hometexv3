import { CategoryPageSkeleton } from "@/components/layout/CategoryPageSkeleton";
import { findCategoryBySlug, getCategoryData, getCategoryTitle } from "@/lib/category-utils";
import { Suspense } from "react";
import { CategoryContentClient } from "./CategoryContentClient";

interface CategoryContentServerProps {
  slug: string;
  subId: string | null;
  childId: string | null;
}

async function CategoryDataFetcher({ slug, subId, childId }: CategoryContentServerProps) {
  // Fetch data on the server
  const apiCategories = await getCategoryData();
  const apiCategory = findCategoryBySlug(apiCategories, slug);
  const { pageTitle, pageDescription } = getCategoryTitle(apiCategory, subId, childId);

  return (
    <CategoryContentClient
      slug={slug}
      subId={subId}
      childId={childId}
      apiCategory={apiCategory}
      pageTitle={pageTitle}
      pageDescription={pageDescription}
    />
  );
}

export function CategoryContentServer({ slug, subId, childId }: CategoryContentServerProps) {
  return (
    <Suspense fallback={<CategoryPageSkeleton />}>
      <CategoryDataFetcher slug={slug} subId={subId} childId={childId} />
    </Suspense>
  );
}
