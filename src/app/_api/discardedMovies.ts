"use server";

import { createClient } from "@/utils/supabase/server";

export async function getDiscardedMovies() {
    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!authData.user) throw new Error("Not logged in");
    if (authData.user.email === "guest@quickflick.com") {
        return { movies: [], userIsGuest: true };
    }

    const { data, error } = await supabase
        .from("discarded_movies")
        .select("movies")
        .eq("id", authData.user.id)
        .single();

    if (error) throw error;

    // normalize to numbers just in case
    const movies: number[] = (data?.movies ?? []).map((id: string) => Number(id));

    return { movies: movies, userIsGuest: false };
}

export async function updateDiscardedMovies(stored: string) {
    if (!stored) return; // nothing to update if not in localStorage

    let updatedMovies;
    try {
        updatedMovies = JSON.parse(stored);
        updatedMovies = updatedMovies.state.discardedMovieData;
    } catch (e) {
        console.error("Failed to parse discarded-movie-storage:", e);
        return;
    }

    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!authData.user) throw new Error("Not logged in");
    if (authData.user.email === "guest@quickflick.com") {
        return { success: true, userIsGuest: true };
    }

    const { data: updateData, error: updateError } = await supabase
        .from("discarded_movies")
        .update({ movies: updatedMovies })
        .eq("id", authData.user.id);

    if (updateError) {
        throw updateError;
    } else {
        return updateData;
    }
}
