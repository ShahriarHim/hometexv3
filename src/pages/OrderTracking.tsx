import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useOrders } from "@/context/OrderContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle, MapPin } from "lucide-react";

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrderById } = useOrders();

  const order = orderId ? getOrderById(orderId) : undefined;

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16">
          <Card>
            <CardContent className="p-12 text-center">
              <h2 className="text-2xl font-semibold mb-2">Order not found</h2>
              <p className="text-muted-foreground mb-6">
                We couldn't find the order you're looking for
              </p>
              <Button onClick={() => navigate("/orders")}>View All Orders</Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const trackingSteps = [
    {
      status: "pending",
      label: "Order Placed",
      icon: Package,
      completed: true,
    },
    {
      status: "processing",
      label: "Processing",
      icon: Package,
      completed: ["processing", "shipped", "delivered"].includes(order.status),
    },
    {
      status: "shipped",
      label: "Shipped",
      icon: Truck,
      completed: ["shipped", "delivered"].includes(order.status),
    },
    {
      status: "delivered",
      label: "Delivered",
      icon: CheckCircle,
      completed: order.status === "delivered",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Track Order</h1>
            <p className="text-muted-foreground">Order {order.id}</p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-semibold text-lg mb-1">Current Status</h3>
                  <Badge variant="secondary" className="text-sm">
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
                {order.trackingNumber && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Tracking Number</p>
                    <p className="font-mono font-medium">{order.trackingNumber}</p>
                  </div>
                )}
              </div>

              {/* Progress Steps */}
              <div className="relative">
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
                <div
                  className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500"
                  style={{
                    width: `${
                      (trackingSteps.filter((s) => s.completed).length - 1) * 33.33
                    }%`,
                  }}
                />

                <div className="relative flex justify-between">
                  {trackingSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step.completed
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="text-xs mt-2 text-center max-w-[80px]">{step.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </h3>
                <div className="space-y-1 text-muted-foreground">
                  <p>{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.zip}
                  </p>
                  <p>{order.shippingAddress.phone}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-border">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 flex gap-4">
            <Button onClick={() => navigate("/orders")} variant="outline">
              Back to Orders
            </Button>
            {order.status === "pending" && (
              <Button variant="destructive">Cancel Order</Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderTracking;
