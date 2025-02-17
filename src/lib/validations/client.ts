import * as z from "zod";

export const clientSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    passcode: z.string().length(4, {
        message: "Passcode must be exactly 4 characters.",
    }).regex(/^\d+$/, { message: "Passcode must be numeric." }).optional().nullable(),
    email: z.string().email({ message: "Invalid email address." }).optional().nullable(),
    phone: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    isActive: z.boolean().default(true),
    isAdmin: z.boolean().default(false),
});