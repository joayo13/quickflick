"use client";
import { useDiscardedMovieStore, useMovieStore, useWatchlistStore } from "@/store/useStore";
import React, { useRef, useState } from "react";
import DiscoverMovieResultCard from "./DiscoverMovieResultCard";
import { CircleXIcon, FilmIcon, HeartIcon, HistoryIcon, ListCheckIcon, XIcon } from "lucide-react";
import { addMovieToWatchlist } from "../watchlist/_api/watchlist";
import { TMDBMovie, TrailerLink } from "@/types/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getMovieVideos } from "../_api/movieVideosApi";

export default function DiscoverMovieResultList() {
    const movieData = useMovieStore((state) => state.movieData);

    const [exitingMovie, setExitingMovie] = useState<{
        id: number;
        type: "save" | "discard";
    } | null>(null);

    const { movieTrailerData, setMovieTrailerData, handleTrailerToggle } = useTrailerToggle();

    const { addMovieToPrevMovies, pushPrevMovieIntoMovieData } = usePrevMovies({
        setMovieTrailerData,
        setExitingMovie,
    });

    const { exitX, handleMovieCardAction } = useMovieCardAction({
        setMovieTrailerData,
        setExitingMovie,
        addMovieToPrevMovies,
    });

    // select the topmost card data
    const currentMovieData = movieData?.results[movieData.results.length - 1] as TMDBMovie;

    return (
        <>
            {movieData?.results.slice(-2).map((movieData, index) => (
                <DiscoverMovieResultCard
                    ariaHidden={index === 0}
                    handleMovieCardAction={handleMovieCardAction}
                    exitX={exitX}
                    exitingMovie={exitingMovie}
                    setExitingMovie={setExitingMovie}
                    movieTrailerData={movieTrailerData}
                    key={movieData.id}
                    movieData={movieData}
                ></DiscoverMovieResultCard>
            ))}
            <Button
                aria-label="save movie"
                // this onclick manually applies the values of a swipe left
                onClick={() => handleMovieCardAction(-30, currentMovieData)}
                className="absolute top-1/2 -left-36 hidden h-32 w-32 -translate-y-1/2 rounded-full bg-[var(--border)] lg:flex"
            >
                <HeartIcon className="size-16 text-green-500" fill="currentColor" />
            </Button>
            <Button
                aria-label="discard movie"
                onClick={() => handleMovieCardAction(30, currentMovieData)}
                className="absolute top-1/2 -right-36 hidden h-32 w-32 -translate-y-1/2 rounded-full bg-[var(--border)] lg:flex"
            >
                <XIcon className="size-16 text-red-500" fill="currentColor" />
            </Button>
            <Button
                aria-label="go back to previous movie"
                className="absolute top-12 right-2 z-30 h-8 w-8 rounded-full"
                variant="outline"
                onClick={pushPrevMovieIntoMovieData}
            >
                <HistoryIcon />
            </Button>
            <Button
                aria-label="watch movie trailer"
                className="absolute top-22 right-2 z-30 h-8 w-8 rounded-full"
                variant={movieTrailerData.trailerShowing ? "default" : "outline"}
                onClick={() => handleTrailerToggle(currentMovieData)}
            >
                <FilmIcon />
            </Button>
        </>
    );
}

// custom hooks

