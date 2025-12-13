"use client";

import { useAuth } from "@/context/AuthContext";
import { ApiError, orderService } from "@/services/api";
import type { CartItem } from "@/types";
import type { CreateOrderRequest, PaymentMethod } from "@/types/api/order";
import React, {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  success?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  paymentMethod: string;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    zip: string;
    state?: string;
    country?: string;
    email?: string;
  };
  trackingNumber?: string;
  orderNumber?: string;
  notes?: string;
  couponCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderContextType {
  orders: Order[];
  createOrder: (orderData: Omit<Order, "id" | "createdAt" | "updatedAt">) => Promise<Order>;
  getOrderById: (orderId: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  cancelOrder: (orderId: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const getOrdersStorageKey = (userId: string | null): string => {
  return userId ? `hometex-orders-${userId}` : "hometex-orders-guest";
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const currentUserIdRef = useRef<string | null>(null);
  const hasLoadedRef = useRef<boolean>(false);
  const isTransitioningRef = useRef<boolean>(false);

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
      // Attempt to parse nested JSON inside error string (e.g. Steadfast validation)
      try {
        const parsed = JSON.parse(responseData.error);
        if (parsed && typeof parsed === "object") {
          const firstParsedMsg = Object.values(parsed)[0];
          if (typeof firstParsedMsg === "string") {
            return firstParsedMsg;
          }
        }
      } catch {
        // ignore JSON parse failures, fall back below
      }
      return responseData.error;
    }
    if (responseData.message) {
      return responseData.message;
    }
    return error.message || "Failed to place order. Please try again.";
  };

  // Load orders from localStorage and handle user changes
  useEffect(() => {
    const currentUserId = user?.id || null;
    const storageKey = getOrdersStorageKey(currentUserId);

    // Check if user changed (only after initial load)
    if (hasLoadedRef.current && currentUserIdRef.current !== currentUserId) {
      // User changed - immediately clear state to prevent stale data
      isTransitioningRef.current = true;
      setOrders([]);
      currentUserIdRef.current = currentUserId;

      // Load the new user's orders
      const savedOrders = localStorage.getItem(storageKey);
      if (savedOrders) {
        try {
          const parsed = JSON.parse(savedOrders);
          const ordersList = Array.isArray(parsed) ? parsed : parsed.orders || [];
          // Filter orders to only include those belonging to current user
          const userOrders = ordersList.filter(
            (order: Order) => !currentUserId || order.userId === currentUserId
          );
          startTransition(() => {
            setOrders(userOrders);
            isTransitioningRef.current = false;
          });
        } catch {
          startTransition(() => {
            setOrders([]);
            isTransitioningRef.current = false;
          });
        }
      } else {
        startTransition(() => {
          setOrders([]);
          isTransitioningRef.current = false;
        });
      }
      return;
    }

    // Handle initial load or when user becomes null (logout)
    if (!hasLoadedRef.current || currentUserId === null) {
      if (currentUserId === null) {
        // User logged out - clear state immediately
        setOrders([]);
        currentUserIdRef.current = null;
        hasLoadedRef.current = true;
        return;
      }

      // Initial load - load from localStorage if available
      const savedOrders = localStorage.getItem(storageKey);
      if (savedOrders) {
        try {
          const parsed = JSON.parse(savedOrders);
          const ordersList = Array.isArray(parsed) ? parsed : parsed.orders || [];
          // Filter orders to only include those belonging to current user
          const userOrders = ordersList.filter(
            (order: Order) => !currentUserId || order.userId === currentUserId
          );
          startTransition(() => {
            setOrders(userOrders);
            currentUserIdRef.current = currentUserId;
            hasLoadedRef.current = true;
          });
        } catch {
          startTransition(() => {
            setOrders([]);
            currentUserIdRef.current = currentUserId;
            hasLoadedRef.current = true;
          });
        }
      } else {
        // Also check old format for backward compatibility
        const oldOrders = localStorage.getItem("hometex-orders");
        if (oldOrders) {
          try {
            const parsed = JSON.parse(oldOrders);
            const ordersList = Array.isArray(parsed) ? parsed : parsed.orders || [];
            // Filter orders to only include those belonging to current user
            const userOrders = ordersList.filter(
              (order: Order) => !currentUserId || order.userId === currentUserId
            );
            // Migrate old orders to new format
            startTransition(() => {
              setOrders(userOrders);
              localStorage.setItem(storageKey, JSON.stringify(userOrders));
              localStorage.removeItem("hometex-orders");
              currentUserIdRef.current = currentUserId;
              hasLoadedRef.current = true;
            });
          } catch {
            startTransition(() => {
              setOrders([]);
              currentUserIdRef.current = currentUserId;
              hasLoadedRef.current = true;
            });
          }
        } else {
          currentUserIdRef.current = currentUserId;
          hasLoadedRef.current = true;
        }
      }
    }
  }, [user?.id]);

  useEffect(() => {
    if (!hasLoadedRef.current || isTransitioningRef.current) {
      return; // Don't save before initial load or during user transitions
    }

    const currentUserId = user?.id || null;
    // Only save if user ID matches current ref (prevent saving to wrong user's storage)
    if (currentUserIdRef.current !== currentUserId) {
      return;
    }

    const storageKey = getOrdersStorageKey(currentUserId);
    // Only save orders that belong to current user
    const userOrders = orders.filter((order) => !currentUserId || order.userId === currentUserId);
    localStorage.setItem(storageKey, JSON.stringify(userOrders));
  }, [orders, user?.id]);

  const createOrder = async (
    orderData: Omit<Order, "id" | "createdAt" | "updatedAt">
  ): Promise<Order> => {
    if (!orderData.items || orderData.items.length === 0) {
      const validationError = new ApiError("Cart is empty. Add items before checkout.");
      toast.error(validationError.message);
      throw validationError;
    }

    if (!orderData.userId) {
      const validationError = new ApiError("User ID is required. Please log in again.");
      toast.error(validationError.message);
      throw validationError;
    }

    // Convert userId to number, handling both numeric strings and numbers
    let customerId: number;
    if (typeof orderData.userId === "string") {
      // Check if it's a temporary ID (starts with "user-")
      if (orderData.userId.startsWith("user-")) {
        const validationError = new ApiError("Please log in again to complete your order.");
        toast.error(validationError.message);
        throw validationError;
      }
      // Try to parse as number
      customerId = Number(orderData.userId);
    } else {
      customerId = Number(orderData.userId);
    }

    // Validate the converted number
    if (isNaN(customerId) || customerId <= 0) {
      console.error("Invalid customer ID:", orderData.userId, "converted to:", customerId);
      const validationError = new ApiError("Invalid user ID. Please log in again.");
      toast.error(validationError.message);
      throw validationError;
    }

    const paymentMethod: PaymentMethod = orderData.paymentMethod === "cod" ? "cod" : "ssl_commerce";

    const payload: CreateOrderRequest = {
      customerId: customerId,
      items: orderData.items.map((item) => ({
        id: String(item.product.id),
        product_id: Number(item.product.id),
        quantity: item.quantity,
        color: item.selectedColor,
        size: item.selectedSize,
      })),
      shipping_address: {
        name: orderData.shippingAddress.name,
        phone: orderData.shippingAddress.phone,
        email: orderData.shippingAddress.email,
        address: orderData.shippingAddress.address,
        street: orderData.shippingAddress.address,
        city: orderData.shippingAddress.city,
        state: orderData.shippingAddress.state,
        postal_code: orderData.shippingAddress.zip,
        postalCode: orderData.shippingAddress.zip,
        country: orderData.shippingAddress.country || "Bangladesh",
      },
      // Some backends expect camelCase; include both keys
      shippingAddress: {
        name: orderData.shippingAddress.name,
        phone: orderData.shippingAddress.phone,
        email: orderData.shippingAddress.email,
        address: orderData.shippingAddress.address,
        street: orderData.shippingAddress.address,
        city: orderData.shippingAddress.city,
        state: orderData.shippingAddress.state,
        postal_code: orderData.shippingAddress.zip,
        postalCode: orderData.shippingAddress.zip,
        country: orderData.shippingAddress.country || "Bangladesh",
      },
      billing_address: {
        name: orderData.shippingAddress.name,
        phone: orderData.shippingAddress.phone,
        email: orderData.shippingAddress.email,
        address: orderData.shippingAddress.address,
        street: orderData.shippingAddress.address,
        city: orderData.shippingAddress.city,
        state: orderData.shippingAddress.state,
        postal_code: orderData.shippingAddress.zip,
        postalCode: orderData.shippingAddress.zip,
        country: orderData.shippingAddress.country || "Bangladesh",
      },
      billingAddress: {
        name: orderData.shippingAddress.name,
        phone: orderData.shippingAddress.phone,
        email: orderData.shippingAddress.email,
        address: orderData.shippingAddress.address,
        street: orderData.shippingAddress.address,
        city: orderData.shippingAddress.city,
        state: orderData.shippingAddress.state,
        postal_code: orderData.shippingAddress.zip,
        postalCode: orderData.shippingAddress.zip,
        country: orderData.shippingAddress.country || "Bangladesh",
      },
      payment_method: paymentMethod,
      paymentMethod: {
        type: paymentMethod,
      },
      notes: orderData.notes,
      coupon_code: orderData.couponCode,
      additionalDetails: {
        notes: orderData.notes,
        couponCode: orderData.couponCode,
      },
    };

    // Debug: inspect outbound payload for troubleshooting API validation
    console.log("createOrder payload", payload);

    try {
      const response = await orderService.createOrder(payload);

      // Some backends return success=false with 200; surface that as an error
      if ((response as { success?: boolean }).success === false) {
        throw new ApiError(response.message || "Order submission failed", 400, response);
      }

      const apiOrder = (response as { data?: unknown; order?: unknown }).data || response.order;
      const normalizedOrder =
        (apiOrder as { id?: string | number; order_number?: string; orderNumber?: string }) || {};

      const newOrder: Order = {
        ...orderData,
        id: String(normalizedOrder.id ?? `ORD-${Date.now()}`),
        orderNumber: normalizedOrder.order_number || normalizedOrder.orderNumber,
        status: ((apiOrder as { status?: string })?.status as Order["status"]) || orderData.status,
        paymentStatus:
          ((apiOrder as { payment_status?: string })?.payment_status as Order["paymentStatus"]) ||
          orderData.paymentStatus,
        paymentMethod:
          (apiOrder as { payment_method?: string })?.payment_method || orderData.paymentMethod,
        trackingNumber: (apiOrder as { tracking_number?: string })?.tracking_number,
        totalAmount: (apiOrder as { total?: number })?.total ?? orderData.totalAmount,
        shippingAddress: {
          ...orderData.shippingAddress,
          name:
            (apiOrder as { shipping_address?: { name?: string } })?.shipping_address?.name ||
            orderData.shippingAddress.name,
          phone:
            (apiOrder as { shipping_address?: { phone?: string } })?.shipping_address?.phone ||
            orderData.shippingAddress.phone,
          address:
            (apiOrder as { shipping_address?: { address?: string; street?: string } })
              ?.shipping_address?.address ||
            (apiOrder as { shipping_address?: { street?: string } })?.shipping_address?.street ||
            orderData.shippingAddress.address,
          city:
            (apiOrder as { shipping_address?: { city?: string } })?.shipping_address?.city ||
            orderData.shippingAddress.city,
          zip:
            (apiOrder as { shipping_address?: { postal_code?: string; postalCode?: string } })
              ?.shipping_address?.postal_code ||
            (apiOrder as { shipping_address?: { postalCode?: string } })?.shipping_address
              ?.postalCode ||
            orderData.shippingAddress.zip,
          state:
            (apiOrder as { shipping_address?: { state?: string } })?.shipping_address?.state ||
            orderData.shippingAddress.state,
          country:
            (apiOrder as { shipping_address?: { country?: string } })?.shipping_address?.country ||
            orderData.shippingAddress.country,
          email:
            (apiOrder as { shipping_address?: { email?: string } })?.shipping_address?.email ||
            orderData.shippingAddress.email,
        },
        createdAt:
          (apiOrder as { created_at?: string })?.created_at?.toString() &&
          new Date((apiOrder as { created_at?: string })?.created_at as string),
        updatedAt:
          (apiOrder as { updated_at?: string })?.updated_at?.toString() &&
          new Date((apiOrder as { updated_at?: string })?.updated_at as string),
      };

      setOrders((prev) => [newOrder, ...prev]);
      toast.success(response.message || "Order placed successfully");

      return newOrder;
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(formatApiError(error));
      } else {
        toast.error("Failed to place order. Please try again.");
      }
      throw error;
    }
  };

  const getOrderById = (orderId: string) => {
    return orders.find((order) => order.id === orderId);
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status, updatedAt: new Date() } : order
      )
    );
    toast.success("Order status updated");
  };

  const cancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: "cancelled" as const, updatedAt: new Date() }
          : order
      )
    );
    toast.success("Order cancelled");
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        getOrderById,
        updateOrderStatus,
        cancelOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within OrderProvider");
  }
  return context;
};
