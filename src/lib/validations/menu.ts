import * as z from "zod";

const imageFileSchema = z.instanceof(File).refine(file => file.type.startsWith("image/"), {
    message: "Must be an image file",
});


export const menuSchema = z.object({
    id: z.number().int(),
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    desc: z.string().optional().nullable(),
    image: imageFileSchema.optional().nullable(),
    price: z.number().positive(),
    category: z.string().optional().nullable(),
    available: z.boolean().default(true),

});

export default menuSchema;