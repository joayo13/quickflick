import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SearchIcon } from "lucide-react";
import React from "react";

export default function DiscoverMovieWelcomeCard() {
    return (
        <div className="z-20 col-start-1 row-start-1 h-full w-full overflow-hidden rounded-lg">
            <Alert
                className="flex h-full w-full flex-col items-center justify-center"
                variant="default"
            >
                <div className="flex gap-2">
                    <SearchIcon />
                    <AlertTitle>Let&apos;s get started.</AlertTitle>
                </div>
                <AlertDescription className="text-center">
                    Adjust your search parameters in the top right, and apply filters to start
                    searching. Swipe right to dismiss, swipe left to save to your watchlist.
                </AlertDescription>
            </Alert>
        </div>
    );
}
