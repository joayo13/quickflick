"use client";
import { TMDBMovie } from "@/app/types";
import { useState } from "react";
import { DiscoverMovieForm } from "./DiscoverMovieForm";

export default function DiscoverMovieSection() {
    const [movieData, setMovieData] = useState<TMDBMovie | undefined>(
        undefined
    );
    const [error, setError] = useState<Error | null>(null);

    return (
        <div>
            <DiscoverMovieForm
                onDiscoverMovieFormSubmit={(data: TMDBMovie | undefined) =>
                    setMovieData(data)
                }
            />
            <p>{movieData?.original_title}</p>
            <p>{error?.message}</p>
        </div>
    );
}
