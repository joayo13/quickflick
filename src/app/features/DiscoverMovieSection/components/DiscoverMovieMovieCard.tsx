import { TMDBMovie } from "@/app/types";
import MovieTitle from "@/components/typography/movieTitle";
import Image from "next/image";

interface DiscoverMovieMovieCardProps {
    movieData: TMDBMovie;
}

export default function DiscoverMovieMovieCard({ movieData }: DiscoverMovieMovieCardProps) {
    return (
        <div className="relative h-[100vh] w-[100vw] overflow-hidden rounded-lg md:h-[750px] md:w-[500px]">
            <Image
                alt={`${movieData?.original_title} poster`}
                src={`https://image.tmdb.org/t/p/w500${movieData?.poster_path}`}
                fill={true}
                className="z-10 rounded-2xl object-cover"
            />
            <div className="relative z-20 h-full w-full bg-gradient-to-b to-black"></div>
            <div className="absolute bottom-0 z-30 p-4">
                <MovieTitle text={movieData?.original_title} />
                <p className="mt-4">{movieData?.overview}</p>
            </div>
        </div>
    );
}
