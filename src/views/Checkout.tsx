"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrderContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

const Checkout = () => {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { createOrder } = useOrders();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("sslcommerz");
  const [shippingData, setShippingData] = useState({
    name: user?.name || "",
    phone: "",
    address: "",
    city: "",
    zip: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth");
    } else if (items.length === 0) {
      router.replace("/cart");
    }
  }, [isAuthenticated, items.length, router]);

  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order
      const order = await createOrder({
        userId: user!.id,
        items,
        totalAmount: getTotalPrice(),
        status: "pending",
        paymentStatus: "pending",
        paymentMethod,
        shippingAddress: shippingData,
      });

      // TODO: Integrate with SSL Commerz API
      // For now, simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      clearCart();
      toast.success("Order placed successfully!");
      router.push(`/orders/${order.id}`);
    } catch (error) {
      toast.error("Failed to process order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleCheckout}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-6">Shipping Information</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={shippingData.name}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingData.phone}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, phone: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={shippingData.address}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, address: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={shippingData.city}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, city: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input
                        id="zip"
                        value={shippingData.zip}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, zip: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-6">Payment Method</h2>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 p-4 border border-border rounded-lg">
                      <RadioGroupItem value="sslcommerz" id="sslcommerz" />
                      <Label htmlFor="sslcommerz" className="flex-1 cursor-pointer">
                        <div>
                          <p className="font-medium">SSL Commerz</p>
                          <p className="text-sm text-muted-foreground">
                            Secure payment gateway
                          </p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border border-border rounded-lg">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div>
                          <p className="font-medium">Cash on Delivery</p>
                          <p className="text-sm text-muted-foreground">Pay when you receive</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.product.name} × {item.quantity}
                          </span>
                          <span className="font-medium">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-border space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${getTotalPrice().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>Free</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
                        <span>Total</span>
                        <span>${getTotalPrice().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full mt-6" disabled={loading}>
                    {loading ? "Processing..." : "Place Order"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
