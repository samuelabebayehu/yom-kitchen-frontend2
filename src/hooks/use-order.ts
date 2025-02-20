"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { orderItemSchema } from "@/lib/validations/order";

export type OrderItem = z.infer<typeof orderItemSchema>;

export function useOrder() {
  const [order, setOrder] = useState<OrderItem[]>([]);

  useEffect(() => {
    const savedOrder = localStorage.getItem("order");
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("order", JSON.stringify(order));
  }, [order]);

  const addToOrder = (item: OrderItem) => {
    setOrder((prevOrder) => {
      const existingItemIndex = prevOrder.findIndex((i) => i.menu_item_id === item.menu_item_id);
      if (existingItemIndex > -1) {
        const updatedOrder = [...prevOrder];
        const existingItem = updatedOrder[existingItemIndex];
        const updatedQuantity = existingItem.quantity + item.quantity;

        if (updatedQuantity <= 0) {
          updatedOrder.splice(existingItemIndex, 1);
        } else {
          updatedOrder[existingItemIndex] = {
            ...existingItem,
            quantity: updatedQuantity,
            subtotal: updatedQuantity * existingItem.item_price,
          };
        }
        return updatedOrder;
      } else {
        return [...prevOrder, { ...item, subtotal: item.item_price * item.quantity }];
      }
    });
  };

  const removeFromOrder = (menu_item_id: number) => {
    setOrder((prevOrder) => prevOrder.filter((item) => item.menu_item_id !== menu_item_id));
  };

  const decreaseQuantity = (menu_item_id: number) => {
    setOrder((prevOrder) => {
      return prevOrder
        .map((item) => {
          if (item.menu_item_id === menu_item_id) {
            const updatedQuantity = item.quantity - 1;
            if (updatedQuantity <= 0) {
              return null;
            }
            return {
              ...item,
              quantity: updatedQuantity,
              subtotal: updatedQuantity * item.item_price,
            };
          }
          return item;
        })
        .filter(Boolean) as OrderItem[];
    });
  };

  const increaseQuantity = (menu_item_id: number) => {
    setOrder((prevOrder) => {
      return prevOrder.map((item) => {
        if (item.menu_item_id === menu_item_id) {
          const updatedQuantity = item.quantity + 1;
          return {
            ...item,
            quantity: updatedQuantity,
            subtotal: updatedQuantity * item.item_price,
          };
        }
        return item;
      });
    });
  };

  const totalItems = order.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = order.reduce((sum, item) => sum + item.subtotal, 0);

  return {
    order,
    addToOrder,
    removeFromOrder,
    decreaseQuantity,
    increaseQuantity,
    totalItems,
    totalPrice,
  };
}
