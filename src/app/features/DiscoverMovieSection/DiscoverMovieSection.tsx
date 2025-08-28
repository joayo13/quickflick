"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { DiscoverMovieForm } from "./components/DiscoverMovieForm";
import DiscoverMovieMovieCard from "./components/DiscoverMovieMovieCard";
import DiscoverMovieErrorCard from "./components/DiscoverMovieErrorCard";
import DiscoverMovieNoResultsCard from "./components/DiscoverMovieNoResultsCard";
import DiscoverMovieEndOfResultsCard from "./components/DiscoverMovieEndOfResultsCard";
import { FormSchema } from "./schemas/FormSchema";

import z from "zod";
import { discoverMovies } from "@/app/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { useFormStore, useMovieStore } from "@/store/useStore";

export default function DiscoverMovieSection() {
    const { movieData, setMovieData } = useMovieStore();
    const [error, setError] = useState<Error | null>(null);
    const pageNumberRef = useRef(1);

    const { values, formHydrated } = useFormStore();

    const fetchMovies = useCallback(
        async (data: z.infer<typeof FormSchema>) => {
            try {
                const res = await discoverMovies(
                    data.watchProviders.join("|"),
                    data.includeGenres.join("|"),
                    data.excludeGenres.join("|"),
                    new Date(`${data.releaseYear[0]}-01-01`),
                    new Date(`${data.releaseYear[1]}-01-01`),
                    data.rating[0],
                    data.rating[1],
                    pageNumberRef.current
                );
                // filterOutListItems
                setError(null);
                setMovieData(res);
            } catch (err) {
                setError(err as Error);
            }
        },
        [setError, setMovieData]
    );
    // this useeffect handles the initial fetching, as well as fetching if any values get updated
    useEffect(() => {
        if (formHydrated) {
            pageNumberRef.current = 1;
            fetchMovies(values as z.infer<typeof FormSchema>);
        }
    }, [fetchMovies, values, formHydrated]);

    useEffect(() => {
        function fetchNextPageIfAvailable() {
            if (movieData?.results.length === 0) {
                if (movieData.page < movieData.total_pages) {
                    pageNumberRef.current += 1;
                    fetchMovies(values as z.infer<typeof FormSchema>);
                }
            }
        }
        fetchNextPageIfAvailable();
    }, [movieData, values, fetchMovies]);

    function displayDiscoverMovieResults() {
        if (error) {
            return <DiscoverMovieErrorCard error={error} />;
        }
        if (movieData?.total_results === 0) {
            return <DiscoverMovieNoResultsCard />;
        }
        if (movieData?.results.length === 0 && movieData.page === movieData.total_pages) {
            return <DiscoverMovieEndOfResultsCard />;
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
        <div className="relative max-w-3xl">
            <div className="absolute top-2 right-2 z-30">
                {formHydrated ? <DiscoverMovieForm /> : null}
            </div>

            <div className="grid place-items-center">
                <Skeleton className="z-10 col-start-1 row-start-1 h-[100dvh] w-[100vw] rounded-xl bg-[#313244] md:h-[750px] md:w-[500px]" />
                {displayDiscoverMovieResults()}
            </div>
        </div>
    );
}
