import { WatchlistData } from "@/types/types";

export interface WatchlistProps {
    selectedListItem: WatchlistData | null;
    setSelectedListItem: React.Dispatch<React.SetStateAction<WatchlistData | null>>;
}

export interface WatchProvidersFlatrate {
    logo_path: string;
    provider_id: number;
    provider_name: string;
    display_priority: number;
}
