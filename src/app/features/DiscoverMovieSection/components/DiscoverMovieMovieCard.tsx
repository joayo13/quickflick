import { TMDBMovie } from "@/app/types";
import MovieTitle from "@/components/typography/movieTitle";
import { useMovieStore } from "@/store/useStore";
import { motion, useMotionValue, useMotionValueEvent, useTransform } from "framer-motion";

interface DiscoverMovieMovieCardProps {
    movieData: TMDBMovie;
}

export default function DiscoverMovieMovieCard({ movieData }: DiscoverMovieMovieCardProps) {
    const { setMovieData } = useMovieStore();
    const x = useMotionValue(0);

    useMotionValueEvent(x, "change", (latest) => console.log(latest));

    const opacity = useTransform(x, [-50, 0, 50], [0, 1, 0]);
    const rotate = useTransform(x, [-150, 150], [-18, 18]);

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

    const handleDragEnd = () => {
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
        }
    };

    return (
        <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            data-testid="movie-bg"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),  url(https://image.tmdb.org/t/p/original${movieData?.poster_path})`,
                x,
                opacity,
                rotate,
            }}
            className="z-20 col-start-1 row-start-1 flex h-[100dvh] w-[100vw] rounded-xl bg-[#313244] bg-cover bg-center hover:cursor-grab active:cursor-grabbing md:h-[750px] md:w-[500px]"
        >
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
