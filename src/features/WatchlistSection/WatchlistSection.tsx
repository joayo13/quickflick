"use client";
import React, { useCallback, useEffect, useState } from "react";
import fetchWatchlist from "./api/fetchWatchlist";
import { useWatchlistStore } from "@/store/useStore";

export default function WatchlistSection() {
    const { watchlistData, setWatchlistData } = useWatchlistStore();
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
                setError(err.message);
            }
        }
    }, [setError, setWatchlistData]);

    useEffect(() => {
        fetchWatchlistCallback();
    }, [fetchWatchlistCallback]);

    return (
        <div className="grid h-[100dvh] w-[100vw] place-items-center md:h-[750px] md:w-[500px]">
            {error}
            {watchlistData?.map((item) => (
                <div key={item.id}>{item.movies.original_title}</div>
            ))}
        </div>
    );
}
