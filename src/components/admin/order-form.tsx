"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { orderSchema } from "@/lib/validations/order";
import withAuth from "@/lib/auth";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { clientResponseSchema } from "@/lib/validations/client";
import { menuResponseSchema } from "@/lib/validations/menu";

interface OrderFormProps {
  initialValues?: z.infer<typeof orderSchema> | null;
  onSubmit: (values: z.infer<typeof orderSchema>) => Promise<void>;
  onCancel?: () => void;
  submitButtonText: string;
  cancelButtonText?: string;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const OrderForm: React.FC<OrderFormProps> = ({
  onSubmit,
  onCancel,
  submitButtonText = "Create Order",
  cancelButtonText = "Cancel",
  loading,
  error,
  successMessage,
}) => {
  const [clients, setClients] = useState<
    z.infer<typeof clientResponseSchema>[]
  >([]);
  const [menuItems, setMenuItems] = useState<
    z.infer<typeof menuResponseSchema>[]
  >([]);
  const [clientId, setClientId] = useState<number | null>(
    clients.length > 0 ? clients[0].ID : null
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<z.infer<
    typeof clientResponseSchema
  > | null>(clients[0] || null);

  useEffect(() => {
    const axiosInstance = withAuth();
    const fetchData = async () => {
      try {
        const [clientsResponse, menuItemsResponse] = await Promise.all([
          axiosInstance.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/clients`
          ),
          axiosInstance.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/client/menus`
          ),
        ]);

        setClients(clientResponseSchema.array().parse(clientsResponse.data));
        setMenuItems(menuResponseSchema.array().parse(menuItemsResponse.data));
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      client_id: undefined,
      order_items: [],
      notes: "",
      total_amount: 0,
    },
    mode: "onSubmit",
  });

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "order_items",
  });
  const router = useRouter();

  const orderItems = useWatch({
    control,
    name: "order_items",
  });
  const total = useMemo(() => {
    return orderItems.reduce((acc, item) => acc + item.subtotal, 0);
  }, [orderItems]);

  useEffect(() => {
    setValue("total_amount", total);
  }, [total, setValue]);

  useEffect(() => {
    const total = orderItems.reduce((acc, item) => acc + item.subtotal, 0);
    setValue("total_amount", total);
  }, [orderItems, setValue]);

  const submitHandler = async (values: z.infer<typeof orderSchema>) => {
    try {
      if (!values.client_id) {
        setFormError("Client ID is required.");
        return;
      }
      await onSubmit(values);
      if (!error && successMessage) {
        router.push("/admin/orders");
      }
    } catch (err) {
      setFormError(`An error occurred while submitting the form. ${err}`);
    }
  };

  const handleClientChange = (value: number) => {
    const selected = clients.find((client) => client.ID === value);
    setSelectedClient(selected || null);
    setValue("client_id", value); // Ensure client_id is set as a number
  };

  useEffect(() => {
    if (selectedClient) {
      setClientId(selectedClient.ID);
    } else {
      setClientId(null);
    }
  }, [selectedClient]);

  const handleAddMenuItem = (menuItem: z.infer<typeof menuResponseSchema>) => {
    const menuItemIdToAdd = menuItem.ID;
    const existingItemIndex = fields.findIndex(
      (field) => field.menu_item_id === menuItemIdToAdd
    );

    if (existingItemIndex > -1) {
      const currentQuantity =
        form.getValues(`order_items.${existingItemIndex}.quantity`) || 0;
      const newQuantity = currentQuantity + 1;

      setValue(`order_items.${existingItemIndex}.quantity`, newQuantity);
      setValue(
        `order_items.${existingItemIndex}.subtotal`,
        menuItem.price * newQuantity
      );
    } else {
      const newItem = {
        client_id: clientId,
        menu_item_id: menuItemIdToAdd,
        item_name: menuItem.name,
        item_price: menuItem.price,
        quantity: 1,
        subtotal: menuItem.price,
      };
      append(newItem);
    }
  };

  const handleQuantityChange = (index: number, newQuantity: number) => {
    const menuItem = menuItems.find(
      (item) => item.ID === fields[index].menu_item_id
    );
    if (menuItem && newQuantity > 0) {
      setValue(`order_items.${index}.quantity`, newQuantity);
      setValue(`order_items.${index}.subtotal`, menuItem.price * newQuantity);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="space-y-4"
      >
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {formError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{formError}</span>
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
          control={control}
          name="client_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    const numericValue = Number(value);
                    handleClientChange(numericValue);
                    field.onChange(numericValue);
                  }}
                  value={clientId?.toString() || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={"Select a client"} />
                  </SelectTrigger>
                  <SelectContent {...field}>
                    {clients.map((client) => (
                      <SelectItem key={client.ID} value={client.ID.toString()}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
              {errors.client_id && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.client_id.message}
                </p>
              )}
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>Add Menu Items</FormLabel>
          <FormControl>
            <div className="flex space-x-2">
              {menuItems.map((menuItem) => (
                <Button
                  key={menuItem.ID}
                  type="button"
                  variant="outline"
                  onClick={() => handleAddMenuItem(menuItem)}
                  className="w-full"
                >
                  Add {menuItem.name} Price : {menuItem.price}
                </Button>
              ))}
            </div>
          </FormControl>
        </FormItem>

        {fields.map((field, index) => (
          <div key={field.id} className="border p-4 rounded">
            <h4 className="font-semibold mb-2">Item: {field.item_name}</h4>
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={control}
                name={`order_items.${index}.quantity`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) =>
                          handleQuantityChange(
                            index,
                            parseInt(e.target.value) || 1
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                    {errors.order_items?.[index]?.quantity && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.order_items[index].quantity?.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`order_items.${index}.item_price`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="text" readOnly {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`order_items.${index}.subtotal`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtotal</FormLabel>
                    <FormControl>
                      <Input type="text" readOnly {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                remove(index);
              }}
              className="mt-2"
            >
              Remove
            </Button>
          </div>
        ))}

        <FormField
          control={control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
              {errors.notes && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.notes.message}
                </p>
              )}
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Total amount: </FormLabel>
          <FormControl>
            <Input value={getValues("total_amount") || 0} disabled />
          </FormControl>
        </FormItem>

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

export default OrderForm;
