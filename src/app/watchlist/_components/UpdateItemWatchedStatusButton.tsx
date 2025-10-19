import { Button } from "@/components/ui/button";
import { WatchlistData } from "@/types/types";
import { CheckIcon } from "lucide-react";
import React from "react";
import { updateWatchlistItemWatchedStatus } from "../_api/updateWatchlistItemWatchedStatus";
import { useWatchlistStore } from "@/store/useStore";
import { toast } from "sonner";

export default function UpdateItemWatchedStatusButton({
    selectedListItem,
}: {
    selectedListItem: WatchlistData;
}) {
    const setWatchlistData = useWatchlistStore((state) => state.setWatchlistData);

    async function handleUpdateWatchlistItemWatchedStatus() {
        if (selectedListItem) {
            // flip the current local value and update db

            selectedListItem.watched = !selectedListItem.watched;

            try {
                await updateWatchlistItemWatchedStatus(
                    selectedListItem.id,
                    selectedListItem.watched
                );

                // reflect changes locally

                setWatchlistData(
                    (prev) =>
                        prev &&
                        prev.map((item) =>
                            item.id === selectedListItem.id
                                ? { ...item, watched: selectedListItem.watched } // update the watched flag
                                : item
                        )
                );
                toast(
                    `Marked ${selectedListItem.movies.title} as ${selectedListItem.watched ? "watched" : "unwatched"}.`
                );
            } catch (err) {
                if (err instanceof Error) {
                    toast(err.message);
                }
            }
        }
    }
    return (
        <Button
            aria-label={`toggle ${selectedListItem.movies.title} watch status`}
            onClick={() => handleUpdateWatchlistItemWatchedStatus()}
            className="absolute top-12 right-2 h-8 w-8 rounded-full"
            variant={selectedListItem.watched ? "default" : "outline"}
        >
            <CheckIcon />
        </Button>
    );
}
