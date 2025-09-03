import { WatchlistData } from "@/app/types";
import MovieTitle from "@/components/typography/movieTitle";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWatchlistStore } from "@/store/useStore";
import { Minimize2Icon } from "lucide-react";
import React, { useState } from "react";

export default function WatchlistListView() {
    const { watchlistData } = useWatchlistStore();
    const [selectedListItem, setSelectedListItem] = useState<WatchlistData | null>(null);

    const genresMap = {
        28: "Action",
        12: "Adventure",
        16: "Animation",
        35: "Comedy",
        80: "Crime",
        99: "Documentary",
        18: "Drama",
        10751: "Family",
        14: "Fantasy",
        36: "History",
        27: "Horror",
        10402: "Music",
        9648: "Mystery",
        10749: "Romance",
        878: "Sci-fi",
        10770: "TV Movie",
        53: "Thriller",
        10752: "War",
        37: "Western",
    };

    function displayListData() {
        return (
            <div className="mt-16 grid w-full grid-cols-[repeat(auto-fill,minmax(150px,150px))] justify-center gap-4 p-2">
                {!watchlistData
                    ? skeletons.map((_, index) => (
                          <div className="grid h-[200px] w-[150px] place-items-center" key={index}>
                              <Skeleton className="h-full w-full rounded-lg bg-[#313244]" />
                          </div>
                      ))
                    : watchlistData.map((data) => (
                          <div className="h-[200px] w-[150px] cursor-pointer" key={data.id}>
                              <div
                                  onClick={() => {
                                      setSelectedListItem(data);
                                  }}
                                  style={{
                                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(https://image.tmdb.org/t/p/original${data.movies.poster_path})`,
                                  }}
                                  className="z-20 col-start-1 row-start-1 flex h-full w-full rounded-lg bg-[#313244] bg-cover bg-center p-2"
                              >
                                  <p className="mt-auto">{data.movies.title}</p>
                              </div>
                          </div>
                      ))}
            </div>
        );
    }

    function displayListItemData() {
        if (selectedListItem) {
            return (
                <div
                    style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),  url(https://image.tmdb.org/t/p/original${selectedListItem.movies?.poster_path})`,
                    }}
                    className="relative z-20 col-start-1 row-start-1 flex h-full w-full rounded-xl bg-[#313244] bg-cover bg-center"
                >
                    <Button
                        onClick={() => setSelectedListItem(null)}
                        className="absolute top-2 right-2 h-8 w-8"
                        variant={"outline"}
                    >
                        <Minimize2Icon />
                    </Button>
                    <div className="mt-auto p-4">
                        <MovieTitle title={selectedListItem.movies?.original_title} />
                        <span className="flex items-center gap-4">
                            <p>{new Date(selectedListItem.movies.release_date).getFullYear()}</p>
                            <p>⭐{selectedListItem.movies.vote_average.toFixed(1)}</p>
                            {selectedListItem.movies.genre_ids?.slice(0, 3).map((id) => (
                                <p key={id}>
                                    {genresMap[parseInt(id) as keyof typeof genresMap] ??
                                        "Unknown Genre"}
                                </p>
                            ))}
                        </span>
                        <p className="mt-4">{selectedListItem.movies?.overview}</p>
                    </div>
                </div>
            );
        }
    }

    // Show 6 skeletons while loading
    const skeletons = Array.from({ length: 9 });

    return <>{selectedListItem ? displayListItemData() : displayListData()}</>;
}
