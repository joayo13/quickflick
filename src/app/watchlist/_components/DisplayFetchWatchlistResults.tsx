import { Alert, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { WatchlistData } from "@/types/types";
import { AlertCircleIcon, SearchXIcon } from "lucide-react";
import React from "react";
import UnwatchedWatchlistList from "./UnwatchedWatchlistList";
import WatchedWatchlistList from "./WatchedWatchlistList";

function DisplayFetchWatchlistResults({
    fetchingWatchlist,
    error,
    watchlistData,
    selectedListItem,
    setSelectedListItem,
}: {
    fetchingWatchlist: boolean;
    error: string | null;
    watchlistData: WatchlistData[];
    selectedListItem: WatchlistData | null;
    setSelectedListItem: React.Dispatch<React.SetStateAction<WatchlistData | null>>;
}) {
    const skeletons = Array.from({ length: 5 });

    if (fetchingWatchlist) {
        return (
            <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(100px,100px))] justify-center gap-2 p-1">
                <h1 className="col-span-full py-2 text-xl">My Watchlist (?)</h1>
                {skeletons.map((_, index) => (
                    <div className="grid h-[150px] w-[100px] place-items-center" key={index}>
                        <Skeleton className="h-full w-full rounded-lg bg-[var(--border)]" />
                    </div>
                ))}
            </div>
        );
    }
    if (error) {
        return (
            <Alert
                className="flex h-full w-full flex-col items-center justify-center"
                variant="destructive"
            >
                <div className="flex gap-2">
                    <AlertCircleIcon />
                    <AlertTitle>{error}</AlertTitle>
                </div>
            </Alert>
        );
    } else if (watchlistData && watchlistData.length === 0) {
        return (
            <Alert
                className="flex h-full w-full flex-col items-center justify-center"
                variant="default"
            >
                <div className="flex gap-2">
                    <SearchXIcon />
                    <AlertTitle>{"No movies found in watchlist."}</AlertTitle>
                </div>
            </Alert>
        );
    } else if (watchlistData && watchlistData.length) {
        return (
            <section className="md:max-w-3xl">
                <UnwatchedWatchlistList
                    setSelectedListItem={setSelectedListItem}
                    selectedListItem={selectedListItem}
                />
                <WatchedWatchlistList
                    setSelectedListItem={setSelectedListItem}
                    selectedListItem={selectedListItem}
                />
            </section>
        );
    }
}

export default DisplayFetchWatchlistResults;
