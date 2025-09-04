import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import React from "react";

export default function DiscoverMovieErrorCard({ error }: { error: Error }) {
    return (
        <div className="z-20 col-start-1 row-start-1 h-full w-full overflow-hidden rounded-lg">
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
