"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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

interface Order {
  order_id: number;
  client_id: number;
  client?: {
    id?: number;
    name?: string;
    email?: string;
    phone?: string | null;
    address?: string | null;
  };
  order_date: string;
  order_items?: OrderItem[];
  total_amount: number;
  status: string | "Pending";
  notes: string | undefined;
}

interface OrderItem {
  order_id?: number;
  menu_item_id: number;
  item_name: string;
  item_price: number;
  quantity: number | 1;
  subtotal: number | 0;
}

interface OrderFormProps {
  initialValues?: Order | null;
  onSubmit: (values: z.infer<typeof orderSchema>) => Promise<void>;
  onCancel?: () => void;
  submitButtonText: string;
  cancelButtonText?: string;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

interface Client {
  ID: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  is_active: boolean;
}

interface Menu {
  ID: string;
  name: string;
  desc: string | null;
  image_url?: string | null;
  price: number | 0;
  category?: string | null;
  available: boolean | true;
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
  const [clients, setClients] = useState<Client[]>([]);
  const [menuItems, setMenuItems] = useState<Menu[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(clients.length>0?clients[0]:null);
  const [clientId, setClientId] = useState<number | null>(clients.length>0?parseInt(clients[0].ID):null);


  useEffect(() => {
    const axiosInstance = withAuth();
    const fetchClients = async () => {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/clients`
      );
      const data = await response.data;
      setClients(data);
    };

    const fetchMenuItems = async () => {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/client/menus`
      );
      const data = await response.data;
      setMenuItems(data);
    };

    fetchClients();
    fetchMenuItems();
  }, []);

  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      client_id: 0,
      order_items: [],
      notes: "",
      total_amount: 0,
    },
    mode: "onSubmit",
  });

  const { control, handleSubmit, setValue, getValues } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "order_items",
  });
  const router = useRouter();




  useEffect(() => {
    if (selectedClient) {
      setClientId(parseInt(selectedClient.ID));
    } else {
      setClientId(null);
    }
  }, [selectedClient]);

  const submitHandler = async (values: z.infer<typeof orderSchema>) => {
    if (clientId) {
      values.client_id = clientId;
    }
    await onSubmit(values);
    if (!error && successMessage) {
      router.push("/admin/orders");
    }
  };
  const handleClientChange = (value: string) => {
    console.log(value);
    const selected = clients.find((client) => client.ID === value);
    console.log(selected);
    setSelectedClient(selected || null);
  };

  const handleAddMenuItem = (menuItem: Menu, quantity = 0) => {
    const menuItemIdToAdd = parseInt(menuItem.ID);
    const existingItemIndex = fields.findIndex(
      (field) => parseInt(field.menu_item_id) === menuItemIdToAdd
    );

    if (existingItemIndex > -1) {
      // Menu item already exists, increment quantity
      const currentQuantity = form.getValues(`order_items.${existingItemIndex}.quantity`) || 0; // Get current quantity, default to 0 if undefined
      const newQuantity = quantity > 0 ? quantity:currentQuantity + 1;

      setValue(`order_items.${existingItemIndex}.quantity`, newQuantity);
      setValue(
        `order_items.${existingItemIndex}.subtotal`,
        menuItem.price * newQuantity
      );
    } else {
      // Menu item does not exist, append new item
      const newItem = {
        menu_item_id: menuItemIdToAdd,
        item_name: menuItem.name,
        item_price: menuItem.price,
        quantity: 1,
        subtotal: menuItem.price,
      };
      append(newItem);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
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
          control={control}
          name="client_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <FormControl>
                <Select
                  onValueChange={handleClientChange}
                  value={clientId?.toString() || ""} // Make Select controlled
                >
                  <SelectTrigger>
                    <SelectValue placeholder={"Select a client"} />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.ID} value={client.ID}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
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
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value);
                          const menuItemForUpdate = menuItems.find(
                            (item) => parseInt(item.ID) === parseInt(fields[index].menu_item_id.toString())
                          );
                          if (menuItemForUpdate && newQuantity > 0) {
                            handleAddMenuItem(menuItemForUpdate,newQuantity); // Call handleAddMenuItem with menuItem and newQuantity
                          } else {
                          }
                          setValue(
                            `order_items.${index}.quantity`,
                            newQuantity
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
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
              onClick={() => remove(index)}
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
