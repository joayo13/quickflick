import z from "zod";

export const FormSchema = z.object({
    watchProviders: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
    }),
    includeGenres: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
    }),
    excludeGenres: z.array(z.string()),
    releaseYear: z.tuple([z.number(), z.number()]),
    rating: z.tuple([z.number(), z.number()]),
});
