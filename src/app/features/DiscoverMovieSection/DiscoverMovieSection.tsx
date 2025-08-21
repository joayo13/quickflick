"use client";
import { TMDBMovie } from "@/app/types";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import Image from "next/image";
import { DiscoverMovieForm } from "./components/DiscoverMovieForm";

export default function DiscoverMovieSection() {
    const [movieData, setMovieData] = useState<TMDBMovie | undefined>(
        undefined
    );
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
            <DiscoverMovieForm
                onDiscoverMovieFormSuccess={(data: TMDBMovie | undefined) =>
                    setMovieData(data)
                }
                onDiscoverMovieFormError={(data: Error | null) =>
                    setError(data)
                }
            />

            <Image
                alt={`${movieData?.original_title} poster`}
                src={`https://image.tmdb.org/t/p/w500${movieData?.poster_path}`}
                width={500}
                height={750} // most posters are 2:3 aspect ratio
            />

            <p className="mt-4">{movieData?.original_title}</p>
            <p className="mt-4">{movieData?.overview}</p>
            {displayErrors()}
        </div>
    );
}
