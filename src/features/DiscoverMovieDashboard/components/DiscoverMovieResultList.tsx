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

    const currentMovieData = movieData?.results[movieData.results.length - 1] as TMDBMovie;

    async function handleButtonDiscard() {
        if (!currentMovieData) return;
        exitX.current = 25;
        setExitingMovie({
            id: currentMovieData.id,
            type: "discard",
        });
        setDiscardedMovieData((prev) =>
            !prev.includes(currentMovieData.id) ? prev.concat(currentMovieData.id) : prev
        );
    }

    async function handleButtonSave() {
        if (!currentMovieData) return;
        exitX.current = -25;
        setExitingMovie({
            id: currentMovieData.id,
            type: "save",
        });
        try {
            await addMovieToWatchlist(currentMovieData);
            toast(`${currentMovieData.title} added to watchlist.`, {
                icon: <ListCheckIcon />,
            });
        } catch (error) {
            // error feedback
            if (error instanceof Error) {
                toast(`Failed to add ${currentMovieData.title} to watchlist.`, {
                    icon: <CircleXIcon />,
                });
            }
        }
    }

    return (
        <>
            {movieData?.results.slice(-2).map((movieData) => (
                <DiscoverMovieResultCard
                    exitX={exitX}
                    exitingMovie={exitingMovie}
                    setExitingMovie={setExitingMovie}
                    key={movieData.id}
                    movieData={movieData}
                ></DiscoverMovieResultCard>
            ))}
            <Button
                onClick={() => handleButtonSave()}
                className="absolute top-1/2 -left-36 hidden h-32 w-32 -translate-y-1/2 rounded-full bg-[var(--border)] lg:flex"
            >
                <HeartIcon className="size-16 text-green-500" fill="currentColor" />
            </Button>
            <Button
                onClick={handleButtonDiscard}
                className="absolute top-1/2 -right-36 hidden h-32 w-32 -translate-y-1/2 rounded-full bg-[var(--border)] lg:flex"
            >
                <XIcon className="size-16 text-red-500" fill="currentColor" />
            </Button>
        </>
    );
}
