"use client";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function ErrorPage() {
    function ErrorCode() {
        const searchParams = useSearchParams();
        const code = searchParams.get("code");
        return (
            <Alert
                className="flex h-full w-full flex-col items-center justify-center"
                variant="destructive"
            >
                <div className="flex items-center gap-2">
                    <AlertCircleIcon />
                    <AlertTitle>
                        {code ? `Supabase: Error ${code}` : "Supabase: Unknown Error"}
                    </AlertTitle>
                </div>
            </Alert>
        );
    }

    return (
        <div className="text-center">
            <Suspense>{ErrorCode()}</Suspense>
        </div>
    );
}
