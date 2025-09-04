import { Button } from "@/components/ui/button";
import { startTransition, unstable_ViewTransition as ViewTransition } from "react";
import { WatchlistProps } from "../types/watchlistTypes";
import { Minimize2Icon } from "lucide-react";
import MovieTitle from "@/components/typography/movieTitle";
import { getGenreLabel } from "@/utils/tmdbUtils";

export default function WatchlistListItem({
    selectedListItem,
    setSelectedListItem,
}: WatchlistProps) {
    // todo: fetch justwatch streaming provider data and match to tmdbUtils object, display streaming providers

    return (
        selectedListItem && (
            <div className="fixed inset-0 z-20 flex items-center justify-center">
                <ViewTransition name={`movie-${selectedListItem.movie_id.toString()}`}>
                    <div
                        style={{
                            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),  url(https://image.tmdb.org/t/p/original${selectedListItem.movies?.poster_path})`,
                        }}
                        className="relative z-20 flex h-[100dvh] w-[100vw] rounded-xl bg-[#313244] bg-cover bg-center md:h-[750px] md:w-[500px]"
                    >
                        <Button
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
                            <p className="mt-4">{selectedListItem.movies?.overview}</p>
                        </div>
                    </div>
                </ViewTransition>
            </div>
        )
    );
}
