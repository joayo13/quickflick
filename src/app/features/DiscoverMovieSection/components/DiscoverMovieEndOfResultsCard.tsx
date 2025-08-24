import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SearchCheckIcon, SearchXIcon } from "lucide-react";
import React from "react";

export default function DiscoverMovieErrorCard() {
    return (
        <div className="z-20 col-start-1 row-start-1 h-[100vh] w-[100vw] overflow-hidden rounded-lg md:h-[750px] md:w-[500px]">
            <Alert
                className="flex h-full w-full flex-col items-center justify-center"
                variant="default"
            >
                <div className="flex gap-2">
                    <SearchCheckIcon />
                    <AlertTitle>You&apos;ve reached the end of the results.</AlertTitle>
                </div>
                <AlertDescription>
                    <p>Try expanding your search parameters. Or just pick a damn movie already.</p>
                </AlertDescription>
            </Alert>
        </div>
    );
}
