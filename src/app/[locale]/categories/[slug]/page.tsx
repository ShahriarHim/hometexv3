import { CategoryContentServer } from "@/components/layout/CategoryContentServer";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sub?: string; child?: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const readable = slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  return {
    title: `${readable} | Categories | Hometex`,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const subId = resolvedSearchParams.sub || null;
  const childId = resolvedSearchParams.child || null;

  if (!slug) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <CategoryContentServer slug={slug} subId={subId} childId={childId} />
      </main>
      <Footer />
    </div>
  );
}
