import z from "zod";

export const FormSchema = z.object({
    watchProviders: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one streaming provider.",
    }),
    includeGenres: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to include at least one genre.",
    }),
    excludeGenres: z.array(z.string()),
    releaseYear: z.tuple([z.number(), z.number()]),
    rating: z.tuple([z.number(), z.number()]),
});
