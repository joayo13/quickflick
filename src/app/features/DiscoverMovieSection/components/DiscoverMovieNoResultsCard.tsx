import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SearchXIcon } from "lucide-react";
import React from "react";

export default function DiscoverMovieErrorCard() {
    return (
        <div className="relative h-[100vh] w-[100vw] overflow-hidden rounded-lg md:h-[750px] md:w-[500px]">
            <Alert
                className="flex h-full w-full flex-col items-center justify-center"
                variant="default"
            >
                <div className="flex gap-2">
                    <SearchXIcon />
                    <AlertTitle>No results found.</AlertTitle>
                </div>
                <AlertDescription>
                    <p>Try making your search parameters less strict, then try again.</p>
                </AlertDescription>
            </Alert>
        </div>
    );
}
