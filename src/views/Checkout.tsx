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
import { ApiError } from "@/services/api";
import type { ApiErrorResponse } from "@/context/OrderContext";

const Checkout = () => {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { createOrder } = useOrders();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("ssl_commerce");
  const [shippingData, setShippingData] = useState<{
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zip: string;
    state: string;
    country: string;
  }>({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    state: "",
    country: "Bangladesh",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth" as any);
    } else if (items.length === 0) {
      router.replace("/cart" as any);
    }
  }, [isAuthenticated, items.length, router]);

  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  const formatApiError = (error: ApiError): string => {
    const responseData = (error.response ?? {}) as ApiErrorResponse;
    if (responseData.errors && Object.keys(responseData.errors).length > 0) {
      const firstKey = Object.keys(responseData.errors)[0];
      const firstMessage = responseData.errors[firstKey]?.[0];
      if (firstMessage) {
        return firstMessage;
      }
    }
    if (responseData.error) {
      try {
        const parsed = JSON.parse(responseData.error);
        if (parsed && typeof parsed === "object") {
          const firstParsedMsg = Object.values(parsed)[0];
          if (typeof firstParsedMsg === "string") {
            return firstParsedMsg;
          }
        }
      } catch {
        // ignore
      }
      return responseData.error;
    }
    if (responseData.message) {
      return responseData.message;
    }
    return error.message || "Failed to process order. Please try again.";
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Basic front-end validation to avoid bad payloads
    const emailPattern =
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailPattern.test(shippingData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!items || items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

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

      clearCart();
      router.push(`/orders/${order.id}` as any);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(formatApiError(error));
      } else {
      toast.error("Failed to process order");
      }
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
                        onChange={(e) => setShippingData({ ...shippingData, name: e.target.value })}
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
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingData.email}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, email: e.target.value })
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
                        onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input
                        id="zip"
                        value={shippingData.zip}
                        onChange={(e) => setShippingData({ ...shippingData, zip: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Division</Label>
                      <Input
                        id="state"
                        value={shippingData.state}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, state: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={shippingData.country}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, country: e.target.value })
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
                      <RadioGroupItem value="ssl_commerce" id="ssl_commerce" />
                      <Label htmlFor="ssl_commerce" className="flex-1 cursor-pointer">
                        <div>
                          <p className="font-medium">SSL Commerz</p>
                          <p className="text-sm text-muted-foreground">Secure payment gateway</p>
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
