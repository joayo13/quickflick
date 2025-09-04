"use client";
import React, { useCallback, useEffect, useState } from "react";
import fetchWatchlist from "./api/fetchWatchlist";
import { useWatchlistStore } from "@/store/useStore";
import WatchlistListView from "./components/WatchlistListView";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, SearchXIcon } from "lucide-react";

export default function WatchlistSection() {
    const { setWatchlistData } = useWatchlistStore();
    const [error, setError] = useState<string | null>(null);
    const [alert, setAlert] = useState<string | null>(null);

    const fetchWatchlistCallback = useCallback(async () => {
        try {
            const res = await fetchWatchlist();

            if (res && !res.length) {
                setAlert("No movies found in watchlist.");
            }
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
        } else if (alert) {
            return (
                <Alert
                    className="flex h-full w-full flex-col items-center justify-center"
                    variant="default"
                >
                    <div className="flex gap-2">
                        <SearchXIcon />
                        <AlertTitle>{alert}</AlertTitle>
                    </div>
                </Alert>
            );
        } else {
            return <WatchlistListView />;
        }
    }

    return <>{displayFetchWatchlistResults()}</>;
}
