"use client";

import { CategoryContent } from "@/components/layout/CategoryContent";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { useParams, useSearchParams } from "next/navigation";
import NotFound from "./NotFound";

const CategoryPage = () => {
  const params = useParams<{ slug?: string }>();
  const searchParams = useSearchParams();
  const slug = params?.slug;
  const subId = searchParams.get("sub");
  const childId = searchParams.get("child");

  if (!slug) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <CategoryContent slug={slug} subId={subId} childId={childId} />
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
