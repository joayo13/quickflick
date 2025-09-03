import { Skeleton } from "@/components/ui/skeleton";
import { useWatchlistStore } from "@/store/useStore";
import React from "react";

export default function WatchlistListView() {
    const { watchlistData } = useWatchlistStore();

    // Show 6 skeletons while loading
    const skeletons = Array.from({ length: 9 });

    return (
        <div className="mt-16 grid w-full grid-cols-[repeat(auto-fill,minmax(150px,150px))] justify-center gap-4 p-2">
            {!watchlistData
                ? skeletons.map((_, index) => (
                      <div className="grid h-[200px] w-[150px] place-items-center" key={index}>
                          <Skeleton className="h-full w-full rounded-lg bg-[#313244]" />
                      </div>
                  ))
                : watchlistData.map((data) => (
                      <div
                          className="h-[200px] w-[150px] cursor-pointer transition-transform hover:scale-105"
                          key={data.id}
                      >
                          <div
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
