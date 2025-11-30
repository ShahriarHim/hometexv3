"use client";

import React, { useState, useEffect } from "react";
import {
  FaClipboardList,
  FaShippingFast,
  FaUserCircle,
  FaQuestionCircle,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface Order {
  id: number;
  created_at: string;
  status: string;
  total: number;
  tracking_code?: string;
}

interface OrderStats {
  total: number;
  inTransit: number;
  delivered: number;
}

export const OrderTracking = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await api.orders.getAll();
      
      if (response.success) {
        setOrders(response.data);
      } else {
        toast.error(response.message || "Failed to fetch orders");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch orders");
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleTrackShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrderStatus(null);

    try {
      const response = await fetch(
        `https://portal.packzy.com/api/v1/status_by_trackingcode/${trackingNumber}`,
        {
          headers: {
            "Api-Key": process.env.NEXT_PUBLIC_API_KEY || "",
            "Secret-Key": process.env.NEXT_PUBLIC_SECRET_KEY || "",
          },
        }
      );

      const data = await response.json();
      if (data.status === 200) {
        setOrderStatus(data.delivery_status);
        toast.success("Order found!");
      } else {
        setError("Order not found");
        toast.error("Order not found");
      }
    } catch (error) {
      setError("Failed to track order");
      toast.error("Failed to track order");
      console.error("Error tracking shipment:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats: OrderStats = {
    total: orders.length,
    inTransit: orders.filter((order) =>
      ["pending", "in_review", "hold", "processing"].includes(
        order.status?.toLowerCase() || ""
      )
    ).length,
    delivered: orders.filter((order) =>
      ["delivered", "partial_delivered", "completed"].includes(
        order.status?.toLowerCase() || ""
      )
    ).length,
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg">
          <div className="flex items-center">
            <FaClipboardList className="text-blue-500 text-2xl mr-3" />
            <div>
              <h3 className="font-semibold">Total Orders</h3>
              <p className="text-lg">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <div className="flex items-center">
            <FaShippingFast className="text-green-500 text-2xl mr-3" />
            <div>
              <h3 className="font-semibold">In Transit</h3>
              <p className="text-lg">{stats.inTransit}</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg">
          <div className="flex items-center">
            <FaUserCircle className="text-purple-500 text-2xl mr-3" />
            <div>
              <h3 className="font-semibold">Delivered</h3>
              <p className="text-lg">{stats.delivered}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Track Your Shipment</h3>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form
            onSubmit={handleTrackShipment}
            className="flex flex-col md:flex-row items-center gap-4"
          >
            <Input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
              className="flex-1 w-full"
            />
            <Button
              type="submit"
              className="w-full md:w-auto"
              disabled={loading}
            >
              {loading ? "Tracking..." : "Track Order"}
            </Button>
          </form>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {orderStatus && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <h4 className="font-semibold">Order Status:</h4>
              <p className="capitalize">{orderStatus.replace(/_/g, " ")}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
          {ordersLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No orders found</p>
            </div>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Order ID</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t">
                    <td className="px-4 py-2">#{order.id}</td>
                    <td className="px-4 py-2">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 capitalize">
                      {order.status?.replace(/_/g, " ") || "pending"}
                    </td>
                    <td className="px-4 py-2">৳{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Need Help?</h3>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <FaQuestionCircle className="text-indigo-500 text-2xl mr-3" />
            <div>
              <h4 className="font-semibold">Support Center</h4>
              <p className="text-gray-600">
                Having trouble with your order? Our support team is here to
                help.
              </p>
              <button className="mt-3 text-indigo-500 hover:text-indigo-600 font-semibold">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
