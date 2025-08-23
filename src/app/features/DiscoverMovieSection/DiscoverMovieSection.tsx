"use client";
import { TMDBDiscoverResponse } from "@/app/types";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { DiscoverMovieForm } from "./components/DiscoverMovieForm";
import DiscoverMovieMovieCard from "./components/DiscoverMovieMovieCard";
import DiscoverMovieErrorCard from "./components/DiscoverMovieErrorCard";

export default function DiscoverMovieSection() {
    const [movieData, setMovieData] = useState<TMDBDiscoverResponse | null>(null);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setError(null);
    }, [movieData]);

    function displayDiscoverMovieResults() {
        if (error) {
            return <DiscoverMovieErrorCard error={error} />;
        }
        if (movieData?.results) {
            return movieData.results.map((movieData) => (
                <DiscoverMovieMovieCard
                    key={movieData.id}
                    movieData={movieData}
                ></DiscoverMovieMovieCard>
            ));
        }
    }

    return (
        <div className="max-w-3xl">
            <DiscoverMovieForm
                onDiscoverMovieFormSuccess={(data: TMDBDiscoverResponse | null) =>
                    setMovieData(data)
                }
                onDiscoverMovieFormError={(data: Error | null) => setError(data)}
            />
            {displayDiscoverMovieResults()}
        </div>
    );
}
