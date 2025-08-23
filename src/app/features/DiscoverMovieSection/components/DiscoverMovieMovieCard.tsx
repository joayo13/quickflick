import { TMDBMovie } from "@/app/types";
import MovieTitle from "@/components/typography/movieTitle";
import Image from "next/image";

interface DiscoverMovieMovieCardProps {
    movieData: TMDBMovie;
}

export default function DiscoverMovieMovieCard({ movieData }: DiscoverMovieMovieCardProps) {
    return (
        <div
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(https://image.tmdb.org/t/p/w500${movieData?.poster_path})`,
            }}
            className="col-start-1 row-start-1 flex h-[100vh] w-[100vw] rounded-xl bg-cover bg-center md:h-[750px] md:w-[500px]"
        >
            <div className="mt-auto p-4">
                <MovieTitle text={movieData?.original_title} />
                <p className="mt-4">{movieData?.overview}</p>
            </div>
        </div>
    );
}
