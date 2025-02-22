"use client";

import React, { useState } from "react";
import OrderForm from "@/components/admin/order-form";
import axios from "axios";
import withAuth from "@/lib/auth";
import { orderSchema } from "@/lib/validations/order";
import { z } from "zod";

const CreateOrderPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleCreateOrder = async (values: z.infer<typeof orderSchema>) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const axiosInstance = withAuth();
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/orders`,
        values
      );
      if (response.status !== 201 && response.status !== 200) {
        throw new Error(`Failed to create order. Status: ${response.status}`);
      }
      setSuccessMessage("Order created successfully!");
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        setError(
          e.response?.data?.message || e.message || "Error creating order."
        );
        console.error("Axios error creating order:", e);
      } else if (e instanceof Error) {
        setError(e.message || "Error creating order.");
      } else {
        setError("Error creating order.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h1>Create New Order</h1>
      <OrderForm
        onSubmit={handleCreateOrder}
        submitButtonText="Create Order"
        loading={loading}
        error={error}
        successMessage={successMessage}
      />
    </div>
  );
};

export default CreateOrderPage;
