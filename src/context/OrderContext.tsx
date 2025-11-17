import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { CartItem } from "@/types";

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
  };
  trackingNumber?: string;
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

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem("hometex-orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("hometex-orders", JSON.stringify(orders));
  }, [orders]);

  const createOrder = async (orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order> => {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const newOrder: Order = {
      ...orderData,
      id: "ORD-" + Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setOrders((prev) => [newOrder, ...prev]);
    toast.success("Order placed successfully");
    return newOrder;
  };

  const getOrderById = (orderId: string) => {
    return orders.find((order) => order.id === orderId);
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date() }
          : order
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
