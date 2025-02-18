'use client'
import React, { useState, useEffect } from 'react';
import withAuth from '@/lib/auth';
import { z } from 'zod';
import { orderSchema } from '@/lib/validations/order';

const OrdersPage = () => {
  const [orders, setOrders] = useState<z.infer<typeof orderSchema>[]>([]);

  useEffect(() => {
    const axiosInstance = withAuth();
    axiosInstance
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/orders`)
      .then((response) => response.data)
      .then((data) => setOrders(data))
      .catch((error) => console.error('Error fetching orders:', error));
  }, []);

  return (
    <div>
      <h1>Orders</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.client_id}>
            <p>Client ID: {order.client_id}</p>
            <p>Order Date: {order.order_date}</p>
            <p>Total Amount: ${order.total_amount}</p>
            <p>Status: {order.status}</p>
            <p>Notes: {order.notes}</p>
            <ul>
              {order.order_items.map((item) => (
                <li key={item.menu_item_id}>
                  <p>Item Name: {item.item_name}</p>
                  <p>Item Price: ${item.item_price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Subtotal: ${item.subtotal}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrdersPage;