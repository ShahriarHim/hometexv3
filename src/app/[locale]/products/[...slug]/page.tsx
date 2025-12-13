import { api } from "@/lib/api";
import { parseProductUrl } from "@/lib/product-url";
import ProductDetailView from "@/views/ProductDetail";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string[];
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  try {
    // Parse the slug to extract product ID
    const urlPath = `/products/${resolved.slug.join("/")}`;
    const parsed = parseProductUrl(urlPath);

    if (!parsed) {
      return {
        title: "Product Not Found | Hometex",
      };
    }

    const product = await api.products.getById(parsed.productId);
    const name = product.data?.name || parsed.productId;
    return {
      title: `${name} | Hometex`,
      description: product.data?.seo?.meta_description || product.data?.description || undefined,
    };
  } catch {
    return {
      title: "Product | Hometex",
    };
  }
}

export default async function ProductDetailPage(props: { params: PageProps["params"] }) {
  // Await the params as per Next.js 15 requirements
  const params = await props.params;

  return <ProductDetailView />;
}
