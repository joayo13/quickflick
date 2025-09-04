import { watchProvidersList } from "@/utils/tmdbUtils";
import { WatchProvidersFlatrate } from "../types/watchlistTypes";

export function filterWatchProviders(
    watchProvidersData: WatchProvidersFlatrate[]
): WatchProvidersFlatrate[] {
    const providerIds = new Set(watchProvidersList.map((p) => p.id));
    return watchProvidersData.filter((provider) =>
        providerIds.has(provider.provider_id.toString())
    );
}
