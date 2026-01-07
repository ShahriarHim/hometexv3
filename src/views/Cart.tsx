"use client";

import { EmptyState } from "@/components/common/EmptyState";
import { LoginRequired } from "@/components/common/LoginRequired";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
// Removed unused router to satisfy lint
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [showLoginRequired, setShowLoginRequired] = useState(false);

  const totalPrice = getTotalPrice();
  const shippingCost = totalPrice >= 3000 ? 0 : 100;
  const grandTotal = totalPrice + shippingCost;

  const handleProceedToCheckout = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowLoginRequired(true);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16">
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            description="Start adding some products to your cart"
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
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <Button variant="destructive" onClick={clearCart}>
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const productUrl = `/products/${item.product.category}/${item.product.childSubcategory || item.product.subcategory || "all"}/${item.product.id}`;
              return (
                <Card key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img
                        src={item.product.images[0] || "/placeholder.svg"}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-md bg-muted"
                      />
                      <div className="flex-1">
                        <Link
                          href={productUrl as never}
                          className="font-semibold hover:text-primary transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <div className="text-sm text-muted-foreground mt-1">
                          {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                          {item.selectedColor && item.selectedSize && <span> • </span>}
                          {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                        </div>
                        <p className="text-lg font-bold text-primary mt-2">
                          ৳{item.product.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({items.length} items)</span>
                    <span className="font-medium">৳{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? "FREE" : `৳${shippingCost}`}
                    </span>
                  </div>
                  {totalPrice < 3000 && (
                    <p className="text-xs text-muted-foreground">
                      Add ৳{(3000 - totalPrice).toLocaleString()} more for free shipping
                    </p>
                  )}
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between text-lg font-bold mb-6">
                  <span>Total</span>
                  <span>৳{grandTotal.toLocaleString()}</span>
                </div>
                {isAuthenticated ? (
                  <Button asChild className="w-full group" size="lg" variant="premium">
                    <Link
                      href="/checkout"
                      className="flex items-center justify-center gap-2 hover:text-black"
                    >
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4 text-primary-foreground group-hover:text-white transition-colors opacity-100" />
                    </Link>
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    variant="premium"
                    onClick={handleProceedToCheckout}
                    className="w-full group flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4 text-primary-foreground group-hover:text-white transition-colors opacity-100" />
                  </Button>
                )}
                <Button asChild variant="outline" className="w-full mt-3">
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />

      <LoginRequired isOpen={showLoginRequired} onOpenChange={setShowLoginRequired} />
    </div>
  );
};

export default Cart;
