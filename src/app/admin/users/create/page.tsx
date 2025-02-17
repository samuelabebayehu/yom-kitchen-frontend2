"use client";

import React, { useState } from "react";
import axios from "axios";
import withAuth from "@/lib/auth";
import UserForm from "@/components/user-form";

const CreateClientPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  interface UserValues {
    username: string;
    password: string;
    is_admin: boolean|false;
  }

  const handleCreateUser = async (values: UserValues) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const axiosInstance = withAuth();
      console.log("onSubmit in parent component called with values:", values);
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users`,
        values
      );
      if (response.status !== 201 && response.status !== 200) {
        throw new Error(`Failed to create user. Status: ${response.status}`);
      }
      setSuccessMessage("User created successfully!");
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        setError(
          e.response?.data?.message || e.message || "Error creating user."
        );
        console.error("Axios error creating user:", e);
      } else if (e instanceof Error) {
        setError(e.message || "Error creating user.");
      } else {
        setError("Error creating user.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h1>Create New User</h1>
      <UserForm
        onSubmit={handleCreateUser}
        submitButtonText="Create User"
        loading={loading}
        error={error}
        successMessage={successMessage}
      />
    </div>
  );
};

export default CreateClientPage;
