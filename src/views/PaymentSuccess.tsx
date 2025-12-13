"use client";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Success } from "@/components/Success";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/context/OrderContext";
import { useRouter } from "@/i18n/routing";
import { CheckCircle, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const PaymentSuccess = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getOrderById } = useOrders();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderIdParam = searchParams.get("orderId");
    if (orderIdParam) {
      setOrderId(orderIdParam);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!orderId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16">
          <Success
            title="Order Information Missing"
            message="We couldn't find your order information. Please check your order history."
            icon={<CheckCircle className="h-16 w-16 text-yellow-500" />}
            actions={
              <Button onClick={() => router.push("/account?tab=orders" as any)}>View Orders</Button>
            }
          />
        </main>
        <Footer />
      </div>
    );
  }

  const order = getOrderById(orderId);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Success
            title="Order Successful!"
            message={
              order
                ? `Your order has been placed successfully. We'll send you a confirmation email shortly.`
                : `Your order has been placed successfully. Order ID: ${orderId}`
            }
            icon={<CheckCircle className="h-16 w-16 text-green-500" />}
            actions={
              <>
                <Button
                  onClick={() => router.push(`/account?tab=orders` as any)}
                  className="w-full sm:w-auto"
                >
                  Track Order
                </Button>

              </>
            }
          >
            {order && (
              <div className="mt-6 p-4 bg-muted rounded-lg text-left w-full">
                <div className="space-y-2 text-sm">
                  {/* <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Number:</span>
                    <span className="font-medium">{order.orderNumber || order.id}</span>
                  </div> */}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Amount:</span>
                    <span className="font-medium">${order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method:</span>
                    <span className="font-medium capitalize">
                      {order.paymentMethod === "ssl_commerce" ? "SSL Commerz" : order.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium capitalize">{order.status}</span>
                  </div>
                </div>
              </div>
            )}
          </Success>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
