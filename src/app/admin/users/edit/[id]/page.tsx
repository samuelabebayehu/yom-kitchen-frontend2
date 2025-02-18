"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import UserForm from "@/components/user-form";
import { z } from "zod";
import Link from "next/link";
import withAuth from "@/lib/auth";
import { userSchema } from "@/lib/validations/user";



const EditUserPage = () => {
  const params = useParams();
  const userId = Number(params.id);
  const [initialValues, setInitialValues] = useState<z.infer<typeof userSchema> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchUser = async () => {
      const axiosInstance = withAuth();
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(
          `${apiBaseURL}/admin/users/${userId}`
        );
        if (!response.statusText.includes("OK")) {
          if (response.status === 404) {
            router.push("/admin/users");
            return;
          }
          const errorData = await response.data;
          throw new Error(
            errorData.error ||
              `Failed to fetch user: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.data;
        setInitialValues(data as z.infer<typeof userSchema>);
      } catch (err: any) {
        setError(err.message as string);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId, router, apiBaseURL]);

  const handleUpdateUser = async (values: z.infer<typeof userSchema>) => {
    const axiosInstance = withAuth();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await axiosInstance.put(
        `${apiBaseURL}/admin/users/${userId}`,
        values
      );

      if (!response.statusText.includes("OK")) {
        const errorData = await response.data;
        throw new Error(
          errorData.error ||
            `User update failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.data;
      console.log("User updated:", values);
      setSuccessMessage(data.message);
    } catch (err: any) {
      setError(err.message as string);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    router.push("/admin/users");
  };

  if (loading && !initialValues) {
    return <div>Loading user data...</div>;
  }

  if (!initialValues && error) {
    return (
      <div className="container mx-auto p-4">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">
            Error loading user data: {error}
          </span>
        </div>
        <Link href="/admin/users" className="text-blue-500 hover:underline">
          &larr; Back to User List
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Edit User</h1>
      <div className="mb-8 p-6 bg-white shadow rounded">
        <UserForm
          initialValues={initialValues}
          onSubmit={handleUpdateUser}
          submitButtonText="Update User"
          cancelButtonText="Cancel"
          loading={loading}
          error={error}
          successMessage={successMessage}
          onCancel={handleCancelEdit}
        />
      </div>
      <div className="mt-4">
        <Link href="/admin/users" className="text-blue-500 hover:underline">
          &larr; Back to User List
        </Link>
      </div>
    </div>
  );
};

export default EditUserPage;
