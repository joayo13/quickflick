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
    const supabaseSyncedRef = useRef(false);

    useEffect(() => {
        const interval = setInterval(async () => {
            const currentLength = discardedMovieData.length;

            if (currentLength > lastLengthRef.current && supabaseSyncedRef.current) {
                const stored = localStorage.getItem("discarded-movie-storage");
                if (stored) await updateDiscardedMovies(stored); // your update function

                lastLengthRef.current = currentLength;
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [discardedMovieData]);

    useEffect(() => {
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
    }, [setDiscardedMovieData]);

    return (
        <>
            <GlobalNav />
            {children}
        </>
    );
}
