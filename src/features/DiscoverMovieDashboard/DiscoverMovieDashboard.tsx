"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { DiscoverMovieForm } from "./components/DiscoverMovieForm";
import DiscoverMovieMovieCard from "./components/DiscoverMovieMovieCard";
import DiscoverMovieErrorCard from "./components/DiscoverMovieErrorCard";
import DiscoverMovieNoResultsCard from "./components/DiscoverMovieNoResultsCard";
import DiscoverMovieEndOfResultsCard from "./components/DiscoverMovieEndOfResultsCard";
import { FormSchema } from "./schemas/FormSchema";

import z from "zod";
import { discoverMovies } from "./api/discoverMovies";
import { Skeleton } from "@/components/ui/skeleton";
import { useFormStore, useMovieStore } from "@/store/useStore";
import { mapFormToDiscoverParams } from "./utils";

export default function DiscoverMovieSection() {
    const { movieData, setMovieData } = useMovieStore();
    const [error, setError] = useState<Error | null>(null);
    const pageNumberRef = useRef(1);

    const { values, formHydrated } = useFormStore();

    const fetchMovies = useCallback(
        async (data: z.infer<typeof FormSchema>) => {
            try {
                const params = mapFormToDiscoverParams(data, pageNumberRef.current);
                const res = await discoverMovies(params);
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
            return (
                <>
                    {movieData.results.slice(-2).map((movieData) => (
                        <DiscoverMovieMovieCard
                            key={movieData.id}
                            movieData={movieData}
                        ></DiscoverMovieMovieCard>
                    ))}
                </>
            );
        }
    }

    return (
        <>
            {formHydrated ? <DiscoverMovieForm /> : null}

            <div className="grid h-[100dvh] w-[100vw] place-items-center md:h-[750px] md:w-[500px]">
                <Skeleton className="z-10 col-start-1 row-start-1 h-full w-full rounded-xl bg-[#313244]" />
                {displayDiscoverMovieResults()}
            </div>
        </>
    );
}
