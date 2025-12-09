import { api } from "@/lib/api";
import type { Metadata } from "next";
import ProductDetailView from "@/views/ProductDetail";

interface PageProps {
  params: Promise<{
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

export default function ProductDetailPage() {
  return <ProductDetailView />;
}
