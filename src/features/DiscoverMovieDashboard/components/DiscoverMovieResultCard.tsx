import { TMDBMovie } from "@/types/types";
import MovieTitle from "@/components/typography/movieTitle";
import { addMovieToWatchlist } from "@/features/DiscoverMovieDashboard/api/addMovieToWatchlist";
import { useDiscardedMovieStore, useMovieStore } from "@/store/useStore";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { CircleXIcon, HeartIcon, ListCheckIcon, XIcon } from "lucide-react";
import React, { SetStateAction, useRef, useState } from "react";
import { toast } from "sonner";
import { getGenreLabel } from "@/utils/tmdbUtils";
import { Badge } from "@/components/ui/badge";

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
}

export default function DiscoverMovieResultCard({
    movieData,
    exitingMovie,
    setExitingMovie,
    exitX,
}: ResultCardProps) {
    const { setMovieData } = useMovieStore();
    const { setDiscardedMovieData } = useDiscardedMovieStore();

    const x = useMotionValue(0);
    const rotate = useTransform(x, [-600, 600], [-20, 20]);
    const heartIconScale = useTransform(x, [-40, 0, 40], [10, 0, 0]);
    const xIconScale = useTransform(x, [-40, 0, 40], [0, 0, 10]);

    const movieYear = new Date(movieData.release_date).getFullYear();

    const handleDragEnd = async () => {
        exitX.current = x.get();
        console.log(exitX.current);
        // discard
        if (x.get() > 40) {
            setExitingMovie({ id: movieData.id, type: "discard" });
            setDiscardedMovieData((prev) =>
                !prev.includes(movieData.id) ? prev.concat(movieData.id) : prev
            );
        } else if (x.get() < -40) {
            // save
            setExitingMovie({ id: movieData.id, type: "save" });
            try {
                await addMovieToWatchlist(movieData);
                toast(`${movieData.title} added to watchlist.`, { icon: <ListCheckIcon /> });
            } catch (error) {
                // error feedback
                if (error instanceof Error) {
                    toast(`Failed to add ${movieData.title} to watchlist.`, {
                        icon: <CircleXIcon />,
                    });
                }
            }
        }
    };

    return (
        <motion.div
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
