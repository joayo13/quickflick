import { TMDBMovie } from "@/app/types";
import MovieTitle from "@/components/typography/movieTitle";
import { addMovieToWatchlist } from "@/lib/watchlist";
import { useMovieStore } from "@/store/useStore";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Heart, X } from "lucide-react";
import { useRef } from "react";

interface DiscoverMovieMovieCardProps {
    movieData: TMDBMovie;
}

export default function DiscoverMovieMovieCard({ movieData }: DiscoverMovieMovieCardProps) {
    const { setMovieData } = useMovieStore();
    const x = useMotionValue(0);

    const exitX = useRef(0);

    const rotate = useTransform(x, [-600, 600], [-20, 20]);

    const heartIconScale = useTransform(x, [-40, 0, 40], [10, 0, 0]);

    const xIconScale = useTransform(x, [-40, 0, 40], [0, 0, 10]);

    const movieYear = new Date(movieData.release_date).getFullYear();

    const genres = {
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

    const handleDragEnd = async () => {
        exitX.current = x.get();
        console.log(exitX.current);
        // discard
        if (x.get() > 40) {
            setMovieData((data) =>
                data
                    ? {
                          ...data,
                          results: data.results.filter((movie) => movie.id !== movieData.id),
                      }
                    : data
            );
        } else if (x.get() < -40) {
            // save
            setMovieData((data) =>
                data
                    ? {
                          ...data,
                          results: data.results.filter((movie) => movie.id !== movieData.id),
                      }
                    : data
            );
            try {
                // try to add to watchlist
                await addMovieToWatchlist(movieData);
                // success feedback
                console.log("Movie added to watchlist successfully");
                // or set a success state, show toast, etc.
            } catch (error) {
                // error feedback
                console.error("Failed to add movie:", error);
                // or set an error state, show toast, etc.
            }
        }
    };

    return (
        <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            exit={{ opacity: 0, x: exitX.current * 4 }}
            transition={{ duration: 0.2 }}
            onDragEnd={handleDragEnd}
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),  url(https://image.tmdb.org/t/p/original${movieData?.poster_path})`,
                x,
                rotate,
            }}
            className="relative z-20 col-start-1 row-start-1 flex h-full w-full rounded-xl bg-[#313244] bg-cover bg-center hover:cursor-grab active:cursor-grabbing"
        >
            <motion.div
                style={{ scale: heartIconScale }}
                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
                <Heart className="text-green-500" fill="currentColor" />
            </motion.div>
            <motion.div
                style={{ scale: xIconScale }}
                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
                <X className="text-red-500" />
            </motion.div>
            <div className="mt-auto p-4">
                <MovieTitle title={movieData?.original_title} />
                <span className="flex items-center gap-4">
                    <p>{movieYear}</p>
                    <p>⭐{movieData.vote_average.toFixed(1)}</p>
                    {movieData.genre_ids?.slice(0, 3).map((id) => (
                        <p key={id}>
                            {genres[parseInt(id) as keyof typeof genres] ?? "Unknown Genre"}
                        </p>
                    ))}
                </span>
                <p className="mt-4">{movieData?.overview}</p>
            </div>
        </motion.div>
    );
}
