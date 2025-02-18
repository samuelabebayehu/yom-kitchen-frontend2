import { z } from 'zod';

const clientSchema = z.object({
  id: z.number().int(),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
});

export default clientSchema;