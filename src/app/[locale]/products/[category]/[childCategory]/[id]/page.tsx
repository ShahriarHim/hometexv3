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
    const productData = product.data as
      | {
          name?: string;
          description?: string;
          seo?: { meta_description?: string };
          meta_description?: string;
        }
      | undefined;
    const name = productData?.name || resolved.id;
    return {
      title: `${name} | Hometex`,
      description:
        productData?.seo?.meta_description ||
        productData?.meta_description ||
        productData?.description ||
        undefined,
    };
  } catch {
    return {
      title: `${resolved.id} | Hometex`,
    };
  }
}

export default async function ProductDetailPage(props: { params: PageProps["params"] }) {
  // Await the params as per Next.js 15 requirements
  const _params = await props.params;

  return <ProductDetailView />;
}
