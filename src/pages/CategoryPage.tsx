import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/products/ProductCard";
import { useParams } from "react-router-dom";
import { products, categories } from "@/data/demo-data";
import { Badge } from "@/components/ui/badge";
import NotFound from "./NotFound";

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return <NotFound />;
  }

  const categoryProducts = products.filter((p) => p.category === category.slug);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Category Hero */}
        <div className="bg-gradient-to-br from-background to-muted py-16">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-4 bg-sage text-white">{categoryProducts.length} Products</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.name}</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {category.description}
            </p>
          </div>
        </div>

        {/* Subcategories */}
        {category.subcategories && category.subcategories.length > 0 && (
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {category.subcategories.map((sub) => (
                <Badge key={sub.id} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                  {sub.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        <div className="container mx-auto px-4 py-8">
          {categoryProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No products found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
