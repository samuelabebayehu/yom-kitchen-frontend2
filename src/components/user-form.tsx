"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button, buttonVariants } from "@/components/ui/button";

import { userSchema } from "@/lib/validations/user"; // Import Zod schema

interface User {
  username: string;
  password: string;
  is_admin: boolean|false;
}

interface UserFormProps {
  initialValues?: User | null;
  onSubmit: (values: z.infer<typeof userSchema>) => Promise<void>;
  onCancel?: () => void;
  submitButtonText: string;
  cancelButtonText?: string;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const UserForm: React.FC<UserFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  submitButtonText = "Create User",
  cancelButtonText = "Cancel",
  loading,
  error,
  successMessage,
}) => {
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: initialValues || {
      username: "",
      password: "",
      is_admin: false,
    },
    mode: "onSubmit",
  });

  const router = useRouter();

  const submitHandler = async (values: z.infer<typeof userSchema>) => {
    await onSubmit(values);
    if (!error && successMessage) {
      router.push("/admin/users");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-4">
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {successMessage && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Password"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_admin"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-md border px-3 py-2 font-medium shadow-sm transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <FormLabel className="text-left">Is Admin</FormLabel>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <Button type="submit" disabled={loading}>
            {submitButtonText}
            {loading && (
              <span className="ml-2 loading loading-spinner-sm"></span>
            )}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={loading}
            >
              {cancelButtonText}
            </Button>
          )}
          {!onCancel && (
            <Link
              href="/admin/users"
              className={buttonVariants({ variant: "secondary" })}
            >
              {cancelButtonText}
            </Link>
          )}
        </div>
      </form>
    </Form>
  );
};

export default UserForm;
