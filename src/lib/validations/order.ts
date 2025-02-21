import { z } from 'zod';
import { clientSchema } from './client';

const orderItemSchema = z.object({
  menu_item_id: z.number().int(),
  item_name: z.string(),
  item_price: z.number().positive(),
  quantity: z.number().int().default(1),
  subtotal: z.number().positive().default(0),
});

const orderSchema = z.object({
  client_id: z.number().int(),
  order_items: z.array(orderItemSchema),
  total_amount: z.number().positive(),
  status: z.string().default('Pending'),
  notes: z.string().optional(),
});

const clientOrderSchema = z.object({
  passcode: z.string(),
  order_items: z.array(
    z.object({
      menu_item_id: z.number(),
      item_name: z.string(),
      item_price: z.number(),
      quantity: z.number().default(1),
      subtotal: z.number().default(0),
    })),
    notes: z.string().optional(),
});


const orderResponseSchema = z.object({
    ID: z.number().int(),
    client_id: z.number().int().optional().nullable(),
    client: clientSchema,
    order_date: z.date(),
    order_items: z.array(orderItemSchema) ,
    status: z.enum(['Pending', 'Accepted', 'Cancelled','Ready', 'Delivered']),
    notes: z.string().optional(),
    total_amount: z.number().int()
});

export { orderSchema,clientOrderSchema, orderResponseSchema,orderItemSchema };
