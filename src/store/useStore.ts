import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TMDBDiscoverResponse, TMDBMovie, WatchlistData } from "@/types/types";

export interface MovieStore {
    movieData: TMDBDiscoverResponse | null;
    endOfListMovieData: TMDBMovie[] | undefined;
    error: Error | null;
    setMovieData: (
        updater:
            | TMDBDiscoverResponse
            | null
            | ((prev: TMDBDiscoverResponse | null) => TMDBDiscoverResponse | null)
    ) => void;
    setEndOfListMovieData: (
        updater:
            | TMDBMovie[]
            | undefined
            | ((prev: TMDBMovie[] | undefined) => TMDBMovie[] | undefined)
    ) => void;
    setError: (error: Error | null) => void;
    clearMovieData: () => void;
    movieStoreHydrated: boolean;
}

export const useMovieStore = create<MovieStore>()(
    persist(
        (set) => ({
            movieData: null,
            endOfListMovieData: undefined,
            error: null,
            movieStoreHydrated: false,
            setMovieData: (updater) =>
                set((state) => ({
                    movieData: typeof updater === "function" ? updater(state.movieData) : updater,
                })),
            setEndOfListMovieData: (updater) =>
                set((state) => ({
                    endOfListMovieData:
                        typeof updater === "function" ? updater(state.endOfListMovieData) : updater,
                })),
            setError: (error) => set({ error }),
            clearMovieData: () => set({ movieData: null, error: null }),
        }),
        {
            name: "movie-storage",
            onRehydrateStorage: () => (state) => {
                if (state) state.movieStoreHydrated = true;
            },
        }
    )
);

interface FormState {
    values: {
        watchProviders: string[];
        includeGenres: string[];
        excludeGenres: string[];
        releaseYear: [number, number];
        rating: [number, number];
    };
    watchRegion: string;
    formHydrated: boolean;
    setValues: (
        updater: FormState["values"] | ((prev: FormState["values"]) => FormState["values"])
    ) => void;
    setWatchRegion: (updater: string | ((prev: string) => string)) => void;
    resetValues: () => FormState["values"];
}

const defaultValues: FormState["values"] = {
    watchProviders: [],
    includeGenres: [],
    excludeGenres: [],
    releaseYear: [1950, 2025],
    rating: [0, 10],
};

export const useFormStore = create(
    persist<FormState>(
        (set) => ({
            values: {
                watchProviders: [],
                includeGenres: [],
                excludeGenres: [],
                releaseYear: [1950, 2025],
                rating: [1, 10],
            },
            watchRegion: "CA",
            formHydrated: false,
            setValues: (updater) =>
                set((state) => ({
                    values: typeof updater === "function" ? updater(state.values) : updater,
                })),
            setWatchRegion: (updater) =>
                set((state) => ({
                    watchRegion:
                        typeof updater === "function" ? updater(state.watchRegion) : updater,
                })),
            resetValues: () => {
                set({ values: defaultValues });
                return defaultValues;
            },
        }),
        {
            name: "form-storage",
            onRehydrateStorage: () => (state) => {
                if (state) state.formHydrated = true;
            },
        }
    )
);

interface WatchlistStore {
    watchlistData: WatchlistData[];
    watchlistStoreHydrated: boolean;
    setWatchlistData: (
        updater: WatchlistData[] | ((prev: WatchlistData[]) => WatchlistData[])
    ) => void;
    resetWatchlistData: () => WatchlistData[];
}

const defaultWatchlistData: WatchlistData[] = [];

export const useWatchlistStore = create(
    persist<WatchlistStore>(
        (set) => ({
            watchlistData: defaultWatchlistData,
            watchlistStoreHydrated: false,
            setWatchlistData: (updater) =>
                set((state) => ({
                    watchlistData:
                        typeof updater === "function" ? updater(state.watchlistData) : updater,
                })),
            resetWatchlistData: () => {
                set({ watchlistData: defaultWatchlistData });
                return defaultWatchlistData;
            },
        }),
        {
            name: "watchlist-storage",
            onRehydrateStorage: () => (state) => {
                if (state) state.watchlistStoreHydrated = true;
            },
        }
    )
);

interface DiscardedMovieStore {
    discardedMovieData: number[];
    discardedMovieSet: Set<number>;
    storeHydrated: boolean;
    setDiscardedMovieData: (updater: number[] | ((prev: number[]) => number[])) => void;
}

export const useDiscardedMovieStore = create(
    persist<DiscardedMovieStore>(
        (set) => ({
            discardedMovieData: [],
            discardedMovieSet: new Set(),
            storeHydrated: false,

            setDiscardedMovieData: (updater) =>
                set((state) => {
                    const newArray =
                        typeof updater === "function" ? updater(state.discardedMovieData) : updater;
                    return {
                        discardedMovieData: newArray,
                        discardedMovieSet: new Set(newArray),
                    };
                }),
        }),
        {
            name: "discarded-movie-storage",
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.storeHydrated = true;
                    state.discardedMovieSet = new Set(state.discardedMovieData);
                }
            },
        }
    )
);
