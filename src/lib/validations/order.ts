import { z } from 'zod';
import clientSchema from './client';

const orderItemSchema = z.object({
  order_id: z.number().int(),
  menu_item_id: z.number().int(),
  item_name: z.string(),
  item_price: z.number().positive(),
  quantity: z.number().int().default(1),
  subtotal: z.number().positive().default(0),
});

const orderSchema = z.object({
  client_id: z.number().int(),
  client: clientSchema.optional(), 
  order_date: z.string().datetime(),
  order_items: z.array(orderItemSchema),
  total_amount: z.number().positive(),
  status: z.string().default('Pending'),
  notes: z.string().optional(),
});

export { orderSchema, orderItemSchema };
