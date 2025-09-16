import { Button } from "@/components/ui/button";
import {
    startTransition,
    useCallback,
    useEffect,
    useState,
    unstable_ViewTransition as ViewTransition,
} from "react";
import { WatchlistProps, WatchProvidersFlatrate } from "../types/watchlistTypes";
import { Minimize2Icon } from "lucide-react";
import MovieTitle from "@/components/typography/movieTitle";
import { getGenreLabel } from "@/utils/tmdbUtils";
import getWatchProviders from "../api/getWatchProviders";
import Image from "next/image";
import { filterWatchProviders } from "../utils/watchlistUtils";
import { Skeleton } from "@/components/ui/skeleton";
import UpdateItemWatchedStatusButton from "./UpdateItemWatchedStatusButton";
import DeleteWatchlistItemButton from "./DeleteWatchlistItemButton";
import { useFormStore } from "@/store/useStore";

export default function WatchlistItem({ selectedListItem, setSelectedListItem }: WatchlistProps) {
    const [watchProvidersData, setWatchProvidersData] = useState<WatchProvidersFlatrate[] | null>(
        null
    );

    const { watchRegion } = useFormStore();

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

    const skeletonLogos = Array.from({ length: 4 });

    function displayWatchProvidersData() {
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
    return (
        selectedListItem && (
            <div className="fixed inset-0 z-20 flex items-center justify-center">
                <ViewTransition name={`movie-${selectedListItem.movie_id.toString()}`}>
                    <div
                        style={{
                            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),  url(https://image.tmdb.org/t/p/original${selectedListItem.movies?.poster_path})`,
                        }}
                        className="relative z-20 flex h-[100dvh] w-[100vw] rounded-xl bg-[var(--border)] bg-cover bg-center md:h-[750px] md:w-[500px]"
                    >
                        <Button
                            aria-label={`exit ${selectedListItem.movies.title}`}
                            onClick={() =>
                                startTransition(() => {
                                    setSelectedListItem(null);
                                })
                            }
                            className="absolute top-2 right-2 h-8 w-8 rounded-full"
                            variant={"outline"}
                        >
                            <Minimize2Icon />
                        </Button>
                        <UpdateItemWatchedStatusButton selectedListItem={selectedListItem} />
                        <DeleteWatchlistItemButton
                            setSelectedListItem={setSelectedListItem}
                            selectedListItem={selectedListItem}
                        />
                        <div className="mt-auto p-4">
                            <MovieTitle title={selectedListItem.movies?.original_title} />
                            <span className="flex items-center gap-4">
                                <p>
                                    {new Date(selectedListItem.movies.release_date).getFullYear()}
                                </p>
                                <p>⭐{selectedListItem.movies.vote_average.toFixed(1)}</p>
                                {selectedListItem.movies.genre_ids?.slice(0, 3).map((id) => (
                                    <p key={id}>{getGenreLabel(id)}</p>
                                ))}
                            </span>
                            <span className="mt-2 flex items-center gap-4">
                                {displayWatchProvidersData()}
                            </span>
                            <p className="mt-4">{selectedListItem.movies?.overview}</p>
                            <p className="mt-2 text-sm opacity-75">
                                Watch provider data from{" "}
                                <a className="underline" href="https://www.justwatch.com/">
                                    JustWatch
                                </a>
                            </p>
                        </div>
                    </div>
                </ViewTransition>
            </div>
        )
    );
}
