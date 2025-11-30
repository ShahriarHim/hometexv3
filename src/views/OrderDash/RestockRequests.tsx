"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { api } from "@/lib/api";
import { FaBoxOpen } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface RestockRequest {
  id: number;
  product?: {
    name: string;
    sku: string;
  };
  quentity?: number;
  created_at: string;
  updated_at: string;
}

export const RestockRequests = () => {
  const [requests, setRequests] = useState<RestockRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRestockRequests();
  }, []);

  const fetchRestockRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.restock.getList();
      
      if (response.success) {
        setRequests(response.data);
      } else {
        setError(response.message || "Failed to fetch restock requests");
        toast.error(response.message || "Failed to fetch restock requests");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch restock requests";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
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
        <Button onClick={fetchRestockRequests} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 p-8 rounded-lg">
          <FaBoxOpen className="text-4xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No restock requests found</p>
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
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Request Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Updated
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {requests.map((request) => (
            <tr
              key={request.id}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">
                    {request.product ? request.product.name : "Product Unavailable"}
                  </span>
                  <span className="text-xs text-gray-500">
                    SKU: {request.product ? request.product.sku : "N/A"}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                {request.quentity || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                {new Date(request.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                {new Date(request.updated_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
