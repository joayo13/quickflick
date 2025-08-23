import { TMDBDiscoverResponse, TMDBMovie } from "@/app/types";
import MovieTitle from "@/components/typography/movieTitle";
import { motion, useMotionValue, useMotionValueEvent, useTransform } from "framer-motion";

interface DiscoverMovieMovieCardProps {
    movieData: TMDBMovie;
    setMovieData: React.Dispatch<React.SetStateAction<TMDBDiscoverResponse | null>>;
}

export default function DiscoverMovieMovieCard({
    movieData,
    setMovieData,
}: DiscoverMovieMovieCardProps) {
    const x = useMotionValue(0);

    useMotionValueEvent(x, "change", (latest) => console.log(latest));

    const opacity = useTransform(x, [-50, 0, 50], [0, 1, 0]);
    const rotate = useTransform(x, [-150, 150], [-18, 18]);

    const handleDragEnd = () => {
        if (x.get() > 50) {
            setMovieData((data) =>
                data
                    ? {
                          ...data,
                          results: data.results.filter((movie) => movie.id !== movieData.id),
                      }
                    : data
            );
        } else if (x.get() < -50) {
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
            className="col-start-1 row-start-1 flex h-[100dvh] w-[100vw] rounded-xl bg-neutral-400 bg-cover bg-center hover:cursor-grab active:cursor-grabbing md:h-[750px] md:w-[500px]"
        >
            <div className="mt-auto p-4">
                <MovieTitle text={movieData?.original_title} />
                <p className="mt-4">{movieData?.overview}</p>
            </div>
        </motion.div>
    );
}
