import ProductDetailEnhancedView from "@/views/ProductDetailEnhanced";

type Params = Promise<{
  locale: string;
  category: string;
  childCategory: string;
  id: string;
}>;

export default async function ProductDetailExperiencePage(props: { params: Params }) {
  // Await the params as per Next.js 15 requirements
  const _params = await props.params;

  return <ProductDetailEnhancedView />;
}
