import z from "zod";

export const FormSchema = z.object({
    watchProviders: z.array(z.string()),
    includeGenres: z.array(z.string()),
    excludeGenres: z.array(z.string()),
    releaseYear: z.tuple([z.number(), z.number()]),
    rating: z.tuple([z.number(), z.number()]),
});
