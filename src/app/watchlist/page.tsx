"use client";
import React, { useCallback, useEffect, useState } from "react";
import fetchWatchlist from "./_api/watchlist";
import { useWatchlistStore } from "@/store/useStore";
import { WatchlistData } from "@/types/types";
import WatchlistItem from "./_components/WatchlistItem";
import DisplayFetchWatchlistResults from "./_components/DisplayFetchWatchlistResults";

export default function WatchlistSection() {
    const { watchlistData, error, fetchingWatchlist, selectedListItem, setSelectedListItem } =
        useFetchWatchlist();

    return (
        <div className="mt-12">
            <DisplayFetchWatchlistResults
                error={error}
                fetchingWatchlist={fetchingWatchlist}
                watchlistData={watchlistData}
                selectedListItem={selectedListItem}
                setSelectedListItem={setSelectedListItem}
            />
            {selectedListItem && (
                <WatchlistItem
                    selectedListItem={selectedListItem}
                    setSelectedListItem={setSelectedListItem}
                />
            )}
        </div>
    );
}
function useFetchWatchlist() {
    const watchlistData = useWatchlistStore((state) => state.watchlistData);
    const setWatchlistData = useWatchlistStore((state) => state.setWatchlistData);
    const [error, setError] = useState<string | null>(null);
    const [fetchingWatchlist, setFetchingWatchlist] = useState(false);
    const [selectedListItem, setSelectedListItem] = useState<WatchlistData | null>(null);

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

    return {
        watchlistData,
        error,
        fetchingWatchlist,
        selectedListItem,
        setSelectedListItem,
    };
}
