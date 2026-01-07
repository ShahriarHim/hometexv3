"use client";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { orderService } from "@/services/api";
import type { OrderDetailResponse } from "@/types/api/order";
import {
  AlertCircle,
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  Copy,
  CreditCard,
  FileText,
  Printer,
  Receipt,
  RefreshCw,
  Share2,
  ShoppingBag,
  User,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const OrderDetails = () => {
  const params = useParams<{ orderId?: string }>();
  const orderId = params?.orderId;
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetailResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    customer: true,
    items: true,
    summary: true,
    payment: true,
    transactions: true,
    additional: false,
  });
  const [imageLightbox, setImageLightbox] = useState<string | null>(null);

  const formatCurrency = (amount: number | string | undefined): string => {
    if (amount === undefined || amount === null) {
      return "0";
    }
    const num = typeof amount === "string" ? parseFloat(amount.replace(/[^0-9.]/g, "")) : amount;
    if (isNaN(num)) {
      return "0";
    }
    return num.toLocaleString("en-US");
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) {
      return "N/A";
    }
    return dateString;
  };

  const getOrderStatusBadge = (status: string, statusNumber: number) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "pending" || statusNumber === 1) {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
          {status}
        </Badge>
      );
    }
    if (statusLower === "completed" || statusLower === "delivered") {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
          {status}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">
        {status}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "paid") {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
          {status}
        </Badge>
      );
    }
    if (statusLower === "unpaid") {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
          {status}
        </Badge>
      );
    }
    if (statusLower.includes("partial") || statusLower === "partially paid") {
      return (
        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300">
          {status}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">
        {status}
      </Badge>
    );
  };

  const getTransactionStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "success") {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
          {status}
        </Badge>
      );
    }
    if (statusLower === "failed") {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
          {status}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">
        {status}
      </Badge>
    );
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const shareOrderLink = async () => {
    if (!orderId) {
      return;
    }
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Order ${order?.order_number || orderId}`,
          text: `Check out my order: ${order?.order_number || orderId}`,
          url,
        });
      } else {
        await copyToClipboard(url, "Order link");
      }
    } catch {
      // User cancelled share or error occurred
    }
  };

  const printOrder = () => {
    window.print();
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const fetchOrder = useCallback(async () => {
    if (!orderId) {
      setError("Order ID is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Try to parse as number (order ID)
      const orderIdNum = parseInt(orderId, 10);
      let response: OrderDetailResponse;

      if (!isNaN(orderIdNum) && orderIdNum > 0) {
        // It's a numeric order ID
        response = await orderService.getOrder(orderIdNum);
      } else {
        // It's an order number (e.g., HTB41012253231)
        response = await orderService.getOrderByNumber(orderId);
      }

      if (!response.success) {
        throw new Error(response.message || "Failed to load order");
      }
      setOrder(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load order details";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const renderLoading = () => (
    <div className="space-y-6">
      {/* Order Header Skeleton */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-6 w-64" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
              </div>
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Customer Information Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-40" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-48" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Items Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="flex gap-4 mb-4">
                  <Skeleton className="h-16 w-16 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex gap-4 mb-4">
                  <Skeleton className="h-16 w-16 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Summary Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="border-t pt-3 flex justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-28" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Information Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-40" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderError = () => (
    <Card>
      <CardContent className="p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h2 className="text-2xl font-semibold">Order not found</h2>
          <p className="text-muted-foreground max-w-md">
            {error || "We couldn't find the order you're looking for."}
          </p>
          <div className="flex gap-3 mt-4">
            <Button onClick={fetchOrder} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
            <Button onClick={() => router.push("/account?tab=orders")}>Back to Orders</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">{renderLoading()}</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">{renderError()}</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          @page {
            size: A4;
            margin: 1cm;
          }

          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* Hide navigation and non-essential elements */
          header,
          footer,
          nav,
          .print\\:hidden,
          button:not(.print\\:visible),
          .no-print {
            display: none !important;
          }

          /* Invoice Header */
          .invoice-header {
            display: flex !important;
            justify-content: space-between;
            align-items: flex-start;
            padding: 20px 0;
            border-bottom: 3px solid #000;
            margin-bottom: 30px;
            page-break-inside: avoid;
          }

          .invoice-header-left h1 {
            font-size: 28px;
            font-weight: bold;
            margin: 0 0 10px 0;
            color: #000;
          }

          .invoice-header-left p {
            margin: 5px 0;
            font-size: 12px;
            color: #666;
          }

          .invoice-header-right {
            text-align: right;
          }

          .invoice-header-right h2 {
            font-size: 24px;
            font-weight: bold;
            margin: 0 0 10px 0;
            color: #000;
          }

          .invoice-header-right .invoice-number {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin-bottom: 5px;
          }

          /* Invoice Footer */
          .invoice-footer {
            display: flex !important;
            justify-content: space-between;
            align-items: center;
            padding: 20px 0;
            border-top: 2px solid #000;
            margin-top: 40px;
            page-break-inside: avoid;
            font-size: 11px;
            color: #666;
          }

          .invoice-footer-left,
          .invoice-footer-right {
            flex: 1;
          }

          .invoice-footer-center {
            text-align: center;
            flex: 1;
            font-weight: 600;
            color: #000;
          }

          /* Main content styling */
          main {
            padding: 0 !important;
            margin: 0 !important;
          }

          .container {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          /* Cards styling */
          .space-y-6 > * {
            margin-bottom: 20px;
            page-break-inside: avoid;
          }

          [class*="Card"] {
            border: 1px solid #ddd !important;
            box-shadow: none !important;
            page-break-inside: avoid;
            margin-bottom: 15px;
          }

          [class*="CardHeader"] {
            background: #f8f9fa !important;
            border-bottom: 1px solid #ddd;
            padding: 15px !important;
          }

          [class*="CardTitle"] {
            font-size: 16px;
            font-weight: 600;
            color: #000;
          }

          [class*="CardContent"] {
            padding: 15px !important;
          }

          /* Table styling */
          table {
            width: 100%;
            border-collapse: collapse;
            page-break-inside: avoid;
          }

          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }

          th {
            background: #f8f9fa !important;
            font-weight: 600;
            color: #000;
          }

          /* Badge styling */
          [class*="Badge"] {
            border: 1px solid #000 !important;
            padding: 4px 8px;
            font-size: 11px;
          }

          /* Hide collapsible triggers in print */
          [class*="CollapsibleTrigger"] {
            pointer-events: none;
          }

          [class*="CollapsibleTrigger"] [class*="Chevron"] {
            display: none;
          }

          /* Ensure all sections are expanded in print */
          [class*="CollapsibleContent"] {
            display: block !important;
          }

          /* Image styling */
          img {
            max-width: 80px;
            height: auto;
          }

          /* Text colors */
          .text-muted-foreground {
            color: #666 !important;
          }

          /* Summary box */
          .order-summary-print {
            background: #f8f9fa !important;
            border: 2px solid #000 !important;
            padding: 15px;
            margin: 20px 0;
          }

          .order-summary-print .total-row {
            border-top: 2px solid #000;
            padding-top: 10px;
            margin-top: 10px;
            font-weight: bold;
            font-size: 18px;
          }
        }
      `,
        }}
      />
      <div className="min-h-screen flex flex-col print:bg-white">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          {/* Invoice Header - Print Only */}
          <div className="hidden print:flex invoice-header">
            <div className="invoice-header-left">
              <h1>HOMETEX BANGLADESH</h1>
              <p>Your Trusted Home Textile Partner</p>
              <p>Email: info@hometexbd.ltd | Phone: +880-XXX-XXXXXXX</p>
              <p>Address: [Company Address]</p>
            </div>
            <div className="invoice-header-right">
              <h2>INVOICE</h2>
              <div className="invoice-number">Order #: {order.order_number}</div>
              <div>Date: {formatDate(order.created_at)}</div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto space-y-6">
            {/* Order Header */}
            <Card className="print:shadow-none">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="text-3xl font-bold">Order Details</h1>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                copyToClipboard(order.order_number, "Order number");
                              }}
                              className="h-auto p-2 cursor-pointer hover:bg-muted relative z-10"
                              aria-label="Copy order number to clipboard"
                              type="button"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copy order number</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center gap-2 text-lg font-mono">
                      {order.order_number}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      {getOrderStatusBadge(order.order_status_string, order.order_status)}
                      {getPaymentStatusBadge(order.order_status_string)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button variant="outline" size="sm" onClick={shareOrderLink}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={printOrder}
                      className="print:hidden"
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                    <Button variant="outline" size="sm" onClick={fetchOrder}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Order Date:</span>
                    <span className="font-medium">{formatDate(order.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span className="font-medium">{formatDate(order.updated_at)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Collapsible
              open={expandedSections.customer}
              onOpenChange={() => toggleSection("customer")}
            >
              <Card>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Customer Information
                    </CardTitle>
                    {expandedSections.customer ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{order.customer.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Customer ID</p>
                        <p className="font-medium">#{order.customer.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium break-all">{order.customer.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{order.customer.phone}</p>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Order Items */}
            <Collapsible open={expandedSections.items} onOpenChange={() => toggleSection("items")}>
              <Card>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5" />
                      Order Items ({order.order_details.length})
                    </CardTitle>
                    {expandedSections.items ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-20">Image</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Brand</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Quantity</TableHead>
                            <TableHead className="text-right">Unit Price</TableHead>
                            <TableHead className="text-right">Discount</TableHead>
                            <TableHead className="text-right">Line Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {order.order_details.map((item) => {
                            const lineTotal =
                              item.sell_price.price * item.quantity - (item.discount_fixed || 0);
                            return (
                              <TableRow key={item.id}>
                                <TableCell>
                                  <div
                                    className="relative w-16 h-16 cursor-pointer hover:opacity-80 transition-opacity rounded overflow-hidden"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      if (item.photo) {
                                        setImageLightbox(item.photo);
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (item.photo) {
                                          setImageLightbox(item.photo);
                                        }
                                      }
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`View ${item.name} image in lightbox`}
                                  >
                                    <Image
                                      src={item.photo || "/placeholder.svg"}
                                      alt={item.name}
                                      fill
                                      className="object-cover rounded"
                                      onError={(e) => {
                                        e.currentTarget.src = "/placeholder.svg";
                                      }}
                                    />
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    <p className="font-medium line-clamp-2">{item.name}</p>
                                    {item.supplier && (
                                      <p className="text-xs text-muted-foreground">
                                        Supplier: {item.supplier}
                                      </p>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <code className="text-xs bg-muted px-2 py-1 rounded">
                                    {item.sku}
                                  </code>
                                </TableCell>
                                <TableCell>
                                  <span className="text-sm">{item.brand || "N/A"}</span>
                                </TableCell>
                                <TableCell>
                                  <div className="text-xs space-y-0.5">
                                    <p>{item.category || "N/A"}</p>
                                    {item.sub_category && (
                                      <p className="text-muted-foreground">{item.sub_category}</p>
                                    )}
                                    {item.child_sub_category && (
                                      <p className="text-muted-foreground">
                                        {item.child_sub_category}
                                      </p>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <span className="font-medium">{item.quantity}</span>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="space-y-0.5">
                                    <p className="font-medium">
                                      {formatCurrency(item.sell_price.price)}৳
                                    </p>
                                    {item.sell_price.original_price !== item.sell_price.price && (
                                      <p className="text-xs text-muted-foreground line-through">
                                        {formatCurrency(item.sell_price.original_price)}৳
                                      </p>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  {item.discount_fixed > 0 || item.discount_percent > 0 ? (
                                    <div className="space-y-0.5">
                                      {item.discount_fixed > 0 && (
                                        <p className="text-sm text-orange-600">
                                          -{formatCurrency(item.discount_fixed)}৳
                                        </p>
                                      )}
                                      {item.discount_percent > 0 && (
                                        <p className="text-xs text-muted-foreground">
                                          ({item.discount_percent}%)
                                        </p>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground">—</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <span className="font-semibold">
                                    {formatCurrency(lineTotal)}৳
                                  </span>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Order Summary */}
            <Collapsible
              open={expandedSections.summary}
              onOpenChange={() => toggleSection("summary")}
            >
              <Card>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Receipt className="h-5 w-5" />
                      Order Summary
                    </CardTitle>
                    {expandedSections.summary ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div className="space-y-3 order-summary-print">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">{formatCurrency(order.sub_total)}৳</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Discount</span>
                          <span className="font-medium text-orange-600">
                            -{formatCurrency(order.discount)}৳
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Quantity</span>
                        <span className="font-medium">{order.quantity} items</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between text-lg font-semibold total-row">
                        <span>Total Amount</span>
                        <span>{formatCurrency(order.total)}৳</span>
                      </div>
                      {order.due_amount > 0 && (
                        <div className="flex justify-between text-sm text-orange-600">
                          <span>Due Amount</span>
                          <span className="font-medium">{formatCurrency(order.due_amount)}৳</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Paid Amount</span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(order.paid_amount)}৳
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Payment Information */}
            <Collapsible
              open={expandedSections.payment}
              onOpenChange={() => toggleSection("payment")}
            >
              <Card>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Information
                    </CardTitle>
                    {expandedSections.payment ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Payment Method</p>
                        <p className="font-medium">{order.payment_method.name}</p>
                      </div>
                      {order.payment_method.account_number && (
                        <div>
                          <p className="text-sm text-muted-foreground">Account Number</p>
                          <p className="font-medium font-mono">
                            {order.payment_method.account_number}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-muted-foreground">Payment Status</p>
                        <div className="mt-1">
                          {getPaymentStatusBadge(order.order_status_string)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Transaction History */}
            {order.transactions && order.transactions.length > 0 && (
              <Collapsible
                open={expandedSections.transactions}
                onOpenChange={() => toggleSection("transactions")}
              >
                <Card className="mb-6">
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Transaction History ({order.transactions.length})
                      </CardTitle>
                      {expandedSections.transactions ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Transaction ID</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead className="text-right">Amount</TableHead>
                              <TableHead>Payment Method</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Transaction By</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {order.transactions.map((transaction) => (
                              <TableRow key={transaction.id}>
                                <TableCell>
                                  <code className="text-xs bg-muted px-2 py-1 rounded">
                                    {transaction.trx_id}
                                  </code>
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                  {formatDate(transaction.created_at)}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">{transaction.transaction_type}</Badge>
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                  {formatCurrency(transaction.amount)}৳
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-0.5">
                                    <p className="text-sm">{transaction.payment_method_name}</p>
                                    {transaction.account_number && (
                                      <p className="text-xs text-muted-foreground font-mono">
                                        {transaction.account_number}
                                      </p>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {getTransactionStatusBadge(transaction.status)}
                                </TableCell>
                                <TableCell>
                                  <span className="text-sm">{transaction.transaction_by}</span>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            )}

            {/* Additional Information */}
            {(order.sales_manager || order.shop) && (
              <Collapsible
                open={expandedSections.additional}
                onOpenChange={() => toggleSection("additional")}
              >
                <Card>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Additional Information
                      </CardTitle>
                      {expandedSections.additional ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {order.sales_manager && (
                          <div>
                            <p className="text-sm text-muted-foreground">Sales Manager</p>
                            <p className="font-medium">
                              {order.sales_manager.name} (ID: {order.sales_manager.id})
                            </p>
                          </div>
                        )}
                        {order.shop && (
                          <div>
                            <p className="text-sm text-muted-foreground">Shop</p>
                            <p className="font-medium">
                              {order.shop.name} (ID: {order.shop.id})
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 print:hidden">
              <Button onClick={() => router.push("/account?tab=orders")} variant="outline">
                Back to Orders
              </Button>
            </div>

            {/* Invoice Footer - Print Only */}
            <div className="hidden print:flex invoice-footer">
              <div className="invoice-footer-left">
                <p>
                  <strong>Payment Terms:</strong> {order.payment_status}
                </p>
                <p>
                  <strong>Payment Method:</strong> {order.payment_method.name}
                </p>
                {order.payment_method.account_number && (
                  <p>
                    <strong>Account:</strong> {order.payment_method.account_number}
                  </p>
                )}
              </div>
              <div className="invoice-footer-center">
                <p>Thank you for your business!</p>
                <p>www.hometexbd.ltd</p>
              </div>
              <div className="invoice-footer-right">
                <p>
                  <strong>Total Amount:</strong>
                </p>
                <p style={{ fontSize: "16px", fontWeight: "bold", marginTop: "5px" }}>
                  {formatCurrency(order.total)}৳
                </p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>

      {/* Image Lightbox */}
      {imageLightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setImageLightbox(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20"
              onClick={() => setImageLightbox(null)}
            >
              <ChevronUp className="h-4 w-4 rotate-45" />
            </Button>
            <Image
              src={imageLightbox}
              alt="Product"
              width={800}
              height={800}
              className="object-contain rounded-lg"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default OrderDetails;
