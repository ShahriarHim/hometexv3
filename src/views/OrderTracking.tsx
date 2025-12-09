"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle, MapPin, FileText, Loader2, AlertCircle } from "lucide-react";
import { orderService } from "@/services/api";
import type { InvoiceResponse } from "@/types/api/order";
import { env } from "@/lib/env";

type InvoiceData = InvoiceResponse["data"];

const OrderTracking = () => {
  const params = useParams<{ orderId?: string }>();
  const orderNumber = params?.orderId;
  const router = useRouter();
  const [order, setOrder] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatError = (payload: unknown): string => {
    if (!payload || typeof payload !== "object") return "Something went wrong";
    const maybeResp = payload as { message?: string; error?: string; errors?: Record<string, string[]> };
    if (maybeResp.errors && Object.keys(maybeResp.errors).length > 0) {
      const first = Object.values(maybeResp.errors)[0];
      if (first?.[0]) return first[0];
    }
    if (maybeResp.error) {
      try {
        const parsed = JSON.parse(maybeResp.error);
        if (parsed && typeof parsed === "object") {
          const firstParsed = Object.values(parsed)[0];
          if (typeof firstParsed === "string") return firstParsed;
        }
      } catch {
        return maybeResp.error;
      }
    }
    if (maybeResp.message) return maybeResp.message;
    return "Something went wrong";
  };

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderNumber) {
        setError("Order number is missing.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await orderService.getInvoice(orderNumber);
        if (!response.success) {
          throw new Error(formatError(response));
        }
        setOrder(response.data || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  const trackingSteps = useMemo(() => {
    const statusString =
      (order as { order_status_string?: string })?.order_status_string?.toLowerCase() || "";
    const status =
      statusString === "pending"
        ? "pending"
        : statusString === "completed"
          ? "delivered"
          : statusString === "shipped"
            ? "shipped"
            : statusString === "processing"
              ? "processing"
              : "pending";
    return [
      { status: "pending", label: "Order Placed", icon: Package, completed: true },
      {
        status: "processing",
        label: "Processing",
        icon: Package,
        completed: ["processing", "shipped", "delivered"].includes(status),
      },
      {
        status: "shipped",
        label: "Shipped",
        icon: Truck,
        completed: ["shipped", "delivered"].includes(status),
      },
      {
        status: "delivered",
        label: "Delivered",
        icon: CheckCircle,
        completed: status === "delivered",
      },
    ];
  }, [order]);

  const handleInvoiceOpen = () => {
    if (!orderNumber) return;
    const invoiceUrl = `${env.apiBaseUrl}/api/orders/invoice/${orderNumber}`;
    window.open(invoiceUrl, "_blank", "noopener,noreferrer");
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-sm text-muted-foreground">Loading order...</span>
        </div>
      );
    }

    if (error || !order) {
      return (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <h2 className="text-2xl font-semibold">Order not found</h2>
              <p className="text-muted-foreground">
                {error || "We couldn’t find the order you’re looking for."}
              </p>
              <Button onClick={() => router.push("/account?tab=orders")}>Back to Orders</Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    const orderDetails = (order as { order_details?: Array<Record<string, unknown>> })?.order_details || [];
    const customer = (order as { customer?: Record<string, unknown> })?.customer;
    const paymentMethod = (order as { payment_method?: { name?: string } })?.payment_method;
    const statusString = (order as { order_status_string?: string })?.order_status_string || "Unknown";
    const trackingCode = (order as { consignment_id?: string; tracking_code?: string })?.tracking_code;
    const total = (order as { total?: number })?.total;
    const subTotal = (order as { sub_total?: number })?.sub_total;
    const paidAmount = (order as { paid_amount?: number })?.paid_amount;

    return (
      <>
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-4xl font-bold">Order {orderNumber}</h1>
          <div className="flex items-center gap-3">
            <Badge variant="secondary">{statusString}</Badge>
            {trackingCode && (
              <span className="text-sm text-muted-foreground">Tracking: {trackingCode}</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Placed: {(order as { created_at?: string })?.created_at || "N/A"}
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-lg">Current Status</CardTitle>
              <p className="text-sm text-muted-foreground">
                Payment: {paymentMethod?.name || "Unknown"} • Status: {(order as { payment_status?: string })?.payment_status || "Unknown"}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleInvoiceOpen}>
              <FileText className="h-4 w-4 mr-2" />
              Print / Invoice
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
              <div
                className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500"
                style={{
                  width: `${(trackingSteps.filter((s) => s.completed).length - 1) * 33.33}%`,
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
                Customer
              </h3>
              <div className="space-y-1 text-muted-foreground">
                <p>{(customer as { name?: string })?.name || "N/A"}</p>
                {(customer as { email?: string })?.email && <p>{(customer as { email?: string })?.email}</p>}
                {(customer as { phone?: string })?.phone && <p>{(customer as { phone?: string })?.phone}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
              <div className="space-y-3">
                {orderDetails.map((item, index) => {
                  const name = (item as { name?: string })?.name;
                  const qty = (item as { quantity?: number })?.quantity || 0;
                  const price = (item as { sell_price?: { price?: number } })?.sell_price?.price || 0;
                  return (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {name || "Item"} × {qty}
                      </span>
                      <span className="font-medium">৳{Number(price || 0).toLocaleString()}</span>
                    </div>
                  );
                })}
                <div className="pt-3 border-t border-border space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">৳{Number(subTotal || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Paid</span>
                    <span className="font-medium">৳{Number(paidAmount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>৳{Number(total || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex gap-4">
          <Button onClick={() => router.push("/account?tab=orders")} variant="outline">
            Back to Orders
          </Button>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">{renderContent()}</div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderTracking;
