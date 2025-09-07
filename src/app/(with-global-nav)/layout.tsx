"use client";
import { GlobalNav } from "@/components/GlobalNav";
import { getDiscardedMovies } from "@/features/DiscoverMovieDashboard/api/getDiscardedMovies";
import { updateDiscardedMovies } from "@/features/DiscoverMovieDashboard/api/updateDiscardedMovies";
import { useDiscardedMovieStore } from "@/store/useStore";
import { useEffect, useRef } from "react";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { discardedMovieData, setDiscardedMovieData } = useDiscardedMovieStore();
    const lastLengthRef = useRef(0);

    useEffect(() => {
        const interval = setInterval(async () => {
            const currentLength = discardedMovieData.length;

            if (currentLength > lastLengthRef.current) {
                const stored = localStorage.getItem("discarded-movie-storage");
                if (stored) await updateDiscardedMovies(stored); // your update function
                lastLengthRef.current = currentLength;
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [discardedMovieData]);

    useEffect(() => {
        async function syncSupabaseToLocalStorage() {
            const discardedMovies = await getDiscardedMovies();
            setDiscardedMovieData(discardedMovies);
        }
        syncSupabaseToLocalStorage();
    }, [setDiscardedMovieData]);

    return (
        <>
            <GlobalNav />
            {children}
        </>
    );
}
