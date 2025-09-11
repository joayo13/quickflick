"use client";
import { useDiscardedMovieStore, useMovieStore } from "@/store/useStore";
import React, { useRef, useState } from "react";
import DiscoverMovieResultCard from "./DiscoverMovieResultCard";
import { CircleXIcon, HeartIcon, ListCheckIcon, XIcon } from "lucide-react";
import { addMovieToWatchlist } from "../api/addMovieToWatchlist";
import { TMDBMovie } from "@/types/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function DiscoverMovieResultList() {
    const { movieData } = useMovieStore();
    const { setDiscardedMovieData } = useDiscardedMovieStore();
    const [exitingMovie, setExitingMovie] = useState<{
        id: number;
        type: "save" | "discard";
    } | null>(null);
    const exitX = useRef(0);

    // select the topmost card data
    const currentMovieData = movieData?.results[movieData.results.length - 1] as TMDBMovie;

    async function handleMovieCardAction(x: number, movieData: TMDBMovie) {
        // this handles both swipe actions and button save/dismiss actions
        exitX.current = x;
        if (x >= 40) {
            // discard
            setExitingMovie({ id: movieData.id, type: "discard" });
            setDiscardedMovieData((prev) =>
                !prev.includes(movieData.id) ? prev.concat(movieData.id) : prev
            );
        } else if (x <= -40) {
            // save
            setExitingMovie({ id: movieData.id, type: "save" });
            try {
                await addMovieToWatchlist(movieData);
                toast(`${movieData.title} added to watchlist.`, { icon: <ListCheckIcon /> });
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

    return (
        <>
            {movieData?.results.slice(-2).map((movieData, index) => (
                <DiscoverMovieResultCard
                    ariaHidden={index === 0}
                    handleMovieCardAction={handleMovieCardAction}
                    exitX={exitX}
                    exitingMovie={exitingMovie}
                    setExitingMovie={setExitingMovie}
                    key={movieData.id}
                    movieData={movieData}
                ></DiscoverMovieResultCard>
            ))}
            <Button
                aria-label="save movie"
                // this onclick manually applies the values of a swipe left
                onClick={() => handleMovieCardAction(-40, currentMovieData)}
                className="absolute top-1/2 -left-36 hidden h-32 w-32 -translate-y-1/2 rounded-full bg-[var(--border)] lg:flex"
            >
                <HeartIcon className="size-16 text-green-500" fill="currentColor" />
            </Button>
            <Button
                aria-label="discard movie"
                onClick={() => handleMovieCardAction(40, currentMovieData)}
                className="absolute top-1/2 -right-36 hidden h-32 w-32 -translate-y-1/2 rounded-full bg-[var(--border)] lg:flex"
            >
                <XIcon className="size-16 text-red-500" fill="currentColor" />
            </Button>
        </>
    );
}
