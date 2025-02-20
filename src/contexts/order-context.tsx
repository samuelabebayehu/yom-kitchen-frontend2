"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { orderItemSchema } from "@/lib/validations/order";
import { z } from "zod";

interface OrderContextType {
  order: z.infer<typeof orderItemSchema>[];
  addToOrder: (item: z.infer<typeof orderItemSchema>) => void;
  removeFromOrder: (itemId: number) => void;
  clearOrder: () => void; // Add clearOrder to the context type
  totalItems: number;
  totalPrice: number;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [order, setOrder] = useState<z.infer<typeof orderItemSchema>[]>([]);

  useEffect(() => {
    const savedOrder = localStorage.getItem("order");
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("order", JSON.stringify(order));
  }, [order]);

  const addToOrder = (item: z.infer<typeof orderItemSchema>) => {
    setOrder((prevOrder) => {
      const existingItem = prevOrder.find(
        (i) => i.menu_item_id === item.menu_item_id
      );
      if (existingItem) {
        return prevOrder.map((i) =>
          i.menu_item_id === item.menu_item_id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prevOrder, item];
    });
  };

  const removeFromOrder = (itemId: number) => {
    setOrder((prevOrder) => {
      const existingItem = prevOrder.find((i) => i.menu_item_id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prevOrder.map((i) =>
          i.menu_item_id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prevOrder.filter((i) => i.menu_item_id !== itemId);
    });
  };

  const clearOrder = () => {
    setOrder([]); // Clear the order
  };

  const totalItems = order.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = order.reduce(
    (sum, item) => sum + item.item_price * item.quantity,
    0
  );

  return (
    <OrderContext.Provider value={{ order, addToOrder, removeFromOrder, clearOrder, totalItems, totalPrice }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
}
