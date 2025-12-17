"use client";

import { EmptyState } from "@/components/common/EmptyState";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter } from "@/i18n/routing";
import { Heart, ShoppingCart, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Wishlist = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { items, clearWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(items.map((item) => item.product.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, productId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== productId));
    }
  };

  const handleAddSelectedToCart = () => {
    if (selectedItems.length === 0) {
      toast.error("Please select items to add to cart");
      return;
    }

    selectedItems.forEach((productId) => {
      const item = items.find((i) => i.product.id === productId);
      if (item) {
        addToCart(item.product);
      }
    });

    toast.success(`Added ${selectedItems.length} item(s) to cart`);
    setSelectedItems([]);
  };

  const handleAddAllToCart = () => {
    items.forEach((item) => {
      addToCart(item.product);
    });
    toast.success(`Added all ${items.length} item(s) to cart`);
  };

  const handleRemoveSelected = () => {
    if (selectedItems.length === 0) {
      toast.error("Please select items to remove");
      return;
    }

    selectedItems.forEach((productId) => {
      removeFromWishlist(productId);
    });

    setSelectedItems([]);
    toast.success(`Removed ${selectedItems.length} item(s) from wishlist`);
  };

  const isAllSelected = items.length > 0 && selectedItems.length === items.length;
  const selectedCount = selectedItems.length;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16">
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Save items you love for later"
            actionLabel="Continue Shopping"
            actionHref="/products"
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
          <p className="text-muted-foreground">{items.length} item(s) saved</p>
        </div>

        {/* Action Bar */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Select All */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                />
                <label
                  htmlFor="select-all"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Select All ({selectedCount} selected)
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleAddSelectedToCart}
                  disabled={selectedCount === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add Selected to Cart
                </Button>
                <Button variant="outline" size="sm" onClick={handleAddAllToCart}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add All to Cart
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveSelected}
                  disabled={selectedCount === 0}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Selected
                </Button>
                <Button variant="destructive" size="sm" onClick={clearWishlist}>
                  <X className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wishlist Items */}
        <div className="space-y-4">
          {items.map((item) => {
            const productUrl = `/products/${item.product.category}/${item.product.childSubcategory || item.product.subcategory || "all"}/${item.product.id}`;
            return (
              <Card key={item.product.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Checkbox */}
                    <Checkbox
                      checked={selectedItems.includes(item.product.id)}
                      onCheckedChange={(checked) =>
                        handleSelectItem(item.product.id, checked as boolean)
                      }
                    />

                    {/* Product Image */}
                    <Link href={productUrl as never} className="flex-shrink-0">
                      <img
                        src={item.product.images[0] || "/placeholder.svg"}
                        alt={item.product.name}
                        className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link href={productUrl as never}>
                        <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2">
                          {item.product.name}
                        </h3>
                      </Link>

                      {item.product.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {item.product.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-foreground">
                            ৳{item.product.price.toLocaleString()}
                          </span>
                          {item.product.originalPrice && (
                            <span className="text-lg text-muted-foreground line-through">
                              ৳{item.product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {item.product.discount && (
                          <span className="px-2 py-1 bg-destructive text-destructive-foreground text-xs font-semibold rounded">
                            {item.product.discount}% OFF
                          </span>
                        )}
                      </div>

                      {/* Stock Status */}
                      <div className="mt-2">
                        {item.product.inStock ? (
                          <span className="text-sm text-green-600 font-medium">In Stock</span>
                        ) : (
                          <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        onClick={() => {
                          addToCart(item.product);
                          toast.success("Added to cart");
                        }}
                        disabled={!item.product.inStock}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFromWishlist(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex justify-between items-center">
          <Button variant="outline" asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
          <div className="text-sm text-muted-foreground">
            Total: {items.length} item(s) • Selected: {selectedCount} item(s)
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;
