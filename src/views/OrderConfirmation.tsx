"use client";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface OrderConfirmationProps {
  orderId?: string;
}

const OrderConfirmation = ({ orderId }: OrderConfirmationProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-16 pb-16">
            <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-500" />
            <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
            <p className="text-muted-foreground mb-6">
              {orderId
                ? `Your order #${orderId} has been confirmed. You will receive an email confirmation shortly.`
                : "Your order has been confirmed. You will receive an email confirmation shortly."}
            </p>
            <div className="flex flex-col gap-3">
              <Button asChild>
                <Link href="/account?tab=orders">View Order Details</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
