"use client";
import { TMDBMovie } from "@/app/types";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import Image from "next/image";
import { DiscoverMovieForm } from "./components/DiscoverMovieForm";
import MovieTitle from "@/components/typography/movieTitle";

export default function DiscoverMovieSection() {
    const [movieData, setMovieData] = useState<TMDBMovie | undefined>(undefined);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setError(null);
    }, [movieData]);

    function displayErrors() {
        if (error) {
            return (
                <Alert variant="destructive">
                    <AlertCircleIcon />
                    <AlertTitle>{error?.name}</AlertTitle>
                    <AlertDescription>
                        <p>{error?.message}</p>
                    </AlertDescription>
                </Alert>
            );
        }
    }

    return (
        <div className="max-w-3xl">
            {displayErrors()}
            <DiscoverMovieForm
                onDiscoverMovieFormSuccess={(data: TMDBMovie | undefined) => setMovieData(data)}
                onDiscoverMovieFormError={(data: Error | null) => setError(data)}
            />

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
        </div>
    );
}
