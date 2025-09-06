import { Skeleton } from "@/components/ui/skeleton";
import { useWatchlistStore } from "@/store/useStore";
import React, { startTransition, unstable_ViewTransition as ViewTransition } from "react";
import { WatchlistProps } from "../types/watchlistTypes";

export default function WatchedWatchlistList({
    selectedListItem,
    setSelectedListItem,
}: WatchlistProps) {
    const { watchlistData } = useWatchlistStore();

    const watchedWatchlistData = watchlistData?.filter((item) => item.watched === true);

    // Show 9 skeletons while loading
    const skeletons = Array.from({ length: 9 });

    function displayListData() {
        return (
            <div
                style={selectedListItem ? { opacity: 0 } : { opacity: 1 }}
                className="grid w-full grid-cols-[repeat(auto-fill,minmax(100px,100px))] justify-center gap-2 p-1"
            >
                <h2 className="col-span-full py-2">
                    Previously Watched ({watchedWatchlistData?.length})
                </h2>
                {!watchedWatchlistData
                    ? skeletons.map((_, index) => (
                          <div className="grid h-[150px] w-[100px] place-items-center" key={index}>
                              <Skeleton className="h-full w-full rounded-lg bg-[#313244]" />
                          </div>
                      ))
                    : watchedWatchlistData.map((data) => {
                          const isSelected = selectedListItem?.movie_id === data.movie_id;

                          const cardContent = (
                              <button
                                  aria-hidden={selectedListItem ? "true" : "false"}
                                  tabIndex={selectedListItem ? -1 : 0}
                                  onClick={() => {
                                      startTransition(() => {
                                          setSelectedListItem(data);
                                      });
                                  }}
                                  style={{
                                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(https://image.tmdb.org/t/p/original${data.movies.poster_path})`,
                                  }}
                                  className="z-20 col-start-1 row-start-1 flex h-full w-full rounded-lg bg-[#313244] bg-cover bg-center p-2"
                              >
                                  <p className="mt-auto text-left text-xs font-bold">
                                      {data.movies.title}
                                  </p>
                              </button>
                          );

                          return (
                              <div key={data.id} className="h-[150px] w-[100px] cursor-pointer">
                                  {isSelected ? (
                                      cardContent
                                  ) : (
                                      <ViewTransition name={`movie-${data.movie_id.toString()}`}>
                                          {cardContent}
                                      </ViewTransition>
                                  )}
                              </div>
                          );
                      })}
            </div>
        );
    }

    return <>{displayListData()}</>;
}
