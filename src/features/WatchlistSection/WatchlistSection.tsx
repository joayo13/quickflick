"use client";
import React, { useCallback, useEffect, useState } from "react";
import fetchWatchlist from "./api/fetchWatchlist";
import { useWatchlistStore } from "@/store/useStore";
import WatchlistListView from "./components/WatchlistListView";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

export default function WatchlistSection() {
    const { setWatchlistData } = useWatchlistStore();
    const [error, setError] = useState<string | null>(null);

    const fetchWatchlistCallback = useCallback(async () => {
        try {
            const res = await fetchWatchlist();

            if (res && !res.length) {
                setError("No items in watchlist.");
            }

            console.log(res);

            setWatchlistData(res);
        } catch (err) {
            if (err instanceof Error) {
                setError("Something went wrong. Please try again later.");
            }
        }
    }, [setError, setWatchlistData]);

    useEffect(() => {
        fetchWatchlistCallback();
    }, [fetchWatchlistCallback]);

    return (
        <div className="grid h-[100dvh] w-[100vw] place-items-start md:h-[750px] md:w-[500px]">
            {error ? (
                <Alert
                    className="flex h-full w-full flex-col items-center justify-center"
                    variant="destructive"
                >
                    <div className="flex gap-2">
                        <AlertCircleIcon />
                        <AlertTitle>{error}</AlertTitle>
                    </div>
                </Alert>
            ) : null}
            <WatchlistListView />
        </div>
    );
}
