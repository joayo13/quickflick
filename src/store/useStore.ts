import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TMDBDiscoverResponse, WatchlistData } from "@/types/types";

interface MovieStore {
    movieData: TMDBDiscoverResponse | null;
    setMovieData: (
        updater:
            | TMDBDiscoverResponse
            | null
            | ((prev: TMDBDiscoverResponse | null) => TMDBDiscoverResponse | null)
    ) => void;
    clearMovieData: () => void;
}

export const useMovieStore = create<MovieStore>((set) => ({
    movieData: null,
    setMovieData: (updater) =>
        set((state) => ({
            movieData: typeof updater === "function" ? updater(state.movieData) : updater,
        })),
    clearMovieData: () => set({ movieData: null }),
}));

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
                watchProviders: ["8"],
                includeGenres: ["28"],
                excludeGenres: [],
                releaseYear: [1950, 2025],
                rating: [6.5, 10],
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
