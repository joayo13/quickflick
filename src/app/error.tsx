"use client"; // Error boundaries must be Client Components

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div>
            <Alert variant="destructive" className="max-w-md text-center">
                <AlertTitle>Something went wrong!</AlertTitle>
                <AlertDescription>
                    An error occurred while loading this section. Please try again.
                </AlertDescription>
            </Alert>
            <Button onClick={() => reset()} className="mx-auto mt-4" variant="outline">
                Try again
            </Button>
        </div>
    );
}
