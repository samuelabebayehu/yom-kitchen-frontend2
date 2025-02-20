"use client";

import React, { useState } from "react";
import axios from "axios";
import withAuth from "@/lib/auth";
import MenuForm from "@/components/admin/menu-form";
import { z } from "zod";
import { menuSchema } from "@/lib/validations/menu";

const CreateMenuPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


  const handleCreateMenu = async (values: z.infer<typeof menuSchema>) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const axiosInstance = withAuth();

      const formData = new FormData();
      formData.append("name", values.name);
      if (values.desc) formData.append("desc", values.desc);
      if (values.image) formData.append("image", values.image);
      if (values.price) formData.append("price", values.price.toString());
      if (values.category) formData.append("category", values.category);
      formData.append("available", values.available.toString());
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/menus`,
        formData,
      );
      if (response.status !== 201 && response.status !== 200) {
        throw new Error(`Failed to create menu. Status: ${response.status}`);
      }
      setSuccessMessage("Menu created successfully!");
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        setError(
          e.response?.data?.message || e.message || "Error creating menu."
        );
        console.error("Axios error creating menu:", e);
      } else if (e instanceof Error) {
        setError(e.message || "Error creating menu.");
      } else {
        setError("Error creating menu.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create New Menu</h1>
      <MenuForm
        onSubmit={handleCreateMenu}
        submitButtonText="Create Menu"
        loading={loading}
        error={error}
        successMessage={successMessage}
      />
    </div>
  );
};

export default CreateMenuPage;
