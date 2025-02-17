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

import { menuSchema } from "@/lib/validations/menu"; // Import Zod schema

interface Menu {
  name: string;
  desc?: string | null;
  image?: File | null;
  price?: number | 0;
  category?: string | null;
  available: boolean | true;
}

interface MenuFormProps {
  initialValues?: Menu | null;
  onSubmit: (values: z.infer<typeof menuSchema>) => Promise<void>;
  onCancel?: () => void;
  submitButtonText: string;
  cancelButtonText?: string;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const MenuForm: React.FC<MenuFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  submitButtonText = "Create Menu",
  cancelButtonText = "Cancel",
  loading,
  error,
  successMessage,
}) => {
  const form = useForm<z.infer<typeof menuSchema>>({
    resolver: zodResolver(menuSchema),
    defaultValues: initialValues || {
      name: "",
      desc: "",
      image: null,
      price: 0,
      category: "",
      available: true,
    },
    mode: "onSubmit",
  });

  const router = useRouter();

  const submitHandler = async (values: z.infer<typeof menuSchema>) => {
    await onSubmit(values);
    if (!error && successMessage) {
      router.push("/admin/menus");
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Menu Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="desc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Description"
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
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Category"
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
          name="available"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-md border px-3 py-2 font-medium shadow-sm transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <FormLabel className="text-left">Available</FormLabel>
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
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-md border px-3 py-2 font-medium shadow-sm transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <FormLabel className="text-left">Menu Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  placeholder="Browse"
                  onChange={(e) => field.onChange(e.target.files?.[0] || null)}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
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
              href="/admin/menus"
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

export default MenuForm;
