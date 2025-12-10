import { api } from "@/lib/api";
import ProductDetailView from "@/views/ProductDetail";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    locale: string;
    category: string;
    childCategory: string;
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  try {
    const product = await api.products.getById(resolved.id);
    const name = product.data?.name || resolved.id;
    return {
      title: `${name} | Hometex`,
      description: product.data?.seo?.meta_description || product.data?.description || undefined,
    };
  } catch {
    return {
      title: `${resolved.id} | Hometex`,
    };
  }
}

export default async function ProductDetailPage(props: { params: PageProps["params"] }) {
  // Await the params as per Next.js 15 requirements
  const params = await props.params;

  return <ProductDetailView />;
}
