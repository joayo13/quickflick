"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { DiscoverMovieForm } from "./components/DiscoverMovieForm";
import DiscoverMovieMovieCard from "./components/DiscoverMovieMovieCard";
import DiscoverMovieErrorCard from "./components/DiscoverMovieErrorCard";
import DiscoverMovieNoResultsCard from "./components/DiscoverMovieNoResultsCard";
import DiscoverMovieEndOfResultsCard from "./components/DiscoverMovieEndOfResultsCard";
import { discoverMovies } from "./api/discoverMovies";
import { Skeleton } from "@/components/ui/skeleton";
import { useFormStore, useMovieStore } from "@/store/useStore";
import { mapFormToDiscoverParams } from "./utils/discoverUtils";

export default function DiscoverMovieSection() {
    const { movieData, setMovieData, movieStoreHydrated } = useMovieStore();
    const [error, setError] = useState<Error | null>(null);
    const pageNumberRef = useRef(1);

    const { values, formHydrated } = useFormStore();

    // adding no-scroll to prevent scrollbars flickering in during movie card dismiss/save animations on desktop
    useEffect(() => {
        document.body.classList.add("no-scroll");

        return () => {
            document.body.classList.remove("no-scroll");
        };
    }, []);

    const fetchMovies = useCallback(async () => {
        try {
            const params = mapFormToDiscoverParams(values, pageNumberRef.current);
            const res = await discoverMovies(params);
            // filterOutListItems
            setError(null);
            setMovieData(res);
        } catch (err) {
            setError(err as Error);
        }
    }, [setError, setMovieData, values]);

    //this gets called in the case of no movies in the store, aka first time using the application, or local storage is empty
    // this is getting called twice needs fix
    useEffect(() => {
        if (movieStoreHydrated && movieData === null) {
            fetchMovies();
        }
    }, [fetchMovies, movieData, movieStoreHydrated]);

    // this gets called from discover movie form if we ever change form values.
    function fetchWithUpdatedFormValues() {
        pageNumberRef.current = 1;
        fetchMovies();
    }

    //
    useEffect(() => {
        function fetchNextPageIfAvailable() {
            if (movieData?.results.length === 0) {
                if (movieData.page < movieData.total_pages) {
                    pageNumberRef.current = movieData.page + 1;
                    fetchMovies();
                }
            }
        }
        fetchNextPageIfAvailable();
    }, [movieData, fetchMovies]);

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
            {formHydrated ? (
                <DiscoverMovieForm fetchWithUpdatedFormValues={fetchWithUpdatedFormValues} />
            ) : null}

            <div className="grid h-[100dvh] w-[100vw] place-items-center md:h-[750px] md:w-[500px]">
                <Skeleton className="z-10 col-start-1 row-start-1 h-full w-full rounded-xl bg-[#313244]" />
                {displayDiscoverMovieResults()}
            </div>
        </>
    );
}
