"use client";
import { useCallback, useEffect, useRef } from "react";
import { DiscoverMovieForm } from "./_components/DiscoverMovieForm";
import { discoverMovies } from "./_api/discoverMovies";
import { Skeleton } from "@/components/ui/skeleton";
import {
    useDiscardedMovieStore,
    useFormStore,
    useMovieStore,
    useWatchlistStore,
} from "@/store/useStore";
import { mapFormToDiscoverParams } from "./_utils/discoverUtils";
import { TMDBMovie } from "@/types/types";
import z from "zod";
import { FormSchema } from "./_schemas/FormSchema";
import { updateDiscardedMovies } from "./_api/updateDiscardedMovies";
import { getDiscardedMovies } from "./_api/getDiscardedMovies";
import { DisplayDiscoverMovieResponse } from "./_components/DisplayDiscoverMovieResponse";

export default function DiscoverMovieSection() {
    // discarded movie fetching supabase logic
    useDiscardedMovieSync();
    useNoScroll();
    const { movieData, error, movieStoreHydrated, fetchWithUpdatedFormValues } =
        useDiscoverMovies();
    // movie finder logic
    const formHydrated = useFormStore((state) => state.formHydrated);

    return (
        <>
            {formHydrated ? (
                <DiscoverMovieForm fetchWithUpdatedFormValues={fetchWithUpdatedFormValues} />
            ) : null}

            <div className="grid h-[100dvh] w-[100vw] place-items-center md:h-[750px] md:w-[500px]">
                <Skeleton className="z-10 col-start-1 row-start-1 h-full w-full rounded-xl bg-[var(--border)]" />
                <DisplayDiscoverMovieResponse
                    error={error}
                    movieData={movieData}
                    movieStoreHydrated={movieStoreHydrated}
                />
            </div>
        </>
    );
}

function useDiscardedMovieSync() {
    const { discardedMovieData, setDiscardedMovieData } = useDiscardedMovieStore();

    const supabaseSyncedRef = useRef(false);
    const lastLengthRef = useRef(0);

    useEffect(() => {
        const interval = setInterval(async () => {
            const currentLength = discardedMovieData.length;

            // we only update discarded movies in supabase if the intial supabase sync was successful
            // and the discarded array has been added to (has greater length)

            if (currentLength > lastLengthRef.current && supabaseSyncedRef.current) {
                const stored = localStorage.getItem("discarded-movie-storage");
                if (stored) await updateDiscardedMovies(stored); // your update function

                lastLengthRef.current = currentLength;
            }
        }, 10000);

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

        return () => clearInterval(interval);
    }, [discardedMovieData, setDiscardedMovieData]);
}

function useNoScroll() {
    useEffect(() => {
        document.body.classList.add("no-scroll");

        return () => {
            document.body.classList.remove("no-scroll");
        };
    }, []);
}

function useDiscoverMovies() {
    const {
        movieData,
        error,
        setError,
        endOfListMovieData,
        setMovieData,
        setEndOfListMovieData,
        movieStoreHydrated,
    } = useMovieStore();

    const watchlistData = useWatchlistStore((s) => s.watchlistData);
    const discardedMovieSet = useDiscardedMovieStore((s) => s.discardedMovieSet);
    const watchRegion = useFormStore((s) => s.watchRegion);
    const values = useFormStore((s) => s.values);

    const pageNumberRef = useRef(1);

    const filterOutWatchlistMovies = useCallback(
        (results: TMDBMovie[]) => {
            const ids = watchlistData?.map((w) => w.movie_id);
            return results.filter((r) => !ids?.includes(r.id));
        },
        [watchlistData]
    );

    const separateDiscardedMovies = useCallback(
        (results: TMDBMovie[]) => {
            setEndOfListMovieData((prev) =>
                prev?.concat(results.filter((r) => discardedMovieSet.has(r.id)))
            );
            return results.filter((r) => !discardedMovieSet.has(r.id));
        },
        [discardedMovieSet, setEndOfListMovieData]
    );

    const fetchMovies = useCallback(
        async (data: z.infer<typeof FormSchema>, reset = false) => {
            if (reset) {
                setEndOfListMovieData([]);
                pageNumberRef.current = 1;
            }

            try {
                const params = mapFormToDiscoverParams(data, pageNumberRef.current, watchRegion);
                const res = await discoverMovies(params);
                res.results = separateDiscardedMovies(filterOutWatchlistMovies(res.results));

                setError(null);
                setMovieData(res);
            } catch (err) {
                setError(err as Error);
            }
        },
        [
            filterOutWatchlistMovies,
            separateDiscardedMovies,
            setError,
            setMovieData,
            watchRegion,
            setEndOfListMovieData,
        ]
    );

    const fetchNextPageIfAvailable = useCallback(() => {
        if (!movieData) return;
        if (movieData.results.length === 0) {
            if (movieData.page < movieData.total_pages) {
                pageNumberRef.current = movieData.page + 1;
                fetchMovies(values);
            } else if (endOfListMovieData?.length) {
                setMovieData((data) => (data ? { ...data, results: endOfListMovieData } : data));
                setEndOfListMovieData([]);
            }
        }
    }, [movieData, fetchMovies, values, endOfListMovieData, setMovieData, setEndOfListMovieData]);

    useEffect(() => {
        fetchNextPageIfAvailable();
    }, [fetchNextPageIfAvailable]);

    function fetchWithUpdatedFormValues(data: z.infer<typeof FormSchema>) {
        setEndOfListMovieData([]);
        pageNumberRef.current = 1;
        fetchMovies(data);
    }

    return {
        movieData,
        error,
        movieStoreHydrated,
        fetchMovies,
        fetchWithUpdatedFormValues,
    };
}
