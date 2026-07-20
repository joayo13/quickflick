"use client";

import { startTransition, unstable_ViewTransition as ViewTransition } from "react";
import { WatchlistData } from "@/types/types";
import { useAdaptivePosterUrl } from "@/hooks/useAdaptivePosterUrl";
import { WATCHLIST_POSTER_SIZES } from "@/utils/tmdbImage";

interface WatchlistThumbnailProps {
    data: WatchlistData;
    isSelected: boolean;
    hidden: boolean;
    onSelect: () => void;
}

export default function WatchlistThumbnail({
    data,
    isSelected,
    hidden,
    onSelect,
}: WatchlistThumbnailProps) {
    const posterUrl = useAdaptivePosterUrl(data.movies.poster_path, WATCHLIST_POSTER_SIZES);

    const cardContent = (
        <button
            aria-hidden={hidden ? "true" : "false"}
            tabIndex={hidden ? -1 : 0}
            onClick={() => startTransition(onSelect)}
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${posterUrl})`,
            }}
            className="z-20 col-start-1 row-start-1 flex h-full w-full rounded-lg bg-[var(--border)] bg-cover bg-center p-2"
        >
            <p className="mt-auto text-left text-xs font-bold">{data.movies.title}</p>
        </button>
    );

    return (
        <div className="h-[150px] w-[100px] cursor-pointer">
            {isSelected ? (
                cardContent
            ) : (
                <ViewTransition name={`movie-${data.movie_id.toString()}`}>{cardContent}</ViewTransition>
            )}
        </div>
    );
}
