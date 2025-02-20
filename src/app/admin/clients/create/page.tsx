"use client";

import React, { useState } from "react";
import ClientForm from "@/components/admin/client-form";
import axios from "axios";
import withAuth from "@/lib/auth";
import {clientSchema} from "@/lib/validations/client";
import {z} from "zod"

const CreateClientPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);



  const handleCreateClient = async (values: z.infer<typeof clientSchema>) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const axiosInstance = withAuth();
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/clients`,
        values
      );
      if (response.status !== 201 && response.status !== 200) {
        throw new Error(`Failed to create client. Status: ${response.status}`);
      }
      setSuccessMessage("Client created successfully!");
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        setError(
          e.response?.data?.message || e.message || "Error creating client."
        );
        console.error("Axios error creating client:", e);
      } else if (e instanceof Error) {
        setError(e.message || "Error creating client.");
      } else {
        setError("Error creating client.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h1>Create New Client</h1>
      <ClientForm
        onSubmit={handleCreateClient}
        submitButtonText="Create Client"
        loading={loading}
        error={error}
        successMessage={successMessage}
      />
    </div>
  );
};

export default CreateClientPage;
