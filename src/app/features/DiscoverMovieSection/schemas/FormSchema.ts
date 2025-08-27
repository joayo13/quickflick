import z from "zod";

export const FormSchema = z.object({
    watchProviders: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
    }),
    genres: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
    }),
    releaseYear: z.tuple([z.number(), z.number()]), // [min, max]
});
