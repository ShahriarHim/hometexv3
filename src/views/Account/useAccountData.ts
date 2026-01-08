import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "@/i18n/routing";
import { orderService, userService } from "@/services/api";
import type { CustomerOrderSummary, TrackingResponse } from "@/types/api/order";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface UserProfile {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  customer_id?: number;
  [key: string]: string | number | undefined;
}

interface Preferences {
  emailNotifications: boolean;
  orderUpdates: boolean;
  marketingEmails: boolean;
  smsNotifications: boolean;
  newsletter: boolean;
}

export const useAccountData = () => {
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
  const [preferences, setPreferences] = useState<Preferences>({
    emailNotifications: true,
    orderUpdates: true,
    marketingEmails: false,
    smsNotifications: false,
    newsletter: false,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  // Load preferences from localStorage
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

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (process.env.NODE_ENV === "development") {
        console.warn("Auth State - isAuthenticated:", isAuthenticated, "user:", user);
        const token = localStorage.getItem("hometex-auth-token");
        console.warn("LocalStorage token:", token ? `${token.substring(0, 20)}...` : "null");
        console.warn("LocalStorage user:", localStorage.getItem("hometex-user"));
      }

      if (!isAuthenticated) {
        setError("Please login to view your profile");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await userService.getProfile();

        if (process.env.NODE_ENV === "development") {
          console.warn("Profile data received:", response);
        }

        const userData = response.user;
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

  // Sync activeTab with URL query parameter
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [searchParams, activeTab]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || activeTab !== "orders") {
        setOrdersFetched(false);
        return;
      }

      if (isLoading) {
        setOrdersLoading(true);
        return;
      }

      const userId = userProfile?.id ? Number(userProfile.id) : null;

      if (!userId || isNaN(userId) || userId <= 0) {
        setOrdersLoading(true);
        setOrdersError(null);
        try {
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
        const response = await orderService.getCustomerOrders(userId);
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
        const error = err as Error & { statusCode?: number; status?: number };
        const statusCode = error.statusCode || error.status;
        let errorMessage = error.message || "Failed to load orders";

        if (
          statusCode === 404 ||
          errorMessage.toLowerCase().includes("404") ||
          errorMessage.toLowerCase().includes("not found")
        ) {
          errorMessage = "no order found, need shopping? click here";
          setOrders([]);
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
    setTrackingLoading((prev) => ({ ...prev, [order.order_number]: true }));
    try {
      let response: TrackingResponse;

      if (order.tracking_code) {
        response = await orderService.trackOrderByCode(order.tracking_code);
      } else {
        response = await orderService.trackOrderByNumber(order.order_number);
      }

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

  const handleTabChange = (nextTab: string) => {
    setActiveTab(nextTab);
    const next = new URLSearchParams(searchParams.toString());
    next.set("tab", nextTab);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const handlePreferencesChange = (key: keyof Preferences, value: boolean) => {
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

  return {
    activeTab,
    userProfile,
    isLoading,
    error,
    orders,
    ordersLoading,
    ordersError,
    ordersFetched,
    trackingStatus,
    trackingLoading,
    isPreferencesOpen,
    preferences,
    isAuthenticated,
    handleTabChange,
    handleTrack,
    handlePreferencesChange,
    handleSavePreferences,
    setIsPreferencesOpen,
  };
};
