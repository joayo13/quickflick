import { useWatchlistStore } from "@/store/useStore";
import React from "react";
import { WatchlistProps } from "../_types/watchlistTypes";
import WatchlistThumbnail from "./WatchlistThumbnail";

export default function WatchedWatchlistList({
    selectedListItem,
    setSelectedListItem,
}: WatchlistProps) {
    const watchlistData = useWatchlistStore((state) => state.watchlistData);
    const watchedWatchlistData = watchlistData?.filter((item) => item.watched === true);

    return (
        <div
            style={selectedListItem ? { opacity: 0 } : { opacity: 1 }}
            className="grid w-full grid-cols-[repeat(auto-fill,minmax(100px,100px))] justify-center gap-2 p-1"
        >
            <h2 className="col-span-full py-2">
                Previously Watched ({watchedWatchlistData?.length})
            </h2>
            {watchedWatchlistData?.map((data) => (
                <WatchlistThumbnail
                    key={data.id}
                    data={data}
                    isSelected={selectedListItem?.movie_id === data.movie_id}
                    hidden={!!selectedListItem}
                    onSelect={() => setSelectedListItem(data)}
                />
            ))}
        </div>
    );
}
