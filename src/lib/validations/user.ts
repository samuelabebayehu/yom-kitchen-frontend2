import * as z from "zod";

export const userSchema = z.object({
    username: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    password: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    is_admin: z.boolean().default(false),
});