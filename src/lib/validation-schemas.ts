import z from "zod";

export const loginFormSchema = z.object({
    email: z.email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Type for use with react-hook-form or other TS usage
export type loginFormSchema = z.infer<typeof loginFormSchema>;
