import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import React, { startTransition } from "react";
import { useWatchlistStore } from "@/store/useStore";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteWatchlistItem } from "../_api/deleteWatchlistItem";
import { WatchlistProps } from "../_types/watchlistTypes";

export default function DeleteWatchlistItemButton({
    selectedListItem,
    setSelectedListItem,
}: WatchlistProps) {
    const { setWatchlistData } = useWatchlistStore();

    async function handleDeleteWatchlistItem() {
        if (selectedListItem) {
            try {
                await deleteWatchlistItem(selectedListItem.id);

                setWatchlistData(
                    (prev) => prev && prev.filter((item) => item.id !== selectedListItem.id)
                );
                toast(`Removed ${selectedListItem.movies.title} from your watchlist.`);
                startTransition(() => {
                    setSelectedListItem(null);
                });
            } catch (err) {
                if (err instanceof Error) {
                    toast(err.message);
                }
            }
        }
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    aria-label={`delete ${selectedListItem?.movies.title} from watchlist`}
                    className="absolute top-22 right-2 h-8 w-8 rounded-full"
                    variant={"outline"}
                >
                    <XIcon />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will remove {selectedListItem?.movies.title} from your watchlist.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteWatchlistItem()}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
