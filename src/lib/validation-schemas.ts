import z from "zod";

export const loginFormSchema = z.object({
    email: z.email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export const registerFormSchema = z
    .object({
        name: z
            .string()
            .min(2, { message: "Your name must be at least 2 characters" })
            .max(70, { message: "Your name must be less than 70 characters" }),
        email: z.email({ message: "Invalid email address" }),
        password: z.string().min(6, { message: "Password must be at least 6 characters" }),
        confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: "custom",
                message: "The passwords did not match",
                path: ["confirmPassword"],
            });
        }
    });

// Type for use with react-hook-form or other TS usage
export type loginFormSchema = z.infer<typeof loginFormSchema>;
