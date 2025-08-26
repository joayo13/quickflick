import { create } from "zustand";
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
