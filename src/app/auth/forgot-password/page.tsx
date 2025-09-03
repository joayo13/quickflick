"use client";

import { sendResetPasswordEmail } from "./actions"; // <-- You'll define this to send the reset email
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { AlertCircleIcon, UserRoundCheckIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { forgotPasswordFormSchema } from "@/lib/validation-schemas";

export default function ForgotPassword() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [alert, setAlert] = useState<string | null>(null);

    const form = useForm<z.infer<typeof forgotPasswordFormSchema>>({
        resolver: zodResolver(forgotPasswordFormSchema),
        defaultValues: { email: "" },
    });

    async function onSubmit(values: z.infer<typeof forgotPasswordFormSchema>) {
        setIsSubmitting(true);
        setError(null);
        setAlert(null);

        try {
            const formData = new FormData();
            formData.append("email", values.email);

            const result = await sendResetPasswordEmail(formData);
            if (result.success) {
                setAlert("Password reset email sent. Please check your inbox.");
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err);
            } else {
                setError(new Error("Unexpected error"));
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    function displayErrors() {
        if (!error) return null;
        return (
            <Alert
                className="flex items-center justify-center gap-2 border-0"
                variant="destructive"
            >
                <AlertCircleIcon />
                <AlertDescription>{error.message}</AlertDescription>
            </Alert>
        );
    }

    function displayAlert() {
        if (!alert) return null;
        return (
            <Alert className="flex items-center justify-center gap-2 border-0" variant="default">
                <UserRoundCheckIcon />
                <AlertDescription>{alert}</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="flex h-[100dvh] w-screen flex-col items-center justify-center px-4">
            <Card className="mx-auto w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-2xl">Forgot Password</CardTitle>
                    <CardDescription>
                        Enter your email address and we&apos;ll send you a password reset link.
                    </CardDescription>
                </CardHeader>
                {displayAlert()}
                {displayErrors()}
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid gap-4">
                                {/* Email Field */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="grid gap-2">
                                            <FormLabel htmlFor="email">Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="email"
                                                    placeholder="johndoe@mail.com"
                                                    type="email"
                                                    autoComplete="email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full">
                                    {isSubmitting ? <Spinner /> : "Send Reset Link"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-sm">
                        Remembered your password?{" "}
                        <Link href="/auth/login" className="underline">
                            Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
