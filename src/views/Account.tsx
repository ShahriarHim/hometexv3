"use client";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "@/i18n/routing";
import { env } from "@/lib/env";
import { orderService, userService } from "@/services/api";
import type { CustomerOrderSummary, InvoiceResponse, TrackingResponse } from "@/types/api/order";
import { FileText, Heart, Loader2, Package, RefreshCcw, Settings, Truck, User } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface UserProfile {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  [key: string]: string | number | undefined;
}

const Account = () => {
  const { isAuthenticated, user } = useAuth();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const initialTabRef = useRef<string>(searchParams.get("tab") || "profile");
  const [activeTab, setActiveTab] = useState<string>(initialTabRef.current);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<CustomerOrderSummary[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [trackingStatus, setTrackingStatus] = useState<Record<string, string>>({});
  const [trackingLoading, setTrackingLoading] = useState<Record<string, boolean>>({});
  const [invoiceLoading, setInvoiceLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      // Debug log
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.log("Auth State - isAuthenticated:", isAuthenticated, "user:", user);
        const token = localStorage.getItem("hometex-auth-token");
        // eslint-disable-next-line no-console
        console.log("LocalStorage token:", token ? `${token.substring(0, 20)}...` : "null");
        // eslint-disable-next-line no-console
        console.log("LocalStorage user:", localStorage.getItem("hometex-user"));
      }

      // Wait for auth to be checked
      if (!isAuthenticated) {
        setError("Please login to view your profile");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Use the new userService to fetch profile
        const response = await userService.getProfile();

        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.log("Profile data received:", response);
        }

        // Map the API response to our UserProfile interface
        const userData = response.user;
        const mappedProfile: UserProfile = {
          id: userData.id,
          name: userData.name || `${userData.first_name || ""} ${userData.last_name || ""}`.trim(),
          email: userData.email,
          phone: userData.phone,
          address: userData.address || response.addresses?.[0]?.address || undefined,
        };

        setUserProfile(mappedProfile);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError(err instanceof Error ? err.message : "Failed to load profile");

        // If 401 error, clear local storage
        if (err instanceof Error && err.message.includes("401")) {
          localStorage.removeItem("hometex-auth-token");
          localStorage.removeItem("hometex-user");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, user]);

  // Sync activeTab with URL query parameter when it changes externally
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [searchParams, activeTab]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || activeTab !== "orders") {
        return;
      }

      // Wait for profile to load before fetching orders
      if (isLoading) {
        return;
      }

      // Get customer ID from userProfile (preferred) or fallback to user.id
      const customerId = userProfile?.id ? userProfile.id : user?.id ? Number(user.id) : null;

      // Validate customer ID
      if (!customerId || isNaN(customerId) || customerId <= 0) {
        setOrdersError("Unable to load orders: Invalid customer ID");
        setOrdersLoading(false);
        return;
      }

      setOrdersLoading(true);
      setOrdersError(null);
      try {
        const response = await orderService.getCustomerOrders(customerId);
        if (!response.success) {
          let errorMessage = response.message || "Failed to load orders";
          if (errorMessage.toLowerCase().includes("customer not found")) {
            errorMessage = "no order found, need shopping? click here";
          }
          throw new Error(errorMessage);
        }
        setOrders(response.data || []);
      } catch (err) {
        let errorMessage = err instanceof Error ? err.message : "Failed to load orders";
        if (errorMessage.toLowerCase().includes("customer not found")) {
          errorMessage = "no order found, need shopping? click here";
        }
        setOrdersError(errorMessage);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [activeTab, isAuthenticated, user, userProfile, isLoading]);

  if (!isAuthenticated) {
    return null;
  }

  // Sync tab with query string without causing loops
  const handleTabChange = (nextTab: string) => {
    setActiveTab(nextTab);
    // Use router.replace with pathname and query params separately
    // pathname from i18n routing doesn't include locale, router handles it
    const next = new URLSearchParams(searchParams.toString());
    next.set("tab", nextTab);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const formatError = (payload: unknown): string => {
    if (!payload || typeof payload !== "object") {
      return "Something went wrong";
    }
    const maybeResp = payload as {
      message?: string;
      error?: string;
      errors?: Record<string, string[]>;
    };
    if (maybeResp.errors && Object.keys(maybeResp.errors).length > 0) {
      const first = Object.values(maybeResp.errors)[0];
      if (first?.[0]) {
        return first[0];
      }
    }
    if (maybeResp.error) {
      try {
        const parsed = JSON.parse(maybeResp.error);
        if (parsed && typeof parsed === "object") {
          const firstParsed = Object.values(parsed)[0];
          if (typeof firstParsed === "string") {
            return firstParsed;
          }
        }
      } catch {
        return maybeResp.error;
      }
    }
    if (maybeResp.message) {
      return maybeResp.message;
    }
    return "Something went wrong";
  };

  const handleTrack = async (order: CustomerOrderSummary) => {
    if (!order.tracking_code) {
      setTrackingStatus((prev) => ({ ...prev, [order.order_number]: "Tracking code missing" }));
      return;
    }
    setTrackingLoading((prev) => ({ ...prev, [order.order_number]: true }));
    try {
      const response: TrackingResponse = await orderService.trackOrderByCode(order.tracking_code);
      if (!response.success) {
        throw new Error(formatError(response));
      }
      const statusLabel =
        response.data?.delivery_status || response.data?.status?.toString() || "Status unavailable";
      setTrackingStatus((prev) => ({ ...prev, [order.order_number]: statusLabel }));
    } catch (err) {
      setTrackingStatus((prev) => ({
        ...prev,
        [order.order_number]:
          err instanceof Error ? err.message : "Failed to fetch tracking status",
      }));
    } finally {
      setTrackingLoading((prev) => ({ ...prev, [order.order_number]: false }));
    }
  };

  const handleInvoice = async (order: CustomerOrderSummary) => {
    setInvoiceLoading((prev) => ({ ...prev, [order.order_number]: true }));
    try {
      const response: InvoiceResponse = await orderService.getInvoice(order.order_number);
      if (!response.success) {
        throw new Error(formatError(response));
      }
      // Open invoice endpoint directly (server returns JSON, but URL provides PDF/print view)
      const invoiceUrl = `${env.apiBaseUrl}/api/orders/invoice/${order.order_number}`;
      window.open(invoiceUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      setOrdersError(err instanceof Error ? err.message : "Failed to load invoice");
    } finally {
      setInvoiceLoading((prev) => ({ ...prev, [order.order_number]: false }));
    }
  };

  const renderOrders = () => {
    if (ordersLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-sm text-muted-foreground">Loading orders...</span>
        </div>
      );
    }
    if (ordersError) {
      const isNoOrderError = ordersError.toLowerCase().includes("no order found");
      return (
        <div className="text-center py-8">
          {isNoOrderError ? (
            <>
              <p className="text-muted-foreground mb-4">
                No order found, need shopping?{" "}
                <Link href="/products" className="text-primary underline hover:text-primary/80">
                  click here
                </Link>
              </p>
            </>
          ) : (
            <>
              <p className="text-destructive mb-4">{ordersError}</p>
              <Button onClick={() => setActiveTab("orders")}>
                <RefreshCcw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </>
          )}
        </div>
      );
    }
    if (!orders || orders.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No orders yet. Start shopping to see orders.</p>
          <Button asChild>
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.order_number}>
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-lg">Order {order.order_number}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Placed: {order.created_at} • Updated: {order.updated_at}
                </p>
              </div>
              <Badge variant={order.order_status_string === "Completed" ? "default" : "outline"}>
                {order.order_status_string}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="text-sm text-muted-foreground">
                  <div>Payment: {order.payment_method}</div>
                  <div>Status: {order.payment_status}</div>
                  <div>Shop: {order.shop}</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div>Total: ৳{order.total}</div>
                  <div>Quantity: {order.quantity}</div>
                  {order.tracking_code && <div>Tracking: {order.tracking_code}</div>}
                </div>
              </div>
              <Separator />
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleTrack(order)}
                  disabled={trackingLoading[order.order_number]}
                >
                  {trackingLoading[order.order_number] ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Truck className="h-4 w-4 mr-2" />
                  )}
                  Track
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleInvoice(order)}
                  disabled={invoiceLoading[order.order_number]}
                >
                  {invoiceLoading[order.order_number] ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  Invoice
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/orders/${order.order_number}` as unknown as "/orders"}>
                    View Details
                  </Link>
                </Button>
              </div>
              {trackingStatus[order.order_number] && (
                <div className="text-sm text-muted-foreground">
                  Current delivery status:{" "}
                  <span className="text-foreground">{trackingStatus[order.order_number]}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Package className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="wishlist">
              <Heart className="h-4 w-4 mr-2" />
              Wishlist
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Loading profile...</span>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-destructive mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                  </div>
                ) : userProfile ? (
                  <>
                    <div>
                      <label className="text-sm font-medium">Full Name</label>
                      <p className="text-muted-foreground">{userProfile.name || "Not provided"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-muted-foreground">{userProfile.email || "Not provided"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      <p className="text-muted-foreground">{userProfile.phone || "Not provided"}</p>
                    </div>
                    {userProfile.address && (
                      <div>
                        <label className="text-sm font-medium">Address</label>
                        <p className="text-muted-foreground">{userProfile.address}</p>
                      </div>
                    )}
                    <Button>Edit Profile</Button>
                  </>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    No profile data available
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>{renderOrders()}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wishlist">
            <Card>
              <CardHeader>
                <CardTitle>My Wishlist</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">View and manage your saved items</p>
                <Button asChild>
                  <Link href={"/account/wishlist" as unknown as "/account"}>View Wishlist</Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Preferences</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage your account preferences
                  </p>
                  <Button variant="outline">Manage Preferences</Button>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Security</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Change password and security settings
                  </p>
                  <Button variant="outline">Security Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
