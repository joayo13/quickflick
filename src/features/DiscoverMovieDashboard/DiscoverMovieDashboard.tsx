"use client";
import { useCallback, useEffect, useRef } from "react";
import { DiscoverMovieForm } from "./components/DiscoverMovieForm";
import DiscoverMovieErrorCard from "./components/DiscoverMovieErrorCard";
import DiscoverMovieNoResultsCard from "./components/DiscoverMovieNoResultsCard";
import DiscoverMovieEndOfResultsCard from "./components/DiscoverMovieEndOfResultsCard";
import { discoverMovies } from "./api/discoverMovies";
import { Skeleton } from "@/components/ui/skeleton";
import {
    useDiscardedMovieStore,
    useFormStore,
    useMovieStore,
    useWatchlistStore,
} from "@/store/useStore";
import { mapFormToDiscoverParams } from "./utils/discoverUtils";
import { TMDBDiscoverResponse, TMDBMovie } from "@/types/types";
import z from "zod";
import { FormSchema } from "./schemas/FormSchema";
import DiscoverMovieWelcomeCard from "./components/DiscoverMovieWelcomeCard";
import DiscoverMovieResultList from "./components/DiscoverMovieResultList";

export default function DiscoverMovieSection() {
    const {
        movieData,
        error,
        setError,
        endOfListMovieData,
        setMovieData,
        setEndOfListMovieData,
        movieStoreHydrated,
    } = useMovieStore();
    const { watchlistData } = useWatchlistStore();
    const { discardedMovieSet } = useDiscardedMovieStore();
    const { watchRegion } = useFormStore();
    const pageNumberRef = useRef(1);

    const { values, formHydrated } = useFormStore();

    // adding no-scroll to prevent scrollbars flickering in during movie card dismiss/save animations on desktop
    useEffect(() => {
        document.body.classList.add("no-scroll");

        return () => {
            document.body.classList.remove("no-scroll");
        };
    }, []);

    const filterOutWatchlistMovies = useCallback(
        (results: TMDBMovie[]) => {
            const watchlistIds = watchlistData?.map((data) => data.movie_id);
            return results.filter((result) => !watchlistIds?.includes(result.id));
        },
        [watchlistData]
    );

    const separateDiscardedMovies = useCallback(
        (results: TMDBMovie[]) => {
            setEndOfListMovieData((prev) =>
                prev?.concat(results.filter((result) => discardedMovieSet.has(result.id)))
            );
            return results.filter((result) => !discardedMovieSet.has(result.id));
        },
        [discardedMovieSet, setEndOfListMovieData]
    );

    const fetchAvaliableMovies = useCallback(
        async (data: z.infer<typeof FormSchema>) => {
            try {
                const params = mapFormToDiscoverParams(data, pageNumberRef.current, watchRegion);
                const res: TMDBDiscoverResponse = await discoverMovies(params);
                res.results = filterOutWatchlistMovies(res.results);
                res.results = separateDiscardedMovies(res.results);
                setError(null);
                setMovieData(res);
            } catch (err) {
                setError(err as Error);
            }
        },
        [setError, setMovieData, filterOutWatchlistMovies, separateDiscardedMovies, watchRegion]
    );

    // this gets called from discover movie form if we ever change form values.
    function fetchWithUpdatedFormValues(data: z.infer<typeof FormSchema>) {
        setEndOfListMovieData([]);
        pageNumberRef.current = 1;
        fetchAvaliableMovies(data);
    }

    //
    useEffect(() => {
        function fetchNextPageIfAvailable() {
            if (movieData?.results.length === 0) {
                if (movieData.page < movieData.total_pages) {
                    pageNumberRef.current = movieData.page + 1;
                    fetchAvaliableMovies(values);
                } else if (endOfListMovieData && endOfListMovieData.length) {
                    setMovieData((data) =>
                        data
                            ? {
                                  ...data,
                                  results: endOfListMovieData,
                              }
                            : data
                    );
                    setEndOfListMovieData([]);
                }
            }
        }
        fetchNextPageIfAvailable();
    }, [
        movieData,
        fetchAvaliableMovies,
        values,
        endOfListMovieData,
        setEndOfListMovieData,
        setMovieData,
    ]);

    function displayDiscoverMovieResults() {
        if (error) {
            return <DiscoverMovieErrorCard error={error} />;
        }
        if (movieStoreHydrated && movieData === null) {
            return <DiscoverMovieWelcomeCard />;
        }
        if (movieData?.total_results === 0) {
            return <DiscoverMovieNoResultsCard />;
        }
        if (movieData?.results.length === 0 && movieData.page === movieData.total_pages) {
            return <DiscoverMovieEndOfResultsCard />;
        }

        if (movieData?.results) {
            return <DiscoverMovieResultList />;
        }
    }

    return (
        <>
            {formHydrated ? (
                <DiscoverMovieForm fetchWithUpdatedFormValues={fetchWithUpdatedFormValues} />
            ) : null}

            <div className="grid h-[100dvh] w-[100vw] place-items-center md:h-[750px] md:w-[500px]">
                <Skeleton className="z-10 col-start-1 row-start-1 h-full w-full rounded-xl bg-[var(--border)]" />
                {displayDiscoverMovieResults()}
            </div>
        </>
    );
}
