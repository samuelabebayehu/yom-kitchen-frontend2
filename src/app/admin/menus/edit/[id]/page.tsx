"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import MenuForm from "@/components/menu-form";
import { menuResponseSchema, menuSchema } from "@/lib/validations/menu";
import { z } from "zod";
import Link from "next/link";
import withAuth from "@/lib/auth";
import axios from "axios";


const EditMenuPage = () => {
  const params = useParams();
  const menuId = params ? Number(params.id) : null;
  const [initialValues, setInitialValues] = useState<z.infer<typeof menuResponseSchema> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchMenus = async () => {
      const axiosInstance = withAuth();
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(
          `${apiBaseURL}/admin/menus/${menuId}`
        );
        if (!response.statusText.includes("OK")) {
          if (response.status === 404) {
            router.push("/admin/menus");
            return;
          }
          const errorData = await response.data;
          throw new Error(
            errorData.error ||
              `Failed to fetch menus: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.data;
        setInitialValues(data as z.infer<typeof menuResponseSchema>);
      } catch (err: any) {
        setError(err.message as string);
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, [menuId, router, apiBaseURL]);

  const handleUpdateMenus = async (values: z.infer<typeof menuSchema>) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const axiosInstance = withAuth();
      console.log("onSubmit in parent component called with values:", values);

      const formData = new FormData();
      formData.append("name", values.name);
      if (values.desc) formData.append("desc", values.desc);
      if (values.image) formData.append("image", values.image);
      if (values.price) formData.append("price", values.price.toString());
      if (values.category) formData.append("category", values.category);
      formData.append("available", values.available.toString());
      console.log(formData)
      const response = await axiosInstance.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/menus/${menuId}`,
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

  const handleCancelEdit = () => {
    router.push("/admin/menus");
  };

  if (loading && !initialValues) {
    return <div>Loading menu data...</div>;
  }

  if (!initialValues && error) {
    return (
      <div className="container mx-auto p-4">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">
            Error loading menu data: {error}
          </span>
        </div>
        <Link href="/admin/menus" className="text-blue-500 hover:underline">
          &larr; Back to Menu List
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Edit Menu</h1>
      <div className="mb-8 p-6 bg-white shadow rounded">
        <MenuForm
          initialValues={initialValues}
          onSubmit={handleUpdateMenus}
          submitButtonText="Update Menu"
          cancelButtonText="Menu"
          loading={loading}
          error={error}
          successMessage={successMessage}
          onCancel={handleCancelEdit}
        />
      </div>
      <div className="mt-4">
        <Link href="/admin/menus" className="text-blue-500 hover:underline">
          &larr; Back to Menu List
        </Link>
      </div>
    </div>
  );
};

export default EditMenuPage;
