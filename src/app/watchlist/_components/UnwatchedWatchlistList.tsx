import { useWatchlistStore } from "@/store/useStore";
import React from "react";
import { WatchlistProps } from "../_types/watchlistTypes";
import WatchlistThumbnail from "./WatchlistThumbnail";

export default function UnwatchedWatchlistList({
    selectedListItem,
    setSelectedListItem,
}: WatchlistProps) {
    const watchlistData = useWatchlistStore((state) => state.watchlistData);
    const unwatchedWatchlistData = watchlistData?.filter((item) => item.watched === false);

    return (
        <>
            <div
                style={selectedListItem ? { opacity: 0 } : { opacity: 1 }}
                className="grid w-full grid-cols-[repeat(auto-fill,minmax(100px,100px))] justify-center gap-2 p-1"
            >
                <h1 className="col-span-full py-2 text-xl">
                    My Watchlist ({unwatchedWatchlistData?.length})
                </h1>
                {unwatchedWatchlistData?.map((data) => (
                    <WatchlistThumbnail
                        key={data.id}
                        data={data}
                        isSelected={selectedListItem?.movie_id === data.movie_id}
                        hidden={!!selectedListItem}
                        onSelect={() => setSelectedListItem(data)}
                    />
                ))}
            </div>
        </>
    );
}
