"use client";
import React, { useCallback, useEffect, useState } from "react";
import fetchWatchlist from "./api/fetchWatchlist";
import { useWatchlistStore } from "@/store/useStore";
import UnwatchedWatchlistList from "./components/UnwatchedWatchlistList";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, SearchXIcon } from "lucide-react";
import { WatchlistData } from "@/types/types";
import WatchlistListItem from "./components/WatchlistItem";
import WatchedWatchlistList from "./components/WatchedWatchlistList";

export default function WatchlistSection() {
    const { watchlistData, setWatchlistData } = useWatchlistStore();
    const [error, setError] = useState<string | null>(null);
    const [selectedListItem, setSelectedListItem] = useState<WatchlistData | null>(null);

    const fetchWatchlistCallback = useCallback(async () => {
        try {
            const res = await fetchWatchlist();
            setWatchlistData(res);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            }
        }
    }, [setError, setWatchlistData]);

    useEffect(() => {
        fetchWatchlistCallback();
    }, [fetchWatchlistCallback]);

    function displayFetchWatchlistResults() {
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
        <>
            {displayFetchWatchlistResults()}
            {selectedListItem && (
                <WatchlistListItem
                    selectedListItem={selectedListItem}
                    setSelectedListItem={setSelectedListItem}
                />
            )}
        </>
    );
}
