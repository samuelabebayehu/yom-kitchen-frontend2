import { z } from 'zod';

const clientSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  is_active: z.boolean().default(true)
});

const clientResponseSchema = z.object({
  ID: z.number().int(),
  passcode: z.string(),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  is_active: z.boolean().default(true)
});


export {clientSchema,clientResponseSchema};