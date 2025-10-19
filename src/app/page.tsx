"use client";
import { useCallback, useEffect, useRef } from "react";
import { DiscoverMovieForm } from "./_components/DiscoverMovieForm";
import DiscoverMovieErrorCard from "./_components/DiscoverMovieErrorCard";
import DiscoverMovieNoResultsCard from "./_components/DiscoverMovieNoResultsCard";
import DiscoverMovieEndOfResultsCard from "./_components/DiscoverMovieEndOfResultsCard";
import { discoverMovies } from "./_api/discoverMovies";
import { Skeleton } from "@/components/ui/skeleton";
import {
    useDiscardedMovieStore,
    useFormStore,
    useMovieStore,
    useWatchlistStore,
} from "@/store/useStore";
import { mapFormToDiscoverParams } from "./_utils/discoverUtils";
import { TMDBDiscoverResponse, TMDBMovie } from "@/types/types";
import z from "zod";
import { FormSchema } from "./_schemas/FormSchema";
import DiscoverMovieWelcomeCard from "./_components/DiscoverMovieWelcomeCard";
import DiscoverMovieResultList from "./_components/DiscoverMovieResultList";
import { updateDiscardedMovies } from "./_api/updateDiscardedMovies";
import { getDiscardedMovies } from "./_api/getDiscardedMovies";

export default function DiscoverMovieSection() {
    // discarded movie fetching supabase logic
    const { discardedMovieData, setDiscardedMovieData } = useDiscardedMovieStore();
    const lastLengthRef = useRef(0);
    const supabaseSyncedRef = useRef(false);

    useEffect(() => {
        const interval = setInterval(async () => {
            const currentLength = discardedMovieData.length;

            // we only update discarded movies in supabase if the intial supabase sync was successful
            if (currentLength > lastLengthRef.current && supabaseSyncedRef.current) {
                const stored = localStorage.getItem("discarded-movie-storage");
                if (stored) await updateDiscardedMovies(stored); // your update function

                lastLengthRef.current = currentLength;
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [discardedMovieData]);

    useEffect(() => {
        async function syncSupabaseToLocalStorage() {
            const { movies, userIsGuest } = await getDiscardedMovies();
            if (userIsGuest === true) {
                // we return early out of the getDiscardedMovies function and just return if it's a guest, since they already will have local data set
                return;
            }
            setDiscardedMovieData(movies);
            supabaseSyncedRef.current = true;
        }

        syncSupabaseToLocalStorage();
    }, [setDiscardedMovieData]);

    // movie finder logic
    const {
        movieData,
        error,
        setError,
        endOfListMovieData,
        setMovieData,
        setEndOfListMovieData,
        movieStoreHydrated,
    } = useMovieStore();

    const watchlistData = useWatchlistStore((state) => state.watchlistData);
    const discardedMovieSet = useDiscardedMovieStore((state) => state.discardedMovieSet);
    const watchRegion = useFormStore((state) => state.watchRegion);
    const values = useFormStore((state) => state.values);
    const formHydrated = useFormStore((state) => state.formHydrated);
    const pageNumberRef = useRef(1);

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
