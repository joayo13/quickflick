import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TMDBDiscoverResponse } from "@/app/types";

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
    values: Record<string, string[]>;
    hydrated: boolean;
    setValues: (
        updater:
            | Record<string, string[]>
            | ((prev: Record<string, string[]>) => Record<string, string[]>)
    ) => void;
    resetValues: () => void;
}

export const useFormStore = create(
    persist<FormState>(
        (set) => ({
            values: { watchProviders: ["8"], genres: ["28"] },
            hydrated: false,
            setValues: (updater) =>
                set((state) => ({
                    values: typeof updater === "function" ? updater(state.values) : updater,
                })),
            resetValues: () => set({ values: { watchProviders: ["8"], genres: ["28"] } }),
        }),
        {
            name: "form-storage", // key in localStorage
            onRehydrateStorage: () => (state) => {
                if (state) state.hydrated = true;
            },
        }
    )
);
