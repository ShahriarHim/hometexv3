"use client";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "@/i18n/routing";
import { orderService, userService } from "@/services/api";
import type { CustomerOrderSummary, TrackingResponse } from "@/types/api/order";
import { Loader2, RefreshCcw, Truck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { memo, useEffect, useRef, useState } from "react";
import { FaBox, FaCog, FaHeart, FaUser } from "react-icons/fa";

interface UserProfile {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  customer_id?: number;
  [key: string]: string | number | undefined;
}

// Memoized order card component for better performance
const OrderCard = memo(
  ({
    order,
    trackingStatus,
    trackingLoading,
    onTrack,
  }: {
    order: CustomerOrderSummary;
    trackingStatus?: string;
    trackingLoading: boolean;
    onTrack: () => void;
  }) => {
    return (
      <Card className="bg-slate-100 border-slate-300">
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
              <div>Status: {order.order_status_string}</div>
              <div>Shop: {order.shop}</div>
            </div>
            <div className="text-sm text-muted-foreground">
              <div>Total: ৳{order.total}</div>
              <div>Quantity: {order.quantity}</div>
              {order.tracking_code && <div>Tracking: {order.tracking_code}</div>}
            </div>
          </div>
          <Separator />
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link href={`/orders/${order.order_number}` as unknown as "/orders"}>
                View Details
              </Link>
            </Button>
            <Button variant="default" size="sm" onClick={onTrack} disabled={trackingLoading}>
              {trackingLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Truck className="h-4 w-4 mr-2" />
              )}
              Track
            </Button>
            {trackingStatus && (
              <div className="text-sm flex items-center gap-2">
                <span className="font-medium text-muted-foreground">Delivery Status:</span>
                <span className="text-foreground font-semibold">{trackingStatus}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

OrderCard.displayName = "OrderCard";

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
  const [ordersFetched, setOrdersFetched] = useState(false);
  const [trackingStatus, setTrackingStatus] = useState<Record<string, string>>({});
  const [trackingLoading, setTrackingLoading] = useState<Record<string, boolean>>({});
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    orderUpdates: true,
    marketingEmails: false,
    smsNotifications: false,
    newsletter: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const savedPreferences = localStorage.getItem("userPreferences");
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(parsed);
      } catch (error) {
        console.error("Failed to parse user preferences:", error);
      }
    }
  }, []);

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

        // Extract customer_id from customer_info if available
        const customerId =
          (response.customer_info?.id as number | undefined) ||
          (response.customer_info?.customer_id as number | undefined) ||
          (response.customer_info as { id?: number })?.id;

        const mappedProfile: UserProfile = {
          id: userData.id,
          name: userData.name || `${userData.first_name || ""} ${userData.last_name || ""}`.trim(),
          email: userData.email,
          phone: userData.phone,
          address: userData.address || response.addresses?.[0]?.address || undefined,
          customer_id: customerId,
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
        setOrdersFetched(false);
        return;
      }

      // Wait for profile to load before fetching orders
      if (isLoading) {
        setOrdersLoading(true);
        return;
      }

      // Get customer ID from userProfile.customer_id (preferred)
      // Note: customer_id is different from user.id - customer_id is from the Customer model
      const customerId = userProfile?.customer_id ? Number(userProfile.customer_id) : null;

      // If we don't have customer_id, try using /api/my-order endpoint (requires auth)
      if (!customerId || isNaN(customerId) || customerId <= 0) {
        setOrdersLoading(true);
        setOrdersError(null);
        try {
          // Fallback to authenticated endpoint that returns current user's orders
          const response = await orderService.getMyOrders();
          if (!response.success) {
            throw new Error(response.message || "Failed to load orders");
          }
          setOrders(response.data || []);
          setOrdersFetched(true);
          return;
        } catch (fallbackErr) {
          const error = fallbackErr as Error & { statusCode?: number; status?: number };
          const statusCode = error.statusCode || error.status;
          let errorMessage = error.message || "Failed to load orders";

          if (
            statusCode === 404 ||
            errorMessage.toLowerCase().includes("404") ||
            errorMessage.toLowerCase().includes("not found")
          ) {
            errorMessage = "no order found, need shopping? click here";
          }
          setOrdersError(errorMessage);
          setOrders([]);
          setOrdersFetched(true);
          return;
        } finally {
          setOrdersLoading(false);
        }
      }

      setOrdersLoading(true);
      setOrdersError(null);
      try {
        // Use the customer-specific endpoint with customer_id
        const response = await orderService.getCustomerOrders(customerId);
        if (!response.success) {
          let errorMessage = response.message || "Failed to load orders";
          if (
            errorMessage.toLowerCase().includes("customer not found") ||
            errorMessage.toLowerCase().includes("not found") ||
            errorMessage.toLowerCase().includes("404")
          ) {
            errorMessage = "no order found, need shopping? click here";
          }
          throw new Error(errorMessage);
        }
        setOrders(response.data || []);
        setOrdersFetched(true);
      } catch (err) {
        // Handle 404 or other errors gracefully
        const error = err as Error & { statusCode?: number; status?: number };
        const statusCode = error.statusCode || error.status;
        let errorMessage = error.message || "Failed to load orders";

        // If it's a 404, the endpoint doesn't exist - show user-friendly message
        if (
          statusCode === 404 ||
          errorMessage.toLowerCase().includes("404") ||
          errorMessage.toLowerCase().includes("not found")
        ) {
          errorMessage = "no order found, need shopping? click here";
          setOrders([]); // Clear orders on 404
        } else if (errorMessage.toLowerCase().includes("customer not found")) {
          errorMessage = "no order found, need shopping? click here";
        }

        setOrdersError(errorMessage);
        setOrdersFetched(true);
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

  const handlePreferencesChange = (key: keyof typeof preferences, value: boolean) => {
    setPreferences((prev) => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem("userPreferences", JSON.stringify(updated));
      return updated;
    });
  };

  const handleSavePreferences = () => {
    localStorage.setItem("userPreferences", JSON.stringify(preferences));
    setIsPreferencesOpen(false);
  };

  const handleTrack = async (order: CustomerOrderSummary) => {
    setTrackingLoading((prev) => ({ ...prev, [order.order_number]: true }));
    try {
      let response: TrackingResponse;

      // Try tracking by tracking_code first if available
      if (order.tracking_code) {
        response = await orderService.trackOrderByCode(order.tracking_code);
      } else {
        // Fallback to tracking by order_number (invoice)
        response = await orderService.trackOrderByNumber(order.order_number);
      }

      if (!response.success) {
        throw new Error(formatError(response));
      }

      // Extract delivery status from response
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

  const renderOrders = () => {
    // Show loader if loading or if we haven't fetched yet (waiting for profile)
    if (ordersLoading || (activeTab === "orders" && !ordersFetched && isLoading)) {
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
    // Only show "No orders yet" if we've actually fetched and got empty results
    if (ordersFetched && (!orders || orders.length === 0)) {
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
          <OrderCard
            key={order.order_number}
            order={order}
            trackingStatus={trackingStatus[order.order_number]}
            trackingLoading={trackingLoading[order.order_number]}
            onTrack={() => handleTrack(order)}
          />
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
            <TabsTrigger value="profile" className="group flex items-center gap-2">
              <div className="text-yellow-600">
                <FaUser className="h-5 w-5" />
              </div>
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders" className="group flex items-center gap-2">
              <div className="text-yellow-600">
                <FaBox className="h-5 w-5" />
              </div>
              Orders
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="group flex items-center gap-2">
              <div className="text-yellow-600">
                <FaHeart className="h-5 w-5" />
              </div>
              Wishlist
            </TabsTrigger>
            <TabsTrigger value="settings" className="group flex items-center gap-2">
              <div className="text-yellow-600">
                <FaCog className="h-5 w-5" />
              </div>
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
                  <Button variant="outline" onClick={() => setIsPreferencesOpen(true)}>
                    Manage Preferences
                  </Button>
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

      <Dialog open={isPreferencesOpen} onOpenChange={setIsPreferencesOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Account Preferences</DialogTitle>
            <DialogDescription>
              Manage your account preferences and notification settings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications" className="text-base">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications about your account
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) =>
                    handlePreferencesChange("emailNotifications", checked)
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="order-updates" className="text-base">
                    Order Updates
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about order status changes
                  </p>
                </div>
                <Switch
                  id="order-updates"
                  checked={preferences.orderUpdates}
                  onCheckedChange={(checked) => handlePreferencesChange("orderUpdates", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketing-emails" className="text-base">
                    Marketing Emails
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive promotional emails and special offers
                  </p>
                </div>
                <Switch
                  id="marketing-emails"
                  checked={preferences.marketingEmails}
                  onCheckedChange={(checked) => handlePreferencesChange("marketingEmails", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-notifications" className="text-base">
                    SMS Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive text message notifications
                  </p>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={preferences.smsNotifications}
                  onCheckedChange={(checked) =>
                    handlePreferencesChange("smsNotifications", checked)
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="newsletter" className="text-base">
                    Newsletter
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Subscribe to our newsletter for updates
                  </p>
                </div>
                <Switch
                  id="newsletter"
                  checked={preferences.newsletter}
                  onCheckedChange={(checked) => handlePreferencesChange("newsletter", checked)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreferencesOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePreferences}>Save Preferences</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Account;
