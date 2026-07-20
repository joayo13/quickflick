import { Button } from "@/components/ui/button";
import { startTransition, unstable_ViewTransition as ViewTransition } from "react";
import { WatchlistProps } from "../_types/watchlistTypes";
import { Minimize2Icon } from "lucide-react";
import MovieTitle from "@/components/typography/movieTitle";
import { getGenreLabel } from "@/utils/tmdbData";
import UpdateItemWatchedStatusButton from "./UpdateItemWatchedStatusButton";
import DeleteWatchlistItemButton from "./DeleteWatchlistItemButton";
import DisplayWatchProvidersData from "./DisplayWatchProvidersData";
import { WATCHLIST_POSTER_SIZES } from "@/utils/tmdbImage";
import { useAdaptivePosterUrl } from "@/hooks/useAdaptivePosterUrl";

export default function WatchlistItem({ selectedListItem, setSelectedListItem }: WatchlistProps) {
    const posterUrl = useAdaptivePosterUrl(
        selectedListItem?.movies?.poster_path,
        WATCHLIST_POSTER_SIZES
    );

    return (
        selectedListItem && (
            <div className="fixed inset-0 z-20 flex items-center justify-center">
                <ViewTransition name={`movie-${selectedListItem.movie_id.toString()}`}>
                    <div
                        style={{
                            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),  url(${posterUrl})`,
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
                                <DisplayWatchProvidersData selectedListItem={selectedListItem} />
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
