"use client";

import React, { useState, useEffect } from "react";

import { toast } from "sonner";
import withAuth from "@/lib/auth";
import { orderResponseSchema } from "@/lib/validations/order";
import { z } from "zod";
import { OrdersView } from "@/components/admin/order-table";

const OrderList = () => {
  const [orders, setOrders] = useState<z.infer<typeof orderResponseSchema>[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const stages = ["Pending", "Accepted", "Cancelled", "Ready", "Delivered"];

  const fetchOrders = async () => {
    const axiosInstance = withAuth();
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/orders`
      );
      if (response.statusText != "OK") {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.data;
      setOrders(data);
    } catch (e: any) {
      setError(e.message || "Could not fetch orders.");
      toast.error(e.message || "Could not fetch orders.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  const handleChangeStatus = async (orderID: number, newStatus: string) => {
    const axiosInstance = withAuth();
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/orders/${orderID}/status`,
        { status: newStatus }
      );
      if (!response.statusText.includes("OK")) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      toast.success("Order status updated successfully!");
      fetchOrders();
    } catch (e: any) {
      setError(e.message || "Error updating order status.");
      toast.error(e.message || "Error updating order status.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p>Error loading orders: {error}</p>;
  }

  return (
    <div className="flex-1 overflow-auto p-4">
      <OrdersView orders={orders} onChangeStatus={handleChangeStatus} />
    </div>
  );
};

export default OrderList;
