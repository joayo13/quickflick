import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import React from "react";

interface errorData {
    error: Error;
}

export default function DiscoverMovieErrorCard({ error }: errorData) {
    return (
        <div className="z-20 col-start-1 row-start-1 h-[100vh] w-[100vw] overflow-hidden rounded-lg md:h-[750px] md:w-[500px]">
            <Alert
                className="flex h-full w-full flex-col items-center justify-center"
                variant="destructive"
            >
                <div className="flex gap-2">
                    <AlertCircleIcon />
                    <AlertTitle>{error?.name}</AlertTitle>
                </div>
                <AlertDescription className="text-center">{error?.message}</AlertDescription>
            </Alert>
        </div>
    );
}
