import React, { useCallback, useEffect, useState } from "react";
import { WatchProvidersFlatrate } from "../_types/watchlistTypes";
import { useFormStore } from "@/store/useStore";
import { WatchlistData } from "@/types/types";
import getWatchProviders from "../_api/watchProvidersApi";
import { filterWatchProviders } from "../_utils/watchlistUtils";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

function DisplayWatchProvidersData({
    selectedListItem,
}: {
    selectedListItem: WatchlistData | null;
}) {
    const { watchProvidersData } = useFetchWatchProviders(selectedListItem);

    const skeletonLogos = Array.from({ length: 4 });

    return (
        <>
            {watchProvidersData
                ? filterWatchProviders(watchProvidersData)?.map((watchProvider) => {
                      return (
                          <Image
                              height={40}
                              width={40}
                              className="rounded-full"
                              key={watchProvider.provider_id}
                              alt={watchProvider.provider_name}
                              src={`https://image.tmdb.org/t/p/original${watchProvider.logo_path}`}
                          ></Image>
                      );
                  })
                : skeletonLogos.map((_, index) => {
                      return (
                          <Skeleton
                              key={index}
                              className="h-10 w-10 rounded-full bg-[var(--border)]"
                          />
                      );
                  })}
        </>
    );
}

function useFetchWatchProviders(selectedListItem: WatchlistData | null) {
    const [watchProvidersData, setWatchProvidersData] = useState<WatchProvidersFlatrate[] | null>(
        null
    );

    const watchRegion = useFormStore((state) => state.watchRegion);

    const fetchWatchProviders = useCallback(async () => {
        try {
            if (selectedListItem) {
                const res = await getWatchProviders(selectedListItem.movie_id);

                // Dynamically use the region from the store
                const regionData = res.results?.[watchRegion];

                if (regionData?.flatrate) {
                    setWatchProvidersData(regionData.flatrate);
                } else {
                    setWatchProvidersData([]); // fallback if no flatrate providers
                }
            }
        } catch (err) {
            console.error(err as Error);
        }
    }, [selectedListItem, watchRegion]);

    useEffect(() => {
        fetchWatchProviders();
    }, [fetchWatchProviders]);
    return {
        watchProvidersData,
    };
}

export default DisplayWatchProvidersData;
