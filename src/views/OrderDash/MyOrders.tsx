"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { api } from "@/lib/api";
import { FaFileInvoice, FaEye } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Order {
  id: number;
  created_at: string;
  status: string;
  total: number;
  order_number?: string;
}

export const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.orders.getAll();
      
      if (response.success) {
        setOrders(response.data);
      } else {
        setError(response.message || "Failed to fetch orders");
        toast.error(response.message || "Failed to fetch orders");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch orders";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4 bg-red-50 p-4 rounded-lg">
          {error}
        </div>
        <Button onClick={fetchOrders} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 p-8 rounded-lg">
          <p className="text-gray-600 mb-4">No orders found</p>
          <Link href="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr
              key={order.id}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="px-6 py-4 whitespace-nowrap font-medium">
                #{order.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                {new Date(order.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                ৳{order.total}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-3">
                  <Link
                    href={`/account/order/${order.id}`}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <FaEye className="mr-1" /> View
                  </Link>
                  <button className="text-gray-600 hover:text-gray-800 flex items-center">
                    <FaFileInvoice className="mr-1" /> Invoice
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
