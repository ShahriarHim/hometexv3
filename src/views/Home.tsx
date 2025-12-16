import HotDeals from "@/components/home/HotDeals";
import { HeroShowcase } from "@/views/home/HeroShowcase";
import { InfoHighlights } from "@/views/home/InfoHighlights";
import { NewsletterCta } from "@/views/home/NewsletterCta";
import { PrefooterShowcase } from "@/views/home/PrefooterShowcase";
import dynamic from "next/dynamic";

interface SectionSkeletonProps {
  title: string;
}

const SectionSkeleton = ({ title }: SectionSkeletonProps) => (
  <section className="py-12">
    <div className="container px-4 space-y-3">
      <div className="h-7 w-48 rounded bg-muted animate-pulse" aria-label={`${title} loading`} />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="h-40 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    </div>
  </section>
);

const BestSellers = dynamic(() => import("@/views/home/BestSellers").then((m) => m.BestSellers), {
  loading: () => <SectionSkeleton title="Best Sellers" />,
});

const TrendingProducts = dynamic(
  () => import("@/views/home/TrendingProducts").then((m) => m.TrendingProducts),
  { loading: () => <SectionSkeleton title="Trending Products" /> }
);

const OnSaleProducts = dynamic(
  () => import("@/views/home/OnSaleProducts").then((m) => m.OnSaleProducts),
  { loading: () => <SectionSkeleton title="On Sale" /> }
);

const ProductShowcaseTabs = dynamic(
  () => import("@/views/home/ProductShowcaseTabs").then((m) => m.ProductShowcaseTabs),
  { loading: () => <SectionSkeleton title="Products" />, ssr: false }
);

const CollectionSpotlight = dynamic(
  () => import("@/views/home/CollectionSpotlight").then((m) => m.CollectionSpotlight),
  { loading: () => <SectionSkeleton title="Collections" /> }
);

const PromoGrid = dynamic(() => import("@/views/home/PromoGrid").then((m) => m.PromoGrid), {
  loading: () => <SectionSkeleton title="Promotions" />,
});

const BrandSpotlight = dynamic(
  () => import("@/views/home/BrandSpotlight").then((m) => m.BrandSpotlight),
  { loading: () => <SectionSkeleton title="Brands" /> }
);

const CategorySpotlight = dynamic(
  () => import("@/views/home/CategorySpotlight").then((m) => m.CategorySpotlight),
  { loading: () => <SectionSkeleton title="Categories" /> }
);

const DealHighlights = dynamic(
  () => import("@/views/home/DealHighlights").then((m) => m.DealHighlights),
  { loading: () => <SectionSkeleton title="Deals" /> }
);

export const HomeView = () => {
  return (
    <main className="flex-1">
      <HeroShowcase />
      <InfoHighlights />
      <HotDeals />
      <BestSellers />
      <TrendingProducts />
      <OnSaleProducts />
      <ProductShowcaseTabs />
      <CollectionSpotlight />
      <PromoGrid />
      <BrandSpotlight />
      <CategorySpotlight />
      <DealHighlights />
      <NewsletterCta />
      <PrefooterShowcase />
    </main>
  );
};