function useMovieCardAction({
    setMovieTrailerData,
    setExitingMovie,
    addMovieToPrevMovies,
}: {
    setMovieTrailerData: React.Dispatch<
        React.SetStateAction<{
            id: number;
            trailerShowing: boolean;
            trailerLink: TrailerLink;
        }>
    >;
    setExitingMovie: React.Dispatch<
        React.SetStateAction<{
            id: number;
            type: "save" | "discard";
        } | null>
    >;
    addMovieToPrevMovies: (movieData: TMDBMovie) => void;
}) {
    const setDiscardedMovieData = useDiscardedMovieStore((state) => state.setDiscardedMovieData);
    const watchlistData = useWatchlistStore((state) => state.watchlistData);
    const setWatchlistData = useWatchlistStore((state) => state.setWatchlistData);

    const exitX = useRef(0);

    async function handleMovieCardAction(x: number, movieData: TMDBMovie) {
        // this handles both swipe actions and button save/dismiss actions
        exitX.current = x;
        if (x >= 30) {
            // discard
            setMovieTrailerData({ id: 0, trailerShowing: false, trailerLink: { key: "", id: "" } });
            setExitingMovie({ id: movieData.id, type: "discard" });
            setDiscardedMovieData((prev) =>
                !prev.includes(movieData.id) ? prev.concat(movieData.id) : prev
            );
            addMovieToPrevMovies(movieData);
        } else if (x <= -30) {
            // save
            setMovieTrailerData({ id: 0, trailerShowing: false, trailerLink: { key: "", id: "" } });
            setExitingMovie({ id: movieData.id, type: "save" });
            try {
                const { userIsGuest } = await addMovieToWatchlist(movieData);
                if (userIsGuest === true) {
                    // if it's a guest directly return early from addMovieToWatchlist and set watchlist data locally instead
                    if (watchlistData.some((data) => data.id === movieData.id)) {
                        toast(`${movieData.title} already in watchlist.`, {
                            icon: <CircleXIcon />,
                        });
                        addMovieToPrevMovies(movieData);
                        return;
                    }
                    setWatchlistData((prev) =>
                        prev
                            ? prev.concat({
                                  id: movieData.id,
                                  movie_id: movieData.id,
                                  movies: movieData,
                                  user_id: "guest",
                                  watched: false,
                              })
                            : prev
                    );
                }
                toast(`${movieData.title} added to watchlist.`, { icon: <ListCheckIcon /> });
                addMovieToPrevMovies(movieData);
            } catch (error) {
                // error feedback
                if (error instanceof Error) {
                    toast(`Failed to add ${movieData.title} to watchlist.`, {
                        icon: <CircleXIcon />,
                    });
                }
            }
        }
    }
    return {
        exitX,
        handleMovieCardAction,
    };
}

function usePrevMovies({
    setMovieTrailerData,
    setExitingMovie,
}: {
    setMovieTrailerData: React.Dispatch<
        React.SetStateAction<{
            id: number;
            trailerShowing: boolean;
            trailerLink: TrailerLink;
        }>
    >;
    setExitingMovie: React.Dispatch<
        React.SetStateAction<{
            id: number;
            type: "save" | "discard";
        } | null>
    >;
}) {
    const [prevMovies, setPrevMovies] = useState<TMDBMovie[]>([]);
    const setMovieData = useMovieStore((state) => state.setMovieData);

    function pushPrevMovieIntoMovieData() {
        if (prevMovies.length) {
            setMovieData((prev) =>
                prev
                    ? { ...prev, results: prev.results.concat(prevMovies[prevMovies.length - 1]) }
                    : prev
            );
            setPrevMovies((prev) => prev.slice(0, -1));
            setMovieTrailerData({ id: 0, trailerShowing: false, trailerLink: { key: "", id: "" } });
            setExitingMovie(null);
        } else {
            toast("Can't go back any further.", {
                icon: <CircleXIcon />,
            });
        }
    }

    function addMovieToPrevMovies(movieData: TMDBMovie) {
        setPrevMovies((prev) => prev.concat(movieData));
    }
    return { pushPrevMovieIntoMovieData, addMovieToPrevMovies };
}

function useTrailerToggle() {
    const [movieTrailerData, setMovieTrailerData] = useState<{
        id: number;
        trailerShowing: boolean;
        trailerLink: TrailerLink;
    }>({ id: 0, trailerShowing: false, trailerLink: { key: "", id: "" } });

    async function handleTrailerToggle(movieData: TMDBMovie) {
        if (!movieTrailerData.trailerShowing) {
            if (!movieTrailerData.trailerLink.id) {
                const data = await getMovieVideos(movieData.id);
                setMovieTrailerData((prev) =>
                    prev
                        ? {
                              ...prev,
                              trailerLink: { key: data.key, id: data.id },
                          }
                        : prev
                );
            }
            setMovieTrailerData((prev) =>
                prev
                    ? {
                          ...prev,
                          id: movieData.id,
                          trailerShowing: true,
                      }
                    : prev
            );
        } else {
            setMovieTrailerData((prev) => (prev ? { ...prev, trailerShowing: false } : prev));
        }
    }
    return { movieTrailerData, setMovieTrailerData, handleTrailerToggle };
}
