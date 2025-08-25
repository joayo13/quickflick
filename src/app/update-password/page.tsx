"use client";

import { updatePassword } from "./actions"; // <-- Define this to update the password
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
import { PasswordInput } from "@/components/ui/password-input";
import { useState } from "react";
import { AlertCircleIcon, UserRoundCheckIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { resetPasswordFormSchema } from "@/lib/validation-schemas";

// Require password + confirmPassword, and ensure they match

export default function UpdatePassword() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [alert, setAlert] = useState<string | null>(null);

    const form = useForm<z.infer<typeof resetPasswordFormSchema>>({
        resolver: zodResolver(resetPasswordFormSchema),
        defaultValues: { password: "" },
    });

    async function onSubmit(values: z.infer<typeof resetPasswordFormSchema>) {
        setIsSubmitting(true);
        setError(null);
        setAlert(null);

        try {
            const formData = new FormData();
            formData.append("password", values.password);

            const result = await updatePassword(formData);
            if (result === "update password success") {
                setAlert("Password has been updated. You may now log in.");
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
                    <CardTitle className="text-2xl">Reset Password</CardTitle>
                    <CardDescription>
                        Enter your new password below to reset your account.
                    </CardDescription>
                </CardHeader>
                {displayAlert()}
                {displayErrors()}
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid gap-4">
                                {/* Password Field */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="grid gap-2">
                                            <FormLabel htmlFor="password">New Password</FormLabel>
                                            <FormControl>
                                                <PasswordInput
                                                    id="password"
                                                    placeholder="******"
                                                    autoComplete="new-password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Confirm Password Field */}
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem className="grid gap-2">
                                            <FormLabel htmlFor="confirmPassword">
                                                Confirm Password
                                            </FormLabel>
                                            <FormControl>
                                                <PasswordInput
                                                    id="confirmPassword"
                                                    placeholder="******"
                                                    autoComplete="new-password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full">
                                    {isSubmitting ? <Spinner /> : "Update Password"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-sm">
                        <Link href="/login" className="underline">
                            Back to login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
