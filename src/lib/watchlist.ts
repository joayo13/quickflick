"use server";
import { createClient } from "@/utils/supabase/server";
import type { TMDBMovie } from "@/app/types";

export async function addMovieToWatchlist(movie: TMDBMovie) {
    const movieRow = {
        id: movie.id,
        title: movie.title,
        original_title: movie.original_title,
        overview: movie.overview,
        release_date: new Date(movie.release_date) || null,
        vote_average: parseInt(movie.vote_average.toFixed(2)),
        vote_count: movie.vote_count,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        genre_ids: movie.genre_ids, // convert numbers to strings
        original_language: movie.original_language || null,
    };

    const supabase = await createClient();
    // 1. Get current user
    const { data, error } = await supabase.auth.getUser();

    if (error) {
        console.log(error);
    }

    if (!data.user) throw new Error("Not logged in");

    const userId = data.user.id;

    // 2. Ensure movie exists in movies table
    const { data: existingMovie } = await supabase
        .from("movies")
        .select("*")
        .eq("id", movie.id)
        .single();

    if (!existingMovie) {
        await supabase.from("movies").insert([movieRow]);
    }

    // 3. Add to watchlist with upsert
    await supabase
        .from("watchlist")
        .insert({ user_id: userId, movie_id: movie.id, watched: false });
}
