"use client";
import { login } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

import { PasswordInput } from "@/components/ui/password-input";

import { loginFormSchema } from "@/lib/validation-schemas";
import { toast } from "sonner";
import { useState } from "react";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon, UserRoundCheckIcon } from "lucide-react";
import { redirect } from "next/navigation";

const formSchema = loginFormSchema;

export default function LoginPreview() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGuestSubmitting, setIsGuestSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // we clear localstorage so that if a new user signs in on same device, they won't be getting previous users moviedata or any other local storage data
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData();
        formData.append("email", values.email);
        formData.append("password", values.password);

        const result = await login(formData);

        if (result.success) {
            toast(result.message, {
                icon: <UserRoundCheckIcon />,
            });
            setTimeout(() => redirect("/"), 2000);
        } else {
            setError(result.message); // display the user-friendly message
        }

        setIsSubmitting(false);
    }
    // separate flow for guest login
    async function loginAsGuest() {
        // we clear localstorage so that if a new user signs in on same device, they won't be getting previous users moviedata or any other local storage data
        setIsGuestSubmitting(true);
        setError(null);
        const formData = new FormData();
        formData.append("email", "guest@quickflick.com");
        formData.append("password", "quickflick");

        const result = await login(formData);
        if (result.success) {
            toast(result.message, {
                icon: <UserRoundCheckIcon />,
            });
            setTimeout(() => redirect("/"), 2000);
        } else {
            setError(result.message); // display the user-friendly message
        }

        setIsGuestSubmitting(false);
    }
    function displayErrors() {
        if (error) {
            return (
                <Alert
                    className="flex items-center justify-center gap-2 border-0"
                    variant="destructive"
                >
                    <div>
                        <AlertCircleIcon />
                    </div>
                    <AlertDescription>
                        <p>{error}</p>
                    </AlertDescription>
                </Alert>
            );
        }
    }

    return (
        <div className="flex h-[100dvh] w-screen flex-col items-center justify-center px-4">
            <Card className="mx-auto w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email and password to login to your account.
                    </CardDescription>
                </CardHeader>
                {displayErrors()}
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid gap-4">
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
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="grid gap-2">
                                            <div className="flex items-center justify-between">
                                                <FormLabel htmlFor="password">Password</FormLabel>
                                                <Link
                                                    href="/auth/forgot-password"
                                                    className="ml-auto inline-block text-sm underline"
                                                >
                                                    Forgot your password?
                                                </Link>
                                            </div>
                                            <FormControl>
                                                <PasswordInput
                                                    id="password"
                                                    placeholder="******"
                                                    autoComplete="current-password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full">
                                    {isSubmitting ? <Spinner /> : "Login"}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => loginAsGuest()}
                                    variant={"secondary"}
                                    className="w-full"
                                >
                                    {isGuestSubmitting ? <Spinner /> : "Continue as guest"}
                                </Button>
                                {/* maybe later <Button variant="outline" className="w-full">
                                    Login with Google
                                </Button> */}
                            </div>
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/auth/signup" className="underline">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
