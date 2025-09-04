import { WatchlistData } from "@/types/types";

export interface WatchlistProps {
    selectedListItem: WatchlistData | null;
    setSelectedListItem: React.Dispatch<React.SetStateAction<WatchlistData | null>>;
}
