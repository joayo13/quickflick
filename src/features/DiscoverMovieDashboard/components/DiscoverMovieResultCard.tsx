import { TMDBMovie } from "@/types/types";
import MovieTitle from "@/components/typography/movieTitle";
import { useMovieStore } from "@/store/useStore";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { HeartIcon, XIcon } from "lucide-react";
import React, { SetStateAction } from "react";
import { getGenreLabel } from "@/utils/tmdbUtils";

interface ResultCardProps {
    movieData: TMDBMovie;
    exitingMovie: {
        id: number;
        type: "save" | "discard";
    } | null;
    setExitingMovie: React.Dispatch<
        SetStateAction<{
            id: number;
            type: "save" | "discard";
        } | null>
    >;
    exitX: React.RefObject<number>;
    handleMovieCardAction: (x: number, movieData: TMDBMovie) => Promise<void>;
    ariaHidden: boolean;
}

export default function DiscoverMovieResultCard({
    movieData,
    exitingMovie,
    exitX,
    handleMovieCardAction,
    ariaHidden,
}: ResultCardProps) {
    const { setMovieData } = useMovieStore();

    const x = useMotionValue(0);
    const rotate = useTransform(x, [-600, 600], [-20, 20]);
    const heartIconScale = useTransform(x, [-40, 0, 40], [10, 0, 0]);
    const xIconScale = useTransform(x, [-40, 0, 40], [0, 0, 10]);

    const movieYear = new Date(movieData.release_date).getFullYear();

    const handleDragEnd = async () => {
        handleMovieCardAction(x.get(), movieData);
    };

    return (
        <motion.div
            aria-hidden={ariaHidden}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            animate={
                exitingMovie?.id === movieData.id ? { opacity: 0, x: exitX.current * 4 } : undefined
            }
            onAnimationComplete={() => {
                if (exitingMovie?.id === movieData.id) {
                    setMovieData((data) =>
                        data
                            ? {
                                  ...data,
                                  results: data.results.filter(
                                      (movie) => movie.id !== movieData.id
                                  ),
                              }
                            : data
                    );
                }
            }}
            transition={{ duration: 0.2 }}
            onDragEnd={handleDragEnd}
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),  url(https://image.tmdb.org/t/p/original${movieData?.poster_path})`,
                x,
                rotate,
            }}
            className="relative z-20 col-start-1 row-start-1 flex h-full w-full rounded-xl bg-[var(--border)] bg-cover bg-center hover:cursor-grab active:cursor-grabbing"
        >
            <motion.div
                style={{ scale: heartIconScale }}
                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
                <HeartIcon className="text-green-500" fill="currentColor" />
            </motion.div>
            <motion.div
                style={{ scale: xIconScale }}
                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
                <XIcon className="text-red-500" />
            </motion.div>
            <div className="mt-auto p-4">
                <MovieTitle title={movieData?.original_title} />
                <span className="flex items-center gap-4">
                    <p>{movieYear}</p>
                    <p>⭐{movieData.vote_average.toFixed(1)}</p>
                    {movieData.genre_ids?.slice(0, 3).map((id) => (
                        <p key={id}>{getGenreLabel(id)}</p>
                    ))}
                </span>
                <p className="mt-4">{movieData?.overview}</p>
            </div>
        </motion.div>
    );
}
