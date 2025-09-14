"use server";
import { createClient } from "@/utils/supabase/server";
import type { TMDBMovie } from "@/types/types";

export async function addMovieToWatchlist(movie: TMDBMovie) {
    const movieRow = {
        id: movie.id,
        title: movie.title,
        original_title: movie.original_title,
        overview: movie.overview,
        release_date: movie.release_date ? new Date(movie.release_date) : null,
        vote_average: parseFloat(movie.vote_average.toFixed(2)),
        vote_count: movie.vote_count,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        genre_ids: movie.genre_ids, // stays array
        original_language: movie.original_language || null,
    };

    const supabase = await createClient();

    // 1. Get current user
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!authData.user) throw new Error("Not logged in");
    if (authData.user.email === "guest@quickflick.com") {
        return { success: true, type: "guest" };
    }
    const userId = authData.user.id;

    // 2. Ensure movie exists in movies table
    const { data: existingMovie, error: movieSelectError } = await supabase
        .from("movies")
        .select("*")
        .eq("id", movie.id)
        .single();

    if (movieSelectError && movieSelectError.code !== "PGRST116") {
        // PGRST116 = no rows found (normal case for insert)
        throw movieSelectError;
    }

    if (!existingMovie) {
        const { error: movieInsertError } = await supabase.from("movies").insert([movieRow]);

        if (movieInsertError) throw movieInsertError;
    }

    // 3. Add to watchlist with upsert
    const { error: watchlistError } = await supabase.from("watchlist").upsert(
        {
            user_id: userId,
            movie_id: movie.id,
            watched: false,
        },
        { onConflict: "user_id, movie_id" }
    );

    if (watchlistError) throw watchlistError;

    return { success: true, type: "user" };
}
