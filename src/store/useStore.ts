import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TMDBDiscoverResponse, TMDBMovie, WatchlistData } from "@/types/types";

export interface MovieStore {
    movieData: TMDBDiscoverResponse | null;
    endOfListMovieData: TMDBMovie[] | undefined;
    setMovieData: (
        updater:
            | TMDBDiscoverResponse
            | undefined
            | ((prev: TMDBDiscoverResponse | null) => TMDBDiscoverResponse | null)
    ) => void;
    setEndOfListMovieData: (
        updater:
            | TMDBMovie[]
            | undefined
            | ((prev: TMDBMovie[] | undefined) => TMDBMovie[] | undefined)
    ) => void;
    clearMovieData: () => void;
    movieStoreHydrated: boolean;
}

export const useMovieStore = create<MovieStore>()(
    persist(
        (set) => ({
            movieData: null,
            endOfListMovieData: undefined,
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
            clearMovieData: () => set({ movieData: null }),
        }),
        {
            name: "movie-storage", // key in localStorage
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
    formHydrated: boolean;
    setValues: (
        updater: FormState["values"] | ((prev: FormState["values"]) => FormState["values"])
    ) => void;
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
            formHydrated: false,
            setValues: (updater) =>
                set((state) => ({
                    values: typeof updater === "function" ? updater(state.values) : updater,
                })),
            resetValues: () => {
                set({ values: defaultValues });
                return defaultValues;
            },
        }),
        {
            name: "form-storage", // key in localStorage
            onRehydrateStorage: () => (state) => {
                if (state) state.formHydrated = true;
            },
        }
    )
);

interface WatchlistStore {
    watchlistData: WatchlistData[] | null;
    storeHydrated: boolean;
    setWatchlistData: (
        updater: WatchlistData[] | null | ((prev: WatchlistData[] | null) => WatchlistData[] | null)
    ) => void;
}

const defaultWatchlistData = null;

export const useWatchlistStore = create(
    persist<WatchlistStore>(
        (set) => ({
            watchlistData: defaultWatchlistData,
            storeHydrated: false,
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
            name: "watchlist-storage", // key in localStorage
            onRehydrateStorage: () => (state) => {
                if (state) state.storeHydrated = true;
            },
        }
    )
);

interface DiscardedMovieStore {
    discardedMovieData: number[];
    storeHydrated: boolean;
    setDiscardedMovieData: (updater: number[] | ((prev: number[]) => number[])) => void;
}

const defaultDiscardedMovies: number[] = [];

export const useDiscardedMovieStore = create(
    persist<DiscardedMovieStore>(
        (set) => ({
            discardedMovieData: defaultDiscardedMovies,
            storeHydrated: false,

            setDiscardedMovieData: (updater) =>
                set((state) => ({
                    discardedMovieData:
                        typeof updater === "function" ? updater(state.discardedMovieData) : updater,
                })),
        }),
        {
            name: "discarded-movie-storage", // key in localStorage
            onRehydrateStorage: () => (state) => {
                if (state) state.storeHydrated = true;
            },
        }
    )
);
