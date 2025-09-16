"use client";
import React, { useCallback, useEffect, useState } from "react";
import fetchWatchlist from "./api/fetchWatchlist";
import { useWatchlistStore } from "@/store/useStore";
import UnwatchedWatchlistList from "./components/UnwatchedWatchlistList";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, SearchXIcon } from "lucide-react";
import { WatchlistData } from "@/types/types";
import WatchlistItem from "./components/WatchlistItem";
import WatchedWatchlistList from "./components/WatchedWatchlistList";
import { Skeleton } from "@/components/ui/skeleton";

export default function WatchlistSection() {
    const { watchlistData, setWatchlistData } = useWatchlistStore();
    const [error, setError] = useState<string | null>(null);
    const [fetchingWatchlist, setFetchingWatchlist] = useState(false);
    const [selectedListItem, setSelectedListItem] = useState<WatchlistData | null>(null);

    const skeletons = Array.from({ length: 5 });

    const fetchWatchlistCallback = useCallback(async () => {
        setFetchingWatchlist(true);
        try {
            const { watchlist, userIsGuest } = await fetchWatchlist();
            if (userIsGuest === true) {
                // return early out of fetch since we'll just be using local data
                setFetchingWatchlist(false);
                return;
            }

            setWatchlistData(watchlist);
            setFetchingWatchlist(false);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
                setFetchingWatchlist(false);
            }
        }
    }, [setError, setWatchlistData]);

    useEffect(() => {
        fetchWatchlistCallback();
    }, [fetchWatchlistCallback]);

    function displayFetchWatchlistResults() {
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

    return (
        <div className="mt-12">
            {displayFetchWatchlistResults()}
            {selectedListItem && (
                <WatchlistItem
                    selectedListItem={selectedListItem}
                    setSelectedListItem={setSelectedListItem}
                />
            )}
        </div>
    );
}
