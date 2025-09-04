import { Skeleton } from "@/components/ui/skeleton";
import { useWatchlistStore } from "@/store/useStore";
import { unstable_ViewTransition as ViewTransition } from "react";

import Link from "next/link";

export default function WatchlistListView() {
    const { watchlistData } = useWatchlistStore();

    function displayListData() {
        return (
            <>
                {!watchlistData
                    ? skeletons.map((_, index) => (
                          <div className="grid h-[150px] w-[100px] place-items-center" key={index}>
                              <Skeleton className="h-full w-full rounded-lg bg-[#313244]" />
                          </div>
                      ))
                    : watchlistData.map((data) => (
                          <ViewTransition name={`movie-${data.movie_id}`} key={data.id}>
                              <div className="h-[150px] w-[100px] cursor-pointer">
                                  <Link
                                      href={`/watchlist/${data.movie_id}`}
                                      style={{
                                          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(https://image.tmdb.org/t/p/original${data.movies.poster_path})`,
                                      }}
                                      className="z-20 col-start-1 row-start-1 flex h-full w-full rounded-lg bg-[#313244] bg-cover bg-center p-2"
                                  >
                                      <p className="mt-auto text-xs font-bold">
                                          {data.movies.title}
                                      </p>
                                  </Link>
                              </div>
                          </ViewTransition>
                      ))}
            </>
        );
    }

    // Show 6 skeletons while loading
    const skeletons = Array.from({ length: 9 });

    return <>{displayListData()}</>;
}
