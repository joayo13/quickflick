import { TMDBMovie, TrailerLink } from "@/types/types";
import MovieTitle from "@/components/typography/movieTitle";
import { useMovieStore } from "@/store/useStore";
import { motion, useMotionValue, useTransform } from "motion/react";
import { HeartIcon, XIcon } from "lucide-react";
import React, { SetStateAction } from "react";
import { getGenreLabel } from "@/utils/tmdbData";
import { DISCOVER_POSTER_SIZES } from "@/utils/tmdbImage";
import { useAdaptivePosterUrl } from "@/hooks/useAdaptivePosterUrl";

interface ResultCardProps {
    movieData: TMDBMovie;
    exitingMovie: {
        id: number;
        type: "save" | "discard";
    } | null;

    movieTrailerData: {
        id: number;
        trailerShowing: boolean;
        trailerLink: TrailerLink;
    };

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
    movieTrailerData,
    exitX,
    handleMovieCardAction,
    ariaHidden,
}: ResultCardProps) {
    const setMovieData = useMovieStore((state) => state.setMovieData);
    const posterUrl = useAdaptivePosterUrl(movieData?.poster_path, DISCOVER_POSTER_SIZES);
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-600, 600], [-20, 20]);
    const heartIconScale = useTransform(x, [-40, 0, 40], [0, 0, 10]);
    const xIconScale = useTransform(x, [-40, 0, 40], [10, 0, 0]);

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
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),  url(${posterUrl})`,
                x,
                rotate,
            }}
            className="relative z-20 col-start-1 row-start-1 flex h-full w-full overflow-y-hidden rounded-xl bg-[var(--border)] bg-cover bg-center hover:cursor-grab active:cursor-grabbing"
        >
            {/* trailer div */}

            {movieTrailerData.id === movieData.id && movieTrailerData.trailerShowing ? (
                <iframe
                    tabIndex={-1}
                    className="pointer-events-none absolute top-0 h-full w-full"
                    height="750"
                    src={`https://www.youtube.com/embed/${movieTrailerData.trailerLink?.key}?si=${movieTrailerData.trailerLink?.id}&autoplay=${movieTrailerData.trailerShowing ? 1 : 0}&loop=1&controls=0&color=white&modestbranding=0&rel=0&playsinline=1&enablejsapi=1&playlist=${movieTrailerData.trailerLink?.key}`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                ></iframe>
            ) : null}

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
