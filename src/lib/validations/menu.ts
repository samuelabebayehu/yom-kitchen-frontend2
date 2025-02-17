import * as z from "zod";

export const menuSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    desc: z.string().optional().nullable(),
    image_url: z.string().optional().nullable(),
    price: z.string().optional().nullable(),
    category: z.string().optional().nullable(),
    available: z.string().optional().nullable(),

});