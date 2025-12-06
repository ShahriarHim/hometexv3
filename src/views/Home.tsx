import { HeroShowcase } from "@/views/home/HeroShowcase";
import { InfoHighlights } from "@/views/home/InfoHighlights";
import HotDeals from "@/components/home/HotDeals";
import { ProductShowcaseTabs } from "@/views/home/ProductShowcaseTabs";
import { CollectionSpotlight } from "@/views/home/CollectionSpotlight";
import { PromoGrid } from "@/views/home/PromoGrid";
import { BrandSpotlight } from "@/views/home/BrandSpotlight";
import { CategorySpotlight } from "@/views/home/CategorySpotlight";
import { DealHighlights } from "@/views/home/DealHighlights";
import { OnSaleProducts } from "@/views/home/OnSaleProducts";
import { BestSellers } from "@/views/home/BestSellers";
import { TrendingProducts } from "@/views/home/TrendingProducts";
import { NewsletterCta } from "@/views/home/NewsletterCta";
import { PrefooterShowcase } from "@/views/home/PrefooterShowcase";

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
