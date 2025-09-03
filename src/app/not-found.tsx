"use client";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";

export default function ErrorPage() {
    return (
        <div className="text-center">
            <Alert
                className="flex h-full w-full flex-col items-center justify-center"
                variant="destructive"
            >
                <div className="flex items-center gap-2">
                    <AlertCircleIcon />
                    <AlertTitle>Error 404</AlertTitle>
                </div>
                <Link href="/" className="cursor-pointer underline">
                    Back to home
                </Link>
            </Alert>
        </div>
    );
}
