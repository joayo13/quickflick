import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SearchXIcon } from "lucide-react";
import React from "react";

export default function DiscoverMovieErrorCard() {
    return (
        <div className="z-20 col-start-1 row-start-1 h-full w-full overflow-hidden rounded-lg">
            <Alert
                className="flex h-full w-full flex-col items-center justify-center"
                variant="default"
            >
                <div className="flex gap-2">
                    <SearchXIcon />
                    <AlertTitle>No results found.</AlertTitle>
                </div>
                <AlertDescription className="text-center">
                    Try making your search parameters less strict, then try again.
                </AlertDescription>
            </Alert>
        </div>
    );
}
