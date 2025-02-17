import * as z from "zod";

export const clientSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({ message: "Invalid email address." }).optional().nullable(),
    phone: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    is_active: z.boolean().optional().nullable().default(true),
});