"use client";
import { WatchlistData } from "@/app/types";
import MovieTitle from "@/components/typography/movieTitle";
import { Button } from "@/components/ui/button";
import { useWatchlistStore } from "@/store/useStore";
import { Minimize2Icon } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { unstable_ViewTransition as ViewTransition } from "react";

export default function BlogPostPage({ params }: { params: Promise<{ movie_id: string }> }) {
    const { watchlistData } = useWatchlistStore();
    const { movie_id } = use(params);

    const [movieData, setMovieData] = useState<WatchlistData | null>(null);

    useEffect(() => {
        if (watchlistData && movie_id) {
            const found = watchlistData.find(
                (data) => String(data.movie_id) === String(movie_id) // ensure type match
            );
            setMovieData(found ?? null);
        }
    }, [watchlistData, movie_id]);

    return (
        <ViewTransition name={`movie-${movie_id}`}>
            <div
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),  url(https://image.tmdb.org/t/p/original${movieData?.movies?.poster_path})`,
                }}
                className="relative z-20 col-start-1 row-start-1 flex h-full w-full rounded-xl bg-[#313244] bg-cover bg-center"
            >
                <Link href={"/watchlist"}>
                    <Button
                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                        variant={"outline"}
                    >
                        <Minimize2Icon />
                    </Button>
                </Link>
                <div className="mt-auto p-4">
                    <MovieTitle title={movieData?.movies.original_title} />
                    <span className="flex items-center gap-4">
                        {/* <p>{new Date(movieData?.movies.release_date).getFullYear()}</p> */}
                        <p>⭐{movieData?.movies.vote_average.toFixed(1)}</p>
                        {/* {movieData?.movies.genre_ids?.slice(0, 3).map((id) => (
                        <p key={id}>
                            {genresMap[parseInt(id) as keyof typeof genresMap] ?? "Unknown Genre"}
                        </p>
                    ))} */}
                    </span>
                    <p className="mt-4">{movieData?.movies?.overview}</p>
                </div>
            </div>
        </ViewTransition>
    );
}
